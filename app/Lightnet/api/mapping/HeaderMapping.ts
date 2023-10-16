import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { HeaderModel } from '../model/HeaderModel';
import { Uint16Mapping } from '../../data-mapping/Uint16Mapping';
import { Uint32Mapping } from '../../data-mapping/Uint32Mapping';
import { Uint8Mapping } from '../../data-mapping/Uint8Mapping';

export class HeaderMapping extends CompositeDataMapping<HeaderModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('type', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('protocolVersion', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('nonce', new Uint32Mapping(this.dataBuffer));

    return this;
  }
}
