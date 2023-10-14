import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { Uint16Mapping } from '../../data-mapping/uint16-mapping';
import { PanelStateModel } from '../model/panel-state-model';
import { Uint8Mapping } from '../../data-mapping/uint8-mapping';
import { ColorRgbMapping } from './color-rgb-mapping';

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
