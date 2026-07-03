import { useState, useRef } from "react";
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

  // ✨ للسلايدر باللمس
  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  // ✨ دوال السحب للموبايل
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // ✨ دوال اللمس
  const handleTouchStart = (e) => {
    isDown.current = true;
    startX.current = e.touches[0].pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDown.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDown.current = false;
  };

  return (
    <div className="categories-section">
      <button className="all-categories-btn" onClick={openModal}>
        عرض كل التصنيفات
      </button>

      {/* ✨ شريط تصنيفات - شبكة في الديسكتوب، سلايدر في الموبايل */}
      <div
        className="categories-grid"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
