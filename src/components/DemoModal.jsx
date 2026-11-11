// DemoModal.jsx
// NGriffinPay  — "Book a Demo" pop-up form
// Opens from the Header's "Request a Demo" button (and from anywhere else with openDemo()).
// Fields: Name*, Phone Number, Company Name*, Business Email*, consent checkbox + Privacy Policy link.
//
// No extra packages needed.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { I } from "../data";
import "./DemoModal.css";

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

// Put your form handler here (PHP mail script / API URL).
// Leave it empty while testing — the form will just show the success screen.
const DEMO_ENDPOINT = "";

const PRIVACY_URL = "https://ngriffinpay.in/privacy-policy.html";
const OPEN_EVENT = "ngp:open-demo";

// Call this from any button on any page to open the pop-up:
//   import { openDemo } from "./DemoModal";
//   <button onClick={openDemo}>Book a Free Demo</button>
export const openDemo = (e) => {
  if (e && e.preventDefault) e.preventDefault();
  window.dispatchEvent(new Event(OPEN_EVENT));
};

const PERKS = [
  "A live walkthrough built around your team",
  "Payroll, attendance & compliance questions answered",
  "Pricing for your exact number of employees",
];

const FREE_MAIL = [
  "gmail.com",
  "yahoo.com",
  "yahoo.in",
  "hotmail.com",
  "outlook.com",
  "rediffmail.com",
  "icloud.com",
];
const EMPTY = { name: "", phone: "", company: "", email: "", consent: false };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name";
  if (
    f.phone.trim() &&
    !/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))
  )
    e.phone = "Please enter a valid 10-digit mobile number";
  if (!f.company.trim()) e.company = "Please enter your company name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = "Please enter a valid email address";
  return e;
}

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
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "building":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    default:
      return null;
  }
}

