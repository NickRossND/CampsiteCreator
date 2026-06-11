import type { ItemDefinition } from '../types/campsite';

const VEHICLE_COLOR = '#64748b';  // slate-500
const SHELTER_COLOR = '#16a34a';  // green-600
const FURNITURE_COLOR = '#d97706'; // amber-600
const UTILITY_COLOR = '#7c3aed';  // violet-600

export const itemDefinitions: ItemDefinition[] = [
  // Vehicles
  { id: 'coupe',     name: 'Coupe',     category: 'vehicle',   defaultWidth: 6,  defaultDepth: 14, defaultHeight: 4.5, color: VEHICLE_COLOR,   shape: 'rect' },
  { id: 'sedan',     name: 'Sedan',     category: 'vehicle',   defaultWidth: 6,  defaultDepth: 16, defaultHeight: 4.5, color: VEHICLE_COLOR,   shape: 'rect' },
  { id: 'suv',       name: 'SUV',       category: 'vehicle',   defaultWidth: 7,  defaultDepth: 18, defaultHeight: 5.5, color: VEHICLE_COLOR,   shape: 'rect' },
  { id: 'truck',     name: 'Truck',     category: 'vehicle',   defaultWidth: 7,  defaultDepth: 20, defaultHeight: 6,   color: VEHICLE_COLOR,   shape: 'rect' },
  { id: 'van',       name: 'Van',       category: 'vehicle',   defaultWidth: 7,  defaultDepth: 19, defaultHeight: 6.5, color: VEHICLE_COLOR,   shape: 'rect' },
  { id: 'minivan',   name: 'Minivan',   category: 'vehicle',   defaultWidth: 7,  defaultDepth: 17, defaultHeight: 5.5, color: VEHICLE_COLOR,   shape: 'rect' },

  // Shelters
  { id: 'tent-2',    name: 'Tent (2p)', category: 'shelter',   defaultWidth: 7,  defaultDepth: 7,  defaultHeight: 3.5, color: SHELTER_COLOR,   shape: 'rect' },
  { id: 'tent-4',    name: 'Tent (4p)', category: 'shelter',   defaultWidth: 10, defaultDepth: 10, defaultHeight: 5,   color: SHELTER_COLOR,   shape: 'rect' },
  { id: 'tent-6',    name: 'Tent (6p)', category: 'shelter',   defaultWidth: 12, defaultDepth: 12, defaultHeight: 6,   color: SHELTER_COLOR,   shape: 'rect' },
  { id: 'canopy-10', name: 'Canopy 10×10', category: 'shelter', defaultWidth: 10, defaultDepth: 10, defaultHeight: 8, color: '#15803d',        shape: 'rect' },
  { id: 'canopy-20', name: 'Canopy 10×20', category: 'shelter', defaultWidth: 10, defaultDepth: 20, defaultHeight: 8, color: '#15803d',        shape: 'rect' },

  // Furniture
  { id: 'table',     name: 'Folding Table', category: 'furniture', defaultWidth: 2.5, defaultDepth: 6,   defaultHeight: 2.5, color: FURNITURE_COLOR, shape: 'rect' },
  { id: 'chair',     name: 'Camp Chair',    category: 'furniture', defaultWidth: 2,   defaultDepth: 2,   defaultHeight: 3,   color: FURNITURE_COLOR, shape: 'rect' },
  { id: 'cooler',    name: 'Cooler',        category: 'furniture', defaultWidth: 2,   defaultDepth: 3,   defaultHeight: 1.5, color: '#0284c7',       shape: 'rect' },
  { id: 'fire-ring', name: 'Fire Ring',     category: 'furniture', defaultWidth: 5,   defaultDepth: 5,   defaultHeight: 1,   color: '#dc2626',       shape: 'rect' },

  // Utility
  { id: 'generator', name: 'Generator',    category: 'utility',   defaultWidth: 2,   defaultDepth: 3,   defaultHeight: 2,   color: UTILITY_COLOR,   shape: 'rect' },
  { id: 'storage',   name: 'Storage Bin',  category: 'utility',   defaultWidth: 2,   defaultDepth: 2,   defaultHeight: 1.5, color: UTILITY_COLOR,   shape: 'rect' },
  { id: 'bicycle',   name: 'Bicycle',      category: 'utility',   defaultWidth: 2,   defaultDepth: 5,   defaultHeight: 4,   color: '#0891b2',       shape: 'rect' },
  { id: 'motorcycle',name: 'Motorcycle',   category: 'utility',   defaultWidth: 3,   defaultDepth: 7,   defaultHeight: 4.5, color: '#0891b2',       shape: 'rect' },
];

export const definitionMap = new Map(itemDefinitions.map(d => [d.id, d]));

export const categoryOrder: ItemDefinition['category'][] = ['vehicle', 'shelter', 'furniture', 'utility'];

export const categoryLabels: Record<ItemDefinition['category'], string> = {
  vehicle: 'Vehicles',
  shelter: 'Shelters',
  furniture: 'Furniture',
  utility: 'Utility',
};
