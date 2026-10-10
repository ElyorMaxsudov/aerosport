import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import ScrollReveal from '../components/ScrollReveal';
import {
  Trophy,
  Search,
  Plus,
  Bike,
  Flame,
  Filter,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedEvent } from '../utils/eventLocalization';

const EventsPage = ({
  events,
  onSelectEvent,
  onJoinEvent,
  onLeaveEvent,
  onEventCreated,
}) => {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState('all'); // all, marathon, cycling
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter events with full multilingual support
  const filteredEvents = events.filter((event) => {
    const loc = getLocalizedEvent(event, language) || event;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      event.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase() ||
      loc.difficultyLabel?.toLowerCase() === selectedDifficulty.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      event.title?.toLowerCase().includes(q) ||
      loc.title?.toLowerCase().includes(q) ||
      event.location?.toLowerCase().includes(q) ||
      loc.location?.toLowerCase().includes(q) ||
      event.city?.toLowerCase().includes(q) ||
      loc.city?.toLowerCase().includes(q) ||
      event.category?.toLowerCase().includes(q) ||
      loc.category?.toLowerCase().includes(q);

    return matchesType && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <Trophy className="w-4 h-4" /> {t('events_page_badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
            {t('events_page_title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl font-medium">
            {t('events_page_desc')}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('events_btn_plan')}
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t('events_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
              }`}
            >
              {t('events_filter_all')} ({events.length})
            </button>
            <button
              onClick={() => setSelectedType('marathon')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === 'marathon'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> {t('events_filter_marathons')}
            </button>
            <button
              onClick={() => setSelectedType('cycling')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === 'cycling'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
              }`}
            >
              <Bike className="w-3.5 h-3.5" /> {t('events_filter_cycling')}
            </button>
          </div>

          {/* Difficulty Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{t('events_filter_diff_all')}</option>
              <option value="Beginner">{t('events_filter_diff_beg')}</option>
              <option value="Intermediate">{t('events_filter_diff_int')}</option>
              <option value="Advanced">{t('events_filter_diff_adv')}</option>
              <option value="Elite">{t('events_filter_diff_elite')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Results Grid */}
      {filteredEvents.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('events_empty_title')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('events_empty_desc')}
          </p>
          <button
            onClick={() => { setSelectedType('all'); setSelectedDifficulty('all'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            {t('events_reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <ScrollReveal key={event._id} delay={Math.min(index * 60, 300)}>
              <EventCard
                event={event}
                onSelect={onSelectEvent}
                onJoin={onJoinEvent}
                onLeave={onLeaveEvent}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Plan / Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newEvent) => {
          if (onEventCreated) onEventCreated(newEvent);
        }}
      />
    </div>
  );
};

export default EventsPage;
