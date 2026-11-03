// EmployeeExit.jsx
// NGriffinpay — Product inner page: "Employee Exit Management"
// Section 1: Hero banner (live exit desk app on the left, content on the right)
// Section 2: Exit Terminal (split-flap departure board = tabs, boarding pass per service)
// Section 3: FAQs as a live chat (+ FAQPage schema for SEO)
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EmployeeExit.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    title: "Resignation Tracking",
    short: "Resignation",
    desc: "Capture resignation details and ensure timely processing with full visibility.",
    icon: "file",
  },
  {
    title: "Notice Period",
    short: "Notice",
    desc: "Auto-calculate and manage notice periods with flexible configuration.",
    icon: "clock",
  },
  {
    title: "Exit Interviews",
    short: "Interview",
    desc: "Capture valuable feedback to enhance employee experience and reduce churn.",
    icon: "chat",
  },
  {
    title: "FNF Settlement",
    short: "FNF",
    desc: "Process full & final settlements accurately with compliance checks.",
    icon: "wallet",
  },
];

const STAGE_TIME = 5.5;

// Sidebar: exit progress + clearance checklist (one more item ticks per stage)
const PROGRESS = [25, 50, 75, 100];
const CLEARANCE = [
  { label: "Manager handover", icon: "users" },
  { label: "IT assets returned", icon: "laptop" },
  { label: "Finance clearance", icon: "wallet" },
  { label: "HR documents", icon: "file" },
];

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const inr = (n) => Math.round(n).toLocaleString("en-IN");

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
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "chat":
      return (
        <svg {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v13H5a2 2 0 0 1-2-2V5" />
          <path d="M16 14h.01" />
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
          <rect x="4" y="4" width="16" height="11" rx="1.5" />
          <path d="M2 19h20" />
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
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "star":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      );
    case "send":
      return (
        <svg {...p}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
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
    case "plane":
      return (
        <svg {...p}>
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
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

// 1 — Resignation Tracking: letter received + approval chain
const APPROVALS = [
  { who: "Priya S.", role: "Submitted", time: "02 Sep, 10:14" },
  { who: "Rahul M.", role: "Manager approved", time: "02 Sep, 13:40" },
  { who: "HR Desk", role: "HR accepted", time: "02 Sep, 16:05" },
];
function ResignationPanel({ delay }) {
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".exm-letter-line"),
      { scaleX: 0, transformOrigin: "left", stagger: 0.08, duration: 0.35 },
      0.35,
    );
    tl.from(
      q(".exm-stamp"),
      {
        scale: 2.2,
        rotation: -30,
        opacity: 0,
        duration: 0.45,
        ease: "back.out(2)",
      },
      0.9,
    );
    q(".exm-appr").forEach((el, i) => {
      tl.from(
        el.querySelector(".exm-appr-dot"),
        { scale: 0, duration: 0.3, ease: "back.out(2.4)" },
        1.3 + i * 0.45,
      );
    });
    q(".exm-link-fill").forEach((el, i) =>
      tl.from(el, { scaleX: 0, duration: 0.4, ease: "none" }, 1.45 + i * 0.45),
    );
    tl.from(q(".exm-sla"), { autoAlpha: 0, y: 8, duration: 0.4 }, 2.8);
  }, delay);

  return (
    <div className="exm-panel" ref={ref}>
      <div className="exm-head js-in">
        <Icon name="file" /> Resignation received{" "}
        <em className="exm-tag">Case #EX-1042</em>
      </div>
      <div className="exm-letter js-in">
        <div className="exm-letter-top">
          <span className="exm-av sm">PS</span>
          <div>
            <b>Priya S. · Product Designer</b>
            <small>Submitted via self-service · 02 Sep 2026</small>
          </div>
        </div>
        <div className="exm-letter-grid">
          <div>
            <small>Reason</small>
            <b>Higher studies</b>
          </div>
          <div>
            <small>Requested last day</small>
            <b>31 Oct 2026</b>
          </div>
          <div>
            <small>Notice as per policy</small>
            <b>60 days</b>
          </div>
        </div>
        <span className="exm-letter-line" style={{ width: "92%" }} />
        <span className="exm-letter-line" style={{ width: "78%" }} />
        <span className="exm-letter-line" style={{ width: "54%" }} />
        <span className="exm-stamp">
          <Icon name="check" size={11} /> Received
        </span>
      </div>
      <div className="exm-chain js-in">
        {APPROVALS.map((a, i) => (
          <div key={a.who} className="exm-chain-step">
            <div className="exm-appr">
              <span className="exm-appr-dot">
                <Icon name="check" size={10} />
              </span>
              <b>{a.role}</b>
              <small>
                {a.who} · {a.time}
              </small>
            </div>
            {i < APPROVALS.length - 1 && (
              <span className="exm-link">
                <i className="exm-link-fill" />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="exm-sla">
        <Icon name="clock" size={12} /> Processed in <b>6 hrs</b> · SLA 24 hrs ·
        Everyone notified
      </div>
    </div>
  );
}

// 2 — Notice Period: auto-calculated countdown
const NOTICE_TOTAL = 60;
const NOTICE_SERVED = 38;
const RING_R = 40;
const RING_C = 2 * Math.PI * RING_R;
function NoticePanel({ delay }) {
  const dayRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const st = { d: 0 };
    tl.fromTo(
      q(".exm-ring-fill"),
      { strokeDashoffset: RING_C },
      {
        strokeDashoffset: RING_C * (1 - NOTICE_SERVED / NOTICE_TOTAL),
        duration: 1.3,
        ease: "power2.out",
      },
      0.4,
    );
    tl.to(
      st,
      {
        d: NOTICE_SERVED,
        duration: 1.3,
        ease: "power2.out",
        onUpdate: () =>
          dayRef.current && (dayRef.current.textContent = Math.round(st.d)),
      },
      0.4,
    );
    tl.from(
      q(".exm-seg"),
      {
        scaleX: 0,
        transformOrigin: "left",
        stagger: 0.25,
        duration: 0.5,
        ease: "power2.out",
      },
      0.7,
    );
    tl.from(
      q(".exm-lwd"),
      { scale: 0.85, autoAlpha: 0, duration: 0.45, ease: "back.out(2)" },
      1.8,
    );
    tl.from(q(".exm-toggle i"), { x: -12, duration: 0.3, stagger: 0.15 }, 2.1);
  }, delay);

  return (
    <div className="exm-panel" ref={ref}>
      <div className="exm-head js-in">
        <Icon name="clock" /> Notice period{" "}
        <em className="exm-tag">Auto-calculated</em>
      </div>
      <div className="exm-notice js-in">
        <div className="exm-ring">
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r={RING_R} className="exm-ring-bg" />
            <circle
              cx="50"
              cy="50"
              r={RING_R}
              className="exm-ring-fill"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          <div className="exm-ring-txt">
            <b>
              <span ref={dayRef}>0</span>/{NOTICE_TOTAL}
            </b>
            <small>days served</small>
          </div>
        </div>
        <div className="exm-notice-rows">
          <div>
            <small>Resigned on</small>
            <b>02 Sep 2026</b>
          </div>
          <div>
            <small>Policy (Band L3)</small>
            <b>60 days</b>
          </div>
          <div className="exm-lwd">
            <small>Last working day</small>
            <b>
              <Icon name="calendar" size={12} /> 31 Oct 2026
            </b>
          </div>
        </div>
      </div>
      <div className="exm-timeline js-in">
        <div className="exm-segs">
          <span
            className="exm-seg served"
            style={{ width: `${(NOTICE_SERVED / NOTICE_TOTAL) * 100}%` }}
          />
          <span
            className="exm-seg leave"
            style={{ width: `${(5 / NOTICE_TOTAL) * 100}%` }}
          />
          <span
            className="exm-seg left"
            style={{ width: `${(17 / NOTICE_TOTAL) * 100}%` }}
          />
        </div>
        <div className="exm-legend">
          <span>
            <i className="served" /> Served 38
          </span>
          <span>
            <i className="leave" /> Leave adjusted 5
          </span>
          <span>
            <i className="left" /> Remaining 17
          </span>
        </div>
      </div>
      <div className="exm-toggles js-in">
        <span className="exm-toggle">
          <i /> Notice buyout allowed
        </span>
        <span className="exm-toggle">
          <i /> Adjust leave balance
        </span>
      </div>
    </div>
  );
}

// 3 — Exit Interviews: feedback form + scores
const SCORES = [
  { label: "Role & growth", v: 3.2 },
  { label: "Manager support", v: 4.5 },
  { label: "Pay & benefits", v: 3.6 },
  { label: "Team & culture", v: 4.6 },
];
const ANSWER =
  "More clarity on growth paths would have kept me longer. The team was great!";
function InterviewPanel({ delay }) {
  const ansRef = useRef(null);
  const ref = usePanel((tl, q) => {
    const st = { n: 0 };
    tl.to(
      st,
      {
        n: ANSWER.length,
        duration: 1.8,
        ease: "none",
        onUpdate: () =>
          ansRef.current &&
          (ansRef.current.textContent = ANSWER.slice(0, Math.round(st.n))),
      },
      0.45,
    );
    q(".exm-score-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: SCORES[i].v / 5, duration: 0.7, ease: "power3.out" },
        1.2 + i * 0.12,
      ),
    );
    q(".exm-score b").forEach((el, i) => {
      const s = { v: 0 };
      tl.to(
        s,
        {
          v: SCORES[i].v,
          duration: 0.7,
          onUpdate: () => (el.textContent = s.v.toFixed(1)),
        },
        1.2 + i * 0.12,
      );
    });
    tl.from(q(".exm-insight"), { autoAlpha: 0, y: 10, duration: 0.45 }, 2.3);
  }, delay);

  return (
    <div className="exm-panel" ref={ref}>
      <div className="exm-head js-in">
        <Icon name="chat" /> Exit interview{" "}
        <em className="exm-tag">Anonymous to manager</em>
      </div>
      <div className="exm-qa js-in">
        <small>Q4 · What could we have done better?</small>
        <p>
          <span ref={ansRef} />
          <i className="exm-caret" />
        </p>
      </div>
      <div className="exm-scores js-in">
        {SCORES.map((s) => (
          <div className="exm-score" key={s.label}>
            <span>{s.label}</span>
            <span className="exm-score-bar">
              <i className={s.v < 4 ? "low" : ""} />
            </span>
            <b>0.0</b>
          </div>
        ))}
      </div>
      <div className="exm-insight">
        <span className="exm-insight-ic">
          <Icon name="spark" size={13} />
        </span>
        <div>
          <b>Top exit reason this quarter: growth (38%)</b>
          <small>Shared with HR leadership to cut churn</small>
        </div>
      </div>
    </div>
  );
}

// 4 — FNF Settlement: earnings - deductions = net payable
const FNF_LINES = [
  { label: "Salary for 18 days", amt: 54000 },
  { label: "Leave encashment", amt: 36000 },
  { label: "Pro-rata bonus", amt: 25000 },
  { label: "TDS", amt: -11500 },
  { label: "PF & professional tax", amt: -3500 },
];
const FNF_NET = FNF_LINES.reduce((s, l) => s + l.amt, 0); // 1,00,000
const CHECKS = [
  "TDS computed",
  "PF updated",
  "Gratuity eligibility",
  "Payslip ready",
];
function FnfPanel({ delay }) {
  const netRef = useRef(null);
  const ref = usePanel((tl, q) => {
    tl.from(
      q(".exm-fnf-row"),
      { x: -14, autoAlpha: 0, stagger: 0.14, duration: 0.35 },
      0.35,
    );
    const st = { v: 0 };
    tl.to(
      st,
      {
        v: FNF_NET,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () =>
          netRef.current && (netRef.current.textContent = inr(st.v)),
      },
      1.1,
    );
    tl.from(
      q(".exm-check"),
      {
        scale: 0.6,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.3,
        ease: "back.out(2)",
      },
      1.8,
    );
    tl.from(q(".exm-paid"), { autoAlpha: 0, y: 10, duration: 0.45 }, 2.5);
  }, delay);

  return (
    <div className="exm-panel" ref={ref}>
      <div className="exm-head js-in">
        <Icon name="wallet" /> Full &amp; final settlement{" "}
        <em className="exm-tag">Oct 2026</em>
      </div>
      <div className="exm-fnf">
        {FNF_LINES.map((l) => (
          <div
            key={l.label}
            className={`exm-fnf-row ${l.amt < 0 ? "minus" : ""}`}
          >
            <span>{l.label}</span>
            <b>
              {l.amt < 0 ? "− " : "+ "}₹{inr(Math.abs(l.amt))}
            </b>
          </div>
        ))}
        <div className="exm-net">
          <span>Net payable</span>
          <b>
            ₹<span ref={netRef}>0</span>
          </b>
        </div>
      </div>
      <div className="exm-checks">
        {CHECKS.map((c) => (
          <span key={c} className="exm-check">
            <Icon name="check" size={10} /> {c}
          </span>
        ))}
      </div>
      <div className="exm-paid">
        <span className="exm-paid-ic">
          <Icon name="send" size={13} />
        </span>
        <div>
          <b>Paid to bank in 2 working days</b>
          <small>Relieving &amp; experience letters sent</small>
        </div>
      </div>
    </div>
  );
}

const PANELS = [ResignationPanel, NoticePanel, InterviewPanel, FnfPanel];

/* ------------------------------------------------------------------ */
/* Exit desk app (left side)                                           */
/* ------------------------------------------------------------------ */

const P_R = 30;
const P_C = 2 * Math.PI * P_R;

function ExitApp({ frameRef, stage, onSelect }) {
  const panelWrap = useRef(null);
  const tabsRef = useRef(null);
  const ringRef = useRef(null);
  const pctRef = useRef(null);
  const pipeRef = useRef(null);
  const prog = useRef({ v: 0 });
  const first = useRef(true);
  const startDelay = first.current ? 1.3 : 0.2;

  // Exit progress ring + stepper line
  useEffect(() => {
    const isFirst = first.current;
    const target = PROGRESS[stage];
    const tw = gsap.to(prog.current, {
      v: target,
      duration: prefersReduced() ? 0 : 1,
      delay: isFirst ? 1 : 0.15,
      ease: "power3.out",
      onUpdate: () => {
        const v = prog.current.v;
        if (pctRef.current) pctRef.current.textContent = Math.round(v);
        if (ringRef.current)
          ringRef.current.style.strokeDashoffset = P_C * (1 - v / 100);
      },
    });
    const tw2 = gsap.to(pipeRef.current, {
      scaleX: stage / (FEATURES.length - 1),
      duration: prefersReduced() ? 0 : 0.8,
      delay: isFirst ? 1 : 0.1,
      ease: "power3.inOut",
    });
    return () => {
      tw.kill();
      tw2.kill();
    };
  }, [stage]);

  // Mobile: when the listed feature changes, slide the step row so the active step is fully visible
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return undefined;
    const btn = strip.querySelectorAll("button")[stage];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined; // all steps fit: nothing to do
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
    <div className="exm-frame" ref={frameRef}>
      <div className="exm-chrome">
        <span className="exm-dot r" />
        <span className="exm-dot y" />
        <span className="exm-dot g" />
        <div className="exm-url">
          <span aria-hidden>🔒</span> app.ngriffinpay.in/exit-management
        </div>
      </div>

      <div className="exm-app">
        <aside className="exm-side js-side">
          <div className="exm-emp">
            <span className="exm-av">PS</span>
            <div>
              <b>Priya S.</b>
              <small>Product Designer · 3.4 yrs</small>
            </div>
          </div>

          <div className="exm-prog">
            <svg viewBox="0 0 80 80" aria-hidden>
              <circle cx="40" cy="40" r={P_R} className="exm-prog-bg" />
              <circle
                ref={ringRef}
                cx="40"
                cy="40"
                r={P_R}
                className="exm-prog-fill"
                strokeDasharray={P_C}
                strokeDashoffset={P_C}
              />
            </svg>
            <div className="exm-prog-txt">
              <b>
                <span ref={pctRef}>0</span>%
              </b>
              <small>Exit done</small>
            </div>
          </div>

          <div className="exm-clear">
            <small className="exm-side-lbl">Clearance</small>
            {CLEARANCE.map((c, i) => (
              <div
                key={c.label}
                className={`exm-clear-item ${i <= stage ? "is-done" : ""}`}
              >
                <span className="exm-clear-ic">
                  {i <= stage ? (
                    <Icon name="check" size={10} />
                  ) : (
                    <Icon name={c.icon} size={10} />
                  )}
                </span>
                {c.label}
              </div>
            ))}
          </div>
        </aside>

        <div className="exm-main">
          <div
            className="exm-steps js-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Exit stages"
          >
            <span className="exm-pipe" aria-hidden>
              <i ref={pipeRef} />
            </span>
            {FEATURES.map((f, i) => (
              <button
                type="button"
                key={f.title}
                className={`${stage === i ? "is-on" : ""} ${i < stage ? "is-past" : ""}`}
                onClick={() => onSelect(i)}
                role="tab"
                aria-selected={stage === i}
              >
                <span className="exm-step-dot">
                  {i < stage ? <Icon name="check" size={11} /> : i + 1}
                </span>
                <span className="exm-step-lbl">{f.short}</span>
              </button>
            ))}
          </div>
          <div className="exm-panel-wrap" ref={panelWrap}>
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
      tl.from(q(".js-side"), { x: -18, opacity: 0, duration: 0.5 }, 0.6);
      tl.from(
        q(".exm-clear-item"),
        { x: -10, opacity: 0, stagger: 0.07, duration: 0.35 },
        0.8,
      );
      tl.from(
        q(".js-tabs button"),
        { y: -10, opacity: 0, stagger: 0.08, duration: 0.4 },
        0.7,
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
      className="exm-hero"
      ref={sectionRef}
      aria-labelledby="exm-hero-title"
    >
      <div className="exm-hero-bg" aria-hidden>
        <span className="exm-blob b1 js-blob" />
        <span className="exm-blob b2 js-blob" />
        <span className="exm-grid-bg" />
      </div>

      <div className="exm-container exm-hero-grid">
        {/* RIGHT: content (first in DOM for SEO) */}
        <div className="exm-content">
          <span className="exm-eyebrow js-reveal">
            <span className="exm-live-dot" /> Exit Management Made Easy
          </span>
          <h1 id="exm-hero-title" className="exm-title js-reveal">
            Employee <span className="exm-grad">Exit Management</span>
          </h1>

          <ul
            className="exm-feats"
            role="tablist"
            aria-label="Exit management features"
          >
            {FEATURES.map((f, i) => (
              <li key={f.title} className="js-reveal">
                <button
                  type="button"
                  role="tab"
                  aria-selected={stage === i}
                  className={`exm-feat ${stage === i ? "is-active" : ""}`}
                  onClick={() => setStage(i)}
                >
                  <span className="exm-feat-ic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span className="exm-feat-txt">
                    <b>{f.title}</b>
                    <span>{f.desc}</span>
                  </span>
                  <span className="exm-feat-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* LEFT: exit desk app */}
        <div className="exm-visual" ref={visualRef}>
          <ExitApp frameRef={frameRef} stage={stage} onSelect={setStage} />
          <div className="exm-float f1 js-float">
            <span className="exm-float-ic ok">
              <Icon name="laptop" size={14} />
            </span>
            <div>
              <strong>Laptop &amp; ID returned</strong>
              <small>IT clearance done</small>
            </div>
          </div>
          <div className="exm-float f2 js-float">
            <span className="exm-float-ic pr">
              <Icon name="shield" size={14} />
            </span>
            <div>
              <strong>FNF compliance checked</strong>
              <small>TDS, PF &amp; gratuity rules</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — Exit Terminal (departure board + boarding pass)          */
/* ------------------------------------------------------------------ */

const TERMINAL_HEADING = [
  ["Streamline", true],
  ["employee"],
  ["offboarding,"],
  ["ensure", true],
  ["compliance,"],
  ["and", true],
  ["settle"],
  ["dues"],
  ["efficiently"],
];

const TERMINAL_TABS = [
  {
    code: "EX-01",
    label: "Smooth Clearance Process",
    icon: "shield",
    title: [["Smooth", true], [" clearance process"]],
    desc: "Coordinate all clearance tasks with HR, Finance, and IT, ensuring no step is missed.",
  },
  {
    code: "EX-02",
    label: "Automated Full & Final Settlement",
    icon: "wallet",
    title: [["Automated", true], [" full & final settlement"]],
    desc: "Accurately calculate pending salaries, leave encashment, and other dues instantly.",
  },
  {
    code: "EX-03",
    label: "Multi-Department Approvals",
    icon: "users",
    title: [["Multi-department", true], [" approvals"]],
    desc: "Enable real-time clearance updates from multiple departments for faster processing.",
  },
  {
    code: "EX-04",
    label: "Exit Interviews & Feedback",
    icon: "chat",
    title: [["Exit interviews", true], [" & feedback collection"]],
    desc: "Record valuable insights to improve retention and reduce future attrition.",
  },
  {
    code: "EX-05",
    label: "Compliance & Document Generation",
    icon: "file",
    title: [["Compliance", true], [" & document generation"]],
    desc: "Automatically generate relieving letters, experience certificates, and compliance reports.",
  },
];

const TERMINAL_TIME = 6; // seconds per tab
const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Split-flap text: letters spin through random characters, then land on the new word
function Flap({ text, len, className = "" }) {
  const ref = useRef(null);
  const prev = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const target = text.toUpperCase().padEnd(len, " ").slice(0, len);
    const spans = el.children;
    const from = prev.current;
    prev.current = target;
    if (from === null || prefersReduced()) {
      for (let i = 0; i < len; i += 1) spans[i].textContent = target[i];
      return undefined;
    }
    const tweens = [];
    for (let i = 0; i < len; i += 1) {
      if (from[i] === target[i]) continue;
      const s = spans[i];
      const st = { n: 0 };
      tweens.push(
        gsap.to(st, {
          n: 1,
          duration: 0.35 + i * 0.05,
          ease: "none",
          onUpdate: () => {
            s.textContent =
              FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
          },
          onComplete: () => {
            s.textContent = target[i];
          },
        }),
      );
      tweens.push(
        gsap.fromTo(
          s,
          { rotationX: -70 },
          { rotationX: 0, duration: 0.18, repeat: 2, ease: "none" },
        ),
      );
    }
    return () => {
      tweens.forEach((t) => t.kill());
      for (let i = 0; i < len; i += 1) {
        spans[i].textContent = target[i];
        spans[i].style.transform = "";
      }
    };
  }, [text, len]);
  return (
    <span className={`ex2-flap ${className}`} ref={ref} aria-label={text}>
      {Array.from({ length: len }, (_, i) => (
        <span key={i} className="ex2-ch" aria-hidden />
      ))}
    </span>
  );
}

function useScene(build) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ delay: 0.2 });
      build(tl, q);
      if (prefersReduced()) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// 1 — clearance desks stamped one by one
const DESKS = [
  { dept: "HR", task: "Handover & documents", icon: "users" },
  { dept: "Finance", task: "No dues confirmed", icon: "wallet" },
  { dept: "IT", task: "Laptop & ID card returned", icon: "laptop" },
];
function SceneClearance() {
  const countRef = useRef(null);
  const ref = useScene((tl, q) => {
    tl.from(q(".ex2-desk"), {
      x: -16,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 0.35,
    });
    q(".ex2-stamp").forEach((el, i) => {
      tl.from(
        el,
        {
          scale: 2.4,
          rotation: -25,
          autoAlpha: 0,
          duration: 0.35,
          ease: "back.out(2.2)",
        },
        0.6 + i * 0.45,
      );
      tl.call(
        () => countRef.current && (countRef.current.textContent = i + 1),
        null,
        0.75 + i * 0.45,
      );
    });
    tl.from(q(".ex2-allclear"), { autoAlpha: 0, y: 8, duration: 0.35 }, 2.1);
  });
  return (
    <div className="ex2-scene" ref={ref}>
      {DESKS.map((d) => (
        <div key={d.dept} className="ex2-desk">
          <span className="ex2-desk-ic">
            <Icon name={d.icon} size={13} />
          </span>
          <div>
            <b>{d.dept}</b>
            <small>{d.task}</small>
          </div>
          <span className="ex2-stamp">
            <Icon name="check" size={10} /> Cleared
          </span>
        </div>
      ))}
      <div className="ex2-allclear">
        <span>
          <b ref={countRef}>0</b>/3 desks cleared
        </span>
        <em>No step missed</em>
      </div>
    </div>
  );
}

// 2 — full & final dues calculated instantly
const DUES = [
  { label: "Salary · 18 days", amt: 54000 },
  { label: "Leave encashment", amt: 36000 },
  { label: "Bonus & other dues", amt: 25000 },
  { label: "Deductions", amt: -15000 },
];
function SceneSettlement() {
  const totalRef = useRef(null);
  const ref = useScene((tl, q) => {
    tl.from(q(".ex2-due"), {
      autoAlpha: 0,
      y: 10,
      stagger: 0.12,
      duration: 0.3,
    });
    tl.from(
      q(".ex2-due-bar i"),
      { scaleX: 0, stagger: 0.12, duration: 0.5, ease: "power3.out" },
      0.1,
    );
    const st = { v: 0 };
    tl.to(
      st,
      {
        v: 100000,
        duration: 1,
        ease: "power2.out",
        onUpdate: () =>
          totalRef.current && (totalRef.current.textContent = inr(st.v)),
      },
      0.7,
    );
    tl.from(q(".ex2-speed"), { autoAlpha: 0, x: 10, duration: 0.3 }, 1.5);
  });
  return (
    <div className="ex2-scene" ref={ref}>
      {DUES.map((d) => (
        <div key={d.label} className={`ex2-due ${d.amt < 0 ? "minus" : ""}`}>
          <span>{d.label}</span>
          <span className="ex2-due-bar">
            <i style={{ width: `${(Math.abs(d.amt) / 54000) * 100}%` }} />
          </span>
          <b>
            {d.amt < 0 ? "−" : "+"}₹{inr(Math.abs(d.amt))}
          </b>
        </div>
      ))}
      <div className="ex2-total">
        <span>Final settlement</span>
        <b>
          ₹<span ref={totalRef}>0</span>
        </b>
        <em className="ex2-speed">
          <Icon name="clock" size={10} /> Calculated instantly
        </em>
      </div>
    </div>
  );
}

// 3 — departments post real-time clearance updates
const UPDATES = [
  { dept: "IT", note: "Assets verified", time: "10:02", tone: "a" },
  { dept: "FIN", note: "No dues pending", time: "10:05", tone: "b" },
  { dept: "ADM", note: "Access card revoked", time: "10:07", tone: "c" },
  { dept: "HR", note: "Final approval given", time: "10:12", tone: "d" },
];
function SceneApprovals() {
  const ref = useScene((tl, q) => {
    tl.from(q(".ex2-upd"), {
      autoAlpha: 0,
      y: 16,
      scale: 0.96,
      stagger: 0.38,
      duration: 0.35,
      ease: "back.out(1.6)",
    });
    tl.from(
      q(".ex2-fast i"),
      { scaleX: 0, duration: 0.7, ease: "power3.out" },
      1.4,
    );
  });
  return (
    <div className="ex2-scene" ref={ref}>
      <div className="ex2-feed-head">
        <span className="ex2-live">
          <i /> Live
        </span>{" "}
        Clearance updates
      </div>
      {UPDATES.map((u) => (
        <div key={u.dept} className="ex2-upd">
          <span className={`ex2-dept ${u.tone}`}>{u.dept}</span>
          <b>{u.note}</b>
          <small>{u.time}</small>
          <span className="ex2-ok">
            <Icon name="check" size={10} />
          </span>
        </div>
      ))}
      <div className="ex2-fast">
        <span>Processing time</span>
        <span className="ex2-fast-bar">
          <i />
        </span>
        <b>2 days</b>
      </div>
    </div>
  );
}

// 4 — exit interview insights
const REASONS = [
  { label: "Career growth", v: 38 },
  { label: "Compensation", v: 27 },
  { label: "Relocation", v: 19 },
  { label: "Work-life balance", v: 16 },
];
function SceneInterview() {
  const ref = useScene((tl, q) => {
    tl.from(q(".ex2-quote"), { autoAlpha: 0, y: 10, duration: 0.35 });
    tl.from(
      q(".ex2-stars svg"),
      { scale: 0, stagger: 0.08, duration: 0.25, ease: "back.out(3)" },
      0.3,
    );
    q(".ex2-reason i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: REASONS[i].v / 40, duration: 0.6, ease: "power3.out" },
        0.8 + i * 0.1,
      ),
    );
  });
  return (
    <div className="ex2-scene" ref={ref}>
      <div className="ex2-quote">
        <p>“Great team — I'd love to come back someday.”</p>
        <span className="ex2-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="star" size={12} />
          ))}
        </span>
      </div>
      <small className="ex2-sub">Top exit reasons · this quarter</small>
      {REASONS.map((r) => (
        <div key={r.label} className="ex2-reason">
          <span>{r.label}</span>
          <span className="ex2-reason-bar">
            <i />
          </span>
          <b>{r.v}%</b>
        </div>
      ))}
    </div>
  );
}

