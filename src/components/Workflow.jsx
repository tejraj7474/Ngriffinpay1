import { useEffect, useRef } from "react";
import { gsap } from "../gsap";
import { I } from "../data";
import { WORKFLOW_ICONS } from "./WorkflowIcons";

// clockwise order, one every 60 degrees starting top-left
const ITEMS = [
  [
    "Attendance Tracking",
    "Know who is in, instantly",
    "Geo-fenced check-ins, shifts and leave sync live, so attendance is always accurate and audit-ready.",
  ],
  [
    "Payroll and HR Reports",
    "Payroll without the month-end scramble",
    "Attendance flows straight into payroll, with one-click reports for HR and finance.",
  ],
  [
    "Support for Multiple Locations",
    "One system, every office",
    "Manage branches, regions and holiday calendars under a single policy control.",
  ],
  [
    "Employee Self-Service App",
    "Your team, in their pocket",
    "Check in, apply for leave and download payslips from the mobile app.",
  ],
  [
    "Access Control by Role",
    "The right access for every person",
    "Admins, managers and employees see only what their role allows.",
  ],
  [
    "Daily Work Logs & Time Edits",
    "Every hour accounted for",
    "Employees log work daily, and managers review and approve time edits in one place.",
  ],
];

const N = ITEMS.length;
const BASE = -120; // starting angle of icon 0 (degrees, -90 = top)
const START = 0.6; // when the first card begins
const STEP = 1.5; // timeline length per card
const TOTAL = START + N * STEP;
const pad = (n) => String(n).padStart(2, "0");

export default function Workflow() {
  const root = useRef(),
    stage = useRef(),
    num = useRef(),
    bar = useRef();

  useEffect(() => {
    let tl = null;
    let onResize = () => {};

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(".hrv-ico");
      const cards = gsap.utils.toArray(".hrv-card");
      const st = els.map(() => ({ k: 0 })); // per-icon "fly out" amount, 0 to 1
      const rot = { deg: 0 }; // shared clockwise rotation
      const dim = { w: 1, h: 1 };
      let last = -2;

      const render = () => {
        if (!tl || !stage.current) return;
        // NEW: stop short of the edges so icon + label always stay visible
        const small = dim.w < 520;
        const rx = small
          ? Math.max(70, dim.w / 2 - 46)
          : Math.max(60, dim.w / 2 - 95);
        const ry = small
          ? Math.max(56, dim.h / 2 - 40)
          : Math.max(60, dim.h / 2 - 75);
        const idx = Math.min(N - 1, Math.floor((tl.time() - START) / STEP));

        els.forEach((el, i) => {
          const a = ((BASE + i * 60 + rot.deg) * Math.PI) / 180;
          const k = st[i].k;
          const depth = (Math.sin(a) + 1) / 2; // 0 top/back, 1 bottom/front
          gsap.set(el, {
            x: Math.cos(a) * rx * k,
            y: Math.sin(a) * ry * k,
            xPercent: -50,
            yPercent: -50,
            scale: (0.84 + 0.16 * depth) * Math.max(k, 0.001),
            opacity: Math.min(1, k * 1.6),
            zIndex: k < 0.9 ? 1 : depth > 0.5 ? 4 : 1,
          });
          el.classList.toggle("on", i === idx);
        });

        if (idx !== last) {
          last = idx;
          if (idx >= 0 && num.current) num.current.textContent = pad(idx + 1);
        }
        if (bar.current)
          bar.current.style.transform = `scaleX(${tl.progress()})`;
      };

      onResize = () => {
        if (!stage.current) return;
        dim.w = stage.current.offsetWidth;
        dim.h = stage.current.offsetHeight;
        render();
      };

      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: render,
      });

      // intro: phones rise in, then icons fly out of them one after another
      tl.fromTo(
        ".hrv-phones",
        { scale: 0.85, y: 70, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0,
      )
        .fromTo(
          ".hrv-head",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          0,
        )
        .to(
          st,
          { k: 1, duration: 0.9, stagger: 0.25, ease: "back.out(1.5)" },
          0.2,
        )
        // one continuous clockwise orbit across the whole scroll
        .to(rot, { deg: 360, duration: TOTAL }, 0);

      // content cards: each slides up in, holds, then slides up out
      cards.forEach((c, i) => {
        const s = START + i * STEP;
        tl.fromTo(
          c,
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
          s,
        );
        if (i < N - 1)
          tl.to(
            c,
            { y: -70, opacity: 0, duration: 0.4, ease: "power3.in" },
            s + 1.1,
          );
      });

      // phones gently float on their own, independent of scroll
      gsap.to(".hrv-float", {
        y: -14,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      onResize();
    }, root);

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section className="hrv" ref={root} id="workflow">
      <div className="hrv-grid">
        {/* LEFT: content */}
        <div className="hrv-left">
          <div className="hrv-head">
            <p className="hrv-eyebrow">One tool to simplify your workflow</p>
            <h2>Ready for smarter, simpler HR?</h2>
          </div>

          <div className="hrv-cards">
            {ITEMS.map((it, i) => (
              <article className="hrv-card" key={i}>
                <span className="hrv-tag">{it[0]}</span>
                <h3>{it[1]}</h3>
                <p>{it[2]}</p>
              </article>
            ))}
          </div>

          <div className="hrv-prog">
            <span ref={num}>01</span>
            <i>
              <b ref={bar} />
            </i>
            <span>{pad(N)}</span>
          </div>
        </div>

        {/* RIGHT: phones with orbiting icons */}
        <div className="hrv-right">
          <div className="hrv-stage" ref={stage}>
            <div className="hrv-phones">
              <div className="hrv-float">
                <img src={I("phones.png")} alt="NGriffin Pay mobile app" />
              </div>
              <span className="hrv-shadow" />
            </div>

            {ITEMS.map((it, i) => (
              <div className="hrv-ico" key={i}>
                <span className="hrv-badge">{WORKFLOW_ICONS[i]}</span>
                <span className="hrv-lab">{it[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
