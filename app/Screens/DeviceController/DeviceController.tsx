import { useEffect, useState } from 'react';
import { IconButton, Text } from 'react-native-paper';
import { BlackPortal } from 'react-native-portal';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { Containers } from '../../Components/Containers/Containers';
import { LightnetDeviceVisualizer } from '../../Components/Lightnet/LightnetDeviceVisualizer';
import { PageWrapper } from '../../Components/PageWrapper';
import { getLogger } from '../../Hooks/Logger';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { MyDevice } from '../../Hooks/MyDevices/MyDevices.types';
import { useSubscriptionUntilMounted } from '../../Hooks/RxJsHooks';
import { ConnectionState, LightnetDeviceInterface } from '../../Lightnet/interface/LightnetDeviceInterface';
import { LightnetDevice } from '../../Lightnet/LightnetDevice';
import { SocketConnector } from '../../Lightnet/SocketConnector';
import { portals } from '../../portals';
import { RootStackParamsList } from '../../routes';

export function DeviceController({ route }: NativeStackScreenProps<RootStackParamsList, 'DeviceController'>) {
  const { deviceId } = route.params;
  const { myDevices } = useMyDevices();
  const [lightnetDevice, setLightnetDevice] = useState<LightnetDeviceInterface | undefined>();
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const [currentDevice, setCurrentDevice] = useState<MyDevice | undefined>();

  const createDevice = (fromMyDevice: MyDevice): LightnetDeviceInterface => {
    const connector = new SocketConnector(getLogger(`WSC ${fromMyDevice.name}`), {
      host: fromMyDevice.addresses[0],
      port: fromMyDevice.port,
    });

    return new LightnetDevice(connector, getLogger(`Device ${fromMyDevice.name}`));
  };

  useEffect(() => {
    setCurrentDevice(myDevices.find(item => item.id === Number(deviceId)));
  }, [myDevices, deviceId]);

  useEffect(() => {
    if (currentDevice) {
      setLightnetDevice(createDevice(currentDevice));
    }

    return () => setLightnetDevice(undefined);
  }, [currentDevice]);

  useEffect(() => {
    if (lightnetDevice) {
      lightnetDevice.load();
    }
  }, [lightnetDevice]);

  useSubscriptionUntilMounted(lightnetDevice?.connectionState$, state => setConnectionState(state));

  if (!currentDevice) {
    return (
      <Containers.Centered>
        <Text>An error occurred. The selected device could not be found.</Text>
      </Containers.Centered>
    );
  }

  return (
    <PageWrapper>
      <BlackPortal name={portals.HEADER}></BlackPortal>
      <Text>
        {currentDevice.name} {connectionState === ConnectionState.CONNECTED ? <IconButton icon="connection" /> : ''}
      </Text>
      {lightnetDevice && <LightnetDeviceVisualizer lightnetDevice={lightnetDevice} />}
    </PageWrapper>
  );
}
