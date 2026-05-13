import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeList } from "@/components/job-post/BadgeList";
import type { SkillPair } from "@/features/job-post/types";

type SkillComposerProps = {
  fieldLabel: string;
  levelLabel: string;
  items: SkillPair[];
  onAdd: (item: SkillPair) => void;
  onRemove: (item: SkillPair) => void;
};

export function SkillComposer({
  fieldLabel,
  levelLabel,
  items,
  onAdd,
  onRemove,
}: SkillComposerProps) {
  const [fieldValue, setFieldValue] = useState("");
  const [levelValue, setLevelValue] = useState("");

  const handleAdd = () => {
    if (!fieldValue.trim() || !levelValue.trim()) {
      return;
    }

    onAdd({
      field: fieldValue.trim(),
      level: levelValue.trim(),
    });
    setFieldValue("");
    setLevelValue("");
  };

  const badgeItems = useMemo(
    () => items.map((item) => `${item.field} / ${item.level}`),
    [items],
  );

  const handleBadgeRemove = useCallback(
    (value: string) => {
      const found = items.find(
        (item) => `${item.field} / ${item.level}` === value,
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
        <Input
          value={fieldValue}
          onChange={(event) => setFieldValue(event.target.value)}
          placeholder={fieldLabel}
          className="h-12"
        />
        <Input
          value={levelValue}
          onChange={(event) => setLevelValue(event.target.value)}
          placeholder={levelLabel}
          className="h-12"
        />
        <Button type="button" onClick={handleAdd} className="h-12">
          Add
        </Button>
      </div>

      <BadgeList items={badgeItems} onRemove={handleBadgeRemove} />
    </div>
  );
}
