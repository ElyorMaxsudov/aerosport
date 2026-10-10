import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Flame, Mail, Lock, User, Phone, Target, ArrowRight, Store, Sparkles, MapPin, MessageSquare } from 'lucide-react';
import {
  UZBEKISTAN_REGIONS,
  getDistrictsByRegion,
  DEFAULT_REGION,
  DEFAULT_DISTRICT,
} from '../utils/regionsData';

const RegisterPage = ({ setActiveTab }) => {
  const { register } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    region: DEFAULT_REGION,
    district: DEFAULT_DISTRICT,
    fitnessGoal: 'Marathon & Endurance',
    favoriteSports: ['Running', 'Gym'],
    isSeller: false,
    shopName: '',
    shopDescription: '',
  });

  const [loading, setLoading] = useState(false);

  const availableSports = ['Running', 'Football', 'Gym', 'Cycling', 'Basketball', 'Yoga', 'Boxing', 'Swimming'];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSport = (sport) => {
    setFormData((prev) => {
      const exists = prev.favoriteSports.includes(sport);
      return {
        ...prev,
        favoriteSports: exists
          ? prev.favoriteSports.filter((s) => s !== sport)
          : [...prev.favoriteSports, sport],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (formData.isSeller && !formData.shopName.trim()) {
      showToast(t('auth_shop_name') + ' kiritilishi shart', 'error');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      if (formData.isSeller) {
        showToast('Sport do\'koningiz muvaffaqiyatli ochildi! Kichik admin panelga xush kelibsiz!', 'success');
        setActiveTab('seller');
      } else {
        showToast('Welcome to AeroSport Pro! Athlete profile created.', 'success');
        setActiveTab('profile');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 mx-auto shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
            {t('auth_reg_title')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('auth_reg_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('auth_name')} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                required
                placeholder="Marcus Miller"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('auth_email')} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                placeholder="marcus@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('auth_password')} * (min 6)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+998 (90) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Hududiy Jamiyat & Chat Savollari (1: Viloyat, 2: Rayon) */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                  Hududiy Sport Jamiyati & Chat
                </h4>
                <p className="text-[10px] text-slate-400">
                  O'z hududingizdagi sportchilar bilan yagona rayon chatida bog'lanish uchun
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1-savol: Viloyat */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  1. Viloyatingiz *
                </label>
                <select
                  name="region"
                  required
                  value={formData.region}
                  onChange={(e) => {
                    const newRegion = e.target.value;
                    const districts = getDistrictsByRegion(newRegion);
                    setFormData((prev) => ({
                      ...prev,
                      region: newRegion,
                      district: districts[0] || '',
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                >
                  {UZBEKISTAN_REGIONS.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2-savol: Tuman / Rayon */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  2. Rayon / Tumaningiz *
                </label>
                <select
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-bold focus:outline-none focus:border-emerald-500"
                >
                  {getDistrictsByRegion(formData.region).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-0.5">
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Ro'yxatdan o'tgach, navbarda <strong>"{formData.district}"</strong> chati faollashadi!</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> {t('auth_goal')}
            </label>
            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Marathon & Endurance">Marathon & Long-Distance Endurance</option>
              <option value="Football & Agility">Football Skill & Match Fitness</option>
              <option value="Muscle Hypertrophy">Muscle Hypertrophy & Strength</option>
              <option value="Weight Loss & Conditioning">Weight Loss & Functional Conditioning</option>
              <option value="Cycling Power & Watts">Road Cycling Power & Cadence</option>
              <option value="General Health">General Health & Longevity</option>
            </select>
          </div>

          {/* Favorite Sports Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('auth_fav_sports')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableSports.map((sport) => {
                const isSelected = formData.favoriteSports.includes(sport);
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sport}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sport do'koningiz bormi? (Seller question) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-amber-500/10 border border-emerald-500/30 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={(e) => setFormData((prev) => ({ ...prev, isSeller: e.target.checked }))}
                className="mt-1 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-950 cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>{t('auth_ask_seller_title')}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t('auth_ask_seller_desc')}
                </p>
              </div>
            </label>

            {formData.isSeller && (
              <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    {t('auth_shop_name')} *
                  </label>
                  <input
                    type="text"
                    required={formData.isSeller}
                    placeholder="Masalan: ProSport Tashkent, Everest Gear..."
                    value={formData.shopName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shopName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    {t('auth_shop_desc')}
                  </label>
                  <input
                    type="text"
                    placeholder="Futbol kiyimlari, to'plar va sport anjomlari..."
                    value={formData.shopDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shopDescription: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{t('auth_seller_perk')}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            <span>{loading ? '...' : t('auth_complete_reg')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>{t('auth_have_account')}{' '}</span>
          <button
            onClick={() => setActiveTab('login')}
            className="text-emerald-400 font-bold hover:underline"
          >
            {t('nav_signin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
