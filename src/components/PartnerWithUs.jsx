// PartnerWithUs.jsx
// NGriffinPay  — "Partner With Us" inner page
// Section 1: "Who can be our partner?" — a live partner network: the NGriffinPay  hub in the
//            middle, the 6 partner types around it, data flowing along the lines (GSAP).
//            Auto-cycles while in view; click a node or a row to pick a partner type.
// Section 2: Partnership programs — Reseller (live partner-portal mockup: deals, margin, support)
//            and Alliance (two apps syncing through an API bridge). Auto-switches while in view.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)
// NOTE: the partner descriptions/tags are placeholder copy — replace them when the client sends final content.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./PartnerWithUs.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const PARTNERS = [
  {
    title: "Payroll Processing Companies",
    short: "Payroll Cos.",
    icon: "rupee",
    desc: "Run payroll for all your clients from one dashboard — salaries, payslips and statutory reports in a few clicks.",
    tags: ["Multi-client payroll", "Bulk payslips"],
  },
  {
    title: "HR Consultancy Firms",
    short: "HR Consultancy",
    icon: "users",
    desc: "Give every client a ready HRMS for attendance, leave and onboarding while you focus on advisory work.",
    tags: ["Client HR setup", "Recurring revenue"],
  },
  {
    title: "Are you a CA (Chartered Accountant)?",
    short: "CA",
    badge: "CA",
    desc: "Recommend NGriffinPay  to your clients and close TDS, Form 16 and payroll audits faster with clean data.",
    tags: ["TDS & Form 16", "Audit-ready reports"],
  },
  {
    title: "Are you a CS (Company Secretary)?",
    short: "CS",
    badge: "CS",
    desc: "Keep employee records, statutory registers and compliance calendars on track for every company you manage.",
    tags: ["Statutory registers", "Compliance calendar"],
  },
  {
    title: "Are you a Labour Consultant?",
    short: "Labour",
    icon: "shield",
    desc: "File PF, ESI, PT and LWF for your clients without chasing spreadsheets — the numbers come straight from payroll.",
    tags: ["PF · ESI · PT · LWF", "Monthly returns"],
  },
  {
    title: "Factory Compliance Advisors",
    short: "Factory",
    icon: "factory",
    desc: "Track shifts, overtime, wage registers and Factories Act forms for your clients' plants in one place.",
    tags: ["Shifts & overtime", "Wage registers"],
  },
];

const CYCLE = 4.2; // seconds per partner while auto-playing
const RADIUS = 38; // % of the visual box — distance of nodes from the hub

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// node positions (hexagon, starting at the top)
const NODES = PARTNERS.map((_, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: 50 + RADIUS * Math.cos(a), y: 50 + RADIUS * Math.sin(a) };
});

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 18 }) {
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
    case "rupee":
      return (
        <svg {...p}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
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
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "factory":
      return (
        <svg {...p}>
          <path d="M2 20h20M4 20V10l5 3V10l5 3V6l6 3v11" />
          <path d="M8 17h1M13 17h1M18 17h1" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...p}>
          <path d="m11 17 2 2a1 1 0 1 0 3-3" />
          <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
          <path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    default:
      return null;
  }
}

function NodeMark({ p, size }) {
  return p.badge ? (
    <span className="ptn-badge-txt">{p.badge}</span>
  ) : (
    <Icon name={p.icon} size={size} />
  );
}

/* ------------------------------------------------------------------ */
/* Visual — partner network                                            */
/* ------------------------------------------------------------------ */

