import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Svg, { G, Polygon } from 'react-native-svg';
import { combineLatest, mergeMap } from 'rxjs';
import { useSubscriptionUntilMounted } from '../../Middleware/RxJsHooks';
import { LightnetDeviceInterface } from '../../Lightnet/interface/LightnetDeviceInterface';
import { LightnetDevicePanelInterface } from '../../Lightnet/interface/LightnetDevicePanelInterface';
import { PanelState } from '../../Lightnet/model/PanelState';
import { LabeledActivityIndicator } from '../ActivityIndicator/LabeledActivityIndicator';
import { Containers } from '../Containers/Containers';
import { Point, Dimensions, GeometryUtils } from '../../Utils/GeometryUtils';

type LightnetDeviceVisualizerProps = {
  lightnetDevice: LightnetDeviceInterface;
  onPanelPointerIn?: (panel: LightnetDevicePanelInterface) => void;
  onPanelPointerOut?: (panel: LightnetDevicePanelInterface) => void;
  onPanelPointerPress?: (panel: LightnetDevicePanelInterface) => void;
};

const CONTENT_MARGIN = 10;
const POINTER_MOVE_MIN_DISTANCE = 4;

type PanelCoordinates = {
  panel: LightnetDevicePanelInterface;
  shape: number[];
  edges: Point[];
};

export function LightnetDeviceVisualizer({
  lightnetDevice,
  onPanelPointerOut,
  onPanelPointerPress,
  onPanelPointerIn,
}: LightnetDeviceVisualizerProps) {
  const [viewDimensions, setViewDimensions] = useState<Dimensions>();
  const [panels, setPanels] = useState<LightnetDevicePanelInterface[]>([]);
  const [panelsStates, setPanelsStates] = useState<Record<number, PanelState> | undefined>();
  const [panelsCoordinates, setPanelsCoordinates] = useState<PanelCoordinates[]>([]);
  const [hoveredPanel, setHoveredPanel] = useState<{
    prev?: LightnetDevicePanelInterface;
    curr?: LightnetDevicePanelInterface;
  }>({});
  const [pressStartedAt, setPressStartedAt] = useState<Point | undefined>();
  const [isPointerMoving, setIsPointerMoving] = useState<boolean>(false);

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
      Object.values(panels.layout.edgesCoords).forEach(edgeCoords => {
        offset[0] = Math.min(offset[0], edgeCoords.x1, edgeCoords.x2);
        offset[1] = Math.min(offset[1], edgeCoords.y1, edgeCoords.y2);
      });
    });

    return { x: Math.abs(offset[0]) + CONTENT_MARGIN, y: Math.abs(offset[1]) + CONTENT_MARGIN };
  }, [panels]);

  const getRawDimensions = useCallback(() => {
    const points: { x: number[]; y: number[] } = { x: [], y: [] };

    panels.forEach(({ layout }) => {
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
      if (!isPointerMoving) {
        if (pressStartedAt) {
          setIsPointerMoving(
            Math.abs(pressStartedAt.x - x) > POINTER_MOVE_MIN_DISTANCE ||
              Math.abs(pressStartedAt.y - y) > POINTER_MOVE_MIN_DISTANCE,
          );
        }

        return;
      }

      const panelCoords = panelsCoordinates.find(coords => GeometryUtils.isInsidePolygon(x, y, coords.edges));

      if (panelCoords?.panel !== hoveredPanel.curr) {
        setHoveredPanel({ prev: hoveredPanel.curr, curr: panelCoords?.panel });
      }
    },
    [isPointerMoving, panelsCoordinates, hoveredPanel, pressStartedAt],
  );

  const handlePointerDown = useCallback((x: number, y: number) => {
    setPressStartedAt({ x, y });
  }, []);

  const handlePointerUp = useCallback(
    (x: number, y: number) => {
      setHoveredPanel({});
      setPressStartedAt(undefined);
      setIsPointerMoving(false);

      if (!isPointerMoving) {
        const panelCoords = panelsCoordinates.find(coords => GeometryUtils.isInsidePolygon(x, y, coords.edges));

        if (panelCoords) {
          onPanelPointerPress?.(panelCoords.panel);
        }
      }
    },
    [isPointerMoving, onPanelPointerPress, panelsCoordinates],
  );

  useEffect(() => {
    const { curr, prev } = hoveredPanel;

    if (curr && curr?.info.id !== prev?.info.id) {
      onPanelPointerIn?.(curr);
    }
    if (prev && curr?.info.id !== prev.info.id) {
      onPanelPointerOut?.(prev);
    }
  }, [hoveredPanel, onPanelPointerIn, onPanelPointerOut]);

  useSubscriptionUntilMounted(
    useMemo(
      () =>
        lightnetDevice?.onLoaded$.pipe(
          mergeMap(([availablePanels]) => {
            setPanels(availablePanels);

            return combineLatest(availablePanels.map(panel => panel.state$));
          }),
        ),
      [lightnetDevice],
    ),
    useCallback(states => {
      setPanelsStates(states.reduce((merged, state) => ({ ...merged, [state.panelId]: state }), {}));
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

    panels.forEach(panel => {
      coordinates.push({
        panel: panel,
        shape: generateShapePoints(panel, offset, scale),
        edges: generateEdgesPoints(panel, offset, scale),
      });
    });

    setPanelsCoordinates(coordinates);
  }, [calculateScale, generateEdgesPoints, generateShapePoints, getOffset, getRawDimensions, panels, viewDimensions]);

  if (!panels.length || !panelsStates) {
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
      onPointerMove={e => handlePointerMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
      onPointerDown={e => handlePointerDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
      onPointerUp={e => handlePointerUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}>
      {viewDimensions && (
        <Svg height={viewDimensions.height} width={viewDimensions.width}>
          <G>
            {panelsCoordinates.map(coordinates => (
              <G key={coordinates.panel.info.id}>
                <Polygon
                  points={coordinates.shape.join(' ')}
                  stroke="#888"
                  strokeLinejoin="round"
                  fill="#000"
                  strokeWidth="3"
                />
                <Polygon
                  points={coordinates.shape.join(' ')}
                  fillOpacity={
                    panelsStates[coordinates.panel.info.id].on
                      ? panelsStates[coordinates.panel.info.id].brightness / 255
                      : 0
                  }
                  fill={`rgb(${panelsStates[coordinates.panel.info.id].color.r}, ${
                    panelsStates[coordinates.panel.info.id].color.g
                  }, ${panelsStates[coordinates.panel.info.id].color.b})`}
                />
              </G>
            ))}
          </G>
        </Svg>
      )}
    </View>
  );
}
