import React, { useState, useEffect } from 'react';
import {
  Truck,
  X,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  ShieldCheck,
  AlertCircle,
  Navigation,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export default function DeliveryTrackingModal() {
  const {
    activeDelivery,
    isDeliveryModalOpen,
    setIsDeliveryModalOpen,
    completeDelivery,
    createActiveDelivery,
  } = useCart();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  // Real-time countdown
  const [timeLeft, setTimeLeft] = useState({ minutes: 35, seconds: 0, totalSeconds: 2100 });
  const [isDelivered, setIsDelivered] = useState(false);

  useEffect(() => {
    if (!activeDelivery || !activeDelivery.targetDeliveryTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = activeDelivery.targetDeliveryTime - now;

      if (diffMs <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, totalSeconds: 0 });
        setIsDelivered(true);
      } else {
        const totalSec = Math.floor(diffMs / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        setTimeLeft({ minutes: mins, seconds: secs, totalSeconds: totalSec });
        setIsDelivered(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeDelivery]);

  if (!isDeliveryModalOpen) return null;

  // Calculate delivery route progress % (started 35 mins ago)
  const totalDurationSec = (activeDelivery?.estimatedMinutes || 35) * 60;
  const elapsedSec = Math.max(0, totalDurationSec - timeLeft.totalSeconds);
  const progressPercent = Math.min(100, Math.max(12, Math.round((elapsedSec / totalDurationSec) * 100)));

  // Target arrival clock time
  const targetTime = activeDelivery?.targetDeliveryTime
    ? new Date(activeDelivery.targetDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const steps = [
    {
      title: t('delivery_step_confirmed'),
      desc: "Buyurtmangiz tizimda qabul qilindi",
      done: true,
      current: false,
    },
    {
      title: t('delivery_step_packing'),
      desc: "AeroSport omboridan sifat nazorati bilan jo'natildi",
      done: true,
      current: false,
    },
    {
      title: t('delivery_step_transit'),
      desc: `${activeDelivery?.courier?.name || 'Kuryer'} manzilingizga tezkorlik bilan yetib kelmoqda`,
      done: isDelivered,
      current: !isDelivered,
    },
    {
      title: t('delivery_step_destination'),
      desc: t('delivery_payment_cash'),
      done: isDelivered,
      current: isDelivered,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-backdrop-fade">
      {/* Backdrop */}
      <div
        onClick={() => setIsDeliveryModalOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-slate-100 animate-modal-pop">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                <Truck className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/20 font-mono">
                    {activeDelivery?.orderId || 'AeroSport Express'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-100 bg-emerald-500/30 px-2 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight italic uppercase">
                  {t('delivery_modal_title')}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsDeliveryModalOpen(false)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6 max-h-[78vh] overflow-y-auto">
          {!activeDelivery ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('delivery_no_active')}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Savatdan buyurtma berganda yetkazish jarayoni shu yerda va navbarda ko'rinadi.
                </p>
              </div>
              <button
                onClick={() => createActiveDelivery()}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all"
              >
                {t('delivery_test_btn')} 🚀
              </button>
            </div>
          ) : (
            <>
              {/* Countdown Timer Display Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-800/60 border border-emerald-800/40 p-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                      {t('delivery_eta_title')}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                      <span className="text-sm font-medium text-slate-400 ml-2 font-sans">
                        {t('delivery_eta_remaining')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Taxminiy yetib kelish vaqti: <strong className="text-emerald-400 font-mono">{targetTime}</strong>
                    </p>
                  </div>

                  <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-emerald-800/50 shadow-sm text-center">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                      Holati
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {isDelivered ? t('delivery_status_delivered') : t('delivery_status_in_transit')}
                    </span>
                  </div>
                </div>

                {/* Animated Road with Truck */}
                <div className="mt-6 pt-2">
                  <div className="relative h-10 flex items-center">
                    {/* Road track */}
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Moving Truck Icon */}
                    <div
                      className="absolute -top-1 transition-all duration-700 ease-out -ml-4"
                      style={{ left: `${Math.min(94, Math.max(4, progressPercent))}%` }}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg border-2 border-slate-900 animate-bounce">
                        <Truck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-emerald-400" />
                      AeroSport Ombori
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Sizning manzilingiz
                    </span>
                  </div>
                </div>
              </div>

              {/* Courier Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
                        RK
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('delivery_courier_info')}
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {activeDelivery.courier?.name || 'Rustam Karimov'}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-medium text-amber-400">⭐ {activeDelivery.courier?.rating || '4.9'}</span>
                        <span>•</span>
                        <span className="font-medium">{activeDelivery.courier?.vehicle || 'Damas (Oq) — 01 A 777 AA'}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeDelivery.courier?.phone || '+998935554433'}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    {t('delivery_call_courier')}
                  </a>
                </div>
              </div>

              {/* Delivery Timeline Steps */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 px-1">
                  Yetkazib Berish Bosqichlari
                </h4>
                <div className="space-y-2.5">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                        step.current
                          ? 'bg-emerald-950/30 border-emerald-700/60 shadow-sm'
                          : step.done
                          ? 'bg-slate-800/40 border-slate-800'
                          : 'bg-slate-900/40 border-slate-800/50 opacity-60'
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : step.current ? (
                          <div className="w-5 h-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-bold ${
                            step.current
                              ? 'text-emerald-400'
                              : step.done
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Order Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">
                    📍 {t('delivery_address_label')}:
                  </span>
                  <p className="font-medium text-slate-200">
                    {activeDelivery.address}
                  </p>
                  <p className="text-slate-400 mt-1">
                    {activeDelivery.customerName} ({activeDelivery.customerPhone})
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-400 block mb-1">
                    💰 To'lov usuli:
                  </span>
                  <p className="font-medium text-emerald-400">
                    {t('delivery_payment_cash')}
                  </p>
                  <p className="text-white font-bold mt-1 text-sm">
                    Jami: {formatPrice(activeDelivery.totalAmount || 0)}
                  </p>
                </div>
              </div>

              {/* Items in order */}
              {activeDelivery.items && activeDelivery.items.length > 0 && (
                <div className="border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    📦 {t('delivery_order_items')} ({activeDelivery.items.length}):
                  </span>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {activeDelivery.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800 last:border-0">
                        <span className="text-slate-300 font-medium truncate max-w-[280px]">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-slate-400 font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completion Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    completeDelivery();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {t('delivery_confirm_receipt')}
                </button>
                <button
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all"
                >
                  Yopish
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
