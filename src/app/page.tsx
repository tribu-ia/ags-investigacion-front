import { Navigation } from "@/components/ui/custom/landing/navigation";
import { LandingHero } from "@/components/ui/custom/landing/hero";
import { Features } from "@/components/ui/custom/landing/features";
import { JoinForms } from "@/components/ui/custom/landing/join-forms";
import { CallToAction } from "@/components/ui/custom/landing/call-to-action";
import { HowItWorks } from "@/components/ui/custom/landing/how-it-works";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-black overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <Navigation />
      <div className="relative">
        <LandingHero />
        <Features />
        <HowItWorks />
        {/*<JoinForms />**/}
        <CallToAction />
      </div>
    </main>
  )
}

