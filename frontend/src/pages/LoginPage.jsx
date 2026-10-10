import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Flame, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = ({ setActiveTab }) => {
  const { login, demoLogin, adminLogin } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin' || loggedUser.email?.toLowerCase() === 'admin@gmail.com') {
        showToast('Xush kelibsiz, Administrator! Admin panel ochilmoqda...', 'success');
        setActiveTab('admin');
      } else if (loggedUser.isSeller) {
        showToast('Xush kelibsiz! Do\'kon paneli ochilmoqda...', 'success');
        setActiveTab('seller');
      } else {
        showToast('Tizimga muvaffaqiyatli kirildi!', 'success');
        setActiveTab('profile');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Login yoki parol noto\'g\'ri', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setLoading(true);
      await demoLogin();
      showToast('Sportchi Alex Johnson sifatida kirildi!', 'success');
      setActiveTab('profile');
    } catch {
      showToast('Demo tizimga kirishda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 mx-auto shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
            {t('auth_login_title')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('auth_login_desc')}
          </p>
        </div>

        {/* Quick Sign In for regular users */}
        <div>
          <button
            onClick={handleDemoSignIn}
            disabled={loading}
            type="button"
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('nav_demo_login')}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider absolute">
            Email & Parol
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('auth_email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="athlete@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('auth_password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? '...' : t('auth_signin_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-2 text-center text-xs text-slate-400">
          <span>{t('auth_no_account')}{' '}</span>
          <button
            onClick={() => setActiveTab('register')}
            className="text-emerald-400 font-bold hover:underline"
          >
            {t('auth_create_account')}
          </button>
        </div>

        {/* Credentials helper */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-2 text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">🔑 Sinov hisoblari / Test Accounts</span>
            <span className="text-[10px] text-slate-500">Bosing yoki kiriting</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-emerald-400 font-sans font-semibold">👤 Foydalanuvchi:</span>
            <span className="text-slate-300">alex@example.com / password123</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-amber-400 font-sans font-semibold">👑 Admin:</span>
            <span className="text-slate-300">admin@sportshub.com / adminpassword</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
