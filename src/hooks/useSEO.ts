import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {IMAGES} from '@/constants/images';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const defaultSEO: SEOData = {
  title: 'Dr. (Major) Amlan Debbarma - ENT Specialist in Agartala, Tripura',
  description:
    'Expert ENT specialist in Agartala, Tripura. Specialist in sinus surgery, vertigo treatment, asthma management, allergy testing, sleep apnea diagnosis, flexible sleep endoscopy, endoscopic procedures. Book appointment online.',
  keywords:
    'ENT doctor Agartala, ENT specialist Tripura, otolaryngologist Agartala, Dr Amlan Debbarma, ENT surgeon Tripura Medical College, asthma treatment, allergy management, sleep apnea treatment, flexible sleep endoscopy, snoring treatment, best ENT doctor, leading ENT specialist',
  ogImage: IMAGES.CLINIC_LOGO,
};

const seoPages: Record<string, SEOData> = {
  '/': {
    title:
      'Dr. (Major) Amlan Debbarma - ENT Specialist in Agartala, Tripura | Online Appointment',
    description:
      'Book appointment with Dr. (Major) Amlan Debbarma, expert ENT specialist in Agartala, Tripura. MBBS, MS ENT (Gold Medalist), Ex-Army Medical Corps. Specialist in sinus surgery, vertigo treatment, asthma management, allergy testing, sleep apnea diagnosis.',
    keywords:
      'ENT doctor Agartala, book ENT appointment Tripura, Dr Amlan Debbarma ENT, otolaryngologist Agartala, ENT specialist Tripura Medical College, sinus doctor Agartala, vertigo treatment Tripura, asthma treatment, allergy management, sleep apnea treatment, flexible sleep endoscopy, snoring doctor, best ENT doctor, leading ENT specialist, MS ENT Gold Medalist',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/',
  },
  '/home': {
    title:
      'Dr. (Major) Amlan Debbarma - ENT Specialist in Agartala, Tripura | Online Appointment',
    description:
      'Book appointment with Dr. (Major) Amlan Debbarma, expert ENT specialist in Agartala, Tripura. MBBS, MS ENT (Gold Medalist), Ex-Army Medical Corps. Specialist in sinus surgery, vertigo treatment, asthma management, allergy testing, sleep apnea diagnosis.',
    keywords:
      'ENT doctor Agartala, book ENT appointment Tripura, Dr Amlan Debbarma ENT, otolaryngologist Agartala, ENT specialist Tripura Medical College, sinus doctor Agartala, vertigo treatment Tripura, asthma treatment, allergy management, sleep apnea treatment, flexible sleep endoscopy, snoring doctor, best ENT doctor, leading ENT specialist, MS ENT Gold Medalist',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/', // Same canonical as / - tells Google this is duplicate
  },
  '/about': {
    title:
      'About Dr. (Major) Amlan Debbarma - ENT, Head & Neck Surgeon and Allergy Specialist | Tripura Medical College',
    description:
      'Learn about Dr. (Major) Amlan Debbarma, MBBS, MS ENT (Gold Medalist), Ex-Army Medical Corps officer. ENT, Head & Neck Surgeon and Allergy Specialist at Tripura Medical College, Agartala. Specialist in endoscopic surgery, vertigo treatment, sleep apnea diagnosis.',
    keywords:
      'Dr Amlan Debbarma biography, ENT Head Neck Surgeon Tripura Medical College, MS ENT Gold Medalist Agartala, Allergy Specialist Agartala, Army Medical Corps ENT, otolaryngologist background Tripura, ENT doctor qualifications Agartala, sleep apnea specialist, leading ENT surgeon, best ENT doctor',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/about',
  },
  '/contact': {
    title:
      'Contact Dr. (Major) Amlan Debbarma ENT & Allergy Clinic Agartala | Book Appointment Tripura',
    description:
      'Contact Dr. (Major) Amlan Debbarma ENT & Allergy Clinic in Agartala, Tripura. Located at Capital Pathlab, Bijoykumar Chowmuhani. Call +91 7085548785 for appointments.',
    keywords:
      'ENT clinic Agartala contact, Dr Amlan Debbarma phone number, ENT appointment Tripura, Capital Pathlab ENT clinic, Bijoykumar Chowmuhani ENT doctor',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/contact',
  },
  '/appointment': {
    title:
      'Book ENT Appointment Online - Dr. (Major) Amlan Debbarma Agartala | ₹400 Consultation',
    description:
      'Book online appointment with Dr. (Major) Amlan Debbarma, expert ENT specialist in Agartala, Tripura. ₹400 consultation fee. Available Mon-Sat 6-8:30 PM. Sunday allergy clinic 10:30 AM-1 PM. Secure online payment.',
    keywords:
      'book ENT appointment online Agartala, ENT consultation fee Tripura, Dr Amlan Debbarma appointment, online ENT booking Agartala, ENT doctor appointment Tripura, allergy clinic Agartala, best ENT appointment booking, leading ENT consultation',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/appointment',
  },
  '/privacy-policy': {
    title:
      'Privacy Policy & Terms - Dr. (Major) Amlan Debbarma ENT & Allergy Clinic Agartala',
    description:
      'Privacy policy, terms & conditions, and refund policy for Dr. (Major) Amlan Debbarma ENT & Allergy Clinic, Agartala, Tripura. Patient data protection and appointment policies.',
    keywords:
      'ENT clinic privacy policy Agartala, Dr Amlan Debbarma terms conditions, patient data protection Tripura, ENT appointment refund policy',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/privacy-policy',
  },
  '/faq': {
    title:
      'FAQ - Dr. (Major) Amlan Debbarma ENT & Allergy Clinic Agartala | Common Questions Answered',
    description:
      'Frequently asked questions about Dr. (Major) Amlan Debbarma ENT & Allergy Clinic in Agartala, Tripura. Find answers about consultation fees, clinic timings (Mon-Sat 6-8:30 PM, Sunday allergy clinic 10:30 AM-1 PM), booking appointments, payment methods, and ENT treatments.',
    keywords:
      'ENT clinic FAQ Agartala, Dr Amlan Debbarma questions, ENT consultation fees Tripura, clinic timings Agartala, allergy clinic Sunday, ENT appointment booking, ENT treatment questions',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/faq',
  },
};

