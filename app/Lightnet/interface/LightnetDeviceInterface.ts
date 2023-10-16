import { Observable } from 'rxjs';
import { MessageMeta } from '../api/message/MessageMeta';
import { LightnetDevicePanelInterface } from './LightnetDevicePanelInterface';
import { PanelLayout } from '../model/PanelLayout';

export enum ConnectionState {
  IDLE,
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
}

export interface LightnetDeviceInterface {
  readonly onLoaded$: Observable<[LightnetDevicePanelInterface[], PanelLayout[]]>;
  readonly connectionState$: Observable<ConnectionState>;
  readonly address: string;

  sendMessage(message: MessageMeta): void;
  load(): void;
}
