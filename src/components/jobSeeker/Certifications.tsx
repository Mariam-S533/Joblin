import { useFormContext } from "react-hook-form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Calendar } from 'lucide-react'

function Certifications() {
  const { register } = useFormContext()

  return <>
                    <div className=' flex flex-col gap-6'>
                        <div className='flex gap-3 items-center w-full '>
                          <div className=' relative w-full'>
                            <Input
                            placeholder="Google Data Analytics Certificate"
                            className='h-11 rounded-sm border 
                                    border-[#A5A5A5] focus-visible:ring-0
                                    focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                    type="text"
                                    {...register("certifications.name")}
                            />
                            <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                                Certification Name
                            </Label>
                        </div>
    
                            <div className=' relative w-full'>
                            <Input
                            placeholder="Amazon"
                            className='h-11 rounded-sm border 
                                    border-[#A5A5A5] focus-visible:ring-0
                                    focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                    type="text"
                                    {...register("certifications.issuer")}
                            />
                            <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                                Issuer
                            </Label>
                        </div>
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
                                {...register("certifications.issued_date")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        

                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Issued Date
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
                                {...register("certifications.expiry_date")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Expiry Date
                        </Label>
                    </div>
                    </div>
                </div>
  
  </>
}

export default Certifications
