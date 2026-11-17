import { useEffect, useRef } from "react";

// Decorative 3D background for the homepage hero.
// Performance:
//  • three.js is downloaded only after the page has painted (dynamic import when the browser is idle),
//    so it no longer sits in the main JavaScript bundle.
//  • The render loop pauses while the hero is off-screen or the tab is hidden.
//  • Pixel ratio is capped so phones with 3x screens don't render 9x the pixels.
export default function Hero3D() {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    let cleanup = () => {};
    let cancelled = false;

    const start = async () => {
      const THREE = await import("three");
      if (cancelled || !el) return;

      const r = new THREE.WebGLRenderer({
        canvas: el,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const s = new THREE.Scene();
      const c = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      c.position.z = 7;

      const g = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2, 1),
        new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        }),
      );
      s.add(g);

      const pts = new Float32Array(900);
      for (let i = 0; i < 900; i++) pts[i] = (Math.random() - 0.5) * 16;
      const pg = new THREE.BufferGeometry();
      pg.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      const p = new THREE.Points(
        pg,
        new THREE.PointsMaterial({ size: 0.04, color: 0xffffff }),
      );
      s.add(p);
      s.add(new THREE.AmbientLight(0xffffff, 1));

      const rs = () => {
        const { clientWidth: w, clientHeight: h } = el.parentElement;
        if (!w || !h) return;
        r.setSize(w, h, false);
        c.aspect = w / h;
        c.updateProjectionMatrix();
      };
      rs();
      addEventListener("resize", rs);

      let raf = 0;
      let mx = 0;
      let visible = true;
      const mm = (e) => (mx = e.clientX / innerWidth - 0.5);
      addEventListener("mousemove", mm, { passive: true });

      const loop = () => {
        raf = 0;
        if (!visible || document.hidden) return; // paused
        g.rotation.y += 0.003;
        g.rotation.x = scrollY * 0.0008;
        p.rotation.y += 0.0007;
        c.position.x += (mx * 2 - c.position.x) * 0.05;
        c.lookAt(0, 0, 0);
        r.render(s, c);
        raf = requestAnimationFrame(loop);
      };
      const resume = () => {
        if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
      };

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        resume();
      });
      io.observe(el);
      document.addEventListener("visibilitychange", resume);
      resume();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        document.removeEventListener("visibilitychange", resume);
        removeEventListener("resize", rs);
        removeEventListener("mousemove", mm);
        pg.dispose();
        g.geometry.dispose();
        r.dispose();
      };
    };

    // wait until the browser is idle (after first paint) before loading three.js
    const idle =
      window.requestIdleCallback ||
      ((cb) => setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => start(), { timeout: 2500 });

    return () => {
      cancelled = true;
      cancelIdle(id);
      cleanup();
    };
  }, []);

  return <canvas ref={ref} className="hero3d" aria-hidden="true" />;
}
