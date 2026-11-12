import { useEffect, useRef } from "react";
import { gsap } from "../gsap";
import { I } from "../data";
import Hero3D from "./Hero3D";

export default function Hero() {
  const root = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // word-by-word entrance
      gsap.from("h1 span", {
        yPercent: 110,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power4.out",
      });

      // pin lasts 300%: first 200% runs the animation,
      // the last 100% keeps the hero fixed while Features slides over it
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        .to(
          ".hero-content",
          { scale: 0.85, y: -50, opacity: 0.25, ease: "none" },
          0,
        )
        .fromTo(".ppl", { y: 220 }, { y: 0, ease: "none" }, 0.3)
        // hero dims slightly while the next section covers it
        .to(
          ".ppl",
          { scale: 0.94, opacity: 0.45, ease: "none", duration: 0.4 },
          0.8,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={root}>
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url(${I("mountain-bg1.jpg")})`,
          height: "800px",
        }}
      />
      <div className="hero-tint" />
      <Hero3D />

      <div className="hero-content">
        {/* <h1 aria-label="Modern people platform for growing enterprises">
          {"Modern people platform for growing enterprises"
            .split(" ")
            .map((w, i) => (
              <span key={i}>{w}&nbsp;</span>
            ))}
        </h1> */}
        <p>
          NGriffinPay – AI-Powered HRMS That Automates Workflows, Predicts
          Insights, Simplifies Payroll, and Transforms the Future of Workforce
          Management.
        </p>
        <div className="hero-btns">
          <a className="btn p" href="/contact-us">
            Get a free trial
          </a>
        </div>
      </div>

      <img
        className="ppl"
        src={I("people-foreground.png")}
        alt="Smiling HR team"
      />
    </section>
  );
}
