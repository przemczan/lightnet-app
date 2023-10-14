import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Containers } from '../Containers/Containers';
import { ActivityIndicatorTopProps } from './ActivityIndicatorTop.types';

export function ActivityIndicatorTop({ text }: ActivityIndicatorTopProps) {
  return (
    <View
      style={{
        paddingVertical: 20,
      }}>
      <Containers.Centered
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator animating={true} />
        {text && <Text style={{ marginLeft: 10 }}>{text}</Text>}
      </Containers.Centered>
    </View>
  );
}
