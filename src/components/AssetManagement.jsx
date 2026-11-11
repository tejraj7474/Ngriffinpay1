// AssetManagement.jsx
// NGriffinPay  — Product inner page: "Asset Allocation & Management"
// Section 1: Hero banner (live asset desk app on the left, content on the right)
// Section 2: Smart Locker Wall (one wall of assets that changes per service tab)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AssetManagement.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Smart Allocation",
    short: "Allocate",
    desc: "Assign assets to employees based on role, location, and availability.",
    icon: "target",
  },
  {
    title: "Real-Time Tracking",
    short: "Track",
    desc: "Monitor asset movements, condition, and current users with ease.",
    icon: "pin",
  },
  {
    title: "Automated Return Process",
    short: "Returns",
    desc: "Streamline asset handovers and returns during transfers or exits.",
    icon: "undo",
  },
  {
    title: "Detailed Reporting",
    short: "Reports",
    desc: "Access audit-ready logs and reports for asset lifecycle and usage.",
    icon: "chart",
  },
];

const STAGE_TIME = 5.5;

// Sidebar inventory per stage: [assigned, available, in repair]
const STOCK = [
  [313, 57, 14],
  [313, 57, 14],
  [312, 58, 14],
  [312, 58, 14],
];
const STOCK_TOTAL = 384;
const D_R = 42;
const D_C = 2 * Math.PI * D_R;

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
    case "target":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "undo":
      return (
        <svg {...p}>
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...p}>
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2 19h20" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...p}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "headset":
      return (
        <svg {...p}>
          <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" />
        </svg>
      );
    case "id":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="11" r="2.5" />
          <path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9h3M15 13h3" />
        </svg>
      );
    case "plug":
      return (
        <svg {...p}>
          <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4" />
        </svg>
      );
    case "box":
      return (
        <svg {...p}>
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "scan":
      return (
        <svg {...p}>
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "download":
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
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
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...p}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...p}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
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

// 1 — Smart Allocation: rules match a kit to a new joiner
const RULES = [
  { k: "Role", v: "UX Designer" },
  { k: "Location", v: "Whitefield · 3F" },
  { k: "Availability", v: "In stock" },
];
const KIT = [
  { name: 'MacBook Pro 14"', tag: "NGP-LT-0231", icon: "laptop" },
  { name: 'Dell 27" monitor', tag: "NGP-MN-0118", icon: "monitor" },
  { name: "Jabra headset", tag: "NGP-HS-0074", icon: "headset" },
];
function AllocatePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".ast-rule"),
      {
        autoAlpha: 0,
        scale: 0.85,
        stagger: 0.15,
        duration: 0.3,
        ease: "back.out(2)",
      },
      0.35,
    );
    q(".ast-rule").forEach((el, i) =>
      tl.call(() => el.classList.add("is-on"), null, 0.7 + i * 0.25),
    );
    tl.from(
      q(".ast-kit-item"),
      { x: 30, autoAlpha: 0, stagger: 0.2, duration: 0.4, ease: "power3.out" },
      1.2,
    );
    tl.from(
      q(".ast-kit-ok"),
      { scale: 0, stagger: 0.2, duration: 0.3, ease: "back.out(2.4)" },
      1.5,
    );
    tl.from(q(".ast-assigned"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.3);
  }, delay);

  return (
    <div className="ast-panel" ref={ref}>
      <div className="ast-head js-in">
        <Icon name="target" /> New allocation{" "}
        <em className="ast-tag">Auto-matched</em>
      </div>
      <div className="ast-joiner js-in">
        <span className="ast-av sm">SR</span>
        <div>
          <b>Sneha R.</b>
          <small>Joining 03 Nov · Design team</small>
        </div>
      </div>
      <div className="ast-rules">
        {RULES.map((r) => (
          <span key={r.k} className="ast-rule">
            <i>
              <Icon name="check" size={9} />
            </i>
            <small>{r.k}</small>
            <b>{r.v}</b>
          </span>
        ))}
      </div>
      <div className="ast-kit">
        {KIT.map((k) => (
          <div key={k.tag} className="ast-kit-item">
            <span className="ast-kit-ic">
              <Icon name={k.icon} size={14} />
            </span>
            <span>
              <b>{k.name}</b>
              <small>{k.tag}</small>
            </span>
            <span className="ast-kit-ok">
              <Icon name="check" size={10} />
            </span>
          </div>
        ))}
      </div>
      <div className="ast-assigned">
        <Icon name="bolt" size={12} /> Kit assigned in <b>2 mins</b> · Sneha
        notified · IT ticket created
      </div>
    </div>
  );
}

