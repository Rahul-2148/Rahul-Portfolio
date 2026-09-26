import { Hero } from '@/components/sections/Hero';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ArchitectureVisualizer } from '@/components/sections/ArchitectureVisualizer';
import { TechEcosystem } from '@/components/sections/TechEcosystem';
import { EducationAchievements } from '@/components/sections/EducationAchievements';
import { AiAssistant } from '@/components/sections/AiAssistant';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      <ScrollReveal delay={0.05}>
        <SelectedWork isHomePage={true} />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <ArchitectureVisualizer />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <TechEcosystem />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <EducationAchievements />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <AiAssistant />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <ContactCTA />
      </ScrollReveal>
    </div>
  );
}
