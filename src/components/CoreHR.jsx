// CoreHR.jsx
// NGriffinpay — Product inner page: "Core HR"
// Section 1: Hero banner (live HR records app on the left, content on the right)
// Section 2: HR Metro Map (each Core HR module is a metro line through one employee record)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./CoreHR.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Unified Employee Records",
    short: "Records",
    desc: "Every employee’s profile, job, pay and documents in one secure place.",
    icon: "id",
  },
  {
    title: "Org Structure & Reporting",
    short: "Org chart",
    desc: "Departments, locations and reporting lines that update as your team changes.",
    icon: "org",
  },
  {
    title: "Policies & Compliance",
    short: "Policies",
    desc: "Publish HR policies, track acknowledgements and stay PF, ESI and PT ready.",
    icon: "shield",
  },
  {
    title: "Lifecycle Workflows",
    short: "Lifecycle",
    desc: "Joiners, promotions, transfers and exits flow straight into payroll.",
    icon: "flow",
  },
];

const STAGE_TIME = 5.5;

const EMPLOYEES = [
  { av: "PS", name: "Priya Sharma", role: "Product Designer", tone: "a" },
  { av: "KV", name: "Karthik V.", role: "Senior Developer", tone: "b" },
  { av: "AR", name: "Anita Rao", role: "Finance Lead", tone: "c" },
  { av: "RM", name: "Rahul M.", role: "Sales Manager", tone: "d" },
  { av: "DN", name: "Deepa N.", role: "HR Executive", tone: "e" },
];

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
    case "id":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="11" r="2.5" />
          <path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9h3M15 13h3" />
        </svg>
      );
    case "org":
      return (
        <svg {...p}>
          <rect x="9" y="2" width="6" height="5" rx="1" />
          <rect x="2" y="17" width="6" height="5" rx="1" />
          <rect x="16" y="17" width="6" height="5" rx="1" />
          <path d="M12 7v5M5 17v-3h14v3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "flow":
      return (
        <svg {...p}>
          <circle cx="5" cy="6" r="2.5" />
          <circle cx="19" cy="18" r="2.5" />
          <path d="M7.5 6H14a3 3 0 0 1 3 3v6.5" />
          <path d="m14.5 13 2.5 2.5 2.5-2.5" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
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
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 13h.01M2 10h20" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
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
    case "sync":
      return (
        <svg {...p}>
          <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8" />
          <path d="M21 3v5h-5M3 21v-5h5" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
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

// 1 — Unified Employee Records: one profile, everything filled in
const PROFILE_FIELDS = [
  { k: "Employee ID", v: "EMP-0142", icon: "id" },
  { k: "Department", v: "Design · Whitefield", icon: "pin" },
  { k: "Reports to", v: "Rahul M.", icon: "user" },
  { k: "Monthly CTC", v: "₹92,000", icon: "wallet" },
  { k: "PAN · UAN", v: "Verified", icon: "shield" },
  { k: "Documents", v: "6 / 6 uploaded", icon: "file" },
];
const RING_R = 22;
const RING_C = 2 * Math.PI * RING_R;
function RecordsPanel({ delay }) {
  const pctRef = useRef(null);
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".chr-field"),
      { autoAlpha: 0, y: 10, stagger: 0.12, duration: 0.3 },
      0.35,
    );
    q(".chr-field-ok").forEach((el, i) =>
      tl.from(
        el,
        { scale: 0, duration: 0.25, ease: "back.out(2.6)" },
        0.55 + i * 0.12,
      ),
    );
    const st = { v: 0 };
    tl.fromTo(
      q(".chr-ring-fill"),
      { strokeDashoffset: RING_C },
      { strokeDashoffset: 0, duration: 1.3, ease: "power2.out" },
      0.4,
    );
    tl.to(
      st,
      {
        v: 100,
        duration: 1.3,
        ease: "power2.out",
        onUpdate: () =>
          pctRef.current && (pctRef.current.textContent = Math.round(st.v)),
      },
      0.4,
    );
    tl.from(q(".chr-synced"), { autoAlpha: 0, y: 10, duration: 0.4 }, 1.6);
  }, delay);

  return (
    <div className="chr-panel" ref={ref}>
      <div className="chr-profile js-in">
        <span className="chr-av lg a">PS</span>
        <div>
          <b>Priya Sharma</b>
          <small>Product Designer · Joined 12 Mar 2023</small>
          <span className="chr-tags">
            <em>Full-time</em>
            <em>Bengaluru</em>
          </span>
        </div>
        <div className="chr-ring">
          <svg viewBox="0 0 54 54" aria-hidden>
            <circle cx="27" cy="27" r={RING_R} className="chr-ring-bg" />
            <circle
              cx="27"
              cy="27"
              r={RING_R}
              className="chr-ring-fill"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          <span>
            <b>
              <span ref={pctRef}>0</span>%
            </b>
            <small>complete</small>
          </span>
        </div>
      </div>
      <div className="chr-ptabs js-in">
        <span className="is-on">Overview</span>
        <span>Job</span>
        <span>Pay</span>
        <span>Documents</span>
      </div>
      <div className="chr-fields">
        {PROFILE_FIELDS.map((f) => (
          <div key={f.k} className="chr-field">
            <span className="chr-field-ic">
              <Icon name={f.icon} size={12} />
            </span>
            <span>
              <small>{f.k}</small>
              <b>{f.v}</b>
            </span>
            <span className="chr-field-ok">
              <Icon name="check" size={9} />
            </span>
          </div>
        ))}
      </div>
      <div className="chr-synced">
        <Icon name="sync" size={12} /> One record shared by payroll, attendance
        and leave
      </div>
    </div>
  );
}

