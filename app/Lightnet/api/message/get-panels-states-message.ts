import { MessageMeta } from './message-meta';
import { MessageType } from '../message-type';
import { MessageMetaModel } from '../model/message/message-meta-model';

export class GetPanelsStatesMessage extends MessageMeta<MessageMetaModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.GET_PANELS_STATES;

    this.setValue(data);
  }
}
