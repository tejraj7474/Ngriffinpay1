// EmployeeOnboarding.jsx
// NGriffinpay — Product inner page: "Seamless Employee Onboarding"
// Section 1: Hero banner (live onboarding app on the left, content on the right)
// Section 2: Onboarding journey (step tabs + live feature card)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EmployeeOnboarding.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Paperless Process",
    desc: "Digitally collect documents and complete onboarding forms with zero paperwork.",
  },
  {
    title: "Automated Workflows",
    desc: "Trigger role-based workflows that guide HR, managers, and new hires smoothly.",
  },
  {
    title: "Faster Joiner Setup",
    desc: "Create employee profiles, assign assets, and complete orientation in no time.",
  },
  {
    title: "Engaging Experience",
    desc: "Deliver a welcoming and informative experience that strengthens retention from day one.",
  },
];

const STAGE_TIME = 5.5; // seconds each service stays on screen
const STAGE_PCT = [45, 70, 90, 100]; // onboarding % shown in the ring per stage
const STEPS = [
  "Offer accepted",
  "Documents",
  "Workflows",
  "Joiner setup",
  "Day-1 welcome",
];

const DOCS = [
  { name: "Offer letter (e-signed)", meta: "PDF · 220 KB" },
  { name: "PAN card", meta: "JPG · 1.1 MB" },
  { name: "Aadhaar card", meta: "PDF · 640 KB" },
  { name: "Bank details", meta: "Form · auto-filled" },
  { name: "Education certificates", meta: "PDF · 2.4 MB" },
];

const FLOW = [
  { role: "HR", task: "Welcome email & policy pack sent", icon: "mail" },
  { role: "Manager", task: "30-60-90 day goals assigned", icon: "users" },
  { role: "IT", task: "Laptop & system access requested", icon: "laptop" },
  { role: "Finance", task: "Added to the next payroll cycle", icon: "wallet" },
];

const ASSETS = [
  { label: "Laptop", value: "MacBook Air M3", icon: "laptop" },
  { label: "Work email", value: "ananya.rao@company.in", icon: "mail" },
  { label: "Access card", value: "Floor 4 · Whitefield", icon: "card" },
];

const AGENDA = [
  { time: "9:30 AM", text: "Welcome coffee with the team", icon: "coffee" },
  { time: "11:00 AM", text: "Meet your manager, Rahul M.", icon: "users" },
  {
    time: "2:00 PM",
    text: "Product walkthrough & tools setup",
    icon: "laptop",
  },
];

