"use server"

import { userToken } from "@/lib/userToken"
import { CertificatSec, EducationSec, PersonalInfoSec, SkillSec, WorkExpSec, LanguageSec } from "../Types/profileShared"


const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL 

// Safe JSON parse — backend may return 200 with an empty body
async function safeJson(res: Response, fallback?: unknown) {
    const text = await res.text()
    if (!text) return fallback
    return JSON.parse(text)
}


//PersonalInfo actions
export async function getSeekerInfo() {
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get personalInfo: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function editSeekerInfo(SeekerInfo: PersonalInfoSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(SeekerInfo)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to edit profileInfo: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res, SeekerInfo)
    return payload
}

//Work experiance actions

export async function getWorkExp(profileId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/work-experiences`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get workexperiance: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function postWorkExp(profileId: string, workExpData: WorkExpSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/work-experiences`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(workExpData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function editWorkExp(profileId: string, id: number ,workExpData: WorkExpSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/work-experiences/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(workExpData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function deletWorkExp(profileId: string, id: number){

    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/work-experiences/${id}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

//Skills
export async function getUserSkills(profileId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/skills`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get skills: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function editUserSkills(profileId: string, SkillData: SkillSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/skills`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(SkillData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save skills: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res, SkillData)
    return payload
}

//Education
export async function getUserEdu(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/educations`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get user education: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function postUserEdu(eduData: EducationSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/educations`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(eduData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function editUserEdu(id: number, eduData: EducationSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/educations/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(eduData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function deletUserEdu(id: number){

    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/educations/${id}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

//certifications
export async function getUserCer(profileId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/certifications`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get user education: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function postUserCer(profileId: string ,certData: CertificatSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/certifications`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(certData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function editUserCer( profileId: string ,  id: number ,certData: CertificatSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/certifications/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(certData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function deletUserCer(profileId: string, id: number){

    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/${profileId}/certifications/${id}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

//languages
export async function getUserLang(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/languages`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get user lang: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function postUserLang(langData: LanguageSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/languages`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(langData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function editUserLang(id: number, langData: LanguageSec){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/languages/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(langData)
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

export async function deletUserLang(id: number){

    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Profile/languages/${id}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}




//add profile pic
export async function postUserPicture(file: File){
    const token  = await userToken()

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${baseUrl}/api/Profile/picture`,{
        method:'POST',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: formData
    })

     if (!res.ok) {
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to save profile: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
    return payload
}

