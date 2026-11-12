// HRHelp.jsx
// NGriffinPay  — "NGriffinPay  HR Help – User Guides" inner page
// Section 1: Hero banner (live Help Center app on the left — 3 guides play out; content on the right)
// Section 2: Additional Resources — a 3D rotating carousel (FAQs · How-to videos · Product Updates · Webinars),
//            every card is a live mini preview (GSAP)
// Section 3: Mobile App download + HR Community
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)
// NOTE: headings & descriptions are the client's; small details inside the mockups are placeholder copy.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./HRHelp.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Links — change these to your real pages                              */
/* ------------------------------------------------------------------ */

const LINKS = {
  admin: "#",
  portal: "#",
  mobile: "#",
  faqs: "#",
  videos: "#",
  updates: "#",
  webinars: "#",
  appStore: "#",
  playStore: "#",
  community: "#",
};

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Admin Dashboard",
    tag: "For Administrators",
    short: "Admin",
    icon: "dashboard",
    href: LINKS.admin,
    desc: "Seamlessly manage payroll, compliance, and HR functions using the intuitive NGriffinPay  Admin Dashboard.",
  },
  {
    title: "Employee Portal – Web",
    tag: "For Employees and Managers",
    short: "Web portal",
    icon: "monitor",
    href: LINKS.portal,
    desc: "Explore the NGriffinPay  Employee Self-Service portal and simplify everyday HR and payroll tasks online.",
  },
  {
    title: "Mobile App",
    tag: "For Employees and Managers",
    short: "Mobile app",
    icon: "phone",
    href: LINKS.mobile,
    desc: "Manage your attendance, payslips, and leave requests on the go with the NGriffinPay  mobile app.",
  },
];

const STAGE_TIME = 6.5;

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
    case "dashboard":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
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
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 18h2" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
        </svg>
      );
    case "help":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5M12 17.5h.01" />
        </svg>
      );
    case "video":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="m22 8-6 4 6 4z" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...p}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "mic":
      return (
        <svg {...p}>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
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
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "play":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <polygon points="7 4 20 12 7 20 7 4" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p}>
          <path d="m6 9 6 6 6-6" />
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
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
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
    case "rupee":
      return (
        <svg {...p}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
        </svg>
      );
    case "thumb":
      return (
        <svg {...p}>
          <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    case "apple":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M16.37 12.62c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.43-2.5-1.63-3.04-1.65-1.29-.13-2.53.76-3.18.76-.66 0-1.67-.74-2.75-.72-1.41.02-2.72.82-3.45 2.09-1.47 2.55-.38 6.33 1.06 8.4.7 1.01 1.53 2.15 2.62 2.11 1.05-.04 1.45-.68 2.72-.68 1.27 0 1.63.68 2.74.66 1.13-.02 1.85-1.03 2.54-2.05.8-1.17 1.13-2.31 1.15-2.37-.03-.01-2.2-.85-2.21-3.39zM14.29 6.45c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.53.62-1 1.62-.88 2.57.93.07 1.88-.47 2.46-1.17z" />
        </svg>
      );
    case "android":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M3.6 2.2 13.4 12l-9.8 9.8c-.4-.2-.6-.6-.6-1.1V3.3c0-.5.2-.9.6-1.1zm10.5 10.5 2.6 2.6-11.4 6.5 8.8-9.1zm3.5-3.5 2.9 1.7c.8.5.8 1.7 0 2.2l-2.9 1.6-2.8-2.7 2.8-2.8zM5.3 2.2l11.4 6.5-2.6 2.6L5.3 2.2z" />
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

const typeInto = (tl, el, text, at, dur = 1) => {
  const st = { n: 0 };
  tl.to(
    st,
    {
      n: text.length,
      duration: dur,
      ease: "none",
      onUpdate: () => el && (el.textContent = text.slice(0, Math.round(st.n))),
    },
    at,
  );
};

