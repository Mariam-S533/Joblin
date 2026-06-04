"use client"
import InputField from '@/components/InputField/InputField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


interface Inputs{
  email:string,
  password: string,
}

function LoginPage() {


        const [loading, setLoading] = useState(false)
        const router = useRouter()
        const [errorMsg, setErrorMsg] = useState("")
  
        const schema = z.object({
          email: z.string().nonempty("email is required *").email('Invalid email address'),
          password: z.string().nonempty("password is required *").min(8, 'Password must be at least 8 characters long'),
        })
        
        const {register, handleSubmit, formState:{errors}} = useForm<Inputs>({
          resolver: zodResolver(schema)
        })
  
        async function onSubmit(data: Inputs){
          console.log(data);
          try{
            setLoading(true)
            const res = await signIn('credentials', {
              email: data.email,
              password: data.password,
              redirect: false,
            })
            setLoading(false)
            if(res?.ok){
              const session = await getSession()
              console.log('sessionnn', session)
              if (session?.role === 'Company') {
                router.push('/company/home')
              } else {
                router.push('/')
              }
              // window.location.href = "/"
            }else{
              console.log(res?.error);
              setErrorMsg(res?.error || "Invalid email or password" )

              setLoading(false)
            }
          }
          catch(error){
            console.log(error);
            setErrorMsg("An error occurred. Please try again.")
            setLoading(false)
          }   
        }



  return (
        <>
    <div className='min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4'>
      <Card className='w-full max-w-md shadow-lg bg-card '>
        {errorMsg&& <p className='text-red-700 text-center'>{errorMsg}</p> }
        <CardHeader>
          <div className='flex justify-center py-3'>
            <Image src="/darklogo.svg" width={120} height={60} alt='Joplin'/>
          </div>
          <div className='text-center'>
            <CardDescription className='text-[#757575] text-[14px] font-medium flex justify-center w-3/4 mx-auto'>
              {/* Are You Employer? <Link href="/register/company" className=' text-[#02905E] pl-1'>Click Here</Link> */}
              Welcome back! Log in to access your dashboard profile.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className=' space-y-2'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 mt-3'>

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

            <div className='w-full flex pt-2 justify-between '>
                <div className='flex items-center '>
                <Checkbox id='remember-me' />
                <Label htmlFor='remember-me' className='text-[13px] ms-1 text-[#989898]'>Remember Me</Label>
                </div>
              <span className='ms-auto text-[13px] font-semibold'>
              <Link href="/forget-pass" className="text-[#02905E] hover:underline">
                  Forgot Password?
                </Link>
              </span>
              </div>
            </div>

            <Button type='submit' className='h-10 rounded-sm mt-1 w-full bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer'>
            {loading? <LoaderCircle className='animate-spin mx-auto text-white' size={18}/> : 'Log in'}
            </Button>

          </form>


            <div className="relative flex items-center gap-2 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400 font-medium px-2">
              OR
            </span>
            <Separator className="flex-1" />
            </div>

            <Button onClick={() => signIn('google', { callbackUrl: '/' })} type='button' className='w-full h-11 rounded-sm border border-[#04a165] transparent bg-white text-[#04a165] font-medium text-[16px] hover:bg-gray-50 flex items-center justify-center gap-2 overflow-hidden cursor-pointer'>
              <Image src="/google-icon.svg" width={20} height={20} alt='googel logo'/>
              <span>Continue with Google</span>
            </Button>

        </CardContent>

          <CardFooter className="flex justify-center pb-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? Register as a{' '}
            <Link href="/register/job-seeker" className="font-bold text-[#02905E] underline">Seeker</Link> or{' '}
            <Link href="/register/company" className="font-bold text-[#02905E] underline">Company</Link>
          </p>
          
        </CardFooter>

      </Card>
    </div>
    </>
  )
}

export default LoginPage