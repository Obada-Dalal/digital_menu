import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import "./cart.css";
import { FaCar } from "react-icons/fa";
import { IoIosRestaurant } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa6";

export default function Cart() {
  const {
    cartItems,
    deleteItem,
    clearCart,
    totalPrice,
    cartCount,
    addToCart,
    removeFromCart,
    getCartItemKey
  } = useCart();

  const { showNotification } = useNotification();

  const [showModal, setShowModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [orderType, setOrderType] = useState("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openContinueModal = () => {
    setShowModal(false);
    setShowContinueModal(true);
  };
  const closeContinueModal = () => {
    setShowContinueModal(false);
    setShowModal(true);
  };

  // ✨ إضافة للسلة مع دعم الأحجام
  const handleCartAdd = (item) => {
    if (item.selectedSize) {
      addToCart(item, item.selectedSize);
      const currentItem = cartItems.find(
        (i) =>
          i._id === item._id && i.selectedSize?.name === item.selectedSize.name
      );
      const qty = currentItem ? currentItem.quantity + 1 : 1;
      showNotification(
        ` ${item.name} (${item.selectedSize.name}) (الكمية: ${qty})`,
        "success"
      );
    } else {
      addToCart(item);
      const currentItem = cartItems.find(
        (i) => i._id === item._id && !i.selectedSize
      );
      const qty = currentItem ? currentItem.quantity + 1 : 1;
      showNotification(` ${item.name} (الكمية: ${qty})`, "success");
    }
  };

  // ✨ إنقاص من السلة مع دعم الأحجام
  const handleCartRemove = (item) => {
    const currentItem = cartItems.find((i) => {
      if (item.selectedSize) {
        return (
          i._id === item._id && i.selectedSize?.name === item.selectedSize.name
        );
      }
      return i._id === item._id && !i.selectedSize;
    });

    if (!currentItem) return;

    removeFromCart(item._id, item.selectedSize || null);

    if (currentItem.quantity === 1) {
      showNotification(
        ` ${item.name}${item.selectedSize ? ` (${item.selectedSize.name})` : ""} تم الحذف من السلة`,
        "error"
      );
    } else {
      showNotification(
        ` ${item.name}${item.selectedSize ? ` (${item.selectedSize.name})` : ""} (الكمية: ${currentItem.quantity - 1})`,
        "warning"
      );
    }
  };

  // ✨ حذف نهائي مع دعم الأحجام
  const handleDeleteItem = (item) => {
    deleteItem(item._id, item.selectedSize || null);
    showNotification(
      ` ${item.name}${item.selectedSize ? ` (${item.selectedSize.name})` : ""} تم حذفه نهائياً`,
      "error"
    );
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) {
      showNotification(` سلة التسوق فارغة بالفعل`, "warning");
    } else {
      clearCart();
      showNotification(`🗑️ تم مسح سلة التسوق بالكامل`, "error");
    }
  };

  const handleContinueOrder = () => {
    if (cartItems.length === 0) {
      showNotification(` سلة التسوق فارغة - أضف بعض الأصناف أولاً`, "warning");
    } else {
      openContinueModal();
    }
  };

  const handleSendWhatsApp = () => {
    const restaurantNumber = "+963947584270";
    let message = `🍔 *طلب جديد* 🍔\n\n`;
    message += `*نوع الخدمة:* ${orderType === "dine-in" ? "تناول في المطعم" : "استلام"}\n`;
    if (orderType === "dine-in") {
      message += `*رقم الطاولة:* ${tableNumber}\n`;
    } else {
      message += `*معلومات الاتصال:* ${contactInfo}\n`;
      message += `*رقم الهاتف:* ${phoneNumber}\n`;
    }
    if (specialInstructions.trim()) {
      message += `*تعليمات خاصة:* ${specialInstructions}\n`;
    }
    message += `\n📋 *الأصناف المطلوبة:*\n`;
    cartItems.forEach((item) => {
      const sizeText = item.selectedSize ? ` (${item.selectedSize.name})` : "";
      message += `- ${item.name}${sizeText} (x${item.quantity}) - ${item.price * item.quantity} SY\n`;
    });
    message += `\n💰 *المجموع الكلي:* ${totalPrice} SY`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${restaurantNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="pearnt-cart">
      <div className="box-icon-cart">
        <button className="cart-icon" onClick={openModal}>
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="cart-count-badge">{cartCount}</span>
          )}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-cart">
            <div className="header-modal-cart">
              <div className="caption-modal-cart">
                <h2>
                  سلة التسوق <FaShoppingCart />
                </h2>
              </div>
              <button className="cart-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="content-modal-cart">
              {cartItems.length === 0 ? (
                <div className="cart-items">
                  <i>
                    <FaShoppingCart />
                  </i>
                  <h2>سلة التسوق فارغة</h2>
                  <p>أضف بعض الأصناف اللذيذة للبدء!</p>
                </div>
              ) : (
                <ul className="cart-items-list">
                  {cartItems.map((item) => (
                    <li key={getCartItemKey(item)} className="cart-item-row">
                      <div className="item-details">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-text">
                          <span className="item-name">
                            {item.name}
                            {/* ✨ عرض الحجم المختار */}
                            {item.selectedSize && (
                              <span className="item-size-badge">
                                {item.selectedSize.name}
                              </span>
                            )}
                          </span>
                          <span className="item-calculation">
                            SY {item.price} × {item.quantity} = <b />
                            {item.price * item.quantity} SY
                          </span>
                          {item.ingredients && item.ingredients.length > 0 && (
                            <span className="item-ingredients">
                              {item.ingredients.join(" • ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="item-actions">
                        <div className="cart-counter">
                          <button
                            className="counter-btn cart"
                            onClick={() => handleCartRemove(item)}
                          >
                            −
                          </button>
                          <span className="counter-value cart">
                            {item.quantity}
                          </span>
                          <button
                            className="counter-btn cart"
                            onClick={() => handleCartAdd(item)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="item-delete"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="cart-total">
              المجموع : <span className="total-price">{totalPrice}</span> SY
            </div>

            <div className="buttons-modal-cart">
              <button className="continue" onClick={handleContinueOrder}>
                متابعة الطلب
              </button>
              <button className="delete-cart-items" onClick={handleClearCart}>
                مسح السلة
              </button>
            </div>
          </div>
        </div>
      )}

      {showContinueModal && (
        <div className="modal-overlay">
          <div className="modal-Continue">
            <div className="header-modal-Continue">
              <div className="caption-modal-Continue">
                <h2>
                  تفاصيل الطلب <FaShoppingCart />
                </h2>
              </div>
              <button
                className="cart-modal-Continue"
                onClick={closeContinueModal}
              >
                ✕
              </button>
            </div>

            <div className="content-modal-Continue">
              <div className="order-section">
                <div className="radio-group">
                  <div
                    className={`radio-card ${orderType === "dine-in" ? "active" : ""}`}
                    onClick={() => setOrderType("dine-in")}
                  >
                    <span className="radio-circle"></span>
                    <span>
                      <IoIosRestaurant />
                    </span>
                    <span>تناول في المطعم</span>
                  </div>
                  <div
                    className={`radio-card ${orderType === "takeaway" ? "active" : ""}`}
                    onClick={() => setOrderType("takeaway")}
                  >
                    <span className="radio-circle"></span>
                    <span>
                      <FaCar />
                    </span>
                    <span>استلام</span>
                  </div>
                </div>

                {orderType === "dine-in" ? (
                  <div className="order-fields">
                    <div className="field-group">
                      <label>رقم الطاولة:</label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="أدخل رقم الطاولة"
                      />
                    </div>
                    <div className="field-group">
                      <label>ملاحظات خاصة:</label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="اكتب ملاحظات خاصة (اختياري)"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="order-fields">
                    <div className="field-group">
                      <label>معلومات الاتصال:</label>
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="الاسم"
                      />
                    </div>
                    <div className="field-group">
                      <label>رقم الهاتف:</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="أدخل رقم الهاتف"
                      />
                    </div>
                    <div className="field-group">
                      <label>ملاحظات خاصة:</label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="اكتب ملاحظات خاصة (اختياري)"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="buttons-modal-cart">
              <button
                className="continue whatsapp"
                onClick={handleSendWhatsApp}
              >
                اطلب عبر واتساب <FaWhatsapp />
              </button>
              <button
                className="delete-cart-items"
                onClick={closeContinueModal}
              >
                رجوع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
