import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PlacedItem, ItemDefinition, LCutCorner } from '../types/campsite';

interface CampsiteStore {
  plotWidth: number;
  plotDepth: number;
  isLShaped: boolean;
  lCutCorner: LCutCorner;
  lCutWidth: number;
  lCutHeight: number;
  items: PlacedItem[];
  selectedId: string | null;
  showGrid: boolean;
  snapToGrid: boolean;

  setPlotSize: (width: number, depth: number) => void;
  setLShape: (enabled: boolean, corner: LCutCorner, cutWidth: number, cutHeight: number) => void;
  addItem: (def: ItemDefinition) => void;
  updateItem: (instanceId: string, changes: Partial<PlacedItem>) => void;
  deleteItem: (instanceId: string) => void;
  selectItem: (instanceId: string | null) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
}

export const useCampsiteStore = create<CampsiteStore>((set, get) => ({
  plotWidth: 40,
  plotDepth: 40,
  isLShaped: false,
  lCutCorner: 'top-right',
  lCutWidth: 20,
  lCutHeight: 20,
  items: [],
  selectedId: null,
  showGrid: true,
  snapToGrid: false,

  setPlotSize: (width, depth) => set({ plotWidth: width, plotDepth: depth }),

  setLShape: (enabled, corner, cutWidth, cutHeight) =>
    set({ isLShaped: enabled, lCutCorner: corner, lCutWidth: cutWidth, lCutHeight: cutHeight }),

  addItem: (def) => {
    const { plotWidth, plotDepth } = get();
    const x = plotWidth / 2;
    const y = plotDepth / 2;
    const item: PlacedItem = {
      instanceId: uuidv4(),
      definitionId: def.id,
      x,
      y,
      width: def.defaultWidth,
      depth: def.defaultDepth,
      height: def.defaultHeight,
      rotation: 0,
    };
    set(state => ({ items: [...state.items, item], selectedId: item.instanceId }));
  },

  updateItem: (instanceId, changes) =>
    set(state => ({
      items: state.items.map(item =>
        item.instanceId === instanceId ? { ...item, ...changes } : item
      ),
    })),

  deleteItem: (instanceId) =>
    set(state => ({
      items: state.items.filter(i => i.instanceId !== instanceId),
      selectedId: state.selectedId === instanceId ? null : state.selectedId,
    })),

  selectItem: (instanceId) => set({ selectedId: instanceId }),

  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),

  toggleSnap: () => set(state => ({ snapToGrid: !state.snapToGrid })),
}));
