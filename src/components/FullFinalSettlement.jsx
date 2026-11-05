// FullFinalSettlement.jsx
// NGriffinpay — Product inner page: "Full & Final Settlement Processing"
// Section 1: Hero banner (live FNF settlement workspace on the left, content on the right)
// Section 2: Settlement Vault (combination dial turns to each service + live settlement card)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FullFinalSettlement.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Auto Calculations",
    short: "Calculate",
    desc: "Seamlessly compute notice pay, leave encashment, and other dues.",
    icon: "calc",
  },
  {
    title: "Seamless Integration",
    short: "Integrate",
    desc: "Connect with payroll, attendance, and leave modules for accurate settlements.",
    icon: "link",
  },
  {
    title: "Custom Workflows",
    short: "Workflow",
    desc: "Define approval chains and automate clearance checklists.",
    icon: "flow",
  },
  {
    title: "Transparent Records",
    short: "Records",
    desc: "Maintain logs of settlement details with downloadable reports and audit trails.",
    icon: "file",
  },
];

const STAGE_TIME = 5.5;
const NET_PAYABLE = 212000;
const STATUS = [
  "Auto-calculated",
  "Synced with payroll",
  "Approvals 4 / 4",
  "Logged & downloadable",
];

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const inr = (n) => Math.round(n).toLocaleString("en-IN");

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
    case "calc":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h.01M12 18h.01" />
        </svg>
      );
    case "link":
      return (
        <svg {...p}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "flow":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="15" width="6" height="6" rx="1" />
          <path d="M6 9v3a3 3 0 0 0 3 3h6" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v13H5a2 2 0 0 1-2-2V5" />
          <path d="M16 14h.01" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...p}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
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
    case "laptop":
      return (
        <svg {...p}>
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2 19h20" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "plus":
      return (
        <svg {...p}>
          <path d="M12 5v14M5 12h14" />
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
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "download":
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "spark":
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

// 1 — Auto Calculations: each due computed with its formula
const CALC_ROWS = [
  {
    label: "Salary for days worked",
    formula: "₹90,000 ÷ 30 × 18 days",
    amt: 54000,
  },
  { label: "Leave encashment", formula: "₹3,000 × 12 days", amt: 36000 },
  { label: "Gratuity", formula: "₹45,000 × 15/26 × 6 yrs", amt: 155769 },
  {
    label: "Notice pay recovery",
    formula: "₹3,000 × 5 days short",
    amt: -15000,
  },
  { label: "TDS on salary", formula: "As per tax regime", amt: -18769 },
];
function CalcPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".ffs-calc-row"),
      { x: -16, autoAlpha: 0, stagger: 0.12, duration: 0.35 },
      0.3,
    );
    tl.from(
      q(".ffs-formula"),
      {
        clipPath: "inset(0 100% 0 0)",
        stagger: 0.12,
        duration: 0.45,
        ease: "power2.out",
      },
      0.45,
    );
    q(".ffs-calc-amt span").forEach((el, i) => {
      const st = { v: 0 };
      const amt = Math.abs(CALC_ROWS[i].amt);
      tl.to(
        st,
        {
          v: amt,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => (el.textContent = inr(st.v)),
        },
        0.6 + i * 0.12,
      );
    });
    tl.from(q(".ffs-calc-total"), { autoAlpha: 0, y: 10, duration: 0.4 }, 1.6);
  }, delay);

  return (
    <div className="ffs-panel" ref={ref}>
      <div className="ffs-head js-in">
        <Icon name="calc" /> Settlement sheet{" "}
        <em className="ffs-tag">Auto-calculated</em>
      </div>
      <div className="ffs-calc">
        {CALC_ROWS.map((r) => (
          <div
            key={r.label}
            className={`ffs-calc-row ${r.amt < 0 ? "minus" : ""}`}
          >
            <div className="ffs-calc-lbl">
              <b>{r.label}</b>
              <span className="ffs-formula">{r.formula}</span>
            </div>
            <b className="ffs-calc-amt">
              {r.amt < 0 ? "− " : "+ "}₹<span>0</span>
            </b>
          </div>
        ))}
      </div>
      <div className="ffs-calc-total">
        <span>
          <Icon name="spark" size={12} /> 0 manual entries · rules applied
          automatically
        </span>
        <b>₹{inr(NET_PAYABLE)}</b>
      </div>
    </div>
  );
}

