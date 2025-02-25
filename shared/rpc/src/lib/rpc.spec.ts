import * as amqp from 'amqplib';
import { EventEmitter } from 'events';
import { applyOptions } from '@warehouse/logging';

jest.mock('amqplib');
jest.mock('timers/promises');

const mockSetTimeout = setTimeout as jest.MockedFunction<typeof setTimeout>;

applyOptions({ level: 'critical', label: 'rpc_test' }); // Disable logging

import { RabbitMQClient } from './rpc';

describe('RabbitMQClient Unit Tests', () => {
  let client: RabbitMQClient;
  let mockConnection: amqp.Connection;
  let mockChannel: amqp.Channel;
  let connectionEmitter: EventEmitter;
  let channelEmitter: EventEmitter;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    connectionEmitter = new EventEmitter();
    channelEmitter = new EventEmitter();

    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({ queue: 'reply-queue' }),
      consume: jest.fn(),
      publish: jest.fn().mockReturnValue(true),
      close: jest.fn(),
      on: channelEmitter.on.bind(channelEmitter),
    } as unknown as amqp.Channel;

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
      on: connectionEmitter.on.bind(connectionEmitter),
    } as unknown as amqp.Connection;

    (amqp.connect as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockConnection)
    );

    client = new RabbitMQClient({
      url: 'amqp://localhost',
      reconnectInterval: 100,
      maxRetries: 3,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should initialize correctly', async () => {
      await client.init();

      expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(client['rpcReplyQueue']).toBe('reply-queue');
    });
  });

  describe('Connection Error Handling', () => {
    it('should handle connection close events', async () => {
      await client.init();
      connectionEmitter.emit('close');

      expect(client['connection']).toBeNull();
      expect(client['channel']).toBeNull();
    });
  });

  describe('Reconnection Logic', () => {

    it('should attempt reconnection on connection loss', async () => {
      await client.init();
      connectionEmitter.emit('close');

      // Fast-forward time to trigger reconnect
      jest.advanceTimersByTime(100);
      await Promise.resolve();

      expect(amqp.connect).toHaveBeenCalledTimes(2);
    });
  });

  describe('RPC Timeout Handling', () => {
    it('should clean up callbacks after timeout', async () => {
      await client.init();

      const request = client.rpcRequest('test-queue', {}, { timeout: 100 });
      jest.advanceTimersByTime(101);

      try {
        await request;
      } catch {} // eslint-disable-line
      expect(client['rpcCallbacks'].size).toBe(0);
    });
  });

  describe('EventEmitter Integration', () => {
    it('should emit connected event', async () => {
      const connectedSpy = jest.fn();
      client.on('connected', connectedSpy);

      await client.init();

      expect(connectedSpy).toHaveBeenCalled();
    });

    it('should emit disconnected event', async () => {
      await client.init();
      const disconnectedSpy = jest.fn();
      client.on('disconnected', disconnectedSpy);

      connectionEmitter.emit('close');

      expect(disconnectedSpy).toHaveBeenCalled();
    });

    it('should handle multiple event listeners', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      client.on('connected', listener1);
      client.on('connected', listener2);

      await client.init();

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle double close calls', async () => {
      await client.init();
      await client.close();
      await expect(client.close()).resolves.not.toThrow();
    });

    it('should reject publish without channel', async () => {
      client['channel'] = null;
      await expect(
        client.publish({}, { exchange: 'test', routingKey: 'test' })
      ).rejects.toThrow('Channel not available');
    });
  });
});
