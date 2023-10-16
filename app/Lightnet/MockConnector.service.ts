import { Observable, Subject } from 'rxjs';
import { ConnectorState, MessageApiConnectorInterface } from './interface/MessageApiConnector';
import { MessageMeta } from './api/message/MessageMeta';
import { LoggerInterface } from './LoggerInterface';

export class MockConnectorService implements MessageApiConnectorInterface {
  public readonly messages$: Observable<ArrayBuffer>;
  public readonly state$: Observable<ConnectorState>;
  public readonly outMessages$: Observable<MessageMeta>;

  private messagesSubject = new Subject<ArrayBuffer>();
  private outMessagesSubject = new Subject<MessageMeta>();

  public readonly address: string;

  constructor(private readonly logger: LoggerInterface) {
    this.messages$ = this.messagesSubject.asObservable();
    this.outMessages$ = this.outMessagesSubject.asObservable();
  }

  mockMessage(arrayBuffer: ArrayBuffer) {
    this.logger.debug('IN', arrayBuffer);

    this.messagesSubject.next(arrayBuffer);
  }

  connect(): void {
    this.logger.debug('Connecting mock connector.');
  }

  send(data: ArrayBuffer | Uint8Array): void {
    const meta = new MessageMeta();
    meta.loadFromBuffer(data instanceof Uint8Array ? (data.buffer as ArrayBuffer) : data);

    this.outMessagesSubject.next(meta);

    this.logger.debug('OUT', data);
  }

  disconnect(): void {}
}
