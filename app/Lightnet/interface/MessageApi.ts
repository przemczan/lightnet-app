import { Observable } from 'rxjs';
import { MessageMeta } from '../api/message/MessageMeta';
import { MessageEdgeListModel } from '../api/model/message/MessageEdgeListModel';
import { MessagePanelsStatesModel } from '../api/model/message/MessagePanelsStatesModel';

export interface MessageApiInterface {
  incomingMessages$: Observable<MessageMeta>;
  messageEdgesList$: Observable<MessageEdgeListModel>;
  messagePanelsStates$: Observable<MessagePanelsStatesModel>;

  sendMessage(message: MessageMeta): void;
}
