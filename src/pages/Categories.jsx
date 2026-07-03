import { useState } from "react";
import "./categories.css";

function CategoriesSkeleton() {
  return (
    <div className="categories-section">
      <div className="skeleton-all-btn"></div>
      <div className="skeleton-categories-grid">
        <div className="skeleton-category-card">
          <div className="skeleton-category-image"></div>
          <div className="skeleton-category-name"></div>
        </div>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="skeleton-category-card">
            <div className="skeleton-category-image"></div>
            <div className="skeleton-category-name"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Categories({
  categories,
  onSelectCategory,
  isLoading
}) {
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (!categories || categories.length === 0) {
    return <div className="loading-text">لا توجد تصنيفات</div>;
  }

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleCategoryClick = (categoryName) => {
    onSelectCategory(categoryName);
    closeModal();
  };

  return (
    <div className="categories-section">
      <button className="all-categories-btn" onClick={openModal}>
        عرض كل التصنيفات
      </button>

      {/* ✨ بدون أي دوال سحب - CSS يتولى كل شيء */}
      <div className="categories-grid">
        <div
          className="category-card all-category-card"
          onClick={() => handleCategoryClick("all")}
        >
          <div className="category-image all-image">
            <span>الكل</span>
          </div>
          <h3 className="category-name">الكل</h3>
        </div>
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-card"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div className="category-image">
              <img src={cat.imageUrl} alt={cat.name} />
            </div>
            <h3 className="category-name">{cat.name}</h3>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>جميع التصنيفات</h3>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-categories-grid">
              <div
                className="category-card all-category-card"
                onClick={() => handleCategoryClick("all")}
              >
                <div className="category-image all-image">
                  <span>الكل</span>
                </div>
                <h3 className="category-name">الكل</h3>
              </div>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="category-image">
                    <img src={cat.imageUrl} alt={cat.name} />
                  </div>
                  <h3 className="category-name">{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
