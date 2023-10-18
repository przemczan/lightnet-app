import { logger as reactLogger } from 'react-native-logs';
import { LoggerInterface } from '../Lightnet/LoggerInterface';

export const LoggerType = {
  SOCKET: 'SOCKET',
  LIGHTNET_DEVICE: 'LIGHTNET DEVICE',
};

export const logger = reactLogger.createLogger({
  enabledExtensions: Object.values(LoggerType),
});

export const getLogger = (extensionName: string): LoggerInterface => {
  return logger.extend(extensionName) as unknown as LoggerInterface;
};

export const socketLogger = getLogger(LoggerType.SOCKET);
export const lightnetDeviceLogger = getLogger(LoggerType.LIGHTNET_DEVICE);

logger.disable(LoggerType.SOCKET);
