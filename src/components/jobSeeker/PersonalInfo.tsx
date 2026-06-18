import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export function PersonalInfoEdit() {


  interface  Inputs{
      personalInfofullName: string | "",
      personalInfoemail: string | "",
      personalInfomobileNumber: string | "",
      personalInfocountry: string | "",
      personalInfocity: string | ""
  }

  const { register } = useForm<Inputs>()

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
                    {...register("personalInfofullName")}
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
                {...register("personalInfoemail")}
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
                {...register("personalInfomobileNumber")}
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
                {...register("personalInfocountry")}
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
                {...register("personalInfocity")}
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

// export function PersonalInfoRead({ data }: { data: any }) {
//   if (!data) return null;
//   return (
//     <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
//       {data.firstName && <div><span className="text-gray-500 block text-xs mb-1">First Name</span><span className="font-medium">{data.firstName}</span></div>}
//       {data.lastName && <div><span className="text-gray-500 block text-xs mb-1">Last Name</span><span className="font-medium">{data.lastName}</span></div>}
//       {data.email && <div><span className="text-gray-500 block text-xs mb-1">Email</span><span className="font-medium">{data.email}</span></div>}
//       {data.mobileNumber && <div><span className="text-gray-500 block text-xs mb-1">Mobile</span><span className="font-medium">{data.mobileNumber}</span></div>}
//       {data.city && <div><span className="text-gray-500 block text-xs mb-1">City</span><span className="font-medium">{data.city}</span></div>}
//       {data.maritalStatus && <div><span className="text-gray-500 block text-xs mb-1">Marital Status</span><span className="font-medium">{data.maritalStatus}</span></div>}
//     </div>
//   )
// }