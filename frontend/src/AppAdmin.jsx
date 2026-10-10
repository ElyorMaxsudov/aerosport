import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ExternalLink,
  Sun,
  Moon,
  Globe,
  Sparkles,
  LogOut,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Toast from './components/Toast';

function AppAdmin() {
  const { user, isAdmin, login, adminLogin, logout } = useAuth();
  const { showToast } = useCart();
  const { language, setLanguage, languages, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  // Admin login form states
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('adimin12345');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      await login(email.trim(), password.trim());
      showToast("Tizim egasi muvaffaqiyatli autentifikatsiyadan o'tdi! 🛡️", 'success');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        "Kirish rad etildi! Faqat tizim administratori paroli bilan kirish mumkin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await adminLogin();
      showToast("Tizim egasi sifatida tezkor kirildi! ⚡", 'success');
    } catch (err) {
      setErrorMsg("Tezkor kirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated as Admin, show the Dedicated Master Admin Security Gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans relative overflow-hidden">
        {/* Toast notifications */}
        <Toast />

        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/20 via-emerald-500/15 to-transparent blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none" />

        {/* Top Navbar for Admin Gate */}
        <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white uppercase italic">
                  AERO<span className="text-amber-400">ADMIN</span>
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PORT 5174
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Boshqaruv Markazi (Faqat Sayt Egasi Uchun)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Link to Client Site */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-sm"
              title="Mijozlar saytini yangi oynada ochish"
            >
              <span>Mijozlar Sayti (5173)</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>

            {/* Language Picker */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    language === l.code ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Center Admin Security Form */}
        <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
          <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Himoyalangan Boshqaruv Portali
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
                Tizim Egasi Kirishi
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Ushbu sahifa faqat platforma egasiga ko'rinadi. Mahsulotlar narxlari, murabbiylar va buyurtmalarni sozlash uchun kiring.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Email / Gmail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Paroli
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="adimin12345"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Tekshirilmoqda...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Paneliga Kirish</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Fast Login for site owner */}
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>⚡ Tizim Egasi Sifatida Avtomatik Kirish</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center">
              <a
                href="http://localhost:5173"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>Mijozlar do'koni va sport portaliga qaytish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="w-full border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
          AeroSport Master Control Center • Alohida Admin Porti: <code className="text-amber-400">localhost:5174</code>
        </footer>
      </div>
    );
  }

  // Once authenticated as Admin, render the full dedicated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast notifications */}
      <Toast />

      {/* Standalone Admin Top Banner */}
      <header className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>ADMIN SAYT • PORT 5174</span>
          </div>
          <span className="hidden sm:inline text-slate-400 font-medium">
            Platforma Egasining Maxsus Boshqaruv Markazi
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Link to Customer Site */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold transition-all"
            title="Mijozlar saytini ochish"
          >
            <span>Mijozlar Sayti (5173)</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Log Out */}
          <button
            onClick={logout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold transition-all"
            title="Admin hisobidan chiqish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <div className="flex-1">
        <AdminDashboardPage setActiveTab={() => {}} onRefreshData={() => {}} />
      </div>
    </div>
  );
}

export default AppAdmin;
