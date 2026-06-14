"use client"

import ApplyStatusTab from '@/components/activity/ApplyStatusTab'
import CoursesStatusTab from '@/components/activity/CoursesStatusTab'
import SavedJobTab from '@/components/activity/SavedJobTab'
import { Tabs ,TabsContent, TabsList, TabsTrigger, } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Briefcase, Equal } from 'lucide-react'
import { useState } from 'react'

const Tabs_Items = [
  { value: "apply", label: "Apply status" },
  { value: "saved", label: "Saved job" },
  { value: "courses", label: "Courses status" },
  { value: "follow", label: "Followed companies" },
  { value: "offer", label: "Offered Job" },
]

function ActivityComponent() {

  const [activeTab, setActiveTab] = useState("apply")
  const activeLabel = Tabs_Items.find(tab => tab.value === activeTab)?.label || "Activity"

  return <>
  <div className="md:w-[95%] mx-auto w-full p-3">
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">


      <div className="flex md:hidden items-center justify-between bg-white border border-gray-100 rounded-t-xl p-4 ">
          <div className="flex items-center gap-2 font-semibold text-joblin-black">
            <Briefcase className="w-5 h-5 text-joblin-black" />
            <span className='text-[18px]'>Job {activeLabel}</span>
          </div>

    <DropdownMenu>
            <DropdownMenuTrigger className="p-2 hover:bg-gray-50 rounded-md transition outline-none cursor-pointer">
              <Equal size={25}  className=" text-gray-800" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white rounded-2xl p-2 shadow-xl border border-gray-100 mt-1">
              {Tabs_Items.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`text-[16px] py-3 px-4 font-medium rounded-xl transition cursor-pointer ${
                    activeTab === tab.value
                      ? "text-joblin-primary bg-green-50/50 border-b-2 border-joblin-primary rounded-b-none"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
      </DropdownMenu>
      </div>

      {/* Desctop */}
    
    <TabsList className=" hidden md:flex border-b  border-gray-150 rounded-none  items-center gap-5 w-full p-0 ">

        {Tabs_Items.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:border-joblin-primary data-[state=active]:text-joblin-primary border-b border-transparent rounded-none bg-transparent p-3 text-[16px] font-medium text-[#A5A5A5] shadow-none transition-all hover:text-joblin-primary">
            {tab.label}
        </TabsTrigger>
        ))}

    </TabsList>

      <TabsContent value="apply">
        <ApplyStatusTab />
      </TabsContent>
      <TabsContent value="saved">
        <SavedJobTab/>
      </TabsContent>
      <TabsContent value="courses">
        <CoursesStatusTab/>
      </TabsContent>

    </Tabs>
  </div >
  
  </>
}

export default ActivityComponent