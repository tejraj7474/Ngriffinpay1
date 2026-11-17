// People.jsx
// NGriffinPay — Product inner page: "People"
// (Employee day-to-day: Department Allocation · Designations · Grades & Levels · Holiday Listings · Events)
// Section 1: Hero banner (live People hub app on the left, content on the right)
// Section 2: People Wall (polaroid corkboard that changes per tab, GSAP)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)
// Styles:   uses the existing People.css — no new classes needed.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./People.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Department Allocation",
    short: "Departments",
    desc: "Place every employee in the right department, team, location and reporting line — and move them in a click.",
    icon: "building",
  },
  {
    title: "Designations, Grades & Levels",
    short: "Grades",
    desc: "Define your own titles, grade bands and career levels, linked to pay, leave and approval rules.",
    icon: "layers",
  },
  {
    title: "Holiday Listings",
    short: "Holidays",
    desc: "Publish location-wise holiday calendars with optional holidays, synced to attendance and leave.",
    icon: "calendar",
  },
  {
    title: "Events & Celebrations",
    short: "Events",
    desc: "Plan company events with RSVPs and reminders, and never miss a birthday or work anniversary.",
    icon: "party",
  },
];

const STAGE_TIME = 5.5;

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
    case "building":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      );
    case "layers":
      return (
        <svg {...p}>
          <path d="m12 2 10 5-10 5L2 7z" />
          <path d="m2 12 10 5 10-5M2 17l10 5 10-5" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      );
    case "party":
      return (
        <svg {...p}>
          <path d="M5.8 11.3 2 22l10.7-3.8" />
          <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.2.7a2.9 2.9 0 0 0-1.9 3.4c.2.8-.4 1.6-1.2 1.6h-.4c-.9 0-1.6.6-1.8 1.4L14 10" />
          <path d="M11 13c1.9 1.9 2.8 4.2 2 5-.8.8-3.1-.1-5-2s-2.8-4.2-2-5c.8-.8 3.1.1 5 2z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />
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
    case "pen":
      return (
        <svg {...p}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "code":
      return (
        <svg {...p}>
          <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M16 13h.01M2 10h20" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "award":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...p}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    case "cake":
      return (
        <svg {...p}>
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s1.5-1 4-1 4 2 4 2 1.5 1 4 1 4-1 4-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01" />
        </svg>
      );
    case "heart":
      return (
        <svg {...p}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case "star":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
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
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
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
        <svg {...p}>
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "smile":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
      );
    case "gift":
      return (
        <svg {...p}>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
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

// 1 — Department Allocation: a new joiner placed in the org
const ALLOCATION = [
  {
    name: "Design department",
    sub: "Product UX team · 18 members",
    icon: "building",
    state: "Allocated",
  },
  {
    name: "Whitefield office",
    sub: "Bengaluru · Floor 3 · Cost centre BLR-02",
    icon: "pin",
    state: "Mapped",
  },
  {
    name: "Reports to Rahul M.",
    sub: "Leave & attendance approvals routed",
    icon: "user",
    state: "Linked",
  },
];
function DepartmentPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".pep-kit"),
      { x: 24, autoAlpha: 0, stagger: 0.18, duration: 0.4, ease: "power3.out" },
      0.35,
    );
    tl.from(
      q(".pep-kit-ok"),
      { scale: 0, stagger: 0.18, duration: 0.3, ease: "back.out(2.6)" },
      0.65,
    );
    tl.from(q(".pep-ack"), { autoAlpha: 0, y: 10, duration: 0.4 }, 1.5);
  }, delay);

  return (
    <div className="pep-panel" ref={ref}>
      <div className="pep-head js-in">
        <Icon name="building" /> Allocation · Sneha R.{" "}
        <em className="pep-tag">New joiner</em>
      </div>
      <div className="pep-kits">
        {ALLOCATION.map((k) => (
          <div key={k.name} className="pep-kit">
            <span className="pep-kit-ic">
              <Icon name={k.icon} size={14} />
            </span>
            <span className="pep-kit-txt">
              <b>{k.name}</b>
              <small>{k.sub}</small>
            </span>
            <span className="pep-kit-ok">
              <Icon name="check" size={9} /> {k.state}
            </span>
          </div>
        ))}
      </div>
      <div className="pep-ack">
        <span className="pep-ack-ic">
          <Icon name="check" size={13} />
        </span>
        <div>
          <b>Approved by Deepa N. (HR)</b>
          <small>
            Org chart, approval flow and payroll cost centre updated
          </small>
        </div>
      </div>
    </div>
  );
}

