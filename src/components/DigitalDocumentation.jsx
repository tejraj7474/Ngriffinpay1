// DigitalDocumentation.jsx
// NGriffinpay — Product inner page: "Digital Employee Documentation"
// Section 1: Hero banner (live document vault on the left, content on the right)
// Section 2: 3D filing drawer (folders lift out and open live sheets)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DigitalDocumentation.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    verb: "Centralize",
    rest: "store all employee documents in one secure digital hub.",
    icon: "folder",
  },
  {
    verb: "Access",
    rest: "employee records instantly from anywhere, anytime.",
    icon: "search",
  },
  {
    verb: "Automate",
    rest: "document collection and updates during employee lifecycle events.",
    icon: "bolt",
  },
  {
    verb: "Secure",
    rest: "protect sensitive data with role-based access and audit trails.",
    icon: "shield",
  },
];

const STAGE_TIME = 5.5;

const FOLDERS = [
  { name: "Identity", count: 4, icon: "id" },
  { name: "Contracts", count: 3, icon: "file" },
  { name: "Payroll", count: 12, icon: "wallet" },
  { name: "Education", count: 2, icon: "cap" },
  { name: "Exit & Others", count: 1, icon: "folder" },
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
    case "folder":
      return (
        <svg {...p}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...p}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "id":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="M15 9h3M15 12h3M6 16h12" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 13h.01M2 10h20" />
        </svg>
      );
    case "cap":
      return (
        <svg {...p}>
          <path d="M22 10 12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
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
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "scan":
      return (
        <svg {...p}>
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...p}>
          <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 1 0 6 17h11.5" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 18h2" />
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
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
    case "upload":
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...p}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "tablet":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
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

// 1 — Centralize: scattered files fly into one hub
const SCATTER = [
  {
    name: "Offer_letter.pdf",
    from: "Email",
    icon: "mail",
    x: -150,
    y: -90,
    r: -14,
  },
  {
    name: "Aadhaar.jpg",
    from: "WhatsApp",
    icon: "chat",
    x: 150,
    y: -80,
    r: 12,
  },
  {
    name: "Degree_scan.pdf",
    from: "Paper scan",
    icon: "scan",
    x: -160,
    y: 70,
    r: 10,
  },
  {
    name: "Bank_proof.pdf",
    from: "Drive",
    icon: "cloud",
    x: 160,
    y: 80,
    r: -10,
  },
];

function CentralizePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    const files = q(".dde-sfile");
    const n = q(".js-total")[0];
    const o = { v: 1280 };
    tl.fromTo(
      files,
      {
        x: (i) => SCATTER[i].x,
        y: (i) => SCATTER[i].y,
        rotation: (i) => SCATTER[i].r,
        autoAlpha: 0,
        scale: 0.9,
      },
      { autoAlpha: 1, duration: 0.35, stagger: 0.12 },
      0.2,
    );
    tl.to(
      files,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: "power3.in",
      },
      1.1,
    );
    files.forEach((_, i) => {
      tl.fromTo(
        q(".dde-hub")[0],
        { scale: 1 },
        { scale: 1.07, duration: 0.12, yoyo: true, repeat: 1 },
        1.7 + i * 0.3,
      );
      tl.to(
        o,
        {
          v: 1281 + i,
          duration: 0.1,
          onUpdate: () =>
            n && (n.textContent = Math.round(o.v).toLocaleString("en-IN")),
        },
        1.7 + i * 0.3,
      );
    });
    tl.fromTo(
      q(".dde-hub-ok"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      3,
    );
  }, delay);

  return (
    <div className="dde-panel dde-center" ref={ref}>
      <div className="dde-stage-area">
        {SCATTER.map((f) => (
          <span className="dde-sfile" key={f.name}>
            <Icon name={f.icon} size={11} />
            <span>
              <b>{f.name}</b>
              <small>from {f.from}</small>
            </span>
          </span>
        ))}
        <div className="dde-hub js-in">
          <span className="dde-hub-ic">
            <Icon name="folder" size={26} />
          </span>
          <strong>
            <span className="js-total">1,280</span>
          </strong>
          <small>documents · one secure hub</small>
        </div>
      </div>
      <div className="dde-hub-ok">
        <Icon name="check" size={11} /> Auto-sorted into employee folders
      </div>
    </div>
  );
}

