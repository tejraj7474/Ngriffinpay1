import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../gsap';
import logo from '../assets/ngriffinpay-logo.png';
import './HrmsExplainer.css';

const DUR = 5; // seconds per scene (5 scenes = 25s loop)

const SCENES = [
  { t: 'HR work scattered across sheets, chats and inboxes?', arm: -35, worried: true },
  { t: 'An HRMS brings it all together in one place.', arm: -75 },
  { t: 'Remote, hybrid, many cities? Everyone stays in sync.', arm: -100 },
  { t: 'Payroll and compliance run on autopilot.', arm: -70 },
  { t: 'Less admin. More time for your people.', arm: -125, wave: true },
];

const CHAOS = [
  ['📊 sheet_v7.xlsx', 28, 36], ['📩 leave request?', 290, 28], ['⏰ payroll is late', 50, 140],
  ['🧾 tax forms', 300, 138], ['❓ who is WFH today?', 130, 236], ['🔔 47 unread', 350, 238],
];
const TILES = [['🕘', 'Attendance', 60, 50], ['💸', 'Payroll', 370, 50], ['🌴', 'Leave', 60, 225], ['🧑‍💻', 'Hiring', 370, 225]];
const LINKS = ['M260 170 L105 90', 'M260 170 L415 90', 'M260 170 L105 265', 'M260 170 L415 265'];
const PINS = [[110, 230, 'Bengaluru', '#6d28d9'], [270, 160, 'Pune', '#ff6b57'], [420, 210, 'Remote', '#22c58b']];
const CONF = ['#6d28d9', '#ff6b57', '#22c58b', '#3b9cff', '#ffb020'];

