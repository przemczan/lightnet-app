import { LoggerInterface } from './LoggerInterface';
import { PanelInfo } from './model/PanelInfo';
import { MessageEdgeListModel } from './api/model/message/MessageEdgeListModel';
import { GetEdgeListMessage } from './api/message/GetEdgeListMessage';
import { BehaviorSubject, Observable } from 'rxjs';
import { EdgeInfo } from './model/EdgeInfo';
import { filter, first, tap } from 'rxjs/operators';
import { MessageApiInterface } from './interface/MessageApi';

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

  constructor(protected readonly messageApiService: MessageApiInterface, private readonly logger: LoggerInterface) {
    this.panels$ = this.panelsSubject.asObservable().pipe(
      filter(panels => panels.length > 0),
      tap(panels => this.logger.debug(panels)),
    );
  }

  load() {
    this.messageApiService.messageEdgesList$.pipe(first()).subscribe(message => this.onEdgesListMessage(message));

    this.messageApiService.sendMessage(new GetEdgeListMessage());
  }

  protected onEdgesListMessage(message: MessageEdgeListModel) {
    const panelsList = this.groupEdgesListByPanel(message);
    const panels: PanelInfo[] = [];

    if (panelsList.length) {
      this.buildPanels(panelsList[0], null, panelsList, panels);
    }

    this.panelsSubject.next((this.panels = panels));
  }

  protected buildPanels(
    panel: RawPanelInfo,
    parentEdge: RawEdgeInfo,
    panelsList: RawPanelInfo[],
    output: PanelInfo[],
  ): PanelInfo {
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
        nextPanel = this.buildPanels(
          panelsList.find(item => item.panelId === edge.nextPanelId),
          edge,
          panelsList,
          output,
        );
        edgeInfo.connectedEdge = nextPanel.edges.find(edgeElement => edgeElement.index === edge.nextEdgeIndex);
        edgeInfo.connectedEdge.connectedEdge = edgeInfo;
      }
    });

    if (parentEdge) {
      panelInfo.rootEdge = panelInfo.edges.find(edgeInfo => edgeInfo.index === parentEdge.nextEdgeIndex);
    }

    return panelInfo;
  }

  protected groupEdgesListByPanel(message: MessageEdgeListModel): RawPanelInfo[] {
    const panels: RawPanelInfo[] = [];

    message.edgesList.forEach(edge => {
      if (typeof panels[edge.panelId] === 'undefined') {
        panels[edge.panelId] = {
          panelId: edge.panelId,
          edges: [],
        };
      }

      panels[edge.panelId].edges.push({
        index: edge.edgeIndex,
        panelId: edge.panelId,
        nextPanelId: edge.connectedPanelId,
        nextEdgeIndex: edge.connectedEdgeIndex,
      });
    });

    Object.values(panels).forEach(
      panel => (panel.edges = panel.edges.sort((edge1, edge2) => edge1.index - edge2.index)),
    );

    return Object.values(panels).sort((panel1, panel2) => panel1.panelId - panel2.panelId);
  }
}
