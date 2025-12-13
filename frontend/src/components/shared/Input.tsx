import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg px-4 py-2.5 text-sm transition-all duration-300",
        "bg-[#011640]/40 text-[#ffffff] placeholder:text-[#ffffff]/40",
        "border border-[#618c7c]/30 focus:border-[#618c7c] outline-none",
        "hover:border-[#618c7c]/50 hover:bg-[#011640]/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }