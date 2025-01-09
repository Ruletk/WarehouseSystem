import { getLogger, LoggerOptions, applyOptions } from './logging';
import { Logger, transports } from 'winston';

describe('logging', () => {
  describe('createLogger', () => {
    it('should create a logger with the correct level', () => {
      const options: LoggerOptions = {
        level: 'info',
        label: 'test-label',
      };
      applyOptions(options);
      const logger: Logger = getLogger();
      expect(logger.level).toBe('info');
    });

    it('should create a logger with the correct transports', () => {
      const options: LoggerOptions = {
        level: 'info',
        label: 'test-label',
      };
      applyOptions(options);
      const logger: Logger = getLogger();
      expect(logger.transports.length).toBe(3);
      expect(logger.transports[0]).toBeInstanceOf(transports.Console);
      expect(logger.transports[1]).toBeInstanceOf(transports.File);
      expect(logger.transports[2]).toBeInstanceOf(transports.File);
    });

    it('should create a logger with the correct fields', () => {
      const options: LoggerOptions = {
        level: 'info',
        label: 'test-label',
      };
      applyOptions(options);
      const logger: Logger = getLogger();
      const consoleSpy = jest.spyOn(transports.Console.prototype, 'log');
      logger.info('test-message');
      const loggedObject = consoleSpy.mock.calls[0][0];

      expect(loggedObject).toMatchObject({
        message: 'test-message',
        label: 'test-label',
      });

      consoleSpy.mockRestore();
    });
  });
});
