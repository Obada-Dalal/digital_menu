import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // دالة لإضافة منتج للسلة (تستدعى من MenuProducts عند الضغط على +)
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  // دالة إنقاص الكمية أو حذف المنتج إذا أصبحت 0
  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item._id !== productId);
    });
  }, []);

  // حذف منتج محدد كلياً
  const deleteItem = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  }, []);

  // مسح السلة بالكامل
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // حساب المجموع الكلي
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // عدد المنتجات في السلة (لأيقونة العداد)
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

// Hook مخصص لاستهلاك السياق
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
