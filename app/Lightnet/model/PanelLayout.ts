import { EdgeCoords } from './EdgeCoords';

export interface PanelLayout {
  panelId: number;
  edgesCoords: {
    [key in number]: EdgeCoords;
  };
}