// 2 — Org Structure: chart draws itself
const HEADS = [
  { av: "RM", name: "Rahul M.", team: "Sales · 42", tone: "d" },
  { av: "VK", name: "Vikram K.", team: "Engineering · 104", tone: "b" },
  { av: "AR", name: "Anita Rao", team: "Finance · 18", tone: "c" },
];
function OrgPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".chr-node.ceo"),
      { scale: 0.6, autoAlpha: 0, duration: 0.4, ease: "back.out(2)" },
      0.3,
    );
    tl.from(
      q(".chr-org-stem"),
      { scaleY: 0, transformOrigin: "top", duration: 0.3 },
      0.65,
    );
    tl.from(q(".chr-org-bar"), { scaleX: 0, duration: 0.4 }, 0.9);
    tl.from(
      q(".chr-org-drop"),
      { scaleY: 0, transformOrigin: "top", stagger: 0.08, duration: 0.25 },
      1.2,
    );
    tl.from(
      q(".chr-node.head"),
      {
        y: 12,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.35,
        ease: "back.out(1.8)",
      },
      1.35,
    );
    tl.from(
      q(".chr-team-dots i"),
      { scale: 0, stagger: 0.02, duration: 0.2 },
      1.8,
    );
    tl.from(
      q(".chr-org-foot span"),
      { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.3 },
      2.3,
    );
  }, delay);

  return (
    <div className="chr-panel" ref={ref}>
      <div className="chr-head js-in">
        <Icon name="org" /> Organisation chart{" "}
        <em className="chr-tag">Auto-updated</em>
      </div>
      <div className="chr-org">
        <div className="chr-node ceo">
          <span className="chr-av a">SN</span>
          <span>
            <b>Sanjay N.</b>
            <small>CEO · 248 people</small>
          </span>
        </div>
        <span className="chr-org-stem" />
        <span className="chr-org-bar" />
        <div className="chr-org-row">
          {HEADS.map((h) => (
            <div key={h.av} className="chr-org-col">
              <span className="chr-org-drop" />
              <div className="chr-node head">
                <span className={`chr-av ${h.tone}`}>{h.av}</span>
                <span>
                  <b>{h.name}</b>
                  <small>{h.team}</small>
                </span>
              </div>
              <span className="chr-team-dots">
                {Array.from({ length: 6 }, (_, i) => (
                  <i key={i} className={h.tone} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="chr-org-foot">
        <span>
          <b>6</b> departments
        </span>
        <span>
          <b>3</b> locations
        </span>
        <span>
          <b>14</b> managers
        </span>
      </div>
    </div>
  );
}

// 3 — Policies & Compliance: acknowledgements + statutory checks
const POLICIES = [
  { name: "Leave policy 2026", v: 96 },
  { name: "Code of conduct", v: 100 },
  { name: "Work-from-home policy", v: 88 },
];
const STATUTORY = ["PF", "ESI", "PT", "LWF"];
function PolicyPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".chr-pol"),
      { autoAlpha: 0, x: -12, stagger: 0.12, duration: 0.3 },
      0.3,
    );
    q(".chr-pol-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: POLICIES[i].v / 100, duration: 0.8, ease: "power3.out" },
        0.6 + i * 0.12,
      ),
    );
    q(".chr-pol b").forEach((el, i) => {
      const st = { v: 0 };
      tl.to(
        st,
        {
          v: POLICIES[i].v,
          duration: 0.8,
          onUpdate: () => (el.textContent = `${Math.round(st.v)}%`),
        },
        0.6 + i * 0.12,
      );
    });
    tl.from(
      q(".chr-stat"),
      {
        scale: 0.6,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(2.4)",
      },
      1.5,
    );
    tl.from(q(".chr-due"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.2);
  }, delay);

  return (
    <div className="chr-panel" ref={ref}>
      <div className="chr-head js-in">
        <Icon name="shield" /> Policies &amp; compliance{" "}
        <em className="chr-tag">248 employees</em>
      </div>
      <div className="chr-pols">
        {POLICIES.map((p) => (
          <div key={p.name} className="chr-pol">
            <span className="chr-field-ic">
              <Icon name="file" size={12} />
            </span>
            <span className="chr-pol-txt">
              <span>{p.name}</span>
              <span className="chr-pol-bar">
                <i />
              </span>
            </span>
            <b>0%</b>
          </div>
        ))}
      </div>
      <small className="chr-sub js-in">Statutory registers</small>
      <div className="chr-stats">
        {STATUTORY.map((s) => (
          <span key={s} className="chr-stat">
            <Icon name="check" size={10} /> {s}
          </span>
        ))}
      </div>
      <div className="chr-due">
        <Icon name="bell" size={12} /> Next: PF &amp; ESI returns due 15 Nov ·
        reminders set
      </div>
    </div>
  );
}

