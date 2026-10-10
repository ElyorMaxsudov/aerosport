import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  ShoppingBag,
  Trophy,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  Package,
  Layers,
  Sparkles,
  LayoutDashboard,
  CalendarCheck,
  Search,
  Filter,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Globe,
  LogOut,
  Check,
  X,
  TrendingUp,
  Activity,
  Store,
  Menu,
  Eye,
  EyeOff,
  Copy,
  KeyRound,
  Bell,
  Volume2,
  Edit3,
  Tag,
  CheckCheck,
  Save,
  Percent,
  Dumbbell,
  Coins,
  MessageSquare,
  UserX,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import FlagIcon from '../components/FlagIcon';
import { getLocalizedProduct, categoryTranslations, badgeTranslations } from '../utils/productLocalization';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion } from '../utils/regionsData';

const AdminDashboardPage = ({ setActiveTab, onRefreshData }) => {
  const { user, isAdmin, logout } = useAuth();
  const { showToast } = useCart();
  const { language, setLanguage, t, languages } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { formatPrice, rates, updateCurrencyRates, currencies, currentCurrencyObj } = useCurrency();

  // Currency form state
  const [currencyForm, setCurrencyForm] = useState({
    USD: 12800,
    EUR: 13800,
    RUB: 135,
  });
  const [testAmountUZS, setTestAmountUZS] = useState(150000);
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(() => {
    if (rates) {
      setCurrencyForm({
        USD: rates.USD || 12800,
        EUR: rates.EUR || 13800,
        RUB: rates.RUB || 135,
      });
    }
  }, [rates]);

  // Active Admin Sub-tab (overview, products, trainers, users, orders, bookings, sellers, facilities, events)
  const [adminTab, setAdminTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Chat & Kick user states
  const [chatRooms, setChatRooms] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChatRegion, setSelectedChatRegion] = useState('all');
  const [selectedChatDistrict, setSelectedChatDistrict] = useState('all');
  const [chatSearch, setChatSearch] = useState('');
  const [chatTabMode, setChatTabMode] = useState('messages'); // 'messages' or 'users'
  const [kickModalUser, setKickModalUser] = useState(null);
  const [kickReason, setKickReason] = useState("Chat qoidalariga rioya qilinmaganligi sababli ma'muriyat tomonidan chiqarildi");

  // Searches & filters
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [trainerSearch, setTrainerSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Selected seller to view their products modal
  const [selectedSellerForProducts, setSelectedSellerForProducts] = useState(null);

  // Modals for editing User, Product & Trainer
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [isAddingTrainer, setIsAddingTrainer] = useState(false);
  const [newTrainerData, setNewTrainerData] = useState({
    name: '',
    title: '',
    specialization: 'Futbol & Yengil Atletika',
    pricePerHour: 50,
    experienceYears: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: '',
    phone: '+998 (90) 123-45-67',
    email: 'coach@sportshub.com',
  });

  // Real-time Order Notification state
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [lastKnownOrderId, setLastKnownOrderId] = useState(null);

  // Synthesized notification chime sound (AudioContext)
  const playNotificationChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Note 1: E5
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: B5 upbeat alert chord
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(987.77, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  // Real-time order notification listener & Polling
  useEffect(() => {
    if (!isAdmin) return;

    const triggerOrderAlert = (orderData) => {
      if (!orderData) return;
      playNotificationChime();
      setNewOrderAlert({
        id: orderData._id || 'Yangi',
        customerName: orderData.shippingAddress?.fullName || orderData.user?.name || 'Mijoz',
        totalAmount: orderData.totalAmount || 0,
        time: new Date().toLocaleTimeString(),
        itemsCount: orderData.items?.length || 1,
      });
      fetchStats();
      axiosClient.get('/admin/orders').then((res) => setOrders(res.data)).catch(() => {});
    };

    // 1. Custom in-tab event
    const handleCustomOrderEvent = (e) => {
      triggerOrderAlert(e.detail);
    };
    window.addEventListener('new_order_placed', handleCustomOrderEvent);

    // 2. Cross-tab storage event
    const handleStorageEvent = (e) => {
      if (e.key === 'sports_latest_order' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          triggerOrderAlert(parsed.order);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // 3. Polling interval (every 9s)
    const pollInterval = setInterval(async () => {
      try {
        const res = await axiosClient.get('/admin/orders');
        const latestList = res.data;
        if (latestList && latestList.length > 0) {
          const firstOrder = latestList[0];
          if (lastKnownOrderId && firstOrder._id !== lastKnownOrderId) {
            triggerOrderAlert(firstOrder);
          }
          setLastKnownOrderId(firstOrder._id);
        }
      } catch (err) {}
    }, 9000);

    return () => {
      window.removeEventListener('new_order_placed', handleCustomOrderEvent);
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(pollInterval);
    };
  }, [isAdmin, lastKnownOrderId]);

  // Load KPI stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load selected sub-tab data
  const loadTabData = async () => {
    try {
      setLoading(true);
      if (adminTab === 'overview') {
        const [ordersRes, bookingsRes, sellersRes, productsRes, usersRes, trainersRes] = await Promise.all([
          axiosClient.get('/admin/orders'),
          axiosClient.get('/admin/bookings'),
          axiosClient.get('/admin/sellers'),
          axiosClient.get('/admin/products'),
          axiosClient.get('/admin/users'),
          axiosClient.get('/admin/trainers'),
        ]);
        setOrders(ordersRes.data);
        setBookings(bookingsRes.data);
        setSellers(sellersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setTrainers(trainersRes.data);
        if (ordersRes.data.length > 0 && !lastKnownOrderId) {
          setLastKnownOrderId(ordersRes.data[0]._id);
        }
      } else if (adminTab === 'products') {
        const res = await axiosClient.get('/admin/products');
        setProducts(res.data);
      } else if (adminTab === 'users') {
        const res = await axiosClient.get('/admin/users');
        setUsers(res.data);
      } else if (adminTab === 'orders') {
        const res = await axiosClient.get('/admin/orders');
        setOrders(res.data);
      } else if (adminTab === 'bookings') {
        const res = await axiosClient.get('/admin/bookings');
        setBookings(res.data);
      } else if (adminTab === 'sellers') {
        const res = await axiosClient.get('/admin/sellers');
        setSellers(res.data);
      } else if (adminTab === 'facilities') {
        const res = await axiosClient.get('/bookings/facilities');
        setFacilities(res.data);
      } else if (adminTab === 'events') {
        const res = await axiosClient.get('/events');
        setEvents(res.data);
      } else if (adminTab === 'trainers') {
        const res = await axiosClient.get('/admin/trainers');
        setTrainers(res.data);
      } else if (adminTab === 'chats') {
        const [roomsRes, msgsRes, usersRes] = await Promise.all([
          axiosClient.get('/chat/rooms-summary'),
          axiosClient.get('/chat/admin/all-messages'),
          axiosClient.get('/chat/admin/users'),
        ]);
        setChatRooms(roomsRes.data || []);
        setChatMessages(msgsRes.data || []);
        setChatUsers(usersRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load tab data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      loadTabData();
    }
  }, [isAdmin, adminTab]);

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      showToast(`${t('admin_col_status')}: ${newStatus}`, 'success');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  // Booking status update
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axiosClient.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      showToast(`${t('admin_col_status')}: ${newStatus}`, 'success');
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch {
      showToast('Failed to update booking status', 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t('admin_delete_confirm'))) return;
    try {
      await axiosClient.delete(`/admin/products/${id}`);
      showToast('Product deleted', 'info');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      fetchStats();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  // Delete event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm(t('admin_delete_confirm'))) return;
    try {
      await axiosClient.delete(`/admin/events/${id}`);
      showToast('Event deleted', 'info');
      setEvents((prev) => prev.filter((e) => e._id !== id));
      fetchStats();
    } catch {
      showToast('Failed to delete event', 'error');
    }
  };

  // Delete facility
  const handleDeleteFacility = async (id) => {
    if (!window.confirm(t('admin_delete_confirm'))) return;
    try {
      await axiosClient.delete(`/admin/facilities/${id}`);
      showToast('Facility deleted', 'info');
      setFacilities((prev) => prev.filter((f) => f._id !== id));
      fetchStats();
    } catch {
      showToast('Failed to delete facility', 'error');
    }
  };

  // Deactivate seller
  const handleDeactivateSeller = async (sellerId, shopName) => {
    if (!window.confirm(`"${shopName}" do'konini to'xtatish yoki o'chirishni xohlaysizmi?`)) return;
    try {
      setActionLoading(true);
      await axiosClient.delete(`/admin/sellers/${sellerId}`);
      showToast('Sotuvchi do\'koni to\'xtatildi', 'info');
      setSellers((prev) => prev.filter((s) => s._id !== sellerId));
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset & Re-populate Seed Database
  const handleResetSeedData = async () => {
    if (!window.confirm(t('admin_reset_confirm'))) return;
    try {
      setActionLoading(true);
      await axiosClient.post('/seed');
      showToast(t('admin_reset_success'), 'success');
      fetchStats();
      loadTabData();
      if (onRefreshData) onRefreshData();
    } catch {
      showToast('Failed to seed database', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Product Price, Stock, Description, and Name
  const handleUpdateProductPrice = async (productId, newPrice, newOriginalPrice, newStock, newDescription, newName) => {
    try {
      setActionLoading(true);
      const payload = {
        price: Number(newPrice),
        originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
        stock: newStock !== undefined ? Number(newStock) : undefined,
        description: newDescription !== undefined ? newDescription.trim() : undefined,
        name: newName !== undefined ? newName.trim() : undefined,
      };
      const res = await axiosClient.put(`/admin/products/${productId}/price`, payload);
      showToast(t('admin_product_saved_toast'), 'success');
      const updatedProduct = res.data.product || res.data;
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                ...updatedProduct,
              }
            : p
        )
      );
      setEditingProduct(null);
      fetchStats();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Mahsulotni yangilashda xatolik', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save User Edit (name, username, role, phone, optional new password)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setActionLoading(true);
      const payload = {
        name: editingUser.name,
        username: editingUser.username,
        role: editingUser.role,
        phone: editingUser.phone,
      };
      if (editingUser.newPassword) {
        payload.password = editingUser.newPassword;
      }
      const res = await axiosClient.put(`/admin/users/${editingUser._id}`, payload);
      showToast(t('admin_user_saved_toast') || 'Foydalanuvchi ma\'lumotlari saqlandi', 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...res.data.user } : u))
      );
      setEditingUser(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Foydalanuvchini yangilashda xatolik', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === 'admin@gmail.com') {
      showToast("Asosiy bosh admin hisobini o'chirish mumkin emas!", 'error');
      return;
    }
    if (!window.confirm(`Haqiqatan ham "${userEmail}" foydalanuvchisini o'chirmoqchimisiz?`)) return;
    try {
      setActionLoading(true);
      await axiosClient.delete(`/admin/users/${userId}`);
      showToast("Foydalanuvchi tizimdan o'chirildi", 'info');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = orderFilter === 'all' || o.status === orderFilter;
      const matchSearch =
        orderSearch === '' ||
        o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(orderSearch.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchFilter = bookingFilter === 'all' || b.status === bookingFilter;
      const matchSearch =
        bookingSearch === '' ||
        b.facility?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(bookingSearch.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [bookings, bookingFilter, bookingSearch]);

  // Filtered Sellers
  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      const q = sellerSearch.toLowerCase();
      return (
        sellerSearch === '' ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.shopName?.toLowerCase().includes(q) ||
        s.shopDescription?.toLowerCase().includes(q)
      );
    });
  }, [sellers, sellerSearch]);

  // Filtered Products for Price Management
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const localized = getLocalizedProduct(p, language);
      const matchCat =
        productCategoryFilter === 'all' ||
        p.category?.toLowerCase() === productCategoryFilter.toLowerCase() ||
        localized.categoryLabel?.toLowerCase() === productCategoryFilter.toLowerCase();
      const q = productSearch.toLowerCase();
      const matchSearch =
        productSearch === '' ||
        p.name?.toLowerCase().includes(q) ||
        localized.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        localized.categoryLabel?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sellerShopName?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, productSearch, productCategoryFilter, language]);

  // Filtered Users for User/Password Management
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const q = userSearch.toLowerCase();
      const matchSearch =
        userSearch === '' ||
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      const q = trainerSearch.toLowerCase().trim();
      return (
        q === '' ||
        t.name?.toLowerCase().includes(q) ||
        t.specialization?.toLowerCase().includes(q) ||
        t.title?.toLowerCase().includes(q)
      );
    });
  }, [trainers, trainerSearch]);

  const handleSaveTrainer = async () => {
    if (!editingTrainer) return;
    if (!editingTrainer.name?.trim()) {
      showToast("Murabbiy ismi bo'sh bo'lishi mumkin emas", "error");
      return;
    }
    try {
      setActionLoading(true);
      const res = await axiosClient.put(`/admin/trainers/${editingTrainer._id}`, editingTrainer);
      setTrainers((prev) =>
        prev.map((t) => (t._id === editingTrainer._id ? res.data.trainer || res.data : t))
      );
      showToast(`"${editingTrainer.name}" muvaffaqiyatli saqlandi! 🎉`, 'success');
      setEditingTrainer(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Murabbiyni saqlashda xatolik", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTrainer = async (trainerId, trainerName) => {
    if (!window.confirm(`Haqiqatan ham "${trainerName}" murabbiyni o'chirmoqchimisiz?`)) return;
    try {
      setActionLoading(true);
      await axiosClient.delete(`/admin/trainers/${trainerId}`);
      setTrainers((prev) => prev.filter((t) => t._id !== trainerId));
      showToast("Murabbiy o'chirildi", 'info');
    } catch (err) {
      showToast(err.response?.data?.message || "O'chirishda xatolik", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    if (!newTrainerData.name?.trim()) {
      showToast("Murabbiy ismi kiritilishi shart", 'error');
      return;
    }
    try {
      setActionLoading(true);
      const res = await axiosClient.post('/admin/trainers', newTrainerData);
      const created = res.data.trainer || res.data;
      setTrainers((prev) => [created, ...prev]);
      showToast(`Yangi murabbiy "${created.name}" muvaffaqiyatli qo'shildi! 🏋️‍♂️`, 'success');
      setIsAddingTrainer(false);
      setNewTrainerData({
        name: '',
        title: '',
        specialization: 'Futbol & Yengil Atletika',
        pricePerHour: 50,
        experienceYears: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        bio: '',
        phone: '+998 (90) 123-45-67',
        email: 'coach@sportshub.com',
      });
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Murabbiy qo'shishda xatolik", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveCurrencyRates = async (e) => {
    if (e) e.preventDefault();
    try {
      setSavingCurrency(true);
      const newRates = {
        UZS: 1,
        USD: Number(currencyForm.USD) || 12800,
        EUR: Number(currencyForm.EUR) || 13800,
        RUB: Number(currencyForm.RUB) || 135,
      };
      await updateCurrencyRates(newRates, 'UZS');
      showToast(t('admin_curr_saved_toast'), 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Valyuta kurslarini saqlashda xatolik', 'error');
    } finally {
      setSavingCurrency(false);
    }
  };

  // Chat Administration Handlers
  const handleDeleteChatMessage = async (id) => {
    if (!window.confirm("Haqiqatan ham ushbu xabarni o'chirmoqchimisiz?")) return;
    try {
      setActionLoading(true);
      await axiosClient.delete(`/chat/admin/messages/${id}`);
      setChatMessages((prev) => prev.filter((m) => m._id !== id));
      showToast("Xabar muvaffaqiyatli o'chirildi! 🗑️", 'success');
    } catch (err) {
      showToast(err.response?.data?.message || "Xabarni o'chirishda xatolik", 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleKickUserFromChat = async (e) => {
    if (e) e.preventDefault();
    if (!kickModalUser) return;
    try {
      setActionLoading(true);
      const res = await axiosClient.post('/chat/admin/kick-user', {
        userId: kickModalUser._id,
        reason: kickReason,
      });
      showToast(`"${kickModalUser.name}" chatdan muvaffaqiyatli chiqarildi! ⛔`, 'info');
      setChatUsers((prev) =>
        prev.map((u) => (u._id === kickModalUser._id ? { ...u, isChatBanned: true, chatBanReason: kickReason } : u))
      );
      setKickModalUser(null);
      // Re-fetch all messages to display the new system ban notification
      const msgsRes = await axiosClient.get('/chat/admin/all-messages');
      setChatMessages(msgsRes.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Foydalanuvchini chiqarishda xatolik', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUserFromChat = async (userId, userName) => {
    try {
      setActionLoading(true);
      await axiosClient.post('/chat/admin/unban-user', { userId });
      showToast(`"${userName}" uchun chatga kirish qayta tiklandi! ✅`, 'success');
      setChatUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isChatBanned: false, chatBanReason: '' } : u))
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Qayta tiklashda xatolik', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Sidebar navigation menu definition
  const menuItems = [
    {
      id: 'overview',
      label: t('admin_tab_overview'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'chats',
      label: 'Hududiy Chatlar & Nazorat',
      icon: MessageSquare,
      badge: chatRooms.length || 'Chat',
    },
    {
      id: 'currency',
      label: t('admin_tab_currency'),
      icon: Coins,
      badge: currentCurrencyObj.short,
    },
    {
      id: 'products',
      label: t('admin_tab_products'),
      icon: Tag,
      badge: stats?.totalProducts || products.length || 0,
    },
    {
      id: 'users',
      label: t('admin_tab_users'),
      icon: KeyRound,
      badge: stats?.totalUsers || users.length || 0,
    },
    {
      id: 'orders',
      label: t('admin_tab_orders'),
      icon: ShoppingBag,
      badge: stats?.totalOrders || orders.length || 0,
    },
    {
      id: 'bookings',
      label: t('admin_tab_bookings'),
      icon: CalendarCheck,
      badge: stats?.totalBookings || bookings.length || 0,
    },
    {
      id: 'sellers',
      label: t('admin_tab_sellers'),
      icon: Store,
      badge: stats?.totalSellers || sellers.length || 0,
    },
    {
      id: 'facilities',
      label: t('admin_tab_facilities'),
      icon: MapPin,
      badge: stats?.totalFacilities || facilities.length || 0,
    },
    {
      id: 'trainers',
      label: t('admin_tab_trainers') || 'Murabbiylar',
      icon: Dumbbell,
      badge: stats?.totalTrainers || trainers.length || 0,
    },
    {
      id: 'events',
      label: t('admin_tab_events'),
      icon: Trophy,
      badge: stats?.totalEvents || events.length || 0,
    },
  ];

  // Helper for status badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'shipped':
      case 'processing':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  // Helper to translate status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return t('admin_status_pending');
      case 'processing':
        return t('admin_status_processing');
      case 'shipped':
        return t('admin_status_shipped');
      case 'delivered':
        return t('admin_status_delivered');
      case 'cancelled':
        return t('admin_status_cancelled');
      case 'confirmed':
        return t('admin_status_confirmed');
      default:
        return status;
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase italic">
          {t('admin_access_required')}
        </h2>
        <p className="text-xs text-slate-400">
          {t('admin_access_desc')}
        </p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
        >
          {t('nav_signin')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 transition-colors duration-200">
      {/* =========================================================================
          LEFT VERTICAL SIDEBAR (Chap tarafdagi vertikal panel: tepadan pastga)
          ========================================================================= */}
      <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-slate-950 md:min-h-screen border-b md:border-b-0 md:border-r border-slate-800/80 p-4 md:p-6 flex flex-col justify-between z-20">
        {/* Mobile Top Bar with Toggle */}
        <div className="flex items-center justify-between md:hidden pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('admin_role_badge')}
            </span>
            <span className="text-base font-black text-white uppercase italic tracking-tight">
              AEROSPORT <span className="text-amber-400">ADMIN</span>
            </span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle admin menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
          </button>
        </div>

        {/* Sidebar Content (Toggled on mobile, always visible on md+) */}
        <div className={`${mobileSidebarOpen ? 'block pt-4' : 'hidden'} md:block space-y-6 flex-1`}>
          {/* Admin Brand / Console Header (Desktop only) */}
          <div className="hidden md:block p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('admin_role_badge')}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">
              AEROSPORT <span className="text-amber-400">ADMIN</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {t('admin_live_mode')}
            </p>
          </div>

          {/* Admin Profile Details */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/40"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Controls inside sidebar: Language & Theme toggles */}
          <div className="space-y-2.5 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            {/* Language Selector in sidebar: 3 clean tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>{t('admin_language')}</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {languages.find((l) => l.code === language)?.short || 'UZB'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`py-1.5 px-1.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                      language === l.code
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                    title={l.label}
                  >
                    <FlagIcon code={l.code} className="w-3.5 h-2.5" />
                    <span className="text-[10px] font-mono font-black">{l.short}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark/Light Mode Switch in sidebar */}
            <button
              onClick={toggleTheme}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 group"
              title={isDark ? t('theme_toggle_to_light') : t('theme_toggle_to_dark')}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span className="text-xs">{t('theme_light')}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400 group-hover:-rotate-12 transition-transform" />
                  <span className="text-xs">{t('theme_dark')}</span>
                </>
              )}
            </button>
          </div>

          {/* Vertical Menu Navigation (Tepadan pastga) */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {t('admin_title')}
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminTab(item.id);
                    setMobileSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-md'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block pt-4 border-t border-slate-800/80 space-y-2 mt-4`}>
          {/* Reset Demo DB */}
          <button
            onClick={handleResetSeedData}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Reset Database to initial rich test data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>{t('admin_reset_db')}</span>
          </button>

          {/* Back to main website */}
          <button
            onClick={() => setActiveTab('home')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t('admin_back_to_site')}</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              setActiveTab('home');
              showToast('Logged out safely', 'info');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav_signout')}</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT MAIN CONTENT AREA
          ========================================================================= */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                {t('admin_role_badge')}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {menuItems.find((m) => m.id === adminTab)?.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight mt-1">
              {menuItems.find((m) => m.id === adminTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                fetchStats();
                loadTabData();
                showToast(t('admin_stats_refresh'), 'info');
              }}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              <span>{t('admin_stats_refresh')}</span>
            </button>

            <button
              onClick={() => setAdminTab('sellers')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
            >
              <Store className="w-4 h-4 stroke-[2.5]" />
              <span>{t('admin_tab_sellers')}</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Notification Banner */}
        {newOrderAlert && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-slate-900 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg animate-bounce shrink-0">
                <Bell className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                    {t('admin_new_order_alert')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">🕒 {newOrderAlert.time}</span>
                </div>
                <h4 className="text-base font-black text-white mt-0.5">
                  {t('admin_col_customer')}: <span className="text-amber-300">{newOrderAlert.customerName}</span> • {t('admin_col_total')}:{' '}
                  <span className="text-emerald-400 font-black">{formatPrice(newOrderAlert.totalAmount)}</span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  {t('admin_col_order_id')}: #{newOrderAlert.id?.slice(-8)} • {newOrderAlert.itemsCount} {t('admin_items_unit')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                onClick={() => {
                  setAdminTab('orders');
                  setNewOrderAlert(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('admin_view_order')}</span>
              </button>
              <button
                onClick={() => setNewOrderAlert(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title={t('admin_close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 1: OVERVIEW (Umumiy ko'rsatkichlar)
            ===================================================================== */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_total_revenue')}
                  </span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  ${stats ? stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>{t('admin_kpi_prod_revenue')}:</span>
                  <span className="font-semibold text-emerald-400">${stats?.productRevenue?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{t('admin_kpi_book_revenue')}:</span>
                  <span className="font-semibold text-emerald-400">${stats?.bookingRevenue?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {/* Registered Athletes */}
              <div
                onClick={() => setAdminTab('users')}
                className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2 cursor-pointer hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_athletes')}
                  </span>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {stats?.totalUsers || users.length || 2}
                </div>
                <p className="text-[11px] text-blue-400 font-semibold pt-1 border-t border-slate-800/80 flex items-center gap-1">
                  <span>{t('admin_tab_users')}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>

              {/* Total Orders */}
              <div
                onClick={() => setAdminTab('orders')}
                className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2 cursor-pointer hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_orders_count')}
                  </span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {stats?.totalOrders || orders.length || 0}
                </div>
                <p className="text-[11px] text-amber-400 font-semibold pt-1 border-t border-slate-800/80 flex items-center gap-1">
                  <span>{t('admin_tab_orders')}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>

              {/* Total Bookings */}
              <div
                onClick={() => setAdminTab('bookings')}
                className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2 cursor-pointer hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_bookings_count')}
                  </span>
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {stats?.totalBookings || bookings.length || 0}
                </div>
                <p className="text-[11px] text-teal-400 font-semibold pt-1 border-t border-slate-800/80 flex items-center gap-1">
                  <span>{t('admin_tab_bookings')}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {t('admin_quick_actions')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => setAdminTab('products')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <Tag className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">{t('admin_tab_products')}</p>
                  <p className="text-[10px] text-slate-400">{t('admin_col_quick_price_edit')}</p>
                </button>
                <button
                  onClick={() => setAdminTab('users')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
                >
                  <KeyRound className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">{t('admin_tab_users')}</p>
                  <p className="text-[10px] text-slate-400">{t('admin_col_password')}</p>
                </button>
                <button
                  onClick={() => setAdminTab('sellers')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all group"
                >
                  <Store className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">{t('admin_tab_sellers')}</p>
                  <p className="text-[10px] text-slate-400">{t('admin_col_sales_stat')}</p>
                </button>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
                >
                  <ShoppingBag className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">{t('admin_tab_orders')}</p>
                  <p className="text-[10px] text-slate-400">{t('admin_col_status')}</p>
                </button>
                <button
                  onClick={() => setAdminTab('bookings')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
                >
                  <CalendarCheck className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">{t('admin_tab_bookings')}</p>
                  <p className="text-[10px] text-slate-400">{t('admin_col_facility')}</p>
                </button>
                <button
                  onClick={handleResetSeedData}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
                >
                  <RefreshCw className="w-5 h-5 text-purple-400 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                  <p className="text-xs font-bold text-white">{t('admin_reset_db')}</p>
                  <p className="text-[10px] text-slate-400">Demo Seed</p>
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    {t('admin_recent_orders')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('admin_recent_orders')}</p>
                </div>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{t('admin_filter_all')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">{t('admin_no_data')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">{t('admin_col_order_id')}</th>
                        <th className="py-3 px-3">{t('admin_col_customer')}</th>
                        <th className="py-3 px-3">{t('admin_col_items')}</th>
                        <th className="py-3 px-3">{t('admin_col_total')}</th>
                        <th className="py-3 px-3">{t('admin_col_status')}</th>
                        <th className="py-3 px-3 text-right">{t('admin_col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-300">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3 px-3 font-semibold text-white">
                            {order.user?.name || 'Customer'}
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {order.items?.length || 0} {t('admin_items_unit')}
                          </td>
                          <td className="py-3 px-3 font-black text-emerald-400">
                            ${order.totalAmount?.toFixed(2)}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                            >
                              <option value="pending">{t('admin_status_pending')}</option>
                              <option value="processing">{t('admin_status_processing')}</option>
                              <option value="shipped">{t('admin_status_shipped')}</option>
                              <option value="delivered">{t('admin_status_delivered')}</option>
                              <option value="cancelled">{t('admin_status_cancelled')}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Bookings Preview */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    {t('admin_recent_bookings')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('admin_recent_bookings')}</p>
                </div>
                <button
                  onClick={() => setAdminTab('bookings')}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{t('admin_filter_all')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {bookings.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">{t('admin_no_data')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">{t('admin_col_facility')}</th>
                        <th className="py-3 px-3">{t('admin_col_customer')}</th>
                        <th className="py-3 px-3">{t('admin_col_slot')}</th>
                        <th className="py-3 px-3">{t('admin_col_price')}</th>
                        <th className="py-3 px-3">{t('admin_col_status')}</th>
                        <th className="py-3 px-3 text-right">{t('admin_col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">
                            {b.facility?.name || 'Sports Field'}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-300">
                            {b.user?.name || 'Athlete'}
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {b.date} • {b.timeSlot}
                          </td>
                          <td className="py-3 px-3 font-black text-emerald-400">
                            ${b.price}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                              {getStatusLabel(b.status)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                            >
                              <option value="pending">{t('admin_status_pending')}</option>
                              <option value="confirmed">{t('admin_status_confirmed')}</option>
                              <option value="cancelled">{t('admin_status_cancelled')}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: ORDERS (Buyurtmalar nazorati)
            ===================================================================== */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={t('admin_search_orders')}
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      orderFilter === status
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {status === 'all' ? t('admin_status_all') : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  {t('admin_no_data')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3.5 px-4">{t('admin_col_order_id')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_customer')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_items')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_total')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_date')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_status')}</th>
                        <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{order.user?.name || 'Customer'}</p>
                            <p className="text-[11px] text-slate-400">{order.user?.email}</p>
                            {order.shippingAddress?.address && (
                              <p className="text-[10px] text-slate-500 truncate max-w-xs">
                                📍 {order.shippingAddress.address}, {order.shippingAddress.city}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {order.items?.map((it, idx) => {
                                const loc = it.product ? getLocalizedProduct(it.product, language) : null;
                                return (
                                  <div key={idx} className="flex items-center gap-2">
                                    {it.product?.image && (
                                      <img
                                        src={it.product.image}
                                        alt=""
                                        className="w-5 h-5 rounded object-cover"
                                      />
                                    )}
                                    <span className="text-slate-300 font-medium">
                                      {loc?.name || it.product?.name || 'Product'} × {it.quantity}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                            ${order.totalAmount?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                            >
                              <option value="pending">{t('admin_status_pending')}</option>
                              <option value="processing">{t('admin_status_processing')}</option>
                              <option value="shipped">{t('admin_status_shipped')}</option>
                              <option value="delivered">{t('admin_status_delivered')}</option>
                              <option value="cancelled">{t('admin_status_cancelled')}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: BOOKINGS (Maydon va Zal bronlari)
            ===================================================================== */}
        {adminTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={t('admin_search_bookings')}
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
                {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      bookingFilter === status
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {status === 'all' ? t('admin_status_all') : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  {t('admin_no_data')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3.5 px-4">{t('admin_col_facility')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_customer')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_slot')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_price')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_status')}</th>
                        <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{b.facility?.name}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                              {b.facility?.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-200">{b.user?.name || 'Athlete'}</p>
                            <p className="text-[11px] text-slate-400">{b.user?.email}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            📅 {b.date} • ⏰ {b.timeSlot}
                          </td>
                          <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                            ${b.price}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                              {getStatusLabel(b.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                            >
                              <option value="pending">{t('admin_status_pending')}</option>
                              <option value="confirmed">{t('admin_status_confirmed')}</option>
                              <option value="cancelled">{t('admin_status_cancelled')}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: SELLERS (Sport Do'konlari va Sotuvchilar)
            ===================================================================== */}
        {adminTab === 'sellers' && (
          <div className="space-y-6">
            {/* Top KPI Cards for Sellers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_sellers_count')}
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {sellers.length}
                </div>
                <p className="text-[11px] text-slate-400">{t('admin_all_sellers')}</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_col_products_count')}
                  </span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {sellers.reduce((s, x) => s + (x.productsCount || 0), 0)}
                </div>
                <p className="text-[11px] text-slate-400">{t('admin_col_products_count')}</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_sellers_items_sold')}
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {sellers.reduce((s, x) => s + (x.itemsSold || 0), 0)} {t('admin_items_unit')}
                </div>
                <p className="text-[11px] text-slate-400">{t('admin_col_items_sold')}</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('admin_kpi_sellers_sales')}
                  </span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  ${sellers.reduce((s, x) => s + (x.totalRevenue || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-slate-400">{t('admin_col_sales_stat')}</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder={t('admin_search_sellers')}
                  value={sellerSearch}
                  onChange={(e) => setSellerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-bold text-slate-300">
                  🏪 {filteredSellers.length} {t('admin_tab_sellers')}
                </span>
              </div>
            </div>

            {/* Sellers Data Table */}
            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              {filteredSellers.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Store className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">{t('admin_no_sellers_found')}</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Foydalanuvchilar ro'yxatdan o'tishda "Sport do'koningiz bormi?" savoliga "Ha" deb javob berganlarida, ularning do'kon statistikasi shu yerda ko'rinadi.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3.5 px-4">{t('admin_col_shop')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_owner_info')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_products_count')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_items_sold')} & {t('admin_col_sales_stat')}</th>
                        <th className="py-3.5 px-4">{t('admin_col_reg_date')}</th>
                        <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredSellers.map((s) => (
                        <tr key={s._id} className="hover:bg-slate-900/50 transition-colors">
                          {/* Store Name & Desc */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                <Store className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-white text-sm">
                                    {s.shopName || `${s.name} Sport Do'koni`}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                                    {t('admin_seller_status_active')}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs truncate">
                                  {s.shopDescription || 'Sport mahsulotlari va anjomlari'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Owner & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              {s.avatar ? (
                                <img
                                  src={s.avatar}
                                  alt={s.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                                  {s.name?.charAt(0) || 'U'}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-200">{s.name}</p>
                                <p className="text-[11px] text-slate-400">{s.email}</p>
                                {s.phone && (
                                  <p className="text-[10px] text-emerald-400 font-mono">{s.phone}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Products Listed Count */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                                <Package className="w-3.5 h-3.5 text-sky-400" />
                                <span>{s.productsCount || 0} {t('admin_items_unit')}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {t('admin_col_stock')}: <strong className="text-slate-300">{s.totalStock || 0}</strong> {t('admin_stock_unit')}
                              </p>
                            </div>
                          </td>

                          {/* Items Sold & Revenue */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-black text-emerald-400 text-xs">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>${(s.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              </div>
                              <p className="text-[11px] text-slate-300">
                                🏷️ <strong className="text-white">{s.itemsSold || 0}</strong> {t('admin_items_unit')}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                ({s.ordersCount || 0} {t('admin_tab_orders')})
                              </p>
                            </div>
                          </td>

                          {/* Registration Date */}
                          <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedSellerForProducts(s)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                                title={t('admin_view_seller_items')}
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>{t('admin_view_seller_items')}</span>
                              </button>

                              <button
                                onClick={() => handleDeactivateSeller(s._id, s.shopName || s.name)}
                                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                                title={t('admin_delete_btn')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: FACILITIES (Maydonlar va Zallar)
            ===================================================================== */}
        {adminTab === 'facilities' && (
          <div className="space-y-6">
            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">{t('admin_col_name')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_category')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_price')} / {t('admin_per_hour')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_rating')}</th>
                      <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {facilities.map((f) => (
                      <tr key={f._id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white">{f.name}</p>
                          <p className="text-[11px] text-slate-400">📍 {f.location}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          {f.type}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                          ${f.pricePerHour}
                        </td>
                        <td className="py-3.5 px-4 text-amber-400 font-bold">
                          ★ {f.rating} ({f.reviewsCount})
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteFacility(f._id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title={t('admin_delete_btn')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: EVENTS (Musobaqalar va Marafonlar)
            ===================================================================== */}
        {adminTab === 'events' && (
          <div className="space-y-6">
            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">{t('admin_col_name')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_category')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_distance')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_participants')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_price')}</th>
                      <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {events.map((e) => (
                      <tr key={e._id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white">{e.title}</p>
                          <p className="text-[11px] text-slate-400">📅 {e.date}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            {e.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {e.distance} • 📍 {e.location}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-200">
                          {e.participantsCount} / {e.maxParticipants || 500}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-400">
                          {e.price > 0 ? `$${e.price}` : t('admin_free')}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteEvent(e._id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title={t('admin_delete_btn')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: PRODUCTS & PRICE MANAGEMENT (Tovar va Narxlarni to'g'irlash)
            ===================================================================== */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-400" />
                  <span>{t('admin_products_management')}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    {filteredProducts.length} {t('admin_items_unit')}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('admin_products_desc')}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder={t('admin_search_product_brand')}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">{t('admin_all_categories')}</option>
                  {Object.keys(categoryTranslations).filter((c) => c !== 'All').map((catKey) => (
                    <option key={catKey} value={catKey.toLowerCase()}>
                      {categoryTranslations[catKey]?.[language] || catKey}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">{t('admin_col_product')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_category_shop')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_stock')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_current_price')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_quick_price_edit')}</th>
                      <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500 text-xs">
                          {t('admin_no_data')}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const localized = getLocalizedProduct(p, language);
                        return (
                          <tr key={p._id} className="hover:bg-slate-900/60 transition-colors">
                            {/* Image & Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={localized.name}
                                  className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate max-w-xs">{localized.name}</p>
                                  {(localized.badgeLabel || p.badge) && (
                                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      {localized.badgeLabel || p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category & Shop */}
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 block w-fit">
                                {localized.categoryLabel || p.category}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                🏪 {p.sellerShopName || p.brand || t('admin_direct_seller')}
                              </span>
                            </td>

                            {/* Stock */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  p.stock > 10
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : p.stock > 0
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {p.stock} {t('admin_stock_unit')}
                              </span>
                            </td>

                            {/* Current Price */}
                            <td className="py-3.5 px-4">
                              <div className="font-black text-emerald-400 text-sm">
                                {formatPrice(p.price)}
                              </div>
                              {p.originalPrice && (
                                <div className="text-[10px] text-slate-500 line-through">
                                  {formatPrice(p.originalPrice)}
                                </div>
                              )}
                            </td>

                            {/* Inline Quick Price Editor */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => {
                                    const newP = Math.max(1000, Math.round((p.price * 0.9) / 1000) * 1000);
                                    handleUpdateProductPrice(p._id, newP, p.originalPrice || p.price, p.stock);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-[10px] font-bold"
                                  title="-10%"
                                >
                                  -10%
                                </button>
                                <button
                                  onClick={() => {
                                    const newP = Math.round((p.price * 1.1) / 1000) * 1000;
                                    handleUpdateProductPrice(p._id, newP, p.originalPrice, p.stock);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-[10px] font-bold"
                                  title="+10%"
                                >
                                  +10%
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateProductPrice(p._id, p.price + 50000, p.originalPrice, p.stock);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-[10px] font-bold"
                                  title="+50k"
                                >
                                  +50k
                                </button>
                                <button
                                  onClick={() => setEditingProduct({ ...p })}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>{t('admin_edit_btn')}</span>
                                </button>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title={t('admin_delete_btn')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: USERS & PASSWORDS (Foydalanuvchilar va Parollar)
            ===================================================================== */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <span>{t('admin_users_title')}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                    {filteredUsers.length} {t('admin_items_unit')}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('admin_users_subtitle')}
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder={t('admin_search_users_placeholder')}
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">{t('admin_role_all')}</option>
                  <option value="user">{t('admin_role_user')}</option>
                  <option value="seller">{t('admin_role_seller')}</option>
                  <option value="admin">{t('admin_role_admin')}</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">{t('admin_col_user')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_username')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_email')}</th>
                      <th className="py-3.5 px-4">Telefon</th>
                      <th className="py-3.5 px-4">{t('admin_col_role')}</th>
                      <th className="py-3.5 px-4">{t('admin_col_registered')}</th>
                      <th className="py-3.5 px-4 text-right">{t('admin_col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                          {t('admin_no_data')}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isMainAdmin = u.email === 'admin@gmail.com';

                        return (
                          <tr key={u._id} className="hover:bg-slate-900/60 transition-colors">
                            {/* Avatar & Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-white">{u.name}</p>
                                  {isMainAdmin && (
                                    <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                                      {t('admin_main_admin_badge')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Username */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                @{u.username || u.email?.split('@')[0]}
                              </span>
                            </td>

                            {/* Email */}
                            <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                              {u.email}
                            </td>

                            {/* Phone (Password hidden) */}
                            <td className="py-3.5 px-4 font-mono text-xs">
                              {u.phone ? (
                                <span className="text-emerald-400 font-semibold">{u.phone}</span>
                              ) : (
                                <span className="text-slate-500 italic">—</span>
                              )}
                            </td>

                            {/* Role */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  u.role === 'admin'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : u.role === 'seller' || u.isSeller
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}
                              >
                                {u.role === 'admin' ? t('admin_role_admin') : u.role === 'seller' || u.isSeller ? t('admin_role_seller') : t('admin_role_user')}
                              </span>
                            </td>

                            {/* Created At */}
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingUser({ ...u, newPassword: '' })}
                                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                                  title={t('admin_edit_btn')}
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                </button>

                                {!isMainAdmin && (
                                  <button
                                    onClick={() => handleDeleteUser(u._id, u.email)}
                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                    title={t('admin_delete_btn')}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: TRAINERS MANAGEMENT (Murabbiylarni boshqarish va tahrirlash)
            ===================================================================== */}
        {adminTab === 'trainers' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-emerald-400" />
                  <span>Murabbiylar Boshqaruvi</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    {filteredTrainers.length} murabbiy
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Murabbiylarning ismi, unvoni, soatlik narxi, tajribasi va ma'lumotlarini to'g'irlash
                </p>
              </div>

              {/* Actions & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Murabbiy ismi yoki yo'nalishi bo'yicha..."
                    value={trainerSearch}
                    onChange={(e) => setTrainerSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingTrainer(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0 transition-all active:scale-95 btn-press"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi Murabbiy Qo'shish</span>
                </button>
              </div>
            </div>

            {/* Trainers Table */}
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Murabbiy</th>
                      <th className="py-3.5 px-4">Yo'nalishi & Unvoni</th>
                      <th className="py-3.5 px-4">Tajriba</th>
                      <th className="py-3.5 px-4">Soatlik narxi</th>
                      <th className="py-3.5 px-4">Reyting & Bog'lanish</th>
                      <th className="py-3.5 px-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTrainers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500 text-xs">
                          Murabbiylar topilmadi
                        </td>
                      </tr>
                    ) : (
                      filteredTrainers.map((tr) => (
                        <tr key={tr._id} className="hover:bg-slate-900/60 transition-colors">
                          {/* Image & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={tr.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                alt={tr.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-slate-800 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-white text-sm">{tr.name}</p>
                                <p className="text-[11px] text-slate-400 max-w-xs truncate">{tr.bio}</p>
                              </div>
                            </div>
                          </td>

                          {/* Specialization & Title */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-1">
                              {tr.specialization}
                            </span>
                            <p className="text-[11px] text-slate-300 font-medium">{tr.title}</p>
                          </td>

                          {/* Experience */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-200">
                              {tr.experienceYears} yil
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                            ${tr.pricePerHour}/soat
                          </td>

                          {/* Rating & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                                <span>★ {tr.rating || 4.9}</span>
                                <span className="text-[10px] text-slate-500">({tr.reviewCount || 25})</span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono">{tr.phone || tr.email || '—'}</p>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingTrainer({ ...tr })}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1"
                                title="Tahrirlash"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Tahrirlash</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTrainer(tr._id, tr.name)}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: CURRENCY & EXCHANGE RATES MANAGEMENT (Valyuta & Kurslar)
            ===================================================================== */}
        {adminTab === 'currency' && (
          <div className="space-y-6">
            {/* Currency Header Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Coins className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {t('admin_curr_badge')}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Live Cross-Sync
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic mt-1">
                      {t('admin_curr_title')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                      {t('admin_curr_desc')} {t('admin_curr_base_note')}
                    </p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrencyForm({
                        USD: 12850,
                        EUR: 13950,
                        RUB: 138,
                      });
                      showToast("MB rasmiy kurslari kiritildi (Saqlashni bosing)", "info");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('admin_curr_cbu_preset')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrencyForm({
                        USD: 12800,
                        EUR: 13800,
                        RUB: 135,
                      });
                      showToast("Standart kurslar tiklandi", "info");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('admin_curr_reset')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Currency Rates Form Grid */}
            <form onSubmit={handleSaveCurrencyRates} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* UZS (Base) */}
                <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      O'zbek so'mi (UZS)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                      Asosiy Baza
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xl font-black text-white">1 UZS</span>
                      <span className="text-slate-500">=</span>
                      <span className="font-mono text-xl font-bold text-emerald-400">1.00</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Barcha mahsulotlar va xizmatlar narxi ushbu bazada hisoblanadi.
                    </p>
                  </div>
                </div>

                {/* USD Rate */}
                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      AQSh Dollari (USD)
                    </span>
                    <span className="font-bold text-amber-400 text-xs font-mono">$ USD</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      1 USD = (so'mda)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={currencyForm.USD}
                        onChange={(e) => setCurrencyForm({ ...currencyForm, USD: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono text-base font-black focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">UZS</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      $100 tovar ≈ <strong className="text-slate-200">{(100 * (Number(currencyForm.USD) || 12800)).toLocaleString()} so'm</strong>
                    </p>
                  </div>
                </div>

                {/* EUR Rate */}
                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-sky-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Yevro (EUR)
                    </span>
                    <span className="font-bold text-sky-400 text-xs font-mono">€ EUR</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      1 EUR = (so'mda)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={currencyForm.EUR}
                        onChange={(e) => setCurrencyForm({ ...currencyForm, EUR: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sky-400 font-mono text-base font-black focus:outline-none focus:border-sky-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">UZS</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      €100 tovar ≈ <strong className="text-slate-200">{(100 * (Number(currencyForm.EUR) || 13800)).toLocaleString()} so'm</strong>
                    </p>
                  </div>
                </div>

                {/* RUB Rate */}
                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-rose-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Rossiya Rubli (RUB)
                    </span>
                    <span className="font-bold text-rose-400 text-xs font-mono">₽ RUB</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      1 RUB = (so'mda)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        required
                        value={currencyForm.RUB}
                        onChange={(e) => setCurrencyForm({ ...currencyForm, RUB: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-mono text-base font-black focus:outline-none focus:border-rose-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">UZS</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      1,000 ₽ tovar ≈ <strong className="text-slate-200">{(1000 * (Number(currencyForm.RUB) || 135)).toLocaleString()} so'm</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">
                  ⚠️ Saqlash tugmasini bosgach, yangi kurslar butun platforma do'koni va narxlarida zudlik bilan aks etadi.
                </span>
                <button
                  type="submit"
                  disabled={savingCurrency}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 btn-press"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingCurrency ? 'Saqlanmoqda...' : t('admin_curr_save_btn')}</span>
                </button>
              </div>
            </form>

            {/* Live Interactive Price Calculator */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white uppercase italic">
                    {t('admin_curr_calc_title')}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {t('admin_curr_calc_desc')}
                  </p>
                </div>
              </div>

              <div className="max-w-md">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Sinov uchun summa (UZS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={testAmountUZS}
                    onChange={(e) => setTestAmountUZS(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-500">so'm</span>
                </div>
              </div>

              {/* Instant Conversion Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">🇺🇿 O'zbekiston</span>
                  <span className="text-lg font-black text-emerald-400 font-mono block">
                    {Number(testAmountUZS).toLocaleString()} so'm
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1.00 kurs</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">🇺🇸 AQSh</span>
                  <span className="text-lg font-black text-amber-400 font-mono block">
                    ${(testAmountUZS / (Number(currencyForm.USD) || 12800)).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1 USD = {currencyForm.USD}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">🇪🇺 Yevropa</span>
                  <span className="text-lg font-black text-sky-400 font-mono block">
                    €{(testAmountUZS / (Number(currencyForm.EUR) || 13800)).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1 EUR = {currencyForm.EUR}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">🇷🇺 Rossiya</span>
                  <span className="text-lg font-black text-rose-400 font-mono block">
                    {Math.round(testAmountUZS / (Number(currencyForm.RUB) || 135)).toLocaleString()} ₽
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1 RUB = {currencyForm.RUB}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB: REGIONAL CHATS & USER KICK / BAN (Hududiy Chatlar & Nazorat)
            ===================================================================== */}
        {adminTab === 'chats' && (
          <div className="space-y-6">
            {/* Chats Overview Header Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Chatlar & Nazorat
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Jonli Monitoring
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic mt-1">
                      Respublika Hududiy Chatlari va Nazorati
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                      Viloyat va rayonlar bo'yicha sportchilar yozishmalarini kuzatish, xabarlarni o'chirish va qoidabuzar odamlarni chatdan chiqarish.
                    </p>
                  </div>
                </div>

                {/* KPI stats in header */}
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Xonalar</span>
                    <span className="text-lg font-black text-white font-mono">{chatRooms.length || 1}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Xabarlar</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{chatMessages.length}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Chiqarilgan</span>
                    <span className="text-lg font-black text-rose-400 font-mono">
                      {chatUsers.filter((u) => u.isChatBanned).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-tab view toggle & Filter controls */}
              <div className="pt-2 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* View switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 self-start">
                  <button
                    onClick={() => setChatTabMode('messages')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      chatTabMode === 'messages'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Xabarlar Monitoringi ({chatMessages.length})</span>
                  </button>
                  <button
                    onClick={() => setChatTabMode('users')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      chatTabMode === 'users'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Odamlarni Boshqarish & Chiqarish ({chatUsers.length})</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Region filter */}
                  <select
                    value={selectedChatRegion}
                    onChange={(e) => {
                      setSelectedChatRegion(e.target.value);
                      setSelectedChatDistrict('all');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Barcha Viloyatlar</option>
                    {UZBEKISTAN_REGIONS.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  {/* District filter */}
                  <select
                    value={selectedChatDistrict}
                    onChange={(e) => setSelectedChatDistrict(e.target.value)}
                    disabled={selectedChatRegion === 'all'}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                  >
                    <option value="all">Barcha Tumanlar</option>
                    {selectedChatRegion !== 'all' &&
                      getDistrictsByRegion(selectedChatRegion).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>

                  {/* Search query input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Qidiruv (matn, ism)..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      const [roomsRes, msgsRes, usersRes] = await Promise.all([
                        axiosClient.get('/chat/rooms-summary'),
                        axiosClient.get('/chat/admin/all-messages'),
                        axiosClient.get('/chat/admin/users'),
                      ]);
                      setChatRooms(roomsRes.data || []);
                      setChatMessages(msgsRes.data || []);
                      setChatUsers(usersRes.data || []);
                      showToast("Chat ma'lumotlari yangilandi! 🔄", "info");
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                    title="Yangilash"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* TAB MODE 1: MESSAGES LIST VIEW */}
            {chatTabMode === 'messages' && (
              <div className="space-y-3">
                {chatMessages
                  .filter((m) => {
                    const matchReg = selectedChatRegion === 'all' || m.region === selectedChatRegion;
                    const matchDist = selectedChatDistrict === 'all' || m.district === selectedChatDistrict;
                    const q = chatSearch.toLowerCase().trim();
                    const matchQ =
                      q === '' ||
                      m.message?.toLowerCase().includes(q) ||
                      m.userName?.toLowerCase().includes(q) ||
                      m.userUsername?.toLowerCase().includes(q);
                    return matchReg && matchDist && matchQ;
                  })
                  .length === 0 ? (
                  <div className="py-20 text-center glass-card rounded-3xl border border-slate-800 text-slate-400 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold">Hech qanday xabarlar topilmadi</p>
                    <p className="text-xs text-slate-500">Filtrlarni o'zgartirib ko'ring yoki boshqa hududni tanlang.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {chatMessages
                      .filter((m) => {
                        const matchReg = selectedChatRegion === 'all' || m.region === selectedChatRegion;
                        const matchDist = selectedChatDistrict === 'all' || m.district === selectedChatDistrict;
                        const q = chatSearch.toLowerCase().trim();
                        const matchQ =
                          q === '' ||
                          m.message?.toLowerCase().includes(q) ||
                          m.userName?.toLowerCase().includes(q) ||
                          m.userUsername?.toLowerCase().includes(q);
                        return matchReg && matchDist && matchQ;
                      })
                      .map((m) => (
                        <div
                          key={m._id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            m.systemMessage
                              ? 'bg-amber-950/20 border-amber-500/30'
                              : 'glass-card border-slate-800/90 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={m.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                              alt={m.userName}
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs">{m.userName}</span>
                                {m.userUsername && (
                                  <span className="text-[11px] text-slate-400 font-mono">@{m.userUsername}</span>
                                )}
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>{m.region} • {m.district}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {new Date(m.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                                {m.message}
                              </p>
                            </div>
                          </div>

                          {/* Message Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            {/* Kick user shortcut */}
                            {!m.systemMessage && m.user && (
                              <button
                                onClick={() => {
                                  const targetUser = typeof m.user === 'object' ? m.user : { _id: m.user, name: m.userName, region: m.region, district: m.district };
                                  setKickModalUser(targetUser);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
                                title="Foydalanuvchini chatdan chiqarish"
                              >
                                <UserX className="w-3.5 h-3.5 text-rose-400" />
                                <span>Chiqarish</span>
                              </button>
                            )}

                            {/* Delete message */}
                            <button
                              onClick={() => handleDeleteChatMessage(m._id)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                              title="Xabarni o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB MODE 2: USERS LIST & KICK / BAN MANAGEMENT */}
            {chatTabMode === 'users' && (
              <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase italic">
                      Foydalanuvchilar va Chat Ruxsatlari Ro'yxati
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Foydalanuvchilarni o'z viloyati va rayoni chatlaridan chiqarish yoki qayta tiklash
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
                    Jami: {chatUsers.length} kishi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Foydalanuvchi</th>
                        <th className="py-3 px-4">Viloyat va Rayon</th>
                        <th className="py-3 px-4">Email / Telefon</th>
                        <th className="py-3 px-4">Chat Holati</th>
                        <th className="py-3 px-4 text-right">Amallar (Chiqarish / Tiklash)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {chatUsers
                        .filter((u) => {
                          const matchReg = selectedChatRegion === 'all' || u.region === selectedChatRegion;
                          const matchDist = selectedChatDistrict === 'all' || u.district === selectedChatDistrict;
                          const q = chatSearch.toLowerCase().trim();
                          const matchQ =
                            q === '' ||
                            u.name?.toLowerCase().includes(q) ||
                            u.username?.toLowerCase().includes(q) ||
                            u.email?.toLowerCase().includes(q) ||
                            u.phone?.toLowerCase().includes(q);
                          return matchReg && matchDist && matchQ;
                        })
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                  alt={u.name}
                                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-white text-xs">{u.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">@{u.username || u.email?.split('@')[0]}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span>{u.region || 'Toshkent shahri'}, <strong>{u.district || 'Chilonzor tumani'}</strong></span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                              <div>{u.email}</div>
                              <div className="text-slate-500">{u.phone || '—'}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              {u.isChatBanned ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                    <UserX className="w-3 h-3" />
                                    Chatdan Chiqarilgan
                                  </span>
                                  {u.chatBanReason && (
                                    <p className="text-[10px] text-rose-300/80 italic max-w-xs truncate">
                                      Sabab: {u.chatBanReason}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <Check className="w-3 h-3" />
                                  Faol (Ruxsat etilgan)
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              {u.role === 'admin' ? (
                                <span className="text-[11px] text-slate-500 italic">Bosh Admin</span>
                              ) : u.isChatBanned ? (
                                <button
                                  onClick={() => handleUnbanUserFromChat(u._id, u.name)}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all flex items-center gap-1.5 ml-auto active:scale-95"
                                  title="Chatga kirishni qayta tiklash"
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Qayta Ruxsat Berish</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setKickModalUser(u)}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5 ml-auto active:scale-95"
                                  title="Foydalanuvchini chatdan chiqarish"
                                >
                                  <UserX className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Chatdan Chiqarish</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: KICK / BAN USER FROM CHAT (Odamlarni Chatdan Chiqarish)
          ========================================================================= */}
      {kickModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-backdrop-fade">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-rose-500/40 p-6 space-y-5 animate-modal-pop shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    Foydalanuvchini Chatdan Chiqarish
                  </h3>
                  <p className="text-xs text-rose-300 font-semibold mt-0.5">
                    {kickModalUser.name} (@{kickModalUser.username || kickModalUser.email?.split('@')[0]})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKickModalUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Viloyat va Tuman:</span>
                <span className="font-bold text-white">{kickModalUser.region || 'Toshkent'} • {kickModalUser.district || 'Chilonzor'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-300">{kickModalUser.email}</span>
              </div>
            </div>

            <form onSubmit={handleKickUserFromChat} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Chiqarish Sababi *
                </label>
                <textarea
                  rows="3"
                  required
                  value={kickReason}
                  onChange={(e) => setKickReason(e.target.value)}
                  placeholder="Masalan: Chatda haqoratomuz so'zlar ishlatganligi sababli..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Ushbu foydalanuvchi endi chatga xabar yoza olmaydi va chatda ogohlantirish xabari chiqariladi.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setKickModalUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 active:scale-95"
                >
                  <UserX className="w-4 h-4" />
                  <span>{actionLoading ? 'Chiqarilmoqda...' : 'Chatdan Chiqarish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT PRODUCT PRICE & STOCK
          ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-5 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={editingProduct.image}
                  alt={editingProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-black text-white uppercase italic truncate max-w-xs">
                    {getLocalizedProduct(editingProduct, language).name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {t('admin_col_category')}: <strong className="text-slate-200">{categoryTranslations[editingProduct.category]?.[language] || editingProduct.category}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProductPrice(
                  editingProduct._id,
                  editingProduct.price,
                  editingProduct.originalPrice,
                  editingProduct.stock,
                  editingProduct.description,
                  editingProduct.name
                );
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t('admin_modal_name')} *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
                  <span>{t('admin_modal_desc')} *</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{t('admin_desc_persistent')}</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder={t('admin_desc_placeholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t('admin_sale_price_label')} *
                </label>
                <input
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-base font-black focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {t('admin_price_preview')}: <strong className="text-emerald-400">{formatPrice(editingProduct.price)}</strong>
                </span>
              </div>

              {/* Quick Adjustment Buttons */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  {t('admin_quick_calc_label')}:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Math.max(1000, Math.round((editingProduct.price * 0.9) / 1000) * 1000),
                        originalPrice: editingProduct.originalPrice || editingProduct.price,
                      })
                    }
                    className="py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-bold"
                  >
                    {t('admin_discount_10')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Math.max(1000, Math.round((editingProduct.price * 0.8) / 1000) * 1000),
                        originalPrice: editingProduct.originalPrice || editingProduct.price,
                      })
                    }
                    className="py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-bold"
                  >
                    {t('admin_discount_20')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Math.round((editingProduct.price * 1.1) / 1000) * 1000,
                      })
                    }
                    className="py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-xs font-bold"
                  >
                    {t('admin_increase_10')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        price: editingProduct.price + 50000,
                      })
                    }
                    className="py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-bold"
                  >
                    {t('admin_increase_50k')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    {t('admin_orig_price_label')}
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    {t('admin_stock_label')}
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold"
                >
                  {t('admin_modal_cancel')}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{actionLoading ? t('admin_saving') : t('admin_save_price_btn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT USER CREDENTIALS & PASSWORD
          ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-5 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={editingUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={editingUser.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/40"
                />
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    {editingUser.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{editingUser.email}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t('admin_full_name')} *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t('admin_col_username')} (@username) *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.username || ''}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Telefon raqam
                </label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Yangi parol (ixtiyoriy, agar o'zgartirmoqchi bo'lsangiz)
                </label>
                <input
                  type="password"
                  placeholder="Yangi parol kiriting..."
                  value={editingUser.newPassword || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Eski parol maxfiy saqlanadi va ekranda ko'rsatilmaydi.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {t('admin_col_role')}
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  disabled={editingUser.email === 'admin@gmail.com'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="user">{t('admin_role_user')}</option>
                  <option value="seller">{t('admin_role_seller')}</option>
                  <option value="admin">{t('admin_role_admin')}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold"
                >
                  {t('admin_modal_cancel')}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{actionLoading ? t('admin_saving') : t('admin_save_user')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT TRAINER
          ========================================================================= */}
      {editingTrainer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-5 animate-in fade-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={editingTrainer.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={editingTrainer.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    Murabbiy Ma'lumotlarini Tahrirlash
                  </h3>
                  <span className="text-xs text-slate-400">ID: {editingTrainer._id?.slice(-6)}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingTrainer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveTrainer();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Murabbiy To'liq Ismi *
                </label>
                <input
                  type="text"
                  required
                  value={editingTrainer.name || ''}
                  onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Unvoni / Lavozimi *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTrainer.title || ''}
                    onChange={(e) => setEditingTrainer({ ...editingTrainer, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Mutaxassisligi (Yo'nalishi) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTrainer.specialization || ''}
                    onChange={(e) => setEditingTrainer({ ...editingTrainer, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Soatlik narxi ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingTrainer.pricePerHour || ''}
                    onChange={(e) => setEditingTrainer({ ...editingTrainer, pricePerHour: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Tajribasi (yil) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingTrainer.experienceYears || ''}
                    onChange={(e) => setEditingTrainer({ ...editingTrainer, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Rasm URL manzili
                </label>
                <input
                  type="url"
                  value={editingTrainer.image || ''}
                  onChange={(e) => setEditingTrainer({ ...editingTrainer, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Bio / Tavsif
                </label>
                <textarea
                  rows="3"
                  value={editingTrainer.bio || ''}
                  onChange={(e) => setEditingTrainer({ ...editingTrainer, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTrainer(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{actionLoading ? 'Saqlanmoqda...' : 'Saqlash'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW TRAINER (Yangi Murabbiy Qo'shish)
          ========================================================================= */}
      {isAddingTrainer && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-backdrop-fade">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 sm:p-7 space-y-5 animate-modal-pop shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    Yangi Murabbiy Qo'shish
                  </h3>
                  <span className="text-xs text-slate-400">
                    Platformaga yangi sport instruktori yoki murabbiy qo'shish
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingTrainer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Murabbiy To'liq Ismi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rustamov"
                  value={newTrainerData.name}
                  onChange={(e) => setNewTrainerData({ ...newTrainerData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Lavozimi / Unvoni *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Bosh Fitnes Murabbiy"
                    value={newTrainerData.title}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Yo'nalishi / Sport turi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Boks, Marafon, Futbol"
                    value={newTrainerData.specialization}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Soatlik narxi ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="50"
                    value={newTrainerData.pricePerHour}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, pricePerHour: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Tajribasi (yil) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="5"
                    value={newTrainerData.experienceYears}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Telefon raqam
                  </label>
                  <input
                    type="text"
                    value={newTrainerData.phone}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, phone: e.target.value })}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email manzili
                  </label>
                  <input
                    type="email"
                    value={newTrainerData.email}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, email: e.target.value })}
                    placeholder="coach@sportshub.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Rasm URL manzili
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={newTrainerData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Preview"
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <input
                    type="url"
                    value={newTrainerData.image}
                    onChange={(e) => setNewTrainerData({ ...newTrainerData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Bio / Yutuqlari haqida
                </label>
                <textarea
                  rows="3"
                  placeholder="Xalqaro toifadagi sport ustasi, 500+ shogirdlar tayyorlagan..."
                  value={newTrainerData.bio}
                  onChange={(e) => setNewTrainerData({ ...newTrainerData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingTrainer(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 btn-press"
                >
                  <Plus className="w-4 h-4" />
                  <span>{actionLoading ? 'Qo\'shilmoqda...' : 'Qo\'shish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SELLER'S PRODUCTS DETAILS MODAL
          ========================================================================= */}
      {selectedSellerForProducts && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white uppercase italic">
                      {selectedSellerForProducts.shopName || selectedSellerForProducts.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t('admin_seller_status_active')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    👤 {t('admin_col_owner_info')}: <strong className="text-slate-200">{selectedSellerForProducts.name}</strong> • ✉️ {selectedSellerForProducts.email} {selectedSellerForProducts.phone ? `• 📞 ${selectedSellerForProducts.phone}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSellerForProducts(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick KPI stats in modal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('admin_col_products_count')}</span>
                <span className="text-base font-black text-white">{selectedSellerForProducts.productsCount || 0} {t('admin_items_unit')}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('admin_seller_in_stock')}</span>
                <span className="text-base font-black text-white">{selectedSellerForProducts.totalStock || 0} {t('admin_stock_unit')}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('admin_col_items_sold')}</span>
                <span className="text-base font-black text-amber-400">{selectedSellerForProducts.itemsSold || 0} {t('admin_items_unit')}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('admin_col_sales_stat')}</span>
                <span className="text-base font-black text-emerald-400">${(selectedSellerForProducts.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>{t('admin_seller_items_modal_title')} ({selectedSellerForProducts.products?.length || 0})</span>
              </h4>

              {(!selectedSellerForProducts.products || selectedSellerForProducts.products.length === 0) ? (
                <div className="py-12 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                  {t('admin_no_data')}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedSellerForProducts.products.map((p) => {
                    const locP = getLocalizedProduct(p, language);
                    return (
                      <div
                        key={p._id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="h-32 rounded-xl overflow-hidden bg-slate-900 relative">
                          <img
                            src={p.image}
                            alt={locP.name}
                            className="w-full h-full object-cover"
                          />
                          {(locP.badgeLabel || p.badge) && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500 text-slate-950">
                              {locP.badgeLabel || p.badge}
                            </span>
                          )}
                          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-slate-200">
                            {locP.categoryLabel || categoryTranslations[p.category]?.[language] || p.category}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white truncate">{locP.name}</h5>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-xs">
                            <span className="font-black text-emerald-400">${p.price}</span>
                            <span className="text-[11px] text-slate-400">
                              {t('admin_col_stock')}: <strong className="text-slate-200">{p.stock}</strong> {t('admin_stock_unit')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end border-t border-slate-800">
              <button
                onClick={() => setSelectedSellerForProducts(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                {t('admin_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
