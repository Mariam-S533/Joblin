
"use client"

import { useSaveJobsContext } from '@/app/context/SaveJobsContext' // Adjust path to match your folder
import { LoaderCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BookmarkButtonProps {
  jobPostId: string
  seekerProfileId: string
}

function BookmarkButton({ jobPostId, seekerProfileId }: BookmarkButtonProps) {
  const { allSavedJobs, addToSavedJobs, removeSavedJob } = useSaveJobsContext()
  const [loading, setLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const exists = allSavedJobs?.some((job) => job.jobPostId === jobPostId)
    setIsSaved(!!exists)
  }, [allSavedJobs, jobPostId])

  async function handleToggleSave() {
    try {
      setLoading(true)

      if (isSaved) {
        setIsSaved(false) 
        await removeSavedJob(jobPostId)
        toast.success("Job removed from saved list", { position: "bottom-right" })
      } else {
        setIsSaved(true) 
        await addToSavedJobs(jobPostId, seekerProfileId)
        toast.success("Job saved successfully", { position: "bottom-right" })
      }
    } catch (error) {
      const exists = allSavedJobs?.some((job) => job.jobPostId === jobPostId)
      setIsSaved(!!exists)
      toast.error("Something went wrong", { position: "bottom-right" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggleSave} 
      type="button" 
      disabled={loading}
      className="flex items-center justify-center p-1.5 rounded-full hover:bg-gray-50 transition-colors"
    >
      {loading ? (
        <LoaderCircle className="animate-spin text-gray-600" size={20} />
      ) : isSaved ? (
        <i className="fa-solid fa-bookmark cursor-pointer text-joblin-primary text-xl" />
      ) : (
        <i className="fa-regular fa-bookmark cursor-pointer text-black text-xl" />
      )}
    </button>
  )
}

export default BookmarkButton
