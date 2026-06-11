import { useEffect, useCallback } from 'react';
import { useCampsiteStore } from '../../store/campsiteStore';
import { definitionMap } from '../../data/itemDefinitions';

export function ItemProperties() {
  const { items, selectedId, updateItem, deleteItem, selectItem } = useCampsiteStore();
  const item = items.find(i => i.instanceId === selectedId);

  const handleDelete = useCallback(() => {
    if (selectedId) deleteItem(selectedId);
  }, [selectedId, deleteItem]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') handleDelete();
      }
      if (e.key === 'Escape') selectItem(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, handleDelete, selectItem]);

  if (!item) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-slate-400 italic">Click an item on the canvas to select it.</p>
      </div>
    );
  }

  const def = definitionMap.get(item.definitionId);

  const field = (
    label: string,
    value: number | string,
    onChange: (v: string) => void,
    type: 'number' | 'text' = 'number',
    extra?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-16 flex-shrink-0">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
        {...extra}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-sm flex-shrink-0"
          style={{ backgroundColor: def?.color }}
        />
        <span className="text-sm font-semibold text-slate-700 truncate">{def?.name}</span>
      </div>

      {field('Label', item.label ?? '', v => updateItem(item.instanceId, { label: v || undefined }), 'text', { placeholder: def?.name })}
      {field('Width (ft)', Number(item.width.toFixed(2)), v => { const n = parseFloat(v); if (n > 0) updateItem(item.instanceId, { width: n }); }, 'number', { min: 0.5, step: 0.5 })}
      {field('Depth (ft)', Number(item.depth.toFixed(2)), v => { const n = parseFloat(v); if (n > 0) updateItem(item.instanceId, { depth: n }); }, 'number', { min: 0.5, step: 0.5 })}
      {field('Height (ft)', Number(item.height.toFixed(2)), v => { const n = parseFloat(v); if (n >= 0) updateItem(item.instanceId, { height: n }); }, 'number', { min: 0, step: 0.5 })}
      {field('Rotation (°)', Math.round(item.rotation), v => { const n = parseFloat(v); if (!isNaN(n)) updateItem(item.instanceId, { rotation: n }); }, 'number', { min: -360, max: 360, step: 5 })}
      {field('X pos (ft)', Number(item.x.toFixed(2)), v => { const n = parseFloat(v); if (!isNaN(n)) updateItem(item.instanceId, { x: n }); }, 'number', { step: 0.5 })}
      {field('Y pos (ft)', Number(item.y.toFixed(2)), v => { const n = parseFloat(v); if (!isNaN(n)) updateItem(item.instanceId, { y: n }); }, 'number', { step: 0.5 })}

      <button
        onClick={handleDelete}
        className="mt-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
      >
        Delete item
      </button>
      <p className="text-xs text-slate-400">or press Delete / Backspace</p>
    </div>
  );
}
