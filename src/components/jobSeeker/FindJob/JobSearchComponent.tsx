"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {  Funnel, MapPin, Search } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {  useState } from 'react'
import { JobPost } from '@/app/Types/seekerActivity'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,} from "@/components/ui/pagination"
import JobPostCard from './JobPostCard';


function JobSearchComponent({jobs}: {jobs: JobPost[]}) {

    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const jobsPerPage = 12

    const totalPages = Math.ceil(jobs.length / jobsPerPage)
    const startIndex = (currentPage - 1) * jobsPerPage
    const endIndex = startIndex + jobsPerPage

    const currentJobs = jobs.slice(startIndex, endIndex)


        const handleCheckboxChange = (checked: boolean | string, label: string) => {
        setActiveFilters((prev) => {
            if (checked === true) {
                return prev.includes(label) ? prev : [...prev, label];
            }
            return prev.filter((item) => item !== label);
        });
    };

    const handleRadioChange = (value: string, availableOptions: { [key: string]: string }) => {
        const targetLabel = availableOptions[value];
        const filtered = activeFilters.filter(item => !Object.values(availableOptions).includes(item));
        if (targetLabel) {
            setActiveFilters([...filtered, targetLabel]);
        } else {
            setActiveFilters(filtered);
        }
    };

    const removeFilter = (label: string) => {
        setActiveFilters((prev) => prev.filter((item) => item !== label));
    };


  return <>
  
    <div className=" w-full min-h-screen bg-white">
     <div className="lg:container md:w-[85%] w-[90%] mx-auto">
      <div className="">
          {/* header   */}
          <div className="flex flex-col mx-auto items-center justify-center gap-3 mb-8">
            <h1 className=' font-semibold text-joblin-black lg:text-[32px] text-[28px] '>Discover the Best Job</h1>
            <div className="  flex flex-col md:flex-row w-full  md:items-center lg:w-[50%] md:w-[85%]  rounded-md shadow-sm overflow-hidden border border-gray-200 ">
              <div className="flex items-center px-3 py-2 gap-0.5  ">
                <Search size={15} className="text-muted-foreground shrink-0"/>
                <input
                type="text"
                placeholder="Job title or keywords"
                className="border-0 p-1 outline-0 text-sm w-full "
                />
              </div>

              <div className="block md:hidden h-px bg-gray-200 mx-3" />
              <div className="hidden md:block h-6">
                <Separator orientation="vertical" className="bg-gray-300" />
              </div>

              <div className="flex flex-1 gap-1 items-center px-3 py-2 md:py-0">
                <MapPin size={15} className="size-4 shrink-0 text-muted-foreground"/>
              <Select  >
                <SelectTrigger
                  className=" w-full min-w-0 border-0 bg-transparent px-0 pr-1 shadow-none focus:ring-0 focus-visible:ring-0"
                  size="sm">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="egypt">Egypt</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
              </div>
            
                <button type="button" className=" w-full md:w-auto bg-joblin-primary text-white px-6 py-3 text-sm font-medium flex items-center justify-center gap-2">
                <Search size={15}/> <span>Search</span>
              </button>     
            </div>
          </div>

          {/* mean content */}
          <div className="">
            {/* filter button in mobile screen */}
            <div className="lg:hidden mb-4">
                <div className='relative '>
                <button type='button'
                        onClick={() => setShowFilters(!showFilters)}
                        className='flex items-center gap-2 border cursor-pointer border-joblin-light-gray py-1 px-3 rounded-sm text-[#282828]'>
                    <Funnel size={18}/> <span className='text-[15px]'>Filter</span>
                </button>
                </div>
            </div>

            {showFilters && (
                <div className="mb-4">
                    <JobFilters/>
                </div>
            )}

            
            <div className="flex items-start gap-8">
              <div className="hidden lg:block flex-shrink-0 w-64">
                    <JobFilters/>
              </div>


              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentJobs.map((job)=> <JobPostCard key={job.id} jobPost={job}/>)}
              </div>
            

            </div>

            {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
            <Pagination>
                <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                        }
                    }}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                        }}
                    >
                        {i + 1}
                    </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1)
                        }
                    }}
                    />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
            </div>
            )}
          </div>

      </div>
     </div>
    </div>

  
  </>
}

export default JobSearchComponent





const dateOptions: { [key: string]: string } = {
    "option-one": "Last 24 Hours",
    "option-two": "Last Week"
};

