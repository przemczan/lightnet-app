import { PropsWithChildren } from 'react';
import { View } from 'react-native';

export function PageWrapper({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        marginTop: 10,
      }}>
      {children}
    </View>
  );
}
