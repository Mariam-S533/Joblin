export interface CourseSkill {
  id: string
  name: string
}

export interface CourseOffering {
  id: string
  companyId: string
  companyName: string
  companyLogoUrl: string | null
  createdAt: string
  deadline: string | null
  title: string
  description: string | null
  duration: string
  startDate: string | null
  endDate: string | null
  country: string
  city: string
  street: string | null
  price: string
  currency: string | null
  enrollmentUrl: string
  hasCertificate: boolean
  outcomeDescription: string | null
  technicalDomain: string
  deliveryMode: string
  difficultyLevel: string
  offeringStatus: string
  providedSkills: CourseSkill[]
}

//get all anrolments

export interface CourseEnrollment {
  enrollmentId: string
  offeringPostId: string
  offeringTitle: string
  companyName: string
  status: string
  appliedAt: string
}

