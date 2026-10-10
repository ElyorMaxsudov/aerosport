import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getLocalizedFacility } from '../utils/facilityLocalization';
import axiosClient from '../api/axiosClient';

const BookingModal = ({ facility, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useCart();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const loc = getLocalizedFacility(facility, language) || facility;

  // Tomorrow as default date string YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+998 (90) 123-4567');
  const [notes, setNotes] = useState('');

  // Fetch booked slots whenever facility or date changes
  useEffect(() => {
    if (!facility || !date) return;

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const res = await axiosClient.get(`/bookings/facilities/${facility._id}/slots?date=${date}`);
        setBookedSlots(res.data);
        setSelectedSlot(''); // Reset selection on date change
      } catch (err) {
        console.error('Failed to load booked slots', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [facility, date]);

  if (!facility) return null;

  const slots = facility.availableSlots || [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '14:00 - 15:00',
    '16:00 - 17:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
    '22:00 - 23:00'
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to confirm your booking reservation', 'info');
      return;
    }

    if (!selectedSlot) {
      showToast('Please choose an available time slot', 'error');
      return;
    }

    if (!contactPhone) {
      showToast('Please provide a contact phone number', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const bookingData = {
        facilityId: facility._id,
        date,
        timeSlot: selectedSlot,
        contactName: contactName || user?.name || 'Athlete',
        contactPhone,
        notes,
      };

      const res = await axiosClient.post('/bookings', bookingData);
      showToast(`Reserved ${facility.name} for ${selectedSlot}!`, 'success');
      if (onBookingSuccess) onBookingSuccess(res.data);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-backdrop-fade">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-modal-pop">
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              {facility.type === 'mini_football' ? '⚽' : '🏟️'}
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic">
                {t('booking_modal_title')} {loc.name || facility.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {loc.address || facility.address}, {loc.city || facility.city}
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

        <form onSubmit={handleBookingSubmit} className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Facility Highlights Pill */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">{t('booking_hourly_rate')}</span>
              <strong className="text-emerald-400 text-sm font-bold">{formatPrice(facility.pricePerHour)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{t('booking_surface')}</span>
              <strong className="text-slate-200 text-xs truncate block">{facility.surface}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{t('booking_dimensions')}</span>
              <strong className="text-slate-200 text-xs block">{facility.dimensions}</strong>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {t('booking_date_label')}
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Time Slots Grid */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> {t('booking_slots_label')}
              </label>
              {loadingSlots && (
                <span className="text-[11px] text-slate-400 animate-pulse">{t('booking_checking_slots')}</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isBooked
                        ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md shadow-emerald-500/25 scale-102'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{slot}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-80">
                      {isBooked ? t('booking_slot_unavail') : isSelected ? t('booking_slot_selected') : t('booking_slot_avail')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> {t('booking_name')} *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Team Captain / Athlete Name"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {t('booking_phone')} *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+998 (90) 000-0000"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Booking notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('booking_notes')}
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('booking_notes_placeholder')}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wider">
                {t('booking_total')}
              </span>
              <p className="text-xs text-slate-300">
                {date} • {selectedSlot || '...'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">
                {formatPrice(facility.pricePerHour)}
              </span>
              <span className="text-[10px] text-slate-400 block">{t('booking_instant_guar')}</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
            >
              {t('booking_btn_cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="px-8 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? t('booking_confirming') : t('booking_btn_confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