// 2 — Access: search → instant preview
function AccessPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    const input = q(".js-search")[0];
    const text = "Priya offer letter";
    const o = { n: 0 };
    tl.to(
      o,
      {
        n: text.length,
        duration: 0.9,
        ease: "none",
        onUpdate: () =>
          input && (input.textContent = text.slice(0, Math.round(o.n))),
      },
      0.3,
    );
    tl.fromTo(
      q(".dde-res"),
      { y: 8, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.3 },
      1.3,
    );
    tl.fromTo(
      q(".dde-res.hit"),
      { backgroundColor: "#ffffff" },
      { backgroundColor: "#eaf2fc", duration: 0.25 },
      1.9,
    );
    tl.fromTo(
      q(".dde-preview"),
      { y: 20, autoAlpha: 0, scale: 0.94 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
      2.2,
    );
    tl.fromTo(
      q(".dde-prev-lines i"),
      { scaleX: 0 },
      { scaleX: 1, stagger: 0.06, duration: 0.3 },
      2.4,
    );
    tl.fromTo(
      q(".dde-speed"),
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)" },
      2.9,
    );
  }, delay);

  return (
    <div className="dde-panel" ref={ref}>
      <div className="dde-search js-in">
        <Icon name="search" size={13} />
        <span>
          <span className="js-search" />
          <i className="dde-caret" />
        </span>
      </div>
      <ul className="dde-results">
        <li className="dde-res hit">
          <Icon name="file" size={12} />
          <b>Offer letter · Priya Sharma</b>
          <small>Contracts · PDF</small>
        </li>
        <li className="dde-res">
          <Icon name="file" size={12} />
          <b>Appointment letter · Priya Sharma</b>
          <small>Contracts · PDF</small>
        </li>
      </ul>
      <div className="dde-preview">
        <div className="dde-prev-head">
          <span className="dde-prev-ic">
            <Icon name="file" size={14} />
          </span>
          <div>
            <b>Offer_letter_Priya.pdf</b>
            <small>Signed · 12 Mar 2024 · 220 KB</small>
          </div>
          <span className="dde-prev-dl">
            <Icon name="download" size={12} />
          </span>
        </div>
        <div className="dde-prev-lines">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="dde-speed">
          <Icon name="phone" size={10} /> Opened in 0.4s · on mobile
        </span>
      </div>
    </div>
  );
}

// 3 — Automate: lifecycle events trigger documents
const LIFE = [
  { ev: "Joining", doc: "ID, bank & education proofs collected" },
  { ev: "Promotion", doc: "Promotion letter auto-generated" },
  { ev: "Address change", doc: "New address proof requested" },
  { ev: "Exit", doc: "Relieving & experience letters issued" },
];

function AutomatePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".dde-life-fill"),
      { scaleY: 0 },
      { scaleY: 1, duration: 2.4, ease: "none" },
      0.4,
    );
    q(".dde-life-item").forEach((it, i) => {
      const at = 0.4 + i * 0.65;
      tl.fromTo(
        it.querySelector(".dde-life-dot"),
        { backgroundColor: "#ffffff", scale: 1 },
        {
          backgroundColor: "#1d6fd8",
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        },
        at,
      );
      tl.fromTo(
        it.querySelector(".dde-life-doc"),
        { x: 16, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" },
        at + 0.1,
      );
      tl.fromTo(
        it.querySelector(".dde-life-ok"),
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "back.out(3)" },
        at + 0.4,
      );
    });
  }, delay);

  return (
    <div className="dde-panel" ref={ref}>
      <div className="dde-panel-head js-in">
        <Icon name="bolt" size={12} /> Lifecycle automation · Priya Sharma
      </div>
      <ol className="dde-life">
        <span className="dde-life-line">
          <i className="dde-life-fill" />
        </span>
        {LIFE.map((l) => (
          <li className="dde-life-item" key={l.ev}>
            <span className="dde-life-dot" />
            <div>
              <small>{l.ev}</small>
              <span className="dde-life-doc">
                <Icon name="file" size={11} /> {l.doc}
                <span className="dde-life-ok">
                  <Icon name="check" size={9} />
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// 4 — Secure: role-based locks + audit trail
const AUDIT = [
  { who: "HR Admin", what: "viewed PAN card", ok: true, t: "10:42" },
  { who: "Manager", what: "tried to open Salary slip", ok: false, t: "10:44" },
  { who: "Priya S.", what: "downloaded Offer letter", ok: true, t: "10:51" },
];

function SecurePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".dde-lockdoc .dde-lock"),
      { scale: 0, rotation: -30 },
      {
        scale: 1,
        rotation: 0,
        stagger: 0.2,
        duration: 0.4,
        ease: "back.out(2.5)",
      },
      0.4,
    );
    tl.fromTo(
      q(".dde-roles span"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.3 },
      0.9,
    );
    q(".dde-log").forEach((l, i) => {
      tl.fromTo(
        l,
        { x: -14, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" },
        1.5 + i * 0.45,
      );
    });
    tl.fromTo(
      q(".dde-enc"),
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
      3,
    );
  }, delay);

  return (
    <div className="dde-panel" ref={ref}>
      <div className="dde-docs js-in">
        {[
          ["PAN card", true],
          ["Salary slip", true],
          ["Offer letter", false],
        ].map(([d, locked]) => (
          <div className={`dde-doc ${locked ? "dde-lockdoc" : ""}`} key={d}>
            <span className="dde-doc-ic">
              <Icon name="file" size={14} />
            </span>
            <b>{d}</b>
            {locked && (
              <span className="dde-lock">
                <Icon name="lock" size={10} />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="dde-roles">
        <span>
          <Icon name="user" size={10} /> HR: full access
        </span>
        <span>
          <Icon name="user" size={10} /> Manager: limited
        </span>
        <span>
          <Icon name="user" size={10} /> Employee: own files
        </span>
      </div>
      <div className="dde-panel-head js-in">
        <Icon name="eye" size={12} /> Audit trail
      </div>
      <ul className="dde-logs">
        {AUDIT.map((a) => (
          <li className={`dde-log ${a.ok ? "" : "denied"}`} key={a.t}>
            <span className="dde-log-ic">
              <Icon name={a.ok ? "check" : "x"} size={9} />
            </span>
            <span>
              <b>{a.who}</b> {a.what}
              {a.ok ? "" : " · denied"}
            </span>
            <time>{a.t}</time>
          </li>
        ))}
      </ul>
      <div className="dde-enc">
        <Icon name="lock" size={11} /> AES-256 encrypted at rest &amp; in
        transit
      </div>
    </div>
  );
}

const PANELS = [CentralizePanel, AccessPanel, AutomatePanel, SecurePanel];

/* ------------------------------------------------------------------ */
/* Vault app (left side)                                               */
/* ------------------------------------------------------------------ */

function Vault({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

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
    <div className="dde-frame" ref={frameRef}>
      <div className="dde-chrome">
        <span className="dde-dot r" />
        <span className="dde-dot y" />
        <span className="dde-dot g" />
        <div className="dde-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/documents
        </div>
      </div>
      <div className="dde-app">
        <aside className="dde-side js-side">
          <div className="dde-emp">
            <span className="dde-av">PS</span>
            <div>
              <b>Priya Sharma</b>
              <small>EMP-0142 · Design</small>
            </div>
          </div>
          <small className="dde-side-label">Folders</small>
          <ul className="dde-folders">
            {FOLDERS.map((f, i) => (
              <li
                key={f.name}
                className={`dde-folder ${i === 0 ? "is-on" : ""}`}
              >
                <Icon name={f.icon} size={12} />
                <span>{f.name}</span>
                <em>{f.count}</em>
              </li>
            ))}
          </ul>
          <div className="dde-storage">
            <small>Storage</small>
            <span className="dde-storage-bar">
              <i />
            </span>
            <small>2.4 GB of 50 GB</small>
          </div>
        </aside>

        <div className="dde-main">
          <div
            className="dde-tabs js-tabs"
            role="tablist"
            aria-label="Document features"
          >
            {FEATURES.map((f, i) => (
              <button
                type="button"
                key={f.verb}
                className={stage === i ? "is-on" : ""}
                onClick={() => onSelect(i)}
                role="tab"
                aria-selected={stage === i}
              >
                <Icon name={f.icon} size={11} /> {f.verb}
              </button>
            ))}
          </div>
          <div className="dde-panel-wrap" ref={panelWrap}>
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
        q(".dde-folder"),
        { x: -10, opacity: 0, stagger: 0.06, duration: 0.35 },
        0.75,
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
      className="dde-hero"
      ref={sectionRef}
      aria-labelledby="dde-hero-title"
    >
      <div className="dde-hero-bg" aria-hidden>
        <span className="dde-blob b1 js-blob" />
        <span className="dde-blob b2 js-blob" />
        <span className="dde-grid-bg" />
      </div>

      <div className="dde-container dde-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="dde-content">
          <span className="dde-eyebrow js-reveal">
            <span className="dde-live-dot" /> Organized, accessible &amp; secure
            records
          </span>
          <h1 id="dde-hero-title" className="dde-title js-reveal">
            Digital Employee <span className="dde-grad">Documentation</span>
          </h1>

          <ul
            className="dde-feats"
            role="tablist"
            aria-label="Documentation features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.verb} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`dde-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="dde-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                  <span className="dde-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="dde-feat-txt">
                    <b>{f.verb}</b> {f.rest}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: document vault */}
        <div className="dde-visual" ref={visualRef}>
          <Vault frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="dde-float f1 js-float">
            <span className="dde-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>100% paperless</strong>
              <small>No more physical files</small>
            </div>
          </div>
          <div className="dde-float f2 js-float">
            <span className="dde-float-ic pr">
              <Icon name="lock" size={14} />
            </span>
            <div>
              <strong>Role-based access</strong>
              <small>Every view audit-logged</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — 3D filing drawer (folders lift out with live sheets)    */
/* ------------------------------------------------------------------ */

const DRAWER_HEADING = [
  ["Digitize", true],
  ["employee", false],
  ["records,", false],
  ["secure", true],
  ["sensitive", false],
  ["data,", false],
  ["and", false],
  ["simplify", true],
  ["document", false],
  ["access", false],
];

const DRAWER_TABS = [
  {
    label: "Paperless Document Storage",
    icon: "folder",
    title: [
      ["Go", true],
      ["fully", false],
      ["paperless", false],
      ["with secure storage", true],
    ],
    desc: "Store all employee documents digitally, eliminating physical paperwork while ensuring safety and easy retrieval.",
  },
  {
    label: "Employee Self-Upload",
    icon: "upload",
    title: [
      ["Enable", true],
      ["employee", false],
      ["self-upload", false],
    ],
    desc: "Allow employees to securely upload ID proofs, certificates, and other required documents directly from the portal or mobile app.",
  },
  {
    label: "Role-Based Access Control",
    icon: "user",
    title: [
      ["Control", true],
      ["access", false],
      ["with", false],
      ["roles", false],
    ],
    desc: "Grant document access based on user roles, ensuring sensitive files are visible only to authorized personnel.",
  },
  {
    label: "Encrypted & Compliant Storage",
    icon: "lock",
    title: [
      ["Keep", true],
      ["data", false],
      ["encrypted", false],
      ["& compliant", false],
    ],
    desc: "Protect employee data with enterprise-grade encryption and comply with legal document retention policies.",
  },
  {
    label: "Anytime, Anywhere Access",
    icon: "phone",
    title: [
      ["Access", true],
      ["anytime,", false],
      ["anywhere", false],
    ],
    desc: "Retrieve and manage employee records instantly from any device, enabling flexible and remote operations.",
  },
];

const DRAWER_TIME = 5.5;

// Paused timeline that plays when its folder is open; shows the final state otherwise
function useSheet(active, build) {
  const ref = useRef(null);
  const tlRef = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ paused: true });
      build(tl, q);
      tl.progress(1, false);
      tlRef.current = tl;
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (active && !prefersReduced()) tl.restart(true);
    else tl.progress(1, false).pause();
  }, [active]);
  return ref;
}

const numTween = (
  tl,
  el,
  from,
  to,
  at,
  dur = 1.2,
  fmt = (v) => Math.round(v).toLocaleString("en-IN"),
) => {
  const o = { v: from };
  tl.fromTo(
    o,
    { v: from },
    {
      v: to,
      duration: dur,
      ease: "power2.out",
      onUpdate: () => el && (el.textContent = fmt(o.v)),
    },
    at,
  );
};

/* ---------- Sheet 1: paperless ---------- */
function SheetPaperless({ active }) {
  const ref = useSheet(active, (tl, q) => {
    tl.fromTo(
      q(".ddw-pile i"),
      { scaleY: 1, autoAlpha: 1 },
      {
        scaleY: 0,
        autoAlpha: 0.2,
        stagger: { each: 0.08, from: "end" },
        duration: 0.4,
        ease: "power2.in",
      },
      0.6,
    );
    numTween(tl, q(".js-paper")[0], 1240, 0, 0.6, 1.4);
    tl.fromTo(
      q(".ddw-cloud-bar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: "power2.out" },
      0.6,
    );
    numTween(tl, q(".js-digital")[0], 0, 1240, 0.6, 1.4);
    tl.fromTo(
      q(".ddw-chip"),
      { y: 10, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.15,
        duration: 0.35,
        ease: "back.out(2)",
      },
      2.1,
    );
  });
  return (
    <div className="ddw-sheet-in" ref={ref}>
      <div className="ddw-pp">
        <div className="ddw-pp-col">
          <small>Paper files</small>
          <div className="ddw-pile">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <i key={i} />
            ))}
          </div>
          <b className="js-paper">0</b>
        </div>
        <span className="ddw-pp-arrow">
          <Icon name="arrow" size={18} />
        </span>
        <div className="ddw-pp-col">
          <small>Digital vault</small>
          <span className="ddw-cloud">
            <Icon name="cloud" size={28} />
          </span>
          <span className="ddw-cloud-bar">
            <i />
          </span>
          <b className="js-digital">1,240</b>
        </div>
      </div>
      <div className="ddw-chips">
        <span className="ddw-chip">
          <Icon name="check" size={10} /> 3 cabinets freed
        </span>
        <span className="ddw-chip">
          <Icon name="search" size={10} /> Found in 0.3s
        </span>
      </div>
    </div>
  );
}

