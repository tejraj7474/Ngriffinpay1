// AttendanceLeave.jsx
// NGriffinpay — Product inner page: "Attendance & Leave Management"
// Section 1: Hero banner (live attendance console on the left, content on the right)
// Section 2: Attendance dial (clock-face tabs + live centre demo)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AttendanceLeave.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    verb: "Automate",
    rest: "attendance capture with real-time tracking across devices.",
    icon: "fingerprint",
  },
  {
    verb: "Customize",
    rest: "leave policies for different teams, roles, or locations.",
    icon: "sliders",
  },
  {
    verb: "Monitor",
    rest: "team availability and reduce absenteeism with built-in insights.",
    icon: "chart",
  },
  {
    verb: "Enable",
    rest: "employees to apply, track, and manage leave via self-service.",
    icon: "user",
  },
  {
    verb: "Sync",
    rest: "attendance and leave data with payroll for accurate payouts.",
    icon: "sync",
  },
  {
    verb: "Comply",
    rest: "with labor laws using automated statutory leave tracking and reports.",
    icon: "shield",
  },
];

const STAGE_TIME = 5;

const DAYS = [
  "Mon 3",
  "Tue 4",
  "Wed 5",
  "Thu 6",
  "Fri 7",
  "Mon 10",
  "Tue 11",
  "Wed 12",
  "Thu 13",
  "Fri 14",
];
const TODAY = 6;

// p = present, w = WFH, l = leave, a = absent, f = future
const PEOPLE = [
  {
    name: "Priya S.",
    av: "PS",
    row: ["p", "p", "p", "w", "p", "p", "p", "f", "f", "f"],
    time: "09:12",
  },
  {
    name: "Karthik V.",
    av: "KV",
    row: ["p", "l", "l", "p", "p", "p", "p", "f", "f", "f"],
    time: "09:18",
  },
  {
    name: "Rahul M.",
    av: "RM",
    row: ["p", "p", "p", "p", "p", "a", "p", "f", "f", "f"],
    time: "09:21",
  },
  {
    name: "Anita R.",
    av: "AR",
    row: ["p", "p", "a", "p", "p", "p", "p", "f", "f", "f"],
    time: "09:26",
  },
  {
    name: "Deepa N.",
    av: "DN",
    row: ["w", "w", "p", "p", "p", "w", "w", "f", "f", "f"],
    time: "09:30",
  },
  {
    name: "Arjun K.",
    av: "AK",
    row: ["a", "p", "p", "p", "l", "a", "a", "f", "f", "f"],
    time: "",
  },
];
const RAHUL = 2;
const ARJUN = 5;

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
    case "fingerprint":
      return (
        <svg {...p}>
          <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
          <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
          <path d="M2 12a10 10 0 0 1 18-6" />
          <path d="M21.8 16c.2-2 .131-5.354 0-6" />
          <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
          <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...p}>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        </svg>
      );
    case "sync":
      return (
        <svg {...p}>
          <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8" />
          <path d="M21 3v5h-5M3 21v-5h5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
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
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
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
    case "face":
      return (
        <svg {...p}>
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
          <path d="M9 9h.01M15 9h.01M8 14s1.5 2 4 2 4-2 4-2" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 13h.01M2 10h20" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "download":
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Feature panels (right column of the console)                        */
/* Each one also drives effects on the attendance grid.                */
/* ------------------------------------------------------------------ */

function usePanel(build, delay, gridRef) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const g = gsap.utils.selector(gridRef);
      const tl = gsap.timeline({ delay });
      tl.from(q(".js-in"), {
        y: 14,
        opacity: 0,
        stagger: 0.07,
        duration: 0.4,
        ease: "power3.out",
      });
      build(tl, q, g);
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert(); // also reverts every grid effect made by this panel
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

const cellsAt = (g, r, c) => g(`.alm-cell[data-r="${r}"][data-c="${c}"]`);

// 1 — Automate: live punches fill today's column
const PUNCHES = [
  { who: 0, device: "Biometric", icon: "fingerprint" },
  { who: 1, device: "Mobile GPS", icon: "pin" },
  { who: 2, device: "Face ID", icon: "face" },
  { who: 3, device: "Web", icon: "monitor" },
  { who: 4, device: "Mobile · WFH", icon: "phone" },
];

function AutomatePanel({ delay, gridRef }) {
  const ref = usePanel(
    (tl, q, g) => {
      // Empty today's column first, then fill it punch by punch
      const today = g(`.alm-cell[data-c="${TODAY}"]`);
      const orig = today.map((c) => {
        const cs = getComputedStyle(c);
        return { backgroundColor: cs.backgroundColor, color: cs.color };
      });
      gsap.set(today, {
        backgroundColor: "#eef3fa",
        color: "rgba(0,0,0,0)",
        scale: 0.85,
      });
      gsap.set(g(".alm-punch-time"), { opacity: 0 });
      const captured = q(".js-cap")[0];
      PUNCHES.forEach((pch, i) => {
        const at = 0.5 + i * 0.5;
        const cell = cellsAt(g, pch.who, TODAY)[0];
        tl.fromTo(
          q(".alm-punch")[i],
          { x: 20, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" },
          at,
        );
        tl.to(
          cell,
          { ...orig[pch.who], scale: 1, duration: 0.35, ease: "back.out(2.5)" },
          at + 0.1,
        );
        tl.to(
          cell.querySelector(".alm-punch-time"),
          { opacity: 1, duration: 0.2 },
          at + 0.2,
        );
        tl.call(
          () => captured && (captured.textContent = i + 1),
          null,
          at + 0.15,
        );
      });
      const missing = cellsAt(g, ARJUN, TODAY)[0];
      tl.to(missing, { ...orig[ARJUN], scale: 1, duration: 0.35 }, 3.1);
      tl.fromTo(
        q(".alm-miss"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.35 },
        3.2,
      );
    },
    delay,
    gridRef,
  );

  return (
    <div className="alm-panel" ref={ref}>
      <div className="alm-panel-head js-in">
        <span>
          <Icon name="fingerprint" size={12} /> Live punches
        </span>
        <em className="alm-live">
          <i /> Live
        </em>
      </div>
      <ul className="alm-punches">
        {PUNCHES.map((pch) => (
          <li className="alm-punch" key={pch.who}>
            <span className="alm-av sm">{PEOPLE[pch.who].av}</span>
            <div>
              <b>{PEOPLE[pch.who].name}</b>
              <small>
                <Icon name={pch.icon} size={10} /> {pch.device}
              </small>
            </div>
            <time>{PEOPLE[pch.who].time}</time>
          </li>
        ))}
      </ul>
      <div className="alm-stats js-in">
        <span>
          <b className="js-cap">0</b>Captured
        </span>
        <span>
          <b>0</b>Late
        </span>
        <span className="warn">
          <b>1</b>Missing
        </span>
      </div>
      <div className="alm-miss">
        <Icon name="alert" size={11} /> Arjun K. hasn’t punched in — reminder
        sent
      </div>
    </div>
  );
}

// 2 — Customize: policy per location
const POLICIES = {
  Bengaluru: [
    ["Casual leave", "12 / year"],
    ["Sick leave", "6 / year"],
    ["Earned leave", "1.25 / month"],
    ["Weekly off", "Sat – Sun"],
    ["Grace period", "15 min"],
  ],
  Chennai: [
    ["Casual leave", "12 / year"],
    ["Sick leave", "7 / year"],
    ["Earned leave", "1.5 / month"],
    ["Weekly off", "Sun"],
    ["Grace period", "10 min"],
  ],
  Remote: [
    ["Casual leave", "10 / year"],
    ["Sick leave", "6 / year"],
    ["Earned leave", "1.25 / month"],
    ["Weekly off", "Sat – Sun"],
    ["Grace period", "30 min"],
  ],
};
const LOCS = Object.keys(POLICIES);

function CustomizePanel({ delay, gridRef }) {
  const [loc, setLoc] = useState(0);
  const ref = usePanel(
    (tl, q, g) => {
      tl.fromTo(
        g(".alm-cell"),
        { opacity: 1 },
        { opacity: 0.45, duration: 0.4 },
        0.2,
      );
    },
    delay,
    gridRef,
  );
  const first = useRef(true);

  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => setLoc((l) => (l + 1) % LOCS.length), 1500);
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const q = gsap.utils.selector(ref);
    const tw = gsap.fromTo(
      q(".alm-rule b"),
      { y: -8, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: "power2.out" },
    );
    return () => tw.kill();
  }, [loc]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="alm-panel" ref={ref}>
      <div className="alm-panel-head js-in">
        <span>
          <Icon name="sliders" size={12} /> Leave policy
        </span>
      </div>
      <div className="alm-locs js-in">
        {LOCS.map((l, i) => (
          <button
            type="button"
            key={l}
            className={loc === i ? "is-on" : ""}
            onClick={() => setLoc(i)}
          >
            {l}
          </button>
        ))}
      </div>
      <ul className="alm-rules">
        {POLICIES[LOCS[loc]].map(([k, v]) => (
          <li className="alm-rule js-in" key={k}>
            <span>{k}</span>
            <b>{v}</b>
          </li>
        ))}
      </ul>
      <div className="alm-note js-in">
        <Icon name="check" size={11} /> Applied to 3 teams · 2 roles
      </div>
    </div>
  );
}

