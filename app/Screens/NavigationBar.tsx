import { Appbar } from 'react-native-paper';
import { WhitePortal } from 'react-native-portal';
import { portals } from '../portals';
import { NavigationBarProps } from './NavigationBar.types';

export function NavigationBar({ options: { title }, navigation, back }: NavigationBarProps) {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      <WhitePortal name={portals.HEADER} />
    </Appbar.Header>
  );
}
