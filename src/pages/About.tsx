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
                  Dr. Major Amlan Debbarma
                </h1>
                <p className="text-md mb-3 cursor-text font-semibold text-blue-600 md:text-lg">
                  MBBS, MS ENT Ex-Army Medical Corps Endoscopic and Microscopic
                  ENT surgeon
                </p>
                <p className="mb-6 cursor-text text-base text-gray-600 md:text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  feugiat magna non massa posuere, vitae tincidunt neque
                  malesuada. Curabitur luctus hendrerit sapien, sit amet
                  molestie velit aliquam at. Proin vitae ante a lorem volutpat
                  consequat. Pellentesque habitant morbi tristique senectus et
                  netus et malesuada fames ac turpis egestas. Integer gravida
                  dignissim elementum. Donec non pellentesque arcu, non
                  fermentum lectus. Vestibulum ante ipsum primis in faucibus
                  orci luctus et ultrices posuere cubilia curae; Nulla facilisi.
                  Mauris non pharetra ligula. Sed euismod lorem nec turpis
                  interdum, quis ultrices tortor condimentum. Aenean nec egestas
                  eros. Suspendisse vel elementum metus. Phasellus euismod,
                  libero non dictum varius, nisl dolor blandit risus, at feugiat
                  orci tellus sed risus. Morbi pretium, lacus vel cursus
                  volutpat, velit nibh cursus arcu, ut elementum quam augue vel
                  ex.
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