// 2 — Real-Time Tracking: asset journey + condition
const JOURNEY = [
  { at: "IT store room", t: "28 Oct · 10:20", icon: "box" },
  { at: "IT setup desk", t: "30 Oct · 16:05", icon: "laptop" },
  { at: "Sneha R. · 3F", t: "03 Nov · 09:40", icon: "user" },
];
const CONDITION = [
  { k: "Battery health", v: 96 },
  { k: "Body & screen", v: 90 },
  { k: "Warranty left", v: 72 },
];
function TrackPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".ast-route-fill"),
      { scaleX: 0, duration: 1.4, ease: "power2.inOut" },
      0.4,
    );
    tl.fromTo(
      q(".ast-route-dot"),
      { left: "16.66%" },
      { left: "83.33%", duration: 1.4, ease: "power2.inOut" },
      0.4,
    );
    q(".ast-stop").forEach((el, i) =>
      tl.call(() => el.classList.add("is-on"), null, 0.4 + i * 0.7),
    );
    q(".ast-cond-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: CONDITION[i].v / 100, duration: 0.7, ease: "power3.out" },
        1.6 + i * 0.12,
      ),
    );
    tl.from(q(".ast-now"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.2);
  }, delay);

  return (
    <div className="ast-panel" ref={ref}>
      <div className="ast-head js-in">
        <Icon name="pin" /> MacBook Pro 14" · NGP-LT-0231{" "}
        <em className="ast-live">
          <i /> Live
        </em>
      </div>
      <div className="ast-route js-in">
        <span className="ast-route-line">
          <i className="ast-route-fill" />
        </span>
        <span className="ast-route-dot">
          <Icon name="laptop" size={11} />
        </span>
        {JOURNEY.map((j) => (
          <div key={j.at} className="ast-stop">
            <span className="ast-stop-ic">
              <Icon name={j.icon} size={12} />
            </span>
            <b>{j.at}</b>
            <small>{j.t}</small>
          </div>
        ))}
      </div>
      <div className="ast-cond js-in">
        {CONDITION.map((c) => (
          <div key={c.k} className="ast-cond-row">
            <span>{c.k}</span>
            <span className="ast-cond-bar">
              <i />
            </span>
            <b>{c.v}%</b>
          </div>
        ))}
      </div>
      <div className="ast-now">
        <span className="ast-av sm">SR</span>
        <div>
          <b>Currently with Sneha R.</b>
          <small>Condition: Good · Last scanned 4 min ago</small>
        </div>
      </div>
    </div>
  );
}

