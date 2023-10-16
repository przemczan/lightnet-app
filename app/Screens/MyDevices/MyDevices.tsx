import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button, Card, IconButton, Menu, Text } from 'react-native-paper';
import { BlackPortal } from 'react-native-portal';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { CardTitleWithActions } from '../../Components/CardTitleWithMenu/CardTitleWithActions';
import { Dialogs } from '../../Components/Dialogs';
import { PageWrapper } from '../../Components/PageWrapper';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { MyDevice } from '../../Hooks/MyDevices/MyDevices.types';
import { portals } from '../../portals';
import { RootStackParamsList, routes } from '../../routes';

export function MyDevices({ navigation }: NativeStackScreenProps<RootStackParamsList, routes.HOME>) {
  const [showDeviceMenu, setShowDeviceMenu] = useState(0);
  const [deviceToDelete, setDeviceToDelete] = useState<MyDevice | null>(null);
  const { myDevices, removeDevice, fetchDevices } = useMyDevices();

  const closeDeviceMenu = () => {
    setShowDeviceMenu(0);
  };

  const handleShowDeviceMenu = (device: MyDevice) => {
    setShowDeviceMenu(device.id);
  };

  const confirmDeviceRemoval = (device: MyDevice) => {
    setDeviceToDelete(device);
    closeDeviceMenu();
  };

  const handleRemoveDevice = useCallback(() => {
    if (deviceToDelete) {
      removeDevice(deviceToDelete.id);
    }
    setDeviceToDelete(null);
  }, [deviceToDelete, removeDevice]);

  const handleEditDevice = (device: MyDevice) => {};

  const handleShowDeviceInformation = (device: MyDevice) => {};

  const handleDeviceClick = (device: MyDevice) => {
    navigation.navigate(routes.DEVICE_CONTROLLER, { deviceId: String(device.id) });
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices]),
  );

  return (
    <PageWrapper>
      <BlackPortal name={portals.HEADER}>
        <Appbar.Action icon="magnify" onPress={() => navigation.navigate(routes.DEVICE_DISCOVERY)} />
      </BlackPortal>

      {myDevices?.map(device => (
        <Card key={device.name} onPress={() => handleDeviceClick(device)}>
          <CardTitleWithActions title={device.name}>
            <Menu
              visible={showDeviceMenu === device.id}
              onDismiss={closeDeviceMenu}
              anchor={<IconButton icon="menu" onPress={() => handleShowDeviceMenu(device)} />}>
              <Menu.Item
                leadingIcon="information"
                title={'Information'}
                onPress={() => handleShowDeviceInformation(device)}
              />
              <Menu.Item leadingIcon="lead-pencil" title={'Edit'} onPress={() => handleEditDevice(device)} />
              <Menu.Item leadingIcon="delete" title={'Delete'} onPress={() => confirmDeviceRemoval(device)} />
            </Menu>
          </CardTitleWithActions>
        </Card>
      ))}

      <Dialogs.Confirmation
        visible={deviceToDelete !== null}
        onConfirm={() => handleRemoveDevice()}
        onDismiss={() => setDeviceToDelete(null)}>
        <Text>Delete device?</Text>
      </Dialogs.Confirmation>

      {!myDevices.length && (
        <View style={{ justifyContent: 'center', height: '100%' }}>
          <Button icon="cloud-search" onPress={() => navigation.navigate(routes.DEVICE_DISCOVERY)}>
            Tap here to search for devices in your network
          </Button>
        </View>
      )}
    </PageWrapper>
  );
}
