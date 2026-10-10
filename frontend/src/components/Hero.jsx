import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  MapPin,
  Users,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Activity,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [activeClickId, setActiveClickId] = useState(null);

  // Play pleasant sound on tactile button press
  const playClickPop = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  const handleStatClick = (id, tabName) => {
    playClickPop();
    setActiveClickId(id);
    setTimeout(() => {
      setActiveClickId(null);
      if (setActiveTab) {
        setActiveTab(tabName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 180);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/80">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              {t('hero_badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] uppercase italic">
              {t('hero_title_1')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                {t('hero_title_2')}
              </span>{' '}
              {t('hero_title_3')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('hero_desc')}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02]"
              >
                <Trophy className="w-4 h-4" />
                {t('hero_btn_events')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { setActiveTab('facilities'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm"
              >
                <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                {t('hero_btn_fields')}
              </button>

              <button
                onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs uppercase tracking-wider border border-slate-300 dark:border-slate-800 transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                {t('hero_btn_shop')}
              </button>
            </div>

            {/* Quick feature badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{t('hero_perk_instant')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{t('hero_perk_verified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{t('hero_perk_gear')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main spotlight image card */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80"
                  alt="Sports performance athlete"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Overlaid stats pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Live Community
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Metropolis Marathon 2026</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">2,140 {t('hero_card_registered')}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                  >
                    {t('hero_card_view')}
                  </button>
                </div>
              </div>

              {/* Floating micro card 1: Football pitch booking */}
              <div className="hidden sm:flex absolute -top-5 -left-6 p-3 rounded-2xl glass-panel border border-emerald-500/30 shadow-xl items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 text-lg">
                  ⚽
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">San Siro Arena</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t('hero_card_avail')}</p>
                </div>
              </div>

              {/* Floating micro card 2: Certified Coach */}
              <div className="hidden sm:flex absolute -bottom-5 -right-4 p-3 rounded-2xl glass-panel border border-cyan-500/30 shadow-xl items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="Coach Marcus"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-400"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Coach Marcus Vance</p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-300 font-semibold">★ 4.9 Marathon Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Statistics Counter Bar with tactile click animations */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: 25+ Marafon va Velopoygalar */}
          <button
            type="button"
            onClick={() => handleStatClick('races', 'events')}
            className={`group relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border text-center transition-all duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl active:scale-90 select-none ${
              activeClickId === 'races'
                ? 'scale-90 border-amber-500 bg-amber-500/20 shadow-amber-500/30 ring-2 ring-amber-500/50'
                : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/60 shadow-sm dark:shadow-none'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight group-hover:text-amber-400 group-hover:scale-110 transition-all duration-200">
                25+
              </span>
              <span className="text-xl group-hover:animate-bounce">🏃‍♂️</span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-amber-400 transition-colors">
              {t('hero_stat_races')}
            </p>
            <div className="mt-2 flex items-center justify-center">
              <span className="h-1 w-6 rounded-full bg-amber-500 group-hover:w-14 transition-all duration-300"></span>
            </div>
          </button>

          {/* Card 2: 100% Maydon band qilish kafolati */}
          <button
            type="button"
            onClick={() => handleStatClick('guarantee', 'facilities')}
            className={`group relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border text-center transition-all duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl active:scale-90 select-none ${
              activeClickId === 'guarantee'
                ? 'scale-90 border-emerald-500 bg-emerald-500/20 shadow-emerald-500/30 ring-2 ring-emerald-500/50'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 shadow-sm dark:shadow-none'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 italic tracking-tight group-hover:scale-110 transition-all duration-200">
                100%
              </span>
              <span className="text-xl group-hover:animate-bounce">🏟️</span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-emerald-400 transition-colors">
              {t('hero_stat_guarantee')}
            </p>
            <div className="mt-2 flex items-center justify-center">
              <span className="h-1 w-6 rounded-full bg-emerald-500 group-hover:w-14 transition-all duration-300"></span>
            </div>
          </button>

          {/* Card 3: 50+ Murabbiylar */}
          <button
            type="button"
            onClick={() => handleStatClick('coaches', 'trainers')}
            className={`group relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border text-center transition-all duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl active:scale-90 select-none ${
              activeClickId === 'coaches'
                ? 'scale-90 border-teal-500 bg-teal-500/20 shadow-teal-500/30 ring-2 ring-teal-500/50'
                : 'border-slate-200 dark:border-slate-800 hover:border-teal-500/60 shadow-sm dark:shadow-none'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 italic tracking-tight group-hover:scale-110 transition-all duration-200">
                50+
              </span>
              <span className="text-xl group-hover:animate-bounce">🏋️</span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-400 transition-colors">
              {t('hero_stat_coaches')}
            </p>
            <div className="mt-2 flex items-center justify-center">
              <span className="h-1 w-6 rounded-full bg-teal-500 group-hover:w-14 transition-all duration-300"></span>
            </div>
          </button>

          {/* Card 4: 1,000+ Mahsulotlar */}
          <button
            type="button"
            onClick={() => handleStatClick('gear', 'shop')}
            className={`group relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border text-center transition-all duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:shadow-xl active:scale-90 select-none ${
              activeClickId === 'gear'
                ? 'scale-90 border-cyan-500 bg-cyan-500/20 shadow-cyan-500/30 ring-2 ring-cyan-500/50'
                : 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 shadow-sm dark:shadow-none'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 italic tracking-tight group-hover:scale-110 transition-all duration-200">
                1,000+
              </span>
              <span className="text-xl group-hover:animate-bounce">⚡</span>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-cyan-400 transition-colors">
              {t('hero_stat_gear')}
            </p>
            <div className="mt-2 flex items-center justify-center">
              <span className="h-1 w-6 rounded-full bg-cyan-500 group-hover:w-14 transition-all duration-300"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