// 1 — Admin Dashboard guide: search → article → steps tick
const ADMIN_Q = "How do I run monthly payroll?";
const ADMIN_STEPS = [
  "Open Payroll › Run payroll",
  "Pick the month & lock attendance",
  "Review the salary register",
  "Approve and publish payslips",
];
function AdminGuidePanel({ delay }) {
  const qRef = useRef(null);
  const ref = usePanel((tl, q) => {
    typeInto(tl, qRef.current, ADMIN_Q, 0.4, 1.1);
    tl.from(
      q(".hlp-result"),
      { autoAlpha: 0, y: 10, stagger: 0.1, duration: 0.35 },
      1.6,
    );
    tl.to(
      q(".hlp-result")[0] || {},
      { backgroundColor: "#eaf2fc", borderColor: "#9ec2ee", duration: 0.25 },
      2.1,
    );
    tl.from(q(".hlp-article"), { autoAlpha: 0, y: 14, duration: 0.4 }, 2.4);
    q(".hlp-step").forEach((el, i) =>
      tl.call(() => el.classList.add("is-done"), null, 2.9 + i * 0.4),
    );
    tl.from(q(".hlp-helpful"), { autoAlpha: 0, y: 8, duration: 0.35 }, 4.6);
  }, delay);

  return (
    <div className="hlp-panel" ref={ref}>
      <div className="hlp-searchbox js-in">
        <Icon name="search" size={13} />
        <span ref={qRef} />
        <i className="hlp-caret" />
      </div>
      <div className="hlp-results">
        <div className="hlp-result">
          <Icon name="book" size={12} />
          <span>
            <b>Run monthly payroll</b>
            <small>Admin Guide › Payroll · 4 min read</small>
          </span>
        </div>
        <div className="hlp-result">
          <Icon name="file" size={12} />
          <span>
            <b>Lock attendance before payroll</b>
            <small>Admin Guide › Attendance</small>
          </span>
        </div>
      </div>
      <div className="hlp-article">
        <div className="hlp-article-h">
          <span className="hlp-chip">Admin Guide</span>
          <b>Run monthly payroll</b>
        </div>
        <ol className="hlp-steps">
          {ADMIN_STEPS.map((s, i) => (
            <li key={s} className="hlp-step">
              <i>{i + 1}</i>
              <span>{s}</span>
              <em>
                <Icon name="check" size={9} />
              </em>
            </li>
          ))}
        </ol>
      </div>
      <div className="hlp-helpful">
        <span>Was this guide helpful?</span>
        <b>
          <Icon name="thumb" size={11} /> Yes
        </b>
      </div>
    </div>
  );
}

// 2 — Employee Portal guide: interactive walkthrough with a cursor + coach mark
function PortalGuidePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    const cur = q(".hlp-cursor");
    tl.fromTo(
      cur,
      { x: 210, y: 150, autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2 },
      0.5,
    );
    tl.to(cur, { x: 34, y: 66, duration: 0.8, ease: "power2.inOut" }, 0.7);
    tl.call(() => q(".hlp-nav-leave")[0]?.classList.add("is-on"), null, 1.5);
    tl.fromTo(
      q(".hlp-coach.c1"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      1.5,
    );
    tl.to(q(".hlp-coach.c1"), { autoAlpha: 0, duration: 0.2 }, 2.4);
    tl.to(cur, { x: 200, y: 36, duration: 0.8, ease: "power2.inOut" }, 2.4);
    tl.fromTo(
      q(".hlp-coach.c2"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      3.2,
    );
    tl.to(
      q(".hlp-apply"),
      { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 },
      3.6,
    );
    tl.to(q(".hlp-coach.c2"), { autoAlpha: 0, duration: 0.2 }, 3.9);
    tl.fromTo(
      q(".hlp-leaveform"),
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      3.9,
    );
    tl.call(() => q(".hlp-submit")[0]?.classList.add("is-done"), null, 4.8);
    tl.to(cur, { autoAlpha: 0, duration: 0.3 }, 4.9);
  }, delay);

  return (
    <div className="hlp-panel" ref={ref}>
      <div className="hlp-walk-h js-in">
        <span className="hlp-chip">Interactive guide</span>
        <b>Apply for leave</b>
        <small>Step-by-step on the real portal</small>
      </div>
      <div className="hlp-portal js-in">
        <aside className="hlp-portal-nav">
          <span>
            <Icon name="home" size={11} /> Home
          </span>
          <span className="hlp-nav-leave">
            <Icon name="calendar" size={11} /> Leave
          </span>
          <span>
            <Icon name="rupee" size={11} /> Payslips
          </span>
          <span>
            <Icon name="clock" size={11} /> Attendance
          </span>
        </aside>
        <div className="hlp-portal-main">
          <div className="hlp-portal-top">
            <b>My leave</b>
            <span className="hlp-apply">+ Apply leave</span>
          </div>
          <div className="hlp-bal">
            <span>
              <b>8</b>
              <small>Casual</small>
            </span>
            <span>
              <b>6</b>
              <small>Sick</small>
            </span>
            <span>
              <b>12</b>
              <small>Earned</small>
            </span>
          </div>
          <div className="hlp-leaveform">
            <div>
              <small>Type</small>
              <b>Casual leave</b>
            </div>
            <div>
              <small>Dates</small>
              <b>14 – 15 Nov</b>
            </div>
            <span className="hlp-submit">
              <i className="a">Submit</i>
              <i className="b">
                <Icon name="check" size={9} /> Sent to manager
              </i>
            </span>
          </div>
        </div>
        <span className="hlp-coach c1">
          Step 1 · Open <b>Leave</b>
        </span>
        <span className="hlp-coach c2">
          Step 2 · Click <b>Apply leave</b>
        </span>
        <svg className="hlp-cursor" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 2l16 9-7 2-3 7z" />
        </svg>
      </div>
    </div>
  );
}

