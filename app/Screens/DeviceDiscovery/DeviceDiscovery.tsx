import { useCallback } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { BlackPortal } from 'react-native-portal';
import { LabeledActivityIndicator } from '../../Components/ActivityIndicator/LabeledActivityIndicator';
import { PageWrapper } from '../../Components/PageWrapper';
import { useDeviceDiscovery } from '../../Hooks/DeviceDiscovery/DeviceDiscovery.hook';
import { IconButton, List } from 'react-native-paper';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { DiscveryService } from '../../Hooks/ServiceDiscovery/ServiceDiscovery.types';
import { portals } from '../../portals';

export function DeviceDiscovery() {
  const { services, isScanning, scan } = useDeviceDiscovery();
  const { myDevices, saveDevice } = useMyDevices();

  const serviceInMyDevices = useCallback(
    (service: DiscveryService): boolean => {
      const matchingDevice = myDevices.find(device => device.serviceName === service.name);

      return Boolean(matchingDevice);
    },
    [myDevices],
  );

  const addService = (service: DiscveryService) => {
    saveDevice({
      name: service.name,
      host: service.host,
      port: service.port,
      addresses: service.addresses,
      serviceName: service.name,
    });
  };

  const onRefresh = useCallback(() => {
    scan();
  }, [scan]);

  return (
    <PageWrapper>
      <BlackPortal name={portals.HEADER}></BlackPortal>

      {isScanning && <LabeledActivityIndicator text={'searching for devices...'} />}

      <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
        {Object.values(services).map((service, index) => (
          <List.Item
            key={index}
            title={service.name}
            description={service.host}
            left={() => <IconButton icon={'layers-triple-outline'} />}
            right={() =>
              serviceInMyDevices(service) ? (
                <IconButton icon="check" />
              ) : (
                <IconButton icon="plus" onPress={() => addService(service)} />
              )
            }
          />
        ))}
      </ScrollView>
    </PageWrapper>
  );
}
