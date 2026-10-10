import React, { useState, useEffect } from 'react';
import axiosClient from './api/axiosClient';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import DeliveryTrackingModal from './components/DeliveryTrackingModal';
import Toast from './components/Toast';
import EventModal from './components/EventModal';
import BookingModal from './components/BookingModal';
import TrainerModal from './components/TrainerModal';
import ProductDetailModal from './components/ProductDetailModal';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import TrainersPage from './pages/TrainersPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';

function App() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('home');
  const [events, setEvents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected entities for modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initial fetch of data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, facilitiesRes, trainersRes, productsRes] = await Promise.all([
        axiosClient.get('/events'),
        axiosClient.get('/bookings/facilities'),
        axiosClient.get('/trainers'),
        axiosClient.get('/products'),
      ]);

      setEvents(eventsRes.data);
      setFacilities(facilitiesRes.data);
      setTrainers(trainersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error fetching initial platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Event handlers
  const handleJoinEvent = async (event) => {
    if (!isAuthenticated) {
      showToast('Please sign in to register for this event', 'info');
      setActiveTab('login');
      return;
    }

    try {
      const res = await axiosClient.post(`/events/${event._id}/join`);
      showToast(`Registered for ${event.title}!`, 'success');
      // Update local state
      setEvents((prev) =>
        prev.map((e) =>
          e._id === event._id
            ? {
                ...e,
                participantsCount: e.participantsCount + 1,
                registeredUsers: [...(e.registeredUsers || []), user._id],
              }
            : e
        )
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to join event', 'error');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await axiosClient.post(`/events/${eventId}/leave`);
      showToast('Unregistered from event', 'info');
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? {
                ...e,
                participantsCount: Math.max(0, e.participantsCount - 1),
                registeredUsers: (e.registeredUsers || []).filter(
                  (u) => (typeof u === 'string' ? u : u._id) !== user._id
                ),
              }
            : e
        )
      );
    } catch (err) {
      showToast('Failed to cancel event registration', 'error');
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleBookingSuccess = () => {
    // Optionally trigger refreshes or switch tab
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification Container */}
      <Toast />

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body with Smooth Page Enter Transitions */}
      <main key={activeTab} className="flex-1 animate-page-enter">
        {loading ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Connecting to AeroSport Servers...
            </p>
          </div>
        ) : activeTab === 'home' ? (
          <HomePage
            events={events}
            facilities={facilities}
            trainers={trainers}
            products={products}
            setActiveTab={setActiveTab}
            onSelectEvent={setSelectedEvent}
            onJoinEvent={handleJoinEvent}
            onLeaveEvent={handleLeaveEvent}
            onBookFacility={setSelectedFacility}
            onSelectTrainer={setSelectedTrainer}
            onSelectProduct={setSelectedProduct}
          />
        ) : activeTab === 'events' ? (
          <EventsPage
            events={events}
            onSelectEvent={setSelectedEvent}
            onJoinEvent={handleJoinEvent}
            onLeaveEvent={handleLeaveEvent}
            onEventCreated={handleEventCreated}
          />
        ) : activeTab === 'facilities' ? (
          <FacilitiesPage
            facilities={facilities}
            onBookFacility={setSelectedFacility}
          />
        ) : activeTab === 'trainers' ? (
          <TrainersPage
            trainers={trainers}
            onSelectTrainer={setSelectedTrainer}
          />
        ) : activeTab === 'shop' ? (
          <ShopPage
            products={products}
            onSelectProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
            onCloseProductModal={() => setSelectedProduct(null)}
          />
        ) : activeTab === 'login' ? (
          <LoginPage setActiveTab={setActiveTab} />
        ) : activeTab === 'register' ? (
          <RegisterPage setActiveTab={setActiveTab} />
        ) : activeTab === 'profile' ? (
          <ProfilePage setActiveTab={setActiveTab} />
        ) : activeTab === 'seller' ? (
          <SellerDashboardPage setActiveTab={setActiveTab} />
        ) : (
          <HomePage
            events={events}
            facilities={facilities}
            trainers={trainers}
            products={products}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modals & Drawers */}
      <CartDrawer
        onNavigateToOrders={() => setActiveTab('profile')}
      />
      <DeliveryTrackingModal />

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onJoin={handleJoinEvent}
        onLeave={handleLeaveEvent}
      />

      <BookingModal
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      <TrainerModal
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProductUpdated={(updated) => {
          setSelectedProduct(updated);
          setProducts((prev) => prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)));
        }}
      />
    </div>
  );
}

export default App;
