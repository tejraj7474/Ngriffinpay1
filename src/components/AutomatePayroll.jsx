// AutomatePayroll.jsx
// NGriffinpay — Product inner page: "Automate Payroll Processing"
// Section 1: Hero banner (live payroll run app on the left, content on the right)
// Section 2: 3D payroll cube (one face per tab) + three.js floating gold coins
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap three   (both already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import "./AutomatePayroll.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    lead: "Auto-calculate",
    rest: "gross & net salaries with full breakdowns",
    icon: "calc",
    head: "Salary breakdown",
  },
  {
    lead: "Generate payslips",
    rest: "and payroll reports in one click",
    icon: "file",
    head: "Payslips & reports",
  },
  {
    lead: "Apply statutory deductions",
    rest: "like PF, ESI, PT and TDS automatically",
    icon: "shield",
    head: "Statutory deductions",
  },
  {
    lead: "Auto-update",
    rest: "with latest tax rules and compliance standards",
    icon: "refresh",
    head: "Tax rule updates",
  },
  {
    lead: "Disburse salaries",
    rest: "securely with bank integration",
    icon: "bank",
    head: "Bank disbursal",
  },
  {
    lead: "Track payroll history",
    rest: "and audit trails effortlessly",
    icon: "history",
    head: "History & audit trail",
  },
  {
    lead: "Integrate",
    rest: "with attendance, leaves and expense modules",
    icon: "plug",
    head: "Connected modules",
  },
];

const STAGE_TIME = 5.5;
const TOTAL_NET = 18462400; // ₹1,84,62,400 for 248 employees
const EMPLOYEES = 248;

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

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
    case "calc":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h4" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...p}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      );
    case "bank":
      return (
        <svg {...p}>
          <path d="M3 10 12 4l9 6" />
          <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />
        </svg>
      );
    case "history":
      return (
        <svg {...p}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5M12 7v5l3 2" />
        </svg>
      );
    case "plug":
      return (
        <svg {...p}>
          <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z" />
          <path d="M12 18v4" />
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
    case "download":
      return (
        <svg {...p}>
          <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
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
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4M9 15l2 2 4-4" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...p}>
          <path d="M5 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2l-3 2-2-2-2 2-2-2-2 2z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "rupee":
      return (
        <svg {...p}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
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

const count = (tl, el, to, at, dur = 0.8, fmt = inr, from = 0) => {
  if (!el) return;
  const o = { v: from };
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

// 1 — Gross → net waterfall
const WATER = [
  { l: "Basic", v: 42500, t: "add" },
  { l: "HRA", v: 17000, t: "add" },
  { l: "Special", v: 21500, t: "add" },
  { l: "Bonus", v: 4000, t: "add" },
  { l: "Gross", v: 85000, t: "total" },
  { l: "PF", v: -1800, t: "sub" },
  { l: "PT", v: -200, t: "sub" },
  { l: "TDS", v: -11760, t: "sub" },
  { l: "Net", v: 71240, t: "net" },
];
const WMAX = 85000;
const waterBars = (() => {
  let run = 0;
  return WATER.map((w) => {
    if (w.t === "add") {
      const b = run;
      run += w.v;
      return { ...w, base: b, h: w.v };
    }
    if (w.t === "sub") {
      run += w.v;
      return { ...w, base: run, h: -w.v };
    }
    return { ...w, base: 0, h: w.v };
  });
})();

function BreakdownPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".apr-wbar i").forEach((bar, i) => {
      tl.fromTo(
        bar,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.35, ease: "power2.out" },
        0.3 + i * 0.22,
      );
      const lab = bar.parentElement.querySelector(".apr-wval");
      tl.fromTo(
        lab,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.25 },
        0.45 + i * 0.22,
      );
    });
    count(tl, q(".js-gross")[0], 85000, 0.3, 1.2);
    count(tl, q(".js-net")[0], 71240, 1.4, 1.3);
    tl.fromTo(
      q(".apr-netpill"),
      { scale: 0.8, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.4)" },
      2.4,
    );
  }, delay);

  return (
    <div className="apr-panel" ref={ref}>
      <div className="apr-emp js-in">
        <span className="apr-av">KV</span>
        <div>
          <b>Karthik V.</b>
          <small>Senior Developer · EMP-0142 · 30 / 30 days</small>
        </div>
        <span className="apr-netpill">
          <Icon name="check" size={10} /> Auto-calculated
        </span>
      </div>
      <div className="apr-water js-in">
        {waterBars.map((w) => (
          <div className={`apr-wbar ${w.t}`} key={w.l}>
            <span className="apr-wtrack">
              <i
                style={{
                  bottom: `${(w.base / WMAX) * 100}%`,
                  height: `${(w.h / WMAX) * 100}%`,
                }}
              />
              <em
                className="apr-wval"
                style={{ bottom: `${((w.base + w.h) / WMAX) * 100}%` }}
              >
                {w.t === "sub" ? "−" : ""}
                {(Math.abs(w.v) / 1000).toFixed(w.v % 1000 ? 1 : 0)}k
              </em>
            </span>
            <small>{w.l}</small>
          </div>
        ))}
      </div>
      <div className="apr-sum js-in">
        <div>
          <small>Gross salary</small>
          <b className="js-gross">₹0</b>
        </div>
        <span className="apr-sum-arrow">
          <Icon name="arrow" size={12} />
        </span>
        <div>
          <small>Deductions</small>
          <b className="neg">−₹13,760</b>
        </div>
        <span className="apr-sum-arrow">
          <Icon name="arrow" size={12} />
        </span>
        <div className="hl">
          <small>Net pay</small>
          <b className="js-net">₹0</b>
        </div>
      </div>
    </div>
  );
}

// 2 — Payslips & reports
const EARN = [
  ["Basic", 42500],
  ["HRA", 17000],
  ["Special allowance", 21500],
  ["Bonus", 4000],
];
const DEDS = [
  ["Provident Fund", 1800],
  ["Professional Tax", 200],
  ["Income Tax (TDS)", 11760],
];

function PayslipPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".apr-slip.back"),
      { rotation: 0, x: 0 },
      {
        rotation: (i) => [-7, 6][i],
        x: (i) => [-26, 22][i],
        duration: 0.6,
        ease: "back.out(1.6)",
      },
      0.2,
    );
    tl.fromTo(
      q(".apr-slip.front"),
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
      0.3,
    );
    tl.fromTo(
      q(".apr-sline"),
      { autoAlpha: 0, x: -8 },
      { autoAlpha: 1, x: 0, stagger: 0.09, duration: 0.25 },
      0.6,
    );
    tl.fromTo(
      q(".apr-slip-net"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, ease: "power3.out" },
      1.4,
    );
    tl.fromTo(
      q(".apr-stamp"),
      { scale: 2.2, autoAlpha: 0, rotation: -30 },
      {
        scale: 1,
        autoAlpha: 1,
        rotation: -12,
        duration: 0.4,
        ease: "back.out(2)",
      },
      1.9,
    );
    count(tl, q(".js-slips")[0], EMPLOYEES, 1.9, 1.4, (v) => Math.round(v));
    tl.fromTo(
      q(".apr-dl"),
      { y: 10, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.12,
        duration: 0.35,
        ease: "back.out(2)",
      },
      2.6,
    );
  }, delay);

  return (
    <div className="apr-panel apr-slips" ref={ref}>
      <div className="apr-slip-stage">
        <div className="apr-slip back" />
        <div className="apr-slip back" />
        <div className="apr-slip front">
          <div className="apr-slip-head">
            <b>Payslip · October 2026</b>
            <small>Karthik V. · EMP-0142 · Bengaluru</small>
          </div>
          <div className="apr-slip-cols">
            <div>
              <small className="apr-slip-h">Earnings</small>
              {EARN.map(([l, v]) => (
                <div className="apr-sline" key={l}>
                  <span>{l}</span>
                  <b>{inr(v)}</b>
                </div>
              ))}
            </div>
            <div>
              <small className="apr-slip-h">Deductions</small>
              {DEDS.map(([l, v]) => (
                <div className="apr-sline" key={l}>
                  <span>{l}</span>
                  <b>{inr(v)}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="apr-slip-net">
            <span>Net pay</span>
            <b>₹71,240</b>
          </div>
          <span className="apr-stamp">Generated</span>
        </div>
      </div>
      <div className="apr-slip-side">
        <div className="apr-bigcount js-in">
          <b className="js-slips">0</b>
          <small>payslips generated in one click</small>
        </div>
        <span className="apr-dl">
          <Icon name="download" size={12} /> Payslips · PDF
        </span>
        <span className="apr-dl">
          <Icon name="download" size={12} /> Payroll register · Excel
        </span>
        <span className="apr-dl">
          <Icon name="bell" size={12} /> Emailed to 248 employees
        </span>
      </div>
    </div>
  );
}

// 3 — Statutory deductions
const STAT = [
  { k: "PF", n: "Provident Fund", r: "12% of basic · wage-capped", v: 1800 },
  {
    k: "ESI",
    n: "Employee State Insurance",
    r: "Not applicable · above wage limit",
    v: 0,
  },
  { k: "PT", n: "Professional Tax", r: "Karnataka slab", v: 200 },
  {
    k: "TDS",
    n: "Income Tax (TDS)",
    r: "New regime · projected annual tax ÷ 12",
    v: 11760,
  },
];

function StatutoryPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".apr-srow").forEach((row, i) => {
      const at = 0.3 + i * 0.4;
      tl.fromTo(
        row,
        { autoAlpha: 0, x: 14 },
        { autoAlpha: 1, x: 0, duration: 0.3, ease: "power3.out" },
        at,
      );
      tl.fromTo(
        row.querySelector(".apr-tick"),
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "back.out(3)" },
        at + 0.25,
      );
      const amt = row.querySelector(".js-amt");
      if (STAT[i].v) count(tl, amt, STAT[i].v, at + 0.2, 0.6);
    });
    count(tl, q(".js-dtotal")[0], 13760, 1.9, 0.8);
    tl.fromTo(
      q(".apr-challan span"),
      { autoAlpha: 0, scale: 0.7 },
      {
        autoAlpha: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: "back.out(2.5)",
      },
      2.3,
    );
  }, delay);

  return (
    <div className="apr-panel" ref={ref}>
      <div className="apr-head js-in">
        <Icon name="shield" size={12} /> Statutory deductions · Karthik V.{" "}
        <em>Oct 2026</em>
      </div>
      <div className="apr-srows">
        {STAT.map((s) => (
          <div className={`apr-srow ${s.v ? "" : "na"}`} key={s.k}>
            <span className="apr-skey">{s.k}</span>
            <div className="apr-grow">
              <b>{s.n}</b>
              <small>{s.r}</small>
            </div>
            <b className="js-amt">{s.v ? "₹0" : "—"}</b>
            <span className="apr-tick">
              <Icon name="check" size={10} />
            </span>
          </div>
        ))}
      </div>
      <div className="apr-dtotal js-in">
        <span>Total deductions</span>
        <b className="js-dtotal">₹0</b>
      </div>
      <div className="apr-challan js-in">
        <small>Ready to file:</small>
        <span>PF ECR</span>
        <span>ESI return</span>
        <span>PT challan</span>
        <span>Form 24Q</span>
      </div>
    </div>
  );
}

// 4 — Tax rule auto-update
function TaxUpdatePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".apr-notice"),
      { y: -30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)" },
      0.2,
    );
    tl.fromTo(
      q(".apr-rule"),
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.3 },
      0.8,
    );
    tl.fromTo(
      q(".apr-old i"),
      { scaleX: 0 },
      { scaleX: 1, stagger: 0.15, duration: 0.3 },
      1.3,
    );
    tl.fromTo(
      q(".apr-new"),
      { autoAlpha: 0, x: -8 },
      { autoAlpha: 1, x: 0, stagger: 0.15, duration: 0.3 },
      1.5,
    );
    tl.fromTo(
      q(".apr-recalc-bar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: "power1.inOut" },
      1.9,
    );
    count(tl, q(".js-recalc")[0], EMPLOYEES, 1.9, 1.4, (v) => Math.round(v));
    tl.fromTo(
      q(".apr-recalc-ok"),
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)" },
      3.3,
    );
  }, delay);

  return (
    <div className="apr-panel" ref={ref}>
      <div className="apr-notice">
        <span className="apr-notice-ic">
          <Icon name="bell" size={13} />
        </span>
        <div className="apr-grow">
          <b>Compliance update applied automatically</b>
          <small>New tax regime rules for FY 2026-27 · no action needed</small>
        </div>
        <em>Today</em>
      </div>
      <div className="apr-rules">
        <div className="apr-rule">
          <span>TDS / month · Karthik V.</span>
          <span className="apr-old">
            ₹12,340
            <i />
          </span>
          <b className="apr-new">₹11,760</b>
        </div>
        <div className="apr-rule">
          <span>Tax regime default</span>
          <span className="apr-old">
            Old
            <i />
          </span>
          <b className="apr-new">New</b>
        </div>
        <div className="apr-rule">
          <span>Rule set version</span>
          <span className="apr-old">
            v2025.4
            <i />
          </span>
          <b className="apr-new">v2026.1</b>
        </div>
      </div>
      <div className="apr-recalc js-in">
        <div className="apr-recalc-top">
          <span>
            <Icon name="refresh" size={11} /> Recalculating salaries
          </span>
          <b>
            <span className="js-recalc">0</span> / {EMPLOYEES}
          </b>
        </div>
        <span className="apr-recalc-bar">
          <i />
        </span>
        <span className="apr-recalc-ok">
          <Icon name="check" size={10} /> All salaries up to date
        </span>
      </div>
    </div>
  );
}

