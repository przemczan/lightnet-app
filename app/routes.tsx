import { ParamListBase } from '@react-navigation/native';

export enum routes {
  HOME = 'Home',
  DEVICE_DISCOVERY = 'DeviceDiscovery',
  DEVICE_CONTROLLER = 'DeviceController',
}

export interface RootStackParamsList extends ParamListBase {
  DeviceController: { deviceId: string };
  DeviceDiscovery: undefined;
  Home: undefined;
}
