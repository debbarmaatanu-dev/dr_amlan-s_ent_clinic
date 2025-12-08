import React, {useState} from 'react';

export const ContactForm: React.FC = () => {
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

  return (
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
  );
};
