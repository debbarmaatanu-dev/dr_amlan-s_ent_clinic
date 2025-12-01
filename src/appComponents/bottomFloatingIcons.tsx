import {useEffect, useState} from 'react';

export const WhatsAppIcon = () => {
  const [showButton, setShowButton] = useState(false);

  // Add a slight delay before showing the button for a smoother experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showButton) return null;

  return (
    <div className="fixed bottom-5 left-6 z-50 flex items-center justify-center sm:bottom-25 lg:bottom-5">
      {/* Multiple animated rings with different delays */}
      <div
        className="absolute h-15 w-15 animate-ping rounded-full bg-green-500 opacity-50"
        style={{animationDelay: '1.8s', animationDuration: '2s'}}></div>

      {/* WhatsApp button */}
      <a
        href="https://wa.me/916033521499" // replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-green-600 active:scale-90"
        aria-label="Chat on WhatsApp">
        <div className="relative flex h-7 w-7 items-center justify-center">
          <i className="fa-brands fa-whatsapp fa-2x absolute text-white"></i>
        </div>
      </a>
    </div>
  );
};

export const UpArrowIcon = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to handle scrolling to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Track scroll position to show/hide button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Clean up event listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Don't render the button if it shouldn't be visible
  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-5 z-50 flex items-center justify-center sm:bottom-25 lg:bottom-5">
      <button
        onClick={scrollToTop}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-600 active:scale-90"
        aria-label="Chat on WhatsApp">
        <div className="relative flex h-7 w-7 items-center justify-center">
          <i className="fa-solid fa-arrow-up absolute text-lg font-medium text-white"></i>
        </div>
      </button>
    </div>
  );
};
