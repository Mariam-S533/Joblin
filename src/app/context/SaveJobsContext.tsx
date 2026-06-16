"use client"
import {  createContext, useContext, useEffect, useState } from 'react'
import { getAllSavedJobs, saveAjopPost, unSaveAjopPost } from "../actions/savedJop.action"
import { SavedJops } from "../Types/savedJobs"

interface SaveJobsContextType{
    allSavedJobs: SavedJops[] ,
    getSavedDetails: ()=>Promise<void>,
    addToSavedJobs: (jobPostId: string, seekerProfileId: string)=>Promise<void>,
    removeSavedJob: (jobPostId: string)=>Promise<void>,
}

const SaveJobsContext = createContext<SaveJobsContextType>({
    allSavedJobs: [],
    getSavedDetails: async()=>{},
    addToSavedJobs: async()=>{},
    removeSavedJob: async()=>{}
})


export default function SaveJobsContextProvider({children}: {children: React.ReactNode}) {

    const [allSavedJobs, setAllSavedJobs] = useState<SavedJops[]>([])

        
    async function getSavedDetails(){
        const details = await getAllSavedJobs()
        setAllSavedJobs(details ?? [])
    }

    async function addToSavedJobs(jobPostId: string, seekerProfileId: string){
        await saveAjopPost(jobPostId, seekerProfileId)
        await getSavedDetails()
    }


    async function removeSavedJob(jobPostId: string){

        await unSaveAjopPost(jobPostId)
        await getSavedDetails()
    }

        useEffect(()=>{
            async function initializeJobs() {
            await getSavedDetails()
            }
            initializeJobs()
        },[])

  return <>
  <SaveJobsContext.Provider  value={{allSavedJobs, getSavedDetails, addToSavedJobs, removeSavedJob}}>
    {children}
  </SaveJobsContext.Provider>
  
  </>
}



export function useSaveJobsContext(){

     const mySavedJobs = useContext(SaveJobsContext)
     return mySavedJobs
}


