import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./AdminLogin.css";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const formRef = useRef(null);

  const containerRef = useRef(null);
  const titleRef     = useRef(null);
  const subtitleRef  = useRef(null);
  const input1Ref    = useRef(null);
  const input2Ref    = useRef(null);
  const btnRef       = useRef(null);
  const glowRef      = useRef(null);
  const particlesRef = useRef([]);
  const scanlineRef  = useRef(null);

  /* ── Mount animations ───────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Overlay fade in
      tl.from(containerRef.current, { opacity: 0, duration: 0.6 })

        // Form drops in
        .from(formRef.current, {
          y: -80, opacity: 0, scale: 0.9,
          duration: 0.8, ease: "back.out(1.5)",
        }, "-=0.2")

        // Scanline sweep
        .from(scanlineRef.current, { scaleX: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.3")

        // Title glitch reveal
        .from(titleRef.current, { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
        .to(titleRef.current, { x: 4, duration: 0.04 })
        .to(titleRef.current, { x: -4, duration: 0.04 })
        .to(titleRef.current, { x: 0, duration: 0.04 })

        // Subtitle
        .from(subtitleRef.current, { opacity: 0, y: 10, duration: 0.4 }, "-=0.1")

        // Inputs stagger
        .from([input1Ref.current, input2Ref.current], {
          opacity: 0, x: -30, stagger: 0.15, duration: 0.5,
        }, "-=0.1")

        // Button
        .from(btnRef.current, {
          opacity: 0, y: 20, scale: 0.85, duration: 0.5, ease: "back.out(2)",
        }, "-=0.1");

      // Ambient glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.7, scale: 1.15,
        duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      // Floating particles
      particlesRef.current.forEach((p, i) => {
        gsap.to(p, {
          y: `-=${40 + i * 10}`,
          x: `+=${Math.sin(i * 1.5) * 20}`,
          opacity: 0,
          duration: 3 + i * 0.5,
          repeat: -1,
          delay: i * 0.4,
          ease: "power1.out",
        });
      });

      // Scanline slow scroll
      gsap.to(scanlineRef.current, {
        y: "100vh", duration: 6, repeat: -1, ease: "none", delay: 1,
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ── Input focus glow ───────────────────────────────────────── */
  const handleFocus = (ref) => {
    gsap.to(ref.current, { borderBottomColor: "#00f5c4", duration: 0.3 });
    gsap.to(ref.current.parentElement?.querySelector(".input-glow"), {
      opacity: 1, scaleX: 1, duration: 0.4,
    });
  };

  const handleBlur = (ref, hasValue) => {
    if (!hasValue) {
      gsap.to(ref.current, { borderBottomColor: "rgba(255,255,255,0.4)", duration: 0.3 });
    }
    gsap.to(ref.current.parentElement?.querySelector(".input-glow"), {
      opacity: 0, scaleX: 0, duration: 0.3,
    });
  };

  /* ── Button hover ────────────────────────────────────────────── */
  const handleBtnEnter = () => {
    gsap.to(btnRef.current, {
      scale: 1.06, y: -3,
      boxShadow: "0 12px 30px rgba(0,245,196,0.4)",
      duration: 0.25, ease: "power2.out",
    });
  };
  const handleBtnLeave = () => {
    gsap.to(btnRef.current, {
      scale: 1, y: 0, boxShadow: "none",
      duration: 0.25,
    });
  };

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Pulse button on submit
    gsap.to(btnRef.current, {
      scale: 0.95, duration: 0.1, yoyo: true, repeat: 1,
    });

    setTimeout(() => {
      if (form.email === "admin@gmail.com" && form.password === "admin123") {
        // Success flash
        gsap.to(formRef.current, {
          boxShadow: "0 0 60px rgba(0,245,196,0.5)",
          borderColor: "rgba(0,245,196,0.6)",
          duration: 0.4, yoyo: true, repeat: 1,
          onComplete: () => {
            localStorage.setItem("admin", "true");
            window.location.href = "/admin-dashboard";
          },
        });
      } else {
        // Shake on error
        setLoading(false);
        gsap.to(formRef.current, {
          x: -12, duration: 0.07, repeat: 5, yoyo: true, ease: "power2.inOut",
          onComplete: () => gsap.set(formRef.current, { x: 0 }),
        });
        gsap.to(formRef.current, {
          boxShadow: "0 0 40px rgba(239,68,68,0.45)",
          borderColor: "rgba(239,68,68,0.5)",
          duration: 0.3, yoyo: true, repeat: 1,
        });
      }
    }, 800);
  };

  return (
    <div className="admin-container" ref={containerRef}>

      {/* Ambient glow blob */}
      <div className="admin-glow" ref={glowRef} />

      {/* Scanline effect */}
      <div className="admin-scanline" ref={scanlineRef} />

      {/* Floating particles */}
      <div className="admin-particles" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="a-particle"
            ref={(el) => (particlesRef.current[i] = el)}
            style={{ left: `${10 + i * 9}%`, top: `${60 + (i % 4) * 8}%` }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div className="admin-grid" aria-hidden="true" />

      {/* Form card */}
      <form className="admin-form" onSubmit={handleSubmit} ref={formRef}>

        {/* Top accent bar */}
        <div className="form-accent-bar" />

        {/* Lock icon */}
        <div className="form-lock-icon">🔐</div>

        <h2 className="admin-title" ref={titleRef}>Admin Portal</h2>
        <p className="admin-subtitle" ref={subtitleRef}>
          Authorized access only
        </p>

        {/* Email */}
        <div className="input-group" ref={input1Ref}>
          <span className="input-label">Email</span>
          <input
            type="email"
            name="email"
            placeholder="admin@gmail.com"
            value={form.email}
            onChange={handleChange}
            onFocus={() => handleFocus(input1Ref)}
            onBlur={() => handleBlur(input1Ref, !!form.email)}
            required
            autoComplete="off"
          />
          <div className="input-glow" />
        </div>

        {/* Password */}
        <div className="input-group" ref={input2Ref}>
          <span className="input-label">Password</span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onFocus={() => handleFocus(input2Ref)}
            onBlur={() => handleBlur(input2Ref, !!form.password)}
            required
          />
          <div className="input-glow" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="admin-btn"
          ref={btnRef}
          onMouseEnter={handleBtnEnter}
          onMouseLeave={handleBtnLeave}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </span>
          ) : (
            "Login →"
          )}
        </button>

      </form>
    </div>
  );
}

export default AdminLogin;
