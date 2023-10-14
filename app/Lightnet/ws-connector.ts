import { NGXLogger } from 'ngx-logger';
import { LoggerWrapper } from '../logger.wrapper';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { ConnectorState, MessageApiConnectorInterface } from './interface/message-api-connector';

interface WsConnectorOptions {
  host: string;
  port: number;
}

export class WsConnector implements MessageApiConnectorInterface {
  private _messages$: Observable<ArrayBuffer>;
  private _state$: Observable<ConnectorState>;
  private stateSubject = new BehaviorSubject<ConnectorState>(ConnectorState.IDLE);

  private socket: WebSocket = null;
  private readonly logger: LoggerWrapper;

  private input$ = new ReplaySubject<ArrayBuffer | Uint8Array>();
  private readonly output$ = new Subject<ArrayBuffer>();
  private inputSubscription: Subscription;
  private options: Partial<WsConnectorOptions> = {};

  constructor(logger: NGXLogger, options: WsConnectorOptions) {
    this.setOptions(options);
    this.logger = new LoggerWrapper(logger, WsConnector.name);
    this._messages$ = this.output$.asObservable();
    this._messages$.subscribe(arrayBuffer => this.onMessageEvent(arrayBuffer));
    this._state$ = this.stateSubject.asObservable();
  }

  disconnect() {
    if (this.socket) {
      if (this.inputSubscription) {
        this.inputSubscription.unsubscribe();
      }

      this.input$ = new ReplaySubject<ArrayBuffer | Uint8Array>();

      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;

      this.socket = null;

      this.stateSubject.next(ConnectorState.DISCONNECTED);
    }
  }

  connect() {
    if (!this.socket) {
      this.stateSubject.next(ConnectorState.CONNECTING);

      this.socket = new WebSocket(this.getUrl());

      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = () => {
        this.inputSubscription = this.input$.subscribe(data => this.socket.send(data));
        this.stateSubject.next(ConnectorState.CONNECTED);
      };
      this.socket.onmessage = message => this.output$.next(message.data);
      this.socket.onclose = () => this.stateSubject.next(ConnectorState.DISCONNECTED);
      this.socket.onerror = () => this.stateSubject.next(ConnectorState.DISCONNECTED);
    }
  }

  send(data: ArrayBuffer | Uint8Array) {
    this.logger.debug('OUT', data);

    return this.input$.next(data);
  }

  get messages$(): Observable<ArrayBuffer> {
    return this._messages$;
  }

  get state$(): Observable<ConnectorState> {
    return this._state$;
  }

  setOptions(options: Partial<WsConnectorOptions>) {
    Object.assign(this.options, options);
  }

  private onMessageEvent(arrayBuffer: ArrayBuffer) {
    this.logger.debug('IN', arrayBuffer);
  }

  private getUrl(): string {
    return `ws://${this.options.host}:${this.options.port}/ws`;
  }

  get address(): string {
    return `${this.options.host}:${this.options.port}`;
  }
}
