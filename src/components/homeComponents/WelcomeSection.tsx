import {useTheme} from '@/hooks/useTheme';

export const WelcomeSection = () => {
  const {actualTheme} = useTheme();
  const textHeader = actualTheme === 'light' ? 'text-gray-700' : 'text-white';
  const textColor = actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';

  return (
    <section
      className="xs:py-10 py-8 sm:py-12 md:py-14 lg:py-16"
      aria-labelledby="welcome-heading"
      role="main">
      <div className="xs:px-4 container mx-auto px-3 sm:px-6 md:px-8">
        <article className="mx-auto max-w-3xl text-center">
          <header className="mb-6">
            <h2
              id="welcome-heading"
              className={`text-foreground ${textHeader} xxxs:text-2xl xs:text-2xl xs:mb-4 mb-3 text-xl font-bold sm:text-3xl md:text-4xl`}>
              Welcome to Dr (Major) Amlan's ENT Clinic
            </h2>

            <p className="text-muted-foreground xs:text-base mb-4 text-sm text-blue-600 sm:mb-5 md:mb-6">
              Expert, patient-focused ENT care
            </p>
          </header>

          <div
            className={`text-foreground ${textColor} xs:text-base xs:leading-relaxed mb-4 text-justify text-sm leading-relaxed sm:leading-relaxed`}>
            <p className="mb-4">
              Comprehensive evaluation and treatment is provided here for all
              ear, nose, and throat conditions, using precise diagnostics and
              evidence-based management to ensure clear, reliable outcomes.
            </p>

            <section className="mb-4" aria-labelledby="allergy-services">
              <h3 id="allergy-services" className="sr-only">
                Allergy Testing Services
              </h3>
              <p className="font-bold">
                Skin prick test / Serum-specific IgE testing for allergen
                identification and tailored immunotherapy regimens are available
                at the clinic.
              </p>
            </section>

            <section className="mb-4" aria-labelledby="vertigo-treatment">
              <h3 id="vertigo-treatment" className="sr-only">
                Vertigo Treatment
              </h3>
              <p className="font-bold">
                Vertigo: Inner ear is responsible for maintaining balance of the
                body and often reeling of the head is caused due to problems in
                the ear. We provide comprehensive neurotological examination to
                diagnose and treat such conditions.
              </p>
            </section>

            <address
              className="mb-4 not-italic"
              aria-labelledby="clinic-location">
              <h3 id="clinic-location" className="sr-only">
                Clinic Location
              </h3>
              <p>
                Located on the 1st Floor, Capital Pathlab, Bijoykumar
                Chowmuhani, Agartala, West Tripura.
              </p>
            </address>

            <aside className="mb-4" aria-labelledby="military-discount">
              <h3 id="military-discount" className="sr-only">
                Military Personnel Discount
              </h3>
              <p className="font-bold">
                Consultation fees are exempt for serving and retired Armed
                Forces personnel (Army, Navy, Air Force) and their dependants. A
                valid Service/ESM/Dependant ID must be presented.
              </p>
            </aside>
          </div>
        </article>
      </div>
    </section>
  );
};
