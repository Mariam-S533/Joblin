"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {  Funnel, MapPin, Search, X , ChevronRight} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {  useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,} from "@/components/ui/pagination"
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { CourseOffering } from '@/app/Types/courses';


function AllCoursesComp({courses}: {courses: CourseOffering[]}) {

    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const jobsPerPage = 12

    const totalPages = Math.ceil(courses.length / jobsPerPage)
    const startIndex = (currentPage - 1) * jobsPerPage
    const endIndex = startIndex + jobsPerPage

    const currentJobs = courses.slice(startIndex, endIndex)
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    
    const handleCheckboxChange = (checked: boolean | string, label: string) => {
        setActiveFilters((prev) => {
            if (checked === true) {
                return prev.includes(label) ? prev : [...prev, label];
            }
            return prev.filter((item) => item !== label);
        });
        setCurrentPage(1)
    };

    const handleRadioChange = (value: string, availableOptions: { [key: string]: string }) => {
        const targetLabel = availableOptions[value];
        const filtered = activeFilters.filter(item => !Object.values(availableOptions).includes(item));
        if (targetLabel) {
            setActiveFilters([...filtered, targetLabel]);
        } else {
            setActiveFilters(filtered);
        }
        setCurrentPage(1)
    };

    const removeFilter = (label: string) => {
        setActiveFilters((prev) => prev.filter((item) => item !== label));
        setCurrentPage(1)
    };


  return <>
    <div className=" w-full min-h-screen bg-white">
     <div className="lg:container md:w-[85%] w-[90%] mx-auto">
      <div className="">
          {/* header   */}
          <div className="flex flex-col mx-auto items-center justify-center gap-3 mb-8">
            <h1 className=' font-semibold text-joblin-black lg:text-[32px] text-[28px] '>Discover Companies</h1>
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
                    <JobFilters activeFilters={activeFilters} onCheckboxChange={handleCheckboxChange} onRadioChange={handleRadioChange} onRemoveFilter={removeFilter}/>
                </div>
            )}

            
            <div className="flex items-start gap-8">
                <div className="hidden lg:block flex-shrink-0 w-64">
                    <JobFilters activeFilters={activeFilters} onCheckboxChange={handleCheckboxChange} onRadioChange={handleRadioChange} onRemoveFilter={removeFilter}/>
                </div>
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 "></div>
            {currentJobs.map((course) => (
                <Link href={`/courses/${course.id}`} key={course.id}>
                <div className=" flex-1">
                       <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src={course.companyLogoUrl ||"/icons/comany.png"} alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2.5 w-full leading-none">
                                    <h3 className="text-[12px] lg:text-[14px] text-joblin-light-gray  ">{course.companyName}</h3>
                                    <h1 className='text-joblin-black text-[18px] lg:text-[20px]'>{course.title}</h1>
                                    <p className="text-joblin-light-gray text-[12px] lg:text-[14px]">{course.description}</p>
                                    <div className="flex items-center gap-2 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{course.deliveryMode}</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{course.difficultyLevel}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-light-gray text-[12px] lg:text-[14px]">{course.duration} Weeks</p>
                                        <div className=" text-joblin-primary flex  md:items-center text-[14px] gap-2 cursor-pointer font-medium"> 
                                        <Link href={`/courses/${course.id}`} className=" text-joblin-dark-gray hover:text-joblin-primary cursor-pointer ">
                                          <ChevronRight size={18}/>
                                        </Link> 
                                        </div>
                                    </div>
                                </div>
                          </div>
                      </div>
                  </div>
                </Link>

            ))}
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

  
  </>
}

export default AllCoursesComp






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
                                <button title='remove' type="button" onClick={() => onRemoveFilter(filter)} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                    <AccordionTrigger className="px-4 text-sm">Company Size</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <RadioGroup 
                            value={Object.keys(dateOptions).find(key => activeFilters.includes(dateOptions[key])) || ""}
                            onValueChange={(val) => onRadioChange(val, dateOptions)}
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-one" id="option-one" />
                                <Label className='text-[13px] cursor-pointer' htmlFor="option-one">1 - 50</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-two" id="option-two" />
                                <Label className='text-[13px] cursor-pointer' htmlFor="option-two">51 - 200</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-two" id="option-three" />
                                <Label className='text-[13px] cursor-pointer' htmlFor="option-three">51 - 200</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="option-two" id="option-two" />
                                <Label className='text-[13px] cursor-pointer' htmlFor="option-two">201- 500</Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}

