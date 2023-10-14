import { PanelEdgeInfoModel } from './api/model/panel-edge-info-model';

export class PanelsGeneratorService {
  static generateEdges(panelsNumber: number, minEdges: number, maxEdges: number): PanelEdgeInfoModel[] {
    let id = 1;
    const edges: PanelEdgeInfoModel[] = [];
    const takenEdges: PanelEdgeInfoModel[] = [];

    while (panelsNumber--) {
      PanelsGeneratorService.generatePanelEdges(id++, minEdges, maxEdges, edges, takenEdges);
    }

    return edges;
  }

  private static generatePanelEdges(
    id: number,
    minEdges: number,
    maxEdges: number,
    edges: PanelEdgeInfoModel[],
    takenEdges: PanelEdgeInfoModel[]
  ) {
    let edgesCount = PanelsGeneratorService.randomInt(maxEdges, minEdges);
    const rootEdgeIndex = edges.length ? PanelsGeneratorService.randomInt(edgesCount - 1) : -1;
    let parentEdge: PanelEdgeInfoModel;

    if (edges.length) {
      do {
        parentEdge = edges[ PanelsGeneratorService.randomInt(edges.length - 1) ];
      } while (takenEdges.find(item => item === parentEdge));

      takenEdges.push(parentEdge);
      parentEdge.connectedPanelId = id;
      parentEdge.connectedEdgeIndex = rootEdgeIndex;
    }

    while (edgesCount--) {
      const edge = {
        panelId: id,
        edgeIndex: edgesCount,
        connectedPanelId: 0,
        connectedEdgeIndex: 0,
      };

      edges.push(edge);

      if (edge.edgeIndex === rootEdgeIndex) {
        takenEdges.push(edge);
      }
    }
  }

  private static randomInt(max: number, min: number = 0): number {
    return Math.round(Math.random() * (max - min) + min);
  }
}
