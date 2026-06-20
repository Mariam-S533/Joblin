
//returned from /api/Ai/skill-gap
export interface MissSkills{
    missing_skills: string[]
}


//returned from /api/Ai/recommend-course
export interface SkillGapCourse {
    title: string
    url: string
    description: string
    skills: string[]
    level: string
    match_score: number
}

export interface SkillGapResponse {
    skills: string[]
    total: string
    courses: SkillGapCourse[]
}



