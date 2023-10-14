import { PanelInfo } from './model/panel-info';
import { Inject } from '@angular/core';
import { PanelsListService } from './panels-list.service';
import { pluck } from 'rxjs/operators';
import { PanelStateModel } from './api/model/panel-state-model';
import { GetPanelsStatesMessage } from './api/message/get-panels-states-message';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanelState } from './model/panel-state';
import { messageApi, MessageApiInterface } from './interface/message-api';

export class PanelsStatesService {
  public readonly states$: Observable<PanelState[]>;

  protected statesSubject: BehaviorSubject<PanelState[]> = new BehaviorSubject([]);

  constructor(
    @Inject(messageApi) protected readonly messageApiService: MessageApiInterface,
    protected readonly panelsListService: PanelsListService
  ) {
    this.states$ = this.statesSubject.asObservable();

    this.panelsListService.panels$
      .subscribe(list => this.onPanelsListLoaded(list));

    this.messageApiService.messagePanelsStates$
      .pipe(pluck('panelsStates'))
      .subscribe((states: PanelStateModel[]) => this.onPanelsStatesLoaded(states));
  }

  refresh() {
    this.messageApiService.sendMessage(new GetPanelsStatesMessage());
  }

  protected onPanelsStatesLoaded(states: PanelStateModel[]) {
    this.statesSubject.next(states.map(state => ({
      panelId: state.panelId,
      on: state.on,
      color: state.color,
      brightness: state.brightness,
    })));
  }

  protected onPanelsListLoaded(panelsList: PanelInfo[]) {
    this.refresh();
  }
}
