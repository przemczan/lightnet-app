import { MessageMeta } from './MessageMeta';
import { MessageType } from '../MessageType';
import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { MessageSetColorModel } from '../model/message/MessageSetColorModel';
import { ColorRgbModel } from '../model/ColorRgbModel';
import { MessageSetColorMapping } from '../mapping/message/MessageSetColorMapping';

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
