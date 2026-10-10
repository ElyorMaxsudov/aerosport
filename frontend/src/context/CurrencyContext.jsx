import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

const CurrencyContext = createContext(null);

export const DEFAULT_RATES = {
  UZS: 1,
  USD: 12800,
  EUR: 13800,
  RUB: 135,
};

export const baseCurrenciesList = [
  {
    code: 'UZS',
    short: "so'm",
    symbol: "so'm",
    label: "so'm",
    name: "O'zbek so'mi",
    flagText: "UZS",
  },
  {
    code: 'USD',
    short: 'USD',
    symbol: '$',
    label: 'USD ($)',
    name: 'US Dollar',
    flagText: "USD",
  },
  {
    code: 'EUR',
    short: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    name: 'Euro',
    flagText: "EUR",
  },
  {
    code: 'RUB',
    short: 'RUB',
    symbol: '₽',
    label: 'RUB (₽)',
    name: 'Российский рубль',
    flagText: "RUB",
  },
];

export const CurrencyProvider = ({ children }) => {
  // Exchange rates relative to 1 USD, 1 EUR, 1 RUB = X UZS
  const [rates, setRates] = useState(() => {
    try {
      const saved = localStorage.getItem('sports_currency_rates');
      return saved ? { ...DEFAULT_RATES, ...JSON.parse(saved) } : DEFAULT_RATES;
    } catch {
      return DEFAULT_RATES;
    }
  });

  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('sports_currency');
    const valid = baseCurrenciesList.find((c) => c.code.toLowerCase() === saved?.toLowerCase());
    return valid ? valid.code : 'UZS';
  });

  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch latest rates from backend API
  const fetchRates = useCallback(async () => {
    try {
      setIsLoadingRates(true);
      const res = await axiosClient.get('/admin/currency-rates');
      if (res.data && res.data.rates) {
        const merged = { ...DEFAULT_RATES, ...res.data.rates };
        setRates(merged);
        localStorage.setItem('sports_currency_rates', JSON.stringify(merged));
      }
    } catch (e) {
      // Fallback silently to localStorage or DEFAULT_RATES
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();

    // Listen for custom broadcast event across app components
    const handleRatesChanged = (e) => {
      if (e.detail?.rates) {
        setRates((prev) => ({ ...prev, ...e.detail.rates }));
      } else {
        try {
          const saved = localStorage.getItem('sports_currency_rates');
          if (saved) setRates({ ...DEFAULT_RATES, ...JSON.parse(saved) });
        } catch {}
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'sports_currency_rates' && e.newValue) {
        try {
          setRates({ ...DEFAULT_RATES, ...JSON.parse(e.newValue) });
        } catch {}
      }
      if (e.key === 'sports_currency' && e.newValue) {
        setCurrencyState(e.newValue);
      }
    };

    window.addEventListener('sports_currency_rates_changed', handleRatesChanged);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sports_currency_rates_changed', handleRatesChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchRates]);

  const setCurrency = (code) => {
    const valid = baseCurrenciesList.find(
      (c) => c.code.toLowerCase() === code?.toLowerCase() || c.short.toLowerCase() === code?.toLowerCase()
    );
    const newCode = valid ? valid.code : 'UZS';
    setCurrencyState(newCode);
    localStorage.setItem('sports_currency', newCode);
  };

  /**
   * Update currency rates by Admin
   * @param {object} newRates - e.g. { USD: 12900, EUR: 13950, RUB: 138 }
   * @param {string} baseCurrency - default currency
   */
  const updateCurrencyRates = async (newRates, baseCurrency = 'UZS') => {
    try {
      const merged = {
        ...rates,
        ...newRates,
        UZS: 1, // base always 1
      };
      setRates(merged);
      localStorage.setItem('sports_currency_rates', JSON.stringify(merged));

      // Broadcast event locally
      window.dispatchEvent(new CustomEvent('sports_currency_rates_changed', { detail: { rates: merged } }));

      // Send to backend API
      await axiosClient.put('/admin/currency-rates', {
        rates: merged,
        baseCurrency,
      });

      return { success: true, rates: merged };
    } catch (err) {
      console.error('Failed to sync rates with server:', err);
      return { success: false, error: err.message };
    }
  };

  const currencies = baseCurrenciesList.map((c) => ({
    ...c,
    rate: c.code === 'UZS' ? 1 : 1 / (rates[c.code] || DEFAULT_RATES[c.code] || 1),
    ratePerUzs: rates[c.code] || DEFAULT_RATES[c.code] || 1,
  }));

  const currentCurrencyObj = currencies.find((c) => c.code === currency) || currencies[0];

  /**
   * Formats a given amount (stored in Uzbek so'm) into the active currency
   * @param {number} amount - Amount in Uzbek so'm (UZS)
   */
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '0';
    let num = Number(amount);
    if (isNaN(num)) return '0';

    // Backward compatibility: if an old seed amount <= 500 was stored in USD, scale it to so'm
    if (num > 0 && num <= 500) {
      num = num * 10000;
    }

    const usdRate = Number(rates.USD) || DEFAULT_RATES.USD;
    const eurRate = Number(rates.EUR) || DEFAULT_RATES.EUR;
    const rubRate = Number(rates.RUB) || DEFAULT_RATES.RUB;

    switch (currency) {
      case 'USD': {
        const val = num / usdRate;
        return `$${val >= 100 ? Math.round(val).toLocaleString('en-US') : val.toFixed(2)}`;
      }
      case 'EUR': {
        const val = num / eurRate;
        return `€${val >= 100 ? Math.round(val).toLocaleString('en-US') : val.toFixed(2)}`;
      }
      case 'RUB': {
        const val = Math.round(num / rubRate);
        return `${val.toLocaleString('ru-RU').replace(/,/g, ' ')} ₽`;
      }
      case 'UZS':
      default: {
        return `${Math.round(num).toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;
      }
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currencies,
        currentCurrencyObj,
        rates,
        updateCurrencyRates,
        fetchRates,
        isLoadingRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
