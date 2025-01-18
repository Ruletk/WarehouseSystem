import {
  createLogger as builtinCreateLogger,
  format,
  transports,
  Logger,
} from 'winston';

class LoggerOptions {
  constructor(public level = 'info', public label = 'default') {}
}

const defaultOptions: LoggerOptions = new LoggerOptions();
let logger: Logger = createLogger(defaultOptions);

/**
 * Applies the given logger options to configure the logger.
 *
 * @param options - The configuration options for the logger.
 */
function applyOptions(options: LoggerOptions): void {
  logger = createLogger(options);
}

/**
 * Creates a logger instance with the specified options.
 * This function only creates the logger instance and does not apply it globally.
 * For getting the logger instance with the specified options, use the `getLogger` function.
 * All instances in `getLogger` will have the same options as this function.
 *
 * @param {LoggerOptions} options - The configuration options for the logger.
 * @returns {Logger} The configured logger instance.
 *
 * The logger is configured with the following features:
 * - Log level as specified in the options.
 * - Combined format including timestamp, error stack, splat, label, and JSON format.
 * - Console transport with colorized output and custom printf format.
 * - File transport for general logs stored in './logs/log.log'.
 * - File transport for error logs stored in './logs/errors.log' with 'error' level.
 */
function createLogger(options: LoggerOptions): Logger {
  return builtinCreateLogger({
    level: options.level,
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.label({ label: options.label }),
      format.json()
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(({ level, message, label, timestamp, stack }) => {
            return `${timestamp} [${label}] ${level}: ${message} ${
              stack || ''
            }`;
          })
        ),
      }),
      new transports.File({
        filename: './logs/log.log',
      }),
      new transports.File({
        filename: './logs/errors.log',
        level: 'error',
      }),
    ],
  });
}

/**
 * Creates and returns a child logger with the specified label.
 * Strongly recommended to use this function to get a logger instance, instead of `createLogger`.
 *
 * @param label - The label to associate with the child logger. Defaults to 'default'.
 * @returns A child logger instance with the specified label.
 */
const getLogger = (label = 'default'): Logger => {
  return logger.child({ label });
};

export { LoggerOptions, getLogger, applyOptions };
