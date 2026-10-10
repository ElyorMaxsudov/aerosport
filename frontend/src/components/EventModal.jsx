import React from 'react';
import {
  X,
  Calendar,
  MapPin,
  Trophy,
  Navigation,
  Users,
  Shield,
  Bike,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatSom } from '../utils/formatters';
import { getLocalizedEvent } from '../utils/eventLocalization';

const EventModal = ({ event, onClose, onJoin, onLeave }) => {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  if (!event) return null;

  const loc = getLocalizedEvent(event, language) || event;

  const isJoined = isAuthenticated && user && event.registeredUsers?.some(
    (u) => (typeof u === 'string' ? u : u._id) === user._id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-backdrop-fade">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-modal-pop max-h-[92vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-950 shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="keep-white absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top category badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                event.type === 'cycling'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {event.type === 'cycling' ? <Bike className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              {loc.category || event.category || (event.type === 'cycling' ? t('events_filter_cycling') : t('events_filter_marathons'))}
            </span>

            <div className="flex items-center gap-2">
              <span className="keep-white px-3 py-1.5 rounded-xl text-xs font-black bg-black/75 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm">
                🏆 {loc.prizePool || event.prizePool}
              </span>
              <span className="keep-white px-3 py-1.5 rounded-xl text-xs font-black bg-black/75 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
                {loc.difficultyLabel || event.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
              {loc.title || event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-100">{loc.location || event.location}, {loc.city || event.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-bold">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{event.date} • Soati: {event.time}</span>
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Distansiya</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-1">{event.distance}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Start Soati</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">{event.time}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('events_card_elev')}</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-1">{event.elevationGain}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Qatnashish To'lovi</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatSom(event.entryFee, t('events_card_free'))}
              </p>
            </div>
          </div>

          {/* PRIZE POOL & AWARDS HIGHLIGHT (Mukofot Jamg'armasi) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wide">
                    Mukofot Jamg'armasi va Yutuqlar
                  </h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Umumiy mukofot: {loc.prizePool || event.prizePool}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/40">
                Rasmiy Yutuq
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-amber-500/20 text-center">
                <span className="text-amber-500 font-black text-sm block">🥇 1-O'rin</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Asosiy pul yutug'i + Oltin Kubok</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-center">
                <span className="text-slate-400 font-black text-sm block">🥈 2-O'rin</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Pul mukofoti + Kumush Medal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-center">
                <span className="text-amber-700 dark:text-amber-500 font-black text-sm block">🥉 3-O'rin</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Pul mukofoti + Bronza Medal</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic text-center pt-1">
              🏅 Barcha marraga yetib kelgan ishtirokchilar rasmiy esdalik medali va elektron sertifikat bilan taqdirlanadi!
            </p>
          </div>

          {/* EXACT SCHEDULE & LOCATION DETAILS (Soatlari va Marshrut) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location & Route */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <h5 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Aniq Lokatsiya & Marshrut</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                📍 <strong>Start / Finish:</strong> {loc.location || event.location}, {loc.city || event.city}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Har 2.5 km masofada toza ichimlik suvi, izotonik ichimliklar va tez tibbiy yordam nuqtalari faoliyat yuritadi.
              </p>
            </div>

            {/* Time Schedule */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <h5 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Vaqt Jadvali & Soatlari</span>
              </h5>
              <div className="text-xs space-y-1 font-medium text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Ishtirokchilarni ro'yxatga olish:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Startdan 1 soat oldin</span>
                </div>
                <div className="flex justify-between">
                  <span>Qizdirish (Warm-up):</span>
                  <span className="font-bold text-slate-900 dark:text-white">Startdan 20 daqiqa oldin</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Asosiy Start Signali:</span>
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Musobaqa Haqida To'liq Ma'lumot
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {loc.description || event.description}
            </p>
          </div>

          {/* Start Pack Items */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <h5 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
              🎒 Ishtirokchining Start Paketiga Nimalar Kiradi:
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Elektron raqam & chip</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Dri-FIT sport futbolkasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Rasmiy finlyor medali</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Suv & sport ovqatlari</span>
              </div>
            </div>
          </div>

          {/* Participants bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                {event.participantsCount} {t('events_card_joined')}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{t('events_card_max')}: {event.maxParticipants}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (event.participantsCount / event.maxParticipants) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Tashkilotchi: <strong className="text-slate-800 dark:text-slate-200">{loc.organizer || event.organizer}</strong>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              {t('booking_btn_cancel')}
            </button>

            {isJoined ? (
              <button
                onClick={() => {
                  onLeave(event._id);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                {t('profile_unregister_event')}
              </button>
            ) : (
              <button
                onClick={() => {
                  onJoin(event);
                  onClose();
                }}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Qo'shilish ({formatSom(event.entryFee, t('events_card_free'))})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
