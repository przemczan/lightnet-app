import { logger as reactLogger } from 'react-native-logs';
import { LoggerInterface } from '../Lightnet/LoggerInterface';

export const logger = reactLogger.createLogger();

export const getLogger = (extensionName: string): LoggerInterface => {
  return logger.extend(extensionName) as unknown as LoggerInterface;
};
