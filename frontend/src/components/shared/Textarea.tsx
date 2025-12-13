import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg px-4 py-2.5 text-sm transition-all duration-300",
        "bg-[#011640]/40 text-[#ffffff] placeholder:text-[#ffffff]/40",
        "border border-[#618c7c]/30 focus:border-[#618c7c] outline-none",
        "hover:border-[#618c7c]/50 hover:bg-[#011640]/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
