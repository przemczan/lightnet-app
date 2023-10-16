import { EdgeInfo } from './EdgeInfo';

export interface PanelInfo {
  id: number;
  edges: EdgeInfo[];
  rootEdge?: EdgeInfo;
}