// 5 — documents generated automatically
const DOCS = [
  { name: "Relieving letter", meta: "PDF · signed" },
  { name: "Experience certificate", meta: "PDF · signed" },
  { name: "Compliance report", meta: "PF · TDS · gratuity" },
];
function SceneDocs() {
  const ref = useScene((tl, q) => {
    tl.from(q(".ex2-doc"), {
      autoAlpha: 0,
      y: 14,
      rotation: -2,
      stagger: 0.12,
      duration: 0.35,
    });
    q(".ex2-doc-bar i").forEach((el, i) =>
      tl.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "power1.inOut" },
        0.5 + i * 0.35,
      ),
    );
    q(".ex2-ready").forEach((el, i) =>
      tl.from(
        el,
        { scale: 0, autoAlpha: 0, duration: 0.3, ease: "back.out(2.4)" },
        1.1 + i * 0.35,
      ),
    );
    tl.from(q(".ex2-sent"), { autoAlpha: 0, y: 8, duration: 0.35 }, 2.1);
  });
  return (
    <div className="ex2-scene" ref={ref}>
      {DOCS.map((d) => (
        <div key={d.name} className="ex2-doc">
          <span className="ex2-doc-ic">
            <Icon name="file" size={14} />
          </span>
          <div className="ex2-doc-txt">
            <b>{d.name}</b>
            <small>{d.meta}</small>
            <span className="ex2-doc-bar">
              <i />
            </span>
          </div>
          <span className="ex2-ready">
            <Icon name="check" size={10} /> Ready
          </span>
        </div>
      ))}
      <div className="ex2-sent">
        <Icon name="send" size={12} /> Emailed to Priya &amp; saved to her
        records
      </div>
    </div>
  );
}

