import { SessionProvider } from "@/providers/session-provider";
import N8nChat from "@/components/N8nChat";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}
  <N8nChat />
  </SessionProvider>;
}

