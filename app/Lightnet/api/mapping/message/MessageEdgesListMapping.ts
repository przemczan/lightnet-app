import { MessageMetaMapping } from './MessageMetaMapping';
import { MessageEdgeListModel } from '../../model/message/MessageEdgeListModel';
import { Uint16Mapping } from '../../../data-mapping/Uint16Mapping';
import { ArrayDataMapping } from '../../../data-mapping/ArrayDataMapping';
import { PanelEdgeInfoModel } from '../../model/PanelEdgeInfoModel';
import { PanelEdgeInfoMapping } from '../PanelEdgeInfoMapping';

export class MessageEdgesListMapping extends MessageMetaMapping<MessageEdgeListModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('length', new Uint16Mapping(this.dataBuffer));
    this.pushMapping(
      'edgesList',
      new ArrayDataMapping<PanelEdgeInfoModel>(
        this.dataBuffer,
        () => new PanelEdgeInfoMapping(this.dataBuffer),
        this.mappings.find('length'),
      ),
    );

    return this;
  }
}
