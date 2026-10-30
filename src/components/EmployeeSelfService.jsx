// EmployeeSelfService.jsx
// NGriffinpay — Product inner page: "Employee Self-Service Portal with Mobile App"
// Section 1: Hero banner (web portal + mobile app on the left, content on the right)
// Section 2: App showcase (3D phone coverflow with 5 live app screens)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EmployeeSelfService.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Access Anytime",
    icon: "wallet",
    desc: "Employees can check payslips, leave balances, and HR policies on the go.",
  },
  {
    title: "Submit Instantly",
    icon: "send",
    desc: "Leave requests, expense claims, and reimbursements made seamless.",
  },
  {
    title: "Stay Connected",
    icon: "chat",
    desc: "Engage with company updates, announcements, and peer recognition posts.",
  },
  {
    title: "Full Transparency",
    icon: "eye",
    desc: "View performance feedback, appraisal history, and work schedules in real time.",
  },
  {
    title: "Reduce HR Dependency",
    icon: "user",
    desc: "Let employees manage routine tasks without waiting for HR intervention.",
  },
  {
    title: "Secure & Compliant",
    icon: "shield",
    desc: "All data access is encrypted, audited, and controlled by permissions.",
  },
];

// What shows up on the web portal when the phone does something
const SYNC_EVENTS = [
  { icon: "wallet", text: "October payslip downloaded on mobile" },
  { icon: "send", text: "Leave request sent · awaiting approval" },
  { icon: "heart", text: "New kudos post from your team" },
  { icon: "eye", text: "Appraisal history viewed" },
  { icon: "user", text: "Bank details updated · no HR ticket" },
  { icon: "shield", text: "Biometric login verified" },
];
const PORTAL_FOCUS = [0, 1, 2, 3, null, null]; // which portal widget glows per stage

const STAGE_TIME = 4.8;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const inr = (v) => Math.round(v).toLocaleString("en-IN");

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
    case "wallet":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 13h.01M2 10h20" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
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
    case "heart":
      return (
        <svg {...p}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case "download":
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "home":
      return (
        <svg {...p}>
          <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "sync":
      return (
        <svg {...p}>
          <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8" />
          <path d="M21 3v5h-5M3 21v-5h5" />
        </svg>
      );
    case "star":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "finger":
      return (
        <svg {...p}>
          <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
          <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
          <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
          <path d="M2 12a10 10 0 0 1 18-6" />
          <path d="M2 16h.01" />
          <path d="M21.8 16c.2-2 .131-5.354 0-6" />
          <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
          <path d="M8.65 22c.21-.66.45-1.32.57-2" />
          <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...p}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
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
    case "camera":
      return (
        <svg {...p}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case "upload":
      return (
        <svg {...p}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 18h2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Phone screens — one per feature                                     */
/* ------------------------------------------------------------------ */

function useScreenTimeline(build, delay) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay });
      tl.from(q(".js-in"), {
        y: 16,
        opacity: 0,
        stagger: 0.07,
        duration: 0.45,
        ease: "power3.out",
      });
      build(tl, q);
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// 1 — Access Anytime: payslip
function PayslipScreen({ delay }) {
  const ref = useScreenTimeline((tl, q) => {
    const net = q(".js-net")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 78400,
        duration: 1.3,
        ease: "power2.out",
        onUpdate: () => (net.textContent = inr(o.v)),
      },
      0.3,
    );
    tl.fromTo(
      q(".ess-split-bar i"),
      { scaleX: 0 },
      { scaleX: 1, stagger: 0.15, duration: 0.9, ease: "power2.out" },
      0.5,
    );
    tl.to(
      q(".js-tap"),
      { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1 },
      2.3,
    );
    tl.fromTo(
      q(".ess-ripple"),
      { scale: 0, opacity: 0.6 },
      { scale: 4, opacity: 0, duration: 0.6, ease: "power2.out" },
      2.3,
    );
    tl.call(
      () => {
        const b = q(".js-tap-label")[0];
        if (b) b.textContent = "Downloaded";
      },
      null,
      2.6,
    );
    tl.fromTo(
      q(".js-tap-ok"),
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
      2.6,
    );
  }, delay);

  return (
    <div className="ess-scr" ref={ref}>
      <div className="ess-scr-head js-in">
        <small>Payslip</small>
        <strong>October 2026</strong>
      </div>
      <div className="ess-net js-in">
        <small>Net pay</small>
        <strong>
          ₹<span className="js-net">0</span>
        </strong>
        <span className="ess-pill ok">
          <Icon name="check" size={9} /> Credited 31 Oct
        </span>
      </div>
      <div className="ess-split js-in">
        <div>
          <span>Earnings</span>
          <b>₹92,000</b>
          <span className="ess-split-bar">
            <i />
          </span>
        </div>
        <div>
          <span>Deductions</span>
          <b>₹13,600</b>
          <span className="ess-split-bar ded">
            <i />
          </span>
        </div>
      </div>
      <div className="ess-mini-row js-in">
        <div>
          <small>Leave balance</small>
          <b>12 days</b>
        </div>
        <div>
          <small>Holidays left</small>
          <b>4</b>
        </div>
      </div>
      <button
        type="button"
        tabIndex={-1}
        className="ess-phone-btn js-tap js-in"
      >
        <span className="ess-ripple" />
        <Icon name="download" size={13} />{" "}
        <span className="js-tap-label">Download PDF</span>
        <span className="ess-btn-ok js-tap-ok">
          <Icon name="check" size={10} />
        </span>
      </button>
    </div>
  );
}

// 2 — Submit Instantly: leave request with swipe-to-submit
const WEEK = [
  ["Mon", 3],
  ["Tue", 4],
  ["Wed", 5],
  ["Thu", 6],
  ["Fri", 7],
  ["Sat", 8],
  ["Sun", 9],
];

