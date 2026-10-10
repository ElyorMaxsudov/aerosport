import React from 'react';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import FacilityCard from '../components/FacilityCard';
import TrainerCard from '../components/TrainerCard';
import ProductCard from '../components/ProductCard';
import {
  Trophy,
  MapPin,
  Users,
  ShoppingBag,
  ArrowRight,
  Flame,
  Bike,
  Dumbbell,
  Shield,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HomePage = ({
  events,
  facilities,
  trainers,
  products,
  setActiveTab,
  onSelectEvent,
  onJoinEvent,
  onLeaveEvent,
  onBookFacility,
  onSelectTrainer,
  onSelectProduct,
}) => {
  const { t } = useLanguage();

  const sportCategories = [
    { name: t('sport_football'), icon: '⚽', tab: 'facilities' },
    { name: t('sport_running'), icon: '🏃', tab: 'events' },
    { name: t('sport_cycling'), icon: '🚴', tab: 'events' },
    { name: t('sport_gym'), icon: '🏋️', tab: 'facilities' },
    { name: t('sport_yoga'), icon: '🧘', tab: 'trainers' },
    { name: t('sport_boxing'), icon: '🥊', tab: 'shop' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <Hero setActiveTab={setActiveTab} />

      {/* 2. Popular Sports Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> {t('home_sports_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
              {t('home_sports_title')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            {t('home_sports_desc')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {sportCategories.map((sport, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveTab(sport.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-sm dark:shadow-none"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {sport.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {sport.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Upcoming Events & Marathons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> {t('home_events_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
              {t('home_events_title')}
            </h2>
          </div>

          <button
            onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto uppercase tracking-wider"
          >
            <span>{t('home_events_viewall')} ({events.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onSelect={onSelectEvent}
              onJoin={onJoinEvent}
              onLeave={onLeaveEvent}
            />
          ))}
        </div>
      </section>

      {/* 4. Book Mini Football & Gyms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {t('home_facilities_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
              {t('home_facilities_title')}
            </h2>
          </div>

          <button
            onClick={() => { setActiveTab('facilities'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto uppercase tracking-wider"
          >
            <span>{t('home_facilities_viewall')} ({facilities.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.slice(0, 3).map((facility) => (
            <FacilityCard
              key={facility._id}
              facility={facility}
              onBook={onBookFacility}
            />
          ))}
        </div>
      </section>

      {/* 5. Recommended Gear & Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> {t('home_shop_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
              {t('home_shop_title')}
            </h2>
          </div>

          <button
            onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto uppercase tracking-wider"
          >
            <span>{t('home_shop_viewall')} ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. Popular Gyms and Trainers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {t('home_trainers_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
              {t('home_trainers_title')}
            </h2>
          </div>

          <button
            onClick={() => { setActiveTab('trainers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto uppercase tracking-wider"
          >
            <span>{t('home_trainers_viewall')} ({trainers.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.slice(0, 3).map((trainer) => (
            <TrainerCard
              key={trainer._id}
              trainer={trainer}
              onSelect={onSelectTrainer}
            />
          ))}
        </div>
      </section>

      {/* 7. Call-to-Action Dual Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Host / Organize an event */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 dark:from-slate-900 dark:to-slate-950 p-8 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t('cta_organizer_badge')}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                {t('cta_organizer_title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
                {t('cta_organizer_desc')}
              </p>
            </div>
            <div>
              <button
                onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
              >
                {t('cta_organizer_btn')} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Banner 2: Book field tonight */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/60 dark:from-slate-900 dark:to-slate-950 p-8 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {t('cta_football_badge')}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                {t('cta_football_title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
                {t('cta_football_desc')}
              </p>
            </div>
            <div>
              <button
                onClick={() => { setActiveTab('facilities'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-bold text-xs uppercase tracking-wider border border-slate-800 dark:border-slate-700 transition-all inline-flex items-center gap-2 shadow-sm"
              >
                {t('cta_football_btn')} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
