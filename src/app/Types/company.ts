export interface SocialLink {
  platform: string
  url: string
}

export interface CompanyAddress {
  id: number
  branchName: string
  country: string
  city: string
  regionOrState: string
  postalCode: string | null
  isHeadQuarters: boolean
}

// all comp
export interface CompanyData {
  id: string
  companyName: string
  publicContactMail: string
  domain: string
  description: string
  logoUrl: string | null
  companySize: number
  addresses: CompanyAddress[]
}

export interface CompDetails {
  id: string
  companyName: string
  publicContactMail: string
  domain: string
  description: string
  logoUrl: string
  companySize: string
  growthStage: string
  workModePolicy: string[]
  socialLinks: SocialLink[]
  addresses: CompanyAddress[]
  followersCount: number
}





