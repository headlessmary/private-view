import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";

import Home from "./pages/Home";
import EventHub from "./pages/EventHub";
import EventHome from "./pages/EventHome";
import {
  HeadlessSociety,
  NoCurrentEvents,
  SocietyNavbar,
} from "./pages/EventLanding";
import BuyTicket from "./pages/BuyTicket";
import PaymentSuccess from "./pages/PaymentSuccess";

import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/components/Dashboard";
import Attendees from "./admin/components/Attendees";
import QRScanner from "./admin/components/Scanner";
import Settings from "./admin/components/Settings";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import PageTracker from "./components/PageTracker";

import { fetchCurrentEvent } from "./services/eventConfig";

function HomeEntry() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let initialLoad = true;

    const loadCurrentEvent = async () => {
      try {
        const currentEvent = await fetchCurrentEvent();

        if (isMounted) {
          setEvent(currentEvent);
          setLoadError("");
        }
      } catch (error) {
        console.error("Unable to load current event:", error);

        if (isMounted) {
          setLoadError(error.message || "Unable to determine the current event.");
        }
      } finally {
        if (isMounted && initialLoad) {
          setLoading(false);
          initialLoad = false;
        }
      }
    };

    loadCurrentEvent();
    const refreshId = window.setInterval(loadCurrentEvent, 30_000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshId);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (loadError && !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-5 text-center text-white">
        <p role="alert">Unable to load the current event: {loadError}</p>
      </div>
    );
  }

  // An active event exists.
  if (event) {
    return <EventHome event={event} />;
  }

  // No active event.
  // Show the permanent HEADLESSMARY homepage.
  return <EventHub />;
}

function AppContent() {
  const location = useLocation();

  // Hide Navbar & Footer on all admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  const isSocietyRoute = [
    "/headless-society",
    "/buy-ticket",
    "/payment-success",
  ].includes(location.pathname);

  const isSocietyPage = location.pathname === "/headless-society";

  const isHubRoute = location.pathname === "/";

  const hasNavbar =
    !isAdminRoute && !isHubRoute && (!isSocietyRoute || isSocietyPage);

  return (
    <>
      <PageTracker />

      {!isAdminRoute && !isSocietyRoute && !isHubRoute && <Navbar />}

      {isSocietyPage && <SocietyNavbar />}

      {!isAdminRoute && <ScrollToHash />}

      <main
        className={
          hasNavbar ? "pt-20 min-h-screen bg-black" : "min-h-screen bg-black"
        }
      >
        <Routes>
          {/* Permanent HEADLESSMARY entry point */}
          <Route path="/" element={<HomeEntry />} />

          {/* Existing Private View event */}
          <Route path="/private-view" element={<Home />} />

          {/* Headless Society */}
          <Route path="/headless-society" element={<HeadlessSociety />} />

          {/* No current event */}
          <Route path="/no-events" element={<NoCurrentEvents />} />

          {/* Ticket purchase */}
          <Route path="/buy-ticket" element={<BuyTicket />} />

          {/* Payment success */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

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

      {!isAdminRoute && !isSocietyRoute && !isHubRoute && <Footer />}
    </>
  );
}

export default AppContent;
