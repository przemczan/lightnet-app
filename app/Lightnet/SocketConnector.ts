import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { ConnectorState, MessageApiConnectorInterface } from './interface/MessageApiConnector';
import { LoggerInterface } from './LoggerInterface';

interface WsConnectorOptions {
  host: string;
  port: number;
}

export class SocketConnector implements MessageApiConnectorInterface {
  private _messages$: Observable<ArrayBuffer>;
  private _state$: Observable<ConnectorState>;
  private stateSubject = new BehaviorSubject<ConnectorState>(ConnectorState.IDLE);

  private socket: WebSocket | null = null;

  private input$ = new ReplaySubject<ArrayBuffer | Uint8Array>();
  private readonly output$ = new Subject<ArrayBuffer>();
  private inputSubscription: Subscription | undefined;
  private options: Partial<WsConnectorOptions> = {};

  constructor(private readonly logger: LoggerInterface, options: WsConnectorOptions) {
    this.setOptions(options);
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

      // @ts-ignore
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = () => {
        this.inputSubscription = this.input$.subscribe(data => this.socket?.send(data));
        this.stateSubject.next(ConnectorState.CONNECTED);
        this.logger.debug('connected');
      };
      this.socket.onmessage = message => this.output$.next(message.data);
      this.socket.onclose = () => this.stateSubject.next(ConnectorState.DISCONNECTED);
      this.socket.onerror = error => {
        this.logger.debug('error', error);
        this.stateSubject.next(ConnectorState.DISCONNECTED);
      };
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
