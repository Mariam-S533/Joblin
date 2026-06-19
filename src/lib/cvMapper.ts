import { ProfileFormData } from "@/app/Types/profileShared";

export function mapParsedCVToFormData(parsedData: any): ProfileFormData {
    const rawPersonalInfo = parsedData?.personal_info || {};
    const rawSkills = parsedData?.skills || {};

    return {
        personal_info: {
            fullname: rawPersonalInfo.fullname || rawPersonalInfo.fullName || "",
            email: rawPersonalInfo.email || "",
            headline: rawPersonalInfo.headline || "",
            phone: rawPersonalInfo.phone || "",
            location: {
                city: rawPersonalInfo.location?.city || "",
                country: rawPersonalInfo.location?.country || ""
            },
            profilePictureUrl: rawPersonalInfo.profilePictureUrl || "",
            linkedin: rawPersonalInfo.linkedin || "",
            github: rawPersonalInfo.github || "",
            website: rawPersonalInfo.website || ""
        },

        work_experience: (parsedData?.work_experience || []).map((job: any) => ({
            id: job.id || "",
            company: job.company || "",
            title: job.title || "",
            location: {
                city: job.location?.city || "",
                country: job.location?.country || ""
            },
            start_date: job.start_date || "",
            end_date: job.end_date || "",
            current: job.current ?? false,
            highlights: job.highlights || [],
            jobType: job.jobType || ""
        })),

        education: (parsedData?.education || []).map((edu: any) => ({
            id: edu.id || "",
            institution: edu.institution || "",
            degree: edu.degree || "",
            field: edu.field || "",
            graduation_year: edu.graduation_year || "",
            gpa: edu.gpa || "",
            isStillStudying: edu.isStillStudying ?? false,
            description: edu.description || ""
        })),

        certifications: (parsedData?.certifications || []).map((cert: any) => ({
            id: cert.id || "",
            name: cert.name || "",
            issuer: cert.issuer || "",
            issued_date: cert.issued_date || "",
            expiry_date: cert.expiry_date ? String(cert.expiry_date) : "",
            fileUrl: cert.fileUrl || "",
            credentialUrl: cert.credentialUrl || ""
        })),

        languages: (parsedData?.languages || []).map((lang: any) => ({
            id: lang.id || "",
            language: lang.language || "",
            proficiency: lang.proficiency || ""
        })),

        skills: {
            technical: Array.isArray(rawSkills.technical) ? rawSkills.technical : [],
            tools_and_platforms: Array.isArray(rawSkills.tools_and_platforms) ? rawSkills.tools_and_platforms : [],
            methodologies: Array.isArray(rawSkills.methodologies) ? rawSkills.methodologies : [],
        }
    };
}
