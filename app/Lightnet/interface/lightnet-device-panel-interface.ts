import { Observable } from 'rxjs';
import { PanelInfo } from '../model/panel-info';
import { PanelLayout } from '../model/panel-layout';
import { PanelState } from '../model/panel-state';
import { ColorRgbModel } from '../api/model/color-rgb-model';

export interface LightnetDevicePanelInterface {
  info: PanelInfo,
  layout: PanelLayout;
  state$: Observable<PanelState>;

  setColor(color: ColorRgbModel): void;
  toggle(on?: boolean): void;
  turnOn(): void;
  turnOff(): void;
  isOn(): boolean;
}
