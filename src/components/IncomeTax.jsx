// IncomeTax.jsx
// NGriffinpay — Product inner page: "Income Tax Computation & Compliance"
// Section 1: Hero banner (live tax desk app on the left, content on the right)
// Section 2: Tax-engine printer (receipt per tab) + three.js waving point grid
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Next sections will be added below in this same file.
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap three   (both already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import "./IncomeTax.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Calculate",
    desc: "Automated tax computations based on latest tax regimes and employee inputs.",
    icon: "calc",
  },
  {
    title: "Comply",
    desc: "Ensure statutory compliance with timely TDS deductions and filings.",
    icon: "shield",
  },
  {
    title: "Validate",
    desc: "Cross-check employee declarations, proof submissions, and Form 16 generation.",
    icon: "check-file",
  },
  {
    title: "Report",
    desc: "Get insightful reports for audit readiness and year-end tax filing support.",
    icon: "chart",
  },
];

const STAGE_TIME = 6;
const ANNUAL_TAX = 116220;
const MONTHLY_TDS = 9685;
const MONTHS_DONE = 7; // Apr – Oct

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
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "check-file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M9 15l2 2 4-4" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
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
    case "bank":
      return (
        <svg {...p}>
          <path d="M3 10 12 4l9 6" />
          <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
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

// 1 — Calculate: old vs new regime
const REGIMES = [
  {
    k: "old",
    n: "Old regime",
    taxable: 1210000,
    tax: 182520,
    rows: [
      ["Declarations (80C, HRA…)", "−₹3,60,000"],
      ["Standard deduction", "−₹50,000"],
      ["Health & education cess", "4%"],
    ],
  },
  {
    k: "new",
    n: "New regime",
    taxable: 1545000,
    tax: ANNUAL_TAX,
    rows: [
      ["Lower slab rates", "Applied"],
      ["Standard deduction", "−₹75,000"],
      ["Health & education cess", "4%"],
    ],
  },
];

function CalculatePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".itx-input"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.3 },
      0.2,
    );
    q(".itx-reg").forEach((r, i) => {
      tl.fromTo(
        r,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
        0.6 + i * 0.15,
      );
      tl.fromTo(
        r.querySelectorAll(".itx-row"),
        { autoAlpha: 0, x: -8 },
        { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.25 },
        0.75 + i * 0.15,
      );
      tl.fromTo(
        r.querySelector(".itx-reg-bar i"),
        { scaleX: 0 },
        { scaleX: REGIMES[i].tax / 200000, duration: 1, ease: "power2.out" },
        0.9 + i * 0.15,
      );
      count(tl, r.querySelector(".js-tax"), REGIMES[i].tax, 0.9 + i * 0.15, 1);
    });
    tl.fromTo(
      q(".itx-best"),
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(3)" },
      2.1,
    );
    tl.to(q(".itx-reg.old"), { opacity: 0.55, duration: 0.3 }, 2.1);
    tl.fromTo(
      q(".itx-save"),
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, ease: "back.out(1.8)" },
      2.3,
    );
    count(tl, q(".js-save")[0], REGIMES[0].tax - ANNUAL_TAX, 2.3, 0.8);
    count(tl, q(".js-mtds")[0], MONTHLY_TDS, 2.4, 0.8);
  }, delay);

  return (
    <div className="itx-panel" ref={ref}>
      <div className="itx-inputs">
        <div className="itx-input">
          <small>Gross salary</small>
          <b>₹16,20,000</b>
        </div>
        <div className="itx-input">
          <small>Declarations</small>
          <b>₹3,60,000</b>
        </div>
        <div className="itx-input">
          <small>Other income</small>
          <b>₹0</b>
        </div>
      </div>
      <div className="itx-regs">
        {REGIMES.map((r) => (
          <div className={`itx-reg ${r.k}`} key={r.k}>
            <div className="itx-reg-top">
              <b>{r.n}</b>
              {r.k === "new" && (
                <span className="itx-best">
                  <Icon name="spark" size={10} /> Best for you
                </span>
              )}
            </div>
            <small>Taxable income {inr(r.taxable)}</small>
            <div className="itx-rows">
              {r.rows.map(([a, b]) => (
                <div className="itx-row" key={a}>
                  <span>{a}</span>
                  <b>{b}</b>
                </div>
              ))}
            </div>
            <span className="itx-reg-bar">
              <i />
            </span>
            <strong className="js-tax">₹0</strong>
            <small>Annual tax incl. cess</small>
          </div>
        ))}
      </div>
      <div className="itx-save">
        <div>
          <small>Employee saves</small>
          <b className="js-save">₹0</b>
        </div>
        <div>
          <small>Monthly TDS</small>
          <b className="js-mtds">₹0</b>
        </div>
        <div>
          <small>Updated</small>
          <b>Live, on every input</b>
        </div>
      </div>
    </div>
  );
}

