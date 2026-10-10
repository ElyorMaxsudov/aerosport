import React, { useState } from 'react';
import FacilityCard from '../components/FacilityCard';
import ScrollReveal from '../components/ScrollReveal';
import {
  MapPin,
  Search,
  CheckCircle,
  Clock,
  Shield,
  Filter,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedFacility } from '../utils/facilityLocalization';

const FacilitiesPage = ({ facilities, onBookFacility }) => {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState('all'); // all, mini_football, gym, sports_hall
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  // Extract unique cities (localized)
  const cities = Array.from(new Set(facilities.map((f) => {
    const loc = getLocalizedFacility(f, language);
    return loc?.city || f.city;
  }))).filter(Boolean);

  const filteredFacilities = facilities.filter((facility) => {
    const loc = getLocalizedFacility(facility, language) || facility;
    const matchesType = selectedType === 'all' || facility.type === selectedType;
    const matchesCity = selectedCity === 'all' || facility.city === selectedCity || loc.city === selectedCity;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      facility.name.toLowerCase().includes(q) ||
      loc.name.toLowerCase().includes(q) ||
      facility.address.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q) ||
      facility.city.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      facility.surface.toLowerCase().includes(q) ||
      loc.surface.toLowerCase().includes(q);

    return matchesType && matchesCity && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <MapPin className="w-4 h-4" /> {t('facilities_page_badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tight mt-1">
          {t('facilities_page_title')}
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {t('facilities_page_desc')}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-300">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> {t('hero_perk_instant')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Floodlit & Covered Pitches
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Showers & Locker Rooms Included
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
              placeholder={t('facilities_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t('facilities_filter_all')} ({facilities.length})
            </button>
            <button
              onClick={() => setSelectedType('mini_football')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === 'mini_football'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t('facilities_filter_football')}
            </button>
            <button
              onClick={() => setSelectedType('gym')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === 'gym'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t('facilities_filter_gym')}
            </button>
            <button
              onClick={() => setSelectedType('sports_hall')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === 'sports_hall'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t('facilities_filter_courts')}
            </button>
          </div>

          {/* City Filter */}
          <div className="w-full md:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{t('facilities_all_cities')}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Results Grid */}
      {filteredFacilities.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">{t('facilities_empty')}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching venue types or clearing your city and search filters.
          </p>
          <button
            onClick={() => { setSelectedType('all'); setSelectedCity('all'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility, index) => (
            <ScrollReveal key={facility._id} delay={Math.min(index * 60, 300)}>
              <FacilityCard
                facility={facility}
                onBook={onBookFacility}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
