import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-[6px] bg-white px-3 text-sm text-[#171717] placeholder:text-[#8F8F8F] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:shadow-none focus-visible:outline-1 focus-visible:outline-[#005FCC]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
