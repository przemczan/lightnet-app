import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { HeaderModel } from '../model/header-model';
import { Uint16Mapping } from '../../data-mapping/uint16-mapping';
import { Uint32Mapping } from '../../data-mapping/uint32-mapping';
import { Uint8Mapping } from '../../data-mapping/uint8-mapping';

export class HeaderMapping extends CompositeDataMapping<HeaderModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('type', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('protocolVersion', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('nonce', new Uint32Mapping(this.dataBuffer));

    return this;
  }
}
