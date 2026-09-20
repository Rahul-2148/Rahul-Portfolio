import { Hero } from '@/components/sections/Hero';
import { ArchitectureVisualizer } from '@/components/sections/ArchitectureVisualizer';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { TechEcosystem } from '@/components/sections/TechEcosystem';
import { AiAssistant } from '@/components/sections/AiAssistant';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <ArchitectureVisualizer />
      <SelectedWork />
      <TechEcosystem />
      <AiAssistant />
      <ContactCTA />
    </div>
  );
}
