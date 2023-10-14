import { Observable } from 'rxjs';
import { MessageMeta } from '../api/message/message-meta';
import { MessageEdgesListModel } from '../api/model/message/message-edges-list-model';
import { MessagePanelsStatesModel } from '../api/model/message/message-panels-states-model';
import { InjectionToken } from '@angular/core';

export const messageApi = new InjectionToken<MessageApiInterface>('MessageApiInterface');

export interface MessageApiInterface {
  incomingMessages$: Observable<MessageMeta>;
  messageEdgesList$: Observable<MessageEdgesListModel>;
  messagePanelsStates$: Observable<MessagePanelsStatesModel>;

  sendMessage(message: MessageMeta): void;
}