/* ---------- Sheet 2: self-upload ---------- */
const UPLOADS = [
  ["Aadhaar card.jpg", "1.1 MB"],
  ["Degree certificate.pdf", "2.4 MB"],
  ["Experience letter.pdf", "640 KB"],
];

function SheetUpload({ active }) {
  const ref = useSheet(active, (tl, q) => {
    tl.fromTo(
      q(".ddw-drop"),
      { borderColor: "#c3dcf8", backgroundColor: "#f7f9fd" },
      {
        borderColor: "#1d6fd8",
        backgroundColor: "#eaf2fc",
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      },
      0.3,
    );
    q(".ddw-up").forEach((u, i) => {
      const at = 0.6 + i * 0.5;
      tl.fromTo(
        u,
        { x: -14, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.3 },
        at,
      );
      tl.fromTo(
        u.querySelector(".ddw-up-bar i"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: "power1.inOut" },
        at + 0.1,
      );
      tl.fromTo(
        u.querySelector(".ddw-up-ok"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
        at + 0.8,
      );
    });
    tl.fromTo(
      q(".ddw-verified"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 },
      2.5,
    );
  });
  return (
    <div className="ddw-sheet-in" ref={ref}>
      <div className="ddw-drop">
        <Icon name="upload" size={18} />
        <span>
          <b>Drop files or tap to upload</b>
          <small>From portal or mobile app</small>
        </span>
      </div>
      <ul className="ddw-ups">
        {UPLOADS.map(([n, s]) => (
          <li className="ddw-up" key={n}>
            <span className="ddw-up-ic">
              <Icon name="file" size={11} />
            </span>
            <div>
              <b>{n}</b>
              <span className="ddw-up-bar">
                <i />
              </span>
            </div>
            <small>{s}</small>
            <span className="ddw-up-ok">
              <Icon name="check" size={9} />
            </span>
          </li>
        ))}
      </ul>
      <span className="ddw-verified">
        <Icon name="check" size={10} /> Sent to HR for verification
      </span>
    </div>
  );
}

/* ---------- Sheet 3: role-based access matrix ---------- */
const MATRIX_ROLES = ["HR", "Manager", "Employee"];
const MATRIX = [
  ["Offer letter", [1, 1, 1]],
  ["Appraisal", [1, 1, 1]],
  ["Salary slip", [1, 0, 1]],
  ["PAN / Aadhaar", [1, 0, 1]],
  ["Disciplinary", [1, 0, 0]],
];

function SheetRoles({ active }) {
  const ref = useSheet(active, (tl, q) => {
    tl.fromTo(
      q(".ddw-mx-cell"),
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: { each: 0.05, grid: [5, 3], from: "start" },
        duration: 0.25,
        ease: "back.out(2.5)",
      },
      0.4,
    );
    tl.fromTo(
      q(".ddw-mx-row.sens"),
      { backgroundColor: "rgba(244,63,94,0)" },
      { backgroundColor: "rgba(244,63,94,0.06)", duration: 0.3 },
      1.4,
    );
    tl.fromTo(
      q(".ddw-mx-note"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 },
      1.8,
    );
  });
  return (
    <div className="ddw-sheet-in" ref={ref}>
      <div className="ddw-mx">
        <div className="ddw-mx-row head">
          <span>Document</span>
          {MATRIX_ROLES.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
        {MATRIX.map(([doc, acc]) => (
          <div
            className={`ddw-mx-row ${acc.includes(0) ? "sens" : ""}`}
            key={doc}
          >
            <span>{doc}</span>
            {acc.map((a, i) => (
              <span key={i} className={`ddw-mx-cell ${a ? "ok" : "no"}`}>
                <Icon name={a ? "check" : "lock"} size={10} />
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="ddw-mx-note">
        <Icon name="shield" size={10} /> Managers never see salary or ID files
      </span>
    </div>
  );
}

/* ---------- Sheet 4: encryption & compliance ---------- */
const PLAIN = ["Name: Priya Sharma", "PAN: ABCDE1234F", "Bank: HDFC ••••4821"];
const CIPHER = "▓░▒█▚▞▙▟#%&$@*";

function SheetEncrypt({ active }) {
  const ref = useSheet(active, (tl, q) => {
    const lines = q(".ddw-enc-line");
    const o = { p: 0 };
    tl.fromTo(
      o,
      { p: 0 },
      {
        p: 1,
        duration: 1.4,
        ease: "power1.inOut",
        onUpdate: () => {
          lines.forEach((el, li) => {
            const src = PLAIN[li];
            const k = Math.floor(o.p * src.length);
            let out = "";
            for (let i = 0; i < src.length; i++)
              out += i < k ? CIPHER[(i * 7 + li * 3) % CIPHER.length] : src[i];
            el.textContent = out;
          });
        },
      },
      0.6,
    );
    tl.fromTo(
      q(".ddw-enc-lock"),
      { scale: 0, rotation: -40 },
      { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.5)" },
      2,
    );
    tl.fromTo(
      q(".ddw-ret i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: "power2.out" },
      2.1,
    );
    tl.fromTo(
      q(".ddw-badge"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.3, ease: "back.out(2)" },
      2.4,
    );
  });
  return (
    <div className="ddw-sheet-in" ref={ref}>
      <div className="ddw-enc">
        <span className="ddw-enc-lock">
          <Icon name="lock" size={14} />
        </span>
        {PLAIN.map((l) => (
          <code className="ddw-enc-line" key={l}>
            {l}
          </code>
        ))}
        <small>AES-256 · encrypted at rest &amp; in transit</small>
      </div>
      <div className="ddw-ret">
        <span>
          <b>Retention policy</b>
          <small>Kept 8 years, then auto-purged</small>
        </span>
        <span className="ddw-ret-bar">
          <i />
        </span>
      </div>
      <div className="ddw-badges">
        <span className="ddw-badge">Audit trail</span>
        <span className="ddw-badge">Access logs</span>
        <span className="ddw-badge">Data backups</span>
      </div>
    </div>
  );
}

/* ---------- Sheet 5: any device ---------- */
function SheetDevices({ active }) {
  const ref = useSheet(active, (tl, q) => {
    tl.fromTo(
      q(".ddw-dev"),
      { y: 18, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.15,
        duration: 0.4,
        ease: "back.out(1.8)",
      },
      0.3,
    );
    tl.fromTo(
      q(".ddw-sync-dot"),
      { left: "8%", autoAlpha: 1 },
      {
        left: "92%",
        autoAlpha: 1,
        duration: 1.2,
        ease: "power1.inOut",
        stagger: 0.25,
      },
      1,
    );
    tl.to(q(".ddw-sync-dot"), { autoAlpha: 0, duration: 0.2 }, 2.4);
    tl.fromTo(
      q(".ddw-dev-ok"),
      { scale: 0 },
      { scale: 1, stagger: 0.1, duration: 0.3, ease: "back.out(3)" },
      2.2,
    );
    tl.fromTo(
      q(".ddw-loc"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.3 },
      2.5,
    );
  });
  return (
    <div className="ddw-sheet-in" ref={ref}>
      <div className="ddw-devs">
        <span className="ddw-sync-line">
          <i className="ddw-sync-dot" />
          <i className="ddw-sync-dot" />
        </span>
        {[
          ["monitor", "Office laptop"],
          ["tablet", "Tablet"],
          ["phone", "Mobile app"],
        ].map(([ic, n]) => (
          <div className="ddw-dev" key={n}>
            <span className="ddw-dev-ic">
              <Icon name={ic} size={20} />
              <i className="ddw-dev-ok">
                <Icon name="check" size={8} />
              </i>
            </span>
            <small>{n}</small>
          </div>
        ))}
      </div>
      <div className="ddw-open">
        <span className="ddw-up-ic">
          <Icon name="file" size={11} />
        </span>
        <span>
          <b>Offer_letter_Priya.pdf</b>
          <small>Same file, synced on every device</small>
        </span>
      </div>
      <div className="ddw-locs">
        <span className="ddw-loc">
          <Icon name="pin" size={10} /> Whitefield office
        </span>
        <span className="ddw-loc">
          <Icon name="pin" size={10} /> Working from home
        </span>
        <span className="ddw-loc">
          <Icon name="pin" size={10} /> Client site
        </span>
      </div>
    </div>
  );
}

const SHEETS = [
  SheetPaperless,
  SheetUpload,
  SheetRoles,
  SheetEncrypt,
  SheetDevices,
];

/* ---------- The drawer ---------- */
function Drawer({ active, onSelect, barRefs }) {
  const folderRefs = useRef([]);
  const prev = useRef(null);

  // The open folder rises out of the slot; the previous one slides back down
  useLayoutEffect(() => {
    const reduce = prefersReduced();
    folderRefs.current.forEach((el, i) => {
      if (!el) return;
      const open = { yPercent: 0, rotationX: 0, autoAlpha: 1, zIndex: 2 };
      const hidden = { yPercent: 105, rotationX: -8, autoAlpha: 0, zIndex: 1 };
      if (prev.current === null || reduce) {
        gsap.set(el, i === active ? open : hidden);
      } else if (i === active) {
        gsap.fromTo(el, hidden, {
          ...open,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.3)",
        });
      } else if (i === prev.current) {
        gsap.to(el, {
          ...hidden,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => gsap.set(el, { autoAlpha: 0 }),
        });
      } else {
        gsap.set(el, hidden);
      }
    });
    prev.current = active;
  }, [active]);

  return (
    <div className="ddw-drawer">
      <div className="ddw-slot">
        {DRAWER_TABS.map((t, i) => {
          const Sheet = SHEETS[i];
          return (
            <div
              className={`ddw-folder f${i}`}
              key={t.label}
              ref={(el) => (folderRefs.current[i] = el)}
              aria-hidden={active !== i}
            >
              <span className="ddw-folder-tab">
                <Icon name={t.icon} size={11} /> {t.label}
              </span>
              <div className="ddw-folder-body">
                <div className="ddw-sheet">
                  <div className="ddw-sheet-head">
                    <span className="ddw-sheet-ic">
                      <Icon name={t.icon} size={13} />
                    </span>
                    <b>{t.label}</b>
                    <small>Priya Sharma · EMP-0142</small>
                  </div>
                  <Sheet active={active === i} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Index tabs */}
      <div
        className="ddw-index"
        role="tablist"
        aria-label="Documentation features"
      >
        {DRAWER_TABS.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`ddw-tab ${active === i ? "is-active" : ""}`}
            onClick={() => onSelect(i)}
          >
            <span className="ddw-tab-ic">
              <Icon name={t.icon} size={13} />
            </span>
            <span className="ddw-tab-txt">{t.label}</span>
            <span className="ddw-tab-bar">
              <i ref={(el) => (barRefs.current[i] = el)} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
function DrawerSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const barRefs = useRef([]);
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
      const st = { trigger: q(".ddw-title")[0], start: "top 82%" };
      gsap.from(q(".ddw-hw"), {
        y: 24,
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: st,
      });
      // "Redacted" bars slide off the highlighted words
      gsap.fromTo(
        q(".ddw-redact"),
        { scaleX: 1 },
        {
          scaleX: 0,
          stagger: 0.18,
          duration: 0.6,
          ease: "power3.inOut",
          delay: 0.5,
          scrollTrigger: st,
        },
      );
      gsap.from(q(".ddw-drawer"), {
        y: 80,
        opacity: 0,
        rotationX: 14,
        transformPerspective: 1400,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".ddw-grid")[0], start: "top 80%" },
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

  useEffect(() => {
    autoRef.current?.kill();
    [...barRefs.current, ...chipBars.current].forEach(
      (b) => b && gsap.set(b, { scaleX: 0 }),
    );
    if (prefersReduced()) return;
    const targets = [barRefs.current[active], chipBars.current[active]].filter(
      Boolean,
    );
    autoRef.current = gsap.fromTo(
      targets.length ? targets : {},
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: DRAWER_TIME,
        ease: "none",
        onComplete: () => select((activeRef.current + 1) % DRAWER_TABS.length),
      },
    );
    syncPlay();
    return () => autoRef.current?.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (firstCopy.current) {
      firstCopy.current = false;
      return;
    }
    if (prefersReduced() || !copyRef.current) return;
    const q = gsap.utils.selector(copyRef);
    gsap.from(q(".ddw-tw > span"), {
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

  const t = DRAWER_TABS[active];
  const N = DRAWER_TABS.length;

  return (
    <section
      className="ddw"
      id="dde-next"
      ref={sectionRef}
      aria-labelledby="ddw-title"
    >
      <div className="dde-container">
        <h2 id="ddw-title" className="ddw-title">
          {DRAWER_HEADING.map(([w, hl], i) => (
            <span key={i} className={`ddw-hw ${hl ? "hl" : ""}`}>
              {w}
              {hl && <i className="ddw-redact" aria-hidden />}
            </span>
          ))}
        </h2>

        <div className="ddw-grid">
          <div onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
            <Drawer active={active} onSelect={select} barRefs={barRefs} />
          </div>

          <div
            className="ddw-copy"
            ref={copyRef}
            key={active}
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <span className="ddw-step js-fade">
              <span className="ddw-step-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}{" "}
              <em>
                0{active + 1} / 0{N}
              </em>
            </span>
            <h3>
              {t.title.map(([w, hl], i) => (
                <span key={i} className={`ddw-tw ${hl ? "hl" : ""}`}>
                  <span>{w}</span>
                </span>
              ))}
            </h3>
            <p className="js-fade">{t.desc}</p>
            <div className="ddw-actions js-fade">
              <a href="/contact" className="dde-btn primary">
                Book a Free Demo <Icon name="arrow" size={16} />
              </a>
              <div className="ddw-nav">
                <button
                  type="button"
                  onClick={() => select((active - 1 + N) % N)}
                  aria-label="Previous"
                >
                  <span className="ddw-flip">
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
    q: "What is the Digital Employee Documentation feature in NGriffinpay?",
    a: "NGriffinpay’s Digital Employee Documentation module allows organizations to securely store, manage, and retrieve all employee-related documents in a centralized, paperless environment—saving time and reducing administrative overhead.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "documentation",
      "paperless",
    ],
  },
  {
    q: "What types of documents can be stored?",
    a: "You can store employment contracts, ID proofs, certificates, policy acknowledgements, tax forms, performance reviews, and any other HR-related documents in digital format.",
    keys: [
      "type",
      "which document",
      "what document",
      "store",
      "contract",
      "certificate",
      "tax",
      "form 16",
      "review",
      "policy",
    ],
  },
  {
    q: "Can employees upload their own documents?",
    a: "Yes, employees can securely upload documents such as ID cards, bank details, and certifications directly through the portal or mobile app, with built-in verification workflows.",
    keys: [
      "upload",
      "self",
      "own",
      "employee upload",
      "bank",
      "verification",
      "verify",
      "aadhaar",
      "pan",
      "id card",
    ],
  },
  {
    q: "Is the documentation system secure?",
    a: "Absolutely. All files are encrypted in storage and during transmission, with role-based access controls ensuring that sensitive information is only visible to authorized users.",
    keys: [
      "secure",
      "security",
      "safe",
      "encrypt",
      "privacy",
      "role",
      "permission",
      "who can see",
      "protect",
    ],
  },
  {
    q: "Can documents be accessed remotely?",
    a: "Yes, authorized users can securely access documents anytime, anywhere, via the NGriffinpay web portal or mobile app, making remote work seamless and efficient.",
    keys: [
      "remote",
      "remotely",
      "anywhere",
      "anytime",
      "mobile",
      "app",
      "home",
      "online",
      "access",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about employee documents.";
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
      <div className="ddq-row bot" ref={ref}>
        <span className="ddq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="ddq-bubble bot ddq-typing"
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
      <div className="ddq-row user" ref={ref}>
        <div className="ddq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="ddq-row bot" ref={ref}>
      <span className="ddq-bot-av" aria-hidden>
        N
      </span>
      <div className="ddq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="ddq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function DocumentationFaqSection() {
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
      gsap.from(q(".ddq-chat"), {
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
    <section className="ddq" ref={sectionRef} aria-labelledby="ddq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="dde-container ddq-grid">
        <div className="ddq-left">
          <span className="ddq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="ddq-title" className="ddq-title js-faq-reveal">
            Digital Employee Documentation –{" "}
            <span className="dde-grad">FAQs</span>
          </h2>
          <p className="ddq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="ddq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`ddq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="ddq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="ddq-q-text">{f.q}</span>
                  <span className="ddq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ddq-chat">
          <div className="ddq-chat-head">
            <span className="ddq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="ddq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="ddq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="ddq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="ddq-suggest" aria-label="Suggested questions">
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

          <form className="ddq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about employee documents…"
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

export default function DigitalDocumentation() {
  return (
    <div className="dde-page">
      <HeroSection />
      <DrawerSection />
      <DocumentationFaqSection />
      {/* SECTION 4 — coming next */}
    </div>
  );
}
