export const ServicesSection = (): React.JSX.Element => {
  return (
    <section
      className="mx-auto w-full bg-white py-16"
      aria-label="ENT Services">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* ENT Consultation */}
          <article className="rounded-xl bg-cyan-400 p-8 shadow-lg">
            <i
              className="fa-solid fa-stethoscope mb-4 text-5xl text-white"
              aria-hidden="true"></i>
            <h3 className="mb-3 text-2xl font-bold text-white">
              ENT Consultation
            </h3>
            <p className="text-white">
              Comprehensive assessment and management of ear, nose, and throat
              disorders for patients of all ages.
            </p>
          </article>

          {/* Allergy Testing & Immunotherapy */}
          <article className="rounded-xl bg-lime-400 p-8 shadow-lg">
            <i
              className="fa-solid fa-vial-circle-check mb-4 text-5xl text-gray-800"
              aria-hidden="true"></i>
            <h3 className="mb-3 text-2xl font-bold text-gray-800">
              Allergy Testing & Immunotherapy
            </h3>
            <p className="text-gray-800">
              <span className="font-bold">
                Skin prick test / Serum-specific IgE
              </span>{' '}
              testing and customized immunotherapy for long-term relief from
              allergic conditions.
            </p>
          </article>

          {/* Endoscopic & Advanced Procedures */}
          <article className="rounded-xl border-2 border-cyan-400 bg-white p-8 shadow-lg">
            <i
              className="fa-solid fa-microscope mb-4 text-5xl text-cyan-400"
              aria-hidden="true"></i>
            <h3 className="mb-3 text-2xl font-bold text-gray-800">
              Endoscopic & Advanced Procedures
            </h3>
            <p className="text-gray-600">
              Modern ENT procedures including nasal endoscopy, laryngoscopy, and
              minimally invasive treatments.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
