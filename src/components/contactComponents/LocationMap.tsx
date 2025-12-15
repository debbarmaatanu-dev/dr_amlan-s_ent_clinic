import React from 'react';
import {useTheme} from '@/hooks/useTheme';

export const LocationMap: React.FC = () => {
  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';

  return (
    <section
      className={`mt-8 overflow-hidden rounded-2xl ${bgColor} shadow-xl`}
      aria-labelledby="location-map-heading">
      <div className="p-8 md:p-10">
        <header>
          <h2
            id="location-map-heading"
            className={`mb-6 text-2xl font-bold ${textColor}`}>
            Find Our Clinic Location
          </h2>
          <address className={`mb-4 text-sm ${textColor} not-italic`}>
            <strong>Dr. (Major) Amlan's ENT Clinic</strong>
            <br />
            1st Floor, Capital Pathlab
            <br />
            Bijoykumar Chowmuhani
            <br />
            Agartala, West Tripura - 799001
            <br />
            <a
              href="tel:+918258839231"
              className="text-blue-600 hover:text-blue-800">
              Phone: +91 8258839231
            </a>
          </address>
        </header>

        <div
          className="h-96 w-full overflow-hidden rounded-lg"
          role="application"
          aria-label="Interactive map showing clinic location">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1824.7221673939662!2d91.27093479839479!3d23.838350600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f5f9892cd077%3A0xfff222b42806a678!2sDr.%20(Major)%20Amlan&#39;s%20ENT%20clinic!5e0!3m2!1sen!2sin!4v1764597791497!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{border: 0}}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Interactive map showing Dr. (Major) Amlan's ENT Clinic location at Capital Pathlab, Bijoykumar Chowmuhani, Agartala, Tripura"
            aria-describedby="map-description"></iframe>
        </div>

        <p id="map-description" className={`mt-4 text-sm ${textColor}`}>
          Interactive Google Maps showing the exact location of our ENT clinic
          in Agartala, Tripura. The clinic is located on the 1st floor of
          Capital Pathlab building at Bijoykumar Chowmuhani.
        </p>
      </div>
    </section>
  );
};
