import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { FaTimes } from "react-icons/fa";
import "./MenuProducts.css";

function MenuProductsSkeleton() {
  return (
    <div className="menu-container">
      {[1, 2, 3].map((section) => (
        <section key={section} className="skeleton-section">
          <div className="skeleton-title"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-products-grid">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="skeleton-product-card">
                <div className="skeleton-product-image"></div>
                <div className="skeleton-product-info">
                  <div className="skeleton-product-name"></div>
                  <div className="skeleton-product-price-counter">
                    <div className="skeleton-product-price"></div>
                    <div className="skeleton-counter"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function MenuProducts({
  categories,
  products,
  selectedCategory,
  searchQuery,
  isLoading
}) {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { showNotification } = useNotification();

  // ✨ حالة المودال
  const [sizeModal, setSizeModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeQuantity, setSizeQuantity] = useState(1);

  if (isLoading) return <MenuProductsSkeleton />;

  const getFilteredProducts = () => {
    let filtered = products.filter((p) => p.isAvailable !== false);

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.categoryName === selectedCategory);
    }
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filtered = getFilteredProducts();

  const grouped = categories.reduce((acc, cat) => {
    const catProducts = filtered.filter((p) => p.categoryName === cat.name);
    if (catProducts.length > 0) {
      acc.push({ category: cat, products: catProducts });
    }
    return acc;
  }, []);

  // ✨ عند الضغط على +
  const handleAddClick = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      // المنتج له أحجام - افتح المودال
      setSizeModal(product);
      setSelectedSize(null);
      setSizeQuantity(1);
    } else {
      // منتج بدون أحجام - أضف مباشرة
      addToCart(product);
      const currentItem = cartItems.find(
        (item) => item._id === product._id && !item.selectedSize
      );
      const newQuantity = currentItem ? currentItem.quantity + 1 : 1;
      showNotification(
        ` ${product.name} تمت الإضافة إلى السلة (الكمية: ${newQuantity})`,
        "success"
      );
    }
  };

  // ✨ تأكيد الإضافة من المودال
  const handleConfirmSize = () => {
    if (!selectedSize) {
      showNotification("الرجاء اختيار الحجم", "error");
      return;
    }
    // إضافة بالكمية المحددة
    for (let i = 0; i < sizeQuantity; i++) {
      addToCart(sizeModal, selectedSize);
    }
    showNotification(
      ` ${sizeModal.name} (${selectedSize.name}) تمت الإضافة (${sizeQuantity})`,
      "success"
    );
    setSizeModal(null);
    setSelectedSize(null);
  };

  // حذف/إنقاص من السلة
  const handleRemoveFromCart = (product) => {
    const currentItem = cartItems.find(
      (item) => item._id === product._id && !item.selectedSize
    );
    if (!currentItem) return;
    if (currentItem.quantity === 1) {
      removeFromCart(product._id);
      showNotification(` ${product.name} تم الحذف من السلة`, "error");
    } else {
      removeFromCart(product._id);
      showNotification(
        ` ${product.name} تم تقليل الكمية إلى ${currentItem.quantity - 1}`,
        "warning"
      );
    }
  };

  // الكمية لمنتج بدون حجم
  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i._id === productId && !i.selectedSize);
    return item ? item.quantity : 0;
  };

  // عرض المنتجات في حالة البحث
  if (searchQuery && searchQuery.trim()) {
    return (
      <>
        <div className="menu-container">
          {filtered.length > 0 ? (
            <section className="menu-category-section">
              <h2 className="menu-category-title">نتائج البحث</h2>
              <div className="menu-category-line"></div>
              <div className="menu-products-grid">
                {filtered.map((product) => {
                  const qty = getQuantity(product._id);
                  return (
                    <div key={product._id} className="menu-product-card">
                      <div className="menu-product-image">
                        <img src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="menu-product-info">
                        <h3 className="menu-product-name">{product.name}</h3>
                        {product.ingredients &&
                          product.ingredients.length > 0 && (
                            <div className="menu-product-ingredients">
                              {product.ingredients.map((ing, i) => (
                                <span key={i} className="ingredient-dot">
                                  {ing}
                                  {i < product.ingredients.length - 1 && " • "}
                                </span>
                              ))}
                            </div>
                          )}
                        <div className="menu-product-price-counter">
                          <span className="menu-product-price">
                            {product.price} SY
                          </span>
                          <div className="menu-counter">
                            {qty > 0 && (
                              <>
                                <button
                                  className="counter-btn"
                                  onClick={() => handleRemoveFromCart(product)}
                                >
                                  −
                                </button>
                                <span className="counter-value">{qty}</span>
                              </>
                            )}
                            <button
                              className="counter-btn"
                              onClick={() => handleAddClick(product)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="no-results">لا توجد منتجات مطابقة</div>
          )}
        </div>

        {/* ✨ مودال اختيار الحجم */}
        {sizeModal && (
          <div
            className="size-modal-overlay"
            onClick={() => setSizeModal(null)}
          >
            <div
              className="size-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ✨ زر الإغلاق */}
              <button
                className="size-modal-close"
                onClick={() => setSizeModal(null)}
              >
                <FaTimes />
              </button>

              <div className="size-modal-image">
                <img src={sizeModal.imageUrl} alt={sizeModal.name} />
              </div>
              <h3 className="size-modal-title">{sizeModal.name}</h3>
              {sizeModal.ingredients && sizeModal.ingredients.length > 0 && (
                <p className="size-modal-ingredients">
                  {sizeModal.ingredients.join(" • ")}
                </p>
              )}

              <p className="size-required-text">اختيار الحجم مطلوب *</p>

              <div className="size-options">
                {sizeModal.sizes.map((s, i) => (
                  <label
                    key={i}
                    className={`size-option ${selectedSize?.name === s.name ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={s.name}
                      checked={selectedSize?.name === s.name}
                      onChange={() => {
                        setSelectedSize(s);
                        setSizeQuantity(1);
                      }}
                    />
                    <span className="size-option-name">{s.name}</span>
                    <span className="size-option-price">{s.price} SY</span>
                  </label>
                ))}
              </div>

              <div className="size-modal-counter">
                <button
                  className="counter-btn"
                  onClick={() => setSizeQuantity(Math.max(1, sizeQuantity - 1))}
                  disabled={sizeQuantity <= 1}
                >
                  −
                </button>
                <span className="counter-value">{sizeQuantity}</span>
                <button
                  className="counter-btn"
                  onClick={() => setSizeQuantity(sizeQuantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="size-modal-add-btn"
                onClick={handleConfirmSize}
              >
                🛒 إضافة إلى السلة
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="menu-container">
        {grouped.map(({ category, products }) => (
          <section key={category._id} className="menu-category-section">
            <h2 className="menu-category-title">{category.name}</h2>
            <div className="menu-category-line"></div>
            <div className="menu-products-grid">
              {products.map((product) => {
                const qty = getQuantity(product._id);
                return (
                  <div key={product._id} className="menu-product-card">
                    <div className="menu-product-image">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="menu-product-info">
                      <h3 className="menu-product-name">{product.name}</h3>
                      {product.ingredients &&
                        product.ingredients.length > 0 && (
                          <div className="menu-product-ingredients">
                            {product.ingredients.map((ing, i) => (
                              <span key={i} className="ingredient-dot">
                                {ing}
                                {i < product.ingredients.length - 1 && " • "}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className="menu-product-price-counter">
                        <span className="menu-product-price">
                          {product.price} SY
                        </span>
                        <div className="menu-counter">
                          {qty > 0 && (
                            <>
                              <button
                                className="counter-btn"
                                onClick={() => handleRemoveFromCart(product)}
                              >
                                −
                              </button>
                              <span className="counter-value">{qty}</span>
                            </>
                          )}
                          <button
                            className="counter-btn"
                            onClick={() => handleAddClick(product)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ✨ مودال اختيار الحجم */}
      {sizeModal && (
        <div className="size-modal-overlay" onClick={() => setSizeModal(null)}>
          <div
            className="size-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✨ زر الإغلاق */}
            <button
              className="size-modal-close"
              onClick={() => setSizeModal(null)}
            >
              <FaTimes />
            </button>

            <div className="size-modal-image">
              <img src={sizeModal.imageUrl} alt={sizeModal.name} />
            </div>
            <h3 className="size-modal-title">{sizeModal.name}</h3>
            {sizeModal.ingredients && sizeModal.ingredients.length > 0 && (
              <p className="size-modal-ingredients">
                {sizeModal.ingredients.join(" • ")}
              </p>
            )}

            <p className="size-required-text">اختيار الحجم مطلوب *</p>

            <div className="size-options">
              {sizeModal.sizes.map((s, i) => (
                <label
                  key={i}
                  className={`size-option ${selectedSize?.name === s.name ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={s.name}
                    checked={selectedSize?.name === s.name}
                    onChange={() => {
                      setSelectedSize(s);
                      setSizeQuantity(1);
                    }}
                  />
                  <span className="size-option-name">{s.name}</span>
                  <span className="size-option-price">{s.price} SY</span>
                </label>
              ))}
            </div>

            <div className="size-modal-counter">
              <button
                className="counter-btn"
                onClick={() => setSizeQuantity(Math.max(1, sizeQuantity - 1))}
                disabled={sizeQuantity <= 1}
              >
                −
              </button>
              <span className="counter-value">{sizeQuantity}</span>
              <button
                className="counter-btn"
                onClick={() => setSizeQuantity(sizeQuantity + 1)}
              >
                +
              </button>
            </div>

            <button className="size-modal-add-btn" onClick={handleConfirmSize}>
              🛒 إضافة إلى السلة
            </button>
          </div>
        </div>
      )}
    </>
  );
}
