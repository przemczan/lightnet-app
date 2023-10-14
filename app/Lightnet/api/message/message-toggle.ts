import { MessageMeta } from './message-meta';
import { MessageType } from '../message-type';
import { MessageToggleModel } from '../model/message/message-toggle-model';
import { MessageToggleMapping } from '../mapping/message/message-toggle-mapping';
import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';

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
