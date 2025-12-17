import {FeaturesSection} from '@/components/homeComponents/FeaturesSection';
import {FAQSection} from '@/components/homeComponents/FAQSection';
import {Landing} from '@/components/homeComponents/Landing';
import {ServicesSection} from '@/components/homeComponents/ServicesSection';
import {WelcomeSection} from '@/components/homeComponents/WelcomeSection';
import {useSEO} from '@/hooks/useSEO';
import React from 'react';

export const Home = (): React.JSX.Element => {
  // SEO optimization for homepage
  useSEO();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Landing Section */}
      <Landing />

      <main>
        {/* Services Section */}
        <ServicesSection />
        {/* Welcome Section */}
        <WelcomeSection />
        {/* Features Section */}
        <FeaturesSection />
        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
};
