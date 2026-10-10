import React from 'react';
import { Calendar, MapPin, Navigation, Users, Trophy, Bike, Flame, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatSom } from '../utils/formatters';
import { getLocalizedEvent } from '../utils/eventLocalization';

const EventCard = ({ event, onSelect, onJoin, onLeave }) => {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const loc = getLocalizedEvent(event, language) || event;

  const isJoined = isAuthenticated && user && event.registeredUsers?.some(
    (u) => (typeof u === 'string' ? u : u._id) === user._id
  );

  const percentFull = Math.min(100, Math.round((event.participantsCount / (event.maxParticipants || 100)) * 100));

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-xl dark:hover:shadow-emerald-500/5 flex flex-col group shadow-sm dark:shadow-none">
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img
          src={event.image}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              event.type === 'cycling'
                ? 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
              event.type === 'cycling'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {event.type === 'cycling' ? <Bike className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
            {event.type === 'cycling' ? t('events_filter_cycling') : t('events_filter_marathons')}
          </span>

          <span className="keep-white px-2.5 py-1 rounded-lg text-[11px] font-black bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-sm">
            {event.distance}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className="keep-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-sm">
            {loc.difficultyLabel || event.difficulty}
          </span>
        </div>

        {/* Date on image */}
        <div className="keep-white absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{event.date} • {event.time}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {loc.title || event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{loc.location || event.location}, {loc.city || event.city}</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {loc.description || event.description}
          </p>
        </div>

        {/* Elevation & Prize */}
        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <Navigation className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            <span>{t('events_card_elev')}: {event.elevationGain}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end text-amber-600 dark:text-amber-400 font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span className="truncate">{loc.prizePool || event.prizePool || t('events_card_prizes')}</span>
          </div>
        </div>

        {/* Progress Capacity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {event.participantsCount} {t('events_card_joined')}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">{t('events_card_max')} {event.maxParticipants}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentFull > 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentFull}%` }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onSelect(event)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
          >
            {t('events_card_details')}
          </button>

          {isJoined ? (
            <button
              onClick={() => onLeave(event._id)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-rose-500/20 hover:text-rose-500 hover:border-rose-500/40 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {t('events_card_joined_btn')}
            </button>
          ) : (
            <button
              onClick={() => onJoin(event)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all truncate"
            >
              {event.entryFee > 0 ? `${t('events_card_join_btn')} • ${formatSom(event.entryFee, t('events_card_free'))}` : `${t('events_card_join_btn')} • ${t('events_card_free')}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
