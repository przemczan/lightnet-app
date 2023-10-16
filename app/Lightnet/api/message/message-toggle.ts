import { MessageMeta } from './MessageMeta';
import { MessageType } from '../MessageType';
import { MessageToggleModel } from '../model/message/MessageToggleModel';
import { MessageToggleMapping } from '../mapping/message/MessageToggleMapping';
import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';

export class MessageToggle extends MessageMeta<MessageToggleModel> {
  constructor(address: number, on: boolean) {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.TOGGLE;
    data.address = address;
    data.on = on;

    this.setValue(data);
  }

  protected createMapping(): CompositeDataMapping<MessageToggleModel> {
    return new MessageToggleMapping(this.dataBuffer);
  }
}
