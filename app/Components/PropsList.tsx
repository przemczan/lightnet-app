import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type KeyValueItemProps = {
  name: string;
  value: string | number | null | undefined;
  titleAlign?: 'right' | 'left' | 'center' | 'justify' | 'auto';
} & ViewProps;

export function KeyValueItem({ name, value, titleAlign = 'right', ...rest }: KeyValueItemProps) {
  const { colors } = useTheme();

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }} {...rest}>
      <View style={{ flex: 0.3 }}>
        <Text style={{ textAlign: titleAlign, color: colors.secondary }}>{name}</Text>
      </View>
      <View style={{ marginLeft: 10, flex: 0.7 }}>
        <Text style={{ color: colors.primary }}>{value}</Text>
      </View>
    </View>
  );
}
