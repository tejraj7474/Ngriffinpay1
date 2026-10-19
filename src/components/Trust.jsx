import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../gsap';
import { I } from '../data';
import './Trust.css';

const SLIDE_S = 7; // seconds each testimonial stays in front

const SLIDES = [
  {
    bg: 'trust-bg-1.jpg',
    company: 'MOURI TECH',
    quote:
      'We run 900+ employees across five continents on NGriffin Pay. The interface makes every check before we disburse salaries painless instead of complicated.',
    name: 'Satish Malla',
    role: 'HR Manager',
  },
  {
    bg: 'trust-bg-2.jpg',
    company: 'ACME CORP',
    quote:
      'Payroll that used to take us four days now closes in a few hours, and compliance is handled before we even ask.',
    name: 'Priya Nair',
    role: 'Head of People',
  },
  {
    bg: 'trust-bg-3.jpg',
    company: 'BRIGHTWAVE',
    quote:
      'Attendance, leave and payroll finally live in one place. Our team stopped chasing spreadsheets.',
    name: 'Rahul Verma',
    role: 'Finance Director',
  },
];

// placeholder numbers: replace with your real figures
const STATS = [
  { v: 99.9, d: 1, suf: '%', label: 'Payroll accuracy' },
  { v: 500, d: 0, suf: '+', label: 'Companies onboarded' },
  { v: 24, d: 0, suf: '/7', label: 'Compliance monitoring' },
];

const BADGES = [
  'digital.png',
  // 'jainfarms.png',
  'inspireon.png',
  'dls.png',
  'toothwala.png',
];
const RING = [...BADGES, ...BADGES]; // 8 tiles around the 3D ring
const RING_R = 230;                  // ring radius in px

const pose = (o) => ({
  x: o * 46,
  y: o * -26,
  z: -o * 110,
  rotationY: -o * 7,
  opacity: o > 2 ? 0 : 1 - o * 0.18,
});