// 3 — Mobile App guide: phone + steps
const MOBILE_STEPS = [
  "Open the NGriffinPay  app",
  "Tap Punch in",
  "Location is verified",
  "Attendance marked",
];
function MobileGuidePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".hlp-phone"),
      {
        y: 30,
        autoAlpha: 0,
        rotation: -4,
        duration: 0.6,
        ease: "back.out(1.6)",
      },
      0.3,
    );
    q(".hlp-mstep").forEach((el, i) =>
      tl.call(() => el.classList.add("is-done"), null, 0.9 + i * 0.55),
    );
    tl.to(
      q(".hlp-punch"),
      { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 },
      1.45,
    );
    tl.fromTo(
      q(".hlp-punch-ring"),
      { scale: 0.8, opacity: 0.8 },
      { scale: 1.8, opacity: 0, duration: 0.8 },
      1.5,
    );
    tl.fromTo(
      q(".hlp-geo"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      2,
    );
    tl.call(() => q(".hlp-punch")[0]?.classList.add("is-in"), null, 2.55);
    tl.fromTo(
      q(".hlp-toast"),
      { autoAlpha: 0, y: -10 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      2.6,
    );
  }, delay);

  return (
    <div className="hlp-panel hlp-mobile">
      <div className="hlp-phone-wrap" ref={ref}>
        <div className="hlp-phone">
          <span className="hlp-notch" />
          <div className="hlp-screen">
            <div className="hlp-app-h">
              <span className="hlp-logo sm">
                <img src={I("ngriffinpay-mark.png")} alt="" />
              </span>
              <b>Hi, Priya</b>
            </div>
            <small className="hlp-date">Fri, 13 Nov · General shift</small>
            <span className="hlp-punch">
              <span className="hlp-punch-ring" />
              <Icon name="pin" size={16} />
              <b className="a">Punch in</b>
              <b className="b">Punched in</b>
            </span>
            <span className="hlp-geo">
              <Icon name="check" size={9} /> Office · Bengaluru
            </span>
            <div className="hlp-app-tiles">
              <span>
                <Icon name="rupee" size={11} /> Payslips
              </span>
              <span>
                <Icon name="calendar" size={11} /> Leave
              </span>
            </div>
            <span className="hlp-toast">
              <Icon name="check" size={10} /> 9:02 AM · Attendance marked
            </span>
          </div>
        </div>
        <div className="hlp-msteps">
          <span className="hlp-chip js-in">Mobile App guide</span>
          <b className="js-in">Mark your attendance</b>
          <ol>
            {MOBILE_STEPS.map((s, i) => (
              <li key={s} className="hlp-mstep js-in">
                <i>{i + 1}</i>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

const PANELS = [AdminGuidePanel, PortalGuidePanel, MobileGuidePanel];

/* ------------------------------------------------------------------ */
/* Help Center app (left side)                                              */
/* ------------------------------------------------------------------ */

const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;
const POPULAR = [
  { icon: "rupee", text: "Download payslip" },
  { icon: "file", text: "Submit tax declaration" },
  { icon: "calendar", text: "Apply for leave" },
];

function HelpApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const ringRef = useRef(null);
  const scoreRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // "guides completed" ring counts up once
  useEffect(() => {
    const st = { v: 0 };
    const tw = gsap.to(st, {
      v: 72,
      duration: prefersReduced() ? 0 : 1.6,
      delay: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        if (scoreRef.current) scoreRef.current.textContent = Math.round(st.v);
        if (ringRef.current)
          ringRef.current.style.strokeDashoffset = RING_C * (1 - st.v / 100);
      },
    });
    return () => tw.kill();
  }, []);

  // Mobile: keep the active tab visible in the scrolling tab row
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[stage];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined;
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
    <div className="hlp-frame" ref={frameRef}>
      <div className="hlp-chrome">
        <span className="hlp-dot r" />
        <span className="hlp-dot y" />
        <span className="hlp-dot g" />
        <div className="hlp-url">
          <span aria-hidden>🔒</span> help.ngriffinpay.in/user-guides
        </div>
      </div>

      <div className="hlp-topbar js-top">
        <span className="hlp-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay " />
        </span>
        <b>HR Help</b>
        <span className="hlp-search">
          <Icon name="search" size={12} /> Search guides, videos, FAQs…
        </span>
        <span className="hlp-av sm a">PR</span>
      </div>

      <div className="hlp-app">
        <div className="hlp-main">
          <div
            className="hlp-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="User guides"
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
          <div className="hlp-panel-wrap" ref={panelWrap}>
            <Panel key={stage} delay={startDelay} />
          </div>
        </div>

        <aside className="hlp-side js-side">
          <small className="hlp-side-lbl">Your progress</small>
          <div className="hlp-ring">
            <svg viewBox="0 0 72 72" aria-hidden>
              <circle cx="36" cy="36" r={RING_R} className="hlp-ring-bg" />
              <circle
                ref={ringRef}
                cx="36"
                cy="36"
                r={RING_R}
                className="hlp-ring-fill"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C}
              />
            </svg>
            <span>
              <b>
                <span ref={scoreRef}>0</span>%
              </b>
              <small>guides done</small>
            </span>
          </div>
          <small className="hlp-side-lbl">Popular</small>
          <div className="hlp-today">
            {POPULAR.map((t) => (
              <span key={t.text}>
                <Icon name={t.icon} size={11} /> {t.text}
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
      className="hlp-hero"
      ref={sectionRef}
      aria-labelledby="hlp-hero-title"
    >
      <div className="hlp-hero-bg" aria-hidden>
        <span className="hlp-blob b1 js-blob" />
        <span className="hlp-blob b2 js-blob" />
        <span className="hlp-grid-bg" />
      </div>

      <div className="hlp-container hlp-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="hlp-content">
          <span className="hlp-eyebrow js-reveal">
            <span className="hlp-live-dot" /> Help Center · User Guides
          </span>
          <h1 id="hlp-hero-title" className="hlp-title js-reveal">
            <span className="hlp-grad">NGriffinPay HR Help</span> – User Guides
          </h1>

          <ul className="hlp-feats" role="tablist" aria-label="User guides">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`hlp-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="hlp-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="hlp-feat-txt">
                    <small className="hlp-feat-tag">{f.tag}</small>
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="hlp-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: Help Center app */}
        <div className="hlp-visual" ref={visualRef}>
          <HelpApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="hlp-float f1 js-float">
            <span className="hlp-float-ic ok">
              <Icon name="book" size={14} />
            </span>
            <div>
              <strong>Step-by-step guides</strong>
              <small>For admins, employees & managers</small>
            </div>
          </div>
          <div className="hlp-float f2 js-float">
            <span className="hlp-float-ic pr">
              <Icon name="rocket" size={14} />
            </span>
            <div>
              <strong>Updated every release</strong>
              <small>Always matches your app</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Additional Resources (3D carousel)                       */
/* ------------------------------------------------------------------ */

const RESOURCES = [
  {
    key: "faqs",
    title: "Frequently Asked Questions (FAQs)",
    short: "FAQs",
    icon: "help",
    href: LINKS.faqs,
    desc: "Find quick answers to your HR, payroll, and compliance-related questions.",
  },
  {
    key: "videos",
    title: "How-to-videos",
    short: "How-to videos",
    icon: "video",
    href: LINKS.videos,
    desc: "Follow step-by-step video tutorials to master every feature on NGriffinPay .",
  },
  {
    key: "updates",
    title: "Product Updates",
    short: "Product Updates",
    icon: "rocket",
    href: LINKS.updates,
    desc: "Stay informed about the latest features, improvements, and releases on NGriffinPay .",
  },
  {
    key: "webinars",
    title: "Webinars",
    short: "Webinars",
    icon: "mic",
    href: LINKS.webinars,
    desc: "Join our expert-led sessions and deep-dive into NGriffinPay ’s capabilities.",
  },
];
const RES_TIME = 5;

// mini previews (placeholder details)
function FaqPreview() {
  return (
    <div className="hr2-prev">
      <div className="hr2-search">
        <Icon name="search" size={11} /> Search questions…
      </div>
      {[
        "How is PF calculated?",
        "Can I edit a payslip after release?",
        "How do I add a new employee?",
      ].map((q, i) => (
        <div key={q} className={`hr2-acc ${i === 0 ? "open" : ""}`}>
          <div className="hr2-acc-q">
            <span>{q}</span>
            <Icon name="chev" size={11} />
          </div>
          {i === 0 && (
            <p className="hr2-acc-a">
              12% of basic + DA from employee and employer — calculated
              automatically each payroll run.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
function VideoPreview() {
  return (
    <div className="hr2-prev">
      <div className="hr2-player">
        <span className="hr2-play">
          <Icon name="play" size={16} />
        </span>
        <span className="hr2-vtitle">Run payroll in 5 minutes</span>
        <span className="hr2-vbar">
          <i className="hr2-vfill" />
        </span>
        <span className="hr2-vtime">1:42 / 4:58</span>
      </div>
      {[
        "Set up salary structures · 3:20",
        "Approve leave from mobile · 2:05",
        "Generate Form 16 · 4:12",
      ].map((c, i) => (
        <div key={c} className="hr2-chapter">
          <span className="hr2-thumb">
            <Icon name="play" size={8} />
          </span>
          {c}
          {i === 0 && <em>New</em>}
        </div>
      ))}
    </div>
  );
}
function UpdatesPreview() {
  return (
    <div className="hr2-prev">
      <div className="hr2-rel">
        <b>Release 4.2</b>
        <small>This month</small>
      </div>
      {[
        ["New", "Geo-fenced attendance for field teams"],
        ["Improved", "Faster payroll run for 1,000+ employees"],
        ["New", "Bulk payslip download as ZIP"],
        ["Fixed", "PT slab for Karnataka updated"],
      ].map(([t, d]) => (
        <div key={d} className="hr2-log">
          <span className={`hr2-tag t-${t.toLowerCase()}`}>{t}</span>
          {d}
        </div>
      ))}
    </div>
  );
}
function WebinarPreview() {
  return (
    <div className="hr2-prev">
      <div className="hr2-ticket">
        <div className="hr2-date">
          <small>NOV</small>
          <b>27</b>
          <small>4 PM</small>
        </div>
        <div className="hr2-tk-body">
          <span className="hr2-live">
            <i /> Live session
          </span>
          <b>Payroll compliance masterclass</b>
          <div className="hr2-speakers">
            <span>AR</span>
            <span>KV</span>
            <span>+2</span>
          </div>
        </div>
      </div>
      <div className="hr2-count">
        {[
          ["03", "days"],
          ["14", "hrs"],
          ["22", "min"],
        ].map(([n, l]) => (
          <span key={l}>
            <b>{n}</b>
            <small>{l}</small>
          </span>
        ))}
      </div>
      <span className="hr2-reg">Reserve my seat</span>
    </div>
  );
}
const PREVIEWS = [FaqPreview, VideoPreview, UpdatesPreview, WebinarPreview];

function ResourcesSection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);
  const ringRef = useRef(null);
  const tabsRef = useRef(null);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (s) => setInView(s.isActive),
    });
    if (prefersReduced()) return () => st.kill();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".js-hr2"), {
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(ringRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.to(q(".hr2-vfill"), {
        scaleX: 1,
        duration: 6,
        repeat: -1,
        ease: "none",
      });
      gsap.to(q(".hr2-live i"), {
        opacity: 0.2,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);
    return () => {
      st.kill();
      ctx.revert();
    };
  }, []);

  // cover-flow: active card in front, neighbours angled left / right, the 4th tucked behind
  useEffect(() => {
    const cards = ringRef.current?.querySelectorAll(".hr2-card");
    if (!cards) return;
    const small = window.matchMedia("(max-width: 720px)").matches;
    const dx = small ? 110 : 190;
    cards.forEach((card, i) => {
      const d = (i - active + RESOURCES.length) % RESOURCES.length; // 0 front, 1 right, 2 back, 3 left
      const pos = [
        { x: 0, z: 0, rotationY: 0, scale: 1, opacity: 1, zIndex: 4 },
        {
          x: dx,
          z: -160,
          rotationY: -38,
          scale: 0.86,
          opacity: 0.85,
          zIndex: 3,
        },
        { x: 0, z: -320, rotationY: 0, scale: 0.72, opacity: 0, zIndex: 1 },
        {
          x: -dx,
          z: -160,
          rotationY: 38,
          scale: 0.86,
          opacity: 0.85,
          zIndex: 3,
        },
      ][d];
      gsap.to(card, {
        ...pos,
        duration: prefersReduced() ? 0 : 0.9,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });
    const strip = tabsRef.current;
    const tab = strip?.children[active];
    if (strip && tab && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: Math.max(
          0,
          tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2,
        ),
        behavior: prefersReduced() ? "auto" : "smooth",
      });
    }
  }, [active]);

  useEffect(() => {
    if (!inView || paused || prefersReduced()) return undefined;
    const dc = gsap.delayedCall(RES_TIME, () =>
      setActive((a) => (a + 1) % RESOURCES.length),
    );
    return () => dc.kill();
  }, [active, inView, paused]);

  const pick = (i) => {
    setActive(i);
    setPaused(true);
  };
  const R = RESOURCES[active];

  return (
    <section
      className="hr2"
      ref={sectionRef}
      id="hlp-next"
      aria-labelledby="hr2-title"
    >
      <div className="hr2-bg" aria-hidden>
        <span className="hr2-glow g1" />
        <span className="hr2-glow g2" />
        <span className="hr2-stars" />
      </div>
      <div className="hlp-container">
        <div className="hr2-head">
          <span className="hr2-eyebrow js-hr2">
            <Icon name="spark" size={13} /> Additional Resources
          </span>
          <h2 id="hr2-title" className="hr2-title js-hr2">
            Additional <span className="hlp-grad">Resources</span>
          </h2>
          <p className="hr2-lead js-hr2">
            Explore more tools, tips, and insights for a smooth and productive
            NGriffinPay experience
          </p>
        </div>

        <div className="hr2-grid">
          <div
            className="hr2-stage"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="hr2-floor" aria-hidden />
            <div className="hr2-ring" ref={ringRef}>
              {RESOURCES.map((r, i) => {
                const P = PREVIEWS[i];
                return (
                  <a
                    key={r.key}
                    href={r.href}
                    className={`hr2-card ${active === i ? "is-on" : ""}`}
                    style={{ "--i": i }}
                    onClick={(e) => {
                      if (active !== i) {
                        e.preventDefault();
                        pick(i);
                      }
                    }}
                    tabIndex={active === i ? 0 : -1}
                    aria-label={r.title}
                  >
                    <div className="hr2-card-h">
                      <span className="hr2-card-ic">
                        <Icon name={r.icon} size={16} />
                      </span>
                      <b>{r.short}</b>
                    </div>
                    <P />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="hr2-side">
            <ul
              className="hr2-tabs"
              ref={tabsRef}
              role="tablist"
              aria-label="Resources"
            >
              {RESOURCES.map((r, i) => (
                <li key={r.key}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    className={`hr2-tab ${active === i ? "is-on" : ""}`}
                    onClick={() => pick(i)}
                  >
                    <span className="hr2-tab-ic">
                      <Icon name={r.icon} size={17} />
                    </span>
                    <span className="hr2-tab-txt">
                      <b>{r.title}</b>
                      <span>{r.desc}</span>
                    </span>
                    <span className="hr2-tab-go">
                      <Icon name="arrow" size={14} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 3 — Mobile App + Community                                   */
/* ------------------------------------------------------------------ */

const PEERS = ["AR", "KV", "PS", "MJ", "RN", "SD"];
const CHATS = [
  { av: "AR", text: "How are you handling the new PF wage rules?" },
  {
    av: "KV",
    text: "We set it up in salary structures — took 10 mins!",
    me: true,
  },
  { av: "PS", text: "Sharing our leave policy template 📎" },
];

function AppCommunitySection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.from(q(".hr3-card"), {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
      gsap.to(q(".hr3-phone"), {
        y: -10,
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        q(".hr3-notif"),
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.6,
          duration: 0.5,
          ease: "back.out(1.8)",
          repeat: -1,
          repeatDelay: 2.5,
          yoyo: true,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
      gsap.from(q(".hr3-peer"), {
        scale: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: "back.out(2.4)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      tl.fromTo(
        q(".hr3-msg"),
        { y: 14, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.9,
          duration: 0.45,
          ease: "back.out(1.8)",
        },
      ).to(
        q(".hr3-msg"),
        { opacity: 0, y: -8, duration: 0.3, stagger: 0.05 },
        "+=2.5",
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hr3" ref={sectionRef}>
      <div className="hlp-container hr3-grid">
        {/* App download */}
        <div className="hr3-card hr3-app">
          <div className="hr3-copy">
            <span className="hr3-tag">
              <Icon name="phone" size={13} /> Mobile App
            </span>
            <h2>Smart Payroll in Your Pocket</h2>
            <p>
              Download the NGriffinPay App and simplify your HR tasks on the
              move.
            </p>
            <div className="hr3-stores">
              <a href={LINKS.appStore} className="hr3-store">
                <Icon name="apple" size={20} />
                <span>
                  <small>Download on the</small>
                  <b>App Store</b>
                </span>
              </a>
              <a href={LINKS.playStore} className="hr3-store">
                <Icon name="android" size={18} />
                <span>
                  <small>Get it on</small>
                  <b>Google Play</b>
                </span>
              </a>
            </div>
          </div>
          <div className="hr3-visual" aria-hidden>
            <div className="hr3-phone">
              <span className="hlp-notch" />
              <div className="hr3-screen">
                <div className="hlp-app-h">
                  <span className="hlp-logo sm">
                    <img src={I("ngriffinpay-mark.png")} alt="" />
                  </span>
                  <b>Payslip · Oct</b>
                </div>
                <div className="hr3-net">
                  <small>Net pay</small>
                  <b>₹62,450</b>
                </div>
                <div className="hr3-rows">
                  <span>
                    Basic<b>₹40,000</b>
                  </span>
                  <span>
                    HRA<b>₹16,000</b>
                  </span>
                  <span>
                    PF<b>−₹1,800</b>
                  </span>
                </div>
                <span className="hr3-dl">Download PDF</span>
              </div>
            </div>
            <div className="hr3-notif n1">
              <Icon name="check" size={11} /> Leave approved
            </div>
            <div className="hr3-notif n2">
              <Icon name="bell" size={11} /> Payslip ready
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="hr3-card hr3-comm">
          <div className="hr3-copy">
            <span className="hr3-tag">
              <Icon name="users" size={13} /> Community
            </span>
            <h2>Connect and Collaborate with Peers on All Things HR</h2>
            <p>
              Be part of the NGriffinPay Community and exchange ideas, insights,
              and solutions with fellow HR professionals.
            </p>
            <a href={LINKS.community} className="hlp-btn primary">
              Join the Community <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="hr3-chat" aria-hidden>
            <div className="hr3-peers">
              {PEERS.map((p, i) => (
                <span key={p} className={`hr3-peer c${i % 4}`}>
                  {p}
                </span>
              ))}
              <em>+ HR professionals</em>
            </div>
            {CHATS.map((c) => (
              <div key={c.text} className={`hr3-msg ${c.me ? "me" : ""}`}>
                {!c.me && <span className="hr3-peer sm c1">{c.av}</span>}
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HRHelp() {
  return (
    <div className="hlp-page">
      <HeroSection />
      <ResourcesSection />
      <AppCommunitySection />
    </div>
  );
}
