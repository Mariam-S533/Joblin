
//PersonalInfo Section
export interface PersonalInfoSec {
  fullname: string,
  headline: string | null,
  phone: string | null,
  location: {
    city: string | null,
    country: string | null
  },
  profilePictureUrl: string | null,
  linkedin: string | null,
  github: string | null,
  website: string | null
}

//skils section
export interface SkillSec{
  technical:          string[],
  tools_and_platforms: string[],
  methodologies:      string[],
}

//education section
export interface EducationSec {
  id: string,
  institution: string,
  degree: string | null,
  field: string | null,
  graduation_year: string | null,
  gpa: string | null,
  isStillStudying: boolean,
  description: string | null
}

//work experience Section
export interface WorkExpSec {
  id: string,
  company: string,
  title: string,
  location: {
    city: string | null,
    country: string | null
  },
  start_date: string | null,
  end_date: string | null,
  current: boolean,
  highlights: string[],
  jobType: string
}


//certification section
export interface CertificatSec {
  id: string,
  name: string,
  issuer: string | null,
  issued_date: string | null,
  expiry_date: string | null,
  fileUrl: string | null,
  credentialUrl: string | null
}


//languages section
export interface LanguageSec{
  id: string,
  language: string,
  proficiency: null | string
}




export interface ProfileFormData{
  personal_info: PersonalInfoSec,
  work_experience: WorkExpSec[],
  certifications: CertificatSec[] ,
  skills: SkillSec ,
  languages: LanguageSec[] ,
  education: EducationSec[] ,
} 



//profile pic
export interface ProfilePic{
  imageUrl: string
}
