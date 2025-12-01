export const FeaturesSection = () => {
  return (
    <section className="bg-white py-16" aria-label="Why choose our ENT clinic">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Experienced ENT Specialist */}
          <article className="text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100"
              aria-hidden="true">
              <i className="fa-solid fa-user-md text-2xl text-cyan-500"></i>
            </div>
            <h3 className="text-foreground mb-2 text-xl font-bold">
              Experienced ENT Specialist
            </h3>
            <p className="text-muted-foreground">
              Dedicated evaluation and treatment from a qualified ENT surgeon
              with clinical and military medical experience.
            </p>
          </article>

          {/* Streamlined Appointments */}
          <article className="text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-200"
              aria-hidden="true">
              <i className="fa-solid fa-clock text-2xl text-lime-500"></i>
            </div>
            <h3 className="text-foreground mb-2 text-xl font-bold">
              Streamlined Appointments
            </h3>
            <p className="text-muted-foreground">
              Quick, hassle-free scheduling with minimal waiting time.
            </p>
          </article>

          {/* Flexible Timing */}
          <article className="text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100"
              aria-hidden="true">
              <i className="fa-solid fa-calendar-check text-2xl text-cyan-500"></i>
            </div>
            <h3 className="text-foreground mb-2 text-xl font-bold">
              Flexible Timing
            </h3>
            <p className="text-muted-foreground">
              Evening consultations available to accommodate working individuals
              and families.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
