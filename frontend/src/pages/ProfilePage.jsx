import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import axiosClient from '../api/axiosClient';
import {
  User,
  ShoppingBag,
  Calendar,
  Trophy,
  Users,
  Settings,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Package,
  Award,
  Sparkles,
  ArrowRight,
  Edit3,
  Store,
  Camera,
  Upload,
  AtSign,
  Check,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion } from '../utils/regionsData';

const ATHLETE_AVATARS = [
  { label: 'Yuguruvchi', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Sportchi Ayol', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { label: 'Marafonchi', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Murabbiy', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Velopoygachi', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fitnes Chempion', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { label: 'Sprint Sportchisi', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80' },
  { label: 'Futbolchi', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80' },
];

const ProfilePage = ({ setActiveTab }) => {
  const { user, isAuthenticated, isSeller, demoLogin, updateProfile } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [activeSubTab, setActiveSubTab] = useState('orders'); // orders, bookings, events, trainers, edit
  const [orders, setOrders] = useState([]);
  const [bookings, setBookedFacilities] = useState([]);
  const [events, setEvents] = useState([]);
  const [trainerRequests, setTrainerRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Edit profile state (Name, Username, Avatar, etc.)
  const [editData, setEditData] = useState({
    name: '',
    username: '',
    avatar: '',
    phone: '',
    region: 'Toshkent shahri',
    district: 'Chilonzor tumani',
    bio: '',
    fitnessGoal: '',
    height: 175,
    weight: 70,
  });

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        username: user.username || user.email?.split('@')[0] || '',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        phone: user.phone || '',
        region: user.region || 'Toshkent shahri',
        district: user.district || 'Chilonzor tumani',
        bio: user.bio || '',
        fitnessGoal: user.fitnessGoal || '',
        height: user.height || 175,
        weight: user.weight || 70,
      });
    }
  }, [user]);

  // Client-side image resize and compress helper for smooth, instant uploads
  const resizeImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle local avatar file upload & instant save
  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSavingProfile(true);
      const compressedBase64 = await resizeImage(file, 400, 400, 0.85);
      setEditData((prev) => ({ ...prev, avatar: compressedBase64 }));
      await updateProfile({ ...editData, avatar: compressedBase64 });
      showToast("Profil rasmi muvaffaqiyatli saqlandi va yangilandi! 🎉", "success");
      setAvatarModalOpen(false);
    } catch (err) {
      console.error('Failed to update avatar:', err);
      if (err.response?.status === 401) {
        showToast("Sessiya muddati yangilanishi kerak. Iltimos profilingizga qayta kiring (Chiqish -> Kirish)", "error");
      } else {
        showToast(err.response?.data?.message || "Rasmni saqlashda xatolik yuz berdi", "error");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSelectAndSavePreset = async (presetUrl, label) => {
    if (!presetUrl) return;
    try {
      setSavingProfile(true);
      setEditData((prev) => ({ ...prev, avatar: presetUrl }));
      await updateProfile({ ...editData, avatar: presetUrl });
      showToast(`${label || 'Yangi'} rasmi profilga o'rnatildi! 🎉`, 'success');
      setAvatarModalOpen(false);
    } catch (err) {
      console.error('Failed to set preset avatar:', err);
      if (err.response?.status === 401) {
        showToast("Sessiya muddati yangilanishi kerak. Iltimos profilingizga qayta kiring (Chiqish -> Kirish)", "error");
      } else {
        showToast(err.response?.data?.message || "Rasmni saqlashda xatolik yuz berdi", "error");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // Load user data depending on tab
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeSubTab === 'orders') {
          const res = await axiosClient.get('/orders/myorders');
          setOrders(res.data);
        } else if (activeSubTab === 'bookings') {
          const res = await axiosClient.get('/bookings/mybookings');
          setBookedFacilities(res.data);
        } else if (activeSubTab === 'events') {
          const res = await axiosClient.get('/events/my/registrations');
          setEvents(res.data);
        } else if (activeSubTab === 'trainers') {
          const res = await axiosClient.get('/trainers/my/requests');
          setTrainerRequests(res.data);
        }
      } catch (err) {
        console.error('Failed to load user subtab data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, activeSubTab]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axiosClient.put(`/bookings/${bookingId}/cancel`);
      showToast('Booking cancelled successfully', 'info');
      setBookedFacilities((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel', 'error');
    }
  };

  const handleUnregisterEvent = async (eventId) => {
    try {
      await axiosClient.post(`/events/${eventId}/leave`);
      showToast('Unregistered from sports event', 'info');
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      showToast('Failed to unregister', 'error');
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(editData);
      showToast("Profil ma'lumotlari muvaffaqiyatli saqlandi! 🎉", 'success');
      setAvatarModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast("Profilni saqlashda xatolik yuz berdi", 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase italic">
          {t('profile_protected_title')}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          {t('profile_protected_desc')}
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('login')}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
          >
            {t('profile_btn_signin')}
          </button>
          <button
            onClick={async () => {
              await demoLogin();
              showToast('Logged in as demo athlete Alex Johnson!', 'success');
            }}
            className="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('nav_demo_login')}
          </button>
        </div>
      </div>
    );
  }

  const renderSubTabContent = () => {
    if (loading) {
      return (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
          Loading your sports dashboard data...
        </div>
      );
    }

    if (activeSubTab === 'orders') {
      if (orders.length === 0) {
        return (
          <div className="py-16 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">{t('profile_no_orders')}</h3>
            <p className="text-xs text-slate-400">
              Check out our store for running shoes, dumbbells, and athletic apparel.
            </p>
            <button
              onClick={() => setActiveTab('shop')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
            >
              Go to Sports Shop
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Order #{order._id}
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-base font-black text-white">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-900"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} • {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping address footer */}
              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800/80">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Shipping to: {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeSubTab === 'bookings') {
      if (bookings.length === 0) {
        return (
          <div className="py-16 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">{t('profile_no_bookings')}</h3>
            <p className="text-xs text-slate-400">
              Book a mini football field or gym slot for your upcoming training session.
            </p>
            <button
              onClick={() => setActiveTab('facilities')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
            >
              Browse Sports Fields
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {booking.facilityType === 'mini_football' ? '⚽' : '🏟️'}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {booking.facilityName}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {booking.date} • {booking.timeSlot}
                  </span>
                  <span>Total: <strong className="text-white">{formatPrice(booking.totalPrice)}</strong></span>
                  {booking.notes && <span className="text-slate-400 italic">"{booking.notes}"</span>}
                </div>
              </div>

              {booking.status === 'Confirmed' && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors self-start sm:self-auto shrink-0"
                >
                  {t('profile_cancel_booking')}
                </button>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (activeSubTab === 'events') {
      if (events.length === 0) {
        return (
          <div className="py-16 text-center space-y-3">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">{t('profile_no_events')}</h3>
            <p className="text-xs text-slate-400">
              You haven't joined any marathons or bicycle competitions yet.
            </p>
            <button
              onClick={() => setActiveTab('events')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
            >
              Explore Upcoming Events
            </button>
          </div>
        );
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {event.category || event.type}
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> {event.location}, {event.city}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shrink-0">
                  {event.distance}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Race Date: <strong className="text-slate-900 dark:text-white">{event.date}</strong>
                </span>

                <button
                  onClick={() => handleUnregisterEvent(event._id)}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:underline"
                >
                  {t('profile_unregister_event')}
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeSubTab === 'trainers') {
      if (trainerRequests.length === 0) {
        return (
          <div className="py-16 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">{t('profile_no_trainers')}</h3>
            <p className="text-xs text-slate-400">
              You haven't sent inquiries to any personal trainers yet.
            </p>
            <button
              onClick={() => setActiveTab('trainers')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
            >
              Find A Personal Trainer
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          {trainerRequests.map((req) => (
            <div
              key={req._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    🏋️
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Coaching Inquiry to {req.trainerName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                    req.status === 'Accepted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  Status: {req.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[11px]">Fitness Target:</span>
                  <strong>{req.goals}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Preferred Hours:</span>
                  <strong>{req.preferredSchedule}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                "{req.message}"
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (activeSubTab === 'edit') {
      return (
        <form onSubmit={handleUpdateProfileSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 max-w-2xl">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                {t('profile_tab_edit')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Profil rasmi, ism, username va shaxsiy ma'lumotlarni o'zgartirish
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase">
              Sportchi Profili
            </span>
          </div>

          {/* 1. AVATAR SELECTOR & UPLOAD SECTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-4">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-200">
              Profil Rasmi (Avatar)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Current Preview with edit ring */}
              <div className="relative group shrink-0">
                <img
                  src={editData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-xl"
                />
                <label className="absolute inset-0 bg-slate-950/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold">
                  <Camera className="w-5 h-5 mb-1 text-emerald-400" />
                  <span>Almashtirish</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload & URL Controls */}
              <div className="space-y-2.5 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Kompyuterdan rasm tanlash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">PNG, JPG (max 3MB)</span>
                </div>

                <div className="relative">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="Yoki to'g'ridan-to'g'ri rasm havolasini (URL) kiriting..."
                    value={editData.avatar}
                    onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Quick Sport Athlete Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block">
                Yoki tayyor sportchi rasmlaridan tanlang (bosganda darhol o'rnatiladi):
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {ATHLETE_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAndSavePreset(av.url, av.label)}
                    className={`relative rounded-xl overflow-hidden aspect-square border transition-all ${
                      editData.avatar === av.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                    title={av.label}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    {editData.avatar === av.url && (
                      <span className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. NAME & USERNAME SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                To'liq Ism (Full Name) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ism va familiyangiz"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Foydalanuvchi Nomi (Username) *
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="masalan: champion_runner"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '') })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Platformadagi unikal identifikatoringiz
              </span>
            </div>
          </div>

          {/* 3. PHONE & FITNESS GOAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Telefon Raqam
              </label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Sport Maqsadi (Fitness Target)
              </label>
              <input
                type="text"
                placeholder="Marafon 42km, Mushak o'stirish, Vazn tashlash..."
                value={editData.fitnessGoal}
                onChange={(e) => setEditData({ ...editData, fitnessGoal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Region & District Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Viloyatingiz
              </label>
              <select
                value={editData.region}
                onChange={(e) => {
                  const newReg = e.target.value;
                  const districts = getDistrictsByRegion(newReg);
                  setEditData({
                    ...editData,
                    region: newReg,
                    district: districts[0] || '',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                {UZBEKISTAN_REGIONS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Rayon / Tumaningiz
              </label>
              <select
                value={editData.district}
                onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold focus:outline-none focus:border-emerald-500"
              >
                {getDistrictsByRegion(editData.region).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. PHYSICAL PARAMETERS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Bo'y (sm)
              </label>
              <input
                type="number"
                value={editData.height}
                onChange={(e) => setEditData({ ...editData, height: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Vazn (kg)
              </label>
              <input
                type="number"
                value={editData.weight}
                onChange={(e) => setEditData({ ...editData, weight: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* 5. BIO */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              O'zingiz haqingizda (Bio)
            </label>
            <textarea
              rows="3"
              placeholder="Qaysi sport turlarini yoqtirasiz, rejalaringiz..."
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              {savingProfile ? (
                <span>Saqlanmoqda...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('profile_save_changes')}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('orders')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      );
    }

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Athlete Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          {/* Avatar with Interactive Edit Badge */}
          <div className="relative group shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xl transition-transform group-hover:scale-105"
            />
            <button
              onClick={() => setAvatarModalOpen(true)}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-slate-950 shadow-lg hover:bg-emerald-400 transition-all group-hover:scale-110"
              title="Rasmni o'zgartirish"
            >
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tight">
                {user?.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                {t('profile_badge')}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-mono text-emerald-400 text-xs font-bold">
                @{user?.username || user?.email?.split('@')[0]}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[200px]">{user?.email}</span>
            </div>

            <p className="text-xs text-emerald-400 font-semibold mt-1.5 flex items-center gap-1.5">
              <span>🎯 Maqsad: {user?.fitnessGoal || 'General Performance'}</span>
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{user?.region || 'Toshkent shahri'}, <strong>{user?.district || 'Chilonzor tumani'}</strong></span>
            </div>
          </div>
        </div>

        {/* Header Right Actions & Quick Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-stretch sm:self-auto">
          <div className="flex items-center gap-2 text-center">
            <div className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('profile_height')}</span>
              <span className="text-sm font-black text-white">{user?.height || 175} cm</span>
            </div>
            <div className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('profile_weight')}</span>
              <span className="text-sm font-black text-white">{user?.weight || 72} kg</span>
            </div>
            <div className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('profile_active_sports')}</span>
              <span className="text-xs font-bold text-emerald-400">
                {user?.favoriteSports?.length || 2} Active
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('edit')}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tahrirlash</span>
          </button>

          {isSeller && (
            <button
              onClick={() => setActiveTab('seller')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              <Store className="w-4 h-4 stroke-[2.5]" />
              <span>Do'konim Paneli</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Avatar Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-5 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white uppercase italic">
                  Profil Rasmini O'zgartirish
                </h3>
              </div>
              <button
                onClick={() => setAvatarModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={editData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt="Selected"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md shrink-0"
              />
              <div className="space-y-2 flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wide hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Kompyuterdan rasm yuklash</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                </label>
                <p className="text-[11px] text-slate-400">Tanlangan rasm darhol profil rasmingizga aylanadi</p>
              </div>
            </div>

            {/* Direct URL input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Yoki internetdagi rasm havolasi (URL):
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editData.avatar}
                    onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectAndSavePreset(editData.avatar, 'Yangi')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wide transition-colors shrink-0"
                >
                  O'rnatish
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Yoki tayyor avatarlardan birini bosing (1 marta bosishda saqlanadi):
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {ATHLETE_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAndSavePreset(av.url, av.label)}
                    className={`relative rounded-xl overflow-hidden aspect-square border transition-all ${
                      editData.avatar === av.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500 scale-105'
                        : 'border-slate-800 opacity-75 hover:opacity-100 hover:border-slate-600'
                    }`}
                    title={av.label}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    {editData.avatar === av.url && (
                      <span className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAvatarModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Mini Admin Panel Quick Access Banner (if isSeller) */}
      {isSeller && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                  {t('seller_panel_badge')}
                </span>
                <h3 className="text-base font-black text-white">
                  {user?.shopName || t('seller_nav_title')}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {user?.shopDescription || t('seller_empty_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('seller')}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0 self-stretch md:self-auto justify-center"
          >
            <span>{t('seller_open_panel')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'orders', label: t('profile_tab_orders'), icon: ShoppingBag },
          { id: 'bookings', label: t('profile_tab_bookings'), icon: Calendar },
          { id: 'events', label: t('profile_tab_events'), icon: Trophy },
          { id: 'trainers', label: t('profile_tab_trainers'), icon: Users },
          ...(isSeller ? [{ id: 'shop_panel', label: "Do'konim Paneli", icon: Store, isDirectAction: true }] : []),
          { id: 'edit', label: t('profile_tab_edit'), icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.isDirectAction) {
                  setActiveTab('seller');
                } else {
                  setActiveSubTab(tab.id);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                tab.isDirectAction
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'
                  : isActive
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/15'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Content Area */}
      <div className="space-y-6">
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
