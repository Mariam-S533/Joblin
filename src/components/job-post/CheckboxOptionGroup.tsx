import { Checkbox } from "@/components/ui/checkbox";

type CheckboxOptionGroupProps<T extends string> = {
  options: readonly T[];
  selected: readonly T[];
  onToggle: (option: T) => void;
  className?: string;
  /** Section label displayed above the checkboxes. */
  label?: string;
  /** Shows asterisk next to the label when true. */
  required?: boolean;
  /** Error message displayed below the checkboxes. Also highlights label in red. */
  error?: string;
  /**
   * Optional label lookup function.
   * When provided, the checkbox displays `getLabel(option)` instead of the raw `option` value.
   * This is used for enum options where the backend value (e.g., "FullTime")
   * needs a user-friendly display label (e.g., "Full Time").
   *
   * Example: `getLabel={getJobTypeLabel}`
   */
  getLabel?: (value: T) => string;
};

export function CheckboxOptionGroup<T extends string>({
  options,
  selected,
  onToggle,
  className,
  label,
  required = false,
  error,
  getLabel,
}: CheckboxOptionGroupProps<T>) {
  return (
    <div>
      {label && (
        <div className="mb-2 inline-flex items-center gap-1">
          <p
            className={`text-sm font-medium ${
              error ? "text-red-600" : "text-neutral-800"
            }`}
          >
            {label}
          </p>
          {required && (
            <span className="text-red-700 text-base font-semibold">*</span>
          )}
        </div>
      )}
      <div className={className ?? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
        {options.map((option) => {
          const isChecked = selected.includes(option);
          const displayLabel = getLabel ? getLabel(option) : option;
          return (
            <label
              key={option}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-neutral-800 ${
                error ? "border-red-300" : "border-neutral-200"
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle(option)}
              />
              <span>{displayLabel}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

