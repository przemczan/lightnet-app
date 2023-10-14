import { EdgeInfo } from './edge-info';

export interface PanelInfo {
  id: number;
  edges: EdgeInfo[];
  rootEdge?: EdgeInfo;
}
