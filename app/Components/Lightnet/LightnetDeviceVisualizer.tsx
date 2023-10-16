import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { G, Polygon } from 'react-native-svg';
import { combineLatest, of, switchMap } from 'rxjs';
import { useSubscriptionUntilMounted } from '../../Hooks/RxJsHooks';
import { LightnetDeviceInterface } from '../../Lightnet/interface/LightnetDeviceInterface';
import { LightnetDevicePanelInterface } from '../../Lightnet/interface/LightnetDevicePanelInterface';
import { PanelState } from '../../Lightnet/model/PanelState';
import { LabeledActivityIndicator } from '../ActivityIndicator/LabeledActivityIndicator';
import { Containers } from '../Containers/Containers';
import { Point, Dimensions, Utils } from './Utils';

type LightnetDeviceVisualizerProps = {
  lightnetDevice: LightnetDeviceInterface;
};

const CONTENT_MARGIN = 10;

type PanelInfo = {
  panel: LightnetDevicePanelInterface;
  state: PanelState;
};

type PanelCoordinates = {
  panelInfo: PanelInfo;
  shape: number[];
  edges: Point[];
};

export function LightnetDeviceVisualizer({ lightnetDevice }: LightnetDeviceVisualizerProps) {
  const [viewDimensions, setViewDimensions] = useState<Dimensions>();
  const [panels, setPanels] = useState<PanelInfo[]>([]);
  const [panelsCoordinates, setPanelsCoordinates] = useState<PanelCoordinates[]>([]);

  const translatePoint = (point: Point, offset: Point, scale: number): Point => {
    return {
      x: (point.x + offset.x) * scale,
      y: (point.y + offset.y) * scale,
    };
  };

  const generateShapePoints = useCallback((panel: LightnetDevicePanelInterface, offset: Point, scale: number) => {
    const edgesCoords = Object.values(panel.layout.edgesCoords);
    const points = [];

    if (edgesCoords.length) {
      points.push((edgesCoords[0].x1 + offset.x) * scale, (edgesCoords[0].y1 + offset.y) * scale);

      for (let index = 0; index < edgesCoords.length; index++) {
        points.push((edgesCoords[index].x2 + offset.x) * scale, (edgesCoords[index].y2 + offset.y) * scale);
      }
    }

    return points;
  }, []);

  const generateEdgesPoints = useCallback((panel: LightnetDevicePanelInterface, offset: Point, scale: number) => {
    const edgesCoords = Object.values(panel.layout.edgesCoords);
    const points = [];

    if (edgesCoords.length) {
      points.push(translatePoint({ x: edgesCoords[0].x1, y: edgesCoords[0].y1 }, offset, scale));

      for (let index = 0; index < edgesCoords.length; index++) {
        points.push(translatePoint({ x: edgesCoords[index].x2, y: edgesCoords[index].y2 }, offset, scale));
      }
    }

    return points;
  }, []);

  const getOffset = useCallback(() => {
    const offset: [number, number] = [0, 0];

    panels.forEach(panels => {
      Object.values(panels.panel.layout.edgesCoords).forEach(edgeCoords => {
        offset[0] = Math.min(offset[0], edgeCoords.x1, edgeCoords.x2);
        offset[1] = Math.min(offset[1], edgeCoords.y1, edgeCoords.y2);
      });
    });

    return { x: Math.abs(offset[0]) + CONTENT_MARGIN, y: Math.abs(offset[1]) + CONTENT_MARGIN };
  }, [panels]);

  const getRawDimensions = useCallback(() => {
    const points: { x: number[]; y: number[] } = { x: [], y: [] };

    panels.forEach(({ panel: { layout } }) => {
      Object.values(layout.edgesCoords).forEach(edgeCoords => {
        points.x.push(edgeCoords.x1, edgeCoords.x2);
        points.y.push(edgeCoords.y1, edgeCoords.y2);
      });
    });

    if (!points.x.length || !points.y.length) {
      return { width: 0, height: 0 };
    }

    return {
      width: Math.max(...points.x) - Math.min(...points.x) + CONTENT_MARGIN * 2,
      height: Math.max(...points.y) - Math.min(...points.y) + CONTENT_MARGIN * 2,
    };
  }, [panels]);

  const calculateScale = useCallback(
    (rawDimensions: Dimensions) => {
      if (!viewDimensions) {
        return 1;
      }

      return Math.abs(
        Math.min(
          (viewDimensions.width - CONTENT_MARGIN * 2) / rawDimensions.width,
          (viewDimensions.height - CONTENT_MARGIN * 2) / rawDimensions.height,
        ),
      );
    },
    [viewDimensions],
  );

  const handlePointerMove = useCallback(
    (x: number, y: number) => {
      const hoveredPanel = panelsCoordinates.find(coords => Utils.isInsidePolygon(x, y, coords.edges));
      console.log(hoveredPanel?.panelInfo.state);
    },
    [panelsCoordinates],
  );

  useSubscriptionUntilMounted(
    lightnetDevice?.onLoaded$.pipe(
      switchMap(([availablePanels, layouts]) =>
        combineLatest([of(availablePanels), of(layouts), combineLatest(availablePanels.map(panel => panel.state$))]),
      ),
    ),
    useCallback(([availablePanels, _, states]) => {
      setPanels(
        availablePanels.map(panel => ({
          panel,
          state: states.find(state => state.panelId === panel.info.id)!,
        })),
      );
    }, []),
  );

  useEffect(() => {
    if (!panels.length || !viewDimensions) {
      return;
    }

    const offset = getOffset();
    const rawDimensions = getRawDimensions();
    const scale = calculateScale(rawDimensions);
    const coordinates: PanelCoordinates[] = [];

    panels.forEach(panelInfo => {
      coordinates.push({
        panelInfo,
        shape: generateShapePoints(panelInfo.panel, offset, scale),
        edges: generateEdgesPoints(panelInfo.panel, offset, scale),
      });
    });

    setPanelsCoordinates(coordinates);
  }, [calculateScale, generateEdgesPoints, generateShapePoints, getOffset, getRawDimensions, panels, viewDimensions]);

  if (!panels.length) {
    return (
      <Containers.Centered>
        <LabeledActivityIndicator />
      </Containers.Centered>
    );
  }

  return (
    <View
      style={{ width: '100%', height: '100%' }}
      onLayout={e => setViewDimensions({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      onPointerMove={e => handlePointerMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}>
      {viewDimensions && (
        <Svg height={viewDimensions.height} width={viewDimensions.width}>
          <G>
            {panelsCoordinates.map(coordinates => (
              <G key={coordinates.panelInfo.panel.info.id}>
                <Polygon
                  points={coordinates.shape.join(' ')}
                  stroke="#888"
                  strokeLinejoin="round"
                  fill="#000"
                  strokeWidth="3"
                />
                <Polygon
                  points={coordinates.shape.join(' ')}
                  fillOpacity={coordinates.panelInfo.state.on ? coordinates.panelInfo.state.brightness / 255 : 0}
                  fill={`rgb(${coordinates.panelInfo.state.color.r}, ${coordinates.panelInfo.state.color.g}, ${coordinates.panelInfo.state.color.b})`}
                />
              </G>
            ))}
          </G>
        </Svg>
      )}
    </View>
  );
}
