import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { BlackPortal } from 'react-native-portal';
import { LabeledActivityIndicator } from '../../Components/ActivityIndicator/LabeledActivityIndicator';
import { CardTitleWithActions } from '../../Components/CardTitleWithMenu/CardTitleWithActions';
import { PageWrapper } from '../../Components/PageWrapper';
import { useDeviceDiscovery } from '../../Hooks/DeviceDiscovery/DeviceDiscovery.hook';
import { Card, IconButton } from 'react-native-paper';
import { useMyDevices } from '../../Hooks/MyDevices/MyDevices.hook';
import { DiscveryService } from '../../Hooks/ServiceDiscovery/ServiceDiscovery.types';
import { portals } from '../../portals';

export function DeviceDiscovery() {
  const { services, isScanning } = useDeviceDiscovery();
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

  return (
    <PageWrapper>
      <BlackPortal name={portals.HEADER}></BlackPortal>

      {isScanning && <LabeledActivityIndicator text={'searching for devices...'} />}

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
