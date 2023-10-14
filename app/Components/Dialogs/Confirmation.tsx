import { PropsWithChildren } from 'react';
import { Button, Dialog, Portal } from 'react-native-paper';

type DialogConfirmationProps = {
  visible: boolean;
  onConfirm: Function;
  onDismiss: Function;
  title?: string;
  yesCaption?: string;
  noCaption?: string;
} & PropsWithChildren;

export function Confirmation({
  visible,
  onConfirm,
  onDismiss,
  title,
  yesCaption,
  noCaption,
  children,
}: DialogConfirmationProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => onDismiss()}>
        <Dialog.Title>{title || 'Confirmation'}</Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => onConfirm()}>{yesCaption || 'Yes'}</Button>
          <Button onPress={() => onDismiss()}>{noCaption || 'No'}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
