import { CompositeDataMapping } from '@src/app/data-mapping/composite-data-mapping';
import { MetaMapping } from '../meta-mapping';
import { MessageMetaModel } from '../../model/message/message-meta-model';

export class MessageMetaMapping<T> extends CompositeDataMapping<T & MessageMetaModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('meta', new MetaMapping(this.dataBuffer));

    return this;
  }
}
