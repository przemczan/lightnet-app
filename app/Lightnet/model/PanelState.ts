import { ColorRgbModel } from '../api/model/ColorRgbModel';

export interface PanelState {
  panelId: number;
  on: boolean;
  color: ColorRgbModel;
  brightness: number;
}
