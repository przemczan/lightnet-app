import { MessageMeta } from './message-meta';
import { MessageType } from '../message-type';
import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { MessageSetColorModel } from '../model/message/message-set-color-model';
import { ColorRgbModel } from '../model/color-rgb-model';
import { MessageSetColorMapping } from '../mapping/message/message-set-color-mapping';

export class MessageSetColor extends MessageMeta<MessageSetColorModel> {
  constructor(address: number, color: ColorRgbModel) {
    super();

    const data = this.getValue();

    data.meta.header.type = MessageType.SET_COLOR;
    data.address = address;
    data.color = color;

    this.setValue(data);
  }

  protected createMapping(): CompositeDataMapping<MessageSetColorModel> {
    return new MessageSetColorMapping(this.dataBuffer);
  }
}
