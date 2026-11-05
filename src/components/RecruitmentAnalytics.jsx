// RecruitmentAnalytics.jsx
// NGriffinpay — Product inner page: "Recruitment & Analytics"
// (Job Posting · Applicant Tracking · Interview Scheduling · Hiring Analytics)
// Section 1: Hero banner (live Hiring app on the left, content on the right)
// Section 2: Hiring Funnel — a 3D funnel where candidates drop through each stage (GSAP)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)
// NOTE: all wording and numbers below are placeholder copy — replace them when the client sends the final content.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./RecruitmentAnalytics.css";
import { openDemo } from "./DemoModal";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Job Posting",
    short: "Jobs",
    desc: "Create a job once and publish it to your careers page and job boards in one click.",
    icon: "megaphone",
  },
  {
    title: "Applicant Tracking",
    short: "Candidates",
    desc: "See every applicant in one pipeline — screen, shortlist and move them forward fast.",
    icon: "users",
  },
  {
    title: "Interview Scheduling",
    short: "Interviews",
    desc: "Book panels, send invites and collect scorecards without the back-and-forth.",
    icon: "calendar",
  },
  {
    title: "Hiring Analytics",
    short: "Analytics",
    desc: "Track time-to-hire, best sources and offer acceptance on live dashboards.",
    icon: "chart",
  },
];

const STAGE_TIME = 5.5;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    case "megaphone":
      return (
        <svg {...p}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
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
          <path d="M7 15v3M12 10v8M17 6v12" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "video":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="m22 8-6 4 6 4z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
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
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "star":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    case "trend":
      return (
        <svg {...p}>
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </svg>
      );
    case "filter":
      return (
        <svg {...p}>
          <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...p}>
          <path d="m11 17 2 2a1 1 0 1 0 3-3" />
          <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
          <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" />
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

// 1 — Job Posting: publish one job everywhere
const JOB_TITLE = "Senior Accountant";
const CHANNELS = [
  { name: "Careers page", icon: "globe" },
  { name: "LinkedIn", icon: "briefcase" },
  { name: "Naukri", icon: "search" },
  { name: "Employee referrals", icon: "users" },
];
function JobPanel({ delay }) {
  const titleRef = useRef(null);
  const appsRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const st = { n: 0 };
    tl.to(
      st,
      {
        n: JOB_TITLE.length,
        duration: 0.8,
        ease: "none",
        onUpdate: () =>
          titleRef.current &&
          (titleRef.current.textContent = JOB_TITLE.slice(0, Math.round(st.n))),
      },
      0.35,
    );
    tl.from(
      q(".rca-meta span"),
      {
        scale: 0.7,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.3,
        ease: "back.out(2)",
      },
      1,
    );
    q(".rca-chan").forEach((el, i) =>
      tl.call(() => el.classList.add("is-live"), null, 1.5 + i * 0.3),
    );
    const a = { v: 0 };
    tl.to(
      a,
      {
        v: 48,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () =>
          appsRef.current && (appsRef.current.textContent = Math.round(a.v)),
      },
      2.4,
    );
    tl.from(
      q(".rca-spark i"),
      { scaleY: 0, stagger: 0.06, duration: 0.4, ease: "back.out(2)" },
      2.4,
    );
  }, delay);

  return (
    <div className="rca-panel" ref={ref}>
      <div className="rca-head js-in">
        <Icon name="megaphone" /> New job opening{" "}
        <em className="rca-tag">Draft → Live</em>
      </div>
      <div className="rca-job js-in">
        <b className="rca-job-title">
          <span ref={titleRef} />
          <i className="rca-caret" />
        </b>
        <div className="rca-meta">
          <span>
            <Icon name="pin" size={10} /> Bengaluru
          </span>
          <span>
            <Icon name="briefcase" size={10} /> Full-time
          </span>
          <span>4–6 yrs</span>
          <span>₹8–12 LPA</span>
        </div>
      </div>
      <small className="rca-sub js-in">Publishing to</small>
      <div className="rca-chans">
        {CHANNELS.map((c) => (
          <div key={c.name} className="rca-chan js-in">
            <span className="rca-chan-ic">
              <Icon name={c.icon} size={12} />
            </span>
            <span className="rca-chan-name">{c.name}</span>
            <span className="rca-chan-st">
              <i className="a">Queued</i>
              <i className="b">
                <Icon name="check" size={9} /> Live
              </i>
            </span>
          </div>
        ))}
      </div>
      <div className="rca-apps js-in">
        <div>
          <small>Applications · first 48 hrs</small>
          <b>
            <span ref={appsRef}>0</span>
          </b>
        </div>
        <span className="rca-spark" aria-hidden>
          {[30, 45, 38, 62, 55, 80, 100].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </span>
      </div>
    </div>
  );
}

