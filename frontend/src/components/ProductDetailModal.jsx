import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Truck, RotateCcw, Edit3, Save } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getLocalizedProduct } from '../utils/productLocalization';
import axiosClient from '../api/axiosClient';

const ProductDetailModal = ({ product, onClose, onProductUpdated }) => {
  const { addToCart, showToast } = useCart();
  const { isAdmin, isSeller } = useAuth();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);

  // Description editing state
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [savingDesc, setSavingDesc] = useState(false);

  if (!product) return null;

  const localized = getLocalizedProduct(product, language);

  const handleStartEdit = () => {
    setEditDescription(product.description || localized.description || '');
    setIsEditingDesc(true);
  };

  const handleSaveDescription = async () => {
    if (!editDescription.trim()) {
      showToast("Tavsif bo'sh bo'lishi mumkin emas", "error");
      return;
    }
    try {
      setSavingDesc(true);
      const res = await axiosClient.put(`/products/${product._id}`, {
        description: editDescription.trim(),
      });
      product.description = editDescription.trim();
      if (onProductUpdated) {
        onProductUpdated(res.data);
      }
      showToast("Mahsulot tavsifi saqlandi! Qayta yangilanganda ham saqlanib qoladi 🎉", "success");
      setIsEditingDesc(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Tavsifni saqlashda xatolik yuz berdi", "error");
    } finally {
      setSavingDesc(false);
    }
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-backdrop-fade">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-modal-pop">
        <button
          onClick={onClose}
          className="keep-white absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative h-64 md:h-full bg-slate-100 dark:bg-slate-950 min-h-[300px]">
            <img
              src={product.image}
              alt={localized.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
            />
            {localized.badgeLabel && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                {localized.badgeLabel}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
                  {localized.categoryLabel}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('product_brand')} {product.brand}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {localized.name}
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">
                  ({product.reviewCount} {t('product_athlete_reviews')})
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description Section with Editing */}
              {!isEditingDesc ? (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tavsif (Description)
                    </span>
                    {(isAdmin || isSeller) && (
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold px-2 py-0.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
                        title="Tavsifni tahrirlash"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Tavsifni o'zgartirish</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {localized.description}
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                      Tavsifni tahrirlash (Doimiy saqlanadi):
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingDesc(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <textarea
                    rows="4"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 font-medium resize-none"
                    placeholder="Mahsulot haqida to'liq tavsif..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={savingDesc}
                      onClick={handleSaveDescription}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wide transition-all shadow-md shadow-emerald-500/20"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingDesc ? 'Saqlanmoqda...' : 'Tavsifni Saqlash'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Feature bullet list */}
              {localized.features?.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('product_highlights')}
                  </h4>
                  {localized.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Shipping info - without > $100 */}
              <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>{t('cart_shipping_free')} • {t('shop_perk_fast_delivery')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                  <span>{t('product_returns')}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('product_quantity')}
                </span>
                <div className="flex items-center bg-slate-900/90 dark:bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1 gap-2.5 shadow-md">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-75 text-base font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-black text-white select-none">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-75 text-base font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {t('shop_add_to_cart')} • {formatPrice(product.price * quantity)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
