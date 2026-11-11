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
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay " />
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
} /* ------------------------------------------------------------------ */
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
      ["4", "client visits today"],
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

// Map projection: lon 67°–98°, lat 37.6°–6.6° → 620 × 620 SVG
const MAP = 620;
const toXY = (lat, lon) => [(lon - 67) * 20, (37.6 - lat) * 20];

// India map shapes (already projected to the 620 × 620 box above).
// Source: DataMeet India "india-composite" boundary + state boundaries (MIT licence),
// simplified for the web. Includes the complete map of India: J&K, Ladakh,
// the North-East, Andaman & Nicobar Islands.
const INDIA_OUTLINE =
  "M210.4 42.3L213.8 42.9L216.3 41.6L218.2 42.8L218.8 40.8L223.1 41.0L224.9 37.5L236 34.6L237.1 32.5L240.6 33.7L246.9 32.2L248.8 32.6L249.8 35.0L251.4 34.1L254.1 39.2L256.9 40.5L260 40.0L259.3 40.9L261.1 43.5L264.1 40.5L268.2 42.5L265.7 44.9L265.7 47.9L263.9 49.6L264.1 54.2L261.5 57.9L255.7 59.5L255.9 62.4L250.2 62.9L252.1 67.2L249.8 68.2L248.1 72.0L239.9 71.3L237.7 72.5L241.8 79.3L238.1 79.6L238.8 84.4L242.1 88.0L248.2 88.2L246.6 92.0L251.1 96.8L251 98.5L248.3 101.6L245.5 100.9L242.6 102.4L242 104.6L239.4 105.3L235.6 102.4L234.8 98.1L227.9 101.4L229.8 106.5L235.6 112.1L234 115.9L236.9 119.8L234.4 121.8L235.9 123.1L235.6 125.8L238 126.2L242 122.9L248.5 131.5L252.1 133.2L255 131.9L257.3 132.6L258.6 134.4L264.8 136.8L264.4 140.4L272.1 142.6L280.6 147.1L279.9 148.3L278.2 147.5L274.9 151.9L267.3 157.0L268.2 160.1L264.9 163.1L265.9 167.9L262.9 169.9L261.5 175.5L270.3 181.0L270.1 178.7L271.4 178.2L280.7 184.1L284.2 184.8L286.4 189.3L288.9 188.8L289.6 190.3L297.7 194.9L301.4 193.5L309 198.4L314.2 197.5L314.7 202.0L323.8 202.9L326.3 205.4L328.2 203.7L327.8 202.4L332.3 202.6L337.3 205.1L336.9 203.1L340.5 203.3L343 201.7L345.8 204.3L352.4 205.2L353.8 207.6L352.9 211.1L359.3 212.8L360.5 214.9L363.8 214.6L364.2 216.8L366.7 217.2L372.5 214.5L374.6 215.8L374.7 219.0L377 220.6L380.5 218.7L384.3 220.2L386.7 219.6L394.6 223.5L401.4 220.3L401.8 223.0L406.8 225.1L409.3 223.2L412.1 224.4L417.8 222.3L420.2 224.8L421.8 223.5L423.7 217.2L422.7 212.3L419.7 209.6L421.3 205.3L420.9 202.1L423.9 196.2L422.4 193.6L428.3 192.4L432.7 189.6L436.7 191.7L437.8 194.9L435.3 200.7L438.3 206.2L434.9 209.2L437.4 209.8L437.5 213.1L438.4 212.1L442.7 215.9L447.6 214.8L453 216.5L452.5 217.5L457.2 218.0L463.9 216.5L467.1 214.0L474.3 216.6L493.8 215.9L497.8 213.6L501.1 215.1L502.4 212.8L500.6 210.4L500.8 206.8L502.5 206.3L500.3 202.4L493 202.3L491.2 199.4L492.9 196.8L498.5 197.7L504.9 194.2L506.4 196.1L509.1 196.1L514.6 192.4L513.5 189.0L518.4 188.0L528.5 178.8L534.2 178.7L545.2 173.4L547.3 171.5L545.9 169.0L552.5 166.1L553.9 165.7L556.1 168.7L560.4 169.5L559.9 168.5L565.3 170.6L568.7 168.1L570.1 169.5L570 168.2L572.1 167.3L574.2 167.9L576.2 165.0L581.1 164.3L586.1 168.2L583.7 171.3L586.6 169.7L592.6 177.3L588.1 181.9L590 183.4L589.9 181.2L594.2 179.8L598.5 184.9L602.5 184.8L607.2 187.9L606.2 190.8L607.9 191.8L607.3 194.5L604.9 194.0L597.8 199.9L598.1 202.9L603.3 209.2L602.8 210.2L597.4 208.3L597.7 206.8L594.1 204.6L590.5 206.3L584.6 206.4L568.6 218.0L563 219.7L561.2 223.0L562.6 224.4L562.4 230.0L563.7 230.5L560.2 234.0L561 236.8L558 240.7L552.7 244.1L551.5 247.7L554.8 249.5L554.3 253.3L548 262.4L543.1 275.0L538.6 273.0L536.2 273.5L535.1 271.9L530.1 273.2L528.3 270.5L526.6 270.4L528.8 278.3L527.1 284.9L527.7 289.3L525.9 291.9L522.5 291.1L522.1 301.5L524 306.7L523 308.5L520.8 308.1L520.1 312.3L519 311.4L518.1 313.2L517.3 310.7L514 308.9L513.6 311.8L512.1 312.4L510.3 297.6L507.4 293.3L506.9 287.3L508.1 287.2L505.6 277.6L504.3 279.0L503 277.3L500.9 279.1L499.1 277.3L499.4 282.4L495.2 286.0L496.7 290.2L492.4 293.3L489.1 286.8L488.2 286.3L487.6 287.8L488.3 290.7L486.9 290.0L486.4 284.8L483.2 279.8L484.7 273.5L486.1 272.0L487.6 272.5L487.5 269.8L491.7 270.5L493.3 267.3L495.3 269.2L494.9 267.1L498 269.3L498.4 265.3L503.3 263.6L503.1 261.5L504.5 261.7L505.9 257.3L504.6 254.0L510 254.5L508.5 251.4L501.2 248.2L492.8 249.5L492.2 248.5L489.4 249.3L485.4 247.9L468.8 249.1L456.8 246.1L457.6 239.7L456.3 235.7L457.7 233.1L456.5 233.1L457.4 232.4L453.6 227.2L451.8 228.9L453 230.7L451.5 232.6L448.5 231.0L447.1 231.8L443.1 229.2L441.7 224.0L439.1 222.8L438.1 223.8L441 227.2L438 226.2L436.8 227.4L435.9 225.8L433.3 226.7L434.9 225.0L428 219.5L426.6 222.4L429.7 222.8L430.5 224.8L429.2 224.5L427 227.6L423.5 229.0L422.1 235.7L425.4 235.8L430.8 241.8L434 242.6L436.2 241.5L436.8 244.7L440.2 246.7L438.5 248.7L428.8 247.8L428 253.1L426.6 254.6L424.5 252.8L422.8 253.3L423.5 254.8L420.2 258.6L426.7 264.4L434.7 266.4L434 269.6L435.4 272.4L431.5 274.8L431.2 279.0L434.8 282.4L436 282.1L434.4 286.9L439.9 287.7L436.9 291.8L439.4 295.1L438.2 296.9L438.8 300.8L439.9 306.3L442 308.9L440.8 310.0L441.3 313.3L440.4 312.5L439.7 314.1L442 319.3L438.4 319.4L437.2 316.5L437 319.7L436.4 318.3L434.5 318.4L434 314.9L435.6 311.7L435.1 310.5L433.7 310.7L434.4 311.9L432.8 310.5L431.1 315.7L430.4 313.0L429.2 314.1L429 319.8L428.5 317.6L427.9 320.2L428 317.6L425.5 317.3L426.2 320.4L424.9 320.8L423.1 312.9L424.2 309.0L420.4 307.5L423.8 309.9L416.1 318.1L407.5 321.0L401.8 321.3L398.2 325.2L396.5 329.3L399.5 335.6L397.4 336.5L399.9 336.6L399.3 338.1L401.4 337.6L395.4 341.9L394.6 341.3L394.2 343.8L395.8 344.5L393.5 346.1L396 345.1L390.4 348.3L388.5 352.0L386.3 352.2L387.4 353.0L370.8 358.1L360.8 364.2L354.9 369.7L347.2 380.9L342 385.0L342.6 385.8L331.1 391.5L324.3 400.2L312 406.3L306.1 411.2L305 414.5L307.2 415.5L306.7 412.2L307.4 413.8L306.8 417.3L305.4 417.9L307.4 417.7L306.2 420.1L305.2 418.2L306.1 420.8L294.4 425.8L294.3 424.7L294.2 425.9L291.1 424.6L285.3 426.1L283 432.6L278.8 437.8L278 436.9L278.5 437.7L276.6 438.0L276.1 435.2L273.5 434.2L265.3 438.6L261 450.5L263.7 460.1L262.8 460.7L263.9 460.4L262.1 467.0L262.5 470.7L265.1 476.4L266.9 486.3L263.1 502.8L257.5 511.2L255.2 518.6L256.6 524.7L255.2 524.4L256.8 525.0L257.1 528.1L257.6 545.8L255.9 546.5L252.8 544.7L245.9 546.8L244.6 549.1L245.4 551.2L239.9 557.8L238 562.3L239.2 565.2L243.8 566.4L237.2 567.0L225.3 571.6L222.5 576.8L224 576.7L222.2 579.2L221.4 584.5L211 590.5L206.3 589.5L200.2 585.0L190.9 574.0L193.3 572.1L190.8 573.3L189.9 568.6L188.6 567.0L189.2 569.2L187.1 564.7L185.4 551.3L184.4 552.0L184.2 548.1L183.1 548.2L181.3 541.1L178.4 536.4L179.2 535.8L178.2 536.3L177.4 529.5L175.2 524.8L172.4 522.5L170.9 517.8L166.3 512.6L164 511.9L156.5 495.2L153.9 485.1L153.3 479.4L154.4 479.2L153 478.7L148.5 466.5L150.3 467.2L148.4 466.3L145.7 457.8L142.4 456.6L143.3 454.8L142.3 455.2L138.3 450.3L139.1 448.9L138 445.4L135.7 443.8L137.7 443.4L135.8 442.8L136.5 441.9L135.4 442.2L134.7 440.2L135.8 439.0L134.7 439.7L132.6 434.6L129.1 430.9L127.7 425.3L128.6 424.6L127.3 424.4L129.4 423.7L127.4 424.1L126.3 421.8L126.7 420.8L127.2 422.4L128.9 422.0L126.4 420.0L128 419.7L126.7 419.6L126.1 417.4L126.9 415.4L125.9 415.7L125.7 413.0L126.6 412.6L125.1 411.0L125.7 412.0L126.5 411.2L123.8 406.1L126 406.2L123.4 404.0L124.3 403.3L122.8 400.8L124.3 400.2L122.8 399.8L122.6 395.3L120.6 393.0L121.8 392.2L120.4 392.2L118.7 387.7L119.3 386.4L122 389.2L121.7 385.6L120.6 386.7L118.4 385.1L118.1 381.2L120.1 382.7L117.1 378.1L117.4 376.0L118.8 375.5L120.3 377.7L119.8 374.7L118.2 374.1L121.3 371.6L120 371.9L119.7 368.2L119.2 371.3L116.1 374.1L116.6 368.4L115.6 368.9L116.8 366.9L115.7 368.2L115.7 365.9L118.2 366.2L115.5 365.0L114.9 362.8L117.8 361.5L114.6 361.4L113.1 355.3L113.3 353.3L114.9 353.2L115.1 346.2L118 341.4L116.9 337.1L118.6 336.8L116.5 336.1L115.7 333.6L117 332.6L115.2 333.4L114.7 332.0L114.6 330.9L117 331.4L116.6 330.2L114.1 330.3L115.8 328.4L112.8 330.4L112.8 327.9L114.8 328.0L112 326.0L113.7 324.9L114 322.7L115.2 323.0L112.9 323.1L113.6 322.0L116.7 318.7L118.6 318.5L110.7 318.7L112.4 313.9L115 312.5L110.7 314.1L110.2 312.5L111.7 307.9L115.2 308.5L118.2 306.7L115 307.4L110.7 305.9L108.6 307.9L107.6 305.3L106.5 305.8L106 309.9L103.6 311.6L104.9 313.5L103.3 312.8L105 313.8L105 315.8L104.3 314.9L103.3 315.8L106.1 319.5L101.8 325.7L102.2 328.0L90.3 332.9L88.8 334.6L76.4 338.2L63.1 330.9L38.7 305.9L41.4 302.4L40.7 304.2L43.8 303.6L43.1 305.8L44.5 306.9L49.6 305.4L50.2 303.5L51.5 305.6L53.4 305.5L54.6 302.5L56.2 304.0L59.7 301.1L63.5 301.2L69 292.6L65.7 293.1L64.4 290.9L64.5 292.9L62.6 292.1L62 293.8L57.7 293.7L54.2 297.2L49 296.5L47 295.6L47.2 294.4L47 295.6L43.9 295.3L32.6 288.6L34.4 289.3L31.6 287.5L33.6 286.0L31.5 285.1L30.2 282.1L29 282.4L29.4 281.0L28.5 281.8L31 277.7L36.2 274.4L30.3 277.1L28.7 277.3L28.5 275.6L27 280.4L23.4 279.7L27 277.4L25.2 277.3L24.9 278.6L23.8 277.4L27.1 272.5L35.1 272.6L36.2 265.7L37.3 267.8L38.9 265.9L40.1 267.5L51.9 266.2L54.6 268.6L60.5 268.6L62.2 266.1L71.2 263.6L71.4 267.0L74.3 267.7L82.4 264.0L80 263.1L79.7 260.1L81.9 258.2L77.8 249.0L73.3 244.1L73.2 238.0L65.4 237.7L62 233.2L63.5 221.0L56.5 220.2L50.2 217.1L51.7 208.3L60.5 200.7L62.7 195.9L67.4 191.8L71.8 191.8L74.8 197.2L77.4 197.9L84.1 195.3L98 192.8L98.5 189.6L104.1 184.1L107.8 176.6L118.9 171.4L125.6 160.6L127.9 153.1L136.1 150.6L139.5 148.0L137.6 144.8L139.5 143.1L138.7 142.2L141.4 141.5L148.3 133.2L153.9 130.5L153.8 129.4L151.4 130.4L150.2 129.4L151 124.7L153.1 123.5L149.7 117.7L152.1 114.2L156.4 112.8L157.6 110.9L164.8 110.2L167.4 107.5L166.4 105.1L162 102.5L153.6 102.1L152.8 99.7L154.1 95.2L152.8 97.0L147.4 96.6L138.5 91.3L136.3 91.8L132.7 90.1L131.9 74.2L130 71.6L129.8 66.4L128 64.4L129.1 60.6L133.1 60.7L134.6 56.7L140.9 54.2L142.6 49.6L135 47.6L133.9 45.0L135.7 41.5L128.1 41.4L126.6 38.7L122.5 37.6L124 36.3L123.6 34.8L111.4 35.0L110.2 34.0L111 27.3L119.3 22.5L121.5 19.8L121.2 18.1L127.5 16.8L137 17.6L136.8 16.0L133.4 13.6L140.8 15.3L148.5 11.9L151.3 12.6L153.8 10.1L154.7 11.2L156.8 10.7L158 13.2L162.9 11.3L168.4 12.8L169.2 17.4L174.7 16.9L178.8 19.9L180.6 23.2L194.4 28.8L196.8 34.8L201.8 37.2L207 37.6L209.4 39.0L210.4 42.3ZM518.2 493.8L519.8 497.8L519 499.7L519.6 502.2L518.6 502.7L519.4 502.7L518.4 504.0L518.2 502.9L517 502.6L517.8 503.8L516.2 502.9L517.9 505.6L514.9 506.1L514.1 505.5L513.9 499.8L515.2 498.7L515.8 499.3L515.9 498.0L514.9 498.6L514.6 495.6L515.8 495.5L516.1 494.2L517.4 494.5L518.2 493.8ZM521 481.1L520.3 483.5L521.4 483.7L521.9 485.4L519.3 485.2L521.5 486.7L520.8 490.9L519.4 491.9L519 490.1L518.8 491.0L517.9 490.2L518.4 490.9L517.7 491.2L518.4 491.2L518.9 492.7L518.3 493.1L518.1 492.2L517.3 493.2L517.5 494.4L516.2 494.1L516 492.5L516.7 491.8L515.9 491.7L516 490.2L516.4 490.6L516.3 489.5L517.1 489.3L516.3 489.0L517.2 487.3L516.6 485.8L517.7 484.3L517 484.0L517.7 483.9L517.6 482.7L518.8 482.1L518.6 481.4L519.9 481.4L520.7 480.5L521 481.1ZM514.2 507.5L514.1 508.7L515.3 508.6L514.9 510.9L514.2 511.0L516 511.0L514.9 511.4L515.5 512.0L514.5 513.5L514.8 514.1L515.8 513.3L516 514.1L515.3 518.1L514.2 518.0L514.4 518.7L513.4 519.1L514.1 519.7L514.6 518.5L515.3 518.8L514.4 522.5L513.1 521.7L513.1 520.7L512.5 520.9L512.3 519.7L513 519.4L512.3 519.3L512.1 517.8L511.4 518.2L511.1 515.1L510.4 515.1L511.4 513.2L512.3 515.1L512.6 510.0L514.2 507.5ZM536.9 607.1L537.9 607.9L537.9 610.2L539.3 611.9L538.6 612.1L539.1 612.8L538.2 613.9L538.3 615.8L537.4 615.7L536.8 616.9L536 614.3L534.6 612.1L533.4 611.7L533.2 609.4L533.7 608.3L536.9 607.1ZM511 534.4L511.8 534.9L511.9 536.2L511.3 536.1L512.4 536.8L512.4 538.6L511 540.2L511.6 540.6L510.5 541.9L507.7 541.5L508.3 539.4L507.7 536.2L510.1 534.2L511 534.4ZM423.4 316.3L423.1 318.4L422.6 318.4L423 319.3L421 319.2L422.5 314.7L423.4 316.3ZM516.5 505.9L517.9 506.3L517.8 508.1L517 508.1L517.3 508.7L516.5 508.8L515.5 510.8L514.9 510.1L515.7 507.3L515 507.1L515.6 505.8L516.5 505.9ZM527.6 591.6L529.1 593.4L529.2 594.6L526.8 594.2L527 593.2L526.4 593.5L526.4 592.1L527.6 591.6ZM534.7 603.5L535.5 604.7L533.3 607.0L533 604.6L534.5 604.2L534.4 603.1L534.7 603.5ZM530.7 587.3L531 588.4L530.2 589.0L531.2 591.3L530.2 592.0L529.9 591.2L531 590.7L529.9 591.0L529.3 588.7L530.7 587.3ZM515.6 567.1L516.6 569.2L514.8 569.6L514.4 567.8L515.6 567.1ZM513.2 522.1L513.9 523.6L513.1 523.9L514 524.7L512.2 525.2L512.5 522.2L513.2 522.1ZM514.2 492.3L514.7 494.2L513.5 496.4L513.2 494.9L514.2 492.3ZM519.5 511.3L520.3 511.6L521 514.4L520.2 512.5L519.8 513.1L518.6 512.1L519.5 511.3ZM522.6 584.9L522.7 586.5L524 588.1L521.9 586.7L522.6 584.9ZM431.2 317.4L432.1 318.3L431.9 319.6L430.6 318.8L430.4 317.8L431.2 317.4ZM434.5 318.7L435.4 318.9L435.8 320.3L434.2 320.2L433.8 318.3L433.9 317.8L434.5 318.7ZM432.9 313.7L432.7 316.3L431.9 314.8L432.9 313.7ZM521.6 507.8L521.6 510.4L520.9 509.5L521.6 507.8ZM421.4 313.6L421.6 311.8L422.9 311.4L421.4 313.6ZM430.9 315.8L431.4 317.3L430.5 317.6L430.1 316.6L430.9 315.8ZM531.3 591.5L531.8 593.5L530.4 592.3L531.3 591.5ZM433.3 311.6L434.3 312.0L433.6 313.1L432.6 312.8L433.3 311.6ZM504.7 520.3L505.6 520.5L505.5 521.7L504.5 521.5L504.7 520.3ZM431.1 319.4L431.8 320.0L430.9 320.6L430.2 319.9L430.5 319.0L431.1 319.4ZM426.2 317.9L427.1 319.0L426.3 319.9L426.2 317.9ZM424.2 318.6L424.3 320.1L423.6 318.2L424.1 317.5L424.2 318.6ZM520.6 509.1L521 511.1L520.3 510.4L520.6 509.1ZM436.9 320.0L438 320.7L436.8 320.7L436.9 320.0ZM430.6 320.8L429.6 320.8L429.8 320.1L430.6 320.8ZM514.8 507.9L515.4 507.6L515.5 508.4L514.6 508.2L514.8 507.2L514.8 507.9ZM520.1 509.9L519.9 511.1L519.4 510.1L520.1 509.9ZM532.6 581.4L532.6 583.7L532.6 581.4Z";
