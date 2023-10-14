import { PanelInfo } from './panel-info';

export interface EdgeInfo {
  index: number;
  panel: PanelInfo;
  connectedEdge?: EdgeInfo;
}
