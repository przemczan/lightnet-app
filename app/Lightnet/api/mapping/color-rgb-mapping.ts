import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { Uint8Mapping } from '../../data-mapping/uint8-mapping';
import { ColorRgbModel } from '../model/color-rgb-model';

export class ColorRgbMapping extends CompositeDataMapping<ColorRgbModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('r', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('g', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('b', new Uint8Mapping(this.dataBuffer));

    return this;
  }
}
