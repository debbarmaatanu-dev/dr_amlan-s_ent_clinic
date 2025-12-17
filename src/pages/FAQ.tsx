import React, {useState} from 'react';
import {useTheme} from '@/hooks/useTheme';
import {useSEO} from '@/hooks/useSEO';

import {IMAGES} from '@/constants/images';

const logo = IMAGES.CLINIC_LOGO;

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: string;
}

export const FAQ = (): React.JSX.Element => {
  const {actualTheme} = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSEO();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  const borderColor =
    actualTheme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const hoverBg =
    actualTheme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700';

  const faqData: FAQItem[] = [
    {
      question: 'What ENT conditions do you treat?',
      answer: (
        <div>
          <p className="mb-2">We provide comprehensive ENT care including:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Ear infections, hearing loss, tinnitus, and vertigo</li>
            <li>Nasal congestion, sinusitis, and allergies</li>
            <li>Throat infections, tonsillitis, and voice disorders</li>
            <li>Endoscopic sinus surgery and microscopic ear procedures</li>
            <li>Allergy testing and treatment</li>
          </ul>
        </div>
      ),
      category: 'Services',
    },
    {
      question: 'What are the consultation fees and payment options?',
      answer: (
        <div>
          <p className="mb-2">
            <strong>Consultation Fee:</strong> ₹400 (Fixed)
          </p>
          <p className="mb-2">
            <strong>Payment Methods:</strong> Online payment via PhonePe (UPI,
            Credit/Debit Cards, Net Banking)
          </p>
          <p className="mb-2">
            <strong>Special Exemptions:</strong> Armed Forces personnel (Army,
            Navy, Air Force) and their dependents are exempted from fees. Valid
            Service/ESM/Dependent ID required. Available only offline at clinic.
          </p>
          <p>
            <strong>Follow-ups:</strong> First follow-up within 2 weeks is free
            (offline only at clinic).
          </p>
        </div>
      ),
      category: 'Fees',
    },
    {
      question: 'What are the clinic timings?',
      answer: (
        <div>
          <p className="mb-2">
            <strong>Clinic Hours:</strong> 6:00 PM - 8:30 PM
          </p>
          <p className="mb-2">
            <strong>Days:</strong> Monday to Saturday
          </p>
          <p>
            <strong>Closed:</strong> Sundays
          </p>
        </div>
      ),
      category: 'Timings',
    },
    {
      question: 'How do I book an appointment?',
      answer: (
        <div>
          <p className="mb-2">
            <strong>Online Booking:</strong> Visit our Appointment page and fill
            the booking form. 10 online slots available per day.
          </p>
          <p className="mb-2">
            <strong>Offline Booking:</strong> Walk-in at clinic during
            consultation hours. 10 additional offline slots available.
          </p>
          <p className="mb-2">
            <strong>Contact:</strong> Call +91 8258839231 or WhatsApp +91
            6033521499 for assistance.
          </p>
          <p className="text-sm italic">
            Note: Armed Forces exemptions and follow-ups are only available
            offline at the clinic.
          </p>
        </div>
      ),
      category: 'Booking',
    },
    {
      question: 'What payment methods are accepted?',
      answer: (
        <div>
          <p className="mb-2">
            We accept secure online payments through PhonePe payment gateway:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
            <li>Credit Cards (Visa, Mastercard, Amex, RuPay)</li>
            <li>Debit Cards (All major banks)</li>
            <li>Net Banking</li>
          </ul>
          <p className="mt-2 text-sm">
            All payments are processed securely through PhonePe, an
            RBI-authorized payment gateway with PCI DSS compliance. We do not
            store any card or bank details.
          </p>
        </div>
      ),
      category: 'Payment',
    },
    {
      question: 'How long does a consultation typically take?',
      answer: (
        <div>
          <p className="mb-2">
            A typical consultation takes approximately{' '}
            <strong>15-20 minutes</strong>, depending on the complexity of your
            condition.
          </p>
          <p className="mb-2">This includes:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Medical history review</li>
            <li>Physical examination</li>
            <li>Diagnosis and treatment plan discussion</li>
            <li>Prescription and follow-up instructions</li>
          </ul>
          <p className="mt-2">
            For procedures requiring endoscopy or detailed examination,
            additional time may be needed.
          </p>
        </div>
      ),
      category: 'Consultation',
    },
    {
      question: 'Do you treat children?',
      answer: (
        <div>
          <p className="mb-2">
            Yes, we provide ENT care for patients of all ages, including
            children.
          </p>
          <p className="mb-2">Common pediatric ENT conditions we treat:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Ear infections and hearing problems</li>
            <li>Tonsillitis and adenoid issues</li>
            <li>Nasal congestion and allergies</li>
            <li>Throat infections</li>
          </ul>
          <p className="mt-2">
            Parents/guardians must accompany children during consultations.
          </p>
        </div>
      ),
      category: 'Services',
    },
    {
      question: 'Do I need a referral from another doctor?',
      answer: (
        <div>
          <p className="mb-2">
            <strong>No referral is required.</strong> You can directly book an
            appointment with us for any ENT-related concerns.
          </p>
          <p className="mb-2">
            However, if you have been referred by another doctor, please bring:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Referral letter or prescription</li>
            <li>Previous medical reports and test results</li>
            <li>List of current medications</li>
          </ul>
          <p className="mt-2">
            This helps us provide more comprehensive and informed care.
          </p>
        </div>
      ),
      category: 'General',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-5xl">
          <header className="flex flex-col items-center justify-center py-5">
            <div
              className={`mb-6 flex shrink-0 items-center justify-center rounded-full bg-white p-3 shadow-lg`}>
              <img
                src={logo}
                alt="Dr Amlan's ENT Clinic Logo"
                className="h-32 w-32 rounded-full object-cover"
                loading="lazy"
              />
            </div>
            <h1
              className={`relative mb-6 inline-block text-4xl font-bold tracking-wide ${textColor}`}>
              Frequently Asked Questions
              <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
            </h1>
            <p className={`text-center text-lg ${textSecondary}`}>
              Find answers to common questions about our ENT clinic, services,
              and appointments
            </p>
          </header>

          <article
            className={`overflow-hidden rounded-2xl ${bgColor} shadow-xl`}>
            <div className="space-y-2 p-8 md:p-12">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`border-b ${borderColor} last:border-b-0`}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`flex w-full items-center justify-between py-4 text-left ${hoverBg} transition-colors duration-200`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}>
                    <h2 className={`text-lg font-semibold ${textColor} pr-4`}>
                      {faq.question}
                    </h2>
                    <i
                      className={`fa-solid ${openIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'} ${textColor} transition-transform duration-200`}
                      aria-hidden="true"></i>
                  </button>
                  {openIndex === index && (
                    <div
                      id={`faq-answer-${index}`}
                      className={`pb-4 ${textSecondary}`}
                      role="region">
                      {typeof faq.answer === 'string' ? (
                        <p>{faq.answer}</p>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          <div className={`mt-8 text-center ${textSecondary}`}>
            <p className="mb-4">Still have questions?</p>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <a
                href="tel:+918258839231"
                className="font-semibold text-blue-600 hover:text-blue-800">
                Call: +91 8258839231
              </a>
              <span className="hidden sm:inline">|</span>
              <a
                href="https://wa.me/916033521499"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-800">
                WhatsApp: +91 6033521499
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
