// Tracking.jsx
// NGriffinpay — Product inner page: "Tracking"
// Section 1: Hero banner (live tracking app on the left, content on the right)
// Section 2: Live India map (dot-matrix map + GSAP story per tab)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no three.js needed on this page)
// NOTE: all wording below is placeholder copy — replace it when the client sends the final content.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./Tracking.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Live Attendance",
    short: "Live",
    desc: "Biometric, mobile and web check-ins land in one real-time feed.",
    icon: "pulse",
  },
  {
    title: "Geo-fencing & GPS",
    short: "Geo-fence",
    desc: "Field and site staff can only punch in inside approved locations.",
    icon: "pin",
  },
  {
    title: "Timesheets & Projects",
    short: "Timesheets",
    desc: "See hours logged per project and client, with billable time split out.",
    icon: "clock",
  },
  {
    title: "Overtime & Alerts",
    short: "Alerts",
    desc: "Late marks, missed punches and overtime are flagged and sent to payroll.",
    icon: "bell",
  },
];

const STAGE_TIME = 5.5;
const TOTAL = 248;

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
    case "pulse":
      return (
        <svg {...p}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "finger":
      return (
        <svg {...p}>
          <path d="M12 10a2 2 0 0 0-2 2c0 1-.1 2.5-.26 4" />
          <path d="M14 13.1c0 2.4 0 6.4-1 8.9" />
          <path d="M2 12a10 10 0 0 1 18-6" />
          <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
          <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 18h2" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...p}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "route":
      return (
        <svg {...p}>
          <circle cx="6" cy="19" r="2.5" />
          <circle cx="18" cy="5" r="2.5" />
          <path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5" />
        </svg>
      );
    case "home":
      return (
        <svg {...p}>
          <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "building":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
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
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
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

// 1 — Live Attendance: people light up as they check in
const SEATS = Array.from({ length: 32 }, (_, i) =>
  i === 5 || i === 19 || i === 27
    ? "late"
    : i === 11 || i === 30
      ? "leave"
      : "in",
);
const CHECKINS = [
  { av: "PS", name: "Priya S.", t: "09:12", src: "Biometric", icon: "finger" },
  {
    av: "KV",
    name: "Karthik V.",
    t: "09:18",
    src: "Mobile · GPS",
    icon: "phone",
  },
  { av: "AR", name: "Anita R.", t: "09:21", src: "Web", icon: "monitor" },
];
function LivePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".trk-seat").forEach((el, i) =>
      tl.call(() => el.classList.add("is-lit"), null, 0.4 + i * 0.045),
    );
    q(".trk-count b").forEach((el) => {
      const to = +el.dataset.to;
      const st = { v: 0 };
      tl.to(
        st,
        {
          v: to,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(st.v)),
        },
        0.4,
      );
    });
    tl.from(
      q(".trk-ci"),
      { x: 16, autoAlpha: 0, stagger: 0.3, duration: 0.35, ease: "power3.out" },
      1.2,
    );
  }, delay);

  return (
    <div className="trk-panel" ref={ref}>
      <div className="trk-head js-in">
        <Icon name="pulse" /> Who’s in today{" "}
        <em className="trk-live">
          <i /> Live
        </em>
      </div>
      <div className="trk-counts js-in">
        <span className="trk-count ok">
          <b data-to="231">0</b>
          <small>Present</small>
        </span>
        <span className="trk-count warn">
          <b data-to="9">0</b>
          <small>Late</small>
        </span>
        <span className="trk-count mute">
          <b data-to="8">0</b>
          <small>On leave</small>
        </span>
      </div>
      <div className="trk-seats js-in">
        {SEATS.map((s, i) => (
          <i key={i} className={`trk-seat ${s}`} />
        ))}
      </div>
      <div className="trk-cis">
        {CHECKINS.map((c) => (
          <div key={c.av} className="trk-ci">
            <span className="trk-av">{c.av}</span>
            <span className="trk-ci-txt">
              <b>{c.name}</b>
              <small>Checked in {c.t} AM</small>
            </span>
            <span className="trk-src">
              <Icon name={c.icon} size={10} /> {c.src}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2 — Geo-fencing: one person walks into the zone, one is outside
const ROUTE = "M18 150 C 70 150, 80 110, 120 104 S 178 96, 196 86";
function GeoPanel({ delay }) {
  const walkerRef = useRef(null);
  const routeRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const path = routeRef.current;
    const walker = walkerRef.current;
    if (path && walker) {
      const len = path.getTotalLength();
      const st = { f: 0 };
      const place = () => {
        const pt = path.getPointAtLength(st.f * len);
        walker.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      };
      place();
      tl.fromTo(
        path,
        { strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.8, ease: "power1.inOut" },
        0.4,
      );
      tl.to(
        st,
        { f: 1, duration: 1.8, ease: "power1.inOut", onUpdate: place },
        0.4,
      );
      gsap.set(path, { strokeDasharray: len });
    }
    tl.call(() => q(".trk-fence")[0]?.classList.add("is-in"), null, 2.2);
    tl.from(
      q(".trk-geo-toast.ok"),
      { autoAlpha: 0, y: 8, duration: 0.35 },
      2.3,
    );
    tl.from(
      q(".trk-out"),
      {
        scale: 0,
        duration: 0.35,
        ease: "back.out(2.5)",
        transformOrigin: "50% 50%",
      },
      2.6,
    );
    tl.from(
      q(".trk-geo-toast.bad"),
      { autoAlpha: 0, y: 8, duration: 0.35 },
      2.8,
    );
  }, delay);

  return (
    <div className="trk-panel" ref={ref}>
      <div className="trk-head js-in">
        <Icon name="pin" /> Geo-fence · Whitefield office{" "}
        <em className="trk-tag">Radius 150 m</em>
      </div>
      <div className="trk-map js-in">
        <svg viewBox="0 0 300 170" aria-hidden>
          <rect width="300" height="170" className="trk-map-bg" />
          {[30, 75, 125].map((y) => (
            <path key={y} d={`M0 ${y} H300`} className="trk-road" />
          ))}
          {[60, 150, 240].map((x) => (
            <path key={x} d={`M${x} 0 V170`} className="trk-road" />
          ))}
          <path d="M0 160 L300 20" className="trk-road main" />
          <circle cx="200" cy="82" r="38" className="trk-fence" />
          <rect
            x="190"
            y="70"
            width="20"
            height="20"
            rx="4"
            className="trk-office"
          />
          <path ref={routeRef} d={ROUTE} className="trk-route" />
          <g ref={walkerRef} className="trk-walker">
            <circle r="9" className="trk-walker-glow" />
            <circle r="5" className="trk-walker-dot" />
          </g>
          <g className="trk-out" transform="translate(62 40)">
            <circle r="9" className="trk-out-glow" />
            <circle r="5" className="trk-out-dot" />
          </g>
        </svg>
        <span className="trk-geo-toast ok">
          <Icon name="check" size={10} /> Karthik V. checked in · inside zone
        </span>
        <span className="trk-geo-toast bad">
          <Icon name="x" size={10} /> Punch from 2.4 km away · flagged
        </span>
      </div>
    </div>
  );
}

// 3 — Timesheets: hours per project
const PROJECTS = [
  { name: "Payroll revamp", h: 18, bill: true },
  { name: "Client · Acme Retail", h: 12.5, bill: true },
  { name: "Internal meetings", h: 7, bill: false },
  { name: "Training", h: 4, bill: false },
];
const WEEK_HOURS = [8.5, 9.5, 7, 9, 7.5];
function TimesheetPanel({ delay }) {
  const totRef = useRef(null);
  const ref = usePanel((tl, q) => {
    q(".trk-proj-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: PROJECTS[i].h / 18, duration: 0.8, ease: "power3.out" },
        0.35 + i * 0.12,
      ),
    );
    tl.fromTo(
      q(".trk-day i"),
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.08, duration: 0.5, ease: "back.out(1.6)" },
      0.5,
    );
    const st = { v: 0 };
    tl.to(
      st,
      {
        v: 41.5,
        duration: 1.3,
        ease: "power2.out",
        onUpdate: () =>
          totRef.current && (totRef.current.textContent = st.v.toFixed(1)),
      },
      0.4,
    );
    tl.from(q(".trk-bill"), { autoAlpha: 0, y: 8, duration: 0.35 }, 1.6);
  }, delay);

  return (
    <div className="trk-panel" ref={ref}>
      <div className="trk-head js-in">
        <Icon name="clock" /> Timesheet · Priya S.{" "}
        <em className="trk-tag">27–31 Oct</em>
      </div>
      <div className="trk-ts js-in">
        <div className="trk-days">
          {["M", "T", "W", "T", "F"].map((d, i) => (
            <span key={i} className="trk-day">
              <i style={{ height: `${(WEEK_HOURS[i] / 10) * 80}%` }} />
              <small>{d}</small>
            </span>
          ))}
        </div>
        <div className="trk-total">
          <small>This week</small>
          <b>
            <span ref={totRef}>0</span> h
          </b>
        </div>
      </div>
      <div className="trk-projs">
        {PROJECTS.map((p) => (
          <div key={p.name} className="trk-proj">
            <span className="trk-proj-name">{p.name}</span>
            <span className="trk-proj-bar">
              <i className={p.bill ? "bill" : ""} />
            </span>
            <b>{p.h} h</b>
          </div>
        ))}
      </div>
      <div className="trk-bill">
        <span>
          <i className="bill" /> Billable 30.5 h
        </span>
        <span>
          <i /> Non-billable 11 h
        </span>
        <em>Sent to client invoice</em>
      </div>
    </div>
  );
}