// 4 — Lifecycle Workflows: events flow into payroll
const EVENTS = [
  { t: "Joined", d: "12 Mar 2023", note: "Payroll profile created", tone: "b" },
  { t: "Confirmed", d: "12 Sep 2023", note: "Probation closed", tone: "c" },
  {
    t: "Promoted",
    d: "01 Apr 2026",
    note: "CTC ₹78k → ₹92k · payroll updated",
    tone: "a",
  },
  {
    t: "Transferred",
    d: "01 Oct 2026",
    note: "Whitefield office · manager changed",
    tone: "d",
  },
];
function LifecyclePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".chr-life-line i"),
      { scaleY: 0, duration: 1.4, ease: "none" },
      0.3,
    );
    q(".chr-ev").forEach((el, i) => {
      tl.from(el, { autoAlpha: 0, x: 14, duration: 0.35 }, 0.35 + i * 0.35);
      tl.from(
        el.querySelector(".chr-ev-sync"),
        { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "back.out(2)" },
        0.55 + i * 0.35,
      );
    });
    tl.from(q(".chr-next"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.1);
  }, delay);

  return (
    <div className="chr-panel" ref={ref}>
      <div className="chr-head js-in">
        <Icon name="flow" /> Priya’s journey{" "}
        <em className="chr-tag">Auto-synced</em>
      </div>
      <div className="chr-life">
        <span className="chr-life-line">
          <i />
        </span>
        {EVENTS.map((e) => (
          <div key={e.t} className="chr-ev">
            <span className={`chr-ev-dot ${e.tone}`} />
            <div className="chr-ev-txt">
              <b>{e.t}</b>
              <small>
                {e.d} · {e.note}
              </small>
            </div>
            <span className="chr-ev-sync">
              <Icon name="sync" size={10} /> Payroll
            </span>
          </div>
        ))}
      </div>
      <div className="chr-next">
        <span className="chr-next-ic">
          <Icon name="star" size={13} />
        </span>
        <div>
          <b>Next: annual appraisal · Mar 2027</b>
          <small>Letters and payroll changes generated for you</small>
        </div>
      </div>
    </div>
  );
}

