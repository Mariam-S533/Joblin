import { ParsedCV } from "@/app/Types/profile";
import { ProfileFormData } from "@/app/Types/profileShared";


export function mapParsedCVToFormData(parsedData: ParsedCV): ProfileFormData {
    return {
        // 1. Map Personal Info
        personal_info: {
            fullName: parsedData.personal_info.fullName || "", 
            headline: null, // Extra data sent as null
            phone: parsedData.personal_info.phone,
            location: {
                city: parsedData.personal_info.location?.city || null,
                country: parsedData.personal_info.location?.country || null
            },
            profilePictureUrl: null, // Extra data sent as null
            linkedin: parsedData.personal_info.linkedin,
            github: parsedData.personal_info.github,
            website: parsedData.personal_info.website
        },

        // 2. Map Work Experience
        work_experience: parsedData.work_experience.map(job => ({
            id: "", 
            company: job.company || "",
            title: job.title,
            location: {
                city: job.location?.city || null,
                country: job.location?.country || null
            },
            start_date: job.start_date,
            end_date: job.end_date,
            current: job.current,
            highlights: job.highlights || [],
            jobType: "" // Form requires a string, so we send an empty string instead of null
        })),

        // 3. Map Education
        education: parsedData.education.map(edu => ({
            id: "",
            institution: edu.institution || "",
            degree: edu.degree,
            field: edu.field,
            graduation_year: edu.graduation_year,
            gpa: edu.gpa,
            isStillStudying: false, // Form requires boolean, defaulting to false
            description: null // Extra data sent as null
        })),

        // 4. Map Certifications
        certifications: parsedData.certifications.map(cert => ({
            id: "",
            name: cert.name,
            issuer: cert.issuer,
            issued_date: cert.issued_date,
            expiry_date: cert.expiry_date ? String(cert.expiry_date) : null,
            fileUrl: null, // Extra data sent as null
            credentialUrl: null // Extra data sent as null
        })),

        // 5. Map Languages
        languages: parsedData.languages.map(lang => ({
            id: "",
            language: lang.language,
            proficiency: lang.proficiency
        })),

        // 6. Map Skills
        // Since ParsedCV doesn't have skills, we satisfy the form by sending an empty array
        skills: [] 
    };
}