function LeaveScreen({ delay }) {
  const ref = useScreenTimeline((tl, q) => {
    const days = q(".ess-day");
    const reason = q(".js-reason")[0];
    const text = "Family function";
    const o = { n: 0 };
    tl.call(() => days[3]?.classList.add("is-sel"), null, 0.6);
    tl.call(() => days[4]?.classList.add("is-sel"), null, 0.9);
    tl.to(
      o,
      {
        n: text.length,
        duration: 0.9,
        ease: "none",
        onUpdate: () => (reason.textContent = text.slice(0, Math.round(o.n))),
      },
      1.1,
    );
    tl.to(
      q(".ess-swipe-knob"),
      {
        x: () => {
          const track = q(".ess-swipe")[0];
          const knob = q(".ess-swipe-knob")[0];
          return track.clientWidth - knob.offsetWidth - 8;
        },
        duration: 0.8,
        ease: "power2.inOut",
      },
      2.2,
    );
    tl.to(q(".ess-swipe-txt"), { opacity: 0, duration: 0.3 }, 2.3);
    tl.fromTo(
      q(".ess-done"),
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
      3.05,
    );
    tl.fromTo(
      q(".ess-done-ic"),
      { scale: 0 },
      { scale: 1, duration: 0.45, ease: "back.out(3)" },
      3.15,
    );
  }, delay);

  return (
    <div className="ess-scr" ref={ref}>
      <div className="ess-scr-head js-in">
        <small>Apply leave</small>
        <strong>Casual leave · 2 days</strong>
      </div>
      <div className="ess-types js-in">
        <span className="is-on">Casual</span>
        <span>Sick</span>
        <span>Earned</span>
      </div>
      <div className="ess-week js-in">
        {WEEK.map(([d, n]) => (
          <span className="ess-day" key={d}>
            <small>{d}</small>
            <b>{n}</b>
          </span>
        ))}
      </div>
      <div className="ess-field js-in">
        <small>Reason</small>
        <p>
          <span className="js-reason" />
          <i className="ess-caret" />
        </p>
      </div>
      <div className="ess-approver js-in">
        <span className="ess-av xs">RM</span> Goes to <b>Rahul M.</b> for
        approval
      </div>
      <div className="ess-swipe js-in">
        <span className="ess-swipe-knob">
          <Icon name="arrow" size={14} />
        </span>
        <span className="ess-swipe-txt">Swipe to submit</span>
      </div>
      <div className="ess-done">
        <span className="ess-done-ic">
          <Icon name="check" size={22} />
        </span>
        <strong>Request sent!</strong>
        <small>Rahul M. will be notified instantly</small>
      </div>
    </div>
  );
}

// 3 — Stay Connected: feed
function FeedScreen({ delay }) {
  const ref = useScreenTimeline((tl, q) => {
    const likes = q(".js-likes")[0];
    const o = { n: 23 };
    tl.fromTo(
      q(".ess-heart"),
      { scale: 1 },
      {
        scale: 1.45,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      },
      1.4,
    );
    tl.call(() => q(".ess-heart")[0]?.classList.add("is-on"), null, 1.45);
    tl.fromTo(
      q(".ess-burst i"),
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        x: (i) => Math.cos((i / 6) * Math.PI * 2) * 18,
        y: (i) => Math.sin((i / 6) * Math.PI * 2) * 18,
        duration: 0.55,
        ease: "power2.out",
      },
      1.45,
    );
    tl.to(
      o,
      {
        n: 24,
        duration: 0.2,
        onUpdate: () => (likes.textContent = Math.round(o.n)),
      },
      1.5,
    );
    tl.fromTo(
      q(".ess-comment"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      2.1,
    );
  }, delay);

  return (
    <div className="ess-scr" ref={ref}>
      <div className="ess-scr-head js-in">
        <small>Company feed</small>
        <strong>What’s happening</strong>
      </div>
      <div className="ess-post ann js-in">
        <span className="ess-post-tag">
          <Icon name="megaphone" size={10} /> Announcement
        </span>
        <strong>Diwali celebration 🪔</strong>
        <small>Friday, 4 PM · Cafeteria, Whitefield</small>
      </div>
      <div className="ess-post js-in">
        <div className="ess-post-top">
          <span className="ess-av xs">AR</span>
          <div>
            <b>Anita R.</b> recognised <b>Karthik V.</b>
            <small>2 min ago</small>
          </div>
        </div>
        <p>“Shipped the attendance report a day early. Superstar! 🌟”</p>
        <div className="ess-post-actions">
          <span className="ess-heart-wrap">
            <span className="ess-burst" aria-hidden>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="ess-heart">
              <Icon name="heart" size={13} />
            </span>
          </span>
          <b className="js-likes">23</b>
          <span className="ess-claps">👏 12</span>
        </div>
      </div>
      <div className="ess-comment">
        <span className="ess-av xs alt">PS</span>
        <span className="ess-typing">
          <i />
          <i />
          <i />
        </span>
        <small>Priya is commenting…</small>
      </div>
    </div>
  );
}