// 2 — Comply: monthly TDS + quarterly returns
const MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];
const RETURNS = [
  { q: "Q1", s: "Filed", d: "24Q · 31 Jul", ok: true },
  { q: "Q2", s: "Filed", d: "24Q · 31 Oct", ok: true },
  { q: "Q3", s: "Due", d: "24Q · 31 Jan" },
  { q: "Q4", s: "Due", d: "24Q · 31 May" },
];

function ComplyPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".itx-mon.done"),
      { scale: 0.5, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.09,
        duration: 0.3,
        ease: "back.out(2.4)",
      },
      0.2,
    );
    tl.fromTo(
      q(".itx-mon.next"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
      0.9,
    );
    tl.fromTo(
      q(".itx-mon.next"),
      { boxShadow: "0 0 0 0 rgba(29,111,216,0.5)" },
      { boxShadow: "0 0 0 6px rgba(29,111,216,0)", duration: 0.8, repeat: 2 },
      1.1,
    );
    tl.fromTo(
      q(".itx-challan"),
      { x: 20, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.6)" },
      1.2,
    );
    tl.fromTo(
      q(".itx-ret"),
      { y: 12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.3 },
      1.7,
    );
    tl.fromTo(
      q(".itx-ret.ok .itx-ret-s"),
      { scale: 0 },
      { scale: 1, stagger: 0.12, duration: 0.3, ease: "back.out(3)" },
      2,
    );
  }, delay);

  return (
    <div className="itx-panel" ref={ref}>
      <div className="itx-head js-in">
        <Icon name="shield" size={12} /> TDS deducted &amp; deposited · FY
        2026-27
      </div>
      <div className="itx-months">
        {MONTHS.map((m, i) => (
          <div
            className={`itx-mon ${i < MONTHS_DONE ? "done" : i === MONTHS_DONE ? "next" : ""}`}
            key={m}
          >
            <small>{m}</small>
            {i < MONTHS_DONE ? <Icon name="check" size={11} /> : <i />}
          </div>
        ))}
      </div>
      <div className="itx-challan">
        <span className="itx-ic">
          <Icon name="bank" size={13} />
        </span>
        <div className="itx-grow">
          <b>October TDS deposited · {inr(2916480)}</b>
          <small>Challan generated &amp; paid before the 7 Nov due date</small>
        </div>
        <span className="itx-ok">
          <Icon name="check" size={10} /> On time
        </span>
      </div>
      <div className="itx-rets">
        {RETURNS.map((r) => (
          <div className={`itx-ret ${r.ok ? "ok" : ""}`} key={r.q}>
            <b>{r.q}</b>
            <small>{r.d}</small>
            <span className="itx-ret-s">
              {r.ok && <Icon name="check" size={9} />} {r.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 — Validate: declarations vs proofs + Form 16
const PROOFS = [
  { s: "80C", n: "LIC & PPF", v: "₹1,50,000", st: "ok" },
  { s: "HRA", n: "Rent receipts · 12 months", v: "₹2,40,000", st: "ok" },
  { s: "80D", n: "Health insurance", v: "₹25,000", st: "warn" },
];

function ValidatePanel({ delay }) {
  const ref = usePanel((tl, q) => {
    q(".itx-proof").forEach((row, i) => {
      const at = 0.3 + i * 0.4;
      tl.fromTo(
        row,
        { autoAlpha: 0, x: -14 },
        { autoAlpha: 1, x: 0, duration: 0.3 },
        at,
      );
      tl.fromTo(
        row.querySelector(".itx-scan"),
        { left: "0%", autoAlpha: 1 },
        { left: "100%", autoAlpha: 0, duration: 0.5, ease: "power1.in" },
        at + 0.15,
      );
      tl.fromTo(
        row.querySelector(".itx-pst"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
        at + 0.55,
      );
    });
    tl.fromTo(
      q(".itx-nudge"),
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.3 },
      1.7,
    );
    tl.fromTo(
      q(".itx-f16"),
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
      2,
    );
    tl.fromTo(
      q(".itx-f16-bar i"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: "power1.inOut" },
      2.2,
    );
    tl.fromTo(
      q(".itx-f16-ok"),
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2.5)" },
      3.2,
    );
  }, delay);

  return (
    <div className="itx-panel" ref={ref}>
      <div className="itx-head js-in">
        <Icon name="check-file" size={12} /> Proof verification · Ananya R.{" "}
        <em>Old regime</em>
      </div>
      <div className="itx-proofs">
        {PROOFS.map((p) => (
          <div className={`itx-proof ${p.st}`} key={p.s}>
            <span className="itx-sec">{p.s}</span>
            <div className="itx-grow">
              <b>{p.n}</b>
              <small>Declared {p.v}</small>
            </div>
            <span className={`itx-pst ${p.st}`}>
              {p.st === "ok" ? (
                <>
                  <Icon name="check" size={10} /> Verified
                </>
              ) : (
                <>
                  <Icon name="alert" size={10} /> Proof missing
                </>
              )}
            </span>
            <span className="itx-scan" />
          </div>
        ))}
      </div>
      <span className="itx-nudge">
        <Icon name="bell" size={10} /> Reminder sent to Ananya to upload her 80D
        receipt
      </span>
      <div className="itx-f16">
        <span className="itx-f16-doc">
          <Icon name="file" size={18} />
          <b>16</b>
        </span>
        <div className="itx-grow">
          <b>Form 16 · Part A + Part B</b>
          <small>Generated from verified data for 248 employees</small>
          <span className="itx-f16-bar">
            <i />
          </span>
        </div>
        <span className="itx-f16-ok">
          <Icon name="download" size={10} /> Ready
        </span>
      </div>
    </div>
  );
}

// 4 — Report: audit readiness
const TDS_BARS = [24.1, 24.6, 25.2, 26.8, 27.4, 28.3, 29.2];
const REPORTS = ["TDS register", "24Q summary", "Form 12BA", "Tax projection"];

function ReportPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.fromTo(
      q(".itx-gauge-fg"),
      { strokeDashoffset: 100 },
      { strokeDashoffset: 2, duration: 1.3, ease: "power2.out" },
      0.3,
    );
    count(tl, q(".js-ready")[0], 98, 0.3, 1.3, (v) => `${Math.round(v)}%`);
    tl.fromTo(
      q(".itx-tbar i"),
      { scaleY: 0 },
      { scaleY: 1, stagger: 0.07, duration: 0.4, ease: "power2.out" },
      0.5,
    );
    tl.fromTo(
      q(".itx-rep"),
      { autoAlpha: 0, x: 12 },
      { autoAlpha: 1, x: 0, stagger: 0.12, duration: 0.3 },
      1.4,
    );
    tl.fromTo(
      q(".itx-audit"),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.35 },
      2.1,
    );
  }, delay);

  return (
    <div className="itx-panel" ref={ref}>
      <div className="itx-rep-top">
        <div className="itx-gauge js-in">
          <svg viewBox="0 0 120 70" aria-hidden>
            <path
              d="M10 64 A50 50 0 0 1 110 64"
              className="itx-gauge-bg"
              pathLength="100"
            />
            <path
              d="M10 64 A50 50 0 0 1 110 64"
              className="itx-gauge-fg"
              pathLength="100"
            />
          </svg>
          <b className="js-ready">0%</b>
          <small>Audit readiness</small>
        </div>
        <div className="itx-tds js-in">
          <small className="itx-mini-h">Monthly TDS · company (₹ lakh)</small>
          <div className="itx-tbars">
            {TDS_BARS.map((v, i) => (
              <div className="itx-tbar" key={i}>
                <span>
                  <i style={{ height: `${((v - 20) / 10) * 100}%` }} />
                </span>
                <small>{MONTHS[i]}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="itx-reps">
        {REPORTS.map((r) => (
          <div className="itx-rep" key={r}>
            <Icon name="file" size={12} />
            <b>{r}</b>
            <span>
              <Icon name="download" size={11} />
            </span>
          </div>
        ))}
      </div>
      <span className="itx-audit">
        <Icon name="check" size={10} /> Year-end ready · every figure traceable
        to source
      </span>
    </div>
  );
}

const PANELS = [CalculatePanel, ComplyPanel, ValidatePanel, ReportPanel];

/* ------------------------------------------------------------------ */
/* Tax desk app (left side)                                            */
/* ------------------------------------------------------------------ */

function TaxApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;
  const tabsRef = useRef(null);

  // Mobile: when the active feature changes, slide the tab strip so the active tab is fully visible
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.children[stage];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined;
    const target = Math.max(
      0,
      Math.min(
        strip.scrollWidth - strip.clientWidth,
        btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2,
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
    <div className="itx-frame" ref={frameRef}>
      <div className="itx-chrome">
        <span className="itx-dot r" />
        <span className="itx-dot y" />
        <span className="itx-dot g" />
        <div className="itx-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/tax/fy-2026-27
        </div>
      </div>

      <div className="itx-app">
        <aside className="itx-side js-side">
          <div className="itx-emp">
            <span className="itx-av">KV</span>
            <div>
              <b>Karthik V.</b>
              <small>PAN ABCPK••••F</small>
            </div>
          </div>
          <span className="itx-regime">
            <Icon name="spark" size={10} /> New regime · FY 2026-27
          </span>
          <div className="itx-liab">
            <small>Annual tax liability</small>
            <strong className="js-liab">₹0</strong>
          </div>
          <div className="itx-ring">
            <svg viewBox="0 0 80 80" aria-hidden>
              <circle cx="40" cy="40" r="32" className="itx-ring-bg" />
              <circle
                cx="40"
                cy="40"
                r="32"
                className="itx-ring-fg js-ring"
                pathLength="100"
              />
            </svg>
            <div>
              <strong>{MONTHS_DONE}/12</strong>
              <small>months of TDS</small>
            </div>
          </div>
          <div className="itx-split">
            <div>
              <small>Deducted</small>
              <b>{inr(MONTHLY_TDS * MONTHS_DONE)}</b>
            </div>
            <div>
              <small>Balance</small>
              <b>{inr(ANNUAL_TAX - MONTHLY_TDS * MONTHS_DONE)}</b>
            </div>
          </div>
        </aside>

        <div className="itx-main">
          <div
            className="itx-tabs js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Tax features"
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
                <Icon name={f.icon} size={11} /> {f.title}
              </button>
            ))}
          </div>
          <div className="itx-panel-wrap" ref={panelWrap}>
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

  // auto-advance through Calculate → Comply → Validate → Report
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
      tl.from(q(".js-tabs"), { y: -10, opacity: 0, duration: 0.45 }, 0.7);
      tl.fromTo(
        q(".js-ring"),
        { strokeDasharray: "0 100" },
        {
          strokeDasharray: `${(MONTHS_DONE / 12) * 100} 100`,
          duration: 1.2,
          ease: "power2.out",
        },
        0.9,
      );
      const liab = q(".js-liab")[0];
      const o = { v: 0 };
      tl.to(
        o,
        {
          v: ANNUAL_TAX,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => liab && (liab.textContent = inr(o.v)),
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
      className="itx-hero"
      ref={sectionRef}
      aria-labelledby="itx-hero-title"
    >
      <div className="itx-hero-bg" aria-hidden>
        <span className="itx-blob b1 js-blob" />
        <span className="itx-blob b2 js-blob" />
        <span className="itx-grid-bg" />
      </div>

      <div className="itx-container itx-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="itx-content">
          <span className="itx-eyebrow js-reveal">
            <span className="itx-live-dot" /> Simplified, accurate &amp; timely
            tax management
          </span>
          <h1 id="itx-hero-title" className="itx-title js-reveal">
            Income Tax{" "}
            <span className="itx-grad">Computation &amp; Compliance</span>
          </h1>

          <ul className="itx-feats" role="tablist" aria-label="Tax features">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`itx-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="itx-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="itx-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="itx-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: tax desk app */}
        <div className="itx-visual" ref={visualRef}>
          <TaxApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="itx-float f1 js-float">
            <span className="itx-float-ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <strong>TDS filed on time</strong>
              <small>Every quarter, every month</small>
            </div>
          </div>
          <div className="itx-float f2 js-float">
            <span className="itx-float-ic pr">
              <Icon name="file" size={14} />
            </span>
            <div>
              <strong>Form 16 in one click</strong>
              <small>Part A + Part B</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Tax engine printer + three.js wave grid                  */
/* ------------------------------------------------------------------ */

const PRINT_TABS = [
  {
    label: "Automated Tax Calculation",
    icon: "calc",
    title: [
      ["Automated", 1],
      [" tax ", 0],
      ["calculation", 1],
    ],
    desc: "Automatically calculate employee income tax deductions (TDS) with precision based on the latest tax rules.",
  },
  {
    label: "Multi-Regime Support",
    icon: "spark",
    title: [
      ["Support", 1],
      [" for ", 0],
      ["multiple tax regimes", 1],
    ],
    desc: "Easily switch between old and new tax regimes, ensuring flexibility for employees.",
  },
  {
    label: "Online Declarations",
    icon: "check-file",
    title: [
      ["Online", 1],
      [" tax ", 0],
      ["declarations", 1],
    ],
    desc: "Employees can submit proofs, claim exemptions, and make declarations directly online.",
  },
  {
    label: "Statutory Report Generation",
    icon: "file",
    title: [
      ["Statutory", 1],
      [" report ", 0],
      ["generation", 1],
    ],
    desc: "Generate TDS statements, Form 16, and compliance-ready reports instantly.",
  },
  {
    label: "Real-Time Compliance Updates",
    icon: "bell",
    title: [
      ["Real-time", 1],
      [" compliance ", 0],
      ["updates", 1],
    ],
    desc: "Stay aligned with the latest government tax regulations through automatic updates.",
  },
];
const PRINT_TIME = 7;
const WAVE_COLORS = ["#38bdf8", "#34d399", "#a78bfa", "#fbbf24", "#60a5fa"];

// Receipt content per tab. Row types: h = heading, r = label/value, d = divider, t = total, s = stamp, n = note
const RECEIPTS = [
  {
    head: "TDS COMPUTATION",
    sub: "Karthik V. · Oct 2026 · New regime",
    rows: [
      ["r", "Gross annual salary", "16,20,000"],
      ["r", "Standard deduction", "−75,000"],
      ["d"],
      ["r", "Taxable income", "15,45,000"],
      ["r", "Tax as per slabs", "1,11,750"],
      ["r", "Health & edu. cess 4%", "4,470"],
      ["t", "Annual tax", "1,16,220"],
      ["r", "Deducted Apr – Sep", "58,110"],
      ["t", "TDS this month", "9,685"],
      ["s", "AUTO-CALCULATED"],
    ],
  },
  {
    head: "REGIME COMPARISON",
    sub: "Karthik V. · FY 2026-27",
    rows: [
      ["r", "Old regime · annual tax", "1,82,520"],
      ["b", "old", 100],
      ["r", "New regime · annual tax", "1,16,220"],
      ["b", "new", 64],
      ["d"],
      ["t", "Annual saving", "66,300"],
      [
        "n",
        "Employee switched regime in the app · TDS re-spread over remaining months",
      ],
      ["s", "NEW REGIME ✓"],
    ],
  },
  {
    head: "DECLARATION RECEIPT",
    sub: "Ananya R. · Ref DCL-2026-0418",
    rows: [
      ["r", "80C · LIC & PPF", "1,50,000 ✓"],
      ["r", "HRA · rent receipts", "2,40,000 ✓"],
      ["r", "80D · health insurance", "25,000 ⏳"],
      ["r", "Home loan interest", "— ✗"],
      ["d"],
      ["t", "Total claimed", "4,15,000"],
      [
        "n",
        "Submitted online · 12 Oct 2026, 10:42 AM · proofs uploaded from mobile",
      ],
      ["s", "RECEIVED"],
    ],
  },
  {
    head: "REPORTS GENERATED",
    sub: "NGriffinpay Pvt Ltd · Q2 FY 2026-27",
    rows: [
      ["r", "Form 24Q · Q2 statement", "✓"],
      ["r", "Form 16 · Part A + B", "248 ✓"],
      ["r", "Form 12BA", "248 ✓"],
      ["r", "TDS challan register", "✓"],
      ["r", "Tax projection report", "✓"],
      ["d"],
      ["t", "Generated in", "4.2 sec"],
      ["s", "COMPLIANCE READY"],
    ],
  },
  {
    head: "COMPLIANCE UPDATE",
    sub: "Auto-applied · no action needed",
    rows: [
      ["r", "Rule set", "v2026.1"],
      ["r", "Tax slabs · FY 2026-27", "Updated ✓"],
      ["r", "Standard deduction", "Updated ✓"],
      ["r", "Cess & surcharge rules", "Verified ✓"],
      ["d"],
      ["t", "Employees recalculated", "248"],
      ["n", "Synced with the latest government notifications"],
      ["s", "UP TO DATE"],
    ],
  },
];

/* ---------- three.js: a softly waving grid of points (a "ledger" floor) ---------- */
function useWaveGrid(canvasRef, wrapRef, colorIndex) {
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
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 3.2, 9);
    camera.lookAt(0, 0, -2);

    const COLS = 90;
    const ROWS = 40;
    const COUNT = COLS * ROWS;
    const pos = new Float32Array(COUNT * 3);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = (r * COLS + c) * 3;
        pos[i] = (c / (COLS - 1) - 0.5) * 30;
        pos[i + 2] = -(r / (ROWS - 1)) * 22 + 4;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.06,
      color: new THREE.Color(WAVE_COLORS[0]),
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.position.y = -1.6;
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

    let t = 0;
    let visible = true;
    const amp = { v: 1 };
    const draw = () => {
      for (let i = 0; i < COUNT; i++) {
        const x = pos[i * 3];
        const z = pos[i * 3 + 2];
        pos[i * 3 + 1] =
          (Math.sin(x * 0.35 + t * 0.9) * 0.35 +
            Math.cos(z * 0.45 + t * 0.7) * 0.35) *
          amp.v;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    const reduce = prefersReduced();
    const tick = (time, delta) => {
      if (!visible) return;
      t += (delta || 16) / 1000;
      draw();
    };
    if (reduce) draw();
    else gsap.ticker.add(tick);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(wrap);

    api.current = {
      pulse: (hex) => {
        const c = new THREE.Color(hex);
        gsap.to(mat.color, {
          r: c.r,
          g: c.g,
          b: c.b,
          duration: 1,
          onUpdate: () => reduce && draw(),
        });
        if (!reduce)
          gsap.fromTo(
            amp,
            { v: 2.2 },
            { v: 1, duration: 1.6, ease: "power2.out" },
          );
      },
    };

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      api.current = null;
    };
  }, [canvasRef, wrapRef]);

  useEffect(() => {
    api.current?.pulse(WAVE_COLORS[colorIndex]);
  }, [colorIndex]);
}

function Receipt({ data }) {
  return (
    <div className="itp-receipt">
      <div className="itp-rc-head">
        <span className="itp-rc-logo">N</span>
        <b>{data.head}</b>
        <small>{data.sub}</small>
      </div>
      <div className="itp-rc-dash" />
      {data.rows.map((r, i) => {
        if (r[0] === "d")
          return <div className="itp-rc-line itp-rc-dash" key={i} />;
        if (r[0] === "s")
          return (
            <div className="itp-rc-line itp-rc-stamp" key={i}>
              <span>{r[1]}</span>
            </div>
          );
        if (r[0] === "n")
          return (
            <div className="itp-rc-line itp-rc-note" key={i}>
              {r[1]}
            </div>
          );
        if (r[0] === "b")
          return (
            <div className="itp-rc-line itp-rc-bar" key={i}>
              <i className={r[1]} style={{ width: `${r[2]}%` }} />
            </div>
          );
        return (
          <div
            className={`itp-rc-line itp-rc-row ${r[0] === "t" ? "tot" : ""}`}
            key={i}
          >
            <span>{r[1]}</span>
            <b>{r[2]}</b>
          </div>
        );
      })}
      <div className="itp-rc-line itp-rc-code" aria-hidden>
        {Array.from({ length: 34 }, (_, i) => (
          <i key={i} style={{ width: [1, 2, 3, 1, 2][i % 5] }} />
        ))}
      </div>
    </div>
  );
}

function TaxPrinterSection() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState({ i: 0, n: 0 }); // receipt on the paper + print job number
  const firstTab = useRef(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const printerRef = useRef(null);
  const paperRef = useRef(null);
  const tiltRef = useRef(null);
  const bodyRefs = useRef([]);
  const barRefs = useRef([]);
  const busy = useRef(null);

  useWaveGrid(canvasRef, sectionRef, active);

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
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (!inView || prefersReduced()) return undefined;
    const bar = barRefs.current[active];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: PRINT_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(PRINT_TIME, () =>
      setActive((a) => (a + 1) % PRINT_TABS.length),
    );
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, inView]);

  // accordion open/close
  useLayoutEffect(() => {
    const reduce = prefersReduced();
    bodyRefs.current.forEach((b, i) => {
      if (!b) return;
      gsap.to(b, {
        height: i === active ? "auto" : 0,
        opacity: i === active ? 1 : 0,
        duration: reduce ? 0 : 0.5,
        ease: "power3.inOut",
      });
    });
  }, [active]);

  // tear off the old receipt, then swap content (print happens in the next effect)
  useEffect(() => {
    if (firstTab.current) {
      firstTab.current = false;
      return undefined;
    }
    const paper = paperRef.current;
    const swap = () => setShown((s) => ({ i: active, n: s.n + 1 }));
    if (!paper || prefersReduced()) {
      swap();
      return undefined;
    }
    busy.current?.kill();
    const tl = gsap.timeline({ onComplete: swap });
    tl.to(paper, {
      rotation: gsap.utils.random(-8, 8),
      y: 520,
      opacity: 0,
      duration: 0.55,
      ease: "power2.in",
    });
    busy.current = tl;
    return () => tl.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // print the receipt that's now on the paper
  useLayoutEffect(() => {
    const paper = paperRef.current;
    const printer = printerRef.current;
    if (!paper || !printer || !inView) return undefined;
    const q = gsap.utils.selector(paper);
    const lines = q(".itp-rc-line, .itp-rc-head, .itp-rc-dash");
    const reduce = prefersReduced();
    const tl = gsap.timeline();
    tl.set(paper, { rotation: 0, opacity: 1, y: 0, yPercent: -100 });
    tl.set(lines, { opacity: 0 });
    tl.to(
      printer.querySelector(".itp-led"),
      {
        backgroundColor: "#34d399",
        boxShadow: "0 0 12px #34d399",
        duration: 0.2,
      },
      0,
    );
    tl.to(
      printer,
      { x: 1.5, duration: 0.05, repeat: 23, yoyo: true, ease: "none" },
      0.1,
    );
    tl.to(paper, { yPercent: 0, duration: 2.4, ease: "steps(24)" }, 0.1);
    tl.to(
      lines,
      { opacity: 1, duration: 0.05, stagger: 2.2 / lines.length },
      0.15,
    );
    const stamp = q(".itp-rc-stamp span")[0];
    if (stamp)
      tl.fromTo(
        stamp,
        { scale: 2.4, rotation: -30, opacity: 0 },
        {
          scale: 1,
          rotation: -8,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(2)",
        },
        2.6,
      );
    q(".itp-rc-bar i").forEach((b) =>
      tl.fromTo(
        b,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "power2.out" },
        1.4,
      ),
    );
    tl.to(
      printer.querySelector(".itp-led"),
      {
        backgroundColor: "#38bdf8",
        boxShadow: "0 0 8px #38bdf8",
        duration: 0.3,
      },
      2.6,
    );
    if (reduce) tl.progress(1);
    busy.current = tl;
    return () => tl.kill();
  }, [shown.n, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // entrance + mouse tilt
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      if (prefersReduced()) return undefined;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
      tl.from(q(".itp-title .w"), {
        yPercent: 110,
        opacity: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          q(".itp-printer"),
          { y: -80, opacity: 0, duration: 0.9, ease: "back.out(1.4)" },
          0.2,
        )
        .from(
          q(".itp-item"),
          {
            x: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          0.3,
        )
        .from(q(".itp-cta"), { y: 20, opacity: 0, duration: 0.5 }, 0.8);

      const fine = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (!fine) return undefined;
      const rx = gsap.quickTo(tiltRef.current, "rotationX", {
        duration: 0.9,
        ease: "power3",
      });
      const ry = gsap.quickTo(tiltRef.current, "rotationY", {
        duration: 0.9,
        ease: "power3",
      });
      const sec = sectionRef.current;
      const move = (e) => {
        const r = sec.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      };
      sec.addEventListener("mousemove", move);
      return () => sec.removeEventListener("mousemove", move);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="itp" ref={sectionRef} aria-labelledby="itp-title">
      <canvas className="itp-canvas" ref={canvasRef} aria-hidden />

      <div className="itx-container itp-inner">
        <h2 id="itp-title" className="itp-title">
          {[
            ["Automate", 1],
            ["tax", 0],
            ["calculations,", 0],
            ["ensure", 1],
            ["timely", 0],
            ["compliance,", 0],
            ["and", 1],
            ["simplify", 0],
            ["payroll", 0],
            ["processes", 0],
          ].map(([w, hl], i) => (
            <span className="wm" key={i}>
              <span className={`w ${hl ? "hl" : ""}`}>{w}</span>
            </span>
          ))}
        </h2>

        <div className="itp-grid">
          {/* printer */}
          <div className="itp-stage" aria-hidden>
            <div className="itp-tilt" ref={tiltRef}>
              <div className="itp-printer" ref={printerRef}>
                <div className="itp-pr-top">
                  <span className="itp-led" />
                  <b>NGriffinpay · Tax Engine</b>
                  <span className="itp-screen">0{active + 1}/05</span>
                </div>
                <div className="itp-slot" />
              </div>
              <div className="itp-feed">
                <div className="itp-paper" ref={paperRef}>
                  <Receipt data={RECEIPTS[shown.i]} />
                </div>
              </div>
            </div>
          </div>

          {/* accordion tabs */}
          <div className="itp-side">
            <div
              className="itp-list"
              role="tablist"
              aria-label="Tax capabilities"
            >
              {PRINT_TABS.map((t, i) => (
                <div
                  className={`itp-item ${active === i ? "is-on" : ""}`}
                  key={t.label}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    aria-controls={`itp-body-${i}`}
                    className="itp-tab"
                    onClick={() => setActive(i)}
                  >
                    <span className="itp-tab-ic">
                      <Icon name={t.icon} size={15} />
                    </span>
                    <span className="itp-tab-txt">{t.label}</span>
                    <span className="itp-tab-n">0{i + 1}</span>
                  </button>
                  <div
                    className="itp-body"
                    id={`itp-body-${i}`}
                    ref={(el) => (bodyRefs.current[i] = el)}
                    role="tabpanel"
                  >
                    <h3>
                      {t.title.map(([w, hl], k) =>
                        hl ? (
                          <span className="hl" key={k}>
                            {w}
                          </span>
                        ) : (
                          <span key={k}>{w}</span>
                        ),
                      )}
                    </h3>
                    <p>{t.desc}</p>
                  </div>
                  <span className="itp-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </div>
              ))}
            </div>
            <a href="/contact-us" className="itx-btn primary itp-cta">
              See it with your payroll data <Icon name="arrow" size={16} />
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
    q: "What is the Income Tax Computation & Compliance feature in NGriffinpay?",
    a: "NGriffinpay’s Income Tax Computation & Compliance module automatically calculates employee income tax deductions (TDS) as per the latest tax laws, ensuring accuracy and timely compliance with statutory requirements.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "income tax computation",
      "tax compliance",
    ],
  },
  {
    q: "How does the system calculate tax?",
    a: "The system computes tax based on the employee’s salary structure, allowances, exemptions, and deductions declared, following the most recent government tax slabs and rules.",
    keys: [
      "how does",
      "calculate",
      "calculation",
      "compute",
      "slab",
      "salary structure",
      "allowance",
      "exemption",
      "deduction",
      "tds",
    ],
  },
  {
    q: "Does it handle multiple tax regimes?",
    a: "Yes, NGriffinpay supports both the old and new income tax regimes, allowing employees to choose and switch between them as per their preference.",
    keys: ["regime", "old", "new", "switch", "choose", "multiple", "both"],
  },
  {
    q: "Can employees submit tax declarations online?",
    a: "Absolutely. Employees can easily upload proof of investments, claim exemptions, and submit declarations directly through the portal, reducing paperwork and manual follow-ups.",
    keys: [
      "declaration",
      "declare",
      "proof",
      "upload",
      "investment",
      "80c",
      "hra",
      "online",
      "submit",
      "portal",
      "claim",
    ],
  },
  {
    q: "Does it generate statutory tax reports?",
    a: "Yes, the system generates detailed TDS statements, Form 16, and other statutory reports, ensuring you are fully prepared for filings and audits.",
    keys: [
      "report",
      "form 16",
      "form16",
      "24q",
      "statement",
      "statutory",
      "filing",
      "audit",
      "generate",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the Griffy. Pick a question or type your own about income tax and TDS.";
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
      <div className="itq-row bot" ref={ref}>
        <span className="itq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="itq-bubble bot itq-typing"
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
      <div className="itq-row user" ref={ref}>
        <div className="itq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="itq-row bot" ref={ref}>
      <span className="itq-bot-av" aria-hidden>
        N
      </span>
      <div className="itq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="itq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function TaxFaqSection() {
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
      gsap.from(q(".itq-chat"), {
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
    <section className="itq" ref={sectionRef} aria-labelledby="itq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="itx-container itq-grid">
        <div className="itq-left">
          <span className="itq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="itq-title" className="itq-title js-faq-reveal">
            Income Tax Computation &amp; Compliance –{" "}
            <span className="itx-grad">FAQs</span>
          </h2>
          <p className="itq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="itq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`itq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="itq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="itq-q-text">{f.q}</span>
                  <span className="itq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="itq-chat">
          <div className="itq-chat-head">
            <span className="itq-head-av">
              N<i />
            </span>
            <div>
              <strong>Griffy</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="itq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="itq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="itq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="itq-suggest" aria-label="Suggested questions">
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

          <form className="itq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about TDS, regimes or Form 16…"
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

export default function IncomeTax() {
  return (
    <div className="itx-page">
      <HeroSection />
      <span id="itx-next" />
      <TaxPrinterSection />
      <TaxFaqSection />
    </div>
  );
}
