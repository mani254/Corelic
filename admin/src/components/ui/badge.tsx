import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        success:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 border-transparent",
        warning:
          "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 border-transparent",
        destructive:
          "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100 border-transparent",
        info:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-transparent",
        neutral:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 border-transparent",
        
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