const PANELS = [RecordsPanel, OrgPanel, PolicyPanel, LifecyclePanel];

/* ------------------------------------------------------------------ */
/* Core HR app (left side)                                             */
/* ------------------------------------------------------------------ */

function CoreHRApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

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
    <div className="chr-frame" ref={frameRef}>
      <div className="chr-chrome">
        <span className="chr-dot r" />
        <span className="chr-dot y" />
        <span className="chr-dot g" />
        <div className="chr-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/core-hr
        </div>
      </div>

      <div className="chr-topbar js-top">
        <span className="chr-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinpay" />
        </span>
        <b>Admin</b>
        <span className="chr-search">
          <Icon name="search" size={12} /> Search 248 employees…
        </span>
        <span className="chr-bell">
          <Icon name="bell" size={13} />
          <i />
        </span>
        <span className="chr-av sm a">PR</span>
      </div>

      <div className="chr-app">
        <aside className="chr-side js-side">
          <div className="chr-side-head">
            <Icon name="users" size={12} /> People <em>248</em>
          </div>
          {EMPLOYEES.map((e, i) => (
            <div key={e.av} className={`chr-emp ${i === 0 ? "is-on" : ""}`}>
              <span className={`chr-av ${e.tone}`}>{e.av}</span>
              <span>
                <b>{e.name}</b>
                <small>{e.role}</small>
              </span>
            </div>
          ))}
        </aside>

        <div className="chr-main">
          <div
            className="chr-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Core HR features"
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
          <div className="chr-panel-wrap" ref={panelWrap}>
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
      tl.from(q(".js-top"), { y: -12, opacity: 0, duration: 0.45 }, 0.55);
      tl.from(
        q(".chr-emp"),
        { x: -14, opacity: 0, stagger: 0.07, duration: 0.4 },
        0.65,
      );
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
      className="chr-hero"
      ref={sectionRef}
      aria-labelledby="chr-hero-title"
    >
      <div className="chr-hero-bg" aria-hidden>
        <span className="chr-blob b1 js-blob" />
        <span className="chr-blob b2 js-blob" />
        <span className="chr-grid-bg" />
      </div>

      <div className="chr-container chr-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="chr-content">
          <span className="chr-eyebrow js-reveal">
            <span className="chr-live-dot" /> One source of truth for your
            people
          </span>
          <h1 id="chr-hero-title" className="chr-title js-reveal">
            Core <span className="chr-grad">HR</span>
          </h1>

          <ul
            className="chr-feats"
            role="tablist"
            aria-label="Core HR features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`chr-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="chr-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="chr-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="chr-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: Core HR app */}
        <div className="chr-visual" ref={visualRef}>
          <CoreHRApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="chr-float f1 js-float">
            <span className="chr-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>248 records · 100% complete</strong>
              <small>No more spreadsheets</small>
            </div>
          </div>
          <div className="chr-float f2 js-float">
            <span className="chr-float-ic pr">
              <Icon name="sync" size={14} />
            </span>
            <div>
              <strong>Changes sync to payroll</strong>
              <small>Instantly, every time</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — HR Metro Map (every module is a line through one record) */
