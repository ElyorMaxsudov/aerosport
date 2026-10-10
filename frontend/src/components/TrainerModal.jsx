import React, { useState } from 'react';
import {
  X,
  Star,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import axiosClient from '../api/axiosClient';

const TrainerModal = ({ trainer, onClose, onRequestSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: user?.name || '',
    clientEmail: user?.email || '',
    clientPhone: user?.phone || '+998 (90) 123-4567',
    goals: user?.fitnessGoal || 'Build strength and improve endurance',
    preferredSchedule: 'Weekday mornings (Tue & Thu)',
    message: '',
  });

  if (!trainer) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to contact and hire a coach', 'info');
      return;
    }

    if (!formData.goals || !formData.message) {
      showToast('Please specify your goals and message', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosClient.post(`/trainers/${trainer._id}/request`, formData);
      showToast(`Training request sent to ${trainer.name}!`, 'success');
      if (onRequestSuccess) onRequestSuccess(res.data);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-backdrop-fade">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-modal-pop">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={trainer.image}
              alt={trainer.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{trainer.name}</h2>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {trainer.rating}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                {trainer.specialization}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-500" /> {trainer.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs / Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Bio & Credentials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('trainer_modal_bio')}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {trainer.bio}
            </p>
          </div>

          {/* Certifications and Sports */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> {t('trainer_modal_certs')}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {trainer.certifications?.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" /> {t('trainer_modal_avail')}
              </span>
              <p className="text-base font-black text-white">
                {formatPrice(trainer.pricePerHour)} <span className="text-xs text-slate-400 font-normal">/ {t('trainers_hour')}</span>
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {trainer.availableDays?.map((d, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-emerald-400 border border-emerald-500/20"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact / Request Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> {t('trainer_modal_form_title')} ({trainer.name.split(' ')[0]})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('trainer_modal_goal')} *
                </label>
                <input
                  type="text"
                  name="goals"
                  required
                  placeholder="e.g. Marathon pacing, 5kg muscle gain, injury recovery"
                  value={formData.goals}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('trainer_modal_schedule')}
                </label>
                <input
                  type="text"
                  name="preferredSchedule"
                  placeholder="e.g. Weekday mornings, Saturdays"
                  value={formData.preferredSchedule}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  required
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('trainer_modal_msg')} *
              </label>
              <textarea
                name="message"
                required
                rows="3"
                placeholder="Introduce yourself, mention current fitness routine or challenges..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                {t('booking_btn_cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? t('trainer_modal_sending') : t('trainer_modal_send')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrainerModal;
