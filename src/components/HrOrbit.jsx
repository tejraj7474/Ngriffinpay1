import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../gsap";
import logo from "../assets/ngriffinpay-logo.png";
import "./HrOrbit.css";
import icAttendance from "../assets/icons/attendance.gif";
import icPayroll from "../assets/icons/payroll.gif";
import icLeave from "../assets/icons/leave.gif";
import icHiring from "../assets/icons/hiring.gif";
import icPerformance from "../assets/icons/performance.gif";
import icCompliance from "../assets/icons/compliance.gif";

/* sc = scattered "chaos" pose: [x as fraction of width, y as fraction of height, rotation, scale] */
const MODS = [
  {
    n: "Attendance",
    ic: icAttendance,
    c: "#dbe9ff",
    mc: "#fff4a8",
    mess: "who is in today??",
    line: "Hybrid and remote check-ins in one live view.",
    sc: [-0.3, -0.1, -14, 1.15],
  },
  {
    n: "Payroll",
    ic: icPayroll,
    c: "#ffd9d3",
    mc: "#ffc9c0",
    mess: "payroll late!",
    line: "Multi-state payroll closed in hours, not days.",
    sc: [0.28, -0.16, 9, 1.05],
  },
  {
    n: "Leave",
    ic: icLeave,
    c: "#d8f7e7",
    mc: "#c9f0ff",
    mess: "leave_final_v7.xlsx",
    line: "Policies, balances and approvals on autopilot.",
    sc: [-0.34, 0.2, 8, 1.1],
  },
  {
    n: "Hiring",
    ic: icHiring,
    c: "#eadcff",
    mc: "#ffe1a8",
    mess: "47 unread resumes",
    line: "Offer to laptop and access, onboarded in a click.",
    sc: [0.32, 0.16, -9, 1],
  },
  {
    n: "Performance",
    ic: icPerformance,
    c: "#ffe3c2",
    mc: "#e6d6ff",
    mess: "reviews pending…",
    line: "Goals and feedback that fit your sprints.",
    sc: [-0.08, -0.22, -5, 0.95],
  },
  {
    n: "Compliance",
    ic: icCompliance,
    c: "#d6f3ff",
    mc: "#d7f5c9",
    mess: "tax forms?!",
    line: "PF, ESI and TDS filings handled for you.",
    sc: [0.08, 0.3, 12, 1.1],
  },
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);

