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
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
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
        <h2 className={`mb-6 text-2xl font-bold ${textColor}`}>
          Send us a Message
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className={`mb-2 block text-sm font-medium ${textSecondary}`}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`mb-2 block text-sm font-medium ${textSecondary}`}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className={`mb-2 block text-sm font-medium ${textSecondary}`}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className={`mb-2 block text-sm font-medium ${textSecondary}`}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
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
  );
};
