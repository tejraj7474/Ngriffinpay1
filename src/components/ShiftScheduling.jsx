// ShiftScheduling.jsx
// NGriffinpay — Product inner page: "Shift & Scheduling Management"
// Section 1: Hero banner (live roster app on the left, content on the right)
// Section 2: 3D shift floor (isometric board, GSAP story per tab, three.js time ribbons)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap three   (both already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { I } from "../data";
import "./ShiftScheduling.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Manual Roster Planning",
    desc: "Auto-build conflict-free rosters in seconds — no more spreadsheets.",
    icon: "grid",
    tab: "Auto-plan",
  },
  {
    title: "Last-Minute Changes",
    desc: "Track every shift swap with approvals and instant alerts.",
    icon: "swap",
    tab: "Swaps",
  },
  {
    title: "Lack of Visibility",
    desc: "See who's on shift, on break or late — in real time.",
    icon: "eye",
    tab: "Live",
  },
  {
    title: "Compliance Issues",
    desc: "Check work hours against labour laws before you publish.",
    icon: "shield",
    tab: "Compliance",
  },
];

const STAGE_TIME = 6;

const SHIFTS = {
  M: { label: "Morning", hrs: 8 },
  G: { label: "General", hrs: 9 },
  N: { label: "Night", hrs: 8 },
  O: { label: "Off", hrs: 0 },
  L: { label: "Leave", hrs: 0 },
};

const DAYS = [
  ["Mon", 2],
  ["Tue", 3],
  ["Wed", 4],
  ["Thu", 5],
  ["Fri", 6],
  ["Sat", 7],
  ["Sun", 8],
];
const TODAY = 3; // Thursday

// status = live status on Thursday 10:42 AM
const TEAM = [
  { name: "Priya S.", av: "PS", row: "MMNNOOG", status: "off" },
  { name: "Arjun K.", av: "AK", row: "GGOMMNO", status: "on" },
  { name: "Meena R.", av: "MR", row: "NNOOMMG", status: "off" },
  { name: "Rahul D.", av: "RD", row: "MOGGNNO", status: "break" },
  { name: "Sneha P.", av: "SP", row: "OMMGGLL", status: "late" },
  { name: "Vikram T.", av: "VT", row: "GGGONNM", status: "off" },
  { name: "Fatima A.", av: "FA", row: "ONNMMGO", status: "on" },
];

// Hidden "after" pills used by the swap and compliance animations
const ALTS = { "0-2": "O", "1-2": "N", "5-6": "O" };
const SWAP_FROM = "0-2"; // Priya · Wed night
const SWAP_TO = "1-2"; // Arjun · Wed off
const FIX = "5-6"; // Vikram · Sun morning -> off
const FLAG_ROW = 5;

const hoursOf = (row) => [...row].reduce((s, c) => s + SHIFTS[c].hrs, 0);
const coverage = (d) => TEAM.filter((t) => !"OL".includes(t.row[d])).length;

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
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 10h18M9 4v17M15 4v17M8 2v4M16 2v4" />
        </svg>
      );
    case "swap":
      return (
        <svg {...p}>
          <path d="M16 3l4 4-4 4" />
          <path d="M20 7H4" />
          <path d="M8 21l-4-4 4-4" />
          <path d="M4 17h16" />
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
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
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
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
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "chevr":
      return (
        <svg {...p}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Stage animations                                                    */
/* Each stage builds one GSAP timeline scoped to the whole app frame,  */
/* so it can animate the roster grid AND its own action card. When the */
/* stage changes, the context reverts and the grid returns to normal.  */
/* ------------------------------------------------------------------ */

function useStage(build, delay) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    // the frame's own ref is attached after children mount, so find it from the card
    const scope = ref.current?.closest(".ssm-frame");
    if (!scope) return undefined;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);
      const tl = gsap.timeline({ delay });
      tl.from(q(".ssm-act .js-in"), {
        y: 12,
        opacity: 0,
        stagger: 0.07,
        duration: 0.4,
        ease: "power3.out",
      });
      build(tl, q, scope);
      if (prefersReduced()) tl.progress(1);
    }, scope);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

const counter = (tl, el, to, at, dur = 0.9, fmt = (v) => Math.round(v)) => {
  if (!el) return;
  const o = { v: 0 };
  tl.to(
    o,
    {
      v: to,
      duration: dur,
      ease: "power2.out",
      onUpdate: () => (el.textContent = fmt(o.v)),
    },
    at,
  );
};

// 1 — Auto roster planning
function PlanStage({ delay }) {
  const ref = useStage((tl, q) => {
    tl.fromTo(
      q(".ssm-auto"),
      { boxShadow: "0 0 0 0 rgba(56,189,248,0.7)" },
      { boxShadow: "0 0 0 8px rgba(56,189,248,0)", duration: 0.7, repeat: 1 },
      0,
    );
    tl.fromTo(
      q(".ssm-cell .ssm-pill.base"),
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.28,
        ease: "back.out(2.2)",
        stagger: {
          each: 0.018,
          grid: [TEAM.length, 7],
          from: "start",
          axis: null,
        },
      },
      0.2,
    );
    tl.fromTo(
      q(".ssm-plan-bar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, ease: "power1.inOut" },
      0.2,
    );
    counter(tl, q(".js-shifts")[0], 37, 0.2, 1.5);
    tl.fromTo(
      q(".ssm-cov b"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.3 },
      1.5,
    );
    tl.fromTo(
      q(".ssm-plan-ok"),
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" },
      1.9,
    );
    tl.fromTo(
      q(".ssm-plan-stat"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.35 },
      2.1,
    );
  }, delay);

  return (
    <div className="ssm-act" ref={ref}>
      <div className="ssm-act-row js-in">
        <span className="ssm-act-ic">
          <Icon name="spark" size={13} />
        </span>
        <div className="ssm-grow">
          <b>Auto-scheduling week 45</b>
          <span className="ssm-plan-bar">
            <i />
          </span>
        </div>
        <span className="ssm-plan-ok">
          <Icon name="check" size={10} /> Published
        </span>
      </div>
      <div className="ssm-plan-stats">
        <div className="ssm-plan-stat">
          <strong className="js-shifts">0</strong>
          <small>Shifts planned</small>
        </div>
        <div className="ssm-plan-stat">
          <strong>0</strong>
          <small>Conflicts</small>
        </div>
        <div className="ssm-plan-stat">
          <strong>2.4s</strong>
          <small>Time taken</small>
        </div>
      </div>
    </div>
  );
}

