import type { ItemDefinition } from '../../types/campsite';
import { useCampsiteStore } from '../../store/campsiteStore';

interface ItemCardProps {
  def: ItemDefinition;
}

export function ItemCard({ def }: ItemCardProps) {
  const addItem = useCampsiteStore(s => s.addItem);

  return (
    <button
      onClick={() => addItem(def)}
      className="w-full flex items-center gap-2 px-3 py-3 md:py-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors text-left group"
      title={`${def.name} — ${def.defaultWidth}×${def.defaultDepth} ft`}
    >
      <span
        className="w-4 h-4 rounded flex-shrink-0 border border-white/30"
        style={{ backgroundColor: def.color }}
      />
      <span className="text-sm text-slate-700 group-hover:text-slate-900 truncate">
        {def.name}
      </span>
      <span className="ml-auto text-xs text-slate-400 flex-shrink-0">
        {def.defaultWidth}×{def.defaultDepth}
      </span>
    </button>
  );
}