export const useSEO = (customSEO?: Partial<SEOData>) => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const pageSEO = seoPages[currentPath] || defaultSEO;
    const finalSEO = {...pageSEO, ...customSEO};

    // Update document title
    document.title = finalSEO.title;

    // Update meta tags (but preserve favicon links)
    updateMetaTag('description', finalSEO.description);
    updateMetaTag('keywords', finalSEO.keywords);

    // Open Graph tags
    updateMetaTag('og:title', finalSEO.ogTitle || finalSEO.title, 'property');
    updateMetaTag(
      'og:description',
      finalSEO.ogDescription || finalSEO.description,
      'property',
    );
    updateMetaTag(
      'og:image',
      finalSEO.ogImage || defaultSEO.ogImage!,
      'property',
    );
    updateMetaTag(
      'og:url',
      finalSEO.canonicalUrl ||
        `https://www.dr-major-amlan-ent.in${currentPath}`,
      'property',
    );
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag(
      'og:site_name',
      'Dr. (Major) Amlan Debbarma ENT & Allergy Clinic',
      'property',
    );
    updateMetaTag('og:locale', 'en_IN', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', finalSEO.ogTitle || finalSEO.title, 'name');
    updateMetaTag(
      'twitter:description',
      finalSEO.ogDescription || finalSEO.description,
      'name',
    );
    updateMetaTag(
      'twitter:image',
      finalSEO.ogImage || defaultSEO.ogImage!,
      'name',
    );

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow', 'name');
    updateMetaTag('author', 'Dr. (Major) Amlan Debbarma', 'name');
    updateMetaTag('geo.region', 'IN-TR', 'name');
    updateMetaTag('geo.placename', 'Agartala, Tripura', 'name');
    updateMetaTag('geo.position', '23.8315;91.2868', 'name');
    updateMetaTag('ICBM', '23.8315, 91.2868', 'name');

    // Canonical URL
    updateCanonicalLink(
      finalSEO.canonicalUrl ||
        `https://www.dr-major-amlan-ent.in${currentPath}`,
    );

    // JSON-LD Structured Data
    updateStructuredData(finalSEO, currentPath);
  }, [location.pathname, customSEO]);
};

const updateMetaTag = (
  name: string,
  content: string,
  attribute: 'name' | 'property' = 'name',
) => {
  let element = document.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string) => {
  let element = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', url);
};

