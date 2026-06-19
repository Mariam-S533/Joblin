export interface SearchJobResult {
  jobPostId: string,
  jobTitle: string,
  description: string | null,
  score: string,
  skills: string[],
  companyId: string,
  companyName: string,
  companyLogoUrl: string | null,
  country: string,
  city: string,
  jobType: string,
  workMode: string,
  experienceLevel: string
}

export interface SearchJobsResponse {
  query: string,
  total: string,
  results: SearchJobResult[]
}
