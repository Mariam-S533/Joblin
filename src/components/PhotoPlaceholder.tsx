import React from "react";

export const PhotoPlaceholder = ({ text }: { text: string }) => (
  <div className="w-40 h-40 rounded-lg outline outline-1 outline-offset-[-1.6px] outline-neutral-400 inline-flex justify-center items-center bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 relative opacity-40">
        <div className="w-6 h-6 left-[4px] top-[4px] absolute border-2 border-neutral-500 rounded-sm" />
        <div className="w-1.5 h-1.5 left-[9px] top-[9px] absolute border-2 border-neutral-500 rounded-full" />
        <div className="w-5 h-3 left-[8px] top-[15px] absolute border-2 border-neutral-500" />
      </div>
      <div className="text-center text-neutral-400 text-xs font-normal font-['Inter']">
        {text}
      </div>
    </div>
  </div>
);
