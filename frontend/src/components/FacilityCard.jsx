import React from 'react';
import { MapPin, Star, Clock, Check, Users, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getLocalizedFacility } from '../utils/facilityLocalization';

const FacilityCard = ({ facility, onBook }) => {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  const loc = getLocalizedFacility(facility, language) || facility;

  const typeLabels = {
    mini_football: { label: t('facilities_filter_football'), color: 'bg-emerald-500 text-slate-950', icon: '⚽' },
    gym: { label: t('facilities_filter_gym'), color: 'bg-amber-500 text-slate-950', icon: '🏋️' },
    sports_hall: { label: t('facilities_filter_courts'), color: 'bg-cyan-500 text-slate-950', icon: '🏀' },
  };

  const currentType = typeLabels[facility.type] || {
    label: loc.typeLabel || facility.type,
    color: 'bg-teal-500 text-slate-950',
    icon: '🏟️',
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-xl dark:shadow-none">
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={facility.image}
          alt={facility.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              facility.type === 'mini_football'
                ? 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1000&q=80'
                : facility.type === 'gym'
                ? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80'
                : 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${currentType.color}`}
          >
            <span>{currentType.icon}</span>
            {currentType.label}
          </span>
        </div>

        {/* Price Tag */}
        <div className="keep-white absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-right shadow-md">
          <span className="text-base font-black text-emerald-300">{formatPrice(facility.pricePerHour)}</span>
          <span className="text-[11px] text-slate-200"> / {t('trainers_hour')}</span>
        </div>

        {/* Rating */}
        <div className="keep-white absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-xs font-bold text-amber-300 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>{facility.rating}</span>
          <span className="text-slate-200 text-[10px]">({facility.reviewsCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {loc.name || facility.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{loc.address || facility.address}, {loc.city || facility.city}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t('facilities_surface')}: <span className="text-emerald-600 dark:text-emerald-400 font-normal">{loc.surface || facility.surface}</span></span>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">{facility.dimensions}</span>
          </div>

          {/* Amenities chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(loc.amenities || facility.amenities)?.slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                {amenity}
              </span>
            ))}
            {(loc.amenities || facility.amenities)?.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-500 dark:text-slate-400">
                +{(loc.amenities || facility.amenities).length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Available slots preview & Action */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>{facility.availableSlots?.length || 10} {t('facilities_slots_daily')}</span>
          </div>

          <button
            onClick={() => onBook(facility)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/15 transition-all active:scale-95 cursor-pointer"
          >
            {t('facilities_book_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
