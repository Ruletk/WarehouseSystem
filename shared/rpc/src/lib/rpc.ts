// rabbitmq-client.ts
import { getLogger } from '@warehouse/logging';
import * as amqp from 'amqplib';
import { EventEmitter } from 'events';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';

const logger = getLogger('rabbitmq-client');

interface RabbitMQConfig {
  url: string | URL;
  reconnectInterval?: number;
  maxRetries?: number;
}

interface PublishOptions {
  exchange: string;
  routingKey: string;
  headers?: Record<string, unknown>;
  persistent?: boolean;
}

interface SubscribeOptions {
  exchange: string;
  queue: string;
  routingKey: string;
  exchangeType?: 'direct' | 'topic' | 'fanout' | 'headers';
  durable?: boolean;
  prefetch?: number;
}

interface RpcOptions {
  timeout?: number;
}

/**
 * RabbitMQClient is a class that provides an interface for connecting to a RabbitMQ server,
 * publishing messages, subscribing to queues, and handling RPC requests and responses.
 * It extends EventEmitter to allow for event-driven programming.
 *
 * @class RabbitMQClient
 * @extends {EventEmitter}
 */
export class RabbitMQClient extends EventEmitter {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private config: RabbitMQConfig;
  private isConnecting = false;
  private retryCount = 0;
  private rpcCallbacks = new Map<
    string,
    (msg: Record<string, unknown>) => void
  >();
  private rpcReplyQueue: string | null = null; // Храним имя очереди для RPC-ответов

  constructor(config: RabbitMQConfig) {
    super();
    this.config = {
      reconnectInterval: 5000,
      maxRetries: 10,
      ...config,
    };
  }

  /**
   * Initializes the RabbitMQ client by establishing a connection and setting up the RPC response queue.
   * Logs the initialization process.
   * 
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  public async init(): Promise<void> {
    logger.info('Initializing RabbitMQ client');
    await this.connect();
    if (this.channel) await this.setupRpcResponseQueue();
    logger.info('RabbitMQ client initialized successfully');
  }

  /**
   * Establishes a connection to RabbitMQ if not already connected.
   * 
   * This method attempts to connect to RabbitMQ using the provided configuration URL.
   * It sets up event listeners for connection close and error events, and creates a channel
   * for communication. If the connection is successful, it emits a 'connected' event and logs
   * the success. In case of an error, it logs the failure and handles the connection error.
   * 
   * @returns {Promise<void>} A promise that resolves when the connection is successfully established.
   * @throws {Error} If there is an error during the connection process.
   */
  private async connect(): Promise<void> {
    if (this.connection || this.isConnecting) return;
    this.isConnecting = true;

    logger.info('Connecting to RabbitMQ...');

    try {
      this.connection = await amqp.connect(this.config.url as string);
      this.connection.on('close', this.handleConnectionClose.bind(this));
      this.connection.on('error', this.handleConnectionError.bind(this));

      this.channel = await this.connection.createChannel();
      this.channel.on('error', this.handleConnectionError.bind(this));

      this.retryCount = 0;
      this.emit('connected');
      this.isConnecting = false;
      logger.info('Successfully connected to RabbitMQ');
    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to connect to RabbitMQ:', error);
      this.handleConnectionError(error as Error);
    }
  }

  
  /**
   * Sets up the RPC response queue for handling responses from RPC calls.
   * 
   * This method asserts a new exclusive queue for receiving RPC responses and
   * sets up a consumer to handle incoming messages. Each message is expected to
   * have a correlation ID that matches a callback stored in `rpcCallbacks`.
   * 
   * If the message content is valid JSON, the corresponding callback is invoked
   * with the parsed data. If the JSON parsing fails, the callback is invoked with
   * an error object. After handling the message, it acknowledges the message to
   * the channel.
   * 
   * @throws {Error} If the channel is not available.
   * 
   * @returns {Promise<void>} A promise that resolves when the setup is complete.
   */
  private async setupRpcResponseQueue(): Promise<void> {
    if (!this.channel) throw new Error('Channel not available');

    logger.info('Setting up RPC response queue');
    const { queue } = await this.channel.assertQueue('', { exclusive: true });
    this.rpcReplyQueue = queue;
    logger.info('RPC response queue created', { queue });

    await this.channel.consume(queue, (msg) => {
      if (!msg) return;
      const correlationId = msg.properties.correlationId;
      logger.debug('Received RPC response', { correlationId });
      const handler = this.rpcCallbacks.get(correlationId);
      if (handler) {
        try {
          const parsed = JSON.parse(msg.content.toString());
          handler(parsed);
        } catch (err) {
          logger.error('Failed to parse JSON response:', err, {
            correlationId,
          });
          handler({ error: 'Invalid JSON response' });
        }
        this.rpcCallbacks.delete(correlationId);
      }
      this.channel?.ack(msg);
    });
  }