// 3 — Automated Return: scan items back during an exit
const RETURNS = [
  { name: "Lenovo ThinkPad T14", tag: "NGP-LT-0187", icon: "laptop" },
  { name: "Laptop charger", tag: "NGP-AC-0412", icon: "plug" },
  { name: "Access ID card", tag: "NGP-ID-1093", icon: "id" },
  { name: "iPhone 13 (office)", tag: "NGP-PH-0055", icon: "phone" },
];
function ReturnPanel({ delay }) {
  const countRef = useRef(null);
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".ast-ret"),
      { autoAlpha: 0, x: -12, stagger: 0.08, duration: 0.3 },
      0.3,
    );
    q(".ast-ret").forEach((el, i) => {
      const at = 0.8 + i * 0.45;
      tl.fromTo(
        el.querySelector(".ast-scanline"),
        { left: "0%", autoAlpha: 1 },
        { left: "100%", duration: 0.35, ease: "none" },
        at,
      );
      tl.set(el.querySelector(".ast-scanline"), { autoAlpha: 0 }, at + 0.35);
      tl.call(
        () => {
          el.classList.add("is-done");
          if (countRef.current) countRef.current.textContent = i + 1;
        },
        null,
        at + 0.35,
      );
    });
    tl.from(q(".ast-stock"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.7);
  }, delay);

  return (
    <div className="ast-panel" ref={ref}>
      <div className="ast-head js-in">
        <Icon name="undo" /> Exit handover · Vikram P.{" "}
        <em className="ast-tag">
          <span ref={countRef}>0</span> / 4 returned
        </em>
      </div>
      <div className="ast-rets">
        {RETURNS.map((r) => (
          <div key={r.tag} className="ast-ret">
            <span className="ast-kit-ic">
              <Icon name={r.icon} size={14} />
            </span>
            <span>
              <b>{r.name}</b>
              <small>{r.tag}</small>
            </span>
            <span className="ast-ret-status">
              <em className="pend">Scan</em>
              <em className="ok">
                <Icon name="check" size={10} /> Returned
              </em>
            </span>
            <i className="ast-scanline" />
          </div>
        ))}
      </div>
      <div className="ast-stock">
        <span className="ast-stock-ic">
          <Icon name="box" size={13} />
        </span>
        <div>
          <b>Back in stock · condition checked</b>
          <small>Exit clearance updated for HR automatically</small>
        </div>
      </div>
    </div>
  );
}

