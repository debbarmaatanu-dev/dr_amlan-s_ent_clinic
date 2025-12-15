import React, {useState} from 'react';
import {useTheme} from '@/hooks/useTheme';

export const ContactForm: React.FC = () => {
  const {actualTheme} = useTheme();
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

    // Create mailto URL with pre-filled information
    const subject = encodeURIComponent(`Contact Form - ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}`,
    );

    const mailtoUrl = `mailto:debbarmaamlan@gmail.com?subject=${subject}&body=${body}`;

    // Open default email client
    window.location.href = mailtoUrl;

    // Reset form after opening email client
    setFormData({name: '', email: '', phone: '', message: ''});
  };

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const inputBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorder =
    actualTheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputText = actualTheme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <article className={`overflow-hidden rounded-2xl ${bgColor} shadow-xl`}>
      <div className="p-8 md:p-10">
        <header>
          <h2 className={`mb-6 text-2xl font-bold ${textColor}`}>
            Send us a Message
          </h2>
          <p className={`mb-4 text-sm ${textSecondary}`}>
            Get in touch with Dr. Amlan Debbarma's ENT Clinic for inquiries or
            appointment assistance.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          role="form"
          aria-labelledby="contact-form-heading"
          noValidate>
          <h3 id="contact-form-heading" className="sr-only">
            Contact Information Form
          </h3>

          <fieldset className="space-y-6">
            <legend className="sr-only">Your contact details</legend>

            <div>
              <label
                htmlFor="contact-name"
                className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                Full Name{' '}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="name"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                Email Address{' '}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="email"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                Phone Number{' '}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="tel"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                Message{' '}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
                rows={5}
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                placeholder="Enter your message or inquiry"
                aria-describedby="message-help"></textarea>
              <p id="message-help" className={`mt-1 text-xs ${textSecondary}`}>
                Please include any specific questions about ENT services or
                appointment requests.
              </p>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 px-6 py-3 text-white shadow-md transition-all duration-180 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none active:scale-95"
            aria-describedby="submit-help">
            <span className="text-base font-medium md:text-lg">
              <i className="fa-solid fa-envelope mr-2" aria-hidden="true"></i>
              Send Message via Email
            </span>
          </button>

          <p
            id="submit-help"
            className={`text-center text-xs ${textSecondary}`}>
            This will open your default email client with the message
            pre-filled.
          </p>
        </form>
      </div>
    </article>
  );
};
