import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import "./PartnerBurst.css";

/* =====================================================================
   PartnerBurst — "Who can be Our Partner?" scroll reveal (NGriffinpay)

   ISOLATED: this section does NOT use ScrollTrigger, does NOT pin, and
   never calls ScrollTrigger.refresh(). Its height is fixed from the first
   render (CSS), so other sections' scroll effects are not affected.

   How it works:
     .gpx-root   is 400vh tall (fixed in CSS)
     .gpx-stage  is position: sticky, so it stays on screen while you scroll
     The component reads its own scroll progress (0 → 1) and plays a
     paused GSAP timeline to that point.

   Sequence:
     1. Title + big logo, logo zooms out a little
     2. Rings + particles burst from behind the logo
     3. Icons pop out ONE BY ONE from behind the logo
     4. "Request a Demo" appears, then the finished layout holds

   Usage (App.jsx):
     <PartnerBurst logo="/assets/logo.png" headerOffset={0} />
   ===================================================================== */

const GPX_PARTNERS = [
  // left column (top → bottom)
  {
    title: "Payroll Processing Companies",
    icon: "pay",
    bg: "#efeaff",
    color: "#6c4bd8",
  },
  {
    title: "HR Consultancy Firms",
    icon: "hr",
    bg: "#ffe4e4",
    color: "#e5484d",
  },
  {
    title: "Are you a CA (Chartered Accountant)?",
    icon: "ca",
    bg: "#e4f0ff",
    color: "#3b82f6",
  },
  // right column (top → bottom)
  {
    title: "Are you a CS (Company Secretary)?",
    icon: "cs",
    bg: "#fff0da",
    color: "#f59e0b",
  },
  {
    title: "Are you a Labour Consultant?",
    icon: "labour",
    bg: "#e2f6e9",
    color: "#22a55a",
  },
  {
    title: "Factory Compliance Advisors",
    icon: "factory",
    bg: "#fff0da",
    color: "#f08c00",
  },
];

const GPX_ICONS = {
  pay: "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 10v4M18 10v4",
  hr: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 5M18 20a6 6 0 0 0-3-5",
  ca: "M6 3h12v18H6zM9 7h6M9 12h2M13 12h2M9 16h2M13 16h2",
  cs: "M4 8h16v12H4zM9 8V5h6v3M4 13h16",
  labour: "M4 15a8 8 0 0 1 16 0zM3 15h18v3H3zM12 4v4",
  factory: "M3 20V10l6 4V10l6 4V6h3v14zM3 20h18",
};

// Pop-out order: left-top, right-top, left-mid, right-mid, left-bottom, right-bottom
const GPX_ORDER = [0, 3, 1, 4, 2, 5];

// Share of the scroll used for the animation; the rest holds the finished layout
const GPX_ANIM_SHARE = 0.8;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/* ---------------- Three.js particles + rings ---------------- */
function GpxBurstCanvas({ progressRef, activeRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 8;

    const COUNT = 520;
    const directions = [];
    const speeds = [];
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const palette = ["#2a3fb8", "#3b6cf6", "#ffb020", "#8e90ff"].map(
      (c) => new THREE.Color(c),
    );

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      directions.push(
        new THREE.Vector3(
          Math.cos(angle),
          Math.sin(angle) * 0.7,
          (Math.random() - 0.5) * 0.8,
        ),
      );
      speeds.push(1.2 + Math.random() * 6.5);
      const c = palette[i % palette.length];
      colors.set([c.r, c.g, c.b], i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const rings = [0x3b6cf6, 0xffb020].map((color) => {
      const mesh = new THREE.Mesh(
        new THREE.RingGeometry(1, 1.03, 128),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
        }),
      );
      scene.add(mesh);
      return mesh;
    });

    const onResize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener("resize", onResize);

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let frame;
    let time = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!activeRef.current) return; // section off screen → skip rendering
      time += 0.004;
      const p = progressRef.current.value;

      const arr = geometry.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const d = directions[i];
        const r = speeds[i] * p;
        arr[i * 3] = d.x * r;
        arr[i * 3 + 1] = d.y * r;
        arr[i * 3 + 2] = d.z * r;
      }
      geometry.attributes.position.needsUpdate = true;
      material.opacity = Math.min(1, p * 4) * 0.9;
      particles.rotation.z = time * 0.6;

      rings.forEach((ring, k) => {
        const s = 0.6 + p * (k ? 5.5 : 8);
        ring.scale.set(s, s, 1);
        ring.material.opacity =
          Math.max(0.06, 0.5 * (1 - p * 0.85)) * Math.min(1, p * 6);
      });

      camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        r.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host)
        host.removeChild(renderer.domElement);
    };
  }, [progressRef, activeRef]);

  return <div className="gpx-canvas" ref={hostRef} aria-hidden="true" />;
}

