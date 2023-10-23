import { useServiceDiscovery } from '../ServiceDiscovery/ServiceDiscovery';

export function useDeviceDiscovery() {
  return useServiceDiscovery({ type: 'lightnet', protocol: 'tcp', domain: 'local.' });
}