  /**
   * Attempts to reconnect to RabbitMQ with a delay specified in the configuration.
   * If the maximum number of retries is reached, an error is logged and emitted.
   * 
   * @returns {Promise<void>} A promise that resolves when the reconnection attempt is complete.
   * @throws {Error} If the maximum number of reconnection attempts is reached.
   */
  private async reconnect(): Promise<void> {
    if (this.retryCount >= (this.config.maxRetries || 10)) {
      logger.error('Max reconnection attempts reached');
      this.emit('error', new Error('Max reconnect attempts reached'));
      return;
    }

    this.retryCount++;
    logger.info(
      'Reconnecting to RabbitMQ in',
      this.config.reconnectInterval,
      'ms'
    );

    await new Promise((resolve) =>
      setTimeout(resolve, this.config.reconnectInterval ?? 5000)
    );
    await this.connect();
    if (this.channel) {
      logger.info('Reconnected to RabbitMQ');
      await this.setupRpcResponseQueue();
    }
  }

  /**
   * Handles the closure of the RabbitMQ connection.
   * 
   * This method performs the following actions:
   * - Logs a warning message indicating that the RabbitMQ connection has closed.
   * - Emits a 'disconnected' event.
   * - Sets the connection, channel, and rpcReplyQueue properties to null.
   * - Attempts to reconnect by calling the `reconnect` method.
   * 
   * @private
   */
  private handleConnectionClose(): void {
    logger.warn('RabbitMQ connection closed');
    this.emit('disconnected');
    this.connection = null;
    this.channel = null;
    this.rpcReplyQueue = null;
    this.reconnect();
  }

  /**
   * Handles connection errors by logging the error, emitting an 'error' event,
   * and attempting to reconnect to RabbitMQ.
   *
   * @param error - The error object representing the connection error.
   */
  private handleConnectionError(error: Error): void {
    logger.error('RabbitMQ connection error:', error);
    this.emit('error', error);
    this.reconnect();
  }

  public async publish(
    message: object,
    options: PublishOptions
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Channel not available');
    }

    const { exchange, routingKey, headers, persistent = true } = options;
    logger.debug('Publishing message', {
      exchange,
      routingKey,
      // Note: headers might contain sensitive data
      headerKeys: headers ? Object.keys(headers) : undefined,
    });

    const buffer = Buffer.from(JSON.stringify(message));

    const result = await this.channel.publish(exchange, routingKey, buffer, {
      persistent,
      headers,
    });

    if (result) {
      logger.debug('Message published successfully');
    } else {
      logger.warn('Message publish returned false', { exchange, routingKey });
    }

