export type ItemCategory = 'vehicle' | 'shelter' | 'furniture' | 'utility';
export type ItemShape = 'rect';
export type LCutCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  defaultWidth: number;   // feet (X axis)
  defaultDepth: number;   // feet (Y axis)
  defaultHeight: number;  // feet above ground (Z)
  color: string;
  shape: ItemShape;
}

export interface PlacedItem {
  instanceId: string;
  definitionId: string;
  x: number;        // feet from plot origin
  y: number;
  width: number;    // feet
  depth: number;    // feet
  height: number;   // feet (Z — future 3D use)
  rotation: number; // degrees
  label?: string;
}
