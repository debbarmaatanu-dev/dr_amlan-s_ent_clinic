import React from 'react';
import {useTheme} from '@/hooks/useTheme';

interface ContactItemProps {
  icon: string;
  iconBg: string;
  title: string;
  children: React.ReactNode;
  textColor: string;
}

const ContactItem: React.FC<ContactItemProps> = ({
  icon,
  iconBg,
  title,
  children,
  textColor,
}) => (
  <div className="mb-6 flex items-start space-x-4">
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
      <i className={`${icon} text-xl text-white`} aria-hidden="true"></i>
    </div>
    <div>
      <h3 className={`mb-2 font-semibold ${textColor}`}>{title}</h3>
      {children}
    </div>
  </div>
);

export const ContactInfo: React.FC = () => {
  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const gradient =
    actualTheme === 'light'
      ? 'from-blue-100 via-blue-100 to-green-100'
      : 'from-blue-900 via-blue-950 to-green-900';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';

  return (
    <article className={`overflow-hidden rounded-2xl ${bgColor} shadow-xl`}>
      <div className={`h-full w-full bg-linear-to-br ${gradient} p-8 md:p-10`}>
        <h2 className={`mb-6 text-2xl font-bold ${textColor}`}>
          Contact Information
        </h2>

        {/* Phone */}
        <ContactItem
          icon="fa-solid fa-phone"
          iconBg="bg-blue-600"
          title="Phone"
          textColor={textColor}>
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
          title="WhatsApp"
          textColor={textColor}>
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
          title="Email"
          textColor={textColor}>
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
          title="Address"
          textColor={textColor}>
          <p className={textSecondary}>
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
          title="Clinic Hours"
          textColor={textColor}>
          <p className={textSecondary}>
            Monday - Saturday: 9:00 AM - 6:00 PM
            <br />
            Sunday: Closed
          </p>
        </ContactItem>
      </div>
    </article>
  );
};
