import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { options } from "@/lib/nextauth";
import { Calendar, ChevronRight, Mail, MapPin, Search, StarIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Home() {

    const session  = await getServerSession(options)

    const categories = [
  {
    id: 1,
    title: "Wordpress Developer",
    jobs: "72+ Job available",
    image: "/icons/wordpress.svg",
  },
  {
    id: 2,
    title: "Software Developer",
    jobs: "120+ Job available",
    image: "/icons/software.svg",
  },
  {
    id: 3,
    title: "Software Tester",
    jobs: "100+ Job available",
    image: "/icons/tester.svg",
  },
  {
    id: 4,
    title: "Graphic Designer",
    jobs: "80+ Job available",
    image: "/icons/pen-tool.svg",
  },
  {
    id: 5,
    title: "Team Leader",
    jobs: "52+ Job available",
    image: "/icons/users-group-alt.svg",
  },
  {
    id: 6,
    title: "UX Designer",
    jobs: "120+ Job available",
    image: "/icons/search-text.svg",
  },
  {
    id: 7,
    title: "Project Manager",
    jobs: "96+ Job available",
    image: "/icons/brush-alt.svg",
  },
  {
    id: 8,
    title: "UI Designer",
    jobs: "63+ Job available",
    image: "/icons/edit.svg",
  },
];
    
    if(session?.role === 'Company')  redirect('/company/home')
  return (
  <>
  <div>

  <div className=" w-full  bg-joblin-light-green min-h-screen pt-30 pb-12  ">
      <div className="lg:container md:w-[85%] w-[90%] mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* left part */}
          <div className="space-y-4 flex flex-col items-center md:items-center lg:items-start text-center lg:text-left">
              <div className="space-y-4 flex flex-col p-2 items-center text-center md:items-start md:justify-center md:text-left">
                <div className="lg:w-[60%] md:w-[70%] w-[50%]">
              <h1 className=" text-[56px] font-bold leading-[66px] ">Your Future Starts with <span className="text-joblin-primary">Joblin!</span></h1>
            </div>

            <p className="text-joblin-light-gray w-[85%] md:w-[75%]">Discover jobs that match your skills and passion.Type and explore!</p>                    

            <div className="flex flex-col md:flex-row w-[95%] items-stretch md:items-center lg:w-[90%] md:w-[85%] items-center bg-white rounded-md shadow-sm overflow-hidden ">
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
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              </div>
            
                <button type="button" className=" w-full md:w-auto bg-joblin-primary text-white px-6 py-3 text-sm font-medium flex items-center justify-center gap-2">
                <Search size={15}/> <span>Search</span>
              </button>     
            </div>
                {/* avaters */}
              <div className="flex flex-row justify-center  md:justify-start ">
                <div className="flex flex-row items-center  gap-2">
                  <AvatarGroup className="grayscale ">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/maxleiter.png"
                      alt="@maxleiter"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/evilrabbit.png"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>+3</AvatarGroupCount>
                </AvatarGroup>
                    <p className="text-[12px] md:text-[13px] text-joblin-black font-semibold ">
                      Over <span className="text-joblin-primary">999+</span> jobseeker
                      are successfully hired.
                    </p>
                </div>
              </div>
              </div>

          </div>
    

            {/* right part */}

            {/* <div className="relative w-full min-h-[400px] lg:min-h-[450] flex items-center justify-center mt-12 lg:mt-0 ">
              <div className="relative  rounded-full bg-white ">

              </div>
            </div> */}

            {/* right part */}
        <div className="relative w-full min-h-[500px] flex items-center justify-center">

          {/* Circle */}
          <div className="absolute w-[400px] h-[400px] bg-white rounded-full" />

          {/* Girl image */}
          <Image
            src="/images/hero.svg"
            alt="hero"
            width={420}
            height={420}
            className="relative z-10 object-contain"
          />

          {/* Left Card */}
          <div className="absolute left-0 top-1/3 bg-white rounded-xl shadow-md p-4 z-20">
            <div className="flex gap-2">
              <span className="flex justify-center items-center rounded-lg bg-joblin-primary px-2 text-white"><Calendar size={20}/></span>
              <div>
                <h4 className="text-[16px] font-semibold text-joblin-black">
                  1k
                </h4>
                <p className="text-[11px] text-joblin-light-gray">
                  Assisted Candidates
                </p>
              </div>
            </div>
          </div>

          {/* Top Right Card */}
          <div className="absolute right-0 top-1/4 bg-white rounded-xl shadow-md p-4 z-20">
              <div className="flex gap-2">

                <div className="w-14 h-14 rounded-full border-[5px] border-joblin-primary flex items-center justify-center">
                <div className="text-center">
                  <h4 className="text-[12px] font-semibold">15</h4>
                  <p className="text-[8px] text-gray-500">Total Jobs</p>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-joblin-light-gray">
                    Under Review
                  </span>
                  <span className="font-medium">6</span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="text-joblin-light-gray">
                    Accepted
                  </span>
                  <span className="font-medium">8</span>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <span className="text-joblin-light-gray">
                    Rejected
                  </span>
                  <span className="font-medium">1</span>
                </div>
              </div>

              </div>
          </div>

          {/* Bottom Card */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md p-4 z-20">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#FFE9A8] flex items-center justify-center">
                <Mail size={20}/>
              </div>

              <div>
                <h4 className="text-[14px] font-medium text-joblin-black">
                  Congratulations
                </h4>

                <p className="text-[11px] text-joblin-light-gray">
                  You have been hired
                </p>
              </div>
          </div>
          </div>

        </div>
        {/* ///////////////////////////////////// */}

          
          </div>
      </div>
  </div>


          {/* section 2 */}
            <div className=" pt-10 pb-10">
            <div className="w-[80%] mx-auto">
            <div className=" text-center">
            <h1 className=" text-[36px] md:text-[28px] font-semibold text-joblin-black " >Popular Category</h1>
            <p className=" text-[12px] lg:text-[16px] md:text-[14px] text-joblin-dark-gray ">The last job offers Upload</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
              {categories.map((cat) => (
                  <div key={cat.id} className=" flex gap-3 items-center p-3 rounded-md border border-[#EDEDED] ">
              <div className=" w-12 h-12 rounded-md bg-[#F4F4F4] flex items-center justify-center ">
                    <Image src={cat.image} alt={cat.title} width={20} height={20}/>
                  </div>
                  <div className=" flex flex-col gap-1">
                    <h3 className="text-[14px] text-joblin-black font-semibold">{cat.title}</h3>
                    <p className=" text[12px] text-joblin-light-gray">{cat.jobs}</p>
                  </div>
              </div> 
              ))} 
            </div>

              </div>
            </div>


            {/* section 3 */}
             
            <div className=" pt-10 pb-10">
                <div className="w-[80%] mx-auto">


                <div className="flex items-center justify-between gap-2 ">
                  <div>
                    <h1 className=" text-[24px] md:text-[28px] lg:text-[36px] font-semibold text-joblin-black " >Newest Jobs For You</h1>
                    <p className=" text-[12px] lg:text-[16px] md:text-[14px] text-joblin-dark-gray ">Get the fastest application so that your name is above other</p>
                  </div>

                  <div className=" text-joblin-primary flex  md:items-center text-[14px] gap-2 cursor-pointer font-medium"> 
                       <Link href="/find-job" className=" text-joblin-primary flex items-center text-[14px] gap-2 cursor-pointer font-medium">
                       <span>More </span> <ChevronRight size={15}/>
                       </Link> 
                    </div>
                </div>

                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 ">
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/mac.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">McDonaldS</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">Web Designer</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>London</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">255$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">1 hour ago</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/google.jpg" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">Google</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">Backend Developer</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Part Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Remote</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>London</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">1150$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">3 days ago</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/micro.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">Microsoft</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">Quality Asuranc</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>London</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">255$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">1 hour ago</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                  </div>

                </div>
            </div>


              {/* section 4 */}
                  <div className=" pt-10 pb-10">
                    <div className="w-[80%] mx-auto">
                      <div className=" text-center">
                      <h1 className=" text-[36px] md:text-[28px] font-semibold text-joblin-black " >Steps to Your Dream Job</h1>
                      <p className=" text-[12px] lg:text-[16px] md:text-[14px] text-joblin-dark-gray ">The last job offers Upload</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                          <div className=" relative p-3 rounded-md border border-[#EDEDED]">
                            <div className="absolute -top-6 left-6 w-10 h-10 bg-joblin-light-green flex items-center justify-center rounded-md text-joblin-primary text-[20px]">
                              1
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              <h3 className="text-[14px] text-joblin-black font-semibold">Create an Account</h3>
                              <p className="text-[14px] text-joblin-light-gray">Start your journey today. Nulla facilisi. Aenean et tortor at elit luctus.</p>
                            </div>
                          </div>
                          <div className=" relative p-3 rounded-md border border-[#EDEDED]">
                            <div className="absolute -top-6 left-6 w-10 h-10 bg-joblin-light-green flex items-center justify-center rounded-md text-joblin-primary text-[20px]">
                              2
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              <h3 className="text-[14px] text-joblin-black font-semibold">Upload CV / Resume</h3>
                              <p className="text-[14px] text-joblin-light-gray">Easily upload your resume. Donec euismod velit at tempor, ut cursus.</p>
                            </div>
                          </div>
                          <div className=" relative p-3 rounded-md border border-[#EDEDED]">
                            <div className="absolute -top-6 left-6 w-10 h-10 bg-joblin-light-green flex items-center justify-center rounded-md text-joblin-primary text-[20px]">
                              3
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              <h3 className="text-[14px] text-joblin-black font-semibold">Find suitable job</h3>
                              <p className="text-[14px] text-joblin-light-gray">Discover jobs for you. In hac habitasse platea dictumst. Morbi imperdiet.</p>
                            </div>
                          </div>
                          <div className=" relative p-3 rounded-md border border-[#EDEDED]">
                            <div className="absolute -top-6 left-6 w-10 h-10 bg-joblin-light-green flex items-center justify-center rounded-md text-joblin-primary text-[20px]">
                              4
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              <h3 className="text-[14px] text-joblin-black font-semibold">Apply job</h3>
                              <p className="text-[14px] text-joblin-light-gray">Apply in just a click. Sed luctus, lorem id pharetra dapibus, velit nisi</p>
                            </div>
                          </div>


                      </div>
                    </div>
                  </div>
               

                {/*section 5 */}
                <div className=" pt-10 pb-10">
                <div className="w-[80%] mx-auto">

                <div className="flex items-center justify-between gap-2 ">
                  <div>
                    <h1 className=" text-[24px] md:text-[28px] lg:text-[36px] font-semibold text-joblin-black " >Top Companies</h1>
                    <p className=" text-[12px] lg:text-[16px] md:text-[14px] text-joblin-dark-gray ">The last job offers Upload</p>
                  </div>

                  <div className=" text-joblin-primary flex  md:items-center text-[14px] gap-2 cursor-pointer font-medium"> 
                       <Link href="/find-job" className=" text-joblin-primary flex items-center text-[14px] gap-2 cursor-pointer font-medium">
                       <span>More </span> <ChevronRight size={15}/>
                       </Link> 
                    </div>
                </div>

                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 ">
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/icons/comany.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-2">
                                    <h3 className="text-joblin-black text-[14px] lg:text-[18px]">Bergen</h3>
                                    <h4 className="text-[12px] text-[#A5A5A5]">Bergen</h4>
                                    </div>
                                    <div className="flex items-center gap-1 text-[12px]">
                                      <StarIcon size={15} className="text-yellow-300 " /> <span> 3.5</span>
                                    </div>
                                  </div>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <p className="text-[12px] text-joblin-black">
                                      Sandro is a French fashion brand known for its chic, contemporary collections, offering men.
                                    </p>
                                    <div className="flex items-center flex-wrap lg:flex-nowrap justify-between text-[12px] text-joblin-dark-gray">
                                      <span>50 Jobs</span>
                                      <span>103.98K Reviews</span>
                                      <span>30.1K Salaries</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/icons/comany.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-2">
                                    <h3 className="text-joblin-black text-[14px] lg:text-[18px]">Lenovo</h3>
                                    <h4 className="text-[12px] text-[#A5A5A5]">Bergen</h4>
                                    </div>
                                    <div className="flex items-center gap-1 text-[12px]">
                                      <StarIcon size={15} className="text-yellow-300 " /> <span> 4.5</span>
                                    </div>
                                  </div>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <p className="text-[12px] text-joblin-black">
                                      Sandro is a French fashion brand known for its chic, contemporary collections, offering men.
                                    </p>
                                    <div className="flex items-center flex-wrap lg:flex-nowrap justify-between text-[12px] text-joblin-dark-gray">
                                      <span>50 Jobs</span>
                                      <span>103.98K Reviews</span>
                                      <span>30.1K Salaries</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/icons/comany.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-2">
                                    <h3 className="text-joblin-black text-[14px] lg:text-[18px]">Meta</h3>
                                    <h4 className="text-[12px] text-[#A5A5A5]">Bergen</h4>
                                    </div>
                                    <div className="flex items-center gap-1 text-[12px]">
                                      <StarIcon size={15} className="text-yellow-300 " /> <span> 5</span>
                                    </div>
                                  </div>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <p className="text-[12px] text-joblin-black">
                                      Sandro is a French fashion brand known for its chic, contemporary collections, offering men.
                                    </p>
                                    <div className="flex items-center flex-wrap lg:flex-nowrap justify-between text-[12px] text-joblin-dark-gray">
                                      <span>50 Jobs</span>
                                      <span>103.98K Reviews</span>
                                      <span>30.1K Salaries</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                  </div>

                </div>
            </div>



            {/* section 6 */}
                <div className=" pt-10 pb-10">
                <div className="w-[80%] mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:w-[60%] text-center lg:text-start">
                    <h2 className="text-[24px] lg:text-[32px] md:text-[28px] text-joblin-black font-semibold mb-2">Our Achievements in Hiring</h2>
                    <p className="text-[10px] md:text-[12px] text-joblin-light-gray">Whether you&apos;re an employer looking for top talent or a job seeker searching for the perfect role, our platform has helped hundreds of professionals find success. Be the next one to achieve your career goals!</p>
                  </div>
                  <div className=" ">
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-md border border-[#EDEDED]">
                              <div className="flex items-start gap-3">
                                <div className="w-11 h-11 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-joblin-light-green">
                                    <Image src="/icons/user-check.svg" alt="company logo" width={20} height={20}/>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                      <h4 className="text-joblin-black text-[16px]">300+</h4>
                                      <p className="text-joblin-light-gray text-[14px]">Profile Post</p>
                                </div>
                               </div> 
                          </div>
                          <div className="p-3 rounded-md border border-[#EDEDED]">
                              <div className="flex items-start gap-3">
                                <div className="w-11 h-11 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-joblin-light-green">
                                    <Image src="/icons/user-check.svg" alt="company logo" width={20} height={20}/>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                      <h4 className="text-joblin-black text-[16px]">400+</h4>
                                      <p className="text-joblin-light-gray text-[14px]">Interviews</p>
                                </div>
                               </div> 
                          </div>
                          <div className="p-3 rounded-md border border-[#EDEDED]">
                              <div className="flex items-start gap-3">
                                <div className="w-11 h-11 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-joblin-light-green">
                                    <Image src="/icons/user-check.svg" alt="company logo" width={20} height={20}/>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                      <h4 className="text-joblin-black text-[16px]">990+</h4>
                                      <p className="text-joblin-light-gray text-[14px]"> Post Application</p>
                                </div>
                               </div> 
                          </div>
                          <div className="p-3 rounded-md border border-[#EDEDED]">
                              <div className="flex items-start gap-3">
                                <div className="w-11 h-11 shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-joblin-light-green">
                                    <Image src="/icons/user-check.svg" alt="company logo" width={20} height={20}/>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                      <h4 className="text-joblin-black text-[16px]">300+</h4>
                                      <p className="text-joblin-light-gray text-[14px]">Profile Post</p>
                                </div>
                               </div> 
                          </div>
                    </div>
                  </div>
                </div>



                </div>
                </div>



  </div>

  </>
  );
}



{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  {jobs.map((job, index) => {
    const isLast = index === jobs.length - 1;
    const isOdd = jobs.length % 2 !== 0;

    return (
      <div
        key={job.id}
        className={`
          p-6 border rounded-md
          ${isLast && isOdd ? "md:col-span-2 lg:col-span-1" : ""}
        `}
      >
        Card Content
      </div>
    );
  })}
</div> */}