    return result;
  }

  /**
   * Subscribes to a message queue with the given options and handler.
   * 
   * @template T - The type of the message content.
   * @param {SubscribeOptions} options - The subscription options.
   * @param {(msg: T) => Promise<void>} handler - The handler function to process received messages.
   * @returns {Promise<void>} A promise that resolves when the subscription is set up.
   * @throws {Error} If the channel is not available.
   * 
   * @example
   * ```typescript
   * const options: SubscribeOptions = {
   *   exchange: 'my_exchange',
   *   queue: 'my_queue',
   *   routingKey: 'my_routing_key',
   * };
   * 
   * await rpc.subscribe(options, async (msg) => {
   *   console.log('Received message:', msg);
   * });
   * ```
   */
  public async subscribe<T>(
    options: SubscribeOptions,
    handler: (msg: T) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not available');
    }

    const {
      exchange,
      exchangeType = 'direct',
      queue,
      routingKey,
      durable = true,
      prefetch = 10,
    } = options;

    logger.info('Setting up subscription', {
      exchange,
      queue,
      routingKey,
      exchangeType,
    });

    await this.channel.assertExchange(exchange, exchangeType, { durable });
    await this.channel.assertQueue(queue, { durable });
    await this.channel.bindQueue(queue, exchange, routingKey);
    await this.channel.prefetch(prefetch);

    logger.info('Subscription setup complete, starting consumption', { queue });

    this.channel.consume(queue, async (message) => {
      if (!message) return;

      logger.debug('Received message', {
        queue,
        messageId: message.properties.messageId,
      });

      try {
        const content = JSON.parse(message.content.toString()) as T;
        await handler(content);
        this.channel?.ack(message);
        logger.debug('Message processed successfully', {
          queue,
          messageId: message.properties.messageId,
        });
      } catch (error) {
        logger.error('Error processing message:', error, {
          queue,
          exchange: options.exchange,
          routingKey: options.routingKey,
        });
        this.channel?.nack(message, false, true);
        this.emit('error', error);
      }
    });
  }

  
  /**
   * Sends an RPC request to the specified queue with the given message and options.
   * 
   * @template T - The expected response type.
   * @param {string} queue - The name of the queue to send the request to.
   * @param {object} message - The message to send in the request.
   * @param {RpcOptions} [options={}] - Optional settings for the RPC request.
   * @param {number} [options.timeout=5000] - The timeout duration in milliseconds for the RPC request.
   * @returns {Promise<T>} - A promise that resolves with the response of type T.
   * @throws {Error} - Throws an error if the channel or RPC reply queue is not available, or if the request times out.
   */
  public async rpcRequest<T>(
    queue: string,
    message: object,
    options: RpcOptions = {}
  ): Promise<T> {
    if (!this.channel || !this.rpcReplyQueue) {
      const error = new Error('Channel or RPC reply queue not available');
      logger.error('RPC request failed:', error);
      throw error;
    }

    const correlationId = uuidv4();
    logger.debug('Sending RPC request', {
      queue,
      correlationId,
      timeout: options.timeout || 5000,
    });
    const timeout = options.timeout || 5000;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.rpcCallbacks.delete(correlationId);
        reject(new Error('RPC request timed out'));
      }, timeout);

      this.rpcCallbacks.set(correlationId, (response) => {
        clearTimeout(timer);
        resolve(response as T);
      });

      try {
        this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
          correlationId,
          replyTo: this.rpcReplyQueue as string | undefined,
        });
        logger.debug('RPC request sent successfully', { correlationId });
      } catch (error) {
        logger.error('Failed to send RPC request:', error, { queue });
        clearTimeout(timer);
        this.rpcCallbacks.delete(correlationId);
        reject(error);
      }
    });
  }

  
  /**
   * Creates an RPC worker that listens to a specified queue and processes messages using the provided handler.
   *
   * @param queueName - The name of the queue to listen to.
   * @param handler - A function that processes incoming messages and returns a promise with the result.
   * @returns A promise that resolves when the RPC worker is successfully created.
   * @throws Will throw an error if the channel is not available.
   *
   * @example
   * ```typescript
   * await createRpcWorker('myQueue', async (msg) => {
   *   // Process the message
   *   return { success: true };
   * });
   * ```
   */
  public async createRpcWorker(
    queueName: string,
    handler: (msg: Record<string, unknown>) => Promise<unknown>
  ): Promise<void> {
    if (!this.channel) {
      const error = new Error('Channel not available');
      logger.error('Failed to create RPC worker:', error);
      throw error;
    }

    logger.info('Creating RPC worker', { queueName });
    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.prefetch(1);

    this.channel.consume(queueName, async (msg) => {
      if (!msg) return;

      const correlationId = msg.properties.correlationId;
      logger.debug('RPC worker received request', {
        queueName,
        correlationId,
      });

      try {
        const message = JSON.parse(msg.content.toString());
        const result = await handler(message);

        if (msg.properties.replyTo && msg.properties.correlationId) {
          this.channel?.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(result)),
            { correlationId: msg.properties.correlationId }
          );
        }
        this.channel?.ack(msg);
        logger.debug('RPC worker processed request', {
          queueName,
          correlationId,
        });
      } catch (error) {
        logger.error('RPC worker error processing message:', error, {
          queueName,
        });
        this.channel?.nack(msg);
      }
    });
  }

  /**
   * Closes the RabbitMQ client connection.
   * 
   * This method will close the channel and connection if they are open,
   * emit a 'closed' event, and log the closure process.
   * 
   * @returns {Promise<void>} A promise that resolves when the connection is closed.
   */
  public async close(): Promise<void> {
    logger.info('Closing RabbitMQ client connection');
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.emit('closed');
    logger.info('RabbitMQ client connection closed');
  }
}
