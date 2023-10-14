import { Observable } from 'rxjs';
import { MessageMeta } from '../api/message/message-meta';
import { LightnetDevicePanelInterface } from './lightnet-device-panel-interface';
import { PanelLayout } from '../model/panel-layout';

export enum ConnectionState {
  IDLE,
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
}

export interface LightnetDeviceInterface {
  readonly onLoaded$: Observable<[ LightnetDevicePanelInterface[], PanelLayout[] ]>;
  readonly connectionState$: Observable<ConnectionState>;
  readonly address: string;

  sendMessage(message: MessageMeta): void;
  load(): void;
}