interface JobFiltersProps {
    activeFilters: string[];
    onCheckboxChange: (checked: boolean | string, label: string) => void;
    onRadioChange: (value: string, options: { [key: string]: string }) => void;
    onRemoveFilter: (label: string) => void;
}


function JobFilters({ activeFilters, onCheckboxChange, onRadioChange, onRemoveFilter }: JobFiltersProps) {
    return (
        <div className="border border-[#EDEDED] rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-joblin-black">All Filters</h3>
            </div>

            <div className="p-4 border-b">
                <p className="font-medium text-sm text-gray-700 mb-2">Active Filters</p>
                <div className="flex flex-wrap gap-1.5">
                    {activeFilters.length === 0 ? (
                        <span className="text-xs text-gray-400 italic">No filters active</span>
                    ) : (
                        activeFilters.map((filter) => (
                            <div key={filter} className="flex items-center gap-1 bg-[#F4F4F5] border border-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                                <span>{filter}</span>
                                <button type="button" onClick={() => onRemoveFilter(filter)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={13} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Accordion type="multiple" className="w-full">
                <AccordionItem value="work-mood">
                    <AccordionTrigger className="px-4 text-sm">Work Mood</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                            {["Remote", "Hybrid", "OnSite"].map((mood) => (
                                <div key={mood} className='flex items-center gap-1'>
                                    <Checkbox 
                                        className='size-3.25' 
                                        id={mood.toLowerCase()} 
                                        checked={activeFilters.includes(mood)}
                                        onCheckedChange={(checked) => onCheckboxChange(checked, mood)}
                                    />
                                    <Label htmlFor={mood.toLowerCase()} className='text-[13px] ms-1 cursor-pointer'>{mood}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="date">
                    <AccordionTrigger className="px-4 text-sm">Publication Date</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <RadioGroup 
                            value={Object.keys(dateOptions).find(key => activeFilters.includes(dateOptions[key])) || ""}
                            onValueChange={(val) => onRadioChange(val, dateOptions)}
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-one" id="option-one" />
                                <Label className='text-[13px] cursor-pointer' htmlFor="option-one">Last 24 Hours</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-two" id="option-two" />
                                <Label className='text-[13px] cursor-pointer' htmlFor="option-two">Last Week</Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="job-type">
                    <AccordionTrigger className="px-4 text-sm">Job Type</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                            {[
                                { id: "fullTime", label: "Full Time" },
                                { id: "partTime", label: "Part Time" },
                                { id: "internship", label: "Internship" }
                            ].map((type) => (
                                <div key={type.id} className='flex items-center gap-1'>
                                    <Checkbox 
                                        className='size-3.25' 
                                        id={type.id} 
                                        checked={activeFilters.includes(type.label)}
                                        onCheckedChange={(checked) => onCheckboxChange(checked, type.label)}
                                    />
                                    <Label htmlFor={type.id} className='text-[13px] ms-1 cursor-pointer'>{type.label}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="salary">
                    <AccordionTrigger className="px-4 text-sm">Salary</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-3">
                            {[
                                { id: 'first', label: '$0 - $500' },
                                { id: 'sec', label: '$500 - $1000' },
                                { id: 'third', label: '$1000 - $2000' },
                                { id: 'fourth', label: '$2000+' }
                            ].map((tier) => (
                                <div key={tier.id} className="flex items-center gap-2">
                                    <Checkbox 
                                        id={tier.id} 
                                        checked={activeFilters.includes(tier.label)}
                                        onCheckedChange={(checked) => onCheckboxChange(checked, tier.label)}
                                    />
                                    <Label htmlFor={tier.id} className="text-[13px] cursor-pointer">{tier.label}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="exp-level">
                    <AccordionTrigger className="px-4 text-sm">Experience Level</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                            {[
                                { id: 'entry', label: 'Entry level' },
                                { id: 'midsenior', label: 'Mid-Senior level' },
                                { id: 'executiv', label: 'Executive' }
                            ].map((level) => (
                                <div key={level.id} className='flex items-center gap-1'>
                                    <Checkbox 
                                        className='size-3.25' 
                                        id={level.id} 
                                        checked={activeFilters.includes(level.label)}
                                        onCheckedChange={(checked) => onCheckboxChange(checked, level.label)}
                                    />
                                      <Label htmlFor={level.id} className='text-[13px] ms-1 cursor-pointer'>{level.label}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}



