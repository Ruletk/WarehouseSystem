import {createLogger as builtinCreateLogger, format, transports, Logger} from 'winston';

class LoggerOptions {
  constructor(
    public level: string,
    public label: string,
  ) {}
}



function createLogger(options: LoggerOptions): Logger {
  const loggerTransports = [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, label, timestamp, stack }) => {
          return `${timestamp} [${label}] ${level}: ${message} ${stack || ''}`;
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
  ];


  return builtinCreateLogger({
    level: options.level,
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.label({ label: options.label }),
      format.json()
    ),
    transports: loggerTransports,
  });
}

export {createLogger, LoggerOptions};
