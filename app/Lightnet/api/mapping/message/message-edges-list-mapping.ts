import { MessageMetaMapping } from './message-meta-mapping';
import { MessageEdgesListModel } from '../../model/message/message-edges-list-model';
import { Uint16Mapping } from '../../../data-mapping/uint16-mapping';
import { ArrayDataMapping } from '../../../data-mapping/array-data-mapping';
import { PanelEdgeInfoModel } from '../../model/panel-edge-info-model';
import { PanelEdgeInfoMapping } from '../panel-edge-info-mapping';

export class MessageEdgesListMapping extends MessageMetaMapping<MessageEdgesListModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('length', new Uint16Mapping(this.dataBuffer));
    this.pushMapping(
      'edgesList',
      new ArrayDataMapping<PanelEdgeInfoModel>(
        this.dataBuffer,
        () => new PanelEdgeInfoMapping(this.dataBuffer),
        this.mappings.find('length'),
      )
    );

    return this;
  }
}
