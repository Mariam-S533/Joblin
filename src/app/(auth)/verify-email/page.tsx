"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

interface codeType {
  verifyCode: string;
}

function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(299); // 4:59 in seconds

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const formatTimer = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const schema = z.object({
    verifyCode: z.string().nonempty("verification code is required *"),
  });

  const { control, handleSubmit } = useForm<codeType>({
    resolver: zodResolver(schema),
    defaultValues: {
      verifyCode: "",
    },
  });

  const verifyCode = useWatch({ control, name: "verifyCode" });
  const isCodeComplete = (verifyCode || "").length === 4;

  async function onSubmit(codeObj: codeType) {
    console.log(codeObj);
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4">
        <Card className="w-full max-w-md shadow-lg bg-card ">
          <CardHeader>
            <div className="flex flex-col justify-center pt-3 pb-2 gap-2">
              <div className="flex justify-center">
                <Image
                  src="/darklogo.svg"
                  width={120}
                  height={60}
                  alt="Joplin"
                />
              </div>
              <p className="text-[#757575] text-[14px] font-medium flex justify-center w-3/4 mx-auto">
                Are You Employer?{" "}
                <Link href="/register" className=" text-[#02905E] pl-1">
                  Click Here
                </Link>
              </p>
            </div>
            <div className=" space-y-2 text-center">
              <CardTitle className=" text-2xl font-bold text-foreground">
                Verify Your Email Address
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm flex justify-center w-3/4 mx-auto">
                We&apos;ve sent a verification code to your email, Please enter
                the code below to verify your account.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className=" space-y-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center gap-5 mt-3"
            >
              <Controller
                name="verifyCode"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={4}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="flex gap-4 ">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />

              <p className="text-[15px] text-gray-400">
              Your code will expire in{" "}
              <span className="text-emerald-600">{formatTimer(timerSeconds)}</span>
            </p>

              <Button
                disabled={!isCodeComplete}
                type="submit"
                className="h-10 rounded-sm mt-1 w-3/4 bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer"
              >
                {loading ? (
                  <LoaderCircle
                    className="animate-spin mx-auto text-white"
                    size={18}
                  />
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t receive the code?
              <Link
                href="/verify-email"
                className="font-medium text-[#02905E] hover:text-[#04a165] underline cursor-pointer"
              >
                Resend Code
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default VerifyEmail;
