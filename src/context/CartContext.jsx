import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // إضافة منتج للسلة
  const addToCart = useCallback((product, selectedSize = null) => {
    setCartItems((prev) => {
      if (selectedSize) {
        // منتج مع حجم - قارن بالـ id والحجم
        const existing = prev.find(
          (item) =>
            item._id === product._id &&
            item.selectedSize?.name === selectedSize.name
        );
        if (existing) {
          return prev.map((item) =>
            item._id === product._id &&
            item.selectedSize?.name === selectedSize.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            selectedSize: selectedSize,
            price: selectedSize.price
          }
        ];
      } else {
        // منتج بدون حجم
        const existing = prev.find(
          (item) => item._id === product._id && !item.selectedSize
        );
        if (existing) {
          return prev.map((item) =>
            item._id === product._id && !item.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // إنقاص الكمية
  const removeFromCart = useCallback((productId, selectedSize = null) => {
    setCartItems((prev) => {
      // ابحث عن العنصر المطلوب
      const existingIndex = prev.findIndex((item) => {
        if (selectedSize) {
          return (
            item._id === productId &&
            item.selectedSize?.name === selectedSize.name
          );
        }
        return item._id === productId && !item.selectedSize;
      });

      if (existingIndex === -1) return prev;

      const existing = prev[existingIndex];

      if (existing.quantity > 1) {
        // قلل الكمية
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // احذف العنصر
        return prev.filter((_, i) => i !== existingIndex);
      }
    });
  }, []);

  // حذف منتج كلياً
  const deleteItem = useCallback((productId, selectedSize = null) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        if (selectedSize) {
          return !(
            item._id === productId &&
            item.selectedSize?.name === selectedSize.name
          );
        }
        return !(item._id === productId && !item.selectedSize);
      })
    );
  }, []);

  // مسح السلة
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        deleteItem,
        clearCart,
        totalPrice,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
