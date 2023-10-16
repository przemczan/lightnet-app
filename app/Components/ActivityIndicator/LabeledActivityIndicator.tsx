import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { LabeledActivityIndicatorProps } from './LabeledActivityIndicator.types';

export function LabeledActivityIndicator({ text }: LabeledActivityIndicatorProps) {
  return (
    <View
      style={{
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator animating={true} />
      {text && <Text style={{ marginLeft: 10 }}>{text}</Text>}
    </View>
  );
}
