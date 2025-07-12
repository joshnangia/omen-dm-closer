import * as React from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, children, onOpenChange }: { open: boolean, children: React.ReactNode, onOpenChange?: (open: boolean) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl min-w-[320px] max-w-[90vw]">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-white mb-2">{children}</h2>;
}
