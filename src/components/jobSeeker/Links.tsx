import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useFormContext } from "react-hook-form"


function Links() {

    const { register } = useFormContext()

  return <>
        <div className=''>

                    <div className=' relative'>
                        <Input
                        placeholder="Ex: Next.js"
                        className='h-11 rounded-sm border
                                border-[#A5A5A5] focus-visible:ring-0
                                focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                                type="text"
                                {...register("personalInfo.fullName")}
                        />
                        <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                            Your Sills
                        </Label>
                    </div>

        </div>
    </>
}

export default Links