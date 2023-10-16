import { Observable } from 'rxjs';

export enum ConnectorState {
  IDLE,
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
}

export interface MessageApiConnectorInterface {
  readonly messages$: Observable<ArrayBuffer>;
  readonly state$: Observable<ConnectorState>;
  readonly address: string;

  connect(): void;
  disconnect(): void;

  send(data: ArrayBuffer | Uint8Array): void;
}
