import { CampsiteCanvas } from './components/Canvas/CampsiteCanvas';
import { ItemPalette } from './components/Sidebar/ItemPalette';
import { PlotSizeInput } from './components/Controls/PlotSizeInput';
import { ItemProperties } from './components/Controls/ItemProperties';

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center gap-6 px-4 py-2 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-700">Campsite Creator</span>
          <span className="text-xs text-slate-400 hidden sm:block">— music festival layout tool</span>
        </div>
        <PlotSizeInput />
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — item palette */}
        <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col p-3 overflow-hidden">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Items
          </h2>
          <ItemPalette />
          <p className="text-xs text-slate-400 mt-3 flex-shrink-0">
            Click an item to add it to the plot.
          </p>
        </aside>

        {/* Canvas */}
        <CampsiteCanvas />

        {/* Right panel — item properties */}
        <aside className="w-52 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col p-3 overflow-y-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Properties
          </h2>
          <ItemProperties />
        </aside>
      </div>
    </div>
  );
}