// 2 — Applicant Tracking: AI-style match scores + shortlist
const CANDIDATES = [
  { av: "AK", name: "Ananya K.", exp: "5 yrs · Tally, GST", score: 92, c: "b" },
  { av: "RS", name: "Rohit S.", exp: "6 yrs · SAP FICO", score: 84, c: "c" },
  { av: "MJ", name: "Meera J.", exp: "4 yrs · Payroll", score: 71, c: "a" },
  { av: "VN", name: "Vikram N.", exp: "2 yrs · Audit", score: 48, c: "d" },
];
function PipelinePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".rca-cand-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: CANDIDATES[i].score / 100,
          duration: 0.8,
          ease: "power3.out",
        },
        0.5 + i * 0.12,
      ),
    );
    q(".rca-cand-score").forEach((el, i) => {
      const s = { v: 0 };
      tl.to(
        s,
        {
          v: CANDIDATES[i].score,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = `${Math.round(s.v)}%`),
        },
        0.5 + i * 0.12,
      );
    });
    tl.call(() => q(".rca-cand")[0]?.classList.add("is-short"), null, 1.6);
    tl.call(() => q(".rca-cand")[1]?.classList.add("is-short"), null, 1.9);
    tl.call(() => q(".rca-cand")[3]?.classList.add("is-rej"), null, 2.2);
    tl.from(q(".rca-move"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.5);
  }, delay);

  return (
    <div className="rca-panel" ref={ref}>
      <div className="rca-head js-in">
        <Icon name="users" /> Senior Accountant · Applicants{" "}
        <em className="rca-tag">48 new</em>
      </div>
      <div className="rca-stages js-in">
        <span>
          Applied <b>48</b>
        </span>
        <span className="on">
          Screening <b>12</b>
        </span>
        <span>
          Interview <b>5</b>
        </span>
        <span>
          Offer <b>1</b>
        </span>
      </div>
      <div className="rca-cands">
        {CANDIDATES.map((c) => (
          <div key={c.av} className="rca-cand js-in">
            <span className={`rca-av sm ${c.c}`}>{c.av}</span>
            <span className="rca-cand-txt">
              <b>{c.name}</b>
              <small>{c.exp}</small>
            </span>
            <span className="rca-cand-bar">
              <i />
            </span>
            <b className="rca-cand-score">0%</b>
            <span className="rca-cand-flag">
              <i className="ok">
                <Icon name="check" size={9} /> Shortlisted
              </i>
              <i className="no">
                <Icon name="x" size={9} /> Not a fit
              </i>
            </span>
          </div>
        ))}
      </div>
      <div className="rca-move">
        <span className="rca-move-ic">
          <Icon name="filter" size={13} />
        </span>
        <div>
          <b>2 candidates moved to Interview</b>
          <small>Resumes parsed automatically · hiring manager notified</small>
        </div>
      </div>
    </div>
  );
}

