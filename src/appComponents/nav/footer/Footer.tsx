import type {ActualTheme} from '@/appStore/themeSlice';
import {useTheme} from '@/hooks/useTheme';
import {useNavigate} from 'react-router-dom';

import {IMAGES} from '@/constants/images';

const logo = IMAGES.CLINIC_LOGO;

const getBGColor = (actualTheme: ActualTheme) => {
  if (actualTheme === 'light') {
    return 'bg-white shadow-[0_-4px_6px_rgba(0,0,0,0.1)]';
  } else {
    return 'bg-gray-800 shadow-[0_-2px_4px_rgba(243,244,246,0.3)]';
  }
};

const getTextColor = (actualTheme: ActualTheme) => {
  if (actualTheme === 'light') {
    return 'text-gray-600';
  } else {
    return 'text-white';
  }
};

export function Footer() {
  const nanvigation = useNavigate();
  const {actualTheme} = useTheme();

  const handleNav = (url: string) => {
    setTimeout(() => {
      void nanvigation(url);
      scrollTo(0, 0);
    }, 200);
  };

  const usefulLinks = [
    {label: 'Home', path: '/home', ariaLabel: 'Navigate to Home page'},
    {
      label: 'Appointment',
      path: '/appointment',
      ariaLabel: 'Book an appointment',
    },
    {label: 'About', path: '/about', ariaLabel: 'Learn about Dr. Amlan'},
    {label: 'Contact', path: '/contact', ariaLabel: 'Contact information'},
    {label: 'FAQ', path: '/faq', ariaLabel: 'Frequently asked questions'},
    {label: 'Admin', path: '/admin-login', ariaLabel: 'Admin login portal'},
  ];

  return (
    <footer
      className={`mt-25 ${getBGColor(actualTheme)} py-8`}
      role="contentinfo">
      <div className="container mx-auto mt-3 max-w-7xl px-10 xl:px-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - Clinic Information */}
          <section aria-labelledby="clinic-info-heading" className="space-y-4">
            <header className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Dr. Amlan's ENT Clinic Logo"
                className="h-18 w-18 object-cover"
                width="72"
                height="72"
                loading="lazy"
              />
              <div>
                <h2
                  id="clinic-info-heading"
                  className="text-xl font-bold text-blue-600">
                  Dr. (Major) Amlan's ENT clinic
                </h2>
                <p className={`text-sm ${getTextColor(actualTheme)}`}>
                  MBBS, MS ENT
                </p>
                <p className={`text-sm ${getTextColor(actualTheme)}`}>
                  Ex-Army Medical Corps
                  <br />
                  Endoscopic and Microscopic ENT surgeon
                </p>
              </div>
            </header>

            <div className="mt-4 flex flex-col items-start space-y-3">
              <section aria-labelledby="contact-methods">
                <h3 id="contact-methods" className="sr-only">
                  Contact Methods
                </h3>
                <div className="flex flex-col gap-1">
                  <a
                    className="cursor-pointer text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                    href="tel:+918258839231"
                    aria-label="Call clinic at +91 8258839231">
                    <span className={`${getTextColor(actualTheme)}`}>PH:</span>{' '}
                    +91 8258839231
                  </a>
                  <a
                    className="cursor-pointer text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                    href="https://wa.me/916033521499"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact via WhatsApp at +91 6033521499">
                    <span className={` ${getTextColor(actualTheme)}`}>
                      WhatsApp:
                    </span>{' '}
                    +91 6033521499
                  </a>
                </div>
              </section>

              <address
                className={`${actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300'} not-italic`}
                aria-labelledby="clinic-address">
                <h3 id="clinic-address" className="sr-only">
                  Clinic Address
                </h3>
                <p className="mb-1">
                  <span className={`${getTextColor(actualTheme)}`}>
                    Address:
                  </span>{' '}
                  1st floor, Capital pathlab
                </p>
                <p>Bijoykumar Chowmuhani,</p>
                <p>Agartala,</p>
                <p>West Tripura,</p>
                <p>Pin - 799001</p>
              </address>

              <div>
                <a
                  href="mailto:debbarmaamlan@gmail.com"
                  className="text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                  aria-label="Send email to debbarmaamlan@gmail.com">
                  <span
                    className={`${actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                    Email:
                  </span>{' '}
                  debbarmaamlan@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Middle Column - Navigation Links */}
          <nav
            aria-labelledby="footer-nav-heading"
            className="flex flex-col items-center justify-center text-justify">
            <div className="space-y-2">
              <h2
                id="footer-nav-heading"
                className={`mb-4 text-lg font-medium ${getTextColor(actualTheme)}`}>
                Useful Links
              </h2>
              <ul className="space-y-2" role="list">
                {usefulLinks.map((link, index) => (
                  <li key={index} role="listitem">
                    <button
                      onClick={() => handleNav(link.path)}
                      aria-label={link.ariaLabel}
                      className={`block cursor-pointer ${actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300'} duration-180 ease-in-out hover:text-blue-300 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none active:scale-95`}>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Right Column - Location Map */}
          <section aria-labelledby="location-heading">
            <h2
              id="location-heading"
              className={`mb-4 text-lg font-semibold ${getTextColor(actualTheme)}`}>
              Our Location
            </h2>
            <div className="flex h-64 w-full items-center justify-center border-gray-600 bg-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1824.7221673939662!2d91.27093479839479!3d23.838350600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f5f9892cd077%3A0xfff222b42806a678!2sDr.%20(Major)%20Amlan&#39;s%20ENT%20clinic!5e0!3m2!1sen!2sin!4v1764597791497!5m2!1sen!2sin"
                width="100%"
                height="256"
                style={{border: '0.5px solid #6a7282', borderRadius: '8px'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dr. Amlan's ENT Clinic location on Google Maps"
                aria-label="Interactive map showing clinic location at Capital Pathlab, Bijoykumar Chowmuhani, Agartala"></iframe>
            </div>
          </section>
        </div>

        {/* Social Media Links */}
        <nav
          aria-labelledby="social-media-heading"
          className="mt-8 flex items-center justify-center space-x-6 text-justify">
          <h2 id="social-media-heading" className="sr-only">
            Social Media Links
          </h2>
          <a
            href="https://www.facebook.com/profile.php?id=61583047875410"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page (opens in new tab)"
            className={`${getTextColor(actualTheme)} hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none`}>
            <i
              className="fa-brands fa-facebook h-6 w-6 text-lg"
              aria-hidden="true"></i>
          </a>
        </nav>

        {/* Copyright Section */}
        <div
          className={`mt-8 flex flex-col items-center justify-between border-t ${getTextColor(actualTheme)} pt-6 text-sm text-gray-600 md:flex-row`}>
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:items-start sm:justify-start sm:text-start">
            <p>© 2025 Dr. (Major) Amlan's ENT Clinic</p>
            <p>All Rights Reserved.</p>
            <button
              onClick={() => handleNav('/privacy-policy')}
              aria-label="View Privacy Policy"
              className="font-md cursor-pointer text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none">
              Privacy Policy
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center md:mt-0">
            <div className="flex flex-row items-center">
              <span className={`text-sm ${getTextColor(actualTheme)}`}>
                Created by:&nbsp;
              </span>
              <a
                href="https://github.com/AtanuDebbarma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit creator's GitHub profile (opens in new tab)"
                className={`text-sm ${getTextColor(actualTheme)} hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none`}>
                <i className="fa-brands fa-github" aria-hidden="true"></i>
                &nbsp;
              </a>
              <a
                href="https://www.linkedin.com/in/atanu-debbarma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit creator's LinkedIn profile (opens in new tab)"
                className={`text-sm ${getTextColor(actualTheme)} hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none`}>
                <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                &nbsp;
              </a>
              <span className={`text-sm ${getTextColor(actualTheme)}`}>
                Atanu Debbarma
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
