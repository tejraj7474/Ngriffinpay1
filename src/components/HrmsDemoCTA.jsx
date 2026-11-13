import React, { useCallback, useEffect, useState } from "react";
import "./HrmsDemoCTA.css";

/* ---------------- HRMS icons ---------------- */
const Icon = {
  payroll: (
    <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="13" rx="2" /><circle cx="12" cy="12.5" r="2.5" /><path d="M6 10v5M18 10v5" /></svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  leave: (
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4M9 15l2 2 4-4" /></svg>
  ),
  payslip: (
    <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h7M9 17h5" /></svg>
  ),
  close: (
    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  check: (
    <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  ),
};

/* Rotating HRMS messages in the bar */
const MESSAGES = [
  { icon: "payroll", text: "Run payroll for your entire team in just 3 clicks" },
  { icon: "shield", text: "Auto PF, ESI, PT & TDS compliance. Zero penalties" },
  { icon: "clock", text: "Geo-fenced mobile attendance & shift tracking" },
  { icon: "leave", text: "Leave approvals in one tap. No more WhatsApp requests" },
  { icon: "payslip", text: "Payslips & Form 16 delivered to employees automatically" },
];

/* Benefits shown on the left side of the popup */
const BENEFITS = [
  "Payroll, Attendance & Leave in one place",
  "100% statutory compliance (PF, ESI, PT, TDS)",
  "AI insights on attrition & workforce cost",
  "Go live in days, with a local Bengaluru team",
];


/**
 * HrmsDemoCTA
 * - Floating HRMS demo bar on every page
 * - Popup form opens 20 s after page load, and again 20 s after every close
 *
 * Usage (once, in App.jsx outside <Routes>):
 *
 *   <HrmsDemoCTA>
 *     {(onSuccess) => <YourDemoForm onSuccess={onSuccess} />}
 *   </HrmsDemoCTA>
 *
 * Call onSuccess() from your form after it submits successfully:
 * the popup closes and stops auto-opening until the page is refreshed.
 * You can also pass your form directly:  <HrmsDemoCTA><YourDemoForm /></HrmsDemoCTA>
 */
const HrmsDemoCTA = ({
  children,
  renderPopup,               // optional: use YOUR own popup instead of the built-in one
  interval = 20000,          // 20 seconds
  buttonText = "Book a 10-min Demo",
}) => {
  const [barVisible, setBarVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // true only after a successful submit; resets on page refresh
  const [submitted, setSubmitted] = useState(false);

  /* Bar slide-in */
  useEffect(() => {
    const t = setTimeout(() => setBarVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  /* Rotate messages every 3.5 s */
  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* Auto-open popup: 20 s after load, and 20 s after each close */
  useEffect(() => {
    if (isOpen || submitted) return;
    const t = setTimeout(() => setIsOpen(true), interval);
    return () => clearTimeout(t);
  }, [isOpen, submitted, interval]);

  const close = useCallback(() => setIsOpen(false), []);

  const handleSuccess = useCallback(() => {
    setSubmitted(true);
    setIsOpen(false);
  }, []);

  /* Esc to close + lock page scroll while open (built-in popup only) */
  useEffect(() => {
    if (!isOpen || renderPopup) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close, renderPopup]);

  const msg = MESSAGES[msgIndex];

  return (
    <>
      {/* ============ Floating HRMS bar ============ */}
      <div className={`hdc-bar ${barVisible ? "hdc-bar--show" : ""}`} role="region" aria-label="Book an HRMS demo">
        <div className="hdc-bar__inner">
          <div className="hdc-bar__badge">
            <span className="hdc-bar__live" />
            HRMS
          </div>

          <div className="hdc-bar__ticker" aria-live="polite">
            <span key={msgIndex} className="hdc-bar__msg">
              <span className="hdc-bar__msg-icon">{Icon[msg.icon]}</span>
              <span className="hdc-bar__msg-text">{msg.text}</span>
            </span>
          </div>

          <div className="hdc-bar__dots" aria-hidden="true">
            {MESSAGES.map((_, i) => (
              <span key={i} className={i === msgIndex ? "active" : ""} />
            ))}
          </div>

          <button
            type="button"
            className="hdc-bar__btn"
            onClick={(e) => {
              // stop the click reaching any site-wide "demo" click listener (e.g. in Header)
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setIsOpen(true);
            }}
          >
            <span className="hdc-bar__btn-icon">{Icon.leave}</span>
            <span className="hdc-bar__btn-long">{buttonText}</span>
            <span className="hdc-bar__btn-short">Book Demo</span>
          </button>
        </div>
      </div>

      {/* ============ Your own popup (if provided) ============ */}
      {renderPopup && renderPopup({ isOpen, onClose: close, onSuccess: handleSuccess })}

      {/* ============ Built-in popup form ============ */}
      {!renderPopup && isOpen && (
        <div className="hdc-overlay" onMouseDown={close}>
          <div
            className="hdc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hdc-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button type="button" className="hdc-modal__close" onClick={close} aria-label="Close">
              {Icon.close}
            </button>

            {/* Left: HRMS pitch */}
            <aside className="hdc-modal__side">
              <span className="hdc-modal__tag">Free 10-minute demo</span>
              <h3 id="hdc-title" className="hdc-modal__title">
                See NGriffinPay HRMS <br /> in action
              </h3>
              <p className="hdc-modal__sub">
                From attendance to payslips, watch your whole HR & payroll cycle run on autopilot.
              </p>

              <ul className="hdc-modal__list">
                {BENEFITS.map((b) => (
                  <li key={b}>
                    <span className="hdc-modal__tick">{Icon.check}</span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* mini payslip card for an HRMS feel */}
              <div className="hdc-payslip" aria-hidden="true">
                <div className="hdc-payslip__row">
                  <span className="hdc-payslip__label">Payroll · Nov 2026</span>
                  <span className="hdc-payslip__status">Processed</span>
                </div>
                <div className="hdc-payslip__amount">248 employees</div>
                <div className="hdc-payslip__bar"><span /></div>
                <div className="hdc-payslip__foot">PF · ESI · TDS filed automatically</div>
              </div>
            </aside>

            {/* Right: YOUR existing form */}
            <div className="hdc-modal__form">
              {typeof children === "function" ? children(handleSuccess) : children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HrmsDemoCTA;
