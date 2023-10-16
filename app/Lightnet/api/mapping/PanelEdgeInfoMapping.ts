import { CompositeDataMapping } from '../../data-mapping/CompositeDataMapping';
import { Uint16Mapping } from '../../data-mapping/Uint16Mapping';
import { PanelEdgeInfoModel } from '../model/PanelEdgeInfoModel';

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