const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;

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
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
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
    case "mail":
      return (
        <svg {...p}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
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
          <rect x="4" y="4" width="16" height="11" rx="2" />
          <path d="M2 20h20" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 13h.01M2 10h20" />
        </svg>
      );
    case "card":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M6 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M15 10h3M15 13h3" />
        </svg>
      );
    case "coffee":
      return (
        <svg {...p}>
          <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
          <path d="M6 2v2M10 2v2M14 2v2" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...p}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...p}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
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
    case "book":
      return (
        <svg {...p}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
          <path d="M4 19.5V21h16" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...p}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
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
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "route":
      return (
        <svg {...p}>
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="5" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "grad":
      return (
        <svg {...p}>
          <path d="M22 10 12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "sync":
      return (
        <svg {...p}>
          <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8" />
          <path d="M21 3v5h-5M3 21v-5h5" />
        </svg>
      );
    case "trend":
      return (
        <svg {...p}>
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </svg>
      );
    case "gear":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      );
    case "award":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Stage panels (right side of the app)                                */
/* ------------------------------------------------------------------ */

// 1 — Paperless Process
function DocsPanel({ delay }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const rows = q(".eob-doc");
      const tl = gsap.timeline({ delay });
      tl.from(rows, {
        y: 12,
        opacity: 0,
        stagger: 0.07,
        duration: 0.4,
        ease: "power2.out",
      });
      rows.forEach((row, i) => {
        tl.fromTo(
          row.querySelector(".eob-doc-bar i"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power1.inOut" },
          0.35 + i * 0.5,
        );
        tl.to(
          row.querySelector(".eob-doc-state.up"),
          { autoAlpha: 0, duration: 0.15 },
          ">",
        );
        tl.fromTo(
          row.querySelector(".eob-doc-state.ok"),
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" },
          "<",
        );
        tl.to(
          row,
          { backgroundColor: "rgba(16,185,129,0.07)", duration: 0.3 },
          "<",
        );
      });
      tl.fromTo(
        q(".eob-paper"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
      );
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="eob-panel" ref={ref}>
      <div className="eob-panel-head">
        <h5>Document collection</h5>
        <span className="eob-chip">
          <Icon name="leaf" size={11} /> Paperless
        </span>
      </div>
      <ul className="eob-docs">
        {DOCS.map((d) => (
          <li className="eob-doc" key={d.name}>
            <span className="eob-doc-ic">
              <Icon name="file" size={14} />
            </span>
            <div className="eob-doc-main">
              <strong>{d.name}</strong>
              <small>{d.meta}</small>
              <span className="eob-doc-bar">
                <i />
              </span>
            </div>
            <span className="eob-doc-states">
              <span className="eob-doc-state up">Uploading…</span>
              <span className="eob-doc-state ok">
                <Icon name="check" size={11} /> Verified
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="eob-paper">
        <Icon name="leaf" size={13} /> 0 sheets of paper used
      </div>
    </div>
  );
}

// 2 — Automated Workflows
function FlowPanel({ delay }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const nodes = q(".eob-node");
      const tasks = q(".eob-task");
      const tl = gsap.timeline({ delay });
      tl.from(nodes, {
        scale: 0.4,
        opacity: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: "back.out(2)",
      });
      tl.from(q(".eob-trigger"), { y: -8, opacity: 0, duration: 0.4 }, "<0.1");
      tl.fromTo(
        q(".eob-flow-fill"),
        { scaleX: 0 },
        { scaleX: 1, duration: 2.6, ease: "none" },
        0.7,
      );
      nodes.forEach((node, i) => {
        const at = 0.7 + i * (2.6 / (nodes.length - 1 || 1));
        tl.call(() => node.classList.add("is-on"), null, at);
        tl.fromTo(
          node,
          { scale: 1 },
          {
            scale: 1.12,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
          },
          at,
        );
        tl.fromTo(
          tasks[i],
          { x: -14, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" },
          at,
        );
        tl.fromTo(
          tasks[i].querySelector(".eob-task-tick"),
          { scale: 0 },
          { scale: 1, duration: 0.35, ease: "back.out(3)" },
          at + 0.35,
        );
      });
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="eob-panel" ref={ref}>
      <div className="eob-panel-head">
        <h5>Role-based workflow</h5>
        <span className="eob-chip">
          <Icon name="bolt" size={11} /> Automated
        </span>
      </div>
      <div className="eob-trigger">
        <Icon name="sparkles" size={12} /> Trigger: <b>Offer accepted</b> →
        workflow started
      </div>
      <div className="eob-flow">
        <span className="eob-flow-track">
          <i className="eob-flow-fill" />
        </span>
        {FLOW.map((f) => (
          <div className="eob-node" key={f.role}>
            <span className="eob-node-ic">
              <Icon name={f.icon} size={15} />
            </span>
            <small>{f.role}</small>
          </div>
        ))}
      </div>
      <ul className="eob-tasks">
        {FLOW.map((f) => (
          <li className="eob-task" key={f.role}>
            <span className="eob-task-role">{f.role}</span>
            <span className="eob-task-text">{f.task}</span>
            <span className="eob-task-tick">
              <Icon name="check" size={11} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 3 — Faster Joiner Setup
function SetupPanel({ delay }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const idEl = q(".eob-empid")[0];
      const modEl = q(".eob-mod-count")[0];
      const target = "EMP-0249";
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
      const scramble = { p: 0 };
      const mods = { n: 0 };

      const tl = gsap.timeline({ delay });
      tl.from(q(".eob-idcard"), {
        y: 14,
        opacity: 0,
        duration: 0.45,
        ease: "power3.out",
      });
      tl.to(
        scramble,
        {
          p: 1,
          duration: 1.1,
          ease: "none",
          onUpdate: () => {
            const shown = Math.floor(scramble.p * target.length);
            let out = target.slice(0, shown);
            for (let i = shown; i < target.length; i++) {
              out +=
                target[i] === "-"
                  ? "-"
                  : chars[Math.floor(Math.random() * chars.length)];
            }
            idEl.textContent = out;
          },
          onComplete: () => (idEl.textContent = target),
        },
        "<0.1",
      );
      tl.from(
        q(".eob-idcard-meta span"),
        { opacity: 0, y: 6, stagger: 0.08, duration: 0.3 },
        "<0.4",
      );
      tl.from(
        q(".eob-asset"),
        {
          x: 24,
          opacity: 0,
          stagger: 0.18,
          duration: 0.45,
          ease: "power3.out",
        },
        ">-0.1",
      );
      tl.fromTo(
        q(".eob-asset-badge"),
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          stagger: 0.18,
          duration: 0.35,
          ease: "back.out(2.5)",
        },
        "<0.3",
      );
      tl.fromTo(
        q(".eob-orient-bar i"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.3, ease: "power1.inOut" },
        ">-0.2",
      );
      tl.to(
        mods,
        {
          n: 4,
          duration: 1.3,
          ease: "power1.inOut",
          onUpdate: () => (modEl.textContent = Math.round(mods.n)),
        },
        "<",
      );
      tl.fromTo(
        q(".eob-orient-done"),
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" },
      );
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="eob-panel" ref={ref}>
      <div className="eob-panel-head">
        <h5>Joiner setup</h5>
        <span className="eob-chip">
          <Icon name="bolt" size={11} /> Done in minutes
        </span>
      </div>

      <div className="eob-idcard">
        <span className="eob-idcard-ic">
          <Icon name="id" size={18} />
        </span>
        <div>
          <small>Employee profile created</small>
          <strong className="eob-empid">EMP-0000</strong>
          <div className="eob-idcard-meta">
            <span>Design</span>
            <span>Whitefield</span>
            <span>Reports to Rahul M.</span>
          </div>
        </div>
      </div>

      <ul className="eob-assets">
        {ASSETS.map((a) => (
          <li className="eob-asset" key={a.label}>
            <span className="eob-asset-ic">
              <Icon name={a.icon} size={14} />
            </span>
            <div>
              <small>{a.label}</small>
              <strong>{a.value}</strong>
            </div>
            <span className="eob-asset-badge">Assigned</span>
          </li>
        ))}
      </ul>

      <div className="eob-orient">
        <div className="eob-orient-head">
          <span>
            <Icon name="book" size={12} /> Orientation modules
          </span>
          <b>
            <span className="eob-mod-count">0</span>/4
          </b>
          <span className="eob-orient-done">
            <Icon name="check" size={10} />
          </span>
        </div>
        <span className="eob-orient-bar">
          <i />
        </span>
      </div>
    </div>
  );
}

// 4 — Engaging Experience
function WelcomePanel({ delay }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay });
      tl.from(q(".eob-welcome"), {
        y: 18,
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.6)",
      });
      tl.fromTo(
        q(".eob-confetti"),
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 },
        {
          x: () => gsap.utils.random(-170, 170),
          y: () => gsap.utils.random(-110, 70),
          rotation: () => gsap.utils.random(-540, 540),
          opacity: 0,
          scale: () => gsap.utils.random(0.6, 1.3),
          duration: 1.7,
          ease: "power3.out",
          stagger: 0.01,
        },
        "<0.25",
      );
      tl.from(q(".eob-buddy"), { y: 12, opacity: 0, duration: 0.4 }, "<0.2");
      tl.from(
        q(".eob-agenda li"),
        {
          x: -14,
          opacity: 0,
          stagger: 0.15,
          duration: 0.4,
          ease: "power3.out",
        },
        ">-0.1",
      );
      tl.from(
        q(".eob-react"),
        { scale: 0, stagger: 0.1, duration: 0.35, ease: "back.out(3)" },
        ">-0.1",
      );
      q(".eob-react b").forEach((el) => {
        const o = { n: 0 };
        tl.to(
          o,
          {
            n: +el.dataset.n,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => (el.textContent = Math.round(o.n)),
          },
          "<",
        );
      });
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="eob-panel" ref={ref}>
      <div className="eob-welcome">
        <div className="eob-confetti-wrap" aria-hidden>
          {Array.from({ length: 22 }, (_, i) => (
            <i className="eob-confetti" key={i} />
          ))}
        </div>
        <small>Day 1 · Monday, 3 Nov</small>
        <strong>Welcome aboard, Ananya! 🎉</strong>
        <span>Your desk, laptop and team are ready for you.</span>
      </div>

      <div className="eob-buddy">
        <span className="eob-av sm alt">KV</span>
        <div>
          <strong>Karthik V.</strong>
          <small>Your onboarding buddy</small>
        </div>
        <span className="eob-wave">Say hi 👋</span>
      </div>

      <ul className="eob-agenda">
        {AGENDA.map((a) => (
          <li key={a.time}>
            <span className="eob-agenda-ic">
              <Icon name={a.icon} size={12} />
            </span>
            <b>{a.time}</b>
            <span>{a.text}</span>
          </li>
        ))}
      </ul>

      <div className="eob-reacts">
        <span className="eob-react">
          🎉 <b data-n="12">0</b>
        </span>
        <span className="eob-react">
          👏 <b data-n="8">0</b>
        </span>
        <span className="eob-react">
          ❤️ <b data-n="5">0</b>
        </span>
        <small>Team reactions</small>
      </div>
    </div>
  );
}

const PANELS = [DocsPanel, FlowPanel, SetupPanel, WelcomePanel];

/* ------------------------------------------------------------------ */
/* Onboarding app mockup (left side)                                   */
/* ------------------------------------------------------------------ */

function OnboardingApp({ frameRef, stage, onSelect }) {
  const ringRef = useRef(null);
  const pctRef = useRef(null);
  const pct = useRef({ v: 0 });
  const firstRun = useRef(true);
  const stageRef = useRef(null);

  // Progress ring follows the stage
  useEffect(() => {
    const isFirst = firstRun.current;
    firstRun.current = false;
    const tw = gsap.to(pct.current, {
      v: STAGE_PCT[stage],
      duration: 1.2,
      delay: isFirst ? 1.1 : 0.1,
      ease: "power2.out",
      onUpdate: () => {
        const v = pct.current.v;
        if (pctRef.current) pctRef.current.textContent = `${Math.round(v)}%`;
        if (ringRef.current)
          ringRef.current.style.strokeDashoffset = RING_C * (1 - v / 100);
      },
    });
    return () => tw.kill();
  }, [stage]);

  // Panel enter transition
  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current.firstElementChild;
    if (el)
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
  }, [stage]);

  const Panel = PANELS[stage];
  const startDelay = firstRun.current ? 1.2 : 0.2;

  return (
    <div className="eob-frame" ref={frameRef}>
      <div className="eob-chrome">
        <span className="eob-dot r" />
        <span className="eob-dot y" />
        <span className="eob-dot g" />
        <div className="eob-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/onboarding
        </div>
        <div className="eob-live">
          <span className="eob-live-dot" /> Live
        </div>
      </div>

      <div className="eob-app">
        <div className="eob-topbar js-top">
          <div>
            <strong>Onboarding</strong>
            <small>New joiners · November</small>
          </div>
          <div className="eob-topbar-right">
            <span className="eob-avs" aria-label="4 joining this week">
              <i>AR</i>
              <i>SK</i>
              <i>MJ</i>
              <i>+1</i>
            </span>
            <span className="eob-count">
              <Icon name="calendar" size={11} /> 4 joining this week
            </span>
          </div>
        </div>

        <div className="eob-app-grid">
          <aside className="eob-hire js-hire">
            <div className="eob-hire-top">
              <span className="eob-av">AR</span>
              <div>
                <strong>Ananya Rao</strong>
                <small>Product Designer</small>
              </div>
            </div>

            <div className="eob-ring-wrap">
              <svg viewBox="0 0 80 80" className="eob-ring">
                <circle cx="40" cy="40" r={RING_R} className="eob-ring-bg" />
                <circle
                  ref={ringRef}
                  cx="40"
                  cy="40"
                  r={RING_R}
                  className="eob-ring-fg"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C}
                />
              </svg>
              <div className="eob-ring-txt">
                <strong ref={pctRef}>0%</strong>
                <small>complete</small>
              </div>
            </div>

            <div className="eob-join-chip">
              <Icon name="calendar" size={11} /> Joins Mon, 3 Nov
            </div>

            <ol className="eob-steps">
              {STEPS.map((s, i) => {
                const active = i - 1 === stage;
                const done = i === 0 || i - 1 < stage;
                return (
                  <li key={s}>
                    <button
                      type="button"
                      className={`eob-step ${done ? "done" : ""} ${active ? "active" : ""}`}
                      onClick={() => i > 0 && onSelect(i - 1)}
                      disabled={i === 0}
                    >
                      <span className="eob-step-dot">
                        {done ? <Icon name="check" size={10} /> : i + 1}
                      </span>
                      <span>{s}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          <div className="eob-stage js-stage" ref={stageRef}>
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

  // Auto-advance through the 4 services + feature progress bar
  useEffect(() => {
    barRefs.current.forEach(
      (b, i) => b && gsap.set(b, { scaleX: i < stage ? 1 : 0 }),
    );
    if (prefersReduced()) return;
    const bar = barRefs.current[stage];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: STAGE_TIME,
            ease: "none",
            delay: stage === 0 ? 1 : 0,
          },
        )
      : null;
    const next = gsap.delayedCall(STAGE_TIME + (stage === 0 ? 1 : 0), () =>
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
        { y: 28, opacity: 0, duration: 0.8, stagger: 0.08 },
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
      tl.from(q(".js-hire"), { x: -20, opacity: 0, duration: 0.6 }, 0.65);
      tl.from(
        q(".eob-step"),
        { x: -10, opacity: 0, stagger: 0.06, duration: 0.4 },
        0.8,
      );
      tl.from(
        q(".js-float"),
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        1.4,
      );

      if (reduce) {
        tl.progress(1);
        return;
      }

      q(".js-float").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 10 : -10,
          duration: 2.6 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.2,
        });
      });

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
          ry(((e.clientX - r.left) / r.width - 0.5) * 7);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 5);
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
      className="eob-hero"
      ref={sectionRef}
      aria-labelledby="eob-hero-title"
    >
      <div className="eob-hero-bg" aria-hidden>
        <span className="eob-blob b1 js-blob" />
        <span className="eob-blob b2 js-blob" />
        <span className="eob-grid" />
      </div>

      <div className="eob-container eob-hero-grid">
        {/* RIGHT: content (first in DOM for SEO, shown on the right on desktop) */}
        <div className="eob-content">
          <span className="eob-eyebrow js-reveal">
            <span className="eob-live-dot" /> Employee Onboarding
          </span>

          <h1 id="eob-hero-title" className="eob-title js-reveal">
            Seamless Employee <span className="eob-grad">Onboarding</span>
          </h1>

          <ul className="eob-features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  className={`eob-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                  aria-pressed={stage === i}
                >
                  <span className="eob-feat-num">0{i + 1}</span>
                  <span className="eob-feat-body">
                    <strong>{f.title}</strong>
                    <span className="eob-feat-desc">
                      <span>{f.desc}</span>
                    </span>
                  </span>
                  <span className="eob-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: realistic onboarding app */}
        <div className="eob-visual" ref={visualRef}>
          <OnboardingApp
            frameRef={frameRef}
            stage={stage}
            onSelect={setStage}
          />

          <div className="eob-float f1 js-float">
            <span className="eob-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>Offer accepted</strong>
              <small>E-signed in 2 minutes</small>
            </div>
          </div>

          <div className="eob-float f2 js-float">
            <span className="eob-float-ic pr">
              <Icon name="bolt" size={14} />
            </span>
            <div>
              <strong>Day-1 ready</strong>
              <small>Laptop, email & ID card set</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Onboarding journey (step tabs + live feature card)      */
/* ------------------------------------------------------------------ */

const JOURNEY_HEADING = [
  ["Streamline", true],
  ["onboarding,", false],
  ["engage", true],
  ["new", false],
  ["hires,", false],
  ["and", true],
  ["accelerate", false],
  ["productivity", false],
  ["from", false],
  ["day", false],
  ["one", false],
];

const JOURNEY = [
  {
    label: "Paperless Documentation",
    icon: "file",
    title: [
      ["Go", true],
      [" fully paperless ", false],
      ["with ease", true],
    ],
    desc: "Securely collect, store, and manage all new hire documents digitally. Reduce paperwork, speed up processing, and keep records safe.",
  },
  {
    label: "Role-specific Workflows",
    icon: "route",
    title: [
      ["Tailor", true],
      [" workflows ", false],
      ["for every role", true],
    ],
    desc: "Design onboarding steps that match each department or role, ensuring relevant information and training for every new hire.",
  },
  {
    label: "Compliance & Verification",
    icon: "shield",
    title: [
      ["Stay", true],
      [" compliant ", false],
      ["from day one", true],
    ],
    desc: "Automate ID verification, background checks, and compliance documentation to ensure smooth and legal onboarding.",
  },
  {
    label: "Personalized Training",
    icon: "grad",
    title: [
      ["Empower", true],
      [" with ", false],
      ["personalized learning", true],
    ],
    desc: "Provide custom training modules and resources to help new employees adapt faster and perform confidently.",
  },
  {
    label: "Integration with HR & Payroll",
    icon: "sync",
    title: [
      ["Integrate", true],
      [" with ", false],
      ["HR & Payroll", true],
    ],
    desc: "Seamlessly sync onboarding data with HR and payroll systems so employees are ready for their first paycheck without delays.",
  },
];

const JOURNEY_TIME = 6.5; // seconds per stop

/* ---------- Mini visual 1: Paperless documentation ---------- */

const VAULT_DOCS = [
  "Offer letter",
  "PAN card",
  "Aadhaar",
  "Address proof",
  "Degree certificate",
  "Relieving letter",
];

function PaperlessVisual() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const docs = q(".ejv-fdoc");
      const count = q(".ejv-vault-count")[0];
      const sig = q(".ejv-sig-path")[0];
      const len = sig.getTotalLength();
      gsap.set(sig, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(docs, { xPercent: -50 });

      const o = { n: 0 };
      const tl = gsap.timeline({ delay: 0.45 });
      docs.forEach((d, i) => {
        const t = i * 0.32;
        tl.fromTo(
          d,
          { y: -60, autoAlpha: 0, rotation: gsap.utils.random(-12, 12) },
          {
            y: 0,
            autoAlpha: 1,
            rotation: 0,
            duration: 0.42,
            ease: "power2.out",
          },
          t,
        );
        tl.to(
          d,
          {
            y: 58,
            scale: 0.35,
            autoAlpha: 0,
            duration: 0.32,
            ease: "power2.in",
          },
          t + 0.48,
        );
        tl.to(
          o,
          {
            n: i + 1,
            duration: 0.15,
            onUpdate: () => (count.textContent = Math.round(o.n)),
          },
          t + 0.78,
        );
        tl.fromTo(
          q(".ejv-folder"),
          { scale: 1 },
          { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 },
          t + 0.78,
        );
      });
      tl.fromTo(
        q(".ejv-lock"),
        { rotation: -25, y: -3 },
        {
          rotation: 0,
          y: 0,
          color: "#10b981",
          duration: 0.35,
          ease: "back.out(3)",
        },
        ">",
      );
      tl.fromTo(
        q(".ejv-vault-ok"),
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.3 },
        "<",
      );
      tl.to(
        sig,
        { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" },
        ">-0.1",
      );
      tl.fromTo(
        q(".ejv-sig-meta"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3 },
      );
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="ejv ejv-paper" ref={ref}>
      <div className="ejv-vault">
        <div className="ejv-drop">
          {VAULT_DOCS.map((d) => (
            <span className="ejv-fdoc" key={d}>
              <Icon name="file" size={12} /> {d}
            </span>
          ))}
        </div>
        <div className="ejv-folder">
          <span className="ejv-lock">
            <Icon name="lock" size={18} />
          </span>
          <div>
            <strong>
              <span className="ejv-vault-count">0</span> documents
            </strong>
            <small>Secure digital vault</small>
          </div>
        </div>
        <span className="ejv-vault-ok">
          <Icon name="check" size={11} /> Encrypted &amp; stored
        </span>
      </div>

      <div className="ejv-sign">
        <div className="ejv-sign-head">
          <small>E-sign · Offer letter</small>
          <span className="ejv-tag">Legally valid</span>
        </div>
        <svg viewBox="0 0 160 60" className="ejv-sig" aria-hidden>
          <path
            className="ejv-sig-path"
            d="M8 42 C 20 12, 32 8, 36 34 S 50 54, 58 30 S 74 8, 82 32 S 98 52, 108 28 C 114 16, 124 18, 132 30 C 138 38, 146 34, 152 26 M 52 48 L 150 45"
          />
        </svg>
        <span className="ejv-sign-line" />
        <small className="ejv-sig-meta">Signed by Ananya Rao · 10:42 AM</small>
      </div>
    </div>
  );
}

/* ---------- Mini visual 2: Role-specific workflows ---------- */

const ROLE_TRACKS = [
  {
    role: "Engineering",
    icon: "laptop",
    days: 5,
    tasks: [
      "Dev environment & GitHub access",
      "Codebase walkthrough with tech lead",
      "Security & data policy training",
      "First sprint planning",
    ],
  },
  {
    role: "Sales",
    icon: "trend",
    days: 4,
    tasks: [
      "CRM account & territory setup",
      "Product pitch certification",
      "Shadow 3 client calls",
      "Quarterly target briefing",
    ],
  },
  {
    role: "Operations",
    icon: "gear",
    days: 3,
    tasks: [
      "Shift roster & attendance setup",
      "Safety & SOP induction",
      "Vendor & inventory tools access",
      "Meet the floor supervisor",
    ],
  },
];

function RolesVisual() {
  const [r, setR] = useState(0);
  const ref = useRef(null);
  const tabsRef = useRef(null);
  const pillRef = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(
      () => setR((x) => (x + 1) % ROLE_TRACKS.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const isFirst = first.current;
    first.current = false;
    const btn = tabsRef.current?.children[r + 1];
    if (btn)
      gsap.to(pillRef.current, {
        x: btn.offsetLeft - 4,
        width: btn.offsetWidth,
        duration: isFirst ? 0 : 0.45,
        ease: "power3.out",
      });
    const q = gsap.utils.selector(ref);
    const d = isFirst ? 0.45 : 0;
    const a = gsap.fromTo(
      q(".ejv-rtask"),
      { x: 30, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.45,
        ease: "power3.out",
        delay: d,
      },
    );
    const b = gsap.fromTo(
      q(".ejv-rtick"),
      { scale: 0 },
      {
        scale: 1,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(3)",
        delay: d + 0.45,
      },
    );
    const c = gsap.fromTo(
      q(".ejv-rhead"),
      { autoAlpha: 0, y: -6 },
      { autoAlpha: 1, y: 0, duration: 0.35, delay: d },
    );
    return () => {
      a.kill();
      b.kill();
      c.kill();
    };
  }, [r]);

  const track = ROLE_TRACKS[r];

  return (
    <div className="ejv ejv-roles" ref={ref}>
      <div className="ejv-rtabs" ref={tabsRef}>
        <span className="ejv-rpill" ref={pillRef} />
        {ROLE_TRACKS.map((t, i) => (
          <button
            key={t.role}
            type="button"
            className={r === i ? "is-active" : ""}
            onClick={() => setR(i)}
          >
            <Icon name={t.icon} size={12} /> {t.role}
          </button>
        ))}
      </div>

      <div className="ejv-rhead">
        <span className="ejv-rhead-ic">
          <Icon name={track.icon} size={16} />
        </span>
        <div>
          <strong>{track.role} onboarding track</strong>
          <small>
            {track.tasks.length} steps · {track.days} days · auto-assigned
          </small>
        </div>
      </div>

      <ol className="ejv-rtasks">
        {track.tasks.map((t, i) => (
          <li className="ejv-rtask" key={track.role + t}>
            <span className="ejv-rnum">{i + 1}</span>
            <span className="ejv-rtext">{t}</span>
            {i < 2 ? (
              <span className="ejv-rtick done">
                <Icon name="check" size={11} />
              </span>
            ) : (
              <span className="ejv-rtick day">Day {i}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Mini visual 3: Compliance & verification ---------- */

const CHECKS = [
  "PAN verified",
  "Aadhaar e-KYC complete",
  "Background check cleared",
  "UAN / PF linked",
  "Policy acknowledgements signed",
];

function ComplianceVisual() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const items = q(".ejv-ck");
      const score = q(".ejv-score-num")[0];
      const o = { n: 0 };
      const tl = gsap.timeline({ delay: 0.45 });
      tl.fromTo(
        q(".ejv-beam"),
        { top: "0%", autoAlpha: 1 },
        {
          top: "100%",
          duration: 0.85,
          ease: "sine.inOut",
          repeat: 1,
          yoyo: true,
        },
      );
      tl.to(q(".ejv-beam"), { autoAlpha: 0, duration: 0.2 });
      tl.fromTo(
        q(".ejv-stamp"),
        { scale: 2.2, autoAlpha: 0, rotation: -24 },
        {
          scale: 1,
          autoAlpha: 1,
          rotation: -12,
          duration: 0.4,
          ease: "back.out(2)",
        },
        "<",
      );
      items.forEach((li, i) => {
        const at = 0.5 + i * 0.5;
        tl.to(li, { opacity: 1, duration: 0.2 }, at);
        tl.to(
          li.querySelector(".ejv-spin"),
          { autoAlpha: 0, duration: 0.15 },
          at + 0.35,
        );
        tl.fromTo(
          li.querySelector(".ejv-ok"),
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
          at + 0.35,
        );
      });
      tl.fromTo(
        q(".ejv-score-bar i"),
        { scaleX: 0 },
        { scaleX: 1, duration: 3, ease: "power1.inOut" },
        0.5,
      );
      tl.to(
        o,
        {
          n: 100,
          duration: 3,
          ease: "power1.inOut",
          onUpdate: () => (score.textContent = Math.round(o.n)),
        },
        0.5,
      );
      tl.fromTo(
        q(".ejv-audit"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.5)" },
      );
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="ejv ejv-comp" ref={ref}>
      <div className="ejv-comp-grid">
        <div className="ejv-idcard">
          <span className="ejv-beam" aria-hidden />
          <div className="ejv-id-top">
            <span className="ejv-id-photo">AR</span>
            <div>
              <strong>Ananya Rao</strong>
              <small>Govt. ID · Masked</small>
            </div>
          </div>
          <div className="ejv-id-lines">
            <i />
            <i />
            <i />
          </div>
          <div className="ejv-id-num">XXXX XXXX 4821</div>
          <span className="ejv-stamp">Verified</span>
        </div>

        <ul className="ejv-checks">
          {CHECKS.map((c) => (
            <li className="ejv-ck" key={c}>
              <span className="ejv-ck-ic">
                <span className="ejv-spin" />
                <span className="ejv-ok">
                  <Icon name="check" size={11} />
                </span>
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="ejv-score">
        <div className="ejv-score-head">
          <span>
            <Icon name="shield" size={13} /> Compliance score
          </span>
          <b>
            <span className="ejv-score-num">0</span>%
          </b>
          <span className="ejv-audit">Audit-ready</span>
        </div>
        <span className="ejv-score-bar">
          <i />
        </span>
      </div>
    </div>
  );
}

/* ---------- Mini visual 4: Personalized training ---------- */

const MODULES = [
  { t: "Company culture & values", m: "12 min" },
  { t: "HR policies & benefits", m: "15 min" },
  { t: "Tools & systems", m: "20 min" },
  { t: "Role deep-dive: Design", m: "30 min" },
];
const QUIZ_R = 26;
const QUIZ_C = 2 * Math.PI * QUIZ_R;

function TrainingVisual() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const mods = q(".ejv-mod");
      const quizTxt = q(".ejv-quiz-num")[0];
      const quizArc = q(".ejv-quiz-fg")[0];
      const pctTxt = q(".ejv-mod-pct")[0];
      const o = { n: 0 };
      const p = { n: 0 };
      gsap.set(quizArc, { strokeDasharray: QUIZ_C, strokeDashoffset: QUIZ_C });

      const tl = gsap.timeline({ delay: 0.45 });
      tl.from(mods, {
        x: -18,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power3.out",
      });
      tl.fromTo(
        q(".ejv-path-fill"),
        { scaleY: 0 },
        { scaleY: 0.78, duration: 2.2, ease: "power1.inOut" },
        0.5,
      );
      mods.slice(0, 3).forEach((m, i) => {
        tl.call(() => m.classList.add("is-done"), null, 0.8 + i * 0.6);
        tl.fromTo(
          m.querySelector(".ejv-mod-dot"),
          { scale: 1 },
          { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1 },
          0.8 + i * 0.6,
        );
      });
      tl.call(() => mods[3]?.classList.add("is-active"), null, 2.6);
      tl.fromTo(
        q(".ejv-mod-bar i"),
        { scaleX: 0 },
        { scaleX: 0.6, duration: 1, ease: "power2.out" },
        2.6,
      );
      tl.to(
        p,
        {
          n: 60,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => (pctTxt.textContent = `${Math.round(p.n)}%`),
        },
        2.6,
      );

      tl.to(
        quizArc,
        {
          strokeDashoffset: QUIZ_C * (1 - 0.92),
          duration: 1.4,
          ease: "power2.out",
        },
        0.9,
      );
      tl.to(
        o,
        {
          n: 92,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => (quizTxt.textContent = Math.round(o.n)),
        },
        0.9,
      );
      tl.fromTo(
        q(".ejv-streak"),
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.35 },
        1.8,
      );
      tl.fromTo(
        q(".ejv-badge"),
        { scale: 0, rotation: -120, autoAlpha: 0 },
        {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: "back.out(2)",
        },
        3.1,
      );
      tl.fromTo(
        q(".ejv-badge-shine"),
        { xPercent: -160 },
        { xPercent: 160, duration: 0.8, ease: "power2.inOut" },
        3.6,
      );
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="ejv ejv-train" ref={ref}>
      <div className="ejv-train-grid">
        <div className="ejv-path">
          <span className="ejv-path-line">
            <i className="ejv-path-fill" />
          </span>
          {MODULES.map((m, i) => (
            <div className="ejv-mod" key={m.t}>
              <span className="ejv-mod-dot">
                <Icon name="check" size={10} />
                <b>{i + 1}</b>
              </span>
              <div className="ejv-mod-body">
                <strong>{m.t}</strong>
                <small>{m.m}</small>
                {i === 3 && (
                  <div className="ejv-mod-prog">
                    <span className="ejv-mod-bar">
                      <i />
                    </span>
                    <span className="ejv-mod-pct">0%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="ejv-train-side">
          <div className="ejv-quiz">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={QUIZ_R} className="ejv-quiz-bg" />
              <circle cx="32" cy="32" r={QUIZ_R} className="ejv-quiz-fg" />
            </svg>
            <div className="ejv-quiz-txt">
              <strong>
                <span className="ejv-quiz-num">0</span>%
              </strong>
              <small>Quiz score</small>
            </div>
          </div>
          <span className="ejv-streak">🔥 3-day streak</span>
          <div className="ejv-badge">
            <span className="ejv-badge-shine" aria-hidden />
            <Icon name="award" size={18} />
            <div>
              <strong>Fast Starter</strong>
              <small>Badge earned</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mini visual 5: Integration with HR & Payroll ---------- */

const SYNC_NODES = [
  { label: "HR Core", icon: "users", x: 15, y: 20 },
  { label: "Payroll", icon: "wallet", x: 85, y: 20 },
  { label: "Attendance", icon: "calendar", x: 15, y: 80 },
  { label: "Leave", icon: "coffee", x: 85, y: 80 },
];
const SYNC_CHIPS = [
  "Salary structure mapped",
  "Bank account verified",
  "Added to November payroll",
];

function IntegrationVisual() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const nodes = q(".ejv-inode");
      const packets = q(".ejv-packet");
      const tl = gsap.timeline({ delay: 0.45 });
      tl.from(q(".ejv-hub"), {
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(2)",
      });
      tl.from(
        nodes,
        {
          scale: 0.6,
          opacity: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: "back.out(2)",
        },
        "<0.15",
      );
      packets.forEach((pk, i) => {
        const n = SYNC_NODES[i];
        const at = 0.8 + i * 0.35;
        tl.fromTo(
          pk,
          { left: "50%", top: "50%", autoAlpha: 1, scale: 1 },
          {
            left: `${n.x}%`,
            top: `${n.y}%`,
            duration: 0.7,
            ease: "power1.inOut",
          },
          at,
        );
        tl.to(pk, { scale: 0, autoAlpha: 0, duration: 0.15 }, ">");
        tl.call(() => nodes[i].classList.add("is-synced"), null, "<");
        tl.fromTo(
          nodes[i],
          { scale: 1 },
          { scale: 1.1, duration: 0.14, yoyo: true, repeat: 1 },
          "<",
        );
      });
      tl.fromTo(
        q(".ejv-ichip"),
        { y: 10, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.25,
          duration: 0.35,
          ease: "back.out(2)",
        },
        ">",
      );
      tl.fromTo(
        q(".ejv-payslip"),
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
        ">-0.1",
      );

      // Continuous data flow after the first sync
      if (!prefersReduced()) {
        packets.forEach((pk, i) => {
          const n = SYNC_NODES[i];
          tl.add(
            gsap.fromTo(
              pk,
              { left: "50%", top: "50%", autoAlpha: 0.9, scale: 0.7 },
              {
                left: `${n.x}%`,
                top: `${n.y}%`,
                autoAlpha: 0,
                duration: 1,
                ease: "power1.in",
                repeat: -1,
                repeatDelay: 0.6,
                delay: i * 0.25,
              },
            ),
            ">-0.2",
          );
        });
      } else {
        tl.progress(1);
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="ejv ejv-int" ref={ref}>
      <div className="ejv-net">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="ejv-net-lines"
          aria-hidden
        >
          {SYNC_NODES.map((n) => (
            <line key={n.label} x1="50" y1="50" x2={n.x} y2={n.y} />
          ))}
        </svg>
        {SYNC_NODES.map((n) => (
          <span className="ejv-packet" key={n.label} />
        ))}
        <div className="ejv-hub">
          <Icon name="sync" size={18} />
          <small>Onboarding</small>
        </div>
        {SYNC_NODES.map((n) => (
          <div
            className="ejv-inode"
            key={n.label}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className="ejv-inode-ic">
              <Icon name={n.icon} size={13} />
            </span>
            <strong>{n.label}</strong>
            <em>
              <Icon name="check" size={9} /> Synced
            </em>
          </div>
        ))}
      </div>

      <div className="ejv-int-foot">
        <div className="ejv-ichips">
          {SYNC_CHIPS.map((c) => (
            <span className="ejv-ichip" key={c}>
              <Icon name="check" size={10} /> {c}
            </span>
          ))}
        </div>
        <div className="ejv-payslip">
          <Icon name="wallet" size={14} />
          <span>
            First payslip ready · <b>30 Nov</b>
          </span>
          <em>No delays</em>
        </div>
      </div>
    </div>
  );
}

const JOURNEY_VISUALS = [
  PaperlessVisual,
  RolesVisual,
  ComplianceVisual,
  TrainingVisual,
  IntegrationVisual,
];

/* ---------- Section ---------- */

function JourneySection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const copyRef = useRef(null);
  const chipBarRefs = useRef([]);
  const autoRef = useRef(null);
  const hoverRef = useRef(false);
  const visibleRef = useRef(false);
  const firstSwap = useRef(true);

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

  // Heading reveal + play only while in view
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".ejn-word > span"), {
        yPercent: 110,
        rotation: 4,
        duration: 0.9,
        stagger: 0.05,
        ease: "power4.out",
        scrollTrigger: { trigger: q(".ejn-title")[0], start: "top 85%" },
      });
      gsap.from(q(".ejn-stage"), {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".ejn-stage")[0], start: "top 85%" },
      });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        onToggle: (self) => {
          visibleRef.current = self.isActive;
          syncPlay();
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-advance timer (fills the bar under the active stop)
  useEffect(() => {
    autoRef.current?.kill();
    chipBarRefs.current.forEach(
      (b, i) => b && gsap.set(b, { scaleX: i < active ? 1 : 0 }),
    );
    if (prefersReduced()) return;
    const targets = [chipBarRefs.current[active]].filter(Boolean);
    autoRef.current = gsap.fromTo(
      targets,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: JOURNEY_TIME,
        ease: "none",
        onComplete: () => select((activeRef.current + 1) % JOURNEY.length),
      },
    );
    syncPlay();
    return () => autoRef.current?.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // Card swap: circular reveal for the visual, wipe-up for the copy
  useLayoutEffect(() => {
    if (firstSwap.current) {
      firstSwap.current = false;
      return;
    }
    if (prefersReduced()) return;
    gsap.fromTo(
      visualRef.current,
      { clipPath: "circle(0% at 50% 50%)" },
      {
        clipPath: "circle(80% at 50% 50%)",
        duration: 0.9,
        ease: "power3.inOut",
        clearProps: "clipPath",
      },
    );
    gsap.fromTo(
      copyRef.current.children,
      { y: 24, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
      {
        y: 0,
        autoAlpha: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "clipPath",
      },
    );
  }, [active]);

  const go = (dir) =>
    select((activeRef.current + dir + JOURNEY.length) % JOURNEY.length);
  const j = JOURNEY[active];
  const Visual = JOURNEY_VISUALS[active];

  return (
    <section
      className="ejn"
      id="onboarding-steps"
      ref={sectionRef}
      aria-labelledby="ejn-title"
    >
      <div className="eob-container ejn-head">
        <span className="ejn-eyebrow">The onboarding journey</span>
        <h2 id="ejn-title" className="ejn-title">
          {JOURNEY_HEADING.map(([w, hl], i) => (
            <span key={i} className={`ejn-word ${hl ? "hl" : ""}`}>
              <span>{w}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="ejn-stage">
        {/* Step tabs */}
        <div className="eob-container">
          <div
            className="ejn-chips"
            role="tablist"
            aria-label="Onboarding features"
          >
            {JOURNEY.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={`${active === i ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
                onClick={() => select(i)}
              >
                <span className="ejn-chip-ic">
                  <Icon name={s.icon} size={15} />
                </span>
                <span className="ejn-chip-txt">
                  <small>Step 0{i + 1}</small>
                  {s.label}
                </span>
                <span className="ejn-chip-bar">
                  <i ref={(el) => (chipBarRefs.current[i] = el)} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="eob-container">
          <div
            className="ejn-card"
            onMouseEnter={() => {
              hoverRef.current = true;
              syncPlay();
            }}
            onMouseLeave={() => {
              hoverRef.current = false;
              syncPlay();
            }}
          >
            <div className="ejn-visual" ref={visualRef}>
              <Visual key={active} />
            </div>

            <div className="ejn-copy" ref={copyRef}>
              <span className="ejn-step">
                Step 0{active + 1} <em>/ 0{JOURNEY.length}</em>
              </span>
              <h3>
                {j.title.map(([t, hl], i) =>
                  hl ? (
                    <span key={i} className="hl">
                      {t}
                    </span>
                  ) : (
                    <span key={i}>{t}</span>
                  ),
                )}
              </h3>
              <p>{j.desc}</p>
              <div className="ejn-actions">
                <a href="/contact" className="eob-btn primary">
                  Get Started with NGriffinpay <Icon name="arrow" size={16} />
                </a>
                <div className="ejn-nav">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous feature"
                  >
                    <span className="ejn-flip">
                      <Icon name="arrow" size={16} />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next feature"
                  >
                    <Icon name="arrow" size={16} />
                  </button>
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
    q: "What is the Seamless Employee Onboarding feature in NGriffinpay?",
    a: "NGriffinpay’s Seamless Employee Onboarding module helps you quickly and efficiently bring new hires into your organization with minimal paperwork and maximum engagement.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "seamless",
      "onboarding feature",
    ],
  },
  {
    q: "Can onboarding be customized for different roles?",
    a: "Yes, you can create tailored onboarding workflows for specific roles, departments, or locations, ensuring each employee receives the right information and training from day one.",
    keys: [
      "custom",
      "role",
      "department",
      "location",
      "tailor",
      "workflow",
      "different",
      "team",
    ],
  },
  {
    q: "Does it support digital document collection?",
    a: "Absolutely. New hires can securely upload and e-sign documents such as IDs, contracts, and policy acknowledgments directly through the portal.",
    keys: [
      "document",
      "upload",
      "e-sign",
      "esign",
      "sign",
      "paper",
      "id",
      "contract",
      "aadhaar",
      "pan",
      "digital",
    ],
  },
  {
    q: "Can new hires complete onboarding remotely?",
    a: "Yes, the platform supports remote onboarding, allowing employees to complete forms, training, and introductions from anywhere, without needing to visit the office.",
    keys: [
      "remote",
      "remotely",
      "home",
      "anywhere",
      "online",
      "office",
      "work from",
      "wfh",
    ],
  },
  {
    q: "Does it integrate with payroll and HR systems?",
    a: "Yes, NGriffinpay integrates with payroll, HR, and compliance systems to ensure employee records are automatically synced and ready for their first paycheck.",
    keys: [
      "integrat",
      "payroll",
      "hr system",
      "sync",
      "salary",
      "paycheck",
      "compliance",
      "connect",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about employee onboarding.";
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
      <div className="eoq-row bot" ref={ref}>
        <span className="eoq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="eoq-bubble bot eoq-typing"
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
      <div className="eoq-row user" ref={ref}>
        <div className="eoq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="eoq-row bot" ref={ref}>
      <span className="eoq-bot-av" aria-hidden>
        N
      </span>
      <div className="eoq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="eoq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function OnboardingFaqSection() {
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
      gsap.from(q(".eoq-chat"), {
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
    <section className="eoq" ref={sectionRef} aria-labelledby="eoq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="eob-container eoq-grid">
        <div className="eoq-left">
          <span className="eoq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="eoq-title" className="eoq-title js-faq-reveal">
            Seamless Employee Onboarding –{" "}
            <span className="eob-grad">FAQs</span>
          </h2>
          <p className="eoq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="eoq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`eoq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="eoq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="eoq-q-text">{f.q}</span>
                  <span className="eoq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="eoq-chat">
          <div className="eoq-chat-head">
            <span className="eoq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="eoq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="eoq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="eoq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="eoq-suggest" aria-label="Suggested questions">
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

          <form className="eoq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about employee onboarding…"
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

export default function EmployeeOnboarding() {
  return (
    <div className="eob-page">
      <HeroSection />
      <JourneySection />
      <OnboardingFaqSection />
      {/* SECTION 4 — coming next */}
    </div>
  );
}
