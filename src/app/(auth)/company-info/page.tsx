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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpsertCompany, useGetCompanyById } from "@/hooks/companyProfile";
import { getErrorMessage } from "@/lib/apiClient/error";
import type { UpsertCompanyPayload } from "@/features/company-profile/types";
import { LoaderCircle } from "lucide-react";

/**
 * Form inputs for the company-info onboarding page.
 *
 * These map to the PUT /api/Company request body:
 *   companyName → required
 *   domain → optional/nullable
 *   description → optional/nullable
 *   publicContactMail → optional/nullable
 *   companySize → optional/nullable (number)
 *   branchName → required (first address)
 *   country → required (first address)
 *   city → required (first address)
 *   regionOrState → optional/nullable
 *   postalCode → optional/nullable
 *
 * userId is injected from the session, not from user input.
 */
interface CompanyInfoInputs {
  companyName: string;
  domain?: string;
  description?: string;
  publicContactMail?: string;
  companySize?: string; // string in form, converted to number for API
  branchName: string;
  country: string;
  city: string;
  regionOrState?: string;
  postalCode?: string;
}

function CompanyInfo() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const userId = session?.id as string;

  // ─── Check if company data already exists ────────────────────────
  // GET /api/Company/{id} — if data exists, redirect to dashboard.
  // If 404 (no company yet), show the create form.
  const companyDataQuery = useGetCompanyById(userId, {
    enabled: !!userId,
  });

  // ─── Redirect if company data already exists ─────────────────────
  useEffect(() => {
    if (companyDataQuery.isSuccess && companyDataQuery.data) {
      // Company already has data — redirect to dashboard
      router.replace("/company/home");
    }
  }, [companyDataQuery.isSuccess, companyDataQuery.data, router]);

  // ─── Upsert company mutation (PUT /api/Company) ──────────────────
  const upsertCompanyMutation = useUpsertCompany();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInfoInputs>({
    defaultValues: {
      companyName: "",
      domain: "",
      description: "",
      publicContactMail: "",
      companySize: "",
      branchName: "",
      country: "",
      city: "",
      regionOrState: "",
      postalCode: "",
    },
  });

  async function onSubmit(data: CompanyInfoInputs) {
    if (!userId) {
      return; // Session not ready; button should be disabled
    }

    const payload: UpsertCompanyPayload = {
      userId,
      companyName: data.companyName,
      publicContactMail: data.publicContactMail || null,
      domain: data.domain || null,
      description: data.description || null,
      logoUrl: null,
      companySize: data.companySize ? Number(data.companySize) : null,
      addresses: [
        {
          branchName: data.branchName,
          country: data.country,
          city: data.city,
          regionOrState: data.regionOrState || null,
          postalCode: data.postalCode || null,
          isHeadQuarters: true,
        },
      ],
    };

    try {
      await upsertCompanyMutation.mutateAsync({ id: userId, payload });
      router.push("/company/home");
    } catch (error) {
      console.error("Company creation failed:", getErrorMessage(error));
    }
  }

  // ─── Loading states ──────────────────────────────────────────────
  const isPending = upsertCompanyMutation.isPending;
  const apiError = upsertCompanyMutation.error
    ? getErrorMessage(upsertCompanyMutation.error)
    : null;

  // While session or company data query is loading, show a spinner
  if (sessionStatus === "loading" || companyDataQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
        <LoaderCircle className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  // If company data query errored with anything other than 404,
  // it might be a real backend error — but we still show the form
  // since the user needs to fill it anyway for first-time setup.
  // A 404 specifically means "no company data yet" which is expected
  // for new users, so we proceed to show the create form.
  const showForm =
    !companyDataQuery.data || companyDataQuery.isError;

  if (!showForm) {
    // This shouldn't render because the useEffect above redirects,
    // but just in case, show a loading state while redirect happens.
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
        <LoaderCircle className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] p-4">
        <Card className="w-full max-w-md shadow-lg bg-card">
          <CardHeader>
            <div className="flex justify-center py-3">
              <Image
                src="/darklogo.svg"
                width={120}
                height={60}
                alt="Joplin"
              />
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                Give us Company Info
              </CardTitle>
              <CardDescription
                className="text-gray-400 text-sm flex justify-center w-3/4 mx-auto"
              >
                Please provide your company details to complete your profile.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 mt-3"
            >
              {/* ─── Company fields ──────────────────────────────── */}
              <div className="">
                <InputField
                  {...register("companyName", {
                    required: "Company name is required",
                    minLength: {
                      value: 2,
                      message: "Company name must be at least 2 characters",
                    },
                  })}
                  id="companyName"
                  label="Company Name"
                  type="text"
                  placeholder="Enter Company Name"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="">
                <InputField
                  {...register("domain")}
                  id="domain"
                  label="Domain"
                  type="text"
                  placeholder="e.g. tech, healthcare"
                />
              </div>

              <div className="">
                <InputField
                  {...register("publicContactMail")}
                  id="publicContactMail"
                  label="Public Contact Email"
                  type="email"
                  placeholder="contact@company.com"
                />
              </div>

              <div className="">
                <InputField
                  {...register("companySize")}
                  id="companySize"
                  label="Company Size"
                  type="number"
                  placeholder="Number of employees"
                />
              </div>

              <div className="relative">
                <Textarea
                  {...register("description")}
                  id="description"
                  placeholder="Type Company Description."
                  className="placeholder:text-[#A5A5A5] border-[#A5A5A5]"
                />
                <Label
                  htmlFor="description"
                  className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-700 font-medium gap-1"
                >
                  Company Description
                </Label>
              </div>

              {/* ─── Headquarters address fields ─────────────────── */}
              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-medium text-gray-600 mb-3">
                  Headquarters Address
                </p>

                <div className="">
                  <InputField
                    {...register("branchName", {
                      required: "Branch name is required",
                    })}
                    id="branchName"
                    label="Branch Name"
                    type="text"
                    placeholder="Headquarters"
                  />
                  {errors.branchName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.branchName.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <InputField
                    {...register("country", {
                      required: "Country is required",
                    })}
                    id="country"
                    label="Country"
                    type="text"
                    placeholder="Enter Country"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <InputField
                    {...register("city", {
                      required: "City is required",
                    })}
                    id="city"
                    label="City"
                    type="text"
                    placeholder="Enter City"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <InputField
                    {...register("regionOrState")}
                    id="regionOrState"
                    label="Region / State"
                    type="text"
                    placeholder="Enter Region or State"
                  />
                </div>

                <div className="">
                  <InputField
                    {...register("postalCode")}
                    id="postalCode"
                    label="Postal Code"
                    type="text"
                    placeholder="Enter Postal Code"
                  />
                </div>
              </div>

              {/* ─── API error display ───────────────────────────── */}
              {apiError && (
                <p className="text-sm text-red-600 text-center">{apiError}</p>
              )}

              <Button
                type="submit"
                disabled={isPending || !userId}
                className="h-10 rounded-sm mt-1 w-full bg-black text-white text-[17px] font-medium hover:bg-gray-700 cursor-pointer"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin mx-auto text-white" size={18} />
                ) : (
                  "Finish up"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-2">
            <p className="text-sm text-muted-foreground">
              <Link
                href="/company/home"
                className="font-medium text-[15px] text-black cursor-pointer"
              >
                Skip
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default CompanyInfo;