// 4 — Full Transparency: performance + schedule
function PerfScreen({ delay }) {
  const ref = useScreenTimeline((tl, q) => {
    const score = q(".js-score")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 4.6,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => (score.textContent = o.v.toFixed(1)),
      },
      0.3,
    );
    tl.fromTo(
      q(".ess-stars-fill"),
      { width: "0%" },
      { width: "92%", duration: 1.1, ease: "power2.out" },
      0.3,
    );
    tl.fromTo(
      q(".ess-hist i"),
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.12, duration: 0.6, ease: "back.out(1.6)" },
      0.8,
    );
    tl.from(
      q(".ess-shift"),
      { y: 10, opacity: 0, stagger: 0.06, duration: 0.3 },
      1.5,
    );
  }, delay);

  const hist = [
    ["FY23", 62],
    ["FY24", 74],
    ["FY25", 82],
    ["FY26", 92],
  ];
  const shifts = [
    ["M", "9:30"],
    ["T", "9:30"],
    ["W", "WFH"],
    ["T", "9:30"],
    ["F", "9:30"],
  ];

  return (
    <div className="ess-scr" ref={ref}>
      <div className="ess-scr-head js-in">
        <small>My performance</small>
        <strong>Mid-year review</strong>
      </div>
      <div className="ess-rating js-in">
        <strong className="js-score">0.0</strong>
        <div>
          <span className="ess-stars">
            <span className="ess-stars-bg">
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" size={13} />
              ))}
            </span>
            <span className="ess-stars-fill">
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" size={13} />
              ))}
            </span>
          </span>
          <small>Manager rating</small>
        </div>
      </div>
      <p className="ess-quote js-in">
        “Great ownership on the payroll revamp. Keep mentoring juniors.” — Rahul
        M.
      </p>
      <div className="ess-hist-wrap js-in">
        <small>Appraisal history</small>
        <div className="ess-hist">
          {hist.map(([y, h]) => (
            <span key={y}>
              <i style={{ height: `${h}%` }} />
              <small>{y}</small>
            </span>
          ))}
        </div>
      </div>
      <div className="ess-week-shifts js-in">
        {shifts.map(([d, t], i) => (
          <span className={`ess-shift ${i === 1 ? "is-today" : ""}`} key={i}>
            <small>{d}</small>
            <b>{t}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

// 5 — Reduce HR Dependency: self-service tasks
const SELF_TASKS = [
  "Update bank details",
  "Download Form 16",
  "Salary certificate",
  "Change address",
];

function SelfServeScreen({ delay }) {
  const ref = useScreenTimeline((tl, q) => {
    const rows = q(".ess-task");
    rows.forEach((r, i) => {
      const at = 0.5 + i * 0.45;
      tl.to(
        r.querySelector(".ess-spin"),
        { autoAlpha: 0, duration: 0.1 },
        at + 0.3,
      );
      tl.fromTo(
        r.querySelector(".ess-ok"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
        at + 0.3,
      );
      tl.to(
        r.querySelector(".ess-task-time"),
        { autoAlpha: 1, duration: 0.2 },
        at + 0.35,
      );
    });
    const saved = q(".js-saved")[0];
    const o = { n: 0 };
    tl.to(
      o,
      {
        n: 142,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => (saved.textContent = Math.round(o.n)),
      },
      2.1,
    );
  }, delay);

  return (
    <div className="ess-scr" ref={ref}>
      <div className="ess-scr-head js-in">
        <small>Self-service</small>
        <strong>Done in seconds</strong>
      </div>
      <ul className="ess-tasks">
        {SELF_TASKS.map((t, i) => (
          <li className="ess-task js-in" key={t}>
            <span className="ess-task-ic">
              <Icon name="file" size={12} />
            </span>
            <span className="ess-task-txt">{t}</span>
            <span className="ess-task-time">{20 + i * 6}s</span>
            <span className="ess-task-state">
              <span className="ess-spin" />
              <span className="ess-ok">
                <Icon name="check" size={10} />
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="ess-saved js-in">
        <small>HR tickets avoided this month</small>
        <strong>
          <span className="js-saved">0</span>
        </strong>
        <span>No waiting. No follow-ups.</span>
      </div>
    </div>
  );
}

// 6 — Secure & Compliant: biometric unlock
const SECURE_ITEMS = [
  "256-bit encryption",
  "Every access audit-logged",
  "Role-based permissions",
];
const FP_R = 34;
const FP_C = 2 * Math.PI * FP_R;

function SecureScreen({ delay }) {
  const ref = useScreenTimeline((tl, q) => {
    gsap.set(q(".ess-fp-arc"), {
      strokeDasharray: FP_C,
      strokeDashoffset: FP_C,
    });
    tl.to(
      q(".ess-fp-arc"),
      { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" },
      0.4,
    );
    tl.fromTo(
      q(".ess-fp-scan"),
      { top: "18%" },
      { top: "78%", duration: 0.6, repeat: 1, yoyo: true, ease: "sine.inOut" },
      0.4,
    );
    tl.call(() => q(".ess-fp")[0]?.classList.add("is-ok"), null, 1.65);
    tl.call(
      () => {
        const t = q(".js-fp-label")[0];
        if (t) t.textContent = "Identity verified";
      },
      null,
      1.65,
    );
    tl.fromTo(
      q(".ess-fp"),
      { scale: 1 },
      { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 },
      1.65,
    );
    tl.fromTo(
      q(".ess-sec-item"),
      { x: -12, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, stagger: 0.25, duration: 0.35, ease: "power3.out" },
      2,
    );
  }, delay);

  return (
    <div className="ess-scr ess-scr-secure" ref={ref}>
      <div className="ess-scr-head js-in center">
        <small>Secure sign-in</small>
        <strong className="js-fp-label">Touch to unlock</strong>
      </div>
      <div className="ess-fp js-in">
        <svg viewBox="0 0 80 80" aria-hidden>
          <circle cx="40" cy="40" r={FP_R} className="ess-fp-bg" />
          <circle cx="40" cy="40" r={FP_R} className="ess-fp-arc" />
        </svg>
        <span className="ess-fp-ic">
          <Icon name="finger" size={34} />
        </span>
        <span className="ess-fp-scan" />
      </div>
      <ul className="ess-sec">
        {SECURE_ITEMS.map((s) => (
          <li className="ess-sec-item" key={s}>
            <span>
              <Icon name="check" size={10} />
            </span>{" "}
            {s}
          </li>
        ))}
      </ul>
      <div className="ess-sec-foot js-in">
        <Icon name="lock" size={11} /> Session encrypted end-to-end
      </div>
    </div>
  );
}

const SCREENS = [
  PayslipScreen,
  LeaveScreen,
  FeedScreen,
  PerfScreen,
  SelfServeScreen,
  SecureScreen,
];

/* ------------------------------------------------------------------ */
/* Phone + web portal mockups (left side)                              */
/* ------------------------------------------------------------------ */

function Phone({ phoneRef, stage }) {
  const screenRef = useRef(null);
  const syncRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.15;

  useLayoutEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (isFirst || !screenRef.current) return;
    gsap.fromTo(
      screenRef.current.firstElementChild,
      { xPercent: 18, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
    );
    gsap.fromTo(
      syncRef.current,
      { rotation: 0 },
      { rotation: 360, duration: 0.8, ease: "power2.inOut" },
    );
  }, [stage]);

  const Screen = SCREENS[stage];

  return (
    <div className="ess-phone" ref={phoneRef}>
      <span className="ess-phone-btn-side" aria-hidden />
      <div className="ess-phone-inner">
        <div className="ess-island" />
        <div className="ess-status">
          <span>9:41</span>
          <span className="ess-status-right">
            <span className="ess-sync" ref={syncRef}>
              <Icon name="sync" size={9} />
            </span>{" "}
            5G ▮
          </span>
        </div>
        <div className="ess-phone-screen" ref={screenRef}>
          <Screen key={stage} delay={startDelay} />
        </div>
        <div className="ess-tabbar">
          <span className={stage === 0 || stage === 3 ? "is-on" : ""}>
            <Icon name="home" size={14} />
          </span>
          <span className={stage === 1 || stage === 4 ? "is-on" : ""}>
            <Icon name="grid" size={14} />
          </span>
          <span className={stage === 2 ? "is-on" : ""}>
            <Icon name="chat" size={14} />
          </span>
          <span className={stage === 5 ? "is-on" : ""}>
            <Icon name="user" size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Portal({ portalRef, stage }) {
  const [toasts, setToasts] = useState([]);
  const toastWrap = useRef(null);
  const idRef = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    const delay = first.current ? 2400 : 1600;
    first.current = false;
    const t = setTimeout(
      () => {
        const id = ++idRef.current;
        setToasts((list) =>
          [{ id, ...SYNC_EVENTS[stage] }, ...list].slice(0, 2),
        );
      },
      prefersReduced() ? 0 : delay,
    );
    return () => clearTimeout(t);
  }, [stage]);

  useLayoutEffect(() => {
    const el = toastWrap.current?.firstElementChild;
    if (el && !prefersReduced()) {
      gsap.fromTo(
        el,
        { x: 40, autoAlpha: 0, scale: 0.95 },
        { x: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
      );
    }
  }, [toasts]);

  const focus = PORTAL_FOCUS[stage];
  const week = [92, 100, 88, 96, 0];

  return (
    <div className="ess-portal" ref={portalRef}>
      <div className="ess-chrome">
        <span className="ess-dot r" />
        <span className="ess-dot y" />
        <span className="ess-dot g" />
        <div className="ess-url">
          <span aria-hidden>🔒</span> portal.ngriffinpay.in
        </div>
      </div>

      <div className="ess-portal-app">
        <aside className="ess-portal-side js-pside">
          <span className="ess-logo">N</span>
          {["home", "wallet", "calendar", "chat", "eye", "shield"].map(
            (ic, i) => (
              <span
                key={ic}
                className={`ess-side-ic ${i === 0 ? "is-on" : ""}`}
              >
                <Icon name={ic} size={14} />
              </span>
            ),
          )}
        </aside>

        <div className="ess-portal-main">
          <div className="ess-portal-top js-ptop">
            <div>
              <strong>Good morning, Priya 👋</strong>
              <small>Thursday, 29 October</small>
            </div>
            <span className="ess-portal-bell">
              <Icon name="bell" size={13} />
              <i />
            </span>
          </div>

          <div className="ess-widgets">
            <div className={`ess-w js-pw ${focus === 0 ? "is-focus" : ""}`}>
              <small>
                <Icon name="wallet" size={11} /> Latest payslip
              </small>
              <strong>₹78,400</strong>
              <span className="ess-w-sub">October · net pay</span>
            </div>
            <div className={`ess-w js-pw ${focus === 1 ? "is-focus" : ""}`}>
              <small>
                <Icon name="calendar" size={11} /> Leave balance
              </small>
              <div className="ess-leave">
                <span>
                  <b>8</b>Casual
                </span>
                <span>
                  <b>3</b>Sick
                </span>
                <span>
                  <b>1</b>Earned
                </span>
              </div>
            </div>
            <div
              className={`ess-w wide js-pw ${focus === 2 ? "is-focus" : ""}`}
            >
              <small>
                <Icon name="megaphone" size={11} /> Announcements
              </small>
              <ul className="ess-ann">
                <li>
                  <i />
                  Diwali celebration · Fri, 4 PM
                </li>
                <li>
                  <i />
                  New WFH policy is live
                </li>
              </ul>
            </div>
            <div
              className={`ess-w wide js-pw ${focus === 3 ? "is-focus" : ""}`}
            >
              <small>
                <Icon name="eye" size={11} /> My week
              </small>
              <div className="ess-wk">
                {["M", "T", "W", "T", "F"].map((d, i) => (
                  <span key={i}>
                    <i
                      style={{ height: `${week[i] || 8}%` }}
                      className={i === 4 ? "today" : ""}
                    />
                    <small>{d}</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ess-toasts" ref={toastWrap} aria-live="polite">
          {toasts.map((t) => (
            <div className="ess-toast" key={t.id}>
              <span className="ess-toast-ic">
                <Icon name={t.icon} size={12} />
              </span>
              <div>
                <strong>{t.text}</strong>
                <small>
                  <Icon name="sync" size={9} /> Synced from mobile · just now
                </small>
              </div>
            </div>
          ))}
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
  const portalRef = useRef(null);
  const phoneRef = useRef(null);
  const barRefs = useRef([]);
  const firstStage = useRef(true);
  const descRef = useRef(null);
  const firstDesc = useRef(true);

  // Auto-advance + progress bar in the active feature
  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (prefersReduced()) return;
    const extra = firstStage.current ? 1.2 : 0; // let the intro animation finish first
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

  // Description swap
  useLayoutEffect(() => {
    if (firstDesc.current) {
      firstDesc.current = false;
      return;
    }
    if (descRef.current && !prefersReduced()) {
      gsap.fromTo(
        descRef.current,
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" },
      );
    }
  }, [stage]);

  useLayoutEffect(() => {
    const reduce = prefersReduced();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.set([portalRef.current, phoneRef.current], {
        transformPerspective: 1400,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(
        q(".js-reveal"),
        { y: 28, opacity: 0, duration: 0.8, stagger: 0.07 },
        0.1,
      );
      tl.from(
        portalRef.current,
        {
          opacity: 0,
          y: 50,
          rotationX: 14,
          scale: 0.94,
          duration: 1.1,
          ease: "expo.out",
        },
        0.15,
      );
      tl.from(q(".js-pside"), { x: -14, opacity: 0, duration: 0.5 }, 0.55);
      tl.from(q(".js-ptop"), { y: -10, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(
        q(".js-pw"),
        { y: 16, opacity: 0, stagger: 0.07, duration: 0.5 },
        0.7,
      );
      tl.from(
        phoneRef.current,
        {
          opacity: 0,
          y: 140,
          rotation: 8,
          rotationY: -25,
          duration: 1.2,
          ease: "expo.out",
        },
        0.6,
      );
      tl.from(
        q(".js-float"),
        { opacity: 0, scale: 0.8, y: 16, duration: 0.6, ease: "back.out(1.7)" },
        1.5,
      );

      if (reduce) {
        tl.progress(1);
        return;
      }

      gsap.to(phoneRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.9,
      });
      gsap.to(q(".js-float"), {
        y: 8,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
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

      gsap.to(portalRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(q(".ess-phone-wrap"), {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Two-layer mouse parallax: phone moves more than the portal
      const fine = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (fine) {
        const prx = gsap.quickTo(portalRef.current, "rotationX", {
          duration: 0.8,
          ease: "power3",
        });
        const pry = gsap.quickTo(portalRef.current, "rotationY", {
          duration: 0.8,
          ease: "power3",
        });
        const fx = gsap.quickTo(q(".ess-phone-wrap")[0], "x", {
          duration: 0.8,
          ease: "power3",
        });
        const fy = gsap.quickTo(q(".ess-phone-wrap")[0], "y", {
          duration: 0.8,
          ease: "power3",
        });
        const wrap = visualRef.current;
        const move = (e) => {
          const r = wrap.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          pry(x * 5);
          prx(-y * 4);
          fx(x * 22);
          fy(y * 16);
        };
        const leave = () => {
          prx(0);
          pry(0);
          fx(0);
          fy(0);
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
      className="ess-hero"
      ref={sectionRef}
      aria-labelledby="ess-hero-title"
    >
      <div className="ess-hero-bg" aria-hidden>
        <span className="ess-blob b1 js-blob" />
        <span className="ess-blob b2 js-blob" />
        <span className="ess-grid" />
      </div>

      <div className="ess-container ess-hero-grid">
        {/* RIGHT: content (first in DOM for SEO, shown on the right on desktop) */}
        <div className="ess-content">
          <span className="ess-eyebrow js-reveal">
            <span className="ess-live-dot" /> Power in Their Hands
          </span>

          <h1 id="ess-hero-title" className="ess-title js-reveal">
            Employee Self-Service Portal with{" "}
            <span className="ess-grad">Mobile App</span>
          </h1>

          <div
            className="ess-feats js-reveal"
            role="tablist"
            aria-label="Self-service features"
          >
            {FEATURES.map((f, i) => (
              <button
                key={f.title}
                type="button"
                role="tab"
                aria-selected={stage === i}
                className={`ess-feat ${stage === i ? "is-active" : ""}`}
                onClick={() => setStage(i)}
              >
                <span className="ess-feat-ic">
                  <Icon name={f.icon} size={14} />
                </span>
                <span>{f.title}</span>
                <span className="ess-feat-bar">
                  <i ref={(el) => (barRefs.current[i] = el)} />
                </span>
              </button>
            ))}
          </div>

          <p
            className="ess-feat-desc js-reveal"
            ref={descRef}
            aria-live="polite"
          >
            <Icon name="check" size={13} /> {FEATURES[stage].desc}
          </p>
        </div>

        {/* LEFT: web portal + mobile app */}
        <div className="ess-visual" ref={visualRef}>
          <Portal portalRef={portalRef} stage={stage} />
          <div className="ess-phone-wrap">
            <Phone phoneRef={phoneRef} stage={stage} />
          </div>
          <div className="ess-float js-float">
            <span className="ess-float-ic">
              <Icon name="star" size={13} />
            </span>
            <div>
              <strong>Android &amp; iOS</strong>
              <small>Same data on web and app</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — App showcase (3D phone coverflow)                       */
/* ------------------------------------------------------------------ */

const SHOW_HEADING = [
  ["Empower", true],
  ["employees,", false],
  ["simplify", true],
  ["HR", false],
  ["processes,", false],
  ["and", false],
  ["stay", false],
  ["connected", false],
  ["anytime,", true],
  ["anywhere", true],
];

const SHOW_TABS = [
  {
    label: "View & Download Payslips",
    icon: "wallet",
    title: [
      ["Access", true],
      ["everything", false],
      ["anytime", true],
    ],
    desc: "View payslips, tax forms, and company updates instantly from your mobile or desktop.",
  },
  {
    label: "Manage Attendance & Leave",
    icon: "clock",
    title: [
      ["Manage", true],
      ["attendance", false],
      ["with", true],
      ["ease", true],
    ],
    desc: "Clock in/out, apply for leave, and check attendance history directly from the app.",
  },
  {
    label: "Update Personal Information",
    icon: "user",
    title: [
      ["Update", true],
      ["your", false],
      ["own", true],
      ["profile", true],
    ],
    desc: "Edit personal information, upload documents, and keep your records accurate without HR intervention.",
  },
  {
    label: "Submit Requests & Approvals",
    icon: "send",
    title: [
      ["Stay", true],
      ["connected", false],
      ["on", true],
      ["the", true],
      ["go", true],
    ],
    desc: "Receive instant notifications for approvals, announcements, and reminders wherever you are.",
  },
  {
    label: "Real-time Notifications",
    icon: "bell",
    title: [
      ["Experience", true],
      ["it", false],
      ["on", true],
      ["the", true],
      ["go", true],
    ],
    desc: "Whether you're an employee or manager, manage attendance and leave right from your mobile. Download the app and take full control of your schedule—anytime, anywhere.",
    stores: true,
  },
];

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.ngriffinpay&pcampaignid=web_share";
const APP_STORE_URL =
  "https://apps.apple.com/in/developer/n-griffin-management-consulting-private-limited/id1822796614";
const SHOW_TIME = 5.5;

// Builds a paused timeline; plays when the phone is in front, shows the final state otherwise
function useShowcaseTimeline(active, build) {
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

const counter = (el, from, to, fmt = (v) => Math.round(v)) => {
  const o = { n: from };
  return {
    o,
    vars: { n: to, onUpdate: () => el && (el.textContent = fmt(o.n)) },
  };
};

/* ---------- App screen 1: payslips ---------- */
const SLIP_ROWS = [
  ["October 2026", "₹78,400"],
  ["September 2026", "₹78,400"],
  ["August 2026", "₹76,900"],
];
const RING_S = 2 * Math.PI * 9;

function AppPayslips({ active }) {
  const ref = useShowcaseTimeline(active, (tl, q) => {
    tl.fromTo(
      q(".esa-row"),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.4, ease: "power3.out" },
      0.2,
    );
    tl.fromTo(
      q(".esa-row.first"),
      { backgroundColor: "#ffffff" },
      { backgroundColor: "#eaf2fc", duration: 0.3 },
      0.9,
    );
    tl.fromTo(
      q(".esa-dl-ring"),
      { strokeDashoffset: RING_S },
      { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
      1,
    );
    tl.fromTo(
      q(".esa-dl-ic"),
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: 0.15 },
      1,
    );
    tl.fromTo(
      q(".esa-dl-ok"),
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
      2,
    );
    tl.fromTo(
      q(".esa-form16"),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4 },
      1.3,
    );
    tl.fromTo(
      q(".esa-toast"),
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" },
      2.2,
    );
  });

  return (
    <div className="esa" ref={ref}>
      <div className="esa-head">
        <small>Payslips</small>
        <strong>FY 2026–27</strong>
      </div>
      <ul className="esa-rows">
        {SLIP_ROWS.map(([m, v], i) => (
          <li className={`esa-row ${i === 0 ? "first" : ""}`} key={m}>
            <span className="esa-row-ic">
              <Icon name="file" size={12} />
            </span>
            <div>
              <b>{m}</b>
              <small>Net {v}</small>
            </div>
            <span className="esa-dl">
              {i === 0 ? (
                <>
                  <svg viewBox="0 0 22 22">
                    <circle cx="11" cy="11" r="9" className="esa-dl-bg" />
                    <circle
                      cx="11"
                      cy="11"
                      r="9"
                      className="esa-dl-ring"
                      strokeDasharray={RING_S}
                    />
                  </svg>
                  <span className="esa-dl-ic">
                    <Icon name="download" size={10} />
                  </span>
                  <span className="esa-dl-ok">
                    <Icon name="check" size={10} />
                  </span>
                </>
              ) : (
                <span className="esa-dl-ic static">
                  <Icon name="download" size={10} />
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="esa-form16">
        <span>
          <Icon name="file" size={14} />
        </span>
        <div>
          <b>Form 16 · FY 2025–26</b>
          <small>Tax form ready to download</small>
        </div>
      </div>
      <div className="esa-update">
        <Icon name="megaphone" size={11} /> Company update: Town hall on Friday
      </div>
      <div className="esa-toast">
        <Icon name="check" size={11} /> Payslip saved to Files
      </div>
    </div>
  );
}

/* ---------- App screen 2: attendance & leave ---------- */
const CLOCK_C = 2 * Math.PI * 46;
const MONTH = Array.from({ length: 28 }, (_, i) =>
  i === 9 || i === 10 ? "l" : i % 7 >= 5 ? "w" : i === 20 ? "h" : "p",
);

function AppAttendance({ active }) {
  const ref = useShowcaseTimeline(active, (tl, q) => {
    tl.fromTo(
      q(".esa-loc"),
      { y: -10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 },
      0.2,
    );
    tl.fromTo(
      q(".esa-clock-btn"),
      { scale: 1 },
      { scale: 0.94, duration: 0.25, yoyo: true, repeat: 1 },
      0.7,
    );
    tl.fromTo(
      q(".esa-clock-ring"),
      { strokeDashoffset: CLOCK_C },
      { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" },
      0.7,
    );
    tl.fromTo(
      q(".esa-clock-a"),
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: 0.2 },
      1.8,
    );
    tl.fromTo(
      q(".esa-clock-b"),
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
      1.85,
    );
    tl.fromTo(
      q(".esa-clock-btn"),
      { backgroundColor: "#0a3f83" },
      { backgroundColor: "#10b981", duration: 0.3 },
      1.8,
    );
    tl.fromTo(
      q(".esa-cal i"),
      { scale: 0 },
      { scale: 1, stagger: 0.02, duration: 0.25, ease: "back.out(2)" },
      2,
    );
    tl.fromTo(
      q(".esa-leave-row"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 },
      2.5,
    );
  });

  return (
    <div className="esa" ref={ref}>
      <div className="esa-head">
        <small>Attendance</small>
        <strong>Thursday, 29 Oct</strong>
      </div>
      <div className="esa-loc">
        <Icon name="pin" size={11} /> Whitefield office · 40 m away
      </div>
      <div className="esa-clock">
        <svg viewBox="0 0 104 104">
          <circle cx="52" cy="52" r="46" className="esa-clock-bg" />
          <circle
            cx="52"
            cy="52"
            r="46"
            className="esa-clock-ring"
            strokeDasharray={CLOCK_C}
          />
        </svg>
        <div className="esa-clock-btn">
          <span className="esa-clock-a">
            <Icon name="clock" size={18} />
            <b>Clock in</b>
          </span>
          <span className="esa-clock-b">
            <Icon name="check" size={18} />
            <b>09:28 AM</b>
          </span>
        </div>
      </div>
      <div className="esa-cal-wrap">
        <small>October history</small>
        <div className="esa-cal">
          {MONTH.map((t, i) => (
            <i key={i} className={t} />
          ))}
        </div>
        <div className="esa-legend">
          <span className="p" />
          Present <span className="l" />
          Leave <span className="h" />
          Holiday
        </div>
      </div>
      <div className="esa-leave-row">
        <span>
          <b>8</b> Casual
        </span>
        <span>
          <b>3</b> Sick
        </span>
        <button type="button" tabIndex={-1}>
          Apply leave
        </button>
      </div>
    </div>
  );
}

/* ---------- App screen 3: update profile ---------- */
function AppProfile({ active }) {
  const ref = useShowcaseTimeline(active, (tl, q) => {
    const addr = q(".js-addr")[0];
    const text = "HSR Layout, Bengaluru";
    const c = counter(null, 0, text.length);
    tl.fromTo(
      q(".esa-field"),
      { x: 14, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, stagger: 0.08, duration: 0.35 },
      0.2,
    );
    tl.fromTo(
      q(".esa-field.edit"),
      { borderColor: "#e3e8f2" },
      { borderColor: "#1d6fd8", duration: 0.25 },
      0.7,
    );
    tl.fromTo(
      c.o,
      { n: 0 },
      {
        n: text.length,
        duration: 1,
        ease: "none",
        onUpdate: () =>
          addr && (addr.textContent = text.slice(0, Math.round(c.o.n))),
      },
      0.8,
    );
    tl.fromTo(
      q(".esa-up-bar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: "power1.inOut" },
      1.6,
    );
    tl.fromTo(
      q(".esa-up-a"),
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: 0.15 },
      2.5,
    );
    tl.fromTo(
      q(".esa-up-b"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25 },
      2.55,
    );
    tl.fromTo(
      q(".esa-saved"),
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" },
      2.9,
    );
  });

  return (
    <div className="esa" ref={ref}>
      <div className="esa-profile">
        <span className="esa-pav">
          PS
          <i>
            <Icon name="camera" size={9} />
          </i>
        </span>
        <div>
          <b>Priya Sharma</b>
          <small>EMP-0142 · Design</small>
        </div>
      </div>
      <div className="esa-field">
        <small>Mobile</small>
        <b>+91 98xxx xx210</b>
      </div>
      <div className="esa-field edit">
        <small>Address</small>
        <b>
          <span className="js-addr">HSR Layout, Bengaluru</span>
          <i className="esa-caret" />
        </b>
      </div>
      <div className="esa-field">
        <small>Emergency contact</small>
        <b>Arjun Sharma · Spouse</b>
      </div>
      <div className="esa-upload">
        <span className="esa-up-ic">
          <Icon name="upload" size={12} />
        </span>
        <div>
          <b>PAN_card.pdf</b>
          <span className="esa-up-bar">
            <i />
          </span>
        </div>
        <span className="esa-up-state">
          <small className="esa-up-a">Uploading</small>
          <small className="esa-up-b">
            <Icon name="check" size={9} /> Done
          </small>
        </span>
      </div>
      <div className="esa-saved">
        <Icon name="check" size={11} /> Profile updated · no HR ticket needed
      </div>
    </div>
  );
}

/* ---------- App screen 4: requests & approvals ---------- */
const APPROVALS = [
  {
    type: "Leave request",
    who: "Karthik V.",
    meta: "2 days · 6–7 Nov",
    av: "KV",
  },
  {
    type: "Expense claim",
    who: "Anita R.",
    meta: "₹2,450 · Client travel",
    av: "AR",
  },
  { type: "WFH request", who: "Deepa N.", meta: "Friday · 1 day", av: "DN" },
];

function AppApprovals({ active }) {
  const ref = useShowcaseTimeline(active, (tl, q) => {
    const cards = q(".esa-apv");
    const num = q(".js-pending")[0];
    const c = counter(num, 3, 1);
    tl.fromTo(
      cards,
      {
        y: (i) => i * 10,
        scale: (i) => 1 - i * 0.05,
        x: 0,
        rotation: 0,
        autoAlpha: 1,
      },
      { y: (i) => i * 10, scale: (i) => 1 - i * 0.05, duration: 0.01 },
      0,
    );
    tl.fromTo(
      cards[0].querySelector(".esa-apv-ok"),
      { scale: 1 },
      { scale: 0.88, duration: 0.15, yoyo: true, repeat: 1 },
      0.8,
    );
    tl.to(
      cards[0],
      { x: 240, rotation: 14, autoAlpha: 0, duration: 0.5, ease: "power2.in" },
      1.05,
    );
    tl.to(cards[1], { y: 0, scale: 1, duration: 0.4, ease: "power3.out" }, 1.2);
    tl.to(
      cards[2],
      { y: 10, scale: 0.95, duration: 0.4, ease: "power3.out" },
      1.2,
    );
    tl.fromTo(
      c.o,
      { n: 3 },
      { n: 2, duration: 0.2, onUpdate: c.vars.onUpdate },
      1.2,
    );
    tl.fromTo(
      cards[1].querySelector(".esa-apv-ok"),
      { scale: 1 },
      { scale: 0.88, duration: 0.15, yoyo: true, repeat: 1 },
      1.9,
    );
    tl.to(
      cards[1],
      { x: 240, rotation: 14, autoAlpha: 0, duration: 0.5, ease: "power2.in" },
      2.15,
    );
    tl.to(cards[2], { y: 0, scale: 1, duration: 0.4, ease: "power3.out" }, 2.3);
    tl.fromTo(
      c.o,
      { n: 2 },
      {
        n: 1,
        duration: 0.2,
        onUpdate: c.vars.onUpdate,
        immediateRender: false,
      },
      2.3,
    );
    tl.fromTo(
      q(".esa-remind"),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" },
      2.7,
    );
  });

  return (
    <div className="esa" ref={ref}>
      <div className="esa-head row">
        <div>
          <small>Manager inbox</small>
          <strong>Approvals</strong>
        </div>
        <span className="esa-badge">
          <span className="js-pending">3</span> pending
        </span>
      </div>
      <div className="esa-apv-stack">
        {APPROVALS.map((a, i) => (
          <div className="esa-apv" key={a.who} style={{ zIndex: 3 - i }}>
            <div className="esa-apv-top">
              <span className="ess-av xs alt">{a.av}</span>
              <div>
                <b>{a.type}</b>
                <small>{a.who}</small>
              </div>
            </div>
            <p>{a.meta}</p>
            <div className="esa-apv-btns">
              <span className="esa-apv-no">
                <Icon name="x" size={11} /> Reject
              </span>
              <span className="esa-apv-ok">
                <Icon name="check" size={11} /> Approve
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="esa-remind">
        <Icon name="bell" size={11} /> Reminder: submit timesheet by 6 PM
      </div>
    </div>
  );
}

/* ---------- App screen 5: real-time notifications (lock screen) ---------- */
const NOTIFS = [
  {
    t: "Leave approved ✅",
    s: "Your leave for 6–7 Nov is approved",
    ago: "now",
  },
  { t: "Payslip available", s: "October payslip is ready to view", ago: "2m" },
  { t: "Town hall in 15 min", s: "Join from the app or Room 4B", ago: "10m" },
  {
    t: "Holiday tomorrow 🎉",
    s: "Office closed for Kannada Rajyotsava",
    ago: "1h",
  },
];

function AppNotifications({ active }) {
  const ref = useShowcaseTimeline(active, (tl, q) => {
    tl.fromTo(
      q(".esa-lock-time"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4 },
      0.1,
    );
    q(".esa-notif").forEach((n, i) => {
      tl.fromTo(
        n,
        { y: -30, autoAlpha: 0, scale: 0.92 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
        0.5 + i * 0.55,
      );
    });
    tl.fromTo(
      q(".esa-swipe-up"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.4 },
      2.9,
    );
  });

  return (
    <div className="esa esa-lock" ref={ref}>
      <div className="esa-lock-time">
        <Icon name="lock" size={12} />
        <strong>9:41</strong>
        <small>Thursday, 29 October</small>
      </div>
      <div className="esa-notifs">
        {NOTIFS.map((n) => (
          <div className="esa-notif" key={n.t}>
            <span className="esa-notif-ic">N</span>
            <div>
              <b>{n.t}</b>
              <small>{n.s}</small>
            </div>
            <em>{n.ago}</em>
          </div>
        ))}
      </div>
      <div className="esa-swipe-up">Swipe up to open NGriffinpay</div>
    </div>
  );
}

const SHOW_SCREENS = [
  AppPayslips,
  AppAttendance,
  AppProfile,
  AppApprovals,
  AppNotifications,
];

/* ---------- 3D coverflow ---------- */
function Coverflow({ active, onSelect }) {
  const stageRef = useRef(null);
  const phoneRefs = useRef([]);
  const prevD = useRef([]);
  const first = useRef(true);
  const drag = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!width) return;
    const N = SHOW_TABS.length;
    const sp = Math.min(185, width * 0.22);
    const isFirst = first.current;
    first.current = false;
    phoneRefs.current.forEach((el, i) => {
      if (!el) return;
      let d = i - active;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      const a = Math.abs(d);
      const vars = {
        x: d * sp,
        z: -a * 170,
        rotationY: -d * 32,
        scale: 1 - a * 0.1,
        autoAlpha: a > 2 ? 0 : 1 - a * 0.3,
        zIndex: 10 - a,
      };
      const jumped =
        prevD.current[i] !== undefined && Math.abs(prevD.current[i] - d) > 2;
      prevD.current[i] = d;
      if (isFirst || jumped || prefersReduced()) gsap.set(el, vars);
      else gsap.to(el, { ...vars, duration: 0.85, ease: "power3.out" });
    });
  }, [active, width]);

  const onDown = (e) => (drag.current = e.clientX);
  const onUp = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    const N = SHOW_TABS.length;
    if (dx > 40) onSelect((active - 1 + N) % N);
    else if (dx < -40) onSelect((active + 1) % N);
  };

  return (
    <div
      className="esc-stage"
      ref={stageRef}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={() => (drag.current = null)}
    >
      <span className="esc-floor" aria-hidden />
      <div className="esc-track">
        {SHOW_TABS.map((t, i) => {
          const Screen = SHOW_SCREENS[i];
          return (
            <div
              key={t.label}
              className={`esc-phone ${active === i ? "is-front" : ""}`}
              ref={(el) => (phoneRefs.current[i] = el)}
              onClick={() => active !== i && onSelect(i)}
              aria-hidden={active !== i}
            >
              <div className="esc-phone-inner">
                <span className="esc-island" />
                <div className="esc-status">
                  <span>9:41</span>
                  <span>5G ▮</span>
                </div>
                <div className="esc-screen">
                  <Screen active={active === i} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
function AppShowcaseSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const barRefs = useRef([]);
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
      const st = { trigger: q(".esc-title")[0], start: "top 82%" };
      gsap.from(q(".esc-w"), {
        y: 30,
        opacity: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: st,
      });
      gsap.fromTo(
        q(".esc-mark"),
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.5,
          scrollTrigger: st,
        },
      );
      gsap.from(q(".esc-stage"), {
        y: 60,
        opacity: 0,
        rotationX: 10,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".esc-grid")[0], start: "top 80%" },
      });
      gsap.from(q(".esc-tab"), {
        x: -24,
        opacity: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".esc-grid")[0], start: "top 80%" },
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

  // Auto-advance timer
  useEffect(() => {
    autoRef.current?.kill();
    barRefs.current.forEach((b, i) => b && gsap.set(b, { scaleX: 0 }));
    if (prefersReduced()) return;
    const bar = barRefs.current[active];
    autoRef.current = gsap.fromTo(
      bar || {},
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: SHOW_TIME,
        ease: "none",
        onComplete: () => select((activeRef.current + 1) % SHOW_TABS.length),
      },
    );
    syncPlay();
    return () => autoRef.current?.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // Copy swap: title words rise, text fades
  useLayoutEffect(() => {
    if (firstCopy.current) {
      firstCopy.current = false;
      return;
    }
    if (prefersReduced() || !copyRef.current) return;
    const q = gsap.utils.selector(copyRef);
    gsap.from(q(".esc-tw > span"), {
      yPercent: 110,
      duration: 0.6,
      stagger: 0.05,
      ease: "power4.out",
    });
    gsap.from(q(".js-copy-fade"), {
      y: 12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.15,
      ease: "power3.out",
    });
  }, [active]);

  const t = SHOW_TABS[active];
  const N = SHOW_TABS.length;

  return (
    <section
      className="esc"
      id="ess-next"
      ref={sectionRef}
      aria-labelledby="esc-title"
    >
      <div className="ess-container">
        <h2 id="esc-title" className="esc-title">
          {SHOW_HEADING.map(([w, hl], i) => (
            <span key={i} className={`esc-w ${hl ? "hl" : ""}`}>
              {hl && <i className="esc-mark" aria-hidden />}
              <span>{w}</span>
            </span>
          ))}
        </h2>

        <div className="esc-grid">
          <div
            className="esc-left"
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <div className="esc-tabs" role="tablist" aria-label="App features">
              {SHOW_TABS.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  className={`esc-tab ${active === i ? "is-active" : ""}`}
                  onClick={() => select(i)}
                >
                  <span className="esc-tab-ic">
                    <Icon name={s.icon} size={15} />
                  </span>
                  <span className="esc-tab-label">{s.label}</span>
                  <span className="esc-tab-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              ))}
            </div>

            <div className="esc-copy" ref={copyRef} key={active}>
              <h3>
                {t.title.map(([w, hl], i) => (
                  <span key={i} className={`esc-tw ${hl ? "hl" : ""}`}>
                    <span>{w}</span>
                  </span>
                ))}
              </h3>
              <p className="js-copy-fade">{t.desc}</p>
              {t.stores ? (
                <div className="esc-stores js-copy-fade">
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="esc-store"
                    aria-label="Download NGriffinpay on Google Play"
                  >
                    <Icon name="play" size={16} />
                    <span>
                      <small>GET IT ON</small>Google Play
                    </span>
                  </a>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="esc-store"
                    aria-label="Download NGriffinpay on the App Store"
                  >
                    <Icon name="phone" size={16} />
                    <span>
                      <small>Download on the</small>App Store
                    </span>
                  </a>
                </div>
              ) : (
                <a href="/contact" className="ess-btn primary js-copy-fade">
                  Book a Free Demo <Icon name="arrow" size={16} />
                </a>
              )}
            </div>
          </div>

          <div
            className="esc-right"
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
          >
            <Coverflow active={active} onSelect={select} />
            <div className="esc-controls">
              <button
                type="button"
                onClick={() => select((active - 1 + N) % N)}
                aria-label="Previous"
              >
                <span className="esc-flip">
                  <Icon name="arrow" size={15} />
                </span>
              </button>
              <div className="esc-dots">
                {SHOW_TABS.map((s, i) => (
                  <span key={s.label} className={active === i ? "is-on" : ""} />
                ))}
              </div>
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
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 3 — FAQs as a live chat                                     */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: "What is the Employee Self-Service Portal in NGriffinpay?",
    a: "NGriffinpay’s Employee Self-Service Portal with Mobile App allows employees to access their work-related information, manage personal details, and perform HR tasks anytime, anywhere—right from their smartphone or desktop.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "self-service",
      "self service",
      "ess",
      "portal",
    ],
  },
  {
    q: "What tasks can employees perform in the portal?",
    a: "Employees can view payslips, check schedules, request leaves, update personal information, submit expense claims, and track approvals—all in one place.",
    keys: [
      "task",
      "what can",
      "payslip",
      "leave",
      "schedule",
      "expense",
      "claim",
      "personal",
      "profile",
      "approval",
      "do in",
    ],
  },
  {
    q: "Is the portal accessible through a mobile app?",
    a: "Yes, the NGriffinpay mobile app provides the same self-service features as the web portal, allowing employees to stay connected and productive on the go.",
    keys: [
      "mobile",
      "app",
      "android",
      "ios",
      "iphone",
      "phone",
      "play store",
      "app store",
      "download",
    ],
  },
  {
    q: "Can employees receive notifications and alerts?",
    a: "Absolutely. The portal and mobile app send real-time push notifications and email alerts for shift updates, approvals, announcements, and important deadlines.",
    keys: [
      "notif",
      "alert",
      "push",
      "email",
      "reminder",
      "announcement",
      "deadline",
      "shift",
    ],
  },
  {
    q: "Is the portal secure for employee data?",
    a: "Yes, NGriffinpay uses enterprise-grade encryption and secure authentication to protect sensitive employee information at all times.",
    keys: [
      "secure",
      "security",
      "safe",
      "encrypt",
      "data",
      "privacy",
      "login",
      "authentication",
      "protect",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about the self-service portal and app.";
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
      <div className="esq-row bot" ref={ref}>
        <span className="esq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="esq-bubble bot esq-typing"
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
      <div className="esq-row user" ref={ref}>
        <div className="esq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="esq-row bot" ref={ref}>
      <span className="esq-bot-av" aria-hidden>
        N
      </span>
      <div className="esq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="esq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function SelfServiceFaqSection() {
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
      gsap.from(q(".esq-chat"), {
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
    <section className="esq" ref={sectionRef} aria-labelledby="esq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="ess-container esq-grid">
        <div className="esq-left">
          <span className="esq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="esq-title" className="esq-title js-faq-reveal">
            Employee Self-Service Portal with Mobile App –{" "}
            <span className="ess-grad">FAQs</span>
          </h2>
          <p className="esq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="esq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`esq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="esq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="esq-q-text">{f.q}</span>
                  <span className="esq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="esq-chat">
          <div className="esq-chat-head">
            <span className="esq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="esq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="esq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="esq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="esq-suggest" aria-label="Suggested questions">
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

          <form className="esq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the portal or mobile app…"
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

export default function EmployeeSelfService() {
  return (
    <div className="ess-page">
      <HeroSection />
      <AppShowcaseSection />
      <SelfServiceFaqSection />
      {/* SECTION 4 — coming next */}
    </div>
  );
}
