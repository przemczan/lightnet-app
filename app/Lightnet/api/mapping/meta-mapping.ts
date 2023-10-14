import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { Uint16Mapping } from '../../data-mapping/uint16-mapping';
import { HeaderMapping } from './header-mapping';
import { MetaModel } from '../model/meta-model';
import { EmptyMapping } from '../../data-mapping/empty-mapping';

export class MetaMapping extends CompositeDataMapping<MetaModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('header', new HeaderMapping(this.dataBuffer));
    this.pushMapping('headerCrc', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('payloadCrc', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('payloadSize', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('payload', new EmptyMapping(this.dataBuffer));

    return this;
  }
}
