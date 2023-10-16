import { MetaModel } from '../MetaModel';
import { PanelStateModel } from '../PanelStateModel';

export interface MessagePanelsStatesModel {
  meta: MetaModel;
  length: number;
  panelsStates: PanelStateModel[];
}
