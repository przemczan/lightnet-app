import { MessageMeta } from './MessageMeta';
import { MessageType } from '../MessageType';
import { MessageEdgeListModel } from '../model/message/MessageEdgeListModel';
import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { MessageEdgesListMapping } from '../mapping/message/MessageEdgesListMapping';

export class EdgeListMessage extends MessageMeta<MessageEdgeListModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.EDGES_LIST;
    data.edgesList = [];
    data.length = 0;

    this.setValue(data);
  }

  protected createMapping(): CompositeDataMapping<MessageEdgeListModel> {
    return new MessageEdgesListMapping(this.dataBuffer);
  }
}
