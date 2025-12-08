const vertigoImage =
  'https://res.cloudinary.com/mobeet/image/upload/v1765202949/zzzz-Photoroom_v8wt6f.png';
const entImage =
  'https://res.cloudinary.com/mobeet/image/upload/v1765206848/ENT_ICON-Photoroom_dgkdy8.png';

export const ServicesSection = (): React.JSX.Element => {
  return (
    <section
      className="mx-auto w-full bg-white py-16"
      aria-label="ENT Services">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ENT Consultation */}
          <article className="rounded-xl bg-cyan-400 p-8 shadow-lg">
            <img
              src={entImage}
              alt="Neurotology and Vertigo"
              className="mb-4 h-16 w-16 object-contain"
            />
            <h3 className="mb-3 text-2xl font-bold text-white">
              ENT Consultation
            </h3>
            <p className="text-white">
              Complete assessment and management of ear, nose, and throat
              disorders for patients of all ages.
            </p>
          </article>

          {/* Neurotology and Vertigo */}
          <article className="rounded-xl bg-blue-400 p-8 shadow-lg">
            <img
              src={vertigoImage}
              alt="Neurotology and Vertigo"
              className="mb-4 h-16 w-16 object-contain brightness-0 invert"
            />
            <h3 className="mb-3 text-2xl font-bold text-white">
              Neurotology and Vertigo
            </h3>
            <p className="text-white">
              Comprehensive examination and treatment for patients suffering
              from dizziness,balance disorders and vertigo
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
          <article className="rounded-xl border-2 border-cyan-400 bg-white p-8 shadow-lg sm:col-span-2 lg:col-span-1 lg:col-start-2">
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
