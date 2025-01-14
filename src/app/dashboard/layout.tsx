"use client";

import { AuthProvider } from "@/providers/auth-provider";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
} 