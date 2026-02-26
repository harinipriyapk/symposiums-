import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Dashboard.css";

gsap.registerPlugin(ScrollTrigger);

const speakers = [
  { id: 1, name: "Dr. Aisha Patel", topic: "Quantum Computing & Society", time: "09:00 AM", track: "Tech", avatar: "A" },
  { id: 2, name: "Prof. Marcus Lund", topic: "Ethics in Artificial Intelligence", time: "10:30 AM", track: "Ethics", avatar: "M" },
  { id: 3, name: "Dr. Yuki Tanaka", topic: "Biotech Frontiers 2030", time: "12:00 PM", track: "Science", avatar: "Y" },
  { id: 4, name: "Nadia Okonkwo", topic: "Climate Innovation Systems", time: "02:00 PM", track: "Green", avatar: "N" },
  { id: 5, name: "Prof. Carlos Vega", topic: "Neural Interfaces: Next Steps", time: "03:30 PM", track: "Tech", avatar: "C" },
];

const stats = [
  { label: "Registered", value: 2847, suffix: "+" },
  { label: "Speakers", value: 64, suffix: "" },
  { label: "Sessions", value: 128, suffix: "" },
  { label: "Countries", value: 38, suffix: "" },
];

const sessions = [
  { time: "09:00", title: "Opening Ceremony", room: "Grand Hall", live: true },
  { time: "10:30", title: "Panel: Future of Work", room: "Auditorium A", live: false },
  { time: "12:00", title: "Keynote: The Next Era", room: "Main Stage", live: false },
  { time: "14:00", title: "Workshop: AI Tools", room: "Lab 3", live: false },
  { time: "15:30", title: "Closing Remarks", room: "Grand Hall", live: false },
];

