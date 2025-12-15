import {useTheme} from '@/hooks/useTheme';

export const FeaturesSection = () => {
  const {actualTheme} = useTheme();
  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-500';
  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-white';

  return (
    <section
      className={`${bgColor} py-16`}
      aria-labelledby="features-heading"
      role="region">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h2
            id="features-heading"
            className={`text-3xl font-bold ${textColor} mb-4`}>
            Why Choose Our ENT Clinic
          </h2>
          <p className={`text-lg ${textColor} opacity-80`}>
            Comprehensive care with experienced professionals
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3" role="list">
          {/* Experienced ENT Specialist */}
          <article className="text-center" role="listitem">
            <header className="mb-4">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100"
                aria-hidden="true">
                <i className="fa-solid fa-user-md text-2xl text-cyan-500"></i>
              </div>
              <h3
                className={`text-foreground ${textColor} mb-2 text-xl font-bold`}>
                Experienced ENT Specialist
              </h3>
            </header>
            <p className={`text-muted-foreground ${textColor}`}>
              Dedicated evaluation and treatment from a qualified ENT surgeon
              with clinical and military medical experience.
            </p>
          </article>

          {/* Streamlined Appointments */}
          <article className="text-center" role="listitem">
            <header className="mb-4">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-200"
                aria-hidden="true">
                <i className="fa-solid fa-clock text-2xl text-lime-500"></i>
              </div>
              <h3
                className={`text-foreground mb-2 text-xl font-bold ${textColor}`}>
                Streamlined Appointments
              </h3>
            </header>
            <p className={`text-muted-foreground ${textColor}`}>
              Quick, hassle-free scheduling with minimal waiting time.
            </p>
          </article>

          {/* Flexible Timing */}
          <article className="text-center" role="listitem">
            <header className="mb-4">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100"
                aria-hidden="true">
                <i className="fa-solid fa-calendar-check text-2xl text-cyan-500"></i>
              </div>
              <h3
                className={`text-foreground mb-2 text-xl font-bold ${textColor}`}>
                Flexible Timing
              </h3>
            </header>
            <p className={`text-muted-foreground ${textColor}`}>
              Evening consultations available to accommodate working individuals
              and families.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
