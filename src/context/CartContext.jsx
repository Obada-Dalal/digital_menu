import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

// ✨ دالة لتوليد مفتاح فريد لكل عنصر في السلة
const getCartItemKey = (item) => {
  if (item.selectedSize) {
    return `${item._id}_${item.selectedSize.name}`;
  }
  return item._id;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // إضافة منتج للسلة
  const addToCart = useCallback((product, selectedSize = null) => {
    setCartItems((prev) => {
      if (selectedSize) {
        const existingIndex = prev.findIndex(
          (item) =>
            item._id === product._id &&
            item.selectedSize?.name === selectedSize.name
        );
        if (existingIndex !== -1) {
          return prev.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [
          ...prev,
          {
            ...product,
            _id: product._id,
            name: product.name,
            imageUrl: product.imageUrl,
            quantity: 1,
            selectedSize: selectedSize,
            price: selectedSize.price
          }
        ];
      } else {
        const existingIndex = prev.findIndex(
          (item) => item._id === product._id && !item.selectedSize
        );
        if (existingIndex !== -1) {
          return prev.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [
          ...prev,
          {
            ...product,
            _id: product._id,
            name: product.name,
            imageUrl: product.imageUrl,
            quantity: 1,
            price: product.price
          }
        ];
      }
    });
  }, []);

  // إنقاص الكمية
  const removeFromCart = useCallback((productId, selectedSize = null) => {
    setCartItems((prev) => {
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
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
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
        cartCount,
        getCartItemKey
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
