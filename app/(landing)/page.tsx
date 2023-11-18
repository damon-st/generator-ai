import { LandingContent } from "./_components/landing-conent";
import { LandingHero } from "./_components/landing-hero";
import { LandingNavbar } from "./_components/landing-navbar";

export default function LadingPage() {
  return (
    <div className=" h-full">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  );
}
