import React from 'react';

interface ContactItemProps {
  icon: string;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}

const ContactItem: React.FC<ContactItemProps> = ({
  icon,
  iconBg,
  title,
  children,
}) => (
  <div className="mb-6 flex items-start space-x-4">
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
      <i className={`${icon} text-xl text-white`} aria-hidden="true"></i>
    </div>
    <div>
      <h3 className="mb-2 font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  </div>
);

export const ContactInfo: React.FC = () => {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="h-full w-full bg-linear-to-br from-blue-100 via-blue-100 to-green-100 p-8 md:p-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Contact Information
        </h2>

        {/* Phone */}
        <ContactItem
          icon="fa-solid fa-phone"
          iconBg="bg-blue-600"
          title="Phone">
          <a
            href="tel:+918258839231"
            className="block text-blue-600 hover:text-blue-800">
            +91 8258839231
          </a>
        </ContactItem>

        {/* WhatsApp */}
        <ContactItem
          icon="fa-brands fa-whatsapp"
          iconBg="bg-green-600"
          title="WhatsApp">
          <a
            href="https://wa.me/916033521499"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:text-blue-800">
            +91 6033521499
          </a>
        </ContactItem>

        {/* Email */}
        <ContactItem
          icon="fa-solid fa-envelope"
          iconBg="bg-blue-600"
          title="Email">
          <a
            href="mailto:debbarmaamlan@gmail.com"
            className="block text-blue-600 hover:text-blue-800">
            debbarmaamlan@gmail.com
          </a>
        </ContactItem>

        {/* Address */}
        <ContactItem
          icon="fa-solid fa-location-dot"
          iconBg="bg-blue-600"
          title="Address">
          <p className="text-gray-600">
            1st floor, Capital pathlab
            <br />
            Bijoykumar Chowmuhani,
            <br />
            Agartala, West Tripura
            <br />
            Pin - 799001
          </p>
        </ContactItem>

        {/* Clinic Hours */}
        <ContactItem
          icon="fa-solid fa-clock"
          iconBg="bg-blue-600"
          title="Clinic Hours">
          <p className="text-gray-600">
            Monday - Saturday: 9:00 AM - 6:00 PM
            <br />
            Sunday: Closed
          </p>
        </ContactItem>
      </div>
    </article>
  );
};
