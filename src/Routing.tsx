import React, {useEffect, useState} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import {WhatsAppIcon, UpArrowIcon} from './appComponents/bottomFloatingIcons';
import {Home} from './pages/Home';
import {NavBar} from './appComponents/nav/topNavbar/Navbar';
import {Footer} from './appComponents/nav/footer/Footer';
import {About} from './pages/About';
import {Contact} from './pages/Contact';
import {PrivacyPolicy} from './pages/PrivacyPolicy';
import {Appointment} from './pages/Appointment';
import {ProtectedRoute} from './appComponents/ProtectedRoute';
import {Login} from './pages/Login';

// Placeholder component for routes without content yet
// const PlaceholderPage = ({title}: {title: string}) => {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
//       <div className="text-center">
//         <h1 className="mb-4 text-4xl font-bold text-gray-800">{title}</h1>
//         <p className="mb-8 text-lg text-gray-600">
//           This page is under construction.
//         </p>
//         <p className="text-gray-500">Content will be added soon.</p>
//       </div>
//     </div>
//   );
// };

const Routing = () => {
  const [floatingIconVisible, setFloatingIconVisible] = useState<boolean>(true);

  return (
    <Router>
      <RoutesWrapper
        floatingIconVisible={floatingIconVisible}
        setFloatingIconVisible={setFloatingIconVisible}
      />
    </Router>
  );
};

const RoutesWrapper = ({
  floatingIconVisible,
  setFloatingIconVisible,
}: {
  floatingIconVisible: boolean;
  setFloatingIconVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();

  // Check if the current path is "/pdf-viewer"
  const hiddenRoutes = ['/admin-login', '/payment-confirmation'];
  const currentDisAllowedIcon = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    if (currentDisAllowedIcon) {
      setFloatingIconVisible(false);
    } else {
      setFloatingIconVisible(true);
    }
  }, [currentDisAllowedIcon]);

  return (
    <div className="flex min-h-screen w-full max-w-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/home'} element={<Home />} />
          <Route path={'/about'} element={<About />} />
          <Route path={'/contact'} element={<Contact />} />
          <Route path={'/privacy-policy'} element={<PrivacyPolicy />} />
          <Route path={'/appointment'} element={<Appointment />} />
          <Route
            path={'/admin-login'}
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />

      {/* Conditionally render floating icons */}
      {floatingIconVisible && <WhatsAppIcon />}
      {floatingIconVisible && <UpArrowIcon />}
    </div>
  );
};

export default Routing;
