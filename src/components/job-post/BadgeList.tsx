import { X } from "lucide-react";

type BadgeListProps<T extends string = string> = {
  items: readonly T[];
  onRemove: (item: T) => void;
  /**
   * Optional label lookup function.
   * When provided, the badge displays `getLabel(item)` instead of the raw `item` value.
   * This is used for enum options where the backend value (e.g., "FullTime")
   * needs a user-friendly display label (e.g., "Full Time").
   *
   * Example: `getLabel={getJobTypeLabel}`
   */
  getLabel?: (value: T) => string;
};

export function BadgeList<T extends string = string>({
  items,
  onRemove,
  getLabel,
}: BadgeListProps<T>) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-500">No selections yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const displayLabel = getLabel ? getLabel(item) : item;
        return (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700"
          >
            {displayLabel}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-neutral-500 hover:text-neutral-800"
              aria-label={`Remove ${displayLabel}`}
            >
              <X size={14} />
            </button>
          </span>
        );
      })}
    </div>
  );
}
