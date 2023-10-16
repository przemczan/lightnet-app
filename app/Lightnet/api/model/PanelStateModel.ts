import { ColorRgbModel } from './ColorRgbModel';

export interface PanelStateModel {
  panelId: number;
  on: boolean;
  color: ColorRgbModel;
  brightness: number;
}
