import { MessageMeta } from './MessageMeta';
import { MessageType } from '../MessageType';
import { MessageMetaModel } from '../model/message/MessageMetaModel';

export class GetPanelsStatesMessage extends MessageMeta<MessageMetaModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.GET_PANELS_STATES;

    this.setValue(data);
  }
}
