import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  placeholder?: string;
  /** When true, the red required asterisk (*) is hidden. */
  optional?: boolean;
}

function InputField({
  label,
  id,
  placeholder,
  optional,
  ...props
}: InputFieldProps) {
  return (
    <div className=" relative">
      <Input
        id={id}
        placeholder={placeholder}
        className="h-11 rounded-sm border
                border-[#A5A5A5] focus-visible:ring-0
                focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]"
        {...props}
      />

      <Label
        htmlFor={id}
        className=" absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 font-medium gap-1"
      >
        {label} {!optional && <span className=" text-red-600">*</span>}
      </Label>
    </div>
  );
}

export default InputField;
