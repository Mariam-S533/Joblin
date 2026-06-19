"use client"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Plus, Trash2 } from "lucide-react"
import { LanguageSec } from "@/app/Types/profileShared"

function Languages() {
  const { setValue, watch } = useFormContext()
  // Watch the form field so we pick up reset() calls from getAllSections or CV parse
  const formLanguages = watch("languages") as LanguageSec[] | undefined
  const [entries, setEntries] = useState<LanguageSec[]>(
    Array.isArray(formLanguages) && formLanguages.length > 0
      ? formLanguages
      : [{ id: "", language: "", proficiency: "" }]
  )

  // Sync local entries when form is reset externally (e.g. from getAllSections or CV parse)
  useEffect(() => {
    if (Array.isArray(formLanguages) && formLanguages.length > 0) {
      setEntries(formLanguages)
    }
  }, [formLanguages])

  // Keep form in sync whenever entries change
  const updateForm = (next: LanguageSec[]) => {
    setEntries(next)
    setValue("languages", next, { shouldDirty: true, shouldValidate: true })
  }

  const updateEntry = (index: number, field: keyof LanguageSec, value: string) => {
    const next = entries.map((e, i) =>
      i === index ? { ...e, [field]: value } : e
    )
    updateForm(next)
  }

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return
    updateForm(entries.filter((_, i) => i !== index))
  }

  const addEntry = () => {
    updateForm([...entries, { id: "", language: "", proficiency: "" }])
  }

  return (
    <div className="flex flex-col gap-4 w-full py-2">
      {entries.map((entry, index) => (
        <div key={index} className="flex gap-3 items-start w-full border border-gray-100 rounded-md p-3 bg-gray-50/50">
          <div className="relative w-full">
            <Input
              placeholder="Italian"
              className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0 focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]"
              type="text"
              value={entry.language}
              onChange={e => updateEntry(index, "language", e.target.value)}
            />
            <Label className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium">
              Language
            </Label>
          </div>

          <div className="relative w-full">
            <Input
              placeholder="Native / Expert / Conversational"
              className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0 focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]"
              type="text"
              value={entry.proficiency || ""}
              onChange={e => updateEntry(index, "proficiency", e.target.value)}
            />
            <Label className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium">
              Proficiency Level
            </Label>
          </div>

          <button
            type="button"
            title="Remove language"
            onClick={() => removeEntry(index)}
            disabled={entries.length <= 1}
            className="p-2 text-gray-400 hover:text-red-500 transition shrink-0 mt-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-1 text-sm font-medium text-joblin-primary hover:underline self-start"
      >
        <Plus size={18} /> Add Language
      </button>
    </div>
  )
}

export default Languages