// 3 — Monitor: availability + absenteeism insight
const AV_R = 24;
const AV_C = 2 * Math.PI * AV_R;

function MonitorPanel({ delay, gridRef }) {
  const ref = usePanel(
    (tl, q, g) => {
      const pct = q(".js-avail")[0];
      const o = { v: 0 };
      tl.fromTo(
        q(".alm-av-arc"),
        { strokeDashoffset: AV_C },
        {
          strokeDashoffset: AV_C * (1 - 0.83),
          duration: 1.1,
          ease: "power2.out",
        },
        0.3,
      );
      tl.to(
        o,
        {
          v: 83,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => pct && (pct.textContent = Math.round(o.v)),
        },
        0.3,
      );
      const mondays = [
        ...g('.alm-cell[data-c="0"]'),
        ...g('.alm-cell[data-c="5"]'),
      ];
      tl.to(
        g('.alm-dayhead[data-c="0"], .alm-dayhead[data-c="5"]'),
        { color: "#b45309", duration: 0.3 },
        1.2,
      );
      tl.to(
        mondays,
        { boxShadow: "inset 0 0 0 2px #f59e0b", duration: 0.35, stagger: 0.03 },
        1.2,
      );
      tl.fromTo(
        q(".alm-insight"),
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        1.5,
      );
      tl.to(
        g(`.alm-row[data-r="${ARJUN}"]`),
        { backgroundColor: "rgba(244,63,94,0.08)", duration: 0.35 },
        2.4,
      );
      tl.fromTo(
        q(".alm-flag"),
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        2.5,
      );
    },
    delay,
    gridRef,
  );

  return (
    <div className="alm-panel" ref={ref}>
      <div className="alm-panel-head js-in">
        <span>
          <Icon name="chart" size={12} /> Team insights
        </span>
      </div>
      <div className="alm-avail js-in">
        <svg viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={AV_R} className="alm-av-bg" />
          <circle
            cx="30"
            cy="30"
            r={AV_R}
            className="alm-av-arc"
            strokeDasharray={AV_C}
          />
        </svg>
        <div>
          <strong>
            <span className="js-avail">0</span>%
          </strong>
          <small>Available today · 5 of 6</small>
        </div>
      </div>
      <div className="alm-insight">
        <span className="alm-insight-ic">
          <Icon name="chart" size={12} />
        </span>
        <div>
          <b>Mondays see 8% more absences</b>
          <small>Consider flexible Monday shifts</small>
        </div>
      </div>
      <div className="alm-flag">
        <span className="alm-insight-ic red">
          <Icon name="alert" size={12} />
        </span>
        <div>
          <b>Arjun K. · 3 unplanned absences</b>
          <small>Auto-flagged to his manager</small>
        </div>
      </div>
    </div>
  );
}

