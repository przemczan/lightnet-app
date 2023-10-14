import { LightnetDevicePanelInterface } from './interface/lightnet-device-panel-interface';
import { Observable, Subject } from 'rxjs';
import { PanelState } from './model/panel-state';
import { PanelInfo } from './model/panel-info';
import { PanelLayout } from './model/panel-layout';
import { LightnetDeviceInterface } from './interface/lightnet-device-interface';
import { filter, map } from 'rxjs/operators';
import { MessageToggle } from './api/message/message-toggle';
import { MessageSetColor } from './api/message/message-set-color';
import { ColorRgbModel } from './api/model/color-rgb-model';

export class LightnetDevicePanel implements LightnetDevicePanelInterface {
  private state: PanelState = {
    on: false,
    brightness: 255,
    color: {
      r: 255, g: 255, b: 255
    },
    panelId: 0,
  };
  private readonly _state$: Observable<PanelState>;
  private readonly stateSubject = new Subject<PanelState>();

  constructor(
    private readonly _device: LightnetDeviceInterface,
    private readonly _info: PanelInfo,
    private readonly _layout: PanelLayout,
    private readonly panelsStates$: Observable<PanelState[]>
  ) {
    this._state$ = this.stateSubject.asObservable();

    panelsStates$
      .pipe(
        map(states => states.find(state => state.panelId === _info.id)),
        filter(state => !!state),
      )
      .subscribe(state => {
        this.state = state;
        this.stateSubject.next(state);
      });
  }

  setColor(color: ColorRgbModel): void {
    this.state.color = color;

    // @ts-ignore
    this._device.sendMessage(new MessageSetColor(this._info.id, color));
    this.stateSubject.next(this.state);
  }

  toggle(on?: boolean): void {
    this.state.on = typeof on === 'undefined' ? !this.state.on : on;

    // @ts-ignore
    this._device.sendMessage(new MessageToggle(this._info.id, this.state.on));
    this.stateSubject.next(this.state);
  }

  turnOff(): void {
    this.toggle(false);
  }

  turnOn(): void {
    this.toggle(true);
  }

  isOn(): boolean {
    return this.state.on;
  }

  get state$(): Observable<PanelState> {
    return this._state$;
  }

  get info(): PanelInfo {
    return this._info;
  }

  get layout(): PanelLayout {
    return this._layout;
  }
}