// 2 — Seamless Integration: payroll, attendance & leave feed the sheet
const SOURCES = [
  {
    mod: "Payroll",
    icon: "wallet",
    field: "Basic & gross",
    value: "₹45,000 · ₹90,000",
  },
  {
    mod: "Attendance",
    icon: "calendar",
    field: "Days worked (Oct)",
    value: "18 days",
  },
  {
    mod: "Leave",
    icon: "leaf",
    field: "Earned leave balance",
    value: "12 days",
  },
];
function SyncPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".ffs-mod"),
      { x: -18, autoAlpha: 0, stagger: 0.12, duration: 0.35 },
      0.3,
    );
    tl.from(
      q(".ffs-pipe"),
      {
        scaleX: 0,
        transformOrigin: "left",
        stagger: 0.12,
        duration: 0.4,
        ease: "power2.out",
      },
      0.55,
    );
    q(".ffs-field").forEach((el, i) => {
      tl.from(el, { x: 14, autoAlpha: 0, duration: 0.35 }, 0.9 + i * 0.35);
      tl.from(
        el.querySelector(".ffs-field-ok"),
        { scale: 0, duration: 0.3, ease: "back.out(2.4)" },
        1.1 + i * 0.35,
      );
    });
    tl.from(q(".ffs-synced"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.2);
    if (!prefersReduced()) {
      q(".ffs-pipe i").forEach((el, i) =>
        gsap.fromTo(
          el,
          { left: "-20%" },
          {
            left: "100%",
            duration: 1.4,
            repeat: -1,
            ease: "none",
            delay: 0.8 + i * 0.3,
          },
        ),
      );
    }
  }, delay);

  return (
    <div className="ffs-panel" ref={ref}>
      <div className="ffs-head js-in">
        <Icon name="link" /> Connected modules{" "}
        <em className="ffs-tag">Live sync</em>
      </div>
      <div className="ffs-sync">
        {SOURCES.map((s) => (
          <div key={s.mod} className="ffs-sync-row">
            <span className="ffs-mod">
              <span className="ffs-mod-ic">
                <Icon name={s.icon} size={13} />
              </span>
              {s.mod}
            </span>
            <span className="ffs-pipe">
              <i />
            </span>
            <span className="ffs-field">
              <span>
                <small>{s.field}</small>
                <b>{s.value}</b>
              </span>
              <span className="ffs-field-ok">
                <Icon name="check" size={10} />
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="ffs-synced">
        <span className="ffs-synced-ic">
          <Icon name="shield" size={13} />
        </span>
        <div>
          <b>Pulled straight from your HR data</b>
          <small>No re-entry · last synced 2 min ago</small>
        </div>
      </div>
    </div>
  );
}

// 3 — Custom Workflows: approval chain + clearance checklist
const CHAIN = [
  { who: "Reporting manager", sub: "Handover sign-off" },
  { who: "IT", sub: "Assets & access" },
  { who: "Finance", sub: "No dues" },
  { who: "HR head", sub: "Final approval" },
];
const CHECKLIST = [
  "Laptop & charger returned",
  "ID & access card",
  "Knowledge transfer done",
  "Loan / advance cleared",
];
function FlowPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".ffs-node").forEach((el, i) => {
      tl.from(el, { autoAlpha: 0, x: -12, duration: 0.3 }, 0.3 + i * 0.12);
      tl.call(() => el.classList.add("is-done"), null, 1 + i * 0.4);
    });
    q(".ffs-node-link i").forEach((el, i) =>
      tl.from(el, { scaleY: 0, duration: 0.3, ease: "none" }, 1.1 + i * 0.4),
    );
    q(".ffs-chk").forEach((el, i) =>
      tl.call(() => el.classList.add("is-done"), null, 1.1 + i * 0.4),
    );
    tl.from(
      q(".ffs-add"),
      { scale: 0.85, autoAlpha: 0, duration: 0.4, ease: "back.out(2)" },
      2.7,
    );
  }, delay);

  return (
    <div className="ffs-panel" ref={ref}>
      <div className="ffs-head js-in">
        <Icon name="flow" /> Approval workflow{" "}
        <em className="ffs-tag">Your rules</em>
      </div>
      <div className="ffs-flow">
        <div className="ffs-chain">
          {CHAIN.map((c, i) => (
            <div key={c.who} className="ffs-node-wrap">
              <div className="ffs-node">
                <span className="ffs-node-dot">
                  <Icon name="check" size={10} />
                  <em>{i + 1}</em>
                </span>
                <span>
                  <b>{c.who}</b>
                  <small>{c.sub}</small>
                </span>
              </div>
              {i < CHAIN.length - 1 && (
                <span className="ffs-node-link">
                  <i />
                </span>
              )}
            </div>
          ))}
          <span className="ffs-add">
            <Icon name="plus" size={11} /> Add approver
          </span>
        </div>
        <div className="ffs-checklist js-in">
          <small>Clearance checklist</small>
          {CHECKLIST.map((c) => (
            <span key={c} className="ffs-chk">
              <i>
                <Icon name="check" size={9} />
              </i>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4 — Transparent Records: audit trail + downloads
const AUDIT = [
  {
    t: "29 Oct · 10:02",
    who: "System",
    act: "FNF auto-calculated · ₹2,12,000",
  },
  { t: "29 Oct · 15:40", who: "Rahul M.", act: "Manager approval" },
  { t: "30 Oct · 11:15", who: "Finance", act: "No dues confirmed" },
  { t: "31 Oct · 17:05", who: "HR head", act: "Approved & released to bank" },
  {
    t: "31 Oct · 17:20",
    who: "System",
    act: "Relieving letter & payslip issued",
  },
];
function RecordsPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".ffs-log"),
      { autoAlpha: 0, y: 12, stagger: 0.18, duration: 0.35 },
      0.3,
    );
    tl.from(
      q(".ffs-log-line i"),
      { scaleY: 0, duration: 0.9, ease: "none" },
      0.35,
    );
    tl.fromTo(
      q(".ffs-dl.pdf .ffs-dl-fill"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: "power1.inOut" },
      1.4,
    );
    tl.call(() => q(".ffs-dl.pdf")[0]?.classList.add("is-done"), null, 2.3);
    tl.from(
      q(".ffs-lock"),
      { autoAlpha: 0, scale: 0.8, duration: 0.35, ease: "back.out(2)" },
      2.4,
    );
  }, delay);

  return (
    <div className="ffs-panel" ref={ref}>
      <div className="ffs-head js-in">
        <Icon name="file" /> Audit trail{" "}
        <em className="ffs-lock">
          <Icon name="lock" size={10} /> Tamper-proof
        </em>
      </div>
      <div className="ffs-logs">
        <span className="ffs-log-line">
          <i />
        </span>
        {AUDIT.map((a) => (
          <div key={a.t} className="ffs-log">
            <span className="ffs-log-dot" />
            <div>
              <b>{a.act}</b>
              <small>
                {a.who} · {a.t}
              </small>
            </div>
          </div>
        ))}
      </div>
      <div className="ffs-dls js-in">
        <span className="ffs-dl pdf">
          <i className="ffs-dl-fill" />
          <span>
            <Icon name="download" size={12} /> Settlement report.pdf
          </span>
          <em>
            <Icon name="check" size={10} /> Saved
          </em>
        </span>
        <span className="ffs-dl">
          <span>
            <Icon name="download" size={12} /> Audit log.xlsx
          </span>
        </span>
      </div>
    </div>
  );
}

