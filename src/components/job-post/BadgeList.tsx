import { X } from "lucide-react";

type BadgeListProps = {
  items: readonly string[];
  onRemove: (item: string) => void;
};

export function BadgeList({ items, onRemove }: BadgeListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-500">No selections yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700"
        >
          {item}
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="text-neutral-500 hover:text-neutral-800"
            aria-label={`Remove ${item}`}
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}
