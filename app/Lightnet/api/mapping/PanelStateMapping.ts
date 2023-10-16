import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { Uint16Mapping } from '../../data-mapping/Uint16Mapping';
import { PanelStateModel } from '../model/PanelStateModel';
import { Uint8Mapping } from '../../data-mapping/Uint8Mapping';
import { ColorRgbMapping } from './ColorRgbMapping';

export class PanelStateMapping extends CompositeDataMapping<PanelStateModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('panelId', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('on', new Uint8Mapping(this.dataBuffer));
    this.pushMapping('color', new ColorRgbMapping(this.dataBuffer));
    this.pushMapping('brightness', new Uint8Mapping(this.dataBuffer));

    return this;
  }
}
