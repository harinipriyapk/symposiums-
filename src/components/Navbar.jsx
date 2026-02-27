import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";

function Navbar() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const logoTextRef = useRef(null);
  const linksRef = useRef([]);
  const glowRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Mount animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav slide down
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      // Logo reveal with glitch flicker
      const tl = gsap.timeline({ delay: 0.4 });
      tl.from(logoRef.current, { opacity: 0, x: -40, duration: 0.6, ease: "power3.out" })
        .to(logoRef.current, { x: 3, duration: 0.05 }, "+=0.1")
        .to(logoRef.current, { x: -3, duration: 0.05 })
        .to(logoRef.current, { x: 0, duration: 0.05 });

      // Stagger links in
      gsap.from(linksRef.current, {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.6,
      });

      // Ambient glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.2,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Active route indicator animation
  useEffect(() => {
    linksRef.current.forEach((el) => {
      if (!el) return;
      const isActive = el.getAttribute("href") === location.pathname;
      gsap.to(el, {
        color: isActive ? "#00f5c4" : "#cbd5e1",
        duration: 0.3,
      });
    });
  }, [location.pathname]);

  // Link hover
  const handleLinkEnter = (i) => {
    gsap.to(linksRef.current[i], {
      y: -3,
      color: "#00f5c4",
      textShadow: "0 0 12px rgba(0,245,196,0.7)",
      duration: 0.25,
      ease: "power2.out",
    });
  };
  const handleLinkLeave = (i) => {
    const isActive = linksRef.current[i]?.getAttribute("href") === location.pathname;
    gsap.to(linksRef.current[i], {
      y: 0,
      color: isActive ? "#00f5c4" : "#cbd5e1",
      textShadow: "none",
      duration: 0.25,
    });
  };

  // Logo hover
  const handleLogoEnter = () => {
    gsap.to(logoTextRef.current, {
      letterSpacing: "4px",
      color: "#00f5c4",
      textShadow: "0 0 20px rgba(0,245,196,0.5)",
      duration: 0.4,
      ease: "power2.out",
    });
  };
  const handleLogoLeave = () => {
    gsap.to(logoTextRef.current, {
      letterSpacing: "2px",
      color: "#f1f5f9",
      textShadow: "none",
      duration: 0.4,
    });
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
    { to: "/register", label: "Register" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600&display=swap');

        .ait-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 2.5rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(
            90deg,
            rgba(5,10,20,0.97) 0%,
            rgba(5,10,30,0.95) 50%,
            rgba(5,10,20,0.97) 100%
          );
          border-bottom: 1px solid rgba(0,245,196,0.15);
          backdrop-filter: blur(12px);
          font-family: 'Rajdhani', sans-serif;
          overflow: visible;
        }

        .ait-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,245,196,0.015) 2px,
            rgba(0,245,196,0.015) 4px
          );
          pointer-events: none;
        }

        .ait-navbar-glow {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 80px;
          background: radial-gradient(ellipse, rgba(0,245,196,0.25) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0.4;
        }

        .ait-logo {
          display: flex;
          flex-direction: column;
          gap: 1px;
          cursor: default;
          position: relative;
        }

        .ait-logo-eyebrow {
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 4px;
          color: #00f5c4;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .ait-logo-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #f1f5f9;
          text-transform: uppercase;
          line-height: 1;
          transition: none;
        }

        .ait-logo-accent {
          display: block;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #00f5c4, transparent);
          margin-top: 4px;
          border-radius: 2px;
        }

        .ait-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .ait-link {
          position: relative;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #cbd5e1;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 3px;
          transition: background 0.2s;
        }

        .ait-link::before {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 1px;
          background: #00f5c4;
          transition: transform 0.3s ease;
          transform-origin: center;
        }

        .ait-link:hover::before,
        .ait-link.active::before {
          transform: translateX(-50%) scaleX(1);
        }

        .ait-link:hover {
          background: rgba(0,245,196,0.05);
        }

        .ait-link-register {
          border: 1px solid rgba(0,245,196,0.4);
          color: #00f5c4 !important;
          background: rgba(0,245,196,0.05);
        }

        .ait-link-register:hover {
          background: rgba(0,245,196,0.12) !important;
          border-color: rgba(0,245,196,0.8);
          box-shadow: 0 0 16px rgba(0,245,196,0.25);
        }

        .ait-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          margin: 0 6px;
        }

        @media (max-width: 640px) {
          .ait-logo-text {
            font-size: 11px;
          }
          .ait-links {
            display: none;
          }
        }
      `}</style>

      <nav className="ait-navbar" ref={navRef}>
        <div className="ait-navbar-glow" ref={glowRef} />

        {/* Logo */}
        <div
          className="ait-logo"
          ref={logoRef}
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
        >
          <span className="ait-logo-eyebrow">symposium 2025</span>
          <span className="ait-logo-text" ref={logoTextRef}>
            Adithya Institute of Technology
          </span>
          <span className="ait-logo-accent" />
        </div>

        {/* Links */}
        <div className="ait-links">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`ait-link${link.to === "/register" ? " ait-link-register" : ""}${
                location.pathname === link.to ? " active" : ""
              }`}
              ref={(el) => (linksRef.current[i] = el)}
              onMouseEnter={() => handleLinkEnter(i)}
              onMouseLeave={() => handleLinkLeave(i)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