export default function Trust() {
  const root = useRef();
  const stack = useRef();
  const cards = useRef([]);
  const bars = useRef([]);
  const auto = useRef();
  const spin = useRef();
  const first = useRef(true);
  const prev = useRef(0);
  const [active, setActive] = useState(0);
  const n = SLIDES.length;

  /* ---------- 3D card stack layout (runs before paint) ---------- */
  useLayoutEffect(() => {
    const els = cards.current;
    els.forEach((c, i) => {
      const o = (i - active + n) % n;
      const p = pose(o);
      const dim = c.querySelector('.trx-dim');

      if (first.current) {
        gsap.set(c, { xPercent: -50, yPercent: -50, ...p });
        gsap.set(dim, { opacity: o * 0.32 });
        return;
      }

      if (i === prev.current && o === n - 1 && n > 2) {
        // old front card flies out, then tucks in at the back
        gsap.timeline()
          .to(c, { x: -260, rotationZ: -7, opacity: 0, duration: 0.4, ease: 'power2.in' })
          .set(c, { rotationZ: 0, x: p.x, y: p.y, z: p.z, rotationY: p.rotationY })
          .to(c, { opacity: p.opacity, duration: 0.5 });
      } else {
        gsap.to(c, { ...p, duration: 0.9, ease: 'power3.inOut', overwrite: 'auto' });
      }
      gsap.to(dim, { opacity: o * 0.32, duration: 0.9 });
    });
    first.current = false;
    prev.current = active;
  }, [active, n]);

  /* ---------- autoplay: progress bar drives the slide change ---------- */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set(bars.current, { scaleX: 0 });
    const tw = gsap.fromTo(
      bars.current[active],
      { scaleX: 0 },
      { scaleX: 1, duration: SLIDE_S, ease: 'none', onComplete: () => setActive((a) => (a + 1) % n) }
    );
    auto.current = tw;
    return () => tw.kill();
  }, [active, n]);

  /* ---------- entrance, counters, badge ring ---------- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const st = (trigger, start = 'top 80%') => ({ trigger, start, once: true });

      gsap.utils.toArray('.trx-stat b').forEach((el) => {
        const v = +el.dataset.v, d = +el.dataset.d;
        if (reduce) { el.textContent = v.toFixed(d); return; }
        const o = { n: 0 };
        el.textContent = (0).toFixed(d);
        gsap.to(o, {
          n: v, duration: 1.8, ease: 'power2.out',
          scrollTrigger: st(el.parentNode, 'top 85%'),
          onUpdate: () => { el.textContent = o.n.toFixed(d); },
        });
      });

      if (reduce) return;

      gsap.from('.trx-head > *', { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: st('.trx-head') });
      gsap.from('.trx-stat', { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: st('.trx-stats', 'top 85%') });
      gsap.from('.trx-item', { x: -40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: st('.trx-main') });
      gsap.from('.trx-stagewrap', { y: 90, scale: 0.88, opacity: 0, duration: 1.1, ease: 'back.out(1.3)', scrollTrigger: st('.trx-main') });
      gsap.from('.trx-ringwrap', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: st('.trx-ringsec', 'top 85%') });

      spin.current = gsap.fromTo('.trx-ring', { rotationY: 0 }, { rotationY: -360, duration: 40, ease: 'none', repeat: -1 });

      // floating glow orbs
      gsap.to('.trx-orb', { y: 'random(-40,40)', x: 'random(-40,40)', duration: 'random(5,8)', ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.6 });
    }, root);

    return () => { ctx.revert(); gsap.killTweensOf(cards.current); };
  }, []);

  /* ---------- 3D tilt on mouse move ---------- */
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(stack.current, { rotationY: -10 + px * 14, rotationX: 4 - py * 10, duration: 0.6, ease: 'power2.out' });
  };
  const onEnter = () => auto.current && auto.current.pause();
  const onLeave = () => {
    auto.current && auto.current.resume();
    gsap.to(stack.current, { rotationY: -10, rotationX: 4, duration: 0.8, ease: 'power3.out' });
  };
  const ringSlow = (t) => spin.current && gsap.to(spin.current, { timeScale: t, duration: 0.6 });

  return (
    <section className="trx-section" id="trust" ref={root}>
      <i className="trx-orb trx-o1" /><i className="trx-orb trx-o2" /><i className="trx-orb trx-o3" />

      <div className="trx-inner">
        {/* header */}
        <div className="trx-head">
          <span className="trx-eyebrow">SECURITY, SCALE &amp; RELIABILITY</span>
          <h2>Built to perform. <em>Trusted at scale.</em></h2>
          <p>
            NGriffin Pay stays updated with every federal, state and local payroll
            rule, so you never worry about tax changes or compliance gaps.
          </p>
        </div>

        {/* stats */}
        <div className="trx-stats">
          {STATS.map((s) => (
            <div className="trx-stat" key={s.label}>
              <div><b data-v={s.v} data-d={s.d}>{s.v}</b><span>{s.suf}</span></div>
              <small>{s.label}</small>
            </div>
          ))}
        </div>

        {/* testimonials: list + 3D stack */}
        <div className="trx-main">
          <ul className="trx-list">
            {SLIDES.map((s, i) => (
              <li key={s.company}>
                <button
                  type="button"
                  className={`trx-item ${i === active ? 'trx-on' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="trx-no">0{i + 1}</span>
                  <span className="trx-meta">
                    <b>{s.company}</b>
                    <small>{s.name} · {s.role}</small>
                  </span>
                  <span className="trx-pbar"><i ref={(el) => (bars.current[i] = el)} /></span>
                </button>
              </li>
            ))}
          </ul>

          <div className="trx-stagewrap" onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <div className="trx-stack" ref={stack}>
              {SLIDES.map((s, i) => (
                <article
                  key={s.company}
                  className="trx-card"
                  ref={(el) => (cards.current[i] = el)}
                  onClick={() => setActive(i)}
                >
                  <div className="trx-cardbg" style={{ backgroundImage: `url(${I(s.bg)})` }} />
                  <div className="trx-shade" />
                  <span className="trx-pill">{s.company}</span>
                  <span className="trx-qm">“</span>
                  <div className="trx-body">
                    <p>{s.quote}</p>
                    <div className="trx-who">
                      <span className="trx-av">{s.name[0]}</span>
                      <div><strong>{s.name}</strong><small>{s.role}</small></div>
                    </div>
                  </div>
                  <i className="trx-dim" />
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* 3D rotating badge ring */}
        <div className="trx-ringsec">
          <small className="trx-ringlabel">AWARDS &amp; RECOGNITION</small>
          <div className="trx-ringwrap" onMouseEnter={() => ringSlow(0.15)} onMouseLeave={() => ringSlow(1)}>
            <div className="trx-ringtilt">
              <div className="trx-ring">
                {RING.map((b, i) => (
                  <div
                    className="trx-tile"
                    key={i}
                    style={{ transform: `rotateY(${(i * 360) / RING.length}deg) translateZ(${RING_R}px)` }}
                  >
                    <img src={I(b)} alt="Award badge" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            <i className="trx-floor" />
          </div>
        </div>
      </div>
    </section>
  );
}
