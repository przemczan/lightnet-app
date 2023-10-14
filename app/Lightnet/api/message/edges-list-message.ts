import { MessageMeta } from './message-meta';
import { MessageType } from '../message-type';
import { MessageEdgesListModel } from '../model/message/message-edges-list-model';
import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { MessageEdgesListMapping } from '../mapping/message/message-edges-list-mapping';

export class EdgesListMessage extends MessageMeta<MessageEdgesListModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.EDGES_LIST;
    data.edgesList = [];
    data.length = 0;

    this.setValue(data);
  }

  protected createMapping(): CompositeDataMapping<MessageEdgesListModel> {
    return new MessageEdgesListMapping(this.dataBuffer);
  }
}
