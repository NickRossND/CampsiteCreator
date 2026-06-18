import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useCampsiteStore } from '../../store/campsiteStore';
import type { LCutCorner } from '../../types/campsite';
import { GridOverlay } from './GridOverlay';
import { CampsiteItem } from './CampsiteItem';

const PADDING = 32;

/** Returns the 6-point polygon (flat [x,y,x,y,...]) for an L-shape. */
function lShapePoints(
  w: number, h: number,
  cutW: number, cutH: number,
  corner: LCutCorner,
): number[] {
  // Clamp cut so it never exceeds the plot
  const cw = Math.min(cutW, w - 1);
  const ch = Math.min(cutH, h - 1);

  switch (corner) {
    case 'top-right':
      return [0, 0,  w - cw, 0,  w - cw, ch,  w, ch,  w, h,  0, h];
    case 'top-left':
      return [cw, 0,  w, 0,  w, h,  0, h,  0, ch,  cw, ch];
    case 'bottom-right':
      return [0, 0,  w, 0,  w, h - ch,  w - cw, h - ch,  w - cw, h,  0, h];
    case 'bottom-left':
      return [0, 0,  w, 0,  w, h,  cw, h,  cw, h - ch,  0, h - ch];
  }
}

export function CampsiteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  const {
    plotWidth, plotDepth,
    isLShaped, lCutCorner, lCutWidth, lCutHeight,
    items, selectedId, showGrid, selectItem,
  } = useCampsiteStore();

  const updateSize = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setCanvasSize({ width: clientWidth, height: clientHeight });
  }, []);

  useEffect(() => {
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateSize]);

  const availW = canvasSize.width - PADDING * 2;
  const availH = canvasSize.height - PADDING * 2;
  const pxPerFoot = Math.min(availW / plotWidth, availH / plotDepth);

  const plotPxW = plotWidth * pxPerFoot;
  const plotPxH = plotDepth * pxPerFoot;

  const offsetX = (canvasSize.width - plotPxW) / 2;
  const offsetY = (canvasSize.height - plotPxH) / 2;

  const handleDeselect = (e: { target: { getStage: () => unknown; name: () => string } }) => {
    if (e.target === e.target.getStage() || e.target.name() === 'plot-bg') {
      selectItem(null);
    }
  };

  const plotBackground = isLShaped ? (
    <Line
      name="plot-bg"
      points={lShapePoints(plotPxW, plotPxH, lCutWidth * pxPerFoot, lCutHeight * pxPerFoot, lCutCorner)}
      closed
      fill="#f0fdf4"
      stroke="#86efac"
      strokeWidth={2}
      shadowBlur={8}
      shadowColor="rgba(0,0,0,0.12)"
    />
  ) : (
    <Rect
      name="plot-bg"
      x={0}
      y={0}
      width={plotPxW}
      height={plotPxH}
      fill="#f0fdf4"
      stroke="#86efac"
      strokeWidth={2}
      shadowBlur={8}
      shadowColor="rgba(0,0,0,0.12)"
    />
  );

  return (
    <div ref={containerRef} className="flex-1 bg-slate-100 overflow-hidden" style={{ touchAction: 'none' }}>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleDeselect}
        onTouchStart={handleDeselect}
      >
        <Layer x={offsetX} y={offsetY}>
          {plotBackground}

          {showGrid && (
            <GridOverlay
              plotWidth={plotWidth}
              plotDepth={plotDepth}
              pxPerFoot={pxPerFoot}
            />
          )}

          {items.map(item => (
            <CampsiteItem
              key={item.instanceId}
              item={item}
              pxPerFoot={pxPerFoot}
              isSelected={item.instanceId === selectedId}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
