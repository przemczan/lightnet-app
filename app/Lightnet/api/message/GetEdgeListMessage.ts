import { MessageMeta } from './MessageMeta';
import { MessageType } from '../MessageType';
import { MessageMetaModel } from '../model/message/MessageMetaModel';

export class GetEdgeListMessage extends MessageMeta<MessageMetaModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.GET_EDGES_LIST;

    this.setValue(data);
  }
}
