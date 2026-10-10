import React, { useState } from 'react';
import TrainerCard from '../components/TrainerCard';
import ScrollReveal from '../components/ScrollReveal';
import {
  Users,
  Search,
  Award,
  Star,
  CheckCircle,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const TrainersPage = ({ trainers = [], onSelectTrainer }) => {
  const { t } = useLanguage();
  const { isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useCart();

  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const specialties = [
    { id: 'all', label: 'All Coaches' },
    { id: 'Running', label: '🏃 Marathon & Running' },
    { id: 'Football', label: '⚽ Football & Agility' },
    { id: 'CrossFit', label: '🏋️ CrossFit & Strength' },
    { id: 'Bodybuilding', label: '💪 Hypertrophy' },
    { id: 'Yoga', label: '🧘 Yoga & Mobility' },
    { id: 'Cycling', label: '🚴 Cycling & Watts' },
  ];

  const filteredTrainers = trainers
    .filter((trainer) => {
      const matchesSpecialty =
        selectedSpecialty === 'all' ||
        trainer.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        trainer.sports?.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

      const matchesSearch =
        searchQuery === '' ||
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.sports?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSpecialty && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'price-low') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'price-high') return b.pricePerHour - a.pricePerHour;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <Users className="w-4 h-4" /> {t('trainers_page_badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tight mt-1">
          {t('trainers_page_title')}
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {t('trainers_page_desc')}
        </p>

        {/* Benefits bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Background-checked & certified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Tailored personalized plans
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Direct 1-on-1 coach chat
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t('trainers_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sort selector */}
          <div className="w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="rating">{t('trainers_sort_rating')}</option>
              <option value="experience">{t('trainers_sort_exp')}</option>
              <option value="price-low">{t('trainers_sort_price_asc')}</option>
              <option value="price-high">{t('trainers_sort_price_desc')}</option>
            </select>
          </div>
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {specialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === spec.id
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trainers Results Grid */}
      {filteredTrainers.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">{t('trainers_empty')}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing a different sport category or clearing the search text.
          </p>
          <button
            onClick={() => { setSelectedSpecialty('all'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer, index) => (
            <ScrollReveal key={trainer._id} delay={Math.min(index * 60, 300)}>
              <TrainerCard
                trainer={trainer}
                onSelect={onSelectTrainer}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainersPage;
