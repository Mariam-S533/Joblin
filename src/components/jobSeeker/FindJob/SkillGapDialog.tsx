"use client"

import { useState, useEffect } from "react"
import { getMissedSkills, getAiRecommendedCourses } from "@/app/actions/skillGap.action"
import { MissSkills, SkillGapCourse, SkillGapResponse } from "@/app/Types/skillgap"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown, ChevronUp, TriangleAlert, BookOpen, Zap, ExternalLink, BarChart2 } from "lucide-react"

function parsePercent(value: any): number {
    if (value === null || value === undefined) return 0;

    // As per backend instruction: match_score is a decimal (e.g., 0.3333)
    // Multiplied by 100 and rounded cleanly
    const num = Number(value);
    if (isNaN(num)) return 0;

    return num > 1 ? Math.round(num) : Math.round(num * 100);
}

function getMatchMeta(score: number) {
    if (score >= 80) return {
        label: "STRONG MATCH",
        desc: "You are highly qualified for this position.",
        ring: "border-green-400",
        textColor: "text-green-700",
        bg: "bg-green-50",
    }
    if (score >= 50) return {
        label: "PARTIAL MATCH",
        desc: "Some skills need improvement to strengthen your fit.",
        ring: "border-orange-400",
        textColor: "text-orange-500",
        bg: "bg-orange-50",
    }
    return {
        label: "WEAK MATCH",
        desc: "Significant skill gaps detected — take action below.",
        ring: "border-red-400",
        textColor: "text-red-600",
        bg: "bg-red-50",
    }
}

interface SkillGapDialogProps {
    jobPostId: string
    seekerProfileId?: string
    onClose: () => void
}

export default function SkillGapDialog({ jobPostId, seekerProfileId, onClose }: SkillGapDialogProps) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [missingSkills, setMissingSkills] = useState<string[]>([])
    const [courses, setCourses] = useState<SkillGapCourse[]>([])
    const [matchScore, setMatchScore] = useState(0)
    const [showAllCourses, setShowAllCourses] = useState(false)

useEffect(() => {
    async function run() {
        try {
            setLoading(true)
            const missData: MissSkills = await getMissedSkills(jobPostId, seekerProfileId)
            setMissingSkills(missData.missing_skills)

            if (missData.missing_skills.length > 0) {
                const courseData: SkillGapResponse = await getAiRecommendedCourses(missData.missing_skills)
                const recommendedCourses = courseData.courses ?? []
                setCourses(recommendedCourses)
                
                // FIX: Use the first course's match_score instead of courseData.total
                if (recommendedCourses.length > 0 && recommendedCourses[0].match_score) {
                    setMatchScore(parsePercent(recommendedCourses[0].match_score))
                } else {
                    setMatchScore(0)
                }
            } else {
                setMatchScore(100)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    run()
}, [jobPostId, seekerProfileId])

    const meta = getMatchMeta(matchScore)
    const visibleCourses = showAllCourses ? courses : courses.slice(0, 1)
    const hiddenCount = courses.length - 1

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-joblin-primary flex items-center justify-center shrink-0">
                            <Zap size={13} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-joblin-black leading-tight">AI Skill Gap Analysis</p>
                            <p className="text-[11px] text-gray-400 leading-tight">Based on your profile and this job</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition"
                        aria-label="Close"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 py-10">
                            <div className="w-10 h-10 rounded-full border-4 border-joblin-primary border-t-transparent animate-spin" />
                            <p className="text-sm text-gray-500">Analyzing your skill match...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <p className="text-sm text-red-500 text-center">{error}</p>
                            <Button onClick={onClose} variant="outline" className="text-gray-500 border-gray-200">
                                Close
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Match Score Card */}
                            <div className={`rounded-xl p-4 ${meta.bg} flex items-center gap-4`}>
                                <div className={`w-16 h-16 rounded-full border-4 ${meta.ring} flex items-center justify-center shrink-0`}>
                                    <span className={`text-base font-bold ${meta.textColor}`}>{matchScore}%</span>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 mb-0.5">Match Score</p>
                                    <p className={`text-sm font-bold ${meta.textColor}`}>{meta.label}</p>
                                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{meta.desc}</p>
                                </div>
                            </div>

                            {/* Missing Skills */}
                            {missingSkills.length > 0 && (
                                <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-3">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <TriangleAlert size={13} className="text-orange-500 shrink-0" />
                                        <span className="text-xs font-semibold text-orange-700">Missing Skills</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {missingSkills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="text-[11px] bg-white border-orange-200 text-orange-700 px-2 py-0.5 rounded-full"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recommended Courses */}
                            {courses.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen size={13} className="text-joblin-black" />
                                            <span className="text-xs font-semibold text-joblin-black">Recommended Course</span>
                                        </div>
                                        {hiddenCount > 0 && (
                                            <button
                                                onClick={() => setShowAllCourses(!showAllCourses)}
                                                className="flex items-center gap-0.5 text-xs text-joblin-primary font-medium hover:underline"
                                            >
                                                {showAllCourses ? "Show less" : `+${hiddenCount} more`}
                                                {showAllCourses ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {visibleCourses.map((course) => {
                                            const fitPct = parsePercent(course.match_score)
                                            return (
                                                <div key={course.url} className="rounded-xl bg-joblin-primary p-3">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                                <Zap size={13} className="text-white" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-white leading-tight truncate">
                                                                {course.title}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                                            {fitPct}% fit
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge className="bg-white/20 text-white hover:bg-white/20 border-0 text-[10px] px-2 py-0.5">
                                                            {course.level}
                                                        </Badge>
                                                        <div className="flex items-center gap-1 text-[11px] text-white/80">
                                                            <BarChart2 size={11} className="text-white/70" />
                                                            <span>{fitPct}% match</span>
                                                        </div>
                                                    </div>

                                                    <a
                                                        href={course.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1 w-full rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium py-1.5 transition"
                                                    >
                                                        View Course <ExternalLink size={11} />
                                                    </a>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <p className="text-[11px] text-center text-gray-400 leading-snug">
                                Complete the recommended course to improve your compatibility with this role.
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={onClose}
                                    className="flex-1 bg-joblin-primary text-white hover:bg-joblin-primary/80 text-sm"
                                >
                                    Improve Match →
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="text-sm border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}