// 5 — Bank disbursal
const CREDITS = [
  ["Ananya R.", "₹64,800", "UTR 4417 8820"],
  ["Rahul M.", "₹92,150", "UTR 4417 8821"],
  ["Karthik V.", "₹71,240", "UTR 4417 8822"],
];

function DisbursePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".apr-node"),
      { scale: 0.6, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.15,
        duration: 0.4,
        ease: "back.out(2)",
      },
      0.2,
    );
    tl.fromTo(
      q(".apr-wire i"),
      { scaleX: 0 },
      { scaleX: 1, stagger: 0.2, duration: 0.4 },
      0.5,
    );
    q(".apr-packet").forEach((pk, i) => {
      tl.fromTo(
        pk,
        { left: "0%", autoAlpha: 0 },
        {
          keyframes: [
            { autoAlpha: 1, duration: 0.1 },
            { left: "100%", duration: 1.1, ease: "power1.inOut" },
            { autoAlpha: 0, duration: 0.1 },
          ],
        },
        1 + i * 0.35,
      );
    });
    tl.fromTo(
      q(".apr-credit"),
      { autoAlpha: 0, x: -12 },
      { autoAlpha: 1, x: 0, stagger: 0.3, duration: 0.3 },
      1.8,
    );
    tl.fromTo(
      q(".apr-paybar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.8, ease: "power1.inOut" },
      1.2,
    );
    count(tl, q(".js-paid")[0], EMPLOYEES, 1.2, 1.8, (v) => Math.round(v));
    count(tl, q(".js-paidamt")[0], TOTAL_NET, 1.2, 1.8);
  }, delay);

  return (
    <div className="apr-panel" ref={ref}>
      <div className="apr-flow js-in">
        <div className="apr-node">
          <span className="apr-node-ic">
            <Icon name="rupee" size={14} />
          </span>
          <b>NGriffinpay</b>
          <small>Approved run</small>
        </div>
        <div className="apr-wire">
          <i />
          <span className="apr-packet" />
          <span className="apr-packet" />
          <span className="apr-packet" />
        </div>
        <div className="apr-node lock">
          <span className="apr-node-ic">
            <Icon name="lock" size={14} />
          </span>
          <b>Encrypted</b>
          <small>Maker-checker + OTP</small>
        </div>
        <div className="apr-wire">
          <i />
          <span className="apr-packet" />
          <span className="apr-packet" />
          <span className="apr-packet" />
        </div>
        <div className="apr-node">
          <span className="apr-node-ic">
            <Icon name="bank" size={14} />
          </span>
          <b>Your bank</b>
          <small>Direct API</small>
        </div>
      </div>
      <div className="apr-credits">
        {CREDITS.map(([n, a, u]) => (
          <div className="apr-credit" key={n}>
            <span className="apr-tick on">
              <Icon name="check" size={9} />
            </span>
            <b>{n}</b>
            <small>{u}</small>
            <em>{a}</em>
          </div>
        ))}
      </div>
      <div className="apr-pay js-in">
        <div className="apr-pay-top">
          <span>
            Credited <b className="js-paid">0</b> / {EMPLOYEES}
          </span>
          <b className="js-paidamt">₹0</b>
        </div>
        <span className="apr-paybar">
          <i />
        </span>
      </div>
    </div>
  );
}

// 6 — History & audit trail
const HISTORY = [
  ["May", 1.71],
  ["Jun", 1.74],
  ["Jul", 1.76],
  ["Aug", 1.79],
  ["Sep", 1.81],
  ["Oct", 1.85],
];
const AUDIT = [
  ["10:02", "Payroll run created", "Priya S. · HR"],
  ["10:05", "Attendance & leaves synced", "System"],
  ["11:30", "Run approved", "Rahul M. · Finance"],
  ["11:42", "Locked & salaries disbursed", "System"],
];

function AuditPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".apr-hbar i"),
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.08, duration: 0.4, ease: "power2.out" },
      0.3,
    );
    tl.fromTo(
      q(".apr-hbar.now"),
      { boxShadow: "0 0 0 0 rgba(29,111,216,0)" },
      { boxShadow: "0 0 0 3px rgba(29,111,216,0.25)", duration: 0.3 },
      0.9,
    );
    tl.fromTo(
      q(".apr-tline"),
      { scaleY: 0 },
      { scaleY: 1, duration: 1.4, ease: "none" },
      0.8,
    );
    tl.fromTo(
      q(".apr-log"),
      { autoAlpha: 0, x: 14 },
      { autoAlpha: 1, x: 0, stagger: 0.35, duration: 0.35, ease: "power3.out" },
      0.8,
    );
    tl.fromTo(
      q(".apr-lockbadge"),
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2.5)" },
      2.4,
    );
  }, delay);

  return (
    <div className="apr-panel apr-audit" ref={ref}>
      <div className="apr-hist js-in">
        <small className="apr-mini-h">Net payout · last 6 months (₹ Cr)</small>
        <div className="apr-hbars">
          {HISTORY.map(([m, v], i) => (
            <div
              className={`apr-hbar ${i === HISTORY.length - 1 ? "now" : ""}`}
              key={m}
            >
              <em>{v.toFixed(2)}</em>
              <span>
                <i style={{ height: `${30 + ((v - 1.7) / 0.15) * 65}%` }} />
              </span>
              <small>{m}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="apr-logs">
        <small className="apr-mini-h">Audit trail · Oct 2026 run</small>
        <div className="apr-logwrap">
          <span className="apr-tline" />
          {AUDIT.map(([t, a, by]) => (
            <div className="apr-log" key={a}>
              <span className="apr-ldot" />
              <em>{t}</em>
              <div>
                <b>{a}</b>
                <small>{by}</small>
              </div>
            </div>
          ))}
        </div>
        <span className="apr-lockbadge">
          <Icon name="lock" size={10} /> Tamper-proof · every change logged
        </span>
      </div>
    </div>
  );
}

// 7 — Integrations
const SOURCES = [
  {
    n: "Attendance",
    i: "clock",
    y: 18,
    chip: "LOP · 2 days",
    v: "−₹5,480",
    neg: true,
  },
  { n: "Leaves", i: "leaf", y: 50, chip: "Leave encashment", v: "+₹2,550" },
  { n: "Expenses", i: "receipt", y: 82, chip: "Travel claim", v: "+₹3,200" },
];

function IntegratePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".apr-src"),
      { x: -20, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, stagger: 0.12, duration: 0.35, ease: "power3.out" },
      0.2,
    );
    tl.fromTo(
      q(".apr-hub"),
      { scale: 0.5, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2)" },
      0.4,
    );
    tl.fromTo(
      q(".apr-link"),
      { strokeDashoffset: 100 },
      { strokeDashoffset: 0, stagger: 0.12, duration: 0.6, ease: "power2.out" },
      0.6,
    );
    q(".apr-pulse").forEach((c, i) => {
      const y = SOURCES[i].y;
      tl.fromTo(
        c,
        { attr: { cx: 4, cy: y }, opacity: 0 },
        {
          attr: { cx: 96, cy: 50 },
          opacity: 1,
          duration: 0.9,
          ease: "power1.in",
          repeat: 1,
          repeatDelay: 0.4,
        },
        1.1 + i * 0.25,
      );
    });
    tl.fromTo(
      q(".apr-ichip"),
      { autoAlpha: 0, x: 14 },
      {
        autoAlpha: 1,
        x: 0,
        stagger: 0.2,
        duration: 0.35,
        ease: "back.out(1.8)",
      },
      2.1,
    );
    tl.fromTo(
      q(".apr-hub"),
      { boxShadow: "0 0 0 0 rgba(56,189,248,0.6)" },
      { boxShadow: "0 0 0 14px rgba(56,189,248,0)", duration: 0.8, repeat: 2 },
      1.9,
    );
    tl.fromTo(
      q(".apr-isync"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      2.9,
    );
  }, delay);

  return (
    <div className="apr-panel" ref={ref}>
      <div className="apr-int">
        <div className="apr-srcs">
          {SOURCES.map((s) => (
            <div className="apr-src" key={s.n}>
              <span className="apr-src-ic">
                <Icon name={s.i} size={13} />
              </span>
              <b>{s.n}</b>
            </div>
          ))}
        </div>
        <svg
          className="apr-links"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {SOURCES.map((s) => (
            <path
              key={s.n}
              className="apr-link"
              pathLength="100"
              d={`M4 ${s.y} C 50 ${s.y}, 50 50, 96 50`}
            />
          ))}
          {SOURCES.map((s) => (
            <circle key={s.n} className="apr-pulse" r="2.2" cx="4" cy={s.y} />
          ))}
        </svg>
        <div className="apr-hub">
          <Icon name="rupee" size={18} />
          <b>Payroll</b>
          <small>Oct run</small>
        </div>
        <div className="apr-ichips">
          {SOURCES.map((s) => (
            <div className="apr-ichip" key={s.n}>
              <small>{s.chip}</small>
              <b className={s.neg ? "neg" : "pos"}>{s.v}</b>
            </div>
          ))}
        </div>
      </div>
      <span className="apr-isync">
        <Icon name="check" size={10} /> Synced automatically · no manual entry
      </span>
    </div>
  );
}

const PANELS = [
  BreakdownPanel,
  PayslipPanel,
  StatutoryPanel,
  TaxUpdatePanel,
  DisbursePanel,
  AuditPanel,
  IntegratePanel,
];

/* ------------------------------------------------------------------ */
/* Payroll app (left side)                                             */
/* ------------------------------------------------------------------ */

