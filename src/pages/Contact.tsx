import React from 'react';
import {ContactHeader} from '@/components/contactComponents/ContactHeader';
import {ContactInfo} from '@/components/contactComponents/ContactInfo';
import {ContactForm} from '@/components/contactComponents/ContactForm';
import {LocationMap} from '@/components/contactComponents/LocationMap';

export const Contact = (): React.JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-7xl">
          <ContactHeader />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ContactInfo />
            <ContactForm />
          </div>

          <LocationMap />
        </section>
      </main>
    </div>
  );
};