export default function HrmsExplainer() {
  const root = useRef();
  const tlRef = useRef();
  const userPaused = useRef(false);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ro;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const sc = q('.hx-scene');
      const bubble = q('.hx-bubble p')[0];
      const mouth = q('.hx-mouth')[0];
      const arm = q('.hx-arm')[0];
      const armL = q('.hx-arm-l')[0];
      const browL = q('.hx-bl')[0], browR = q('.hx-br')[0];
      const prog = q('.hx-prog i')[0];

      /* ---- initial hidden states ---- */
      gsap.set(sc, { opacity: 0 });
      gsap.set(q('.hx-chip'), { scale: 0 });
      gsap.set(q('.hx-core'), { scale: 0 });
      gsap.set(q('.hx-tile'), { opacity: 0 });
      gsap.set(q('.hx-pinin'), { opacity: 0 });
      gsap.set(q('.hx-ping'), { opacity: 0 });
      gsap.set(q('.hx-toast'), { opacity: 0 });
      gsap.set(q('.hx-paycard'), { opacity: 0 });
      gsap.set(q('.hx-checks span'), { scale: 0 });
      gsap.set(q('.hx-done'), { scale: 0 });
      gsap.set(q('.hx-endlogo, .hx-endtxt, .hx-btn'), { opacity: 0 });

      /* ---- scale the 520x340 canvas to fit its box ---- */
      const view = q('.hx-view')[0], canvas = q('.hx-canvas')[0];
      const fit = () => {
        const s = view.clientWidth / 520;
        canvas.style.transform = `scale(${s})`;
        view.style.height = `${340 * s}px`;
      };
      fit();
      ro = new ResizeObserver(fit);
      ro.observe(view);

      /* ---- master timeline ---- */
      let cur = 0;
      const tl = gsap.timeline({
        repeat: -1, paused: true,
        onUpdate() {
          prog.style.transform = `scaleX(${tl.progress()})`;
          const idx = Math.min(SCENES.length - 1, Math.floor(tl.time() / DUR));
          if (idx !== cur) { cur = idx; setScene(idx); }
        },
      });
      tlRef.current = tl;

      SCENES.forEach((S, i) => {
        const t0 = i * DUR;
        const len = S.t.length;
        const typer = { n: 0 };
        const k = Math.max(1, Math.round((len * 0.04) / 0.28));

        tl.addLabel('s' + i, t0)
          // scene in / out
          .fromTo(sc[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t0)
          .to(sc[i], { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' }, t0 + DUR - 0.4)
          // presenter speaks: typed caption + moving mouth
          .fromTo(typer, { n: 0 }, {
            n: len, duration: len * 0.04, ease: 'none', immediateRender: false,
            onUpdate: () => { bubble.textContent = S.t.slice(0, Math.round(typer.n)); },
          }, t0 + 0.3)
          .fromTo(mouth, { attr: { ry: 1 } }, { attr: { ry: 7 }, duration: 0.14, repeat: 2 * k - 1, yoyo: true, ease: 'sine.inOut', immediateRender: false }, t0 + 0.3)
          // gestures + expression
          .to(arm, { rotation: S.arm, svgOrigin: '224 252', duration: 0.7, ease: 'power2.inOut' }, t0 + 0.2)
          .to(armL, { rotation: -S.arm * 0.7, svgOrigin: '76 252', duration: 0.7, ease: 'power2.inOut' }, t0 + 0.3)
          .to(browL, { rotation: S.worried ? -14 : 0, transformOrigin: '50% 50%', duration: 0.3 }, t0 + 0.2)
          .to(browR, { rotation: S.worried ? 14 : 0, transformOrigin: '50% 50%', duration: 0.3 }, t0 + 0.2);
        if (S.wave) tl.to(arm, { rotation: S.arm + 16, svgOrigin: '224 252', duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t0 + 1);
      });

      // scene 1 · chaos
      const chips = q('.hx-chip');
      tl.fromTo(chips, { scale: 0, rotation: 'random(-25,25)' }, { scale: 1, rotation: 'random(-9,9)', duration: 0.5, stagger: 0.18, ease: 'back.out(2)', immediateRender: false }, 0.5)
        .to(chips, { x: 'random(-7,7)', y: 'random(-7,7)', duration: 0.18, repeat: 9, yoyo: true, stagger: 0.05 }, 1.8);

      // scene 2 · everything comes together
      const t2 = DUR;
      tl.fromTo(q('.hx-core'), { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(1.8)', immediateRender: false }, t2 + 0.6)
        .fromTo(q('.hx-tile'), {
          x: (i) => [-200, 200, -200, 200][i], y: (i) => [-140, -140, 140, 140][i],
          scale: 0.2, opacity: 0, rotation: 'random(-40,40)',
        }, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)', immediateRender: false }, t2 + 1)
        .fromTo(q('.hx-link'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1, immediateRender: false }, t2 + 1.7)
        .to(q('.hx-core'), { scale: 1.08, yoyo: true, repeat: 3, duration: 0.3, ease: 'sine.inOut' }, t2 + 2.8);

      // scene 3 · teams in many places
      const t3 = DUR * 2;
      tl.fromTo(q('.hx-route'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut', immediateRender: false }, t3 + 0.6)
        .fromTo(q('.hx-pinin'), { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out', stagger: 0.4, immediateRender: false }, t3 + 0.8)
        .fromTo(q('.hx-ping'), { scale: 0, opacity: 0.6 }, { scale: 3.5, opacity: 0, duration: 0.9, stagger: 0.4, immediateRender: false }, t3 + 1.3)
        .fromTo(q('.hx-toast'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.4, ease: 'back.out(2)', immediateRender: false }, t3 + 2.2);

      // scene 4 · payroll + compliance
      const t4 = DUR * 3;
      const pay = { n: 0 };
      const num = q('.hx-count')[0];
      tl.fromTo(q('.hx-paycard'), { y: 40, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, t4 + 0.5)
        .fromTo(q('.hx-bar i'), { scaleX: 0 }, { scaleX: 1, duration: 2, ease: 'power1.inOut', immediateRender: false }, t4 + 1)
        .fromTo(pay, { n: 0 }, {
          n: 1240, duration: 2, ease: 'power1.inOut', immediateRender: false,
          onUpdate: () => { num.textContent = Math.round(pay.n).toLocaleString('en-IN'); },
        }, t4 + 1)
        .fromTo(q('.hx-checks span'), { scale: 0 }, { scale: 1, duration: 0.4, stagger: 0.7, ease: 'back.out(2.5)', immediateRender: false }, t4 + 1.2)
        .fromTo(q('.hx-done'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', immediateRender: false }, t4 + 3.1)
        .fromTo(q('.hx-conf i'), { x: 0, y: 0, opacity: 1, scale: 1 }, {
          x: 'random(-200,200)', y: 'random(-150,70)', rotation: 'random(-360,360)', opacity: 0, scale: 0.6,
          duration: 1.2, stagger: 0.02, ease: 'power3.out', immediateRender: false,
        }, t4 + 3.1);

      // scene 5 · wrap up
      const t5 = DUR * 4;
      tl.fromTo(q('.hx-endlogo'), { scale: 0, rotation: -20, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)', immediateRender: false }, t5 + 0.5)
        .fromTo(q('.hx-endtxt'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, immediateRender: false }, t5 + 1.2)
        .fromTo(q('.hx-btn'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, t5 + 1.8)
        .to(q('.hx-btn'), { scale: 1.08, yoyo: true, repeat: 5, duration: 0.35, ease: 'sine.inOut' }, t5 + 2.5)
        .to({}, { duration: 0.01 }, DUR * SCENES.length);

      /* ---- presenter idle life ---- */
      gsap.to('.hx-upper', { rotation: 1.2, svgOrigin: '150 440', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.hx-head', { y: -3, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.timeline({ repeat: -1, repeatDelay: 3 })
        .to('.hx-eye', { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1 });
      gsap.to('.hx-sp', { y: 'random(-18,18)', x: 'random(-12,12)', rotation: 'random(-60,60)', duration: 'random(2.5,4)', ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.3 });

      /* ---- entrance + only play while visible ---- */
      if (!reduce) {
        gsap.from('.hx-head-txt > *', { y: 36, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.hx-head-txt', start: 'top 85%', once: true } });
        gsap.from('.hx-host', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.hx-grid', start: 'top 80%', once: true } });
        gsap.from('.hx-screen', { x: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.hx-grid', start: 'top 80%', once: true } });
      } else {
        userPaused.current = true;
        setPlaying(false);
      }

      ScrollTrigger.create({
        trigger: root.current, start: 'top 75%', end: 'bottom 25%',
        onToggle: (self) => {
          if (self.isActive) { if (!userPaused.current) tl.play(); }
          else tl.pause();
        },
      });

    }, root);

    return () => { ro && ro.disconnect(); ctx.revert(); };
  }, []);

  const toggle = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.paused()) { userPaused.current = false; tl.play(); setPlaying(true); }
    else { userPaused.current = true; tl.pause(); setPlaying(false); }
  };
  const jump = (i) => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.seek('s' + i, false);
    userPaused.current = false;
    tl.play();
    setPlaying(true);
  };

  return (
    <section className="hx-section" id="why-hrms" ref={root}>
      <i className="hx-blob hx-b1" /><i className="hx-blob hx-b2" /><i className="hx-blob hx-b3" />

      <div className="hx-inner">
        <div className="hx-head-txt">
          <span className="hx-eyebrow">WHY HRMS?</span>
          <h2>Why every IT company needs an <em>HRMS</em></h2>
        </div>

        <div className="hx-grid">
          {/* presenter */}
          <div className="hx-host">
            <i className="hx-sp hx-sp1" /><i className="hx-sp hx-sp2" /><i className="hx-sp hx-sp3" /><i className="hx-sp hx-sp4" />
            <div className="hx-bubble"><p aria-live="polite" /></div>

            <svg className="hx-fig" viewBox="-20 0 340 440" role="img" aria-label="HR presenter explaining HRMS">
              <defs>
                <linearGradient id="hx-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff1e6" /><stop offset=".55" stopColor="#ffd9e4" /><stop offset="1" stopColor="#e6dcff" />
                </linearGradient>
                <radialGradient id="hx-skin" cx=".4" cy=".35" r=".85">
                  <stop offset="0" stopColor="#ffe3d0" /><stop offset="1" stopColor="#f0b08a" />
                </radialGradient>
                <linearGradient id="hx-hair" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#bd7742" /><stop offset="1" stopColor="#6b3a1d" />
                </linearGradient>
                <linearGradient id="hx-blz" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd6e1" /><stop offset="1" stopColor="#f59bb5" />
                </linearGradient>
                <radialGradient id="hx-iris" cx=".4" cy=".35" r=".85">
                  <stop offset="0" stopColor="#b3733f" /><stop offset="1" stopColor="#3b2212" />
                </radialGradient>
                <radialGradient id="hx-blush">
                  <stop offset="0" stopColor="#ff8fa6" stopOpacity=".65" /><stop offset="1" stopColor="#ff8fa6" stopOpacity="0" />
                </radialGradient>
                <clipPath id="hx-clip"><path d="M-60 -40 H360 V250 H320 A170 170 0 0 1 -20 250 H-60 Z" /></clipPath>
              </defs>

              <circle cx="150" cy="250" r="170" fill="url(#hx-g)" />

              <g clipPath="url(#hx-clip)">
                <g className="hx-upper">
                  {/* blazer + cream top */}
                  <path d="M52 440 V292 Q52 238 106 228 L194 228 Q248 238 248 292 V440Z" fill="url(#hx-blz)" />
                  <path d="M120 228 Q150 282 180 228Z" fill="#f7e8d5" />
                  <path d="M133 238 Q150 262 167 238" stroke="#e8b64c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M110 226 L150 304 L124 326 L98 248Z" fill="#ffc0d1" stroke="#f08aa6" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M190 226 L150 304 L176 326 L202 248Z" fill="#ffc0d1" stroke="#f08aa6" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="150" cy="338" r="4" fill="#f08aa6" />
                  <path d="M70 262 Q100 244 130 250" stroke="#fff" strokeWidth="6" opacity=".25" fill="none" strokeLinecap="round" />

                  {/* arms (animated) */}
                  <g className="hx-arm-l">
                    <line x1="76" y1="252" x2="58" y2="336" stroke="#f6a3ba" strokeWidth="30" strokeLinecap="round" />
                    <line x1="56" y1="330" x2="52" y2="338" stroke="#ffd6e1" strokeWidth="30" strokeLinecap="round" opacity=".6" />
                    <ellipse cx="55" cy="354" rx="12" ry="15" fill="url(#hx-skin)" />
                    <ellipse cx="67" cy="350" rx="4" ry="9" fill="#f5c3a2" transform="rotate(-20 67 350)" />
                  </g>
                  <g className="hx-arm">
                    <line x1="224" y1="252" x2="242" y2="336" stroke="#f6a3ba" strokeWidth="30" strokeLinecap="round" />
                    <line x1="244" y1="330" x2="248" y2="338" stroke="#ffd6e1" strokeWidth="30" strokeLinecap="round" opacity=".6" />
                    <ellipse cx="245" cy="354" rx="12" ry="15" fill="url(#hx-skin)" />
                    <ellipse cx="233" cy="350" rx="4" ry="9" fill="#f5c3a2" transform="rotate(20 233 350)" />
                  </g>

                  {/* neck + shadow */}
                  <rect x="134" y="168" width="32" height="64" rx="14" fill="url(#hx-skin)" />
                  <ellipse cx="150" cy="208" rx="26" ry="9" fill="#d99a74" opacity=".5" />

                  {/* shoulder-length hair (falls in front of the shoulders) */}
                  <g transform="translate(0 16)">
                  <path d="M92 118 C84 58 120 38 150 38 C182 38 216 58 208 118 C216 160 228 200 216 236 C196 226 190 196 190 150 L110 150 C110 196 104 226 84 236 C72 200 84 160 92 118Z" fill="url(#hx-hair)" />

                  {/* head */}
                  <g className="hx-head">
                    <ellipse cx="98" cy="134" rx="7" ry="10" fill="#f0b08a" />
                    <ellipse cx="202" cy="134" rx="7" ry="10" fill="#f0b08a" />
                    <circle cx="97" cy="145" r="3.2" fill="#e8b64c" />
                    <circle cx="203" cy="145" r="3.2" fill="#e8b64c" />
                    <ellipse cx="150" cy="124" rx="52" ry="58" fill="url(#hx-skin)" />
                    {/* side-swept fringe */}
                    <path d="M96 120 C90 66 122 44 152 44 C186 44 212 68 206 120 C200 100 186 84 164 78 C150 100 122 108 96 120Z" fill="url(#hx-hair)" />
                    <path d="M120 60 Q150 46 184 64" stroke="#e0a874" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6" />
                    {/* blush */}
                    <circle cx="118" cy="150" r="13" fill="url(#hx-blush)" />
                    <circle cx="182" cy="150" r="13" fill="url(#hx-blush)" />
                    {/* big expressive eyes */}
                    <g className="hx-eye">
                      <ellipse cx="130" cy="126" rx="14" ry="16" fill="#fff" />
                      <circle cx="131" cy="128" r="9.5" fill="url(#hx-iris)" />
                      <circle cx="131" cy="128" r="4.5" fill="#1d0f08" />
                      <circle cx="127" cy="122" r="3.2" fill="#fff" />
                      <circle cx="135" cy="133" r="1.6" fill="#fff" opacity=".8" />
                      <path d="M114 121 Q128 107 142 117" stroke="#2a160c" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>
                    <g className="hx-eye">
                      <ellipse cx="170" cy="126" rx="14" ry="16" fill="#fff" />
                      <circle cx="169" cy="128" r="9.5" fill="url(#hx-iris)" />
                      <circle cx="169" cy="128" r="4.5" fill="#1d0f08" />
                      <circle cx="165" cy="122" r="3.2" fill="#fff" />
                      <circle cx="173" cy="133" r="1.6" fill="#fff" opacity=".8" />
                      <path d="M158 117 Q172 107 186 121" stroke="#2a160c" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>
                    <path className="hx-bl" d="M114 97 Q130 88 146 96" stroke="#6b3a1d" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path className="hx-br" d="M154 96 Q170 88 186 97" stroke="#6b3a1d" strokeWidth="5" fill="none" strokeLinecap="round" />
                    {/* nose + mouth */}
                    <path d="M150 138 q-5 9 2 12" stroke="#d4906a" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M135 157 Q150 169 165 157" stroke="#d4506b" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <ellipse className="hx-mouth" cx="150" cy="160" rx="10" ry="1" fill="#7a1f34" />
                  </g>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          {/* "video" screen */}
          <div className="hx-screen">
            <div className="hx-top">
              <span className="hx-dots"><i /><i /><i /></span>
              <span className="hx-pill">NGriffinpay HRMS</span>
            </div>
            <div className="hx-prog"><i /></div>

            <div className="hx-view">
              <div className="hx-canvas">

                {/* 1 · chaos */}
                <div className="hx-scene hx-s1">
                  {CHAOS.map(([t, x, y]) => (
                    <div className="hx-chip" key={t} style={{ left: x, top: y }}>{t}</div>
                  ))}
                </div>

                {/* 2 · unified */}
                <div className="hx-scene hx-s2">
                  <svg className="hx-links" viewBox="0 0 520 340">
                    {LINKS.map((d) => (
                      <path key={d} className="hx-link" d={d} pathLength="1" />
                    ))}
                  </svg>
                  <div className="hx-core"><img src={logo} alt="NGriffinpay" /></div>
                  {TILES.map(([e, n, x, y]) => (
                    <div className="hx-tile" key={n} style={{ left: x, top: y }}><span>{e}</span><b>{n}</b></div>
                  ))}
                </div>

                {/* 3 · teams everywhere */}
                <div className="hx-scene hx-s3">
                  <svg className="hx-mapsvg" viewBox="0 0 520 340">
                    <path className="hx-route" d="M110 230 Q190 110 270 160 Q345 205 420 210" pathLength="1" />
                    {PINS.map(([x, y, name, c]) => (
                      <g key={name} transform={`translate(${x} ${y})`}>
                        <circle className="hx-ping" r="8" fill={c} />
                        <g className="hx-pinin">
                          <path d="M0 0 C-14 -18 -20 -28 -20 -38 a20 20 0 1 1 40 0 C20 -28 14 -18 0 0Z" fill={c} />
                          <circle cy="-38" r="8" fill="#fff" />
                          <text y="26" textAnchor="middle">{name}</text>
                        </g>
                      </g>
                    ))}
                  </svg>
                  {PINS.map(([x, y, name]) => (
                    <div className="hx-toast" key={name} style={{ left: x - 42, top: y + 44 }}>✅ Checked in</div>
                  ))}
                </div>

                {/* 4 · payroll */}
                <div className="hx-scene hx-s4">
                  <div className="hx-paycard">
                    <div className="hx-payhd"><span>Payroll run</span><em>This month</em></div>
                    <div className="hx-payn"><b className="hx-count">0</b><small>employees paid</small></div>
                    <div className="hx-bar"><i /></div>
                    <div className="hx-checks"><span>✓ PF</span><span>✓ ESI</span><span>✓ TDS</span></div>
                    <div className="hx-done">Done ✓</div>
                  </div>
                  <div className="hx-conf">
                    {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ background: CONF[i % CONF.length] }} />)}
                  </div>
                </div>

                {/* 5 · end card */}
                <div className="hx-scene hx-s5">
                  <img className="hx-endlogo" src={logo} alt="NGriffinpay" />
                  <p className="hx-endtxt">Smarter HR for IT teams</p>
                  <a className="hx-btn" href="#contact">Book a demo</a>
                </div>

              </div>
            </div>

            <div className="hx-ctrl">
              <button type="button" className="hx-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? '❚❚' : '▶'}
              </button>
              <div className="hx-steps">
                {SCENES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`hx-step ${i === scene ? 'hx-on' : ''}`}
                    onClick={() => jump(i)}
                    aria-label={`Scene ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
