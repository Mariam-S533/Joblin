import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useFormContext } from "react-hook-form"


function Links() {

    const { register } = useFormContext()

  return <>
        <div className=''>
                    <div className=' relative'>
                        <Input
                        placeholder="https://linkedin.com/in/yourprofile"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("personal_info.linkedin")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            LinkedIn
                        </Label>
                    </div>

                    <div className=' relative mt-6'>
                        <Input
                        placeholder="https://github.com/yourusername"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("personal_info.github")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            GitHub
                        </Label>
                    </div>

                    <div className=' relative mt-6'>
                        <Input
                        placeholder="https://yourportfolio.com"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("personal_info.website")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Portfolio / Website
                        </Label>
                    </div>
        </div>
    </>
}

export default Links
