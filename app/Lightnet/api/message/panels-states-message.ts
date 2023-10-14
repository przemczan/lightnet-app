import { MessageMeta } from './message-meta';
import { MessageType } from '../message-type';
import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { MessagePanelsStatesModel } from '../model/message/message-panels-states-model';
import { MessagePanelsStatesMapping } from '../mapping/message/message-panels-states-mapping';

export class PanelsStatesMessage extends MessageMeta<MessagePanelsStatesModel> {
  constructor() {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.PANELS_STATES;
    data.panelsStates = [];
    data.length = 0;

    this.setValue(data);
  }

  protected createMapping(): CompositeDataMapping<MessagePanelsStatesModel> {
    return new MessagePanelsStatesMapping(this.dataBuffer);
  }
}
