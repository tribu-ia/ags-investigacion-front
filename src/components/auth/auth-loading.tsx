"use client";

import Loader from "@/components/ui/custom/shared/loader";

export function AuthLoading() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        <Loader />
        <span className="text-muted-foreground text-sm">
          Por favor espera un momento...
        </span>
      </div>
    </div>
  );
}