function PartnerNetwork({ active, onPick }) {
  const rootRef = useRef(null);

  // ambient: rotating rings + packets flowing on every line
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(".ptn-ring.r1", {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(".ptn-ring.r2", {
        rotation: -360,
        duration: 60,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(".ptn-hub-glow", {
        scale: 1.18,
        opacity: 0.35,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      rootRef.current.querySelectorAll(".ptn-packet").forEach((dot, i) => {
        const n = NODES[i % NODES.length];
        const inbound = i < NODES.length; // first set flows node → hub, second set hub → node
        const from = inbound ? n : { x: 50, y: 50 };
        const to = inbound ? { x: 50, y: 50 } : n;
        gsap.fromTo(
          dot,
          { attr: { cx: from.x, cy: from.y }, opacity: 0 },
          {
            keyframes: [
              { opacity: 1, duration: 0.2 },
              { attr: { cx: to.x, cy: to.y }, duration: 1.6, ease: "none" },
              { opacity: 0, duration: 0.2 },
            ],
            repeat: -1,
            repeatDelay: 0.6 + (i % 3) * 0.4,
            delay: i * 0.35,
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // entrance
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".ptn-hub", {
        scale: 0.4,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.8)",
      })
        .from(
          ".ptn-line",
          {
            attr: { "stroke-dashoffset": 60 },
            opacity: 0,
            stagger: 0.06,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          ".ptn-node",
          {
            scale: 0,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "back.out(2)",
          },
          "-=0.4",
        )
        .from(
          ".ptn-float",
          { y: 16, opacity: 0, stagger: 0.12, duration: 0.5 },
          "-=0.2",
        );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // active node: pulse + burst along its line
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced()) return;
    const node = root.querySelector(
      `.ptn-node[data-i="${active}"] .ptn-node-ic`,
    );
    const ping = root.querySelector(".ptn-ping");
    gsap.fromTo(
      node,
      { scale: 0.85 },
      { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" },
    );
    gsap.fromTo(
      ping,
      { scale: 0.6, opacity: 0.8 },
      { scale: 1.8, opacity: 0, duration: 1, ease: "power2.out" },
    );
    gsap.fromTo(
      root.querySelector(".ptn-callout"),
      { xPercent: -50, y: 10, opacity: 0 },
      { xPercent: -50, y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
    );
  }, [active]);

  return (
    <div className="ptn-net" ref={rootRef}>
      <svg className="ptn-net-svg" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id="ptnLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d6fd8" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle className="ptn-ring r1" cx="50" cy="50" r={RADIUS} />
        <circle className="ptn-ring r2" cx="50" cy="50" r={RADIUS - 13} />
        {NODES.map((n, i) => (
          <line
            key={i}
            className={`ptn-line ${i === active ? "is-on" : ""}`}
            x1="50"
            y1="50"
            x2={n.x}
            y2={n.y}
          />
        ))}
        {[...NODES, ...NODES].map((_, i) => (
          <circle
            key={`p${i}`}
            className={`ptn-packet ${i % NODES.length === active ? "is-on" : ""}`}
            r="0.9"
            cx="50"
            cy="50"
            opacity="0"
          />
        ))}
      </svg>

      {/* hub */}
      <div className="ptn-hub">
        <span className="ptn-hub-glow" aria-hidden />
        <span className="ptn-ping" aria-hidden />
        <span className="ptn-hub-logo">
          <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay " />
        </span>
        <b>NGriffinPay </b>
        <small>Partner Network</small>
      </div>

      {/* nodes */}
      {PARTNERS.map((p, i) => (
        <button
          key={p.title}
          type="button"
          data-i={i}
          className={`ptn-node ${i === active ? "is-on" : ""}`}
          style={{ left: `${NODES[i].x}%`, top: `${NODES[i].y}%` }}
          onClick={() => onPick(i)}
          aria-label={p.title}
          aria-pressed={i === active}
        >
          <span className="ptn-node-ic">
            <NodeMark p={p} size={20} />
          </span>
          <span className="ptn-node-lbl">{p.short}</span>
        </button>
      ))}

      {/* floating stat chips (placeholder) */}
      <div className="ptn-float f1">
        <Icon name="handshake" size={15} />
        <span>
          <b>Grow</b> with every client
        </span>
      </div>
      <div className="ptn-float f2">
        <span className="ptn-dot" />
        <span>
          <b>One dashboard</b> · all clients
        </span>
      </div>

      {/* active partner tag under the hub */}
      <div className="ptn-callout" key={active}>
        <Icon name="check" size={11} /> {PARTNERS[active].tags[0]}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 1 — Who can be our partner?                                 */
/* ------------------------------------------------------------------ */

function PartnerHero() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  // play only while the section is on screen
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onToggle: (s) => setInView(s.isActive),
    });
    return () => st.kill();
  }, []);

  // auto-cycle
  useEffect(() => {
    if (!inView || paused || prefersReduced()) return undefined;
    const dc = gsap.delayedCall(CYCLE, () =>
      setActive((a) => (a + 1) % PARTNERS.length),
    );
    return () => dc.kill();
  }, [active, inView, paused]);

  // content entrance
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".ptn-content > .ptn-anim", {
        y: 26,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".ptn-row", {
        x: 30,
        opacity: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.5,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // open-row body + progress bar
  useEffect(() => {
    const row = listRef.current?.querySelector(`.ptn-row[data-i="${active}"]`);
    if (!row) return undefined;
    if (prefersReduced()) return undefined;
    const body = row.querySelectorAll(".ptn-row-body > *");
    gsap.fromTo(
      body,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.35, delay: 0.1 },
    );
    const bar = row.querySelector(".ptn-row-bar i");
    const tw = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: CYCLE, ease: "none", paused: !inView || paused },
    );
    return () => tw.kill();
  }, [active, inView, paused]);

  const pick = (i) => {
    setActive(i);
    setPaused(true);
  };

  return (
    <section className="ptn-hero" ref={rootRef}>
      <div className="ptn-hero-bg" aria-hidden>
        <span className="ptn-blob b1" />
        <span className="ptn-blob b2" />
        <span className="ptn-grid-bg" />
      </div>
      <div className="ptn-container ptn-hero-grid">
        <div className="ptn-visual">
          <PartnerNetwork active={active} onPick={pick} />
        </div>

        <div
          className="ptn-content"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="ptn-eyebrow ptn-anim">
            <Icon name="handshake" size={14} /> Partner With Us
          </span>
          <h1 className="ptn-anim">
            Who can be <span>our partner?</span>
          </h1>
          <p className="ptn-lead ptn-anim">
            If you look after the payroll, HR or compliance of other businesses,
            NGriffinPay can become part of the work you already do — and grow
            with you.
          </p>

          <ul className="ptn-list" ref={listRef}>
            {PARTNERS.map((p, i) => (
              <li
                key={p.title}
                data-i={i}
                className={`ptn-row ${i === active ? "is-on" : ""}`}
              >
                <button
                  type="button"
                  className="ptn-row-head"
                  onClick={() => pick(i)}
                  aria-expanded={i === active}
                >
                  <span className="ptn-row-ic">
                    <NodeMark p={p} size={17} />
                  </span>
                  <span className="ptn-row-title">{p.title}</span>
                  <span className="ptn-row-num">0{i + 1}</span>
                </button>
                <div className="ptn-row-drawer">
                  <div className="ptn-row-body">
                    <p>{p.desc}</p>
                    <div className="ptn-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="ptn-row-bar" aria-hidden>
                  <i />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Partnership programs (Reseller / Alliance)              */
/* ------------------------------------------------------------------ */

const PROGRAMS = [
  {
    key: "reseller",
    title: "Reseller Partners",
    icon: "tag",
    desc: "Promote and sell NGriffinPay  solutions while earning attractive margins and enjoying end-to-end support.",
    perks: [
      "Margin on every plan you sell and renew",
      "Demo, onboarding and support handled with you",
      "Your own partner portal to track clients",
    ],
    url: "partners.ngriffinpay.com/reseller",
  },
  {
    key: "alliance",
    title: "Alliance Partners",
    icon: "link",
    desc: "Collaborate strategically to integrate our offerings and deliver comprehensive HR tech solutions together.",
    perks: [
      "Two-way integration with open APIs",
      "Joint solutions for shared customers",
      "Co-marketing and shared go-to-market",
    ],
    url: "partners.ngriffinpay.com/alliance",
  },
];

const PROGRAM_TIME = 9; // seconds per program while auto-playing

const DEALS = {
  lead: [
    { co: "Greenleaf Foods", emp: 30, plan: "Starter" },
    { co: "Nova Diagnostics", emp: 65, plan: "Professional" },
  ],
  demo: [{ co: "Apex Tools Pvt Ltd", emp: 45, plan: "Professional" }],
  won: [{ co: "Sri Lakshmi Textiles", emp: 120, plan: "Premium" }],
};

const ALLY_ROWS = [
  { name: "Ananya Rao", dept: "Finance" },
  { name: "Rahul Verma", dept: "Sales" },
  { name: "Meera Iyer", dept: "Operations" },
  { name: "Karthik N", dept: "Engineering" },
];

const SYNC_LOG = [
  "48 employees synced from Your Platform",
  "November attendance pushed to NGriffinPay ",
  "Payroll run complete · journal sent back",
  "Single sign-on enabled for shared users",
];

function PIcon({ name, size = 18 }) {
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
    case "tag":
      return (
        <svg {...p}>
          <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <circle cx="7" cy="7" r="1.5" />
        </svg>
      );
    case "link":
      return (
        <svg {...p}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
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
    case "trend":
      return (
        <svg {...p}>
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
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
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Reseller portal mockup ---------- */
function ResellerPortal() {
  const rootRef = useRef(null);
  const marginRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const val = { v: 44400 };
      const setMargin = () => {
        if (marginRef.current)
          marginRef.current.textContent =
            "₹" + Math.round(val.v).toLocaleString("en-IN");
      };
      gsap.from(".pt2-kpi, .pt2-col", {
        y: 16,
        opacity: 0,
        stagger: 0.07,
        duration: 0.45,
        ease: "power3.out",
      });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 1 });
      tl.set(".pt2-mv-b", { autoAlpha: 0, y: -18 })
        .set(".pt2-mv-a", { autoAlpha: 1, x: 0 })
        .set(".pt2-toast", { autoAlpha: 0, y: 14 })
        .set(".pt2-closing", { autoAlpha: 0 })
        .call(() => {
          val.v = 44400;
          setMargin();
        })
        .to(".pt2-closing", { autoAlpha: 1, duration: 0.3 }, "+=0.6")
        .to(
          ".pt2-mv-a",
          { x: 40, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
          "+=1",
        )
        .to(
          ".pt2-mv-b",
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "back.out(2)" },
          "-=0.1",
        )
        .fromTo(
          ".pt2-mv-b .pt2-won",
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(3)" },
          "-=0.2",
        )
        .to(".pt2-toast", {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        })
        .to(
          val,
          { v: 48600, duration: 1, ease: "power2.out", onUpdate: setMargin },
          "<",
        )
        .fromTo(
          ".pt2-spark i:last-child",
          { scaleY: 0.4 },
          { scaleY: 1, duration: 0.6, ease: "back.out(2)" },
          "<",
        )
        .fromTo(
          ".pt2-support",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
          "+=0.5",
        )
        .to({}, { duration: 2.6 })
        .to(".pt2-toast, .pt2-support", { autoAlpha: 0, duration: 0.3 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const Deal = ({ d, cls = "", children }) => (
    <div className={`pt2-deal ${cls}`}>
      <b>{d.co}</b>
      <span>
        {d.emp} employees · {d.plan}
      </span>
      {children}
    </div>
  );

  return (
    <div className="pt2-app" ref={rootRef}>
      <div className="pt2-app-top">
        <span className="pt2-app-logo">
          <img src={I("ngriffinpay-mark.png")} alt="" />
        </span>
        <b>Reseller Portal</b>
        <span className="pt2-app-who">
          <PIcon name="bell" size={14} />
          <span className="pt2-ava">KP</span>
          <span className="pt2-who-name">Kumar Payroll Services</span>
        </span>
      </div>

      <div className="pt2-kpis">
        <div className="pt2-kpi">
          <span>
            <PIcon name="users" size={13} /> Active clients
          </span>
          <strong>24</strong>
          <small>+3 this quarter</small>
        </div>
        <div className="pt2-kpi is-main">
          <span>
            <PIcon name="trend" size={13} /> Margin this month
          </span>
          <strong ref={marginRef}>₹44,400</strong>
          <span className="pt2-spark" aria-hidden>
            <i style={{ height: "35%" }} />
            <i style={{ height: "50%" }} />
            <i style={{ height: "42%" }} />
            <i style={{ height: "64%" }} />
            <i style={{ height: "58%" }} />
            <i style={{ height: "86%" }} />
          </span>
        </div>
        <div className="pt2-kpi">
          <span>
            <PIcon name="bell" size={13} /> Renewals due
          </span>
          <strong>3</strong>
          <small>next 30 days</small>
        </div>
      </div>

      <div className="pt2-board">
        <div className="pt2-col">
          <div className="pt2-col-h">
            <span className="dot lead" />
            Leads <em>{DEALS.lead.length}</em>
          </div>
          {DEALS.lead.map((d) => (
            <Deal key={d.co} d={d} />
          ))}
        </div>
        <div className="pt2-col">
          <div className="pt2-col-h">
            <span className="dot demo" />
            Demo <em>1</em>
          </div>
          <Deal d={DEALS.demo[0]} cls="pt2-mv-a">
            <span className="pt2-closing">Closing…</span>
          </Deal>
        </div>
        <div className="pt2-col">
          <div className="pt2-col-h">
            <span className="dot won" />
            Won <em>2</em>
          </div>
          <Deal d={DEALS.demo[0]} cls="pt2-mv-b is-won">
            <span className="pt2-won">
              <PIcon name="check" size={10} /> Won
            </span>
          </Deal>
          <Deal d={DEALS.won[0]} cls="is-won">
            <span className="pt2-won">
              <PIcon name="check" size={10} /> Won
            </span>
          </Deal>
        </div>
      </div>

      <div className="pt2-toast">
        <span className="pt2-toast-ic">
          <PIcon name="trend" size={14} />
        </span>
        <span>
          <b>+₹4,200 margin</b> · Apex Tools signed Professional
        </span>
      </div>
      <div className="pt2-support">
        <span className="pt2-ava sm">NG</span>
        <span>
          <b>NGriffinPay Support</b>We'll handle Apex Tools' onboarding & data
          migration ✓
        </span>
      </div>
    </div>
  );
}

/* ---------- Alliance integration mockup ---------- */
function AllianceBridge() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".pt2-win", {
        y: 18,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.from(".pt2-bridge", {
        scale: 0.6,
        opacity: 0,
        duration: 0.5,
        delay: 0.25,
        ease: "back.out(2)",
      });
      rootRef.current.querySelectorAll(".pt2-pkt").forEach((el, i) => {
        gsap.fromTo(
          el,
          { "--p": i % 2 ? 1 : 0, opacity: 0 },
          {
            keyframes: [
              { opacity: 1, duration: 0.15 },
              { "--p": i % 2 ? 0 : 1, duration: 1.3, ease: "power1.inOut" },
              { opacity: 0, duration: 0.15 },
            ],
            repeat: -1,
            repeatDelay: 0.5,
            delay: i * 0.45,
          },
        );
      });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5, delay: 0.6 });
      tl.set(".pt2-row-ok, .pt2-pay-ok", { scale: 0 })
        .set(".pt2-log li", { autoAlpha: 0, x: -10 })
        .set(".pt2-pay-fill", { scaleX: 0 });
      rootRef.current.querySelectorAll(".pt2-row-ok").forEach((el, i) => {
        tl.to(
          el,
          { scale: 1, duration: 0.3, ease: "back.out(3)" },
          i === 0 ? "+=0.3" : "+=0.25",
        );
      });
      tl.to(
        ".pt2-log li:nth-child(1)",
        { autoAlpha: 1, x: 0, duration: 0.3 },
        "<",
      )
        .to(
          ".pt2-pay-fill",
          { scaleX: 1, duration: 1.2, ease: "power2.inOut" },
          "+=0.2",
        )
        .to(
          ".pt2-log li:nth-child(2)",
          { autoAlpha: 1, x: 0, duration: 0.3 },
          "<0.4",
        )
        .to(".pt2-pay-ok", { scale: 1, duration: 0.35, ease: "back.out(3)" })
        .to(
          ".pt2-log li:nth-child(3)",
          { autoAlpha: 1, x: 0, duration: 0.3 },
          "<",
        )
        .to(
          ".pt2-log li:nth-child(4)",
          { autoAlpha: 1, x: 0, duration: 0.3 },
          "+=0.5",
        )
        .to({}, { duration: 2.4 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt2-app pt2-ally" ref={rootRef}>
      <div className="pt2-app-top">
        <span className="pt2-cobrand">
          <span className="pt2-yp">YP</span>
          <span className="pt2-plus">+</span>
          <span className="pt2-app-logo">
            <img src={I("ngriffinpay-mark.png")} alt="" />
          </span>
        </span>
        <b>Alliance Workspace</b>
        <span className="pt2-live">
          <span className="pt2-livedot" /> Sync live
        </span>
      </div>

      <div className="pt2-ally-grid">
        <div className="pt2-win">
          <div className="pt2-win-h">
            <span className="pt2-yp sm">YP</span> Your Platform{" "}
            <small>Employees</small>
          </div>
          {ALLY_ROWS.map((r) => (
            <div key={r.name} className="pt2-erow">
              <span className="pt2-ava xs">
                {r.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <span className="pt2-erow-t">
                <b>{r.name}</b>
                <small>{r.dept}</small>
              </span>
              <span className="pt2-row-ok">
                <PIcon name="check" size={9} />
              </span>
            </div>
          ))}
        </div>

        <div className="pt2-bridge" aria-hidden>
          <div className="pt2-track">
            <span className="pt2-pkt" />
            <span className="pt2-pkt b" />
            <span className="pt2-pkt" />
            <span className="pt2-pkt b" />
          </div>
          <span className="pt2-api">
            <PIcon name="link" size={14} /> API
          </span>
        </div>

        <div className="pt2-win">
          <div className="pt2-win-h">
            <span className="pt2-app-logo xs">
              <img src={I("ngriffinpay-mark.png")} alt="" />
            </span>{" "}
            NGriffinPay <small>Payroll · Nov</small>
          </div>
          <div className="pt2-pay">
            <div className="pt2-pay-row">
              <span>Employees</span>
              <b>48</b>
            </div>
            <div className="pt2-pay-row">
              <span>Gross pay</span>
              <b>₹28,40,000</b>
            </div>
            <div className="pt2-pay-row">
              <span>PF · ESI · PT</span>
              <b>₹3,12,400</b>
            </div>
            <div className="pt2-pay-bar">
              <i className="pt2-pay-fill" />
            </div>
            <div className="pt2-pay-done">
              <span className="pt2-pay-ok">
                <PIcon name="check" size={10} />
              </span>{" "}
              Payroll processed
            </div>
          </div>
        </div>
      </div>

      <ul className="pt2-log">
        {SYNC_LOG.map((l) => (
          <li key={l}>
            <span>
              <PIcon name="check" size={9} />
            </span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartnerPrograms() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (s) => setInView(s.isActive),
    });
    if (prefersReduced()) return () => st.kill();
    const ctx = gsap.context(() => {
      gsap.from(".pt2-head > *", {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
      gsap.from(".pt2-card", {
        x: -30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pt2-grid", start: "top 80%" },
      });
      gsap.from(".pt2-device", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pt2-grid", start: "top 80%" },
      });
    }, rootRef);
    return () => {
      st.kill();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!inView || paused || prefersReduced()) return undefined;
    const dc = gsap.delayedCall(PROGRAM_TIME, () =>
      setActive((a) => (a + 1) % PROGRAMS.length),
    );
    return () => dc.kill();
  }, [active, inView, paused]);

  useEffect(() => {
    if (prefersReduced() || !stageRef.current) return;
    gsap.fromTo(
      stageRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );
    const card = rootRef.current?.querySelector(
      `.pt2-card[data-i="${active}"]`,
    );
    if (card)
      gsap.fromTo(
        card.querySelectorAll(".pt2-perks li"),
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.35, delay: 0.15 },
      );
  }, [active]);

  const pick = (i) => {
    setActive(i);
    setPaused(true);
  };
  const P = PROGRAMS[active];

  return (
    <section className="pt2" ref={rootRef}>
      <div className="ptn-container">
        <div className="pt2-head">
          <span className="ptn-eyebrow">Partnership Programs</span>
          <h2>
            Partner <span>with Us</span>
          </h2>
          <p>
            Join hands with NGriffinPay to expand your business, offer more
            value to your clients, and grow in the HR and Payroll automation
            ecosystem. Choose the partnership that fits you best:
          </p>
        </div>

        <div className="pt2-grid">
          <div
            className="pt2-cards"
            role="tablist"
            aria-label="Partnership programs"
          >
            {PROGRAMS.map((p, i) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                data-i={i}
                aria-selected={i === active}
                className={`pt2-card ${i === active ? "is-on" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="pt2-card-top">
                  <span className="pt2-card-ic">
                    <PIcon name={p.icon} size={20} />
                  </span>
                  <span className="pt2-card-title">{p.title}</span>
                  <span className="pt2-radio" aria-hidden />
                </span>
                <span className="pt2-card-desc">{p.desc}</span>
                <span className="pt2-perks-wrap">
                  <ul className="pt2-perks">
                    {p.perks.map((x) => (
                      <li key={x}>
                        <PIcon name="check" size={10} /> {x}
                      </li>
                    ))}
                  </ul>
                </span>
                {i === active && inView && !paused && (
                  <span
                    className="pt2-card-bar"
                    key={`bar${active}`}
                    style={{ animationDuration: `${PROGRAM_TIME}s` }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="pt2-device">
            <div className="pt2-chrome">
              <span className="pt2-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="pt2-url">
                <PIcon name="lock" size={11} /> {P.url}
              </span>
            </div>
            <div className="pt2-stage" ref={stageRef} key={P.key}>
              {P.key === "reseller" ? <ResellerPortal /> : <AllianceBridge />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PartnerWithUs() {
  return (
    <main className="ptn-page">
      <PartnerHero />
      <PartnerPrograms />
      {/* Section 3 goes here */}
    </main>
  );
}