const updateStructuredData = (seo: SEOData, currentPath: string) => {
  // Remove existing structured data
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]',
  );
  if (existingScript) {
    existingScript.remove();
  }

  let structuredData;

  if (currentPath === '/' || currentPath === '/home') {
    // Medical Organization + Doctor schema for homepage
    structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'MedicalOrganization',
          '@id': 'https://www.dr-major-amlan-ent.in/#organization',
          name: 'Dr. (Major) Amlan Debbarma ENT & Allergy Clinic',
          url: 'https://www.dr-major-amlan-ent.in/',
          logo: {
            '@type': 'ImageObject',
            url: IMAGES.CLINIC_LOGO,
            width: 512,
            height: 512,
          },
          image: IMAGES.DOCTOR_PHOTO,
          description:
            'Expert ENT & Allergy clinic in Agartala, Tripura providing comprehensive ear, nose, throat, head & neck, and allergy treatments including sleep apnea diagnosis',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Capital Pathlab, Bijoykumar Chowmuhani',
            addressLocality: 'Agartala',
            addressRegion: 'Tripura',
            postalCode: '799001',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 23.8315,
            longitude: 91.2868,
          },
          telephone: '+91-7085548785',
          email: 'debbarmaamlan@gmail.com',
          openingHours: ['Mo-Sa 18:00-20:30', 'Su 10:30-13:00'],
          medicalSpecialty: 'Otolaryngology',
          priceRange: '₹₹',
        },
        {
          '@type': 'Physician',
          '@id': 'https://www.dr-major-amlan-ent.in/#doctor',
          name: 'Dr. (Major) Amlan Debbarma',
          givenName: 'Amlan',
          familyName: 'Debbarma',
          honorificPrefix: 'Dr.',
          honorificSuffix: 'MBBS, MS ENT (Gold Medalist)',
          url: 'https://www.dr-major-amlan-ent.in/about',
          image: IMAGES.DOCTOR_PHOTO,
          jobTitle: 'ENT Surgeon',
          description:
            'MBBS, MS ENT (Gold Medalist), Ex-Army Medical Corps, Endoscopic and Microscopic ENT surgeon at Tripura Medical College',
          medicalSpecialty: [
            'Otolaryngology',
            'Endoscopic Surgery',
            'Vertigo Treatment',
            'Allergy Testing',
            'Asthma Management',
            'Sleep Apnea Diagnosis',
          ],
          alumniOf: 'Tripura Medical College',
          memberOf: {
            '@type': 'MedicalOrganization',
            name: 'Tripura Medical College',
          },
          worksFor: {
            '@id': 'https://www.dr-major-amlan-ent.in/#organization',
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Capital Pathlab, Bijoykumar Chowmuhani',
            addressLocality: 'Agartala',
            addressRegion: 'Tripura',
            postalCode: '799001',
            addressCountry: 'IN',
          },
          telephone: '+91-7085548785',
          email: 'debbarmaamlan@gmail.com',
        },
      ],
    };
  } else if (currentPath === '/faq') {
    // FAQPage schema for FAQ page
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: seo.title,
      description: seo.description,
      url: 'https://www.dr-major-amlan-ent.in/faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What ENT conditions do you treat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We provide comprehensive ENT care including ear infections, hearing loss, tinnitus, vertigo, nasal congestion, sinusitis, allergies, asthma management, throat infections, tonsillitis, voice disorders, sleep apnea, snoring disorders, endoscopic sinus surgery, microscopic ear procedures, and allergy testing and treatment.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the consultation fees and payment options?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Consultation fee is ₹400 (Fixed). We accept online payment via PhonePe including UPI, Credit/Debit Cards, and Net Banking. Armed Forces personnel and their dependents are exempted from fees with valid ID (offline only). First follow-up within 2 weeks is free (offline only).',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the clinic timings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clinic hours are 6:00 PM - 8:30 PM, Monday to Saturday. Sunday: Allergy clinic from 10:30 AM to 1:00 PM (Prior appointment required, Offline only).',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I book an appointment?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can book online through our Appointment page (10 slots per day) or walk-in at the clinic during consultation hours (10 additional offline slots). Contact us at +91 7085548785 or WhatsApp +91 6033521499 for assistance.',
          },
        },
        {
          '@type': 'Question',
          name: 'What payment methods are accepted?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We accept secure online payments through PhonePe payment gateway including UPI, Credit Cards, Debit Cards, and Net Banking. All payments are processed securely with PCI DSS compliance.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a consultation typically take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A typical consultation takes approximately 15-20 minutes, including medical history review, physical examination, diagnosis, treatment plan discussion, and prescription.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you treat children?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we provide ENT care for patients of all ages, including children. We treat ear infections, hearing problems, tonsillitis, adenoid issues, nasal congestion, allergies, and throat infections in children. Parents/guardians must accompany children during consultations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need a referral from another doctor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No referral is required. You can directly book an appointment for any ENT-related concerns. However, if referred by another doctor, please bring the referral letter, previous medical reports, and list of current medications.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you treat sleep apnea and snoring problems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we diagnose and treat sleep apnea and snoring disorders using flexible sleep endoscopy to identify areas of airway collapse during sleep. This helps us provide targeted treatment for sleep-related breathing disorders.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide asthma and allergy management?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Dr. (Major) Amlan Debbarma is specially trained in asthma and allergy management. We offer comprehensive allergy testing including skin prick tests and serum-specific IgE testing, along with customized immunotherapy for long-term relief from allergic conditions and asthma management.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is flexible sleep endoscopy and how does it help?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Flexible sleep endoscopy is an advanced diagnostic procedure that allows us to visualize the upper airway during sleep-like conditions. It helps identify the exact areas where airway collapse occurs during sleep, enabling us to provide targeted and effective treatment for sleep apnea and snoring disorders.',
          },
        },
      ],
      about: {
        '@type': 'MedicalOrganization',
        name: 'Dr. (Major) Amlan Debbarma ENT & Allergy Clinic',
      },
    };
  } else {
    // Basic WebPage schema for other pages
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: `https://www.dr-major-amlan-ent.in${currentPath}`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dr. (Major) Amlan Debbarma ENT & Allergy Clinic',
        url: 'https://www.dr-major-amlan-ent.in/',
      },
      about: {
        '@type': 'MedicalOrganization',
        name: 'Dr. (Major) Amlan Debbarma ENT & Allergy Clinic',
      },
    };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
