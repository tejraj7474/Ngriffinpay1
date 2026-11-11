// BlogPost.jsx
// NGriffinPay  — single blog post page (route: /blog/:slug)
// • Reading progress bar   • Hero with breadcrumb, meta, share and cover image
// • Article with rich blocks (headings, lists, callouts, tables, quotes)
// • Sticky "On this page" contents that highlights the section you're reading
// • Share buttons (WhatsApp, LinkedIn, X, copy link) + demo CTA card
// • "Keep reading" related posts + BlogPosting schema for SEO
// Posts come from ./blogData.js. Header & Footer come from App.jsx.
//
// Needs: gsap, react-router-dom (both already in the project)

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import {
  formatDate,
  getPost,
  readTime,
  slugify,
  sortedPosts,
} from "./blogData";
import { BlogCard } from "./Blogs";
import "./BlogPost.css";

gsap.registerPlugin(ScrollTrigger);

const SITE = "https://NGriffinPay .in";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    case "back":
      return (
        <svg {...p}>
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "list":
      return (
        <svg {...p}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "link":
      return (
        <svg {...p}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "bulb":
      return (
        <svg {...p}>
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "x":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- inline **bold** ---------- */
function Rich({ text }) {
  const parts = String(text).split("**");
  return parts.map((t, i) =>
    i % 2 ? <strong key={i}>{t}</strong> : <Fragment key={i}>{t}</Fragment>,
  );
}

/* ---------- content blocks ---------- */
function Block({ b }) {
  switch (b.type) {
    case "h2":
      return (
        <h2 id={slugify(b.text)} className="bpo-h2">
          <Rich text={b.text} />
        </h2>
      );
    case "h3":
      return (
        <h3>
          <Rich text={b.text} />
        </h3>
      );
    case "list":
      return (
        <ul className="bpo-list">
          {b.items.map((x, i) => (
            <li key={i}>
              <span className="bpo-bullet" aria-hidden>
                <Icon name="check" size={10} />
              </span>
              <span>
                <Rich text={x} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="bpo-steps">
          {b.items.map((x, i) => (
            <li key={i}>
              <span className="bpo-step-n">{i + 1}</span>
              <span>
                <Rich text={x} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside className="bpo-callout">
          <span className="bpo-callout-ic">
            <Icon name="bulb" size={18} />
          </span>
          <div>
            {b.title && <b>{b.title}</b>}
            <p>
              <Rich text={b.text} />
            </p>
          </div>
        </aside>
      );
    case "quote":
      return (
        <blockquote className="bpo-quote">
          <Rich text={b.text} />
        </blockquote>
      );
    case "table":
      return (
        <div className="bpo-table-wrap">
          <table className="bpo-table">
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "img":
      return (
        <figure className="bpo-fig">
          <img src={b.src} alt={b.alt || ""} loading="lazy" />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    default:
      return (
        <p>
          <Rich text={b.text} />
        </p>
      );
  }
}

/* ---------- share ---------- */
function Share({ post, compact = false }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `${SITE}/blog/${post.slug}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(post.title);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* blocked */
    }
  };
  return (
    <div className={`bpo-share ${compact ? "is-compact" : ""}`}>
      {!compact && <span className="bpo-share-lbl">Share</span>}
      <a
        className="wa"
        href={`https://wa.me/?text=${t}%20${u}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
      >
        <Icon name="whatsapp" size={16} />
      </a>
      <a
        className="li"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <Icon name="linkedin" size={15} />
      </a>
      <a
        className="xx"
        href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <Icon name="x" size={14} />
      </a>
      <button
        type="button"
        className={copied ? "is-done" : ""}
        onClick={copy}
        aria-label="Copy link"
      >
        <Icon name={copied ? "check" : "link"} size={15} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const articleRef = useRef(null);
  const [activeId, setActiveId] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const [pct, setPct] = useState(0);

  const toc = post
    ? post.content
        .filter((b) => b.type === "h2")
        .map((b) => ({
          id: slugify(b.text),
          text: b.text.replace(/\*\*/g, ""),
        }))
    : [];
  const related = post
    ? sortedPosts()
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3)
    : [];

  // title + scroll to top on post change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} | NGriffinPay  Blog`;
    setTocOpen(false);
  }, [slug, post]);

  // reading progress
  useEffect(() => {
    if (!post) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = articleRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const done = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.3 - r.top) / Math.max(1, total)),
      );
      if (barRef.current) barRef.current.style.transform = `scaleX(${done})`;
      setPct(Math.round(done * 100));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [post]);

  // scrollspy for contents
  useEffect(() => {
    if (
      !post ||
      !articleRef.current ||
      typeof IntersectionObserver === "undefined"
    )
      return undefined;
    const heads = articleRef.current.querySelectorAll(".bpo-h2");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    if (heads[0]) setActiveId(heads[0].id);
    return () => io.disconnect();
  }, [post]);

  // entrance
  useLayoutEffect(() => {
    if (!post || prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".bpo-hero-copy > *", {
        y: 24,
        opacity: 0,
        stagger: 0.07,
        duration: 0.55,
      })
        .from(
          ".bpo-cover",
          { y: 50, opacity: 0, scale: 0.97, duration: 0.8 },
          "-=0.35",
        )
        .from(
          ".bpo-side > *",
          { x: 30, opacity: 0, stagger: 0.1, duration: 0.5 },
          "-=0.4",
        );
      rootRef.current.querySelectorAll(".bpo-article > *").forEach((el) => {
        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      gsap.from(".bpo-related .blg-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: { trigger: ".bpo-related", start: "top 80%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [post]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" });
    setTocOpen(false);
  };

  if (!post) {
    return (
      <main className="bpo-page">
        <section className="bpo-missing">
          <h1>Article not found</h1>
          <p>This post may have moved. Browse all our articles instead.</p>
          <Link to="/blog" className="bpo-btn">
            <Icon name="back" size={16} /> Back to Blogs
          </Link>
        </section>
      </main>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "NGriffinPay ", url: SITE },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  };

  return (
    <main className="bpo-page" ref={rootRef}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bpo-progress" aria-hidden>
        <i ref={barRef} />
      </div>

      {/* ---------- Hero ---------- */}
      <header className="bpo-hero">
        <div className="bpo-hero-bg" aria-hidden>
          <span className="bpo-blob b1" />
          <span className="bpo-blob b2" />
          <span className="bpo-grid-bg" />
        </div>
        <div className="bpo-container">
          <div className="bpo-hero-copy">
            <nav className="bpo-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blog">Blogs</Link>
              <span>/</span>
              <b>{post.category}</b>
            </nav>
            <span className="bpo-cat">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="bpo-ex">{post.excerpt}</p>
            <div className="bpo-meta-row">
              <span className="bpo-author">
                <span className="bpo-author-logo">
                  <img src={I("ngriffinpay-mark.png")} alt="" />
                </span>
                <span>
                  <b>{post.author}</b>
                  <small>NGriffinPay </small>
                </span>
              </span>
              <span className="bpo-meta">
                <Icon name="cal" size={14} /> {formatDate(post.date)}
              </span>
              <span className="bpo-meta">
                <Icon name="clock" size={14} /> {readTime(post)} min read
              </span>
              <Share post={post} compact />
            </div>
          </div>
          <figure className="bpo-cover">
            <img src={post.image} alt={post.title} />
          </figure>
        </div>
      </header>

      {/* ---------- Body ---------- */}
      <section className="bpo-body">
        <div className="bpo-container bpo-body-grid">
          <div className="bpo-main">
            {toc.length > 1 && (
              <div className={`bpo-toc-m ${tocOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  onClick={() => setTocOpen((o) => !o)}
                  aria-expanded={tocOpen}
                >
                  <Icon name="list" size={16} /> On this page{" "}
                  <span className="bpo-toc-pct">{pct}%</span>{" "}
                  <Icon name="chev" size={16} />
                </button>
                <div className="bpo-toc-m-drawer">
                  <ol>
                    {toc.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={activeId === h.id ? "is-on" : ""}
                          onClick={goTo(h.id)}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            <article className="bpo-article" ref={articleRef}>
              {post.content.map((b, i) => (
                <Block key={i} b={b} />
              ))}
            </article>

            <div className="bpo-end">
              <Link to="/blog" className="bpo-back">
                <Icon name="back" size={16} /> All articles
              </Link>
              <Share post={post} />
            </div>
          </div>

          <aside className="bpo-side">
            {toc.length > 1 && (
              <div className="bpo-toc">
                <div className="bpo-toc-h">
                  <span>On this page</span>
                  <span
                    className="bpo-ring"
                    style={{ "--p": pct }}
                    aria-label={`${pct}% read`}
                  >
                    <b>{pct}%</b>
                  </span>
                </div>
                <ol>
                  {toc.map((h, i) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={activeId === h.id ? "is-on" : ""}
                        onClick={goTo(h.id)}
                      >
                        <span className="bpo-toc-n">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="bpo-side-cta">
              <span className="bpo-side-logo">
                <img src={I("ngriffinpay-mark.png")} alt="" />
              </span>
              <b>Put payroll & compliance on autopilot</b>
              <p>Attendance, payroll, PF, ESI and PT — handled in one place.</p>
              <Link to="/contact-us" className="bpo-btn">
                Request a Demo <Icon name="arrow" size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="bpo-related">
          <div className="bpo-container">
            <div className="bpo-related-h">
              <h2>Keep reading</h2>
              <Link to="/blog" className="bpo-back">
                View all <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div className="bpo-related-grid">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
