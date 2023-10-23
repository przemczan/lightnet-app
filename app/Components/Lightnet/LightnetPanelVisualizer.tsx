import { useCallback, useEffect, useState } from 'react';
import { G, Polygon } from 'react-native-svg';
import { useSubscriptionUntilMounted } from '../../Middleware/RxJsHooks';
import { LightnetDevicePanelInterface } from '../../Lightnet/interface/LightnetDevicePanelInterface';
import { PanelState } from '../../Lightnet/model/PanelState';

type LightnetDeviceVisualizerProps = {
  panel: LightnetDevicePanelInterface;
};

export function LightnetPanelVisualizer({ panel }: LightnetDeviceVisualizerProps) {
  const [shapePoints, setShapePoints] = useState<number[]>([]);
  const [panelState, setPanelState] = useState<PanelState | undefined>();

  const generateShapePoints = useCallback(() => {
    const points = [];
    const edgesCoords = Object.values(panel.layout.edgesCoords);

    if (!edgesCoords.length) {
      return;
    }

    points.push(edgesCoords[0].x1, edgesCoords[0].y1);

    for (let index = 0; index < edgesCoords.length; index++) {
      points.push(edgesCoords[index].x2, edgesCoords[index].y2);
    }

    setShapePoints(points);
  }, [panel]);

  useEffect(() => {
    generateShapePoints();
  }, [generateShapePoints]);

  useSubscriptionUntilMounted(
    panel.state$,
    useCallback(state => {
      setPanelState(state);
    }, []),
  );

  if (!panelState) {
    return null;
  }

  console.log('rendered!');

  return (
    <G>
      <Polygon points={shapePoints.join(' ')} stroke="#888" strokeLinejoin="round" fill="#000" strokeWidth="3" />
      <Polygon
        points={shapePoints.join(' ')}
        fillOpacity={panelState.on ? panelState.brightness / 255 : 0}
        fill={`rgb(${panelState.color.r}, ${panelState.color.g}, ${panelState.color.b})`}></Polygon>
    </G>
  );
}
