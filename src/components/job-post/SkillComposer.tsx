import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeList } from "@/components/job-post/BadgeList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectedSkill, SkillResponse } from "@/features/job-post/types";
import type { DifficultyLevel } from "@/features/enums";
import { DIFFICULTY_LEVEL_OPTIONS } from "@/features/enums";

type SkillComposerProps = {
  fieldLabel: string;
  levelLabel: string;
  items: SelectedSkill[];
  onAdd: (item: SelectedSkill) => void;
  onRemove: (item: SelectedSkill) => void;
  /** Skills data from GET /api/Skills for autocomplete suggestions */
  skillsData?: SkillResponse[];
};

export function SkillComposer({
  fieldLabel,
  levelLabel,
  items,
  onAdd,
  onRemove,
  skillsData,
}: SkillComposerProps) {
  const [fieldValue, setFieldValue] = useState("");
  const [levelValue, setLevelValue] = useState<DifficultyLevel | "">("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter skills that match the current input (case-insensitive)
  const suggestions = useMemo(() => {
    if (!skillsData || !fieldValue.trim()) return [];
    const query = fieldValue.toLowerCase().trim();
    // Don't show skills already selected
    const selectedNames = items.map((item) => item.name.toLowerCase());
    return skillsData
      .filter(
        (s) =>
          s.name.toLowerCase().includes(query) &&
          !selectedNames.includes(s.name.toLowerCase()),
      )
      .slice(0, 8); // Limit to 8 suggestions
  }, [skillsData, fieldValue, items]);

  const handleAdd = useCallback(
    (skill?: SkillResponse) => {
      const trimmedName = fieldValue.trim();
      const matchedSkill =
        skill ??
        skillsData?.find(
          (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
        );
      const name = matchedSkill ? matchedSkill.name : trimmedName;
      const id = matchedSkill ? matchedSkill.id : 0;
      if (!name || !id || !levelValue) return;

      // Don't add duplicate skills
      if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        return;
      }

      onAdd({ id, name, level: levelValue });
      setFieldValue("");
      setLevelValue("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [fieldValue, levelValue, items, onAdd, skillsData],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // If there's exactly one suggestion, use it
        if (suggestions.length === 1) {
          handleAdd(suggestions[0]);
        } else {
          handleAdd();
        }
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [suggestions, handleAdd],
  );

  const badgeItems = useMemo(
    () => items.map((item) => `${item.name} / ${item.level}`),
    [items],
  );

  const handleBadgeRemove = useCallback(
    (value: string) => {
      const found = items.find(
        (item) => `${item.name} / ${item.level}` === value,
      );
      if (found) {
        onRemove(found);
      }
    },
    [items, onRemove],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <div className="relative">
          <Input
            ref={inputRef}
            value={fieldValue}
            onChange={(event) => {
              setFieldValue(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={fieldLabel}
            className="h-12"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
              {suggestions.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-100 transition-colors"
                  onMouseDown={(e) => {
                    // Prevent blur from firing before click
                    e.preventDefault();
                    handleAdd(skill);
                  }}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Select
          value={levelValue}
          onValueChange={(value) => setLevelValue(value as DifficultyLevel)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder={levelLabel} />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_LEVEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={() => handleAdd()} className="h-12">
          Add
        </Button>
      </div>

      <BadgeList items={badgeItems} onRemove={handleBadgeRemove} />
    </div>
  );
}
