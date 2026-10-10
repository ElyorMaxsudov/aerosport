import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Flame,
  Calendar,
  MapPin,
  Users,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Trophy,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Globe,
  ShieldCheck,
  Sun,
  Moon,
  LogIn,
  KeyRound,
  Dumbbell,
  Check,
  Activity,
  Store,
  Coins,
  Truck,
  MessageSquare
} from 'lucide-react';
import FlagIcon from './FlagIcon';
import { useCurrency } from '../context/CurrencyContext';
import CommunityChatModal from './CommunityChatModal';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout, demoLogin, adminLogin, isAdmin, isSeller } = useAuth();
  const { totalItemsCount, setIsCartOpen, showToast, activeDelivery, setIsDeliveryModalOpen } = useCart();
  const { language, setLanguage, t, languages, currentLangObj } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { currency, setCurrency, currencies, currentCurrencyObj } = useCurrency();

  // Dropdown states
  const [communityChatOpen, setCommunityChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sportsDropdownOpen, setSportsDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Mobile accordion state for sports submenu
  const [mobileSportsOpen, setMobileSportsOpen] = useState(false);

  const navRef = useRef(null);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setSportsDropdownOpen(false);
        setAuthDropdownOpen(false);
        setProfileDropdownOpen(false);
        setLangDropdownOpen(false);
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemoSignIn = async () => {
    try {
      await demoLogin();
      showToast('Logged in as demo athlete Alex Johnson!', 'success');
      setAuthDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch {
      showToast('Demo login error', 'error');
    }
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSportsDropdownOpen(false);
    setAuthDropdownOpen(false);
    setProfileDropdownOpen(false);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSportsActive =
    activeTab === 'events' || activeTab === 'facilities' || activeTab === 'trainers';

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* =========================================================================
              1. BRAND LOGO
              ========================================================================= */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-2xl font-black tracking-tight text-white uppercase italic">
                  AERO<span className="text-emerald-400">SPORT</span>
                </span>
                <span className="text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="hidden sm:block text-[9px] sm:text-[11px] text-slate-400 font-medium tracking-wider uppercase">
                {t('nav_tagline')}
              </p>
            </div>
          </div>

          {/* =========================================================================
              2. DESKTOP CENTER NAVIGATION (Spacious, Organized with Dropdown)
              ========================================================================= */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* Home Tab */}
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className={`w-4 h-4 ${activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t('nav_home')}</span>
            </button>

            {/* Sport & Xizmatlar (DROPDOWN) */}
            <div className="relative">
              <button
                onClick={() => {
                  setSportsDropdownOpen(!sportsDropdownOpen);
                  setAuthDropdownOpen(false);
                  setProfileDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSportsActive || sportsDropdownOpen
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Compass className={`w-4 h-4 ${isSportsActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{t('nav_services_dropdown')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    sportsDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Sports Dropdown Menu */}
              <div
                className={`dropdown-panel-left absolute left-0 mt-2.5 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-2 backdrop-blur-xl z-50 space-y-1 ${
                  sportsDropdownOpen ? 'dropdown-panel-open' : 'dropdown-panel-closed'
                }`}
              >
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t('nav_services_desc')}
                  </p>
                </div>

                {/* Option 1: Events & Marathons */}
                <button
                  onClick={() => handleNavClick('events')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    activeTab === 'events'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {t('nav_events')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {t('nav_events_sub')}
                    </p>
                  </div>
                </button>

                {/* Option 2: Facilities */}
                <button
                  onClick={() => handleNavClick('facilities')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    activeTab === 'facilities'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {t('nav_facilities')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {t('nav_facilities_sub')}
                    </p>
                  </div>
                </button>

                {/* Option 3: Trainers */}
                <button
                  onClick={() => handleNavClick('trainers')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    activeTab === 'trainers'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {t('nav_trainers')}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {t('nav_trainers_sub')}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Shop Tab */}
            <button
              onClick={() => handleNavClick('shop')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'shop'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${activeTab === 'shop' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t('nav_shop')}</span>
            </button>
          </nav>

          {/* =========================================================================
              3. DESKTOP RIGHT CONTROLS (Clean, Spacious, Uncluttered)
              ========================================================================= */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCurrencyDropdownOpen(false);
                  setSportsDropdownOpen(false);
                  setAuthDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm btn-press active:scale-95 ${
                  langDropdownOpen
                    ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
                title="Change language / Tilni o'zgartirish"
              >
                <FlagIcon code={currentLangObj.code} className="w-4 h-3 transition-transform duration-200" />
                <span className="font-mono font-black text-xs text-white tracking-wider">
                  {currentLangObj.short || currentLangObj.code.toUpperCase()}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                    langDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                  }`}
                />
              </button>

              <div
                className={`dropdown-panel absolute right-0 mt-2.5 w-52 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl py-2 backdrop-blur-xl z-50 overflow-hidden ${
                  langDropdownOpen ? 'dropdown-panel-open' : 'dropdown-panel-closed'
                }`}
              >
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                  <span>Til / Language</span>
                  <Globe className="w-3 h-3 text-emerald-400" />
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-all duration-150 group hover:translate-x-1 ${
                      language === l.code
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FlagIcon code={l.code} className="w-4 h-3 transition-transform group-hover:scale-110" />
                      <span className="font-mono font-bold text-slate-200">{l.short}</span>
                      <span className="text-slate-500">•</span>
                      <span>{l.label}</span>
                    </span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Switcher Dropdown (so'm, USD, RUB, EUR) */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLangDropdownOpen(false);
                  setSportsDropdownOpen(false);
                  setAuthDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm btn-press active:scale-95 ${
                  currencyDropdownOpen
                    ? 'border-amber-500/60 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
                title="Valyutani o'zgartirish / Change Currency"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400 transition-transform duration-200 group-hover:rotate-12" />
                <span className="font-mono font-black text-xs text-emerald-400 tracking-wider">
                  {currentCurrencyObj.short}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                    currencyDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'
                  }`}
                />
              </button>

              <div
                className={`dropdown-panel absolute right-0 mt-2.5 w-56 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl py-2 backdrop-blur-xl z-50 overflow-hidden ${
                  currencyDropdownOpen ? 'dropdown-panel-open' : 'dropdown-panel-closed'
                }`}
              >
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                  <span>Valyuta / Currency</span>
                  <Coins className="w-3 h-3 text-amber-400" />
                </div>
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-all duration-150 group hover:translate-x-1 ${
                      currency === c.code
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 text-center font-mono font-black text-amber-400 group-hover:scale-110 transition-transform">
                        {c.symbol}
                      </span>
                      <span className="font-bold text-slate-200">{c.short}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-[11px] truncate">{c.name}</span>
                    </span>
                    {currency === c.code && <Check className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center group"
              title={isDark ? t('theme_toggle_to_light') : t('theme_toggle_to_dark')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Delivery Tracking Truck Trigger */}
            {activeDelivery && (
              <button
                onClick={() => setIsDeliveryModalOpen(true)}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-500/30 transition-all flex items-center justify-center group shadow-lg shadow-emerald-500/10 animate-pulse"
                title={t('delivery_truck_tooltip')}
              >
                <Truck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full flex items-center justify-center shadow-md border border-slate-950">
                  Live
                </span>
              </button>
            )}

            {/* Rayon Community Chat Button (Viloyati va rayoni mos foydalanuvchilar chati) */}
            {isAuthenticated && (
              <button
                onClick={() => setCommunityChatOpen((prev) => !prev)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shadow-sm group btn-press active:scale-95 ${
                  communityChatOpen
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/35 text-emerald-300 hover:text-white hover:bg-emerald-500/25'
                }`}
                title={`${user?.district || 'Rayon'} sportchilar chati (Ochish / Yopish)`}
              >
                <MessageSquare className={`w-4 h-4 transition-transform group-hover:scale-110 ${communityChatOpen ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span className="hidden xl:inline text-xs font-bold max-w-[120px] truncate">
                  {user?.district ? user.district.replace(/ (tumani|shahri)/gi, '') : 'Chat'}
                </span>
                <span className={`w-2 h-2 rounded-full ${communityChatOpen ? 'bg-slate-950' : 'bg-emerald-400 animate-ping'}`} />
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all group"
              title={t('nav_my_bag')}
            >
              <ShoppingBag className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* AUTH SECTION (Logged in or Dropdown Access) */}
            {isAuthenticated ? (
              /* Signed In Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setSportsDropdownOpen(false);
                    setAuthDropdownOpen(false);
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all"
                >
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={user?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <span className="text-xs font-bold text-slate-200 max-w-[90px] truncate">
                    Profile
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                      profileDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                </button>

                <div
                  className={`dropdown-panel absolute right-0 mt-2.5 w-60 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl py-2 backdrop-blur-xl z-50 overflow-hidden ${
                    profileDropdownOpen ? 'dropdown-panel-open' : 'dropdown-panel-closed'
                  }`}
                >
                  <div className="px-4 py-2.5 border-b border-slate-800/80">
                    <p className="text-[11px] text-slate-400">{t('nav_signed_in_as')}</p>
                    <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                  </div>

                  {isSeller && (
                    <button
                      onClick={() => {
                        setActiveTab('seller');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Store className="w-4 h-4 text-emerald-400" />
                      <span>{t('seller_nav_title')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-slate-800/70 transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>{t('nav_my_profile_bookings')}</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                      showToast('Logged out safely', 'info');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium border-t border-slate-800/80 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav_signout')}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Guest: Clean Access Dropdown & Sign Up Button */
              <div className="flex items-center gap-2">
                {/* Kirish / Sign In DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setAuthDropdownOpen(!authDropdownOpen);
                      setSportsDropdownOpen(false);
                      setProfileDropdownOpen(false);
                      setLangDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all btn-press active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('nav_signin')}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                        authDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {/* Auth Dropdown Menu */}
                  <div
                    className={`dropdown-panel absolute right-0 mt-2.5 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-2 backdrop-blur-xl z-50 space-y-1 ${
                      authDropdownOpen ? 'dropdown-panel-open' : 'dropdown-panel-closed'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {t('nav_quick_auth')}
                      </p>
                    </div>

                    {/* Regular Login */}
                    <button
                      onClick={() => handleNavClick('login')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>{t('auth_signin_btn')}</span>
                    </button>

                    {/* Demo Athlete One-Click */}
                    <button
                      onClick={handleDemoSignIn}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{t('nav_demo_login')}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                        Alex
                      </span>
                    </button>

                    {/* Register */}
                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => handleNavClick('register')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-emerald-400 text-xs font-semibold"
                      >
                        <span>{t('auth_create_account')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign Up Direct Button */}
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 uppercase tracking-wider"
                >
                  {t('nav_signup')}
                </button>
              </div>
            )}
          </div>

          {/* =========================================================================
              4. MOBILE CONTROLS & MENU TOGGLE
              ========================================================================= */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold"
              title={isDark ? t('theme_toggle_to_light') : t('theme_toggle_to_dark')}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Delivery Tracking Truck Mobile */}
            {activeDelivery && (
              <button
                onClick={() => setIsDeliveryModalOpen(true)}
                className="relative p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 animate-pulse flex items-center justify-center"
                title={t('delivery_truck_tooltip')}
              >
                <Truck className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
              </button>
            )}

            {/* Rayon Community Chat Mobile Trigger */}
            {isAuthenticated && (
              <button
                onClick={() => setCommunityChatOpen(true)}
                className="relative p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center"
                title={`${user?.district || 'Rayon'} sportchilar chati`}
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
              </button>
            )}

            {/* Cart Mobile */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
            >
              <ShoppingBag className="w-5 h-5 text-slate-300" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. MOBILE DRAWER MENU (Clean Accordion & Spaced Controls)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-8 space-y-3 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-3 duration-200">
          {/* Language selector in mobile drawer */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> {t('admin_language')}:
            </span>
            <div className="flex items-center gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    language === l.code
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <FlagIcon code={l.code} className="w-3.5 h-2.5" />
                  <span className="font-mono">{l.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Currency selector in mobile drawer */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> Valyuta:
            </span>
            <div className="flex items-center gap-1.5">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currency === c.code
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.short}
                </button>
              ))}
            </div>
          </div>

          {/* Active Delivery Mobile Banner */}
          {activeDelivery && (
            <button
              onClick={() => {
                setIsDeliveryModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 text-emerald-300 shadow-md animate-pulse"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Buyurtmangiz yo'lda! 🚚</p>
                  <p className="text-[10px] text-emerald-400">Yetib kelish vaqtini kuzatish</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* Rayon Community Chat Mobile Drawer Banner */}
          {isAuthenticated && (
            <button
              onClick={() => {
                setCommunityChatOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 border border-emerald-500/40 text-emerald-300 shadow-md group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">💬 {user?.district || 'Rayon'} Chati</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-[10px] text-emerald-400">Hududdosh sportchilar bilan jonli muloqot</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Navigation Links in Mobile */}
          <div className="space-y-1">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>{t('nav_home')}</span>
            </button>

            {/* Sports Accordion */}
            <div className="rounded-xl overflow-hidden bg-slate-900/40 border border-slate-800/80">
              <button
                onClick={() => setMobileSportsOpen(!mobileSportsOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <span>{t('nav_services_dropdown')}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    mobileSportsOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {mobileSportsOpen && (
                <div className="px-3 pb-3 space-y-1 border-t border-slate-800/60 pt-2">
                  <button
                    onClick={() => handleNavClick('events')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      activeTab === 'events' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{t('nav_events')}</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('facilities')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      activeTab === 'facilities' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{t('nav_facilities')}</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('trainers')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      activeTab === 'trainers' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{t('nav_trainers')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shop */}
            <button
              onClick={() => handleNavClick('shop')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'shop'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <span>{t('nav_shop')}</span>
            </button>

            {/* Seller Panel */}
            {isSeller && (
              <button
                onClick={() => handleNavClick('seller')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'seller'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                <Store className="w-5 h-5 text-emerald-400" />
                <span>{t('seller_nav_title')}</span>
              </button>
            )}
          </div>

          {/* Auth section in mobile drawer */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user?.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/40 shrink-0"
                  />
                  <span>{t('nav_my_profile_bookings')} (Profile)</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav_signout')}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 rounded-xl border border-slate-700 text-center font-bold text-slate-200 hover:bg-slate-900 text-xs"
                >
                  {t('nav_signin')}
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-center hover:bg-emerald-400 text-xs uppercase"
                >
                  {t('nav_signup')}
                </button>
                <button
                  onClick={handleDemoSignIn}
                  className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t('nav_demo_login')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Community Rayon Chat Modal */}
      <CommunityChatModal
        isOpen={communityChatOpen}
        onClose={() => setCommunityChatOpen(false)}
      />
    </header>
  );
};

export default Navbar;
