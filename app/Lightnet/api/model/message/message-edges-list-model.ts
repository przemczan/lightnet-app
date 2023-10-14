import { MetaModel } from '../meta-model';
import { PanelEdgeInfoModel } from '../panel-edge-info-model';

export interface MessageEdgesListModel {
  meta: MetaModel;
  length: number;
  edgesList: PanelEdgeInfoModel[];
}
