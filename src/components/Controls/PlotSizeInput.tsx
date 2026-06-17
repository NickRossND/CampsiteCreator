import { useState, useEffect } from 'react';
import { useCampsiteStore } from '../../store/campsiteStore';
import type { LCutCorner } from '../../types/campsite';

const CORNER_OPTIONS: { value: LCutCorner; label: string }[] = [
  { value: 'top-right',    label: 'Top-right' },
  { value: 'top-left',     label: 'Top-left' },
  { value: 'bottom-right', label: 'Bottom-right' },
  { value: 'bottom-left',  label: 'Bottom-left' },
];

export function PlotSizeInput() {
  const {
    plotWidth, plotDepth, setPlotSize,
    isLShaped, lCutCorner, lCutWidth, lCutHeight, setLShape,
    showGrid, snapToGrid, toggleGrid, toggleSnap,
  } = useCampsiteStore();

  const [w, setW] = useState(String(plotWidth));
  const [d, setD] = useState(String(plotDepth));
  const [lEnabled, setLEnabled] = useState(isLShaped);
  const [corner, setCorner] = useState<LCutCorner>(lCutCorner);
  const [cutW, setCutW] = useState(String(lCutWidth));
  const [cutD, setCutD] = useState(String(lCutHeight));

  // Sync local input state when the store changes externally (file load / localStorage restore)
  useEffect(() => { setW(String(plotWidth)); },  [plotWidth]);
  useEffect(() => { setD(String(plotDepth)); },  [plotDepth]);
  useEffect(() => { setLEnabled(isLShaped); },   [isLShaped]);
  useEffect(() => { setCorner(lCutCorner); },    [lCutCorner]);
  useEffect(() => { setCutW(String(lCutWidth)); }, [lCutWidth]);
  useEffect(() => { setCutD(String(lCutHeight)); }, [lCutHeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = parseFloat(w);
    const pd = parseFloat(d);
    if (pw > 0 && pd > 0) setPlotSize(pw, pd);

    if (lEnabled) {
      const cw = Math.min(parseFloat(cutW) || pw / 2, pw - 1);
      const cd = Math.min(parseFloat(cutD) || pd / 2, pd - 1);
      setLShape(true, corner, cw, cd);
    } else {
      setLShape(false, corner, parseFloat(cutW) || lCutWidth, parseFloat(cutD) || lCutHeight);
    }
  };

  const handleLToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setLEnabled(enabled);
    // Apply immediately so the canvas updates without needing "Set"
    const pw = parseFloat(w) || plotWidth;
    const pd = parseFloat(d) || plotDepth;
    const cw = Math.min(parseFloat(cutW) || pw / 2, pw - 1);
    const cd = Math.min(parseFloat(cutD) || pd / 2, pd - 1);
    setLShape(enabled, corner, cw, cd);
  };

  const handleCornerChange = (newCorner: LCutCorner) => {
    setCorner(newCorner);
    if (lEnabled) {
      const cw = Math.min(parseFloat(cutW) || lCutWidth, plotWidth - 1);
      const cd = Math.min(parseFloat(cutD) || lCutHeight, plotDepth - 1);
      setLShape(true, newCorner, cw, cd);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-wrap">
        {/* Plot dimensions */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Plot:</span>
          <input
            type="number" min="5" max="500" value={w}
            onChange={e => setW(e.target.value)}
            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="W"
          />
          <span className="text-slate-400 text-sm">×</span>
          <input
            type="number" min="5" max="500" value={d}
            onChange={e => setD(e.target.value)}
            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="D"
          />
          <span className="text-sm text-slate-400">ft</span>
        </div>

        {/* L-shape cut dimensions — shown only when enabled */}
        {lEnabled && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Cut:</span>
            <input
              type="number" min="1" value={cutW}
              onChange={e => setCutW(e.target.value)}
              className="w-16 px-2 py-1 text-sm border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="W"
            />
            <span className="text-slate-400 text-sm">×</span>
            <input
              type="number" min="1" value={cutD}
              onChange={e => setCutD(e.target.value)}
              className="w-16 px-2 py-1 text-sm border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="D"
            />
            <span className="text-sm text-slate-400">ft</span>
          </div>
        )}

        <button
          type="submit"
          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Set
        </button>

        {/* Toggles */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={showGrid} onChange={toggleGrid} className="rounded" />
            <span className="text-sm text-slate-600">Grid</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={snapToGrid} onChange={toggleSnap} className="rounded" />
            <span className="text-sm text-slate-600">Snap</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={lEnabled}
              onChange={handleLToggle}
              className="rounded accent-amber-500"
            />
            <span className="text-sm text-slate-600 font-medium">L-shape</span>
          </label>
        </div>
      </form>

      {/* Corner picker — shown inline below when L-shape is on */}
      {lEnabled && (
        <div className="flex items-center gap-2 pl-1">
          <span className="text-xs text-slate-500">Cut corner:</span>
          {CORNER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleCornerChange(opt.value)}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                corner === opt.value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
