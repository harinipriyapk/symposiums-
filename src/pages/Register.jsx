import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Register.css";

const EVENTS = [
  "AI & Machine Learning Workshop",
  "24-Hour National Hackathon",
  "Paper Presentation",
  "Robotics Challenge",
  "UI/UX Design Contest",
];

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Electrical Engineering",
  "Other",
];

const STEPS = ["Personal", "Academic", "Event", "Confirm"];

const validateStep = (step, form) => {
  const errs = {};
  if (step === 0) {
    if (!form.name.trim())                errs.name  = "Full name is required.";
    else if (form.name.trim().length < 3) errs.name  = "Name must be at least 3 characters.";
    if (!form.email.trim())               errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                          errs.email = "Enter a valid email (e.g. you@gmail.com).";
    if (!form.phone.trim())               errs.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, "")))
                                          errs.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  if (step === 1) {
    if (!form.college.trim()) errs.college    = "College name is required.";
    if (!form.department)     errs.department = "Please select your department.";
    if (!form.year)           errs.year       = "Please select your year of study.";
  }
  if (step === 2) {
    if (!form.event) errs.event = "Please select an event to register for.";
  }
  return errs;
};

function Register() {
  const [step, setStep]           = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [apiError, setApiError]   = useState("");
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [form, setForm]           = useState({
    name: "", email: "", phone: "",
    college: "", department: "", year: "",
    event: "", teamName: "", teamSize: "1", experience: "",
  });

  const containerRef = useRef(null);
  const cardRef      = useRef(null);
  const titleRef     = useRef(null);
  const progressRef  = useRef([]);
  const stepPanelRef = useRef(null);
  const glowRef      = useRef(null);
  const particlesRef = useRef([]);
  const btnSubmitRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, { opacity: 0, duration: 0.5 });
      gsap.from(cardRef.current, {
        y: -60, opacity: 0, scale: 0.93,
        duration: 0.85, ease: "back.out(1.5)", delay: 0.1,
      });
      gsap.from(titleRef.current, { opacity: 0, y: 20, duration: 0.6, delay: 0.5 });
      gsap.to(glowRef.current, {
        opacity: 0.65, scale: 1.2, duration: 3,
        repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      particlesRef.current.forEach((p, i) => {
        gsap.to(p, {
          y: `-=${35 + i * 8}`, x: `+=${Math.sin(i) * 18}`, opacity: 0,
          duration: 2.8 + i * 0.4, repeat: -1, delay: i * 0.35, ease: "power1.out",
        });
      });
      gsap.from(progressRef.current, {
        scale: 0, opacity: 0, stagger: 0.1, duration: 0.4, delay: 0.7, ease: "back.out(2)",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const shakePanel = () => {
    gsap.to(stepPanelRef.current, {
      x: -10, duration: 0.06, repeat: 5, yoyo: true, ease: "power2.inOut",
      onComplete: () => gsap.set(stepPanelRef.current, { x: 0 }),
    });
    gsap.to(cardRef.current, {
      boxShadow: "0 0 35px rgba(239,68,68,0.35)",
      borderColor: "rgba(239,68,68,0.4)",
      duration: 0.3, yoyo: true, repeat: 1,
    });
  };

  const shakeField = (name) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (!el) return;
    gsap.to(el, {
      x: -6, duration: 0.05, repeat: 4, yoyo: true, ease: "power2.inOut",
      onComplete: () => gsap.set(el, { x: 0 }),
    });
  };

  const animateStep = (dir = 1) => {
    gsap.fromTo(stepPanelRef.current,
      { x: dir * 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
    );
  };

  const nextStep = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched(t => ({
        ...t,
        ...Object.keys(errs).reduce((a, k) => ({ ...a, [k]: true }), {}),
      }));
      shakePanel();
      shakeField(Object.keys(errs)[0]);
      return;
    }
    setErrors({});
    if (step < STEPS.length - 1) {
      gsap.to(stepPanelRef.current, {
        x: -60, opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => { setStep(s => s + 1); animateStep(1); },
      });
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setErrors({});
      setApiError("");
      gsap.to(stepPanelRef.current, {
        x: 60, opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => { setStep(s => s - 1); animateStep(-1); },
      });
    }
  };

  /* ── Submit → POST to Express backend ──────────────────────── */
  const handleSubmit = async () => {
    setSending(true);
    setApiError("");
    gsap.to(btnSubmitRef.current, { scale: 0.96, duration: 0.15, yoyo: true, repeat: 1 });

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Server error. Please try again.");

      // Success — flash card then show success screen
      gsap.to(cardRef.current, {
        boxShadow: "0 0 60px rgba(0,245,196,0.5)",
        borderColor: "rgba(0,245,196,0.6)",
        duration: 0.4, yoyo: true, repeat: 1,
        onComplete: () => setSubmitted(true),
      });
    } catch (err) {
      setApiError(err.message);
      setSending(false);
      gsap.to(cardRef.current, {
        boxShadow: "0 0 35px rgba(239,68,68,0.35)",
        borderColor: "rgba(239,68,68,0.4)",
        duration: 0.3, yoyo: true, repeat: 1,
      });
      shakePanel();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      const errs = validateStep(step, updated);
      setErrors(prev => ({ ...prev, [name]: errs[name] || undefined }));
    }
  };

  const handleBlurValidate = (e) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    const errs = validateStep(step, form);
    setErrors(prev => ({ ...prev, [name]: errs[name] || undefined }));
    const glow = e.target.parentElement?.querySelector(".field-glow");
    if (glow) gsap.to(glow, { scaleX: 0, opacity: 0, duration: 0.3 });
  };

  const handleFocusGlow = (e) => {
    const glow = e.target.parentElement?.querySelector(".field-glow");
    if (glow) gsap.to(glow, { scaleX: 1, opacity: 1, duration: 0.35 });
  };

  const btnHover = (e) =>
    gsap.to(e.currentTarget, { scale: 1.05, y: -2, duration: 0.2, ease: "power2.out" });
  const btnLeave = (e) =>
    gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.2 });

  const fieldClass = (name) =>
    `field-wrap${errors[name] && touched[name] ? " has-error" : ""}${
      !errors[name] && touched[name] && form[name] ? " has-success" : ""
    }`;

  /* ── Success screen ─────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="reg-container" ref={containerRef}>
        <div className="reg-glow" ref={glowRef} />
        <div className="reg-grid" />
        <div className="reg-success">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Registration Complete!</h2>
          <p className="success-sub">
            You're registered for <strong>{form.event}</strong>
          </p>
          <div className="success-details">
            <div className="sd-row"><span>Name</span>    <span>{form.name}</span></div>
            <div className="sd-row"><span>Email</span>   <span>{form.email}</span></div>
            <div className="sd-row"><span>College</span> <span>{form.college}</span></div>
            <div className="sd-row"><span>Event</span>   <span>{form.event}</span></div>
            {form.teamName && <div className="sd-row"><span>Team</span><span>{form.teamName}</span></div>}
          </div>
          <p className="success-note">
            📧 A confirmation email has been sent to <strong>{form.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  /* ── Main ───────────────────────────────────────────────────── */
  return (
    <div className="reg-container" ref={containerRef}>
      <div className="reg-glow"     ref={glowRef} />
      <div className="reg-grid"     aria-hidden="true" />
      <div className="reg-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="r-particle"
            ref={el => (particlesRef.current[i] = el)}
            style={{ left: `${6 + i * 8}%`, top: `${55 + (i % 5) * 9}%` }}
          />
        ))}
      </div>

      <div className="reg-card" ref={cardRef}>
        <div className="card-accent-bar" />

        <div className="reg-header" ref={titleRef}>
          <span className="reg-eyebrow">
            <span className="eyeline" />Symposium 2025 Registration<span className="eyeline" />
          </span>
          <h1 className="reg-title">Join the <span className="accent">Event</span></h1>
        </div>

        <div className="step-progress">
          {STEPS.map((label, i) => (
            <div key={i} className={`step-item ${i <= step ? "active" : ""} ${i === step ? "current" : ""}`}>
              <div className="step-dot" ref={el => (progressRef.current[i] = el)}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && (
                <div className={`step-connector ${i < step ? "filled" : ""}`} />
              )}
            </div>
          ))}
        </div>

        <div className="step-panel" ref={stepPanelRef}>

          {/* STEP 0 */}
          {step === 0 && (
            <div className="fields">
              <p className="step-heading">Personal Details</p>
              <div className="field-group">
                <label>Full Name *</label>
                <div className={fieldClass("name")}>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name"
                    onFocus={handleFocusGlow} onBlur={handleBlurValidate} />
                  <span className="field-status-icon">
                    {touched.name && !errors.name && form.name ? "✓" : ""}
                    {touched.name && errors.name ? "✕" : ""}
                  </span>
                  <div className="field-glow" />
                </div>
                {touched.name && errors.name && <span className="field-error">⚠ {errors.name}</span>}
              </div>

              <div className="field-group">
                <label>Email Address *</label>
                <div className={fieldClass("email")}>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com"
                    onFocus={handleFocusGlow} onBlur={handleBlurValidate} />
                  <span className="field-status-icon">
                    {touched.email && !errors.email && form.email ? "✓" : ""}
                    {touched.email && errors.email ? "✕" : ""}
                  </span>
                  <div className="field-glow" />
                </div>
                {touched.email && errors.email
                  ? <span className="field-error">⚠ {errors.email}</span>
                  : <small className="field-note">📧 Confirmation will be sent to this email.</small>
                }
              </div>

              <div className="field-group">
                <label>Phone Number *</label>
                <div className={fieldClass("phone")}>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="98765 43210"
                    onFocus={handleFocusGlow} onBlur={handleBlurValidate} />
                  <span className="field-status-icon">
                    {touched.phone && !errors.phone && form.phone ? "✓" : ""}
                    {touched.phone && errors.phone ? "✕" : ""}
                  </span>
                  <div className="field-glow" />
                </div>
                {touched.phone && errors.phone
                  ? <span className="field-error">⚠ {errors.phone}</span>
                  : <small className="field-note">10-digit Indian mobile number.</small>
                }
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="fields">
              <p className="step-heading">Academic Details</p>
              <div className="field-group">
                <label>College / Institution *</label>
                <div className={fieldClass("college")}>
                  <input name="college" value={form.college} onChange={handleChange}
                    placeholder="Your college name"
                    onFocus={handleFocusGlow} onBlur={handleBlurValidate} />
                  <span className="field-status-icon">
                    {touched.college && !errors.college && form.college ? "✓" : ""}
                    {touched.college && errors.college ? "✕" : ""}
                  </span>
                  <div className="field-glow" />
                </div>
                {touched.college && errors.college && <span className="field-error">⚠ {errors.college}</span>}
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Department *</label>
                  <div className={fieldClass("department")}>
                    <select name="department" value={form.department} onChange={handleChange}
                      onFocus={handleFocusGlow} onBlur={handleBlurValidate}>
                      <option value="">Select dept.</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="field-glow" />
                  </div>
                  {touched.department && errors.department && <span className="field-error">⚠ {errors.department}</span>}
                </div>
                <div className="field-group">
                  <label>Year of Study *</label>
                  <div className={fieldClass("year")}>
                    <select name="year" value={form.year} onChange={handleChange}
                      onFocus={handleFocusGlow} onBlur={handleBlurValidate}>
                      <option value="">Year</option>
                      {["1st Year","2nd Year","3rd Year","4th Year"].map(y =>
                        <option key={y} value={y}>{y}</option>
                      )}
                    </select>
                    <div className="field-glow" />
                  </div>
                  {touched.year && errors.year && <span className="field-error">⚠ {errors.year}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="fields">
              <p className="step-heading">Choose Your Event</p>
              <div className="event-picks">
                {EVENTS.map((ev) => (
                  <div key={ev}
                    className={`event-pick ${form.event === ev ? "selected" : ""}`}
                    onClick={() => {
                      setForm(f => ({ ...f, event: ev }));
                      setErrors(e => ({ ...e, event: undefined }));
                      setTouched(t => ({ ...t, event: true }));
                    }}>
                    <span className="pick-dot" />{ev}
                  </div>
                ))}
              </div>
              {touched.event && errors.event && (
                <span className="field-error" style={{ marginTop:"10px", display:"block" }}>
                  ⚠ {errors.event}
                </span>
              )}
              <div className="field-row" style={{ marginTop:"20px" }}>
                <div className="field-group">
                  <label>Team Name <span className="opt">(optional)</span></label>
                  <div className="field-wrap">
                    <input name="teamName" value={form.teamName} onChange={handleChange}
                      placeholder="e.g. ByteForce"
                      onFocus={handleFocusGlow} onBlur={handleBlurValidate} />
                    <div className="field-glow" />
                  </div>
                </div>
                <div className="field-group">
                  <label>Team Size</label>
                  <div className="field-wrap">
                    <select name="teamSize" value={form.teamSize} onChange={handleChange}
                      onFocus={handleFocusGlow} onBlur={handleBlurValidate}>
                      {["1","2","3","4","5"].map(n =>
                        <option key={n} value={n}>{n} {n==="1" ? "member" : "members"}</option>
                      )}
                    </select>
                    <div className="field-glow" />
                  </div>
                </div>
              </div>
              <div className="field-group">
                <label>Prior Experience <span className="opt">(optional)</span></label>
                <div className="field-wrap">
                  <textarea name="experience" value={form.experience} onChange={handleChange}
                    placeholder="Brief background relevant to the event..."
                    rows={3} onFocus={handleFocusGlow} onBlur={handleBlurValidate} />
                  <div className="field-glow" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="fields">
              <p className="step-heading">Review & Confirm</p>
              <div className="confirm-grid">
                {[
                  ["Full Name",  form.name],
                  ["Email",      form.email],
                  ["Phone",      form.phone],
                  ["College",    form.college],
                  ["Department", form.department],
                  ["Year",       form.year],
                  ["Event",      form.event],
                  ["Team Name",  form.teamName || "—"],
                  ["Team Size",  `${form.teamSize} member(s)`],
                ].map(([k, v]) => (
                  <div key={k} className="confirm-row">
                    <span className="confirm-key">{k}</span>
                    <span className="confirm-val">{v}</span>
                  </div>
                ))}
              </div>
              {apiError && <div className="api-error-banner">❌ {apiError}</div>}
              <p className="confirm-note">
                ✦ By submitting you agree to the event rules and code of conduct.
                A confirmation email will be sent to <strong>{form.email}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="step-nav">
          {step > 0 && (
            <button className="nav-btn back-btn" onClick={prevStep}
              onMouseEnter={btnHover} onMouseLeave={btnLeave} disabled={sending}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="nav-btn next-btn" onClick={nextStep}
              onMouseEnter={btnHover} onMouseLeave={btnLeave}>
              Next →
            </button>
          ) : (
            <button className="nav-btn submit-btn" ref={btnSubmitRef}
              onClick={handleSubmit}
              onMouseEnter={btnHover} onMouseLeave={btnLeave}
              disabled={sending}>
              {sending
                ? <span className="btn-loading">
                    <span className="dot"/><span className="dot"/><span className="dot"/>
                  </span>
                : "Submit Registration ✦"
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
