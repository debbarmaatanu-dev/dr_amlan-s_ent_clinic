import React from 'react';

export const LocationMap: React.FC = () => {
  return (
    <article className="mt-8 overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="p-8 md:p-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Find Us on Map
        </h2>
        <div className="h-96 w-full overflow-hidden rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1824.7221673939662!2d91.27093479839479!3d23.838350600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f5f9892cd077%3A0xfff222b42806a678!2sDr.%20(Major)%20Amlan&#39;s%20ENT%20clinic!5e0!3m2!1sen!2sin!4v1764597791497!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{border: 0}}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic Location"></iframe>
        </div>
      </div>
    </article>
  );
};
