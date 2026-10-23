import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../gsap";
import { I } from "../data";
import { SERVICES } from "../servicesData";
import "./Services.css";

const popFrom = { y: 40, scale: 0.92, opacity: 0 };
const popTo = {
  y: 0,
  scale: 1,
  opacity: 1,
  duration: 0.7,
  ease: "back.out(1.5)",
  stagger: 0.07,
};

/* ---------- inline icons (no extra dependency) ---------- */
const P = {
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M8 14h2M14 14h2M8 18h2" />
    </>
  ),
  rupee: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 7h8M8 10.5h8M8 7h2.5a3.5 3.5 0 0 1 0 7H8l6 4" />
    </>
  ),
  shieldDoc: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M21.8 16c.2-2 .13-5.35 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </>
  ),
  trend: (
    <>
      <path d="M3 20h18M6 20v-5M11 20v-7M16 20v-4" />
      <path d="M3 13l6-5 4 3 8-7M16 4h5v5" />
    </>
  ),
  wallet: (
    <>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M4 6l12-3 1 3M22 11h-5a2 2 0 0 0 0 4h5" />
    </>
  ),
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </>
  ),
  pointer: (
    <>
      <rect x="3" y="3" width="18" height="8" rx="2" />
      <path d="M7 7h10M11 21l-1-7 6 3-3 1z" />
    </>
  ),
  bars: (
    <>
      <path d="M12 20V10M18 20V4M6 20v-4M3 20h18" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  cloud: (
    <>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </>
  ),
  upload: (
    <>
      <path d="M16 16l-4-4-4 4M12 12v9" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
    </>
  ),
  idCard: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5 16a3 3 0 0 1 6 0M14 10h5M14 14h4" />
    </>
  ),
  checklist: (
    <>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M7 11l1.5 1.5L11 10M13 11h4M7 16l1.5 1.5L11 15M13 16h4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  calClock: (
    <>
      <path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="17" cy="17" r="5" />
      <path d="M17 15v2l1.5 1" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 16v-3M11 16v-6M15 16v-4M19 16V8M6 11l5-5 4 3 5-5" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
};

const Icon = ({ n, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {P[n]}
  </svg>
);

const Banner = ({ text }) => (
  <div className="banner pop">
    <Icon n="shieldCheck" />
    <span>{text}</span>
  </div>
);

const Num = ({ n, alt }) => (
  <span className={`num${alt ? " alt" : ""}`}>{n}</span>
);

/* ---------- one renderer per brochure page ---------- */
function Panel({ s }) {
  switch (s.layout) {
    case "cards": // page 5
      return (
        <div className="l-cards">
          {s.items.map((it, k) => (
            <div key={k} className={`card pop ${k % 2 ? "navy" : "teal"}`}>
              <Icon n={it.i} className="ic" />
              <h4>{it.t}</h4>
              <span className="rule" />
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      );

    case "phone": // page 6
      return (
        <div className="l-phone">
          <img
            className="photo pop"
            src={I(s.photo)}
            alt="NGriffinPay employee app"
          />
          <ul className="feat-list">
            {s.items.map((it, k) => (
              <li key={k} className="pop">
                <span className="ring">
                  <Icon n={it.i} />
                </span>
                <div className="txt">
                  <h4 className={k % 2 ? "teal" : "navy"}>{it.t}</h4>
                  <p>{it.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case "wheel": {
      // page 7
      const pos = [
        ["1", "1", "left"],
        ["3", "1", "right"],
        ["1", "2", "left"],
        ["3", "2", "right"],
      ];
      return (
        <div className="l-wheel-wrap">
          <div className="l-wheel">
            {s.items.map((it, k) => (
              <div
                key={k}
                className={`box pop ${pos[k][2]} ${k === 0 || k === 3 ? "b-navy" : "b-teal"}`}
                style={{ gridColumn: pos[k][0], gridRow: pos[k][1] }}
              >
                <span className="badge">
                  <Icon n={it.i} />
                </span>
                {it.t}
              </div>
            ))}
            <div className="wheel pop">
              <div className="wheel-in">
                <Icon n="award" className="q q-tl" />
                <Icon n="user" className="q q-tr" />
                <Icon n="idCard" className="q q-bl" />
                <Icon n="upload" className="q q-br" />
                <span className="hub">
                  <Icon n="users" />
                </span>
              </div>
            </div>
          </div>
          <div className="wheel-foot">
            <img
              className="photo pop"
              src={I(s.photo)}
              alt="HR team onboarding"
            />
            <Banner text={s.banner} />
          </div>
        </div>
      );
    }

    case "steps": // page 8
      return (
        <div className="l-steps">
          <ul className="num-list">
            {s.items.map((t, k) => (
              <li key={k} className="pop">
                <Num n={k + 1} alt={k % 2} />
                {t}
              </li>
            ))}
          </ul>
          <div className="photo-box pop">
            <img
              className="photo"
              src={I(s.photo)}
              alt="Location based attendance"
            />
            <div className="checkin">
              <div>
                <small>{s.checkin.label}</small>
                <strong>{s.checkin.time}</strong>
                <span>{s.checkin.place}</span>
              </div>
              <span className="tick">
                <Icon n="check" />
              </span>
            </div>
          </div>
        </div>
      );

    case "twocol": // page 9
      return (
        <div className="l-two">
          <div className="two-cols">
            {[s.items.slice(0, 4), s.items.slice(4)].map((col, c) => (
              <ul key={c} className="num-list col">
                {col.map((t, k) => {
                  const n = c * 4 + k + 1;
                  return (
                    <li key={n} className="pop">
                      <Num n={n} alt={n % 2 === 0} />
                      {t}
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
          <img
            className="photo pop"
            src={I(s.photo)}
            alt="Payroll calculator"
          />
          <Banner text={s.banner} />
        </div>
      );

    case "timeline": // page 10
      return (
        <div className="l-time-wrap">
          <div className="l-time">
            <img
              className="photo pop"
              src={I(s.photo)}
              alt="Performance dashboard"
            />
            <ul className="tl">
              {s.items.map((t, k) => (
                <li key={k} className="pop">
                  <Num n={k + 1} alt={k % 2} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Banner text={s.banner} />
        </div>
      );

    case "quad": {
      // page 11
      const pos = [
        ["1", "1"],
        ["3", "1"],
        ["1", "2"],
        ["3", "2"],
      ];
      const dots = [-120, -60, 0, 60, 120, 180];
      return (
        <div className="l-quad">
          {s.items.map((it, k) => (
            <div
              key={k}
              className={`qb pop ${k === 0 || k === 3 ? "navy" : "teal"}`}
              style={{ gridColumn: pos[k][0], gridRow: pos[k][1] }}
            >
              <div className="qh">
                <Num n={k + 1} alt={k === 1 || k === 2} />
                <h4>{it.t}</h4>
              </div>
              <Icon n={it.i} className="qi" />
              <p>{it.d}</p>
            </div>
          ))}
          <div className="qcenter pop">
            <div className="ring-big">
              <Icon n="checklist" />
              {dots.map((a) => (
                <span
                  key={a}
                  className="dot"
                  style={{
                    left: `${50 + 50 * Math.cos((a * Math.PI) / 180)}%`,
                    top: `${50 + 50 * Math.sin((a * Math.PI) / 180)}%`,
                  }}
                />
              ))}
            </div>
            <img
              className="photo"
              src={I(s.photo)}
              alt="Task dashboard on laptop"
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export default function Services() {
  const root = useRef(),
    panelRef = useRef(),
    tabsRef = useRef();
  const preloaded = useRef([]);
  const [act, setAct] = useState(0);

  // preload + decode every photo up front so nothing loads late while scrolling
  useEffect(() => {
    preloaded.current = SERVICES.filter((s) => s.photo).map((s) => {
      const img = new Image();
      img.decoding = "async";
      img.src = I(s.photo);
      if (img.decode) img.decode().catch(() => {});
      return img;
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".big", {
        scrollTrigger: {
          trigger: ".big",
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
        xPercent: -15,
        opacity: 0,
        scale: 1.15,
        transformOrigin: "left",
      });
      // sticky tabs: switch the active service by scroll progress
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) =>
          setAct(
            Math.min(
              SERVICES.length - 1,
              Math.floor(s.progress * SERVICES.length),
            ),
          ),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // pop the panel content in every time the active tab changes
  useLayoutEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pop", popFrom, popTo);
    }, panelRef);
    return () => ctx.revert();
  }, [act]);

  // mobile only: keep the active tab visible in the swipeable tab strip
  useEffect(() => {
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    const ul = tabsRef.current;
    const el = ul && ul.children[act];
    if (!el) return;
    ul.scrollTo({
      left: el.offsetLeft - (ul.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [act]);

  const s = SERVICES[act];

  return (
    <section
      className="svc"
      ref={root}
      style={{ height: `${SERVICES.length * 100}vh` }}
    >
      <div className="stick">
        <h2 className="big">
          One platform to unify people, processes, and experiences
        </h2>
        <div className="row">
          <ul className="tabs" ref={tabsRef}>
            {SERVICES.map((sv, i) => (
              <li key={i} className={i === act ? "on" : ""}>
                <a href={`#svc-${i}`} title={sv.tab}>
                  {sv.tab}
                </a>
              </li>
            ))}
          </ul>

          <div className="vis vis-pdf" id={`svc-${act}`} ref={panelRef}>
            <h3 className="pt pop">
              {s.title[0]} <span>{s.title[1]}</span>
            </h3>
            <i className="pt-rule pop" />
            {s.sub && <p className="sub pop">{s.sub}</p>}

            <div className="body" key={act}>
              <Panel s={s} />
            </div>

            <svg
              className="wave"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 60V28C220 6 470 10 720 60Z" fill="#0f9b8e" />
              <path d="M520 60C800 34 1000 14 1200 30V60Z" fill="#1d2252" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
