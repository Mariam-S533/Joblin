

export interface Location {
  city:    string | null,
  country: string | null
}
 
export interface PersonalInfo {
  fullName: string | null,
  email:     string | null,
  phone:     string | null,
  location:  Location,
  linkedin:  string | null,
  github:    string | null,
  website:   string | null
}
 
export interface WorkExperience {
  company:    string | null,
  title:      string,
  location:   Location, //nshof
  start_date: string | null,
  end_date:   string | null,
  current:    boolean,
  highlights: string[] 
}

export interface Education {
  institution:      string | null,
  degree:           string | null,
  field:            string | null,
  graduation_year:  string | null,
  gpa:              string | null
}
 
export interface Skills {
  technical:          string,
  tools_and_platforms: string[],
  methodologies:      string[],
}
 
export interface Certification {
  name:         string,
  issuer:       string | null,
  issued_date:  string | null,
  expiry_date:  null          //be sure!
}
 
export interface Language {
  language:    string,
  proficiency: string | null
}
 
export interface ParsedCV {
  personal_info:   PersonalInfo,
  skills: Skills,
  work_experience: WorkExperience[],
  education:       Education[], 
  certifications:  Certification[],
  languages:       Language[]
}
 
export interface SeekerProfile {
  seekerProfileId:   string ,
  seekerProfileName: string,
  parsedData:        ParsedCV | null
}


//get all profiles

export interface Profile{
  id: string,
  profileName: string,
  technicalDomain: string,
  skillsCount: string
}



//get specific profile

export interface ProfileSkill {
  id: string,
  name: string
}

export interface ProfileWorkLocation {
  city: string | null,
  country: string | null
}

export interface ProfileWorkExperience {
  id: string,
  company: string,
  title: string,
  location: ProfileWorkLocation,
  start_date: string | null,
  end_date: string | null,
  current: boolean,
  highlights: string[],
  jobType: string
}

export interface ProfileCertification {
  id: string,
  name: string,
  issuer: string | null,
  issued_date: string | null,
  expiry_date: string | null,
  fileUrl: string | null,
  credentialUrl: string | null
}

export interface OneProfileData {
  id: string,
  profileName: string,
  technicalDomain: string,
  skills: ProfileSkill[],
  workExperiences: ProfileWorkExperience[],
  certifications: ProfileCertification[]
}





