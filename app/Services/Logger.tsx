import { consoleTransport, logger as reactLogger } from 'react-native-logs';
import * as util from 'util';
import { LoggerInterface } from '../Lightnet/LoggerInterface';
import { Config } from './Config';

export const LoggerType = {
  SOCKET: 'SOCKET',
  LIGHTNET_DEVICE: 'LIGHTNET_DEVICE',
};

export const logger = reactLogger.createLogger({
  transport: consoleTransport,
  severity: Config.isDevelopment() ? 'debug' : 'error',
  enabledExtensions: Config.enabledLoggers(),
  stringifyFunc: msg => `${typeof msg === 'object' ? util.inspect(msg, { depth: 5, colors: true }) : msg}\n`,
});

export const getLogger = (extensionName: string): LoggerInterface => {
  return logger.extend(extensionName) as unknown as LoggerInterface;
};

export const socketLogger = getLogger(LoggerType.SOCKET);
export const lightnetDeviceLogger = getLogger(LoggerType.LIGHTNET_DEVICE);
