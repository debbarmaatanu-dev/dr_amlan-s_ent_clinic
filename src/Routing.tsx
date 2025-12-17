import React, {useEffect, useState, Suspense, lazy} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import {WhatsAppIcon, UpArrowIcon} from './appComponents/bottomFloatingIcons';
import {NavBar} from './appComponents/nav/topNavbar/Navbar';
import {Footer} from './appComponents/nav/footer/Footer';
import {ProtectedRoute} from './appComponents/ProtectedRoute';

// Lazy load pages for better code splitting
const Home = lazy(() =>
  import('./pages/Home').then(module => ({default: module.Home})),
);
const About = lazy(() =>
  import('./pages/About').then(module => ({default: module.About})),
);
const Contact = lazy(() =>
  import('./pages/Contact').then(module => ({default: module.Contact})),
);
const PrivacyPolicy = lazy(() =>
  import('./pages/PrivacyPolicy').then(module => ({
    default: module.PrivacyPolicy,
  })),
);
const FAQ = lazy(() =>
  import('./pages/FAQ').then(module => ({default: module.FAQ})),
);
const Appointment = lazy(() =>
  import('./pages/Appointment').then(module => ({default: module.Appointment})),
);
const Login = lazy(() =>
  import('./pages/Login').then(module => ({default: module.Login})),
);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDisAllowedIcon]);

  return (
    <div className="flex min-h-screen w-full max-w-screen flex-col">
      <NavBar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }>
          <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/home'} element={<Home />} />
            <Route path={'/about'} element={<About />} />
            <Route path={'/contact'} element={<Contact />} />
            <Route path={'/privacy-policy'} element={<PrivacyPolicy />} />
            <Route path={'/faq'} element={<FAQ />} />
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
        </Suspense>
      </main>
      <Footer />

      {/* Conditionally render floating icons */}
      {floatingIconVisible && <WhatsAppIcon />}
      {floatingIconVisible && <UpArrowIcon />}
    </div>
  );
};

export default Routing;
