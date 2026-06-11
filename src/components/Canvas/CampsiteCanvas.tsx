import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useCampsiteStore } from '../../store/campsiteStore';
import { GridOverlay } from './GridOverlay';
import { CampsiteItem } from './CampsiteItem';

const PADDING = 32; // px padding inside canvas container

export function CampsiteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  const { plotWidth, plotDepth, items, selectedId, showGrid, selectItem } = useCampsiteStore();

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

  return (
    <div ref={containerRef} className="flex-1 bg-slate-100 overflow-hidden">
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage() || e.target.name() === 'plot-bg') {
            selectItem(null);
          }
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage() || e.target.name() === 'plot-bg') {
            selectItem(null);
          }
        }}
      >
        <Layer x={offsetX} y={offsetY}>
          {/* Plot background */}
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
