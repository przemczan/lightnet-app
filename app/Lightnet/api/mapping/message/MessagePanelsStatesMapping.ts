import { MessagePanelsStatesModel } from '../../model/message/MessagePanelsStatesModel';
import { Uint16Mapping } from '../../../data-mapping/Uint16Mapping';
import { ArrayDataMapping } from '../../../data-mapping/ArrayDataMapping';
import { PanelStateMapping } from '../PanelStateMapping';
import { PanelStateModel } from '../../model/PanelStateModel';
import { MessageMetaMapping } from './MessageMetaMapping';

export class MessagePanelsStatesMapping extends MessageMetaMapping<MessagePanelsStatesModel> {
  setUp(): this {
    super.setUp();

    this.pushMapping('length', new Uint16Mapping(this.dataBuffer));
    this.pushMapping(
      'panelsStates',
      new ArrayDataMapping<PanelStateModel>(
        this.dataBuffer,
        () => new PanelStateMapping(this.dataBuffer),
        this.mappings.find('length'),
      ),
    );

    return this;
  }
}
