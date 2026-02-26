import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Events.css";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS = {
  Technical:   { bg: "#00f5c4", text: "#020810" },
  Competition: { bg: "#f97316", text: "#020810" },
  Research:    { bg: "#818cf8", text: "#020810" },
  Creative:    { bg: "#fb7185", text: "#020810" },
};

const events = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    desc: "Hands-on training on AI model building and deployment.",
    date: "March 12, 2026",
    time: "10:00 AM",
    venue: "Seminar Hall A",
    category: "Technical",
    icon: "⚙️",
  },
  {
    id: 2,
    title: "24-Hour National Hackathon",
    desc: "Build innovative solutions to real-world problems.",
    date: "March 13, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    category: "Competition",
    icon: "⚡",
  },
  {
    id: 3,
    title: "Paper Presentation",
    desc: "Present your research ideas and win exciting prizes.",
    date: "March 12, 2026",
    time: "2:00 PM",
    venue: "Conference Room",
    category: "Research",
    icon: "📄",
  },
  {
    id: 4,
    title: "Robotics Challenge",
    desc: "Compete with autonomous robots in a thrilling arena.",
    date: "March 13, 2026",
    time: "11:00 AM",
    venue: "Tech Lab",
    category: "Technical",
    icon: "🤖",
  },
  {
    id: 5,
    title: "UI/UX Design Contest",
    desc: "Design innovative and user-friendly interfaces.",
    date: "March 12, 2026",
    time: "1:00 PM",
    venue: "Design Studio",
    category: "Creative",
    icon: "🎨",
  },
];

function Events() {
  const sectionRef  = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef    = useRef([]);
  const particlesRef = useRef([]);

  /* ── Page-enter & scroll animations ─────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Title line wipe */
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
        },
      });

      /* Subtitle fade */
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top 85%",
        },
      });

      /* Cards staggered reveal */
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.92,
        stagger: 0.13,
        duration: 0.75,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 88%",
        },
      });

      /* Floating particles */
      particlesRef.current.forEach((p, i) => {
        gsap.to(p, {
          y: `${-30 - i * 8}px`,
          x: `${Math.sin(i) * 15}px`,
          opacity: 0,
          duration: 3 + i * 0.4,
          repeat: -1,
          delay: i * 0.6,
          ease: "power1.inOut",
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Card hover ──────────────────────────────────────────────── */
  const handleCardEnter = (i) => {
    const card = cardsRef.current[i];
    gsap.to(card, {
      y: -14,
      scale: 1.03,
      boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,245,196,0.12)",
      borderColor: "rgba(0,245,196,0.35)",
      duration: 0.35,
      ease: "power2.out",
    });
    /* Glow bar sweep */
    const bar = card.querySelector(".card-glow-bar");
    gsap.to(bar, { scaleX: 1, duration: 0.4, ease: "power2.out" });
    /* Icon bounce */
    const icon = card.querySelector(".card-icon");
    gsap.to(icon, { scale: 1.25, rotation: 10, duration: 0.3, ease: "back.out(2)" });
  };

  const handleCardLeave = (i) => {
    const card = cardsRef.current[i];
    gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      borderColor: "rgba(255,255,255,0.07)",
      duration: 0.4,
      ease: "power2.inOut",
    });
    const bar = card.querySelector(".card-glow-bar");
    gsap.to(bar, { scaleX: 0, duration: 0.35, ease: "power2.in" });
    const icon = card.querySelector(".card-icon");
    gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3 });
  };

  /* ── Register button hover ───────────────────────────────────── */
  const handleBtnEnter = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.07,
      y: -3,
      boxShadow: "0 10px 28px rgba(0,245,196,0.35)",
      duration: 0.25,
      ease: "power2.out",
    });
  };
  const handleBtnLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      y: 0,
      boxShadow: "none",
      duration: 0.25,
    });
  };

  return (
    <section className="events-container" ref={sectionRef}>

      {/* Background particles */}
      <div className="events-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            ref={(el) => (particlesRef.current[i] = el)}
            style={{
              left: `${8 + i * 8}%`,
              top: `${20 + (i % 5) * 15}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Grid lines decoration */}
      <div className="events-grid-lines" aria-hidden="true" />

      {/* Header */}
      <div className="events-header">
        <p className="events-eyebrow" ref={subtitleRef}>
          <span className="eyebrow-line" />
          Symposium 2025 &nbsp;·&nbsp; March 12–13
          <span className="eyebrow-line" />
        </p>
        <h2 className="events-title" ref={titleRef}>
          <span className="title-word">Our</span>
          <span className="title-word title-accent"> Events</span>
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="cards">
        {events.map((event, i) => {
          const color = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.Technical;
          return (
            <div
              key={event.id}
              className="card"
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={() => handleCardEnter(i)}
              onMouseLeave={() => handleCardLeave(i)}
            >
              {/* Top glow sweep bar */}
              <div
                className="card-glow-bar"
                style={{ background: `linear-gradient(90deg, transparent, ${color.bg}, transparent)` }}
              />

              {/* Icon + Badge row */}
              <div className="card-top-row">
                <span className="card-icon">{event.icon}</span>
                <span
                  className="badge"
                  style={{ background: color.bg, color: color.text }}
                >
                  {event.category}
                </span>
              </div>

              <h3 className="card-title">{event.title}</h3>
              <p className="card-desc">{event.desc}</p>

              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{event.venue}</span>
                </div>
              </div>

              <Link
                to="/register"
                className="register-btn"
                style={{ "--btn-color": color.bg }}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                Register Now →
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Events;
