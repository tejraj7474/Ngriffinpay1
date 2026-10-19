import { useEffect, useState } from 'react';
import { I } from '../data';
import './Trust.css';

const SLIDE_MS = 7000;   // testimonial slider: 7s (use anything 5000–10000)
const LOGO_MS = 5000;    // badges slider: 5s


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

const BADGES = [
  'digital.png',
//   'jainfarms.png',
   'inspireon.png',
  'dls.png',
  'toothwala.png'
];

export default function Trust() {
  /* ---------- testimonial slider ---------- */
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setActive((a) => (a + 1) % SLIDES.length),
      SLIDE_MS
    );
    return () => clearTimeout(t); // restarts whenever `active` changes (arrows/bars too)
  }, [active]);

  const prev = () => setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setActive((a) => (a + 1) % SLIDES.length);

  /* ---------- badges slider (infinite loop) ---------- */
  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimate(true);
      setIdx((i) => i + 1);
    }, LOGO_MS);
    return () => clearInterval(t);
  }, []);

  // when we've slid past the real list, jump back to 0 without animation
  const onTrackEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (idx >= BADGES.length) {
      setAnimate(false);
      setIdx(0);
    }
  };

  return (
    <section className="trust" id="trust">
      <div className="trust-inner">
        {/* header row */}
        <div className="trust-head">
          <div className="trust-copy">
            <span className="trust-eyebrow">SECURITY, SCALE &amp; RELIABILITY</span>
            <h2>NGriffin Pay is built to perform and trusted at scale</h2>
            <p>
              NGriffin Pay stays updated with every federal, state and local payroll
              rule, so you never worry about tax changes or compliance gaps.
            </p>
          </div>

          
        </div>

        {/* testimonial slider */}
        <div className="tslider">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`tslide ${i === active ? 'on' : ''}`}
              style={{ backgroundImage: `url(${I(s.bg)})` }}
              aria-hidden={i !== active}
            />
          ))}
          <div className="tslider-shade" />

          {/* progress bars */}
          <div className="tbars">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`tbar ${i < active ? 'done' : ''} ${i === active ? 'run' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <i style={{ animationDuration: `${SLIDE_MS}ms` }} />
              </button>
            ))}
          </div>

          <div className="tcompany">{SLIDES[active].company}</div>

          <div className="tbody" key={active}>
            <p>{SLIDES[active].quote}</p>
            <strong>{SLIDES[active].name}</strong>
            <small>{SLIDES[active].role}</small>
          </div>

          <div className="tarrows">
            <button onClick={prev} aria-label="Previous">←</button>
            <button onClick={next} aria-label="Next">→</button>
          </div>
        </div>

        {/* badges slider */}
        <div className="badges">
          <div
            className={`badges-track ${animate ? 'anim' : ''}`}
            style={{ '--i': idx }}
            onTransitionEnd={onTrackEnd}
          >
            {[...BADGES, ...BADGES].map((b, i) => (
              <div className="badge" key={i}>
                <img src={I(b)} alt="Award badge" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}