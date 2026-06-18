"use client"

import { useState, ReactNode } from "react"
import { SquarePen, Plus, X } from "lucide-react"
import { useProfileContext } from "@/app/context/ProfilesProvider"
import { useFormContext } from 'react-hook-form';

interface SectionBlockProps {
  title: string
  icon: React.ElementType
  helperText: string
  ctaText: string
  hasData: boolean
  readView: ReactNode
  renderEdit: () => ReactNode
  formKey?: string // New optional prop to pinpoint the form section (e.g. "work_experience", "languages")
  onEditingChange?: (isEditing: boolean) => void
  onSectionSave?: () => Promise<void> | void 
}

export default function SectionBlock({ 
  title, 
  icon: Icon, 
  helperText, 
  ctaText, 
  hasData, 
  readView, 
  renderEdit,
  formKey,
  onEditingChange,
  onSectionSave 
}: SectionBlockProps) {
  
  const { parsedData } = useProfileContext()
  const [isManualEditing, setIsManualEditing] = useState(false)

  const isReviewingParsedCV = !!parsedData
  const shouldShowEdit = isManualEditing || isReviewingParsedCV

  const formContext = useFormContext()

 let isSectionDirty = false 
  if (formContext && formKey) {
    const { dirtyFields } = formContext.formState
    const targetSection = dirtyFields[formKey as keyof typeof dirtyFields]
    
    if (targetSection) {
      if (Array.isArray(targetSection)) {
        isSectionDirty = targetSection.length > 0 && targetSection.some(item => item && Object.keys(item).length > 0)
      } else if (typeof targetSection === 'object') {
        isSectionDirty = Object.keys(targetSection).length > 0
      } else {
        isSectionDirty = !!targetSection
      }
    }
  }

  function handleSetEditing(value: boolean) {
    setIsManualEditing(value)
    onEditingChange?.(value)
  }

  return (
    <div className={`px-4 py-5 border rounded-md bg-white mb-5 shadow-sm flex flex-col gap-3 transition-all ${
      isReviewingParsedCV ? "border-amber-200 ring-2 ring-amber-500/5" : ""
    }`}>
      
      <div className="flex items-center justify-between p-1 mb-2">
        <div className="flex items-center gap-2 font-semibold text-[18px]">
          <Icon size={20} className={isReviewingParsedCV ? "text-amber-500" : ""} />
          {title}
        </div>
        
        {/* Toggle button rules */}
        {isReviewingParsedCV ?  (
          isReviewingParsedCV ? (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium animate-pulse">
              Reviewing parsed file
            </span>
          ) : !shouldShowEdit ? (
            <button title="edit" type="button" onClick={() => handleSetEditing(true)} className="text-joblin-primary hover:opacity-80 transition">
              <SquarePen size={20} />
            </button>
          ) : (
            <button title="cancel" type="button" onClick={() => handleSetEditing(false)} className="text-gray-400 hover:text-gray-600 transition">
              <X size={20} />
            </button>
          )
        ): null}
      </div>

      <div className="flex flex-col gap-4">
        {/* Render editable fields if manually editing OR reviewing parsed data */}
        {shouldShowEdit && (
          <div className={`p-3 rounded-md ${isReviewingParsedCV ? "bg-amber-50/30 border border-amber-100" : "bg-gray-50/50"}`}>
            {renderEdit()}

            {/* Action Row containing Section Save / Cancel buttons */}
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => {
                    if (formKey) {
                      // Reverts ONLY this section layout back to its last cached pristine state
                      formContext.resetField(formKey as any)
                    }
                    handleSetEditing(false)
                  }} 
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              {/* Logic: Section Save Button appears ONLY during independent manual editing sessions */}
              {isManualEditing && !isReviewingParsedCV && (
                <button 
                  type="button" 
                  disabled={onSectionSave ? !isSectionDirty : false} // Keeps it disabled if no changes were made!3
                  onClick={async () => {
                    if (onSectionSave) {
                      await onSectionSave()
                    }
                    handleSetEditing(false)
                  }} 
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#00B074] rounded-md hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-100"                >
                  Save 
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty placeholder state (only if not editing and has no data) */}
        {!shouldShowEdit && !hasData && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[#A5A5A5] px-4 py-8 text-center bg-gray-50/50">
            <p className="text-sm text-muted-foreground">{helperText}</p>
            <button type="button" onClick={() => handleSetEditing(true)}
              className="flex items-center gap-1 text-sm font-medium text-joblin-primary cursor-pointer hover:underline">
              <Plus size={18}/> {ctaText}
            </button>
          </div>
        )}
      </div>

      {/* Structural Read View Logic Layout */}
      <div className="space-y-2">
        {hasData && (
          <div className={shouldShowEdit ? "border-t border-dashed border-gray-200 pt-4 opacity-75" : ""}>
            {shouldShowEdit && <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Live Layout Preview:</p>}
            {readView}
          </div>
        )}
      </div>

    </div>
  )
}




















// "use client"

// import { useEffect, useState, ReactNode } from "react"
// import { SquarePen, Plus, X } from "lucide-react"
// import { useProfileContext } from "@/app/context/ProfilesProvider"
// import { useFormContext, useFormState } from "react-hook-form"

// interface SectionBlockProps {
//   title: string
//   icon: React.ElementType
//   helperText: string
//   ctaText: string
//   hasData: boolean
//   readView: ReactNode
//   renderEdit: () => ReactNode
//   formKey?: string
//   onEditingChange?: (sectionTitle: string, isEditing: boolean) => void
//   onSectionSave?: () => Promise<void> | void
// }

// export default function SectionBlock({
//   title, icon: Icon, helperText, ctaText, hasData,
//   readView, renderEdit, formKey, onEditingChange, onSectionSave,
// }: SectionBlockProps) {

//   const { parsedData } = useProfileContext()
//   const { control, resetField, setValue  } = useFormContext()
//   const [isManualEditing, setIsManualEditing] = useState(false)
//   const [isSavingSection, setIsSavingSection] = useState(false)


//   const isReviewingParsedCV = !!parsedData
//   // Manual editing only exists OUTSIDE review. In review, the global Save owns the form.
//   const shouldShowEdit = isManualEditing || isReviewingParsedCV

//   // Scoped dirty subscription: re-renders only when THIS section's fields change.
//   const { dirtyFields } = useFormState({ control, name: formKey })

//   const isSectionDirty = (() => {
//     if (!formKey) return false
//     const target = (dirtyFields as Record<string, unknown>)[formKey]
//     if (!target) return false
//     if (Array.isArray(target)) return target.some(item => item && Object.keys(item).length > 0)
//     if (typeof target === "object") return Object.keys(target as object).length > 0
//     return !!target
//   })()

//   function handleSetEditing(value: boolean) {
//     setIsManualEditing(value)
//     onEditingChange?.(title, value)
//   }

//   function handleCancel() {
//     if (formKey) resetField(formKey as any) // revert ONLY this section to its pristine values
//     handleSetEditing(false)
//   }

//   async function handleSectionSave() {
//     try {
//       setIsSavingSection(true)
//       const savedValue = await onSectionSave?.()

//     if (formKey && savedValue) {
//       setValue(formKey as any, savedValue, {
//         shouldDirty: false,
//       })
//     }
//       handleSetEditing(false)
//     } finally {
//       setIsSavingSection(false)
//     }
//   }

//   // If the block unmounts while open, release the parent's editing lock.
//   useEffect(() => {
//     return () => onEditingChange?.(title, false)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <div className={`px-4 py-5 border rounded-md bg-white mb-5 shadow-sm flex flex-col gap-3 transition-all ${
//       isReviewingParsedCV ? "border-amber-200 ring-2 ring-amber-500/5" : ""
//     }`}>

//       <div className="flex items-center justify-between p-1 mb-2">
//         <div className="flex items-center gap-2 font-semibold text-[18px]">
//           <Icon size={20} className={isReviewingParsedCV ? "text-amber-500" : ""} />
//           {title}
//         </div>

//         {/* review badge | cancel (while editing) | edit pencil (has data) */}
//         {isReviewingParsedCV ? (
//           <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium animate-pulse">
//             Reviewing parsed file
//           </span>
//         ) : shouldShowEdit ? (
//           <button title="cancel" type="button" onClick={handleCancel}
//             className="text-gray-400 hover:text-gray-600 transition">
//             <X size={20} />
//           </button>
//         ) : hasData ? (
//           <button title="edit" type="button" onClick={() => handleSetEditing(true)}
//             className="text-joblin-primary hover:opacity-80 transition">
//             <SquarePen size={20} />
//           </button>
//         ) : null}
//       </div>

//       <div className="flex flex-col gap-4">
//         {shouldShowEdit && (
//           <div className={`p-3 rounded-md ${isReviewingParsedCV ? "bg-amber-50/30 border border-amber-100" : "bg-gray-50/50"}`}>
//             {renderEdit()}

//             {/* Section action row: ONLY during independent manual editing */}
//             {isManualEditing && !isReviewingParsedCV && (
//               <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
//                 <button type="button" onClick={handleCancel}
//                   className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition">
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   disabled={!isSectionDirty || isSavingSection}
//                   onClick={handleSectionSave}
//                   className="px-4 py-1.5 text-sm font-medium text-white bg-[#00B074] rounded-md hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-100"
//                 >
//                   {isSavingSection ? "Saving..." : "Save"}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {!shouldShowEdit && !hasData && (
//           <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[#A5A5A5] px-4 py-8 text-center bg-gray-50/50">
//             <p className="text-sm text-muted-foreground">{helperText}</p>
//             <button type="button" onClick={() => handleSetEditing(true)}
//               className="flex items-center gap-1 text-sm font-medium text-joblin-primary cursor-pointer hover:underline">
//               <Plus size={18}/> {ctaText}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="space-y-2">
//         {hasData && (
//           <div className={shouldShowEdit ? "border-t border-dashed border-gray-200 pt-4 opacity-75" : ""}>
//             {shouldShowEdit && <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Live Layout Preview:</p>}
//             {readView}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
