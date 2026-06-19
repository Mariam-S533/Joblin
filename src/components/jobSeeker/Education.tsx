import { useFormContext } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { University } from 'lucide-react'

function EducationEdit() {
  const { register } = useFormContext()

  return <>
            <div className=' flex flex-col gap-6'>

                    <div className='flex gap-3 items-center w-full '>
                      <div className=' relative w-full'>
                        <Input
                        placeholder="computer science"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("education.field")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Field of Study
                        </Label>
                    </div>

                        <div className=' relative w-full'>
                        <Input
                        placeholder="Harvad"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("education.institution")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                             University Name 
                        </Label>
                    </div>
                    </div>

                    <div className='flex gap-3 items-center w-full '>
                      <div className=' relative w-full'>
                        <Input
                        placeholder="e.x 2023"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("education.graduation_year")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Graduation Year
                        </Label>
                    </div>

                        <div className=' relative w-full'>
                        <Input
                        placeholder="3.5"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("education.gpa")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            GPA
                        </Label>
                    </div>
                    </div>

                <div className="flex flex-col gap-3">
                  <div className=" text-xl text-[18px] flex items-center gap-1 text-joblin-dark-gray">
                    <University size={15}/>
                    <span>Degree Level</span>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <input
                      id='associate'
                        type="radio"
                        value="associate"
                        {...register("education.degree")}
                        className=" w-4 h-4 accent-joblin-dark-gray"
                      />
                      <label htmlFor='associate' className='text-[#353535] text-[15px]'>Associate</label>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer">
                      <input
                      id='bachelor'
                        type="radio"
                        value="bachelor"
                        {...register("education.degree")}
                        className=" w-4 h-4 accent-joblin-dark-gray "
                      />
                      <label htmlFor='bachelor' className='text-[#353535] text-[15px]'>Bachelor&apos;s</label>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer">
                      <input
                      id='master'
                        type="radio"
                        value="master"
                        {...register("education.degree")}
                        className=" w-4 h-4 accent-joblin-dark-gray "
                      />
                      <label htmlFor='master' className='text-[#353535] text-[15px]'>Master&apos;s</label>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer">
                      <input
                        id='phd'
                        type="radio"
                        value="phd"
                        {...register("education.degree")}
                        className=" w-4 h-4 accent-joblin-dark-gray "
                      />
                      <label htmlFor='phd' className='text-[#353535] text-[15px]'>PHD and Higher</label>
                    </div>

                  </div>
                </div>


            </div>

  </>
}

export default EducationEdit
