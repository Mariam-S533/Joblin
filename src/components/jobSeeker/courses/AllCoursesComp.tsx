"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Funnel, MapPin, Search, X, ChevronRight } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useMemo, useState } from 'react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,} from "@/components/ui/pagination"
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner';
import { CourseOffering } from '@/app/Types/courses';
import { getAllCourses } from '@/app/actions/courses.action';
import { getSearchResult } from '@/app/actions/search.action';

interface CoursePostsResponse {
    data: CourseOffering[],
    totalPages: number,
    page: number
}

export interface SearchJobResult {
  jobPostId: string;
  jobTitle: string;
  description: string | null;
  score: string;
  skills: string[];
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  country: string;
  city: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
}

export interface SearchCoursesResponse {
    query: string;
    total: string;
    results: SearchJobResult[]; // The search results array
}

function AllCoursesComp({ initialCourses }: { initialCourses: CoursePostsResponse }) {
    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(""); 
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // FIXED: Directly initialize as an array because initialCourses is CourseOffering[]
    const [courses, setCourses] = useState<CourseOffering[]>(initialCourses?.data || []);
    const [currentPage, setCurrentPage] = useState<number>( initialCourses?.page || 1)
    const [totalPages, setTotalPages] = useState<number>(initialCourses?.totalPages || 1);
    const [loading, setLoading] = useState<boolean>(false)

    const coursesPerPage = 10 
    const hasPreviousPage = currentPage > 1
    const hasNextPage = currentPage < totalPages

    // Local refinement filtering for checkbox tags
    const filteredCourses = useMemo(() => {
        if (activeFilters.length === 0) return courses;

        const selectedDeliveryModes = activeFilters.filter(f => ["Online", "In-Person", "Blended"].includes(f));
        const selectedDifficultyLevels = activeFilters.filter(f => ["Beginner", "Intermediate", "Advanced"].includes(f));

        return courses.filter((course) => {
            if (selectedDeliveryModes.length > 0) {
                const matchesDelivery = selectedDeliveryModes.some(f => 
                    course.deliveryMode?.toLowerCase().replace(/[^a-z]/g, '') === f.toLowerCase().replace(/[^a-z]/g, '')
                );
                if (!matchesDelivery) return false;
            }

            if (selectedDifficultyLevels.length > 0) {
                const matchesDifficulty = selectedDifficultyLevels.some(f => 
                    course.difficultyLevel?.toLowerCase().replace(/[^a-z]/g, '') === f.toLowerCase().replace(/[^a-z]/g, '')
                );
                if (!matchesDifficulty) return false;
            }

            return true;
        });
    }, [courses, activeFilters]);

    async function handleSearch() {
        if (loading) return;
        
        if (!searchQuery.trim()) {
            setIsSearching(false);
                setCourses(initialCourses?.data || []);
                setTotalPages( initialCourses?.totalPages || 1);
                setCurrentPage( initialCourses?.page || 1);
                setError(null);
          
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fires your text search action matching the JobSearch structure
            const response: SearchCoursesResponse = await getSearchResult(searchQuery, coursesPerPage);
            
            // Map the search response .results format into our local state array format
            const transformedResults: CourseOffering[] = (response?.results || []).map((res) => ({

                  id: res.jobPostId,
                  companyId: res.companyId ,
                  companyName: res.companyName,
                  companyLogoUrl: res.companyLogoUrl,
                  title: res.jobTitle,
                  description:res.description,
                  country: res.country,
                  city: res.city,
                  deliveryMode: res.workMode,
                  
                  providedSkills: (res.skills || []).map((skill, index) => ({
                    id: String(index),
                    name: skill
                })),

                  duration: "",
                  startDate:  null,
                  endDate: null,
                  street: null,
                  price: "",
                  createdAt: "",
                  deadline: null,
                  currency:  null,
                  enrollmentUrl: "",
                  hasCertificate: true,
                  outcomeDescription:  null,
                  technicalDomain: "",
                  difficultyLevel: "",
                  offeringStatus: "",
            }));

            setCourses(transformedResults);
            setIsSearching(true); 
            setCurrentPage(1);
            setTotalPages(1); 
        } catch (error) {
            const message = error instanceof Error ? error.message : "Search failed. Please try again.";
            setError(message);
            toast.error(message, { position: "top-center", duration: 3000 });
        } finally {
            setLoading(false);
        }
    }

    // Async Pagination Action using your custom action!
    async function changePage(page: number) {
        if (loading) return;
        if (page < 1 || page > totalPages) return; 

        setLoading(true);
        setError(null);

        try {
            const result: CoursePostsResponse = await getAllCourses(page, coursesPerPage);
            // Since getAllCourses returns the array directly, pass it straight to setCourses
            setCourses(Array.isArray(result) ? result : []);
            setCurrentPage(page);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to load courses. Please try again";
            setError(message);
            toast.error(message, { position: "top-center", duration: 3000 })
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

    const removeFilter = (label: string) => {
        setActiveFilters((prev) => prev.filter((item) => item !== label));
    };

    return (
        <div className="w-full min-h-screen bg-white py-6">
            <div className="lg:container md:w-[85%] w-[90%] mx-auto">
                
                {/* Search Bar Block */}
                <div className="flex flex-col mx-auto items-center justify-center gap-3 mb-8">
                    <h1 className='font-semibold text-joblin-black lg:text-[32px] text-[28px]'>Discover Courses</h1>
                    <div className="flex flex-col md:flex-row w-full md:items-center lg:w-[50%] md:w-[85%] rounded-md shadow-sm overflow-hidden border border-gray-200">
                        <div className="flex items-center px-3 py-2 gap-0.5 w-full">
                            <Search size={15} className="text-muted-foreground shrink-0"/>
                            <input
                                type="text"
                                placeholder="Course title or keywords"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="border-0 p-1 outline-0 text-sm w-full"
                            />
                        </div>

                        <div className="block md:hidden h-px bg-gray-200 mx-3" />
                        <div className="hidden md:block h-6">
                            <Separator orientation="vertical" className="bg-gray-300" />
                        </div>

                        <div className="flex flex-1 gap-1 items-center px-3 py-2 md:py-0">
                            <MapPin size={15} className="size-4 shrink-0 text-muted-foreground"/>
                            <Select>
                                <SelectTrigger className="w-full min-w-0 border-0 bg-transparent px-0 pr-1 shadow-none focus:ring-0 focus-visible:ring-0" size="sm">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="egypt">Egypt</SelectItem>
                                    <SelectItem value="us">United States</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    
                        <button type="button" onClick={handleSearch} disabled={loading} className="w-full md:w-auto bg-joblin-primary text-white px-6 py-3 text-sm font-medium flex items-center justify-center gap-2">
                            <Search size={15}/> <span>{loading ? "Searching..." : "Search"}</span>
                        </button>     
                    </div>
                </div>

                {/* Filter and Courses Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Mobile Filters Drawer Toggle */}
                    <div className="lg:hidden mb-4 w-full">
                        <button type='button'
                                onClick={() => setShowFilters(!showFilters)}
                                className='flex items-center gap-2 border cursor-pointer border-gray-200 py-1.5 px-3 rounded text-[#282828] bg-gray-50'>
                            <Funnel size={18}/> <span className='text-[15px]'>Filter</span>
                        </button>
                        {showFilters && (
                            <div className="mt-3">
                                <CourseFilters activeFilters={activeFilters} onCheckboxChange={handleCheckboxChange} onRemoveFilter={removeFilter}/>
                            </div>
                        )}
                    </div>

                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block flex-shrink-0 w-64">
                        <CourseFilters activeFilters={activeFilters} onCheckboxChange={handleCheckboxChange} onRemoveFilter={removeFilter}/>
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 w-full">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading courses...</div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-500">{error}</div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">No courses found matching criteria.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                {filteredCourses.map((course) => (
                                    <Link href={`/courses/${course.id}`} key={course.id} className="block h-full">
                                        <div className="p-6 rounded-md border border-[#EDEDED] h-full flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center border shrink-0 bg-gray-50">
                                                    <Image src={course.companyLogoUrl || "/icons/comany.png"} alt="company logo" width={40} height={40} className="object-contain" />
                                                </div>
                                                <div className="flex flex-col gap-2 w-full">
                                                    <h3 className="text-[12px] lg:text-[14px] text-gray-400 font-medium">{course.companyName}</h3>
                                                    <h1 className='text-joblin-black font-semibold text-[18px] lg:text-[20px] leading-tight'>{course.title}</h1>
                                                    <p className="text-gray-500 text-[12px] lg:text-[14px] line-clamp-2">{course.description}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {course.deliveryMode && <Badge variant="outline" className="text-joblin-primary border-0 bg-[#E6F8F1]">{course.deliveryMode}</Badge>}
                                                        {course.difficultyLevel && <Badge variant="outline" className="text-joblin-primary border-0 bg-[#E6F8F1]">{course.difficultyLevel}</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between font-medium mt-4 pt-4 border-t border-gray-50">
                                                <p className="text-gray-400 text-[12px] lg:text-[14px]">{course.duration ? `${course.duration} Weeks` : "Self-paced"}</p>
                                                <div className="text-joblin-dark-gray hover:text-joblin-primary transition-colors"> 
                                                    <ChevronRight size={18}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Server Action Pagination Controls */}
                {!loading && !error && !isSearching && courses.length > 0 && totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" className={loading || !hasPreviousPage ? "pointer-events-none opacity-50" : ""} onClick={(e) => { e.preventDefault(); changePage(currentPage - 1); }} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive={true}>{currentPage}</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" className={loading || !hasNextPage ? "pointer-events-none opacity-50" : ""} onClick={(e) => { e.preventDefault(); changePage(currentPage + 1); }} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllCoursesComp;

/* ==========================================================================
   Inner Component: Filter Layout Group Container
   ========================================================================== */
interface CourseFiltersProps {
    activeFilters: string[];
    onCheckboxChange: (checked: boolean | string, label: string) => void;
    onRemoveFilter: (label: string) => void;
}

function CourseFilters({ activeFilters, onCheckboxChange, onRemoveFilter }: CourseFiltersProps) {
    return (
        <div className="border border-[#EDEDED] rounded-lg bg-white shadow-sm w-full">
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

            <Accordion type="multiple" defaultValue={["delivery-mode", "difficulty-level"]} className="w-full">
                <AccordionItem value="delivery-mode">
                    <AccordionTrigger className="px-4 text-sm">Delivery Mode</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                            {["Online", "In-Person", "Blended"].map((mode) => (
                                <div key={mode} className='flex items-center gap-1'>
                                    <Checkbox 
                                        className='size-3.25' 
                                        id={mode.toLowerCase()} 
                                        checked={activeFilters.includes(mode)}
                                        onCheckedChange={(checked) => onCheckboxChange(checked, mode)}
                                    />
                                    <Label htmlFor={mode.toLowerCase()} className='text-[13px] ms-1 cursor-pointer font-normal text-gray-600'>{mode}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="difficulty-level">
                    <AccordionTrigger className="px-4 text-sm">Difficulty Level</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                <div key={level} className='flex items-center gap-1'>
                                    <Checkbox 
                                        className='size-3.25' 
                                        id={level.toLowerCase()} 
                                        checked={activeFilters.includes(level)}
                                        onCheckedChange={(checked) => onCheckboxChange(checked, level)}
                                    />
                                    <Label htmlFor={level.toLowerCase()} className='text-[13px] ms-1 cursor-pointer font-normal text-gray-600'>{level}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}