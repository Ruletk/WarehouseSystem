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

function applyOptions(options: LoggerOptions): void {
  logger = createLogger(options);
}

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

const getLogger = (label = 'default'): Logger => {
  return logger.child({ label });
};

export { LoggerOptions, getLogger, applyOptions };
