"use client";

import React from "react";

type FloatingInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  error?: string;
};

export default function FloatingInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  error,
}: FloatingInputProps) {
  return (
    <div className="relative flex flex-col justify-start items-start w-full">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={
          `w-full h-14 p-4 rounded-lg border text-neutral-800 text-sm font-normal placeholder-neutral-500 transition-all ` +
          (error
            ? "border-red-500 outline-red-500 focus:outline-red-500 focus:outline-2"
            : "border-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-20")
        }
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
}
