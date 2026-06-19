import React from "react";

export type FloatingTextAreaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  /** Error message to display below the textarea. Also triggers red outline. */
  error?: string;
};

export const FloatingTextArea = ({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  maxLength = 512,
  required = false,
  error,
}: FloatingTextAreaProps) => (
  <div className="relative flex flex-col justify-start items-start w-full">
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full h-32 p-4 rounded-lg outline outline-1 outline-offset-[-1px] text-neutral-800 text-sm font-normal placeholder-neutral-400 resize-none ${
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
    <div className="flex w-full items-start justify-between mt-1">
      {error ? <p className="text-red-500 text-xs">{error}</p> : <span />}
      <span className="text-neutral-500 text-xs font-normal">
        {value.length} / {maxLength}
      </span>
    </div>
  </div>
);
