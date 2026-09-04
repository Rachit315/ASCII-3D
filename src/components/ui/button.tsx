import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[6px] text-sm font-normal select-none transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#FFFFFF,0_0_0_4px_#0072F5] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#171717] text-white hover:bg-[#383838] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        secondary:
          "bg-white text-[#171717] hover:bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        outline:
          "bg-transparent text-[#171717] hover:bg-[#EBEBEB] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        ghost:
          "bg-transparent text-[#4D4D4D] hover:bg-[#EBEBEB] hover:text-[#171717]",
        link:
          "text-[#0072F5] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
