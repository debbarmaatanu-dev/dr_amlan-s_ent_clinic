import {useTheme} from '@/hooks/useTheme';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ClipLoader} from 'react-spinners';

import {IMAGES} from '@/constants/images';

const landingImage = IMAGES.DOCTOR_PHOTO;

export const Landing = (): React.JSX.Element => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const {actualTheme} = useTheme();

  const handleAppointmentPress = () => {
    setTimeout(() => {
      void navigation('/appointment');
      scrollTo(0, 0);
    }, 250);
  };

  const gradient =
    actualTheme === 'light'
      ? 'from-blue-100 via-blue-200 to-green-100'
      : 'from-blue-900 via-blue-950 to-green-900';

  const textColor = actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';

  return (
    <section
      className={`flex grow items-center justify-center bg-linear-to-br ${gradient} px-4 py-6 shadow-xl md:py-12 lg:px-8`}
      aria-label="Dr. Amlan Debbarma ENT Clinic Introduction">
      <div className="h-full w-full">
        <article className="overflow-hidden">
          {/* Header Section - Split Design */}
          <header className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Box - Image */}
            <figure className="flex items-center justify-center">
              <div className="relative h-full w-full max-w-md overflow-hidden rounded-3xl shadow-md">
                {loading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100"
                    aria-label="Loading doctor image">
                    <ClipLoader size={40} color="#3B82F6" loading={loading} />
                  </div>
                )}
                <img
                  src={landingImage}
                  alt="Dr. (Major) Amlan Debbarma, MS ENT - Leading ENT specialist and surgeon in Agartala, Tripura"
                  className="h-full w-full object-cover"
                  onLoad={() => setLoading(false)}
                  style={{display: loading ? 'none' : 'block'}}
                  loading="eager"
                  width="400"
                  height="600"
                />
              </div>
            </figure>

            {/* Right Box - Text Content */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <h1 className="mb-3 text-2xl font-bold text-blue-600 md:text-3xl lg:text-4xl">
                Dr. (Major) Amlan's ENT Clinic
              </h1>
              <p
                className={`mb-6 text-base ${textColor} md:text-lg`}
                itemScope
                itemType="https://schema.org/Person">
                <span itemProp="honorificPrefix">Dr. (Major)</span>{' '}
                <span itemProp="name">Amlan Debbarma</span>
                <br />
                <span itemProp="hasCredential">MBBS, MS ENT</span>
                <br />
                <span itemProp="alumniOf">Ex-Army Medical Corps</span>
                <br />
                <span itemProp="jobTitle">
                  Endoscopic and Microscopic ENT Surgeon
                </span>
                <br />
                at{' '}
                <span itemProp="worksFor">
                  Tripura Medical College, Agartala
                </span>
              </p>
              <div className="flex flex-col gap-4">
                <button
                  className="w-fit cursor-pointer rounded-md bg-blue-600 px-6 py-3 text-white shadow-md transition-transform duration-180 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-95"
                  onClick={handleAppointmentPress}
                  aria-label="Book an appointment with Dr. Amlan Debbarma">
                  <span className="text-base font-medium md:text-lg">
                    <i
                      className="fa-solid fa-calendar-plus mr-2"
                      aria-hidden="true"></i>
                    Make an Appointment
                  </span>
                </button>
              </div>
            </div>
          </header>
        </article>
      </div>
    </section>
  );
};
