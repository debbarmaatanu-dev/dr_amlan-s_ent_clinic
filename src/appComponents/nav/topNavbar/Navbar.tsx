import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {appStore} from '@/appStore/appStore';
import {auth} from '@/services/firebase';
import {LogoSection} from './LogoSection';
import {NavLinks} from './NavLinks';
import {MobileMenu} from './MobileMenu';
import {LogoutModal} from './LogoutModal';
import styles from './clock.module.css';
import {useTheme} from '@/hooks/useTheme';
import type {ActualTheme} from '@/appStore/themeSlice';

const getBGColor = (actualTheme: ActualTheme) => {
  if (actualTheme === 'light') {
    return 'bg-white shadow-md';
  } else {
    return 'bg-gray-800 shadow-sm shadow-gray-100/50';
  }
};

export const NavBar = () => {
  const navigation = useNavigate();
  const user = appStore(state => state.user);
  const setMobileNavOpen = appStore(state => state.setMobileNavOpen);
  const {actualTheme} = useTheme();

  const allowedAdminEmails: string[] = [
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL1,
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL2,
  ];
  const isAdmin = allowedAdminEmails.includes(user?.email || '');

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (menuOpen) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
  }, [menuOpen]);

  const handleHomeClick = () => {
    if (
      window.location.pathname !== '/home' &&
      window.location.pathname !== '/'
    ) {
      setTimeout(() => {
        navigation('/home');
        scrollTo(0, 0);
      }, 250);
    }
  };

  const handleNavClick = (routeName: string) => {
    setTimeout(() => {
      navigation('/' + routeName);
      scrollTo(0, 0);
    }, 250);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowLogoutModal(false);
      handleNavClick('home');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  // 1) clock hand animation
  useEffect(() => {
    const hourHand = document.querySelector(
      `.${styles.hourHand}`,
    ) as HTMLElement;
    const minuteHand = document.querySelector(
      `.${styles.minuteHand}`,
    ) as HTMLElement;

    const setClock = () => {
      const d = new Date();
      const hours = d.getHours() % 12;
      const minutes = d.getMinutes();

      const hourDeg = hours * 30 + minutes * 0.5;
      const minuteDeg = minutes * 6;

      hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    };

    setClock();
    const interval = setInterval(setClock, 60000);

    return () => clearInterval(interval);
  }, []);

  // 2) update React state for open/closed logic
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 6:00pm = 1080
  // 8:30pm = 1230
  const isOpen = currentMinutes >= 1080 && currentMinutes <= 1230;
  const isSunday = now.getDay() === 0;

  const bgColor = isOpen ? `bg-[#22B0E6]` : `bg-orange-500/90`;

  return (
    <>
      {/* Top Non sitcky Container */}
      <section className={`text-md ${bgColor} py-2 text-white`}>
        <div className="container mx-auto flex flex-col flex-wrap items-center justify-between gap-2 px-4 text-sm sm:flex-row sm:gap-0">
          <div className="flex items-center gap-4">
            <a
              href="tel:+918258839231"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Call us at +91 8258839231">
              <i className="fa-solid fa-phone h-3 w-3" aria-hidden="true"></i>
              <span className="xs:inline hidden">Call:</span>
              <span className="font-semibold">+91 8258839231</span>
            </a>
          </div>
          <div className="flex items-center gap-2" aria-label="Opening hours">
            <div className={styles.clockIcon}>
              <div className={`${styles.hand} ${styles.hourHand}`}></div>
              <div className={`${styles.hand} ${styles.minuteHand}`}></div>
            </div>

            {isSunday ? (
              <>
                <span className="text-md font-bold">Closed on Sundays</span>
              </>
            ) : isOpen ? (
              <>
                <span className="text-md font-semibold">Open:</span>
                <span className="font-semibold">6:00pm- 8:30pm</span>
              </>
            ) : (
              <>
                <span className="text-md font-bold">
                  Closed Right now. Opens:
                </span>
                <span className="font-semibold">6:00pm</span>
              </>
            )}
          </div>
        </div>
      </section>
      <nav
        className={`sticky top-0 z-50 w-full max-w-screen overflow-x-hidden ${getBGColor(actualTheme)}`}
        role="navigation"
        aria-label="Main navigation">
        {/* Navigation Container */}
        <div className="xxxs:px-6 mx-auto w-full max-w-7xl px-6 py-1 lg:px-0">
          <div className="xxxs:h-20 flex h-18 items-center justify-between">
            <LogoSection
              handleHomeClick={handleHomeClick}
              actualTheme={actualTheme}
            />

            {/* Desktop Theme Toggler & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                className={`${actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-transform duration-180 ease-in-out focus:outline-none active:scale-95 md:hidden`}
                onClick={() => {
                  setTimeout(() => {
                    setMenuOpen(true);
                  }, 200);
                }}>
                <i className="fa-solid fa-bars text-xl" aria-hidden="true"></i>
              </button>

              {/* Desktop Nav Links */}
              <NavLinks
                handleNavClick={handleNavClick}
                isAdmin={isAdmin}
                setShowLogoutModal={setShowLogoutModal}
                actualTheme={actualTheme}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <MobileMenu
          setMenuOpen={setMenuOpen}
          handleNavClick={handleNavClick}
          isAdmin={isAdmin}
          setShowLogoutModal={setShowLogoutModal}
          actualTheme={actualTheme}
        />
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          setShowLogoutModal={setShowLogoutModal}
          handleLogout={handleLogout}
          actualTheme={actualTheme}
        />
      )}
    </>
  );
};