/* ---------------- Main component ---------------- */
export default function PartnerBurst({
  logo = "NGriffinpay",
  headerOffset = 0,
  demoUrl = "https://ngriffinpay.in/request-a-demo.html",
}) {
  const rootRef = useRef(null);
  const areaRef = useRef(null);
  const progressRef = useRef({ value: 0 }); // burst progress, read by the canvas
  const activeRef = useRef(false); // is the section on screen?

  useLayoutEffect(() => {
    const root = rootRef.current;
    const area = areaRef.current;
    const q = gsap.utils.selector(root); // only selects inside THIS section
    const cards = q(".gpx-card");

    // Final spot of each card, from the centre of the visible area
    const getSpot = (index) => {
      const w = area.clientWidth;
      const h = area.clientHeight;
      const mobile = w < 768;
      const xs = mobile ? [0.28, 0.3, 0.28] : [0.25, 0.34, 0.25];
      const ys = mobile ? [0.27, 0, 0.27] : [0.29, 0, 0.29];
      const row = index % 3;
      const side = index >= 3 ? 1 : -1;
      const vertical = row === 0 ? -1 : row === 2 ? 1 : 0;
      return { x: side * xs[row] * w, y: vertical * ys[row] * h };
    };

    // Start state
    gsap.set(cards, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: 0.2,
      opacity: 0,
      rotation: 0,
    });
    gsap.set(q(".gpx-button"), { opacity: 0, y: 20 });

    // Paused timeline — we set its progress from scroll ourselves
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

    // 1) Title settles, logo zooms out
    tl.fromTo(
      q(".gpx-heading"),
      { y: 40 },
      { y: 0, duration: 0.25, ease: "power1.out" },
      0,
    ).fromTo(
      q(".gpx-emblem"),
      { y: 35, scale: 1.15 },
      { y: 0, scale: 1, duration: 0.25, ease: "power1.out" },
      0,
    );

    // 2) Burst behind the logo
    tl.fromTo(
      progressRef.current,
      { value: 0 },
      { value: 1, duration: 1.45 },
      0.15,
    );

    // 3) Cards pop out one by one from behind the logo
    GPX_ORDER.forEach((index, step) => {
      const card = cards[index];
      if (!card) return;
      const at = 0.3 + step * 0.2;
      tl.fromTo(
        card,
        { x: 0, y: 0, scale: 0.2, rotation: index < 3 ? -25 : 25 },
        {
          x: () => getSpot(index).x,
          y: () => getSpot(index).y,
          scale: 1,
          rotation: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        at,
      )
        .fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.08 }, at)
        .to(
          q(".gpx-emblem"),
          {
            scale: 1.05,
            duration: 0.05,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          at,
        );
    });

    // 4) Button
    tl.to(q(".gpx-button"), { opacity: 1, y: 0, duration: 0.2 }, 1.6);

    // ---- Scroll progress of THIS section only ----
    let target = 0;
    let current = 0;
    let raf = 0;

    const readScroll = () => {
      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight; // scrollable distance while sticky
      const p = total > 0 ? clamp01(-rect.top / total) : 0;
      target = clamp01(p / GPX_ANIM_SHARE);
      activeRef.current = rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!activeRef.current && Math.abs(target - current) < 0.0005) return;
      current += (target - current) * 0.12; // smoothing (like scrub)
      if (Math.abs(target - current) < 0.0005) current = target;
      tl.progress(current);
    };

    const onResize = () => {
      tl.invalidate(); // recompute card positions for the new size
      tl.progress(current);
      readScroll();
    };

    readScroll();
    current = target;
    tl.progress(current);
    tick();

    // capture: true also catches scrolling inside a wrapper div, not only the window
    window.addEventListener("scroll", readScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      tl.kill();
      gsap.set(
        [
          ...cards,
          ...q(".gpx-button"),
          ...q(".gpx-heading"),
          ...q(".gpx-emblem"),
        ],
        { clearProps: "all" },
      );
      progressRef.current.value = 0;
    };
  }, []);

  return (
    <div
      className="gpx-root"
      ref={rootRef}
      id="partner"
      style={{ "--gpx-header": `${headerOffset}px` }}
    >
      <section className="gpx-stage" aria-labelledby="gpx-heading">
        <div className="gpx-area" ref={areaRef}>
          <GpxBurstCanvas progressRef={progressRef} activeRef={activeRef} />

          <h2 id="gpx-heading" className="gpx-heading">
            Who can be Our Partner?
          </h2>

          <ul className="gpx-list">
            {GPX_PARTNERS.map((p) => (
              <li className="gpx-card" key={p.title}>
                <span
                  className="gpx-badge"
                  style={{ background: p.bg, color: p.color }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={GPX_ICONS[p.icon]} />
                  </svg>
                </span>
                <h3 className="gpx-card-title">{p.title}</h3>
              </li>
            ))}
          </ul>

          <div className="gpx-center">
            <div className="gpx-emblem">
              <span className="gpx-glow" aria-hidden="true" />
              <img
                className="gpx-emblem-img"
                src={logo}
                alt="NGriffinpay"
                width="190"
                height="240"
              />
            </div>
          </div>

          <a className="gpx-button" href={demoUrl}>
            Request a Demo
          </a>
        </div>
      </section>
    </div>
  );
}
