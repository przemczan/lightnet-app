import { MessageMeta } from './api/message/MessageMeta';
import { Observable } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { MessageEdgeListModel } from './api/model/message/MessageEdgeListModel';
import { MessageType } from './api/MessageType';
import { MessageEdgesListMapping } from './api/mapping/message/MessageEdgesListMapping';
import { MessagePanelsStatesModel } from './api/model/message/MessagePanelsStatesModel';
import { MessagePanelsStatesMapping } from './api/mapping/message/MessagePanelsStatesMapping';
import { MessageApiInterface } from './interface/MessageApi';
import { MessageApiConnectorInterface } from './interface/MessageApiConnector';
import { LoggerInterface } from './LoggerInterface';

export class MessageApiService implements MessageApiInterface {
  public readonly incomingMessages$: Observable<MessageMeta>;
  public readonly messageEdgesList$: Observable<MessageEdgeListModel>;
  public readonly messagePanelsStates$: Observable<MessagePanelsStatesModel>;

  constructor(private connector: MessageApiConnectorInterface, private readonly logger: LoggerInterface) {
    this.incomingMessages$ = connector.messages$.pipe(
      map(buffer => this.mapToMessageMeta(buffer)),
      filter(meta => {
        const errorCode = meta.isValid();

        if (errorCode) {
          this.logger.debug('INVALID', errorCode);
        }

        return errorCode === MessageMeta.OK;
      }),
      tap(meta => this.logger.debug('IN [META]', meta.getValue())),
      share(),
    );

    this.messageEdgesList$ = this.incomingMessages$.pipe(
      filter(meta => meta.getType() === MessageType.EDGES_LIST),
      map(meta => new MessageEdgesListMapping(meta.getDataBuffer()).getValue()),
      tap(data => this.logger.debug('IN [EDGES_LIST]', data)),
      share(),
    );

    this.messagePanelsStates$ = this.incomingMessages$.pipe(
      filter(meta => meta.getType() === MessageType.PANELS_STATES),
      map(meta => new MessagePanelsStatesMapping(meta.getDataBuffer()).getValue()),
      tap(data => this.logger.debug('IN [PANELS_STATES]', data)),
      share(),
    );
  }

  sendMessage(message: MessageMeta) {
    message.updateChecksums();

    return this.connector.send(message.getUint8Array());
  }

  protected mapToMessageMeta(buffer: ArrayBuffer): MessageMeta {
    const meta = new MessageMeta();

    meta.loadFromBuffer(buffer);

    return meta;
  }
}
