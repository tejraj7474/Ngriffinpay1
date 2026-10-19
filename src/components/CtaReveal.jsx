import { useEffect, useRef } from 'react';
import { gsap } from '../gsap';
import { I } from '../data';
import './CtaReveal.css';

export default function CtaReveal() {
  const root = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // logo rises from behind the mountain while the stage stays sticky
      gsap.fromTo(
        '.cr-logo',
        { yPercent: 80, scale: 0.9, opacity: 0.35 },
        {
          yPercent: 0, scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      // heading + buttons fade in as the section arrives
      gsap.fromTo(
        '.cr-copy',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            end: 'top top',
            scrub: 1,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cr" ref={root}>
      <div className="cr-stage">
        {/* 1. sky */}
    <img
  className="cr-sky"
  src={I('cta-sky.jpg')}      // ← your background image
  alt=""
  aria-hidden="true"
/>

        {/* 2. big logo (replaces the "keka" wordmark) */}
        <img
          className="cr-logo"
          src={I('ngriffinpay-logo.png')}
          alt="NGriffinpay"
        />

        {/* 3. fixed mountain image (swap file name for your own) */}
        <img
          className="cr-mountain"
          src={I('cta-mountain.png')}
          alt=""
          aria-hidden="true"
        />

        {/* 4. purple filter over the whole scene */}
        <div className="cr-tint" />

        {/* 5. content */}
        <div className="cr-copy">
          
         
        </div>
      </div>
    </section>
  );
}