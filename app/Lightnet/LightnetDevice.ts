import { ConnectionState, LightnetDeviceInterface } from './interface/LightnetDeviceInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageMeta } from './api/message/MessageMeta';
import { ConnectorState, MessageApiConnectorInterface } from './interface/MessageApiConnector';
import { MessageApiInterface } from './interface/MessageApi';
import { LoggerInterface } from './LoggerInterface';
import { MessageApiService } from './MessageApi.service';
import { PanelsListService } from './PanelsList.service';
import { PanelsStatesService } from './PanelsStates.service';
import { PanelsLayoutService } from './PanelsLayout.service';
import { map, share } from 'rxjs/operators';
import { LightnetDevicePanelInterface } from './interface/LightnetDevicePanelInterface';
import { PanelInfo } from './model/PanelInfo';
import { LightnetDevicePanel } from './LightnetDevicePanel';
import { PanelLayout } from './model/PanelLayout';

export class LightnetDevice implements LightnetDeviceInterface {
  private edgeLength = 100;
  private _onLoaded$: Observable<[LightnetDevicePanelInterface[], PanelLayout[]]>;
  private _connectionState$: Observable<ConnectionState>;
  private _connectionStateSubject = new BehaviorSubject<ConnectionState>(ConnectionState.IDLE);
  private messageApiService: MessageApiInterface;
  private panelsListService: PanelsListService;
  private panelsStatesService: PanelsStatesService;

  constructor(
    private readonly connector: MessageApiConnectorInterface,
    private readonly logger: LoggerInterface,
  ) {
    this.messageApiService = new MessageApiService(connector, logger);
    this.panelsListService = new PanelsListService(this.messageApiService, logger);
    this.panelsStatesService = new PanelsStatesService(this.messageApiService, this.panelsListService, logger);

    this._onLoaded$ = this.panelsListService.panels$.pipe(
      map(panelsList => this.buildDevicePanelsList(panelsList)),
      share(),
    );
    this._connectionState$ = this._connectionStateSubject.asObservable();

    connector.state$.subscribe(state => {
      switch (state) {
        case ConnectorState.IDLE:
          this._connectionStateSubject.next(ConnectionState.IDLE);
          break;

        case ConnectorState.CONNECTING:
          this._connectionStateSubject.next(ConnectionState.CONNECTING);
          break;

        case ConnectorState.CONNECTED:
          this._connectionStateSubject.next(ConnectionState.CONNECTED);
          break;

        case ConnectorState.DISCONNECTED:
          this._connectionStateSubject.next(ConnectionState.DISCONNECTED);
          break;
      }
    });
  }

  sendMessage(message: MessageMeta): void {
    this.messageApiService.sendMessage(message);
  }

  load(): void {
    this.connector.disconnect();
    this.connector.connect();
    this.panelsListService.load();
  }

  get onLoaded$(): Observable<[LightnetDevicePanelInterface[], PanelLayout[]]> {
    return this._onLoaded$.pipe();
  }

  get connectionState$(): Observable<ConnectionState> {
    return this._connectionState$;
  }

  get address(): string {
    return this.connector.address;
  }

  private buildDevicePanelsList(panelsList: PanelInfo[]): [LightnetDevicePanelInterface[], PanelLayout[]] {
    const layouts = PanelsLayoutService.generateLayout(panelsList, this.edgeLength);
    const devicePanels = panelsList.map(
      info =>
        new LightnetDevicePanel(
          this,
          info,
          layouts.find(layout => layout.panelId === info.id)!,
          this.panelsStatesService.states$,
        ),
    );

    return [devicePanels, layouts];
  }
}
