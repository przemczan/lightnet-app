import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
import { BlackPortal } from 'react-native-portal';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { Containers } from '../../Components/Containers/Containers';
import { LightnetDeviceVisualizer } from '../../Components/Lightnet/LightnetDeviceVisualizer';
import { PageWrapper } from '../../Components/PageWrapper';
import { lightnetDeviceLogger, socketLogger } from '../../Hooks/Logger';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { MyDevice } from '../../Hooks/MyDevices/MyDevices.types';
import { useSubscriptionUntilMounted } from '../../Hooks/RxJsHooks';
import { ConnectionState, LightnetDeviceInterface } from '../../Lightnet/interface/LightnetDeviceInterface';
import { LightnetDevicePanelInterface } from '../../Lightnet/interface/LightnetDevicePanelInterface';
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
    const connector = new SocketConnector(socketLogger, {
      host: fromMyDevice.addresses[0],
      port: fromMyDevice.port,
    });

    return new LightnetDevice(connector, lightnetDeviceLogger);
  };

  const onPanelPress = useCallback((panel: LightnetDevicePanelInterface) => {
    panel.toggle();
  }, []);

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

  useSubscriptionUntilMounted(
    lightnetDevice?.connectionState$,
    useCallback(
      state => {
        setConnectionState(state);

        if (state === ConnectionState.DISCONNECTED) {
          lightnetDevice?.load();
        }
      },
      [lightnetDevice],
    ),
  );

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
      <View
        style={{ marginHorizontal: 10, marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text>{currentDevice.name}</Text>
        {connectionState === ConnectionState.CONNECTED ? (
          <IconButton icon="lan-connect" />
        ) : (
          <IconButton icon="lan-disconnect" />
        )}
      </View>

      <Divider />

      {lightnetDevice && (
        <LightnetDeviceVisualizer
          lightnetDevice={lightnetDevice}
          onPanelPointerPress={onPanelPress}
          onPanelPointerIn={onPanelPress}
        />
      )}
    </PageWrapper>
  );
}
