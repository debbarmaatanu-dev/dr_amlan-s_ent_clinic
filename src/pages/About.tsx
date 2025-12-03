import React, {useState} from 'react';
import {ClipLoader} from 'react-spinners';
import landingImage from '@/assets/2.png';

export const About = (): React.JSX.Element => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-7xl">
          <header className="flex flex-col items-center justify-center py-5">
            <h1 className="relative mb-6 inline-block text-4xl font-bold tracking-wide">
              About Me
              <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
            </h1>
          </header>
          <article className="overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Header Section - Split Design */}
            <div className="grid grid-cols-1 bg-linear-to-br from-blue-100 via-blue-100 to-green-100 md:grid-cols-2">
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
                    alt="Medical Team"
                    className="h-full w-full object-cover"
                    onLoad={() => setLoading(false)}
                    style={{display: loading ? 'none' : 'block'}}
                  />
                </div>
              </div>

              {/* Right Box - Text Content */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <h1 className="mb-3 cursor-text text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl">
                  Dr. (Major) Amlan Debbarma, MS (ENT)
                </h1>
                <p className="text-md mb-3 cursor-text font-semibold text-blue-600 md:text-lg">
                  MBBS, MS ENT, Ex-Army Medical Corps, Endoscopic and
                  Microscopic ENT surgeon. Regn no: 00811 (TSMC)
                </p>
                <p className="mb-6 cursor-text text-base text-gray-600 md:text-lg">
                  Dr. Debbarma is a board-certified otolaryngologist
                  specializing in sinus disorders, endoscopic nasal surgery,
                  adenotonsillectomy, Head & neck surgeries, Endoscopic and
                  microscopic ear surgeries, allergy treatment and sleep apnea
                  treatment. He has a wide range of experience and served in the
                  Army Medical Corps and performed combat duties and also
                  treated troops to keep them fighting fit in counter terrorism
                  operations in J&K as well as in the Siachen Glacier which is
                  known as the highest battlefield in the world. Presently
                  working as an ENT Surgeon at Tripura Medical College and he is
                  dedicated to providing patient-centered, evidence-based care
                  for both adults and children.
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
