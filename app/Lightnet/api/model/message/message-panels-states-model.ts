import { MetaModel } from '../meta-model';
import { PanelStateModel } from '../panel-state-model';

export interface MessagePanelsStatesModel {
  meta: MetaModel;
  length: number;
  panelsStates: PanelStateModel[];
}
