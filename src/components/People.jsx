// People.jsx
// NGriffinPay  — Product inner page: "People"
// (Asset Management · Reward & Recognition · Announcements · Separation)
// Section 1: Hero banner (live People hub app on the left, content on the right)
// Section 2: People Wall (polaroid corkboard that changes per tab, GSAP)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)
// NOTE: all wording below is placeholder copy — replace it when the client sends the final content.

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
    title: "Asset Management",
    short: "Assets",
    desc: "Issue, track and recover laptops, phones and ID cards for every employee.",
    icon: "laptop",
  },
  {
    title: "Reward & Recognition",
    short: "Rewards",
    desc: "Let anyone give kudos, badges and points that people can redeem.",
    icon: "award",
  },
  {
    title: "Announcements",
    short: "Announce",
    desc: "Share company news with the right teams and see who has read it.",
    icon: "megaphone",
  },
  {
    title: "Separation",
    short: "Separation",
    desc: "Run resignations, clearances and exit interviews without chasing anyone.",
    icon: "door",
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
    case "laptop":
      return (
        <svg {...p}>
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2 19h20" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 18h2" />
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
    case "door":
      return (
        <svg {...p}>
          <path d="M13 4h5a2 2 0 0 1 2 2v14M4 20h16" />
          <path d="M13 4 6 6v14h7z" />
          <path d="M10 12v.01" />
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
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
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

// 1 — Asset Management: an employee's kit
const KIT = [
  {
    name: 'MacBook Pro 14"',
    tag: "LT-0231",
    icon: "laptop",
    state: "Assigned",
  },
  {
    name: "iPhone 13 (office)",
    tag: "PH-0055",
    icon: "phone",
    state: "Assigned",
  },
  { name: "Access ID card", tag: "ID-1093", icon: "id", state: "Assigned" },
];
function AssetsPanel({ delay }) {
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
        <Icon name="laptop" /> Assets · Sneha R.{" "}
        <em className="pep-tag">New joiner</em>
      </div>
      <div className="pep-kits">
        {KIT.map((k) => (
          <div key={k.tag} className="pep-kit">
            <span className="pep-kit-ic">
              <Icon name={k.icon} size={14} />
            </span>
            <span className="pep-kit-txt">
              <b>{k.name}</b>
              <small>{k.tag} · Condition: New</small>
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
          <b>Kit acknowledged by Sneha</b>
          <small>Digital sign-off · IT notified · return tracked at exit</small>
        </div>
      </div>
    </div>
  );
}

// 2 — Reward & Recognition: kudos post + leaderboard
const LEADERS = [
  { av: "KV", name: "Karthik V.", pts: 2400 },
  { av: "AR", name: "Anita R.", pts: 1950 },
  { av: "PS", name: "Priya S.", pts: 1620 },
];
function RewardsPanel({ delay }) {
  const ptsRef = useRef(null);
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
        v: 500,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () =>
          ptsRef.current && (ptsRef.current.textContent = Math.round(st.v)),
      },
      0.8,
    );
    q(".pep-lb-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: LEADERS[i].pts / 2400, duration: 0.7, ease: "power3.out" },
        1.3 + i * 0.1,
      ),
    );
  }, delay);

  return (
    <div className="pep-panel" ref={ref}>
      <div className="pep-head js-in">
        <Icon name="award" /> Recognition wall{" "}
        <em className="pep-tag">This month</em>
      </div>
      <div className="pep-kudos js-in">
        <div className="pep-kudos-top">
          <span className="pep-av b">AR</span>
          <span>
            <b>Anita R.</b> recognised <b>Karthik V.</b>
            <small>
              “Shipped the attendance report a day early. Superstar!”
            </small>
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
              <Icon name="star" size={13} /> Star Performer
            </span>
          </span>
          <span className="pep-pts">
            +<b ref={ptsRef}>0</b> points
          </span>
        </div>
      </div>
      <small className="pep-sub js-in">Leaderboard</small>
      <div className="pep-lb">
        {LEADERS.map((l, i) => (
          <div key={l.av} className="pep-lb-row js-in">
            <em>{i + 1}</em>
            <span className={`pep-av sm ${["b", "c", "a"][i]}`}>{l.av}</span>
            <span className="pep-lb-name">{l.name}</span>
            <span className="pep-lb-bar">
              <i />
            </span>
            <b>{l.pts.toLocaleString("en-IN")}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 — Announcements: compose, publish, read receipts
const ANN_TITLE = "Diwali celebration · Friday 4 PM";
function AnnouncePanel({ delay }) {
  const titleRef = useRef(null);
  const readRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const st = { n: 0 };
    tl.to(
      st,
      {
        n: ANN_TITLE.length,
        duration: 1.1,
        ease: "none",
        onUpdate: () =>
          titleRef.current &&
          (titleRef.current.textContent = ANN_TITLE.slice(0, Math.round(st.n))),
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
        v: 212,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () =>
          readRef.current && (readRef.current.textContent = Math.round(r.v)),
      },
      2,
    );
    tl.fromTo(
      q(".pep-read-bar i"),
      { scaleX: 0 },
      { scaleX: 212 / 248, duration: 1.2, ease: "power2.out" },
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
        <Icon name="megaphone" /> New announcement
      </div>
      <div className="pep-compose js-in">
        <small>Title</small>
        <b>
          <span ref={titleRef} />
          <i className="pep-caret" />
        </b>
        <div className="pep-chips">
          <span className="pep-chip">
            <Icon name="users" size={10} /> All employees · 248
          </span>
          <span className="pep-chip">App + email</span>
          <span className="pep-chip">Pin for 3 days</span>
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
          <Icon name="eye" size={12} /> Read by <b ref={readRef}>0</b> / 248
        </span>
        <span className="pep-read-bar">
          <i />
        </span>
      </div>
      <div className="pep-react">
        <span>🎉 86</span>
        <span>🪔 54</span>
        <span>❤️ 31</span>
        <span>👏 22</span>
      </div>
    </div>
  );
}

// 4 — Separation: exit checklist
const EXIT_STEPS = [
  "Resignation accepted",
  "Handover to Rahul M.",
  "Assets returned",
  "Finance & IT clearance",
  "F&F and relieving letter",
];
function SeparationPanel({ delay }) {
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
        <Icon name="door" /> Exit · Vikram P.{" "}
        <em className="pep-tag">Last day 31 Oct</em>
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
        {EXIT_STEPS.map((s) => (
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
          <Icon name="heart" size={13} />
        </span>
        <div>
          <b>Farewell card signed by 34 colleagues</b>
          <small>Exit interview done · alumni network invite sent</small>
        </div>
      </div>
    </div>
  );
}

const PANELS = [AssetsPanel, RewardsPanel, AnnouncePanel, SeparationPanel];

/* ------------------------------------------------------------------ */
/* People hub app (left side)                                          */
/* ------------------------------------------------------------------ */

const PULSE_R = 30;
const PULSE_C = 2 * Math.PI * PULSE_R;
const TODAY = [
  { icon: "cake", text: "Priya S. · Birthday" },
  { icon: "award", text: "Rahul M. · 5 years" },
  { icon: "gift", text: "Sneha R. · Joins Mon" },
];

function PeopleApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const ringRef = useRef(null);
  const scoreRef = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // engagement ring counts up once
  useEffect(() => {
    const st = { v: 0 };
    const tw = gsap.to(st, {
      v: 82,
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
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay " />
        </span>
        <b>Admin</b>
        <span className="pep-search">
          <Icon name="search" size={12} /> Search people, assets or posts…
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
          <small className="pep-side-lbl">Team pulse</small>
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
                <span ref={scoreRef}>0</span>
              </b>
              <small>engagement</small>
            </span>
          </div>
          <small className="pep-side-lbl">Today</small>
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
            <span className="pep-live-dot" /> From first laptop to farewell
          </span>
          <h1 id="pep-hero-title" className="pep-title js-reveal">
            <span className="pep-grad">People</span>
          </h1>
          <p className="pep-lead js-reveal">
            Equip, recognise and keep every employee in the loop — and when it’s
            time to say goodbye, do it the right way.
          </p>

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
              <Icon name="star" size={14} />
            </span>
            <div>
              <strong>1,240 kudos this year</strong>
              <small>Recognition that’s seen by all</small>
            </div>
          </div>
          <div className="pep-float f2 js-float">
            <span className="pep-float-ic pr">
              <Icon name="megaphone" size={14} />
            </span>
            <div>
              <strong>85% read in 1 hour</strong>
              <small>Announcements that land</small>
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
  ["Equip,", true],
  ["celebrate", true],
  ["and"],
  ["connect", true],
  ["your"],
  ["people"],
  ["—"],
  ["from"],
  ["first"],
  ["day"],
  ["to"],
  ["farewell", true],
];

const WALL_PEOPLE = [
  { av: "PS", name: "Priya S.", role: "Design", tone: "a", asset: "laptop" },
  {
    av: "KV",
    name: "Karthik V.",
    role: "Engineering",
    tone: "b",
    asset: "laptop",
  },
  { av: "AR", name: "Anita R.", role: "Finance", tone: "c", asset: "phone" },
  { av: "RM", name: "Rahul M.", role: "Sales", tone: "d", asset: "phone" },
  { av: "DN", name: "Deepa N.", role: "HR", tone: "e", asset: "id" },
  { av: "SR", name: "Sneha R.", role: "Design", tone: "a", asset: "laptop" },
  {
    av: "VP",
    name: "Vikram P.",
    role: "Operations",
    tone: "d",
    asset: "laptop",
  },
  { av: "MK", name: "Meera K.", role: "Marketing", tone: "c", asset: "phone" },
  {
    av: "AJ",
    name: "Arjun J.",
    role: "Engineering",
    tone: "b",
    asset: "laptop",
  },
  { av: "NS", name: "Neha S.", role: "Support", tone: "e", asset: "id" },
  { av: "RT", name: "Rohit T.", role: "Sales", tone: "d", asset: "phone" },
  { av: "IK", name: "Isha K.", role: "Finance", tone: "a", asset: "laptop" },
];
const STAR = 1; // Karthik gets recognised
const LEAVER = 6; // Vikram leaves
const MILESTONES = { 0: "cake", 3: "award", 9: "cake", 5: "gift" };

const WALL_TABS = [
  {
    label: "Asset Management",
    icon: "laptop",
    title: [["Equip", true], ["every employee"], ["from day one", true]],
    desc: "Laptops, phones and ID cards are issued against each person, tracked through repairs and recovered automatically at exit.",
    stats: [
      ["384", "assets tracked"],
      ["2 min", "to issue a full kit"],
      ["0", "assets lost at exit"],
    ],
  },
  {
    label: "Reward & Recognition",
    icon: "award",
    title: [["Celebrate", true], ["great work,"], ["publicly", true]],
    desc: "Anyone can give kudos, badges and points. Recognition shows up on the company wall and points can be redeemed for rewards.",
    stats: [
      ["1,240", "kudos given this year"],
      ["9", "badges to award"],
      ["500", "points per Star Performer"],
    ],
  },
  {
    label: "Announcements",
    icon: "megaphone",
    title: [["Reach", true], ["every employee"], ["instantly", true]],
    desc: "Post news to the whole company or just one team or location, send it by app and email, and see exactly who has read it.",
    stats: [
      ["212 / 248", "read within an hour"],
      ["App + email", "delivered together"],
      ["By team", "or location targeting"],
    ],
  },
  {
    label: "Separation",
    icon: "door",
    title: [["Say", true], ["goodbye"], ["the right way", true]],
    desc: "Resignations, handovers, clearances and exit interviews run on one checklist — with F&F and relieving letters at the end.",
    stats: [
      ["4", "departments cleared automatically"],
      ["48 hrs", "to full & final settlement"],
      ["100%", "exit interviews recorded"],
    ],
  },
  {
    label: "Milestones",
    icon: "cake",
    title: [
      ["Never miss", true],
      ["a birthday or"],
      ["work anniversary", true],
    ],
    desc: "Birthdays, work anniversaries and new joiners are surfaced every morning, with wishes sent automatically on the day.",
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
    if (active === 3) return i === LEAVER ? "is-leaving" : "";
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
                    <span className="pp2-tagchip">
                      <Icon name={p.asset} size={11} />
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
                  {active === 2 && i !== LEAVER && i % 5 !== 4 && (
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
                  <span className="pep-av sm c">AR</span>
                  <span>
                    <b>Anita → Karthik</b>
                    <small>“Shipped the report a day early!” · +500 pts</small>
                  </span>
                </div>
              )}
              {active === 2 && (
                <div className="pp2-notice">
                  <span className="pp2-notice-pin" />
                  <small>
                    <Icon name="megaphone" size={11} /> Announcement
                  </small>
                  <b>Diwali celebration 🪔</b>
                  <span>Friday, 4 PM · Cafeteria</span>
                  <em>
                    <Icon name="eye" size={11} /> Read by 212 of 248
                  </em>
                </div>
              )}
              {active === 3 && (
                <div className="pp2-farewell">
                  <small>Farewell · Vikram P.</small>
                  <b>Thank you for 4 great years 💙</b>
                  {[
                    "Handover done",
                    "Laptop & ID returned",
                    "F&F processed",
                    "Relieving letter sent",
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
    q: "What does the People module in NGriffinPay  include?",
    a: "People brings together four everyday HR jobs: asset management, reward & recognition, company announcements and employee separation — all linked to the same employee record, so nothing is tracked twice.",
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
    q: "How are company assets tracked and recovered?",
    a: "Every laptop, phone or ID card is issued against an employee with a digital acknowledgement. You can see who has what, its condition and service history — and at exit, pending assets are added to the clearance checklist automatically.",
    keys: [
      "asset",
      "laptop",
      "phone",
      "id card",
      "equipment",
      "device",
      "recover",
      "return",
      "track",
    ],
  },
  {
    q: "How does reward and recognition work?",
    a: "Managers and colleagues can give kudos, badges and points from the web or mobile app. Recognition appears on the company wall, and points can be redeemed for rewards set up by HR.",
    keys: [
      "reward",
      "recognition",
      "kudos",
      "badge",
      "points",
      "appreciate",
      "award",
      "redeem",
      "r&r",
    ],
  },
  {
    q: "Can announcements be sent to specific teams or locations?",
    a: "Yes. Post to the whole company or target a department, team or office location. Announcements go out on the app and by email, can be pinned, and you can see who has read them.",
    keys: [
      "announcement",
      "announce",
      "news",
      "notice",
      "circular",
      "team",
      "location",
      "broadcast",
      "read",
    ],
  },
  {
    q: "How is employee separation handled?",
    a: "When a resignation is accepted, a separation checklist starts: notice period, handover, department clearances, asset return and exit interview. Once cleared, full & final settlement and relieving letters are generated.",
    keys: [
      "separation",
      "exit",
      "resign",
      "resignation",
      "leaving",
      "clearance",
      "notice",
      "relieving",
      "full and final",
      "f&f",
      "offboarding",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about assets, rewards, announcements or separation.";
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
          <p className="peq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

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
              placeholder="Ask about assets, kudos or exits…"
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
