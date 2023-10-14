import { MessageMetaMapping } from './message-meta-mapping';
import { MessageToggleModel } from '../../model/message/message-toggle-model';
import { Uint8Mapping } from '../../../data-mapping/uint8-mapping';

export class MessageToggleMapping extends MessageMetaMapping<MessageToggleModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('address', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('on', new Uint8Mapping(this.dataBuffer));

    return this;
  }
}
