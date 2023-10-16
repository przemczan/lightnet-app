import { PanelInfo } from './PanelInfo';

export interface EdgeInfo {
  index: number;
  panel: PanelInfo;
  connectedEdge?: EdgeInfo;
}
