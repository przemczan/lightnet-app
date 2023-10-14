import { ColorRgbModel } from '../api/model/color-rgb-model';

export interface PanelState {
  panelId: number;
  on: boolean;
  color: ColorRgbModel;
  brightness: number;
}
