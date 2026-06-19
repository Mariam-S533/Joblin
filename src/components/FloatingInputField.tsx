import React from "react";

export type FloatingInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  /** Error message to display below the input. Also triggers red outline. */
  error?: string;
};

export const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  error,
}: FloatingInputProps) => (
  <div className="relative flex flex-col justify-start items-start w-full">
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-12 p-4 rounded-lg outline outline-1 outline-offset-[-1px] text-neutral-800 text-sm font-normal placeholder-neutral-400 ${
        error
          ? "outline-red-500 focus:outline-red-500 focus:outline-2"
          : "outline-neutral-400 focus:outline-emerald-600 focus:outline-2"
      }`}
    />
    <div className="px-2 py-1 left-3 -top-4 absolute bg-white inline-flex justify-center items-center gap-1">
      <label
        htmlFor={id}
        className={`text-sm font-medium font-['Inter'] leading-6 ${
          error ? "text-red-600" : "text-neutral-800"
        }`}
      >
        {label}
      </label>
      {required && (
        <span className="text-red-700 text-base font-semibold">*</span>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
