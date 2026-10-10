import React from 'react';
import { Star, Award, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

const TrainerCard = ({ trainer, onSelect }) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-xl dark:shadow-none">
      {/* Top Profile Header */}
      <div className="relative p-6 pb-0 flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={trainer.image}
            alt={trainer.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition-all duration-300"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full ring-2 ring-white dark:ring-slate-950" title="Verified Trainer">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                {trainer.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-amber-500 dark:text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{trainer.rating}</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
            {trainer.specialization}
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1.5 truncate font-medium">
            <Award className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{trainer.experienceYears} {t('trainers_exp_years')}</span>
          </p>
        </div>
      </div>

      {/* Bio excerpt */}
      <div className="p-6 pt-4 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {trainer.bio}
        </p>

        {/* Sports tags */}
        <div className="flex flex-wrap gap-1.5">
          {trainer.sports?.slice(0, 3).map((sport, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {sport}
            </span>
          ))}
          {trainer.sports?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-500 dark:text-slate-400">
              +{trainer.sports.length - 3}
            </span>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-black text-slate-900 dark:text-white">{formatPrice(trainer.pricePerHour)}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium"> / {t('trainers_hour')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(trainer)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-slate-950 text-slate-800 dark:bg-slate-900 dark:hover:bg-emerald-500 dark:hover:text-slate-950 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 hover:border-emerald-400 transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t('trainers_contact_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
