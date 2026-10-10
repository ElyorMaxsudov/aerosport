import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('sports_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState(() => {
    try {
      const savedDelivery = localStorage.getItem('sports_active_delivery');
      return savedDelivery ? JSON.parse(savedDelivery) : null;
    } catch {
      return null;
    }
  });
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('sports_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (activeDelivery) {
        localStorage.setItem('sports_active_delivery', JSON.stringify(activeDelivery));
      } else {
        localStorage.removeItem('sports_active_delivery');
      }
    } catch (e) {
      console.error('Failed to sync activeDelivery to localStorage', e);
    }
  }, [activeDelivery]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscount = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SPORT20') {
      setDiscountPercent(20);
      setDiscountCode('SPORT20');
      showToast('Coupon applied: 20% OFF!', 'success');
      return { success: true, message: '20% discount applied!' };
    } else if (cleanCode === 'FIT10') {
      setDiscountPercent(10);
      setDiscountCode('FIT10');
      showToast('Coupon applied: 10% OFF!', 'success');
      return { success: true, message: '10% discount applied!' };
    } else {
      showToast('Invalid coupon code. Try SPORT20', 'error');
      return { success: false, message: 'Invalid promo code. Try SPORT20' };
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = 0; // Bepul yetkazib berish
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const createActiveDelivery = (orderData = {}) => {
    const now = Date.now();
    const durationMinutes = 35;
    const targetDeliveryTime = now + durationMinutes * 60 * 1000;

    const deliveryPayload = {
      orderId: orderData.orderId || ('ORD-' + Math.floor(100000 + Math.random() * 900000)),
      createdAt: now,
      targetDeliveryTime,
      estimatedMinutes: durationMinutes,
      items: orderData.items || cart.map((i) => ({
        name: i.product?.name || 'Mahsulot',
        quantity: i.quantity,
        price: i.product?.price || 0,
        image: i.product?.image || ''
      })),
      totalAmount: orderData.totalAmount || total,
      customerName: orderData.customerName || 'Azizbek Rahimov',
      customerPhone: orderData.customerPhone || '+998 90 123 45 67',
      address: orderData.address || "Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy",
      courier: {
        name: 'Rustam Karimov',
        phone: '+998 93 555 44 33',
        vehicle: 'Damas (Oq) — 01 A 777 AA',
        rating: 4.9,
      },
      status: 'in_transit',
    };

    setActiveDelivery(deliveryPayload);
    setIsDeliveryModalOpen(true);
    return deliveryPayload;
  };

  const completeDelivery = () => {
    setActiveDelivery(null);
    setIsDeliveryModalOpen(false);
    try {
      localStorage.removeItem('sports_active_delivery');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        activeDelivery,
        setActiveDelivery,
        isDeliveryModalOpen,
        setIsDeliveryModalOpen,
        createActiveDelivery,
        completeDelivery,
        discountCode,
        discountPercent,
        applyDiscount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        totalItemsCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
