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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { useVerifyEmail } from "@/hooks/auth";
import { getErrorMessage } from "@/lib/apiClient/error";

const verifyEmailSchema = z.object({
  verifyCode: z.string().min(4, "Enter the 4-digit verification code"),
});

interface CodeType {
  verifyCode: string;
}

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyMutation = useVerifyEmail();
  const nextPath = searchParams.get("next") || "/login/company";

  const { control, handleSubmit } = useForm<CodeType>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verifyCode: "",
    },
  });

  const verifyCode = useWatch({ control, name: "verifyCode" });
  const isCodeComplete = (verifyCode || "").length === 4;

  async function onSubmit(codeObj: CodeType) {
    verifyMutation.mutate(codeObj, {
      onSuccess: () => router.push(nextPath.split("?")[0]),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-card">
        <CardHeader>
          <div className="flex justify-center py-3">
            <Image src="/darklogo.svg" width={120} height={60} alt="Joplin" />
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#EAF8F2] text-[#02905E]">
              <MailCheck size={28} aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Verify your email
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm flex justify-center w-4/5 mx-auto">
              We sent a verification code to your email. Enter it below to
              activate your company account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
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
                  <InputOTPGroup className="flex gap-4">
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
              <span className="text-emerald-600">4:59</span>
            </p>

            <Button
              disabled={!isCodeComplete || verifyMutation.isPending}
              type="submit"
              className="h-10 rounded-sm mt-1 w-3/4 bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer"
            >
              {verifyMutation.isPending ? (
                <LoaderCircle
                  className="animate-spin mx-auto text-white"
                  size={18}
                />
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          {verifyMutation.isError && (
            <p className="text-red-700 text-center text-sm mt-3">
              {getErrorMessage(verifyMutation.error, "Verification failed.")}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col justify-center pb-4 gap-3">
          <Link
            href="/register/company"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#02905E] hover:text-[#04a165]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to registration
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default VerifyEmail;
