import { useEffect, useRef } from 'react';
import { gsap } from '../gsap';
import { I } from '../data';

export default function Integrations() {
  const root = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.big', {
        scrollTrigger: { trigger: '.big', start: 'top 85%', end: 'top 40%', scrub: 1 },
        xPercent: -15, opacity: 0, scale: 1.15, transformOrigin: 'left',
      });

      // logo grows from small, orbit icons fly out of it (reverses on scroll up)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=200%', scrub: 1, pin: true },
      });
      tl.fromTo('.core', { scale: 0.25 }, { scale: 1.2 }, 0);
      gsap.utils.toArray('.orb').forEach((o, i, a) => {
        const ang = (i / a.length) * Math.PI * 2 + Math.random() * 0.4;
        const rad = 200 + Math.random() * 130;
        tl.fromTo(
          o,
          { x: 0, y: 0, scale: 0, opacity: 0 },
          { x: Math.cos(ang) * rad * 1.5, y: Math.sin(ang) * rad, scale: 0.7 + Math.random() * 0.7, opacity: 1 },
          0.1 + i * 0.02
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="int dark" id="integrations" ref={root}>
      <h2 className="big c">We work with your existing stack</h2>
      <p className="c">100+ integrations — Salesforce, Jira, Xero, Stripe and more</p>
      <div className="orbit">
        <img className="core" src={I('logo-balloon.png')} alt="NGriffin Pay" />
        {Array.from({ length: 12 }).map((_, i) => (
          <img key={i} className="orb" src={I(`int-${i + 1}.png`)} alt="" />
        ))}
      </div>
    </section>
  );
}