"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { enhanceCV, enhanceAndSaveCV } from "@/app/actions/ai.action"
import { useProfileContext } from "@/app/context/ProfilesProvider"
import { toast } from "sonner"
import { Pencil, Eye, UploadCloud, X, FileText, Sparkles, Check } from "lucide-react"
import jsPDF from "jspdf"

type Step = "confirm" | "upload" | "editor"

function stripJustification(text: string): string {
    const idx = text.indexOf("Justification for Edits")
    if (idx === -1) {
        const altIdx = text.indexOf("---\n\n**Justification")
        if (altIdx !== -1) return text.slice(0, altIdx).trimEnd()
        return text
    }
    const dashIdx = text.lastIndexOf("---", idx)
    const cutIdx = dashIdx !== -1 && dashIdx < idx ? dashIdx : idx
    return text.slice(0, cutIdx).trimEnd()
}

function renderMarkdownToHTML(md: string): string {
    let html = md
        .replace(/^### (.+)$/gm, "<h3 class='text-sm font-bold text-joblin-black mt-3'>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2 class='text-base font-bold text-joblin-black mt-4 mb-1'>$1</h2>")
        .replace(/^\*\*(.+)\*\*\s*$/gm, "<p class='font-bold text-joblin-black text-sm'>$1</p>")
        .replace(/^\*(.+)\*\s*$/gm, "<p class='text-sm text-gray-600 italic'>$1</p>")
        .replace(/^- (.+)$/gm, "<li class='text-sm text-gray-700 ml-4 list-disc'>$1</li>")
        .replace(/^(\S.+)$/gm, "<p class='text-sm text-gray-700'>$1</p>")
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul class='flex flex-col gap-0.5 mb-2'>${match}</ul>`)
    return html
}

function generatePDF(text: string): File {
    const doc = new jsPDF({ unit: "pt", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 40
    const maxWidth = pageWidth - margin * 2
    const lineHeight = 14

    doc.setFont("helvetica")
    doc.setFontSize(10)

    let y = margin
    const lines = text.split("\n")

    for (const line of lines) {
        const trimmed = line.trim()

        if (trimmed.startsWith("### ")) {
            doc.setFont("helvetica", "bold")
            doc.setFontSize(12)
            const text = trimmed.replace(/^###\s/, "")
            const split = doc.splitTextToSize(text, maxWidth)
            for (const s of split) {
                if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin }
                doc.text(s, margin, y)
                y += lineHeight
            }
            y += 4
        } else if (trimmed.startsWith("## ")) {
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            const text = trimmed.replace(/^##\s/, "")
            const split = doc.splitTextToSize(text, maxWidth)
            for (const s of split) {
                if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin }
                doc.text(s, margin, y)
                y += lineHeight + 2
            }
            y += 6
        } else if (trimmed.startsWith("- ")) {
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            const text = trimmed.replace(/^-\s/, "")
            const split = doc.splitTextToSize(text, maxWidth - 10)
            for (const s of split) {
                if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin }
                doc.text(s, margin + 10, y)
                y += lineHeight
            }
        } else if (trimmed === "") {
            y += 6
        } else {
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            const split = doc.splitTextToSize(trimmed, maxWidth)
            for (const s of split) {
                if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin }
                doc.text(s, margin, y)
                y += lineHeight
            }
        }
    }

    const pdfBlob = doc.output("blob")
    return new File([pdfBlob], "enhanced-resume.pdf", { type: "application/pdf" })
}

interface EnhanceCVDialogProps {
    jobPostId: string
    jobTitle: string
    onApplyWithoutEnhance: () => Promise<void>
    onCancel: () => void
}

export default function EnhanceCVDialog({
    jobPostId,
    jobTitle,
    onApplyWithoutEnhance,
    onCancel,
}: EnhanceCVDialogProps) {
    const { currentProfileName, currentProfileId } = useProfileContext()
    const [step, setStep] = useState<Step>("confirm")
    const [enhancedText, setEnhancedText] = useState("")
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<"edit" | "preview">("preview")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const resumeOnly = useMemo(() => stripJustification(enhancedText), [enhancedText])
    const previewHTML = useMemo(() => renderMarkdownToHTML(resumeOnly), [resumeOnly])

    async function handleEnhance() {
        if (!selectedFile) {
            toast.error("Please upload your CV first")
            return
        }
        try {
            setIsEnhancing(true)
            const formData = new FormData()
            formData.append("resume", selectedFile)
            const result = await enhanceCV(jobPostId, formData)
            setEnhancedText(result.enhancedResume)
            setStep("editor")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Enhancement failed")
        } finally {
            setIsEnhancing(false)
        }
    }

    async function handleSaveChanges() {
        try {
            setIsSaving(true)
            const pdfFile = generatePDF(resumeOnly)
            const formData = new FormData()
            formData.append("file", pdfFile)
            await enhanceAndSaveCV(formData, currentProfileName, currentProfileId || undefined)
            await onApplyWithoutEnhance()
            toast.success("CV enhanced & applied successfully!")
            onCancel()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Save failed")
        } finally {
            setIsSaving(false)
        }
    }

    async function handleApplyDirectly() {
        try {
            await onApplyWithoutEnhance()
            onCancel()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Apply failed")
        }
    }

    if (step === "confirm") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={20} className="text-joblin-primary" />
                        <h2 className="text-lg font-bold text-joblin-black">Enhance Your CV?</h2>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        AI can tailor your resume for <strong>{jobTitle}</strong>, increasing your chances of acceptance.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => setStep("upload")}
                            className="bg-joblin-primary text-white hover:bg-joblin-primary/80"
                        >
                            <Sparkles size={16} className="mr-1" />
                            Enhance CV & Apply
                        </Button>
                        <Button
                            onClick={handleApplyDirectly}
                            variant="outline"
                            className="border-joblin-primary text-joblin-primary hover:bg-joblin-primary hover:text-white"
                        >
                            Apply Without Enhance
                        </Button>
                        <Button onClick={onCancel} variant="ghost" className="text-gray-500">Cancel</Button>
                    </div>
                </div>
            </div>
        )
    }

    if (step === "upload") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
                    <h2 className="text-lg font-bold text-joblin-black mb-2">Upload Your CV</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Upload your current resume so AI can enhance it for <strong>{jobTitle}</strong>.
                    </p>
                    <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    <div
                        onClick={() => !selectedFile && fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center mb-4 cursor-pointer hover:border-joblin-primary transition"
                    >
                        {selectedFile ? (
                            <div className="flex items-center justify-center gap-3">
                                <FileText size={24} className="text-joblin-primary" />
                                <span className="text-sm font-medium text-joblin-black">{selectedFile.name}</span>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-500 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <UploadCloud size={32} className="text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload your CV</p>
                                <p className="text-xs text-gray-400">PDF, TXT, DOC, DOCX accepted</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleEnhance}
                            disabled={!selectedFile || isEnhancing}
                            className="bg-joblin-primary text-white hover:bg-joblin-primary/80"
                        >
                            {isEnhancing ? "Enhancing..." : "Enhance & Continue"}
                        </Button>
                        <Button onClick={onCancel} variant="ghost" className="text-gray-500">Cancel</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl max-w-4xl w-[90vw] max-h-[85vh] shadow-lg flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-joblin-primary" />
                        <h2 className="text-base font-bold text-joblin-black">Enhanced CV for {jobTitle}</h2>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
                        <button
                            type="button"
                            onClick={() => setViewMode("edit")}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition ${
                                viewMode === "edit" ? "bg-white shadow text-joblin-black" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Pencil size={14} /> Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("preview")}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition ${
                                viewMode === "preview" ? "bg-white shadow text-joblin-black" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Eye size={14} /> Preview
                        </button>
                    </div>
                </div>

                {/* Editor / Preview */}
                <div className="flex-1 overflow-y-auto p-4">
                    {viewMode === "edit" ? (
                        <textarea
                            value={enhancedText}
                            onChange={(e) => setEnhancedText(e.target.value)}
                            className="w-full h-full min-h-[400px] border border-gray-200 rounded-lg p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-joblin-primary focus:ring-1 focus:ring-joblin-primary"
                        />
                    ) : (
                        <div
                            className="bg-gray-50 border border-gray-100 rounded-lg p-4 min-h-[400px]"
                            dangerouslySetInnerHTML={{ __html: previewHTML }}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                    <p className="text-xs text-gray-400">Edit to personalize, then save & apply</p>
                    <div className="flex gap-2">
                        <Button onClick={onCancel} variant="outline" className="text-gray-500">Cancel</Button>
                        <Button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="bg-joblin-primary text-white hover:bg-joblin-primary/80"
                        >
                            <Check size={16} className="mr-1" />
                            {isSaving ? "Saving & Applying..." : "Save Changes & Apply"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
