import React from 'react';
import { Flame, Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = ({ setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xl font-black text-white italic tracking-wider">
                AERO<span className="text-emerald-400">SPORT</span> PRO
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer_desc')}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Verified Bookings
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Certified Coaches
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{t('footer_platform')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t('nav_events')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('facilities'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t('nav_facilities')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('trainers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t('nav_trainers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t('nav_shop')}
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{t('footer_gear')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0 }); }} className="hover:text-emerald-400 transition-colors">Football Gear</button></li>
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0 }); }} className="hover:text-emerald-400 transition-colors">Running Shoes</button></li>
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0 }); }} className="hover:text-emerald-400 transition-colors">Dumbbells & Weights</button></li>
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0 }); }} className="hover:text-emerald-400 transition-colors">Yoga Essentials</button></li>
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0 }); }} className="hover:text-emerald-400 transition-colors">Cycling & Helmets</button></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{t('footer_connect')}</h4>
            <p className="text-xs text-slate-400">
              AeroSport Pro • Uzbekistan & Global Sports Community
            </p>
            <div className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="athlete@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0">
                Join
              </button>
            </div>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> +998 (71) 200-0000
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> support@aerosport.uz
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t('footer_rights')}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Facility Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
