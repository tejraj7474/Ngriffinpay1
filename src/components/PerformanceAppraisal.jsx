// PerformanceAppraisal.jsx
// NGriffinpay — Product inner page: "Performance & Appraisal Management"
// Section 1: Hero banner (live performance app on the left, content on the right)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./PerformanceAppraisal.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { title: "Set Clear Goals", desc: "Define and align individual goals with organizational objectives.", icon: "target" },
  { title: "Continuous Feedback", desc: "Encourage a feedback-driven culture with real-time insights.", icon: "chat" },
  { title: "Automated Reviews", desc: "Schedule, track, and manage performance reviews effortlessly.", icon: "calendar" },
  { title: "Data-Driven Insights", desc: "Use analytics to recognize top talent and support growth plans.", icon: "chart" },
];

const STAGE_TIME = 5.5;

// Radar chart: skills + scores per stage (out of 5)
const SKILLS = ["Delivery", "Quality", "Teamwork", "Leadership", "Innovation"];
const RADAR_STAGES = [
  [3.6, 3.4, 3.8, 2.8, 3.0],
  [3.9, 3.7, 4.4, 3.2, 3.4],
  [4.2, 4.0, 4.5, 3.6, 3.8],
  [4.6, 4.3, 4.7, 4.0, 4.2],
];
const RATING_STAGES = [3.3, 3.7, 4.0, 4.4];
const RC = 70; // radar centre
const RR = 54; // radar radius

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const radarPoint = (i, v) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / SKILLS.length;
  const r = (v / 5) * RR;
  return [RC + r * Math.cos(a), RC + r * Math.sin(a)];
};
const radarPath = (vals) => vals.map((v, i) => radarPoint(i, v).map((n) => n.toFixed(1)).join(",")).join(" ");

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 14 }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
  };
  switch (name) {
    case "target":
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>);
    case "chat":
      return (<svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
    case "calendar":
      return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
    case "chart":
      return (<svg {...p}><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>);
    case "check":
      return (<svg {...p}><path d="M20 6 9 17l-5-5" /></svg>);
    case "arrow":
      return (<svg {...p}><path d="M5 12h14M13 5l7 7-7 7" /></svg>);
    case "play":
      return (<svg {...p}><polygon points="6 4 20 12 6 20 6 4" /></svg>);
    case "star":
      return (<svg {...p} fill="currentColor" stroke="none"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>);
    case "bell":
      return (<svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>);
    case "trend":
      return (<svg {...p}><path d="m22 7-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></svg>);
    case "award":
      return (<svg {...p}><circle cx="12" cy="8" r="6" /><path d="M15.5 13 17 22l-5-3-5 3 1.5-9" /></svg>);
    case "flag":
      return (<svg {...p}><path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5" /></svg>);
    case "users":
      return (<svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "sparkles":
      return (<svg {...p}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /></svg>);
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Stage panels                                                        */
/* ------------------------------------------------------------------ */

function usePanel(build, delay) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay });
      tl.from(q(".js-in"), { y: 14, opacity: 0, stagger: 0.07, duration: 0.4, ease: "power3.out" });
      build(tl, q);
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// 1 — Set Clear Goals: goal alignment tree
const GOALS = [
  { t: "Ship payroll mobile app v2", p: 72 },
  { t: "Cut bug backlog by 40%", p: 55 },
  { t: "Mentor 2 junior developers", p: 90 },
];

function GoalsPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(q(".pam-okr"), { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.2);
    tl.fromTo(q(".pam-link"), { scaleY: 0 }, { scaleY: 1, duration: 0.3 }, 0.6);
    tl.fromTo(q(".pam-team"), { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, 0.8);
    tl.fromTo(q(".pam-branch"), { scaleX: 0 }, { scaleX: 1, duration: 0.35 }, 1.1);
    q(".pam-goal").forEach((g, i) => {
      const at = 1.3 + i * 0.25;
      tl.fromTo(g, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" }, at);
      tl.fromTo(g.querySelector(".pam-gbar i"), { scaleX: 0 }, { scaleX: GOALS[i].p / 100, duration: 0.9, ease: "power2.out" }, at + 0.25);
      const el = g.querySelector(".js-gp");
      const o = { v: 0 };
      tl.to(o, { v: GOALS[i].p, duration: 0.9, ease: "power2.out", onUpdate: () => el && (el.textContent = `${Math.round(o.v)}%`) }, at + 0.25);
    });
    tl.fromTo(q(".pam-aligned"), { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.5)" }, 2.6);
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-okr">
        <span className="pam-okr-ic"><Icon name="flag" size={12} /></span>
        <div><small>Company objective · FY26</small><b>Grow revenue 30% with a better product</b></div>
      </div>
      <span className="pam-link" />
      <div className="pam-team">
        <Icon name="users" size={11} /> Engineering team goal: <b>Launch mobile-first experience</b>
      </div>
      <span className="pam-branch" />
      <div className="pam-goals">
        {GOALS.map((g) => (
          <div className="pam-goal" key={g.t}>
            <span className="pam-goal-ic"><Icon name="target" size={11} /></span>
            <b>{g.t}</b>
            <div className="pam-gfoot">
              <span className="pam-gbar"><i /></span>
              <em className="js-gp">0%</em>
            </div>
          </div>
        ))}
      </div>
      <span className="pam-aligned"><Icon name="check" size={10} /> 100% of goals aligned to company objectives</span>
    </div>
  );
}

// 2 — Continuous Feedback: live feedback stream
const FEEDBACK = [
  { from: "Rahul M.", role: "Manager", av: "RM", text: "Great ownership on the payroll release 👏", tag: "Ownership" },
  { from: "Anita R.", role: "Peer", av: "AR", text: "Super helpful in code reviews this sprint.", tag: "Teamwork" },
  { from: "Deepa N.", role: "Mentee", av: "DN", text: "Thanks for the patient onboarding sessions 🙌", tag: "Mentoring" },
];

function FeedbackPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".pam-fb").forEach((f, i) => {
      const at = 0.3 + i * 0.6;
      tl.fromTo(f, { x: i % 2 ? 30 : -30, autoAlpha: 0, scale: 0.95 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, at);
      tl.fromTo(f.querySelector(".pam-fb-tag"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, at + 0.35);
    });
    tl.fromTo(q(".pam-senti i"), { scaleX: 0 }, { scaleX: 0.86, duration: 1, ease: "power2.out" }, 2);
    const el = q(".js-senti")[0];
    const o = { v: 0 };
    tl.to(o, { v: 86, duration: 1, ease: "power2.out", onUpdate: () => el && (el.textContent = Math.round(o.v)) }, 2);
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-head js-in"><Icon name="chat" size={12} /> Live feedback · this month <em className="pam-live"><i /> Live</em></div>
      <div className="pam-fbs">
        {FEEDBACK.map((f, i) => (
          <div className={`pam-fb ${i % 2 ? "right" : ""}`} key={f.from}>
            <span className="pam-av sm">{f.av}</span>
            <div>
              <small><b>{f.from}</b> · {f.role}</small>
              <p>{f.text}</p>
              <span className="pam-fb-tag">#{f.tag}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pam-sentiment js-in">
        <span>Feedback sentiment</span>
        <span className="pam-senti"><i /></span>
        <b><span className="js-senti">0</span>% positive</b>
      </div>
    </div>
  );
}

// 3 — Automated Reviews: review cycle pipeline
const CYCLE = [
  { t: "Self review", s: "Submitted 2 Nov" },
  { t: "Manager review", s: "Submitted 6 Nov" },
  { t: "Calibration", s: "In progress" },
  { t: "Final rating", s: "Due 15 Nov" },
];

function ReviewsPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(q(".pam-cyc-fill"), { scaleX: 0 }, { scaleX: 0.62, duration: 1.6, ease: "power1.inOut" }, 0.4);
    q(".pam-step").forEach((s, i) => {
      if (i < 2) {
        tl.fromTo(s.querySelector(".pam-step-dot"), { backgroundColor: "#ffffff", color: "#94a3b8" }, { backgroundColor: "#10b981", color: "#ffffff", duration: 0.25 }, 0.6 + i * 0.5);
      } else if (i === 2) {
        tl.fromTo(s.querySelector(".pam-step-dot"), { backgroundColor: "#ffffff", color: "#94a3b8" }, { backgroundColor: "#1d6fd8", color: "#ffffff", duration: 0.25 }, 1.7);
      }
    });
    tl.fromTo(q(".pam-remind"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" }, 2.1);
    const el = q(".js-done")[0];
    const o = { v: 0 };
    tl.fromTo(q(".pam-done-bar i"), { scaleX: 0 }, { scaleX: 0.78, duration: 1, ease: "power2.out" }, 2.3);
    tl.to(o, { v: 78, duration: 1, ease: "power2.out", onUpdate: () => el && (el.textContent = Math.round(o.v)) }, 2.3);
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-head js-in"><Icon name="calendar" size={12} /> Review cycle · H2 FY26</div>
      <div className="pam-cycle js-in">
        <span className="pam-cyc-track"><i className="pam-cyc-fill" /></span>
        {CYCLE.map((c, i) => (
          <div className="pam-step" key={c.t}>
            <span className="pam-step-dot">{i < 2 ? <Icon name="check" size={10} /> : i + 1}</span>
            <b>{c.t}</b>
            <small>{c.s}</small>
          </div>
        ))}
      </div>
      <div className="pam-remind">
        <span className="pam-remind-ic"><Icon name="bell" size={12} /></span>
        <div><b>Auto-reminders sent to 12 managers</b><small>No spreadsheets, no follow-up emails</small></div>
      </div>
      <div className="pam-done js-in">
        <span>Company-wide completion</span>
        <span className="pam-done-bar"><i /></span>
        <b><span className="js-done">0</span>%</b>
      </div>
    </div>
  );
}

// 4 — Data-Driven Insights: 9-box talent grid
const NINE = [
  ["Rough diamond", 1], ["Future star", 3], ["Top talent", 8],
  ["Inconsistent", 2], ["Core player", 14], ["High performer", 6],
  ["Risk", 1], ["Effective", 9], ["Trusted pro", 4],
];

function InsightsPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(q(".pam-box"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: { each: 0.05, grid: [3, 3], from: "end" }, duration: 0.3, ease: "back.out(2)" }, 0.2);
    q(".pam-box b").forEach((el, i) => {
      const o = { v: 0 };
      tl.to(o, { v: NINE[i][1], duration: 0.8, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) }, 0.6);
    });
    tl.fromTo(q(".pam-box.top"), { boxShadow: "0 0 0 0 rgba(16,185,129,0)" }, { boxShadow: "0 0 0 4px rgba(16,185,129,0.35)", duration: 0.4, repeat: 1, yoyo: true }, 1.5);
    tl.fromTo(q(".pam-kv-dot"), { left: "50%", top: "50%", scale: 0 }, { left: "84%", top: "16%", scale: 1, duration: 0.8, ease: "power2.inOut" }, 1.6);
    tl.fromTo(q(".pam-plan"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" }, 2.4);
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-head js-in"><Icon name="chart" size={12} /> Talent grid · Engineering</div>
      <div className="pam-nine-wrap js-in">
        <span className="pam-axis y">Potential →</span>
        <div className="pam-nine">
          {NINE.map(([n, c], i) => (
            <div className={`pam-box ${i === 2 ? "top" : ""} ${i === 6 ? "risk" : ""}`} key={n}>
              <b>{c}</b>
              <small>{n}</small>
            </div>
          ))}
          <span className="pam-kv-dot" title="Karthik V.">KV</span>
        </div>
        <span className="pam-axis x">Performance →</span>
      </div>
      <div className="pam-plan">
        <span className="pam-plan-ic"><Icon name="sparkles" size={12} /></span>
        <div><b>Karthik V. moved to Top talent</b><small>Suggested: Tech Lead growth plan · 6 months</small></div>
      </div>
    </div>
  );
}

const PANELS = [GoalsPanel, FeedbackPanel, ReviewsPanel, InsightsPanel];

/* ------------------------------------------------------------------ */
/* Performance app (left side)                                         */
/* ------------------------------------------------------------------ */

function PerfApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const polyRef = useRef(null);
  const ratingRef = useRef(null);
  const starsRef = useRef(null);
  const vals = useRef([...RADAR_STAGES[0]].map(() => 0));
  const rating = useRef({ v: 0 });
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // Radar morph + rating count
  useEffect(() => {
    const isFirst = first.current;
    const target = RADAR_STAGES[stage];
    const state = vals.current;
    const tw1 = gsap.to(state, {
      ...Object.fromEntries(target.map((v, i) => [i, v])),
      duration: prefersReduced() ? 0 : 1.1,
      delay: isFirst ? 1 : 0.15,
      ease: "power3.out",
      onUpdate: () => polyRef.current && polyRef.current.setAttribute("points", radarPath(state)),
    });
    const tw2 = gsap.to(rating.current, {
      v: RATING_STAGES[stage],
      duration: prefersReduced() ? 0 : 1.1,
      delay: isFirst ? 1 : 0.15,
      ease: "power3.out",
      onUpdate: () => {
        const v = rating.current.v;
        if (ratingRef.current) ratingRef.current.textContent = v.toFixed(1);
        if (starsRef.current) starsRef.current.style.width = `${(v / 5) * 100}%`;
      },
    });
    return () => {
      tw1.kill();
      tw2.kill();
    };
  }, [stage]);

  useLayoutEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (isFirst || !panelWrap.current) return;
    gsap.fromTo(panelWrap.current.firstElementChild, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" });
  }, [stage]);

  const Panel = PANELS[stage];

  return (
    <div className="pam-frame" ref={frameRef}>
      <div className="pam-chrome">
        <span className="pam-dot r" /><span className="pam-dot y" /><span className="pam-dot g" />
        <div className="pam-url"><span aria-hidden>🔒</span> app.ngriffinpay.in/performance</div>
      </div>

      <div className="pam-app">
        <aside className="pam-side js-side">
          <div className="pam-emp">
            <span className="pam-av">KV</span>
            <div><b>Karthik V.</b><small>Senior Developer · 2.5 yrs</small></div>
          </div>

          <div className="pam-radar">
            <svg viewBox="0 0 140 140" aria-hidden>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <polygon key={lvl} points={radarPath(SKILLS.map(() => lvl))} className="pam-radar-grid" />
              ))}
              {SKILLS.map((s, i) => {
                const [x, y] = radarPoint(i, 5);
                return <line key={s} x1={RC} y1={RC} x2={x} y2={y} className="pam-radar-axis" />;
              })}
              <polygon ref={polyRef} points={radarPath(SKILLS.map(() => 0))} className="pam-radar-shape" />
            </svg>
            {SKILLS.map((s, i) => {
              const [x, y] = radarPoint(i, 6.3);
              return (
                <span key={s} className="pam-radar-lbl" style={{ left: `${(x / 140) * 100}%`, top: `${(y / 140) * 100}%` }}>{s}</span>
              );
            })}
          </div>

          <div className="pam-rating">
            <strong ref={ratingRef}>0.0</strong>
            <div>
              <span className="pam-stars">
                <span className="pam-stars-bg">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={12} />)}</span>
                <span className="pam-stars-fill" ref={starsRef}>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={12} />)}</span>
              </span>
              <small>Overall rating</small>
            </div>
          </div>
          <span className="pam-growth"><Icon name="trend" size={11} /> Trending up this cycle</span>
        </aside>

        <div className="pam-main">
          <div className="pam-tabs js-tabs" role="tablist" aria-label="Performance features">
            {FEATURES.map((f, i) => (
              <button type="button" key={f.title} className={stage === i ? "is-on" : ""} onClick={() => onSelect(i)} role="tab" aria-selected={stage === i}>
                <Icon name={f.icon} size={11} /> {f.title.split(" ").slice(-1)[0]}
              </button>
            ))}
          </div>
          <div className="pam-panel-wrap" ref={panelWrap}>
            <Panel key={stage} delay={startDelay} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 1 — Hero banner                                             */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const [stage, setStage] = useState(0);
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const frameRef = useRef(null);
  const barRefs = useRef([]);
  const firstStage = useRef(true);

  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (prefersReduced()) return;
    const extra = firstStage.current ? 1.3 : 0;
    firstStage.current = false;
    const bar = barRefs.current[stage];
    const tw = bar ? gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: STAGE_TIME + extra, ease: "none" }) : null;
    const next = gsap.delayedCall(STAGE_TIME + extra, () => setStage((s) => (s + 1) % FEATURES.length));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [stage]);

  useLayoutEffect(() => {
    const reduce = prefersReduced();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.set(frameRef.current, { transformPerspective: 1400, transformOrigin: "50% 60%" });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q(".js-reveal"), { y: 28, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.1);
      tl.from(frameRef.current, { opacity: 0, y: 60, rotationX: 16, rotationY: -10, scale: 0.92, duration: 1.2, ease: "expo.out" }, 0.15);
      tl.from(q(".js-side"), { x: -18, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(q(".pam-radar-grid"), { scale: 0, transformOrigin: "50% 50%", stagger: 0.06, duration: 0.4 }, 0.7);
      tl.from(q(".js-tabs"), { y: -10, opacity: 0, duration: 0.45 }, 0.7);
      tl.from(q(".js-float"), { opacity: 0, scale: 0.8, y: 16, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" }, 1.4);
      if (reduce) {
        tl.progress(1);
        return;
      }
      q(".js-float").forEach((el, i) => gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.1 }));
      gsap.to(q(".js-blob"), { x: "random(-40, 40)", y: "random(-30, 30)", duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1 });
      gsap.to(visualRef.current, { yPercent: -8, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true } });
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (fine) {
        const rx = gsap.quickTo(frameRef.current, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(frameRef.current, "rotationY", { duration: 0.8, ease: "power3" });
        const wrap = visualRef.current;
        const move = (e) => {
          const r = wrap.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 4);
        };
        const leave = () => { rx(0); ry(0); };
        wrap.addEventListener("mousemove", move);
        wrap.addEventListener("mouseleave", leave);
        return () => {
          wrap.removeEventListener("mousemove", move);
          wrap.removeEventListener("mouseleave", leave);
        };
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pam-hero" ref={sectionRef} aria-labelledby="pam-hero-title">
      <div className="pam-hero-bg" aria-hidden>
        <span className="pam-blob b1 js-blob" />
        <span className="pam-blob b2 js-blob" />
        <span className="pam-grid-bg" />
      </div>

      <div className="pam-container pam-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="pam-content">
          <span className="pam-eyebrow js-reveal"><span className="pam-live-dot" /> Streamline goals, reviews and feedback</span>
          <h1 id="pam-hero-title" className="pam-title js-reveal">
            Performance &amp; <span className="pam-grad">Appraisal Management</span>
          </h1>
          <p className="pam-lead js-reveal">Fair, continuous and data-backed reviews — from goal setting to growth plans.</p>

          <ul className="pam-feats" role="tablist" aria-label="Performance features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button type="button" role="tab" aria-selected={stage === i} className={`pam-feat ${stage === i ? "is-active" : ""}`} onClick={() => setStage(i)}>
                  <span className="pam-feat-ic"><Icon name={f.icon} size={15} /></span>
                  <span className="pam-feat-txt"><b>{f.title}</b><span>{f.desc}</span></span>
                  <span className="pam-feat-bar"><i ref={(el) => (barRefs.current[i] = el)} /></span>
                </button>
              </li>
            ))}
          </ul>

          <div className="pam-ctas js-reveal">
            <a href="/contact" className="pam-btn primary">Book a Free Demo <Icon name="arrow" size={16} /></a>
            <a href="#pam-next" className="pam-btn ghost"><span className="pam-play"><Icon name="play" size={10} /></span> See how it works</a>
          </div>
        </div>

        {/* LEFT: performance app */}
        <div className="pam-visual" ref={visualRef}>
          <PerfApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="pam-float f1 js-float">
            <span className="pam-float-ic ok"><Icon name="award" size={14} /></span>
            <div><strong>Top talent spotted</strong><small>Backed by real data</small></div>
          </div>
          <div className="pam-float f2 js-float">
            <span className="pam-float-ic pr"><Icon name="calendar" size={14} /></span>
            <div><strong>Reviews on autopilot</strong><small>Reminders sent for you</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PerformanceAppraisal() {
  return (
    <div className="pam-page">
      <HeroSection />
      <span id="pam-next" />
      {/* SECTION 2 — coming next */}
    </div>
  );
}
