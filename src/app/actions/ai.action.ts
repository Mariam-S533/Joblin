"use server"

import { userToken } from "@/lib/userToken"
import { parseCV } from "./profile.action"
import { mapParsedCVToFormData } from "@/lib/cvMapper"
import { saveParsedData } from "./profile.action"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 

export interface EnhanceCVResponse {
    jobPostId: string
    jobTitle: string
    enhancedResume: string
    modelUsed: string
    reasoningStrategy: string
}

export async function enhanceCV(jobPostId: string, formData: FormData): Promise<EnhanceCVResponse> {
    const token = await userToken()

    const res = await fetch(`${baseUrl}/api/Ai/enhance-cv?jobPostId=${jobPostId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-Anti-Phishing-Page": "true",
        },
        body: formData,
    })

    if (!res.ok) {
        const detail = await res.text()
        throw new Error(`Enhance CV failed (${res.status}): ${detail}`)
    }

    return await res.json()
}

export async function enhanceAndSaveCV(
    pdfFormData: FormData,
    seekerProfileName: string,
    seekerProfileId?: string
): Promise<void> {
    const parsedRaw = await parseCV(pdfFormData)

    const mapped = mapParsedCVToFormData(parsedRaw)

    await saveParsedData(mapped, seekerProfileName, seekerProfileId)
}
