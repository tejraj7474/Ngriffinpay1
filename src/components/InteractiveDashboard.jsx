// InteractiveDashboard.jsx
// NGriffinpay — Product inner page: "Interactive Dashboard"
// Section 1: Hero banner (live dashboard on the left, content on the right)
// Section 2: Feature story (pinned scroll + three.js particle scene)
// Section 3: Interactive Dashboard, Instant Control (switches + phone)
// Section 4: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap three

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import * as THREE from "three";
import "./InteractiveDashboard.css";

gsap.registerPlugin(ScrollTrigger, Flip);

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const SIDEBAR = [
  { key: "dashboard", label: "Dashboard", icon: "grid" },
  { key: "employees", label: "Employees", icon: "users" },
  { key: "attendance", label: "Attendance", icon: "clock" },
  { key: "payroll", label: "Payroll", icon: "wallet" },
  { key: "leave", label: "Leave", icon: "calendar" },
  { key: "reports", label: "Reports", icon: "chart" },
];

const CHART_SETS = {
  payroll: {
    title: "Payroll cost",
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    values: [36.2, 37.9, 38.4, 40.1, 41.3, 42.6],
    format: (v) => `₹${v.toFixed(1)}L`,
  },
  attendance: {
    title: "Avg. attendance",
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    values: [93, 95, 91, 96, 94, 96],
    format: (v) => `${Math.round(v)}%`,
  },
  headcount: {
    title: "Headcount",
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    values: [212, 219, 226, 233, 241, 248],
    format: (v) => `${Math.round(v)}`,
  },
};

const DEPARTMENTS = [
  { name: "Engineering", pct: 42, color: "var(--ng-primary)" },
  { name: "Sales", pct: 23, color: "var(--ng-accent)" },
  { name: "Operations", pct: 20, color: "var(--ng-amber)" },
  { name: "HR & Admin", pct: 15, color: "var(--ng-pink)" },
];

const TREND = [91, 93, 92, 95, 94, 96, 93, 95, 97, 94, 96, 95, 97, 96];

const ACTIVITY_POOL = [
  { who: "Priya S.", what: "checked in", meta: "09:12 AM · Whitefield", tag: "in" },
  { who: "Rahul M.", what: "applied for leave", meta: "2 days · Casual", tag: "leave" },
  { who: "Payroll", what: "Oct salaries approved", meta: "248 employees", tag: "pay" },
  { who: "Anita R.", what: "submitted a claim", meta: "₹2,450 · Travel", tag: "claim" },
  { who: "Karthik V.", what: "checked in", meta: "09:18 AM · Remote", tag: "in" },
  { who: "Compliance", what: "PF challan generated", meta: "Due 15 Nov", tag: "pay" },
  { who: "Deepa N.", what: "joined Engineering", meta: "Onboarding started", tag: "join" },
];

const DONUT_R = 36;
const DONUT_C = 2 * Math.PI * DONUT_R;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function buildTrendPaths(values, w = 300, h = 90, min = 85, max = 100) {
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - 6 - ((v - min) / (max - min)) * (h - 16),
  ]);
  let line = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    line += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return { line, area, last: pts[pts.length - 1] };
}

