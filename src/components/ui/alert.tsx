import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-white/30 bg-white/20 p-4 text-white", className)}>
      {children}
    </div>
  );
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-bold mb-1">{children}</div>;
}

export function AlertDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}
