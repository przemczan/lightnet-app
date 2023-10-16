import { Observable } from 'rxjs';
import { PanelInfo } from '../model/PanelInfo';
import { PanelLayout } from '../model/PanelLayout';
import { PanelState } from '../model/PanelState';
import { ColorRgbModel } from '../api/model/ColorRgbModel';

export interface LightnetDevicePanelInterface {
  info: PanelInfo;
  layout: PanelLayout;
  state$: Observable<PanelState>;

  setColor(color: ColorRgbModel): void;
  toggle(on?: boolean): void;
  turnOn(): void;
  turnOff(): void;
  isOn(): boolean;
}
