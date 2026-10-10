import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  CreditCard,
  MapPin,
  Phone,
  User,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import axiosClient from '../api/axiosClient';
import { getLocalizedProduct } from '../utils/productLocalization';

const CartDrawer = ({ onOrderPlaced, onNavigateToOrders }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    discountCode,
    applyDiscount,
    showToast,
    createActiveDelivery,
    setIsDeliveryModalOpen,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();

  const [couponInput, setCouponInput] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const [checkoutData, setCheckoutData] = useState({
    fullName: user?.name || 'Alex Johnson',
    address: 'Amir Temur Street, Apt 14',
    city: 'Tashkent',
    postalCode: '100000',
    phone: user?.phone || '+998 (90) 123-4567',
    paymentMethod: 'Cash on Delivery',
  });

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyDiscount(couponInput);
  };

  const handleInputChange = (e) => {
    setCheckoutData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to place and track your orders', 'info');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const orderPayload = {
        items: cart.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress: {
          fullName: checkoutData.fullName,
          address: checkoutData.address,
          city: checkoutData.city,
          postalCode: checkoutData.postalCode,
          phone: checkoutData.phone,
        },
        paymentMethod: checkoutData.paymentMethod,
        subtotal,
        shippingFee,
        discount: discountAmount,
        totalAmount: total,
      };

      const res = await axiosClient.post('/orders', orderPayload);
      setOrderComplete(res.data);

      // Create active delivery tracking
      createActiveDelivery({
        orderId: res.data?._id || ('ORD-' + Math.floor(100000 + Math.random() * 900000)),
        items: orderPayload.items,
        totalAmount: total,
        customerName: checkoutData.fullName,
        customerPhone: checkoutData.phone,
        address: `${checkoutData.city}, ${checkoutData.address}`,
      });

      clearCart();
      showToast('Order placed successfully!', 'success');
      
      // Dispatch real-time event for Admin notification
      try {
        window.dispatchEvent(new CustomEvent('new_order_placed', { detail: res.data }));
        localStorage.setItem('sports_latest_order', JSON.stringify({ order: res.data, timestamp: Date.now() }));
      } catch (e) {
        console.error('Event dispatch error:', e);
      }

      if (onOrderPlaced) onOrderPlaced(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-drawer-slide">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase italic">
                {isCheckingOut ? t('cart_checkout_title') : t('cart_title')}
              </h2>
              <p className="text-xs text-slate-400">
                {cart.length} {t('nav_my_bag')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
              setOrderComplete(null);
            }}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderComplete ? (
            /* Order Success View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center ring-4 ring-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">
                {t('cart_order_confirmed')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                {t('cart_order_confirmed_desc')}
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('cart_order_id')}</span>
                  <span className="font-mono text-emerald-400">{orderComplete._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('cart_paid')}</span>
                  <span className="font-bold text-white">{formatPrice(orderComplete.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('cart_status')}</span>
                  <span className="text-amber-400 font-semibold">{orderComplete.status}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setOrderComplete(null);
                    setIsCheckingOut(false);
                    setIsDeliveryModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 animate-pulse"
                >
                  <Truck className="w-4 h-4" />
                  Yetkazish vaqtini kuzatish 🚚
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setOrderComplete(null);
                    setIsCheckingOut(false);
                    if (onNavigateToOrders) onNavigateToOrders();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {t('cart_view_orders')}
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setOrderComplete(null);
                    setIsCheckingOut(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {t('cart_cont_shop')}
                </button>
              </div>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form View */
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {t('cart_checkout_title')}
                </h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('cart_shipping_name')}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={checkoutData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('cart_shipping_addr')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={checkoutData.address}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {t('cart_shipping_city')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={checkoutData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {t('cart_shipping_zip')}
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={checkoutData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('cart_shipping_phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={checkoutData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Payment Selection - Strictly Cash on Delivery */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> {t('cart_pay_method')}
                  </label>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <div>
                        <p className="text-xs font-black text-emerald-300">
                          {language === 'uz' ? "Naqd pul bilan to'lash (Yetkazilganda)" : language === 'ru' ? "Оплата наличными (При получении)" : "Cash on Delivery"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {language === 'uz' ? "Kuryer mahsulotni yetkazib berganda to'laysiz" : language === 'ru' ? "Оплата курьеру при передаче товара" : "Pay with cash when courier delivers"}
                        </p>
                      </div>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                      ✓
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                >
                  {t('cart_back_to_bag')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? t('cart_placing') : `${t('cart_place_order')} • ${formatPrice(total)}`}
                </button>
              </div>
            </form>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">{t('cart_empty_title')}</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {t('cart_empty_desc')}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                {t('cart_btn_start')}
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemLoc = getLocalizedProduct(item.product, language);
                  return (
                    <div
                      key={item.product._id}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={itemLoc.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {itemLoc.name}
                        </h4>
                      <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-800 text-slate-300"
                          >
                            <Minus className="w-3 3-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-800 text-slate-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-slate-200 ml-auto">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Coupon code input */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder={t('cart_coupon_placeholder')}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    {t('cart_apply_coupon')}
                  </button>
                </div>
                {discountCode && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                    ✓ Promo code {discountCode} applied!
                  </p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {!orderComplete && !isCheckingOut && cart.length > 0 && (
          <div className="p-6 border-t border-slate-800 space-y-3 bg-slate-950/40">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{t('cart_subtotal')}</span>
                <span className="text-slate-200 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t('cart_discount')}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('cart_shipping')}</span>
                <span className="text-emerald-400 font-bold">{t('cart_shipping_free')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>{t('cart_total')}</span>
                <span className="text-emerald-400 text-base">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('cart_btn_checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
