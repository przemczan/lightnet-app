import { MessageMetaMapping } from './MessageMetaMapping';
import { Uint8Mapping } from '../../../data-mapping/Uint8Mapping';
import { MessageSetColorModel } from '../../model/message/MessageSetColorModel';
import { ColorRgbMapping } from '../ColorRgbMapping';

export class MessageSetColorMapping extends MessageMetaMapping<MessageSetColorModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('address', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('color', new ColorRgbMapping(this.dataBuffer));

    return this;
  }
}
