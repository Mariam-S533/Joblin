"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ParsedCV, Profile } from '../Types/profile'
import { getProfiles, parseCV, saveParsedData } from '../actions/profile.action'
import { ProfileFormData } from '../Types/profileShared'


interface ProfileContextType{
    parsedData: ParsedCV | null,
    currentProfileId: string 
    setCurrentProfileId: (id: string ) => void

    currentProfileName: string
    setCurrentProfileName: (name: string) => void

    handelParseCV: (file: File)=>Promise<void>,
    handleSaveCV:(parsedData: ProfileFormData,
                    profileName: string,
                    profileId: string | null,
                    )=>Promise<void>,
    clearParsedData: () => void,
    savedMsg:string,

    profilesList: Profile[],
    fetchProfiles: () => Promise<void>

}


const ProfileContext = createContext<ProfileContextType>({
    parsedData: null,
    currentProfileId: "",
    setCurrentProfileId: () => {},
    currentProfileName: "My Profile",
    setCurrentProfileName: () => {},
    handelParseCV: async () => {},
    handleSaveCV: async () => {},
    clearParsedData: () => {},
    savedMsg: "",
    profilesList: [],
    fetchProfiles: async () => {}
})


function ProfilesContextProvider({children}: {children: React.ReactNode}) {

    const [parsedData, setParsedData] = useState<ParsedCV | null>(null)
    const [currentProfileId, setCurrentProfileId] = useState<string>("")
    const [currentProfileName, setCurrentProfileName] = useState("My Profile")
    const [savedMsg, setSavedMsg] = useState("")
    const [profilesList, setProfilesList] = useState<Profile[]>([]);


            async function fetchProfiles(){
                try { 
                    const profilesArray = await getProfiles() 
                    setProfilesList(profilesArray) 
                    if (profilesArray.length > 0) 
                        { setCurrentProfileId((prevId) => prevId || profilesArray[0].id); 

                        } 
                    } catch (error) 
                    { 
                        console.error("fetch profiles error:", error) 
                    } 
                }

        useEffect(() => {
        async function load() {
            await fetchProfiles()  
        }
        load()
        }, [])



    async function handelParseCV(file: File) {

        try {
            const formData = new FormData();
            formData.append("file", file);
            const data = await parseCV(formData)
            setParsedData(data)
        } catch (error) {
            console.log("parse errorrrrrrrrrrrrrrrrrrrrrrr", error)
        }
        
    }

    async function handleSaveCV(returnedData: ProfileFormData, profileName: string, profileId: string | null) {
        // if (!parsedData) return  //will handeled in btn

        try {
            const msg = await saveParsedData(returnedData, profileName, profileId || undefined)
            setSavedMsg(msg)
            await fetchProfiles()
        } catch (error) {
            console.error("Save error:", error)
        }
        
    }


    function clearParsedData() {
        setParsedData(null)
    }

  return <>
        <ProfileContext.Provider value={{
            savedMsg,
            handleSaveCV,
            handelParseCV,
            clearParsedData,
            setCurrentProfileName,
            currentProfileName,
            parsedData,
            setCurrentProfileId,
            currentProfileId,
            profilesList,
            fetchProfiles,
        }}>
            {children}
        </ProfileContext.Provider>
  </>
}

export default ProfilesContextProvider

export function useProfileContext() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfilesContextProvider");
    }
    return context;
}
