import { useState } from "react";
import "./header.css";

// icons
import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function Header() {
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <div className="pearant">
      <div className="social">
        {logoLoaded ? (
          <>
            <a className="facebook">
              <FaFacebook />
            </a>
            <a className="insatgram">
              <FaInstagram />
            </a>
          </>
        ) : (
          <>
            <div className="social-skeleton"></div>
            <div className="social-skeleton"></div>
          </>
        )}
      </div>

      <div className="logo">
        {!logoLoaded && <div className="logo-skeleton"></div>}
        <img
          src="/images/logo.avif"
          alt="Logo"
          style={{ display: logoLoaded ? "block" : "none" }}
          onLoad={() => setLogoLoaded(true)}
        />
      </div>
    </div>
  );
}
