import { PanelLayout } from './model/panel-layout';
import { PanelInfo } from './model/panel-info';
import { EdgeCoords } from './model/edge-coords';

type LayoutsMap = {
  [key in number]: PanelLayout;
};

export class PanelsLayoutService {
  static generateLayout(panelsList: PanelInfo[], edgeLength = 100): PanelLayout[] {
    const layouts: LayoutsMap = {};

    panelsList.forEach(panelInfo => {
      layouts[panelInfo.id] = this.buildLayout(panelInfo, layouts, edgeLength);
    });

    return Object.values(layouts);
  }

  protected static buildLayout(panelInfo: PanelInfo, layouts: LayoutsMap, edgeLength: number): PanelLayout {
    const layout: PanelLayout = {
      panelId: panelInfo.id,
      edgesCoords: {},
    };

    panelInfo.edges.forEach((edgeInfo, index) => {
      layout.edgesCoords[edgeInfo.index] = this.generateEdgeCoords(layout, panelInfo, index, edgeLength);
    });

    const parentEdgeCoords = this.getParentEdgeCoords(panelInfo, layouts);

    if (parentEdgeCoords) {
      const rootEdge = layout.edgesCoords[panelInfo.rootEdge.index];

      this.movePanel(
        layout,
        parentEdgeCoords.x2 - rootEdge.x1,
        parentEdgeCoords.y2 - rootEdge.y1
      );

      this.rotatePanel(
        layout,
        parentEdgeCoords.x2,
        parentEdgeCoords.y2,
        this.angleBetweenPoints(
          parentEdgeCoords.x1 - parentEdgeCoords.x2,
          parentEdgeCoords.y1 - parentEdgeCoords.y2,
          rootEdge.x2 - rootEdge.x1,
          rootEdge.y2 - rootEdge.y1
        )
      );
    }

    return layout;
  }

  private static angleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
    return Math.round(Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2) * 180 / Math.PI);
  }

  private static movePanel(panelLayout: PanelLayout, dx: number, dy: number) {
    Object.values(panelLayout.edgesCoords).forEach(coords => {
      coords.x1 += dx;
      coords.x2 += dx;
      coords.y1 += dy;
      coords.y2 += dy;
    });
  }

  private static rotatePanel(panelLayout: PanelLayout, cx: number, cy: number, degrees: number) {
    Object.values(panelLayout.edgesCoords).forEach(coords => {
      [coords.x1, coords.y1] = this.rotatePoint(cx, cy, coords.x1, coords.y1, degrees);
      [coords.x2, coords.y2] = this.rotatePoint(cx, cy, coords.x2, coords.y2, degrees);
    });
  }

  private static rotatePoint(cx: number, cy: number, x: number, y: number, degrees: number): [number, number] {
    const radians = (Math.PI / 180) * degrees,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    return [Math.round(nx), Math.round(ny)];
  }

  private static getParentEdgeCoords(panelInfo: PanelInfo, layouts: LayoutsMap): EdgeCoords | undefined {
    if (!panelInfo.rootEdge) {
      return undefined;
    }

    const parentLayout = layouts[panelInfo.rootEdge.connectedEdge.panel.id];

    return parentLayout.edgesCoords[panelInfo.rootEdge.connectedEdge.index];
  }

  private static generateEdgeCoords(layout: PanelLayout, panelInfo: PanelInfo, edgeIndex: number, edgeLength: number): EdgeCoords {
    const angleStep = 360 / panelInfo.edges.length;
    const radiansFactor = Math.PI / 180;
    const radians = angleStep * edgeIndex * radiansFactor;

    const x1 = edgeIndex ? layout.edgesCoords[edgeIndex - 1].x2 : 0;
    const y1 = edgeIndex ? layout.edgesCoords[edgeIndex - 1].y2 : 0;

    return {
      x1,
      y1,
      x2: Math.round(x1 + edgeLength * Math.cos(radians)),
      y2: Math.round(y1 + edgeLength * Math.sin(radians)),
    };
  }
}
