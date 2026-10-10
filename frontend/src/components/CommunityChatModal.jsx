import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquare,
  X,
  Send,
  MapPin,
  Users,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Clock,
  Smile,
  ShieldCheck,
  Search,
  ArrowLeft,
  CheckCheck,
  Compass,
  Flame,
  Info,
  Trophy,
  Dumbbell,
  Bike
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CommunityChatModal({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const chatScrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  const userRegion = user?.region || 'Toshkent shahri';
  const userDistrict = user?.district || 'Chilonzor tumani';

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // Lock body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus input on open
      setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      document.body.style.overflow = '';
      setMobileInfoOpen(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch messages for user's specific region & district
  const fetchMessages = async (silent = false) => {
    if (!isOpen || !isAuthenticated) return;
    try {
      if (!silent) setLoading(true);
      const res = await axiosClient.get('/chat/messages', {
        params: {
          region: userRegion,
          district: userDistrict,
        },
      });
      setMessages(res.data);
      if (!silent) {
        setTimeout(() => scrollToBottom(false), 120);
      }
    } catch (err) {
      if (!silent) {
        console.error('Failed to fetch chat messages:', err);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Sync banned state from user object
  useEffect(() => {
    if (user?.isChatBanned) {
      setIsBanned(true);
      setBanReason(user?.chatBanReason || "Qoidalarni buzganlik uchun");
    } else {
      setIsBanned(false);
      setBanReason('');
    }
  }, [user]);

  // Initial load when chat opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMessages(false);
    }
  }, [isOpen, isAuthenticated, userRegion, userDistrict]);

  // Auto-polling interval: re-fetch messages every 3.5s for real-time district chatting
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen, isAuthenticated, userRegion, userDistrict]);

  // Scroll on new message
  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || sending) return;

    if (isBanned) {
      showToast("Siz chatdan chiqarilgansiz, xabar yuborib bo'lmaydi", "error");
      return;
    }

    try {
      setSending(true);
      const res = await axiosClient.post('/chat/messages', {
        message: cleanText,
        region: userRegion,
        district: userDistrict,
      });

      setMessages((prev) => [...prev, res.data]);
      setInputText('');
      setTimeout(() => scrollToBottom(true), 50);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.isChatBanned) {
        setIsBanned(true);
        setBanReason(err.response?.data?.chatBanReason || "Ma'muriyat tomonidan chiqarildingiz");
        showToast(err.response?.data?.message || "Siz chatdan chiqarilgansiz", "error");
      } else {
        showToast(err.response?.data?.message || "Xabar yuborishda xatolik", "error");
      }
    } finally {
      setSending(false);
    }
  };

  const addQuickReaction = (text) => {
    if (isBanned) return;
    setInputText((prev) => prev ? `${prev} ${text}` : text);
    inputRef.current?.focus();
  };

  // Filter messages by search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase().trim();
    return messages.filter(
      (m) =>
        m.message?.toLowerCase().includes(q) ||
        m.userName?.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  if (!isOpen) return null;

  return createPortal(
    <div
      id="aerosport-community-chat-root"
      className="fixed top-16 sm:top-20 inset-x-0 bottom-0 z-40 w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] bg-slate-950 text-slate-100 flex flex-col overflow-hidden animate-page-enter select-text"
    >
      {/* =========================================================================
          1. SUB-HEADER STRIP (Directly below Navbar, full width)
          ========================================================================= */}
      <div className="w-full bg-slate-900/95 border-b border-slate-800/90 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shrink-0 backdrop-blur-md">
        {/* Left: Back to Site Button & District Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shrink-0 group active:scale-95"
            title="Asosiy saytga qaytish"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-emerald-400" />
            <span className="hidden sm:inline">Saytga qaytish</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 shrink-0 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-emerald-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{userDistrict}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Jonli Chat
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate hidden xs:block">
                {userRegion} • Hududiy Sport Hamjamiyati
              </h2>
            </div>
          </div>
        </div>

        {/* Right: Search, Refresh, Total Messages, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Messages Search Bar */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Xabarlardan qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 lg:w-56 pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Refresh Messages */}
          <button
            onClick={() => fetchMessages(false)}
            disabled={loading}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
            title="Xabarlarni yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden xl:inline">Yangilash</span>
          </button>

          {/* Total count badge */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{messages.length} xabar</span>
          </div>

          {/* Mobile Info Toggle */}
          <button
            onClick={() => setMobileInfoOpen(!mobileInfoOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Hudud ma'lumotlari"
          >
            <Info className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
            title="Chatni yopish (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Yopish</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. FULL-SCREEN RESPONSIVE MAIN BODY
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* =========================================================================
            LEFT SIDEBAR: HUDUD MA'LUMOTLARI & QOIDALAR (Desktop & Laptop / Mobile Drawer)
            ========================================================================= */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 lg:z-auto
            w-80 sm:w-96 lg:w-80 xl:w-96 flex flex-col
            border-r border-slate-800/80 bg-slate-900/95 lg:bg-slate-900/70
            backdrop-blur-xl shrink-0 overflow-y-auto transition-transform duration-300
            ${mobileInfoOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4 sm:p-5 space-y-4">
            {/* Mobile Close Button for Drawer */}
            <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Hududiy Jamiyat Paneli
              </span>
              <button
                onClick={() => setMobileInfoOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Region Banner Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/30 relative overflow-hidden shadow-lg shadow-emerald-950/20">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    Sport Jamiyati
                  </span>
                  <h3 className="text-sm font-black text-white leading-tight mt-0.5">
                    {userDistrict}
                  </h3>
                  <p className="text-[11px] text-slate-300">{userRegion}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Jamiyat holati:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Faol Muloqotda
                </span>
              </div>
            </div>

            {/* Tezkor Mavzular (Quick Topics) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Tezkor Sport Mavzulari</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Mavzuni bosib xabar qatoriga tezkor qo'shing:
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: '⚽', label: 'Mini-futbol o‘yinlari', text: '⚽ Bugun mini-futbol o‘ynashga kim bor?' },
                  { icon: '🏃‍♂️', label: 'Ertalabki yugurish / Marafon', text: '🏃‍♂️ Ertaga ertalab soat 06:30 da yuguramizmi?' },
                  { icon: '🏋️', label: 'Fitnes & Zal mashg‘ulotlari', text: '🏋️ Zalga birga borishga sherik bormi?' },
                  { icon: '🚴', label: 'Velosport va velosayohat', text: '🚴 Dam olish kuni velosayohatga chiqamizmi?' },
                  { icon: '🥊', label: 'Boks va jang san‘atlari', text: '🥊 Mashg‘ulotlar qaysi sport zalda o‘tilyapti?' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addQuickReaction(item.text)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/50 border border-slate-800 text-left text-xs font-semibold text-slate-200 transition-all group"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Qoidalar & Xavfsizlik */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Muloqot Qoidalari</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Faqat sport, mashg'ulot va sog'lom hayot mavzulari</li>
                <li>Bir-biringizni hurmat qiling va sport qoidalariga rioya qiling</li>
                <li>Reklama va nojo'ya xabarlar yozganlar chatdan chiqariladi</li>
              </ul>
            </div>

            {/* Big Back Button in Sidebar */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Saytga Qaytish</span>
            </button>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN CHAT STREAM (Broad, responsive across laptop, tablet, mobile)
            ========================================================================= */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-950/60 overflow-hidden relative">
          {/* Chat Messages Feed */}
          <div
            ref={chatScrollContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 scroll-smooth"
          >
            {/* Welcoming Top Card */}
            <div className="max-w-xl mx-auto my-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center space-y-1.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                "{userDistrict}" Rasmiy Muloqot Maydoni
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
                Bu yerdagi barcha xabarlar faqat siz bilan bir xil viloyat va rayonda yashovchi sportchilarga ko'rinadi. Yangi do'stlar toping va birga sport bilan shug'ullaning!
              </p>
            </div>

            {loading && messages.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Hududiy xabarlar yuklanmoqda...
                </p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-20 text-center space-y-3 text-slate-500 text-xs max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <MessageSquare className="w-7 h-7" />
                </div>
                {searchQuery ? (
                  <p>"{searchQuery}" bo'yicha xabarlar topilmadi.</p>
                ) : (
                  <div>
                    <p className="font-bold text-slate-300 text-sm">Hozircha xabarlar yo'q</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Birinchi bo'lib salom yozing va tumandoshlaringizni sportga chorlang!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              filteredMessages.map((m) => {
                const isMe = m.user?._id === user?._id || m.user === user?._id;
                const isSystem = m.systemMessage === true;

                if (isSystem) {
                  return (
                    <div
                      key={m._id}
                      className="p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-center space-y-1.5 shadow-md max-w-lg mx-auto animate-modal-pop"
                    >
                      <div className="flex items-center justify-center gap-1.5 font-bold text-amber-300">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{m.userName || 'Tizim / Ma’muriyat E’loni'}</span>
                      </div>
                      <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                        {m.message}
                      </p>
                      <span className="text-[9px] text-amber-400/80 font-mono block">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m._id}
                    className={`flex items-end gap-2.5 sm:gap-3.5 ${
                      isMe ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* User Avatar */}
                    <img
                      src={m.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={m.userName}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl object-cover ring-2 ring-slate-800 shrink-0 shadow-md"
                    />

                    {/* Message Bubble & Meta */}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[68%] space-y-1 flex flex-col ${
                        isMe ? 'items-end' : 'items-start'
                      }`}
                    >
                      {/* Name, Role & Timestamp */}
                      <div className={`flex items-center gap-1.5 text-[11px] px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="font-extrabold text-slate-200">
                          {isMe ? 'Siz' : m.userName}
                        </span>
                        {m.userRole === 'admin' ? (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/30 flex items-center gap-0.5">
                            👑 Admin
                          </span>
                        ) : m.userRole === 'seller' ? (
                          <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[9px] font-black border border-sky-500/30">
                            🏪 Do‘kon
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Sportchi</span>
                        )}
                        <span className="text-slate-500 font-mono text-[10px]">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl sm:rounded-3xl text-xs sm:text-sm leading-relaxed break-words shadow-lg transition-all ${
                          isMe
                            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white rounded-br-none shadow-emerald-950/40'
                            : 'bg-slate-900/95 border border-slate-800 text-slate-100 rounded-bl-none shadow-black/40'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.message}</p>
                        {isMe && (
                          <div className="flex justify-end mt-1 text-[9px] text-emerald-200/90 font-mono">
                            <CheckCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* =========================================================================
              QUICK REACTIONS / CHIPS BAR
              ========================================================================= */}
          {!isBanned && (
            <div className="px-3 sm:px-6 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase mr-1 flex items-center gap-1 shrink-0">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                <span>Tezkor:</span>
              </span>
              {[
                '👋 Salom hammaga!',
                '🏃‍♂️ Yuguramizmi?',
                '⚽ Futbol bormi?',
                '🔥 Zo‘r!',
                '💪 Olg‘a sportchilar!',
                '🚴‍♂️ Velosiped safari',
                '🏆 Musobaqaga tayyormisiz?',
                '⚡️ Qachon va qayerda?',
                '👍 Rahmat',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addQuickReaction(chip)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700/80 text-[11px] text-slate-300 font-medium transition-all shrink-0 active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* =========================================================================
              CHAT INPUT OR BANNED ALERT
              ========================================================================= */}
          <div className="p-3 sm:p-5 bg-slate-900/95 border-t border-slate-800 shrink-0 backdrop-blur-md">
            {isBanned ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs shadow-inner">
                <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-white text-sm">
                    Siz ushbu chatdan ma'muriyat tomonidan chiqarilgansiz!
                  </p>
                  <p className="text-xs text-rose-300 mt-0.5">
                    Sabab: <span className="font-bold underline">{banReason || "Chat qoidalariga rioya qilinmagan"}</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3 max-w-6xl mx-auto">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={`${userDistrict} sportchilariga xabar yozing... (Enter - yuborish)`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={sending}
                    className="w-full pl-4 pr-10 py-3 sm:py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner transition-all"
                  />
                  <span className="absolute right-3.5 top-3.5 text-slate-500 hidden sm:block">
                    <Smile className="w-4 h-4 cursor-pointer hover:text-amber-400 transition-colors" />
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 shrink-0 active:scale-95"
                >
                  <Send className={`w-4 h-4 ${sending ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">Yuborish</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
}
