import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";

import Home from "./pages/Home";
import BuyTicket from "./pages/BuyTicket";
import PaymentSuccess from "./pages/PaymentSuccess";

import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/components/Dashboard";
import Attendees from "./admin/components/Attendees";
import QRScanner from "./admin/components/Scanner";
import Settings from "./admin/components/Settings";
import ProtectedRoute from "./admin/components/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  // Hide Navbar & Footer on all admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {!isAdminRoute && <ScrollToHash />}

      <main className={!isAdminRoute ? "pt-20 min-h-screen bg-black" : "min-h-screen bg-black"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/buy-ticket" element={<BuyTicket />} />
          <Route
            path="/payment-success"
            element={<PaymentSuccess />}
          />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Attendees */}
          <Route
            path="/admin/attendees"
            element={
              <ProtectedRoute>
                <Attendees />
              </ProtectedRoute>
            }
          />

          {/* QR Scanner */}
          <Route
            path="/admin/scanner"
            element={
              <ProtectedRoute>
                <QRScanner />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default AppContent;