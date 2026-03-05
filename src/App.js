import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✂️ Removed unused useLocation
import { GoogleAuthProvider } from './utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import MyBookings from './pages/MyBookings';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import CreateListing from './pages/CreateListing';
import Help from './pages/Help';
import Login from './pages/Login';

// Layout
import Layout from './components/Layout';

// Debug Wrapper
const DebugWrapper = ({ children, routeName }) => {
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(false);
    setError(null);

    try {
      // Simulate component load
      setHasLoaded(true);
    } catch (err) {
      setError(err.message);
    }
  }, [routeName]);

  if (error) {
    return (
      <div className="p-5 text-danger">
        <h3>🚨 Error in {routeName}</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!hasLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading {routeName}...</span>
          </div>
          <p className="mt-3">Loading {routeName}...</p>
        </div>
      </div>
    );
  }

  return children;
};

// Route Wrapper
const RouteWrapper = ({ children, routeName }) => {
  return (
    <DebugWrapper routeName={routeName} key={routeName}> {/* 💡 Added key for route-based remounting */}
      {children}
    </DebugWrapper>
  );
};

function AppContent() {
  // ✂️ REMOVED: const location = useLocation(); — was unused

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RouteWrapper routeName="Home"><Home /></RouteWrapper>} />
        <Route path="/properties" element={<RouteWrapper routeName="Properties"><Properties /></RouteWrapper>} />
        <Route path="/property/:id" element={<RouteWrapper routeName="PropertyDetails"><PropertyDetails /></RouteWrapper>} />
        <Route path="/my-bookings" element={<RouteWrapper routeName="MyBookings"><MyBookings /></RouteWrapper>} />
        <Route path="/my-properties" element={<RouteWrapper routeName="MyProperties"><MyProperties /></RouteWrapper>} />
        <Route path="/add-property" element={<RouteWrapper routeName="AddProperty"><AddProperty /></RouteWrapper>} />
        <Route path="/create-listing" element={<RouteWrapper routeName="CreateListing"><CreateListing /></RouteWrapper>} />
        <Route path="/help" element={<RouteWrapper routeName="Help"><Help /></RouteWrapper>} />
        {/* ✂️ REMOVED DUPLICATE: <Route path="/login" element={<Login />} /> */}
        <Route path="/login" element={<RouteWrapper routeName="Login"><Login /></RouteWrapper>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <GoogleAuthProvider>
      <Router>
        <AppContent />
      </Router>
    </GoogleAuthProvider>
  );
}

export default App;