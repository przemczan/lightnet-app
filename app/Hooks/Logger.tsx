import { consoleTransport, fileAsyncTransport, logger as reactLogger } from 'react-native-logs';
import * as util from 'util';
import { LoggerInterface } from '../Lightnet/LoggerInterface';

export const LoggerType = {
  SOCKET: 'SOCKET',
  LIGHTNET_DEVICE: 'LIGHTNET DEVICE',
};

export const logger = reactLogger.createLogger({
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? 'debug' : 'error',
  enabledExtensions: Object.values(LoggerType),
  stringifyFunc: msg => `${typeof msg === 'object' ? util.inspect(msg, { depth: 5, colors: true }) : msg}\n`,
});

export const getLogger = (extensionName: string): LoggerInterface => {
  return logger.extend(extensionName) as unknown as LoggerInterface;
};

export const socketLogger = getLogger(LoggerType.SOCKET);
export const lightnetDeviceLogger = getLogger(LoggerType.LIGHTNET_DEVICE);

logger.disable(LoggerType.SOCKET);