function Field({ id, label, icon, required, error, hint, ...input }) {
  return (
    <div
      className={`dmo-field ${error ? "has-err" : ""} ${input.value ? "has-val" : ""}`}
    >
      <label htmlFor={id}>
        {label}
        {required ? <em>*</em> : <span className="dmo-opt">optional</span>}
      </label>
      <div className="dmo-input">
        <span className="dmo-input-ic">
          <Icon name={icon} size={16} />
        </span>
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          {...input}
        />
        {!error && input.value && (
          <span className="dmo-ok">
            <Icon name="check" size={11} />
          </span>
        )}
      </div>
      {error ? (
        <small id={`${id}-err`} className="dmo-err">
          {error}
        </small>
      ) : hint ? (
        <small className="dmo-hint">{hint}</small>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export default function DemoModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | fail
  const [closing, setClosing] = useState(false);
  const boxRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  // open: lock scroll, focus first field, Esc to close, keep Tab inside the pop-up
  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    document.documentElement.classList.add("dmo-lock"); // stop the page behind from scrolling
    const t = setTimeout(
      () => boxRef.current?.querySelector("input")?.focus(),
      80,
    );
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current?.();
      if (e.key === "Tab" && boxRef.current) {
        const f = boxRef.current.querySelectorAll(
          "button, a[href], input, [tabindex]:not([tabindex='-1'])",
        );
        const list = Array.from(f).filter(
          (el) => !el.disabled && el.offsetParent !== null,
        );
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove("dmo-lock");
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
      if (stateRef.current === "sent") {
        setForm(EMPTY);
        setState("idle");
      }
      setErrors({});
    }, 220);
  };

  closeRef.current = close;

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      boxRef.current?.classList.remove("dmo-shake");
      void boxRef.current?.offsetWidth; // restart the shake animation
      boxRef.current?.classList.add("dmo-shake");
      const firstBad = boxRef.current?.querySelector("[aria-invalid='true']");
      firstBad?.focus();
      return;
    }
    setState("sending");
    try {
      if (DEMO_ENDPOINT) {
        const body = new FormData();
        body.append("name", form.name.trim());
        body.append("phone", form.phone.trim());
        body.append("company", form.company.trim());
        body.append("email", form.email.trim());
        body.append("consent", form.consent ? "yes" : "no");
        body.append("page", window.location.href);
        const res = await fetch(DEMO_ENDPOINT, { method: "POST", body });
        if (!res.ok) throw new Error("failed");
      }
      setState("sent");
    } catch {
      setState("fail");
    }
  };

  if (!open) return null;

  const domain = form.email.split("@")[1]?.toLowerCase();
  const freeMail = domain && FREE_MAIL.includes(domain) && !errors.email;

  return createPortal(
    <div
      className={`dmo ${closing ? "is-closing" : ""}`}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="dmo-box"
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dmo-title"
        onAnimationEnd={(e) =>
          e.animationName === "dmoShake" &&
          e.currentTarget.classList.remove("dmo-shake")
        }
      >
        <button
          type="button"
          className="dmo-x"
          onClick={close}
          aria-label="Close"
        >
          <Icon name="close" size={18} />
        </button>

        {/* ---------- Left: brand panel ---------- */}
        <aside className="dmo-side">
          <span className="dmo-logo">
            <img src={I("ngriffinpay-mark.png")} alt="NGriffinPay " />
          </span>
          <h2 id="dmo-title">Book a Demo</h2>
          <p>
            See how NGriffinPay runs payroll, attendance and compliance for your
            team.
          </p>
          <ul>
            {PERKS.map((p) => (
              <li key={p}>
                <span>
                  <Icon name="check" size={11} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="dmo-side-card" aria-hidden>
            <span className="dmo-cal">
              <Icon name="calendar" size={16} />
            </span>
            <div>
              <b>Free · No obligation</b>
              <small>We'll call you to pick a time that suits you</small>
            </div>
          </div>
        </aside>

        {/* ---------- Right: form / success ---------- */}
        <div className="dmo-main">
          {state === "sent" ? (
            <div className="dmo-done">
              <span className="dmo-done-ic">
                <svg viewBox="0 0 52 52" aria-hidden>
                  <circle cx="26" cy="26" r="24" />
                  <path d="m15 27 7 7 15-15" />
                </svg>
              </span>
              <h3>Thank you, {form.name.trim().split(" ")[0]}!</h3>
              <p>
                Your demo request for <b>{form.company.trim()}</b> has been
                received. Our team will reach out to <b>{form.email.trim()}</b>{" "}
                to schedule your demo.
              </p>
              <button type="button" className="dmo-submit" onClick={close}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="dmo-form-head">
                <h3>Tell us about you</h3>
                <span>
                  Fields marked <em>*</em> are required
                </span>
              </div>

              <div className="dmo-grid">
                <Field
                  id="dmo-name"
                  label="Name"
                  icon="user"
                  required
                  value={form.name}
                  onChange={set("name")}
                  error={errors.name}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                <Field
                  id="dmo-phone"
                  label="Phone Number"
                  icon="phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                  placeholder="98765 43210"
                  autoComplete="tel"
                  maxLength={15}
                />
              </div>
              <Field
                id="dmo-company"
                label="Company Name"
                icon="building"
                required
                value={form.company}
                onChange={set("company")}
                error={errors.company}
                placeholder="Your company"
                autoComplete="organization"
              />
              <Field
                id="dmo-email"
                label="Business Email"
                icon="mail"
                required
                type="email"
                inputMode="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                placeholder="you@company.com"
                autoComplete="email"
                hint={
                  freeMail
                    ? "Tip: a work email helps us prepare a demo for your company."
                    : ""
                }
              />

              <label className="dmo-consent">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={set("consent")}
                />
                <span className="dmo-check" aria-hidden>
                  <Icon name="check" size={11} />
                </span>
                <span>
                  I consent to receive updates, promotional content, and
                  tailored offers from NGriffinPay and its affiliates. I
                  understand that I can opt out or manage my preferences at any
                  time using the link provided in any email.{" "}
                  <a
                    href={PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {state === "fail" && (
                <p className="dmo-fail">
                  Something went wrong. Please try again in a moment.
                </p>
              )}

              <button
                type="submit"
                className="dmo-submit"
                disabled={state === "sending"}
              >
                {state === "sending" ? (
                  <>
                    <span className="dmo-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Book my demo <Icon name="arrow" size={16} />
                  </>
                )}
              </button>
              <p className="dmo-safe">
                <Icon name="lock" size={12} /> Your details are protected under
                our{" "}
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