const formatIN = (v, dec = 0) =>
  Number(v).toLocaleString("en-IN", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
    case "grid":
      return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
    case "users":
      return (<svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "clock":
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "wallet":
      return (<svg {...p}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M16 13h.01M2 10h20" /></svg>);
    case "calendar":
      return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
    case "chart":
      return (<svg {...p}><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>);
    case "search":
      return (<svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
    case "bell":
      return (<svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>);
    case "check":
      return (<svg {...p}><path d="M20 6 9 17l-5-5" /></svg>);
    case "arrow":
      return (<svg {...p}><path d="M5 12h14M13 5l7 7-7 7" /></svg>);
    case "play":
      return (<svg {...p}><polygon points="6 4 20 12 6 20 6 4" /></svg>);
    case "up":
      return (<svg {...p}><path d="m18 15-6-6-6 6" /></svg>);
    case "send":
      return (<svg {...p}><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></svg>);
    case "pulse":
      return (<svg {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>);
    case "sliders":
      return (<svg {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>);
    case "shield":
      return (<svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>);
    case "share":
      return (<svg {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>);
    case "sparkles":
      return (<svg {...p}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" /></svg>);
    case "drag":
      return (<svg {...p}><circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></svg>);
    case "lock":
      return (<svg {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
    case "download":
      return (<svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>);
    case "mail":
      return (<svg {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>);
    case "link":
      return (<svg {...p}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></svg>);
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Live dashboard mockup (left side)                                   */
/* ------------------------------------------------------------------ */

function LiveDashboard({ frameRef }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [chartKey, setChartKey] = useState("payroll");
  const [hoverBar, setHoverBar] = useState(null);
  const [present, setPresent] = useState(231);
  const [feed, setFeed] = useState(() =>
    ACTIVITY_POOL.slice(0, 3).map((a, i) => ({ ...a, id: i }))
  );
  const [synced, setSynced] = useState(0);

  const barRefs = useRef([]);
  const feedRef = useRef(null);
  const presentRef = useRef(null);
  const nextId = useRef(3);
  const poolIdx = useRef(3);
  const firstFeedRender = useRef(true);
  const introDone = useRef(false);
  const firstChartRun = useRef(true);

  const set = CHART_SETS[chartKey];
  const max = Math.max(...set.values) * 1.08;
  const trend = buildTrendPaths(TREND);

  // Re-animate bars when the dataset tab changes
  useEffect(() => {
    if (firstChartRun.current) {
      firstChartRun.current = false;
      return;
    }
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      gsap.to(bar, {
        height: `${(set.values[i] / max) * 100}%`,
        duration: 0.7,
        ease: "power3.out",
        delay: i * 0.04,
      });
    });
  }, [chartKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live data simulation: new activity + attendance ticking up
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const start = setTimeout(() => (introDone.current = true), 2600);

    const feedTimer = setInterval(() => {
      const item = ACTIVITY_POOL[poolIdx.current % ACTIVITY_POOL.length];
      poolIdx.current += 1;
      setFeed((f) => [{ ...item, id: nextId.current++ }, ...f].slice(0, 3));
      setSynced(0);
    }, 3800);

    const presentTimer = setInterval(() => {
      setPresent((p) => (p < 241 ? p + 1 : 231));
    }, 5200);

    const syncTimer = setInterval(() => setSynced((s) => s + 1), 1000);

    return () => {
      clearTimeout(start);
      clearInterval(feedTimer);
      clearInterval(presentTimer);
      clearInterval(syncTimer);
    };
  }, []);

  // Animate the newest activity row in
  useEffect(() => {
    if (firstFeedRender.current) {
      firstFeedRender.current = false;
      return;
    }
    const first = feedRef.current?.firstElementChild;
    if (first) {
      gsap.fromTo(
        first,
        { y: -16, opacity: 0, backgroundColor: "rgba(10,63,131,0.10)" },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
      );
      gsap.to(first, { backgroundColor: "rgba(10,63,131,0)", duration: 1.4, delay: 0.5 });
    }
  }, [feed]);

  // Pulse the "present today" number when it changes
  useEffect(() => {
    if (!introDone.current || !presentRef.current) return;
    presentRef.current.textContent = formatIN(present);
    gsap.fromTo(
      presentRef.current,
      { color: "var(--ng-accent)", scale: 1.12 },
      { color: "var(--ng-ink)", scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [present]);

  let donutOffset = 0;

  return (
    <div className="idp-frame" ref={frameRef}>
      {/* Browser chrome */}
      <div className="idp-chrome">
        <span className="idp-dot r" />
        <span className="idp-dot y" />
        <span className="idp-dot g" />
        <div className="idp-url">
          <span className="idp-lock" aria-hidden>🔒</span> app.ngriffinpay.in/dashboard
        </div>
        <div className="idp-live">
          <span className="idp-live-dot" /> Live
        </div>
      </div>

      <div className="idp-app">
        {/* Sidebar */}
        <aside className="idp-side">
          <div className="idp-side-logo">
            <span className="idp-logo-mark">N</span>
            <span>NGriffinpay</span>
          </div>
          <nav className="idp-side-nav">
            {SIDEBAR.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`idp-side-item js-side ${activeNav === s.key ? "is-active" : ""}`}
                onClick={() => setActiveNav(s.key)}
              >
                <Icon name={s.icon} />
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
          <div className="idp-side-card js-side">
            <small>Next payroll run</small>
            <strong>31 Oct</strong>
            <div className="idp-progress"><span style={{ width: "78%" }} /></div>
            <small>78% inputs locked</small>
          </div>
        </aside>

        {/* Main */}
        <div className="idp-main">
          <div className="idp-top js-top">
            <div>
              <p className="idp-hello">Good morning, Admin 👋</p>
              <p className="idp-sub">
                Synced {synced < 2 ? "just now" : `${synced}s ago`} · Tue, 27 Oct
              </p>
            </div>
            <div className="idp-top-right">
              <div className="idp-search"><Icon name="search" size={12} /> Search employee…</div>
              <span className="idp-bell"><Icon name="bell" size={13} /><i /></span>
              <span className="idp-avatar">AD</span>
            </div>
          </div>

          {/* KPIs */}
          <div className="idp-kpis">
            <div className="idp-kpi js-kpi">
              <span className="idp-kpi-label">Total employees</span>
              <strong className="idp-kpi-val"><span className="js-count" data-target="248">0</span></strong>
              <span className="idp-kpi-trend up"><Icon name="up" size={10} /> 12 this month</span>
            </div>
            <div className="idp-kpi js-kpi">
              <span className="idp-kpi-label">Present today</span>
              <strong className="idp-kpi-val">
                <span className="js-count idp-present" data-target="231" ref={presentRef}>0</span>
                <em>/248</em>
              </strong>
              <span className="idp-kpi-trend up">{((present / 248) * 100).toFixed(1)}% on time</span>
            </div>
            <div className="idp-kpi js-kpi">
              <span className="idp-kpi-label">Payroll · Oct</span>
              <strong className="idp-kpi-val">₹<span className="js-count" data-target="42.6" data-dec="1">0</span>L</strong>
              <span className="idp-kpi-trend ok"><Icon name="check" size={10} /> Processed</span>
            </div>
            <div className="idp-kpi js-kpi">
              <span className="idp-kpi-label">Pending approvals</span>
              <strong className="idp-kpi-val"><span className="js-count" data-target="7">0</span></strong>
              <span className="idp-kpi-trend warn">3 leave · 4 claims</span>
            </div>
          </div>

          {/* Charts row */}
          <div className="idp-row">
            <div className="idp-card idp-bars-card js-card">
              <div className="idp-card-head">
                <h4>{set.title}</h4>
                <div className="idp-tabs" role="tablist" aria-label="Chart dataset">
                  {Object.keys(CHART_SETS).map((k) => (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={chartKey === k}
                      className={chartKey === k ? "is-active" : ""}
                      onClick={() => setChartKey(k)}
                    >
                      {k[0].toUpperCase() + k.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="idp-bars">
                {set.values.map((v, i) => (
                  <div
                    className="idp-bar-col"
                    key={i}
                    onMouseEnter={() => setHoverBar(i)}
                    onMouseLeave={() => setHoverBar(null)}
                  >
                    <div className="idp-bar-track">
                      {hoverBar === i && <span className="idp-tip">{set.format(v)}</span>}
                      <div
                        className={`idp-bar js-bar ${i === set.values.length - 1 ? "is-current" : ""}`}
                        ref={(el) => (barRefs.current[i] = el)}
                        data-h={`${(v / max) * 100}%`}
                      />
                    </div>
                    <span className="idp-bar-label">{set.labels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="idp-card idp-donut-card js-card">
              <div className="idp-card-head"><h4>By department</h4></div>
              <div className="idp-donut-wrap">
                <svg viewBox="0 0 100 100" className="idp-donut">
                  <circle cx="50" cy="50" r={DONUT_R} className="idp-donut-bg" />
                  {DEPARTMENTS.map((d) => {
                    const len = (d.pct / 100) * DONUT_C;
                    const el = (
                      <circle
                        key={d.name}
                        cx="50"
                        cy="50"
                        r={DONUT_R}
                        className="idp-donut-seg js-donut"
                        stroke={d.color}
                        strokeDasharray={`${len - 1.5} ${DONUT_C - len + 1.5}`}
                        strokeDashoffset={-donutOffset}
                        data-len={len - 1.5}
                      />
                    );
                    donutOffset += len;
                    return el;
                  })}
                </svg>
                <div className="idp-donut-center">
                  <strong>248</strong>
                  <small>people</small>
                </div>
              </div>
              <ul className="idp-legend">
                {DEPARTMENTS.map((d) => (
                  <li key={d.name}>
                    <i style={{ background: d.color }} /> {d.name} <b>{d.pct}%</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="idp-row idp-row-b">
            <div className="idp-card js-card">
              <div className="idp-card-head">
                <h4>Attendance · last 14 days</h4>
                <span className="idp-chip">96% today</span>
              </div>
              <svg viewBox="0 0 300 90" className="idp-trend" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="idpArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--ng-primary)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--ng-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[20, 45, 70].map((y) => (
                  <line key={y} x1="0" x2="300" y1={y} y2={y} className="idp-grid-line" />
                ))}
                <path d={trend.area} fill="url(#idpArea)" className="js-area" />
                <path d={trend.line} className="idp-trend-line js-line" />
                <circle cx={trend.last[0] - 2} cy={trend.last[1]} r="4" className="idp-trend-dot js-tdot" />
              </svg>
            </div>

            <div className="idp-card js-card">
              <div className="idp-card-head">
                <h4>Live activity</h4>
                <span className="idp-live small"><span className="idp-live-dot" /> Real-time</span>
              </div>
              <ul className="idp-feed" ref={feedRef}>
                {feed.map((a) => (
                  <li key={a.id} className="idp-feed-item">
                    <span className={`idp-feed-av t-${a.tag}`}>{initials(a.who)}</span>
                    <div>
                      <p><b>{a.who}</b> {a.what}</p>
                      <small>{a.meta}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const frameRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      // Prepare SVG draw states
      const line = q(".js-line")[0];
      const lineLen = line ? line.getTotalLength() : 0;
      gsap.set(line, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
      gsap.set(frameRef.current, { transformPerspective: 1400, transformOrigin: "50% 60%" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Right-side content
      tl.from(q(".js-reveal"), { y: 28, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.1);

      // Dashboard frame "lands" in 3D
      tl.from(
        frameRef.current,
        { opacity: 0, y: 60, rotationX: 18, rotationY: -10, scale: 0.92, duration: 1.2, ease: "expo.out" },
        0.15
      );
      tl.from(q(".js-side"), { x: -16, opacity: 0, duration: 0.5, stagger: 0.05 }, 0.55);
      tl.from(q(".js-top"), { y: -10, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(q(".js-kpi"), { y: 18, opacity: 0, duration: 0.6, stagger: 0.07 }, 0.7);
      tl.from(q(".js-card"), { y: 22, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.85);

      // Counters
      q(".js-count").forEach((el) => {
        const target = parseFloat(el.dataset.target);
        const dec = parseInt(el.dataset.dec || "0", 10);
        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => (el.textContent = formatIN(obj.v, dec)),
          },
          0.8
        );
      });

      // Bars grow
      tl.fromTo(
        q(".js-bar"),
        { height: "0%" },
        { height: (i, el) => el.dataset.h, duration: 0.9, stagger: 0.06, ease: "back.out(1.4)" },
        1.0
      );

      // Donut segments sweep in
      q(".js-donut").forEach((seg, i) => {
        const len = parseFloat(seg.dataset.len);
        tl.fromTo(
          seg,
          { attr: { "stroke-dasharray": `0 ${DONUT_C}` } },
          { attr: { "stroke-dasharray": `${len} ${DONUT_C - len}` }, duration: 0.8, ease: "power2.inOut" },
          1.05 + i * 0.12
        );
      });

      // Trend line draws, area fades, end dot pops
      tl.to(line, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 1.1);
      tl.from(q(".js-area"), { opacity: 0, duration: 1 }, 1.5);
      tl.from(q(".js-tdot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)" }, 2.3);

      // Floating notification cards
      tl.from(
        q(".js-float"),
        { opacity: 0, scale: 0.8, y: 20, duration: 0.7, stagger: 0.15, ease: "back.out(1.7)" },
        1.6
      );

      if (reduce) {
        tl.progress(1);
        return;
      }

      // Gentle idle float
      q(".js-float").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 10 : -10,
          duration: 2.6 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.4,
        });
      });

      // Background glow drift
      gsap.to(q(".js-blob"), {
        x: "random(-40, 40)",
        y: "random(-30, 30)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1,
      });

      // Scroll: dashboard eases back as the hero leaves
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

      // Mouse-driven 3D tilt (desktop only)
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (fine) {
        const rx = gsap.quickTo(frameRef.current, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(frameRef.current, "rotationY", { duration: 0.8, ease: "power3" });
        const wrap = visualRef.current;
        const move = (e) => {
          const r = wrap.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          ry(x * 7);
          rx(-y * 5);
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
    <section className="idp-hero" ref={sectionRef} aria-labelledby="idp-hero-title">
      <div className="idp-hero-bg" aria-hidden>
        <span className="idp-blob b1 js-blob" />
        <span className="idp-blob b2 js-blob" />
        <span className="idp-grid" />
      </div>

      <div className="idp-container idp-hero-grid">
        {/* RIGHT: content (first in DOM for SEO, shown on the right on desktop) */}
        <div className="idp-content">
          <span className="idp-eyebrow js-reveal">
            <span className="idp-live-dot" /> Real-time HR Analytics
          </span>

          <h1 id="idp-hero-title" className="idp-title js-reveal">
            Interactive <span className="idp-grad">Dashboard</span>
          </h1>

          <p className="idp-lead js-reveal">
            Your workforce, attendance and payroll on one live screen.
          </p>

          <ul className="idp-points">
            {[
              "Live attendance & headcount",
              "Payroll cost trends at a glance",
              "PF, ESI, PT & TDS status",
            ].map((t) => (
              <li key={t} className="js-reveal">
                <span className="idp-tick"><Icon name="check" size={12} /></span>
                {t}
              </li>
            ))}
          </ul>

          <div className="idp-ctas js-reveal">
            <a href="/contact" className="idp-btn primary">
              Book a Free Demo <Icon name="arrow" size={16} />
            </a>
            <a href="#how-it-works" className="idp-btn ghost">
              <span className="idp-play"><Icon name="play" size={10} /></span> See it in action
            </a>
          </div>
        </div>

        {/* LEFT: realistic live dashboard */}
        <div className="idp-visual" ref={visualRef}>
          <LiveDashboard frameRef={frameRef} />

          <div className="idp-float f1 js-float">
            <span className="idp-float-ic ok"><Icon name="check" size={14} /></span>
            <div>
              <strong>Payroll processed</strong>
              <small>₹42.6L credited · 248 employees</small>
            </div>
          </div>

          <div className="idp-float f2 js-float">
            <span className="idp-float-ic pr"><Icon name="clock" size={14} /></span>
            <div>
              <strong>96% attendance</strong>
              <small>Today · auto-synced</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Feature story (pinned scroll + three.js particles)      */
/* ------------------------------------------------------------------ */

// Title parts: [text, highlighted?]
const FEATURES = [
  {
    label: "Real-time Metrics",
    icon: "pulse",
    title: [["Track", true], [" real-time ", false], ["metrics", true], [" effortlessly", false]],
    desc: "Monitor live performance indicators with up-to-the-second accuracy. Instantly spot trends, detect anomalies, and stay ahead of potential issues before they impact operations.",
  },
  {
    label: "Customizable Widgets",
    icon: "sliders",
    title: [["Customize", true], [" your ", false], ["dashboard", true], [" your way", false]],
    desc: "Add, remove, and arrange widgets to create a personalized workspace. Focus on what matters most to you and your team, with complete control over the data displayed.",
  },
  {
    label: "Role-based Views",
    icon: "shield",
    title: [["Enable", true], [" role-based ", false], ["views", true]],
    desc: "Provide tailored dashboard experiences for different user roles. Ensure that employees, managers, and executives see the right data, keeping information secure and relevant.",
  },
  {
    label: "Data Export & Sharing",
    icon: "share",
    title: [["Export", true], [" and ", false], ["share", true], [" insights instantly", false]],
    desc: "Generate detailed reports in multiple formats and share them directly with stakeholders. Export charts, tables, and summaries for presentations and strategic discussions.",
  },
  {
    label: "AI-driven Insights",
    icon: "sparkles",
    title: [["Leverage", true], [" AI-driven ", false], ["insights", true]],
    desc: "Harness artificial intelligence to uncover hidden patterns, predict future trends, and recommend optimal actions for business growth and efficiency.",
  },
];

const FEATURE_HEADING = [
  ["Visualize", true], ["insights,", false], ["analyze", true], ["with", false], ["precision,", false],
  ["and", false], ["make", false], ["smarter", true], ["business", true], ["decisions", true],
];

const AUTO_ADVANCE = 5; // seconds per tab on mobile (no pinning there)

/* ---------- three.js particle field that morphs per feature ---------- */

function buildShapes(N) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const make = (fn) => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const [x, y, z] = fn(i);
      a[i * 3] = x;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = z;
    }
    return a;
  };

  // 0 — Real-time metrics: rising bar chart
  const heights = [1.4, 2.2, 1.8, 3.0, 2.5, 3.6, 4.3];
  const bars = make((i) => {
    const b = i % heights.length;
    return [(b - 3) * 0.85 + rnd(-0.26, 0.26), -2.2 + Math.random() * heights[b], rnd(-0.26, 0.26)];
  });

  // 1 — Widgets: 3 × 2 grid of tiles (edges brighter)
  const tiles = make((i) => {
    const t = i % 6;
    const cx = ((t % 3) - 1) * 1.95;
    const cy = t < 3 ? 1.0 : -1.0;
    const w = 1.65, h = 1.6;
    let x = rnd(-w / 2, w / 2), y = rnd(-h / 2, h / 2);
    if (Math.random() < 0.45) {
      if (Math.random() < 0.5) x = Math.random() < 0.5 ? -w / 2 : w / 2;
      else y = Math.random() < 0.5 ? -h / 2 : h / 2;
    }
    return [cx + x, cy + y, rnd(-0.06, 0.06)];
  });

  // 2 — Role-based views: three clusters (founder / HR / manager)
  const centers = [[0, 1.45, 0], [-2.1, -1.0, 0], [2.1, -1.0, 0]];
  const roles = make((i) => {
    const c = centers[i % 3];
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2;
    const r = Math.random() < 0.6 ? 1.05 : 1.05 * Math.cbrt(Math.random());
    const s = Math.sqrt(1 - u * u);
    return [c[0] + r * s * Math.cos(th), c[1] + r * s * Math.sin(th), c[2] + r * u];
  });

  // 3 — Export & sharing: data streaming along a double helix
  const helix = make((i) => {
    const t = i / N;
    const a = t * Math.PI * 7 + (i % 2) * Math.PI;
    return [-4.2 + t * 8.4, Math.cos(a) * 1.15 + rnd(-0.08, 0.08), Math.sin(a) * 1.15 + rnd(-0.08, 0.08)];
  });

  // 4 — AI insights: neural globe with a dense core
  const golden = Math.PI * (3 - Math.sqrt(5));
  const globe = make((i) => {
    if (i % 6 === 0) {
      const r = 0.9 * Math.cbrt(Math.random());
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      return [r * s * Math.cos(th), r * s * Math.sin(th), r * u];
    }
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const R = 2.5;
    return [Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R];
  });

  return [bars, tiles, roles, helix, globe];
}

function makeDotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.85)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function ParticleField({ shape }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = window.innerWidth < 768 ? 1400 : 2600;
    const shapes = buildShapes(N);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const pos = new Float32Array(shapes[0]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const palette = ["#1d6fd8", "#5b9bea", "#38bdf8", "#93c1f5", "#0ea5e9"].map((c) => new THREE.Color(c));
    const colors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const tex = makeDotTexture();
    const mat = new THREE.PointsMaterial({
      size: 0.085,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // Staggered morph between formations
    const delays = new Float32Array(N).map(() => Math.random());
    let from = new Float32Array(pos);
    let to = shapes[0];
    const morph = { p: 1 };
    let tween = null;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const apply = () => {
      for (let i = 0; i < N; i++) {
        let t = morph.p * 1.5 - delays[i] * 0.5;
        t = ease(t < 0 ? 0 : t > 1 ? 1 : t);
        const k = i * 3;
        pos[k] = from[k] + (to[k] - from[k]) * t;
        pos[k + 1] = from[k + 1] + (to[k + 1] - from[k + 1]) * t;
        pos[k + 2] = from[k + 2] + (to[k + 2] - from[k + 2]) * t;
      }
      geo.attributes.position.needsUpdate = true;
    };
    apiRef.current = {
      morphTo(idx) {
        from = new Float32Array(pos);
        to = shapes[idx];
        tween?.kill();
        if (reduce) {
          morph.p = 1;
          apply();
          return;
        }
        morph.p = 0;
        tween = gsap.to(morph, { p: 1, duration: 1.9, ease: "none", onUpdate: apply });
        // a little "burst" while morphing
        gsap.fromTo(group.scale, { x: 0.92, y: 0.92, z: 0.92 }, { x: 1, y: 1, z: 1, duration: 1.6, ease: "elastic.out(1, 0.6)" });
      },
    };

    // Size
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.z = w / h < 1 ? 13 : 9.5;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Only render while visible
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(mount);

    let raf;
    let baseY = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduce) baseY += 0.0018;
      group.rotation.y += (baseY + mouse.x * 0.35 - group.rotation.y) * 0.05;
      group.rotation.x += (mouse.y * 0.22 - group.rotation.x) * 0.05;
      points.position.y = Math.sin(t * 0.8) * 0.06;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      tween?.kill();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.morphTo(shape);
  }, [shape]);

  return <div className="idv-canvas" ref={mountRef} aria-hidden />;
}

/* ---------- Panel 1: Real-time metrics ---------- */

function MetricsPanel({ active }) {
  const [pts, setPts] = useState(() =>
    Array.from({ length: 24 }, (_, i) => 48 + Math.sin(i / 2.2) * 12 + Math.random() * 8)
  );
  const [ago, setAgo] = useState(0);
  const numRefs = useRef([]);
  const vals = useRef([248, 96.4, 42.6]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setPts((p) => [...p.slice(1), Math.max(22, Math.min(86, p[p.length - 1] + (Math.random() * 18 - 9)))]);
      setAgo(0);
      const next = [
        248 + Math.round(Math.random() * 3 - 1),
        +(95 + Math.random() * 2.6).toFixed(1),
        +(42.4 + Math.random() * 0.5).toFixed(1),
      ];
      next.forEach((n, i) => {
        const el = numRefs.current[i];
        if (!el) return;
        const o = { v: vals.current[i] };
        gsap.to(o, { v: n, duration: 0.8, ease: "power2.out", onUpdate: () => (el.textContent = formatIN(o.v, i ? 1 : 0)) });
        gsap.fromTo(el.parentElement, { color: "#34d399" }, { color: "#ffffff", duration: 1 });
        vals.current[i] = n;
      });
    }, 1400);
    const t = setInterval(() => setAgo((a) => a + 1), 1000);
    return () => {
      clearInterval(id);
      clearInterval(t);
    };
  }, [active]);

  const spark = buildTrendPaths(pts, 300, 100, 0, 100);
  const kpis = [
    { label: "Headcount", pre: "", suf: "", v: 248, dec: 0 },
    { label: "Present today", pre: "", suf: "%", v: 96.4, dec: 1 },
    { label: "Payroll · Oct", pre: "₹", suf: "L", v: 42.6, dec: 1 },
  ];

  return (
    <div className="idv-card">
      <div className="idv-card-top">
        <span className="idv-pill live"><span className="idp-live-dot" /> Live</span>
        <small>Updated {ago < 1 ? "just now" : `${ago}s ago`}</small>
      </div>
      <div className="idv-kpis">
        {kpis.map((k, i) => (
          <div className="idv-kpi" key={k.label}>
            <small>{k.label}</small>
            <strong>
              {k.pre}
              <span ref={(el) => (numRefs.current[i] = el)}>{formatIN(k.v, k.dec)}</span>
              {k.suf}
            </strong>
          </div>
        ))}
      </div>
      <div className="idv-spark">
        <div className="idv-spark-head">
          <span>Check-ins per minute</span>
          <b>{Math.round(pts[pts.length - 1])}</b>
        </div>
        <svg viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="idvSpark" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5b9bea" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#5b9bea" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={spark.area} fill="url(#idvSpark)" />
          <path d={spark.line} fill="none" stroke="#93c1f5" strokeWidth="2.2" />
          <circle cx={spark.last[0]} cy={spark.last[1]} r="4.5" className="idv-spark-dot" />
        </svg>
      </div>
      <div className="idv-alert">
        <Icon name="pulse" size={14} /> Anomaly detected: late check-ins up 12% in Operations
      </div>
    </div>
  );
}

/* ---------- Panel 2: Customizable widgets (GSAP Flip) ---------- */

const WIDGETS = [
  { id: "hc", label: "Headcount", value: "248", wide: true, bars: [5, 7, 6, 8, 9, 10] },
  { id: "att", label: "Attrition", value: "2.1%" },
  { id: "lv", label: "On leave", value: "9" },
  { id: "pay", label: "Payroll", value: "₹42.6L", wide: true, bars: [6, 7, 7, 8, 8, 9] },
  { id: "bd", label: "Birthdays", value: "3" },
  { id: "op", label: "Open roles", value: "5" },
];

function WidgetsPanel({ active }) {
  const [order, setOrder] = useState(WIDGETS.map((w) => w.id));
  const [grabbed, setGrabbed] = useState(null);
  const orderRef = useRef(order);
  const gridRef = useRef(null);
  const flipState = useRef(null);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const a = [...orderRef.current];
      const from = Math.floor(Math.random() * a.length);
      let to = Math.floor(Math.random() * a.length);
      if (to === from) to = (to + 2) % a.length;
      const [m] = a.splice(from, 1);
      a.splice(to, 0, m);
      orderRef.current = a;
      flipState.current = Flip.getState(gridRef.current.children);
      setGrabbed(m);
      setOrder(a);
    }, 2300);
    return () => clearInterval(id);
  }, [active]);

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.8,
      ease: "power3.inOut",
      stagger: 0.02,
      onComplete: () => setGrabbed(null),
    });
    flipState.current = null;
  }, [order]);

  return (
    <div className="idv-card">
      <div className="idv-card-top">
        <span className="idv-pill">My dashboard</span>
        <small>Drag to rearrange</small>
      </div>
      <div className="idv-widgets" ref={gridRef}>
        {order.map((id) => {
          const w = WIDGETS.find((x) => x.id === id);
          return (
            <div
              key={id}
              data-flip-id={id}
              className={`idv-widget ${w.wide ? "wide" : ""} ${grabbed === id ? "is-grabbed" : ""}`}
            >
              <span className="idv-drag"><Icon name="drag" size={12} /></span>
              <small>{w.label}</small>
              <strong>{w.value}</strong>
              {w.bars && (
                <div className="idv-mini-bars">
                  {w.bars.map((b, i) => (
                    <i key={i} style={{ height: `${b * 10}%` }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="idv-widget add" data-flip-id="add">
          <span>+ Add widget</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Panel 3: Role-based views ---------- */

const ROLES = [
  { key: "exec", label: "Executive" },
  { key: "manager", label: "Manager" },
  { key: "employee", label: "Employee" },
];
const ROLE_FIELDS = [
  { k: "dept", label: "Department", v: "Engineering" },
  { k: "att", label: "Attendance (Oct)", v: "22 / 23 days" },
  { k: "leave", label: "Leave balance", v: "8.5 days" },
  { k: "ctc", label: "Annual CTC", v: "₹18,40,000" },
  { k: "rating", label: "Team rating", v: "4.6 / 5" },
  { k: "cost", label: "Company payroll", v: "₹42.6L / month" },
];
const ROLE_ACCESS = {
  exec: ["dept", "att", "leave", "ctc", "rating", "cost"],
  manager: ["dept", "att", "leave", "rating"],
  employee: ["dept", "att", "leave", "ctc"],
};

function RolesPanel({ active }) {
  const [role, setRole] = useState(0);
  const tabsRef = useRef(null);
  const pillRef = useRef(null);
  const fieldsRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, [active, role]);

  useLayoutEffect(() => {
    const btn = tabsRef.current?.children[role + 1];
    if (btn && pillRef.current) {
      gsap.to(pillRef.current, { x: btn.offsetLeft - 4, width: btn.offsetWidth, duration: 0.5, ease: "power3.out" });
    }
    const locks = fieldsRef.current?.querySelectorAll(".is-locked .idv-lock");
    if (locks?.length) gsap.fromTo(locks, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.06, ease: "back.out(2.5)" });
  }, [role]);

  const access = ROLE_ACCESS[ROLES[role].key];

  return (
    <div className="idv-card">
      <div className="idv-roles" ref={tabsRef}>
        <span className="idv-roles-pill" ref={pillRef} />
        {ROLES.map((r, i) => (
          <button key={r.key} type="button" className={role === i ? "is-active" : ""} onClick={() => setRole(i)}>
            {r.label}
          </button>
        ))}
      </div>
      <div className="idv-profile">
        <span className="idv-av">PS</span>
        <div>
          <strong>Priya S.</strong>
          <small>Senior Developer · EMP-0142</small>
        </div>
        <span className="idv-pill viewer">Viewing as {ROLES[role].label}</span>
      </div>
      <ul className="idv-fields" ref={fieldsRef}>
        {ROLE_FIELDS.map((f) => {
          const ok = access.includes(f.k);
          return (
            <li key={f.k} className={ok ? "" : "is-locked"}>
              <small>{f.label}</small>
              <strong>{f.v}</strong>
              {!ok && (
                <span className="idv-lock"><Icon name="lock" size={12} /> Restricted</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Panel 4: Data export & sharing ---------- */

const EXPORTS = [
  { fmt: "PDF", dest: "Download", sub: "Payroll_Oct_2026.pdf", icon: "download" },
  { fmt: "XLSX", dest: "Email to Finance", sub: "finance@yourcompany.in", icon: "mail" },
  { fmt: "CSV", dest: "Shared link", sub: "Expires in 7 days", icon: "link" },
];

function ExportPanel({ active }) {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState([]);
  const panelRef = useRef(null);
  const reportRef = useRef(null);
  const tokenRef = useRef(null);
  const destRefs = useRef([]);

  useEffect(() => {
    if (!active) return;
    const token = tokenRef.current;
    const center = (el) => {
      const p = panelRef.current.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - p.left + r.width / 2, y: r.top - p.top + r.height / 2 };
    };
    const tl = gsap.timeline({ repeat: -1, delay: 0.6, onRepeat: () => setDone([]) });
    EXPORTS.forEach((e, i) => {
      tl.call(() => {
        setStep(i);
        token.textContent = e.fmt;
        const a = center(reportRef.current);
        gsap.set(token, { x: a.x - 26, y: a.y - 16, scale: 0, autoAlpha: 1 });
      });
      tl.to(token, { scale: 1, duration: 0.35, ease: "back.out(2)" }, "+=0.05");
      tl.to(token, {
        x: () => center(destRefs.current[i]).x - 26,
        y: () => center(destRefs.current[i]).y - 16,
        duration: 0.85,
        ease: "power2.inOut",
      });
      tl.to(token, { scale: 0.3, autoAlpha: 0, duration: 0.25 });
      tl.call(() => setDone((d) => [...d, i]));
      tl.to({}, { duration: 0.7 });
    });
    tl.to({}, { duration: 1 });
    return () => {
      tl.kill();
      gsap.set(token, { autoAlpha: 0 });
      setStep(-1);
      setDone([]);
    };
  }, [active]);

  return (
    <div className="idv-card idv-export" ref={panelRef}>
      <div className="idv-card-top">
        <span className="idv-pill">Reports</span>
        <small><Icon name="calendar" size={11} /> Scheduled · every month-end</small>
      </div>
      <div className="idv-export-grid">
        <div className="idv-report" ref={reportRef}>
          <strong>October Payroll Summary</strong>
          <small>248 employees · 6 departments</small>
          <div className="idv-report-rows">
            {[["Gross pay", "₹46.9L"], ["Deductions", "₹4.3L"], ["Net payout", "₹42.6L"]].map(([a, b]) => (
              <div key={a}><span>{a}</span><b>{b}</b></div>
            ))}
          </div>
          <div className="idv-formats">
            {EXPORTS.map((e, i) => (
              <span key={e.fmt} className={step === i ? "is-on" : ""}>{e.fmt}</span>
            ))}
          </div>
        </div>
        <ul className="idv-dests">
          {EXPORTS.map((e, i) => (
            <li
              key={e.dest}
              ref={(el) => (destRefs.current[i] = el)}
              className={`${step === i ? "is-target" : ""} ${done.includes(i) ? "is-done" : ""}`}
            >
              <span className="idv-dest-ic"><Icon name={done.includes(i) ? "check" : e.icon} size={14} /></span>
              <div>
                <strong>{e.dest}</strong>
                <small>{e.sub}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <span className="idv-token" ref={tokenRef} />
    </div>
  );
}

/* ---------- Panel 5: AI-driven insights ---------- */

const INSIGHTS = [
  { tag: "Overtime", value: "+18%", text: "Overtime in Operations is up 18% vs last month. 6 employees crossed 50 hours this week.", spike: 6 },
  { tag: "Attrition risk", value: "3 people", text: "3 employees in Sales show early attrition signals. A quick check-in this week is recommended.", spike: 3 },
  { tag: "Payroll forecast", value: "+₹1.2L", text: "November payroll is forecast ₹1.2L higher, driven by 4 new joiners and festive bonuses.", spike: 8 },
];

function AIPanel({ active }) {
  const [idx, setIdx] = useState(0);
  const textRef = useRef(null);
  const chipsRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const tl = gsap.timeline({ repeat: -1 });
    INSIGHTS.forEach((ins, i) => {
      const o = { n: 0 };
      tl.call(() => {
        setIdx(i);
        if (textRef.current) textRef.current.textContent = "";
      });
      tl.set(chipsRef.current.children, { autoAlpha: 0, y: 8 });
      tl.to({}, { duration: 0.5 }); // "thinking" dots
      tl.to(o, {
        n: ins.text.length,
        duration: ins.text.length / 48,
        ease: "none",
        onUpdate: () => {
          if (textRef.current) textRef.current.textContent = ins.text.slice(0, Math.round(o.n));
        },
      });
      tl.to(chipsRef.current.children, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.35, ease: "back.out(2)" });
      tl.to({}, { duration: 2.4 });
    });
    return () => tl.kill();
  }, [active]);

  const ins = INSIGHTS[idx];
  const bars = [4, 5, 4, 6, 5, 4, 5, 6, 5, 4];

  return (
    <div className="idv-card">
      <div className="idv-card-top">
        <span className="idv-pill ai"><Icon name="sparkles" size={12} /> NGriffinpay AI</span>
        <small>Insight {idx + 1} of {INSIGHTS.length}</small>
      </div>
      <div className="idv-ai-metric">
        <div>
          <small>{ins.tag}</small>
          <strong>{ins.value}</strong>
        </div>
        <div className="idv-ai-bars">
          {bars.map((b, i) => (
            <i key={i} className={i === ins.spike ? "spike" : ""} style={{ height: `${(i === ins.spike ? 10 : b) * 9}%` }} />
          ))}
        </div>
      </div>
      <div className="idv-ai-msg">
        <span className="idv-ai-av"><Icon name="sparkles" size={13} /></span>
        <p>
          <span ref={textRef} />
          <span className="idv-caret" />
        </p>
      </div>
      <div className="idv-ai-chips" ref={chipsRef}>
        <span>View details</span>
        <span>Notify manager</span>
        <span>Create report</span>
      </div>
    </div>
  );
}

const PANELS = [MetricsPanel, WidgetsPanel, RolesPanel, ExportPanel, AIPanel];

function FeatureSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const pinRef = useRef(null);
  const stRef = useRef(null);
  const fillRefs = useRef([]);
  const copyRef = useRef(null);
  const panelsRef = useRef(null);
  const autoTween = useRef(null);
  const firstPanelRun = useRef(true);

  // Scroll setup: heading reveal + pinned feature story (desktop)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current.querySelectorAll(".idv-word"),
        { opacity: 0.12, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%", end: "top 40%", scrub: true },
        }
      );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px)", () => {
        const N = FEATURES.length;
        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * N * 0.8}`,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const seg = self.progress * N;
            const idx = Math.min(N - 1, Math.floor(seg));
            fillRefs.current.forEach((el, j) => {
              if (el) el.style.transform = `scaleX(${j < idx ? 1 : j === idx ? Math.min(1, seg - idx) : 0})`;
            });
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        });
        stRef.current = st;
        return () => {
          stRef.current = null;
        };
      });
      return () => mm.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Mobile: progress bar works as an auto-advance timer
  useEffect(() => {
    autoTween.current?.kill();
    if (stRef.current) return;
    fillRefs.current.forEach((el, j) => el && (el.style.transform = `scaleX(${j < active ? 1 : 0})`));
    const el = fillRefs.current[active];
    if (!el) return;
    autoTween.current = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: AUTO_ADVANCE,
        ease: "none",
        onComplete: () => {
          const next = (activeRef.current + 1) % FEATURES.length;
          activeRef.current = next;
          setActive(next);
        },
      }
    );
    return () => autoTween.current?.kill();
  }, [active]);

  // Panel + copy transitions
  useLayoutEffect(() => {
    const panels = panelsRef.current.children;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    Array.from(panels).forEach((p, i) => {
      if (i === active) return;
      gsap.to(p, { autoAlpha: 0, scale: 0.94, y: -10, filter: "blur(6px)", duration: firstPanelRun.current ? 0 : 0.4, ease: "power2.in" });
    });
    gsap.fromTo(
      panels[active],
      { autoAlpha: 0, scale: 1.05, y: 24, filter: "blur(8px)" },
      { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)", duration: reduce ? 0 : 0.75, delay: firstPanelRun.current ? 0 : 0.2, ease: "power3.out" }
    );
    if (copyRef.current && !firstPanelRun.current) {
      gsap.from(copyRef.current.children, { y: 18, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
    }
    firstPanelRun.current = false;
  }, [active]);

  const goTo = (i) => {
    const st = stRef.current;
    if (st) {
      const y = st.start + (st.end - st.start) * ((i + 0.5) / FEATURES.length);
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      activeRef.current = i;
      setActive(i);
    }
  };

  const f = FEATURES[active];

  return (
    <section className="idv" id="how-it-works" ref={sectionRef} aria-labelledby="idv-title">
      <div className="idp-container idv-head" ref={headRef}>
        <span className="idv-eyebrow">Built for decision-makers</span>
        <h2 id="idv-title" className="idv-title">
          {FEATURE_HEADING.map(([w, hl], i) => (
            <span key={i} className={`idv-word ${hl ? "hl" : ""}`}>{w} </span>
          ))}
        </h2>
      </div>

      <div className="idv-pin" ref={pinRef}>
        <div className="idp-container idv-grid">
          <div className="idv-left">
            <div className="idv-nav" role="tablist" aria-label="Dashboard features">
              {FEATURES.map((ft, i) => (
                <button
                  key={ft.label}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  className={`idv-nav-item ${active === i ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                >
                  <span className="idv-nav-ic"><Icon name={ft.icon} size={18} /></span>
                  <span className="idv-nav-label">{ft.label}</span>
                  <span className="idv-nav-num">0{i + 1}</span>
                  <span className="idv-nav-bar"><i ref={(el) => (fillRefs.current[i] = el)} /></span>
                </button>
              ))}
            </div>

            <div className="idv-copy" key={active} ref={copyRef}>
              <h3>
                {f.title.map(([t, hl], i) =>
                  hl ? <span key={i} className="hl">{t}</span> : <span key={i}>{t}</span>
                )}
              </h3>
              <p>{f.desc}</p>
              <a href="/contact" className="idv-cta">
                Get Started with NGriffinpay <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>

          <div className="idv-stage">
            <ParticleField shape={active} />
            <div className="idv-stage-ring" aria-hidden />
            <div className="idv-panels" ref={panelsRef}>
              {PANELS.map((Panel, i) => (
                <div className="idv-panel" key={i} aria-hidden={active !== i}>
                  <Panel active={active === i} />
                </div>
              ))}
            </div>
            <div className="idv-stage-meta">
              <b>0{active + 1}</b> / 0{FEATURES.length} · {f.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 3 — Interactive Dashboard, Instant Control                  */
/* ------------------------------------------------------------------ */

const CONTROLS = [
  { label: "Live HR Metrics", icon: "pulse" },
  { label: "Customizable Widgets", icon: "sliders" },
  { label: "Real-Time Attendance View", icon: "clock" },
  { label: "Payroll Status Overview", icon: "wallet" },
  { label: "Instant Alerts & Notifications", icon: "bell" },
];

const CONTROL_TEXT =
  "NGriffinpay’s Interactive Dashboard gives HR teams and decision-makers real-time visibility into every aspect of workforce management. Monitor KPIs, approve requests, track attendance, and view payroll summaries—all from a single, dynamic interface. Fully customizable and mobile-ready, it brings critical data to your fingertips, enabling quick and confident decisions.";

function PhoneCard({ i }) {
  switch (i) {
    case 0:
      return (
        <>
          <div className="idc-pc-head"><Icon name="pulse" size={12} /> Live HR Metrics</div>
          <div className="idc-pc-stats">
            <div><b>248</b><small>Staff</small></div>
            <div><b>96%</b><small>Present</small></div>
            <div><b>9</b><small>Leave</small></div>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <div className="idc-pc-head"><Icon name="sliders" size={12} /> Widgets</div>
          <div className="idc-pc-row">
            <span className="idc-pc-tiles"><i /><i /><i /><i /></span>
            <span>Layout saved · 6 widgets</span>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <div className="idc-pc-head"><Icon name="clock" size={12} /> Attendance <em className="idc-live"><span className="idp-live-dot" /> live</em></div>
          <div className="idc-pc-row">
            <span className="idc-avs"><i>PS</i><i>RM</i><i>KV</i><i>+</i></span>
            <span><b>231</b> checked in</span>
          </div>
        </>
      );
    case 3:
      return (
        <>
          <div className="idc-pc-head"><Icon name="wallet" size={12} /> October payroll</div>
          <div className="idc-pc-progress"><span /></div>
          <div className="idc-pc-row between"><span>₹42.6L · 248 employees</span><b className="ok">Processed</b></div>
        </>
      );
    default:
      return (
        <>
          <div className="idc-pc-head"><Icon name="bell" size={12} /> Alerts</div>
          <div className="idc-pc-row between">
            <span>3 leave requests pending</span>
            <button type="button" tabIndex={-1}>Approve</button>
          </div>
        </>
      );
  }
}

function InstantControlSection() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      if (reduce) return;

      gsap.to(q(".idc-ring"), { rotate: 360, duration: 40, repeat: -1, ease: "none" });

      gsap.fromTo(
        phoneRef.current,
        { y: 80, rotate: -7 },
        {
          y: 0,
          rotate: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "center center", scrub: 1 },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", end: "bottom 85%", scrub: 0.8 },
      });

      tl.from(q(".idc-head > *"), { y: 30, opacity: 0, stagger: 0.1, duration: 0.4 });
      tl.to(q(".idc-w"), { color: "var(--ng-ink)", stagger: 0.02, duration: 0.2 }, "<0.2");

      CONTROLS.forEach((_, i) => {
        const row = q(".idc-ctrl")[i];
        const knob = row.querySelector(".idc-knob");
        const track = row.querySelector(".idc-switch");
        const card = q(".idc-pcard")[i];
        tl.to(row, { opacity: 1, x: 0, duration: 0.3 }, i === 0 ? ">" : ">-0.1");
        tl.to(knob, { x: 18, duration: 0.25 }, "<");
        tl.to(track, { backgroundColor: "#0a3f83", duration: 0.25 }, "<");
        tl.fromTo(card, { y: 40, autoAlpha: 0, scale: 0.92 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.4 }, "<");
      });

      tl.fromTo(q(".idc-badge"), { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)" });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="idc" ref={sectionRef} aria-labelledby="idc-title">
      <div className="idp-container idc-grid">
        <div className="idc-content">
          <div className="idc-head">
            <span className="idv-eyebrow light">Instant Control</span>
            <h2 id="idc-title" className="idc-title">
              Interactive Dashboard, <span className="idp-grad">Instant Control</span>
            </h2>
          </div>

          <p className="idc-text">
            {CONTROL_TEXT.split(" ").map((w, i) => (
              <span className="idc-w" key={i}>{w} </span>
            ))}
          </p>

          <ul className="idc-controls">
            {CONTROLS.map((c) => (
              <li className="idc-ctrl" key={c.label}>
                <span className="idc-ctrl-ic"><Icon name={c.icon} size={16} /></span>
                <span className="idc-ctrl-label">{c.label}</span>
                <span className="idc-switch" aria-hidden><span className="idc-knob" /></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="idc-visual">
          <span className="idc-ring r1" aria-hidden />
          <span className="idc-ring r2" aria-hidden />
          <div className="idc-phone" ref={phoneRef}>
            <div className="idc-notch" />
            <div className="idc-screen">
              <div className="idc-status"><span>9:41</span><span>●●● 5G</span></div>
              <div className="idc-app-head">
                <div>
                  <small>Good morning</small>
                  <strong>HR Admin</strong>
                </div>
                <span className="idc-bell">
                  <Icon name="bell" size={14} />
                  <i className="idc-badge">3</i>
                </span>
              </div>
              {CONTROLS.map((c, i) => (
                <div className="idc-pcard" key={c.label}>
                  <PhoneCard i={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 4 — FAQs as a live chat                                     */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "What is the Interactive Dashboard in NGriffinpay?",
    a: "The Interactive Dashboard in NGriffinpay provides a centralized, real-time view of all your HR, payroll, and workforce data, helping you track KPIs and take informed decisions instantly.",
    keys: ["what is", "about", "overview", "explain", "centralized", "centralised", "kpi", "interactive dashboard"],
  },
  {
    q: "Can I customize the dashboard widgets?",
    a: "Yes, you can fully customize the dashboard by adding, removing, or rearranging widgets to display the metrics and reports that matter most to your role or department.",
    keys: ["custom", "widget", "rearrange", "layout", "add", "remove", "arrange", "personalise", "personalize"],
  },
  {
    q: "Does it update in real-time?",
    a: "Absolutely. The Interactive Dashboard updates in real-time, so you always have access to the latest HR and payroll data without needing to refresh or generate new reports manually.",
    keys: ["real-time", "real time", "realtime", "live", "update", "refresh", "instant", "latest"],
  },
  {
    q: "Can multiple users have different dashboards?",
    a: "Yes. Each user can have their own personalized dashboard view based on their role, permissions, and data access level, ensuring relevant insights for everyone.",
    keys: ["multiple", "users", "different", "role", "permission", "access", "each user", "manager", "team", "employee"],
  },
  {
    q: "Can I export data from the dashboard?",
    a: "Yes, NGriffinpay allows you to export dashboard reports and charts in multiple formats, including Excel and PDF, making it easy to share insights with stakeholders.",
    keys: ["export", "download", "excel", "pdf", "share", "csv", "report", "stakeholder"],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about the Interactive Dashboard.";
const FAQ_FALLBACK =
  "That's a great question! I don't have a ready answer for it here, but our team can walk you through it in a quick live demo.";

function matchFaq(text) {
  const t = text.toLowerCase();
  let best = -1;
  let bestScore = 0;
  FAQS.forEach((f, i) => {
    const score = f.keys.reduce((s, k) => s + (t.includes(k) ? k.length : 0), 0);
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
      <div className="idq-row bot" ref={ref}>
        <span className="idq-bot-av" aria-hidden>N</span>
        <div className="idq-bubble bot idq-typing" aria-label="Assistant is typing">
          <i /><i /><i />
        </div>
      </div>
    );
  }

  if (msg.from === "user") {
    return (
      <div className="idq-row user" ref={ref}>
        <div className="idq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="idq-row bot" ref={ref}>
      <span className="idq-bot-av" aria-hidden>N</span>
      <div className="idq-bubble bot">
        <p>
          <TypedText text={msg.text} animate={msg.animate} onTick={onTick} onDone={onDone} />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="idq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function FaqSection() {
  const idRef = useRef(1);
  const greeting = () => ({ id: 0, from: "bot", text: FAQ_GREETING, animate: false });
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
    if (smooth) gsap.to(b, { scrollTop: b.scrollHeight, duration: 0.45, ease: "power2.out" });
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
      setTimeout(() => setMessages((m) => [...m, { id: typingId, from: "typing" }]), 380)
    );
    timers.current.push(
      setTimeout(() => {
        const reply =
          match >= 0
            ? { id: nid(), from: "bot", text: FAQS[match].a, animate: !reduceRef.current }
            : {
                id: nid(),
                from: "bot",
                text: FAQ_FALLBACK,
                animate: !reduceRef.current,
                cta: { label: "Book a Free Demo", href: "/contact" },
              };
        setMessages((m) => [...m.filter((x) => x.id !== typingId), reply]);
      }, 1200 + Math.random() * 500)
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
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      gsap.from(q(".idq-chat"), {
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
          timers.current.push(setTimeout(() => askRef.current?.(FAQS[0].q, 0), 900));
        },
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="idq" ref={sectionRef} aria-labelledby="idq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <div className="idp-container idq-grid">
        <div className="idq-left">
          <span className="idv-eyebrow light js-faq-reveal">FAQs</span>
          <h2 id="idq-title" className="idq-title js-faq-reveal">
            Interactive Dashboard – <span className="idp-grad">FAQs</span>
          </h2>
          <p className="idq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="idq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`idq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="idq-q-num">{asked.includes(i) ? <Icon name="check" size={13} /> : `0${i + 1}`}</span>
                  <span className="idq-q-text">{f.q}</span>
                  <span className="idq-q-go"><Icon name="arrow" size={15} /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="idq-chat">
          <div className="idq-chat-head">
            <span className="idq-head-av">N<i /></span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button type="button" className="idq-reset" onClick={reset} aria-label="Clear chat">
              Clear chat
            </button>
          </div>

          <div className="idq-body" ref={bodyRef} role="log" aria-live="polite" aria-busy={busy}>
            <div className="idq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="idq-suggest" aria-label="Suggested questions">
            {FAQS.map((f, i) =>
              asked.includes(i) ? null : (
                <button key={f.q} type="button" onClick={() => ask(f.q, i)} disabled={busy}>
                  {f.q}
                </button>
              )
            )}
          </div>

          <form className="idq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the Interactive Dashboard…"
              aria-label="Type your question"
              maxLength={160}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
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

export default function InteractiveDashboard() {
  return (
    <div className="idp-page">
      <HeroSection />
      <FeatureSection />
      <InstantControlSection />
      <FaqSection />
      {/* SECTION 5 — coming next */}
    </div>
  );
}