// 4 — Overtime & Alerts
const ALERTS = [
  {
    tone: "warn",
    icon: "clock",
    t: "Late arrival · Rahul M.",
    s: "Checked in 9:47 AM · 17 min late",
    act: "Late mark applied",
  },
  {
    tone: "bad",
    icon: "alert",
    t: "Missed punch-out · Deepa N.",
    s: "Yesterday · no check-out",
    act: "Regularise request sent",
  },
  {
    tone: "info",
    icon: "pulse",
    t: "Overtime 2.5 h · Karthik V.",
    s: "Approved by manager",
    act: "Added to payroll",
  },
];
function AlertsPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".trk-alert"),
      {
        x: 30,
        autoAlpha: 0,
        stagger: 0.45,
        duration: 0.4,
        ease: "back.out(1.6)",
      },
      0.35,
    );
    tl.from(
      q(".trk-alert-act"),
      {
        scale: 0.6,
        autoAlpha: 0,
        stagger: 0.45,
        duration: 0.3,
        ease: "back.out(2.4)",
      },
      0.75,
    );
    tl.from(q(".trk-pay"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.1);
  }, delay);

  return (
    <div className="trk-panel" ref={ref}>
      <div className="trk-head js-in">
        <Icon name="bell" /> Exceptions today <em className="trk-tag">3 new</em>
      </div>
      <div className="trk-alerts">
        {ALERTS.map((a) => (
          <div key={a.t} className={`trk-alert ${a.tone}`}>
            <span className="trk-alert-ic">
              <Icon name={a.icon} size={13} />
            </span>
            <span className="trk-alert-txt">
              <b>{a.t}</b>
              <small>{a.s}</small>
            </span>
            <span className="trk-alert-act">
              <Icon name="check" size={9} /> {a.act}
            </span>
          </div>
        ))}
      </div>
      <div className="trk-pay">
        <span className="trk-pay-ic">
          <Icon name="send" size={13} />
        </span>
        <div>
          <b>Payroll inputs updated automatically</b>
          <small>No manual attendance sheets at month-end</small>
        </div>
      </div>
    </div>
  );
}

