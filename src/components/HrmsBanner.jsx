import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './HrmsBanner.css';

/* =====================================================================
   HrmsBanner — "One HRMS. Every Employee." image section (NGriffinpay)

   ISOLATED: no ScrollTrigger, no pinning, fixed layout. It only watches
   its own position, so other sections' scroll effects are not affected.

   Animations:
     • heading + text rise in when the section comes into view
     • image reveals with a clip-path wipe from the centre + zoom settle
     • pulse rings breathe over the centre circle of the image
     • light shine sweeps across the image every few seconds
     • gentle 3D tilt on mouse move (desktop) + slow drift while scrolling

   Usage (App.jsx, below <HrOrbit />):
     <HrmsBanner image="/images/one-hrms.jpg" />
   ===================================================================== */

export default function HrmsBanner({
  image = '/images/one-hrms.jpg',
  eyebrow = 'Built for every team',
  title = 'One HRMS. ',
  titleAccent = 'Every Employee.',
  text = 'Core HR, attendance, payroll, leave, performance, recruitment and compliance working together in one platform.',
}) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    const q = gsap.utils.selector(root); // only selects inside THIS section
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      gsap.set(q('.hbx-reveal'), { opacity: 1, y: 0 });
      gsap.set(frame, { clipPath: 'inset(0% 0% 0% 0% round 28px)' });
      return undefined;
    }

    // ---------- start state ----------
    gsap.set(q('.hbx-reveal'), { opacity: 0, y: 30 });
    gsap.set(frame, { clipPath: 'inset(12% 30% 12% 30% round 28px)' });
    gsap.set(img, { scale: 1.18 });
    gsap.set(q('.hbx-ring'), { opacity: 0, scale: 0.6 });
    gsap.set(q('.hbx-shine'), { skewX: -18, xPercent: -160 });

    // ---------- intro timeline (plays once, when visible) ----------
    const intro = gsap.timeline({ paused: true });
    intro
      .to(q('.hbx-reveal'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 })
      .to(frame, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.3, ease: 'power3.inOut' }, 0.2)
      .to(img, { scale: 1.06, duration: 1.6, ease: 'power3.out' }, 0.2)
      .to(q('.hbx-ring'), { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.15 }, 1.1)
      .add(() => startLoops(), 1.4);

    // ---------- looping effects ----------
    let loops = [];
    const startLoops = () => {
      // pulse rings over the centre circle
      q('.hbx-ring').forEach((ring, i) => {
        loops.push(
          gsap.fromTo(
            ring,
            { scale: 1, opacity: 0.55 },
            { scale: 1.6, opacity: 0, duration: 2.6, ease: 'sine.out', repeat: -1, delay: i * 0.85 }
          )
        );
      });
      // shine sweep
      loops.push(
        gsap.fromTo(
          q('.hbx-shine'),
          { xPercent: -160, skewX: -18 },
          { xPercent: 260, duration: 1.6, ease: 'power2.inOut', repeat: -1, repeatDelay: 3.5 }
        )
      );
      // soft floating blobs behind the card
      q('.hbx-blob').forEach((b, i) => {
        loops.push(
          gsap.to(b, {
            x: i ? -30 : 30,
            y: i ? 20 : -25,
            duration: 6 + i * 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        );
      });
    };

    // play intro when the section enters the viewport
    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played) {
          played = true;
          intro.play();
        }
        // pause loops while off screen to save CPU
        loops.forEach((t) => (entry.isIntersecting ? t.resume() : t.pause()));
      },
      { threshold: 0.25 }
    );
    io.observe(root);

    // ---------- slow drift while scrolling (only this section) ----------
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        // -1 (section below viewport) → 1 (section above)
        const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / (window.innerHeight / 2 + r.height / 2);
        gsap.to(img, { yPercent: p * -4, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });

    // ---------- tilt on mouse move (desktop only) ----------
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const tiltX = gsap.quickTo(frame, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const tiltY = gsap.quickTo(frame, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const onMove = (e) => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiltX(x * 6);
      tiltY(-y * 6);
    };
    const onLeave = () => {
      tiltX(0);
      tiltY(0);
    };
    if (canHover) {
      frame.addEventListener('pointermove', onMove);
      frame.addEventListener('pointerleave', onLeave);
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll, { capture: true });
      if (canHover) {
        frame.removeEventListener('pointermove', onMove);
        frame.removeEventListener('pointerleave', onLeave);
      }
      intro.kill();
      loops.forEach((t) => t.kill());
      loops = [];
      gsap.killTweensOf([frame, img]);
    };
  }, []);

  return (
    <section className="hbx-root" ref={rootRef} aria-labelledby="hbx-title">
      <span className="hbx-blob hbx-blob-a" aria-hidden="true" />
      <span className="hbx-blob hbx-blob-b" aria-hidden="true" />

      <div className="hbx-container">
        <header className="hbx-head">
          <span className="hbx-eyebrow hbx-reveal">{eyebrow}</span>
          <h2 id="hbx-title" className="hbx-title hbx-reveal">
            {title}
            <span>{titleAccent}</span>
          </h2>
          <p className="hbx-text hbx-reveal">{text}</p>
        </header>

        <div className="hbx-stage">
          <div className="hbx-frame" ref={frameRef}>
            <img
              ref={imgRef}
              className="hbx-img"
              src={image}
              alt="NGriffinpay HRMS modules: Core HR, Attendance, Payroll, Leave, Performance, Recruitment, Compliance and Employee Self-Service around one platform"
              width="1774"
              height="887"
              loading="lazy"
              decoding="async"
            />

            {/* pulse rings over the centre circle of the image */}
            <div className="hbx-rings" aria-hidden="true">
              <span className="hbx-ring" />
              <span className="hbx-ring" />
              <span className="hbx-ring" />
            </div>

            {/* light sweep */}
            <span className="hbx-shine" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
