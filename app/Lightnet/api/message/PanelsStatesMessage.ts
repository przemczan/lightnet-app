import { MessageMeta } from './MessageMeta';
import { MessageType } from '../MessageType';
import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { MessagePanelsStatesModel } from '../model/message/MessagePanelsStatesModel';
import { MessagePanelsStatesMapping } from '../mapping/message/MessagePanelsStatesMapping';

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
