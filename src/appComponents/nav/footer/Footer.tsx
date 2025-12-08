import {useNavigate} from 'react-router-dom';

const logo =
  'https://res.cloudinary.com/mobeet/image/upload/v1765202950/DrAmlanLogo_2_rzgp2v.png';

export function Footer() {
  const nanvigation = useNavigate();

  const handleNav = (url: string) => {
    setTimeout(() => {
      nanvigation(url);
      scrollTo(0, 0);
    }, 200);
  };
  const usefulLinks = [
    {label: 'Home', path: '/home'},
    {label: 'Appointment', path: '/appointment'},
    {label: 'About', path: '/about'},
    {label: 'Contact', path: '/contact'},
    {label: 'Admin', path: '/admin-login'},
  ];

  return (
    <footer
      className="mt-25 bg-white py-8 text-white"
      style={{boxShadow: '0 -4px 6px rgba(0,0,0,0.1)'}}
      role="contentinfo">
      <div className="container mx-auto mt-3 max-w-7xl px-10 xl:px-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - College Info */}
          <section aria-label="College Information" className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Dr-Amlan-s-ENT-Clinic-Logo-footer"
                className="h-18 w-18 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-blue-600">
                  Dr. (Major) Amlan's ENT clinic
                </h2>
                <p className="text-sm text-gray-600">MBBS, MS ENT</p>
                <p className="text-sm text-gray-600">
                  Ex-Army Medical Corps
                  <br />
                  Endoscopic and Microscopic ENT surgeon
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-start space-y-3">
              <div>
                <div className="flex flex-col gap-1">
                  <a
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    href="tel:+918258839231">
                    <span className="text-gray-600">PH:</span> +91 8258839231
                  </a>
                  <a
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    href="https://wa.me/916033521499">
                    <span className="text-gray-600">WhatsApp:</span> +91
                    6033521499
                  </a>
                </div>
              </div>

              <div className="text-gray-500">
                <p className="mb-1">
                  <span className="text-gray-600">Address:</span> 1st floor,
                  Capital pathlab
                </p>
                <p>Bijoykumar Chowmuhani,</p>
                <p>Agartala,</p>
                <p>West Tripura,</p>
                <p>Pin - 799001</p>
              </div>

              <div>
                <a
                  href="mailto:debbarmaamlan@gmail.com"
                  className="text-blue-600 hover:text-blue-800">
                  <span className="text-gray-600">Email:</span>{' '}
                  debbarmaamlan@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Middle Column - Useful Links */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-col items-center justify-center text-justify">
            <div className="space-y-2">
              <h2 className="mb-4 text-lg font-medium text-gray-600">
                Useful Links
              </h2>
              {usefulLinks.map((link, index) => (
                <div
                  key={index}
                  onClick={() => handleNav(link.path)}
                  className="transform-transform block cursor-pointer text-gray-500 duration-180 ease-in-out hover:text-blue-300 active:scale-95">
                  {link.label}
                </div>
              ))}
            </div>
          </nav>

          {/* Right Column - Maps */}
          <section aria-label="Location">
            <h2 className="mb-4 text-lg font-semibold text-gray-600">
              Our Location
            </h2>
            <div className="flex h-64 w-full items-center justify-center border-gray-600 bg-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1824.7221673939662!2d91.27093479839479!3d23.838350600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f5f9892cd077%3A0xfff222b42806a678!2sDr.%20(Major)%20Amlan&#39;s%20ENT%20clinic!5e0!3m2!1sen!2sin!4v1764597791497!5m2!1sen!2sin"
                width={'100%'}
                height={'256px'}
                style={{border: '0.5px solid #6a7282', borderRadius: '8px'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </section>
        </div>

        {/* Social Media Links */}
        <nav
          aria-label="Social media links"
          className="mt-8 flex items-center justify-center space-x-6 text-justify">
          <a
            href="https://www.facebook.com/profile.php?id=61583047875410"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page"
            className="text-gray-600 hover:text-blue-600">
            <i
              className="fa-brands fa-facebook h-6 w-6 text-lg"
              aria-hidden="true"></i>
          </a>
        </nav>

        {/* Copyright Section */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-700 pt-6 text-sm text-gray-600 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:items-start sm:justify-start sm:text-start">
            <p>© 2025 Dr. (Major) Amlan's ENT Clinic </p>
            <p>All Rights Reserved.</p>
            <button
              role="link"
              aria-label="Link to Privacy Policy"
              onClick={() => handleNav('/privacy-policy')}
              className="font-md cursor-pointer text-blue-600 underline">
              Our Privacy Policy
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center md:mt-0">
            <div className="flex flex-row">
              <span className="text-sm text-gray-600">Created by:&nbsp;</span>
              <a
                href="https://github.com/AtanuDebbarma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Created by - Visit GitHub profile"
                className="text-sm text-gray-600 hover:text-blue-600">
                <i className="fa-brands fa-github" aria-hidden="true"></i>
                &nbsp;
              </a>
              <a
                href="https://www.linkedin.com/in/atanu-debbarma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Created by - Visit GitHub profile"
                className="text-600 text-sm hover:text-blue-600">
                <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                &nbsp;
              </a>
              <span className="text-sm text-gray-600">Atanu Debbarma</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
