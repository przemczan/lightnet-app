import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Appbar, Button, Dialog, IconButton, List, Menu, Portal, Text } from 'react-native-paper';
import { BlackPortal } from 'react-native-portal';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { Containers } from '../../Components/Containers/Containers';
import { Dialogs } from '../../Components/Dialogs';
import { PageWrapper } from '../../Components/PageWrapper';
import { KeyValueItem } from '../../Components/PropsList';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { MyDevice } from '../../Hooks/MyDevices/MyDevices.types';
import { portals } from '../../portals';
import { RootStackParamsList, routes } from '../../routes';

export function MyDevices({ navigation }: NativeStackScreenProps<RootStackParamsList, routes.HOME>) {
  const [showDeviceMenu, setShowDeviceMenu] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<MyDevice | null>(null);
  const { myDevices, removeDevice, fetchDevices } = useMyDevices();
  const [showDeviceRemovalConfirmation, setShowDeviceRemovalConfirmation] = useState(false);
  const [showDeviceInformation, setShowDeviceInformation] = useState(false);

  const closeDeviceMenu = () => {
    setShowDeviceMenu(0);
  };

  const handleShowDeviceMenu = (device: MyDevice) => {
    setShowDeviceMenu(device.id);
  };

  const confirmDeviceRemoval = (device: MyDevice) => {
    setSelectedDevice(device);
    setShowDeviceRemovalConfirmation(true);
    closeDeviceMenu();
  };

  const handleRemoveDevice = useCallback(() => {
    if (selectedDevice) {
      removeDevice(selectedDevice.id);
    }
    setSelectedDevice(null);
  }, [selectedDevice, removeDevice]);

  const handleEditDevice = (device: MyDevice) => {};

  const handleShowDeviceInformation = (device: MyDevice) => {
    setSelectedDevice(device);
    setShowDeviceInformation(true);
    closeDeviceMenu();
  };

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
      {/*@ts-ignore */}
      <BlackPortal name={portals.HEADER}>
        <Appbar.Action icon="magnify" onPress={() => navigation.navigate(routes.DEVICE_DISCOVERY)} />
      </BlackPortal>

      {myDevices?.map(device => (
        <List.Item
          onPress={() => handleDeviceClick(device)}
          key={device.name}
          title={device.name}
          description={device.host}
          left={() => <IconButton icon={'layers-triple-outline'} />}
          right={() => (
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
          )}
        />
      ))}

      <Dialogs.Confirmation
        visible={showDeviceRemovalConfirmation}
        onConfirm={() => handleRemoveDevice()}
        onDismiss={() => setShowDeviceRemovalConfirmation(false)}>
        <Text>Delete device?</Text>
      </Dialogs.Confirmation>

      <Portal>
        <Dialog visible={showDeviceInformation} onDismiss={() => setShowDeviceInformation(false)}>
          <Dialog.Title>Device information</Dialog.Title>
          <Dialog.Content>
            <KeyValueItem name={'Name'} value={selectedDevice?.name} />
            <KeyValueItem name={'Host'} value={selectedDevice?.host} />
            <KeyValueItem name={'Port'} value={selectedDevice?.port} />
            <KeyValueItem name={'Service name'} value={selectedDevice?.serviceName} />
            <KeyValueItem name={'Addresses'} value={selectedDevice?.addresses?.join(', ')} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button icon={'check'} onPress={() => setShowDeviceInformation(false)}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {!myDevices.length && (
        <Containers.Centered>
          <Button icon="magnify" onPress={() => navigation.navigate(routes.DEVICE_DISCOVERY)}>
            Tap here to search for devices in your network
          </Button>
        </Containers.Centered>
      )}
    </PageWrapper>
  );
}
