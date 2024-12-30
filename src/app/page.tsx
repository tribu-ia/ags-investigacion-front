import { Navigation } from "@/components/ui/custom/landing/navigation";
import { LandingHero } from "@/components/ui/custom/landing/hero";
import { Features } from "@/components/ui/custom/landing/features";
import { GlobalNetwork } from "@/components/ui/custom/landing/global-network";
import { CallToAction } from "@/components/ui/custom/landing/call-to-action";
import { HowItWorks } from "@/components/ui/custom/landing/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <LandingHero />
      <Features />
      <HowItWorks />
      <GlobalNetwork />
      <CallToAction />
    </div>
  )
}

