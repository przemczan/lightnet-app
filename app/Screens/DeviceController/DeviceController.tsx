import { Text } from 'react-native-paper';
import { BlackPortal } from 'react-native-portal';
import { Containers } from '../../Components/Containers/Containers';
import { PageWrapper } from '../../Components/PageWrapper';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { portals } from '../../portals';

export function DeviceController({ route, navigation }) {
  const { deviceId } = route.params;
  const { devices } = useMyDevices();
  const device = devices.find(item => item.id === deviceId);

  if (!device) {
    return (
      <Containers.Centered>
        <Text>An error occurred. The selected device could not be found.</Text>
      </Containers.Centered>
    );
  }

  return (
    <PageWrapper>
      <BlackPortal name={portals.HEADER}></BlackPortal>
      <Text>{device.name}</Text>
    </PageWrapper>
  );
}
