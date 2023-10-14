import { EdgeCoords } from './edge-coords';

export interface PanelLayout {
  panelId: number;
  edgesCoords: {
    [key in number]: EdgeCoords
  };
}
