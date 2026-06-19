import { useFormContext } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Calendar } from 'lucide-react'

function WorkExperienceEdit() {
  const { register } = useFormContext()

  return <>
            <div className=' flex flex-col gap-6'>
                    <div className=' relative'>
                        <Input
                        placeholder="FrontEnd"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("work_experience.title")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Job Title 
                        </Label>
                    </div>

                    <div className=' relative'>
                        <Input
                        placeholder="Microsoft"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("work_experience.company")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Company Name
                        </Label>
                    </div>

                    <div className='flex gap-3 items-center w-full'>
                    <div className=' relative w-full'>
                        <Input
                        placeholder="MM/DD/YYYY"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5] 
                                [&::-webkit-calendar-picker-indicator]:opacity-0
                                [&::-webkit-calendar-picker-indicator]:absolute
                                [&::-webkit-calendar-picker-indicator]:w-full
                                '
                                type="date"
                                {...register("work_experience.start_date")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        

                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Start Employment Period
                        </Label>
                    </div>


                    <div className=' relative w-full'>
                        <Input
                        placeholder="MM/DD/YYYY"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]
                                [&::-webkit-calendar-picker-indicator]:opacity-0
                                [&::-webkit-calendar-picker-indicator]:absolute
                                [&::-webkit-calendar-picker-indicator]:w-full
                                '
                                type="date"
                                {...register("work_experience.end_date")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            End Employment Period
                        </Label>
                    </div>
                    </div>

                    <div className=' mb-2'>
                        <label className="flex items-center gap-2 cursor-pointer text-[#353535]" >
                        <input type="checkbox" className="w-4 h-4 accent-joblin-dark-gray " {...register("work_experience.current")} />
                        Still working here
                        </label>
                    </div>


                    <div className=' relative '>
                        <Textarea placeholder='Write Your achievements' className='p-5 border-[#A5A5A5] focus-visible:ring-0 
                        focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5] resize-none' 
                            rows={4} maxLength={512}                                
                            {...register("work_experience.highlights")}                          
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Highlights
                        </Label>
                        <span className="absolute -bottom-5 right-3 text-[12px] text-joblin-black">
                            <span className='font-medium'>0</span>/512
                        </span>
                    </div>

                    



            </div>
  </>
}

export default WorkExperienceEdit