export default function SymposiumDashboard() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef([]);
  const speakerCardsRef = useRef([]);
  const navRef = useRef(null);
  const orbitRef = useRef(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [counters, setCounters] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // NAV entrance
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
      );

      // Hero title stagger
      const chars = titleRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.fromTo(chars,
          { y: 120, opacity: 0, rotateX: -90 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1.2,
            stagger: 0.04,
            ease: "expo.out",
            delay: 0.3
          }
        );
      }

      // Orbit animation
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });

      // Stats counter animation
      stats.forEach((stat, i) => {
        ScrollTrigger.create({
          trigger: statsRef.current[i],
          start: "top 85%",
          onEnter: () => {
            gsap.to({}, {
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                const progress = this.progress();
                setCounters(prev => {
                  const next = [...prev];
                  next[i] = Math.floor(progress * stat.value);
                  return next;
                });
              }
            });
            gsap.fromTo(statsRef.current[i],
              { scale: 0.8, opacity: 0, y: 30 },
              { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
            );
          },
          once: true
        });
      });

      // Speaker cards entrance
      speakerCardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            }
          }
        );
      });

    });

    return () => ctx.revert();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    gsap.fromTo(".tab-content",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  };

  const handleCardHover = (card, enter) => {
    gsap.to(card, {
      scale: enter ? 1.03 : 1,
      y: enter ? -5 : 0,
      duration: 0.35,
      ease: "power2.out"
    });
  };

  return (
    <div className="symp-root">
      {/* NAV */}
      <nav ref={navRef} className="symp-nav">
        <div className="symp-nav-logo">
          <span className="logo-mark">◈</span>
          <span>SYMPOSIUM <em>2025</em></span>
        </div>
        <div className="symp-nav-links">
          <a href="#schedule">Schedule</a>
          <a href="#speakers">Speakers</a>
          <a href="#venue">Venue</a>
          <button className="nav-cta">Register Now</button>
        </div>
        <div className="symp-nav-time">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="symp-hero">
        <div className="hero-grid-bg" aria-hidden="true">
          {[...Array(120)].map((_, i) => <span key={i} className="grid-dot" />)}
        </div>

        {/* Orbit decoration */}
        <div className="orbit-wrapper" aria-hidden="true">
          <div ref={orbitRef} className="orbit-ring">
            <span className="orbit-node" style={{ top: 0, left: "50%" }}>◆</span>
            <span className="orbit-node" style={{ bottom: 0, left: "50%" }}>◆</span>
            <span className="orbit-node" style={{ top: "50%", left: 0 }}>◆</span>
            <span className="orbit-node" style={{ top: "50%", right: 0 }}>◆</span>
          </div>
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">March 14–16 · New Delhi, India</p>
          <div ref={titleRef} className="hero-title" aria-label="Ideas Collide Futures Ignite">
            {"IDEAS COLLIDE".split("").map((c, i) => (
              <span key={i} className="char">{c === " " ? "\u00A0" : c}</span>
            ))}
            <br />
            {"FUTURES IGNITE".split("").map((c, i) => (
              <span key={i + 20} className="char accent-char">{c === " " ? "\u00A0" : c}</span>
            ))}
          </div>
          <p className="hero-sub">The premier interdisciplinary conference on technology, science & human progress.</p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Program</button>
            <button className="btn-ghost">Watch Live ◉</button>
          </div>
        </div>

        <div className="hero-badge">
          <span className="badge-live">● LIVE</span>
          <span>Day 1 Underway</span>
        </div>
      </section>

      {/* STATS */}
      <section className="symp-stats">
        {stats.map((s, i) => (
          <div key={s.label} className="stat-card" ref={el => statsRef.current[i] = el}>
            <div className="stat-value">{counters[i]}{s.suffix}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${(counters[i] / s.value) * 100}%` }} /></div>
          </div>
        ))}
      </section>

      {/* DASHBOARD TABS */}
      <section className="symp-dashboard" id="schedule">
        <div className="dashboard-header">
          <h2>Event Dashboard</h2>
          <div className="tab-group">
            {["schedule", "speakers", "map"].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "schedule" && (
            <div className="schedule-grid">
              <div className="schedule-list">
                <h3>Today's Sessions</h3>
                {sessions.map((s, i) => (
                  <div key={i} className={`session-row ${s.live ? "live" : ""}`}>
                    <span className="session-time">{s.time}</span>
                    <div className="session-info">
                      <span className="session-title">{s.title}</span>
                      <span className="session-room">{s.room}</span>
                    </div>
                    {s.live && <span className="live-badge">● LIVE</span>}
                  </div>
                ))}
              </div>
              <div className="schedule-card highlight-card">
                <p className="highlight-eyebrow">NOW LIVE</p>
                <h3>Opening Ceremony</h3>
                <p>Grand Hall · Seats available: 312</p>
                <div className="progress-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="ring-bg" />
                    <circle cx="50" cy="50" r="40" className="ring-fill" strokeDasharray="251" strokeDashoffset="75" />
                  </svg>
                  <span>70%<br/><small>Capacity</small></span>
                </div>
                <button className="btn-primary sm">Join Session →</button>
              </div>
            </div>
          )}

          {activeTab === "speakers" && (
            <div className="speakers-panel">
              {speakers.map((sp, i) => (
                <div
                  key={sp.id}
                  className="speaker-card"
                  ref={el => speakerCardsRef.current[i] = el}
                  onMouseEnter={e => handleCardHover(e.currentTarget, true)}
                  onMouseLeave={e => handleCardHover(e.currentTarget, false)}
                >
                  <div className="speaker-avatar">{sp.avatar}</div>
                  <div className="speaker-info">
                    <h4>{sp.name}</h4>
                    <p>{sp.topic}</p>
                    <div className="speaker-meta">
                      <span className="time-tag">⏱ {sp.time}</span>
                      <span className={`track-tag ${sp.track.toLowerCase()}`}>{sp.track}</span>
                    </div>
                  </div>
                  <div className="speaker-arrow">→</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "map" && (
            <div className="map-panel">
              <div className="venue-map">
                <div className="venue-block grand-hall">Grand Hall</div>
                <div className="venue-block auditorium">Auditorium A</div>
                <div className="venue-block lab">Labs 1–4</div>
                <div className="venue-block lounge">Networking Lounge</div>
                <div className="venue-block main-stage">Main Stage</div>
              </div>
              <div className="venue-legend">
                <h3>Venue: Bharat Mandapam Complex</h3>
                <p>New Delhi · Hall 7 – 12</p>
                <ul>
                  <li><span className="dot teal" />Active Sessions</li>
                  <li><span className="dot gold" />Keynote Areas</li>
                  <li><span className="dot dim" />Networking Zones</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SPEAKERS SECTION */}
      <section className="symp-speakers" id="speakers">
        <h2>Featured Speakers</h2>
        <div className="speakers-strip">
          {speakers.map((sp, i) => (
            <div
              key={sp.id}
              className="speaker-strip-card"
              ref={el => speakerCardsRef.current[i + 10] = el}
              onMouseEnter={e => handleCardHover(e.currentTarget, true)}
              onMouseLeave={e => handleCardHover(e.currentTarget, false)}
            >
              <div className="strip-avatar">{sp.avatar}</div>
              <div className="strip-name">{sp.name}</div>
              <div className="strip-topic">{sp.topic}</div>
              <div className={`strip-track ${sp.track.toLowerCase()}`}>{sp.track}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="symp-footer">
        <div className="footer-inner">
          <div className="footer-logo">◈ SYMPOSIUM 2025</div>
          <p>March 14–16 · New Delhi, India</p>
          <p className="footer-copy">© 2025 Symposium Collective. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}