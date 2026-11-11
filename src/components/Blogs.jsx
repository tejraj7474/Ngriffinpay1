// Blogs.jsx
// NGriffinPay  — Blog listing page ("Our Blogs")
// Section 1: Hero — heading, search, and the latest post as a featured "magazine stack"
// Section 2: Category chips + searchable card grid (GSAP reveal on filter)
// Section 3: Demo CTA band
// Posts come from ./blogData.js — single post page is BlogPost.jsx (route /blog/:slug).
// Header & Footer come from App.jsx (your existing site components).
//
// Needs: gsap, react-router-dom (both already in the project)

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES, formatDate, readTime, sortedPosts } from "./blogData";
import "./Blogs.css";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const postUrl = (p) => `/blog/${p.slug}`;

function Icon({ name, size = 16 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "cal":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function BlogCard({ post, compact = false }) {
  return (
    <article className={`blg-card ${compact ? "is-compact" : ""}`}>
      <Link
        to={postUrl(post)}
        className="blg-card-img"
        aria-label={post.title}
        tabIndex={-1}
      >
        <img src={post.image} alt="" loading="lazy" />
        <span className="blg-card-cat">{post.category}</span>
      </Link>
      <div className="blg-card-body">
        <div className="blg-meta">
          <span>
            <Icon name="cal" size={13} /> {formatDate(post.date)}
          </span>
          <span>
            <Icon name="clock" size={13} /> {readTime(post)} min read
          </span>
        </div>
        <h3>
          <Link to={postUrl(post)}>{post.title}</Link>
        </h3>
        {!compact && <p>{post.excerpt}</p>}
        <Link to={postUrl(post)} className="blg-more">
          Read More <Icon name="arrow" size={15} />
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Blogs() {
  const posts = useMemo(() => sortedPosts(), []);
  const featured = posts[0];
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const chipsRef = useRef(null);

  useEffect(() => {
    document.title = "Blog | NGriffinPay  — HR & Payroll insights";
  }, []);

  const shown = posts.filter((p) => {
    const q = query.trim().toLowerCase();
    const inCat = cat === "All" || p.category === cat;
    const inQ =
      !q || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q);
    return inCat && inQ;
  });

  // hero entrance + magazine stack fan
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".blg-hero-copy > *", {
        y: 26,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
      })
        .from(
          ".blg-paper",
          { y: 60, rotation: 0, opacity: 0, stagger: 0.1, duration: 0.7 },
          "-=0.4",
        )
        .from(".blg-feat", { y: 70, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(
          ".blg-feat-badge",
          { scale: 0, duration: 0.4, ease: "back.out(2.5)" },
          "-=0.2",
        );
      gsap.to(".blg-paper.p1", {
        rotation: -7,
        y: -4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".blg-paper.p2", {
        rotation: 5,
        y: -6,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // grid reveal on load / filter change
  useLayoutEffect(() => {
    if (prefersReduced() || !gridRef.current) return undefined;
    const cards = gridRef.current.querySelectorAll(".blg-card, .blg-empty");
    const tw = gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.5,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
    return () => tw.kill();
  }, [cat, query]);

  // keep the active chip in view on small screens
  useEffect(() => {
    const strip = chipsRef.current;
    const chip = strip?.querySelector(".is-on");
    if (!strip || !chip) return;
    const left = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
    strip.scrollTo({
      left: Math.max(0, left),
      behavior: prefersReduced() ? "auto" : "smooth",
    });
  }, [cat]);

  return (
    <main className="blg-page">
      {/* ---------- Hero ---------- */}
      <section className="blg-hero" ref={heroRef}>
        <div className="blg-hero-bg" aria-hidden>
          <span className="blg-blob b1" />
          <span className="blg-blob b2" />
          <span className="blg-grid-bg" />
        </div>
        <div className="blg-container blg-hero-grid">
          <div className="blg-hero-copy">
            <span className="blg-eyebrow">
              <Icon name="book" size={14} /> NGriffinPay Blog
            </span>
            <h1>
              Our <span>Blogs</span>
            </h1>
            <p>
              Practical guides, compliance updates and everyday HR know-how for
              growing Indian businesses — written by the team behind NGriffinPay
              .
            </p>
            <label className="blg-search">
              <Icon name="search" size={18} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search articles"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  document
                    .getElementById("blg-all")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <Icon name="x" size={15} />
                </button>
              )}
            </label>
            <div className="blg-stats">
              <span>
                <b>{posts.length}</b> articles
              </span>
              <span>
                <b>{CATEGORIES.length - 1}</b> topics
              </span>
              <span>
                Updated <b>{formatDate(featured.date)}</b>
              </span>
            </div>
          </div>

          <div className="blg-stack">
            <span className="blg-paper p1" aria-hidden />
            <span className="blg-paper p2" aria-hidden />
            <Link to={postUrl(featured)} className="blg-feat">
              <span className="blg-feat-img">
                <img src={featured.image} alt="" />
                <span className="blg-feat-badge">
                  <Icon name="spark" size={12} /> Latest
                </span>
              </span>
              <span className="blg-feat-body">
                <span className="blg-meta">
                  <span className="blg-pill">{featured.category}</span>
                  <span>
                    <Icon name="cal" size={13} /> {formatDate(featured.date)}
                  </span>
                  <span>
                    <Icon name="clock" size={13} /> {readTime(featured)} min
                  </span>
                </span>
                <span className="blg-feat-title">{featured.title}</span>
                <span className="blg-feat-ex">{featured.excerpt}</span>
                <span className="blg-more">
                  Read article <Icon name="arrow" size={15} />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- All posts ---------- */}
      <section className="blg-list" id="blg-all">
        <div className="blg-container">
          <div className="blg-list-head">
            <h2>
              {cat === "All" ? "All articles" : cat}
              {query && <small> · results for “{query}”</small>}
            </h2>
            <div
              className="blg-chips"
              ref={chipsRef}
              role="tablist"
              aria-label="Filter by topic"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={cat === c}
                  className={`blg-chip ${cat === c ? "is-on" : ""}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                  <em>
                    {c === "All"
                      ? posts.length
                      : posts.filter((p) => p.category === c).length}
                  </em>
                </button>
              ))}
            </div>
          </div>

          <div className="blg-grid" ref={gridRef}>
            {shown.length ? (
              shown.map((p) => <BlogCard key={p.slug} post={p} />)
            ) : (
              <div className="blg-empty">
                <Icon name="search" size={28} />
                <b>No articles found</b>
                <span>Try a different word or topic.</span>
                <button
                  type="button"
                  className="blg-chip is-on"
                  onClick={() => {
                    setQuery("");
                    setCat("All");
                  }}
                >
                  Show all articles
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="blg-cta-wrap">
        <div className="blg-container">
          <div className="blg-cta">
            <div>
              <h2>Spend less time on payroll, more on your people.</h2>
              <p>
                See how NGriffinPay automates attendance, payroll and statutory
                compliance for your team.
              </p>
            </div>
            <Link to="/contact-us" className="blg-btn">
              Request a Demo <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
