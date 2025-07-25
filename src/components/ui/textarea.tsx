import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-700 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
