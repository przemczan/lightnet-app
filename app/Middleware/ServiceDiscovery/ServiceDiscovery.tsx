import { useCallback, useEffect, useState } from 'react';
import Zeroconf from 'react-native-zeroconf';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { NodeJS } from 'timers';
import { getLogger } from '../../Services/Logger';
import { DiscoveryServiceList, ServiceDiscoveryInterface, ServiceDiscoveryProps } from './ServiceDiscovery.types';

const logger = getLogger('ServiceDiscovery');
const zeroconf = new Zeroconf();
const zeroconfEventsEmitter = new EventEmitter();

zeroconf.on('start', () => {
  logger.debug('[zeroconf] start');
  zeroconfEventsEmitter.emit('start');
});
zeroconf.on('stop', () => {
  logger.debug('[zeroconf] stop');
  zeroconfEventsEmitter.emit('stop');
});
zeroconf.on('resolved', service => {
  logger.debug(`[zeroconf] resolved [${service.name}]`);
  zeroconfEventsEmitter.emit('resolved', service);
});
zeroconf.on('error', error => {
  logger.error('[zeroconf] error', error);
  zeroconfEventsEmitter.emit('error', error);
});

export const useServiceDiscovery = ({
  type,
  protocol,
  domain,
  timeout = 10,
}: ServiceDiscoveryProps): ServiceDiscoveryInterface => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [services, setServices] = useState<DiscoveryServiceList>({});
  const [timeoutTimer, setTimeoutTimer] = useState<NodeJS.Timeout>(0);

  const startScan = useCallback(() => {
    clearTimeout(timeoutTimer);
    zeroconf.scan(type, protocol, domain);
  }, [timeoutTimer, type, protocol, domain]);

  useEffect(() => {
    zeroconfEventsEmitter.removeAllListeners();
    zeroconfEventsEmitter.addListener('start', () => setIsScanning(true));
    zeroconfEventsEmitter.addListener('stop', () => setIsScanning(false));
    zeroconfEventsEmitter.addListener('resolved', () => setServices(zeroconf.getServices()));

    zeroconf.scan(type, protocol, domain);

    if (timeout) {
      setTimeoutTimer(setTimeout(() => zeroconf.stop(), timeout * 1000));
    }

    return () => {
      zeroconfEventsEmitter.removeAllListeners();
      zeroconf.stop();
    };
  }, [type, protocol, domain, timeout]);

  return {
    isScanning,
    services,
    scan: startScan,
    stop: zeroconf.stop,
  };
};