/* ------------------------------------------------------------------ */

const METRO_HEADING = [
  ["Organise", true],
  ["your"],
  ["people,"],
  ["automate", true],
  ["HR"],
  ["operations,"],
  ["and", true],
  ["build"],
  ["a"],
  ["workplace"],
  ["that"],
  ["runs"],
  ["itself"],
];

// Each tab = one metro line. Every line runs through the central "Employee record" interchange.
// path: SVG path in a 640 x 420 map · at: where the 4 stops sit along the line (0–1)
// lbl: label offset for this line's stops [dx, dy, text-anchor]
const METRO_LINES = [
  {
    label: "Employee Database",
    icon: "id",
    color: "#1d6fd8",
    path: "M40 210 H600",
    at: [0.04, 0.3, 0.7, 0.96],
    lbl: [0, -16, "middle"],
    stops: [
      "Personal details",
      "Job & salary",
      "Bank & statutory",
      "Documents",
    ],
    title: [
      ["One", true],
      ["profile"],
      ["for every", false],
      ["employee", true],
    ],
    desc: "Store personal, job, bank and statutory details in a single searchable record that payroll, attendance and leave all read from.",
    stat: ["248", "complete employee records"],
  },
  {
    label: "Hire to Retire",
    icon: "flow",
    color: "#10b981",
    path: "M70 60 H170 L320 210 L470 360 H590",
    at: [0.03, 0.3, 0.7, 0.97],
    lbl: [0, -16, "middle"],
    stops: ["Offer accepted", "Joining & induction", "Promotion", "Exit & F&F"],
    title: [["Run", true], ["the full"], ["employee lifecycle", true]],
    desc: "Offers, confirmations, promotions, transfers and exits move along one workflow, with payroll updated at every step.",
    stat: ["0", "manual payroll updates"],
  },
  {
    label: "Org & Hierarchy",
    icon: "org",
    color: "#38bdf8",
    path: "M320 25 V395",
    at: [0.04, 0.3, 0.7, 0.96],
    lbl: [14, 4, "start"],
    stops: ["Company", "Location", "Department", "Team & manager"],
    title: [["Map", true], ["your organisation"], ["as it grows", true]],
    desc: "Set up companies, locations, departments and reporting lines once — the org chart and approval routes update themselves.",
    stat: ["6", "departments · 3 locations"],
  },
  {
    label: "Letters & Policies",
    icon: "file",
    color: "#f59e0b",
    path: "M570 60 H470 L320 210 L170 360 H60",
    at: [0.03, 0.3, 0.7, 0.97],
    lbl: [0, -16, "middle"],
    stops: ["Pick a template", "Auto-fill details", "e-Sign", "Employee inbox"],
    title: [["Generate", true], ["letters and policies"], ["in a click", true]],
    desc: "Offer, confirmation and experience letters fill themselves from the employee record, get signed online and land in the employee’s inbox.",
    stat: ["30 sec", "to issue any HR letter"],
  },
  {
    label: "HR Analytics",
    icon: "chart",
    color: "#a78bfa",
    path: "M200 120 H440 Q480 120 480 160 V260 Q480 300 440 300 H200 Q160 300 160 260 V160 Q160 120 200 120 Z",
    at: [0, 0.25, 0.5, 0.75],
    lbl: [0, -14, "middle"],
    stops: ["Headcount", "New joiners", "Exits", "Attrition report"],
    title: [["See", true], ["headcount and attrition"], ["at a glance", true]],
    desc: "Live reports on headcount, joiners, exits and attrition by team — ready to download whenever leadership asks.",
    stat: ["150+", "ready-made HR reports"],
  },
];