// 2 — Designations, Grades & Levels: a promotion + grade bands
const GRADE_BANDS = [
  { code: "G6", name: "Leadership", n: 14 },
  { code: "G5", name: "Senior", n: 52 },
  { code: "G4", name: "Associate", n: 96 },
];
const GRADE_MAX = 96;
function GradesPanel({ delay }) {
  const pctRef = useRef(null);
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".pep-badge"),
      { scale: 0, rotation: -40, duration: 0.5, ease: "back.out(2.4)" },
      0.6,
    );
    tl.fromTo(
      q(".pep-confetti i"),
      { x: 0, y: 0, opacity: 1, scale: 0 },
      {
        x: (i) => Math.cos((i / 12) * Math.PI * 2) * (40 + (i % 3) * 14),
        y: (i) => Math.sin((i / 12) * Math.PI * 2) * (30 + (i % 3) * 10),
        scale: 1,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.01,
      },
      0.7,
    );
    const st = { v: 0 };
    tl.to(
      st,
      {
        v: 18,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () =>
          pctRef.current && (pctRef.current.textContent = Math.round(st.v)),
      },
      0.8,
    );
    q(".pep-lb-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: GRADE_BANDS[i].n / GRADE_MAX,
          duration: 0.7,
          ease: "power3.out",
        },
        1.3 + i * 0.1,
      ),
    );
  }, delay);

  return (
    <div className="pep-panel" ref={ref}>
      <div className="pep-head js-in">
        <Icon name="layers" /> Designation change{" "}
        <em className="pep-tag">Effective 1 Apr</em>
      </div>
      <div className="pep-kudos js-in">
        <div className="pep-kudos-top">
          <span className="pep-av b">KV</span>
          <span>
            <b>Karthik V.</b> is now <b>Tech Lead</b>
            <small>Senior Developer → Tech Lead · Engineering</small>
          </span>
        </div>
        <div className="pep-kudos-foot">
          <span className="pep-badge-wrap">
            <span className="pep-confetti" aria-hidden>
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} className={`c${i % 4}`} />
              ))}
            </span>
            <span className="pep-badge">
              <Icon name="star" size={13} /> Grade G5 · Level 3
            </span>
          </span>
          <span className="pep-pts">
            +<b ref={pctRef}>0</b>% pay band
          </span>
        </div>
      </div>
      <small className="pep-sub js-in">Grade bands · headcount</small>
      <div className="pep-lb">
        {GRADE_BANDS.map((g, i) => (
          <div key={g.code} className="pep-lb-row js-in">
            <em>{i + 1}</em>
            <span className={`pep-av sm ${["b", "c", "a"][i]}`}>{g.code}</span>
            <span className="pep-lb-name">{g.name}</span>
            <span className="pep-lb-bar">
              <i />
            </span>
            <b>{g.n}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 — Holiday Listings: location-wise calendar, synced everywhere
const HOLIDAYS = [
  "26 Jan · Republic Day",
  "1 May · May Day",
  "15 Aug · Independence Day",
  "2 Oct · Gandhi Jayanti",
  "1 Nov · Kannada Rajyotsava",
];
function HolidayPanel({ delay }) {
  const pctRef = useRef(null);
  const ref = usePanel((tl, q) => {
    q(".pep-step").forEach((el, i) =>
      tl.call(() => el.classList.add("is-done"), null, 0.5 + i * 0.35),
    );
    tl.fromTo(
      q(".pep-exit-bar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.75, ease: "none" },
      0.5,
    );
    const st = { v: 0 };
    tl.to(
      st,
      {
        v: 100,
        duration: 1.75,
        ease: "none",
        onUpdate: () =>
          pctRef.current && (pctRef.current.textContent = Math.round(st.v)),
      },
      0.5,
    );
    tl.from(q(".pep-farewell"), { autoAlpha: 0, y: 10, duration: 0.4 }, 2.3);
  }, delay);

  return (
    <div className="pep-panel" ref={ref}>
      <div className="pep-head js-in">
        <Icon name="calendar" /> Holiday list 2026 · Whitefield{" "}
        <em className="pep-tag">Karnataka</em>
      </div>
      <div className="pep-exit js-in">
        <span className="pep-exit-bar">
          <i />
        </span>
        <b>
          <span ref={pctRef}>0</span>%
        </b>
      </div>
      <ul className="pep-steps">
        {HOLIDAYS.map((s) => (
          <li key={s} className="pep-step">
            <i>
              <Icon name="check" size={9} />
            </i>
            {s}
          </li>
        ))}
      </ul>
      <div className="pep-farewell">
        <span className="pep-farewell-ic">
          <Icon name="calendar" size={13} />
        </span>
        <div>
          <b>Synced to 248 employee calendars</b>
          <small>+ 2 optional holidays · attendance & leave skip them</small>
        </div>
      </div>
    </div>
  );
}

// 4 — Events: create, publish, RSVPs
const EVENT_TITLE = "Annual Day 2026 · Sat 12 Dec";
function EventsPanel({ delay }) {
  const titleRef = useRef(null);
  const rsvpRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const st = { n: 0 };
    tl.to(
      st,
      {
        n: EVENT_TITLE.length,
        duration: 1.1,
        ease: "none",
        onUpdate: () =>
          titleRef.current &&
          (titleRef.current.textContent = EVENT_TITLE.slice(
            0,
            Math.round(st.n),
          )),
      },
      0.4,
    );
    tl.from(
      q(".pep-chip"),
      {
        scale: 0.6,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.3,
        ease: "back.out(2)",
      },
      1.2,
    );
    tl.to(
      q(".pep-publish"),
      { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1 },
      1.7,
    );
    tl.call(() => q(".pep-publish")[0]?.classList.add("is-sent"), null, 1.9);
    const r = { v: 0 };
    tl.to(
      r,
      {
        v: 186,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () =>
          rsvpRef.current && (rsvpRef.current.textContent = Math.round(r.v)),
      },
      2,
    );
    tl.fromTo(
      q(".pep-read-bar i"),
      { scaleX: 0 },
      { scaleX: 186 / 248, duration: 1.2, ease: "power2.out" },
      2,
    );
    tl.from(
      q(".pep-react span"),
      { y: 10, autoAlpha: 0, stagger: 0.1, duration: 0.3, ease: "back.out(2)" },
      2.4,
    );
  }, delay);

  return (
    <div className="pep-panel" ref={ref}>
      <div className="pep-head js-in">
        <Icon name="party" /> New event
      </div>
      <div className="pep-compose js-in">
        <small>Event</small>
        <b>
          <span ref={titleRef} />
          <i className="pep-caret" />
        </b>
        <div className="pep-chips">
          <span className="pep-chip">
            <Icon name="users" size={10} /> All employees · 248
          </span>
          <span className="pep-chip">RSVP on</span>
          <span className="pep-chip">Calendar invite</span>
        </div>
        <span className="pep-publish">
          <span className="a">
            <Icon name="send" size={11} /> Publish
          </span>
          <span className="b">
            <Icon name="check" size={11} /> Published
          </span>
        </span>
      </div>
      <div className="pep-read js-in">
        <span>
          <Icon name="check" size={12} /> Going <b ref={rsvpRef}>0</b> / 248
        </span>
        <span className="pep-read-bar">
          <i />
        </span>
      </div>
      <div className="pep-react">
        <span>✅ 186</span>
        <span>🤔 24</span>
        <span>🎉 92</span>
        <span>🍽️ 140</span>
      </div>
    </div>
  );
}

const PANELS = [DepartmentPanel, GradesPanel, HolidayPanel, EventsPanel];

/* ------------------------------------------------------------------ */
/* People hub app (left side)                                          */
/* ------------------------------------------------------------------ */

const PULSE_R = 30;
const PULSE_C = 2 * Math.PI * PULSE_R;
const TODAY = [
  { icon: "cake", text: "Priya S. · Birthday" },
  { icon: "party", text: "Annual Day · 12 Dec" },
  { icon: "calendar", text: "Christmas · 25 Dec" },
];

function PeopleApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const ringRef = useRef(null);
  const scoreRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // allocation ring counts up once
  useEffect(() => {
    const st = { v: 0 };
    const tw = gsap.to(st, {
      v: 98,
      duration: prefersReduced() ? 0 : 1.6,
      delay: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        if (scoreRef.current) scoreRef.current.textContent = Math.round(st.v);
        if (ringRef.current)
          ringRef.current.style.strokeDashoffset = PULSE_C * (1 - st.v / 100);
      },
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
    <div className="pep-frame" ref={frameRef}>
      <div className="pep-chrome">
        <span className="pep-dot r" />
        <span className="pep-dot y" />
        <span className="pep-dot g" />
        <div className="pep-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/people
        </div>
      </div>

      <div className="pep-topbar js-top">
        <span className="pep-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay" />
        </span>
        <b>Admin</b>
        <span className="pep-search">
          <Icon name="search" size={12} /> Search people, departments or events…
        </span>
        <span className="pep-av sm a">PR</span>
      </div>

      <div className="pep-app">
        <div className="pep-main">
          <div
            className="pep-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="People features"
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
          <div className="pep-panel-wrap" ref={panelWrap}>
            <Panel key={stage} delay={startDelay} />
          </div>
        </div>

        <aside className="pep-side js-side">
          <small className="pep-side-lbl">Org health</small>
          <div className="pep-ring">
            <svg viewBox="0 0 72 72" aria-hidden>
              <circle cx="36" cy="36" r={PULSE_R} className="pep-ring-bg" />
              <circle
                ref={ringRef}
                cx="36"
                cy="36"
                r={PULSE_R}
                className="pep-ring-fill"
                strokeDasharray={PULSE_C}
                strokeDashoffset={PULSE_C}
              />
            </svg>
            <span>
              <b>
                <span ref={scoreRef}>0</span>%
              </b>
              <small>allocated</small>
            </span>
          </div>
          <small className="pep-side-lbl">Coming up</small>
          <div className="pep-today">
            {TODAY.map((t) => (
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
      className="pep-hero"
      ref={sectionRef}
      aria-labelledby="pep-hero-title"
    >
      <div className="pep-hero-bg" aria-hidden>
        <span className="pep-blob b1 js-blob" />
        <span className="pep-blob b2 js-blob" />
        <span className="pep-grid-bg" />
      </div>

      <div className="pep-container pep-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="pep-content">
          <span className="pep-eyebrow js-reveal">
            <span className="pep-live-dot" /> Everyday people operations, sorted
          </span>
          <h1 id="pep-hero-title" className="pep-title js-reveal">
            <span className="pep-grad">People</span>
          </h1>

          <ul className="pep-feats" role="tablist" aria-label="People features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`pep-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="pep-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="pep-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="pep-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="pep-ctas js-reveal">
            <a href="/contact-us" className="pep-btn primary">
              Book a Free Demo <Icon name="arrow" size={16} />
            </a>
            <a href="#pep-next" className="pep-btn ghost">
              <span className="pep-play">
                <Icon name="play" size={10} />
              </span>{" "}
              See how it works
            </a>
          </div>
        </div>

        {/* LEFT: People hub app */}
        <div className="pep-visual" ref={visualRef}>
          <PeopleApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="pep-float f1 js-float">
            <span className="pep-float-ic ok">
              <Icon name="building" size={14} />
            </span>
            <div>
              <strong>12 departments · 6 grades</strong>
              <small>Org structure always up to date</small>
            </div>
          </div>
          <div className="pep-float f2 js-float">
            <span className="pep-float-ic pr">
              <Icon name="calendar" size={14} />
            </span>
            <div>
              <strong>Holiday lists for 3 locations</strong>
              <small>Synced to every calendar</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — People Wall (polaroid corkboard, changes per tab)       */
/* ------------------------------------------------------------------ */

const WALL_HEADING = [
  ["Organise", true],
  ["every"],
  ["team,"],
  ["title"],
  ["and"],
  ["grade", true],
  ["—"],
  ["and"],
  ["keep"],
  ["everyone’s"],
  ["calendar", true],
  ["in"],
  ["sync", true],
];

// dept = icon shown on the Department tab · lvl = career level shown on the Grades tab
const WALL_PEOPLE = [
  {
    av: "PS",
    name: "Priya S.",
    role: "Design",
    tone: "a",
    dept: "pen",
    lvl: "L2",
  },
  {
    av: "KV",
    name: "Karthik V.",
    role: "Engineering",
    tone: "b",
    dept: "code",
    lvl: "L3",
  },
  {
    av: "AR",
    name: "Anita R.",
    role: "Finance",
    tone: "c",
    dept: "wallet",
    lvl: "L4",
  },
  {
    av: "RM",
    name: "Rahul M.",
    role: "Sales",
    tone: "d",
    dept: "chart",
    lvl: "L3",
  },
  {
    av: "DN",
    name: "Deepa N.",
    role: "HR",
    tone: "e",
    dept: "users",
    lvl: "L2",
  },
  {
    av: "SR",
    name: "Sneha R.",
    role: "Design",
    tone: "a",
    dept: "pen",
    lvl: "L1",
  },
  {
    av: "VP",
    name: "Vikram P.",
    role: "Operations",
    tone: "d",
    dept: "briefcase",
    lvl: "L3",
  },
  {
    av: "MK",
    name: "Meera K.",
    role: "Marketing",
    tone: "c",
    dept: "megaphone",
    lvl: "L2",
  },
  {
    av: "AJ",
    name: "Arjun J.",
    role: "Engineering",
    tone: "b",
    dept: "code",
    lvl: "L1",
  },
  {
    av: "NS",
    name: "Neha S.",
    role: "Support",
    tone: "e",
    dept: "smile",
    lvl: "L1",
  },
  {
    av: "RT",
    name: "Rohit T.",
    role: "Sales",
    tone: "d",
    dept: "chart",
    lvl: "L2",
  },
  {
    av: "IK",
    name: "Isha K.",
    role: "Finance",
    tone: "a",
    dept: "wallet",
    lvl: "L2",
  },
];
const STAR = 1; // Karthik gets the new designation
const MILESTONES = { 0: "cake", 3: "award", 9: "cake", 5: "gift" };

const WALL_TABS = [
  {
    label: "Department Allocation",
    icon: "building",
    title: [["Put", true], ["every employee"], ["in the right team", true]],

    stats: [
      ["12", "departments · 3 locations"],
      ["1 click", "to transfer an employee"],
      ["100%", "allocation history kept"],
    ],
  },
  {
    label: "Designations, Grades & Levels",
    icon: "layers",
    title: [["Build", true], ["a clear"], ["career ladder", true]],
    stats: [
      ["40+", "designations supported"],
      ["6", "grade bands · 4 levels"],
      ["0", "manual rule updates on promotion"],
    ],
  },
  {
    label: "Holiday Listings",
    icon: "calendar",
    title: [["One", true], ["holiday calendar"], ["per location", true]],
    stats: [
      ["3", "location-wise holiday lists"],
      ["2", "optional holidays per employee"],
      ["248", "calendars synced"],
    ],
  },
  {
    label: "Events",
    icon: "party",
    title: [["Plan", true], ["company events"], ["people show up to", true]],
    stats: [
      ["186 / 248", "RSVPs for Annual Day"],
      ["Auto", "calendar invites & reminders"],
      ["By team", "or location targeting"],
    ],
  },
  {
    label: "Birthdays & Anniversaries",
    icon: "cake",
    title: [
      ["Never miss", true],
      ["a birthday or"],
      ["work anniversary", true],
    ],

    stats: [
      ["2", "birthdays today"],
      ["1", "five-year anniversary"],
      ["1", "new joiner on Monday"],
    ],
  },
];

const WALL_TIME = 6.5;

function PeopleWallSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const wallRef = useRef(null);
  const cardRef = useRef(null);
  const barRefs = useRef([]);
  const firstChange = useRef(true);

  const go = (i) => setActive((i + WALL_TABS.length) % WALL_TABS.length);

  // Heading reveal, polaroids pinned one by one, autoplay only while on screen.
  // Uses IntersectionObserver (measured by the browser itself) instead of ScrollTrigger,
  // so the wall can never get stuck hidden when the page opens (preloader, late images, etc.).
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const reduce = prefersReduced();
    let played = false;
    let tl = null;

    const ctx = gsap.context(() => {
      if (reduce) return;
      const q = gsap.utils.selector(sectionRef);
      tl = gsap.timeline({ paused: true });
      tl.fromTo(
        q(".pp2-hw > span"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.035, ease: "power4.out" },
        0,
      )
        .fromTo(
          [q(".pp2-tabs"), q(".pp2-card")],
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          0.15,
        )
        .fromTo(
          q(".pp2-polaroid"),
          { y: -40, rotation: () => gsap.utils.random(-20, 20), autoAlpha: 0 },
          {
            y: 0,
            // land exactly on each polaroid's own CSS tilt (--r) so nothing jumps afterwards
            rotation: (i, node) =>
              parseFloat(getComputedStyle(node).getPropertyValue("--r")) || 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.6)",
            clearProps: "transform,opacity,visibility",
          },
          0.25,
        );
    }, sectionRef);

    const play = () => {
      if (played) return;
      played = true;
      tl?.play();
    };

    // very old browsers: just show everything
    if (typeof IntersectionObserver === "undefined") {
      tl?.progress(1);
      setInView(true);
      return () => ctx.revert();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) play();
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
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
          { scaleX: 1, duration: WALL_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(WALL_TIME, () => go(active + 1));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, paused, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-tab wall animation + card swap
  useLayoutEffect(() => {
    const reduce = prefersReduced();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(wallRef);
      if (reduce) return;
      gsap.from(q(".pp2-tagchip"), {
        scale: 0,
        rotation: -30,
        stagger: 0.06,
        duration: 0.35,
        ease: "back.out(2.4)",
        delay: 0.2,
      });
      if (active === 1) {
        gsap.from(q(".pp2-ribbon"), {
          scale: 0,
          rotation: -90,
          duration: 0.55,
          ease: "back.out(2)",
          delay: 0.2,
        });
        gsap.fromTo(
          q(".pp2-burst i"),
          { x: 0, y: 0, opacity: 1, scale: 0 },
          {
            x: (i) => Math.cos((i / 16) * Math.PI * 2) * (60 + (i % 3) * 22),
            y: (i) => Math.sin((i / 16) * Math.PI * 2) * (50 + (i % 3) * 18),
            scale: 1,
            opacity: 0,
            duration: 1.3,
            ease: "power2.out",
            delay: 0.35,
          },
        );
        gsap.from(q(".pp2-kudo"), {
          y: 20,
          autoAlpha: 0,
          duration: 0.45,
          delay: 0.6,
        });
      }
      if (active === 2) {
        gsap.from(q(".pp2-notice"), {
          y: -90,
          rotation: -8,
          autoAlpha: 0,
          duration: 0.7,
          ease: "bounce.out",
          delay: 0.15,
        });
        q(".pp2-seen").forEach((el, i) =>
          gsap.from(el, {
            scale: 0,
            duration: 0.25,
            ease: "back.out(2.6)",
            delay: 0.9 + i * 0.08,
          }),
        );
      }
      if (active === 3) {
        gsap.from(q(".pp2-farewell"), {
          x: 40,
          rotation: 6,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.3,
        });
        gsap.from(q(".pp2-fw-check"), {
          x: 10,
          autoAlpha: 0,
          stagger: 0.18,
          duration: 0.3,
          delay: 0.7,
        });
      }
      if (active === 4) {
        gsap.from(q(".pp2-cake"), {
          y: -14,
          scale: 0,
          stagger: 0.12,
          duration: 0.45,
          ease: "back.out(2.4)",
          delay: 0.2,
        });
        gsap.to(q(".pp2-polaroid.is-mile"), {
          y: -6,
          duration: 0.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.15,
          delay: 0.6,
        });
      }
    }, wallRef);

    if (!firstChange.current && cardRef.current && !reduce) {
      gsap.fromTo(
        cardRef.current,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        cardRef.current.querySelectorAll(".pp2-tw > span"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power4.out",
          delay: 0.1,
        },
      );
    }
    firstChange.current = false;
    return () => ctx.revert();
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

  const tab = WALL_TABS[active];
  const words = tab.title.flatMap(([t, hl]) =>
    t.split(" ").map((w) => [w, hl]),
  );

  const stateOf = (i) => {
    if (active === 1) return i === STAR ? "is-star" : "is-dim";
    if (active === 4) return MILESTONES[i] ? "is-mile" : "is-dim";
    return "";
  };

  return (
    <section
      className="pp2"
      ref={sectionRef}
      aria-labelledby="pp2-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pep-container">
        <h2 id="pp2-title" className="pp2-title">
          {WALL_HEADING.map(([w, hl], i) => (
            <span key={i} className="pp2-hw">
              <span className={hl ? "hl" : ""}>{w}</span>
            </span>
          ))}
        </h2>

        <div
          className="pp2-tabs"
          ref={tabsRef}
          role="tablist"
          aria-label="People modules"
        >
          {WALL_TABS.map((t, i) => (
            <button
              type="button"
              key={t.label}
              role="tab"
              aria-selected={active === i}
              className={`pp2-tab ${active === i ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="pp2-tab-ic">
                <Icon name={t.icon} size={14} />
              </span>
              {t.label}
              <span className="pp2-tab-bar">
                <i ref={(el) => (barRefs.current[i] = el)} />
              </span>
            </button>
          ))}
        </div>

        <div className="pp2-grid">
          {/* LEFT: the people wall */}
          <div className={`pp2-board tab-${active}`} ref={wallRef}>
            <div className="pp2-board-head">
              <span>
                <Icon name="users" size={14} /> Team wall · Whitefield
              </span>
              <em>{tab.label}</em>
            </div>
            <div className="pp2-wall">
              {WALL_PEOPLE.map((p, i) => (
                <div
                  key={p.av}
                  className={`pp2-polaroid ${stateOf(i)}`}
                  style={{ "--r": `${((i * 7) % 9) - 4}deg` }}
                >
                  <span className="pp2-tack" />
                  <span className={`pp2-photo ${p.tone}`}>{p.av}</span>
                  <b>{p.name}</b>
                  <small>{p.role}</small>

                  {active === 0 && (
                    <span className="pp2-tagchip" title={p.role}>
                      <Icon name={p.dept} size={11} />
                    </span>
                  )}
                  {active === 1 && i !== STAR && (
                    <span
                      className="pp2-tagchip"
                      style={{ fontSize: 9, fontWeight: 700 }}
                    >
                      {p.lvl}
                    </span>
                  )}
                  {active === 1 && i === STAR && (
                    <>
                      <span className="pp2-burst" aria-hidden>
                        {Array.from({ length: 16 }, (_, k) => (
                          <i key={k} className={`c${k % 4}`} />
                        ))}
                      </span>
                      <span className="pp2-ribbon">
                        <Icon name="star" size={14} />
                      </span>
                    </>
                  )}
                  {active === 2 && i % 5 !== 4 && (
                    <span className="pp2-seen">
                      <Icon name="check" size={9} />
                    </span>
                  )}
                  {active === 4 && MILESTONES[i] && (
                    <span className="pp2-cake">
                      <Icon name={MILESTONES[i]} size={13} />
                    </span>
                  )}
                </div>
              ))}

              {active === 1 && (
                <div className="pp2-kudo">
                  <span className="pep-av sm b">KV</span>
                  <span>
                    <b>Karthik V. → Tech Lead</b>
                    <small>Grade G5 · Level 3 · pay band & leave updated</small>
                  </span>
                </div>
              )}
              {active === 2 && (
                <div className="pp2-notice">
                  <span className="pp2-notice-pin" />
                  <small>
                    <Icon name="calendar" size={11} /> Next holiday
                  </small>
                  <b>Christmas 🎄</b>
                  <span>Friday, 25 Dec · Office closed</span>
                  <em>
                    <Icon name="check" size={11} /> On 248 calendars
                  </em>
                </div>
              )}
              {active === 3 && (
                <div className="pp2-farewell">
                  <small>Event · Sat 12 Dec</small>
                  <b>Annual Day 2026 🎉</b>
                  {[
                    "Invite sent to 248",
                    "186 RSVPs · meal choices in",
                    "Calendar invite added",
                    "Reminder 1 day before",
                  ].map((c) => (
                    <span key={c} className="pp2-fw-check">
                      <Icon name="check" size={10} /> {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: copy + numbers */}
          <div className="pp2-side">
            <div className="pp2-card" ref={cardRef} role="tabpanel">
              <span className="pp2-step">
                <span className="pp2-step-ic">
                  <Icon name={tab.icon} size={14} />
                </span>
                {tab.label}{" "}
                <em>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(WALL_TABS.length).padStart(2, "0")}
                </em>
              </span>
              <h3>
                {words.map(([w, hl], i) => (
                  <span key={`${active}-${i}`} className="pp2-tw">
                    <span className={hl ? "hl" : ""}>{w}</span>
                  </span>
                ))}
              </h3>
              <p>{tab.desc}</p>
              <div className="pp2-stats">
                {tab.stats.map(([v, l]) => (
                  <div key={l} className="pp2-stat">
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pp2-actions">
              <a href="/contact-us" className="pep-btn primary">
                Get Started with NGriffinPay <Icon name="arrow" size={16} />
              </a>
              <div className="pp2-nav">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => go(active - 1)}
                >
                  <span className="pp2-flip">
                    <Icon name="arrow" size={16} />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Next"
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
    q: "What does the People module in NGriffinPay include?",
    a: "People covers the day-to-day side of HR: department allocation, designations, grades and levels, location-wise holiday listings, and company events, birthdays and work anniversaries — all linked to the same employee record, so nothing is maintained twice.",
    keys: [
      "what is",
      "what does",
      "about",
      "overview",
      "explain",
      "people",
      "include",
      "module",
      "feature",
    ],
  },
  {
    q: "How does department allocation work?",
    a: "Assign each employee to a department, sub-team, location, cost centre and reporting manager — individually or in bulk from Excel. When someone moves, the org chart, approval routes and payroll costing update automatically, and the full transfer history is kept on their profile.",
    keys: [
      "department",
      "allocation",
      "allocate",
      "team",
      "transfer",
      "move",
      "cost centre",
      "cost center",
      "reporting",
      "manager",
      "org chart",
    ],
  },
  {
    q: "Can we set up our own designations, grades and levels?",
    a: "Yes. Create any designations you use, group them into grade bands and career levels, and link each grade to salary ranges, leave entitlements, reimbursement limits and approval rights. When an employee is promoted, everything tied to their grade updates with it.",
    keys: [
      "designation",
      "title",
      "grade",
      "grades",
      "level",
      "levels",
      "band",
      "career",
      "promotion",
      "hierarchy",
    ],
  },
  {
    q: "Can different offices have different holiday lists?",
    a: "Yes. Create a separate holiday list for each location or state — for example Karnataka for Bengaluru and Maharashtra for Pune — and add optional or restricted holidays that employees can choose from. Holidays appear in every employee’s app and calendar, and attendance and leave calculations skip them automatically.",
    keys: [
      "holiday",
      "holidays",
      "calendar",
      "festival",
      "optional",
      "restricted",
      "location",
      "state",
      "office",
      "public holiday",
    ],
  },
  {
    q: "How are company events managed?",
    a: "Create town halls, trainings, team outings or annual days for the whole company or selected teams and locations. Employees get a calendar invite and reminders, can RSVP and share meal preferences from the app, and HR sees live attendance numbers.",
    keys: [
      "event",
      "events",
      "rsvp",
      "town hall",
      "outing",
      "annual day",
      "celebration",
      "invite",
      "training",
      "party",
    ],
  },
  {
    q: "Are birthdays and work anniversaries celebrated automatically?",
    a: "Yes. Upcoming birthdays, work anniversaries and new joiners show on the dashboard every morning, and wishes go out automatically on the day — so no milestone slips through the cracks.",
    keys: [
      "birthday",
      "anniversary",
      "anniversaries",
      "milestone",
      "wish",
      "wishes",
      "new joiner",
    ],
  },
  {
    q: "Can employees see this on their phone?",
    a: "Yes. From the NGriffinPay employee app, staff can see their department, designation, grade and manager, check the holiday list for their location, pick optional holidays, and RSVP to company events.",
    keys: [
      "mobile",
      "phone",
      "app",
      "employee self",
      "self service",
      "self-service",
      "android",
      "ios",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm Griffy. Pick a question or type your own about departments, grades, holidays or events.";
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
      <div className="peq-row bot" ref={ref}>
        <span className="peq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="peq-bubble bot peq-typing"
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
      <div className="peq-row user" ref={ref}>
        <div className="peq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="peq-row bot" ref={ref}>
      <span className="peq-bot-av" aria-hidden>
        N
      </span>
      <div className="peq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="peq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function PeopleFaqSection() {
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
      gsap.from(q(".peq-chat"), {
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
    <section className="peq" ref={sectionRef} aria-labelledby="peq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="pep-container peq-grid">
        <div className="peq-left">
          <span className="peq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="peq-title" className="peq-title js-faq-reveal">
            People – <span className="pep-grad">FAQs</span>
          </h2>

          <ul className="peq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`peq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="peq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="peq-q-text">{f.q}</span>
                  <span className="peq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="peq-chat">
          <div className="peq-chat-head">
            <span className="peq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="peq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="peq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="peq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="peq-suggest" aria-label="Suggested questions">
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

          <form className="peq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about departments, grades, holidays or events…"
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

export default function People() {
  return (
    <div className="pep-page">
      <HeroSection />
      <span id="pep-next" />
      <PeopleWallSection />
      <PeopleFaqSection />
    </div>
  );
}