const PANELS = [LivePanel, GeoPanel, TimesheetPanel, AlertsPanel];

/* ------------------------------------------------------------------ */
/* Tracking app (left side)                                            */
/* ------------------------------------------------------------------ */

const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;
const SOURCES = [
  { k: "Biometric", v: 142, icon: "finger" },
  { k: "Mobile app", v: 64, icon: "phone" },
  { k: "Web", v: 25, icon: "monitor" },
];

function TrackingApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const ringRef = useRef(null);
  const pctRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // "Present today" ring counts up once
  useEffect(() => {
    const st = { v: 0 };
    const target = (231 / TOTAL) * 100;
    const tw = gsap.to(st, {
      v: target,
      duration: prefersReduced() ? 0 : 1.6,
      delay: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        if (pctRef.current) pctRef.current.textContent = Math.round(st.v);
        if (ringRef.current)
          ringRef.current.style.strokeDashoffset = RING_C * (1 - st.v / 100);
      },
    });
    return () => tw.kill();
  }, []);

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
    <div className="trk-frame" ref={frameRef}>
      <div className="trk-chrome">
        <span className="trk-dot r" />
        <span className="trk-dot y" />
        <span className="trk-dot g" />
        <div className="trk-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/tracking
        </div>
      </div>

      <div className="trk-topbar js-top">
        <span className="trk-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinpay" />
        </span>
        <b>Admin</b>
        <span className="trk-search">
          <Icon name="search" size={12} /> Search employee or location…
        </span>
        <span className="trk-av sm">PR</span>
      </div>

      <div className="trk-app">
        <div className="trk-main">
          <div
            className="trk-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Tracking features"
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
          <div className="trk-panel-wrap" ref={panelWrap}>
            <Panel key={stage} delay={startDelay} />
          </div>
        </div>

        <aside className="trk-side js-side">
          <div className="trk-clock">
            <small>Thu, 29 Oct</small>
            <b>
              09<i>:</i>41
            </b>
            <small>Whitefield HQ</small>
          </div>
          <div className="trk-ring">
            <svg viewBox="0 0 72 72" aria-hidden>
              <circle cx="36" cy="36" r={RING_R} className="trk-ring-bg" />
              <circle
                ref={ringRef}
                cx="36"
                cy="36"
                r={RING_R}
                className="trk-ring-fill"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C}
              />
            </svg>
            <span>
              <b>
                <span ref={pctRef}>0</span>%
              </b>
              <small>present</small>
            </span>
          </div>
          <div className="trk-sources">
            <small className="trk-side-lbl">Punch sources</small>
            {SOURCES.map((s) => (
              <span key={s.k}>
                <Icon name={s.icon} size={11} /> {s.k}
                <b>{s.v}</b>
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
      className="trk-hero"
      ref={sectionRef}
      aria-labelledby="trk-hero-title"
    >
      <div className="trk-hero-bg" aria-hidden>
        <span className="trk-blob b1 js-blob" />
        <span className="trk-blob b2 js-blob" />
        <span className="trk-grid-bg" />
      </div>

      <div className="trk-container trk-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="trk-content">
          <span className="trk-eyebrow js-reveal">
            <span className="trk-live-dot" /> Know where every hour goes
          </span>
          <h1 id="trk-hero-title" className="trk-title js-reveal">
            <span className="trk-grad">Tracking</span>
          </h1>
          <p className="trk-lead js-reveal">
            Attendance, location and time — tracked automatically across
            offices, sites and remote teams, and fed straight into payroll.
          </p>

          <ul
            className="trk-feats"
            role="tablist"
            aria-label="Tracking features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`trk-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="trk-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="trk-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="trk-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="trk-ctas js-reveal">
            <a href="/contact-us" className="trk-btn primary">
              Book a Free Demo <Icon name="arrow" size={16} />
            </a>
            <a href="#trk-next" className="trk-btn ghost">
              <span className="trk-play">
                <Icon name="play" size={10} />
              </span>{" "}
              See how it works
            </a>
          </div>
        </div>

        {/* LEFT: tracking app */}
        <div className="trk-visual" ref={visualRef}>
          <TrackingApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="trk-float f1 js-float">
            <span className="trk-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>231 checked in by 9:45 AM</strong>
              <small>Biometric, mobile &amp; web</small>
            </div>
          </div>
          <div className="trk-float f2 js-float">
            <span className="trk-float-ic pr">
              <Icon name="shield" size={14} />
            </span>
            <div>
              <strong>No proxy punches</strong>
              <small>Geo-fence + selfie check</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Live India map (dot-matrix SVG + GSAP)                  */
/* ------------------------------------------------------------------ */

const GLOBE_HEADING = [
  ["Track", true],
  ["attendance,"],
  ["movement"],
  ["and"],
  ["time"],
  ["across"],
  ["every", true],
  ["location", true],
  ["—"],
  ["in"],
  ["real", true],
  ["time", true],
];

// lat, lon
const CITIES = [
  { name: "Bengaluru HQ", lat: 12.97, lon: 77.59, present: 112, total: 118 },
  { name: "Chennai", lat: 13.08, lon: 80.27, present: 38, total: 41 },
  { name: "Hyderabad", lat: 17.39, lon: 78.49, present: 29, total: 31 },
  { name: "Mumbai", lat: 19.08, lon: 72.88, present: 24, total: 27 },
  { name: "Pune", lat: 18.52, lon: 73.86, present: 14, total: 15 },
  { name: "Delhi NCR", lat: 28.61, lon: 77.21, present: 14, total: 16 },
];
// field visits from Bengaluru
const VISITS = [
  { name: "Hubballi", lat: 15.36, lon: 75.12 },
  { name: "Mangaluru", lat: 12.91, lon: 74.86 },
  { name: "Kochi", lat: 9.93, lon: 76.27 },
  { name: "Madurai", lat: 9.93, lon: 78.12 },
];
const FLAGGED = 1; // Chennai gets the geo-fence alert

const GLOBE_TABS = [
  {
    label: "Multi-Location Attendance",
    icon: "building",
    title: [["See", true], ["every office"], ["at a glance", true]],
    desc: "Live headcount from each branch and site, combined into one company-wide view — no more calling each office for numbers.",
    kind: "offices",
  },
  {
    label: "Field Force Tracking",
    icon: "route",
    title: [["Follow", true], ["field visits"], ["as they happen", true]],
    desc: "Sales and service teams check in at client sites with GPS, and every visit and route is logged automatically.",
    kind: "visits",
    stats: [
      ["18", "client visits today"],
      ["214 km", "travelled"],
      ["42 min", "average visit"],
    ],
  },
  {
    label: "Remote & WFH Check-ins",
    icon: "home",
    title: [["Let", true], ["remote teams"], ["punch in from anywhere", true]],
    desc: "Selfie and location check-ins keep attendance accurate for remote and hybrid employees, wherever they work.",
    kind: "remote",
    stats: [
      ["64", "working remotely today"],
      ["100%", "selfie-verified"],
      ["0", "proxy punches"],
    ],
  },
  {
    label: "Geo-fence Alerts",
    icon: "alert",
    title: [["Get", true], ["alerted when"], ["check-ins look wrong", true]],
    desc: "Punches from outside approved zones or unusual locations are flagged instantly, so HR can review them before payroll.",
    kind: "alert",
    stats: [
      ["1", "punch flagged · Chennai"],
      ["2.4 km", "outside the zone"],
      ["5 min", "to review"],
    ],
  },
  {
    label: "Live Tracking Reports",
    icon: "chart",
    title: [["Turn", true], ["tracking data"], ["into decisions", true]],
    desc: "Attendance, travel and time reports by location, team or person — ready to export for managers and payroll.",
    kind: "reports",
    stats: [
      ["96%", "on-time arrivals"],
      ["3", "locations above target"],
      ["1 click", "Excel & PDF export"],
    ],
  },
];

const GLOBE_TIME = 6.5;

// Map projection: lon 67°–98°, lat 37°–6° → 620 × 620 SVG
const MAP = 620;
const toXY = (lat, lon) => [(lon - 67) * 20, (37 - lat) * 20];

// Simplified India outline (lat, lon) — good enough for a dot-matrix map
const INDIA = [
  [23.7, 68.2],
  [24.6, 71.0],
  [27.0, 70.2],
  [29.5, 73.4],
  [32.0, 74.6],
  [34.5, 74.0],
  [35.6, 77.0],
  [32.8, 79.4],
  [30.3, 81.0],
  [28.0, 82.0],
  [26.9, 84.4],
  [26.5, 88.0],
  [27.8, 88.2],
  [26.8, 89.8],
  [27.8, 92.0],
  [28.2, 95.5],
  [27.0, 97.0],
  [24.6, 94.6],
  [23.0, 93.4],
  [22.0, 92.6],
  [24.0, 91.5],
  [25.2, 89.9],
  [24.3, 88.2],
  [22.0, 89.0],
  [21.5, 87.5],
  [19.3, 84.9],
  [16.5, 82.3],
  [15.8, 80.3],
  [13.4, 80.3],
  [10.3, 79.8],
  [8.1, 77.5],
  [10.0, 76.2],
  [12.9, 74.8],
  [15.5, 73.8],
  [18.9, 72.8],
  [21.0, 72.6],
  [22.3, 72.6],
  [21.0, 70.0],
  [21.6, 69.6],
  [22.4, 69.0],
];
const OUTLINE = INDIA.map(([la, lo]) => toXY(la, lo));

function inPoly([x, y], poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

// dot grid inside India (computed once)
const DOTS = (() => {
  const out = [];
  for (let y = 6; y < MAP; y += 11) {
    for (let x = 6; x < MAP; x += 11) {
      if (inPoly([x, y], OUTLINE)) out.push([x, y]);
    }
  }
  return out;
})();
// a scattered subset for "remote check-ins"
const REMOTE = DOTS.filter((_, i) => (i * 37) % 11 === 0);

// where each city label sits relative to its pin
const LABEL_SIDE = ["left", "right", "right", "left", "below", "right"];

function IndiaMap({ tab }) {
  const rootRef = useRef(null);
  const tiltRef = useRef(null);
  const kind = GLOBE_TABS[tab].kind;
  const cityXY = CITIES.map((c) => toXY(c.lat, c.lon));
  const hq = cityXY[0];
  const visitXY = VISITS.map((v) => toXY(v.lat, v.lon));

  // gentle 3D tilt that follows the mouse (desktop)
  useEffect(() => {
    const el = tiltRef.current;
    const wrap = rootRef.current;
    if (
      !el ||
      !wrap ||
      prefersReduced() ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return undefined;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const move = (e) => {
      const r = wrap.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      rx(14 - ((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const leave = () => {
      rx(14);
      ry(0);
    };
    wrap.addEventListener("mousemove", move);
    wrap.addEventListener("mouseleave", leave);
    return () => {
      wrap.removeEventListener("mousemove", move);
      wrap.removeEventListener("mouseleave", leave);
    };
  }, []);

  // per-tab animation
  useLayoutEffect(() => {
    const reduce = prefersReduced();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      gsap.set(tiltRef.current, {
        transformPerspective: 1100,
        rotationX: 14,
        transformOrigin: "50% 60%",
      });
      if (reduce) return;
      gsap.from(q(".tk2-pinlbl"), {
        autoAlpha: 0,
        y: 8,
        stagger: 0.06,
        duration: 0.35,
        delay: 0.2,
      });

      if (kind === "offices") {
        q(".tk2-ring").forEach((r, i) => {
          gsap.fromTo(
            r,
            { attr: { r: 6 }, opacity: 0.9 },
            {
              attr: { r: 30 },
              opacity: 0,
              duration: 1.8,
              repeat: -1,
              delay: i * 0.25,
              ease: "power1.out",
            },
          );
        });
      }
      if (kind === "visits") {
        q(".tk2-arc").forEach((p, i) => {
          const len = p.getTotalLength();
          const dot = q(".tk2-packet")[i];
          const st = { f: 0 };
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.5,
            delay: i * 0.4,
          });
          tl.set(p, { strokeDashoffset: len });
          tl.set(dot, { opacity: 0 });
          tl.to(p, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" });
          tl.set(dot, { opacity: 1 });
          tl.fromTo(
            st,
            { f: 0 },
            {
              f: 1,
              duration: 1.3,
              ease: "none",
              onUpdate: () => {
                const pt = p.getPointAtLength(st.f * len);
                dot.setAttribute("cx", pt.x);
                dot.setAttribute("cy", pt.y);
              },
            },
          );
          tl.to(dot, { opacity: 0, duration: 0.2 });
        });
        gsap.from(q(".tk2-visit"), {
          scale: 0,
          transformOrigin: "50% 50%",
          stagger: 0.15,
          duration: 0.4,
          ease: "back.out(2.4)",
        });
      }
      if (kind === "remote") {
        gsap.fromTo(
          q(".tk2-rdot"),
          { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: { each: 0.012, from: "random" },
            ease: "back.out(2)",
          },
        );
        gsap.to(q(".tk2-rdot"), {
          opacity: 0.45,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.03, from: "random", repeat: -1, yoyo: true },
          delay: 1.4,
        });
      }
      if (kind === "alert") {
        gsap.fromTo(
          q(".tk2-ring.bad"),
          { attr: { r: 6 }, opacity: 1 },
          {
            attr: { r: 34 },
            opacity: 0,
            duration: 1.2,
            repeat: -1,
            ease: "power1.out",
          },
        );
        gsap.from(q(".tk2-stray"), {
          scale: 0,
          transformOrigin: "50% 50%",
          duration: 0.4,
          delay: 0.4,
          ease: "back.out(2.4)",
        });
        gsap.from(q(".tk2-stray-line"), {
          strokeDashoffset: 60,
          duration: 0.6,
          delay: 0.5,
        });
      }
      if (kind === "reports") {
        gsap.from(q(".tk2-bar"), {
          scaleY: 0,
          transformOrigin: "50% 100%",
          stagger: 0.08,
          duration: 0.8,
          ease: "back.out(1.4)",
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [kind]);

  return (
    <div className="tk2-mapwrap" ref={rootRef}>
      <div className="tk2-tilt" ref={tiltRef}>
        <svg
          className="tk2-map"
          viewBox={`0 14 ${MAP} ${MAP - 28}`}
          aria-hidden
        >
          <defs>
            <radialGradient id="tk2Glow" cx="0.45" cy="0.55" r="0.6">
              <stop offset="0" stopColor="#1d6fd8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#1d6fd8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={MAP} height={MAP} fill="url(#tk2Glow)" />
          {DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" className="tk2-dot" />
          ))}

          {kind === "remote" &&
            REMOTE.map(([x, y], i) => (
              <circle
                key={`r${i}`}
                cx={x}
                cy={y}
                r="4.2"
                className="tk2-rdot"
              />
            ))}

          {kind === "visits" && (
            <g>
              {visitXY.map(([x, y], i) => {
                const mx = (hq[0] + x) / 2;
                const my = Math.min(hq[1], y) - 70;
                return (
                  <path
                    key={i}
                    d={`M${hq[0]} ${hq[1]} Q${mx} ${my} ${x} ${y}`}
                    className="tk2-arc"
                  />
                );
              })}
              {visitXY.map(([x, y], i) => (
                <circle
                  key={`v${i}`}
                  cx={x}
                  cy={y}
                  r="6"
                  className="tk2-visit"
                />
              ))}
              {visitXY.map((_, i) => (
                <circle
                  key={`p${i}`}
                  cx={hq[0]}
                  cy={hq[1]}
                  r="5"
                  className="tk2-packet"
                  opacity="0"
                />
              ))}
            </g>
          )}

          {kind === "reports" &&
            cityXY.map(([x, y], i) => {
              const c = CITIES[i];
              const h = 30 + (c.present / c.total) * 60;
              return (
                <rect
                  key={`b${i}`}
                  x={x - 7}
                  y={y - h}
                  width="14"
                  height={h}
                  rx="4"
                  className="tk2-bar"
                />
              );
            })}

          {kind === "alert" && (
            <g>
              <line
                x1={cityXY[FLAGGED][0]}
                y1={cityXY[FLAGGED][1]}
                x2={cityXY[FLAGGED][0] + 46}
                y2={cityXY[FLAGGED][1] - 34}
                className="tk2-stray-line"
              />
              <circle
                cx={cityXY[FLAGGED][0] + 46}
                cy={cityXY[FLAGGED][1] - 34}
                r="7"
                className="tk2-stray"
              />
            </g>
          )}

          {cityXY.map(([x, y], i) => (
            <g key={CITIES[i].name}>
              {(kind === "offices" || (kind === "alert" && i === FLAGGED)) && (
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  className={`tk2-ring ${kind === "alert" ? "bad" : ""}`}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={i === 0 ? 8 : 6.5}
                className={`tk2-city ${kind === "alert" && i === FLAGGED ? "bad" : ""} ${kind === "alert" && i !== FLAGGED ? "dim" : ""}`}
              />
            </g>
          ))}
        </svg>

        {/* HTML labels on top of the map */}
        <div className="tk2-labels">
          {CITIES.map((c, i) => {
            const [x, y] = cityXY[i];
            const show =
              kind === "offices" ||
              kind === "reports" ||
              (kind === "alert" && i === FLAGGED) ||
              (kind === "visits" && i === 0);
            if (!show) return null;
            const bad = kind === "alert" && i === FLAGGED;
            return (
              <span
                key={c.name}
                className={`tk2-pinlbl ${LABEL_SIDE[i]} ${bad ? "is-bad" : ""}`}
                style={{
                  left: `${(x / MAP) * 100}%`,
                  top: `${(y / MAP) * 100}%`,
                }}
              >
                <b>{c.name}</b>
                <small>
                  {bad
                    ? "Punch 2.4 km outside zone"
                    : kind === "visits"
                      ? "4 field visits today"
                      : `${c.present}/${c.total} in`}
                </small>
              </span>
            );
          })}
          {kind === "visits" &&
            VISITS.map((v, i) => {
              const [x, y] = visitXY[i];
              return (
                <span
                  key={v.name}
                  className="tk2-visitlbl"
                  style={{
                    left: `${(x / MAP) * 100}%`,
                    top: `${(y / MAP) * 100}%`,
                  }}
                >
                  {v.name}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function GlobeSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const cardRef = useRef(null);
  const barRefs = useRef([]);
  const firstChange = useRef(true);

  const go = (i) => setActive((i + GLOBE_TABS.length) % GLOBE_TABS.length);

  // Heading reveal + autoplay only while on screen
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });
      if (prefersReduced()) return;
      gsap.from(q(".tk2-hw > span"), {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.035,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
      gsap.from([q(".tk2-tabs"), q(".tk2-stage"), q(".tk2-card")], {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Autoplay with progress bar in the active tab
  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (!inView || paused || prefersReduced()) return undefined;
    const bar = barRefs.current[active];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: GLOBE_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(GLOBE_TIME, () => go(active + 1));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, paused, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Card swaps in
  useLayoutEffect(() => {
    if (firstChange.current) {
      firstChange.current = false;
      return;
    }
    if (prefersReduced() || !cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
    );
    gsap.fromTo(
      cardRef.current.querySelectorAll(".tk2-tw > span"),
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.1,
      },
    );
    gsap.fromTo(
      cardRef.current.querySelectorAll(".js-row"),
      { x: 14, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.07, delay: 0.25 },
    );
  }, [active]);

  // Mobile: when the listed service changes, slide the tab row so the active tab is fully visible
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[active];
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
  }, [active]);

  const tab = GLOBE_TABS[active];
  const words = tab.title.flatMap(([t, hl]) =>
    t.split(" ").map((w) => [w, hl]),
  );

  return (
    <section
      className="tk2"
      ref={sectionRef}
      aria-labelledby="tk2-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="trk-container">
        <h2 id="tk2-title" className="tk2-title">
          {GLOBE_HEADING.map(([w, hl], i) => (
            <span key={i} className="tk2-hw">
              <span className={hl ? "hl" : ""}>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="tk2-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="Tracking capabilities"
        >
          {GLOBE_TABS.map((t, i) => (
            <button
              type="button"
              key={t.label}
              role="tab"
              aria-selected={active === i}
              className={`tk2-tab ${active === i ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="tk2-tab-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}
              <span className="tk2-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="tk2-grid">
          {/* LEFT: the globe */}
          <div className="tk2-stage">
            <div className="tk2-stage-head">
              <span>
                <Icon name="globe" size={14} /> Live across India
              </span>
              <em>
                <i /> {tab.label}
              </em>
            </div>
            <IndiaMap tab={active} />
          </div>

          {/* RIGHT: copy + numbers */}
          <div className="tk2-side">
            <div className="tk2-card" ref={cardRef} role="tabpanel">
              <span className="tk2-step">
                <span className="tk2-step-ic">
                  <Icon name={tab.icon} size={14} />
                </span>
                {tab.label}{" "}
                <em>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(GLOBE_TABS.length).padStart(2, "0")}
                </em>
              </span>
              <h3>
                {words.map(([w, hl], i) => (
                  <span key={`${active}-${i}`} className="tk2-tw">
                    <span className={hl ? "hl" : ""}>{w}</span>
                  </span>
                ))}
              </h3>
              <p>{tab.desc}</p>
              {tab.kind === "offices" ? (
                <div className="tk2-offices">
                  {CITIES.map((c) => (
                    <div key={c.name} className="tk2-office js-row">
                      <span>{c.name}</span>
                      <span className="tk2-office-bar">
                        <i
                          style={{ width: `${(c.present / c.total) * 100}%` }}
                        />
                      </span>
                      <b>
                        {c.present}/{c.total}
                      </b>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tk2-stats">
                  {tab.stats.map(([v, l]) => (
                    <div
                      key={l}
                      className={`tk2-stat js-row ${tab.kind === "alert" ? "bad" : ""}`}
                    >
                      <b>{v}</b>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="tk2-actions">
              <a href="/contact-us" className="trk-btn primary">
                Get Started with NGriffinpay <Icon name="arrow" size={16} />
              </a>
              <div className="tk2-nav">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => go(active - 1)}
                >
                  <span className="tk2-flip">
                    <Icon name="arrow" size={16} />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => go(active + 1)}
                >
                  <Icon name="arrow" size={16} />
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
    q: "What does Tracking in NGriffinpay cover?",
    a: "Tracking brings attendance, location and time together. It records check-ins from biometric devices, the mobile app and the web, tracks field staff with GPS and geo-fencing, and captures timesheets — all feeding straight into payroll.",
    keys: [
      "what is",
      "what does",
      "about",
      "overview",
      "explain",
      "tracking",
      "cover",
      "feature",
      "module",
    ],
  },
  {
    q: "Can it work with our existing biometric devices?",
    a: "Yes. NGriffinpay syncs with most popular biometric and face-recognition devices, so punches flow in automatically. Employees can also check in from the mobile app or web where devices aren’t available.",
    keys: [
      "biometric",
      "device",
      "machine",
      "face",
      "fingerprint",
      "integrate",
      "integration",
      "sync",
      "existing",
    ],
  },
  {
    q: "How does GPS and geo-fencing work for field staff?",
    a: "You set approved zones such as offices, sites or client locations. Field staff can only check in from inside these zones, their visits are logged with GPS, and any punch from outside a zone is flagged for HR to review.",
    keys: [
      "gps",
      "geo",
      "geofence",
      "geo-fence",
      "location",
      "field",
      "sales",
      "visit",
      "route",
      "zone",
    ],
  },
  {
    q: "Can employees log time against projects?",
    a: "Yes. Employees can fill timesheets against projects, clients or tasks. Managers approve them in one click, and billable and non-billable hours are reported separately.",
    keys: [
      "timesheet",
      "time sheet",
      "project",
      "client",
      "billable",
      "hours",
      "task",
      "log time",
    ],
  },
  {
    q: "Is tracking connected to payroll?",
    a: "Absolutely. Late marks, absences, overtime and approved timesheets are applied to payroll automatically, so there are no manual attendance sheets to reconcile at month-end.",
    keys: [
      "payroll",
      "salary",
      "overtime",
      "late",
      "absent",
      "lop",
      "loss of pay",
      "month-end",
      "connected",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about attendance, location or time tracking.";
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
      <div className="tkq-row bot" ref={ref}>
        <span className="tkq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="tkq-bubble bot tkq-typing"
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
      <div className="tkq-row user" ref={ref}>
        <div className="tkq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="tkq-row bot" ref={ref}>
      <span className="tkq-bot-av" aria-hidden>
        N
      </span>
      <div className="tkq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="tkq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function TrackingFaqSection() {
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
      gsap.from(q(".tkq-chat"), {
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
    <section className="tkq" ref={sectionRef} aria-labelledby="tkq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="trk-container tkq-grid">
        <div className="tkq-left">
          <span className="tkq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="tkq-title" className="tkq-title js-faq-reveal">
            Tracking – <span className="trk-grad">FAQs</span>
          </h2>
          <p className="tkq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="tkq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`tkq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="tkq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="tkq-q-text">{f.q}</span>
                  <span className="tkq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="tkq-chat">
          <div className="tkq-chat-head">
            <span className="tkq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="tkq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="tkq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="tkq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="tkq-suggest" aria-label="Suggested questions">
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

          <form className="tkq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about biometrics, GPS or timesheets…"
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

export default function Tracking() {
  return (
    <div className="trk-page">
      <HeroSection />
      <span id="trk-next" />
      <GlobeSection />
      <TrackingFaqSection />
    </div>
  );
}
