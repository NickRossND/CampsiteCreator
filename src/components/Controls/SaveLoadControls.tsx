import { useRef, useState } from 'react';
import { useCampsiteStore } from '../../store/campsiteStore';
import type { CampsiteConfig } from '../../store/campsiteStore';

export function SaveLoadControls() {
  const { getConfig, loadConfig } = useCampsiteStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const config = getConfig();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campsite-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string) as CampsiteConfig;
        if (typeof raw.plotWidth !== 'number' || !Array.isArray(raw.items)) {
          throw new Error('Unrecognized file format.');
        }
        loadConfig(raw);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not read file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // allow re-loading the same file
  };

  return (
    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
      <button
        onClick={handleSave}
        title="Download campsite as a JSON file"
        className="flex items-center gap-1 px-2.5 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
        </svg>
        Save file
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        title="Load a previously saved campsite file"
        className="flex items-center gap-1 px-2.5 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 hover:border-slate-400 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 8l4-4m0 0l4 4m-4-4v12" />
        </svg>
        Load file
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleLoad}
        className="hidden"
      />
    </div>
  );
}
