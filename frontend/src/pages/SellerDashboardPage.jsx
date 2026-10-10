import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Store,
  Plus,
  Package,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
  DollarSign,
  Layers,
  CheckCircle,
  X,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Tag,
  Eye
} from 'lucide-react';

const SellerDashboardPage = ({ setActiveTab }) => {
  const { user, isSeller } = useAuth();
  const { showToast } = useCart();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Football',
    price: 450000,
    originalPrice: 600000,
    stock: 25,
    brand: user?.shopName || 'SportGear',
    badge: 'New',
    description: '',
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
  });

  const categories = [
    'Football',
    'Basketball',
    'Volleyball',
    'Running',
    'Sports Clothes',
    'Fitness Equipment',
    'Dumbbells',
    'Yoga',
    'Cycling',
    'Boxing',
    'Swimming',
    'Gym Accessories',
    'Bags & Bottles',
    'Fitness Watches',
  ];

  // Quick preset sample photos for easy seller test
  const sampleImages = [
    { label: 'Futbol', url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80' },
    { label: 'Krossovka', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Gantel', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80' },
    { label: 'Boks', url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80' },
  ];

  // Fetch seller's own products
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/products/seller/my-products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Handle Add Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      showToast('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...newProduct,
        brand: user?.shopName || newProduct.brand || 'AeroSport',
      };
      const res = await axiosClient.post('/products', payload);
      showToast(`"${res.data.name}" muvaffaqiyatli do'konga qo'shildi!`, 'success');
      setProducts([res.data, ...products]);
      setShowAddModal(false);
      // Reset form
      setNewProduct({
        name: '',
        category: 'Football',
        price: 450000,
        originalPrice: 600000,
        stock: 25,
        brand: user?.shopName || 'SportGear',
        badge: 'New',
        description: '',
        image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Mahsulot qo\'shishda xatolik', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Ushbu mahsulotni do\'koningizdan o\'chirishni xohlaysizmi?')) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      showToast('Mahsulot o\'chirildi', 'info');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      showToast('Mahsulotni o\'chirishda xatolik', 'error');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Total stock count
  const totalStock = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0), 0);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* =========================================================================
          1. SELLER STORE BANNER / HEADER
          ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                <Store className="w-3.5 h-3.5" />
                {t('seller_panel_badge')}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                👤 {user?.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tight">
              {user?.shopName || t('seller_nav_title')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {user?.shopDescription || 'Sport anjomlari, kiyimlar va jihozlar do\'koni. Bu yerda mahsulotlaringizni qo\'shishingiz, narx va qoldiqlarini boshqarishingiz mumkin.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('shop')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-bold transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Umumiy do'konni ko'rish</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('seller_add_product')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. STORE KPI STATS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products Count */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('seller_products_count')}
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{products.length}</div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Sotuvdagi faol tovarlar
          </p>
        </div>

        {/* Total Stock */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ombordagi qoldiq
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalStock} dona</div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Jami tovarlar soni
          </p>
        </div>

        {/* Categories */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sport yo'nalishlari
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {new Set(products.map((p) => p.category)).size}
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Qamrab olingan kategoriyalar
          </p>
        </div>

        {/* Store Status */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Do'kon holati
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">FAOL SOTUVCHI</div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            AeroSport Tasdiqlangan Do'kon
          </p>
        </div>
      </div>

      {/* =========================================================================
          3. TOOLBAR & FILTER
          ========================================================================= */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Mahsulot nomi yoki sport turi bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 w-full md:w-auto"
          >
            <option value="all">Barcha sport turlari</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            onClick={fetchMyProducts}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. MY PRODUCTS LIST / EMPTY STATE
          ========================================================================= */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Do'kon mahsulotlari yuklanmoqda...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white uppercase italic">
            {t('seller_empty_title')}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('seller_empty_desc')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('seller_add_product')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="glass-card p-4 rounded-3xl border border-slate-800 space-y-3 relative group hover:border-emerald-500/40 transition-all"
            >
              {/* Product Image */}
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase shadow-md">
                    {p.badge}
                  </span>
                )}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur-md">
                  {p.category}
                </span>
              </div>

              {/* Title & Brand */}
              <div>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                  {p.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {p.sellerShopName || p.brand || user?.shopName}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="text-sm font-black text-emerald-400">{formatPrice(p.price)}</span>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span className="text-[10px] text-slate-500 line-through ml-1.5 font-semibold">
                      {formatPrice(p.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  Omborda: <strong className="text-white">{p.stock}</strong> ta
                </span>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDeleteProduct(p._id)}
                className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>O'chirish</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          5. ADD PRODUCT MODAL (Maxsus mahsulot qo'shish oynasi)
          ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic">
                    {t('seller_add_product')}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {user?.shopName || 'Sport Do\'koni'} katalogiga joylashtirish
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Mahsulot nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Masalan: Nike Phantom Butsa, Karbon Veloshlem..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Yorliq (Badge)
                  </label>
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    placeholder="New, Hot, Sale, Pro..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Asl narxi (so'm)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Omborda (dona) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Rasm URL manzili *
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />

                {/* Sample quick photos */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Tezkor namunalar:</span>
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, image: s.url })}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {newProduct.image && (
                  <div className="mt-2.5 h-24 w-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Tavsifi
                </label>
                <textarea
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Yuqori sifatli original sport anjomi, qulay va bardoshli..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-none focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  {actionLoading ? 'Qo\'shilmoqda...' : 'Do\'konga Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
