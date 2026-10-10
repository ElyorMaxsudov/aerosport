import React from 'react';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { getLocalizedProduct } from '../utils/productLocalization';

const ProductCard = ({ product, onSelect }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  const localized = getLocalizedProduct(product, language);

  const cartItem = cart?.find((item) => (item.product?._id || item.product) === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl dark:hover:shadow-emerald-500/5 flex flex-col group shadow-sm dark:shadow-none">
      {/* Product Image Area */}
      <div className="relative h-52 bg-slate-100 dark:bg-slate-900/60 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={localized.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge */}
        {localized.badgeLabel && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
              {localized.badgeLabel}
            </span>
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-500 text-white shadow-md">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Quick View Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="keep-white absolute bottom-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
              {localized.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 dark:text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {localized.name}
          </h3>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium">
            {product.brand} • {t('shop_in_stock')} ({product.stock})
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between bg-slate-900/95 dark:bg-slate-950 border border-slate-700/90 rounded-xl px-2.5 py-1 gap-2.5 shadow-md min-w-[95px] h-9 animate-in zoom-in-95 duration-150 shrink-0"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product._id, quantityInCart - 1);
                }}
                className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-75 text-base font-bold"
                title="Kamaytirish"
              >
                -
              </button>
              <span className="text-sm font-black text-white px-1 select-none">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product._id, quantityInCart + 1);
                }}
                className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-75 text-base font-bold"
                title="Ko'paytirish"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/15 transition-all shrink-0 h-9"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="truncate">{t('shop_add_to_cart')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
