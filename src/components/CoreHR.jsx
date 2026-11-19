// CoreHR.jsx
// NGriffinPay — Product inner page: "Core HR"
// Focus: Employee Documents · Offer / Appointment / Promotion / Relieving Letters · E-Signatures · Company Policies
// Section 1: Hero banner (live Core HR app on the left, content on the right)
// Section 2: HR Documents Metro Map (each letter / policy flow is a metro line through the employee file)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)
// Styles:   uses the existing CoreHR.css — no new classes needed.

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
    title: "Employee Documents",
    short: "Documents",
    desc: "A secure digital locker for every employee’s ID proofs, certificates and contracts — with expiry alerts.",
    icon: "file",
  },
  {
    title: "HR Letters in a Click",
    short: "Letters",
    desc: "Offer, appointment, promotion and relieving letters auto-filled from the employee record.",
    icon: "mail",
  },
  {
    title: "E-Signatures",
    short: "e-Sign",
    desc: "Get letters and contracts signed online in minutes — OTP-verified, with a full audit trail.",
    icon: "pen",
  },
  {
    title: "Company Policies",
    short: "Policies",
    desc: "Publish policies, track who has read and accepted them, and roll out updates with version history.",
    icon: "shield",
  },
];

const STAGE_TIME = 5.5;

