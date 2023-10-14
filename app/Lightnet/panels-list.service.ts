import { PanelInfo } from './model/panel-info';
import { MessageEdgesListModel } from './api/model/message/message-edges-list-model';
import { GetEdgesListMessage } from './api/message/get-edges-list-message';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inject } from '@angular/core';
import { EdgeInfo } from './model/edge-info';
import { filter, first, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { LoggerWrapper } from '../logger.wrapper';
import { messageApi, MessageApiInterface } from './interface/message-api';

interface RawEdgeInfo {
  index: number;
  panelId: number;
  nextPanelId: number;
  nextEdgeIndex: number;
}

interface RawPanelInfo {
  panelId: number;
  edges: RawEdgeInfo[];
}

export class PanelsListService {
  public readonly panels$: Observable<PanelInfo[]>;

  protected panelsSubject = new BehaviorSubject<PanelInfo[]>([]);
  protected panels: PanelInfo[] = [];
  protected logger: LoggerWrapper;

  constructor(@Inject(messageApi) protected readonly messageApiService: MessageApiInterface, logger: NGXLogger) {
    this.logger = new LoggerWrapper(logger, PanelsListService.name);
    this.panels$ = this.panelsSubject.asObservable()
      .pipe(
        filter(panels => panels.length > 0),
        tap(panels => this.logger.debug(panels)),
      );
  }

  load() {
    this.messageApiService.messageEdgesList$
      .pipe(first())
      .subscribe(message => this.onEdgesListMessage(message));

    this.messageApiService.sendMessage(new GetEdgesListMessage());
  }

  protected onEdgesListMessage(message: MessageEdgesListModel) {
    const panelsList = this.groupEdgesListByPanel(message);
    const panels: PanelInfo[] = [];

    if (panelsList.length) {
      this.buildPanels(panelsList[ 0 ], null, panelsList, panels);
    }

    this.panelsSubject.next(this.panels = panels);
  }

  protected buildPanels(panel: RawPanelInfo, parentEdge: RawEdgeInfo, panelsList: RawPanelInfo[], output: PanelInfo[]): PanelInfo {
    const panelInfo: PanelInfo = {
      id: panel.panelId,
      edges: [],
    };

    output.push(panelInfo);

    panel.edges.forEach(edge => {
      const edgeInfo: EdgeInfo = {
        index: edge.index,
        panel: panelInfo,
      };
      let nextPanel: PanelInfo;

      panelInfo.edges.push(edgeInfo);

      if ((!parentEdge || parentEdge.nextEdgeIndex !== edge.index) && edge.nextPanelId) {
        nextPanel = this.buildPanels(panelsList.find(item => item.panelId === edge.nextPanelId), edge, panelsList, output);
        edgeInfo.connectedEdge = nextPanel.edges.find(edgeElement => edgeElement.index === edge.nextEdgeIndex);
        edgeInfo.connectedEdge.connectedEdge = edgeInfo;
      }
    });

    if (parentEdge) {
      panelInfo.rootEdge = panelInfo.edges.find(edgeInfo => edgeInfo.index === parentEdge.nextEdgeIndex);
    }

    return panelInfo;
  }

  protected groupEdgesListByPanel(message: MessageEdgesListModel): RawPanelInfo[] {
    const panels: RawPanelInfo[] = [];

    message.edgesList.forEach(
      edge => {
        if (typeof panels[ edge.panelId ] === 'undefined') {
          panels[ edge.panelId ] = {
            panelId: edge.panelId,
            edges: [],
          };
        }

        panels[ edge.panelId ].edges.push({
          index: edge.edgeIndex,
          panelId: edge.panelId,
          nextPanelId: edge.connectedPanelId,
          nextEdgeIndex: edge.connectedEdgeIndex,
        });
      }
    );

    Object.values(panels).forEach(panel =>
      panel.edges = panel.edges.sort((edge1, edge2) => edge1.index - edge2.index)
    );

    return Object.values(panels).sort((panel1, panel2) => panel1.panelId - panel2.panelId);
  }
}