const PANELS = [CalcPanel, SyncPanel, FlowPanel, RecordsPanel];

/* ------------------------------------------------------------------ */
/* FNF workspace app (left side)                                       */
/* ------------------------------------------------------------------ */

function SettlementApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const netRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // Net payable counts up once when the app appears
  useEffect(() => {
    const st = { v: 0 };
    const tw = gsap.to(st, {
      v: NET_PAYABLE,
      duration: prefersReduced() ? 0 : 1.6,
      delay: 0.9,
      ease: "power2.out",
      onUpdate: () =>
        netRef.current && (netRef.current.textContent = inr(st.v)),
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
    <div className="ffs-frame" ref={frameRef}>
      <div className="ffs-chrome">
        <span className="ffs-dot r" />
        <span className="ffs-dot y" />
        <span className="ffs-dot g" />
        <div className="ffs-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/fnf-settlement
        </div>
      </div>

      <div className="ffs-top js-top">
        <div className="ffs-emp">
          <span className="ffs-av">AK</span>
          <div>
            <b>Arjun K. · Senior Accountant</b>
            <small>6.2 yrs service · Last day 31 Oct 2026</small>
          </div>
        </div>
        <div className="ffs-net">
          <small>Net payable</small>
          <b>
            ₹<span ref={netRef}>0</span>
          </b>
          <span key={stage} className="ffs-status">
            <i /> {STATUS[stage]}
          </span>
        </div>
      </div>

      <div className="ffs-app">
        <div
          className="ffs-rail js-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="Settlement features"
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
              <span className="ffs-rail-ic">
                <Icon name={f.icon} size={14} />
              </span>
              {f.short}
            </button>
          ))}
        </div>
        <div className="ffs-panel-wrap" ref={panelWrap}>
          <Panel key={stage} delay={startDelay} />
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
      tl.from(q(".js-top"), { y: -14, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(
        q(".js-tabs button"),
        { x: -12, opacity: 0, stagger: 0.08, duration: 0.4 },
        0.7,
      );
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
      className="ffs-hero"
      ref={sectionRef}
      aria-labelledby="ffs-hero-title"
    >
      <div className="ffs-hero-bg" aria-hidden>
        <span className="ffs-blob b1 js-blob" />
        <span className="ffs-blob b2 js-blob" />
        <span className="ffs-grid-bg" />
      </div>

      <div className="ffs-container ffs-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="ffs-content">
          <span className="ffs-eyebrow js-reveal">
            <span className="ffs-live-dot" /> Accurate, timely &amp; hassle-free
            exits
          </span>
          <h1 id="ffs-hero-title" className="ffs-title js-reveal">
            Full &amp; Final{" "}
            <span className="ffs-grad">Settlement Processing</span>
          </h1>

          <ul
            className="ffs-feats"
            role="tablist"
            aria-label="Settlement features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`ffs-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="ffs-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="ffs-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="ffs-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: FNF workspace */}
        <div className="ffs-visual" ref={visualRef}>
          <SettlementApp
            frameRef={frameRef}
            stage={stage}
            onSelect={setStage}
          />
          <div className="ffs-float f1 js-float">
            <span className="ffs-float-ic ok">
              <Icon name="shield" size={14} />
            </span>
            <div>
              <strong>Gratuity auto-checked</strong>
              <small>Eligible · 6.2 yrs service</small>
            </div>
          </div>
          <div className="ffs-float f2 js-float">
            <span className="ffs-float-ic pr">
              <Icon name="send" size={14} />
            </span>
            <div>
              <strong>Settled in 48 hrs</strong>
              <small>Paid straight to bank</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Settlement Vault (combination dial + live settlement card) */
/* ------------------------------------------------------------------ */

const VAULT_HEADING = [
  ["Automate", true],
  ["final"],
  ["settlements,"],
  ["ensure", true],
  ["compliance,"],
  ["and", true],
  ["close"],
  ["exits"],
  ["seamlessly"],
];

const VAULT_TABS = [
  {
    label: "Automated Payout Calculations",
    icon: "calc",
    stat: "₹1,28,500",
    statLbl: "dues computed",
    title: [["Automated", true], ["payout"], ["calculations", true]],
    desc: "Automatically compute pending salary, bonuses, incentives, and other final dues without manual errors.",
  },
  {
    label: "Leave Encashment & Deductions",
    icon: "leaf",
    stat: "12 days",
    statLbl: "leave encashed",
    title: [["Leave encashment", true], ["&"], ["deductions", true]],
    desc: "Easily process unused leave payouts and adjust for recoveries, advances, or deductions in one go.",
  },
  {
    label: "Statutory Compliance",
    icon: "shield",
    stat: "4 / 4",
    statLbl: "statutory checks",
    title: [["Stay compliant", true], ["with statutory"], ["laws", true]],
    desc: "Ensure accurate PF, ESI, gratuity, and tax deductions, with automated statutory reporting.",
  },
  {
    label: "Approval Workflow",
    icon: "flow",
    stat: "3 / 3",
    statLbl: "levels approved",
    title: [["Approval", true], ["workflow"]],
    desc: "Route settlements through multi-level approvals with real-time tracking and instant notifications.",
  },
  {
    label: "Settlement Reports",
    icon: "file",
    stat: "1-click",
    statLbl: "audit-ready report",
    title: [["Detailed", true], ["settlement"], ["reports", true]],
    desc: "Generate comprehensive settlement statements and reports for audits and compliance.",
  },
];

const VAULT_TIME = 6; // seconds per tab
const SEG = 360 / VAULT_TABS.length;
const VC = 200; // dial centre (viewBox 400 x 400)

function useVaultCard(build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay: 0.25 });
      build(tl, q);
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// 1 — payout pieces stack into one total
const PAYOUT = [
  { label: "Pending salary", amt: 54000, c: "a" },
  { label: "Bonus", amt: 25000, c: "b" },
  { label: "Incentives", amt: 18500, c: "c" },
  { label: "Other dues", amt: 31000, c: "d" },
];
const PAYOUT_TOTAL = PAYOUT.reduce((s, p) => s + p.amt, 0); // 1,28,500
function VaultPayout() {
  const totRef = useRef(null);
  const ref = useVaultCard((tl, q) => {
    tl.from(q(".ffs2-stack i"), {
      scaleX: 0,
      transformOrigin: "left",
      stagger: 0.25,
      duration: 0.4,
      ease: "power2.out",
    });
    tl.from(
      q(".ffs2-leg"),
      { autoAlpha: 0, y: 8, stagger: 0.25, duration: 0.3 },
      0,
    );
    const st = { v: 0 };
    tl.to(
      st,
      {
        v: PAYOUT_TOTAL,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () =>
          totRef.current && (totRef.current.textContent = inr(st.v)),
      },
      0.1,
    );
    tl.from(q(".ffs2-zero"), { autoAlpha: 0, x: 10, duration: 0.3 }, 1.2);
  });
  return (
    <div className="ffs2-viz" ref={ref}>
      <div className="ffs2-total">
        <small>Total payout</small>
        <b>
          ₹<span ref={totRef}>0</span>
        </b>
        <em className="ffs2-zero">
          <Icon name="check" size={10} /> 0 manual errors
        </em>
      </div>
      <div className="ffs2-stack">
        {PAYOUT.map((p) => (
          <i
            key={p.label}
            className={p.c}
            style={{ width: `${(p.amt / PAYOUT_TOTAL) * 100}%` }}
          />
        ))}
      </div>
      <div className="ffs2-legs">
        {PAYOUT.map((p) => (
          <span key={p.label} className="ffs2-leg">
            <i className={p.c} />
            {p.label}
            <b>₹{inr(p.amt)}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

// 2 — leave days light up, recoveries subtract
const RECOVERIES = [
  { label: "Salary advance", amt: 10000 },
  { label: "Notice shortfall · 5 days", amt: 15000 },
];
function VaultLeave() {
  const ref = useVaultCard((tl, q) => {
    tl.from(q(".ffs2-day"), {
      scale: 0,
      stagger: 0.05,
      duration: 0.25,
      ease: "back.out(2.4)",
    });
    tl.from(
      q(".ffs2-rec"),
      { x: 14, autoAlpha: 0, stagger: 0.18, duration: 0.3 },
      0.6,
    );
    tl.from(q(".ffs2-adj"), { autoAlpha: 0, y: 8, duration: 0.35 }, 1.1);
  });
  return (
    <div className="ffs2-viz" ref={ref}>
      <div className="ffs2-leave">
        <div className="ffs2-leave-top">
          <span>
            <small>Unused earned leave</small>
            <b>12 days × ₹3,000</b>
          </span>
          <b className="plus">+₹36,000</b>
        </div>
        <div className="ffs2-days">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="ffs2-day">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
      {RECOVERIES.map((r) => (
        <div key={r.label} className="ffs2-rec">
          <span>{r.label}</span>
          <b>−₹{inr(r.amt)}</b>
        </div>
      ))}
      <div className="ffs2-adj">
        <span>Net adjustment · in one go</span>
        <b>+₹11,000</b>
      </div>
    </div>
  );
}

// 3 — statutory checks
const STATUTORY = [
  { k: "PF", v: "Final ECR · ₹5,400", ok: true },
  { k: "ESI", v: "Not applicable · wage > ₹21,000", ok: true },
  { k: "Gratuity", v: "₹1,55,769 · 6 yrs service", ok: true },
  { k: "TDS", v: "₹18,769 · Form 16 ready", ok: true },
];
function VaultCompliance() {
  const ref = useVaultCard((tl, q) => {
    q(".ffs2-law").forEach((el, i) => {
      tl.from(el, { autoAlpha: 0, y: 10, duration: 0.3 }, i * 0.2);
      tl.from(
        el.querySelector(".ffs2-law-ok"),
        { scale: 0, rotation: -90, duration: 0.35, ease: "back.out(2.4)" },
        0.3 + i * 0.2,
      );
    });
    tl.from(q(".ffs2-filed"), { autoAlpha: 0, y: 8, duration: 0.35 }, 1.2);
  });
  return (
    <div className="ffs2-viz" ref={ref}>
      <div className="ffs2-laws">
        {STATUTORY.map((s) => (
          <div key={s.k} className="ffs2-law">
            <b>{s.k}</b>
            <small>{s.v}</small>
            <span className="ffs2-law-ok">
              <Icon name="check" size={11} />
            </span>
          </div>
        ))}
      </div>
      <div className="ffs2-filed">
        <Icon name="file" size={12} /> Statutory report generated automatically
      </div>
    </div>
  );
}

// 4 — approval levels with instant notifications
const LEVELS = [
  { who: "Reporting manager", time: "9:40 AM" },
  { who: "Finance controller", time: "11:05 AM" },
  { who: "HR head", time: "2:20 PM" },
];
function VaultApproval() {
  const ref = useVaultCard((tl, q) => {
    q(".ffs2-lvl").forEach((el, i) => {
      tl.from(el, { autoAlpha: 0, x: -12, duration: 0.3 }, i * 0.15);
      tl.call(() => el.classList.add("is-done"), null, 0.6 + i * 0.5);
    });
    q(".ffs2-lvl-link i").forEach((el, i) =>
      tl.from(el, { scaleX: 0, duration: 0.4, ease: "none" }, 0.7 + i * 0.5),
    );
    tl.from(
      q(".ffs2-toast"),
      {
        autoAlpha: 0,
        y: -14,
        scale: 0.95,
        stagger: 0.5,
        duration: 0.35,
        ease: "back.out(1.8)",
      },
      0.65,
    );
  });
  return (
    <div className="ffs2-viz" ref={ref}>
      <div className="ffs2-lvls">
        {LEVELS.map((l, i) => (
          <div key={l.who} className="ffs2-lvl-wrap">
            <div className="ffs2-lvl">
              <span className="ffs2-lvl-dot">
                <Icon name="check" size={11} />
                <em>L{i + 1}</em>
              </span>
              <b>{l.who}</b>
            </div>
            {i < LEVELS.length - 1 && (
              <span className="ffs2-lvl-link">
                <i />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="ffs2-toasts">
        {LEVELS.map((l) => (
          <div key={l.who} className="ffs2-toast">
            <span className="ffs2-bell">
              <Icon name="bell" size={11} />
            </span>
            <span>
              <b>{l.who} approved</b>
              <small>Arjun K. · FNF ₹2,12,000 · {l.time}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5 — settlement statement for audits
function VaultReports() {
  const ref = useVaultCard((tl, q) => {
    tl.from(q(".ffs2-doc"), {
      y: 20,
      rotation: -2,
      autoAlpha: 0,
      duration: 0.45,
      ease: "power3.out",
    });
    tl.from(
      q(".ffs2-doc-line"),
      { scaleX: 0, transformOrigin: "left", stagger: 0.06, duration: 0.3 },
      0.3,
    );
    tl.from(
      q(".ffs2-seal"),
      {
        scale: 2,
        rotation: -30,
        autoAlpha: 0,
        duration: 0.4,
        ease: "back.out(2)",
      },
      0.9,
    );
    tl.from(
      q(".ffs2-export"),
      { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.3 },
      1.1,
    );
  });
  return (
    <div className="ffs2-viz" ref={ref}>
      <div className="ffs2-doc">
        <div className="ffs2-doc-head">
          <b>FNF Settlement Statement</b>
          <small>Arjun K. · EMP-0412 · Oct 2026</small>
        </div>
        {[92, 76, 84, 60, 70].map((w, i) => (
          <span key={i} className="ffs2-doc-line" style={{ width: `${w}%` }} />
        ))}
        <div className="ffs2-doc-net">
          <span>Net payable</span>
          <b>₹2,12,000</b>
        </div>
        <span className="ffs2-seal">
          <Icon name="shield" size={11} /> Audit-ready
        </span>
      </div>
      <div className="ffs2-exports">
        <span className="ffs2-export">
          <Icon name="download" size={12} /> PDF
        </span>
        <span className="ffs2-export">
          <Icon name="download" size={12} /> Excel
        </span>
        <span className="ffs2-export">
          <Icon name="file" size={12} /> Compliance pack
        </span>
      </div>
    </div>
  );
}

const VAULT_CARDS = [
  VaultPayout,
  VaultLeave,
  VaultCompliance,
  VaultApproval,
  VaultReports,
];

function SettlementVaultSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const dialRef = useRef(null);
  const statRef = useRef(null);
  const cardRef = useRef(null);
  const barRefs = useRef([]);
  const dialRot = useRef(0);
  const firstChange = useRef(true);

  const go = (i) => setActive((i + VAULT_TABS.length) % VAULT_TABS.length);

  // Heading reveal, idle dial motion, autoplay only while on screen
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
      gsap.from(q(".ffs2-hw > span"), {
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
      gsap.from([q(".ffs2-tabs"), q(".ffs2-vault"), q(".ffs2-card")], {
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
      gsap.to(q(".ffs2-ring-outer"), {
        rotation: 360,
        duration: 80,
        repeat: -1,
        ease: "none",
      });
      gsap.to(q(".ffs2-glow"), {
        scale: 1.08,
        opacity: 0.9,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
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
          { scaleX: 1, duration: VAULT_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(VAULT_TIME, () => go(active + 1));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, paused, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dial turns (shortest way) so the active slot sits under the pointer; icons stay upright
  useEffect(() => {
    const target = -active * SEG;
    let delta = ((((target - dialRot.current) % 360) + 540) % 360) - 180;
    if (Math.abs(delta) < 0.01) delta = 0;
    dialRot.current += delta;
    const d = prefersReduced() ? 0 : 1.1;
    const dial = dialRef.current;
    const tws = [
      gsap.to(dial, {
        rotation: dialRot.current,
        duration: d,
        ease: "back.out(1.1)",
      }),
      gsap.to(dial.querySelectorAll(".ffs2-slot-ic"), {
        rotation: -dialRot.current,
        duration: d,
        ease: "back.out(1.1)",
      }),
    ];
    if (!firstChange.current && statRef.current && !prefersReduced()) {
      tws.push(
        gsap.fromTo(
          statRef.current,
          { scale: 0.8, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.35,
            ease: "back.out(2)",
          },
        ),
      );
    }
    return () => tws.forEach((t) => t.kill());
  }, [active]);

  // Card swaps in on every change
  useLayoutEffect(() => {
    if (firstChange.current) {
      firstChange.current = false;
      return;
    }
    if (prefersReduced() || !cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: 30, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
    );
    gsap.fromTo(
      cardRef.current.querySelectorAll(".ffs2-tw > span"),
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.1,
      },
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

  const tab = VAULT_TABS[active];
  const Card = VAULT_CARDS[active];
  const words = tab.title.flatMap(([t, hl]) =>
    t.split(" ").map((w) => [w, hl]),
  );

  return (
    <section
      className="ffs2"
      ref={sectionRef}
      aria-labelledby="ffs2-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="ffs-container">
        <h2 id="ffs2-title" className="ffs2-title">
          {VAULT_HEADING.map(([w, hl], i) => (
            <span key={i} className="ffs2-hw">
              <span className={hl ? "hl" : ""}>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="ffs2-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="Settlement services"
        >
          {VAULT_TABS.map((t, i) => (
            <button
              type="button"
              key={t.label}
              role="tab"
              aria-selected={active === i}
              className={`ffs2-tab ${active === i ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="ffs2-tab-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}
              <span className="ffs2-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="ffs2-grid">
          {/* LEFT: vault combination dial */}
          <div className="ffs2-vault">
            <span className="ffs2-glow" aria-hidden />
            {/* fixed steel body + bolts */}
            <svg className="ffs2-svg" viewBox="0 0 400 400" aria-hidden>
              <defs>
                <linearGradient id="ffs2Steel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e9f1fb" />
                  <stop offset="0.5" stopColor="#b8cbe4" />
                  <stop offset="1" stopColor="#7f9cc4" />
                </linearGradient>
              </defs>
              <circle cx={VC} cy={VC} r="196" fill="url(#ffs2Steel)" />
              <circle cx={VC} cy={VC} r="182" fill="#0b2550" />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={VC + Math.cos(a) * 189}
                    cy={VC + Math.sin(a) * 189}
                    r="3.4"
                    className="ffs2-bolt"
                  />
                );
              })}
            </svg>

            {/* slow outer tick ring */}
            <div className="ffs2-layer ffs2-ring-outer" aria-hidden>
              <svg viewBox="0 0 400 400">
                {Array.from({ length: 72 }, (_, i) => {
                  const a = (i / 72) * Math.PI * 2;
                  const r1 = i % 6 === 0 ? 162 : 168;
                  return (
                    <line
                      key={i}
                      x1={VC + Math.cos(a) * r1}
                      y1={VC + Math.sin(a) * r1}
                      x2={VC + Math.cos(a) * 175}
                      y2={VC + Math.sin(a) * 175}
                      className={i % 6 === 0 ? "ffs2-tick big" : "ffs2-tick"}
                    />
                  );
                })}
              </svg>
            </div>

            {/* the dial: 5 slots, turns so the active one sits under the pointer */}
            <div className="ffs2-layer" ref={dialRef}>
              <svg viewBox="0 0 400 400" aria-hidden>
                <circle cx={VC} cy={VC} r="150" className="ffs2-dial" />
                {VAULT_TABS.map((t, i) => {
                  const a = ((i * SEG - 90 + SEG / 2) * Math.PI) / 180;
                  return (
                    <circle
                      key={i}
                      cx={VC + Math.cos(a) * 118}
                      cy={VC + Math.sin(a) * 118}
                      r="3"
                      className="ffs2-notch"
                    />
                  );
                })}
              </svg>
              {VAULT_TABS.map((t, i) => {
                const a = ((i * SEG - 90) * Math.PI) / 180;
                return (
                  <button
                    type="button"
                    key={t.label}
                    tabIndex={-1}
                    aria-label={t.label}
                    className={`ffs2-slot ${active === i ? "is-on" : ""} ${i < active ? "is-done" : ""}`}
                    style={{
                      left: `${50 + (Math.cos(a) * 118) / 4}%`,
                      top: `${50 + (Math.sin(a) * 118) / 4}%`,
                    }}
                    onClick={() => setActive(i)}
                  >
                    <span className="ffs2-slot-ic">
                      <Icon name={t.icon} size={22} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* fixed core + pointer */}
            <svg
              className="ffs2-layer ffs2-top"
              viewBox="0 0 400 400"
              aria-hidden
            >
              <defs>
                <radialGradient id="ffs2Core" cx="0.5" cy="0.4" r="0.7">
                  <stop offset="0" stopColor="#1d6fd8" />
                  <stop offset="1" stopColor="#06152f" />
                </radialGradient>
              </defs>
              <circle
                cx={VC}
                cy={VC}
                r="84"
                fill="url(#ffs2Core)"
                className="ffs2-core"
              />
              <circle cx={VC} cy={VC} r="84" className="ffs2-core-ring" />
              <path
                d={`M${VC - 12} 22 L${VC + 12} 22 L${VC} 44 Z`}
                className="ffs2-pointer"
              />
            </svg>

            <div className="ffs2-stat" aria-live="polite">
              <div ref={statRef} key={active}>
                <b>{tab.stat}</b>
                <small>{tab.statLbl}</small>
              </div>
            </div>
          </div>

          {/* RIGHT: card for the active service */}
          <div className="ffs2-side">
            <div className="ffs2-card" ref={cardRef} role="tabpanel">
              <span className="ffs2-step">
                <span className="ffs2-step-ic">
                  <Icon name={tab.icon} size={14} />
                </span>
                {tab.label}{" "}
                <em>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(VAULT_TABS.length).padStart(2, "0")}
                </em>
              </span>
              <h3>
                {words.map(([w, hl], i) => (
                  <span key={`${active}-${i}`} className="ffs2-tw">
                    <span className={hl ? "hl" : ""}>{w}</span>
                  </span>
                ))}
              </h3>
              <p>{tab.desc}</p>
              <Card key={active} />
            </div>
            <div className="ffs2-actions">
              <a href="/contact-us" className="ffs-btn primary">
                Get Started with NGriffinpay <Icon name="arrow" size={16} />
              </a>
              <div className="ffs2-nav">
                <button
                  type="button"
                  aria-label="Previous service"
                  onClick={() => go(active - 1)}
                >
                  <span className="ffs2-flip">
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
    q: "What is the Full & Final Settlement (F&F) process in NGriffinpay?",
    a: "NGriffinpay’s Full & Final Settlement module automates the entire offboarding payout process — from pending salary and leave encashment to deductions and compliance — ensuring accurate, timely settlements.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "process",
      "module",
      "full & final",
      "full and final",
      "f&f",
      "fnf",
    ],
  },
  {
    q: "What components are included in the settlement?",
    a: "The settlement can include unpaid salary, leave encashment, bonuses, deductions, gratuity, and any other final payments as per company policy and statutory requirements.",
    keys: [
      "component",
      "include",
      "included",
      "what's in",
      "gratuity",
      "bonus",
      "encashment",
      "unpaid",
      "dues",
      "breakup",
      "break-up",
    ],
  },
  {
    q: "Does the system calculate payouts automatically?",
    a: "Yes. NGriffinpay automatically calculates the final payable amount based on payroll data, attendance, and applicable policies, reducing manual errors and saving time.",
    keys: [
      "calculat",
      "automatic",
      "auto",
      "compute",
      "payout",
      "amount",
      "manual",
      "error",
    ],
  },
  {
    q: "Is compliance handled during settlement?",
    a: "Absolutely. The system ensures compliance with tax regulations, PF/ESI deductions, and statutory reporting, providing accurate settlement documentation.",
    keys: [
      "compliance",
      "complian",
      "tax",
      "tds",
      "pf",
      "esi",
      "statutory",
      "law",
      "legal",
    ],
  },
  {
    q: "Can the process be tracked and approved online?",
    a: "Yes. Managers, HR, and Finance teams can review, approve, and track each settlement step online, ensuring transparency and faster processing.",
    keys: [
      "track",
      "approve",
      "approval",
      "online",
      "status",
      "review",
      "workflow",
      "manager",
      "finance team",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about full & final settlements.";
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
      <div className="fsq-row bot" ref={ref}>
        <span className="fsq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="fsq-bubble bot fsq-typing"
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
      <div className="fsq-row user" ref={ref}>
        <div className="fsq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="fsq-row bot" ref={ref}>
      <span className="fsq-bot-av" aria-hidden>
        N
      </span>
      <div className="fsq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="fsq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function SettlementFaqSection() {
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
      gsap.from(q(".fsq-chat"), {
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
    <section className="fsq" ref={sectionRef} aria-labelledby="fsq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="ffs-container fsq-grid">
        <div className="fsq-left">
          <span className="fsq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="fsq-title" className="fsq-title js-faq-reveal">
            Full &amp; Final Settlement Processing –{" "}
            <span className="ffs-grad">FAQs</span>
          </h2>
          <p className="fsq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="fsq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`fsq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="fsq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="fsq-q-text">{f.q}</span>
                  <span className="fsq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="fsq-chat">
          <div className="fsq-chat-head">
            <span className="fsq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="fsq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="fsq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="fsq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="fsq-suggest" aria-label="Suggested questions">
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

          <form className="fsq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about payouts, compliance or approvals…"
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

export default function FullFinalSettlement() {
  return (
    <div className="ffs-page">
      <HeroSection />
      <span id="ffs-next" />
      <SettlementVaultSection />
      <SettlementFaqSection />
    </div>
  );
}
