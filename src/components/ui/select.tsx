import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ value, onValueChange, children }: { value: string, onValueChange: (v: string) => void, children: React.ReactNode }) {
  return (
    <select
      className={cn("rounded-lg bg-black/40 text-white border border-gray-700 p-2")}
      value={value}
      onChange={e => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SelectValue({ placeholder, className }: { placeholder: string, className?: string }) {
  return <option disabled value="" className={className}>{placeholder}</option>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: { value: string, children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
