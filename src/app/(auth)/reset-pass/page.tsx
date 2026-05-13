"use client";
import InputField from "@/components/InputField/InputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useResetPassword } from "@/hooks/auth";
import { getErrorMessage } from "@/lib/apiClient/error";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "password is required *")
      .min(8, "Password must be at least 8 characters long"),
    repassword: z
      .string()
      .min(1, "password is required *")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Password doesn't match",
    path: ["repassword"],
  });

interface Inputs {
  password: string;
  repassword: string;
}

function ResetPass() {
  const router = useRouter();
  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: Inputs) {
    resetMutation.mutate(data, {
      onSuccess: () => router.push("/login/company"),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4">
      <Card className="w-full max-w-md shadow-lg bg-card ">
        <CardHeader>
          <div className="flex justify-center py-3">
            <Image src="/darklogo.svg" width={120} height={60} alt="Joplin" />
          </div>
          <div className=" space-y-2 text-center">
            <CardTitle className=" text-2xl font-bold text-foreground">
              Enter a New Password
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm flex justify-center w-3/4 mx-auto">
              Enter your new password below to reset your account password.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className=" space-y-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mt-3"
          >
            <div className="">
              <InputField
                {...register("password")}
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your Password"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="">
              <InputField
                {...register("repassword")}
                id="confirmpassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your Password"
              />
              {errors.repassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.repassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={resetMutation.isPending}
              className="h-10 rounded-sm mt-1 w-full bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer "
            >
              {resetMutation.isPending ? (
                <LoaderCircle
                  className="animate-spin mx-auto text-white"
                  size={18}
                />
              ) : (
                "Save New Password"
              )}
            </Button>
          </form>

          {resetMutation.isError && (
            <p className="text-red-700 text-center text-sm mt-3">
              {getErrorMessage(
                resetMutation.error,
                "Failed to reset password.",
              )}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pb-2">
          <p className="text-sm text-muted-foreground">
            Not looking to change your password?{" "}
            <Link
              href="/login/company"
              className="font-medium text-[#02905E] hover:text-[#04a165] underline cursor-pointer"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ResetPass;