// 4 — Detailed Reporting: utilization + lifecycle log
const USAGE = [
  { k: "Laptops", v: 92 },
  { k: "Monitors", v: 78 },
  { k: "Phones", v: 64 },
  { k: "Headsets", v: 71 },
];
const LIFECYCLE = [
  "Purchased",
  "Allocated",
  "Serviced",
  "Returned",
  "Re-allocated",
];
function ReportPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".ast-col i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleY: 0 },
        { scaleY: USAGE[i].v / 100, duration: 0.7, ease: "power3.out" },
        0.35 + i * 0.1,
      ),
    );
    q(".ast-col b").forEach((el, i) => {
      const st = { v: 0 };
      tl.to(
        st,
        {
          v: USAGE[i].v,
          duration: 0.7,
          onUpdate: () => (el.textContent = `${Math.round(st.v)}%`),
        },
        0.35 + i * 0.1,
      );
    });
    tl.from(
      q(".ast-life span"),
      { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.3 },
      1.1,
    );
    tl.from(
      q(".ast-export"),
      { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.3 },
      1.8,
    );
  }, delay);

  return (
    <div className="ast-panel" ref={ref}>
      <div className="ast-head js-in">
        <Icon name="chart" /> Asset utilization{" "}
        <em className="ast-tag">Oct 2026</em>
      </div>
      <div className="ast-cols js-in">
        {USAGE.map((u) => (
          <div key={u.k} className="ast-col">
            <b>0%</b>
            <span className="ast-col-track">
              <i />
            </span>
            <small>{u.k}</small>
          </div>
        ))}
      </div>
      <div className="ast-life js-in">
        <small>Lifecycle log · NGP-LT-0187</small>
        <div>
          {LIFECYCLE.map((l, i) => (
            <span key={l}>
              <i>{i + 1}</i>
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="ast-exports">
        <span className="ast-export">
          <Icon name="download" size={12} /> Audit log.xlsx
        </span>
        <span className="ast-export">
          <Icon name="file" size={12} /> Asset register.pdf
        </span>
      </div>
    </div>
  );
}

const PANELS = [AllocatePanel, TrackPanel, ReturnPanel, ReportPanel];

/* ------------------------------------------------------------------ */
/* Asset desk app (left side)                                          */
/* ------------------------------------------------------------------ */

function AssetApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const segRefs = useRef([]);
  const numRefs = useRef([]);
  const vals = useRef({ a: 0, b: 0, c: 0 });
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // Inventory donut + counts follow the stage
  useEffect(() => {
    const isFirst = first.current;
    const target = STOCK[stage];
    const st = vals.current;
    const tw = gsap.to(st, {
      a: target[0],
      b: target[1],
      c: target[2],
      duration: prefersReduced() ? 0 : isFirst ? 1.4 : 0.6,
      delay: isFirst ? 0.9 : 0.4,
      ease: "power3.out",
      onUpdate: () => {
        let offset = 0;
        [st.a, st.b, st.c].forEach((v, i) => {
          const len = (v / STOCK_TOTAL) * D_C;
          const seg = segRefs.current[i];
          if (seg) {
            seg.setAttribute(
              "stroke-dasharray",
              `${Math.max(len - 2, 0)} ${D_C}`,
            );
            seg.setAttribute("stroke-dashoffset", `${-offset}`);
          }
          offset += len;
          if (numRefs.current[i])
            numRefs.current[i].textContent = Math.round(v);
        });
      },
    });
    return () => tw.kill();
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
  const LEGEND = [
    ["Assigned", "a"],
    ["Available", "b"],
    ["In repair", "c"],
  ];

  return (
    <div className="ast-frame" ref={frameRef}>
      <div className="ast-chrome">
        <span className="ast-dot r" />
        <span className="ast-dot y" />
        <span className="ast-dot g" />
        <div className="ast-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/assets
        </div>
      </div>

      <div className="ast-app">
        <aside className="ast-side js-side">
          <div className="ast-search">
            <Icon name="search" size={12} /> Search asset, tag or employee
          </div>

          <div className="ast-donut">
            <svg viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r={D_R} className="ast-donut-bg" />
              {LEGEND.map(([, c], i) => (
                <circle
                  key={c}
                  ref={(el) => (segRefs.current[i] = el)}
                  cx="50"
                  cy="50"
                  r={D_R}
                  className={`ast-donut-seg ${c}`}
                  strokeDasharray={`0 ${D_C}`}
                />
              ))}
            </svg>
            <div className="ast-donut-txt">
              <b>{STOCK_TOTAL}</b>
              <small>Total assets</small>
            </div>
          </div>

          <div className="ast-legend">
            {LEGEND.map(([l, c], i) => (
              <span key={l}>
                <i className={c} />
                {l}
                <b ref={(el) => (numRefs.current[i] = el)}>0</b>
              </span>
            ))}
          </div>

          <span className="ast-health">
            <Icon name="shield" size={11} /> 0 assets unaccounted
          </span>
        </aside>

        <div className="ast-main">
          <div
            className="ast-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Asset features"
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
          <div className="ast-panel-wrap" ref={panelWrap}>
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
      tl.from(q(".js-side"), { x: -18, opacity: 0, duration: 0.5 }, 0.6);
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
      className="ast-hero"
      ref={sectionRef}
      aria-labelledby="ast-hero-title"
    >
      <div className="ast-hero-bg" aria-hidden>
        <span className="ast-blob b1 js-blob" />
        <span className="ast-blob b2 js-blob" />
        <span className="ast-grid-bg" />
      </div>

      <div className="ast-container ast-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="ast-content">
          <span className="ast-eyebrow js-reveal">
            <span className="ast-live-dot" /> Efficient tracking &amp; optimized
            resource usage
          </span>
          <h1 id="ast-hero-title" className="ast-title js-reveal">
            Asset <span className="ast-grad">Allocation &amp; Management</span>
          </h1>

          <ul className="ast-feats" role="tablist" aria-label="Asset features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`ast-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="ast-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="ast-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="ast-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: asset desk */}
        <div className="ast-visual" ref={visualRef}>
          <AssetApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="ast-float f1 js-float">
            <span className="ast-float-ic ok">
              <Icon name="laptop" size={14} />
            </span>
            <div>
              <strong>Kit ready before day one</strong>
              <small>Auto-matched by role</small>
            </div>
          </div>
          <div className="ast-float f2 js-float">
            <span className="ast-float-ic pr">
              <Icon name="scan" size={14} />
            </span>
            <div>
              <strong>Every return scanned</strong>
              <small>Nothing goes missing</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Smart Locker Wall (one wall of assets that reacts per tab) */
/* ------------------------------------------------------------------ */

const LOCKER_HEADING = [
  ["Optimize", true],
  ["asset"],
  ["utilization,"],
  ["streamline", true],
  ["allocation"],
  ["processes,"],
  ["and", true],
  ["ensure"],
  ["complete"],
  ["accountability"],
];

// Tab labels from your tabs; title/desc matched to each label
const LOCKER_TABS = [
  {
    label: "Real-Time Asset Tracking",
    icon: "pin",
    title: [
      ["Track", true],
      ["and"],
      ["allocate assets", true],
      ["efficiently"],
    ],
    desc: "Monitor asset distribution across departments, ensuring optimal resource usage and reducing idle equipment.",
  },
  {
    label: "Automated Allocation & Assignment",
    icon: "target",
    title: [["Automated", true], ["asset"], ["lifecycle tracking", true]],
    desc: "From procurement to disposal, manage every stage of an asset’s lifecycle with real-time visibility.",
  },
  {
    label: "Maintenance & Service Scheduling",
    icon: "wrench",
    title: [["Preventive", true], ["maintenance"], ["alerts", true]],
    desc: "Schedule and track maintenance to extend asset lifespan and prevent costly breakdowns.",
  },
  {
    label: "Return & Reallocation Management",
    icon: "undo",
    title: [["Seamless", true], ["asset"], ["transfers", true]],
    desc: "Easily reassign assets between employees or locations with accurate tracking and approval workflows.",
  },
  {
    label: "Comprehensive Asset Reports",
    icon: "chart",
    title: [["Detailed", true], ["asset"], ["reports & analytics", true]],
    desc: "Gain insights into asset utilization, depreciation, and costs for better decision-making.",
  },
];

const LOCKER_TIME = 6.5; // seconds per tab
const COLS = 6;
const TYPES = ["laptop", "monitor", "phone", "headset"];
const TYPE_CODE = { laptop: "LT", monitor: "MN", phone: "PH", headset: "HS" };
const DEPTS = [
  { k: "eng", name: "Engineering" },
  { k: "des", name: "Design" },
  { k: "sal", name: "Sales" },
  { k: "fin", name: "Finance" },
];
const LIFE = [
  { k: "new", name: "Procured" },
  { k: "use", name: "In use" },
  { k: "age", name: "Ageing" },
  { k: "ret", name: "For disposal" },
];
const IDLE = [5, 11, 18];
const SERVICE = { 1: "3d", 9: "5d", 14: "Today", 22: "8d" };
const MOVE_FROM = 7;
const MOVE_TO = 16;

const LOCKERS = Array.from({ length: 24 }, (_, i) => {
  const type = TYPES[(i * 3 + Math.floor(i / 6)) % 4];
  const lifeIdx = [
    1, 1, 0, 1, 2, 1, 1, 3, 1, 2, 1, 0, 1, 1, 2, 1, 3, 1, 0, 1, 2, 1, 1, 0,
  ][i];
  return {
    i,
    type,
    tag: `${TYPE_CODE[type]}-${104 + i}`,
    dept: DEPTS[Math.floor(i / 6) % 4].k,
    life: LIFE[lifeIdx].k,
    heat: ((i * 37) % 65) + 35,
  };
});
const LIFE_COUNT = LIFE.map(
  (l) => LOCKERS.filter((x) => x.life === l.k).length,
);
const UTIL = Math.round(
  ((LOCKERS.length - IDLE.length) / LOCKERS.length) * 100,
);

function lockerState(l, tab) {
  if (tab === 0) return `dept-${l.dept}${IDLE.includes(l.i) ? " is-idle" : ""}`;
  if (tab === 1) return `life-${l.life}`;
  if (tab === 2) return SERVICE[l.i] ? "is-due" : "is-ok";
  if (tab === 3)
    return l.i === MOVE_FROM ? "is-from" : l.i === MOVE_TO ? "is-to" : "is-dim";
  return "is-heat";
}

// Small card bodies (one per tab)
function CardTracking() {
  return (
    <div className="as2-mini">
      <div className="as2-stats">
        <span>
          <b>{LOCKERS.length}</b>
          <small>Tracked live</small>
        </span>
        <span>
          <b>{UTIL}%</b>
          <small>In use</small>
        </span>
        <span className="warn">
          <b>{IDLE.length}</b>
          <small>Idle · reassign</small>
        </span>
      </div>
      <div className="as2-legend">
        {DEPTS.map((d) => (
          <span key={d.k}>
            <i className={`dept-${d.k}`} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
function CardLifecycle() {
  return (
    <div className="as2-mini">
      <div className="as2-life">
        {LIFE.map((l, i) => (
          <span key={l.k} className={`as2-life-step life-${l.k}`}>
            <b>{LIFE_COUNT[i]}</b>
            <small>{l.name}</small>
          </span>
        ))}
      </div>
      <small className="as2-note">
        <Icon name="bolt" size={11} /> Stage updates itself on purchase,
        assignment, service &amp; disposal
      </small>
    </div>
  );
}
function CardMaintenance() {
  const rows = Object.entries(SERVICE).map(([i, d]) => ({ l: LOCKERS[+i], d }));
  return (
    <div className="as2-mini">
      {rows.map(({ l, d }) => (
        <div key={l.tag} className={`as2-svc ${d === "Today" ? "now" : ""}`}>
          <span className="as2-svc-ic">
            <Icon name={l.type} size={12} />
          </span>
          <b>{l.tag}</b>
          <small>
            {l.type === "laptop"
              ? "Battery & thermal check"
              : l.type === "monitor"
                ? "Panel calibration"
                : l.type === "phone"
                  ? "Software & battery"
                  : "Cushion replacement"}
          </small>
          <em>{d}</em>
        </div>
      ))}
    </div>
  );
}
function CardTransfer() {
  const l = LOCKERS[MOVE_FROM];
  return (
    <div className="as2-mini">
      <div className="as2-move">
        <span>
          <small>From</small>
          <b>Rahul M. · Sales</b>
        </span>
        <span className="as2-move-arrow">
          <Icon name="arrow" size={14} />
        </span>
        <span>
          <small>To</small>
          <b>Priya S. · Design</b>
        </span>
      </div>
      <div className="as2-appr">
        <span>
          <Icon name="check" size={10} /> Manager
        </span>
        <span>
          <Icon name="check" size={10} /> IT desk
        </span>
        <span>
          <Icon name="check" size={10} /> Asset {l.tag} moved
        </span>
      </div>
    </div>
  );
}
function CardReports() {
  return (
    <div className="as2-mini">
      <div className="as2-dep">
        <div className="as2-dep-top">
          <small>Book value vs purchase</small>
          <b>₹38.4L / ₹52.0L</b>
        </div>
        <span className="as2-dep-bar">
          <i />
        </span>
        <div className="as2-dep-foot">
          <span>
            Depreciated <b>26%</b>
          </span>
          <span>
            Utilization <b>{UTIL}%</b>
          </span>
          <span>
            Cost / employee <b>₹16,200</b>
          </span>
        </div>
      </div>
      <div className="as2-heat-key">
        <small>Low use</small>
        <i />
        <small>High use</small>
      </div>
    </div>
  );
}
const LOCKER_CARDS = [
  CardTracking,
  CardLifecycle,
  CardMaintenance,
  CardTransfer,
  CardReports,
];

function LockerWallSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const wallRef = useRef(null);
  const tokenRef = useRef(null);
  const cardRef = useRef(null);
  const barRefs = useRef([]);
  const firstChange = useRef(true);

  const go = (i) => setActive((i + LOCKER_TABS.length) % LOCKER_TABS.length);

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
      gsap.from(q(".as2-hw > span"), {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
      gsap.from(q(".as2-locker"), {
        rotationY: -90,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: { each: 0.03, from: "start" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
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
          { scaleX: 1, duration: LOCKER_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(LOCKER_TIME, () => go(active + 1));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, paused, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lockers flip to their new state; card swaps in; tab-specific motion
  useLayoutEffect(() => {
    const wall = wallRef.current;
    const reduce = prefersReduced();
    const anims = [];
    if (!firstChange.current && !reduce) {
      anims.push(
        gsap.fromTo(
          wall.querySelectorAll(".as2-face"),
          { rotationX: -90 },
          {
            rotationX: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: { each: 0.025, from: "center" },
          },
        ),
      );
      if (cardRef.current) {
        anims.push(
          gsap.fromTo(
            cardRef.current,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          ),
        );
        anims.push(
          gsap.fromTo(
            cardRef.current.querySelectorAll(".as2-tw > span"),
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: "power4.out",
              delay: 0.1,
            },
          ),
        );
      }
    }
    firstChange.current = false;

    // Transfers: an asset token hops from one locker to another, on repeat
    if (active === 3 && tokenRef.current) {
      const from = wall.children[MOVE_FROM];
      const to = wall.children[MOVE_TO];
      if (from && to) {
        const pos = (el) => ({
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
        });
        const a = pos(from);
        const b = pos(to);
        const lift = Math.min(a.y, b.y) - 50;
        gsap.set(tokenRef.current, { x: a.x, y: a.y, autoAlpha: 0 });
        if (!reduce) {
          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.6,
            delay: 0.5,
          });
          tl.to(tokenRef.current, { autoAlpha: 1, scale: 1.15, duration: 0.25 })
            .to(tokenRef.current, {
              x: (a.x + b.x) / 2,
              y: lift,
              duration: 0.55,
              ease: "power2.out",
            })
            .to(tokenRef.current, {
              x: b.x,
              y: b.y,
              duration: 0.55,
              ease: "power2.in",
            })
            .to(tokenRef.current, { scale: 1, duration: 0.2 })
            .to(tokenRef.current, { autoAlpha: 0, duration: 0.3, delay: 0.5 });
          anims.push(tl);
        } else {
          gsap.set(tokenRef.current, { x: b.x, y: b.y, autoAlpha: 1 });
        }
      }
    }
    // Reports: depreciation bar grows
    if (active === 4 && cardRef.current && !reduce) {
      anims.push(
        gsap.fromTo(
          cardRef.current.querySelectorAll(".as2-dep-bar i"),
          { scaleX: 0 },
          { scaleX: 0.738, duration: 1, delay: 0.3, ease: "power3.out" },
        ),
      );
    }
    return () => {
      anims.forEach((t) => t.kill());
      if (tokenRef.current) gsap.set(tokenRef.current, { autoAlpha: 0 });
    };
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

  const tab = LOCKER_TABS[active];
  const Card = LOCKER_CARDS[active];
  const words = tab.title.flatMap(([t, hl]) =>
    t.split(" ").map((w) => [w, hl]),
  );

  return (
    <section
      className="as2"
      ref={sectionRef}
      aria-labelledby="as2-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="ast-container">
        <h2 id="as2-title" className="as2-title">
          {LOCKER_HEADING.map(([w, hl], i) => (
            <span key={i} className="as2-hw">
              <span className={hl ? "hl" : ""}>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="as2-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="Asset management services"
        >
          {LOCKER_TABS.map((t, i) => (
            <button
              type="button"
              key={t.label}
              role="tab"
              aria-selected={active === i}
              className={`as2-tab ${active === i ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="as2-tab-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}
              <span className="as2-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="as2-grid">
          {/* LEFT: the locker wall */}
          <div className="as2-cabinet">
            <div className="as2-cab-head">
              <span>
                <Icon name="box" size={14} /> Asset wall · Whitefield HQ
              </span>
              <em>
                <i /> Live
              </em>
            </div>
            <div
              className={`as2-wall tab-${active}`}
              ref={wallRef}
              style={{ "--cols": COLS }}
            >
              {LOCKERS.map((l) => (
                <div
                  key={l.tag}
                  className={`as2-locker ${lockerState(l, active)}`}
                  style={{ "--heat": l.heat / 100 }}
                >
                  <div className="as2-face">
                    <span className="as2-l-ic">
                      <Icon name={l.type} size={16} />
                    </span>
                    <span className="as2-l-tag">{l.tag}</span>
                    {active === 0 && IDLE.includes(l.i) && (
                      <em className="as2-badge idle">Idle</em>
                    )}
                    {active === 2 && SERVICE[l.i] && (
                      <em className="as2-badge due">
                        <Icon name="wrench" size={9} /> {SERVICE[l.i]}
                      </em>
                    )}
                    {active === 4 && (
                      <em className="as2-badge heat">{l.heat}%</em>
                    )}
                  </div>
                </div>
              ))}
              <span className="as2-token" ref={tokenRef} aria-hidden>
                <Icon name="laptop" size={14} />
              </span>
            </div>
          </div>

          {/* RIGHT: copy + live card */}
          <div className="as2-side">
            <div className="as2-card" ref={cardRef} role="tabpanel">
              <span className="as2-step">
                <span className="as2-step-ic">
                  <Icon name={tab.icon} size={14} />
                </span>
                {tab.label}{" "}
                <em>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(LOCKER_TABS.length).padStart(2, "0")}
                </em>
              </span>
              <h3>
                {words.map(([w, hl], i) => (
                  <span key={`${active}-${i}`} className="as2-tw">
                    <span className={hl ? "hl" : ""}>{w}</span>
                  </span>
                ))}
              </h3>
              <p>{tab.desc}</p>
              <Card key={active} />
            </div>
            <div className="as2-actions">
              <a href="/contact-us" className="ast-btn primary">
                Get Started with NGriffinPay <Icon name="arrow" size={16} />
              </a>
              <div className="as2-nav">
                <button
                  type="button"
                  aria-label="Previous service"
                  onClick={() => go(active - 1)}
                >
                  <span className="as2-flip">
                    <Icon name="arrow" size={16} />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Next service"
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
    q: "What is the Asset Allocation & Management feature in NGriffinPay ?",
    a: "NGriffinPay   Asset Allocation & Management module enables organizations to efficiently assign, track, and monitor company assets—from laptops to vehicles—ensuring optimal utilization and accountability.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "asset management",
      "asset allocation",
    ],
  },
  {
    q: "How are assets allocated to employees?",
    a: "Assets can be assigned through the system based on employee roles, departments, or specific requests, with allocation records maintained for audit and compliance purposes.",
    keys: [
      "allocat",
      "assign",
      "give",
      "issue",
      "new joiner",
      "role",
      "department",
      "request",
    ],
  },
  {
    q: "Can the system track asset usage and location?",
    a: "Yes, you can monitor asset usage, location, and condition in real time, ensuring that resources are properly utilized and maintained.",
    keys: [
      "track",
      "usage",
      "location",
      "where",
      "condition",
      "real time",
      "real-time",
      "monitor",
      "gps",
    ],
  },
  {
    q: "Does the platform handle asset returns and reallocation?",
    a: "Absolutely. The system streamlines the process of asset returns, repairs, and reallocations, reducing manual errors and asset misplacement.",
    keys: [
      "return",
      "reallocat",
      "reassign",
      "transfer",
      "repair",
      "exit",
      "handover",
      "misplace",
      "lost",
    ],
  },
  {
    q: "Can I generate asset-related reports?",
    a: "Yes, detailed asset inventory, allocation, depreciation, and maintenance reports are available for better decision-making and cost optimization.",
    keys: [
      "report",
      "inventory",
      "depreciation",
      "maintenance",
      "export",
      "audit",
      "analytics",
      "cost",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about company assets.";
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
      <div className="asq-row bot" ref={ref}>
        <span className="asq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="asq-bubble bot asq-typing"
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
      <div className="asq-row user" ref={ref}>
        <div className="asq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="asq-row bot" ref={ref}>
      <span className="asq-bot-av" aria-hidden>
        N
      </span>
      <div className="asq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="asq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function AssetFaqSection() {
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
      gsap.from(q(".asq-chat"), {
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
    <section className="asq" ref={sectionRef} aria-labelledby="asq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="ast-container asq-grid">
        <div className="asq-left">
          <span className="asq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="asq-title" className="asq-title js-faq-reveal">
            Asset Allocation &amp; Management –{" "}
            <span className="ast-grad">FAQs</span>
          </h2>
          <p className="asq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="asq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`asq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="asq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="asq-q-text">{f.q}</span>
                  <span className="asq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="asq-chat">
          <div className="asq-chat-head">
            <span className="asq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="asq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="asq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="asq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="asq-suggest" aria-label="Suggested questions">
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

          <form className="asq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about allocation, tracking or returns…"
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

export default function AssetManagement() {
  return (
    <div className="ast-page">
      <HeroSection />
      <span id="ast-next" />
      <LockerWallSection />
      <AssetFaqSection />
    </div>
  );
}