// 4 — Enable: self-service leave request lands on the grid
function EnablePanel({ delay, gridRef }) {
  const ref = usePanel(
    (tl, q, g) => {
      const cells = [...cellsAt(g, RAHUL, 8), ...cellsAt(g, RAHUL, 9)];
      const bal = q(".js-bal")[0];
      const o = { v: 8 };
      tl.fromTo(
        q(".alm-req"),
        { y: 20, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
        0.4,
      );
      tl.to(
        cells,
        {
          backgroundColor: "#fde68a",
          color: "#92400e",
          duration: 0.3,
          stagger: 0.15,
        },
        1.1,
      );
      tl.fromTo(
        cells,
        { scale: 0.6 },
        { scale: 1, duration: 0.4, stagger: 0.15, ease: "back.out(3)" },
        1.1,
      );
      tl.fromTo(
        q(".alm-stamp"),
        { scale: 2, autoAlpha: 0, rotation: -20 },
        {
          scale: 1,
          autoAlpha: 1,
          rotation: -10,
          duration: 0.4,
          ease: "back.out(2)",
        },
        2,
      );
      tl.to(cells, { backgroundColor: "#fcd34d", duration: 0.3 }, 2.1);
      tl.to(
        o,
        {
          v: 6,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => bal && (bal.textContent = Math.round(o.v)),
        },
        2.3,
      );
      tl.fromTo(
        q(".alm-bal"),
        { backgroundColor: "#eaf2fc" },
        { backgroundColor: "#ecfdf5", duration: 0.3 },
        2.3,
      );
    },
    delay,
    gridRef,
  );

  return (
    <div className="alm-panel" ref={ref}>
      <div className="alm-panel-head js-in">
        <span>
          <Icon name="user" size={12} /> Self-service leave
        </span>
      </div>
      <div className="alm-req">
        <div className="alm-req-top">
          <span className="alm-av sm">RM</span>
          <div>
            <b>Rahul M.</b>
            <small>Applied from mobile app</small>
          </div>
        </div>
        <div className="alm-req-body">
          <span>
            <Icon name="calendar" size={11} /> Thu 13 – Fri 14
          </span>
          <span>Casual · 2 days</span>
        </div>
        <span className="alm-stamp">Approved</span>
      </div>
      <div className="alm-bal js-in">
        <span>Casual leave balance</span>
        <b>
          <span className="js-bal">8</span> days
        </b>
      </div>
      <div className="alm-note js-in">
        <Icon name="check" size={11} /> Team calendar updated instantly
      </div>
    </div>
  );
}

// 5 — Sync: attendance → payroll
const SYNC_ROWS = [
  ["Working days", "21"],
  ["Days present", "19.5"],
  ["Paid leave", "1"],
  ["Loss of pay (LOP)", "0.5"],
];

function SyncPanel({ delay, gridRef }) {
  const ref = usePanel(
    (tl, q, g) => {
      tl.fromTo(
        g(".alm-beam"),
        { left: "0%", autoAlpha: 1 },
        { left: "100%", duration: 1.4, ease: "power1.inOut" },
        0.3,
      );
      tl.to(g(".alm-beam"), { autoAlpha: 0, duration: 0.2 });
      tl.fromTo(
        q(".alm-sync-row"),
        { x: 14, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, stagger: 0.18, duration: 0.35 },
        0.6,
      );
      tl.fromTo(
        q(".alm-sync-bar i"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power1.inOut" },
        1.4,
      );
      tl.fromTo(
        q(".alm-sync-ic"),
        { rotation: 0 },
        { rotation: 360, duration: 1.2, ease: "power1.inOut" },
        1.4,
      );
      tl.fromTo(
        q(".alm-synced"),
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
        2.7,
      );
    },
    delay,
    gridRef,
  );

  return (
    <div className="alm-panel" ref={ref}>
      <div className="alm-panel-head js-in">
        <span>
          <Icon name="wallet" size={12} /> Payroll sync · Rahul M.
        </span>
      </div>
      <ul className="alm-sync">
        {SYNC_ROWS.map(([k, v]) => (
          <li className="alm-sync-row" key={k}>
            <span>{k}</span>
            <b>{v}</b>
          </li>
        ))}
      </ul>
      <div className="alm-sync-prog js-in">
        <span className="alm-sync-ic">
          <Icon name="sync" size={12} />
        </span>
        <span className="alm-sync-bar">
          <i />
        </span>
        <small>November payroll</small>
      </div>
      <div className="alm-synced">
        <Icon name="check" size={11} /> Synced · payout calculated automatically
      </div>
    </div>
  );
}

// 6 — Comply: statutory tracking
const COMPLY = [
  "Statutory leave register generated",
  "Earned leave accrual tracked",
  "Overtime within legal limits",
  "State-wise holiday calendar applied",
];

function ComplyPanel({ delay, gridRef }) {
  const ref = usePanel(
    (tl, q) => {
      q(".alm-ck").forEach((li, i) => {
        const at = 0.4 + i * 0.45;
        tl.to(li, { opacity: 1, duration: 0.2 }, at);
        tl.to(
          li.querySelector(".alm-spin"),
          { autoAlpha: 0, duration: 0.1 },
          at + 0.3,
        );
        tl.fromTo(
          li.querySelector(".alm-ok"),
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
          at + 0.3,
        );
      });
      tl.fromTo(
        q(".alm-audit"),
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" },
        2.4,
      );
    },
    delay,
    gridRef,
  );

  return (
    <div className="alm-panel" ref={ref}>
      <div className="alm-panel-head js-in">
        <span>
          <Icon name="shield" size={12} /> Compliance
        </span>
      </div>
      <ul className="alm-cks">
        {COMPLY.map((c) => (
          <li className="alm-ck" key={c}>
            <span className="alm-ck-ic">
              <span className="alm-spin" />
              <span className="alm-ok">
                <Icon name="check" size={9} />
              </span>
            </span>
            {c}
          </li>
        ))}
      </ul>
      <div className="alm-audit">
        <Icon name="file" size={14} />
        <div>
          <b>Audit-ready reports</b>
          <small>Monthly register · PDF &amp; Excel</small>
        </div>
        <span>
          <Icon name="download" size={12} />
        </span>
      </div>
    </div>
  );
}

const PANELS = [
  AutomatePanel,
  CustomizePanel,
  MonitorPanel,
  EnablePanel,
  SyncPanel,
  ComplyPanel,
];

/* ------------------------------------------------------------------ */
/* Attendance console (left side)                                      */
/* ------------------------------------------------------------------ */

const CELL_LABEL = { p: "P", w: "WFH", l: "L", a: "A", f: "" };

function Console({ frameRef, stage }) {
  const gridRef = useRef(null);
  const clockRef = useRef(null);
  const panelWrap = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.4 : 0.2;

  // Live ticking clock
  useEffect(() => {
    const tick = () => {
      if (!clockRef.current) return;
      clockRef.current.textContent = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (isFirst || !panelWrap.current) return;
    gsap.fromTo(
      panelWrap.current.firstElementChild,
      { autoAlpha: 0, x: 16 },
      { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" },
    );
  }, [stage]);

  const Panel = PANELS[stage];

  return (
    <div className="alm-frame" ref={frameRef}>
      <div className="alm-chrome">
        <span className="alm-dot r" />
        <span className="alm-dot y" />
        <span className="alm-dot g" />
        <div className="alm-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/attendance
        </div>
      </div>

      <div className="alm-app">
        <div className="alm-top js-top">
          <div>
            <strong>Team attendance · November</strong>
            <small>Design team · Whitefield</small>
          </div>
          <div className="alm-top-right">
            <span className="alm-clock">
              <Icon name="clock" size={11} /> <span ref={clockRef}>--:--</span>
            </span>
            <span className="alm-present">
              <b>231</b>/248 present
            </span>
          </div>
        </div>

        <div className="alm-body">
          <div className="alm-grid-wrap js-grid" ref={gridRef}>
            <span className="alm-beam" aria-hidden />
            <div className="alm-grid">
              <div className="alm-row head">
                <span className="alm-name" />
                {DAYS.map((d, c) => (
                  <span
                    key={d}
                    className={`alm-dayhead ${c === TODAY ? "is-today" : ""}`}
                    data-c={c}
                  >
                    {d.split(" ")[0]}
                    <b>{d.split(" ")[1]}</b>
                  </span>
                ))}
              </div>
              {PEOPLE.map((p, r) => (
                <div className="alm-row" key={p.name} data-r={r}>
                  <span className="alm-name">
                    <span className="alm-av xs">{p.av}</span>
                    {p.name}
                  </span>
                  {p.row.map((s, c) => (
                    <span
                      key={c}
                      className={`alm-cell ${s} ${c === TODAY ? "today" : ""}`}
                      data-r={r}
                      data-c={c}
                    >
                      {CELL_LABEL[s]}
                      {c === TODAY && p.time && (
                        <small className="alm-punch-time">{p.time}</small>
                      )}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="alm-legend">
              <span>
                <i className="p" />
                Present
              </span>
              <span>
                <i className="w" />
                WFH
              </span>
              <span>
                <i className="l" />
                Leave
              </span>
              <span>
                <i className="a" />
                Absent
              </span>
            </div>
          </div>

          <div className="alm-side js-side" ref={panelWrap}>
            <Panel key={stage} delay={startDelay} gridRef={gridRef} />
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
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleY: 0 }));
    if (prefersReduced()) return;
    const extra = firstStage.current ? 1.3 : 0;
    firstStage.current = false;
    const bar = barRefs.current[stage];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleY: 0 },
          { scaleY: 1, duration: STAGE_TIME + extra, ease: "none" },
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
        { y: 28, opacity: 0, duration: 0.8, stagger: 0.06 },
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
      tl.from(q(".js-top"), { y: -10, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(
        q(".alm-row"),
        { x: -16, opacity: 0, stagger: 0.05, duration: 0.4 },
        0.7,
      );
      tl.from(
        q(".alm-cell:not(.today)"),
        {
          scale: 0,
          duration: 0.3,
          stagger: { each: 0.006, from: "start" },
          ease: "back.out(2)",
        },
        0.8,
      );
      tl.from(q(".js-side"), { x: 20, opacity: 0, duration: 0.5 }, 1);
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
        1.5,
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
          delay: 2.2,
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
      className="alm-hero"
      ref={sectionRef}
      aria-labelledby="alm-hero-title"
    >
      <div className="alm-hero-bg" aria-hidden>
        <span className="alm-blob b1 js-blob" />
        <span className="alm-blob b2 js-blob" />
        <span className="alm-grid-bg" />
      </div>

      <div className="alm-container alm-hero-grid">
        {/* RIGHT: content (first in DOM for SEO, shown on the right on desktop) */}
        <div className="alm-content">
          <span className="alm-eyebrow js-reveal">
            <span className="alm-live-dot" /> Smarter Attendance &amp; Leave
            Management
          </span>
          <h1 id="alm-hero-title" className="alm-title js-reveal">
            Attendance &amp; <span className="alm-grad">Leave Management</span>
          </h1>

          <ul
            className="alm-feats"
            role="tablist"
            aria-label="Attendance features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.verb} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`alm-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="alm-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                  <span className="alm-feat-ic">
                    <Icon name={f.icon} size={14} />
                  </span>
                  <span className="alm-feat-txt">
                    <b>{f.verb}</b> {f.rest}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: live attendance console */}
        <div className="alm-visual" ref={visualRef}>
          <Console frameRef={frameRef} stage={stage} />

          <div className="alm-float f1 js-float">
            <span className="alm-float-ic ok">
              <Icon name="fingerprint" size={14} />
            </span>
            <div>
              <strong>Biometric · Face · GPS</strong>
              <small>Every punch captured live</small>
            </div>
          </div>
          <div className="alm-float f2 js-float">
            <span className="alm-float-ic pr">
              <Icon name="wallet" size={14} />
            </span>
            <div>
              <strong>LOP auto-calculated</strong>
              <small>Straight into payroll</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Attendance dial (clock-face tabs + live centre)         */
/* ------------------------------------------------------------------ */

const DIAL_HEADING = [
  ["Simplify", true],
  ["attendance", false],
  ["tracking,", false],
  ["streamline", true],
  ["leave", false],
  ["approvals,", false],
  ["and", false],
  ["boost", true],
  ["workforce", false],
  ["productivity", false],
];

const DIAL_TABS = [
  {
    label: "Real-Time Attendance Tracking",
    icon: "clock",
    title: [
      ["Real-time", true],
      ["attendance", false],
      ["tracking", true],
    ],
    desc: "Monitor employee attendance live, with accurate records updated instantly in the system.",
  },
  {
    label: "Mobile & Biometric Clock-in",
    icon: "fingerprint",
    title: [
      ["Clock in/out", true],
      ["from", false],
      ["anywhere", true],
    ],
    desc: "Employees can use mobile apps or biometric devices for secure and flexible clock-ins and outs.",
  },
  {
    label: "Automated Leave Requests",
    icon: "calendar",
    title: [
      ["Automated", true],
      ["leave requests", false],
      ["and approvals", true],
    ],
    desc: "Allow employees to apply for leave and managers to approve requests in just a few clicks.",
  },
  {
    label: "Multiple Leave Types",
    icon: "sliders",
    title: [
      ["Customizable", true],
      ["leave", false],
      ["types", true],
    ],
    desc: "Configure annual, sick, casual, or compensatory leaves with tailored approval workflows.",
  },
  {
    label: "Real-Time Reports & Analytics",
    icon: "chart",
    title: [
      ["Real-time", true],
      ["reports", false],
      ["and analytics", true],
    ],
    desc: "Get instant access to attendance trends, leave summaries, and workforce productivity insights.",
  },
];

const DIAL_TIME = 5.5;
const DC = 260; // dial centre (viewBox 520 × 520)
const TRACK_R = 205;
const TEXT_R = 234;
const SEG = 360 / DIAL_TABS.length;
const GAP = 4;

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [DC + r * Math.cos(a), DC + r * Math.sin(a)];
};
// SVG arc between two angles (degrees, 0 = 3 o'clock, clockwise)
const arcPath = (r, a0, a1, reverse = false) => {
  const [x0, y0] = polar(r, reverse ? a1 : a0);
  const [x1, y1] = polar(r, reverse ? a0 : a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} ${reverse ? 0 : 1} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const segStart = (i) => -90 + i * SEG + GAP / 2;
const segEnd = (i) => -90 + (i + 1) * SEG - GAP / 2;

/* ---------- Centre visuals ---------- */
function useCentre(build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay: 0.25 });
      tl.from(q(".js-c"), {
        y: 12,
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

function CentreTracking() {
  const ref = useCentre((tl, q) => {
    const n = q(".js-n")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 231,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => n && (n.textContent = Math.round(o.v)),
      },
      0.2,
    );
    const line = q(".ald-spark-line")[0];
    const len = line.getTotalLength();
    tl.fromTo(
      line,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" },
      0.4,
    );
    tl.from(
      q(".ald-avs i"),
      { scale: 0, stagger: 0.12, duration: 0.35, ease: "back.out(3)" },
      1.2,
    );
    tl.fromTo(
      q(".ald-in-toast"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 },
      2.2,
    );
  });
  return (
    <div className="ald-v" ref={ref}>
      <span className="ald-live js-c">
        <i /> Live now
      </span>
      <strong className="ald-big js-c">
        <span className="js-n">0</span>
        <em>/248</em>
      </strong>
      <small className="js-c">employees checked in</small>
      <svg viewBox="0 0 160 40" className="ald-spark js-c" aria-hidden>
        <path
          className="ald-spark-line"
          d="M2 34 C 18 32, 24 30, 34 26 S 52 14, 64 16 S 84 8, 96 10 S 120 4, 132 6 S 150 3, 158 2"
        />
      </svg>
      <div className="ald-avs js-c">
        <i>PS</i>
        <i>KV</i>
        <i>RM</i>
        <i>AR</i>
        <b>+227</b>
      </div>
      <span className="ald-in-toast">Deepa N. checked in · 09:30</span>
    </div>
  );
}

function CentreClockIn() {
  const ref = useCentre((tl, q) => {
    const C = 2 * Math.PI * 30;
    tl.fromTo(
      q(".ald-fp-arc"),
      { strokeDashoffset: C },
      { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
      0.3,
    );
    tl.fromTo(
      q(".ald-fp-ic"),
      { color: "#1d6fd8" },
      { color: "#10b981", duration: 0.2 },
      1.3,
    );
    tl.fromTo(
      q(".ald-mode-a .ald-mode-txt"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      1.35,
    );
    tl.to(q(".ald-mode-a"), { autoAlpha: 0, scale: 0.9, duration: 0.3 }, 2.5);
    tl.fromTo(
      q(".ald-mode-b"),
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 0.35 },
      2.65,
    );
    tl.fromTo(
      q(".ald-pin"),
      { y: -30 },
      { y: 0, duration: 0.5, ease: "bounce.out" },
      2.7,
    );
    tl.fromTo(
      q(".ald-ripple"),
      { scale: 0.3, opacity: 0.8 },
      { scale: 1.6, opacity: 0, duration: 1, stagger: 0.3, repeat: 1 },
      3.1,
    );
    tl.fromTo(
      q(".ald-mode-b .ald-mode-txt"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      3.2,
    );
  });
  return (
    <div className="ald-v" ref={ref}>
      <div className="ald-modes">
        <div className="ald-mode ald-mode-a">
          <div className="ald-fp">
            <svg viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" className="ald-fp-bg" />
              <circle
                cx="36"
                cy="36"
                r="30"
                className="ald-fp-arc"
                strokeDasharray={2 * Math.PI * 30}
              />
            </svg>
            <span className="ald-fp-ic">
              <Icon name="fingerprint" size={30} />
            </span>
          </div>
          <div className="ald-mode-txt">
            <b>Clocked in · 09:28 AM</b>
            <small>Biometric · Whitefield gate 2</small>
          </div>
        </div>
        <div className="ald-mode ald-mode-b">
          <div className="ald-geo">
            <span className="ald-ripple" />
            <span className="ald-ripple" />
            <span className="ald-pin">
              <Icon name="pin" size={30} />
            </span>
          </div>
          <div className="ald-mode-txt">
            <b>Clocked out · 06:32 PM</b>
            <small>Mobile GPS · Client site, ITPL</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function CentreLeave() {
  const ref = useCentre((tl, q) => {
    tl.fromTo(
      q(".ald-req"),
      { y: 16, autoAlpha: 0, rotation: -4 },
      { y: 0, autoAlpha: 1, rotation: 0, duration: 0.5, ease: "back.out(1.6)" },
      0.3,
    );
    tl.fromTo(
      q(".ald-approve"),
      { scale: 1 },
      { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1 },
      1.4,
    );
    tl.fromTo(
      q(".ald-req"),
      { backgroundColor: "#ffffff", borderColor: "#e3e8f2" },
      { backgroundColor: "#ecfdf5", borderColor: "#6ee7b7", duration: 0.3 },
      1.7,
    );
    tl.to(
      q(".ald-req-btns"),
      { autoAlpha: 0, height: 0, marginTop: 0, duration: 0.25 },
      1.7,
    );
    tl.fromTo(
      q(".ald-req-ok"),
      { autoAlpha: 0, scale: 0.6 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" },
      1.85,
    );
    tl.fromTo(
      q(".ald-spark-dot"),
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        x: (i) => Math.cos(i * 1.05) * 46,
        y: (i) => Math.sin(i * 1.05) * 30,
        duration: 0.7,
        ease: "power2.out",
      },
      1.85,
    );
    tl.fromTo(
      q(".ald-timer"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      2.3,
    );
  });
  return (
    <div className="ald-v" ref={ref}>
      <div className="ald-req">
        <span className="ald-sparks" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i className="ald-spark-dot" key={i} />
          ))}
        </span>
        <div className="ald-req-top">
          <span className="ald-av">DN</span>
          <div>
            <b>Deepa N.</b>
            <small>Sick leave · Fri, 7 Nov</small>
          </div>
        </div>
        <div className="ald-req-btns">
          <span className="ald-reject">Reject</span>
          <span className="ald-approve">
            <Icon name="check" size={11} /> Approve
          </span>
        </div>
        <div className="ald-req-ok">
          <Icon name="check" size={12} /> Approved · Deepa notified
        </div>
      </div>
      <span className="ald-timer">
        <Icon name="clock" size={11} /> Done in 1 click · 8 sec
      </span>
    </div>
  );
}

const LEAVE_TYPES = [
  { k: "Annual", v: 12, c: "#0a3f83" },
  { k: "Casual", v: 8, c: "#1d6fd8" },
  { k: "Sick", v: 6, c: "#38bdf8" },
  { k: "Comp-off", v: 3, c: "#f59e0b" },
];
const LT_R = 38;
const LT_C = 2 * Math.PI * LT_R;
const LT_TOTAL = LEAVE_TYPES.reduce((s, t) => s + t.v, 0);

function CentreLeaveTypes() {
  const ref = useCentre((tl, q) => {
    q(".ald-lt-seg").forEach((seg, i) => {
      const len = (LEAVE_TYPES[i].v / LT_TOTAL) * LT_C - 2;
      tl.fromTo(
        seg,
        { attr: { "stroke-dasharray": `0 ${LT_C}` } },
        {
          attr: { "stroke-dasharray": `${len} ${LT_C - len}` },
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.3 + i * 0.35,
      );
    });
    const n = q(".js-lt")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: LT_TOTAL,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => n && (n.textContent = Math.round(o.v)),
      },
      0.3,
    );
    tl.from(
      q(".ald-lt-legend span"),
      {
        scale: 0.6,
        opacity: 0,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(2)",
      },
      1.2,
    );
  });
  let off = 0;
  return (
    <div className="ald-v" ref={ref}>
      <div className="ald-lt js-c">
        <svg viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={LT_R} className="ald-lt-bg" />
          {LEAVE_TYPES.map((t) => {
            const len = (t.v / LT_TOTAL) * LT_C;
            const el = (
              <circle
                key={t.k}
                cx="48"
                cy="48"
                r={LT_R}
                className="ald-lt-seg"
                stroke={t.c}
                strokeDasharray={`0 ${LT_C}`}
                strokeDashoffset={-off}
              />
            );
            off += len;
            return el;
          })}
        </svg>
        <div className="ald-lt-txt">
          <strong className="js-lt">0</strong>
          <small>days / year</small>
        </div>
      </div>
      <div className="ald-lt-legend">
        {LEAVE_TYPES.map((t) => (
          <span key={t.k}>
            <i style={{ background: t.c }} />
            {t.k} <b>{t.v}</b>
          </span>
        ))}
      </div>
      <span className="ald-flow js-c">Approval: Manager → HR</span>
    </div>
  );
}

const REPORT_BARS = [
  ["Jun", 88],
  ["Jul", 91],
  ["Aug", 90],
  ["Sep", 93],
  ["Oct", 95],
  ["Nov", 96],
];

function CentreReports() {
  const ref = useCentre((tl, q) => {
    tl.fromTo(
      q(".ald-rbar i"),
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.6)" },
      0.3,
    );
    const n = q(".js-trend")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 4.2,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => n && (n.textContent = o.v.toFixed(1)),
      },
      0.9,
    );
    tl.fromTo(
      q(".ald-util i"),
      { scaleX: 0 },
      { scaleX: 0.68, duration: 0.9, ease: "power2.out" },
      1.2,
    );
    tl.fromTo(
      q(".ald-export"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      2,
    );
  });
  return (
    <div className="ald-v" ref={ref}>
      <span className="ald-trend js-c">
        <Icon name="chart" size={11} /> Attendance ↑{" "}
        <span className="js-trend">0</span>%
      </span>
      <div className="ald-rbars js-c">
        {REPORT_BARS.map(([m, h], i) => (
          <span
            className={`ald-rbar ${i === REPORT_BARS.length - 1 ? "now" : ""}`}
            key={m}
          >
            <i style={{ height: `${(h - 80) * 5}%` }} />
            <small>{m}</small>
          </span>
        ))}
      </div>
      <div className="ald-util js-c">
        <small>Leave utilisation</small>
        <span>
          <i />
        </span>
        <b>68%</b>
      </div>
      <span className="ald-export">
        <Icon name="download" size={11} /> Export · PDF / Excel
      </span>
    </div>
  );
}

const DIAL_CENTRES = [
  CentreTracking,
  CentreClockIn,
  CentreLeave,
  CentreLeaveTypes,
  CentreReports,
];

/* ---------- The dial ---------- */
function Dial({ active, onSelect, progressRef }) {
  const svgRef = useRef(null);
  const knobRef = useRef(null);
  const secRef = useRef(null);
  const centreRef = useRef(null);
  const first = useRef(true);

  // Knob travels around the ring to the active segment
  useLayoutEffect(() => {
    const deg = active * SEG + GAP / 2;
    const vars = { rotation: `${deg}_short`, svgOrigin: `${DC} ${DC}` };
    if (first.current || prefersReduced()) gsap.set(knobRef.current, vars);
    else
      gsap.to(knobRef.current, {
        ...vars,
        duration: 0.9,
        ease: "power3.inOut",
      });
    if (!first.current && centreRef.current && !prefersReduced()) {
      gsap.fromTo(
        centreRef.current,
        { scale: 0.85, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)" },
      );
    }
    first.current = false;
  }, [active]);

  // Real seconds dot orbiting the tick ring
  useEffect(() => {
    if (prefersReduced()) return;
    const tick = () => {
      const s = new Date().getSeconds();
      gsap.to(secRef.current, {
        rotation: s * 6,
        svgOrigin: `${DC} ${DC}`,
        duration: 0.35,
        ease: "back.out(3)",
        overwrite: true,
      });
    };
    gsap.set(secRef.current, {
      rotation: new Date().getSeconds() * 6,
      svgOrigin: `${DC} ${DC}`,
    });
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const onKey = (i) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(i);
    }
  };

  const Centre = DIAL_CENTRES[active];

  return (
    <div className="ald-dial">
      <svg viewBox="0 0 520 520" ref={svgRef} className="ald-svg">
        <defs>
          <linearGradient id="aldSeg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1d6fd8" />
          </linearGradient>
          <radialGradient id="aldGlow">
            <stop offset="60%" stopColor="#1d6fd8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1d6fd8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={DC} cy={DC} r="250" fill="url(#aldGlow)" />

        {/* minute ticks */}
        {Array.from({ length: 60 }, (_, i) => {
          const long = i % 5 === 0;
          const [x0, y0] = polar(long ? 176 : 181, i * 6 - 90);
          const [x1, y1] = polar(188, i * 6 - 90);
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              className={`ald-tick ${long ? "long" : ""}`}
            />
          );
        })}

        {/* segments = tabs */}
        {DIAL_TABS.map((t, i) => {
          const a0 = segStart(i);
          const a1 = segEnd(i);
          const mid = (a0 + a1) / 2;
          const flip = Math.sin((mid * Math.PI) / 180) > 0.05; // bottom half → keep text upright
          return (
            <g
              key={t.label}
              className={`ald-seg ${active === i ? "is-active" : ""}`}
              onClick={() => onSelect(i)}
              onKeyDown={onKey(i)}
              role="tab"
              tabIndex={0}
              aria-selected={active === i}
              aria-label={t.label}
            >
              <path d={arcPath(TRACK_R, a0, a1)} className="ald-seg-track" />
              <path
                d={arcPath(TRACK_R, a0, a1)}
                className="ald-seg-prog"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                ref={(el) => (progressRef.current[i] = el)}
              />
              <path
                id={`aldText${i}`}
                d={arcPath(TEXT_R, a0, a1, flip)}
                fill="none"
                stroke="none"
              />
              <text className="ald-seg-text" dy={flip ? 11 : 0}>
                <textPath
                  href={`#aldText${i}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {t.label}
                </textPath>
              </text>
              <path d={arcPath(TRACK_R, a0, a1)} className="ald-seg-hit" />
            </g>
          );
        })}

        {/* face */}
        <circle cx={DC} cy={DC} r="168" className="ald-face" />

        {/* seconds dot */}
        <g ref={secRef}>
          <circle cx={DC} cy={DC - 182} r="3" className="ald-sec" />
        </g>

        {/* knob on the ring */}
        <g ref={knobRef}>
          <circle cx={DC} cy={DC - TRACK_R} r="13" className="ald-knob-glow" />
          <circle cx={DC} cy={DC - TRACK_R} r="8" className="ald-knob" />
        </g>
      </svg>

      <div className="ald-centre" ref={centreRef}>
        <span className="ald-centre-ic">
          <Icon name={DIAL_TABS[active].icon} size={14} />
        </span>
        <Centre key={active} />
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
function DialSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const progressRef = useRef([]);
  const chipBars = useRef([]);
  const autoRef = useRef(null);
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);
  const firstCopy = useRef(true);

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".ald-hw > span"), {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.045,
        ease: "power4.out",
        scrollTrigger: { trigger: q(".ald-title")[0], start: "top 85%" },
      });
      gsap.from(q(".ald-dial"), {
        rotation: -40,
        scale: 0.8,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".ald-grid")[0], start: "top 80%" },
      });
      gsap.from(q(".ald-tick"), {
        opacity: 0,
        stagger: 0.012,
        duration: 0.3,
        scrollTrigger: { trigger: q(".ald-grid")[0], start: "top 80%" },
      });
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

  // Auto-advance: the active segment's arc fills like a timer
  useEffect(() => {
    autoRef.current?.kill();
    progressRef.current.forEach(
      (p, i) => p && gsap.set(p, { strokeDashoffset: i < active ? 0 : 1 }),
    );
    chipBars.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (prefersReduced()) {
      const p = progressRef.current[active];
      if (p) gsap.set(p, { strokeDashoffset: 0 });
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => select((activeRef.current + 1) % DIAL_TABS.length),
    });
    const p = progressRef.current[active];
    if (p)
      tl.fromTo(
        p,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: DIAL_TIME, ease: "none" },
        0,
      );
    const b = chipBars.current[active];
    if (b)
      tl.fromTo(
        b,
        { scaleX: 0 },
        { scaleX: 1, duration: DIAL_TIME, ease: "none" },
        0,
      );
    if (!p && !b) tl.to({}, { duration: DIAL_TIME });
    autoRef.current = tl;
    syncPlay();
    return () => tl.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (firstCopy.current) {
      firstCopy.current = false;
      return;
    }
    if (prefersReduced() || !copyRef.current) return;
    const q = gsap.utils.selector(copyRef);
    gsap.from(q(".ald-tw > span"), {
      yPercent: 110,
      duration: 0.6,
      stagger: 0.06,
      ease: "power4.out",
    });
    gsap.from(q(".js-fade"), {
      y: 12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.15,
      ease: "power3.out",
    });
  }, [active]);

  const t = DIAL_TABS[active];
  const N = DIAL_TABS.length;

  return (
    <section
      className="ald"
      id="alm-next"
      ref={sectionRef}
      aria-labelledby="ald-title"
    >
      <div className="alm-container">
        <h2 id="ald-title" className="ald-title">
          {DIAL_HEADING.map(([w, hl], i) => (
            <span key={i} className={`ald-hw ${hl ? "hl" : ""}`}>
              <span>{w}</span>
            </span>
          ))}
        </h2>

        {/* Mobile tabs (the dial labels are hidden on small screens) */}
        <div
          className="ald-chips"
          role="tablist"
          aria-label="Attendance features"
        >
          {DIAL_TABS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={active === i ? "is-active" : ""}
              onClick={() => select(i)}
            >
              <Icon name={s.icon} size={13} /> {s.label}
              <span className="ald-chip-bar">
                <i ref={(el) => (chipBars.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="ald-grid">
          <div
            className="ald-left"
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <Dial active={active} onSelect={select} progressRef={progressRef} />
          </div>

          <div
            className="ald-copy"
            ref={copyRef}
            key={active}
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <span className="ald-step js-fade">
              <span className="ald-step-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}{" "}
              <em>
                0{active + 1} / 0{N}
              </em>
            </span>
            <h3>
              {t.title.map(([w, hl], i) => (
                <span key={i} className={`ald-tw ${hl ? "hl" : ""}`}>
                  <span>{w}</span>
                </span>
              ))}
            </h3>
            <p className="js-fade">{t.desc}</p>
            <div className="ald-actions js-fade">
              <a href="/contact" className="alm-btn primary">
                Book a Free Demo <Icon name="arrow" size={16} />
              </a>
              <div className="ald-nav">
                <button
                  type="button"
                  onClick={() => select((active - 1 + N) % N)}
                  aria-label="Previous"
                >
                  <span className="ald-flip">
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
    q: "What is the Attendance & Leave Management feature in NGriffinpay?",
    a: "NGriffinpay’s Attendance & Leave Management system allows organizations to accurately track employee working hours, manage leave requests, and maintain compliance—all through a single, automated platform.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "attendance & leave",
      "attendance and leave",
      "system",
    ],
  },
  {
    q: "How is attendance tracked?",
    a: "Employees can clock in and out using web, mobile, or biometric devices, ensuring accurate time records with real-time syncing to HR and payroll systems.",
    keys: [
      "track",
      "clock",
      "punch",
      "biometric",
      "fingerprint",
      "face",
      "gps",
      "mobile",
      "check in",
      "check-in",
      "how is attendance",
    ],
  },
  {
    q: "Can employees request and manage leaves online?",
    a: "Yes, employees can apply for leave, view their leave balances, and track approval status directly through the portal or mobile app.",
    keys: [
      "apply",
      "request",
      "online",
      "balance",
      "approval status",
      "manage leave",
      "self-service",
      "portal",
    ],
  },
  {
    q: "Does the system support multiple leave types?",
    a: "Absolutely. You can configure various leave types such as annual leave, sick leave, casual leave, and compensatory off, along with custom approval workflows.",
    keys: [
      "type",
      "multiple",
      "annual",
      "sick",
      "casual",
      "comp",
      "compensatory",
      "configure",
      "policy",
      "workflow",
    ],
  },
  {
    q: "Is real-time reporting available?",
    a: "Yes, managers can access real-time attendance and leave reports, helping them make informed scheduling and workforce decisions instantly.",
    keys: [
      "report",
      "analytics",
      "real-time",
      "real time",
      "dashboard",
      "insight",
      "trend",
      "export",
      "summary",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about attendance and leave.";
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
      <div className="alq-row bot" ref={ref}>
        <span className="alq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="alq-bubble bot alq-typing"
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
      <div className="alq-row user" ref={ref}>
        <div className="alq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="alq-row bot" ref={ref}>
      <span className="alq-bot-av" aria-hidden>
        N
      </span>
      <div className="alq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="alq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function AttendanceFaqSection() {
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
                  cta: { label: "Book a Free Demo", href: "/contact" },
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
      gsap.from(q(".alq-chat"), {
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
    <section className="alq" ref={sectionRef} aria-labelledby="alq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="alm-container alq-grid">
        <div className="alq-left">
          <span className="alq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="alq-title" className="alq-title js-faq-reveal">
            Attendance &amp; Leave Management –{" "}
            <span className="alm-grad">FAQs</span>
          </h2>
          <p className="alq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="alq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`alq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="alq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="alq-q-text">{f.q}</span>
                  <span className="alq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="alq-chat">
          <div className="alq-chat-head">
            <span className="alq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="alq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="alq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="alq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="alq-suggest" aria-label="Suggested questions">
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

          <form className="alq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about attendance or leave…"
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

export default function AttendanceLeave() {
  return (
    <div className="alm-page">
      <HeroSection />
      <DialSection />
      <AttendanceFaqSection />
      {/* SECTION 4 — coming next */}
    </div>
  );
}
