import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

function Languages() {


        interface langs{
        language: string,
        proficiency: string
    
    }
    const { register } = useForm<langs>()

  return <>
  
                        <div className='flex gap-3 items-center w-full '>
                      <div className=' relative w-full'>
                        <Input
                        placeholder="Italian"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("language")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Language
                        </Label>
                    </div>

                        <div className=' relative w-full'>
                        <Input
                        placeholder="level A"
                        className='h-11 rounded-sm border 
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-joblin-light-gray w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("proficiency")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                             Proficiency Level
                        </Label>
                    </div>
                    </div>
  
  </>
}

export default Languages

