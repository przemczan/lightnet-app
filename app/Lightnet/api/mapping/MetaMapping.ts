import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { Uint16Mapping } from '../../data-mapping/Uint16Mapping';
import { HeaderMapping } from './HeaderMapping';
import { MetaModel } from '../model/MetaModel';
import { EmptyMapping } from '../../data-mapping/EmptyMapping';

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
