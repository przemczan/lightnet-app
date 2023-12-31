import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { useCallback, useEffect, useState } from 'react';
import { getLogger } from '../../Services/Logger';
import { MyDevice } from './MyDevices.types';

const logger = getLogger('useMyDevices');
const STORAGE_KEY = 'MyDevices';
const storage = new MMKVLoader().initialize();

export function useMyDevices() {
  const [devices, setDevices] = useState<MyDevice[]>([]);
  const [devicesInStorage, setDevicesInStorage] = useMMKVStorage(STORAGE_KEY, storage, '');

  const fetchDevices = useCallback(async () => {
    const devicesFromStorage = JSON.parse(devicesInStorage);
    setDevices(devicesFromStorage);
    logger.debug('read devices', devicesFromStorage);
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    const saveInStorage = async () => {
      setDevicesInStorage(JSON.stringify(devices));
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
        setDevices(newDevicesList);
      } else {
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
    myDevices: devices,
    saveDevice,
    removeDevice,
    fetchDevices,
  };
}
