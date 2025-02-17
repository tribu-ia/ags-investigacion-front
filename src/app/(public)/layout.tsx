import { FooterLanding } from "./_components/footer";
import { HeaderLanding } from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-svh flex-col bg-background"
      data-wrapper=""
    >
      <div className="border-grid flex flex-1 flex-col">
        <HeaderLanding />
        <main className="flex flex-1 flex-col">{children}</main>
        <FooterLanding />
      </div>
    </div>
  );
}
