import { MetaModel } from '../MetaModel';
import { PanelEdgeInfoModel } from '../PanelEdgeInfoModel';

export interface MessageEdgeListModel {
  meta: MetaModel;
  length: number;
  edgesList: PanelEdgeInfoModel[];
}