function PayrollApp({ frameRef, stage }) {
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
    <div className="apr-frame" ref={frameRef}>
      <div className="apr-chrome">
        <span className="apr-dot r" />
        <span className="apr-dot y" />
        <span className="apr-dot g" />
        <div className="apr-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/payroll/run/oct-2026
        </div>
      </div>

      <div className="apr-app">
        <aside className="apr-side js-side">
          <div className="apr-run">
            <small>Payroll run</small>
            <b>October 2026</b>
            <span className="apr-run-live">
              <i /> Processing
            </span>
          </div>
          <div className="apr-total">
            <small>Total net payout</small>
            <strong className="js-total">₹0</strong>
            <span>
              <Icon name="users" size={11} /> {EMPLOYEES} employees
            </span>
          </div>
          <ol className="apr-check">
            {FEATURES.map((f, i) => (
              <li
                key={f.head}
                className={i < stage ? "done" : i === stage ? "now" : ""}
              >
                <span className="apr-check-dot">
                  {i < stage ? <Icon name="check" size={9} /> : i + 1}
                </span>
                {f.head}
              </li>
            ))}
          </ol>
        </aside>

        <div className="apr-main">
          <div className="apr-mainhead js-mainhead">
            <span className="apr-mainhead-ic">
              <Icon name={FEATURES[stage].icon} size={13} />
            </span>
            <b>{FEATURES[stage].head}</b>
            <em>
              Step {stage + 1} of {FEATURES.length}
            </em>
          </div>
          <div className="apr-panel-wrap" ref={panelWrap}>
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

  // auto-advance through the 7 features
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
        { y: 28, opacity: 0, duration: 0.8, stagger: 0.06 },
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
        q(".apr-check li"),
        { x: -10, opacity: 0, stagger: 0.05, duration: 0.3 },
        0.8,
      );
      tl.from(q(".js-mainhead"), { y: -10, opacity: 0, duration: 0.45 }, 0.7);
      const total = q(".js-total")[0];
      const o = { v: 0 };
      tl.to(
        o,
        {
          v: TOTAL_NET,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => total && (total.textContent = inr(o.v)),
        },
        0.8,
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
      className="apr-hero"
      ref={sectionRef}
      aria-labelledby="apr-hero-title"
    >
      <div className="apr-hero-bg" aria-hidden>
        <span className="apr-blob b1 js-blob" />
        <span className="apr-blob b2 js-blob" />
        <span className="apr-grid-bg" />
      </div>

      <div className="apr-container apr-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="apr-content">
          <span className="apr-eyebrow js-reveal">
            <span className="apr-live-dot" /> Simplify salaries, stay compliant
          </span>
          <h1 id="apr-hero-title" className="apr-title js-reveal">
            Automate <span className="apr-grad">Payroll Processing</span>
          </h1>

          <ul
            className="apr-feats"
            role="tablist"
            aria-label="Payroll features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.head} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`apr-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="apr-feat-ic">
                    <Icon name={f.icon} size={14} />
                  </span>
                  <span className="apr-feat-txt">
                    <b>{f.lead}</b> {f.rest}
                  </span>
                  <span className="apr-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: payroll app */}
        <div className="apr-visual" ref={visualRef}>
          <PayrollApp frameRef={frameRef} stage={stage} />
          <div className="apr-float f1 js-float">
            <span className="apr-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>Salaries paid on time</strong>
              <small>248 credited in minutes</small>
            </div>
          </div>
          <div className="apr-float f2 js-float">
            <span className="apr-float-ic pr">
              <Icon name="shield" size={14} />
            </span>
            <div>
              <strong>100% statutory compliant</strong>
              <small>PF · ESI · PT · TDS</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — 3D payroll cube + three.js floating coins                */
/* ------------------------------------------------------------------ */

const CUBE_TABS = [
  {
    label: "Accurate Salary Computation",
    icon: "calc",
    title: [
      ["Automate", 1],
      [" salary calculations and ", 0],
      ["payments", 1],
    ],
    desc: "Eliminate manual work by automating payroll calculations, deductions, and disbursements accurately.",
  },
  {
    label: "Statutory Compliance & Tax Management",
    icon: "shield",
    title: [
      ["Seamless", 1],
      [" tax compliance", 0],
    ],
    desc: "Stay compliant with automatic tax deductions, PF, ESI, and other statutory contributions.",
  },
  {
    label: "Multiple Pay Structures",
    icon: "users",
    title: [
      ["Integrated", 1],
      [" with attendance & leave data", 0],
    ],
    desc: "Payroll processing is directly linked with attendance and leave records to ensure accuracy.",
  },
  {
    label: "Payslip Generation & Distribution",
    icon: "file",
    title: [
      ["On-time", 1],
      [" salary disbursement", 0],
    ],
    desc: "Process and transfer employee salaries directly to their bank accounts without delays.",
  },
  {
    label: "Payroll Reports & Analytics",
    icon: "history",
    title: [
      ["Detailed", 1],
      [" payroll reports & analytics", 0],
    ],
    desc: "Gain insights into salary structures, deductions, and payroll costs through powerful analytics.",
  },
];
const CUBE_TIME = 6.5;

// cube orientation per tab: inner Y rotation (faces 0-3), outer X rotation (face 4 = top)
const FACE_Y = [0, -90, -180, -270, 0];

/* ---------- three.js: slowly rising gold coins ---------- */
function useCoins(canvasRef, wrapRef, burstRef) {
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
      return undefined; // no WebGL — the section still works
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 6, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rim.position.set(-6, -2, 4);
    scene.add(rim);

    const COUNT = 46;
    const geo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 40);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf5c451,
      metalness: 0.85,
      roughness: 0.28,
    });
    const coins = new THREE.InstancedMesh(geo, mat, COUNT);
    scene.add(coins);

    const dummy = new THREE.Object3D();
    const data = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 22,
      y: (Math.random() - 0.5) * 14,
      z: -Math.random() * 8,
      s: 0.5 + Math.random() * 0.8,
      v: 0.25 + Math.random() * 0.35,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      sx: 0.4 + Math.random() * 1.2,
      sy: 0.3 + Math.random() * 0.9,
    }));

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

    const draw = (dt) => {
      const boost = burstRef.current.v;
      data.forEach((c, i) => {
        c.y += c.v * dt * boost;
        if (c.y > 8) {
          c.y = -8;
          c.x = (Math.random() - 0.5) * 22;
        }
        c.rx += c.sx * dt * boost;
        c.ry += c.sy * dt;
        dummy.position.set(c.x, c.y, c.z);
        dummy.rotation.set(c.rx, c.ry, 0);
        dummy.scale.setScalar(c.s);
        dummy.updateMatrix();
        coins.setMatrixAt(i, dummy.matrix);
      });
      coins.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const reduce = prefersReduced();
    let visible = true;
    const tick = (time, delta) => {
      if (visible) draw(Math.min(0.05, (delta || 16) / 1000));
    };
    if (reduce) draw(0);
    else gsap.ticker.add(tick);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(wrap);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [canvasRef, wrapRef, burstRef]);
}

/* ---------- each cube face plays its own GSAP story when it faces you ---------- */
function useFace(active, build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!active || !ref.current) return undefined;
    const q = gsap.utils.selector(ref);
    const tl = gsap.timeline({ delay: 0.55 });
    build(tl, q);
    if (prefersReduced()) tl.progress(1);
    return () => tl.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

const NET_DIGITS = "71,240";
function Odometer() {
  return (
    <span className="aps-odo" aria-label="₹71,240">
      <span className="aps-odo-sym">₹</span>
      {[...NET_DIGITS].map((ch, i) =>
        ch === "," ? (
          <span className="aps-odo-comma" key={i}>
            ,
          </span>
        ) : (
          <span className="aps-odo-col" key={i}>
            <span className="aps-odo-strip" data-d={ch}>
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ),
      )}
    </span>
  );
}

