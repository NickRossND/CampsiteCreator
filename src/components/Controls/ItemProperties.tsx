import { useEffect, useCallback, useState, useRef } from 'react';
import { useCampsiteStore } from '../../store/campsiteStore';
import { definitionMap } from '../../data/itemDefinitions';

interface NumericFieldProps {
  label: string;
  value: number;
  onCommit: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function NumericField({ label, value, onCommit, min, max, step }: NumericFieldProps) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);

  // Sync display from store whenever value changes externally (e.g. drag)
  useEffect(() => {
    if (!focused.current) {
      setDraft(String(value));
    }
  }, [value]);

  const commit = useCallback(() => {
    const n = parseFloat(draft);
    if (!isNaN(n) && (min === undefined || n >= min) && (max === undefined || n <= max)) {
      onCommit(n);
    } else {
      setDraft(String(value)); // revert invalid input
    }
  }, [draft, value, min, max, onCommit]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-16 flex-shrink-0">{label}</span>
      <input
        type="number"
        value={draft}
        min={min}
        max={max}
        step={step}
        onChange={e => setDraft(e.target.value)}
        onFocus={() => { focused.current = true; }}
        onBlur={() => {
          focused.current = false;
          commit();
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            commit();
            (e.target as HTMLInputElement).blur();
          }
          if (e.key === 'Escape') {
            setDraft(String(value));
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
      />
    </div>
  );
}

export function ItemProperties() {
  const { items, selectedId, updateItem, deleteItem, selectItem } = useCampsiteStore();
  const item = items.find(i => i.instanceId === selectedId);
  const [labelDraft, setLabelDraft] = useState('');

  useEffect(() => {
    setLabelDraft(item?.label ?? '');
  }, [item?.instanceId, item?.label]);

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-sm flex-shrink-0"
          style={{ backgroundColor: def?.color }}
        />
        <span className="text-sm font-semibold text-slate-700 truncate">{def?.name}</span>
      </div>

      {/* Label — text field, commits on blur/Enter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 w-16 flex-shrink-0">Label</span>
        <input
          type="text"
          value={labelDraft}
          placeholder={def?.name}
          onChange={e => setLabelDraft(e.target.value)}
          onBlur={() => updateItem(item.instanceId, { label: labelDraft || undefined })}
          onKeyDown={e => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') {
              setLabelDraft(item.label ?? '');
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
        />
      </div>

      <NumericField label="Width (ft)"  value={parseFloat(item.width.toFixed(2))}    onCommit={v => updateItem(item.instanceId, { width: v })}    min={0.5} step={0.5} />
      <NumericField label="Depth (ft)"  value={parseFloat(item.depth.toFixed(2))}    onCommit={v => updateItem(item.instanceId, { depth: v })}    min={0.5} step={0.5} />
      <NumericField label="Height (ft)" value={parseFloat(item.height.toFixed(2))}   onCommit={v => updateItem(item.instanceId, { height: v })}   min={0}   step={0.5} />
      <NumericField label="Rotation °"  value={Math.round(item.rotation)}            onCommit={v => updateItem(item.instanceId, { rotation: v })} min={-360} max={360} step={5} />
      <NumericField label="X pos (ft)"  value={parseFloat(item.x.toFixed(2))}        onCommit={v => updateItem(item.instanceId, { x: v })}                  step={0.5} />
      <NumericField label="Y pos (ft)"  value={parseFloat(item.y.toFixed(2))}        onCommit={v => updateItem(item.instanceId, { y: v })}                  step={0.5} />

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
