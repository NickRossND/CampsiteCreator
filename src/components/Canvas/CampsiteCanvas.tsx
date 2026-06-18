import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import type Konva from 'konva';
import { useCampsiteStore } from '../../store/campsiteStore';
import type { LCutCorner } from '../../types/campsite';
import { GridOverlay } from './GridOverlay';
import { CampsiteItem } from './CampsiteItem';

const PADDING = 32;
const MIN_SCALE = 0.15;
const MAX_SCALE = 10;
const WHEEL_STEP = 1.12;
const BTN_STEP = 1.35;

function getTouchDist(t1: Touch, t2: Touch) {
  return Math.sqrt((t2.clientX - t1.clientX) ** 2 + (t2.clientY - t1.clientY) ** 2);
}

function lShapePoints(
  w: number, h: number,
  cutW: number, cutH: number,
  corner: LCutCorner,
): number[] {
  const cw = Math.min(cutW, w - 1);
  const ch = Math.min(cutH, h - 1);
  switch (corner) {
    case 'top-right':    return [0,0, w-cw,0, w-cw,ch, w,ch, w,h, 0,h];
    case 'top-left':     return [cw,0, w,0, w,h, 0,h, 0,ch, cw,ch];
    case 'bottom-right': return [0,0, w,0, w,h-ch, w-cw,h-ch, w-cw,h, 0,h];
    case 'bottom-left':  return [0,0, w,0, w,h, cw,h, cw,h-ch, 0,h-ch];
  }
}

/** Scale the stage toward a given canvas-coordinate focal point. */
function applyZoom(stage: Konva.Stage, newScale: number, focalX: number, focalY: number) {
  const oldScale = stage.scaleX();
  const px = (focalX - stage.x()) / oldScale;
  const py = (focalY - stage.y()) / oldScale;
  const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
  stage.scale({ x: clamped, y: clamped });
  stage.position({ x: focalX - px * clamped, y: focalY - py * clamped });
  stage.batchDraw();
}

export function CampsiteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });
  const lastTouchDist = useRef(0);
  const lastTouchMid = useRef({ x: 0, y: 0 });

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

  // ── Deselect on empty-area click / single tap ──────────────────
  const handleMouseDown = useCallback((e: { target: { getStage: () => unknown; name: () => string } }) => {
    if (e.target === e.target.getStage() || e.target.name() === 'plot-bg') selectItem(null);
  }, [selectItem]);

  // ── Touch: single-tap deselect + pinch init ────────────────────
  const handleTouchStart = useCallback((e: { evt: TouchEvent; target: { getStage: () => unknown; name: () => string } }) => {
    const touches = e.evt.touches;
    if (touches.length === 1) {
      if (e.target === e.target.getStage() || e.target.name() === 'plot-bg') selectItem(null);
    }
    if (touches.length === 2) {
      lastTouchDist.current = getTouchDist(touches[0], touches[1]);
      lastTouchMid.current = {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
    }
  }, [selectItem]);

  // ── Pinch-to-zoom + two-finger pan ────────────────────────────
  const handleTouchMove = useCallback((e: { evt: TouchEvent }) => {
    const touches = e.evt.touches;
    if (touches.length < 2) return;

    const stage = stageRef.current;
    if (!stage) return;

    const t1 = touches[0];
    const t2 = touches[1];
    const dist = getTouchDist(t1, t2);
    const mid = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };

    if (lastTouchDist.current > 0) {
      const rect = stage.container().getBoundingClientRect();
      // Focal point in canvas pixel coords
      const fx = mid.x - rect.left;
      const fy = mid.y - rect.top;

      // Zoom toward pinch center
      applyZoom(stage, stage.scaleX() * (dist / lastTouchDist.current), fx, fy);

      // Additional pan from mid-point movement
      const dx = mid.x - lastTouchMid.current.x;
      const dy = mid.y - lastTouchMid.current.y;
      stage.position({ x: stage.x() + dx, y: stage.y() + dy });
      stage.batchDraw();
    }

    lastTouchDist.current = dist;
    lastTouchMid.current = mid;
  }, []);

  const handleTouchEnd = useCallback((e: { evt: TouchEvent }) => {
    if (e.evt.touches.length < 2) lastTouchDist.current = 0;
  }, []);

  // ── Mouse wheel zoom (desktop) ─────────────────────────────────
  const handleWheel = useCallback((e: { evt: WheelEvent }) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const newScale = stage.scaleX() * (e.evt.deltaY < 0 ? WHEEL_STEP : 1 / WHEEL_STEP);
    applyZoom(stage, newScale, pointer.x, pointer.y);
  }, []);

  // ── Zoom button helpers ────────────────────────────────────────
  const zoomBy = useCallback((factor: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    applyZoom(stage, stage.scaleX() * factor, canvasSize.width / 2, canvasSize.height / 2);
  }, [canvasSize]);

  const resetZoom = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
  }, []);

  const plotBackground = isLShaped ? (
    <Line
      name="plot-bg"
      points={lShapePoints(plotPxW, plotPxH, lCutWidth * pxPerFoot, lCutHeight * pxPerFoot, lCutCorner)}
      closed fill="#f0fdf4" stroke="#86efac" strokeWidth={2}
      shadowBlur={8} shadowColor="rgba(0,0,0,0.12)"
    />
  ) : (
    <Rect
      name="plot-bg" x={0} y={0} width={plotPxW} height={plotPxH}
      fill="#f0fdf4" stroke="#86efac" strokeWidth={2}
      shadowBlur={8} shadowColor="rgba(0,0,0,0.12)"
    />
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-slate-100 overflow-hidden relative"
      style={{ touchAction: 'none' }}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <Layer x={offsetX} y={offsetY}>
          {plotBackground}
          {showGrid && (
            <GridOverlay plotWidth={plotWidth} plotDepth={plotDepth} pxPerFoot={pxPerFoot} />
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

      {/* Zoom controls — floating bottom-right */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 select-none">
        <button
          onClick={() => zoomBy(BTN_STEP)}
          className="w-10 h-10 bg-white border border-slate-300 rounded-xl shadow-md text-slate-700 text-xl font-light hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center"
          aria-label="Zoom in"
        >+</button>
        <button
          onClick={resetZoom}
          className="w-10 h-10 bg-white border border-slate-300 rounded-xl shadow-md text-slate-500 text-xs hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center"
          aria-label="Reset zoom"
        >1:1</button>
        <button
          onClick={() => zoomBy(1 / BTN_STEP)}
          className="w-10 h-10 bg-white border border-slate-300 rounded-xl shadow-md text-slate-700 text-xl font-light hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center"
          aria-label="Zoom out"
        >−</button>
      </div>
    </div>
  );
}
