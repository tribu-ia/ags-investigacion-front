import { SessionProvider } from "@/providers/session-provider";
import N8nChat from "@/components/N8nChat";
import { ChallengeStatusProvider } from "@/contexts/challenge-status-context";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;

}) {
  return (
    <SessionProvider>
      <ChallengeStatusProvider>
        {children}
      </ChallengeStatusProvider>
      <N8nChat />
    </SessionProvider>
  );


}

