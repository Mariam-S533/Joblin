"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { useForm, FormProvider } from "react-hook-form"
import { User, Medal, Building2, Link as LinkIcon, Globe, Lightbulb, GraduationCap, UploadCloud, Trash2, FileText, Copy, Check  } from "lucide-react"
import SectionBlock from "./SectionBlock"
import { PersonalInfoEdit } from "./PersonalInfo"
import Links from "./Links"
import SkillsEdit from "./Skills"
import Certifications from "./Certifications"
import Languages from "./Languages"
import { useProfileContext } from "@/app/context/ProfilesProvider"
import WorkExperienceEdit from "./Experience"
import EducationEdit from "./Education"
import { getSeekerInfo, getUserCer, getUserEdu, getUserLang, getUserSkills, getWorkExp, postWorkExp, editWorkExp, editSeekerInfo, editUserSkills, postUserEdu, editUserEdu, postUserCer, editUserCer, postUserLang, editUserLang } from "@/app/actions/profileSections.action"
import { getProfiles } from "@/app/actions/profile.action"
import { ProfileFormData, SkillSec } from "@/app/Types/profileShared"
import Link from "next/link"
import { mapParsedCVToFormData } from "@/lib/cvMapper"

export default function ProfileForm() {

    const methods = useForm<ProfileFormData>()
    const { parsedData, handelParseCV, handleSaveCV, currentProfileName, currentProfileId, clearParsedData, fetchProfiles, profilesList } = useProfileContext()
    const { handleSubmit, reset, watch, setValue, formState: { isDirty, isSubmitting } } = methods
    const [isAnySectionEditing, setIsAnySectionEditing] = useState(false)
    const formData = watch()




const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
const [copied, setCopied] = useState(false)
const fileInputRef = useRef<HTMLInputElement>(null)
const [hasSaved, setHasSaved] = useState(false)

const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFileName(file.name)
    await handelParseCV(file)
}

const handleRemoveFile = () => {
    setUploadedFileName(null)
    clearParsedData()
    if (fileInputRef.current) fileInputRef.current.value = ""
}

