import { useState } from 'react';
import { useCampsiteStore } from '../../store/campsiteStore';

export function PlotSizeInput() {
  const { plotWidth, plotDepth, setPlotSize, showGrid, snapToGrid, toggleGrid, toggleSnap } = useCampsiteStore();
  const [w, setW] = useState(String(plotWidth));
  const [d, setD] = useState(String(plotDepth));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pw = parseFloat(w);
    const pd = parseFloat(d);
    if (pw > 0 && pd > 0) setPlotSize(pw, pd);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Plot size:</span>
        <input
          type="number"
          min="5"
          max="500"
          value={w}
          onChange={e => setW(e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Width"
        />
        <span className="text-slate-400 text-sm">×</span>
        <input
          type="number"
          min="5"
          max="500"
          value={d}
          onChange={e => setD(e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Depth"
        />
        <span className="text-sm text-slate-400">ft</span>
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Set
        </button>
      </form>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={toggleGrid}
            className="rounded"
          />
          <span className="text-sm text-slate-600">Grid</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={toggleSnap}
            className="rounded"
          />
          <span className="text-sm text-slate-600">Snap (0.5 ft)</span>
        </label>
      </div>
    </div>
  );
}
