import { useEffect, useRef } from 'react';
import { gsap } from '../gsap';
import { I, AI } from '../data';

export default function AiSection() {
  const root = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.big', {
        scrollTrigger: { trigger: '.big', start: 'top 85%', end: 'top 40%', scrub: 1 },
        xPercent: -15, opacity: 0, scale: 1.15, transformOrigin: 'left',
      });
      // cards: left slides in, center pops, right slides in
      const st = { trigger: root.current, start: 'top 70%' };
      gsap.from('.c0', { scrollTrigger: st, xPercent: -100, opacity: 0, duration: 1 });
      gsap.from('.c1', { scrollTrigger: st, scale: 0.3, opacity: 0, duration: 1, ease: 'back.out(1.6)' });
      gsap.from('.c2', { scrollTrigger: st, xPercent: 100, opacity: 0, duration: 1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ai dark pad" ref={root}>
      <h2 className="big">The AI layer that’ll be built into every part of your HR.</h2>
      <div className="feat">
        {AI.map((a, i) => (
          <article key={i} className={'col c' + i}>
            <img src={I(a[2])} alt={a[0]} />
            <h3>{a[0]}</h3>
            <p>{a[1]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}