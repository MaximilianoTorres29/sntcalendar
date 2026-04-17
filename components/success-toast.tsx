"use client";

import { CheckCircle2 } from "lucide-react";

interface SuccessToastProps {
  message: string;
}

export function SuccessToast({ message }: SuccessToastProps) {
  return (
    <div className="toast-enter fixed inset-x-0 bottom-24 z-30 mx-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-brand-100 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-600 dark:bg-slate-800/95 sm:bottom-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-100 p-1 text-brand-700 dark:bg-slate-700 dark:text-brand-100">
          <CheckCircle2 size={16} />
        </span>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{message}</p>
      </div>
    </div>
  );
}
