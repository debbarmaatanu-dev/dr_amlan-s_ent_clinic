import {Fragment, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {appStore} from '@/appStore/appStore';
import {auth} from '@/services/firebase';
import {LogoSection} from './LogoSection';
import {NavLinks} from './NavLinks';
import {MobileMenu} from './MobileMenu';
import {LogoutModal} from './LogoutModal';
import styles from './clock.module.css';
import {useTheme} from '@/hooks/useTheme';
import {logger} from '@/utils/logger';
import type {ActualTheme} from '@/appStore/themeSlice';
import {
  getNavbarScheduleStatus,
  shouldPinClosedStatusBanner,
} from '@/constants/clinicSchedule';

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
  const authInitialized = appStore(state => state.authInitialized);
  const setMobileNavOpen = appStore(state => state.setMobileNavOpen);
  const {actualTheme} = useTheme();

  const allowedAdminEmails: string[] = [
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL1,
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL2,
  ];

  // Check if user is admin, but default to false during initial load
  const isAdmin = user ? allowedAdminEmails.includes(user.email || '') : false;

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [now, setNow] = useState(new Date());

  // Refs for clock hands — avoids document.querySelector forced reflow
  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);

  // Use clinic status from global store
  const clinicStatus = appStore(state => state.clinicStatus);
  const clinicStatusLoaded = appStore(state => state.clinicStatusLoaded);
  const fetchClinicStatus = appStore(state => state.fetchClinicStatus);

  useEffect(() => {
    if (menuOpen) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const handleHomeClick = () => {
    if (
      window.location.pathname !== '/home' &&
      window.location.pathname !== '/'
    ) {
      setTimeout(() => {
        void navigation('/home');
        scrollTo(0, 0);
      }, 250);
    }
  };

  const handleNavClick = (routeName: string) => {
    setTimeout(() => {
      void navigation('/' + routeName);
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
      logger.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  // 1) clock hand animation — uses refs to avoid document.querySelector forced reflow
  useEffect(() => {
    const setClock = () => {
      if (!hourHandRef.current || !minuteHandRef.current) return;
      const d = new Date();
      const hours = d.getHours() % 12;
      const minutes = d.getMinutes();
      const hourDeg = hours * 30 + minutes * 0.5;
      const minuteDeg = minutes * 6;
      hourHandRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
      minuteHandRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
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

  // 3) fetch clinic status from global store
  useEffect(() => {
    if (!clinicStatusLoaded) {
      void fetchClinicStatus();
    }

    // Set up interval to refresh clinic status every 5 minutes
    const statusInterval = setInterval(
      () => {
        void fetchClinicStatus();
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(statusInterval);
    };
  }, [clinicStatusLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleStatus = getNavbarScheduleStatus(now);

  // Determine clinic status banner (admin override takes priority)
  let isManuallyOverridden = false;
  let isOpen = false;

  if (clinicStatus?.isManuallyOverridden) {
    isManuallyOverridden = true;
  } else {
    isOpen =
      scheduleStatus === 'open-sunday' || scheduleStatus === 'open-evening';
  }

  const bgColor = isManuallyOverridden
    ? `bg-red-500/90`
    : isOpen
      ? `bg-[#22B0E6]`
      : `bg-orange-500/90`;

  const pinClosedBanner = shouldPinClosedStatusBanner(
    scheduleStatus,
    isManuallyOverridden,
  );
  const NavShell = pinClosedBanner ? 'div' : Fragment;
  const navShellProps = pinClosedBanner
    ? {
        className: 'sticky top-0 z-50 w-full max-w-screen overflow-x-hidden',
      }
    : {};
  const navClassName = pinClosedBanner
    ? `w-full max-w-screen overflow-x-hidden ${getBGColor(actualTheme)}`
    : `sticky top-0 z-50 w-full max-w-screen overflow-x-hidden ${getBGColor(actualTheme)}`;

  return (
    <>
      <NavShell {...navShellProps}>
        {/* Top Information Banner */}
        <header className={`text-md ${bgColor} py-2 text-white`} role="banner">
          <div className="container mx-auto flex flex-col flex-wrap items-center justify-between gap-2 px-4 text-sm sm:flex-row sm:gap-0">
            <section aria-labelledby="contact-info">
              <h2 id="contact-info" className="sr-only">
                Contact Information
              </h2>
              <div className="flex items-center gap-4">
                <a
                  href="tel:+916033521499"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 focus:outline-none"
                  aria-label="Call us at +91 6033521499">
                  <i
                    className="fa-solid fa-phone h-3 w-3"
                    aria-hidden="true"></i>
                  <span className="xs:inline hidden">Call:</span>
                  <span className="font-semibold">+91 6033521499</span>
                </a>
              </div>
            </section>

            <section aria-labelledby="clinic-hours">
              <h2 id="clinic-hours" className="sr-only">
                Clinic Hours and Status
              </h2>
              <div className="flex items-center gap-2">
                <div className={styles.clockIcon} aria-hidden="true">
                  <div
                    ref={hourHandRef}
                    className={`${styles.hand} ${styles.hourHand}`}></div>
                  <div
                    ref={minuteHandRef}
                    className={`${styles.hand} ${styles.minuteHand}`}></div>
                </div>

                {isManuallyOverridden ? (
                  <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                    <span
                      className="text-md font-bold"
                      role="status"
                      aria-live="polite">
                      <i
                        className="fa-solid fa-ban mr-1"
                        aria-hidden="true"></i>
                      Temporarily Closed
                    </span>
                    {clinicStatus?.closedTill ? (
                      <span className="text-xs font-medium">
                        Until{' '}
                        {new Date(
                          clinicStatus.closedTill + 'T00:00:00',
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    ) : (
                      <span className="text-xs font-medium">
                        Until further notice
                      </span>
                    )}
                  </div>
                ) : scheduleStatus === 'open-sunday' ? (
                  <div role="status" aria-live="polite">
                    <span className="text-md font-semibold">Open:</span>
                    <span className="font-semibold">10:30am - 1:00pm</span>
                    <span className="ml-2 text-xs font-medium">(Sunday)</span>
                  </div>
                ) : scheduleStatus === 'open-evening' ? (
                  <div role="status" aria-live="polite">
                    <span className="text-md font-semibold">Open:</span>
                    <span className="font-semibold">6:00pm - 8:30pm</span>
                  </div>
                ) : scheduleStatus === 'closed-wednesday' ? (
                  <span
                    className="text-md font-bold"
                    role="status"
                    aria-live="polite">
                    Closed on Wednesdays
                  </span>
                ) : scheduleStatus === 'closed-second-fourth-saturday' ? (
                  <span
                    className="text-md font-bold"
                    role="status"
                    aria-live="polite">
                    Closed today (2nd / 4th Saturday)
                  </span>
                ) : scheduleStatus === 'closed-sunday-off-hours' ? (
                  <div role="status" aria-live="polite">
                    <span className="text-md font-bold">
                      Closed right now. Opens:
                    </span>
                    <span className="font-semibold"> 10:30am</span>
                    <span className="ml-1 text-xs font-medium">(Sunday)</span>
                  </div>
                ) : (
                  <div role="status" aria-live="polite">
                    <span className="text-md font-bold">
                      Closed right now. Opens:
                    </span>
                    <span className="font-semibold"> 6:00pm</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </header>

        <nav
          className={navClassName}
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
                  aria-controls="mobile-menu"
                  className={`${actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'} flex min-h-11 min-w-11 items-center justify-center transition-transform duration-180 ease-in-out focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none active:scale-95 md:hidden`}
                  onClick={() => {
                    setTimeout(() => {
                      setMenuOpen(true);
                    }, 200);
                  }}>
                  <i
                    className="fa-solid fa-bars text-xl"
                    aria-hidden="true"></i>
                </button>

                {/* Desktop Nav Links */}
                <NavLinks
                  handleNavClick={handleNavClick}
                  isAdmin={isAdmin}
                  authInitialized={authInitialized}
                  setShowLogoutModal={setShowLogoutModal}
                  actualTheme={actualTheme}
                />
              </div>
            </div>
          </div>
        </nav>
      </NavShell>

      {/* Mobile Menu */}
      {menuOpen && (
        <MobileMenu
          setMenuOpen={setMenuOpen}
          handleNavClick={handleNavClick}
          isAdmin={isAdmin}
          authInitialized={authInitialized}
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