export default function HrOrbit() {
  const rootRef = useRef();
  const pinRef = useRef();
  const anchorRef = useRef();
  const chipRefs = useRef([]);
  const haRef = useRef(),
    hbRef = useRef(),
    hintRef = useRef();
  const tangleRef = useRef(),
    coreRef = useRef(),
    panelRef = useRef();
  const ring1 = useRef(),
    ring2 = useRef();
  const actRef = useRef(0);
  const hoverRef = useRef(false);
  const [act, setAct] = useState(0);
  const [reduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const n = MODS.length;

  useEffect(() => {
    actRef.current = act;
  }, [act]);

  useEffect(() => {
    const pin = pinRef.current;
    const chips = chipRefs.current;
    const mess = chips.map((c) => c.querySelector(".ho-mess"));
    const neat = chips.map((c) => c.querySelector(".ho-neat"));
    const S = {
      p: reduce ? 1 : 0,
      target: reduce ? 1 : 0,
      spin: 0,
      mx: 0,
      my: 0,
      tmx: 0,
      tmy: 0,
    };
    let W = 0,
      H = 0,
      Rx = 0,
      Ry = 0,
      cs = 1;

    const size = () => {
      W = pin.clientWidth;
      H = pin.clientHeight;
      Rx = Math.min(430, W * 0.38);
      Ry = Rx * 0.3;
      cs = clamp(W / 900, 0.62, 1);
      ring1.current.style.width = `${Rx * 2}px`;
      ring1.current.style.height = `${Ry * 2}px`;
      ring2.current.style.width = `${Rx * 1.25}px`;
      ring2.current.style.height = `${Ry * 1.25}px`;
    };
    size();
    window.addEventListener("resize", size);

    const render = (dt) => {
      const k = 1 - Math.exp(-dt / 140);
      S.p += (S.target - S.p) * k;
      S.mx += (S.tmx - S.mx) * k;
      S.my += (S.tmy - S.my) * k;
      const e = ease(clamp(S.p));
      const orbit = ease(clamp((S.p - 0.9) / 0.1));
      if (!reduce)
        S.spin += (dt / 1000) * 0.28 * orbit * (hoverRef.current ? 0.2 : 1);

      anchorRef.current.style.transform = `translate3d(${-S.mx * 16}px, ${-S.my * 10}px, 0)`;

      chips.forEach((el, i) => {
        const [fx, fy, rot, sc0] = MODS[i].sc;
        const th = (i / n) * Math.PI * 2 + Math.PI / 2 + S.spin;
        const ox = Math.cos(th) * Rx,
          oy = Math.sin(th) * Ry;
        const d = (Math.sin(th) + 1) / 2; // 0 = back, 1 = front
        const sx = fx * W,
          sy = fy * H;
        const x = sx + (ox - sx) * e,
          y = sy + (oy - sy) * e;
        const r = rot * (1 - e);
        const target =
          (0.74 + 0.36 * d) *
          (i === actRef.current && S.p > 0.9 ? 1.12 : 1) *
          cs;
        const s = sc0 * cs + (target - sc0 * cs) * e;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${r}deg) scale(${s})`;
        el.style.zIndex =
          e > 0.5
            ? d > 0.5
              ? 60 + Math.round(d * 10)
              : 10 + Math.round(d * 10)
            : 20 + i;
        el.style.opacity = 1 - e * (1 - (0.6 + 0.4 * d));
        mess[i].style.opacity = 1 - clamp(e * 1.7);
        neat[i].style.opacity = clamp(e * 1.7 - 0.3);
        el.classList.toggle("ho-on", i === actRef.current && S.p > 0.9);
      });

      const ha = 1 - clamp(S.p * 2.4),
        hb = clamp(S.p * 2.4 - 0.9);
      haRef.current.style.opacity = ha;
      haRef.current.style.transform = `translateY(${(1 - ha) * -26}px)`;
      hbRef.current.style.opacity = hb;
      hbRef.current.style.transform = `translateY(${(1 - hb) * 26}px)`;
      hintRef.current.style.opacity = 1 - clamp(S.p * 5);
      tangleRef.current.style.opacity = 1 - clamp(S.p * 1.8);
      ring1.current.style.opacity = e;
      ring2.current.style.opacity = e * 0.7;
      coreRef.current.style.transform = `scale(${0.8 + 0.2 * e})`;
      panelRef.current.style.opacity = clamp((S.p - 0.9) / 0.1);
      panelRef.current.style.transform = `translate(-50%, ${(1 - clamp((S.p - 0.9) / 0.1)) * 24}px)`;
    };

    const tick = (time, dt) => render(dt);
    let st;
    if (reduce) {
      render(16);
    } else {
      st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          S.target = clamp(self.progress / 0.55);
        },
      });
      S.target = clamp(st.progress / 0.55);
      gsap.ticker.add(tick);
    }

    const onMove = (ev) => {
      S.tmx = ev.clientX / window.innerWidth - 0.5;
      S.tmy = ev.clientY / window.innerHeight - 0.5;
    };
    pin.addEventListener("mousemove", onMove);

    const cycle = setInterval(() => {
      if (!hoverRef.current && S.p > 0.9) setAct((a) => (a + 1) % n);
    }, 3200);

    return () => {
      clearInterval(cycle);
      window.removeEventListener("resize", size);
      pin.removeEventListener("mousemove", onMove);
      if (st) st.kill();
      gsap.ticker.remove(tick);
    };
  }, [reduce, n]);

  const m = MODS[act];

  return (
    <section
      className={`ho-section ${reduce ? "ho-static" : ""}`}
      id="why-hrms"
      ref={rootRef}
    >
      <div className="ho-pin" ref={pinRef}>
        <i className="ho-blob ho-b1" />
        <i className="ho-blob ho-b2" />
        <i className="ho-blob ho-b3" />

        {/* headline: swaps from chaos to order as you scroll */}
        <div className="ho-head">
          <div className="ho-ha" ref={haRef}>
            <h2>
              HR <em>without</em> a system
            </h2>
            <p>Sheets. Chats. Missed approvals.</p>
          </div>
          <div className="ho-hb" ref={hbRef}>
            <h2>
              HR with <em>NGriffinpay</em>
            </h2>
            <p>One system for every IT team.</p>
          </div>
        </div>

        <div className="ho-anchor" ref={anchorRef}>
          {/* tangled lines = the chaos */}
          <svg
            className="ho-tangle"
            ref={tangleRef}
            viewBox="-400 -200 800 400"
            aria-hidden="true"
          >
            <path d="M-330 -70 C-170 -170 -60 70 90 -40 S 270 120 340 -60" />
            <path d="M-340 100 C-190 20 -30 170 120 70 S 290 -30 345 95" />
            <path d="M-210 -150 C-110 0 110 -130 250 20" />
            <path d="M-120 150 C-40 40 60 90 180 -20" />
            <g className="ho-bang">
              <circle cx="-250" cy="-120" r="16" />
              <text x="-250" y="-114" textAnchor="middle">
                !
              </text>
            </g>
            <g className="ho-bang">
              <circle cx="210" cy="-110" r="16" />
              <text x="210" y="-104" textAnchor="middle">
                !
              </text>
            </g>
            <g className="ho-bang">
              <circle cx="-60" cy="120" r="16" />
              <text x="-60" y="126" textAnchor="middle">
                !
              </text>
            </g>
            <g className="ho-bang">
              <circle cx="290" cy="90" r="16" />
              <text x="290" y="96" textAnchor="middle">
                !
              </text>
            </g>
          </svg>

          <i className="ho-ring ho-r1" ref={ring1} />
          <i className="ho-ring ho-r2" ref={ring2} />

          <div className="ho-core" ref={coreRef}>
            <div className="ho-disc">
              <img src={logo} alt="NGriffinpay" />
            </div>
          </div>

          {MODS.map((mod, i) => (
            <button
              type="button"
              key={mod.n}
              className="ho-chip"
              ref={(el) => (chipRefs.current[i] = el)}
              onMouseEnter={() => {
                hoverRef.current = true;
                setAct(i);
              }}
              onMouseLeave={() => {
                hoverRef.current = false;
              }}
              onClick={() => setAct(i)}
              aria-label={mod.n}
            >
              <span className="ho-mess">{mod.mess}</span>
              <span className="ho-neat">
                <i className="ho-ic">
                  <img src={mod.ic} alt="" draggable="false" />
                </i>
                <b>{mod.n}</b>
              </span>
            </button>
          ))}
        </div>

        {/* one line about the module in focus */}
        <div className="ho-panel" ref={panelRef}>
          <div className="ho-pcard" key={act}>
            <i className="ho-ic ho-ic-lg">
              <img src={m.ic} alt="" draggable="false" />
            </i>
            <div>
              <b>{m.n}</b>
              <span>{m.line}</span>
            </div>
          </div>
          <div className="ho-dots">
            {MODS.map((x, i) => (
              <button
                key={x.n}
                type="button"
                className={i === act ? "ho-d ho-dact" : "ho-d"}
                onClick={() => setAct(i)}
                aria-label={x.n}
              />
            ))}
          </div>
        </div>

        <div className="ho-hint" ref={hintRef}>
          <span /> Scroll to bring order
        </div>
      </div>
    </section>
  );
}