// 3 — Interview Scheduling: pick a slot, invite, scorecard
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOTS = ["10:00", "12:00", "15:00"];
const BUSY = ["0-0", "1-1", "2-0", "3-2", "4-1"];
const PICK = "2-2";
function InterviewPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".rca-slot"),
      {
        scale: 0.6,
        autoAlpha: 0,
        stagger: { each: 0.02, from: "start" },
        duration: 0.25,
      },
      0.35,
    );
    tl.call(
      () => q(".rca-slot.pick")[0]?.classList.add("is-booked"),
      null,
      1.2,
    );
    tl.fromTo(
      q(".rca-slot.pick"),
      { scale: 1 },
      { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1 },
      1.2,
    );
    tl.from(q(".rca-invite"), { autoAlpha: 0, y: 12, duration: 0.4 }, 1.6);
    tl.from(
      q(".rca-invite span"),
      {
        scale: 0.6,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(2)",
      },
      1.9,
    );
    q(".rca-score-row").forEach((row, r) => {
      row
        .querySelectorAll(".rca-st")
        .forEach((s, i) =>
          tl.call(() => s.classList.add("on"), null, 2.4 + r * 0.25 + i * 0.07),
        );
    });
  }, delay);

  return (
    <div className="rca-panel" ref={ref}>
      <div className="rca-head js-in">
        <Icon name="calendar" /> Schedule · Ananya K.{" "}
        <em className="rca-tag">Round 2 · Panel</em>
      </div>
      <div className="rca-cal js-in">
        <span />
        {DAYS.map((d) => (
          <span key={d} className="rca-cal-d">
            {d}
          </span>
        ))}
        {SLOTS.map((s, si) => (
          <div key={s} className="rca-cal-row">
            <span className="rca-cal-t">{s}</span>
            {DAYS.map((d, di) => {
              const k = `${di}-${si}`;
              return (
                <span
                  key={k}
                  className={`rca-slot ${BUSY.includes(k) ? "busy" : ""} ${k === PICK ? "pick" : ""}`}
                >
                  {k === PICK ? (
                    <>
                      <Icon name="check" size={9} /> Booked
                    </>
                  ) : BUSY.includes(k) ? (
                    "Busy"
                  ) : (
                    ""
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="rca-invite">
        <span>
          <Icon name="video" size={10} /> Video link added
        </span>
        <span>
          <Icon name="send" size={10} /> Invite sent to 3
        </span>
        <span>
          <Icon name="clock" size={10} /> Wed · 3:00 PM
        </span>
      </div>
      <div className="rca-score js-in">
        <small>Scorecard</small>
        {["Accounting skills", "Communication", "Culture fit"].map((l, r) => (
          <div key={l} className="rca-score-row">
            <span>{l}</span>
            <span className="rca-stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <i
                  key={i}
                  className={`rca-st ${i < [5, 4, 4][r] ? "" : "skip"}`}
                >
                  <Icon name="star" size={11} />
                </i>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4 — Hiring Analytics: KPIs + source chart
const SOURCES = [
  { name: "Referrals", v: 34 },
  { name: "LinkedIn", v: 26 },
  { name: "Careers page", v: 22 },
  { name: "Job boards", v: 18 },
];
function AnalyticsPanel({ delay }) {
  const tthRef = useRef(null);
  const accRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const a = { v: 40 };
    tl.to(
      a,
      {
        v: 18,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () =>
          tthRef.current && (tthRef.current.textContent = Math.round(a.v)),
      },
      0.5,
    );
    const b = { v: 0 };
    tl.to(
      b,
      {
        v: 86,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () =>
          accRef.current && (accRef.current.textContent = Math.round(b.v)),
      },
      0.5,
    );
    q(".rca-src-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: SOURCES[i].v / 34, duration: 0.8, ease: "power3.out" },
        0.9 + i * 0.1,
      ),
    );
    tl.fromTo(
      q(".rca-line path"),
      { strokeDashoffset: 300 },
      { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" },
      0.7,
    );
    tl.from(q(".rca-insight"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.1);
  }, delay);

  return (
    <div className="rca-panel" ref={ref}>
      <div className="rca-head js-in">
        <Icon name="chart" /> Hiring dashboard{" "}
        <em className="rca-tag">Last 90 days</em>
      </div>
      <div className="rca-kpis">
        <div className="rca-kpi js-in">
          <small>Avg. time-to-hire</small>
          <b>
            <span ref={tthRef}>40</span> days
          </b>
          <em className="good">
            <Icon name="trend" size={10} /> 22 days faster
          </em>
        </div>
        <div className="rca-kpi js-in">
          <small>Offer acceptance</small>
          <b>
            <span ref={accRef}>0</span>%
          </b>
          <em className="good">
            <Icon name="trend" size={10} /> +9 pts
          </em>
        </div>
      </div>
      <div className="rca-chart js-in">
        <small>Hires by month</small>
        <svg
          className="rca-line"
          viewBox="0 0 220 60"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="rcaArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d6fd8" stopOpacity="0.25" />
              <stop offset="1" stopColor="#1d6fd8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 50 L37 44 L73 46 L110 30 L147 34 L183 18 L220 8 L220 60 L0 60 Z"
            fill="url(#rcaArea)"
            stroke="none"
          />
          <path
            d="M0 50 L37 44 L73 46 L110 30 L147 34 L183 18 L220 8"
            fill="none"
            stroke="#1d6fd8"
            strokeWidth="2.4"
            strokeDasharray="300"
          />
        </svg>
      </div>
      <div className="rca-srcs js-in">
        <small>Best hiring sources</small>
        {SOURCES.map((s) => (
          <div key={s.name} className="rca-src">
            <span>{s.name}</span>
            <span className="rca-src-bar">
              <i />
            </span>
            <b>{s.v}%</b>
          </div>
        ))}
      </div>
      <div className="rca-insight">
        <Icon name="spark" size={12} /> Referrals hire 2× faster — consider a
        referral bonus.
      </div>
    </div>
  );
}

const PANELS = [JobPanel, PipelinePanel, InterviewPanel, AnalyticsPanel];

/* ------------------------------------------------------------------ */
/* Hiring app (left side)                                              */
/* ------------------------------------------------------------------ */

const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;
const TODAY = [
  { icon: "video", text: "11:00 · Ananya K." },
  { icon: "video", text: "15:00 · Rohit S." },
  { icon: "handshake", text: "Offer · Meera J." },
];

function HiringApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const ringRef = useRef(null);
  const scoreRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // positions filled ring counts up once
  useEffect(() => {
    const st = { v: 0 };
    const tw = gsap.to(st, {
      v: 68,
      duration: prefersReduced() ? 0 : 1.6,
      delay: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        if (scoreRef.current) scoreRef.current.textContent = Math.round(st.v);
        if (ringRef.current)
          ringRef.current.style.strokeDashoffset = RING_C * (1 - st.v / 100);
      },
    });
    return () => tw.kill();
  }, []);

  // Mobile: keep the active tab visible in the scrolling tab row
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[stage];
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
    <div className="rca-frame" ref={frameRef}>
      <div className="rca-chrome">
        <span className="rca-dot r" />
        <span className="rca-dot y" />
        <span className="rca-dot g" />
        <div className="rca-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/recruitment
        </div>
      </div>

      <div className="rca-topbar js-top">
        <span className="rca-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinpay" />
        </span>
        <b>Admin</b>
        <span className="rca-search">
          <Icon name="search" size={12} /> Search jobs or candidates…
        </span>
        <span className="rca-av sm a">PR</span>
      </div>

      <div className="rca-app">
        <div className="rca-main">
          <div
            className="rca-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Recruitment features"
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
                <Icon name={f.icon} size={11} /> {f.short}
              </button>
            ))}
          </div>
          <div className="rca-panel-wrap" ref={panelWrap}>
            <Panel key={stage} delay={startDelay} />
          </div>
        </div>

        <aside className="rca-side js-side">
          <small className="rca-side-lbl">Positions filled</small>
          <div className="rca-ring">
            <svg viewBox="0 0 72 72" aria-hidden>
              <circle cx="36" cy="36" r={RING_R} className="rca-ring-bg" />
              <circle
                ref={ringRef}
                cx="36"
                cy="36"
                r={RING_R}
                className="rca-ring-fill"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C}
              />
            </svg>
            <span>
              <b>
                <span ref={scoreRef}>0</span>%
              </b>
              <small>17 of 25 roles</small>
            </span>
          </div>
          <small className="rca-side-lbl">Today</small>
          <div className="rca-today">
            {TODAY.map((t) => (
              <span key={t.text}>
                <Icon name={t.icon} size={11} /> {t.text}
              </span>
            ))}
          </div>
        </aside>
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

  // Auto-advance through the 4 features
  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (prefersReduced()) return undefined;
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
      tl.from(q(".js-top"), { y: -12, opacity: 0, duration: 0.45 }, 0.55);
      tl.from(q(".js-side"), { x: 16, opacity: 0, duration: 0.5 }, 0.65);
      tl.from(q(".js-tabs"), { y: -10, opacity: 0, duration: 0.45 }, 0.75);
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
        return undefined;
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
      return undefined;
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="rca-hero"
      ref={sectionRef}
      aria-labelledby="rca-hero-title"
    >
      <div className="rca-hero-bg" aria-hidden>
        <span className="rca-blob b1 js-blob" />
        <span className="rca-blob b2 js-blob" />
        <span className="rca-grid-bg" />
      </div>

      <div className="rca-container rca-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="rca-content">
          <span className="rca-eyebrow js-reveal">
            <span className="rca-live-dot" /> From job post to offer letter
          </span>
          <h1 id="rca-hero-title" className="rca-title js-reveal">
            <span className="rca-grad">Recruitment</span> &amp; Analytics
          </h1>

          <ul
            className="rca-feats"
            role="tablist"
            aria-label="Recruitment features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`rca-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="rca-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="rca-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="rca-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: Hiring app */}
        <div className="rca-visual" ref={visualRef}>
          <HiringApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="rca-float f1 js-float">
            <span className="rca-float-ic ok">
              <Icon name="users" size={14} />
            </span>
            <div>
              <strong>312 applicants this month</strong>
              <small>From 6 sources, auto-parsed</small>
            </div>
          </div>
          <div className="rca-float f2 js-float">
            <span className="rca-float-ic pr">
              <Icon name="clock" size={14} />
            </span>
            <div>
              <strong>18 days time-to-hire</strong>
              <small>Down from 40 days</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Hiring Funnel                                           */
/* ------------------------------------------------------------------ */

const FUNNEL_STAGES = [
  {
    key: "Applied",
    icon: "file",
    days: 0,
    desc: "Applications arrive from your careers page, job boards and referrals — every resume is parsed into a clean profile automatically.",
  },
  {
    key: "Screened",
    icon: "filter",
    days: 4,
    desc: "Match scores and knockout questions shortlist the best-fit profiles in minutes, so recruiters only read the resumes that matter.",
  },
  {
    key: "Interviewed",
    icon: "video",
    days: 7,
    desc: "Panels are booked from shared calendars, candidates get reminders, and every interviewer fills a structured scorecard.",
  },
  {
    key: "Offered",
    icon: "send",
    days: 5,
    desc: "Offer letters are generated from approved templates, signed off online and sent for e-signature in one flow.",
  },
  {
    key: "Hired",
    icon: "handshake",
    days: 2,
    desc: "Accepted offers flow straight into onboarding and the employee record — no re-typing, nothing lost between teams.",
  },
];

const ROLE_DATA = {
  "All roles": [480, 210, 64, 18, 15],
  Engineering: [220, 90, 28, 8, 7],
  Sales: [140, 70, 20, 6, 5],
  Finance: [70, 30, 10, 3, 2],
  Operations: [50, 20, 6, 1, 1],
};
const ROLES = Object.keys(ROLE_DATA);
const FUNNEL_TIME = 5;

// funnel geometry (SVG units)
const FW = 420;
const CX = FW / 2;
const EDGES = [380, 310, 244, 182, 126, 84]; // width at each layer boundary
const LAYER_H = 70;
const LAYER_GAP = 14;
const TOP = 36;
const layerY = (i) => TOP + i * (LAYER_H + LAYER_GAP);
const FH = layerY(5) + 60;
const widthAt = (y) => {
  for (let i = 0; i < 5; i += 1) {
    const y0 = layerY(i);
    const y1 = y0 + LAYER_H;
    if (y <= y1)
      return (
        EDGES[i] + (EDGES[i + 1] - EDGES[i]) * Math.max(0, (y - y0) / LAYER_H)
      );
  }
  return EDGES[5];
};
// where each candidate dot leaves the funnel (-1 = hired)
const DOT_EXITS = [
  0, 0, 1, 0, 2, 0, 1, 0, -1, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, -1, 0, 1, 0, 0,
];

function HiringFunnelSection() {
  const [role, setRole] = useState(ROLES[0]);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const countRefs = useRef([]);
  const shown = useRef([...ROLE_DATA[ROLES[0]]]);
  const chipsRef = useRef(null);
  const cardRef = useRef(null);

  const data = ROLE_DATA[role];
  const conv = (i) =>
    i === 0 ? 100 : Math.round((data[i] / data[i - 1]) * 100);
  const S = FUNNEL_STAGES[stage];

  // play only while on screen + section reveal
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (s) => setInView(s.isActive),
    });
    if (prefersReduced()) return () => st.kill();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".js-ra2-reveal"), {
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(q(".ra2-layer"), {
        scaleX: 0.3,
        opacity: 0,
        transformOrigin: "50% 50%",
        stagger: 0.1,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.from(q(".ra2-stage"), {
        x: 30,
        opacity: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => {
      st.kill();
      ctx.revert();
    };
  }, []);

  // candidate dots falling through the funnel
  useLayoutEffect(() => {
    if (prefersReduced() || !svgRef.current) return undefined;
    const ctx = gsap.context(() => {
      svgRef.current.querySelectorAll(".ra2-dot").forEach((dot, i) => {
        const exit = DOT_EXITS[i % DOT_EXITS.length];
        const off = ((i * 37) % 100) / 100 - 0.5; // -0.5..0.5 across the width
        const last = exit < 0 ? 4 : exit;
        const tl = gsap.timeline({
          repeat: -1,
          delay: i * 0.42,
          repeatDelay: 1.2 + (i % 4) * 0.5,
        });
        const startY = TOP - 26;
        tl.set(dot, {
          attr: { cx: CX + off * EDGES[0] * 0.8, cy: startY, r: 4.2 },
          opacity: 0,
          fill: "#7dd3fc",
        });
        tl.to(dot, { opacity: 1, duration: 0.2 });
        for (let s = 0; s <= last; s += 1) {
          const y = layerY(s) + LAYER_H * 0.55;
          tl.to(dot, {
            attr: { cx: CX + off * widthAt(y) * 0.8, cy: y },
            duration: 0.55,
            ease: "power1.in",
          });
        }
        if (exit >= 0) {
          const y = layerY(exit) + LAYER_H * 0.55;
          const side = off < 0 ? -1 : 1;
          tl.to(dot, { fill: "#94a3b8", duration: 0.15 });
          tl.to(dot, {
            attr: { cx: CX + side * (widthAt(y) / 2 + 34), cy: y + 18 },
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        } else {
          tl.to(dot, {
            attr: { cx: CX + off * 30, cy: FH - 26, r: 6 },
            fill: "#34d399",
            duration: 0.5,
            ease: "bounce.out",
          });
          tl.to(dot, { opacity: 0, duration: 0.4, delay: 0.6 });
        }
      });
      gsap.to(".ra2-hired-glow", {
        scale: 1.25,
        opacity: 0.25,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  // role change → count numbers in the funnel
  useEffect(() => {
    const from = { ...shown.current };
    const target = ROLE_DATA[role];
    const o = { p: 0 };
    const tw = gsap.to(o, {
      p: 1,
      duration: prefersReduced() ? 0 : 0.8,
      ease: "power2.out",
      onUpdate: () => {
        target.forEach((t, i) => {
          const v = Math.round(from[i] + (t - from[i]) * o.p);
          shown.current[i] = v;
          if (countRefs.current[i]) countRefs.current[i].textContent = v;
        });
      },
    });
    // keep the active role chip in view on phones
    const strip = chipsRef.current;
    const chip = strip?.querySelector(".is-on");
    if (strip && chip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: Math.max(
          0,
          chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
        ),
        behavior: prefersReduced() ? "auto" : "smooth",
      });
    }
    return () => tw.kill();
  }, [role]);

  // auto-advance stages while visible
  useEffect(() => {
    if (!inView || paused || prefersReduced()) return undefined;
    const dc = gsap.delayedCall(FUNNEL_TIME, () =>
      setStage((s) => (s + 1) % FUNNEL_STAGES.length),
    );
    return () => dc.kill();
  }, [stage, inView, paused]);

  // detail card swap
  useEffect(() => {
    if (prefersReduced() || !cardRef.current) return;
    gsap.fromTo(
      cardRef.current.children,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power3.out" },
    );
  }, [stage, role]);

  const pickStage = (i) => {
    setStage(i);
    setPaused(true);
  };

  const ratio = Math.round(data[0] / Math.max(1, data[4]));
  const accept = Math.round((data[4] / Math.max(1, data[3])) * 100);
  const totalDays = FUNNEL_STAGES.reduce((n, s) => n + s.days, 0);

  return (
    <section
      className="ra2"
      ref={sectionRef}
      id="rca-next"
      aria-labelledby="ra2-title"
    >
      <div className="ra2-bg" aria-hidden>
        <span className="ra2-glow g1" />
        <span className="ra2-glow g2" />
        <span className="ra2-stars" />
      </div>
      <div className="rca-container">
        <div className="ra2-head">
          <span className="ra2-eyebrow js-ra2-reveal">
            <Icon name="filter" size={13} /> Hiring funnel
          </span>
          <h2 id="ra2-title" className="ra2-title js-ra2-reveal">
            Watch every candidate move from{" "}
            <span className="rca-grad">application to offer</span>
          </h2>
        </div>

        <div
          className="ra2-roles js-ra2-reveal"
          ref={chipsRef}
          role="tablist"
          aria-label="Filter by role"
        >
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={role === r}
              className={`ra2-role ${role === r ? "is-on" : ""}`}
              onClick={() => setRole(r)}
            >
              {r} <em>{ROLE_DATA[r][0]}</em>
            </button>
          ))}
        </div>

        <div className="ra2-grid">
          {/* Funnel */}
          <div className="ra2-funnel-wrap">
            <svg
              ref={svgRef}
              className="ra2-funnel"
              viewBox={`0 0 ${FW} ${FH}`}
              role="img"
              aria-label={`Hiring funnel for ${role}`}
            >
              <defs>
                <linearGradient id="ra2Body" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#0a3f83" />
                  <stop offset="0.45" stopColor="#1d6fd8" />
                  <stop offset="1" stopColor="#0a2d63" />
                </linearGradient>
                <linearGradient id="ra2BodyOn" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#1d6fd8" />
                  <stop offset="0.45" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#1557ad" />
                </linearGradient>
                <radialGradient id="ra2Hired" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#34d399" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#34d399" stopOpacity="0" />
                </radialGradient>
              </defs>

              {FUNNEL_STAGES.map((s, i) => {
                const y0 = layerY(i);
                const y1 = y0 + LAYER_H;
                const t = EDGES[i] / 2;
                const b = EDGES[i + 1] / 2;
                const on = stage === i;
                return (
                  <g
                    key={s.key}
                    className={`ra2-layer ${on ? "is-on" : ""}`}
                    onClick={() => pickStage(i)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d={`M${CX - t} ${y0} L${CX + t} ${y0} L${CX + b} ${y1} Q${CX} ${y1 + 14} ${CX - b} ${y1} Z`}
                      fill={on ? "url(#ra2BodyOn)" : "url(#ra2Body)"}
                      className="ra2-body"
                    />
                    <ellipse
                      cx={CX}
                      cy={y0}
                      rx={t}
                      ry={11}
                      className="ra2-rim"
                    />
                    <text
                      x={CX}
                      y={y0 + 34}
                      className="ra2-count"
                      ref={(el) => (countRefs.current[i] = el)}
                    >
                      {shown.current[i]}
                    </text>
                    <text x={CX} y={y0 + 52} className="ra2-label">
                      {s.key}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={CX}
                cy={FH - 26}
                r="40"
                fill="url(#ra2Hired)"
                className="ra2-hired-glow"
              />
              {DOT_EXITS.map((_, i) => (
                <circle
                  key={i}
                  className="ra2-dot"
                  cx={CX}
                  cy={TOP - 26}
                  r="4"
                  opacity="0"
                />
              ))}
            </svg>
            <div className="ra2-legend">
              <span>
                <i className="in" /> Candidate
              </span>
              <span>
                <i className="out" /> Dropped
              </span>
              <span>
                <i className="hire" /> Hired
              </span>
            </div>
          </div>

          {/* Stages + detail */}
          <div
            className="ra2-side"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <ol className="ra2-stages">
              {FUNNEL_STAGES.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    className={`ra2-stage ${stage === i ? "is-on" : ""}`}
                    onClick={() => pickStage(i)}
                    aria-pressed={stage === i}
                  >
                    <span className="ra2-stage-ic">
                      <Icon name={s.icon} size={15} />
                    </span>
                    <span className="ra2-stage-name">{s.key}</span>
                    <b>{data[i]}</b>
                    <em>{i === 0 ? "—" : `${conv(i)}%`}</em>
                  </button>
                </li>
              ))}
            </ol>

            <div className="ra2-card" ref={cardRef} key={`${stage}-${role}`}>
              <div className="ra2-card-top">
                <span className="ra2-card-ic">
                  <Icon name={S.icon} size={20} />
                </span>
                <div>
                  <small>
                    Stage {stage + 1} of 5 · {role}
                  </small>
                  <h3>{S.key}</h3>
                </div>
              </div>
              <p>{S.desc}</p>
              <div className="ra2-metrics">
                <div>
                  <b>{data[stage]}</b>
                  <small>candidates</small>
                </div>
                <div>
                  <b>{stage === 0 ? "100%" : `${conv(stage)}%`}</b>
                  <small>
                    {stage === 0 ? "of applicants" : "from last stage"}
                  </small>
                </div>
                <div>
                  <b>{S.days === 0 ? "Day 0" : `${S.days} days`}</b>
                  <small>avg. time here</small>
                </div>
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
    q: "What does Recruitment & Analytics in NGriffinpay include?",
    a: "It covers the full hiring cycle: job posting, applicant tracking, interview scheduling, offer letters and hiring analytics — and every hire flows straight into onboarding and the employee record.",
    keys: [
      "what is",
      "what does",
      "about",
      "overview",
      "explain",
      "include",
      "module",
      "feature",
      "recruitment",
    ],
  },
  {
    q: "Can I post one job to multiple job boards at once?",
    a: "Yes. Create the job once and publish it to your careers page, job boards and social channels in one click. Every application lands in the same pipeline, tagged with its source.",
    keys: [
      "post",
      "job board",
      "careers",
      "naukri",
      "linkedin",
      "indeed",
      "publish",
      "opening",
      "advert",
      "vacancy",
    ],
  },
  {
    q: "How does applicant tracking and screening work?",
    a: "Resumes are parsed automatically and each candidate gets a match score against the job. You can shortlist, reject or move candidates between stages, add notes and keep the hiring manager in the loop.",
    keys: [
      "applicant",
      "candidate",
      "track",
      "screen",
      "resume",
      "cv",
      "shortlist",
      "pipeline",
      "match",
      "ats",
    ],
  },
  {
    q: "How are interviews scheduled and evaluated?",
    a: "Pick a free slot from the panel's shared calendars, and invites with the video link go out automatically. After the interview, each panellist fills a structured scorecard so decisions are fair and fast.",
    keys: [
      "interview",
      "schedule",
      "calendar",
      "slot",
      "panel",
      "invite",
      "scorecard",
      "feedback",
      "evaluate",
    ],
  },
  {
    q: "What hiring analytics and reports do I get?",
    a: "Live dashboards show time-to-hire, conversion at every funnel stage, best hiring sources, offer acceptance and cost-per-hire — filterable by role, department and location, and exportable to Excel.",
    keys: [
      "analytics",
      "report",
      "dashboard",
      "time to hire",
      "time-to-hire",
      "metric",
      "source",
      "funnel",
      "cost",
      "insight",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about job posting, candidates, interviews or hiring reports.";
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
      <div className="raq-row bot" ref={ref}>
        <span className="raq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="raq-bubble bot raq-typing"
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
      <div className="raq-row user" ref={ref}>
        <div className="raq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="raq-row bot" ref={ref}>
      <span className="raq-bot-av" aria-hidden>
        N
      </span>
      <div className="raq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="raq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function RecruitmentFaqSection() {
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
      gsap.from(q(".raq-chat"), {
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
    <section className="raq" ref={sectionRef} aria-labelledby="raq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="rca-container raq-grid">
        <div className="raq-left">
          <span className="raq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="raq-title" className="raq-title js-faq-reveal">
            Recruitment &amp; Analytics – <span className="rca-grad">FAQs</span>
          </h2>
          <p className="raq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="raq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`raq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="raq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="raq-q-text">{f.q}</span>
                  <span className="raq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="raq-chat">
          <div className="raq-chat-head">
            <span className="raq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="raq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="raq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="raq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="raq-suggest" aria-label="Suggested questions">
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

          <form className="raq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jobs, candidates or reports…"
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

export default function RecruitmentAnalytics() {
  return (
    <div className="rca-page">
      <HeroSection />
      <HiringFunnelSection />
      <RecruitmentFaqSection />
    </div>
  );
}
