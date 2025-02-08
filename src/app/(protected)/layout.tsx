import { SessionProvider } from "@/providers/session-provider";
import { ChallengeStatusProvider } from '@/contexts/challenge-status-context';

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
    </SessionProvider>
  );
}
