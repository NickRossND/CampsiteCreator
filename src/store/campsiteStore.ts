import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { PlacedItem, ItemDefinition, LCutCorner } from '../types/campsite';

export interface CampsiteConfig {
  version: number;
  plotWidth: number;
  plotDepth: number;
  isLShaped: boolean;
  lCutCorner: LCutCorner;
  lCutWidth: number;
  lCutHeight: number;
  showGrid: boolean;
  snapToGrid: boolean;
  items: PlacedItem[];
}

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
  loadConfig: (config: CampsiteConfig) => void;
  getConfig: () => CampsiteConfig;
}

export const useCampsiteStore = create<CampsiteStore>()(
  persist(
    (set, get) => ({
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
        const item: PlacedItem = {
          instanceId: uuidv4(),
          definitionId: def.id,
          x: plotWidth / 2,
          y: plotDepth / 2,
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

      loadConfig: (config) => set({
        plotWidth:  config.plotWidth  ?? 40,
        plotDepth:  config.plotDepth  ?? 40,
        isLShaped:  config.isLShaped  ?? false,
        lCutCorner: config.lCutCorner ?? 'top-right',
        lCutWidth:  config.lCutWidth  ?? 20,
        lCutHeight: config.lCutHeight ?? 20,
        showGrid:   config.showGrid   ?? true,
        snapToGrid: config.snapToGrid ?? false,
        items:      config.items      ?? [],
        selectedId: null,
      }),

      getConfig: (): CampsiteConfig => {
        const s = get();
        return {
          version: 1,
          plotWidth:  s.plotWidth,
          plotDepth:  s.plotDepth,
          isLShaped:  s.isLShaped,
          lCutCorner: s.lCutCorner,
          lCutWidth:  s.lCutWidth,
          lCutHeight: s.lCutHeight,
          showGrid:   s.showGrid,
          snapToGrid: s.snapToGrid,
          items:      s.items,
        };
      },
    }),
    {
      name: 'campsite-creator-v1',
      // Don't persist transient UI state
      partialize: (state) => ({
        plotWidth:  state.plotWidth,
        plotDepth:  state.plotDepth,
        isLShaped:  state.isLShaped,
        lCutCorner: state.lCutCorner,
        lCutWidth:  state.lCutWidth,
        lCutHeight: state.lCutHeight,
        showGrid:   state.showGrid,
        snapToGrid: state.snapToGrid,
        items:      state.items,
      }),
    }
  )
);
