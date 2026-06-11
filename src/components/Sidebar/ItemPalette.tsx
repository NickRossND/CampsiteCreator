import { itemDefinitions, categoryOrder, categoryLabels } from '../../data/itemDefinitions';
import { ItemCard } from './ItemCard';

export function ItemPalette() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
      {categoryOrder.map(cat => {
        const items = itemDefinitions.filter(d => d.category === cat);
        return (
          <div key={cat}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 px-1">
              {categoryLabels[cat]}
            </h3>
            <div className="flex flex-col gap-0.5">
              {items.map(def => <ItemCard key={def.id} def={def} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
