import { PanelInfo } from './model/PanelInfo';
import { PanelsListService } from './PanelsList.service';
import { map } from 'rxjs/operators';
import { PanelStateModel } from './api/model/PanelStateModel';
import { GetPanelsStatesMessage } from './api/message/GetPanelsStatesMessage';
import { BehaviorSubject, Observable } from 'rxjs';
import { PanelState } from './model/PanelState';
import { MessageApiInterface } from './interface/MessageApi';

export class PanelsStatesService {
  public readonly states$: Observable<PanelState[]>;

  protected statesSubject: BehaviorSubject<PanelState[]> = new BehaviorSubject<PanelState[]>([]);

  constructor(
    protected readonly messageApiService: MessageApiInterface,
    protected readonly panelsListService: PanelsListService,
  ) {
    this.states$ = this.statesSubject.asObservable();

    this.panelsListService.panels$.subscribe(list => this.onPanelsListLoaded(list));

    this.messageApiService.messagePanelsStates$
      .pipe(map(data => data.panelsStates))
      .subscribe((states: PanelStateModel[]) => this.onPanelsStatesLoaded(states));
  }

  refresh() {
    this.messageApiService.sendMessage(new GetPanelsStatesMessage());
  }

  protected onPanelsStatesLoaded(states: PanelStateModel[]) {
    this.statesSubject.next(
      states.map(state => ({
        panelId: state.panelId,
        on: state.on,
        color: state.color,
        brightness: state.brightness,
      })),
    );
  }

  protected onPanelsListLoaded(panelsList: PanelInfo[]) {
    this.refresh();
  }
}
