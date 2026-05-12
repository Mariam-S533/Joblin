"use client"
import InputField from '@/components/InputField/InputField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation';
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { useRegisterCompany } from '@/hooks/auth'
import { getErrorMessage } from '@/lib/apiClient/error'



function CompanyRegister() {

      const router = useRouter()
      const registerMutation = useRegisterCompany()

        interface Inputs{
        companyName: string,
        domain: string,
        description: string,
        email:string,
        password: string,
        confirmPassword: string,
      }

      const schema = z.object({
        companyName: z.string().nonempty("first name is required *").min(2, 'First name must be at least 2 characters long'),
        domain: z.string().nonempty("last name is required *").min(2, 'Last name must be at least 2 characters long'),
        description: z.string().nonempty("email is required *").min(10, 'Description must be at least 10 characters long'),
        email: z.string().nonempty("email is required *").email('Invalid email address'),
        password: z.string().nonempty("password is required *").min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string().nonempty("password is required *").min(8, 'Password must be at least 8 characters long'),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Password doesn't match",path: ["confirmPassword"]})
      
      const {register, handleSubmit, formState:{errors}} = useForm<Inputs>({
        resolver: zodResolver(schema)
      })

      async function onSubmit(data: Inputs){
        registerMutation.mutate(data, {
          onSuccess: () => router.push('/login/company'),
        });
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
            <CardTitle className='w-3/4 text-2xl font-bold text-foreground mx-auto'>
              Give us your company information
            </CardTitle>
            <CardDescription className='text-gray-400 text-sm flex justify-center w-3/4 mx-auto'>
              Please provide your company details to complete
              your profile and access all features
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className=' space-y-2'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 mt-3'>
            <div className=''>
              <InputField
              {...register("companyName")}
              id="companyname"
              label="Firs Name"
              type="text"
              placeholder="Enter your First Name"
            />
            {errors.companyName && <p className='text-sm text-red-600 mt-1'>{errors.companyName.message}</p>}
            </div>

            <div className=' '>
              <InputField
              {...register("domain")}
              id="domain"
              label="Last Name"
              type="text"
              placeholder="Enter your Last Name"
            />
            {errors.domain && <p className='text-sm text-red-600 mt-1'>{errors.domain.message}</p>}
            </div>

              <div className=''>
              <InputField
              {...register("description")}
              id="description"
              label="Description"
              type="text"
              placeholder="Enter a brief description about your company"
            />
            {errors.description && <p className='text-sm text-red-600 mt-1'>{errors.description.message}</p>}
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

            <div className=''>
              <InputField
              {...register("password")}
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your Password"
            />
            {errors.password && <p className='text-sm text-red-600 mt-1'>{errors.password.message}</p>}
            </div>

            <div className=''>
              <InputField
              {...register("confirmPassword")}
              id="confirmpassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your Password"
            />
            {errors.confirmPassword && <p className='text-sm text-red-600 mt-1'>{errors.confirmPassword.message}</p>}
            </div>

            <Button type='submit' disabled={registerMutation.isPending} className='h-10 rounded-sm mt-1 w-full bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer '>
            {registerMutation.isPending? <LoaderCircle className='animate-spin mx-auto text-white' size={18}/> : 'Sign up'}
            </Button>

          </form>


            <div className="relative flex items-center gap-2 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400 font-medium px-2">
              OR
            </span>
            <Separator className="flex-1" />
            </div>

            <Button   onClick={() =>{ document.cookie = "auth_action=register_company; path=/; max-age=300; SameSite=Lax"; signIn("google", { callbackUrl: "/company/home",}) }} type='button' className='w-full h-11 rounded-sm border border-[#04a165] transparent bg-white text-[#04a165] font-medium text-[16px] hover:bg-gray-50 flex items-center justify-center gap-2 overflow-hidden cursor-pointer'>
              <Image src="/google-icon.svg" width={20} height={20} alt='googel logo'/>
              <span>Sign up with Google</span>
            </Button>

        </CardContent>

          <CardFooter className="flex flex-col justify-center pb-2 gap-2">
          <p className="text-sm text-muted-foreground">
            Do you already have an account?
            <Link
              href="/login/company"
              className="font-medium text-[#02905E] hover:text-[#04a165] underline cursor-pointer"
            >
              Login
            </Link>
          </p>
           {registerMutation.isError && <p className='text-red-700 text-center text-sm'>{getErrorMessage(registerMutation.error, "Registration failed. Please try again.")}</p>}
        </CardFooter>

      </Card>
    </div>
    </>
  )
}

export default CompanyRegister