function FaceCompute({ active }) {
  const ref = useFace(active, (tl, q) => {
    tl.fromTo(
      q(".aps-frow"),
      { x: -24, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, stagger: 0.14, duration: 0.35, ease: "power3.out" },
      0,
    );
    tl.fromTo(
      q(".aps-fline"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4 },
      0.6,
    );
    tl.fromTo(
      q(".aps-odo-strip"),
      { yPercent: 0 },
      {
        yPercent: (i, el) => -10 * Number(el.dataset.d) - 0.0001,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.08,
      },
      0.7,
    );
    tl.fromTo(
      q(".aps-fchip"),
      { scale: 0.7, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.4)" },
      2,
    );
  });
  return (
    <div className="aps-face f0" ref={ref}>
      <div className="aps-fhead">
        <Icon name="calc" size={14} /> Salary computation <em>Karthik V.</em>
      </div>
      <div className="aps-formula">
        <div className="aps-frow">
          <span>Basic</span>
          <b>₹42,500</b>
        </div>
        <div className="aps-frow">
          <span>+ HRA</span>
          <b>₹17,000</b>
        </div>
        <div className="aps-frow">
          <span>+ Allowances &amp; bonus</span>
          <b>₹25,500</b>
        </div>
        <div className="aps-frow neg">
          <span>− PF, PT &amp; TDS</span>
          <b>₹13,760</b>
        </div>
        <span className="aps-fline" />
      </div>
      <small className="aps-flabel">Net pay this month</small>
      <Odometer />
      <span className="aps-fchip">
        <Icon name="check" size={11} /> Calculated in 0.3s · zero manual errors
      </span>
    </div>
  );
}

const RINGS = [
  { k: "PF", v: "₹1,800", p: 1 },
  { k: "ESI", v: "N/A", p: 1 },
  { k: "PT", v: "₹200", p: 1 },
  { k: "TDS", v: "₹11,760", p: 1 },
];
function FaceCompliance({ active }) {
  const ref = useFace(active, (tl, q) => {
    tl.fromTo(
      q(".aps-ring-fg"),
      { strokeDashoffset: 100 },
      {
        strokeDashoffset: 0,
        stagger: 0.25,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0,
    );
    tl.fromTo(
      q(".aps-ring-ok"),
      { scale: 0 },
      { scale: 1, stagger: 0.25, duration: 0.3, ease: "back.out(3)" },
      0.7,
    );
    tl.fromTo(
      q(".aps-seal"),
      { scale: 1.8, autoAlpha: 0, rotation: -25 },
      {
        scale: 1,
        autoAlpha: 1,
        rotation: -8,
        duration: 0.45,
        ease: "back.out(2)",
      },
      1.9,
    );
  });
  return (
    <div className="aps-face f1" ref={ref}>
      <div className="aps-fhead">
        <Icon name="shield" size={14} /> Statutory check <em>Oct 2026</em>
      </div>
      <div className="aps-rings">
        {RINGS.map((r) => (
          <div className="aps-ring" key={r.k}>
            <svg viewBox="0 0 64 64" aria-hidden>
              <circle cx="32" cy="32" r="27" className="aps-ring-bg" />
              <circle
                cx="32"
                cy="32"
                r="27"
                className="aps-ring-fg"
                pathLength="100"
              />
            </svg>
            <span className="aps-ring-k">{r.k}</span>
            <span className="aps-ring-ok">
              <Icon name="check" size={9} />
            </span>
            <small>{r.v}</small>
          </div>
        ))}
      </div>
      <span className="aps-seal">100% compliant · 0 penalties</span>
    </div>
  );
}

// 30-day attendance strip: p = present, l = paid leave, x = loss of pay, w = week off
const DAYS30 = "wpppppwwpppplpwwppppxpwwpppppw";
const STRUCTS = [
  ["Monthly", "CTC based"],
  ["Hourly", "₹ / hour"],
  ["Contract", "Fixed fee"],
];
function FaceStructures({ active }) {
  const ref = useFace(active, (tl, q) => {
    tl.fromTo(
      q(".aps-struct"),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.3 },
      0,
    );
    tl.fromTo(
      q(".aps-day"),
      { scale: 0, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.025,
        duration: 0.2,
        ease: "back.out(2)",
      },
      0.4,
    );
    tl.fromTo(
      q(".aps-link-arrow"),
      { scaleY: 0 },
      { scaleY: 1, duration: 0.35 },
      1.4,
    );
    tl.fromTo(
      q(".aps-payable"),
      { y: 12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, ease: "back.out(1.8)" },
      1.6,
    );
    const el = q(".js-payable")[0];
    const o = { v: 0 };
    tl.to(
      o,
      {
        v: 29,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => el && (el.textContent = Math.round(o.v)),
      },
      1.7,
    );
  });
  return (
    <div className="aps-face f2" ref={ref}>
      <div className="aps-fhead">
        <Icon name="users" size={14} /> Pay structures <em>Synced</em>
      </div>
      <div className="aps-structs">
        {STRUCTS.map(([a, b], i) => (
          <div className={`aps-struct ${i === 0 ? "on" : ""}`} key={a}>
            <b>{a}</b>
            <small>{b}</small>
          </div>
        ))}
      </div>
      <small className="aps-flabel">Attendance &amp; leave · October</small>
      <div className="aps-days">
        {[...DAYS30].map((d, i) => (
          <span className={`aps-day ${d}`} key={i} />
        ))}
      </div>
      <div className="aps-legend">
        <span>
          <i className="p" />
          Present
        </span>
        <span>
          <i className="l" />
          Paid leave
        </span>
        <span>
          <i className="x" />
          LOP
        </span>
        <span>
          <i className="w" />
          Week off
        </span>
      </div>
      <span className="aps-link-arrow" />
      <div className="aps-payable">
        <b>
          <span className="js-payable">0</span> / 30
        </b>{" "}
        payable days applied to salary
      </div>
    </div>
  );
}

