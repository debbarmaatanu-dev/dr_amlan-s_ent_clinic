import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

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
  title: 'Dr. (Major) Amlan Debbarma - Best ENT Doctor in Agartala, Tripura',
  description:
    'Leading ENT specialist in Agartala, Tripura. Expert in sinus surgery, vertigo treatment, allergy testing, endoscopic procedures. Book appointment online.',
  keywords:
    'ENT doctor Agartala, ENT specialist Tripura, otolaryngologist Agartala, Dr Amlan Debbarma, ENT surgeon Tripura Medical College',
  ogImage:
    'https://res.cloudinary.com/mobeet/image/upload/v1764923599/IMG_20251203_101518842_HDR_PORTRAIT_2_1_hyhvhd.jpg',
};

const seoPages: Record<string, SEOData> = {
  '/': {
    title:
      'Dr. (Major) Amlan Debbarma - Best ENT Doctor in Agartala, Tripura | Online Appointment',
    description:
      'Book appointment with Dr. (Major) Amlan Debbarma, leading ENT specialist in Agartala, Tripura. MS ENT, Ex-Army Medical Corps. Expert in sinus surgery, vertigo treatment, allergy testing.',
    keywords:
      'ENT doctor Agartala, book ENT appointment Tripura, Dr Amlan Debbarma ENT, otolaryngologist Agartala, ENT specialist Tripura Medical College, sinus doctor Agartala, vertigo treatment Tripura',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/',
  },
  '/home': {
    title:
      'Dr. (Major) Amlan Debbarma - Best ENT Doctor in Agartala, Tripura | Online Appointment',
    description:
      'Book appointment with Dr. (Major) Amlan Debbarma, leading ENT specialist in Agartala, Tripura. MS ENT, Ex-Army Medical Corps. Expert in sinus surgery, vertigo treatment, allergy testing.',
    keywords:
      'ENT doctor Agartala, book ENT appointment Tripura, Dr Amlan Debbarma ENT, otolaryngologist Agartala, ENT specialist Tripura Medical College, sinus doctor Agartala, vertigo treatment Tripura',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/',
  },
  '/about': {
    title:
      'About Dr. (Major) Amlan Debbarma - ENT Surgeon Tripura Medical College | MS ENT Agartala',
    description:
      'Learn about Dr. (Major) Amlan Debbarma, MS ENT, Ex-Army Medical Corps officer. Leading ENT surgeon at Tripura Medical College, Agartala. Expert in endoscopic surgery, vertigo treatment.',
    keywords:
      'Dr Amlan Debbarma biography, ENT surgeon Tripura Medical College, MS ENT Agartala, Army Medical Corps ENT, otolaryngologist background Tripura, ENT doctor qualifications Agartala',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/about',
  },
  '/contact': {
    title:
      'Contact Dr. Amlan Debbarma ENT Clinic Agartala | Book Appointment Tripura',
    description:
      'Contact Dr. (Major) Amlan Debbarma ENT Clinic in Agartala, Tripura. Located at Capital Pathlab, Bijoykumar Chowmuhani. Call +91 8258839231 for appointments.',
    keywords:
      'ENT clinic Agartala contact, Dr Amlan Debbarma phone number, ENT appointment Tripura, Capital Pathlab ENT clinic, Bijoykumar Chowmuhani ENT doctor',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/contact',
  },
  '/appointment': {
    title:
      'Book ENT Appointment Online - Dr. Amlan Debbarma Agartala | ₹400 Consultation',
    description:
      'Book online appointment with Dr. (Major) Amlan Debbarma, ENT specialist in Agartala, Tripura. ₹400 consultation fee. Available Mon-Sat 6-8:30 PM. Secure online payment.',
    keywords:
      'book ENT appointment online Agartala, ENT consultation fee Tripura, Dr Amlan Debbarma appointment, online ENT booking Agartala, ENT doctor appointment Tripura',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/appointment',
  },
  '/privacy-policy': {
    title: 'Privacy Policy & Terms - Dr. Amlan Debbarma ENT Clinic Agartala',
    description:
      'Privacy policy, terms & conditions, and refund policy for Dr. (Major) Amlan Debbarma ENT Clinic, Agartala, Tripura. Patient data protection and appointment policies.',
    keywords:
      'ENT clinic privacy policy Agartala, Dr Amlan Debbarma terms conditions, patient data protection Tripura, ENT appointment refund policy',
    canonicalUrl: 'https://www.dr-major-amlan-ent.in/privacy-policy',
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

    // Update meta tags
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
      'Dr. (Major) Amlan Debbarma ENT Clinic',
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
          name: 'Dr. (Major) Amlan Debbarma ENT Clinic',
          url: 'https://www.dr-major-amlan-ent.in/',
          logo: 'https://res.cloudinary.com/mobeet/image/upload/v1765202950/DrAmlanLogo_2_rzgp2v.png',
          image:
            'https://res.cloudinary.com/mobeet/image/upload/v1764923599/IMG_20251203_101518842_HDR_PORTRAIT_2_1_hyhvhd.jpg',
          description:
            'Leading ENT clinic in Agartala, Tripura providing comprehensive ear, nose, and throat treatments',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1st Floor, Capital Pathlab, Bijoykumar Chowmuhani',
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
          telephone: '+91-8258839231',
          email: 'debbarmaamlan@gmail.com',
          openingHours: 'Mo-Sa 18:00-20:30',
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
          honorificSuffix: 'MS ENT',
          url: 'https://www.dr-major-amlan-ent.in/about',
          image:
            'https://res.cloudinary.com/mobeet/image/upload/v1764923599/IMG_20251203_101518842_HDR_PORTRAIT_2_1_hyhvhd.jpg',
          jobTitle: 'ENT Surgeon',
          description:
            'MS ENT, Ex-Army Medical Corps, Endoscopic and Microscopic ENT surgeon at Tripura Medical College',
          medicalSpecialty: [
            'Otolaryngology',
            'Endoscopic Surgery',
            'Vertigo Treatment',
            'Allergy Testing',
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
            streetAddress: '1st Floor, Capital Pathlab, Bijoykumar Chowmuhani',
            addressLocality: 'Agartala',
            addressRegion: 'Tripura',
            postalCode: '799001',
            addressCountry: 'IN',
          },
          telephone: '+91-8258839231',
          email: 'debbarmaamlan@gmail.com',
        },
      ],
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
        name: 'Dr. (Major) Amlan Debbarma ENT Clinic',
        url: 'https://www.dr-major-amlan-ent.in/',
      },
      about: {
        '@type': 'MedicalOrganization',
        name: 'Dr. (Major) Amlan Debbarma ENT Clinic',
      },
    };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
