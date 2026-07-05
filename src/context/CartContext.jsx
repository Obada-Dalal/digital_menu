import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // دالة لإضافة منتج للسلة - ✨ تدعم الأحجام
  const addToCart = useCallback((product, selectedSize = null) => {
    setCartItems((prev) => {
      if (selectedSize) {
        // منتج مع حجم محدد - استخدم sizeId للمقارنة
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
            price: selectedSize.price // السعر حسب الحجم
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

  // دالة إنقاص الكمية أو حذف المنتج إذا أصبحت 0
  const removeFromCart = useCallback((productId, selectedSize = null) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => {
        if (selectedSize) {
          return (
            item._id === productId &&
            item.selectedSize?.name === selectedSize.name
          );
        }
        return item._id === productId && !item.selectedSize;
      });

      if (existing && existing.quantity > 1) {
        return prev.map((item) => {
          const isMatch = selectedSize
            ? item._id === productId &&
              item.selectedSize?.name === selectedSize.name
            : item._id === productId && !item.selectedSize;
          return isMatch ? { ...item, quantity: item.quantity - 1 } : item;
        });
      }
      return prev.filter((item) => {
        if (selectedSize) {
          return !(
            item._id === productId &&
            item.selectedSize?.name === selectedSize.name
          );
        }
        return !(item._id === productId && !item.selectedSize);
      });
    });
  }, []);

  // حذف منتج محدد كلياً
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

  // مسح السلة بالكامل
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // حساب المجموع الكلي
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // عدد المنتجات في السلة
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
