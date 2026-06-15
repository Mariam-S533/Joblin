"use client"
import InputField from '@/components/InputField/InputField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Eye, EyeClosed } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation';
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner';



function JobseekerRegister() {

      const [loading, setLoading] = useState(false)
      // const [errorMsg, setErrorMsg] = useState("")
      const router = useRouter()
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

      const [showPassword, setShowPassword] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);

        interface Inputs{
        firstName: string,
        lastName: string,
        email:string,
        password: string,
        confirmPassword: string,
      }

      const schema = z.object({
        firstName: z.string().nonempty("first name is required *").min(2, 'First name must be at least 2 characters long'),
        lastName: z.string().nonempty("last name is required *").min(2, 'Last name must be at least 2 characters long'),
        email: z.string().nonempty("email is required *").email('Invalid email address'),
        password: z.string().nonempty("password is required *").min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string().nonempty("password is required *").min(8, 'Password must be at least 8 characters long'),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Password doesn't match",path: ["confirmPassword"]})
      
      const {register, handleSubmit, formState:{errors}} = useForm<Inputs>({
        resolver: zodResolver(schema)
      })

      async function onSubmit(data: Inputs){
        try{
          setLoading(true)
          const response = await fetch(`${baseUrl}/api/Authentication/register-seeker`, {
            method: "POST",
            headers: {"Content-Type": "application/json",
              "X-Tunnel-Skip-AntiPhishing-Page": "true"
            },
            body: JSON.stringify(data)
          })
          const resData = await response.json()
          
          setLoading(false)
          if(response.ok){
            toast.success("Registration successful! Redirecting to login page...", {position: "top-center", duration: 3000})
            router.push('/login/generalLogin')
          }
          else{
            toast.error(resData.title, {position: "top-center", duration: 3000})
            setLoading(false)
          }
        }
        catch(error){
          const message = error instanceof Error ? error.message : "Something went wrong";
          setLoading(false)
          toast.error(message, {position: "top-center", duration: 3000})
        }
      }



  return (
    <>
    <div className='min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4'>
      <Card className='w-full max-w-md shadow-lg bg-card '>
        <CardHeader>
          <div className='flex justify-center py-3'>
            <Image src="/darklogo.svg" width={120} height={60} alt='Joplin'/>
          </div>
          <div className=' space-y-2 text-center'>
            <CardTitle className=' text-2xl font-bold text-foreground'>
              Create an account
            </CardTitle>
            <CardDescription className='text-gray-400 text-sm flex justify-center w-3/4 mx-auto'>
              Please enter your personal details to set up your account and
              personalize your experience.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className=' space-y-2'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 mt-3'>
            <div className=''>
              <InputField
              {...register("firstName")}
              id="firstname"
              label="First Name"
              type="text"
              placeholder="Enter your First Name"
            />
            {errors.firstName && <p className='text-sm text-red-600 mt-1'>{errors.firstName.message}</p>}
            </div>

            <div className=' '>
              <InputField
              {...register("lastName")}
              id="lastname"
              label="Last Name"
              type="text"
              placeholder="Enter your Last Name"
            />
            {errors.lastName && <p className='text-sm text-red-600 mt-1'>{errors.lastName.message}</p>}
            </div>

            <div className=''>
              <InputField
              {...register("email")}
              id="email"
              label="Email"
              type="email"
              placeholder="enter your Email "
            />
            {errors.email && <p className='text-sm text-red-600 mt-1'>{errors.email.message}</p>}
            </div>

          <div className="w-full flex flex-col">
                    <div className="relative">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0
                            focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5] pr-10 relative
                            "
                />
                <Label htmlFor="password" className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 font-medium gap-1">
                  Password <span className="text-red-600">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <Eye size={19}/> : <EyeClosed size={19}/> }
                </button>
              </div>

              {errors.password && <p className='text-sm text-red-600 mt-1'>{errors.password.message}</p>}
          </div>


            <div className="w-full flex flex-col">
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  id="confirmpassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your Password"
                  className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0
                            focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5] pr-10"
                />
                <Label htmlFor="confirmpassword" className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 font-medium gap-1">
                  Confirm Password <span className="text-red-600">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? <Eye size={19}/> : <EyeClosed size={19}/>}
                </button>
              </div>
              {errors.confirmPassword && <p className='text-sm text-red-600 mt-1'>{errors.confirmPassword.message}</p>}
            </div>

            <Button type='submit' className='h-10 rounded-sm mt-1 w-full bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer '>
            {loading? <LoaderCircle className='animate-spin mx-auto text-white' size={18}/> : 'Sign up'}
            </Button>

          </form>


            <div className="relative flex items-center gap-2 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400 font-medium px-2">
              OR
            </span>
            <Separator className="flex-1" />
            </div>

            <Button onClick={() => { document.cookie = "auth_action=register_seeker; path=/; max-age=300; SameSite=Lax"; signIn("google", { callbackUrl: "/" })}} type='button' className='w-full h-11 rounded-sm border border-[#04a165] transparent bg-white text-[#04a165] font-medium text-[16px] hover:bg-gray-50 flex items-center justify-center gap-2 overflow-hidden cursor-pointer'>
              <Image src="/google-icon.svg" width={20} height={20} alt='googel logo'/>
              <span>Sign up with Google</span>
            </Button>

        </CardContent>

          <CardFooter className="flex justify-center pb-2">
          <p className="text-sm text-muted-foreground">
            Do you already have an account?
            <Link
              href="/login/generalLogin"
              className="font-medium text-[#02905E] hover:text-[#04a165] underline cursor-pointer"
            >
              Login
            </Link>
          </p>
           {/* {errorMsg && <p className='text-red-700 text-center'>{errorMsg}</p>} */}
        </CardFooter>

      </Card>
    </div>
    </>
  )
}

export default JobseekerRegister