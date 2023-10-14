import { View, ViewProps } from 'react-native';

export const Containers = {
  Centered: (props: ViewProps) => {
    return (
      <View
        {...props}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
      />
    );
  },
};
