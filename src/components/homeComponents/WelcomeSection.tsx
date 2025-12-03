export const WelcomeSection = () => {
  return (
    <section
      className="xs:py-10 py-8 sm:py-12 md:py-14 lg:py-16"
      aria-label="Welcome to the Clinic">
      <div className="xs:px-4 container mx-auto px-3 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-foreground xxxs:text-2xl xs:text-2xl xs:mb-4 mb-3 text-xl font-bold sm:text-3xl md:text-4xl">
            Welcome to Dr (Major) Amlan's ENT Clinic
          </h2>

          <p className="text-muted-foreground xs:text-base mb-4 text-sm text-blue-600 sm:mb-5 md:mb-6">
            Expert, patient-focused ENT care
          </p>

          <p className="text-foreground xs:text-base xs:leading-relaxed mb-4 text-justify text-sm leading-relaxed sm:leading-relaxed">
            We provide comprehensive evaluation and treatment for all ear, nose,
            and throat conditions, using precise diagnostics and evidence-based
            management to ensure clear, reliable outcomes.
            <br />
            <br />
            <strong>
              Skin prick test / Serum-specific IgE testing for allergen
              identification and tailored immunotherapy regimens are available
              at the clinic.
            </strong>
            <br />
            <br />
            Located on the 1st Floor, Capital Pathlab, Bijoykumar Chowmuhani,
            Agartala, West Tripura.
            <br />
            <br />
            <span className="font-bold text-gray-800">
              Consultation fees are exempt for serving and retired Armed Forces
              personnel (Army, Navy, Air Force) and their dependants. A valid
              Service/ESM/Dependant ID must be presented.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
