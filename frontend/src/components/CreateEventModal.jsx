import React, { useState } from 'react';
import { X, Trophy, Bike, Flame, Calendar, MapPin, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import axiosClient from '../api/axiosClient';

const CreateEventModal = ({ isOpen, onClose, onCreated }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'marathon',
    category: 'Full Marathon (42.2K)',
    date: '2026-11-20',
    time: '08:00 AM',
    location: '',
    city: 'Toshkent',
    distance: '42.2 km',
    elevationGain: '120m',
    difficulty: 'Intermediate',
    maxParticipants: 500,
    entryFee: 30000,
    prizePool: '10 000 000 so\'m + Finisher Medallari',
    organizer: '',
    description: '',
    image: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'cycling'
        ? {
            category: 'Road Cycling (60K)',
            distance: '60.0 km',
            image: prev.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
          }
        : name === 'type' && value === 'marathon'
        ? {
            category: 'Full Marathon (42.2K)',
            distance: '42.2 km',
            image: prev.image || 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
          }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to plan and publish an event', 'info');
      return;
    }

    if (!formData.title || !formData.location || !formData.city || !formData.description) {
      showToast('Please fill all required event details', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.post('/events', formData);
      showToast(`Event "${res.data.title}" successfully organized!`, 'success');
      onCreated(res.data);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-backdrop-fade">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-modal-pop">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">
                {t('events_btn_plan')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Yangi marafon yoki velopoyga musobaqasini tashkil etish
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Event Type selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'marathon' } })}
              className={`p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                formData.type === 'marathon'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4" /> {t('events_filter_marathons')}
            </button>
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'type', value: 'cycling' } })}
              className={`p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                formData.type === 'cycling'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Bike className="w-4 h-4" /> {t('events_filter_cycling')}
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Tadbir Nomi *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="masalan: Toshkent Kuzgi 42K Marafoni"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Category & Distance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Kategoriya
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Masofa *
              </label>
              <input
                type="text"
                name="distance"
                required
                value={formData.distance}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Sana *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Boshlanish Vaqti
              </label>
              <input
                type="text"
                name="time"
                placeholder="07:30 AM"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Location & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Manzil / Joy *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="masalan: Humo Arena & Bog'"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Shahar *
              </label>
              <input
                type="text"
                name="city"
                required
                placeholder="masalan: Toshkent"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Elevation, Difficulty, Max Participants, Fee */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Balandlik
              </label>
              <input
                type="text"
                name="elevationGain"
                value={formData.elevationGain}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Daraja
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Elite">Elite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Maks. Ishtirokchi
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                To'lov (so'm)
              </label>
              <input
                type="number"
                name="entryFee"
                step="1000"
                min="0"
                placeholder="0 = Bepul"
                value={formData.entryFee}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          {/* Prize pool & Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Sovrin Fondi (so'm / sovg'alar)
              </label>
              <input
                type="text"
                name="prizePool"
                placeholder="masalan: 10 000 000 so'm + Medallar"
                value={formData.prizePool}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Tashkilotchi
              </label>
              <input
                type="text"
                name="organizer"
                placeholder="masalan: Milliy Marafon Klubi"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Tavsif & Yo'nalish *
            </label>
            <textarea
              name="description"
              required
              rows="3"
              placeholder="Yo'nalish xaritasi, suv nuqtalari, qoidalar haqida..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-transparent font-semibold text-xs transition-colors"
            >
              {t('booking_btn_cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              {submitting ? '...' : t('events_btn_plan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
