// Preloader.jsx
// NGriffinPay  — website preloader
// Logo inside a filling progress ring, HR icons orbiting (₹ payroll · clock attendance · people),
// a % counter with rotating status lines, then the screen splits open to reveal the site.
//
// Place it once in App.jsx (see the guide). No extra packages needed.

import { useEffect, useRef, useState } from "react";
import { I } from "../data";
import "./Preloader.css";

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const LOGO = "ngriffinpay-mark.png"; // your logo file (same one used across the site)
const MIN_TIME = 1800; // ms — always show at least this long so the animation is seen
const MAX_TIME = 7000; // ms — never block the site longer than this, even on slow networks
const ONCE_PER_SESSION = false; // true = show only on the first visit in a browser tab

const STATUS = [
  "Preparing payroll…",
  "Syncing attendance…",
  "Securing your data…",
  "Almost there…",
];

const R = 62;
const C = 2 * Math.PI * R;

export default function Preloader() {
  const [show, setShow] = useState(() => {
    if (!ONCE_PER_SESSION) return true;
    try {
      return !sessionStorage.getItem("ngp-preloaded");
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState(0);
  const ringRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!show) return undefined;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.documentElement.classList.add("ngp-loading");

    const start = performance.now();
    const markLoaded = () => {
      loaded.current = true;
    };
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded, { once: true });

    // progress: creeps to 90% while the page loads, then races to 100% once it's ready
    let value = 0;
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const ready =
        (loaded.current && elapsed >= MIN_TIME) || elapsed >= MAX_TIME;
      const target = ready
        ? 100
        : Math.min(
            90,
            (elapsed / MIN_TIME) * 80 + 10 * (1 - Math.exp(-elapsed / 3000)),
          );
      value += (target - value) * (ready ? 0.18 : 0.06);
      if (ready && value > 99.4) value = 100;
      setPct(Math.round(value));
      if (ringRef.current)
        ringRef.current.style.strokeDashoffset = String(C * (1 - value / 100));
      if (value >= 100) {
        setTimeout(() => setLeaving(true), reduce ? 0 : 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const st = setInterval(
      () => setStatus((s) => (s + 1) % STATUS.length),
      900,
    );

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(st);
      window.removeEventListener("load", markLoaded);
    };
  }, [show]);

  // after the exit animation, remove the preloader completely
  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(() => {
      document.documentElement.classList.remove("ngp-loading");
      try {
        sessionStorage.setItem("ngp-preloaded", "1");
      } catch {
        /* ignore */
      }
      setShow(false);
    }, 1100);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!show) return null;

  return (
    <div
      className={`ngp-pre ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading NGriffinPay , ${pct}%`}
    >
      <div className="ngp-pre-half top" aria-hidden />
      <div className="ngp-pre-half bottom" aria-hidden />
      <span className="ngp-pre-grid" aria-hidden />

      <div className="ngp-pre-center">
        <div className="ngp-pre-orbit-wrap">
          <svg className="ngp-pre-ring" viewBox="0 0 150 150" aria-hidden>
            <defs>
              <linearGradient id="ngpPreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#38bdf8" />
                <stop offset="0.55" stopColor="#1d6fd8" />
                <stop offset="1" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
            <circle cx="75" cy="75" r={R} className="ngp-pre-track" />
            <circle cx="75" cy="75" r={R} className="ngp-pre-ticks" />
            <circle
              ref={ringRef}
              cx="75"
              cy="75"
              r={R}
              className="ngp-pre-fill"
              strokeDasharray={C}
              strokeDashoffset={C}
            />
          </svg>

          {/* orbiting HR icons */}
          <div className="ngp-pre-orbit" aria-hidden>
            <span className="ngp-pre-sat s1">₹</span>
            <span className="ngp-pre-sat s2">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
            <span className="ngp-pre-sat s3">
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3.5" />
                <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M17 4a3.5 3.5 0 0 1 0 7M21 20v-1a5 5 0 0 0-3-4.6" />
              </svg>
            </span>
          </div>

          <div className="ngp-pre-logo">
            <img src={I(LOGO)} alt="NGriffinPay " />
          </div>
        </div>

        <div className="ngp-pre-brand" aria-hidden>
          {"NGriffinPay ".split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.35 + i * 0.05}s` }}>
              {ch}
            </span>
          ))}
        </div>

        <div className="ngp-pre-meta">
          <span className="ngp-pre-status" key={status}>
            {STATUS[status]}
          </span>
          <b className="ngp-pre-pct">{pct}%</b>
        </div>
      </div>

      <div className="ngp-pre-bar" aria-hidden>
        <i style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}
