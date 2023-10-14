import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { Uint16Mapping } from '../../data-mapping/uint16-mapping';
import { PanelEdgeInfoModel } from '../model/panel-edge-info-model';

export class PanelEdgeInfoMapping extends CompositeDataMapping<PanelEdgeInfoModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('panelId', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('edgeIndex', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('connectedPanelId', new Uint16Mapping(this.dataBuffer));
    this.pushMapping('connectedEdgeIndex', new Uint16Mapping(this.dataBuffer));

    return this;
  }
}
