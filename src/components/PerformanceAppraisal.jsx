// PerformanceAppraisal.jsx
// NGriffinPay  — Product inner page: "Performance & Appraisal Management"
// Section 1: Hero banner (live performance app on the left, content on the right)
// Section 2: Growth mountain (climber walks flag to flag, one live card per tab)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
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
  {
    title: "Set Clear Goals",
    desc: "Define and align individual goals with organizational objectives.",
    icon: "target",
  },
  {
    title: "Continuous Feedback",
    desc: "Encourage a feedback-driven culture with real-time insights.",
    icon: "chat",
  },
  {
    title: "Automated Reviews",
    desc: "Schedule, track, and manage performance reviews effortlessly.",
    icon: "calendar",
  },
  {
    title: "Data-Driven Insights",
    desc: "Use analytics to recognize top talent and support growth plans.",
    icon: "chart",
  },
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
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const radarPoint = (i, v) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / SKILLS.length;
  const r = (v / 5) * RR;
  return [RC + r * Math.cos(a), RC + r * Math.sin(a)];
};
const radarPath = (vals) =>
  vals
    .map((v, i) =>
      radarPoint(i, v)
        .map((n) => n.toFixed(1))
        .join(","),
    )
    .join(" ");

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 14 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "target":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      );
    case "star":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "trend":
      return (
        <svg {...p}>
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </svg>
      );
    case "award":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
        </svg>
      );
    case "flag":
      return (
        <svg {...p}>
          <path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5" />
        </svg>
      );
    case "users":
      return (
        <svg {...p}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...p}>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...p}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        </svg>
      );
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
      tl.from(q(".js-in"), {
        y: 14,
        opacity: 0,
        stagger: 0.07,
        duration: 0.4,
        ease: "power3.out",
      });
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
    tl.fromTo(
      q(".pam-okr"),
      { y: -10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4 },
      0.2,
    );
    tl.fromTo(q(".pam-link"), { scaleY: 0 }, { scaleY: 1, duration: 0.3 }, 0.6);
    tl.fromTo(
      q(".pam-team"),
      { y: -8, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 },
      0.8,
    );
    tl.fromTo(
      q(".pam-branch"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.35 },
      1.1,
    );
    q(".pam-goal").forEach((g, i) => {
      const at = 1.3 + i * 0.25;
      tl.fromTo(
        g,
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" },
        at,
      );
      tl.fromTo(
        g.querySelector(".pam-gbar i"),
        { scaleX: 0 },
        { scaleX: GOALS[i].p / 100, duration: 0.9, ease: "power2.out" },
        at + 0.25,
      );
      const el = g.querySelector(".js-gp");
      const o = { v: 0 };
      tl.to(
        o,
        {
          v: GOALS[i].p,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => el && (el.textContent = `${Math.round(o.v)}%`),
        },
        at + 0.25,
      );
    });
    tl.fromTo(
      q(".pam-aligned"),
      { scale: 0.8, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.5)" },
      2.6,
    );
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-okr">
        <span className="pam-okr-ic">
          <Icon name="flag" size={12} />
        </span>
        <div>
          <small>Company objective · FY26</small>
          <b>Grow revenue 30% with a better product</b>
        </div>
      </div>
      <span className="pam-link" />
      <div className="pam-team">
        <Icon name="users" size={11} /> Engineering team goal:{" "}
        <b>Launch mobile-first experience</b>
      </div>
      <span className="pam-branch" />
      <div className="pam-goals">
        {GOALS.map((g) => (
          <div className="pam-goal" key={g.t}>
            <span className="pam-goal-ic">
              <Icon name="target" size={11} />
            </span>
            <b>{g.t}</b>
            <div className="pam-gfoot">
              <span className="pam-gbar">
                <i />
              </span>
              <em className="js-gp">0%</em>
            </div>
          </div>
        ))}
      </div>
      <span className="pam-aligned">
        <Icon name="check" size={10} /> 100% of goals aligned to company
        objectives
      </span>
    </div>
  );
}

// 2 — Continuous Feedback: live feedback stream
const FEEDBACK = [
  {
    from: "Rahul M.",
    role: "Manager",
    av: "RM",
    text: "Great ownership on the payroll release 👏",
    tag: "Ownership",
  },
  {
    from: "Anita R.",
    role: "Peer",
    av: "AR",
    text: "Super helpful in code reviews this sprint.",
    tag: "Teamwork",
  },
  {
    from: "Deepa N.",
    role: "Mentee",
    av: "DN",
    text: "Thanks for the patient onboarding sessions 🙌",
    tag: "Mentoring",
  },
];

function FeedbackPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".pam-fb").forEach((f, i) => {
      const at = 0.3 + i * 0.6;
      tl.fromTo(
        f,
        { x: i % 2 ? 30 : -30, autoAlpha: 0, scale: 0.95 },
        { x: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
        at,
      );
      tl.fromTo(
        f.querySelector(".pam-fb-tag"),
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "back.out(3)" },
        at + 0.35,
      );
    });
    tl.fromTo(
      q(".pam-senti i"),
      { scaleX: 0 },
      { scaleX: 0.86, duration: 1, ease: "power2.out" },
      2,
    );
    const el = q(".js-senti")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 86,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      2,
    );
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-head js-in">
        <Icon name="chat" size={12} /> Live feedback · this month{" "}
        <em className="pam-live">
          <i /> Live
        </em>
      </div>
      <div className="pam-fbs">
        {FEEDBACK.map((f, i) => (
          <div className={`pam-fb ${i % 2 ? "right" : ""}`} key={f.from}>
            <span className="pam-av sm">{f.av}</span>
            <div>
              <small>
                <b>{f.from}</b> · {f.role}
              </small>
              <p>{f.text}</p>
              <span className="pam-fb-tag">#{f.tag}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pam-sentiment js-in">
        <span>Feedback sentiment</span>
        <span className="pam-senti">
          <i />
        </span>
        <b>
          <span className="js-senti">0</span>% positive
        </b>
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
    tl.fromTo(
      q(".pam-cyc-fill"),
      { scaleX: 0 },
      { scaleX: 0.62, duration: 1.6, ease: "power1.inOut" },
      0.4,
    );
    q(".pam-step").forEach((s, i) => {
      if (i < 2) {
        tl.fromTo(
          s.querySelector(".pam-step-dot"),
          { backgroundColor: "#ffffff", color: "#94a3b8" },
          { backgroundColor: "#10b981", color: "#ffffff", duration: 0.25 },
          0.6 + i * 0.5,
        );
      } else if (i === 2) {
        tl.fromTo(
          s.querySelector(".pam-step-dot"),
          { backgroundColor: "#ffffff", color: "#94a3b8" },
          { backgroundColor: "#1d6fd8", color: "#ffffff", duration: 0.25 },
          1.7,
        );
      }
    });
    tl.fromTo(
      q(".pam-remind"),
      { y: 12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" },
      2.1,
    );
    const el = q(".js-done")[0];
    const o = { v: 0 };
    tl.fromTo(
      q(".pam-done-bar i"),
      { scaleX: 0 },
      { scaleX: 0.78, duration: 1, ease: "power2.out" },
      2.3,
    );
    tl.to(
      o,
      {
        v: 78,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      2.3,
    );
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-head js-in">
        <Icon name="calendar" size={12} /> Review cycle · H2 FY26
      </div>
      <div className="pam-cycle js-in">
        <span className="pam-cyc-track">
          <i className="pam-cyc-fill" />
        </span>
        {CYCLE.map((c, i) => (
          <div className="pam-step" key={c.t}>
            <span className="pam-step-dot">
              {i < 2 ? <Icon name="check" size={10} /> : i + 1}
            </span>
            <b>{c.t}</b>
            <small>{c.s}</small>
          </div>
        ))}
      </div>
      <div className="pam-remind">
        <span className="pam-remind-ic">
          <Icon name="bell" size={12} />
        </span>
        <div>
          <b>Auto-reminders sent to 12 managers</b>
          <small>No spreadsheets, no follow-up emails</small>
        </div>
      </div>
      <div className="pam-done js-in">
        <span>Company-wide completion</span>
        <span className="pam-done-bar">
          <i />
        </span>
        <b>
          <span className="js-done">0</span>%
        </b>
      </div>
    </div>
  );
}

// 4 — Data-Driven Insights: 9-box talent grid
const NINE = [
  ["Rough diamond", 1],
  ["Future star", 3],
  ["Top talent", 8],
  ["Inconsistent", 2],
  ["Core player", 14],
  ["High performer", 6],
  ["Risk", 1],
  ["Effective", 9],
  ["Trusted pro", 4],
];

function InsightsPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".pam-box"),
      { scale: 0.6, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: { each: 0.05, grid: [3, 3], from: "end" },
        duration: 0.3,
        ease: "back.out(2)",
      },
      0.2,
    );
    q(".pam-box b").forEach((el, i) => {
      const o = { v: 0 };
      tl.to(
        o,
        {
          v: NINE[i][1],
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(o.v)),
        },
        0.6,
      );
    });
    tl.fromTo(
      q(".pam-box.top"),
      { boxShadow: "0 0 0 0 rgba(16,185,129,0)" },
      {
        boxShadow: "0 0 0 4px rgba(16,185,129,0.35)",
        duration: 0.4,
        repeat: 1,
        yoyo: true,
      },
      1.5,
    );
    tl.fromTo(
      q(".pam-kv-dot"),
      { left: "50%", top: "50%", scale: 0 },
      {
        left: "84%",
        top: "16%",
        scale: 1,
        duration: 0.8,
        ease: "power2.inOut",
      },
      1.6,
    );
    tl.fromTo(
      q(".pam-plan"),
      { y: 12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" },
      2.4,
    );
  }, delay);

  return (
    <div className="pam-panel" ref={ref}>
      <div className="pam-head js-in">
        <Icon name="chart" size={12} /> Talent grid · Engineering
      </div>
      <div className="pam-nine-wrap js-in">
        <span className="pam-axis y">Potential →</span>
        <div className="pam-nine">
          {NINE.map(([n, c], i) => (
            <div
              className={`pam-box ${i === 2 ? "top" : ""} ${i === 6 ? "risk" : ""}`}
              key={n}
            >
              <b>{c}</b>
              <small>{n}</small>
            </div>
          ))}
          <span className="pam-kv-dot" title="Karthik V.">
            KV
          </span>
        </div>
        <span className="pam-axis x">Performance →</span>
      </div>
      <div className="pam-plan">
        <span className="pam-plan-ic">
          <Icon name="sparkles" size={12} />
        </span>
        <div>
          <b>Karthik V. moved to Top talent</b>
          <small>Suggested: Tech Lead growth plan · 6 months</small>
        </div>
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
  const tabsRef = useRef(null);
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
      onUpdate: () =>
        polyRef.current &&
        polyRef.current.setAttribute("points", radarPath(state)),
    });
    const tw2 = gsap.to(rating.current, {
      v: RATING_STAGES[stage],
      duration: prefersReduced() ? 0 : 1.1,
      delay: isFirst ? 1 : 0.15,
      ease: "power3.out",
      onUpdate: () => {
        const v = rating.current.v;
        if (ratingRef.current) ratingRef.current.textContent = v.toFixed(1);
        if (starsRef.current)
          starsRef.current.style.width = `${(v / 5) * 100}%`;
      },
    });
    return () => {
      tw1.kill();
      tw2.kill();
    };
  }, [stage]);

  // Mobile: when the listed feature changes, slide the tab row so the active tab is fully visible
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[stage];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined; // all tabs fit: nothing to do
    const target = Math.max(
      0,
      Math.min(
        strip.scrollWidth - strip.clientWidth,
        btn.offsetLeft -
          strip.offsetLeft -
          (strip.clientWidth - btn.offsetWidth) / 2,
      ),
    );
    const pos = { x: strip.scrollLeft };
    const tw = gsap.to(pos, {
      x: target,
      duration: prefersReduced() ? 0 : 0.5,
      ease: "power2.out",
      onUpdate: () => {
        strip.scrollLeft = pos.x;
      },
    });
    return () => tw.kill();
  }, [stage]);

  useLayoutEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (isFirst || !panelWrap.current) return;
    gsap.fromTo(
      panelWrap.current.firstElementChild,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
  }, [stage]);

  const Panel = PANELS[stage];

  return (
    <div className="pam-frame" ref={frameRef}>
      <div className="pam-chrome">
        <span className="pam-dot r" />
        <span className="pam-dot y" />
        <span className="pam-dot g" />
        <div className="pam-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/performance
        </div>
      </div>

      <div className="pam-app">
        <aside className="pam-side js-side">
          <div className="pam-emp">
            <span className="pam-av">KV</span>
            <div>
              <b>Karthik V.</b>
              <small>Senior Developer · 2.5 yrs</small>
            </div>
          </div>

          <div className="pam-radar">
            <svg viewBox="0 0 140 140" aria-hidden>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <polygon
                  key={lvl}
                  points={radarPath(SKILLS.map(() => lvl))}
                  className="pam-radar-grid"
                />
              ))}
              {SKILLS.map((s, i) => {
                const [x, y] = radarPoint(i, 5);
                return (
                  <line
                    key={s}
                    x1={RC}
                    y1={RC}
                    x2={x}
                    y2={y}
                    className="pam-radar-axis"
                  />
                );
              })}
              <polygon
                ref={polyRef}
                points={radarPath(SKILLS.map(() => 0))}
                className="pam-radar-shape"
              />
            </svg>
            {SKILLS.map((s, i) => {
              const [x, y] = radarPoint(i, 6.3);
              return (
                <span
                  key={s}
                  className="pam-radar-lbl"
                  style={{
                    left: `${(x / 140) * 100}%`,
                    top: `${(y / 140) * 100}%`,
                  }}
                >
                  {s}
                </span>
              );
            })}
          </div>

          <div className="pam-rating">
            <strong ref={ratingRef}>0.0</strong>
            <div>
              <span className="pam-stars">
                <span className="pam-stars-bg">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={12} />
                  ))}
                </span>
                <span className="pam-stars-fill" ref={starsRef}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={12} />
                  ))}
                </span>
              </span>
              <small>Overall rating</small>
            </div>
          </div>
          <span className="pam-growth">
            <Icon name="trend" size={11} /> Trending up this cycle
          </span>
        </aside>

        <div className="pam-main">
          <div
            className="pam-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Performance features"
          >
            {FEATURES.map((f, i) => (
              <button
                type="button"
                key={f.title}
                className={stage === i ? "is-on" : ""}
                onClick={() => onSelect(i)}
                role="tab"
                aria-selected={stage === i}
              >
                <Icon name={f.icon} size={11} />{" "}
                {f.title.split(" ").slice(-1)[0]}
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
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: STAGE_TIME + extra, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(STAGE_TIME + extra, () =>
      setStage((s) => (s + 1) % FEATURES.length),
    );
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [stage]);

  useLayoutEffect(() => {
    const reduce = prefersReduced();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.set(frameRef.current, {
        transformPerspective: 1400,
        transformOrigin: "50% 60%",
      });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(
        q(".js-reveal"),
        { y: 28, opacity: 0, duration: 0.8, stagger: 0.07 },
        0.1,
      );
      tl.from(
        frameRef.current,
        {
          opacity: 0,
          y: 60,
          rotationX: 16,
          rotationY: -10,
          scale: 0.92,
          duration: 1.2,
          ease: "expo.out",
        },
        0.15,
      );
      tl.from(q(".js-side"), { x: -18, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(
        q(".pam-radar-grid"),
        { scale: 0, transformOrigin: "50% 50%", stagger: 0.06, duration: 0.4 },
        0.7,
      );
      tl.from(q(".js-tabs"), { y: -10, opacity: 0, duration: 0.45 }, 0.7);
      tl.from(
        q(".js-float"),
        {
          opacity: 0,
          scale: 0.8,
          y: 16,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        1.4,
      );
      if (reduce) {
        tl.progress(1);
        return;
      }
      q(".js-float").forEach((el, i) =>
        gsap.to(el, {
          y: i % 2 ? 10 : -10,
          duration: 2.6 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.1,
        }),
      );
      gsap.to(q(".js-blob"), {
        x: "random(-40, 40)",
        y: "random(-30, 30)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1,
      });
      // parallax only on desktop — on mobile the app sits under the list and would overlap it
      if (window.matchMedia("(min-width: 1151px)").matches) {
        gsap.to(visualRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      const fine = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (fine) {
        const rx = gsap.quickTo(frameRef.current, "rotationX", {
          duration: 0.8,
          ease: "power3",
        });
        const ry = gsap.quickTo(frameRef.current, "rotationY", {
          duration: 0.8,
          ease: "power3",
        });
        const wrap = visualRef.current;
        const move = (e) => {
          const r = wrap.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 4);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
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
    <section
      className="pam-hero"
      ref={sectionRef}
      aria-labelledby="pam-hero-title"
    >
      <div className="pam-hero-bg" aria-hidden>
        <span className="pam-blob b1 js-blob" />
        <span className="pam-blob b2 js-blob" />
        <span className="pam-grid-bg" />
      </div>

      <div className="pam-container pam-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="pam-content">
          <span className="pam-eyebrow js-reveal">
            <span className="pam-live-dot" /> Streamline goals, reviews and
            feedback
          </span>
          <h1 id="pam-hero-title" className="pam-title js-reveal">
            Performance &amp;{" "}
            <span className="pam-grad">Appraisal Management</span>
          </h1>

          <ul
            className="pam-feats"
            role="tablist"
            aria-label="Performance features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`pam-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="pam-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="pam-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="pam-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: performance app */}
        <div className="pam-visual" ref={visualRef}>
          <PerfApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="pam-float f1 js-float">
            <span className="pam-float-ic ok">
              <Icon name="award" size={14} />
            </span>
            <div>
              <strong>Top talent spotted</strong>
              <small>Backed by real data</small>
            </div>
          </div>
          <div className="pam-float f2 js-float">
            <span className="pam-float-ic pr">
              <Icon name="calendar" size={14} />
            </span>
            <div>
              <strong>Reviews on autopilot</strong>
              <small>Reminders sent for you</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Growth mountain (climber moves flag to flag per tab)    */
/* ------------------------------------------------------------------ */

const CLIMB_HEADING = [
  ["Empower", true],
  ["your", false],
  ["workforce,", false],
  ["streamline", true],
  ["performance", false],
  ["reviews,", false],
  ["and", true],
  ["foster", false],
  ["continuous", false],
  ["growth", false],
];

const CLIMB_TABS = [
  {
    label: "Goal Setting & Tracking",
    icon: "target",
    title: [
      ["Set", 1],
      [" and track ", 0],
      ["SMART goals", 1],
    ],
    desc: "Easily define measurable objectives, monitor real-time progress, and ensure alignment with business priorities.",
  },
  {
    label: "Continuous Feedback",
    icon: "chat",
    title: [
      ["Boost", 1],
      [" employee engagement and ", 0],
      ["unlock peak performance", 1],
    ],
    // ✏️ Your tab script had no separate text for this tab — edit this line if you want different wording
    desc: "Share timely feedback and recognition all year round, so employees always know where they stand and how to grow.",
  },
  {
    label: "360° Appraisals",
    icon: "users",
    title: [
      ["Collect", 1],
      [" ", 0],
      ["360° feedback", 1],
    ],
    desc: "Gather well-rounded performance insights from managers, peers, and team members to make fair and informed evaluations.",
  },
  {
    label: "Custom Evaluation Templates",
    icon: "sliders",
    title: [
      ["Customize", 1],
      [" appraisal forms and workflows", 0],
    ],
    desc: "Tailor evaluation templates, criteria, and review cycles to match your company’s unique performance policies.",
  },
  {
    label: "Performance Analytics",
    icon: "chart",
    title: [
      ["Analyze", 1],
      [" performance trends", 0],
    ],
    desc: "Leverage advanced analytics to identify high performers, spot improvement areas, and make data-driven talent decisions.",
  },
];
const CLIMB_TIME = 6;

// Trail up the mountain (viewBox 600 × 360) and where each flag sits on it (0–1)
const TRAIL =
  "M 40 330 C 120 322, 150 300, 190 290 S 260 262, 250 236 S 300 200, 340 196 S 390 170, 370 146 S 420 110, 448 100 S 470 70, 462 46";
const FLAG_AT = [0.07, 0.29, 0.52, 0.75, 1];

/* ---------- Floating cards: one mini live view per tab ---------- */
function useCard(build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(q(".js-k"), {
        y: 10,
        opacity: 0,
        stagger: 0.07,
        duration: 0.35,
        ease: "power3.out",
      });
      build(tl, q);
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

const SMART = [
  ["S", "Specific"],
  ["M", "Measurable"],
  ["A", "Achievable"],
  ["R", "Relevant"],
  ["T", "Time-bound"],
];
function CardGoals() {
  const ref = useCard((tl, q) => {
    tl.fromTo(
      q(".pac-smart span"),
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(3)",
      },
      0.3,
    );
    tl.fromTo(
      q(".pac-bar i"),
      { scaleX: 0 },
      { scaleX: 0.72, duration: 1.1, ease: "power2.out" },
      0.9,
    );
    const el = q(".js-gpct")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 72,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      0.9,
    );
    tl.fromTo(
      q(".pac-pill"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      1.9,
    );
  });
  return (
    <div className="pac-card" ref={ref}>
      <div className="pac-head js-k">
        <Icon name="target" size={12} /> Q4 goal · Karthik V.
      </div>
      <b className="pac-goal js-k">
        Raise customer NPS from 48 to 60 by 31 Dec
      </b>
      <div className="pac-smart">
        {SMART.map(([l, t]) => (
          <span key={l} title={t}>
            <Icon name="check" size={8} />
            {l}
          </span>
        ))}
      </div>
      <div className="pac-prog js-k">
        <span className="pac-bar">
          <i />
        </span>
        <b>
          <span className="js-gpct">0</span>%
        </b>
      </div>
      <span className="pac-pill">
        <Icon name="flag" size={10} /> Aligned to company objective
      </span>
    </div>
  );
}

function CardFeedback() {
  const ref = useCard((tl, q) => {
    tl.fromTo(
      q(".pac-fb"),
      { x: (i) => (i % 2 ? 24 : -24), autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        stagger: 0.5,
        duration: 0.4,
        ease: "back.out(1.6)",
      },
      0.3,
    );
    tl.fromTo(
      q(".pac-kudos"),
      { scale: 0.6, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.5)" },
      1.5,
    );
    const el = q(".js-kudos")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 14,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      1.5,
    );
  });
  return (
    <div className="pac-card" ref={ref}>
      <div className="pac-head js-k">
        <Icon name="chat" size={12} /> Feedback · this week{" "}
        <em className="pac-live">
          <i /> Live
        </em>
      </div>
      <div className="pac-fb">
        <span className="pac-av">RM</span>
        <p>“Great demo to the client today — clear and confident.”</p>
      </div>
      <div className="pac-fb right">
        <span className="pac-av alt">KV</span>
        <p>“Thanks! Next time I’ll add the ROI slide.”</p>
      </div>
      <span className="pac-kudos">
        🎉 <b className="js-kudos">0</b> kudos this month
      </span>
    </div>
  );
}

const RATERS = [
  { av: "RM", r: "Manager", s: 4.5, x: 50, y: 8 },
  { av: "AR", r: "Peer", s: 4.3, x: 92, y: 50 },
  { av: "DN", r: "Report", s: 4.6, x: 50, y: 92 },
  { av: "KV", r: "Self", s: 4.2, x: 8, y: 50 },
];
function Card360() {
  const ref = useCard((tl, q) => {
    tl.fromTo(
      q(".pac-orbit line"),
      { attr: { "stroke-dashoffset": 60 } },
      { attr: { "stroke-dashoffset": 0 }, stagger: 0.15, duration: 0.5 },
      0.3,
    );
    tl.fromTo(
      q(".pac-rater"),
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.15,
        duration: 0.35,
        ease: "back.out(2.5)",
      },
      0.4,
    );
    tl.fromTo(
      q(".pac-rater em"),
      { autoAlpha: 0, y: 4 },
      { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.25 },
      1.1,
    );
    const el = q(".js-avg")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 4.4,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = o.v.toFixed(1)),
      },
      1.4,
    );
  });
  return (
    <div className="pac-card" ref={ref}>
      <div className="pac-head js-k">
        <Icon name="users" size={12} /> 360° review · Karthik V.
      </div>
      <div className="pac-orbit js-k">
        <svg viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="42" className="pac-ring" />
          {RATERS.map((r) => (
            <line
              key={r.r}
              x1="50"
              y1="50"
              x2={r.x}
              y2={r.y}
              strokeDasharray="60"
            />
          ))}
        </svg>
        <div className="pac-core">
          <b className="js-avg">0.0</b>
          <small>avg</small>
        </div>
        {RATERS.map((r) => (
          <span
            className="pac-rater"
            key={r.r}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            <i>{r.av}</i>
            <em>
              {r.r} · {r.s}
            </em>
          </span>
        ))}
      </div>
    </div>
  );
}

const CRITERIA = [
  ["Delivery", 40],
  ["Quality", 30],
  ["Teamwork", 20],
  ["Learning", 10],
];
function CardTemplate() {
  const ref = useCard((tl, q) => {
    q(".pac-crit").forEach((c, i) => {
      tl.fromTo(
        c,
        { x: -12, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.3 },
        0.3 + i * 0.2,
      );
      tl.fromTo(
        c.querySelector(".pac-w i"),
        { scaleX: 0 },
        { scaleX: CRITERIA[i][1] / 40, duration: 0.6, ease: "power2.out" },
        0.45 + i * 0.2,
      );
    });
    const el = q(".js-wt")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 100,
        duration: 1.2,
        ease: "power1.inOut",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      0.45,
    );
    tl.fromTo(
      q(".pac-pill"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      1.8,
    );
  });
  return (
    <div className="pac-card" ref={ref}>
      <div className="pac-head js-k">
        <Icon name="sliders" size={12} /> Template · Engineering{" "}
        <em className="pac-tag">Annual</em>
      </div>
      {CRITERIA.map(([n, w]) => (
        <div className="pac-crit" key={n}>
          <span>{n}</span>
          <span className="pac-w">
            <i />
          </span>
          <b>{w}%</b>
        </div>
      ))}
      <div className="pac-total js-k">
        Total weight{" "}
        <b>
          <span className="js-wt">0</span>%
        </b>
      </div>
      <span className="pac-pill">
        <Icon name="check" size={10} /> Rating scale 1–5 · Manager → HR
      </span>
    </div>
  );
}

const TREND = [62, 66, 71, 69, 76, 82];
function CardAnalytics() {
  const ref = useCard((tl, q) => {
    tl.fromTo(
      q(".pac-tb i"),
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.08, duration: 0.45, ease: "back.out(1.6)" },
      0.3,
    );
    tl.fromTo(
      q(".pac-stat"),
      { y: 8, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.3 },
      1,
    );
    const el = q(".js-top")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 12,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      1,
    );
  });
  return (
    <div className="pac-card" ref={ref}>
      <div className="pac-head js-k">
        <Icon name="chart" size={12} /> Team performance index
      </div>
      <div className="pac-tbars js-k">
        {TREND.map((v, i) => (
          <span
            className={`pac-tb ${i === TREND.length - 1 ? "now" : ""}`}
            key={i}
          >
            <i style={{ height: `${v}%` }} />
          </span>
        ))}
      </div>
      <div className="pac-stats">
        <div className="pac-stat">
          <b>
            <span className="js-top">0</span>%
          </b>
          <small>Top performers</small>
        </div>
        <div className="pac-stat">
          <b>3</b>
          <small>Skill gaps flagged</small>
        </div>
      </div>
    </div>
  );
}

const CLIMB_CARDS = [
  CardGoals,
  CardFeedback,
  Card360,
  CardTemplate,
  CardAnalytics,
];

/* ---------- Section ---------- */
function GrowthClimbSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef(null);
  const trailRef = useRef(null);
  const doneRef = useRef(null);
  const climberRef = useRef(null);
  const cardRef = useRef(null);
  const copyRef = useRef(null);
  const tabsRef = useRef(null);
  const barRefs = useRef([]);
  const autoRef = useRef(null);
  const visibleRef = useRef(false);
  const hoverRef = useRef(false);
  const prog = useRef({ p: FLAG_AT[0] });
  const firstMove = useRef(true);

  const select = (i) => {
    activeRef.current = i;
    setActive(i);
  };
  const syncPlay = () => {
    const tw = autoRef.current;
    if (!tw) return;
    if (hoverRef.current || !visibleRef.current) tw.pause();
    else tw.resume();
  };
  const hover = (v) => () => {
    hoverRef.current = v;
    syncPlay();
  };

  // place climber + completed trail at a 0–1 position along the path
  const place = (p) => {
    const path = trailRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * p);
    if (climberRef.current)
      climberRef.current.setAttribute(
        "transform",
        `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`,
      );
    if (doneRef.current) doneRef.current.style.strokeDashoffset = String(1 - p);
  };

  // entrance + play only while visible
  useLayoutEffect(() => {
    place(prog.current.p);
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".pa2-hw > span"), {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.045,
        ease: "power4.out",
        scrollTrigger: { trigger: q(".pa2-title")[0], start: "top 85%" },
      });
      gsap.from(q(".pa2-scene"), {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".pa2-grid")[0], start: "top 82%" },
      });
      gsap.from(q(".pa2-ridge"), {
        yPercent: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".pa2-grid")[0], start: "top 82%" },
      });
      if (!prefersReduced()) {
        gsap.to(q(".pa2-cloud"), {
          x: "+=40",
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 2,
        });
      }
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 25%",
        onToggle: (self) => {
          visibleRef.current = self.isActive;
          syncPlay();
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-advance timer (fills the bar under the active tab)
  useEffect(() => {
    autoRef.current?.kill();
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (prefersReduced()) return undefined;
    const bar = barRefs.current[active];
    autoRef.current = gsap.fromTo(
      bar || {},
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: CLIMB_TIME,
        ease: "none",
        onComplete: () => select((activeRef.current + 1) % CLIMB_TABS.length),
      },
    );
    syncPlay();
    return () => autoRef.current?.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // climber walks the trail to the active flag; card + copy swap in
  useLayoutEffect(() => {
    const reduce = prefersReduced();
    const target = FLAG_AT[active];
    const first = firstMove.current;
    firstMove.current = false;
    const tw = gsap.to(prog.current, {
      p: target,
      duration: first || reduce ? 0 : 1.2,
      ease: "power2.inOut",
      onUpdate: () => place(prog.current.p),
    });
    if (!first && !reduce) {
      gsap.fromTo(
        cardRef.current,
        { y: 18, autoAlpha: 0, scale: 0.96 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "back.out(1.6)",
        },
      );
      if (copyRef.current) {
        gsap.from(copyRef.current.querySelectorAll(".pa2-tw > span"), {
          yPercent: 110,
          duration: 0.6,
          stagger: 0.05,
          ease: "power4.out",
        });
        gsap.from(copyRef.current.querySelectorAll(".js-f"), {
          y: 12,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.15,
          ease: "power3.out",
        });
      }
      const cloth = sectionRef.current?.querySelector(
        `.pa2-flag.f${active} .pa2-flag-cloth`,
      );
      if (cloth)
        gsap.fromTo(
          cloth,
          { scaleX: 0.2 },
          {
            scaleX: 1,
            duration: 0.5,
            delay: 1,
            ease: "back.out(3)",
            transformOrigin: "0% 50%",
          },
        );
    }
    return () => tw.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // mobile: keep the active tab fully visible in the scrolling tab row
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[active];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined;
    const target = Math.max(
      0,
      Math.min(
        strip.scrollWidth - strip.clientWidth,
        btn.offsetLeft -
          strip.offsetLeft -
          (strip.clientWidth - btn.offsetWidth) / 2,
      ),
    );
    const pos = { x: strip.scrollLeft };
    const tw = gsap.to(pos, {
      x: target,
      duration: prefersReduced() ? 0 : 0.5,
      ease: "power2.out",
      onUpdate: () => {
        strip.scrollLeft = pos.x;
      },
    });
    return () => tw.kill();
  }, [active]);

  // flag positions along the trail (computed once the path exists)
  const [flags, setFlags] = useState([]);
  useLayoutEffect(() => {
    const path = trailRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setFlags(
      FLAG_AT.map((f) => {
        const pt = path.getPointAtLength(len * f);
        return [pt.x, pt.y];
      }),
    );
  }, []);

  const t = CLIMB_TABS[active];
  const N = CLIMB_TABS.length;
  const Card = CLIMB_CARDS[active];

  return (
    <section className="pa2" ref={sectionRef} aria-labelledby="pa2-title">
      <div className="pam-container">
        <h2 id="pa2-title" className="pa2-title">
          {CLIMB_HEADING.map(([w, hl], i) => (
            <span key={i} className={`pa2-hw ${hl ? "hl" : ""}`}>
              <span>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="pa2-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="Performance features"
        >
          {CLIMB_TABS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`pa2-tab ${active === i ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
              onClick={() => select(i)}
            >
              <span className="pa2-tab-ic">
                <Icon name={s.icon} size={14} />
              </span>
              {s.label}
              <span className="pa2-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="pa2-grid">
          <div
            className="pa2-scene"
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <svg viewBox="0 0 600 360" className="pa2-svg" aria-hidden>
              <defs>
                <linearGradient id="pa2Sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#f5f8fd" />
                </linearGradient>
                <linearGradient id="pa2Mtn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d6fd8" />
                  <stop offset="100%" stopColor="#0a3f83" />
                </linearGradient>
              </defs>
              <rect width="600" height="360" fill="url(#pa2Sky)" />
              <circle cx="520" cy="70" r="34" className="pa2-sun" />
              <g className="pa2-cloud">
                <ellipse cx="120" cy="70" rx="44" ry="12" />
                <ellipse cx="146" cy="62" rx="26" ry="12" />
              </g>
              <g className="pa2-cloud">
                <ellipse cx="330" cy="40" rx="36" ry="10" />
                <ellipse cx="350" cy="34" rx="20" ry="9" />
              </g>
              <path
                className="pa2-ridge r1"
                d="M0 300 L90 210 L170 260 L260 170 L330 240 L420 160 L520 230 L600 190 L600 360 L0 360 Z"
              />
              <path
                className="pa2-ridge r2"
                d="M0 360 L0 340 L160 300 L300 180 L380 120 L462 40 L540 150 L600 210 L600 360 Z"
              />
              <path
                className="pa2-snow"
                d="M462 40 L438 72 L452 66 L462 80 L474 64 L488 70 Z"
              />
              <path d={TRAIL} className="pa2-trail" ref={trailRef} />
              <path
                d={TRAIL}
                className="pa2-trail-done"
                ref={doneRef}
                pathLength="1"
              />
              {flags.map(([x, y], i) => (
                <g
                  key={i}
                  className={`pa2-flag f${i} ${i < active ? "done" : ""} ${i === active ? "now" : ""}`}
                  transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                >
                  <line x1="0" y1="0" x2="0" y2="-26" />
                  <path
                    className="pa2-flag-cloth"
                    d="M0 -26 L18 -21 L0 -15 Z"
                  />
                  <circle r="4.5" className="pa2-flag-base" />
                  <text y="16" textAnchor="middle">
                    {i + 1}
                  </text>
                </g>
              ))}
              <g ref={climberRef} className="pa2-climber">
                <circle r="13" className="pa2-climber-glow" />
                <circle r="9" className="pa2-climber-dot" />
                <text y="3.5" textAnchor="middle">
                  KV
                </text>
              </g>
            </svg>

            <div className="pa2-card-wrap" ref={cardRef}>
              <Card key={active} />
            </div>
            <span className="pa2-meta">
              <b>0{active + 1}</b> / 0{N} · {t.label}
            </span>
          </div>

          <div
            className="pa2-copy"
            ref={copyRef}
            key={active}
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <span className="pa2-step js-f">
              <span className="pa2-step-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}{" "}
              <em>
                0{active + 1} / 0{N}
              </em>
            </span>
            <h3>
              {t.title.map(([w, hl], i) => (
                <span key={i} className={`pa2-tw ${hl ? "hl" : ""}`}>
                  <span>{w}</span>
                </span>
              ))}
            </h3>
            <p className="js-f">{t.desc}</p>
            <div className="pa2-actions js-f">
              <a href="/contact-us" className="pam-btn primary">
                Get Started with NGriffinPay <Icon name="arrow" size={16} />
              </a>
              <div className="pa2-nav">
                <button
                  type="button"
                  onClick={() => select((active - 1 + N) % N)}
                  aria-label="Previous"
                >
                  <span className="pa2-flip">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => select((active + 1) % N)}
                  aria-label="Next"
                >
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 3 — FAQs as a live chat                                     */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "What is the Performance & Appraisal Management feature in NGriffinPay ?",
    a: "NGriffinPay ’s Performance & Appraisal Management module helps organizations evaluate employee performance, set measurable goals, and conduct structured appraisals to drive growth and engagement.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "performance management",
      "appraisal management",
    ],
  },
  {
    q: "Can managers set and track performance goals?",
    a: "Yes. Managers can set SMART goals for employees, track progress throughout the year, and provide timely feedback via the platform.",
    keys: [
      "goal",
      "smart",
      "okr",
      "kpi",
      "target",
      "track",
      "objective",
      "progress",
      "manager",
    ],
  },
  {
    q: "Does the system support 360-degree feedback?",
    a: "Absolutely. NGriffinPay  supports 360-degree feedback, allowing inputs from peers, subordinates, and managers to ensure a holistic performance review.",
    keys: [
      "360",
      "peer",
      "feedback",
      "subordinate",
      "colleague",
      "multi-rater",
      "holistic",
    ],
  },
  {
    q: "Are appraisal forms customizable?",
    a: "Yes, appraisal templates and evaluation criteria can be customized to fit your organization’s policies, role types, and performance standards.",
    keys: [
      "custom",
      "template",
      "form",
      "criteria",
      "rating scale",
      "workflow",
      "cycle",
      "weight",
    ],
  },
  {
    q: "Can employees view their performance history?",
    a: "Employees can access their performance records, past appraisals, and feedback notes, empowering them to track their career growth over time.",
    keys: [
      "history",
      "past",
      "previous",
      "record",
      "employee view",
      "see my",
      "career",
      "growth",
      "view",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about performance and appraisals.";
const FAQ_FALLBACK =
  "That's a great question! I don't have a ready answer for it here, but our team can walk you through it in a quick live demo.";

function matchFaq(text) {
  const t = text.toLowerCase();
  let best = -1;
  let bestScore = 0;
  FAQS.forEach((f, i) => {
    const score = f.keys.reduce(
      (s, k) => s + (t.includes(k) ? k.length : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return bestScore >= 3 ? best : -1;
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function TypedText({ text, animate, onTick, onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!animate) {
      el.textContent = text;
      onDone?.();
      return;
    }
    const o = { n: 0 };
    const tw = gsap.to(o, {
      n: text.length,
      duration: Math.min(3.4, text.length / 70),
      ease: "none",
      onUpdate: () => {
        el.textContent = text.slice(0, Math.round(o.n));
        onTick?.();
      },
      onComplete: () => onDone?.(),
    });
    return () => tw.kill();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} />;
}

function ChatMessage({ msg, onTick, onDone }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: 14,
        scale: 0.94,
        opacity: 0,
        duration: 0.45,
        ease: "back.out(1.8)",
        transformOrigin: msg.from === "user" ? "100% 100%" : "0% 100%",
      });
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (msg.from === "typing") {
    return (
      <div className="paq-row bot" ref={ref}>
        <span className="paq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="paq-bubble bot paq-typing"
          aria-label="Assistant is typing"
        >
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  if (msg.from === "user") {
    return (
      <div className="paq-row user" ref={ref}>
        <div className="paq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="paq-row bot" ref={ref}>
      <span className="paq-bot-av" aria-hidden>
        N
      </span>
      <div className="paq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="paq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function PerformanceFaqSection() {
  const idRef = useRef(1);
  const greeting = () => ({
    id: 0,
    from: "bot",
    text: FAQ_GREETING,
    animate: false,
  });
  const [messages, setMessages] = useState(() => [greeting()]);
  const [asked, setAsked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");

  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const timers = useRef([]);
  const busyRef = useRef(false);
  const askRef = useRef(null);
  const reduceRef = useRef(false);

  const nid = () => idRef.current++;

  const scrollBottom = (smooth) => {
    const b = bodyRef.current;
    if (!b) return;
    if (smooth)
      gsap.to(b, {
        scrollTop: b.scrollHeight,
        duration: 0.45,
        ease: "power2.out",
      });
    else b.scrollTop = b.scrollHeight;
  };

  useEffect(() => {
    scrollBottom(true);
  }, [messages]);

  const ask = (text, idx = null) => {
    const clean = text.trim();
    if (!clean || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);

    const match = idx ?? matchFaq(clean);
    if (match >= 0) setAsked((a) => (a.includes(match) ? a : [...a, match]));

    setMessages((m) => [...m, { id: nid(), from: "user", text: clean }]);

    const typingId = nid();
    timers.current.push(
      setTimeout(
        () => setMessages((m) => [...m, { id: typingId, from: "typing" }]),
        380,
      ),
    );
    timers.current.push(
      setTimeout(
        () => {
          const reply =
            match >= 0
              ? {
                  id: nid(),
                  from: "bot",
                  text: FAQS[match].a,
                  animate: !reduceRef.current,
                }
              : {
                  id: nid(),
                  from: "bot",
                  text: FAQ_FALLBACK,
                  animate: !reduceRef.current,
                  cta: { label: "Book a Free Demo", href: "/contact-us" },
                };
          setMessages((m) => [...m.filter((x) => x.id !== typingId), reply]);
        },
        1200 + Math.random() * 500,
      ),
    );
  };
  askRef.current = ask;

  const onBotDone = () => {
    busyRef.current = false;
    setBusy(false);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    busyRef.current = false;
    setBusy(false);
    setAsked([]);
    setMessages([greeting()]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (busy || !input.trim()) return;
    ask(input);
    setInput("");
  };

  // Section reveal + auto-ask the first question when it comes into view
  useLayoutEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".js-faq-reveal"), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(q(".paq-chat"), {
        y: 60,
        rotationX: 12,
        opacity: 0,
        transformPerspective: 1200,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 55%",
        once: true,
        onEnter: () => {
          timers.current.push(
            setTimeout(() => askRef.current?.(FAQS[0].q, 0), 900),
          );
        },
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="paq" ref={sectionRef} aria-labelledby="paq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="pam-container paq-grid">
        <div className="paq-left">
          <span className="paq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="paq-title" className="paq-title js-faq-reveal">
            Performance &amp; Appraisal Management –{" "}
            <span className="pam-grad">FAQs</span>
          </h2>
          <p className="paq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="paq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`paq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="paq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="paq-q-text">{f.q}</span>
                  <span className="paq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="paq-chat">
          <div className="paq-chat-head">
            <span className="paq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="paq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="paq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="paq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="paq-suggest" aria-label="Suggested questions">
            {FAQS.map((f, i) =>
              asked.includes(i) ? null : (
                <button
                  key={f.q}
                  type="button"
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  {f.q}
                </button>
              ),
            )}
          </div>

          <form className="paq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about goals, reviews or feedback…"
              aria-label="Type your question"
              maxLength={160}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
            >
              <Icon name="send" size={16} />
            </button>
          </form>
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
      <GrowthClimbSection />
      <PerformanceFaqSection />
    </div>
  );
}
