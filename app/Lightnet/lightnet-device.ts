import { ConnectionState, LightnetDeviceInterface } from './interface/lightnet-device-interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageMeta } from './api/message/message-meta';
import { ConnectorState, MessageApiConnectorInterface } from './interface/message-api-connector';
import { MessageApiInterface } from './interface/message-api';
import { MessageApiService } from './message-api.service';
import { NGXLogger } from 'ngx-logger';
import { PanelsListService } from './panels-list.service';
import { PanelsStatesService } from './panels-states.service';
import { PanelsLayoutService } from './panels-layout.service';
import { map, share } from 'rxjs/operators';
import { LightnetDevicePanelInterface } from './interface/lightnet-device-panel-interface';
import { PanelInfo } from './model/panel-info';
import { LightnetDevicePanel } from './lightnet-device-panel';
import { PanelLayout } from './model/panel-layout';

export class LightnetDevice implements LightnetDeviceInterface {
  private edgeLength = 100;
  private _onLoaded$: Observable<[ LightnetDevicePanelInterface[], PanelLayout[] ]>;
  private _connectionState$: Observable<ConnectionState>;
  private _connectionStateSubject = new BehaviorSubject<ConnectionState>(ConnectionState.IDLE);
  private messageApiService: MessageApiInterface;
  private panelsListService: PanelsListService;
  private panelsStatesService: PanelsStatesService;

  constructor(private readonly connector: MessageApiConnectorInterface, logger: NGXLogger) {
    this.messageApiService = new MessageApiService(connector, logger);
    this.panelsListService = new PanelsListService(this.messageApiService, logger);
    this.panelsStatesService = new PanelsStatesService(this.messageApiService, this.panelsListService);

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

  get onLoaded$(): Observable<[ LightnetDevicePanelInterface[], PanelLayout[] ]> {
    return this._onLoaded$.pipe();
  }

  get connectionState$(): Observable<ConnectionState> {
    return this._connectionState$;
  }

  get address(): string {
    return this.connector.address;
  }

  private buildDevicePanelsList(panelsList: PanelInfo[]): [ LightnetDevicePanelInterface[], PanelLayout[] ] {
    const layouts = PanelsLayoutService.generateLayout(panelsList, this.edgeLength);
    const devicePanels = panelsList.map(info => new LightnetDevicePanel(
      this,
      info,
      layouts.find(layout => layout.panelId === info.id),
      this.panelsStatesService.states$,
    ));

    return [ devicePanels, layouts ];
  }
}