const EMPLOYEES = [
  { av: "PS", name: "Priya Sharma", role: "Sr. Product Designer", tone: "a" },
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
    case "mail":
      return (
        <svg {...p}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      );
    case "pen":
      return (
        <svg {...p}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "award":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="6" />
          <path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8" />
        </svg>
      );
    case "trend":
      return (
        <svg {...p}>
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </svg>
      );
    case "exit":
      return (
        <svg {...p}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
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

// 1 — Employee Documents: digital locker, every document verified
const DOC_FIELDS = [
  { k: "Aadhaar card", v: "Verified", icon: "id" },
  { k: "PAN card", v: "Verified", icon: "id" },
  { k: "Degree certificate", v: "Verified", icon: "award" },
  { k: "Previous payslips", v: "3 files · Verified", icon: "wallet" },
  { k: "Bank proof", v: "Cancelled cheque", icon: "file" },
  { k: "Passport", v: "Expiry alert · Aug 2027", icon: "bell" },
];
const RING_R = 22;
const RING_C = 2 * Math.PI * RING_R;
function DocumentsPanel({ delay }) {
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
          <small>Sr. Product Designer · Joined 12 Mar 2023</small>
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
            <small>verified</small>
          </span>
        </div>
      </div>
      <div className="chr-ptabs js-in">
        <span>Overview</span>
        <span>Job</span>
        <span>Letters</span>
        <span className="is-on">Documents</span>
      </div>
      <div className="chr-fields">
        {DOC_FIELDS.map((f) => (
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
        <Icon name="lock" size={12} /> Encrypted locker · employees upload from
        their phone
      </div>
    </div>
  );
}

// 2 — HR Letters: offer → appointment → promotion → relieving
const LETTERS = [
  {
    t: "Offer letter",
    d: "05 Feb 2023",
    note: "₹78,000 / month · accepted",
    tone: "b",
    badge: "Signed",
    bIcon: "check",
  },
  {
    t: "Appointment letter",
    d: "12 Mar 2023",
    note: "6-month probation · terms agreed",
    tone: "c",
    badge: "Signed",
    bIcon: "check",
  },
  {
    t: "Promotion letter",
    d: "01 Apr 2026",
    note: "Senior Designer · ₹78k → ₹92k",
    tone: "a",
    badge: "Sent",
    bIcon: "send",
  },
  {
    t: "Relieving letter",
    d: "On exit",
    note: "Auto-drafted once F&F is settled",
    tone: "d",
    badge: "Ready",
    bIcon: "file",
  },
];
function LettersPanel({ delay }) {
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
        <Icon name="mail" /> Priya’s letters{" "}
        <em className="chr-tag">Auto-filled</em>
      </div>
      <div className="chr-life">
        <span className="chr-life-line">
          <i />
        </span>
        {LETTERS.map((e) => (
          <div key={e.t} className="chr-ev">
            <span className={`chr-ev-dot ${e.tone}`} />
            <div className="chr-ev-txt">
              <b>{e.t}</b>
              <small>
                {e.d} · {e.note}
              </small>
            </div>
            <span className="chr-ev-sync">
              <Icon name={e.bIcon} size={10} /> {e.badge}
            </span>
          </div>
        ))}
      </div>
      <div className="chr-next">
        <span className="chr-next-ic">
          <Icon name="star" size={13} />
        </span>
        <div>
          <b>Any HR letter in about 30 seconds</b>
          <small>Name, role, CTC and dates fill in from the record</small>
        </div>
      </div>
    </div>
  );
}

// 3 — E-Signatures: signature draws itself, signers tick off
const SIGNERS = [
  { k: "1 · Priya Sharma", v: "Signed · OTP verified", icon: "user" },
  { k: "2 · Deepa N. (HR)", v: "Countersigned", icon: "users" },
  { k: "3 · Sanjay N. (CEO)", v: "Approved", icon: "award" },
  { k: "Audit trail", v: "Time · IP · device", icon: "lock" },
];
const SIGN_BOX = {
  border: "1px dashed rgba(29,111,216,0.45)",
  background: "rgba(29,111,216,0.06)",
  borderRadius: 12,
  padding: "8px 12px 6px",
  margin: "10px 0",
};
function ESignPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".chr-sign-path"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" },
      0.35,
    );
    tl.from(q(".chr-sign-meta"), { autoAlpha: 0, y: 6, duration: 0.3 }, 1.6);
    tl.from(
      q(".chr-field"),
      { autoAlpha: 0, y: 10, stagger: 0.12, duration: 0.3 },
      1.7,
    );
    q(".chr-field-ok").forEach((el, i) =>
      tl.from(
        el,
        { scale: 0, duration: 0.25, ease: "back.out(2.6)" },
        1.9 + i * 0.12,
      ),
    );
    tl.from(q(".chr-due"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.5);
  }, delay);

  return (
    <div className="chr-panel" ref={ref}>
      <div className="chr-head js-in">
        <Icon name="pen" /> e-Sign · Appointment letter{" "}
        <em className="chr-tag">OTP verified</em>
      </div>
      <div className="js-in" style={SIGN_BOX}>
        <svg
          viewBox="0 0 220 56"
          width="100%"
          height="48"
          role="img"
          aria-label="Priya Sharma's signature"
        >
          <path
            className="chr-sign-path"
            d="M8 40 C20 8 36 8 30 36 S44 50 54 28 C60 16 68 16 64 32 C61 44 74 44 82 28 C88 16 97 18 94 34 C92 46 108 42 116 26 C122 14 131 16 128 32 C126 44 142 42 150 28 L160 20 C170 12 179 28 168 38 C160 46 188 38 212 24"
            fill="none"
            stroke="#1d6fd8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
        <small className="chr-sign-meta" style={{ display: "block" }}>
          Signed by Priya Sharma · 12 Mar 2023, 10:42 AM
        </small>
      </div>
      <div className="chr-fields">
        {SIGNERS.map((f) => (
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
      <div className="chr-due">
        <Icon name="file" size={12} /> Signed PDF filed to Priya’s documents
        automatically
      </div>
    </div>
  );
}

// 4 — Company Policies: publish, acknowledge, track
const POLICIES = [
  { name: "POSH policy", v: 100 },
  { name: "Code of conduct", v: 96 },
  { name: "Leave policy 2026", v: 88 },
];
const POLICY_TOOLS = ["Versions", "e-Accept", "Read log", "Reminders"];
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
        <Icon name="shield" /> Company policies{" "}
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
      <small className="chr-sub js-in">Acknowledgement tools</small>
      <div className="chr-stats">
        {POLICY_TOOLS.map((s) => (
          <span key={s} className="chr-stat">
            <Icon name="check" size={10} /> {s}
          </span>
        ))}
      </div>
      <div className="chr-due">
        <Icon name="bell" size={12} /> 30 people yet to accept Leave policy 2026
        · reminder sent
      </div>
    </div>
  );
}

const PANELS = [DocumentsPanel, LettersPanel, ESignPanel, PolicyPanel];

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
          <span aria-hidden>🔒</span> app.ngriffinpay.in/core-hr/documents
        </div>
      </div>

      <div className="chr-topbar js-top">
        <span className="chr-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay" />
        </span>
        <b>Admin</b>
        <span className="chr-search">
          <Icon name="search" size={12} /> Search employees, letters, policies…
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
            <span className="chr-live-dot" /> Paperless HR, from offer letter to
            exit
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
              <strong>1,480 documents · 100% verified</strong>
              <small>No more paper files</small>
            </div>
          </div>
          <div className="chr-float f2 js-float">
            <span className="chr-float-ic pr">
              <Icon name="pen" size={14} />
            </span>
            <div>
              <strong>Offer letter e-signed</strong>
              <small>4 minutes after sending</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — HR Documents Metro Map (every flow runs through one file) */
/* ------------------------------------------------------------------ */

const METRO_HEADING = [
  ["Create", true],
  ["every"],
  ["HR"],
  ["letter,"],
  ["collect", true],
  ["e-signatures"],
  ["and", true],
  ["keep"],
  ["every"],
  ["document"],
  ["in"],
  ["one"],
  ["place"],
];

// Each tab = one metro line. Every line runs through the central "Employee file" interchange.
// path: SVG path in a 640 x 420 map · at: where the 4 stops sit along the line (0–1)
// lbl: label offset for this line's stops [dx, dy, text-anchor]
const METRO_LINES = [
  {
    label: "Offer Letter",
    icon: "mail",
    color: "#1d6fd8",
    path: "M40 210 H600",
    at: [0.04, 0.3, 0.7, 0.96],
    lbl: [0, -16, "middle"],
    stops: [
      "Candidate selected",
      "CTC auto-filled",
      "Sent for e-Sign",
      "Offer accepted",
    ],
    title: [
      ["Send", true],
      ["offer letters"],
      ["candidates sign", false],
      ["the same day", true],
    ],

    stat: ["2 min", "to roll out an offer"],
  },
  {
    label: "Appointment Letter",
    icon: "id",
    color: "#10b981",
    path: "M70 60 H170 L320 210 L470 360 H590",
    at: [0.03, 0.3, 0.7, 0.97],
    lbl: [0, -16, "middle"],
    stops: [
      "Joining confirmed",
      "Terms & probation",
      "Employee e-Signs",
      "Saved to file",
    ],
    title: [["Issue", true], ["appointment letters"], ["on day one", true]],

    stat: ["Day 1", "appointment letters issued"],
  },
  {
    label: "Promotion Letter",
    icon: "trend",
    color: "#38bdf8",
    path: "M320 25 V395",
    at: [0.04, 0.3, 0.7, 0.96],
    lbl: [14, 4, "start"],
    stops: [
      "Appraisal approved",
      "New role & CTC",
      "Manager sign-off",
      "Payroll updated",
    ],
    title: [
      ["Celebrate", true],
      ["promotions"],
      ["without the paperwork", true],
    ],

    stat: ["0", "manual salary revisions"],
  },
  {
    label: "Relieving Letter",
    icon: "exit",
    color: "#f59e0b",
    path: "M570 60 H470 L320 210 L170 360 H60",
    at: [0.03, 0.3, 0.7, 0.97],
    lbl: [0, -16, "middle"],
    stops: [
      "Resignation accepted",
      "Exit clearance",
      "F&F settled",
      "Relieving letter",
    ],
    title: [["Close", true], ["every exit"], ["on a good note", true]],

    stat: ["24 hrs", "from F&F to relieving letter"],
  },
  {
    label: "Company Policies",
    icon: "shield",
    color: "#a78bfa",
    path: "M200 120 H440 Q480 120 480 160 V260 Q480 300 440 300 H200 Q160 300 160 260 V160 Q160 120 200 120 Z",
    at: [0, 0.25, 0.5, 0.75],
    lbl: [0, -14, "middle"],
    stops: [
      "Draft policy",
      "Publish to teams",
      "Read & accept",
      "Track compliance",
    ],
    title: [
      ["Roll out", true],
      ["policies everyone"],
      ["actually reads", true],
    ],

    stat: ["100%", "acknowledgement tracking"],
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
          aria-label="HR letters and policies"
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
                <Icon name="file" size={14} /> HR documents network
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
                file
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
                Get Started with NGriffinPay <Icon name="arrow" size={16} />
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
    q: "What is Core HR in NGriffinPay?",
    a: "Core HR is the foundation of NGriffinPay. It keeps every employee’s personal, job, salary and statutory details in one secure record — and uses that record to store documents, generate HR letters, collect e-signatures and roll out company policies, all in sync with payroll, attendance and leave.",
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
    q: "How does NGriffinPay manage employee documents?",
    a: "Every employee gets a secure digital locker for Aadhaar, PAN, bank proof, education and experience certificates, previous payslips and signed letters. Employees can upload their own documents from the self-service app, HR verifies them in one click, and you get alerts before passports, visas or contracts expire. Existing files can be bulk-uploaded during onboarding.",
    keys: [
      "document",
      "documents",
      "locker",
      "upload",
      "aadhaar",
      "pan",
      "certificate",
      "proof",
      "expiry",
      "storage",
      "bulk",
      "paperless",
    ],
  },
  {
    q: "Which HR letters can I generate?",
    a: "Offer, appointment, confirmation, promotion, increment, transfer, relieving and experience letters — plus any custom letter you need. Pick a template and the employee’s name, designation, CTC, joining date and manager fill in automatically from their record, so a letter is ready in about 30 seconds.",
    keys: [
      "letter",
      "letters",
      "offer",
      "appointment",
      "promotion",
      "increment",
      "relieving",
      "experience",
      "confirmation",
      "transfer",
      "generate",
    ],
  },
  {
    q: "Can I use my own templates and company letterhead?",
    a: "Yes. Upload your existing Word templates or start from ours, add your logo, letterhead and authorised signatory, and insert fields like employee name, designation and CTC. Every template keeps a version history, so letters always follow your latest format.",
    keys: [
      "template",
      "templates",
      "letterhead",
      "logo",
      "format",
      "customise",
      "customize",
      "word",
      "branding",
      "own",
    ],
  },
  {
    q: "Are e-signatures legally valid in India?",
    a: "Electronic signatures are recognised under India’s Information Technology Act, 2000, and are widely used for offer and appointment letters. NGriffinPay verifies each signer with an OTP and records the time, IP address and device in a tamper-evident audit trail. For documents that legally need stamp duty or a physical signature, check with your legal advisor.",
    keys: [
      "e-sign",
      "esign",
      "signature",
      "signatures",
      "signing",
      "legal",
      "valid",
      "otp",
      "it act",
      "digital sign",
    ],
  },
  {
    q: "How do company policies and acknowledgements work?",
    a: "Publish policies like leave, code of conduct, POSH or work-from-home to everyone or to selected teams. Employees read and accept them in the app, you see live acknowledgement percentages, and reminders go automatically to anyone who hasn’t accepted yet. New joiners get the current policies on day one, and every update is versioned.",
    keys: [
      "policy",
      "policies",
      "acknowledge",
      "acknowledgement",
      "handbook",
      "posh",
      "code of conduct",
      "accept",
      "compliance",
      "rules",
    ],
  },
  {
    q: "Is employee data and documents secure?",
    a: "Records and documents are encrypted, and role-based access means employees, managers and HR only see what they’re allowed to. Every view, download, signature and change is logged with who did it and when, so you always have a complete audit trail.",
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
  "Hi there! 👋 I'm Griffy. Pick a question or type your own about documents, HR letters, e-signatures or policies.";
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
                  cta: {
                    label: "Experience NGriffinPay - Book a Demo",
                    href: "/contact-us",
                  },
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
              placeholder="Ask about documents, letters, e-sign or policies…"
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
