import { MessageMeta } from './message-meta';
import { MessageType } from '../message-type';
import { MessageMetaModel } from '../model/message/message-meta-model';

export class GetEdgesListMessage extends MessageMeta<MessageMetaModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.GET_EDGES_LIST;

    this.setValue(data);
  }
}
