import { MessagePanelsStatesModel } from '../../model/message/message-panels-states-model';
import { Uint16Mapping } from '../../../data-mapping/uint16-mapping';
import { ArrayDataMapping } from '../../../data-mapping/array-data-mapping';
import { PanelStateMapping } from '../panel-state-mapping';
import { PanelStateModel } from '../../model/panel-state-model';
import { MessageMetaMapping } from './message-meta-mapping';

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
      )
    );

    return this;
  }
}
