import { useFormContext } from "react-hook-form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export function PersonalInfoEdit() {
  const { register } = useFormContext()

  return (
    <div className="">
      <div className="flex flex-col gap-6">

          <div className=' relative'>
          <Input
            placeholder="Ex: Mariam Sayed"
            className='h-11 rounded-sm border
                    border-[#A5A5A5] focus-visible:ring-0
                    focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                    type="text"
                    {...register("personal_info.fullname")}
          />
          <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
            Full Name
          </Label>
          </div>

          <div className='flex gap-3 items-center w-full'>

              <div className=' relative w-full'>
              <Input
                placeholder="john@example.com"
                className='h-11 rounded-sm border
                        border-[#A5A5A5] focus-visible:ring-0
                        focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                type="email"
                {...register("personal_info.email")}
              />
              <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                Email
              </Label>
            </div>

              <div className=' relative w-full'>
              <Input
                placeholder="+1 234 567 8900"
                className='h-11 rounded-sm border
                        border-[#A5A5A5] focus-visible:ring-0
                        focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                type="tel"
                {...register("personal_info.phone")}
              />
              <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                Phone
              </Label>
              </div>

          </div>

          <div className='flex gap-3 items-center w-full'>

              <div className=' relative w-full'>
              <Input
                placeholder="e.g. Egypt"
                className='h-11 rounded-sm border
                        border-[#A5A5A5] focus-visible:ring-0
                        focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                type="text"
                {...register("personal_info.location.country")}
              />
              <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                Country
              </Label>
              </div>

              <div className=' relative w-full'>
              <Input
                placeholder="e.g. Cairo"
                className='h-11 rounded-sm border
                        border-[#A5A5A5] focus-visible:ring-0
                        focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]'
                type="text"
                {...register("personal_info.location.city")}
              />
              <Label className=' absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium gap-1'>
                City
              </Label>
              </div>
        </div>


      </div>
    </div>
  )
}