const TERMINAL_SCENES = [
  SceneClearance,
  SceneSettlement,
  SceneApprovals,
  SceneInterview,
  SceneDocs,
];

function ExitTerminalSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const boardRef = useRef(null);
  const passRef = useRef(null);
  const planeRef = useRef(null);
  const barRefs = useRef([]);
  const firstChange = useRef(true);

  const go = (i) =>
    setActive((i + TERMINAL_TABS.length) % TERMINAL_TABS.length);

  // Title reveal + start autoplay only when the section is on screen
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });
      if (prefersReduced()) return;
      gsap.from(q(".ex2-hw > span"), {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
      gsap.from([q(".ex2-board"), q(".ex2-pass-wrap")], {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Autoplay with progress bar on the active board row
  useEffect(() => {
    barRefs.current.forEach((b) => b && gsap.set(b, { scaleX: 0 }));
    if (!inView || paused || prefersReduced()) return undefined;
    const bar = barRefs.current[active];
    const tw = bar
      ? gsap.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: TERMINAL_TIME, ease: "none" },
        )
      : null;
    const next = gsap.delayedCall(TERMINAL_TIME, () => go(active + 1));
    return () => {
      tw?.kill();
      next.kill();
    };
  }, [active, paused, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Plane moves along the exit route to the active stop
  useEffect(() => {
    const tw = gsap.to(planeRef.current, {
      left: `${(active / (TERMINAL_TABS.length - 1)) * 100}%`,
      duration: prefersReduced() ? 0 : 0.9,
      ease: "power3.inOut",
    });
    return () => tw.kill();
  }, [active]);

  // Boarding pass re-prints on every change
  useLayoutEffect(() => {
    if (firstChange.current) {
      firstChange.current = false;
      return;
    }
    if (prefersReduced() || !passRef.current) return;
    gsap.fromTo(
      passRef.current,
      { y: 26, rotation: 1.5, autoAlpha: 0 },
      { y: 0, rotation: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
    );
    gsap.fromTo(
      passRef.current.querySelectorAll(".ex2-tw > span"),
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.1,
      },
    );
  }, [active]);

  // Mobile: when the listed service changes, slide the board/tab row so the active one is fully visible
  useEffect(() => {
    const strip = boardRef.current;
    if (!strip) return undefined;
    const btn = strip.children[active];
    if (!btn || strip.scrollWidth <= strip.clientWidth + 1) return undefined; // desktop: rows stacked, nothing to scroll
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

  const tab = TERMINAL_TABS[active];
  const Scene = TERMINAL_SCENES[active];
  const statusOf = (i) =>
    i < active ? "Cleared" : i === active ? "Boarding" : "On time";

  return (
    <section
      className="ex2"
      ref={sectionRef}
      aria-labelledby="ex2-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="exm-container">
        <h2 id="ex2-title" className="ex2-title">
          {TERMINAL_HEADING.map(([w, hl], i) => (
            <span key={i} className="ex2-hw">
              <span className={hl ? "hl" : ""}>{w}</span>
            </span>
          ))}
        </h2>

        <div className="ex2-grid">
          {/* LEFT: departure board — every row is a tab */}
          <div className="ex2-board">
            <div className="ex2-board-head">
              <span>
                <Icon name="door" size={14} /> Departures · Exit Terminal
              </span>
              <em>IST 10:12</em>
            </div>
            <div className="ex2-cols" aria-hidden>
              <span>Code</span>
              <span>Process</span>
              <span>Status</span>
            </div>

            <div
              className="ex2-rows"
              ref={boardRef}
              role="tablist"
              aria-label="Exit management services"
            >
              {TERMINAL_TABS.map((t, i) => (
                <button
                  type="button"
                  key={t.code}
                  role="tab"
                  aria-selected={active === i}
                  className={`ex2-row ${active === i ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <Flap text={t.code} len={5} className="code" />
                  <span className="ex2-proc">
                    <span className="ex2-proc-ic">
                      <Icon name={t.icon} size={14} />
                    </span>
                    <span className="ex2-proc-txt">{t.label}</span>
                  </span>
                  <Flap text={statusOf(i)} len={8} className="status" />
                  <span className="ex2-row-bar">
                    <i ref={(el) => (barRefs.current[i] = el)} />
                  </span>
                </button>
              ))}
            </div>

            <div className="ex2-route" aria-hidden>
              <span className="ex2-route-line" />
              {TERMINAL_TABS.map((t, i) => (
                <span
                  key={t.code}
                  className={`ex2-stop ${i <= active ? "on" : ""}`}
                  style={{ left: `${(i / (TERMINAL_TABS.length - 1)) * 100}%` }}
                />
              ))}
              <span className="ex2-plane" ref={planeRef}>
                <Icon name="plane" size={16} />
              </span>
            </div>
          </div>

          {/* RIGHT: boarding pass for the active service */}
          <div className="ex2-pass-wrap">
            <div
              className="ex2-pass"
              ref={passRef}
              role="tabpanel"
              aria-live="polite"
            >
              <div className="ex2-pass-main">
                <div className="ex2-pass-top">
                  <span className="ex2-brand">NGriffinpay · Exit Pass</span>
                  <span className="ex2-pax">
                    <small>Passenger</small>
                    <b>Priya S.</b>
                  </span>
                  <span className="ex2-pax">
                    <small>Flight</small>
                    <b>{tab.code}</b>
                  </span>
                </div>
                <div className="ex2-pass-body">
                  <div className="ex2-copy">
                    <span className="ex2-step">
                      {String(active + 1).padStart(2, "0")} /{" "}
                      {String(TERMINAL_TABS.length).padStart(2, "0")} ·{" "}
                      {tab.label}
                    </span>
                    <h3 key={`t${active}`}>
                      {tab.title
                        .flatMap(([t, hl]) =>
                          t
                            .trim()
                            .split(" ")
                            .map((w) => [w, hl]),
                        )
                        .map(([w, hl], i) => (
                          <span key={i} className="ex2-tw">
                            <span className={hl ? "hl" : ""}>{w}</span>
                          </span>
                        ))}
                    </h3>
                    <p key={`d${active}`}>{tab.desc}</p>
                  </div>
                  <Scene key={active} />
                </div>
              </div>
              <div className="ex2-stub" aria-hidden>
                <span>
                  <small>Gate</small>
                  <b>G{active + 1}</b>
                </span>
                <span>
                  <small>Seq</small>
                  <b>{String(active + 1).padStart(2, "0")}/05</b>
                </span>
                <span className="ex2-barcode" />
              </div>
            </div>

            <div className="ex2-actions">
              <a href="/contact" className="exm-btn primary">
                Get Started with NGriffinpay <Icon name="arrow" size={16} />
              </a>
              <div className="ex2-nav">
                <button
                  type="button"
                  aria-label="Previous service"
                  onClick={() => go(active - 1)}
                >
                  <span className="ex2-flip">
                    <Icon name="arrow" size={16} />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Next service"
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
    q: "What is the Employee Exit Management feature in NGriffinpay?",
    a: "NGriffinpay’s Employee Exit Management module streamlines the entire offboarding process, ensuring smooth clearance, proper documentation, and compliance with company policies.",
    keys: [
      "what is",
      "about",
      "overview",
      "explain",
      "feature",
      "module",
      "exit management",
      "offboarding",
      "offboard",
    ],
  },
  {
    q: "Does it handle full & final settlements?",
    a: "Yes. The system automates the calculation of final payments, including pending salaries, leave encashment, and other dues, ensuring accurate and timely settlements.",
    keys: [
      "full",
      "final",
      "fnf",
      "f&f",
      "settlement",
      "settle",
      "dues",
      "salary",
      "encashment",
      "payment",
      "gratuity",
    ],
  },
  {
    q: "Can I manage clearance from multiple departments?",
    a: "Absolutely. The platform supports a multi-level clearance workflow, allowing HR, IT, Finance, and other departments to update clearance status in real-time.",
    keys: [
      "clearance",
      "department",
      "multi",
      "approval",
      "approve",
      "finance",
      "no dues",
      "asset",
      "workflow",
    ],
  },
  {
    q: "Is there an option for exit interviews?",
    a: "Yes. You can schedule, record, and store exit interviews directly in the system to gather feedback and improve retention strategies.",
    keys: [
      "interview",
      "feedback",
      "survey",
      "reason",
      "retention",
      "attrition",
      "churn",
    ],
  },
  {
    q: "Does the system generate compliance documents?",
    a: "Yes, NGriffinpay automatically generates experience letters, relieving letters, and compliance reports, reducing manual effort and error risk.",
    keys: [
      "document",
      "letter",
      "relieving",
      "experience",
      "certificate",
      "compliance",
      "report",
      "generate",
    ],
  },
];

const FAQ_GREETING =
  "Hi there! 👋 I'm the NGriffinpay assistant. Pick a question or type your own about employee exits.";
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
      <div className="exq-row bot" ref={ref}>
        <span className="exq-bot-av" aria-hidden>
          N
        </span>
        <div
          className="exq-bubble bot exq-typing"
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
      <div className="exq-row user" ref={ref}>
        <div className="exq-bubble user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="exq-row bot" ref={ref}>
      <span className="exq-bot-av" aria-hidden>
        N
      </span>
      <div className="exq-bubble bot">
        <p>
          <TypedText
            text={msg.text}
            animate={msg.animate}
            onTick={onTick}
            onDone={onDone}
          />
        </p>
        {msg.cta && (
          <a href={msg.cta.href} className="exq-bubble-cta">
            {msg.cta.label} <Icon name="arrow" size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function ExitFaqSection() {
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
      gsap.from(q(".exq-chat"), {
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
    <section className="exq" ref={sectionRef} aria-labelledby="exq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="exm-container exq-grid">
        <div className="exq-left">
          <span className="exq-eyebrow js-faq-reveal">FAQs</span>
          <h2 id="exq-title" className="exq-title js-faq-reveal">
            Employee Exit Management – <span className="exm-grad">FAQs</span>
          </h2>
          <p className="exq-lead js-faq-reveal">
            Tap a question — or type your own — and get an instant answer.
          </p>

          <ul className="exq-list">
            {FAQS.map((f, i) => (
              <li key={f.q} className="js-faq-reveal">
                <button
                  type="button"
                  className={`exq-q ${asked.includes(i) ? "is-asked" : ""}`}
                  onClick={() => ask(f.q, i)}
                  disabled={busy}
                >
                  <span className="exq-q-num">
                    {asked.includes(i) ? (
                      <Icon name="check" size={13} />
                    ) : (
                      `0${i + 1}`
                    )}
                  </span>
                  <span className="exq-q-text">{f.q}</span>
                  <span className="exq-q-go">
                    <Icon name="arrow" size={15} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="exq-chat">
          <div className="exq-chat-head">
            <span className="exq-head-av">
              N<i />
            </span>
            <div>
              <strong>NGriffinpay Assistant</strong>
              <small>{busy ? "typing…" : "Online · replies instantly"}</small>
            </div>
            <button
              type="button"
              className="exq-reset"
              onClick={reset}
              aria-label="Clear chat"
            >
              Clear chat
            </button>
          </div>

          <div
            className="exq-body"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="exq-day">Today</div>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                msg={m}
                onTick={() => scrollBottom(false)}
                onDone={m.from === "bot" && m.id !== 0 ? onBotDone : undefined}
              />
            ))}
          </div>

          <div className="exq-suggest" aria-label="Suggested questions">
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

          <form className="exq-input" onSubmit={submit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about clearance, FNF or letters…"
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

export default function EmployeeExit() {
  return (
    <div className="exm-page">
      <HeroSection />
      <span id="exm-next" />
      <ExitTerminalSection />
      <ExitFaqSection />
    </div>
  );
}
