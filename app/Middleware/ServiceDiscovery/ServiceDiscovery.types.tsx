export interface DiscveryService {
  txt: object;
  host: string;
  fullName: string;
  port: number;
  addresses: string[];
  name: string;
}

export type DiscoveryServiceList = {
  [key in string]: DiscveryService;
};

export interface ServiceDiscoveryInterface {
  isScanning: boolean;
  services: DiscoveryServiceList;
  scan: () => void;
  stop: () => void;
}

export type ServiceDiscoveryProps = {
  type: string;
  protocol: string;
  domain: string;
  timeout?: number;
};
