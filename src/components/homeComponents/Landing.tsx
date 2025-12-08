import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ClipLoader} from 'react-spinners';

const landingImage =
  'https://res.cloudinary.com/mobeet/image/upload/v1764923599/IMG_20251203_101518842_HDR_PORTRAIT_2_1_hyhvhd.jpg';

export const Landing = (): React.JSX.Element => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleAppointmentPress = () => {
    setTimeout(() => {
      navigation('/appointment');
      scrollTo(0, 0);
    }, 250);
  };

  return (
    <section
      className="flex grow items-center justify-center bg-linear-to-br from-blue-100 via-blue-100 to-green-100 px-4 py-6 shadow-xl md:py-12 lg:px-8"
      role="main">
      <div className="h-full w-full">
        <article className="overflow-hidden">
          {/* Header Section - Split Design */}
          <header className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Box - Image */}
            <div className="flex items-center justify-center">
              <div className="relative h-full w-full max-w-md overflow-hidden rounded-3xl shadow-md">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <ClipLoader size={40} color="#3B82F6" loading={loading} />
                  </div>
                )}
                <img
                  src={landingImage}
                  alt="Dr (Major) Amlan Debbarma"
                  className="h-full w-full object-cover"
                  onLoad={() => setLoading(false)}
                  style={{display: loading ? 'none' : 'block'}}
                />
              </div>
            </div>

            {/* Right Box - Text Content */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <h1 className="mb-3 cursor-text text-2xl font-bold text-blue-600 md:text-3xl lg:text-4xl">
                Dr. (Major) Amlan's ENT clinic
              </h1>
              <p className="mb-15 cursor-text text-base text-gray-600 md:text-lg">
                MBBS, MS ENT,
                <br />
                Ex-Army Medical Corps,
                <br />
                Endoscopic and Microscopic ENT surgeon
                <br />
                at Tripura Medical College, Agartala
              </p>
              <button
                className="w-70 cursor-pointer rounded-md bg-blue-600 px-6 py-3 text-white shadow-md transition-transform duration-180 active:scale-95"
                onClick={handleAppointmentPress}>
                <span className="text-md text-center font-medium md:text-base">
                  Make an Appointment
                </span>
              </button>
            </div>
          </header>
        </article>
      </div>
    </section>
  );
};
