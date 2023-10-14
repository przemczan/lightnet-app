import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useColorScheme } from 'react-native';
import { PortalProvider } from 'react-native-portal';
import { routes } from './app/routes';
import { DeviceController } from './app/Screens/DeviceController/DeviceController';
import { DeviceDiscovery } from './app/Screens/DeviceDiscovery/DeviceDiscovery';
import { MyDevices } from './app/Screens/MyDevices/MyDevices';
import { NavigationBar } from './app/Screens/NavigationBar';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    [routes.DEVICE_CONTROLLER]: 'device-controller/:deviceId',
  },
};

const linking = {
  prefixes: [],
  config,
};

export default function App() {
  const scheme = useColorScheme();

  return (
    <PortalProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator
          initialRouteName={routes.HOME}
          screenOptions={{
            header: props => <NavigationBar {...props} />,
          }}>
          <Stack.Screen name={routes.HOME} component={MyDevices} options={{ title: 'My devices' }} />
          <Stack.Screen
            name={routes.DEVICE_DISCOVERY}
            component={DeviceDiscovery}
            options={{ title: 'Discover devices' }}
          />
          <Stack.Screen
            name={routes.DEVICE_CONTROLLER}
            component={DeviceController}
            options={{ title: 'Device controller' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PortalProvider>
  );
}