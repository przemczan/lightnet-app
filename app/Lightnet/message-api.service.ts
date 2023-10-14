import { MessageMeta } from './api/message/message-meta';
import { Observable } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { MessageEdgesListModel } from './api/model/message/message-edges-list-model';
import { MessageType } from './api/message-type';
import { MessageEdgesListMapping } from './api/mapping/message/message-edges-list-mapping';
import { NGXLogger } from 'ngx-logger';
import { LoggerWrapper } from '../logger.wrapper';
import { MessagePanelsStatesModel } from './api/model/message/message-panels-states-model';
import { MessagePanelsStatesMapping } from './api/mapping/message/message-panels-states-mapping';
import { MessageApiInterface } from './interface/message-api';
import { MessageApiConnectorInterface } from './interface/message-api-connector';

export class MessageApiService implements MessageApiInterface {
  public readonly incomingMessages$: Observable<MessageMeta>;
  public readonly messageEdgesList$: Observable<MessageEdgesListModel>;
  public readonly messagePanelsStates$: Observable<MessagePanelsStatesModel>;

  private readonly logger: LoggerWrapper;

  constructor(private connector: MessageApiConnectorInterface, logger: NGXLogger) {
    this.logger = new LoggerWrapper(logger, MessageApiService.name);

    this.incomingMessages$ = connector.messages$
      .pipe(
        map(buffer => this.mapToMessageMeta(buffer)),
        filter(meta => {
          const errorCode = meta.isValid();

          if (errorCode) {
            this.logger.debug('INVALID', errorCode);
          }

          return errorCode === MessageMeta.OK;
        }),
        tap(meta => this.logger.debug('IN [META]', meta.getValue())),
        share()
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
