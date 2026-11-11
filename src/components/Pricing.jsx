// Pricing.jsx
// NGriffinPay  — Pricing / Packages inner page
// Section 1: "Plan Stack" — every plan is a tower of HR modules. Switch plan and the
//            blocks drop in (GSAP), the price counts up, click any block to see its features.
// Section 2: "Compare every module" — module × plan matrix, expand a row to see features.
// Enquiry modal — same fields as the old HTML (package, name, email, mobile).
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Pricing.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content (from the existing packages page)                          */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    name: "Starter Plan",
    short: "Starter",
    price: 2999,
    note: "Upto 50 Employees",
    tag: "For startups",
    desc: "Perfect for startups—streamline payroll, automate attendance tracking, simplify onboarding, and stay compliant with ease.",
  },
  {
    name: "Professional Plan",
    short: "Professional",
    price: 3999,
    note: "Upto 50 Employees",
    tag: "Most popular",
    desc: "Power up your growing business with advanced HR tools for seamless workforce management and compliance.",
  },
  {
    name: "Premium Plan",
    short: "Premium",
    price: 6999,
    note: "Upto 50 Employees",
    tag: "Everything included",
    desc: "Unlock enterprise-grade HR features with expert support for strategic growth and workforce excellence.",
  },
];

// `from` = the first plan that includes the module (0 Starter, 1 Professional, 2 Premium)
const MODULES = [
  {
    name: "Employee Management",
    icon: "users",
    from: 0,
    features: [
      "Mobile App Access for Employees",
      "Real-time Employee Location Tracking",
      "Individual Attendance Monitoring",
      "Employee Information Records",
      "Employee Self Service Portal",
      "Holidays Listings",
      "Calendar Blocking",
      "Complete Event Planner",
    ],
  },
  {
    name: "Attendance Management",
    icon: "clock",
    from: 0,
    features: [
      "Attendance Tracking",
      "Attendance Matrix Setup",
      "Time Sheet Tracking",
      "Fully Functional Attendance Marking",
      "Department Allocation",
      "Time Sheet Matrix Setup",
      "Approval Matrix Setup",
      "Overtime Management",
      "Shift Matrix Setup & Allocations",
    ],
  },
  {
    name: "Leave Management",
    icon: "calendar",
    from: 0,
    features: [
      "Leave Assigning",
      "Leave Setup",
      "Leave Tracking",
      "Leave Approval Setup with Matrix",
      "Leave Reports & Records",
    ],
  },
  {
    name: "Asset & Expense Management",
    icon: "box",
    from: 1,
    features: [
      "Asset Management Setup",
      "Asset Management Matrix",
      "Expenses Handling",
      "Loans Setup with Matrix",
    ],
  },
  {
    name: "Employee Separation Management",
    icon: "door",
    from: 1,
    features: [
      "Employees applying Resignation",
      "Approval Matrix Setup",
      "Notice Period Setup",
      "FNF Processing",
    ],
  },
  {
    name: "Shift Management",
    icon: "repeat",
    from: 1,
    features: [
      "Create & Manage Shifts",
      "Auto Shift Allocation",
      "Shift-wise Attendance Tracking",
      "Shift Change Requests",
    ],
  },
  {
    name: "Employee Documentation",
    icon: "file",
    from: 1,
    features: [
      "Store Employee Documents",
      "Upload & Download Facility",
      "Document Expiry Alerts",
      "Role-based Access Control",
    ],
  },
  {
    name: "Payroll Management",
    icon: "rupee",
    from: 2,
    features: [
      "Payroll Processing",
      "Payroll Reconciliation",
      "Payslips Access & Download",
      "Payroll Reports",
      "Monthly Statutory Reports",
      "Salary Transactions",
      "CTC Appraisal Process",
      "Compliance Management",
      "Income Tax Calculations",
      "Income Tax Computations",
      "PF Calculations",
      "Professional Tax Statewise Setup",
      "Employee State Insurance",
      "Labour Welfare Fund",
      "Shops & Establishments",
    ],
  },
  {
    name: "Expense Management",
    icon: "receipt",
    from: 2,
    features: ["Reimbursements", "Bill Claims", "Travel Bills"],
  },
];