// 2 — Last-minute changes: shift swap
function SwapStage({ delay }) {
  const ref = useStage((tl, q, scope) => {
    const wrap = q(".ssm-grid-wrap")[0];
    const src = q(`.c-${SWAP_FROM} .ssm-pill.base`)[0];
    const dst = q(`.c-${SWAP_TO} .ssm-pill.base`)[0];
    const ghost = q(".ssm-ghost")[0];
    if (!wrap || !src || !dst || !ghost) return;
    const w = wrap.getBoundingClientRect();
    const a = src.getBoundingClientRect();
    const b = dst.getBoundingClientRect();
    // frame may be tilted by the hover effect; this keeps positions close enough
    const ax = a.left - w.left,
      ay = a.top - w.top;
    const bx = b.left - w.left,
      by = b.top - w.top;

    tl.fromTo(
      src,
      { boxShadow: "0 0 0 0 rgba(244,63,94,0)" },
      {
        boxShadow: "0 0 0 3px rgba(244,63,94,0.55)",
        duration: 0.3,
        repeat: 3,
        yoyo: true,
      },
      0.2,
    );
    tl.fromTo(
      q(".ssm-req"),
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "back.out(1.8)" },
      0.3,
    );
    tl.set(
      ghost,
      { autoAlpha: 1, x: ax, y: ay, width: a.width, height: a.height },
      1.3,
    );
    tl.to(src, { autoAlpha: 0, duration: 0.2 }, 1.3);
    tl.fromTo(
      q(`.c-${SWAP_FROM} .ssm-pill.alt`),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
      1.4,
    );
    tl.to(
      ghost,
      {
        keyframes: [
          { scale: 1.15, rotation: -4, duration: 0.2 },
          { x: bx, y: by, duration: 0.7, ease: "power2.inOut" },
          { scale: 1, rotation: 0, duration: 0.2 },
        ],
      },
      1.35,
    );
    tl.to(dst, { autoAlpha: 0, duration: 0.2 }, 2.1);
    tl.set(q(`.c-${SWAP_TO} .ssm-pill.alt`), { autoAlpha: 1 }, 2.45);
    tl.set(ghost, { autoAlpha: 0 }, 2.45);
    tl.fromTo(
      q(`.c-${SWAP_TO}`),
      { backgroundColor: "rgba(16,185,129,0.25)" },
      { backgroundColor: "rgba(16,185,129,0)", duration: 1 },
      2.45,
    );
    tl.to(
      q(".ssm-req-status"),
      {
        duration: 0.01,
        onStart: () => {
          const el = scope.querySelector(".ssm-req-status");
          if (el) {
            el.textContent = "Approved";
            el.classList.add("ok");
          }
        },
        onReverseComplete: () => {
          const el = scope.querySelector(".ssm-req-status");
          if (el) {
            el.textContent = "Pending";
            el.classList.remove("ok");
          }
        },
      },
      2.5,
    );
    tl.fromTo(
      q(".ssm-notify span"),
      { autoAlpha: 0, scale: 0.7 },
      {
        autoAlpha: 1,
        scale: 1,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(2.5)",
      },
      2.7,
    );
  }, delay);

  return (
    <div className="ssm-act" ref={ref}>
      <div className="ssm-req">
        <span className="ssm-av sm a">PS</span>
        <span className="ssm-swap-ic">
          <Icon name="swap" size={11} />
        </span>
        <span className="ssm-av sm b">AK</span>
        <div className="ssm-grow">
          <b>Priya ⇄ Arjun · Wed 4 Nov, Night</b>
          <small>Requested 18 min ago · auto-checked for rest hours</small>
        </div>
        <span className="ssm-req-status">Pending</span>
      </div>
      <div className="ssm-notify js-in">
        <small>Notified:</small>
        <span>
          <Icon name="bell" size={9} /> Priya
        </span>
        <span>
          <Icon name="bell" size={9} /> Arjun
        </span>
        <span>
          <Icon name="bell" size={9} /> Manager
        </span>
        <span>
          <Icon name="check" size={9} /> Audit log
        </span>
      </div>
    </div>
  );
}

// 3 — Real-time visibility
const LIVE = [
  { k: "on", n: 42, t: "On shift" },
  { k: "break", n: 6, t: "On break" },
  { k: "late", n: 2, t: "Late" },
  { k: "off", n: 18, t: "Off duty" },
];

function LiveStage({ delay }) {
  const ref = useStage((tl, q) => {
    tl.fromTo(
      q(".ssm-today"),
      { autoAlpha: 0, scaleY: 0.6 },
      { autoAlpha: 1, scaleY: 1, duration: 0.45, ease: "power3.out" },
      0.1,
    );
    tl.fromTo(
      q(".ssm-now"),
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(2)" },
      0.4,
    );
    tl.fromTo(
      q(".ssm-st"),
      { autoAlpha: 0, scale: 0 },
      {
        autoAlpha: 1,
        scale: 1,
        stagger: 0.08,
        duration: 0.3,
        ease: "back.out(3)",
      },
      0.6,
    );
    tl.fromTo(
      q(".ssm-row.is-late .ssm-name"),
      { backgroundColor: "rgba(244,63,94,0)" },
      {
        backgroundColor: "rgba(244,63,94,0.12)",
        duration: 0.35,
        repeat: 3,
        yoyo: true,
      },
      1.3,
    );
    q(".ssm-live b").forEach((el, i) =>
      counter(tl, el, LIVE[i].n, 1 + i * 0.1, 0.9),
    );
    tl.fromTo(
      q(".ssm-live-bar i"),
      { scaleX: 0 },
      {
        scaleX: (i) => [0.62, 0.09, 0.03, 0.26][i],
        duration: 0.9,
        ease: "power2.out",
      },
      1,
    );
    tl.fromTo(
      q(".ssm-alert"),
      { autoAlpha: 0, x: 14 },
      { autoAlpha: 1, x: 0, duration: 0.35, ease: "back.out(1.8)" },
      2.1,
    );
  }, delay);

  return (
    <div className="ssm-act" ref={ref}>
      <div className="ssm-live js-in">
        {LIVE.map((l) => (
          <div key={l.k} className={`ssm-live-i ${l.k}`}>
            <i />
            <b>0</b>
            <small>{l.t}</small>
          </div>
        ))}
      </div>
      <div className="ssm-live-bar js-in">
        {LIVE.map((l) => (
          <i key={l.k} className={l.k} />
        ))}
      </div>
      <div className="ssm-alert">
        <span className="ssm-act-ic warn">
          <Icon name="clock" size={12} />
        </span>
        <div className="ssm-grow">
          <b>Sneha P. is 12 min late</b>
          <small>Backup Fatima A. alerted automatically</small>
        </div>
      </div>
    </div>
  );
}

