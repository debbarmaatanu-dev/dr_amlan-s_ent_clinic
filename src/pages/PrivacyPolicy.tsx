import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {useSEO} from '@/hooks/useSEO';

import {IMAGES} from '@/constants/images';

const logo = IMAGES.CLINIC_LOGO;

export const PrivacyPolicy = (): React.JSX.Element => {
  const {actualTheme} = useTheme();

  // SEO optimization for privacy policy page
  useSEO();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';

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
              Privacy & Policies
              <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
            </h1>
          </header>

          <article
            className={`overflow-hidden rounded-2xl ${bgColor} shadow-xl`}>
            <div className="space-y-8 p-8 md:p-12">
              {/* Terms & Conditions */}
              <section>
                <h2 className={`mb-4 text-2xl font-bold ${textColor}`}>
                  Terms & Conditions
                </h2>
                <div className={`space-y-4 ${textSecondary}`}>
                  <p>
                    This document is an electronic record in terms of
                    Information Technology Act, 2000 and rules there under as
                    applicable and the amended provisions pertaining to
                    electronic records in various statutes as amended by the
                    Information Technology Act, 2000.
                  </p>
                  <p>
                    The Platform is owned by Dr. (Major) Amlan Debbarma, with
                    its registered office at 1st Floor, Capital Pathlab,
                    Bijoykumar Chowmuhani, Agartala, West Tripura - 799001.
                  </p>
                  <p>
                    By accessing, browsing or otherwise using the Platform, you
                    indicate your agreement to all the terms and conditions
                    under these Terms of Use. Please read the Terms of Use
                    carefully before proceeding.
                  </p>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Key Terms
                  </h3>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      You agree to provide true, accurate and complete
                      information during and after registration.
                    </li>
                    <li>
                      Your use of our services is solely at your own risk and
                      discretion.
                    </li>
                    <li>
                      You agree to pay the charges associated with availing the
                      services.
                    </li>
                    <li>
                      You agree not to use the Platform for any unlawful or
                      illegal purpose.
                    </li>
                    <li>
                      All disputes shall be subject to the exclusive
                      jurisdiction of the courts in Agartala and Tripura.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Privacy Policy */}
              <section className="border-t pt-8">
                <h2 className={`mb-4 text-2xl font-bold ${textColor}`}>
                  Privacy Policy
                </h2>
                <div className={`space-y-4 ${textSecondary}`}>
                  <p>
                    This Privacy Policy describes how Dr. (Major) Amlan Debbarma
                    collects, uses, shares, protects or otherwise processes your
                    information/personal data through our website.
                  </p>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Information Collection
                  </h3>
                  <p>
                    We collect your personal data when you use our Platform or
                    services. This includes:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      Personal information: Name, date of birth, address,
                      telephone/mobile number, email ID
                    </li>
                    <li>
                      Payment information: Transaction details (we do not store
                      card/bank details - handled securely by PhonePe)
                    </li>
                    <li>
                      Transaction information related to appointments and
                      services
                    </li>
                  </ul>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Information Usage
                  </h3>
                  <p>We use your personal data to:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Provide the services you request</li>
                    <li>Process appointments and payments</li>
                    <li>Enhance customer experience</li>
                    <li>Resolve disputes and troubleshoot problems</li>
                    <li>
                      Inform you about offers, products, services, and updates
                    </li>
                    <li>
                      Detect and protect against fraud and criminal activity
                    </li>
                  </ul>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Data Security
                  </h3>
                  <p>
                    We adopt reasonable security practices and procedures to
                    protect your personal data from unauthorized access,
                    disclosure, loss or misuse. However, transmission of
                    information over the internet cannot always be guaranteed as
                    completely secure.
                  </p>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Payment Security & Technology
                  </h3>
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="font-semibold text-green-800">
                      <i className="fa-solid fa-shield-halved mr-2"></i>
                      Enterprise-Grade Security Standards
                    </p>
                    <div className="mt-3 space-y-2 text-green-700">
                      <p>
                        <strong>Secure Payment Processing:</strong> All payments
                        are processed through PhonePe, a Reserve Bank of India
                        (RBI) authorized payment gateway that complies with PCI
                        DSS (Payment Card Industry Data Security Standard).
                      </p>
                      <p>
                        <strong>No Financial Data Storage:</strong> We do not
                        store any credit card, debit card, or bank account
                        information on our servers. All payment details are
                        handled securely by PhonePe's encrypted systems.
                      </p>
                      <p>
                        <strong>Real-time Security:</strong> Payment
                        confirmations are processed in real-time through secure
                        webhooks with authentication and encryption to ensure
                        immediate and secure booking confirmation.
                      </p>
                    </div>
                  </div>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Technical Security Measures
                  </h3>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      <strong>HTTPS Encryption:</strong> All data transmission
                      is encrypted using industry-standard SSL/TLS encryption
                      protocols.
                    </li>
                    <li>
                      <strong>Secure Infrastructure:</strong> Our application
                      uses enterprise-grade security including rate limiting,
                      request validation, and secure authentication.
                    </li>
                    <li>
                      <strong>Geographic Security:</strong> Our services are
                      restricted to users within India for enhanced security and
                      regulatory compliance.
                    </li>
                    <li>
                      <strong>Audit Logging:</strong> All transactions and
                      system access are logged and monitored for security
                      purposes with complete audit trails.
                    </li>
                    <li>
                      <strong>Minimal Data Collection:</strong> We only collect
                      essential information required for appointment booking and
                      do not store sensitive medical records.
                    </li>
                  </ul>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Third-Party Security Partners
                  </h3>
                  <div className="space-y-2">
                    <p>
                      We partner with industry-leading, security-compliant
                      service providers:
                    </p>
                    <ul className="list-disc space-y-1 pl-6">
                      <li>
                        <strong>PhonePe:</strong> RBI-authorized payment gateway
                        with PCI DSS compliance
                      </li>
                      <li>
                        <strong>Google Firebase:</strong> Enterprise-grade data
                        storage with Google Cloud security standards
                      </li>
                      <li>
                        <strong>Vercel:</strong> Secure web hosting with
                        enterprise infrastructure and DDoS protection and Web
                        Application Firewall.
                      </li>
                    </ul>
                    <p className="mt-2 text-sm">
                      All third-party services comply with international
                      security standards and data protection regulations.
                    </p>
                  </div>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Your Rights
                  </h3>
                  <p>
                    You may access, rectify, and update your personal data
                    directly through the functionalities provided on the
                    Platform. You have the option to withdraw your consent by
                    contacting us.
                  </p>
                </div>
              </section>

              {/* Payment Refund Policy */}
              <section className="border-t pt-8">
                <h2 className={`mb-4 text-2xl font-bold ${textColor}`}>
                  Payment Refund Policy
                </h2>
                <div className={`space-y-4 ${textSecondary}`}>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <p className="font-semibold text-orange-800">
                      <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                      Payment Issue Refund Policy:
                    </p>
                    <p className="mt-2 text-orange-700">
                      If payment money was deducted from your bank account but
                      you did not receive a booking receipt, a refund will be
                      provided. However, you must contact us within 2 days of
                      the transaction date. Refunds will also be issued in case
                      of clinic closure or doctor unavailability.
                    </p>
                  </div>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Refund Process for Payment Issues
                  </h3>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      <strong>Eligibility:</strong> Refund is only applicable if
                      payment was deducted but no booking receipt was generated.
                    </li>
                    <li>
                      <strong>Time Limit:</strong> You must report the issue
                      within 2 days of the transaction date.
                    </li>
                    <li>
                      <strong>Required Information:</strong> Please provide your
                      transaction ID, payment details, and registered phone
                      number when contacting us.
                    </li>
                    <li>
                      <strong>Processing Time:</strong> Refunds will be
                      processed within 5-7 business days after verification.
                    </li>
                    <li>
                      <strong>Refund Method:</strong> Refunds will be credited
                      back to the original payment method used.
                    </li>
                  </ul>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4">
                    <p className="font-semibold text-blue-800">
                      How to Report Payment Issues:
                    </p>
                    <p className="mt-2 text-blue-700">
                      Contact us immediately at <strong>+91 8258839231</strong>{' '}
                      or email <strong>debbarmaamlan@gmail.com</strong> with
                      your transaction details if you face any payment-related
                      issues.
                    </p>
                  </div>
                </div>
              </section>

              {/* Refund and Cancellation Policy */}
              <section className="border-t pt-8">
                <h2 className={`mb-4 text-2xl font-bold ${textColor}`}>
                  Appointment Cancellation Policy
                </h2>
                <div className={`space-y-4 ${textSecondary}`}>
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="font-semibold text-red-800">
                      Important Notice:
                    </p>
                    <p className="mt-2 text-red-700">
                      Dr. (Major) Amlan's ENT Clinic operates on a NO REFUND and
                      NO CANCELLATION policy for all appointments and services
                      unless geniune circumstances arise.
                    </p>
                  </div>

                  <h3 className={`mt-6 text-xl font-semibold ${textColor}`}>
                    Policy Details
                  </h3>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      <strong>No Cancellations:</strong> Once an appointment is
                      booked and payment is made, it cannot be cancelled.
                    </li>
                    <li>
                      <strong>Refunds:</strong> All payments made for
                      appointments and services are final and non-refundable. If
                      payment is deducted but no booking receipt is received,
                      please contact us within 2 days for a refund. Refunds will
                      also be issued in case of clinic closure or doctor
                      unavailability.
                    </li>
                    <li>
                      <strong>Rescheduling:</strong> In case you cannot attend
                      your scheduled appointment, please contact the clinic at
                      least 24 hours in advance. We may accommodate rescheduling
                      based on availability, but no refund will be provided.
                    </li>
                    <li>
                      <strong>Missed Appointments:</strong> If you miss your
                      appointment without prior notice, no refund or
                      rescheduling will be offered.
                    </li>
                  </ul>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4">
                    <p className="font-semibold text-blue-800">Please Note:</p>
                    <p className="mt-2 text-blue-700">
                      By booking an appointment, you acknowledge and agree to
                      this NO REFUND and NO CANCELLATION policy. Please ensure
                      you can attend your appointment before making a booking.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="border-t pt-8">
                <h2 className={`mb-4 text-2xl font-bold ${textColor}`}>
                  Contact Us
                </h2>
                <div className={`space-y-2 ${textSecondary}`}>
                  <p>
                    <strong>Dr. (Major) Amlan's ENT Clinic</strong>
                  </p>
                  <p>1st Floor, Capital Pathlab</p>
                  <p>Bijoykumar Chowmuhani, Agartala</p>
                  <p>West Tripura - 799001</p>
                  <p className="mt-4">
                    <strong>Phone:</strong>{' '}
                    <a
                      href="tel:+918258839231"
                      className="text-blue-600 hover:text-blue-800">
                      +91 8258839231
                    </a>
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    <a
                      href="mailto:debbarmaamlan@gmail.com"
                      className="text-blue-600 hover:text-blue-800">
                      debbarmaamlan@gmail.com
                    </a>
                  </p>
                  <p>
                    <strong>Clinic Hours:</strong> Monday - Saturday (9:00 AM -
                    6:00 PM)
                  </p>
                </div>
              </section>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
