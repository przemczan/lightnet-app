import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { getLogger } from '../Logger';
import { MyDevice } from './MyDevices.types';

const logger = getLogger('useMyDevices');
const STORAGE_KEY = 'MyDevices';

export function useMyDevices() {
  const [devices, setDevices] = useState<MyDevice[]>([]);

  const fetchDevices = useCallback(async () => {
    const devicesFromStorage = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || '[]');
    setDevices(devicesFromStorage);
    logger.debug('read devices', devicesFromStorage);
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    const saveInStorage = async () => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
      logger.debug([STORAGE_KEY, JSON.stringify(devices)]);
    };
    saveInStorage();
  }, [devices]);

  const getNextId = useCallback((): number => {
    return devices.reduce((currentId: number, device: MyDevice) => Math.max(device.id, currentId), 0) + 1;
  }, [devices]);

  const saveDevice = useCallback(
    (device: Omit<MyDevice, 'id'> & Partial<Pick<MyDevice, 'id'>>): MyDevice => {
      const index = devices.findIndex(item => item.id === device.id);

      if (index >= 0) {
        const updateDevice = { ...devices[index], ...device };
        const newDevicesList = devices.splice(index, 1, updateDevice);
        logger.debug('updating', device);
        setDevices(newDevicesList);
      } else {
        logger.debug('adding', device);
        device.id = getNextId();
        setDevices([...devices, device as MyDevice]);
      }

      return device as MyDevice;
    },
    [devices, getNextId],
  );

  const removeDevice = useCallback(
    (deviceId: number) => {
      const index = devices.findIndex(item => item.id === deviceId);

      if (index >= 0) {
        devices.splice(index, 1);
        setDevices([...devices]);
      }
    },
    [devices],
  );

  return {
    devices,
    saveDevice,
    removeDevice,
    fetchDevices,
  };
}
