import {type Dispatch, type SetStateAction} from 'react';
import {useLocation} from 'react-router-dom';

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

export const NavLinks = ({
  handleNavClick,
  isAdmin,
  setShowLogoutModal,
}: NavLinksProps) => {
  const location = useLocation();

  const isAbout = location.pathname === '/about';
  const isContact = location.pathname === '/contact';
  const isAdminPage = location.pathname === '/admin-login';

  const textBlueAbout = isAbout ? 'text-blue-600 underline' : 'text-gray-700';
  const textBlueContact = isContact
    ? 'text-blue-600 underline'
    : 'text-gray-700';

  const textBlueAdmin = isAdminPage
    ? 'text-blue-600 underline'
    : 'text-gray-700';
  return (
    <div className="xxxs:space-x-6 hidden items-center space-x-4 md:flex">
      <button
        onClick={() => handleNavClick('about')}
        className={`xxxs:text-base cursor-pointer text-sm font-medium ${textBlueAbout} transition-all hover:text-blue-600 hover:underline active:scale-95`}
        aria-label="about nav-link">
        About
      </button>
      <button
        onClick={() => handleNavClick('contact')}
        className={`xxxs:text-base cursor-pointer text-sm font-medium ${textBlueContact} transition-all hover:text-blue-600 hover:underline active:scale-95`}
        aria-label="contact nav-link">
        Contact
      </button>
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
          className={`xxxs:text-base cursor-pointer text-sm font-medium ${textBlueAdmin} transition-all hover:text-blue-600 hover:underline active:scale-95`}
          aria-label="admin-login nav-link">
          Admin
        </button>
      )}
    </div>
  );
};

export const MobileLinks = ({
  handleNavClick,
  isAdmin,
  setShowLogoutModal,
  setMenuOpen,
}: MobileLinksProps) => {
  const location = useLocation();

  const isAbout = location.pathname === '/about';
  const isContact = location.pathname === '/contact';
  const isAdminPage = location.pathname === '/admin-login';

  const textBlueAbout = isAbout ? 'text-blue-600 underline' : 'text-gray-700';
  const textBlueContact = isContact
    ? 'text-blue-600 underline'
    : 'text-gray-700';

  const textBlueAdmin = isAdminPage
    ? 'text-blue-600 underline'
    : 'text-gray-700';

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
      <button
        onClick={() => handleMobileNavClick('about')}
        className={`cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium ${textBlueAbout} transition-transform duration-180 ease-in-out active:scale-95`}>
        About
      </button>
      <button
        onClick={() => handleMobileNavClick('contact')}
        className={`cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium ${textBlueContact} transition-transform duration-180 ease-in-out active:scale-95`}>
        Contact
      </button>
      {isAdmin ? (
        <button
          onClick={handleMobileLogout}
          className="cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium text-blue-600 transition-transform duration-180 ease-in-out active:scale-95">
          Logout
        </button>
      ) : (
        <button
          onClick={() => handleMobileNavClick('admin-login')}
          className={`cursor-pointer border-b border-gray-200 py-3 text-left text-lg font-medium ${textBlueAdmin} transition-transform duration-180 ease-in-out active:scale-95`}>
          Admin
        </button>
      )}
    </div>
  );
};
