import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import ScrollReveal from '../components/ScrollReveal';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  ShieldCheck,
  Tag,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategory, getLocalizedProduct } from '../utils/productLocalization';

const ShopPage = ({
  products,
  selectedProduct,
  onSelectProduct,
  onCloseProductModal,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { t, language } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all'); // all, under50, 50to100, over100
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, rating

  const categories = [
    'All',
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

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category === selectedCategory ||
        getLocalizedCategory(product.category, 'en')?.toLowerCase() === selectedCategory?.toLowerCase();

      const loc = getLocalizedProduct(product, language);
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        search === '' ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        loc.name.toLowerCase().includes(search) ||
        loc.description.toLowerCase().includes(search) ||
        loc.categoryLabel.toLowerCase().includes(search);

      let matchesPrice = true;
      if (priceRange === 'under50') matchesPrice = product.price < 300000;
      if (priceRange === '50to100') matchesPrice = product.price >= 300000 && product.price <= 700000;
      if (priceRange === 'over100') matchesPrice = product.price > 700000;

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <ShoppingBag className="w-4 h-4" /> {t('shop_page_badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mt-1">
            {t('shop_page_title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            {t('shop_page_desc')}
          </p>

          {/* Shop Perks - Delivery perk without > $100 */}
          <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>{t('shop_perk_fast_delivery')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <span>Promo: <strong className="text-slate-900 dark:text-white">SPORT20</strong> (-20%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{t('shop_perk_brand_guarantee')}</span>
            </span>
          </div>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/50 dark:text-white font-bold text-xs uppercase tracking-wider transition-all self-start md:self-auto shrink-0 shadow-lg"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>{t('shop_my_bag')} ({totalItemsCount})</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t('shop_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Price Range Filter */}
          <div className="w-full md:w-auto">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{t('shop_all_prices')}</option>
              <option value="under50">{t('shop_under_50')}</option>
              <option value="50to100">{t('shop_50_to_100')}</option>
              <option value="over100">{t('shop_over_100')}</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="featured">{t('shop_sort_featured')}</option>
              <option value="rating">{t('shop_sort_rating')}</option>
              <option value="price-low">{t('shop_sort_asc')}</option>
              <option value="price-high">{t('shop_sort_desc')}</option>
            </select>
          </div>
        </div>

        {/* Categories Horizontal Scroll / Wrap (Kichik Navbar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800'
              }`}
            >
              {getLocalizedCategory(cat, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('shop_empty')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t('shop_empty_desc')}
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPriceRange('all'); }}
            className="mt-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {t('shop_reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product, index) => (
            <ScrollReveal key={product._id} delay={Math.min(index * 40, 240)}>
              <ProductCard
                product={product}
                onSelect={onSelectProduct}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={onCloseProductModal}
      />
    </div>
  );
};

export default ShopPage;