const handleCopyLink = () => {
    navigator.clipboard.writeText(`Joblin.com/u/LF-${currentProfileId || "8752322"}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
}

	// Normalize a skills field to an array — handles both backend arrays
	// and form-input comma-separated strings
	const toSkillArray = (val: unknown): string[] => {
	    if (Array.isArray(val)) return val
	    if (typeof val === "string") return val.split(",").map(s => s.trim()).filter(Boolean)
	    return []
	}

	const technicalSkills = toSkillArray(formData.skills?.technical)
	const toolsPlatforms = toSkillArray(formData.skills?.tools_and_platforms)
	const methodologies = toSkillArray(formData.skills?.methodologies)

        const calculateResumeQuality = (): { percentage: number; count: number; label: string } => {
            let completedSections = 0
            // Changed to fullName
            if (formData.personal_info?.fullname) completedSections++
            if (formData.work_experience && formData.work_experience.length > 0) completedSections++
            if (formData.education && formData.education.length > 0) completedSections++
            if (technicalSkills.length > 0 || toolsPlatforms.length > 0 || methodologies.length > 0) {completedSections++ }
            if (formData.certifications && formData.certifications.length > 0) completedSections++
            if (formData.languages && formData.languages.length > 0) completedSections++

            // Changed to check individual link fields instead of a socialLinks array
            if (formData.personal_info?.linkedin || formData.personal_info?.github || formData.personal_info?.website) completedSections++

            const percentage = Math.round((completedSections / 7) * 100)

            let label = "Needs Improvements"
            if (percentage >= 50 && percentage < 80) label = "Good Progress"
            if (percentage >= 80) label = "Excellent Match"

            return { percentage, count: completedSections, label }
        }

    const quality = calculateResumeQuality()



const getAllSections = useCallback(async () => {
    const activeId = currentProfileId || profilesList[0]?.id
    if (!activeId) return;

    try {
        const [seekerInfo, workExp, userSkills, userEdu, userCer, userLang] = await Promise.all([
            getSeekerInfo(),
            getWorkExp(activeId),
            getUserSkills(activeId),
            getUserEdu(),
            getUserCer(activeId),
            getUserLang()
        ]) 

        reset({
            personal_info: seekerInfo,
            work_experience: workExp,
            skills: userSkills,
            education: userEdu,
            certifications: userCer,
            languages: userLang
        })
    } catch (error) {
        console.error("Failed fetching profile sections:", error)
    }
}, [currentProfileId, profilesList, reset]) 


useEffect(() => {
    if (parsedData) {
        const safeFormData = mapParsedCVToFormData(parsedData);
        reset(safeFormData);
        setHasSaved(false);
    } else {
        getAllSections();
    }
}, [parsedData, reset, getAllSections]);




const onGlobalSave = async (data: ProfileFormData) => {
    // Normalize skills before saving — form inputs store comma-separated
    // strings but the backend expects string[]
    const skillsPayload: SkillSec = {
        technical: toSkillArray(data.skills?.technical),
        tools_and_platforms: toSkillArray(data.skills?.tools_and_platforms),
        methodologies: toSkillArray(data.skills?.methodologies),
    }

    try {
        if (parsedData) {
            await handleSaveCV({ ...data, skills: skillsPayload }, currentProfileName, currentProfileId)
            // Fetch fresh profile list to get the (potentially new) profile ID
            const freshProfiles = await getProfiles()
            const savedProfileId = currentProfileId || (freshProfiles && freshProfiles.length > 0 ? freshProfiles[0].id : null)
            // Explicitly save skills via the dedicated endpoint in case
            // /save-cv does not persist them. Don't let this fail the whole save.
            if (savedProfileId) {
                try {
                    await editUserSkills(savedProfileId, skillsPayload)
                } catch (skillErr) {
                    console.warn("Skills may already be saved via /save-cv, dedicated endpoint failed:", skillErr)
                }
            }
            await fetchProfiles()
            await getAllSections()
            setHasSaved(true)
            clearParsedData()
        } else {
            const activeId = currentProfileId || profilesList[0]?.id
            if (!activeId) return

            const { dirtyFields } = methods.formState

            const savePromises: Promise<any>[] = []

            if (dirtyFields.personal_info) {
                savePromises.push(editSeekerInfo(data.personal_info))
            }
            if (dirtyFields.skills) {
                savePromises.push(editUserSkills(activeId, skillsPayload))
            }
            if (dirtyFields.work_experience) {
                savePromises.push(
                    Promise.all(data.work_experience.map(job =>
                        job.id ? editWorkExp(activeId, Number(job.id), job) : postWorkExp(activeId, job)
                    ))
                )
            }
            if (dirtyFields.education) {
                savePromises.push(
                    Promise.all(data.education.map(edu =>
                        edu.id ? editUserEdu(Number(edu.id), edu) : postUserEdu(edu)
                    ))
                )
            }
            if (dirtyFields.certifications) {
                savePromises.push(
                    Promise.all(data.certifications.map(cert =>
                        cert.id ? editUserCer(activeId, Number(cert.id), cert) : postUserCer(activeId, cert)
                    ))
                )
            }
            if (dirtyFields.languages) {
                savePromises.push(
                    Promise.all(data.languages.map(lang =>
                        lang.id ? editUserLang(Number(lang.id), lang) : postUserLang(lang)
                    ))
                )
            }

            if (savePromises.length > 0) {
                await Promise.all(savePromises)
            }

            await getAllSections()
            setIsAnySectionEditing(false)
            setHasSaved(true)
        }
    } catch (error) {
        console.error("Global save failed", error)
    }
}



    const handleSaveExperienceOnly = async () => {
        try {
            if (!currentProfileId || !formData.work_experience) return

            await Promise.all(
                formData.work_experience.map(job => postWorkExp(currentProfileId, job))
            )

            const freshData = await getWorkExp(currentProfileId)
            setValue("work_experience", freshData, { shouldValidate: true, shouldDirty: false })
        } catch (err) {
            console.error("Failed saving Work Experience block:", err)
        }
    }

    const handleSavePersonalInfo = async () => {
        try {
            await editSeekerInfo(formData.personal_info)
            const freshData = await getSeekerInfo()
            setValue("personal_info", freshData, { shouldValidate: true, shouldDirty: false })
        } catch (err) {
            console.error("Failed saving Personal Info:", err)
        }
    }

    const handleSaveSkills = async () => {
        try {
            const activeId = currentProfileId || profilesList[0]?.id
            if (!activeId) return
            // Convert comma-separated strings from form inputs to arrays
            const skillsPayload: SkillSec = {
                technical: toSkillArray(formData.skills?.technical),
                tools_and_platforms: toSkillArray(formData.skills?.tools_and_platforms),
                methodologies: toSkillArray(formData.skills?.methodologies),
            }
            await editUserSkills(activeId, skillsPayload)
            const freshData = await getUserSkills(activeId)
            setValue("skills", freshData, { shouldValidate: true, shouldDirty: false })
        } catch (err) {
            console.error("Failed saving Skills:", err)
        }
    }

    const handleSaveEducation = async () => {
        try {
            await Promise.all(formData.education.map(edu =>
                edu.id ? editUserEdu(Number(edu.id), edu) : postUserEdu(edu)
            ))
            const freshData = await getUserEdu()
            setValue("education", freshData, { shouldValidate: true, shouldDirty: false })
        } catch (err) {
            console.error("Failed saving Education:", err)
        }
    }

    const handleSaveCertifications = async () => {
        try {
            const activeId = currentProfileId || profilesList[0]?.id
            if (!activeId) return
            await Promise.all(formData.certifications.map(cert =>
                cert.id ? editUserCer(activeId, Number(cert.id), cert) : postUserCer(activeId, cert)
            ))
            const freshData = await getUserCer(activeId)
            setValue("certifications", freshData, { shouldValidate: true, shouldDirty: false })
        } catch (err) {
            console.error("Failed saving Certifications:", err)
        }
    }

    const handleSaveLanguages = async () => {
        try {
            await Promise.all(formData.languages.map(lang =>
                lang.id ? editUserLang(Number(lang.id), lang) : postUserLang(lang)
            ))
            const freshData = await getUserLang()
            setValue("languages", freshData, { shouldValidate: true, shouldDirty: false })
        } catch (err) {
            console.error("Failed saving Languages:", err)
        }
    }

    // Extract social networks cleanly for ReadView
    const linkedInUrl = formData.personal_info?.linkedin
    const githubUrl = formData.personal_info?.github
    const websiteUrl = formData.personal_info?.website

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onGlobalSave)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
                <div className="lg:col-span-2 flex flex-col gap-4 p-5 rounded-lg border border-gray-2 00 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-5">
                            <div className="flex justify-center items-center rounded-md w-20 h-20 overflow-hidden bg-amber-200">
                                <Image src="/avater.jpg" alt="profile" width={80} height={80} className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-joblin-primary font-bold text-xl">{formData.personal_info?.fullname || "Name"}</h2>
                                <p className="text-joblin-dark-gray text-sm">{formData.personal_info?.phone || "No phone linked"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* 1. PERSONAL INFO */}
                        <SectionBlock
                            title="Personal Information" icon={User}
                            formKey="personal_info"
                            helperText="Add your personal information" ctaText="Personal Information"
                            hasData={!!formData.personal_info?.fullname}
                            readView={
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <p className='mb-1 text-joblin-light-gray text-[14px]'>Full Name</p>
                                        <p className='text-joblin-black text-[16px] font-medium'>{formData.personal_info?.fullname || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className='mb-1 text-joblin-light-gray text-[14px]'>Country</p>
                                        <p className='text-joblin-black text-[16px] font-medium'>{formData.personal_info?.location?.country || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className='mb-1 text-joblin-light-gray text-[14px]'>City</p>
                                        <p className='text-joblin-black text-[16px] font-medium'>{formData.personal_info?.location?.city || "N/A"}</p>
                                    </div>
                                </div>
                            }
                            renderEdit={() => <PersonalInfoEdit />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSavePersonalInfo}
                        />

                        {/* 2. WORK EXPERIENCE */}
                        <SectionBlock
                            title="Work Experience" icon={Building2}
                            formKey="work_experience"
                            helperText="Add your work experience" ctaText="Work Experience"
                            hasData={!!formData.work_experience && formData.work_experience.length > 0}
                            readView={
                                <div className="flex flex-col gap-4">
                                    {formData.work_experience?.map((job, i) => (
                                        <div key={i} className="border rounded-md p-3">
                                            <p className="font-bold text-joblin-black">{job.title}</p>
                                            <div className="flex items-center gap-2 text-joblin-dark-gray text-[14px] mb-2">
                                                <p className="font-medium text-joblin-primary">{job.company}</p>
                                                <span>•</span>
                                                <p>{job.start_date} - {job.current ? "Present" : "Ended"}</p>
                                            </div>

                                            {job.highlights && job.highlights.length > 0 && (
                                                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                                                    {job.highlights.map((highlight, index) => (
                                                        <li key={index} className="text-[14px] text-gray-600 whitespace-pre-line">
                                                            {highlight}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            }
                            renderEdit={() => <WorkExperienceEdit />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSaveExperienceOnly}
                        />

                        {/* 3. LINKS */}
                        <SectionBlock
                            title="Links" icon={LinkIcon}
                            formKey="personal_info"
                            helperText="Add your portfolio and social links" ctaText="Add links"
                            hasData={!!(formData.personal_info?.linkedin || formData.personal_info?.github || formData.personal_info?.website)}
                            readView={
                                <div className="flex flex-col gap-3">
                                    {linkedInUrl && (
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-joblin-light-gray">LinkedIn</p>
                                            <Link href={linkedInUrl} target="_blank" rel="noreferrer" className="text-joblin-primary hover:underline text-[14px]">{linkedInUrl}</Link>
                                        </div>
                                    )}
                                    {githubUrl && (
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-joblin-light-gray">GitHub</p>
                                            <Link href={githubUrl} target="_blank" rel="noreferrer" className="text-joblin-primary hover:underline text-[14px]">{githubUrl}</Link>
                                        </div>
                                    )}
                                    {websiteUrl && (
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-joblin-light-gray">Portfolio / Website</p>
                                            <Link href={websiteUrl} target="_blank" rel="noreferrer" className="text-joblin-primary hover:underline text-[14px]">{websiteUrl}</Link>
                                        </div>
                                    )}
                                </div>
                            }
                            renderEdit={() => <Links />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSavePersonalInfo}
                        />

                        {/* 4. EDUCATION */}
                        <SectionBlock
                            title="Education" icon={GraduationCap}
                            formKey="education"
                            helperText="Add your education" ctaText="Education"
                            hasData={!!formData.education && formData.education.length > 0}
                            readView={
                                <div className="flex flex-col gap-4">
                                    {formData.education?.map((edu, i) => (
                                        <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
                                            <p className="font-bold text-joblin-black">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                                            <p className="text-joblin-dark-gray text-[15px]">{edu.institution}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                            renderEdit={() => <EducationEdit />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSaveEducation}
                        />

                        {/* 5. SKILLS */}
                        <SectionBlock
                            title="Professional Skills" icon={Medal}
                            formKey="skills"
                            helperText="Add your professional skills" ctaText="Skills"
                            hasData={technicalSkills.length > 0 || toolsPlatforms.length > 0 || methodologies.length > 0}
                            readView={
                                    <div className="flex flex-col gap-4">
                                        {/* Technical Skills */}
                                            <div>
                                                <p className="text-[13px] text-joblin-light-gray mb-1">Technical Focus</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {technicalSkills.length > 0 ? (
                                                        technicalSkills.map((tech, i) => (
                                                            <span key={i} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[12px] font-medium">{tech}</span>
                                                        ))
                                                    ) : (
                                                        <p className="text-joblin-black font-medium text-[14px]">No technical focus added</p>
                                                    )}
                                                </div>
                                            </div>

                                        {/* Tools & Platforms (Array) */}
                                        <div>
                                            <p className="text-[13px] text-joblin-light-gray mb-1">Tools & Platforms</p>
                                            <div className="flex flex-wrap gap-2">
                                                {toolsPlatforms.map((tool, i) => (
                                                    <span key={i} className="bg-gray-100 px-2 py-1 rounded text-[12px]">{tool}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Methodologies (Array) */}
                                        <div>
                                            <p className="text-[13px] text-joblin-light-gray mb-1">Methodologies</p>
                                            <div className="flex flex-wrap gap-2">
                                                {methodologies.map((method, i) => (
                                                    <span key={i} className="bg-gray-100 px-2 py-1 rounded text-[12px]">{method}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                            }
                            renderEdit={() => <SkillsEdit />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSaveSkills}
                        />

                        {/* 6. CERTIFICATIONS */}
                        <SectionBlock
                            title="Certifications" icon={Lightbulb}
                            formKey="certifications"
                            helperText="Add your certifications" ctaText="Certifications"
                            hasData={!!formData.certifications && formData.certifications.length > 0}
                            readView={
                                <div className="flex flex-col gap-3">
                                    {formData.certifications?.map((cert, i) => (
                                        <div key={i} className="border-l-2 border-joblin-primary pl-3">
                                            <p className="font-medium text-joblin-black">{cert.name}</p>
                                            <p className="text-joblin-dark-gray text-[14px]">{cert.issuer}</p>
                                            {cert.issued_date && <p className="text-joblin-light-gray text-[12px] mt-1">Completed: {cert.issued_date}</p>}
                                        </div>
                                    ))}
                                </div>
                            }
                            renderEdit={() => <Certifications />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSaveCertifications}
                        />

                        {/* 7. LANGUAGES */}
                        <SectionBlock
                            title="Languages" icon={Globe}
                            formKey="languages"
                            helperText="Add your languages" ctaText="Languages"
                            hasData={!!formData.languages && formData.languages.length > 0}
                            readView={
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[...new Map(formData.languages?.map(l => [l.language + "|" + l.proficiency, l])).values()].map((lang, i) => (
                                        <div key={i} className="flex flex-col">
                                            <p className="font-medium text-joblin-black">{lang.language}</p>
                                            <p className="text-joblin-light-gray text-[13px]">{lang.proficiency || "--"}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                            renderEdit={() => <Languages />}
                            onEditingChange={value => setIsAnySectionEditing(value)}
                            onSectionSave={handleSaveLanguages}
                        />

                    </div>
                </div>



                {/* RIGHT SIDEBAR COLUMN: COMPLETELY STATIC MODULE FLOW */}
                <div className="lg:col-span-1 flex flex-col gap-4 sticky top-4">
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center select-none pointer-events-none">
                        <h3 className="font-bold text-gray-800 text-base mb-4">Your Resume Quality</h3>
                        
                        <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                                <circle 
                                    cx="50" cy="50" r="40" 
                                    stroke={quality.percentage < 50 ? "#EF4444" : "#00B074"} 
                                    strokeWidth="8" fill="transparent" 
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * quality.percentage) / 100}
                                    className="transition-all duration-500 stroke-linecap-round"
                                />
                            </svg>
                            <span className="absolute text-2xl font-black text-gray-800">{quality.percentage}%</span>
                        </div>

                        <span className={`text-xs font-bold py-2 px-5 rounded-sm mb-4 ${quality.percentage < 50 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#00B074]'}`}>
                            {quality.label}
                        </span>

                        <p className="text-xs text-gray-500 mb-4 font-medium">
                            <span className="font-bold text-gray-800">{quality.count}</span> / 7 sections completed
                        </p>

                        {/* Breakdown sub-items */}
                        <div className="w-full text-left bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 text-[11px] text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${formData.personal_info?.fullname ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <p>Personal Details</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${formData.work_experience?.length ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <p>Work Background</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        (technicalSkills.length > 0 ||
                                        toolsPlatforms.length > 0 ||
                                        methodologies.length > 0)
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                                    }`}
                                />
                                <p>Skill Core Capabilities</p>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 2: DYNAMIC UPLOAD DISPLAY */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-800 text-sm mb-3 text-center">Uploaded resume</h4>
                        <input
                        title="grtkj" 
                            type="file" 
                            accept=".pdf" 
                            ref={fileInputRef}
                            onChange={handleUploadResume} 
                            className="hidden" 
                        />

                        {uploadedFileName || parsedData ? (
                            /* File loaded state layout */
                            <div className="border border-emerald-200 bg-emerald-50/20 p-4 rounded-xl flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800 truncate">
                                            {uploadedFileName || "parsed-resume.pdf"}
                                        </p>
                                        <p className="text-[10px] text-emerald-600 font-medium">File ready for submission</p>
                                    </div>
                                    <button
                                        title= "delete" 
                                        type="button" 
                                        onClick={handleRemoveFile}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-md hover:bg-gray-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition"
                                >
                                    Replace File
                                </button>
                            </div>
                        ) : (
                            /* Empty upload placeholder layout */
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 hover:border-[#00B074] bg-gray-50/50 hover:bg-white transition p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer group"
                            >
                                <UploadCloud size={32} className="text-gray-400 group-hover:text-[#00B074] mb-2 transition" />
                                <p className="text-xs font-bold text-gray-700 mb-0.5">Click to upload document</p>
                                <p className="text-[10px] text-gray-400">PDF files accepted up to 5MB</p>
                            </div>
                        )}
                    </div>

                    {/* WIDGET 3: SHARE LINK & MOCK VECTOR QR CODE */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <h4 className="font-bold text-gray-800 text-sm mb-1 text-center">Your Resume Link</h4>
                        <p className="text-[11px] text-gray-400 mb-3 text-center">Share your unique interactive profile mapping</p>
                        
                        {/* Mock Vector QR code blocks */}
                        <div className="self-center p-2 border rounded-xl bg-white mb-4 shadow-sm select-none pointer-events-none">
                            <div className=" bg-gray-50 border border-gray-100 rounded-lg flex flex-wrap p-1 gap-1 relative overflow-hidden">
                                <Image alt="scan" src="/scan.png" width={40} height={24} className="object-cover"/>
                            </div>
                        </div>

                        {/* Copy Link Row layout */}
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-2.5 mb-2">
                            <span className="text-[11px] font-bold text-gray-600 truncate mr-2">
                                Joblin.com/u/LF-{currentProfileId || "8752322"}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="p-1.5 bg-white border rounded-md text-gray-500 hover:text-gray-800 transition shadow-sm hover:bg-gray-50"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* ACTIONS INTERACTION CTA PANEL */}
                      <button
                        type="submit"
                        className="w-full bg-[#00B074] text-white py-3.5 rounded-xl font-bold hover:opacity-95 shadow-md shadow-green-500/10 transition disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                        disabled={(!parsedData && !isAnySectionEditing) || isSubmitting || hasSaved}
                    >
                        {isSubmitting ? "Processing Modifications..." : hasSaved ? "Saved!" : "Save Profile Details"}
                    </button>

                </div>


                

            </form>
        </FormProvider>
    )
}




