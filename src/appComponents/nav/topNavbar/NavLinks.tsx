import type {ActualTheme} from '@/appStore/themeSlice';
import {ThemeToggler} from '@/components/ThemeToggler';
import {type Dispatch, type SetStateAction} from 'react';
import {useLocation} from 'react-router-dom';

// ---------- Shared Nav Config ----------
const NAV_ITEMS = [
  {label: 'Home', route: 'home', path: '/home'},
  {
    label: 'Appointment',
    route: 'appointment',
    path: '/appointment',
  },
  {label: 'About', route: 'about', path: '/about'},
  {label: 'Contact', route: 'contact', path: '/contact'},
  {label: 'Admin', route: 'admin-login', path: '/admin-login'},
];

// ---------- Shared Helpers ----------
const useActiveHelpers = (actualTheme: ActualTheme) => {
  const {pathname} = useLocation();

  const active = (path: string) => {
    // Handle home route special case
    if (path === '/home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname === path;
  };

  const linkClass = (path: string) => {
    if (active(path) && actualTheme === 'light') {
      return 'text-blue-600 underline';
    } else if (!active(path) && actualTheme === 'light') {
      return 'text-gray-700';
    } else if (active(path) && actualTheme === 'dark') {
      return 'text-blue-600 underline';
    } else if (!active(path) && actualTheme === 'dark') {
      return 'text-gray-200';
    }
  };

  return {pathname, active, linkClass};
};

// ---------- Types ----------
type NavLinksProps = {
  handleNavClick: (routeName: string) => void;
  isAdmin: boolean;
  authInitialized: boolean;
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>;
  actualTheme: ActualTheme;
};

type MobileLinksProps = {
  handleNavClick: (routeName: string) => void;
  isAdmin: boolean;
  authInitialized: boolean;
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  actualTheme: ActualTheme;
};

// ---------- Desktop Nav ----------
export const NavLinks = ({
  handleNavClick,
  isAdmin,
  authInitialized,
  setShowLogoutModal,
  actualTheme,
}: NavLinksProps) => {
  const {linkClass, active} = useActiveHelpers(actualTheme);

  return (
    <div className="xxxs:space-x-6 hidden items-center space-x-4 md:flex">
      {/* Theme Toggler */}
      <ThemeToggler />
      {NAV_ITEMS.filter(item => item.label !== 'Admin').map(item => {
        if (item.label !== 'Appointment') {
          return (
            <button
              key={item.route}
              onClick={() => handleNavClick(item.route)}
              className={`xxxs:text-base cursor-pointer text-sm font-medium ${linkClass(
                item.path,
              )} transition-all hover:text-blue-600 hover:underline active:scale-95`}
              aria-label={`${item.label.toLowerCase()} nav-link`}>
              {item.label}
            </button>
          );
        } else {
          const isActive = active(item.path);

          return (
            <button
              key={item.route}
              onClick={() => handleNavClick(item.route)}
              className={`cursor-pointer rounded-md px-2 py-2 text-white shadow-md transition-transform duration-180 active:scale-95 ${isActive ? 'bg-purple-700' : 'bg-blue-600'}`}
              aria-label={`${item.label.toLowerCase()} nav-link`}>
              <span className="text-md text-center font-medium md:text-base">
                {item.label}
              </span>
            </button>
          );
        }
      })}

      {/* Admin / Logout */}
      {!authInitialized ? (
        // Show subtle loading indicator only for admin section
        <div className="flex items-center">
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
        </div>
      ) : isAdmin ? (
        <button
          onClick={() => setShowLogoutModal(true)}
          className="xxxs:text-base cursor-pointer text-sm font-medium text-white transition-all hover:underline active:scale-95"
          aria-label="Logout button">
          <span className="rounded-md bg-orange-500 px-2 py-2.5">Logout</span>
        </button>
      ) : (
        <button
          onClick={() => handleNavClick('admin-login')}
          className={`xxxs:text-base cursor-pointer text-sm font-medium ${linkClass(
            '/admin-login',
          )} transition-all hover:text-blue-600 hover:underline active:scale-95`}
          aria-label="admin-login nav-link">
          Admin
        </button>
      )}
    </div>
  );
};

// ---------- Mobile Nav ----------
export const MobileLinks = ({
  handleNavClick,
  isAdmin,
  authInitialized,
  setShowLogoutModal,
  setMenuOpen,
  actualTheme,
}: MobileLinksProps) => {
  const {linkClass, active} = useActiveHelpers(actualTheme);

  const handleMobileNavClick = (routeName: string) => {
    setMenuOpen(false);
    handleNavClick(routeName);
  };

  const handleMobileLogout = () => {
    setMenuOpen(false);
    setShowLogoutModal(true);
  };

  return (
    <div className="mt-8 flex flex-col space-y-4">
      {/* Theme Toggler */}
      <div className="flex w-[60%] items-center justify-start">
        <ThemeToggler />
      </div>
      {NAV_ITEMS.map(item => {
        if (item.label === 'Appointment') {
          const isActive = active(item.path);
          return (
            <button
              key={item.route}
              onClick={() => handleMobileNavClick(item.route)}
              className={`cursor-pointer border-b border-gray-400 py-3 pb-5 text-left text-lg font-medium text-white transition-transform duration-180 ease-in-out active:scale-95`}>
              <span
                className={`rounded-md px-2 py-2 ${isActive ? 'bg-purple-700' : 'bg-blue-600'}`}>
                {item.label}
              </span>
            </button>
          );
        } else {
          return (
            <button
              key={item.route}
              onClick={() => handleMobileNavClick(item.route)}
              className={`cursor-pointer border-b border-gray-400 py-3 text-left text-lg font-medium ${linkClass(
                item.path,
              )} transition-transform duration-180 ease-in-out active:scale-95`}>
              {item.label}
            </button>
          );
        }
      })}

      {/* Admin / Logout */}
      {!authInitialized ? (
        // Show subtle loading indicator only for admin section
        <div className="flex items-center border-b border-gray-400 py-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
          <span className="ml-2 text-sm text-gray-400">Loading...</span>
        </div>
      ) : isAdmin ? (
        <button
          onClick={handleMobileLogout}
          className="cursor-pointer border-b border-gray-400 pt-3 pb-5 text-left text-lg font-medium text-white transition-transform duration-180 ease-in-out active:scale-95">
          <span className="rounded-md bg-orange-500 px-2 py-2">Logout</span>
        </button>
      ) : (
        <button
          onClick={() => handleMobileNavClick('admin-login')}
          className={`cursor-pointer border-b border-gray-400 py-3 text-left text-lg font-medium ${linkClass(
            '/admin-login',
          )} transition-transform duration-180 ease-in-out active:scale-95`}>
          Admin
        </button>
      )}
    </div>
  );
};