const inPlan = (m, p) => m.from <= p;
const modulesIn = (p) => MODULES.filter((m) => inPlan(m, p));
const featureCount = (p) =>
  modulesIn(p).reduce((n, m) => n + m.features.length, 0);
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// Hook this up to your backend (PHP mail / API). Leave empty to only show the thank-you message.
const ENQUIRY_ENDPOINT = "";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 16 }) {
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
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "box":
      return (
        <svg {...p}>
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </svg>
      );
    case "door":
      return (
        <svg {...p}>
          <path d="M13 4h5a2 2 0 0 1 2 2v14M4 20h16M13 4 6 6v14l7 0z" />
          <path d="M10 12h.01" />
        </svg>
      );
    case "repeat":
      return (
        <svg {...p}>
          <path d="m17 1 4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "rupee":
      return (
        <svg {...p}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...p}>
          <path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2z" />
          <path d="M8 9h8M8 13h6" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "minus":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M6 12h12" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Enquiry modal                                                       */
/* ------------------------------------------------------------------ */

function EnquiryModal({ plan, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done | fail
  const boxRef = useRef(null);

  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    if (!prefersReduced() && boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
      );
    }
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Please enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10)))
      e.phone = "Please enter a valid 10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setState("sending");
    try {
      if (ENQUIRY_ENDPOINT) {
        const body = new FormData();
        body.append("package", plan.name);
        Object.entries(form).forEach(([k, v]) => body.append(k, v));
        const res = await fetch(ENQUIRY_ENDPOINT, { method: "POST", body });
        if (!res.ok) throw new Error("failed");
      }
      setState("done");
    } catch {
      setState("fail");
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div
      className="prc-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prc-modal-title"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="prc-modal-box" ref={boxRef}>
        <button
          type="button"
          className="prc-modal-x"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={18} />
        </button>
        {state === "done" ? (
          <div className="prc-modal-done">
            <span className="prc-done-ic">
              <Icon name="check" size={26} />
            </span>
            <h3>Thank you, {form.name.split(" ")[0]}!</h3>
            <p>
              We've received your enquiry for the <b>{plan.name}</b>. Our team
              will call you shortly.
            </p>
            <button type="button" className="prc-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <span className="prc-eyebrow">Package Enquiry</span>
            <h3 id="prc-modal-title">{plan.name}</h3>
            <p className="prc-modal-sub">
              {inr(plan.price)} / month + GST · {plan.note}
            </p>
            <form onSubmit={submit} noValidate>
              <label className="prc-field">
                <span>Package</span>
                <input type="text" name="package" value={plan.name} disabled />
              </label>
              <label className={`prc-field ${errors.name ? "has-err" : ""}`}>
                <span>Your Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your Name"
                  autoComplete="name"
                />
                {errors.name && <small>{errors.name}</small>}
              </label>
              <label className={`prc-field ${errors.email ? "has-err" : ""}`}>
                <span>Your Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="Your email"
                  autoComplete="email"
                />
                {errors.email && <small>{errors.email}</small>}
              </label>
              <label className={`prc-field ${errors.phone ? "has-err" : ""}`}>
                <span>Mobile Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="Your Mobile Number"
                  autoComplete="tel"
                />
                {errors.phone && <small>{errors.phone}</small>}
              </label>
              {state === "fail" && (
                <p className="prc-form-err">
                  Something went wrong. Please try again.
                </p>
              )}
              <button
                type="submit"
                className="prc-btn wide"
                disabled={state === "sending"}
              >
                {state === "sending" ? "Sending…" : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 1 — Plan Stack                                              */
/* ------------------------------------------------------------------ */

function PlanStack({ onPurchase }) {
  const [plan, setPlan] = useState(1);
  const [mod, setMod] = useState(3);
  const rootRef = useRef(null);
  const towerRef = useRef(null);
  const priceRef = useRef(null);
  const prevPlan = useRef(plan);
  const priceVal = useRef({ v: PLANS[plan].price });

  // entrance
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".prc-hero-head > *", {
        y: 26,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
      })
        .from(".prc-switch", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          ".prc-slab",
          {
            y: -80,
            opacity: 0,
            stagger: { each: 0.07, from: "end" },
            duration: 0.55,
            ease: "bounce.out",
          },
          "-=0.2",
        )
        .from(".prc-plan-card", { x: 40, opacity: 0, duration: 0.6 }, "<0.1")
        .from(".prc-mod-detail", { y: 24, opacity: 0, duration: 0.5 }, "-=0.3");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // switch plan → drop new blocks, ghost the removed ones, count the price
  useEffect(() => {
    const from = prevPlan.current;
    prevPlan.current = plan;
    if (from === plan) return undefined;
    const reduce = prefersReduced();
    const q = gsap.utils.selector(towerRef);
    const added = MODULES.map((m, i) =>
      inPlan(m, plan) && !inPlan(m, from) ? i : -1,
    ).filter((i) => i >= 0);

    if (!reduce) {
      const els = added
        .map((i) => q(`.prc-slab[data-i="${i}"]`)[0])
        .filter(Boolean);
      gsap.fromTo(
        els,
        { y: -70, opacity: 0, rotation: -2 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: "bounce.out",
          stagger: 0.09,
          clearProps: "transform",
        },
      );
      gsap.fromTo(
        q(".prc-tower-base"),
        { scaleX: 0.96 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)",
          delay: added.length ? 0.35 : 0,
        },
      );
    }
    // pick the newest module of the selected plan to show in the detail panel
    const newest = MODULES.map((m, i) => (m.from === plan ? i : -1)).filter(
      (i) => i >= 0,
    );
    setMod((cur) =>
      inPlan(MODULES[cur], plan) && !added.length ? cur : (newest[0] ?? 0),
    );

    const target = PLANS[plan].price;
    if (reduce || !priceRef.current) {
      priceVal.current.v = target;
      if (priceRef.current) priceRef.current.textContent = inr(target);
      return undefined;
    }
    const tw = gsap.to(priceVal.current, {
      v: target,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        if (priceRef.current)
          priceRef.current.textContent = inr(priceVal.current.v);
      },
    });
    if (!reduce)
      gsap.fromTo(
        ".prc-plan-card .prc-pc-body > *",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.35 },
      );
    return () => tw.kill();
  }, [plan]);

  // detail panel list
  useEffect(() => {
    if (prefersReduced() || !rootRef.current) return;
    const items = rootRef.current.querySelectorAll(".prc-mod-detail li");
    gsap.fromTo(
      items,
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.03, duration: 0.3, ease: "power2.out" },
    );
  }, [mod, plan]);

  const P = PLANS[plan];
  const m = MODULES[mod];
  const mIncluded = inPlan(m, plan);

  return (
    <section className="prc-hero" ref={rootRef}>
      <div className="prc-hero-bg" aria-hidden>
        <span className="prc-blob b1" />
        <span className="prc-blob b2" />
        <span className="prc-grid-bg" />
      </div>
      <div className="prc-container">
        <div className="prc-hero-head">
          <span className="prc-eyebrow">
            <Icon name="spark" size={13} /> Packages
          </span>
          <h1>
            Build your HR stack. <span>Pay only for what you use.</span>
          </h1>
        </div>

        <div
          className="prc-switch"
          role="tablist"
          aria-label="Choose a plan"
          style={{ "--i": plan }}
        >
          <span className="prc-switch-pill" aria-hidden />
          {PLANS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="tab"
              aria-selected={plan === i}
              className={`prc-switch-btn ${plan === i ? "is-on" : ""}`}
              onClick={() => setPlan(i)}
            >
              {p.short}
              {i === 1 && <em>Popular</em>}
            </button>
          ))}
        </div>

        <div className="prc-stage">
          {/* Tower */}
          <div className="prc-tower-card">
            <div className="prc-tower-top">
              <span>
                <b>{modulesIn(plan).length}</b> of {MODULES.length} modules
              </span>
              <span>
                <b>{featureCount(plan)}</b> features
              </span>
            </div>
            <div className="prc-tower" ref={towerRef}>
              {MODULES.map((x, i) => ({ x, i }))
                .reverse()
                .map(({ x, i }) => {
                  const on = inPlan(x, plan);
                  return (
                    <button
                      key={x.name}
                      type="button"
                      data-i={i}
                      className={`prc-slab tier-${x.from} ${on ? "is-on" : "is-off"} ${mod === i ? "is-sel" : ""}`}
                      onClick={() => setMod(i)}
                      style={{ "--k": i }}
                      aria-pressed={mod === i}
                    >
                      <span className="prc-slab-ic">
                        <Icon name={on ? x.icon : "lock"} size={15} />
                      </span>
                      <span className="prc-slab-name">{x.name}</span>
                      <span className="prc-slab-meta">
                        {on ? (
                          <>
                            <b>{x.features.length}</b>
                            <i> features</i>
                          </>
                        ) : (
                          `in ${PLANS[x.from].short}`
                        )}
                      </span>
                    </button>
                  );
                })}
              <div className="prc-tower-base">
                <span>NGriffinPay HRMS · {P.short}</span>
              </div>
            </div>
          </div>

          {/* Plan card + module detail */}
          <div className="prc-side">
            <div className={`prc-plan-card p-${plan}`}>
              <div className="prc-pc-body">
                <div className="prc-pc-top">
                  <h2>{P.name}</h2>
                  <span className="prc-pc-tag">{P.tag}</span>
                </div>
                <p className="prc-pc-desc">{P.desc}</p>
                <div className="prc-pc-price">
                  <strong ref={priceRef}>{inr(P.price)}</strong>
                  <span>
                    / month
                    <br />+ GST
                  </span>
                </div>
                <div className="prc-pc-note">
                  <Icon name="users" size={14} /> {P.note}
                </div>
                <button
                  type="button"
                  className="prc-btn wide"
                  onClick={() => onPurchase(plan)}
                >
                  Purchase {P.short} <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>

            <div className={`prc-mod-detail ${mIncluded ? "" : "is-locked"}`}>
              <div className="prc-md-head">
                <span className={`prc-md-ic tier-${m.from}`}>
                  <Icon name={m.icon} size={18} />
                </span>
                <div>
                  <h3>{m.name}</h3>
                  <p>
                    {mIncluded
                      ? `Included in ${P.short} · ${m.features.length} features`
                      : `Unlock with ${PLANS[m.from].name}`}
                  </p>
                </div>
              </div>
              <ul>
                {m.features.map((f) => (
                  <li key={f}>
                    <span className="prc-tick">
                      <Icon name={mIncluded ? "check" : "lock"} size={11} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              {!mIncluded && (
                <button
                  type="button"
                  className="prc-btn ghost"
                  onClick={() => setPlan(m.from)}
                >
                  Switch to {PLANS[m.from].short}{" "}
                  <Icon name="arrow" size={15} />
                </button>
              )}
              <div className="prc-md-foot">
                <div className="prc-md-meter">
                  <span>
                    {P.short} covers <b>{featureCount(plan)}</b> of{" "}
                    {featureCount(2)} features
                  </span>
                  <span>
                    {Math.round((featureCount(plan) / featureCount(2)) * 100)}%
                  </span>
                </div>
                <div className="prc-md-bar">
                  <i
                    style={{
                      width: `${(featureCount(plan) / featureCount(2)) * 100}%`,
                    }}
                  />
                </div>
                <div className="prc-md-chips">
                  {MODULES.map((x, i) => (
                    <button
                      key={x.name}
                      type="button"
                      className={`prc-chip ${inPlan(x, plan) ? "is-on" : ""} ${mod === i ? "is-sel" : ""}`}
                      onClick={() => setMod(i)}
                      title={x.name}
                    >
                      <Icon name={x.icon} size={14} />
                    </button>
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
/* Section 2 — Compare matrix                                          */
/* ------------------------------------------------------------------ */

function CompareMatrix({ onPurchase }) {
  const [open, setOpen] = useState(-1);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".prc-cmp-head > *", {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
      gsap.from(".prc-cmp-col", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".prc-cmp-table", start: "top 80%" },
      });
      gsap.from(".prc-cmp-row", {
        x: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: { trigger: ".prc-cmp-table", start: "top 75%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const toggle = (i) => setOpen((o) => (o === i ? -1 : i));

  return (
    <section className="prc-cmp" ref={rootRef}>
      <div className="prc-container">
        <div className="prc-cmp-head">
          <span className="prc-eyebrow">Compare plans</span>
          <h2>Every module, side by side</h2>
          <p>
            Each plan includes everything in the plan before it. Tap a module to
            see what's inside.
          </p>
        </div>

        <div
          className="prc-cmp-table"
          role="table"
          aria-label="Plan comparison"
        >
          <div className="prc-cmp-cols" role="row">
            <div className="prc-cmp-corner" role="columnheader">
              <b>{MODULES.length} modules</b>
              <span>{featureCount(2)} features in total</span>
            </div>
            {PLANS.map((p, i) => (
              <div
                key={p.name}
                className={`prc-cmp-col ${i === 1 ? "is-pop" : ""}`}
                role="columnheader"
              >
                {i === 1 && <em>Popular</em>}
                <b>{p.short}</b>
                <strong>{inr(p.price)}</strong>
                <span>/ month + GST</span>
                <button
                  type="button"
                  className={`prc-btn sm ${i === 1 ? "" : "ghost"}`}
                  onClick={() => onPurchase(i)}
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>

          {MODULES.map((m, i) => (
            <div
              key={m.name}
              className={`prc-cmp-row ${open === i ? "is-open" : ""}`}
              role="rowgroup"
            >
              <button
                type="button"
                className="prc-cmp-line"
                role="row"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span className="prc-cmp-mod" role="rowheader">
                  <span className={`prc-cmp-ic tier-${m.from}`}>
                    <Icon name={m.icon} size={15} />
                  </span>
                  <span className="prc-cmp-name">
                    {m.name}
                    <small>{m.features.length} features</small>
                  </span>
                  <span className="prc-cmp-chev">
                    <Icon name="chev" size={16} />
                  </span>
                </span>
                {PLANS.map((p, pi) => (
                  <span
                    key={p.name}
                    className={`prc-cmp-cell ${pi === 1 ? "is-pop" : ""}`}
                    role="cell"
                  >
                    {inPlan(m, pi) ? (
                      <span className="prc-yes" aria-label="Included">
                        <Icon name="check" size={12} />
                      </span>
                    ) : (
                      <span className="prc-no" aria-label="Not included">
                        <Icon name="minus" size={12} />
                      </span>
                    )}
                  </span>
                ))}
              </button>
              <div className="prc-cmp-drawer">
                <div className="prc-cmp-drawer-in">
                  <p className="prc-cmp-from">
                    Available from <b>{PLANS[m.from].name}</b>
                  </p>
                  <ul>
                    {m.features.map((f) => (
                      <li key={f}>
                        <Icon name="check" size={11} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <div className="prc-cmp-total" role="row">
            <span role="rowheader">Total features</span>
            {PLANS.map((p, i) => (
              <span
                key={p.name}
                className={i === 1 ? "is-pop" : ""}
                role="cell"
              >
                <b>{featureCount(i)}</b>
              </span>
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

export default function Pricing() {
  const [enquiry, setEnquiry] = useState(null);
  const close = useRef(() => setEnquiry(null)).current;

  return (
    <main className="prc-page">
      <PlanStack onPurchase={setEnquiry} />
      <CompareMatrix onPurchase={setEnquiry} />
      {enquiry !== null && (
        <EnquiryModal plan={PLANS[enquiry]} onClose={close} />
      )}
    </main>
  );
}
