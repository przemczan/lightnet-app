import { CompositeDataMapping } from '../../../data-mapping/CompositeDataMapping';
import { MetaMapping } from '../MetaMapping';
import { MessageMetaModel } from '../../model/message/MessageMetaModel';

export class MessageMetaMapping<T> extends CompositeDataMapping<T & MessageMetaModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('meta', new MetaMapping(this.dataBuffer));

    return this;
  }
}
