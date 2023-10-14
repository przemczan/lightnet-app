import { View } from 'react-native';
import { Card, CardTitleProps } from 'react-native-paper';

type CardTitleWithActionsProps = {} & CardTitleProps;

export function CardTitleWithActions({ children, ...rest }: CardTitleWithActionsProps) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Card.Title {...rest} style={{ flex: 1 }} />
      <View>{children}</View>
    </View>
  );
}