// 4 — Compliance
const RULES = [
  { t: "Max 48 hrs / week", s: "Shops & Establishments Act" },
  { t: "1 weekly off for everyone", s: "Checked for 7 / 7 employees" },
  { t: "11 hrs rest between shifts", s: "No back-to-back night → morning" },
];

function ComplianceStage({ delay }) {
  const ref = useStage((tl, q) => {
    tl.fromTo(
      q(".ssm-hrs i"),
      { scaleX: 0 },
      {
        scaleX: (i) => Math.min(1, hoursOf(TEAM[i].row) / 56),
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.05,
      },
      0.1,
    );
    q(".ssm-hrs b").forEach((el, i) =>
      counter(tl, el, hoursOf(TEAM[i].row), 0.1 + i * 0.05, 0.9),
    );
    tl.to(
      q(`.ssm-row.r-${FLAG_ROW}`),
      { backgroundColor: "rgba(244,63,94,0.10)", duration: 0.3 },
      1.1,
    );
    tl.to(
      q(`.ssm-row.r-${FLAG_ROW} .ssm-hrs`),
      { color: "#e11d48", duration: 0.3 },
      1.1,
    );
    tl.to(
      q(`.ssm-row.r-${FLAG_ROW} .ssm-hrs i`),
      { backgroundColor: "#f43f5e", duration: 0.3 },
      1.1,
    );
    tl.fromTo(
      q(".ssm-rule"),
      { autoAlpha: 0, x: -10 },
      { autoAlpha: 1, x: 0, stagger: 0.15, duration: 0.3 },
      0.6,
    );
    tl.fromTo(
      q(".ssm-rule.warn .ssm-rule-ic"),
      { scale: 0.6 },
      { scale: 1, duration: 0.3, ease: "back.out(3)" },
      1.1,
    );
    // auto-fix: Sunday shift moved, hours drop to 43
    tl.to(
      q(`.c-${FIX} .ssm-pill.base`),
      { autoAlpha: 0, scale: 0.6, duration: 0.3 },
      2.1,
    );
    tl.fromTo(
      q(`.c-${FIX} .ssm-pill.alt`),
      { autoAlpha: 0, scale: 0.6 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" },
      2.3,
    );
    const el = q(`.ssm-row.r-${FLAG_ROW} .ssm-hrs b`)[0];
    const o = { v: hoursOf(TEAM[FLAG_ROW].row) };
    tl.to(
      o,
      {
        v: 43,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      2.3,
    );
    tl.to(
      q(`.ssm-row.r-${FLAG_ROW} .ssm-hrs i`),
      { scaleX: 43 / 56, backgroundColor: "#10b981", duration: 0.6 },
      2.3,
    );
    tl.to(
      q(`.ssm-row.r-${FLAG_ROW}`),
      { backgroundColor: "rgba(16,185,129,0.08)", duration: 0.4 },
      2.4,
    );
    tl.to(
      q(`.ssm-row.r-${FLAG_ROW} .ssm-hrs`),
      { color: "#047857", duration: 0.3 },
      2.4,
    );
    tl.to(
      q(".ssm-rule.warn"),
      { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0", duration: 0.3 },
      2.5,
    );
    tl.to(
      q(".ssm-rule.warn .ssm-rule-ic"),
      { backgroundColor: "#10b981", duration: 0.3 },
      2.5,
    );
    tl.fromTo(
      q(".ssm-fixed"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      2.6,
    );
    tl.to(
      q(".ssm-rule.warn .ssm-rule-s"),
      { autoAlpha: 0, duration: 0.2 },
      2.5,
    );
    tl.to(q(".ssm-rule.warn .ic-a"), { autoAlpha: 0, duration: 0.2 }, 2.5);
    tl.fromTo(
      q(".ssm-rule.warn .ic-c"),
      { autoAlpha: 0, scale: 0.4 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(3)" },
      2.55,
    );
  }, delay);

  return (
    <div className="ssm-act" ref={ref}>
      <div className="ssm-act-head js-in">
        <Icon name="shield" size={12} /> Labour-law check before publishing{" "}
        <em>Week 45</em>
      </div>
      <div className="ssm-rules">
        {RULES.map((r, i) => (
          <div className={`ssm-rule ${i === 0 ? "warn" : ""}`} key={r.t}>
            <span className="ssm-rule-ic">
              {i === 0 ? (
                <>
                  <span className="ic-a">
                    <Icon name="alert" size={10} />
                  </span>
                  <span className="ic-c">
                    <Icon name="check" size={10} />
                  </span>
                </>
              ) : (
                <Icon name="check" size={10} />
              )}
            </span>
            <div>
              <b>{r.t}</b>
              <small className="ssm-rule-s">
                {i === 0 ? "Vikram T. at 51 hrs — over limit" : r.s}
              </small>
              {i === 0 && (
                <small className="ssm-fixed">
                  Auto-fixed: Sun shift moved · now 43 hrs
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STAGES = [PlanStage, SwapStage, LiveStage, ComplianceStage];

/* ------------------------------------------------------------------ */
/* Roster app (left side)                                              */
/* ------------------------------------------------------------------ */

function Pill({ code, alt }) {
  return (
    <span
      className={`ssm-pill ${code} ${alt ? "alt" : "base"}`}
      data-s={code === "O" ? "–" : code}
    >
      <em>{SHIFTS[code].label}</em>
    </span>
  );
}

function RosterApp({ frameRef, stage, onSelect }) {
  const first = useRef(true);
  const delay = first.current ? 1.3 : 0.15;
  useEffect(() => {
    first.current = false;
  }, []);

  const Stage = STAGES[stage];
  const todayCov = coverage(TODAY);

  return (
    <div className="ssm-frame" ref={frameRef}>
      <div className="ssm-chrome">
        <span className="ssm-dot r" />
        <span className="ssm-dot y" />
        <span className="ssm-dot g" />
        <div className="ssm-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/shifts/roster
        </div>
      </div>

      <div className="ssm-app">
        <aside className="ssm-side js-side">
          <div className="ssm-brand">
            <span
              style={{
                background: "#fff",
                padding: 3,
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <img
                src={I("ngriffinpay-mark.png")}
                alt="NGriffinpay"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </span>
            <b>Admin</b>
          </div>
          <nav className="ssm-nav" aria-hidden>
            <span className="is-on">
              <Icon name="grid" size={12} /> Roster
            </span>
            <span>
              <Icon name="swap" size={12} /> Swap requests <em>2</em>
            </span>
            <span>
              <Icon name="users" size={12} /> Teams
            </span>
            <span>
              <Icon name="chart" size={12} /> Reports
            </span>
          </nav>
          <div className="ssm-ring">
            <svg viewBox="0 0 80 80" aria-hidden>
              <circle cx="40" cy="40" r="32" className="ssm-ring-bg" />
              <circle
                cx="40"
                cy="40"
                r="32"
                className="ssm-ring-fg js-ring"
                pathLength="100"
              />
            </svg>
            <div>
              <strong>96%</strong>
              <small>Coverage today</small>
            </div>
          </div>
          <div className="ssm-legend">
            {["M", "G", "N", "L"].map((c) => (
              <span key={c}>
                <i className={`ssm-sw ${c}`} />
                {SHIFTS[c].label}
              </span>
            ))}
          </div>
        </aside>

        <div className="ssm-main">
          <div className="ssm-bar js-tabs">
            <div className="ssm-week">
              <button type="button" tabIndex={-1} aria-hidden>
                <Icon name="chev" size={11} />
              </button>
              <b>2 – 8 Nov 2026</b>
              <button type="button" tabIndex={-1} aria-hidden>
                <Icon name="chevr" size={11} />
              </button>
            </div>
            <div
              className="ssm-tabs"
              role="tablist"
              aria-label="Shift features"
            >
              {FEATURES.map((f, i) => (
                <button
                  type="button"
                  key={f.tab}
                  className={stage === i ? "is-on" : ""}
                  onClick={() => onSelect(i)}
                  role="tab"
                  aria-selected={stage === i}
                >
                  <Icon name={f.icon} size={10} /> {f.tab}
                </button>
              ))}
            </div>
            <span className="ssm-auto">
              <Icon name="spark" size={10} /> Auto-schedule
            </span>
          </div>

          <div className="ssm-grid-wrap js-grid">
            <span className="ssm-today" aria-hidden style={{ "--i": TODAY }} />
            <span className="ssm-now" aria-hidden style={{ "--i": TODAY }}>
              Now · 10:42
            </span>
            <span className="ssm-pill N ssm-ghost" aria-hidden data-s="N">
              <em>Night</em>
            </span>

            <div className="ssm-row ssm-headrow">
              <span className="ssm-name">Team · Ops</span>
              {DAYS.map(([d, n], i) => (
                <span
                  key={d}
                  className={`ssm-dh ${i === TODAY ? "is-today" : ""}`}
                >
                  <small>{d}</small>
                  <b>{n}</b>
                </span>
              ))}
              <span className="ssm-hh">Hrs</span>
            </div>

            {TEAM.map((t, r) => (
              <div
                className={`ssm-row r-${r} ${t.status === "late" ? "is-late" : ""}`}
                key={t.name}
              >
                <span className="ssm-name">
                  <span className="ssm-av">{t.av}</span>
                  <b>{t.name}</b>
                  <i className={`ssm-st ${t.status}`} title={t.status} />
                </span>
                {[...t.row].map((c, d) => {
                  const key = `${r}-${d}`;
                  return (
                    <span className={`ssm-cell c-${key}`} key={key}>
                      <Pill code={c} />
                      {ALTS[key] && <Pill code={ALTS[key]} alt />}
                    </span>
                  );
                })}
                <span className="ssm-hrs">
                  <b>{hoursOf(t.row)}</b>
                  <i
                    style={{
                      transform: `scaleX(${Math.min(1, hoursOf(t.row) / 56)})`,
                    }}
                  />
                </span>
              </div>
            ))}

            <div className="ssm-row ssm-cov">
              <span className="ssm-name">
                <small>Coverage</small>
              </span>
              {DAYS.map(([d], i) => (
                <span key={d}>
                  <b className={coverage(i) >= 5 ? "ok" : "lo"}>
                    {coverage(i)}/7
                  </b>
                </span>
              ))}
              <span />
            </div>
          </div>

          <div className="ssm-act-wrap">
            <Stage key={stage} delay={delay} />
          </div>
        </div>
      </div>
      <span className="ssm-sr">
        Today: {todayCov} of 7 team members scheduled.
      </span>
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

  // auto-advance through the 4 features
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

  // entrance, floating cards, parallax, mouse tilt
  useLayoutEffect(() => {
    const reduce = prefersReduced();
    let cleanup = () => {};
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
      tl.fromTo(
        q(".js-ring"),
        { strokeDasharray: "0 100" },
        { strokeDasharray: "96 100", duration: 1.2, ease: "power2.out" },
        0.8,
      );
      tl.from(q(".js-tabs"), { y: -10, opacity: 0, duration: 0.45 }, 0.7);
      tl.from(
        q(".ssm-headrow > *"),
        { y: -8, opacity: 0, stagger: 0.04, duration: 0.35 },
        0.8,
      );
      tl.from(
        q(".ssm-row:not(.ssm-headrow) .ssm-name"),
        { x: -12, opacity: 0, stagger: 0.05, duration: 0.35 },
        0.9,
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
        1.6,
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
          delay: 2.3,
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
          ry(((e.clientX - r.left) / r.width - 0.5) * 5);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 3);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        wrap.addEventListener("mousemove", move);
        wrap.addEventListener("mouseleave", leave);
        cleanup = () => {
          wrap.removeEventListener("mousemove", move);
          wrap.removeEventListener("mouseleave", leave);
        };
      }
    }, sectionRef);
    return () => {
      cleanup();
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="ssm-hero"
      ref={sectionRef}
      aria-labelledby="ssm-hero-title"
    >
      <div className="ssm-hero-bg" aria-hidden>
        <span className="ssm-blob b1 js-blob" />
        <span className="ssm-blob b2 js-blob" />
        <span className="ssm-grid-bg" />
      </div>

      <div className="ssm-container ssm-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="ssm-content">
          <span className="ssm-eyebrow js-reveal">
            <span className="ssm-live-dot" /> Smart rostering for every shift
          </span>
          <h1 id="ssm-hero-title" className="ssm-title js-reveal">
            Shift &amp; <span className="ssm-grad">Scheduling Management</span>
          </h1>

          <ul className="ssm-feats" role="tablist" aria-label="Shift features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`ssm-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="ssm-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="ssm-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="ssm-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: roster app */}
        <div className="ssm-visual" ref={visualRef}>
          <RosterApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="ssm-float f1 js-float">
            <span className="ssm-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>0 scheduling conflicts</strong>
              <small>Every shift covered</small>
            </div>
          </div>
          <div className="ssm-float f2 js-float">
            <span className="ssm-float-ic pr">
              <Icon name="shield" size={14} />
            </span>
            <div>
              <strong>Labour-law ready</strong>
              <small>Hours checked automatically</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — 3D shift floor (isometric board + three.js time ribbons) */
/* ------------------------------------------------------------------ */

const BOARD_TABS = [
  {
    key: "rotations",
    label: "Create Rotations",
    icon: "rotate",
    title: [
      ["Create", 1],
      [" smart shift ", 0],
      ["rotations", 1],
    ],
    desc: "Design fixed or rotating schedules with ease, ensuring optimal staffing for every shift.",
    stats: [
      ["3", "Teams rotating"],
      ["Weekly", "Rotation cycle"],
      ["100%", "Shifts staffed"],
    ],
    note: "Teams move Morning → General → Night every week, automatically.",
  },
  {
    key: "assign",
    label: "Assign Shifts",
    icon: "assign",
    title: [
      ["Assign", 1],
      [" shifts ", 0],
      ["effortlessly", 1],
    ],
    desc: "Quickly allocate employees to shifts based on availability and skill requirements.",
    stats: [
      ["9", "People assigned"],
      ["9 / 9", "Skill matches"],
      ["0", "Double bookings"],
    ],
    note: "Each person is placed only where they're available and qualified.",
  },
  {
    key: "exceptions",
    label: "Manage Exceptions",
    icon: "alert",
    title: [
      ["Manage", 1],
      [" scheduling ", 0],
      ["exceptions", 1],
    ],
    desc: "Handle last-minute changes, emergencies, and holidays without disrupting workflows.",
    stats: [
      ["40s", "To find cover"],
      ["1", "Holiday applied"],
      ["0", "Gaps left"],
    ],
    note: "Sick call? A qualified standby is moved in and everyone is notified.",
  },
  {
    key: "automate",
    label: "Automate Scheduling",
    icon: "bolt",
    title: [
      ["Automate", 1],
      [" scheduling ", 0],
      ["processes", 1],
    ],
    desc: "Use automation to prevent conflicts, reduce errors, and save hours of manual planning.",
    stats: [
      ["3 → 0", "Conflicts fixed"],
      ["6 hrs", "Saved weekly"],
      ["2.4s", "To publish"],
    ],
    note: "One scan finds overlaps and moves everyone into a clean, legal slot.",
  },
  {
    key: "visibility",
    label: "Real-time Visibility",
    icon: "eye",
    title: [
      ["Gain", 1],
      [" real-time ", 0],
      ["visibility", 1],
    ],
    desc: "Monitor schedules and shift coverage live, making quick adjustments as needed.",
    stats: [
      ["3 / 3", "On shift now"],
      ["100%", "Coverage"],
      ["2h 18m", "Next handover"],
    ],
    note: "See who's working right now and what's coming next, as it happens.",
  },
];
const BOARD_TIME = 8;
const RIBBON_COLORS = ["#1d6fd8", "#10b981", "#f59e0b", "#38bdf8", "#6366f1"];

// Board geometry (px, on the flat floor before it is tilted)
const LANES = [
  { name: "Morning", time: "06:00 – 14:00", cls: "m" },
  { name: "General", time: "09:00 – 18:00", cls: "g" },
  { name: "Night", time: "22:00 – 06:00", cls: "n" },
];
const SLOT = (lane, slot) => [190 + slot * 104, 62 + lane * 92];
const POOL = (i) => [150 + i * 44, 338];

const CREW = [
  { av: "AK", skill: "Lead" },
  { av: "PS", skill: "Support" },
  { av: "MR", skill: "Billing" },
  { av: "RD", skill: "Lead" },
  { av: "SP", skill: "Support" },
  { av: "VT", skill: "Billing" },
  { av: "FA", skill: "Lead" },
  { av: "JD", skill: "Support" },
  { av: "NS", skill: "Billing" },
  { av: "DV", skill: "Standby" },
];
const STANDBY = 9;
const HOME = CREW.map((_, i) =>
  i === STANDBY ? POOL(9) : SLOT(Math.floor(i / 3), i % 3),
);
// deliberately messy start for the "automate" tab (two clashes + one stray)
const MESSY = [
  [200, 70],
  [210, 76],
  [395, 55],
  [300, 160],
  [176, 248],
  [520, 150],
  [470, 250],
  [300, 238],
  [305, 244],
  POOL(9),
];
const MESSY_ALERT = [0, 1, 7, 8, 5];

function BoardIcon({ name }) {
  const p = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "rotate":
      return (
        <svg {...p}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      );
    case "assign":
      return (
        <svg {...p}>
          <circle cx="9" cy="7" r="4" />
          <path d="M2 21v-2a4 4 0 0 1 4-4h6" />
          <path d="m16 19 2 2 4-4" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...p}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* three.js: three flowing "time ribbons" of particles behind the board */
function useTimeRibbons(canvasRef, wrapRef, colorIndex) {
  const api = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch (e) {
      return undefined; // no WebGL: section still works without the background
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    // round sprite for points
    const dot = document.createElement("canvas");
    dot.width = dot.height = 64;
    const g = dot.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.4, "rgba(255,255,255,0.7)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(dot);

    const PER = 320;
    const COUNT = PER * 3;
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      seed[i * 2] = Math.random() * 28 - 14; // x
      seed[i * 2 + 1] = (Math.random() - 0.5) * 1.2; // spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      map: sprite,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      color: new THREE.Color(RIBBON_COLORS[0]),
      blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(geo, mat);
    points.rotation.z = -0.12;
    scene.add(points);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const reduce = prefersReduced();
    let t = 0;
    let visible = true;
    const draw = () => {
      for (let i = 0; i < COUNT; i++) {
        const k = Math.floor(i / PER);
        let x = seed[i * 2] + t * (0.6 + k * 0.15);
        x = ((((x + 14) % 28) + 28) % 28) - 14; // wrap left→right like time passing
        pos[i * 3] = x;
        pos[i * 3 + 1] =
          (k - 1) * 2.2 +
          Math.sin(x * 0.35 + t * 0.6 + k * 1.7) * 0.7 +
          seed[i * 2 + 1];
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    const tick = (time, delta) => {
      if (!visible) return;
      t += (delta || 16) / 1000;
      draw();
    };
    if (reduce) draw();
    else gsap.ticker.add(tick);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    api.current = {
      color: (hex) => {
        const c = new THREE.Color(hex);
        gsap.to(mat.color, {
          r: c.r,
          g: c.g,
          b: c.b,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => reduce && draw(),
        });
      },
    };

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      renderer.dispose();
      api.current = null;
    };
  }, [canvasRef, wrapRef]);

  useEffect(() => {
    api.current?.color(RIBBON_COLORS[colorIndex]);
  }, [colorIndex]);
}

function ScheduleBoardSection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const boardRef = useRef(null);
  const textRef = useRef(null);
  const barRefs = useRef([]);
  const firstRun = useRef(true);

  useTimeRibbons(canvasRef, sectionRef, active);

  // start auto-play when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-advance tabs
  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (!inView || prefersReduced()) return undefined;
    const bar = barRefs.current[active];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: BOARD_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(BOARD_TIME, () =>
      setActive((a) => (a + 1) % BOARD_TABS.length),
    );
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, inView]);

  // heading + board entrance (once)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.set(q(".ssb-tok"), { x: (i) => HOME[i][0], y: (i) => HOME[i][1] });
      if (prefersReduced()) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
      tl.from(q(".ssb-title .w"), {
        yPercent: 110,
        opacity: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          q(".ssb-tab"),
          {
            y: 20,
            opacity: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: "power3.out",
          },
          0.3,
        )
        .from(
          q(".ssb-lift"),
          { y: 90, scale: 0.85, opacity: 0, duration: 1.2, ease: "expo.out" },
          0.4,
        )
        .from(
          q(".ssb-lane"),
          {
            scaleX: 0,
            transformOrigin: "0% 50%",
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          0.8,
        )
        .from(
          q(".ssb-body"),
          {
            y: -120,
            opacity: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "bounce.out",
          },
          1.1,
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // text panel swap
  useLayoutEffect(() => {
    if (!textRef.current) return undefined;
    const q = gsap.utils.selector(textRef);
    const tl = gsap.timeline();
    tl.fromTo(
      q(".js-t"),
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" },
    );
    tl.fromTo(
      q(".ssb-stat"),
      { y: 14, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        duration: 0.45,
        ease: "back.out(1.8)",
      },
      0.2,
    );
    if (prefersReduced()) tl.progress(1);
    return () => tl.kill();
  }, [active]);

  // board story for the active tab
  useLayoutEffect(() => {
    const root = boardRef.current;
    if (!root || !started) return undefined;
    const q = gsap.utils.selector(root);
    const qs = gsap.utils.selector(sectionRef);
    const toks = q(".ssb-tok");
    const bodies = q(".ssb-body");
    const reduce = prefersReduced();
    const delay = firstRun.current ? 2.2 : 0;
    firstRun.current = false;

    // reset looks
    root.dataset.tab = BOARD_TABS[active].key;
    toks.forEach((t) =>
      t.classList.remove("is-alert", "is-ok", "is-on", "is-dim", "is-out"),
    );
    q(".ssb-slot").forEach((s) => s.classList.remove("is-filled"));
    q(".ssb-lane").forEach((l) => l.classList.remove("is-live", "is-dim"));

    const hop = (tl, i, at, h = 34) =>
      tl.to(
        bodies[i],
        {
          keyframes: [
            { y: -h, duration: 0.28, ease: "power2.out" },
            { y: 0, duration: 0.32, ease: "bounce.out" },
          ],
        },
        at,
      );
    const moveTo = (tl, i, [x, y], at, d = 0.6) => {
      tl.to(toks[i], { x, y, duration: d, ease: "power2.inOut" }, at);
      hop(tl, i, at + d * 0.05, 30);
    };
    const cls = (tl, el, c, on, at) =>
      tl.call(() => el && el.classList[on ? "add" : "remove"](c), null, at);
    const count = (
      tl,
      el,
      from,
      to,
      at,
      dur = 1,
      fmt = (v) => Math.round(v),
    ) => {
      if (!el) return;
      const o = { v: from };
      el.textContent = fmt(from);
      tl.to(
        o,
        {
          v: to,
          duration: dur,
          ease: "power2.out",
          onUpdate: () => (el.textContent = fmt(o.v)),
        },
        at,
      );
    };

    const tl = gsap.timeline({ delay });
    const key = BOARD_TABS[active].key;
    const start =
      key === "assign"
        ? CREW.map((_, i) => POOL(i))
        : key === "automate"
          ? MESSY
          : HOME;
    toks.forEach((t, i) =>
      tl.to(
        t,
        {
          x: start[i][0],
          y: start[i][1],
          opacity: 1,
          duration: 0.6,
          ease: "power3.inOut",
        },
        0,
      ),
    );
    tl.to(bodies, { y: 0, opacity: 1, duration: 0.3 }, 0);

    if (key === "rotations") {
      const week = q(".js-week")[0];
      let lanes = CREW.map((_, i) => Math.floor(i / 3));
      for (let w = 1; w <= 3; w++) {
        const at = 0.9 + (w - 1) * 2;
        tl.call(() => week && (week.textContent = `Week ${w + 1}`), null, at);
        tl.fromTo(
          q(".ssb-rot"),
          { rotation: 0 },
          { rotation: 360, duration: 0.9, ease: "power2.inOut" },
          at,
        );
        lanes = lanes.map((l) => (l + 1) % 3);
        CREW.forEach((_, i) => {
          if (i === STANDBY) return;
          moveTo(tl, i, SLOT(lanes[i], i % 3), at + (i % 3) * 0.06, 0.8);
        });
      }
      tl.call(() => week && (week.textContent = "Week 1"), null, 6.9);
    }

    if (key === "assign") {
      const slots = q(".ssb-slot");
      const n = qs(".js-assigned")[0];
      count(tl, n, 0, 9, 0.8, 9 * 0.42);
      CREW.forEach((_, i) => {
        if (i === STANDBY) return;
        const at = 0.8 + i * 0.42;
        moveTo(tl, i, HOME[i], at, 0.55);
        cls(
          tl,
          slots[Math.floor(i / 3) * 4 + (i % 3)],
          "is-filled",
          true,
          at + 0.5,
        );
        cls(tl, toks[i], "is-ok", true, at + 0.5);
      });
    }

    if (key === "exceptions") {
      const sick = 4;
      cls(tl, toks[sick], "is-alert", true, 0.9);
      tl.fromTo(
        q(".ssb-bubble.sick"),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" },
        1,
      );
      tl.to(q(".ssb-bubble.sick"), { opacity: 0, duration: 0.25 }, 2.4);
      cls(tl, toks[sick], "is-out", true, 2.3);
      moveTo(tl, sick, [560, 338], 2.3, 0.7);
      moveTo(tl, STANDBY, HOME[sick], 2.7, 0.8);
      cls(tl, toks[STANDBY], "is-ok", true, 3.5);
      tl.fromTo(
        q(".ssb-bubble.cover"),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" },
        3.5,
      );
      tl.fromTo(
        q(".ssb-holiday"),
        { opacity: 0, z: 60 },
        { opacity: 1, z: 0, duration: 0.5, ease: "bounce.out" },
        4.4,
      );
      tl.to(q(".ssb-bubble.cover"), { opacity: 0, duration: 0.3 }, 6.2);
    }

    if (key === "automate") {
      MESSY_ALERT.forEach((i) => cls(tl, toks[i], "is-alert", true, 0.4));
      const c = qs(".js-conf")[0];
      if (c) c.textContent = "3";
      tl.fromTo(
        q(".ssb-beam"),
        { x: 120, opacity: 0 },
        { x: 140, opacity: 1, duration: 0.2 },
        1,
      );
      tl.to(q(".ssb-beam"), { x: 600, duration: 2.6, ease: "none" }, 1.2);
      tl.to(q(".ssb-beam"), { opacity: 0, duration: 0.3 }, 3.8);
      CREW.forEach((_, i) => {
        if (i === STANDBY) return;
        const at =
          1.2 + ((Math.min(MESSY[i][0], HOME[i][0]) - 140) / 460) * 2.6;
        moveTo(tl, i, HOME[i], at, 0.5);
        cls(tl, toks[i], "is-alert", false, at + 0.3);
        cls(tl, toks[i], "is-ok", true, at + 0.3);
      });
      tl.call(() => c && (c.textContent = "2"), null, 1.8);
      tl.call(() => c && (c.textContent = "1"), null, 2.6);
      tl.call(() => c && (c.textContent = "0"), null, 3.4);
    }

    if (key === "visibility") {
      const lanes = q(".ssb-lane");
      cls(tl, lanes[0], "is-live", true, 0.7);
      cls(tl, lanes[1], "is-dim", true, 0.7);
      cls(tl, lanes[2], "is-dim", true, 0.7);
      [0, 1, 2].forEach((i) => cls(tl, toks[i], "is-on", true, 0.9 + i * 0.15));
      [3, 4, 5, 6, 7, 8, STANDBY].forEach((i) =>
        cls(tl, toks[i], "is-dim", true, 0.8),
      );
      tl.fromTo(
        q(".ssb-now"),
        { x: 0 },
        { x: 300, duration: 6, ease: "none" },
        0.7,
      );
      const on = qs(".js-on")[0];
      count(tl, on, 0, 3, 1, 0.8);
    }

    if (reduce) tl.progress(1);
    return () => tl.kill();
  }, [active, started]);

  const tab = BOARD_TABS[active];

  return (
    <section className="ssb" ref={sectionRef} aria-labelledby="ssb-title">
      <canvas className="ssb-canvas" ref={canvasRef} aria-hidden />
      <div className="ssb-veil" aria-hidden />

      <div className="ssm-container ssb-inner">
        <h2 id="ssb-title" className="ssb-title">
          {[
            ["Plan", 1],
            ["smarter,", 0],
            ["assign", 1],
            ["with", 0],
            ["ease,", 0],
            ["and", 1],
            ["optimize", 0],
            ["workforce", 0],
            ["schedules", 0],
          ].map(([w, hl], i) => (
            <span className="wm" key={i}>
              <span className={`w ${hl ? "hl" : ""}`}>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="ssb-tabs"
          role="tablist"
          aria-label="Shift scheduling capabilities"
        >
          {BOARD_TABS.map((t, i) => (
            <button
              type="button"
              role="tab"
              key={t.key}
              aria-selected={active === i}
              className={`ssb-tab ${active === i ? "is-on" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="ssb-tab-ic">
                <BoardIcon name={t.icon} />
              </span>
              <span>{t.label}</span>
              <span className="ssb-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="ssb-body-grid">
          <div
            className="ssb-text"
            ref={textRef}
            role="tabpanel"
            aria-live="polite"
          >
            <span className="ssb-step js-t">0{active + 1} / 05</span>
            <h3 className="js-t">
              {tab.title.map(([t, hl], i) =>
                hl ? (
                  <span className="hl" key={i}>
                    {t}
                  </span>
                ) : (
                  <span key={i}>{t}</span>
                ),
              )}
            </h3>
            <p className="js-t">{tab.desc}</p>
            <div className="ssb-stats">
              {tab.stats.map(([v, l], i) => (
                <div className="ssb-stat" key={l}>
                  <strong
                    className={
                      i === 0
                        ? {
                            assign: "js-assigned",
                            automate: "js-conf",
                            visibility: "js-on",
                          }[tab.key] || ""
                        : ""
                    }
                  >
                    {tab.key === "automate" && i === 0
                      ? "0"
                      : tab.key === "assign" && i === 0
                        ? "9"
                        : tab.key === "visibility" && i === 0
                          ? "3"
                          : v}
                  </strong>
                  {tab.key === "visibility" && i === 0 && (
                    <span className="ssb-of"> / 3</span>
                  )}
                  <small>
                    {tab.key === "automate" && i === 0 ? "Conflicts left" : l}
                  </small>
                </div>
              ))}
            </div>
            <p className="ssb-note js-t">
              <span className="ssb-note-dot" /> {tab.note}
            </p>
          </div>

          <div className="ssb-stage" aria-hidden>
            <div className="ssb-scaler">
              <div className="ssb-lift">
                <div className="ssb-plane" ref={boardRef} data-tab="rotations">
                  <span className="ssb-edge" />
                  {LANES.map((l, li) => (
                    <div
                      className={`ssb-lane ${l.cls}`}
                      key={l.name}
                      style={{ top: 22 + li * 92 }}
                    >
                      <div className="ssb-lane-label">
                        <b>{l.name}</b>
                        <small>{l.time}</small>
                      </div>
                      {[0, 1, 2, 3].map((s) => (
                        <span
                          className="ssb-slot"
                          key={s}
                          style={{ left: 190 + s * 104 - 40 }}
                        />
                      ))}
                    </div>
                  ))}
                  <div className="ssb-pool">
                    <small>Standby &amp; pool</small>
                  </div>
                  <svg className="ssb-rot" viewBox="0 0 40 40">
                    <path d="M34 20a14 14 0 1 1-4.1-9.9" />
                    <path d="M30 4v7h-7" />
                  </svg>
                  <span className="ssb-week js-week">Week 1</span>
                  <span className="ssb-beam" />
                  <span className="ssb-now" />
                  <span className="ssb-holiday">
                    🎉 Holiday · 14 Nov · Night covered at 2×
                  </span>

                  {CREW.map((c, i) => (
                    <div
                      className={`ssb-tok ${i === STANDBY ? "standby" : ""}`}
                      key={c.av}
                    >
                      <span className="ssb-shadow" />
                      <div className="ssb-bb">
                        <div className="ssb-body">
                          {i === 4 && (
                            <span className="ssb-bubble sick">Sick leave</span>
                          )}
                          {i === STANDBY && (
                            <span className="ssb-bubble cover">Covering ✓</span>
                          )}
                          <span className="ssb-av">{c.av}</span>
                          <span className="ssb-skill">{c.skill}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
    q: "What is shift & scheduling management in NGriffinpay?",
    a: "NGriffinpay’s Shift & Scheduling Management module helps you plan, assign, and manage employee shifts with accuracy and flexibility, ensuring smooth operations across your workforce.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "module",
      "shift management",
      "scheduling management",
      "feature",
    ],
  },
  {
    q: "Can I create rotational shift patterns?",
    a: "Yes, you can create and manage rotational shift schedules—daily, weekly, or custom cycles—based on business needs and employee availability.",
    keys: [
      "rotation",
      "rotational",
      "rotating",
      "pattern",
      "cycle",
      "weekly",
      "daily",
      "custom",
      "roster",
    ],
  },
  {
    q: "How are shift exceptions handled?",
    a: "NGriffinpay allows real-time handling of shift exceptions like absenteeism, late arrivals, or shift swaps, with manager alerts and approval workflows.",
    keys: [
      "exception",
      "absent",
      "absenteeism",
      "late",
      "swap",
      "change",
      "sick",
      "leave",
      "emergency",
      "approval",
    ],
  },
  {
    q: "Can employees view their shift schedules?",
    a: "Yes, employees can view their upcoming shifts, swap requests, and changes through the self-service portal or mobile app, keeping them informed at all times.",
    keys: [
      "employee",
      "view",
      "see",
      "my shift",
      "mobile",
      "app",
      "portal",
      "self-service",
      "self service",
      "notify",
    ],
  },
  {
    q: "Does it support auto-scheduling?",
    a: "Absolutely. NGriffinpay can auto-generate shifts based on rules like location, skills, workload, and labor laws, helping reduce manual errors and save time.",
    keys: [
      "auto",
      "automatic",
      "automate",
      "auto-schedul",
      "generate",
      "rule",
      "skill",
      "location",
      "labour",
      "labor",
      "workload",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about shifts and scheduling.";
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
      <div className="ssq-row bot" ref={ref}>
        <span className="ssq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="ssq-bubble bot ssq-typing"
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
      <div className="ssq-row user" ref={ref}>
        <div className="ssq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="ssq-row bot" ref={ref}>
      <span className="ssq-bot-av" aria-hidden>
        N
      </span>
      <div className="ssq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="ssq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function ShiftFaqSection() {
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
      gsap.from(q(".ssq-chat"), {
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
    <section className="ssq" ref={sectionRef} aria-labelledby="ssq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="ssm-container ssq-grid">
        <div className="ssq-left">
          <span className="ssq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="ssq-title" className="ssq-title js-faq-reveal">
            Shift &amp; Scheduling Management –{" "}
            <span className="ssm-grad">FAQs</span>
          </h2>
          <p className="ssq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="ssq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`ssq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="ssq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="ssq-q-text">{f.q}</span>
                  <span className="ssq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ssq-chat">
          <div className="ssq-chat-head">
            <span className="ssq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="ssq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="ssq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="ssq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="ssq-suggest" aria-label="Suggested questions">
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

          <form className="ssq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about shifts, rosters or swaps…"
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

export default function ShiftScheduling() {
  return (
    <div className="ssm-page">
      <HeroSection />
      <span id="ssm-next" />
      <ScheduleBoardSection />
      <ShiftFaqSection />
    </div>
  );
}
