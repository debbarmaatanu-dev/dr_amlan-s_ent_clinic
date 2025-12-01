import React, {useState} from 'react';

export const Contact = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-7xl">
          <header className="flex flex-col items-center justify-center pt-5">
            <h1 className="relative mb-6 inline-block text-4xl font-bold tracking-wide">
              Contact Us
              <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
            </h1>
            <p className="mb-8 text-center text-lg text-gray-600">
              Get in touch with us for appointments or inquiries
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Information */}
            <article className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="h-full w-full bg-linear-to-br from-blue-100 via-blue-100 to-green-100 p-8 md:p-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                  Contact Information
                </h2>

                {/* Phone */}
                <div className="mb-6 flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <i
                      className="fa-solid fa-phone text-xl text-white"
                      aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-800">Phone</h3>
                    <a
                      href="tel:+918258839231"
                      className="block text-blue-600 hover:text-blue-800">
                      +91 8258839231
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="mb-6 flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                    <i
                      className="fa-brands fa-whatsapp text-xl text-white"
                      aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-800">
                      WhatsApp
                    </h3>
                    <a
                      href="https://wa.me/916033521499"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800">
                      +91 6033521499
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-6 flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <i
                      className="fa-solid fa-envelope text-xl text-white"
                      aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-800">Email</h3>
                    <a
                      href="mailto:debbarmaamlan@gmail.com"
                      className="block text-blue-600 hover:text-blue-800">
                      debbarmaamlan@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6 flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <i
                      className="fa-solid fa-location-dot text-xl text-white"
                      aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      1st floor, Capital pathlab
                      <br />
                      Bijoykumar Chowmuhani,
                      <br />
                      Agartala, West Tripura
                      <br />
                      Pin - 799001
                    </p>
                  </div>
                </div>

                {/* Clinic Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <i
                      className="fa-solid fa-clock text-xl text-white"
                      aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Clinic Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 6:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Contact Form */}
            <article className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="p-8 md:p-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Enter your message"></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-full bg-blue-600 px-6 py-3 text-white shadow-md transition-transform duration-180 hover:bg-blue-700 active:scale-95">
                    <span className="text-md text-center font-medium md:text-base">
                      Send Message
                    </span>
                  </button>
                </form>
              </div>
            </article>
          </div>

          {/* Map Section */}
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
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
