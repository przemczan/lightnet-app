import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { Uint8Mapping } from '../../data-mapping/Uint8Mapping';
import { ColorRgbModel } from '../model/ColorRgbModel';

export class ColorRgbMapping extends CompositeDataMapping<ColorRgbModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('r', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('g', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('b', new Uint8Mapping(this.dataBuffer));

    return this;
  }
}