const CHANNELS = [
  ["bank", "Bank credit", "248 / 248"],
  ["file", "Payslip by email", "Sent"],
  ["bell", "Mobile app alert", "Delivered"],
];
function FaceDisburse({ active }) {
  const ref = useFace(active, (tl, q) => {
    tl.fromTo(
      q(".aps-cal"),
      { rotationX: -90, autoAlpha: 0, transformOrigin: "50% 0%" },
      { rotationX: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.6)" },
      0,
    );
    tl.fromTo(
      q(".aps-chan"),
      { x: 20, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, stagger: 0.25, duration: 0.35, ease: "power3.out" },
      0.6,
    );
    tl.fromTo(
      q(".aps-chan .aps-ok"),
      { scale: 0 },
      { scale: 1, stagger: 0.25, duration: 0.3, ease: "back.out(3)" },
      0.85,
    );
    tl.fromTo(
      q(".aps-ontime"),
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      1.7,
    );
  });
  return (
    <div className="aps-face f3" ref={ref}>
      <div className="aps-fhead">
        <Icon name="file" size={14} /> Pay day <em>Auto-scheduled</em>
      </div>
      <div className="aps-payday">
        <div className="aps-cal">
          <span>OCT</span>
          <b>31</b>
          <small>Friday</small>
        </div>
        <div className="aps-chans">
          {CHANNELS.map(([ic, t, s]) => (
            <div className="aps-chan" key={t}>
              <span className="aps-chan-ic">
                <Icon name={ic} size={12} />
              </span>
              <div>
                <b>{t}</b>
                <small>{s}</small>
              </div>
              <span className="aps-ok">
                <Icon name="check" size={9} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="aps-ontime">
        <Icon name="clock" size={12} /> Credited by 9:00 AM · on time, every
        month
      </span>
    </div>
  );
}

const DEPTS = [
  ["Engineering", 48, "#0a3f83"],
  ["Sales", 22, "#1d6fd8"],
  ["Operations", 18, "#38bdf8"],
  ["HR & Admin", 12, "#a5d4fb"],
];
function FaceAnalytics({ active }) {
  let acc = 0;
  const ref = useFace(active, (tl, q) => {
    tl.fromTo(
      q(".aps-seg"),
      { strokeDasharray: (i) => `0 100` },
      {
        strokeDasharray: (i) => `${DEPTS[i][1]} ${100 - DEPTS[i][1]}`,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      },
      0,
    );
    tl.fromTo(
      q(".aps-dleg li"),
      { x: 12, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, stagger: 0.12, duration: 0.3 },
      0.3,
    );
    tl.fromTo(
      q(".aps-trend path"),
      { strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
      0.9,
    );
    tl.fromTo(
      q(".aps-trend circle"),
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, duration: 0.3, ease: "back.out(3)" },
      1.9,
    );
  });
  return (
    <div className="aps-face f4" ref={ref}>
      <div className="aps-fhead">
        <Icon name="history" size={14} /> Payroll cost <em>FY 2026-27</em>
      </div>
      <div className="aps-an">
        <div className="aps-donut">
          <svg viewBox="0 0 42 42" aria-hidden>
            <circle cx="21" cy="21" r="15.9" className="aps-donut-bg" />
            {DEPTS.map(([n, p, c], i) => {
              const off = 25 - acc;
              acc += p;
              return (
                <circle
                  key={n}
                  cx="21"
                  cy="21"
                  r="15.9"
                  className="aps-seg"
                  stroke={c}
                  strokeDashoffset={off}
                  pathLength="100"
                />
              );
            })}
          </svg>
          <div className="aps-donut-c">
            <b>₹1.85 Cr</b>
            <small>Oct cost</small>
          </div>
        </div>
        <ul className="aps-dleg">
          {DEPTS.map(([n, p, c]) => (
            <li key={n}>
              <i style={{ background: c }} />
              {n}
              <b>{p}%</b>
            </li>
          ))}
        </ul>
      </div>
      <small className="aps-flabel">Monthly payroll cost · last 6 months</small>
      <svg className="aps-trend" viewBox="0 0 200 44" aria-hidden>
        <path d="M4 38 L42 34 L80 31 L118 25 L156 19 L194 8" pathLength="100" />
        <circle cx="194" cy="8" r="4" />
      </svg>
    </div>
  );
}

const FACES = [
  FaceCompute,
  FaceCompliance,
  FaceStructures,
  FaceDisburse,
  FaceAnalytics,
];

function PayrollCubeSection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const tiltRef = useRef(null);
  const cubeRef = useRef(null);
  const mouseRef = useRef(null);
  const textRef = useRef(null);
  const tabsRef = useRef(null);
  const barRefs = useRef([]);
  const angle = useRef({ y: 0 });
  const burst = useRef({ v: 1 });

  useCoins(canvasRef, sectionRef, burst);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-advance
  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleY: 0 }));
    if (!inView || prefersReduced()) return undefined;
    const bar = barRefs.current[active];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleY: 0 },
          { scaleY: 1, duration: CUBE_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(CUBE_TIME, () =>
      setActive((a) => (a + 1) % CUBE_TABS.length),
    );
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, inView]);

  // rotate the cube to the active face
  useEffect(() => {
    const reduce = prefersReduced();
    const cur = angle.current.y;
    const base = FACE_Y[active];
    // keep spinning forward: the matching angle at or just below the current one
    const target = base + 360 * Math.floor((cur - base) / 360 + 0.0001);
    const dur = reduce ? 0 : 1.1;
    gsap.to(angle.current, {
      y: target,
      duration: dur,
      ease: "back.out(1.1)",
      onUpdate: () => gsap.set(cubeRef.current, { rotationY: angle.current.y }),
    });
    gsap.to(tiltRef.current, {
      rotationX: active === 4 ? -90 : 0,
      duration: dur,
      ease: "back.out(1.1)",
    });
    if (!reduce)
      gsap.fromTo(
        burst.current,
        { v: 4 },
        { v: 1, duration: 1.6, ease: "power2.out" },
      );
  }, [active]);

  // mobile/tablet: slide the tab row so the active tab is always fully visible
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[active];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined;
    const target = Math.max(
      0,
      Math.min(
        strip.scrollWidth - strip.clientWidth,
        btn.offsetLeft - strip.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2,
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

  // text panel swap + entrance
  useLayoutEffect(() => {
    if (!textRef.current) return undefined;
    const q = gsap.utils.selector(textRef);
    const tl = gsap.timeline();
    tl.fromTo(
      q(".js-t"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: "power3.out" },
    );
    if (prefersReduced()) tl.progress(1);
    return () => tl.kill();
  }, [active]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      gsap.set(cubeRef.current, { rotationY: 0 });
      gsap.set(tiltRef.current, { rotationX: 0 });
      if (prefersReduced()) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
      tl.from(q(".aps-title .w"), {
        yPercent: 110,
        opacity: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          q(".aps-tab"),
          {
            x: -24,
            opacity: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: "power3.out",
          },
          0.3,
        )
        .from(
          q(".aps-mouse"),
          {
            scale: 0.6,
            rotationY: 120,
            opacity: 0,
            duration: 1.3,
            ease: "expo.out",
          },
          0.3,
        )
        .from(q(".aps-shadow"), { scale: 0.3, opacity: 0, duration: 1 }, 0.5);

      // gentle mouse tilt on the whole cube
      const fine = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (fine) {
        const rx = gsap.quickTo(mouseRef.current, "rotationX", {
          duration: 0.9,
          ease: "power3",
        });
        const ry = gsap.quickTo(mouseRef.current, "rotationY", {
          duration: 0.9,
          ease: "power3",
        });
        const sec = sectionRef.current;
        const move = (e) => {
          const r = sec.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 18);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        };
        sec.addEventListener("mousemove", move);
        return () => sec.removeEventListener("mousemove", move);
      }
      return undefined;
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const tab = CUBE_TABS[active];

  return (
    <section className="aps" ref={sectionRef} aria-labelledby="aps-title">
      <div className="apr-container aps-inner">
        <h2 id="aps-title" className="aps-title">
          {[
            ["Automate", 1],
            ["salary", 0],
            ["calculations,", 0],
            ["ensure", 1],
            ["compliance,", 0],
            ["and", 1],
            ["pay", 0],
            ["employees", 0],
            ["on", 0],
            ["time—every", 0],
            ["time", 0],
          ].map(([w, hl], i) => (
            <span className="wm" key={i}>
              <span className={`w ${hl ? "hl" : ""}`}>{w}</span>
            </span>
          ))}
        </h2>

        <div className="aps-grid">
          <div
            className="aps-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Payroll capabilities"
          >
            {CUBE_TABS.map((t, i) => (
              <button
                type="button"
                role="tab"
                key={t.label}
                aria-selected={active === i}
                className={`aps-tab ${active === i ? "is-on" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="aps-tab-bar">
                  <i ref={(el) => (barRefs.current[i] = el)} />
                </span>
                <span className="aps-tab-ic">
                  <Icon name={t.icon} size={16} />
                </span>
                <span className="aps-tab-txt">{t.label}</span>
                <span className="aps-tab-n">0{i + 1}</span>
              </button>
            ))}
          </div>

          <div className="aps-stage" aria-hidden>
            <div className="aps-mouse" ref={mouseRef}>
              <div className="aps-tilt" ref={tiltRef}>
                <div className="aps-cube" ref={cubeRef}>
                  {FACES.map((F, i) => (
                    <F key={i} active={active === i} />
                  ))}
                </div>
              </div>
            </div>
            <span className="aps-shadow" />
          </div>

          <div
            className="aps-text"
            ref={textRef}
            role="tabpanel"
            aria-live="polite"
          >
            <span className="aps-kicker js-t">
              Streamline payroll &amp; boost efficiency
            </span>
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
            <p className="aps-about js-t">
              NGriffinpay’s Automated Payroll Processing module handles salary
              calculations, deductions, tax compliance, and payslip
              distribution—reducing manual errors and ensuring timely employee
              payments.
            </p>
            <a href="/contact" className="apr-btn primary js-t">
              Get Started with NGriffinpay <Icon name="arrow" size={16} />
            </a>
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
    q: "What is the Automated Payroll Processing feature in NGriffinpay?",
    a: "NGriffinpay’s Automated Payroll Processing system calculates salaries, deductions, bonuses, and taxes instantly—ensuring accuracy, compliance, and timely payments without manual intervention.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "automated payroll",
      "payroll processing",
    ],
  },
  {
    q: "How does the payroll automation work?",
    a: "The system pulls employee data from attendance, leave, and HR modules to automatically compute payouts, apply statutory deductions, and generate payslips in seconds.",
    keys: [
      "how does",
      "how it work",
      "work",
      "process",
      "attendance",
      "leave",
      "integrat",
      "data",
      "compute",
      "calculate",
    ],
  },
  {
    q: "Can the system handle tax and compliance requirements?",
    a: "Yes. NGriffinpay automatically applies the latest tax rules, provident fund contributions, and compliance requirements—reducing errors and ensuring legal adherence.",
    keys: [
      "tax",
      "tds",
      "compliance",
      "compliant",
      "pf",
      "provident",
      "esi",
      "statutory",
      "legal",
      "law",
      "professional tax",
    ],
  },
  {
    q: "Does it support multiple pay structures?",
    a: "Absolutely. You can configure different salary structures, allowances, and benefits for departments, roles, or individual employees.",
    keys: [
      "structure",
      "multiple",
      "allowance",
      "benefit",
      "department",
      "role",
      "ctc",
      "configure",
      "different salary",
      "hourly",
      "contract",
    ],
  },
  {
    q: "Can employees access their payslips online?",
    a: "Yes. Employees can securely log in to view and download their payslips, salary history, and tax documents anytime, from any device.",
    keys: [
      "payslip",
      "pay slip",
      "employee",
      "download",
      "online",
      "access",
      "salary history",
      "form 16",
      "mobile",
      "device",
      "view",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about payroll processing.";
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
      <div className="apq-row bot" ref={ref}>
        <span className="apq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="apq-bubble bot apq-typing"
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
      <div className="apq-row user" ref={ref}>
        <div className="apq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="apq-row bot" ref={ref}>
      <span className="apq-bot-av" aria-hidden>
        N
      </span>
      <div className="apq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="apq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function PayrollFaqSection() {
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
      gsap.from(q(".apq-chat"), {
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
    <section className="apq" ref={sectionRef} aria-labelledby="apq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="apr-container apq-grid">
        <div className="apq-left">
          <span className="apq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="apq-title" className="apq-title js-faq-reveal">
            Automated Payroll Processing –{" "}
            <span className="apr-grad">FAQs</span>
          </h2>
          <p className="apq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="apq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`apq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="apq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="apq-q-text">{f.q}</span>
                  <span className="apq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="apq-chat">
          <div className="apq-chat-head">
            <span className="apq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="apq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="apq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="apq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="apq-suggest" aria-label="Suggested questions">
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

          <form className="apq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about payroll, tax or payslips…"
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

export default function AutomatePayroll() {
  return (
    <div className="apr-page">
      <HeroSection />
      <span id="apr-next" />
      <PayrollCubeSection />
      <PayrollFaqSection />
    </div>
  );
}
