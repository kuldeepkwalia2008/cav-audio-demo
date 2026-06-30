import { useState, useEffect, useRef } from "react";

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  bg: "#08080D", surf: "#0F0F18", card: "#14141E",
  border: "rgba(255,255,255,0.08)",
  gold: "#C9A227", goldLight: "#E0B840",
  goldGlow: "rgba(201,162,39,0.18)",
  text: "#EDE8DE", muted: "#7B7B98",
  err: "#E05555", ok: "#3DBF7A",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', system-ui, sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 3px; }

  @keyframes wave  { 0%,100%{transform:scaleY(1);}  50%{transform:scaleY(0.15);} }
  @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:translateY(0);} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(201,162,39,0.45);} 70%{box-shadow:0 0 0 14px rgba(201,162,39,0);} }

  .wv   { animation: wave 1.5s ease-in-out infinite; transform-origin: bottom center; }
  .mq   { animation: marquee 34s linear infinite; }
  .fu   { animation: fadeUp 0.65s ease-out both; }

  .btn-gold  { transition: all .2s ease; cursor: pointer; }
  .btn-gold:hover  { filter: brightness(1.13); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,162,39,0.32); }
  .btn-ghost { transition: all .2s ease; cursor: pointer; }
  .btn-ghost:hover { background: rgba(201,162,39,0.1) !important; border-color: #C9A227 !important; }
  .card-h { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
  .card-h:hover { transform: translateY(-5px); border-color: rgba(201,162,39,0.3) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.35); }
  .nav-a  { cursor: pointer; transition: color .2s; }
  .nav-a:hover { color: ${C.gold} !important; }
  input:focus, textarea:focus, select:focus { outline: none; border-color: ${C.gold} !important; box-shadow: 0 0 0 3px rgba(201,162,39,0.12); }
  .pulse-anim { animation: pulse 2.2s ease-out infinite; }

  @media (max-width: 780px) {
    .contact-grid { grid-template-columns: 1fr !important; }
    .nav-desktop  { display: none !important; }
    .hero-btns    { flex-direction: column; align-items: center; }
    .stats-row    { gap: 24px !important; }
  }
`;

// ── Static data ───────────────────────────────────────────────────
const SERVICES = [
  {
    icon: "🎬", title: "Home Theater Systems",
    desc: "Cinematic Dolby Atmos & DTS:X experiences tailored for your room — from intimate 5.1 setups to full immersive 11.4.4 configurations, designed and installed by certified professionals.",
    tags: ["Dolby Atmos", "DTS:X", "4K / 8K Receivers", "Projection", "Acoustic Treatment"],
  },
  {
    icon: "🎵", title: "Hi-Fi Stereo Audio",
    desc: "Audiophile-grade stereo systems that reveal the soul of every recording. Turntables, DACs, integrated amplifiers, and reference loudspeakers — precision-matched to your taste.",
    tags: ["Integrated Amplifiers", "Turntables & Vinyl", "Reference Speakers", "DAC & Streaming"],
  },
  {
    icon: "🏠", title: "Smart Home AV",
    desc: "Whole-home audio and video distribution — every room, any source, one app. Seamlessly integrated with smart home systems for effortless, intuitive control.",
    tags: ["Multi-room Audio", "AV Distribution", "Smart Control", "Professional Wiring"],
  },
];

const WHY = [
  { icon: "🏆", title: "15+ Years of Expertise",   desc: "Serving Delhi's audio enthusiasts since 2009 with unmatched knowledge and passion for sound." },
  { icon: "🎖️", title: "Authorised Dealer",         desc: "Official dealer for 20+ global premium brands — authentic products with genuine manufacturer warranty." },
  { icon: "🔧", title: "Professional Installation", desc: "Certified engineers ensure your system is installed and room-calibrated to absolute perfection." },
  { icon: "💬", title: "Lifetime Support",           desc: "We stand behind every installation with ongoing after-sales service and technical support." },
];

const BRANDS = ["Sony","Denon","Marantz","Klipsch","Monitor Audio","JBL Professional","Yamaha","Bowers & Wilkins","KEF","Focal","Rotel","Cambridge Audio","Naim","QED","Chord"];

const REVIEWS = [
  { name: "Hari Shankar",  info: "Verified Customer",      stars: 5, date: "6 years ago", text: "Excellent speaker sound quality. Visit the showroom — everyone should experience this. The team helped me choose the perfect 7.1 setup for my living room." },
  { name: "Jagat Thakur",  info: "Local Guide · 86 photos", stars: 5, date: "2 years ago", text: "Knowledgeable staff and an incredible showroom. Heard speakers I never thought existed at this level. Bought a complete hi-fi system and couldn't be happier." },
  { name: "Praveen Kumar", info: "Verified Customer",      stars: 5, date: "6 years ago", text: "Best home theater consultation in Delhi. Professional, no-pressure approach with stunning results. My living room is now a proper cinema. Highly recommended!" },
];

const WAVE_HEIGHTS = [20,36,54,68,80,66,46,30,52,74,84,62,42,24,46,70,80,56,34,20,32,60,82,70,46,30,54,74,64,44,24,42,70,84,62,34,20,46,66,80];

const Stars = ({ n = 5 }) => (
  <span>{[...Array(n)].map((_, i) => <span key={i} style={{ color: C.gold, fontSize: "13px" }}>★</span>)}</span>
);

// ── Main component ────────────────────────────────────────────────
export default function App() {
  const [chatOpen, setChatOpen]   = useState(false);
  const [msgs, setMsgs]           = useState([{ role: "assistant", text: "नमस्ते! 🎵 Welcome to CAV Audio India. I'm your personal audio consultant. Tell me about your room size and budget — I'll design the perfect system for you!" }]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm]           = useState({ name: "", email: "", phone: "", service: "Home Theater System", message: "" });
  const [fStatus, setFStatus]     = useState(null);
  const [leads, setLeads]         = useState([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const chatRef = useRef(null);

  // Load persisted leads on mount (from backend API, falls back to localStorage)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
          return;
        }
      } catch {}
      try {
        const raw = localStorage.getItem("cav_enquiries_v1");
        if (raw) setLeads(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, aiLoading]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // ── AI chat handler ─────────────────────────────────────────────
  const handleAI = async () => {
    const q = chatInput.trim();
    if (!q || aiLoading) return;
    const updated = [...msgs, { role: "user", text: q }];
    setMsgs(updated);
    setChatInput("");
    setAiLoading(true);
    try {
      // Calls our own backend (api/chat.js) which holds the Anthropic API key server-side.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.map(m => ({ role: m.role, content: m.text })) }),
      });
      if (!res.ok) throw new Error("Backend error");
      const d = await res.json();
      setMsgs([...updated, { role: "assistant", text: d.reply }]);
    } catch {
      setMsgs([...updated, { role: "assistant", text: "I'm having trouble connecting right now. Please call us at 📞 093123 26292 — we're open till 8 PM!" }]);
    }
    setAiLoading(false);
  };

  // ── Enquiry form submit ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) { setFStatus("missing"); return; }
    setFStatus("loading");
    const lead = { ...form, id: Date.now(), time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setLeads(data.leads || [...leads, lead]);
    } catch {
      // Fallback so the form still "works" if no backend/storage is configured.
      try {
        const all = [...leads, lead];
        localStorage.setItem("cav_enquiries_v1", JSON.stringify(all));
        setLeads(all);
      } catch { setFStatus("error"); return; }
    }
    setForm({ name: "", email: "", phone: "", service: "Home Theater System", message: "" });
    setFStatus("success");
    setTimeout(() => setFStatus(null), 5000);
  };

  // ── Style helpers ───────────────────────────────────────────────
  const inp = (ex = {}) => ({
    background: C.surf, border: `1px solid ${C.border}`, borderRadius: "8px",
    color: C.text, padding: "11px 13px", fontSize: "13.5px", width: "100%",
    fontFamily: "Inter, system-ui, sans-serif", transition: "border-color .2s, box-shadow .2s", ...ex,
  });
  const pf  = (sz, ex = {}) => ({ fontFamily: "'Playfair Display', Georgia, serif", fontSize: sz, fontWeight: 700, color: C.text, ...ex });
  const tag  = (label) => (
    <span key={label} style={{ fontSize: "11px", color: C.gold, background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: "4px", padding: "3px 8px", fontWeight: 500 }}>{label}</span>
  );

  // ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{css}</style>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,13,0.92)", backdropFilter: "blur(18px)", borderBottom: `1px solid ${C.border}`, padding: "0 28px", height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "26px" }}>🔊</span>
          <div>
            <div style={pf("17px", { letterSpacing: "0.01em" })}>CAV Audio India</div>
            <div style={{ fontSize: "9px", color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Home Theater & Hi-Fi Specialists</div>
          </div>
        </div>
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {[["Home","home"],["Services","services"],["Reviews","reviews"],["Contact","contact"]].map(([l,id]) => (
            <span key={id} className="nav-a" onClick={() => scrollTo(id)} style={{ color: C.muted, fontSize: "13px", letterSpacing: "0.04em" }}>{l}</span>
          ))}
          <a href="tel:09312326292" className="btn-gold" style={{ background: `linear-gradient(135deg,${C.gold},#9A7214)`, color: "#000", fontWeight: 600, fontSize: "12.5px", padding: "9px 18px", borderRadius: "7px", textDecoration: "none", letterSpacing: "0.02em" }}>📞 Call Now</a>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section id="home" style={{ minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative", overflow: "hidden" }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: "32%", left: "50%", transform: "translate(-50%,-50%)", width: "640px", height: "460px", background: `radial-gradient(ellipse,${C.goldGlow} 0%,transparent 70%)`, pointerEvents: "none" }} />

        <div className="fu" style={{ animationDelay: "0.08s", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.22)", borderRadius: "20px", padding: "6px 16px", fontSize: "11px", color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
            ✦ New Delhi's Most Trusted Audio Specialists ✦
          </div>
        </div>

        <h1 className="fu" style={{ ...pf("clamp(38px,6.5vw,76px)", { lineHeight: 1.08, fontWeight: 900 }), marginBottom: "18px", maxWidth: "840px", animationDelay: "0.18s" }}>
          Hear Every Detail.<br />
          <span style={{ color: C.gold }}>Feel Every Note.</span>
        </h1>

        <p className="fu" style={{ fontSize: "clamp(14px,2vw,17px)", color: C.muted, maxWidth: "520px", lineHeight: 1.75, marginBottom: "24px", animationDelay: "0.28s" }}>
          Delhi's most trusted home theater &amp; hi-fi audio specialists. Expert consultation, premium brands, flawless installation.
        </p>

        {/* Sound wave */}
        <div className="fu" style={{ marginBottom: "40px", animationDelay: "0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "88px" }}>
            {WAVE_HEIGHTS.map((h, i) => (
              <div key={i} className="wv" style={{ width: "3px", height: `${h}px`, background: `linear-gradient(to top,${C.gold},rgba(201,162,39,0.2))`, borderRadius: "2px", animationDelay: `${(i * 0.04).toFixed(2)}s` }} />
            ))}
          </div>
        </div>

        <div className="fu hero-btns" style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", animationDelay: "0.4s" }}>
          <button className="btn-gold" onClick={() => scrollTo("contact")} style={{ background: `linear-gradient(135deg,${C.gold},#9A7214)`, color: "#000", border: "none", padding: "14px 30px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, fontFamily: "Inter,system-ui" }}>
            Get Free Consultation
          </button>
          <button className="btn-ghost" onClick={() => scrollTo("services")} style={{ background: "transparent", color: C.text, border: `1px solid ${C.border}`, padding: "14px 30px", borderRadius: "8px", fontSize: "15px", fontFamily: "Inter,system-ui" }}>
            Explore Services →
          </button>
        </div>

        {/* Stats */}
        <div className="fu stats-row" style={{ marginTop: "60px", display: "flex", gap: "48px", flexWrap: "wrap", justifyContent: "center", animationDelay: "0.5s" }}>
          {[["15+","Years Experience"],["500+","Installations"],["20+","Premium Brands"],["5.0 ★","Google Rating"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={pf("28px", { color: C.gold })}>{n}</div>
              <div style={{ fontSize: "11px", color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "3px" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ═════════════════════════════════════════════ */}
      <section id="services" style={{ padding: "80px 28px", maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ fontSize: "11px", color: C.gold, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, marginBottom: "10px" }}>What We Do</div>
          <h2 style={pf("clamp(26px,4vw,42px)")}>Complete AV Solutions</h2>
          <p style={{ color: C.muted, marginTop: "12px", fontSize: "15px" }}>End-to-end expertise from consultation to calibration</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
          {SERVICES.map(s => (
            <div key={s.title} className="card-h" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "30px 26px" }}>
              <div style={{ fontSize: "38px", marginBottom: "16px" }}>{s.icon}</div>
              <h3 style={{ ...pf("19px"), marginBottom: "12px" }}>{s.title}</h3>
              <p style={{ fontSize: "13.5px", color: C.muted, lineHeight: 1.72, marginBottom: "20px" }}>{s.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{s.tags.map(tag)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHY US ═══════════════════════════════════════════════ */}
      <section style={{ padding: "68px 28px", background: C.surf, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "11px", color: C.gold, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, marginBottom: "10px" }}>Why CAV Audio</div>
            <h2 style={pf("clamp(26px,4vw,42px)")}>The Difference is in the Detail</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px" }}>
            {WHY.map(w => (
              <div key={w.title} className="card-h" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "24px 22px" }}>
                <div style={{ fontSize: "34px", marginBottom: "12px" }}>{w.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: C.text, marginBottom: "8px" }}>{w.title}</h3>
                <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.65 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BRANDS MARQUEE ═══════════════════════════════════════ */}
      <section style={{ padding: "42px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div style={{ fontSize: "10px", color: C.muted, textTransform: "uppercase", letterSpacing: "0.2em" }}>Authorised Dealer For</div>
        </div>
        <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right,transparent,black 8%,black 92%,transparent)" }}>
          <div className="mq" style={{ display: "flex", gap: "56px", width: "max-content" }}>
            {[...BRANDS,...BRANDS].map((b, i) => (
              <span key={i} style={{ fontSize: "12px", fontWeight: 600, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", transition: "color .2s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══════════════════════════════════════════════ */}
      <section id="reviews" style={{ padding: "80px 28px", maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", color: C.gold, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, marginBottom: "10px" }}>Customer Stories</div>
          <h2 style={pf("clamp(26px,4vw,42px)")}>What Our Customers Say</h2>
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <Stars n={5} />
            <span style={{ color: C.muted, fontSize: "13px" }}>5.0 on Google · 3 Reviews</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
          {REVIEWS.map(r => (
            <div key={r.name} className="card-h" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "26px 24px" }}>
              <Stars n={r.stars} />
              <p style={{ color: C.text, fontSize: "13.5px", lineHeight: 1.75, margin: "16px 0", fontStyle: "italic" }}>"{r.text}"</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>{r.name}</div>
                  <div style={{ fontSize: "11px", color: C.muted }}>{r.info}</div>
                </div>
                <div style={{ fontSize: "11px", color: C.muted }}>{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "80px 28px", background: C.surf, borderTop: `1px solid ${C.border}` }}>
        <div className="contact-grid" style={{ maxWidth: "1120px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>

          {/* Left: info */}
          <div>
            <div style={{ fontSize: "11px", color: C.gold, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, marginBottom: "12px" }}>Get In Touch</div>
            <h2 style={{ ...pf("clamp(26px,4vw,40px)", { lineHeight: 1.2 }), marginBottom: "18px" }}>
              Visit Our Showroom.<br />Experience the Difference.
            </h2>
            <p style={{ color: C.muted, fontSize: "14.5px", lineHeight: 1.72, marginBottom: "32px" }}>
              Come hear the difference in person. Our demonstration room lets you experience the full capability of every system — in-room, at volume — before you commit.
            </p>
            {[
              { icon: "📍", label: "Address", val: "A-119-120, Block C, Sharda Puri,\nRamesh Nagar, New Delhi – 110015" },
              { icon: "📞", label: "Phone",   val: "093123 26292" },
              { icon: "🕐", label: "Hours",   val: "Monday – Saturday: 10:00 AM – 8:00 PM" },
              { icon: "🌐", label: "Website", val: "cav-audio.com" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", flexShrink: 0, background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px" }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "10px", color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", color: C.text, lineHeight: 1.55, whiteSpace: "pre-line" }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div style={{ background: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "36px" }}>
            <h3 style={{ ...pf("22px"), marginBottom: "6px" }}>Send an Enquiry</h3>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "24px" }}>Our team will call you within 24 hours.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: C.muted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={inp()} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: C.muted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone *</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" style={inp()} />
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "11px", color: C.muted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="your@email.com" style={inp()} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "11px", color: C.muted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>I'm Interested In</label>
              <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={{ ...inp(), colorScheme: "dark" }}>
                {["Home Theater System","Hi-Fi Stereo Setup","Smart Home Audio","Multi-room Audio","Custom AV Installation","General Enquiry / Advice"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "11px", color: C.muted, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Room size, budget, or specific requirements…" rows={4} style={{ ...inp(), resize: "vertical", minHeight: "96px" }} />
            </div>

            {fStatus === "missing"  && <div style={{ background: "rgba(224,85,85,.1)", border: "1px solid rgba(224,85,85,.25)", borderRadius: "7px", padding: "10px 14px", fontSize: "13px", color: C.err, marginBottom: "14px" }}>Please enter your name and phone number.</div>}
            {fStatus === "success"  && <div style={{ background: "rgba(61,191,122,.1)", border: "1px solid rgba(61,191,122,.25)", borderRadius: "7px", padding: "10px 14px", fontSize: "13px", color: C.ok,  marginBottom: "14px" }}>✅ Enquiry received! We'll call you within 24 hours.</div>}
            {fStatus === "error"    && <div style={{ background: "rgba(224,85,85,.1)", border: "1px solid rgba(224,85,85,.25)", borderRadius: "7px", padding: "10px 14px", fontSize: "13px", color: C.err, marginBottom: "14px" }}>Something went wrong. Please call 093123 26292 directly.</div>}

            <button className="btn-gold" onClick={handleSubmit} disabled={fStatus === "loading"} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg,${C.gold},#9A7214)`, color: "#000", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, fontFamily: "Inter,system-ui", cursor: fStatus === "loading" ? "wait" : "pointer", opacity: fStatus === "loading" ? 0.75 : 1 }}>
              {fStatus === "loading" ? "Sending…" : "Send Enquiry →"}
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ padding: "28px 28px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🔊</span>
            <div>
              <div style={pf("15px")}>CAV Audio India Pvt. Ltd.</div>
              <div style={{ fontSize: "11px", color: C.muted }}>Ramesh Nagar, New Delhi – 110015</div>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: C.muted, textAlign: "center" }}>
            © {new Date().getFullYear()} CAV Audio India Pvt. Ltd. · All rights reserved
            <br />
            <span onClick={() => setAdminOpen(true)} style={{ color: C.gold, cursor: "pointer", fontSize: "11px" }}>Admin Dashboard</span>
          </div>
          <a href="tel:09312326292" style={{ color: C.gold, textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>📞 093123 26292</a>
        </div>
      </footer>

      {/* ══ FLOATING AI CHAT ══════════════════════════════════════ */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 300 }}>
        {chatOpen ? (
          <div style={{ width: "350px", height: "500px", background: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, boxShadow: "0 24px 72px rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Chat header */}
            <div style={{ padding: "14px 16px", background: `linear-gradient(135deg,${C.gold},#9A7214)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🎵</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#000" }}>CAV Audio Assistant</div>
                  <div style={{ fontSize: "10.5px", color: "rgba(0,0,0,0.55)" }}>AI-powered · Ask anything</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: "rgba(0,0,0,0.15)", border: "none", color: "#000", width: "26px", height: "26px", borderRadius: "50%", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            {/* Messages */}
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "86%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? C.gold : C.surf, color: m.role === "user" ? "#000" : C.text, fontSize: "12.5px", lineHeight: 1.65 }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ background: C.surf, borderRadius: "4px 14px 14px 14px", padding: "12px 14px", display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0,1,2].map(n => <div key={n} className="wv" style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.gold, animationDelay: `${n*0.18}s` }} />)}
                  </div>
                </div>
              )}
            </div>
            {/* Input */}
            <div style={{ padding: "12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: "8px" }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAI()} placeholder="Ask about products, pricing…" style={{ flex: 1, background: C.surf, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "10px 12px", color: C.text, fontSize: "12.5px", fontFamily: "Inter,system-ui" }} />
              <button onClick={handleAI} disabled={aiLoading} className="btn-gold" style={{ background: `linear-gradient(135deg,${C.gold},#9A7214)`, border: "none", borderRadius: "8px", padding: "10px 14px", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}>→</button>
            </div>
          </div>
        ) : (
          <button className="pulse-anim btn-gold" onClick={() => setChatOpen(true)} style={{ width: "58px", height: "58px", borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},#9A7214)`, border: "none", cursor: "pointer", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 28px rgba(201,162,39,0.32)` }}>
            🎵
          </button>
        )}
      </div>

      {/* ══ ADMIN PANEL MODAL ════════════════════════════════════ */}
      {adminOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) { setAdminOpen(false); setAdminAuth(false); setAdminInput(""); } }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, width: "100%", maxWidth: "820px", maxHeight: "88vh", overflow: "auto" }}>
            <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={pf("20px")}>Admin Dashboard — Enquiries</h3>
              <button onClick={() => { setAdminOpen(false); setAdminAuth(false); setAdminInput(""); }} style={{ background: "none", border: "none", color: C.muted, fontSize: "22px", cursor: "pointer" }}>✕</button>
            </div>

            {!adminAuth ? (
              <div style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>🔐</div>
                <p style={{ color: C.muted, marginBottom: "20px", fontSize: "14px" }}>Enter password to access leads</p>
                <input type="password" value={adminInput} onChange={e => setAdminInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (adminInput === "cavaudio2024" ? setAdminAuth(true) : alert("Incorrect password"))} placeholder="Admin password" style={{ ...inp({ maxWidth: "260px", textAlign: "center", display: "block", margin: "0 auto" }) }} />
                <br />
                <button className="btn-gold" onClick={() => adminInput === "cavaudio2024" ? setAdminAuth(true) : alert("Incorrect password")} style={{ background: `linear-gradient(135deg,${C.gold},#9A7214)`, color: "#000", border: "none", padding: "10px 26px", borderRadius: "7px", fontWeight: 600, fontFamily: "Inter", cursor: "pointer" }}>Unlock</button>
                <p style={{ color: C.muted, fontSize: "11px", marginTop: "14px" }}>Default password: cavaudio2024</p>
              </div>
            ) : (
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ color: C.muted, fontSize: "13px" }}><span style={{ color: C.gold, fontWeight: 600 }}>{leads.length}</span> enquiries received</span>
                  <button onClick={async () => {
                    if (!confirm("Delete all leads? This cannot be undone.")) return;
                    try {
                      const res = await fetch("/api/leads", { method: "DELETE" });
                      if (!res.ok) throw new Error();
                    } catch {}
                    try { localStorage.removeItem("cav_enquiries_v1"); } catch {}
                    setLeads([]);
                  }}
                    style={{ background: "rgba(224,85,85,.08)", border: "1px solid rgba(224,85,85,.22)", color: C.err, padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontFamily: "Inter" }}>Clear All</button>
                </div>
                {leads.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: C.muted, fontSize: "14px" }}>
                    <div style={{ fontSize: "42px", marginBottom: "12px" }}>📭</div>
                    No enquiries yet. They'll appear here once customers submit the form.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[...leads].reverse().map(l => (
                      <div key={l.id} style={{ background: C.surf, borderRadius: "10px", border: `1px solid ${C.border}`, padding: "16px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, color: C.text, fontSize: "15px" }}>{l.name}</span>
                            <span style={{ fontSize: "11px", color: C.gold, background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", padding: "2px 8px", borderRadius: "4px" }}>{l.service}</span>
                          </div>
                          <span style={{ fontSize: "11px", color: C.muted }}>{l.time}</span>
                        </div>
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                          {l.phone && <span style={{ fontSize: "13px", color: C.muted }}>📞 {l.phone}</span>}
                          {l.email && <span style={{ fontSize: "13px", color: C.muted }}>✉️ {l.email}</span>}
                        </div>
                        {l.message && <p style={{ fontSize: "12.5px", color: C.muted, marginTop: "8px", fontStyle: "italic", lineHeight: 1.6 }}>"{l.message}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