const INDIA_STATES =
  "M582 163L585 167L588 167L582 170L583 174L590 170L590 172L592 176L585 184L588 185L593 183L608 188L606 191L608 192L608 194L605 194L598 200L603 210L594 205L585 206L565 219L564 211L569 209L570 207L578 207L580 205L577 204L575 198L579 193L572 193L549 201L545 199L545 202L536 209L537 211L530 213L520 214L513 211L502 214L500 202L493 202L491 200L493 197L491 195L498 198L504 195L511 196L515 192L514 190L524 185L524 183L527 179L539 179L544 170L553 165L556 169L569 171L572 167L582 163ZM579 193L575 198L577 204L580 205L578 207L570 207L569 209L549 219L546 223L545 221L540 229L540 234L536 236L535 233L526 241L529 246L524 256L522 256L521 264L517 264L515 262L509 269L508 267L504 267L506 257L505 254L510 255L510 250L516 248L511 243L513 240L511 241L508 237L503 239L504 234L503 233L506 231L498 232L496 230L493 234L492 231L491 235L484 238L484 235L480 236L479 233L463 233L458 237L460 240L457 243L458 233L454 228L457 224L457 217L468 214L474 217L494 216L498 214L501 215L513 211L520 214L532 213L545 202L545 199L549 201L572 193L579 193ZM206 383L207 386L212 386L211 391L213 393L209 400L214 402L208 408L210 412L209 420L205 422L212 426L210 427L210 434L204 433L201 435L203 439L200 442L203 449L202 452L196 450L197 453L195 460L200 462L198 464L199 467L202 468L203 465L208 468L208 465L210 467L210 469L207 469L208 474L206 471L203 472L200 468L198 469L201 473L200 477L204 477L204 474L209 475L210 478L220 473L219 476L222 475L222 479L228 480L227 485L231 486L232 489L228 493L229 495L227 493L225 497L217 495L215 498L212 499L212 505L209 508L215 508L214 513L210 513L208 517L205 516L202 518L200 516L197 520L192 520L182 515L182 512L177 513L168 506L166 500L161 499L160 496L157 497L152 475L145 458L142 456L146 451L145 447L147 446L145 439L142 439L147 436L149 431L147 431L150 430L150 427L146 427L145 421L148 421L149 419L151 421L154 420L154 418L158 417L159 413L164 415L166 413L173 413L173 402L179 406L188 406L187 400L190 397L194 398L195 394L198 394L199 388L202 389L206 383ZM552 238L551 242L554 243L552 248L555 251L543 275L535 272L530 273L527 270L525 272L520 270L522 256L524 256L529 246L532 248L535 241L546 242L552 238ZM496 230L498 232L506 231L503 233L504 234L503 239L508 237L511 241L513 240L511 243L516 248L509 251L501 248L469 249L457 246L458 241L460 240L458 237L462 233L479 233L480 236L484 235L484 238L491 235L492 231L493 234L496 230ZM515 262L517 264L520 264L520 270L527 271L529 278L528 289L526 292L522 291L524 307L521 308L518 313L514 309L512 312L505 276L506 267L510 269L515 262ZM564 211L565 218L561 223L564 230L558 241L552 243L551 238L546 242L537 241L532 248L530 247L526 241L535 233L536 236L540 234L540 229L545 221L546 223L549 219L564 211ZM177 102L179 104L172 107L172 111L178 113L184 126L188 123L189 126L193 128L192 132L197 136L194 137L198 140L199 144L195 144L191 147L193 148L191 150L188 148L186 150L184 149L185 155L181 157L169 156L165 161L163 159L165 157L162 154L138 152L139 142L154 130L150 129L153 124L150 118L152 114L158 111L165 110L167 105L171 106L177 102ZM140 150L138 152L150 153L150 157L152 157L152 166L157 164L162 167L168 167L171 180L182 189L179 190L181 190L180 195L184 196L183 192L187 191L186 188L190 189L191 193L196 188L199 189L198 199L202 197L201 196L206 196L207 202L214 208L210 211L215 212L208 215L209 217L215 213L220 215L225 214L222 218L201 229L190 238L191 243L195 245L204 246L207 244L208 250L197 252L199 255L196 256L201 258L201 261L200 263L196 261L198 270L194 269L194 266L191 269L184 268L184 265L180 273L174 274L174 277L172 276L170 272L177 271L175 264L178 263L177 257L164 258L164 255L168 255L165 254L167 251L163 251L161 255L157 253L157 256L160 257L158 259L156 256L154 262L157 263L155 267L158 268L160 272L159 279L150 285L155 288L147 291L139 284L132 283L133 280L130 280L127 276L127 270L125 272L121 268L124 265L122 264L122 262L118 265L111 262L109 264L105 260L107 259L101 258L97 260L82 258L73 244L73 238L65 238L62 233L64 221L56 220L50 216L52 208L67 192L72 192L75 197L77 198L98 193L108 177L119 171L128 153L140 148L140 150ZM432 189L438 194L435 201L438 206L429 210L422 209L420 208L424 196L423 193L432 189ZM503 262L505 264L504 267L507 268L506 275L505 279L499 277L499 283L496 282L497 290L492 293L489 287L488 291L487 290L483 277L486 272L488 272L488 270L492 270L493 267L495 269L495 267L498 270L498 265L503 264L503 262ZM241 123L248 132L257 132L265 137L264 140L281 148L278 148L267 157L268 160L265 163L266 168L263 170L260 177L256 176L256 174L248 175L241 169L238 170L234 166L239 163L232 161L230 157L227 156L219 160L219 158L216 158L214 155L219 147L211 144L216 141L214 137L216 131L227 126L240 130L238 126L241 123ZM226 354L230 356L237 357L239 361L244 363L245 360L249 362L255 360L258 362L258 376L262 378L266 378L267 380L270 380L275 384L275 388L280 388L280 396L282 397L278 397L277 400L286 404L284 407L278 408L277 411L272 409L269 411L268 410L267 412L272 414L271 417L268 416L264 411L260 414L261 416L259 419L256 417L245 421L244 428L240 427L235 432L232 430L225 432L222 435L210 434L210 427L212 425L205 422L209 420L210 412L208 408L214 402L209 400L213 393L211 391L211 383L219 375L215 371L217 366L224 367L224 364L226 363L226 354ZM342 202L352 205L353 211L364 215L364 217L373 215L377 221L380 219L387 220L395 224L401 220L402 223L407 225L418 222L420 225L422 221L425 221L426 225L416 233L421 238L422 242L418 241L416 243L416 247L412 245L410 248L407 248L403 252L401 260L392 260L389 265L381 256L375 256L373 260L367 261L362 265L358 265L356 261L350 266L346 261L342 262L340 259L338 261L330 262L331 260L326 252L327 248L337 243L342 238L353 237L351 234L341 230L340 227L343 227L344 225L338 223L342 219L348 220L345 217L345 215L341 214L339 206L337 206L337 203L342 202ZM160 496L161 499L166 500L167 503L168 502L168 506L172 509L188 517L189 519L185 521L185 523L191 525L189 528L195 528L196 531L193 533L198 536L196 540L197 546L200 548L205 545L206 553L203 560L208 562L203 572L206 581L204 586L200 584L191 574L177 530L171 518L164 512L157 497L160 496ZM227 215L240 218L243 225L235 237L236 240L229 241L226 244L229 249L223 255L228 267L230 264L236 268L239 265L238 259L235 260L236 256L233 253L232 247L229 246L233 243L236 245L235 242L237 243L238 241L240 244L236 246L237 247L239 245L238 249L240 246L241 249L246 250L246 245L250 247L248 250L257 250L257 247L265 244L269 248L267 252L269 250L269 252L271 252L270 250L272 251L272 249L276 251L274 249L278 248L276 254L283 254L286 249L290 251L292 248L292 251L298 252L299 256L304 256L306 260L308 260L309 258L316 260L313 269L316 273L313 275L296 276L292 274L294 278L292 280L292 282L298 281L304 286L303 289L299 290L292 301L282 303L280 311L278 310L276 317L274 318L273 325L268 324L265 320L251 321L250 318L245 318L238 320L239 322L229 322L228 320L219 324L210 324L208 321L212 321L211 318L206 317L196 320L192 328L183 330L182 325L164 324L158 319L151 318L149 311L143 313L141 305L146 304L141 301L148 299L150 295L146 291L155 288L150 285L159 279L160 272L158 268L155 267L157 263L154 262L156 256L158 259L160 257L157 256L157 253L161 255L163 251L167 251L165 254L168 255L164 255L164 258L177 257L178 263L175 264L177 271L170 272L172 276L174 277L174 274L180 273L184 265L184 268L191 269L194 266L194 269L198 270L196 261L200 263L201 261L201 258L196 256L199 255L197 252L208 250L207 244L204 246L195 245L191 243L190 238L198 230L227 215ZM521 481L520 483L521 484L519 485L521 487L521 490L519 492L518 489L519 492L517 494L517 484L521 481ZM518 494L519 502L518 504L516 502L518 505L514 506L514 500L516 499L514 496L516 497L516 494L518 494ZM101 258L107 259L105 260L109 264L111 262L118 265L122 262L122 264L124 265L121 268L125 272L127 270L127 276L130 280L133 280L132 283L142 286L150 295L148 299L141 301L146 304L141 305L143 313L136 316L138 318L136 319L137 322L146 321L146 322L139 324L136 328L132 329L138 332L139 337L135 341L129 338L128 348L125 350L121 349L123 346L122 345L115 349L118 340L112 326L115 321L112 320L116 319L111 318L113 313L110 313L112 308L115 308L119 306L115 307L110 306L108 308L108 306L103 316L106 320L102 328L76 338L63 331L39 306L41 302L41 304L44 304L43 308L47 305L53 305L55 302L57 303L62 301L74 288L66 288L62 294L49 296L35 290L32 288L33 286L31 287L32 285L28 284L30 282L26 282L22 279L27 272L35 273L36 266L37 268L39 266L40 268L52 266L55 269L60 269L62 266L72 264L71 267L76 268L82 264L80 261L82 258L97 260L101 258ZM396 337L401 338L395 342L396 345L388 353L367 360L355 370L353 369L352 372L348 372L346 376L338 376L332 369L331 372L329 370L329 373L326 372L328 375L320 379L321 384L316 383L313 387L310 381L305 392L301 391L292 396L288 396L290 387L295 385L299 380L298 379L305 374L304 363L301 362L301 356L297 354L297 351L305 352L307 355L309 354L312 355L312 356L314 355L314 352L308 351L307 334L309 335L313 329L319 328L323 330L325 324L328 325L327 322L332 315L331 310L340 305L340 302L346 305L361 302L362 306L360 310L365 312L367 309L374 311L376 310L375 312L378 313L381 308L379 303L381 301L399 310L401 315L405 313L410 320L399 325L397 329L399 336L396 337ZM151 51L152 54L155 55L159 56L162 54L165 56L164 59L167 61L168 66L174 68L177 73L180 72L185 77L184 81L189 81L196 87L188 88L179 94L177 93L179 99L171 106L160 102L154 102L154 95L153 97L147 97L132 90L132 74L128 64L129 61L133 61L135 56L141 54L142 50L151 51ZM326 270L334 276L336 280L340 279L341 289L343 293L348 292L348 294L340 300L340 305L332 308L331 311L332 315L327 322L328 325L325 324L324 329L313 329L309 335L307 334L308 351L314 352L314 355L312 356L312 354L307 355L305 352L298 351L297 354L301 356L301 362L304 363L305 374L298 379L299 380L295 385L290 387L288 396L280 396L280 388L275 389L275 384L270 380L267 380L265 377L267 376L266 372L268 367L272 364L275 366L278 362L271 356L268 356L271 351L268 347L272 345L273 340L270 340L272 338L269 330L274 326L274 318L276 317L278 310L280 311L282 303L292 301L299 290L303 289L304 286L298 281L292 282L292 280L294 278L292 274L310 276L316 273L323 274L326 270ZM202 174L207 178L207 182L204 184L197 181L202 174ZM137 436L140 440L145 439L147 446L144 454L141 454L136 444L139 443L136 443L134 438L137 436ZM196 133L203 138L204 143L212 145L202 157L205 174L199 176L199 179L197 180L204 184L207 182L210 184L211 193L205 196L201 196L200 199L198 198L199 189L197 188L191 193L190 189L186 188L187 191L183 192L184 196L179 195L181 190L179 190L182 189L171 180L168 167L162 167L157 164L152 166L152 157L150 157L151 153L156 152L160 155L162 154L163 156L164 155L165 161L169 156L181 157L185 155L184 149L186 150L188 148L191 150L193 148L191 147L195 144L199 144L196 133ZM196 87L199 91L207 96L214 92L220 100L228 97L226 102L229 102L231 104L229 107L232 108L236 112L234 116L237 120L234 122L235 125L240 130L227 126L218 129L214 137L216 141L212 144L204 143L203 138L192 132L193 128L189 126L188 123L184 126L178 113L172 111L172 107L179 104L177 102L178 97L176 94L196 87ZM412 245L416 247L419 253L416 257L418 260L415 260L416 264L413 267L414 269L410 270L409 272L405 271L405 276L396 275L396 278L389 279L386 284L381 280L381 282L377 283L378 289L384 292L391 292L388 296L395 300L398 307L389 306L381 301L379 303L381 308L378 313L375 312L376 310L374 311L368 309L365 312L360 310L362 306L361 302L346 305L340 302L348 293L343 293L341 289L340 279L336 280L334 276L327 270L329 265L328 262L338 261L340 259L342 262L346 261L350 266L356 261L358 265L362 265L367 261L373 260L375 256L381 256L389 265L392 260L401 260L403 252L412 245ZM266 482L267 486L263 503L257 513L255 514L255 512L254 514L256 515L254 516L256 516L257 532L254 533L257 536L258 546L246 547L245 551L238 562L241 566L247 566L249 569L239 566L228 570L224 573L221 584L211 590L206 590L202 586L206 581L203 572L208 562L203 560L206 548L205 545L200 548L197 546L196 540L198 536L193 533L196 531L195 528L189 528L191 525L185 523L185 521L190 518L197 520L198 516L208 517L210 513L214 513L216 510L209 507L212 505L212 499L215 498L217 495L229 500L234 491L243 492L245 489L246 490L249 488L249 485L255 488L260 481L265 483L265 481L266 482ZM212 144L219 147L215 153L216 158L219 158L220 160L227 156L230 157L232 161L239 163L234 166L238 170L242 169L248 175L256 174L259 178L262 175L270 181L272 178L284 185L286 189L288 189L298 195L301 194L309 198L314 198L315 202L324 203L326 205L328 202L332 203L338 206L341 214L345 215L345 217L348 220L342 219L338 222L344 225L343 227L340 228L353 237L342 238L337 243L327 248L327 255L331 260L328 262L329 265L324 274L319 275L313 270L316 259L309 258L308 260L306 260L304 256L299 256L298 252L292 251L292 248L290 251L286 249L283 254L276 254L278 248L274 249L276 251L270 250L270 252L269 250L266 252L269 248L265 244L257 247L257 250L248 250L250 247L246 245L246 249L243 250L240 246L238 249L239 245L237 247L236 246L240 244L239 241L237 243L235 242L236 245L233 243L229 246L232 247L233 253L236 256L235 260L238 259L239 265L236 268L230 264L227 266L223 255L229 249L226 244L229 241L236 240L235 237L243 223L240 218L227 215L225 216L224 213L220 215L215 213L209 217L208 215L215 212L210 211L214 208L206 200L206 196L211 193L211 187L204 176L202 160L204 154L212 144ZM421 208L429 210L431 208L436 209L437 213L442 216L451 216L457 218L458 220L457 224L454 226L455 229L453 227L451 233L443 229L442 224L439 223L438 225L441 227L433 227L435 225L428 219L427 222L430 225L424 229L422 234L431 242L436 242L437 245L440 246L438 249L429 248L428 253L427 255L423 253L420 258L424 262L435 266L435 272L432 275L431 279L436 282L434 287L440 288L437 292L439 295L440 306L442 309L440 314L439 313L440 310L438 313L435 313L435 309L433 313L433 307L432 314L430 314L431 311L429 314L428 312L428 316L427 313L426 315L425 313L425 321L424 308L420 307L423 310L420 310L420 315L416 318L410 320L405 313L401 315L401 311L394 309L398 306L395 300L388 296L391 292L384 292L376 287L377 282L381 282L381 280L386 284L389 279L396 278L396 275L405 276L405 271L409 272L410 270L414 269L413 267L416 264L415 260L418 260L416 257L419 253L414 247L417 247L415 244L418 242L422 242L421 238L416 233L426 225L425 221L422 221L424 217L420 210L421 208ZM354 369L355 370L343 386L332 391L324 400L306 411L306 421L294 426L286 426L279 438L276 438L276 435L274 434L266 438L261 450L264 460L262 469L265 483L260 481L255 488L249 485L249 488L246 490L245 489L243 492L234 491L231 498L228 500L224 498L227 493L229 495L228 493L232 486L228 485L228 480L222 479L222 475L219 476L220 473L216 473L214 477L209 478L209 475L204 474L204 477L200 477L201 473L198 469L200 468L203 472L206 471L208 474L207 469L210 468L208 465L208 468L206 465L199 467L198 464L200 462L195 460L197 453L196 450L202 452L203 449L200 442L202 439L202 434L223 435L228 430L236 432L240 427L244 428L245 421L256 417L259 419L261 416L260 414L264 411L268 416L271 417L272 414L267 412L268 410L269 411L272 409L277 411L278 408L284 407L286 404L277 400L279 397L281 397L283 395L292 396L301 391L305 392L310 381L313 387L316 383L321 384L320 379L328 375L326 372L329 373L329 370L331 372L332 369L335 374L336 372L338 376L342 377L347 376L348 372L352 372L354 369ZM148 311L152 319L158 319L166 324L182 325L182 329L186 331L192 328L196 320L206 317L211 318L212 321L208 322L212 325L219 324L228 320L229 322L239 322L238 320L245 318L250 318L251 321L265 320L268 324L274 326L269 330L272 338L270 340L273 340L272 345L268 347L271 351L268 356L271 356L273 360L278 362L277 365L274 366L272 364L270 365L266 372L267 376L262 378L258 376L257 370L260 364L256 360L249 362L245 360L244 363L239 361L237 357L226 354L226 363L224 364L224 367L217 366L215 371L219 375L215 378L215 381L212 381L211 386L207 386L208 384L206 383L202 389L199 388L198 394L195 394L194 398L190 397L187 400L188 406L179 406L173 402L173 413L166 413L164 415L159 413L158 417L154 418L154 420L151 421L149 419L145 421L146 427L150 428L147 431L149 431L147 436L144 436L140 440L137 436L134 438L127 425L130 424L127 424L126 422L125 406L119 388L122 389L122 385L121 387L118 385L114 361L116 360L113 353L116 354L114 351L117 348L124 351L126 348L128 348L129 338L135 341L139 337L138 332L132 329L136 328L139 324L147 321L137 322L136 319L138 318L136 316L148 311ZM164 59L165 56L162 54L158 56L152 54L150 50L145 51L134 48L136 42L125 39L122 34L114 35L111 34L112 27L120 23L122 18L138 18L134 14L141 16L149 12L152 13L154 10L158 14L167 11L175 20L193 28L196 31L194 33L196 35L207 38L210 41L206 41L208 42L220 43L219 40L223 41L228 36L243 35L244 32L248 32L255 36L260 35L266 43L261 58L256 60L256 62L250 62L252 66L249 72L243 70L238 72L242 80L238 79L239 84L249 87L247 92L252 97L249 101L246 100L240 105L236 103L235 98L226 103L228 97L220 100L214 92L207 96L199 92L192 83L187 80L184 81L185 77L180 72L177 73L174 68L168 66L167 61L164 59Z";

