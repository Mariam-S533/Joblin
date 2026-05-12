"use client"
import InputField from '@/components/InputField/InputField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useForgotPassword } from '@/hooks/auth'
import { getErrorMessage } from '@/lib/apiClient/error'

interface Inputs{
  email:string,
}

function ForgetBass() {

        const forgotMutation = useForgotPassword()
  
        const schema = z.object({
          email: z.string().nonempty("email is required *").email('Invalid email address'),
        })
        
        const {register, handleSubmit, formState:{errors}} = useForm<Inputs>({
          resolver: zodResolver(schema)
        })
  
        async function onSubmit(data: Inputs){
          forgotMutation.mutate(data);
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
              Forgot Your Password?
            </CardTitle>
            <CardDescription className='text-gray-400 text-sm flex justify-center w-3/4 mx-auto'>
              Enter your email address below and we will send you a link to reset your password.
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

            <Button type='submit' disabled={forgotMutation.isPending} className='h-10 rounded-sm mt-1 w-full bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer '>
            {forgotMutation.isPending? <LoaderCircle className='animate-spin mx-auto text-white' size={18}/> : 'Send Link'}
            </Button>

          </form>

          {forgotMutation.isSuccess && (
            <p className='text-emerald-600 text-center text-sm mt-3'>Password reset link sent to your email.</p>
          )}
          {forgotMutation.isError && (
            <p className='text-red-700 text-center text-sm mt-3'>{getErrorMessage(forgotMutation.error, "Failed to send reset link.")}</p>
          )}

        </CardContent>

          <CardFooter className="flex justify-center pb-2">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-[#02905E] hover:text-[#04a165] underline cursor-pointer"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
    </>
  )
}

export default ForgetBass