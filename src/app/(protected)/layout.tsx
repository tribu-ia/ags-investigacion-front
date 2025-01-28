import { SessionProvider } from "@/providers/session-provider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
