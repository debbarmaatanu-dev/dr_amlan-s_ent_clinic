import {useTheme} from '@/hooks/useTheme';
import {IMAGES} from '@/constants/images';

const vertigoImage = IMAGES.VERTIGO_ICON;
const entImage = IMAGES.ENT_ICON;

export const ServicesSection = (): React.JSX.Element => {
  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-500';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  return (
    <section
      className={`mx-auto w-full ${bgColor} py-16`}
      aria-labelledby="services-heading">
      <div className="container mx-auto max-w-7xl px-4">
        <header className="mb-12 text-center">
          <h2
            id="services-heading"
            className={`mb-4 text-3xl font-bold ${textColor} md:text-4xl`}>
            Our ENT Services
          </h2>
          <p className={`text-lg ${textSecondary}`}>
            Comprehensive ear, nose, and throat care.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ENT Consultation */}
          <article
            className="rounded-xl bg-cyan-400 p-8 shadow-lg"
            itemScope
            itemType="https://schema.org/MedicalProcedure">
            <figure className="mb-4">
              <img
                src={entImage}
                alt="ENT Consultation icon - Comprehensive ear, nose, throat examination"
                className="h-16 w-16 object-contain"
                width="64"
                height="64"
                loading="lazy"
              />
            </figure>
            <h3 className="mb-3 text-2xl font-bold text-white" itemProp="name">
              ENT Consultation
            </h3>
            <p className="text-white" itemProp="description">
              Complete assessment and management of ear, nose, and throat
              disorders for patients of all ages.
            </p>
          </article>

          {/* Neurotology and Vertigo */}
          <article
            className="rounded-xl bg-blue-400 p-8 shadow-lg"
            itemScope
            itemType="https://schema.org/MedicalProcedure">
            <figure className="mb-4">
              <img
                src={vertigoImage}
                alt="Vertigo treatment icon - Balance disorder and dizziness treatment"
                className="mb-4 h-16 w-16 object-contain brightness-0 invert"
                width="64"
                height="64"
                loading="lazy"
              />
            </figure>
            <h3 className="mb-3 text-2xl font-bold text-white" itemProp="name">
              Vertigo & Balance Disorders
            </h3>
            <p className="text-white" itemProp="description">
              Comprehensive neurotological examination and treatment for
              patients suffering from dizziness, balance disorders and vertigo.
            </p>
          </article>

          {/* Allergy Testing & Immunotherapy */}
          <article
            className="rounded-xl bg-lime-400 p-8 shadow-lg"
            itemScope
            itemType="https://schema.org/MedicalProcedure">
            <figure className="mb-4">
              <i
                className="fa-solid fa-vial-circle-check text-5xl text-gray-800"
                aria-label="Allergy testing icon"
                role="img"></i>
            </figure>
            <h3
              className="mb-3 text-2xl font-bold text-gray-800"
              itemProp="name">
              Allergy Testing & Immunotherapy
            </h3>
            <p className="text-gray-800" itemProp="description">
              <strong>Skin prick test / Serum-specific IgE</strong> testing and
              customized immunotherapy for long-term relief from allergic
              conditions.
            </p>
          </article>

          {/* Endoscopic & Advanced Procedures */}
          <article
            className="rounded-xl border-2 border-cyan-400 bg-white p-8 shadow-lg sm:col-span-2 lg:col-span-1 lg:col-start-2"
            itemScope
            itemType="https://schema.org/MedicalProcedure">
            <figure className="mb-4">
              <i
                className="fa-solid fa-microscope text-5xl text-cyan-400"
                aria-label="Endoscopic surgery icon"
                role="img"></i>
            </figure>
            <h3
              className="mb-3 text-2xl font-bold text-gray-800"
              itemProp="name">
              Endoscopic & Advanced Procedures
            </h3>
            <p className="text-gray-600" itemProp="description">
              Modern ENT procedures including nasal endoscopy, laryngoscopy, and
              minimally invasive treatments.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
