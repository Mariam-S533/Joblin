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
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const companyInfoSchema = z.object({
  compname: z
    .string()
    .min(1, "first name is required *")
    .min(2, "First name must be at least 2 characters long"),
  compfield: z
    .string()
    .min(1, "last name is required *")
    .min(2, "Last name must be at least 2 characters long"),
  compdescrip: z
    .string()
    .min(1, "email is required *")
    .min(10, "Description must be at least 10 characters long"),
});

interface InfoInputs {
  compname: string;
  compfield: string;
  compdescrip: string;
}

function CompanyInfo() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InfoInputs>({
    resolver: zodResolver(companyInfoSchema),
  });

  async function onSubmit(data: InfoInputs) {
    console.log(data);
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
              <CardTitle className=" text-2xl font-bold text-foreground">
                Give us Company Info
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm flex justify-center w-3/4 mx-auto">
                Please provide your company details to complete your profile.
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
                  {...register("compname")}
                  id="compname"
                  label="Company Name"
                  type="text"
                  placeholder="Enter Company Name"
                />
                {errors.compname && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.compname.message}
                  </p>
                )}
              </div>

              <div className=" ">
                <InputField
                  {...register("compfield")}
                  id="compfield"
                  label="Company Field"
                  type="text"
                  placeholder="Enter Company Field"
                />
                {errors.compfield && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.compfield.message}
                  </p>
                )}
              </div>

              <div className=" relative">
                <Textarea
                  id="compdescrip"
                  placeholder="Type Company Description."
                  className=" placeholder:text-[#A5A5A5] border-[#A5A5A5] "
                />
                <Label
                  htmlFor="compdescrip"
                  className=" absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-700 font-medium gap-1"
                >
                  Company Description <span className=" text-red-600">*</span>
                </Label>
                {errors.compdescrip && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.compdescrip.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-10 rounded-sm mt-1 w-full bg-black text-white text-[17px] font-medium hover:bg-gray-700 cursor-pointer "
              >
                {loading ? (
                  <LoaderCircle
                    className="animate-spin mx-auto text-white"
                    size={18}
                  />
                ) : (
                  "Finish up"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-2">
            <p className="text-sm text-muted-foreground">
              <Link
                href="/login"
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
