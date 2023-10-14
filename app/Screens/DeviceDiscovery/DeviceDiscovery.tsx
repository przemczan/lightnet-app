import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicatorTop } from '../../Components/ActivityIndicator/ActivityIndicatorTop';
import { CardTitleWithActions } from '../../Components/CardTitleWithMenu/CardTitleWithActions';
import { PageWrapper } from '../../Components/PageWrapper';
import { useDeviceDiscovery } from '../../Hooks/DeviceDiscovery/DeviceDiscovery.hook';
import { Card, IconButton } from 'react-native-paper';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { DiscveryService } from '../../Hooks/ServiceDiscovery/ServiceDiscovery.types';

export function DeviceDiscovery() {
  const { services, isScanning } = useDeviceDiscovery();
  const { devices, saveDevice } = useMyDevices();

  const serviceInMyDevices = useCallback(
    (service: DiscveryService): boolean => {
      const matchingDevice = devices.find(device => device.serviceName === service.name);

      return Boolean(matchingDevice);
    },
    [devices],
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

  return (
    <PageWrapper>
      {isScanning && <ActivityIndicatorTop text={'searching for devices...'} />}
      <ScrollView>
        {Object.values(services).map(service => (
          <Card key={service.name}>
            <CardTitleWithActions title={service.name}>
              {serviceInMyDevices(service) ? (
                <IconButton icon="check" />
              ) : (
                <IconButton icon="plus" onPress={() => addService(service)} />
              )}
            </CardTitleWithActions>
          </Card>
        ))}
      </ScrollView>
    </PageWrapper>
  );
}
