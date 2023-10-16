import { MessageMetaMapping } from './MessageMetaMapping';
import { MessageToggleModel } from '../../model/message/MessageToggleModel';
import { Uint8Mapping } from '../../../data-mapping/Uint8Mapping';

export class MessageToggleMapping extends MessageMetaMapping<MessageToggleModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('address', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('on', new Uint8Mapping(this.dataBuffer));

    return this;
  }
}
