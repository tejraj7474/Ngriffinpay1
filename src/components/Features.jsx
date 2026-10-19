import { useEffect, useRef } from 'react';
import { gsap } from '../gsap';
import { I, FEATURES } from '../data';

const Item = ({ i }) => (
  <article className="fitem">
    <img className="ico" src={I(`icon-${i}.png`)} alt="" />
    <h3>{FEATURES[i][0]}</h3>
    <p>{FEATURES[i][1]}</p>
  </article>
);

export default function Features() {
  const root = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.big', {
        scrollTrigger: { trigger: '.big', start: 'top 85%', end: 'top 40%', scrub: 1 },
        xPercent: -15, opacity: 0, scale: 1.15, transformOrigin: 'left',
      });
      // six items rise in, staggered
      gsap.from('.fitem', {
        scrollTrigger: { trigger: '.feat6', start: 'top 80%' },
        y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      });
      // middle photo parallax (moves slower than the page)
  gsap.fromTo('.fmid video', { yPercent: -8 }, {
  yPercent: 8, ease: 'none',
  scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
});
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pad feat-sec" id="products" ref={root}>
      <div className="feat-wrap">
        <h2 className="big">New-age HR software, built the way HR actually works</h2>
        <p className="lead">One global platform, one data model powered by AI, and full control over setup.</p>
        <div className="feat6">
          <div className="fcol">{[0, 1, 2].map(i => <Item key={i} i={i} />)}</div>
        <div className="fmid">
  <video
    src={I('team.mp4')}
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    aria-label="Team collaborating"
  />
</div>
          <div className="fcol">{[3, 4, 5].map(i => <Item key={i} i={i} />)}</div>
        </div>
      </div>
    </section>
  );
}