import { MessageMetaMapping } from './message-meta-mapping';
import { Uint8Mapping } from '../../../data-mapping/uint8-mapping';
import { MessageSetColorModel } from '../../model/message/message-set-color-model';
import { ColorRgbMapping } from '../color-rgb-mapping';

export class MessageSetColorMapping extends MessageMetaMapping<MessageSetColorModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('address', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('color', new ColorRgbMapping(this.dataBuffer));

    return this;
  }
}
