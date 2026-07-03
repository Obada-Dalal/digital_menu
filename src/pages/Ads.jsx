import { useEffect, useState } from "react";
import api from "../services/api";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import "./ads.css";

export default function Ads() {
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get("/ads");
        // نجيب أول إعلان أو آخر واحد
        if (res.data && res.data.length > 0) {
          setRestaurantImage(res.data[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, []);

  // ✨ Skeleton أثناء التحميل
  if (loading) {
    return (
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-image-wrapper">
            <div className="hero-image skeleton-hero-image"></div>
          </div>
          <div className="hero-text">
            <div className="skeleton-hero-title"></div>
            <div className="skeleton-hero-description"></div>
          </div>
          <div className="hero-social">
            <div className="skeleton-hero-icon"></div>
            <div className="skeleton-hero-icon"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-section">
      <div className="hero-container">
        {/* صورة المطعم الدائرية */}
        <div className="hero-image-wrapper">
          <div className="hero-image">
            <img
              src={restaurantImage || "/images/logo.avif"}
              alt="شعار المطعم"
            />
          </div>
        </div>

        {/* اسم المطعم والوصف - ثابت */}
        <div className="hero-text">
          <h1 className="hero-title">مطعم الذواق</h1>
          <p className="hero-description">
            نقدم لكم أشهى المأكولات الطازجة يومياً. جودة عالية وطعم لا يُنسى
          </p>
        </div>

        {/* أيقونات التواصل */}
        <div className="hero-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-icon facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-icon instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
}
