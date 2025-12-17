import {useTheme} from '@/hooks/useTheme';
import {useNavigate} from 'react-router-dom';

export const FAQSection = () => {
  const {actualTheme} = useTheme();
  const navigate = useNavigate();

  const bgColor = actualTheme === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-white';
  const cardBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-600';

  const quickFAQs = [
    {
      question: 'What are the clinic timings?',
      answer: '6:00 PM - 8:30 PM (Mon-Sat)',
      icon: 'fa-clock',
    },
    {
      question: 'What is the consultation fee?',
      answer: '₹400 (Fixed)',
      icon: 'fa-indian-rupee-sign',
    },
    {
      question: 'How to book an appointment?',
      answer: 'Online or walk-in at clinic',
      icon: 'fa-calendar-check',
    },
  ];

  const handleViewAllFAQs = () => {
    void navigate('/faq');
    window.scrollTo(0, 0);
  };

  return (
    <section
      className={`${bgColor} py-16`}
      aria-labelledby="faq-section-heading"
      role="region">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h2
            id="faq-section-heading"
            className={`text-3xl font-bold ${textColor} mb-4`}>
            Quick Answers
          </h2>
          <p className={`text-lg ${textColor} opacity-80`}>
            Common questions about our clinic
          </p>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3" role="list">
          {quickFAQs.map((faq, index) => (
            <article
              key={index}
              className={`${cardBg} rounded-lg p-6 shadow-md`}
              role="listitem">
              <div className="mb-4 flex items-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
                  aria-hidden="true">
                  <i
                    className={`fa-solid ${faq.icon} text-xl text-blue-600`}></i>
                </div>
              </div>
              <h3 className={`text-lg font-semibold ${textColor} mb-2`}>
                {faq.question}
              </h3>
              <p className={`${textColor} opacity-80`}>{faq.answer}</p>
            </article>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleViewAllFAQs}
            className="cursor-pointer rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 hover:shadow-lg"
            aria-label="View all frequently asked questions">
            View All FAQs
            <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </section>
  );
};
