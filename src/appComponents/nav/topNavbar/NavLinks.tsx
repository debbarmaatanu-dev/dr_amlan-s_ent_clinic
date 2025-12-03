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
const useActiveHelpers = () => {
  const {pathname} = useLocation();

  const active = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    active(path) ? 'text-blue-600 underline' : 'text-gray-700';

  return {pathname, active, linkClass};
};

// ---------- Types ----------
type NavLinksProps = {
  handleNavClick: (routeName: string) => void;
  isAdmin: boolean;
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>;
};

type MobileLinksProps = {
  handleNavClick: (routeName: string) => void;
  isAdmin: boolean;
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

// ---------- Desktop Nav ----------
export const NavLinks = ({
  handleNavClick,
  isAdmin,
  setShowLogoutModal,
}: NavLinksProps) => {
  const {linkClass, active} = useActiveHelpers();

  return (
    <div className="xxxs:space-x-6 hidden items-center space-x-4 md:flex">
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
      {isAdmin ? (
        <button
          onClick={() => setShowLogoutModal(true)}
          className="xxxs:text-base cursor-pointer text-sm font-medium text-blue-600 transition-all hover:text-blue-800 hover:underline active:scale-95"
          aria-label="Logout button">
          Logout
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
  setShowLogoutModal,
  setMenuOpen,
}: MobileLinksProps) => {
  const {linkClass, active} = useActiveHelpers();

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
      {NAV_ITEMS.map(item => {
        if (item.label === 'Appointment') {
          const isActive = active(item.path);
          return (
            <button
              key={item.route}
              onClick={() => handleMobileNavClick(item.route)}
              className={`cursor-pointer border-b border-gray-200 py-3 pb-5 text-left text-lg font-medium text-white transition-transform duration-180 ease-in-out active:scale-95`}>
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
              className={`cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium ${linkClass(
                item.path,
              )} transition-transform duration-180 ease-in-out active:scale-95`}>
              {item.label}
            </button>
          );
        }
      })}

      {/* Admin / Logout */}
      {isAdmin ? (
        <button
          onClick={handleMobileLogout}
          className="cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium text-blue-600 transition-transform duration-180 ease-in-out active:scale-95">
          Logout
        </button>
      ) : (
        <button
          onClick={() => handleMobileNavClick('admin-login')}
          className={`cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium ${linkClass(
            '/admin-login',
          )} transition-transform duration-180 ease-in-out active:scale-95`}>
          Admin
        </button>
      )}
    </div>
  );
};