// dot grid inside India — encoded as "row:col-col,col;..." (11px grid, 6px offset)
const DOT_ROWS =
  "1:11-15;2:10-16;3:11-18,20-22;4:13-23;5:12-22;6:12-21;7:12-21;8:13-22;9:15-20;10:14-20;11:14-21;12:13-23;13:13-24;14:11-23;15:11-23,50-52;16:9-24,48-52;17:6,9-26,38-39,47-54;18:5-28,38-39,45-53;19:4-32,38-39,42,45-51;20:6-50;21:6-38,41-50;22:7-39,42-49;23:7-37,46-49;24:3-38,45-49;25:3-38,44,46-47;26:3-39,46;27:5-39,46-47;28:4-8,10-39;29:5-8,10-35,39;30:6-7,11-35;31:10-35;32:10-33;33:10-31;34:11-31;35:11-29;36:11-28;37:11-27;38:12-26;39:12-24;40:13-23;41:13-23;42:14-23;43:14-23;44:14-23,46-47;45:14-23,46;46:15-22,46-47;47:16-22,45-46;48:16-22,46;49:16-22;50:17-21;51:17-21,46;52:18-19,48;53:47-48;54:48;55:48";
const DOTS = DOT_ROWS.split(";").flatMap((row) => {
  const [gy, cols] = row.split(":");
  return cols.split(",").flatMap((r) => {
    const [a, b = a] = r.split("-").map(Number);
    return Array.from({ length: b - a + 1 }, (_, k) => [
      6 + (a + k) * 11,
      6 + Number(gy) * 11,
    ]);
  });
});
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
        <svg className="tk2-map" viewBox={`0 0 ${MAP} ${MAP}`} aria-hidden>
          <defs>
            <radialGradient id="tk2Glow" cx="0.45" cy="0.55" r="0.6">
              <stop offset="0" stopColor="#1d6fd8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#1d6fd8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={MAP} height={MAP} fill="url(#tk2Glow)" />
          {/* India shape: soft fill + state lines + glowing outline */}
          <path
            d={INDIA_OUTLINE}
            fill="rgba(56, 189, 248, 0.07)"
            stroke="none"
          />
          <path
            d={INDIA_STATES}
            fill="none"
            stroke="rgba(186, 230, 253, 0.16)"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <path
            d={INDIA_OUTLINE}
            fill="none"
            stroke="rgba(125, 211, 252, 0.75)"
            strokeWidth="1.3"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.6))" }}
          />
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
                Get Started with NGriffinPay <Icon name="arrow" size={16} />
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
    q: "What does Tracking in NGriffinPay  cover?",
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
    a: "Yes. NGriffinPay  syncs with most popular biometric and face-recognition devices, so punches flow in automatically. Employees can also check in from the mobile app or web where devices aren’t available.",
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
