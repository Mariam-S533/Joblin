
//personalInfo
interface SocialLinks{
    platform: string,
    url: string
}

export interface SeekerInfoSec{
    full_name: string,
    headline: string,
    phone: string,
    country: string,
    city: string,
    profilePictureUrl: string,
    socialLinks: SocialLinks[]
}


//Skills
export interface SkillSec{
    skillIds: number[],
    technicalDomain: string
}


//education
export interface EducationSec{
    universityName: string,
    fieldOfStudy: string,
    degreeLevel: string,
    startDate: string,
    endDate: null,
    isStillStudying: boolean,
    description: null
}


//work experiance
export interface WorkExpSec{
    companyName: string,
    jobTitle: string,
    description: string,
    jobType: string,
    country: string,
    city: string,
    startDate: string,
    endDate: null,
    isCurrentRole: boolean
}



//certifications
export interface CertificatSec{
    id: string,
    title: string,
    fileUrl: null,
    attachmentType: string,
    issuer: string,
    completionDate: string,
    credentialUrl: string
}
// export type Certifications = Certificat[]



//Languages 
export interface LanguageSec{
    name: string,
    proficiency: string
}


//projects
export interface ProjectSec{
    id: string,
    name: string,
    description: string,
    skills: string[],
    githubLink: null| string,
    liveDemoUrl: null | string,
    projectImageUrl: null| string,
    completionDate: string
}

