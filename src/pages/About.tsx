import React, {useState} from 'react';
import {ClipLoader} from 'react-spinners';
import {useTheme} from '@/hooks/useTheme';
import {useSEO} from '@/hooks/useSEO';

const landingImage =
  'https://res.cloudinary.com/mobeet/image/upload/DoctorPhoto_iasqya.jpg';

export const About = (): React.JSX.Element => {
  const [loading, setLoading] = useState(true);
  const {actualTheme} = useTheme();

  // SEO optimization for about page
  useSEO();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  const gradient =
    actualTheme === 'light'
      ? 'from-blue-100 via-blue-100 to-green-100'
      : 'from-blue-900 via-blue-950 to-green-900';

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-7xl">
          <header className="flex flex-col items-center justify-center py-5">
            <h1
              className={`relative mb-6 inline-block text-4xl font-bold tracking-wide ${textColor}`}>
              About Doctor
              <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
            </h1>
          </header>
          <article
            className={`overflow-hidden rounded-2xl ${bgColor} shadow-xl`}>
            {/* Header Section - Split Design */}
            <div
              className={`grid grid-cols-1 bg-linear-to-br ${gradient} md:grid-cols-2`}>
              {/* Left Box - Image */}
              <div className="flex items-center justify-center p-8 md:p-12 lg:p-16">
                <div className="relative h-full w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <ClipLoader size={40} color="#3B82F6" loading={loading} />
                    </div>
                  )}
                  <img
                    src={landingImage}
                    alt="Dr. Amlan Debbarma"
                    className="h-full w-full object-cover"
                    onLoad={() => setLoading(false)}
                    style={{display: loading ? 'none' : 'block'}}
                  />
                </div>
              </div>

              {/* Right Box - Text Content */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <h1
                  className={`mb-3 cursor-text text-2xl font-bold ${textColor} md:text-3xl lg:text-4xl`}>
                  Dr. (Major) Amlan Debbarma, MS (ENT)
                </h1>
                <p className="text-md mb-3 cursor-text font-semibold text-blue-600 md:text-lg">
                  MBBS, MS ENT, Ex-Army Medical Corps, Endoscopic and
                  Microscopic ENT surgeon. Regn no: 00811 (TSMC)
                </p>
                <p
                  className={`mb-6 cursor-text text-base ${textSecondary} md:text-lg`}>
                  Dr. Debbarma is an otolaryngologist specializing in sinus
                  disorders, endoscopic nasal surgery, adenotonsillectomy, head
                  and neck surgeries, endoscopic and microscopic ear surgeries,
                  vertigo, allergy treatment, and sleep apnea management. With a
                  wide range of clinical experience, service was rendered in the
                  Army Medical Corps, including combat duties during
                  counter-terrorism operations in Jammu and Kashmir, along with
                  medical care provided to troops to keep them fighting fit in
                  the Siachen Glacier, the highest battlefield in the world.
                  Currently working as an ENT Surgeon at Tripura Medical
                  College, dedication remains focused on providing
                  patient-centered, evidence-based care for both adults and
                  children.
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
