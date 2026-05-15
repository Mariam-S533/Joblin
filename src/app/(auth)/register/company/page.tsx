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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRegisterCompany } from "@/hooks/auth";
import { getErrorMessage } from "@/lib/apiClient/error";
import type { RegisterCompanyPayload } from "@/features/auth/types";

/**
 * Zod validation schema for company registration.
 *
 * - companyName: required, min 2 chars
 * - domain: optional (nullable in backend), validated only if provided
 * - description: optional (nullable in backend), min 10 chars if provided
 * - email: required, valid email format
 * - password: required, min 8 chars
 * - confirmPassword: must match password
 */
const companyRegisterSchema = z
  .object({
    companyName: z
      .string()
      .min(1, "Company name is required")
      .min(2, "Company name must be at least 2 characters"),
    domain: z.string().optional().or(z.literal("")),
    description: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || val.length >= 10,
        "Description must be at least 10 characters if provided",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CompanyRegisterInputs = z.infer<typeof companyRegisterSchema>;

function CompanyRegister() {
  const router = useRouter();
  const registerMutation = useRegisterCompany();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CompanyRegisterInputs>({
    resolver: zodResolver(companyRegisterSchema),
  });

  /**
   * Submit handler: maps form data to RegisterCompanyPayload.
   * Optional fields (domain, description) are sent as null when empty,
   * matching the backend's nullable field expectations.
   */
  function onSubmit(data: CompanyRegisterInputs) {
    const payload: RegisterCompanyPayload = {
      companyName: data.companyName,
      domain: data.domain || null,
      description: data.description || null,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    registerMutation.mutate(payload, {
      onSuccess: () => router.push("/login/company"),
    });
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4">
        <Card className="w-full max-w-md shadow-lg bg-card ">
          <CardHeader>
            <div className="flex justify-center py-3">
              <Image src="/darklogo.svg" width={120} height={60} alt="Joplin" />
            </div>
            <div className=" space-y-2 text-center">
              <CardTitle className="w-3/4 text-2xl font-bold text-foreground mx-auto">
                Give us your company information
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm flex justify-center w-3/4 mx-auto">
                Please provide your company details to complete your profile and
                access all features
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
                  {...register("companyName")}
                  id="companyname"
                  label="Company Name"
                  type="text"
                  placeholder="Enter your company name"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className=" ">
                <InputField
                  {...register("domain")}
                  id="domain"
                  label="Domain"
                  type="text"
                  placeholder="Enter your company domain"
                  optional
                />
                {errors.domain && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.domain.message}
                  </p>
                )}
              </div>

              <div className="">
                <InputField
                  {...register("description")}
                  id="description"
                  label="Description"
                  type="text"
                  placeholder="Enter a brief description about your company"
                  optional
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="">
                <InputField
                  {...register("email")}
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="">
                <InputField
                  {...register("password")}
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="">
                <InputField
                  {...register("confirmPassword")}
                  id="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-10 rounded-sm mt-1 w-full bg-[#02905E] text-white text-[17px] font-medium hover:bg-[#04a165] cursor-pointer "
              >
                {registerMutation.isPending ? (
                  <LoaderCircle
                    className="animate-spin mx-auto text-white"
                    size={18}
                  />
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && (
              <>
                <div className="relative flex items-center gap-2 my-4">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-400 font-medium px-2">
                    OR
                  </span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  onClick={() => {
                    // Store auth action and form data in cookies before Google OAuth redirect.
                    // The NextAuth jwt callback reads these cookies to build the full
                    // request payload for google-register-company endpoint.
                    // companyName is required by the backend; domain & description are optional.
                    const formValues = getValues();
                    const companyName = formValues.companyName || "";
                    if (!companyName) {
                      // Trigger validation to show error on companyName field
                      handleSubmit(() => {})();
                      return;
                    }
                    const cookieOptions = "path=/; max-age=300; SameSite=Lax";
                    document.cookie = `auth_action=register_company; ${cookieOptions}`;
                    document.cookie = `google_reg_companyName=${encodeURIComponent(companyName)}; ${cookieOptions}`;
                    document.cookie = `google_reg_domain=${encodeURIComponent(formValues.domain || "")}; ${cookieOptions}`;
                    document.cookie = `google_reg_description=${encodeURIComponent(formValues.description || "")}; ${cookieOptions}`;
                    signIn("google", { callbackUrl: "/company/home" });
                  }}
                  type="button"
                  className="w-full h-11 rounded-sm border border-[#04a165] transparent bg-white text-[#04a165] font-medium text-[16px] hover:bg-gray-50 flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
                >
                  <Image
                    src="/google-icon.svg"
                    width={20}
                    height={20}
                    alt="Google logo"
                  />
                  <span>Sign up with Google</span>
                </Button>
              </>
            )}
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
            {registerMutation.isError && (
              <p className="text-red-700 text-center text-sm">
                {getErrorMessage(
                  registerMutation.error,
                  "Registration failed. Please try again.",
                )}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default CompanyRegister;
