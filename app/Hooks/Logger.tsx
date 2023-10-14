import { logger as reactLogger } from 'react-native-logs';

export const logger = reactLogger.createLogger();

export const getLogger = (extensionName: string) => {
  return logger.extend(extensionName);
};
