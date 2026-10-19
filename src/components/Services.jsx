import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../gsap';
import { I, SERVICES } from '../data';

const popFrom = { y: 80, scale: 0.6, opacity: 0 };
const popTo = { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.5)' };

export default function Services() {
  const root = useRef(), dRef = useRef(), mRef = useRef(), tabsRef = useRef();
  const preloaded = useRef([]);
  const [act, setAct] = useState(0);

  // preload + decode every image up front so nothing loads late while scrolling
  useEffect(() => {
    preloaded.current = SERVICES.flatMap((_, i) =>
      [`svc-bg-${i}.jpg`, `svc-desktop-${i}.png`, `svc-mobile-${i}.png`].map(name => {
        const img = new Image();
        img.decoding = 'async';
        img.src = I(name);
        if (img.decode) img.decode().catch(() => {});
        return img; // kept in a ref so the browser doesn't garbage-collect them
      })
    );
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.big', {
        scrollTrigger: { trigger: '.big', start: 'top 85%', end: 'top 40%', scrub: 1 },
        xPercent: -15, opacity: 0, scale: 1.15, transformOrigin: 'left',
      });
      // sticky tabs: switch the active service by scroll progress
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: 'bottom bottom',
        onUpdate: s => setAct(Math.min(SERVICES.length - 1, Math.floor(s.progress * SERVICES.length))),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // layered visuals: hide before paint, then pop in once the images are decoded
  useLayoutEffect(() => {
    const d = dRef.current, m = mRef.current;
    if (!d || !m) return;

    gsap.set([d, m], popFrom);

    let dead = false, tl;
    Promise.all(
      [d, m].map(el => (el.decode ? el.decode().catch(() => {}) : Promise.resolve()))
    ).then(() => {
      if (dead) return;
      tl = gsap.timeline();
      tl.to(d, popTo).to(m, popTo, 0.25);
    });

    return () => { dead = true; if (tl) tl.kill(); };
  }, [act]);

  // mobile only: keep the active tab visible in the swipeable tab strip
useEffect(() => {
  if (!window.matchMedia('(max-width: 768px)').matches) return; // skip on desktop
  const ul = tabsRef.current;
  const el = ul && ul.children[act];
  if (!el) return;
  ul.scrollTo({
    left: el.offsetLeft - (ul.clientWidth - el.offsetWidth) / 2, // centre the active tab
    behavior: 'smooth',
  });
}, [act]);
  return (
    <section className="svc" ref={root} style={{ height: `${SERVICES.length * 100}vh` }}>
      <div className="stick">
        <h2 className="big">One platform to unify people, processes, and experiences</h2>
        <div className="row">
        <ul className="tabs" ref={tabsRef}>
            {SERVICES.map((s, i) => (
              <li key={i} className={i === act ? 'on' : ''}><a href={`#svc-${i}`}>{s[0]}</a></li>
            ))}
          </ul>
          <div className="vis" id={`svc-${act}`} style={{ backgroundImage: `url(${I('svc-bg-' + act + '.jpg')})` }}>
            <small>{SERVICES[act][0].toUpperCase()}</small>
            <h3>{SERVICES[act][1]}</h3>
            <p>{SERVICES[act][2]}</p>
            <img ref={dRef} className="d" src={I(`svc-desktop-${act}.png`)} alt={SERVICES[act][0] + ' desktop'} decoding="async" />
            <img ref={mRef} className="m" src={I(`svc-mobile-${act}.png`)} alt={SERVICES[act][0] + ' mobile'} decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}