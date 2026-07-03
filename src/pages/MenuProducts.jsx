import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
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

  const handleAddToCart = (product) => {
    addToCart(product);
    const currentItem = cartItems.find((item) => item._id === product._id);
    const newQuantity = currentItem ? currentItem.quantity + 1 : 1;
    showNotification(
      ` ${product.name} تمت الإضافة إلى السلة (الكمية: ${newQuantity})`,
      "success"
    );
  };

  const handleRemoveFromCart = (product) => {
    const currentItem = cartItems.find((item) => item._id === product._id);
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

  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  };

  if (searchQuery && searchQuery.trim()) {
    return (
      <div className="menu-container">
        {filtered.length > 0 ? (
          <section className="menu-category-section">
            <h2 className="menu-category-title">نتائج البحث</h2>
            <div className="menu-category-line"></div>
            <div className="menu-products-grid">
              {filtered.map((product) => (
                <div key={product._id} className="menu-product-card">
                  <div className="menu-product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="menu-product-info">
                    <h3 className="menu-product-name">{product.name}</h3>
                    {product.ingredients && product.ingredients.length > 0 && (
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
                        <button
                          className="counter-btn"
                          onClick={() => handleRemoveFromCart(product)}
                        >
                          −
                        </button>
                        <span className="counter-value">
                          {getQuantity(product._id)}
                        </span>
                        <button
                          className="counter-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="no-results">لا توجد منتجات مطابقة</div>
        )}
      </div>
    );
  }

  return (
    <div className="menu-container">
      {grouped.map(({ category, products }) => (
        <section key={category._id} className="menu-category-section">
          <h2 className="menu-category-title">{category.name}</h2>
          <div className="menu-category-line"></div>
          <div className="menu-products-grid">
            {products.map((product) => (
              <div key={product._id} className="menu-product-card">
                <div className="menu-product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="menu-product-info">
                  <h3 className="menu-product-name">{product.name}</h3>
                  {product.ingredients && product.ingredients.length > 0 && (
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
                      <button
                        className="counter-btn"
                        onClick={() => handleRemoveFromCart(product)}
                      >
                        −
                      </button>
                      <span className="counter-value">
                        {getQuantity(product._id)}
                      </span>
                      <button
                        className="counter-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        +
                      </button>
                    </div>
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
