"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {  Funnel, MapPin, Search, X } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {  useMemo, useState } from 'react'
import { JobPost } from '@/app/Types/seekerActivity'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,} from "@/components/ui/pagination"
import JobPostCard from './JobPostCard';
import { toast } from 'sonner';
import { getJobPosts } from '@/app/actions/searchjobs.action';
import { getSearchResult } from '@/app/actions/search.action';


interface JobPostsResponse {
    data: JobPost[],
    totalPages: number,
    page: number
}

function JobSearchComponent({initialData}: {initialData: JobPostsResponse}) {

    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // State for input and managing unpaginated search view
    const [searchQuery, setSearchQuery] = useState<string>(""); 
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const [jobs, setJobs] = useState<JobPost[]>(initialData?.data || []);
    const [currentPage, setCurrentPage] = useState<number>(initialData?.page || 1)
    const [totalPages, setTotalPages] = useState<number>(initialData?.totalPages || 1);
    const [loading, setLoading] = useState<boolean>(false)

    const jobsPerPage = 10 
    const hasPreviousPage = currentPage > 1
    const hasNextPage = currentPage < totalPages



        // Client-side execution layer to actually slice data based on selected items
    const filteredJobs = useMemo(() => {
        if (activeFilters.length === 0) return jobs;
        return jobs.filter((job) => {
            // Check matching properties (assuming typical keys based on your UI filters)
            const matchesWorkMood = activeFilters.some(f => 
                job.workMode?.toLowerCase() === f.toLowerCase() || 
                job.workMode?.toLowerCase() === f.toLowerCase()
            );
            const matchesJobType = activeFilters.some(f => 
                job.jobType?.toLowerCase() === f.toLowerCase().replace(" ", "")
            );
            const matchesExperience = activeFilters.some(f => 
                job.experienceLevel?.toLowerCase() === f.toLowerCase()
            );
            
            // Fallback match configuration if fields differ slightly
            if (activeFilters.includes("Remote") || activeFilters.includes("Hybrid") || activeFilters.includes("OnSite")) {
                if (!matchesWorkMood) return false;
            }
            if (activeFilters.includes("Full Time") || activeFilters.includes("Part Time") || activeFilters.includes("Internship")) {
                if (!matchesJobType) return false;
            }
            if (activeFilters.includes("Entry level") || activeFilters.includes("Mid-Senior level") || activeFilters.includes("Executive")) {
                if (!matchesExperience) return false;
            }
            
            return true;
        });
    }, [jobs, activeFilters]);


    // Updated Search trigger logic
    async function handleSearch() {
        if (loading) return;
        
        // If the user clears the search bar, instantly restore the initial paginated server data
        if (!searchQuery.trim()) {
            setIsSearching(false);
            setJobs(initialData?.data || []);
            setTotalPages(initialData?.totalPages || 1);
            setCurrentPage(initialData?.page || 1);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getSearchResult(searchQuery, jobsPerPage);
            
            // Handle incoming data as a clean array response
            setJobs(result || []);
            setIsSearching(true); 
            setCurrentPage(1);
            setTotalPages(1); // Set to 1 so the unpaginated pagination layout hides cleanly
        } catch (error) {
            const message = error instanceof Error ? error.message : "Search failed. Please try again.";
            setError(message);
            toast.error(message, {position: "top-center", duration: 3000});
        } finally {
            setLoading(false);
        }
    }




    async function changePage(page: number) {
    // if (page < 1 || page > totalPages) return;
    if (loading) return;
    if (page < 1 || page > totalPages) return; 

        setLoading(true);
        setError(null);

        try {
            // Enforce that the server action response matches our interface
            const result: JobPostsResponse = await getJobPosts(page, jobsPerPage);
            setJobs(result?.data || []);
            setCurrentPage(result?.page || page);
            setTotalPages(result?.totalPages || 1);
        } catch (error) {
                        const message = error instanceof Error ? error.message : "Failed to load jobs. Please try again";
                        setError(message);
                        toast.error(message, {position: "top-center", duration: 3000})
        } finally {
            setLoading(false);
        }
    }


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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
            
                <button type="button"
                        onClick={handleSearch}
                        disabled={loading}
                        className=" w-full md:w-auto bg-joblin-primary text-white px-6 py-3 text-sm font-medium flex items-center justify-center gap-2">
                <Search size={15}/> <span>{loading ? "Searching..." : "Search"}</span>
              </button>     
            </div>
          </div>

          {/* main content */}
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
                    <JobFilters activeFilters={activeFilters} onCheckboxChange={handleCheckboxChange} onRadioChange={handleRadioChange} onRemoveFilter={removeFilter} />
                </div>
            )}

            
            <div className="flex items-start gap-8">
              <div className="hidden lg:block flex-shrink-0 w-64">
                    <JobFilters activeFilters={activeFilters} onCheckboxChange={handleCheckboxChange} onRadioChange={handleRadioChange} onRemoveFilter={removeFilter}/>
              </div>

{/* 
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentJobs.map((job)=> <JobPostCard key={job.id} jobPost={job}/>)}
              </div> */}

              <div className="flex-1">
                                {loading ? (
                                    <div className="text-center py-12 text-gray-500">Loading jobs...</div>
                                ) : error ? (
                                    <div className="text-center py-12 text-red-500">{error}</div>
                                ) : filteredJobs.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">No jobs found.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredJobs.map((job) => (
                                            <JobPostCard key={job.id} jobPost={job}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
            

            </div>

            { !loading && !error && !isSearching && jobs.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
            <Pagination>
                <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious
                    href="#"
                    className={loading || !hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => {
                        e.preventDefault()
                        changePage(currentPage - 1)
                    }}
                    />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink href="#" isActive={true}>
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                        <PaginationNext
                        href="#"
                        className={loading || !hasNextPage ? "pointer-events-none opacity-50" : ""}
                        onClick={(e) => {
                        e.preventDefault();
                        changePage(currentPage + 1);
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

    const currentRadioValue = Object.keys(dateOptions).find(key => activeFilters.includes(dateOptions[key])) || "";

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
                    <AccordionTrigger className="px-4 text-sm">Publication Date</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <RadioGroup 
                            value={currentRadioValue}
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



