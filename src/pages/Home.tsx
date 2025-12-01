import {FeaturesSection} from '@/components/homeComponents/FeaturesSection';
import {Landing} from '@/components/homeComponents/Landing';
import {ServicesSection} from '@/components/homeComponents/ServicesSection';
import {WelcomeSection} from '@/components/homeComponents/WelcomeSection';
import React from 'react';

export const Home = (): React.JSX.Element => {
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
      </main>
    </div>
  );
};
