"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full transition-colors outline-none cursor-pointer focus-visible:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#0072F5] data-[size=default]:h-5 data-[size=default]:w-9 data-[size=sm]:h-4 data-[size=sm]:w-7 data-checked:bg-[#171717] data-unchecked:bg-[#EBEBEB] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.15)] group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:translate-x-0.5 group-data-[size=default]/switch:data-checked:translate-x-[1.125rem] group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:translate-x-0.5 group-data-[size=sm]/switch:data-checked:translate-x-3.5"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
