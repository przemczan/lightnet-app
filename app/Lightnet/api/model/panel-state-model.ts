import { ColorRgbModel } from './color-rgb-model';

export interface PanelStateModel {
  panelId: number;
  on: boolean;
  color: ColorRgbModel;
  brightness: number;
}