const METRO_TIME = 7; // seconds per line
const HUB = [320, 210];

function MetroMapSection() {
  const [active, setActive] = useState(0);
  const [stop, setStop] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pts, setPts] = useState(() => METRO_LINES.map(() => []));
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const pathRefs = useRef([]);
  const trainRef = useRef(null);
  const cardRef = useRef(null);
  const barRefs = useRef([]);
  const firstChange = useRef(true);

  const go = (i) => setActive((i + METRO_LINES.length) % METRO_LINES.length);

  // Work out where each stop sits on its line (from the real SVG geometry)
  useLayoutEffect(() => {
    setPts(
      METRO_LINES.map((l, i) => {
        const p = pathRefs.current[i];
        if (!p) return [];
        const len = p.getTotalLength();
        return l.at.map((a) => {
          const pt = p.getPointAtLength(a * len);
          return [pt.x, pt.y];
        });
      }),
    );
  }, []);

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
      gsap.from(q(".ch2-hw > span"), {
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
      gsap.from([q(".ch2-tabs"), q(".ch2-map"), q(".ch2-card")], {
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
      gsap.to(q(".ch2-hub-ring"), {
        scale: 1.35,
        opacity: 0,
        duration: 1.8,
        repeat: -1,
        ease: "power1.out",
        transformOrigin: "50% 50%",
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
          { scaleX: 1, duration: METRO_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(METRO_TIME, () => go(active + 1));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, paused, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Active line draws in, then a train rides it stop by stop
  useLayoutEffect(() => {
    const path = pathRefs.current[active];
    const train = trainRef.current;
    if (!path || !train) return undefined;
    const line = METRO_LINES[active];
    const len = path.getTotalLength();
    const reduce = prefersReduced();
    const anims = [];
    const place = (f) => {
      const p = path.getPointAtLength(f * len);
      train.setAttribute("transform", `translate(${p.x} ${p.y})`);
    };
    setStop(0);
    place(line.at[0]);

    if (!reduce) {
      anims.push(
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
        ),
      );
      const ride = { f: line.at[0] };
      const tl = gsap.timeline({ repeat: -1, delay: 0.7, repeatDelay: 0.4 });
      tl.set(ride, { f: line.at[0] });
      tl.call(() => {
        place(line.at[0]);
        setStop(0);
      });
      line.at.slice(1).forEach((a, k) => {
        tl.to(
          ride,
          {
            f: a,
            duration: 0.9,
            ease: "power1.inOut",
            onUpdate: () => place(ride.f),
          },
          "+=0.45",
        );
        tl.call(() => setStop(k + 1));
      });
      tl.to({}, { duration: 0.6 });
      anims.push(tl);
    } else {
      gsap.set(path, { strokeDashoffset: 0 });
    }

    if (!firstChange.current && cardRef.current && !reduce) {
      anims.push(
        gsap.fromTo(
          cardRef.current,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
        ),
      );
      anims.push(
        gsap.fromTo(
          cardRef.current.querySelectorAll(".ch2-tw > span"),
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
    firstChange.current = false;
    return () => anims.forEach((t) => t.kill());
  }, [active, pts]);

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

  const line = METRO_LINES[active];
  const words = line.title.flatMap(([t, hl]) =>
    t.split(" ").map((w) => [w, hl]),
  );

  return (
    <section
      className="ch2"
      ref={sectionRef}
      aria-labelledby="ch2-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="chr-container">
        <h2 id="ch2-title" className="ch2-title">
          {METRO_HEADING.map(([w, hl], i) => (
            <span key={i} className="ch2-hw">
              <span className={hl ? "hl" : ""}>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="ch2-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="Core HR modules"
        >
          {METRO_LINES.map((l, i) => (
            <button
              type="button"
              key={l.label}
              role="tab"
              aria-selected={active === i}
              className={`ch2-tab ${active === i ? "is-active" : ""}`}
              style={{ "--line": l.color }}
              onClick={() => setActive(i)}
            >
              <span className="ch2-tab-ic">
                <Icon name={l.icon} size={14} />
              </span>
              {l.label}
              <span className="ch2-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="ch2-grid">
          {/* LEFT: the metro map */}
          <div className="ch2-map">
            <div className="ch2-map-head">
              <span>
                <Icon name="org" size={14} /> Core HR network
              </span>
              <em>
                <i style={{ background: line.color }} /> {line.label} line
              </em>
            </div>
            <svg
              className="ch2-svg"
              viewBox="0 0 640 420"
              role="img"
              aria-label={`${line.label}: ${line.stops.join(", ")}`}
            >
              <defs>
                <pattern
                  id="ch2Grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M20 0H0V20"
                    fill="none"
                    stroke="rgba(147,193,245,0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="640" height="420" fill="url(#ch2Grid)" />

              {/* all lines */}
              {METRO_LINES.map((l, i) => (
                <g
                  key={l.label}
                  className={`ch2-line ${i === active ? "is-on" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <path
                    d={l.path}
                    className="ch2-track"
                    style={{ stroke: l.color }}
                  />
                  <path
                    ref={(el) => (pathRefs.current[i] = el)}
                    d={l.path}
                    pathLength="1"
                    className="ch2-path"
                    style={{ stroke: l.color }}
                  />
                  {pts[i].map(([x, y], k) => (
                    <g
                      key={k}
                      className={`ch2-stn ${i === active && k <= stop ? "is-lit" : ""}`}
                    >
                      <circle cx={x} cy={y} r="7" style={{ stroke: l.color }} />
                      {i === active && (
                        <text
                          className="ch2-lbl"
                          x={x + l.lbl[0]}
                          y={y + l.lbl[1]}
                          textAnchor={l.lbl[2]}
                        >
                          {l.stops[k]}
                        </text>
                      )}
                    </g>
                  ))}
                </g>
              ))}

              {/* interchange */}
              <circle cx={HUB[0]} cy={HUB[1]} r="34" className="ch2-hub-ring" />
              <circle cx={HUB[0]} cy={HUB[1]} r="31" className="ch2-hub" />
              <text
                x={HUB[0]}
                y={HUB[1] - 2}
                className="ch2-hub-t"
                textAnchor="middle"
              >
                Employee
              </text>
              <text
                x={HUB[0]}
                y={HUB[1] + 10}
                className="ch2-hub-t"
                textAnchor="middle"
              >
                record
              </text>

              {/* train */}
              <g ref={trainRef} className="ch2-train">
                <circle
                  r="13"
                  className="ch2-train-glow"
                  style={{ fill: line.color }}
                />
                <circle r="7.5" className="ch2-train-dot" />
              </g>
            </svg>
          </div>

          {/* RIGHT: copy + live stop board */}
          <div className="ch2-side">
            <div
              className="ch2-card"
              ref={cardRef}
              role="tabpanel"
              style={{ "--line": line.color }}
            >
              <span className="ch2-step">
                <span className="ch2-step-ic">
                  <Icon name={line.icon} size={14} />
                </span>
                {line.label}{" "}
                <em>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(METRO_LINES.length).padStart(2, "0")}
                </em>
              </span>
              <h3>
                {words.map(([w, hl], i) => (
                  <span key={`${active}-${i}`} className="ch2-tw">
                    <span className={hl ? "hl" : ""}>{w}</span>
                  </span>
                ))}
              </h3>
              <p>{line.desc}</p>
              <ol className="ch2-stops">
                {line.stops.map((s, k) => (
                  <li
                    key={s}
                    className={
                      k < stop ? "is-done" : k === stop ? "is-now" : ""
                    }
                  >
                    <i>{k < stop ? <Icon name="check" size={10} /> : k + 1}</i>
                    <span>{s}</span>
                    {k === stop && <em>Now</em>}
                  </li>
                ))}
              </ol>
              <div className="ch2-stat">
                <b>{line.stat[0]}</b>
                <span>{line.stat[1]}</span>
              </div>
            </div>
            <div className="ch2-actions">
              <a href="/contact-us" className="chr-btn primary">
                Get Started with NGriffinpay <Icon name="arrow" size={16} />
              </a>
              <div className="ch2-nav">
                <button
                  type="button"
                  aria-label="Previous module"
                  onClick={() => go(active - 1)}
                >
                  <span className="ch2-flip">
                    <Icon name="arrow" size={16} />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Next module"
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
    q: "What is Core HR in NGriffinpay?",
    a: "Core HR is the foundation of NGriffinpay. It keeps every employee’s personal, job, salary, bank and statutory details in one secure record, and that same record powers payroll, attendance, leave and every other module.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "core hr",
      "feature",
      "module",
      "foundation",
    ],
  },
  {
    q: "Can I import my existing employee data?",
    a: "Yes. You can bulk-upload employees from Excel or CSV using our ready template. The system checks for missing or duplicate details before importing, and our team can help you migrate during onboarding.",
    keys: [
      "import",
      "upload",
      "excel",
      "csv",
      "migrate",
      "migration",
      "existing data",
      "bulk",
      "spreadsheet",
    ],
  },
  {
    q: "Does it support multiple companies, locations and departments?",
    a: "Absolutely. You can set up multiple companies, branches, departments and teams with their own reporting lines. The org chart and approval routes update automatically whenever someone moves or a new team is created.",
    keys: [
      "multiple",
      "company",
      "companies",
      "location",
      "branch",
      "department",
      "team",
      "org chart",
      "hierarchy",
      "structure",
    ],
  },
  {
    q: "Can HR generate letters and manage policies?",
    a: "Yes. Offer, appointment, confirmation, experience and relieving letters are filled in from the employee record using your templates. You can also publish HR policies and track who has read and accepted them.",
    keys: [
      "letter",
      "offer",
      "appointment",
      "experience",
      "relieving",
      "template",
      "policy",
      "policies",
      "acknowledge",
      "e-sign",
    ],
  },
  {
    q: "Is employee data secure?",
    a: "Your data is encrypted, and role-based access means employees, managers and HR only see what they are allowed to. Every change to a record is logged with who made it and when, so you always have an audit trail.",
    keys: [
      "secure",
      "security",
      "safe",
      "privacy",
      "encrypt",
      "access",
      "permission",
      "role",
      "audit",
      "data protection",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about Core HR.";
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
      <div className="chq-row bot" ref={ref}>
        <span className="chq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="chq-bubble bot chq-typing"
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
      <div className="chq-row user" ref={ref}>
        <div className="chq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="chq-row bot" ref={ref}>
      <span className="chq-bot-av" aria-hidden>
        N
      </span>
      <div className="chq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="chq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function CoreHRFaqSection() {
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
      gsap.from(q(".chq-chat"), {
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
    <section className="chq" ref={sectionRef} aria-labelledby="chq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="chr-container chq-grid">
        <div className="chq-left">
          <span className="chq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="chq-title" className="chq-title js-faq-reveal">
            Core HR – <span className="chr-grad">FAQs</span>
          </h2>
          <p className="chq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="chq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`chq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="chq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="chq-q-text">{f.q}</span>
                  <span className="chq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="chq-chat">
          <div className="chq-chat-head">
            <span className="chq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="chq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="chq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="chq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="chq-suggest" aria-label="Suggested questions">
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

          <form className="chq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about records, imports or letters…"
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

export default function CoreHR() {
  return (
    <div className="chr-page">
      <HeroSection />
      <span id="chr-next" />
      <MetroMapSection />
      <CoreHRFaqSection />
    </div>
  );
}
