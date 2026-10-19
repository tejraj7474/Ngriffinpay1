import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    const r = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true });
    const s = new THREE.Scene();
    const c = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    c.position.z = 7;

    const g = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 1),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.35 })
    );
    s.add(g);

    const pts = new Float32Array(900);
    for (let i = 0; i < 900; i++) pts[i] = (Math.random() - 0.5) * 16;
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const p = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.04, color: 0xffffff }));
    s.add(p);
    s.add(new THREE.AmbientLight(0xffffff, 1));

    const rs = () => {
      const { clientWidth: w, clientHeight: h } = el.parentElement;
      r.setSize(w, h, false);
      c.aspect = w / h;
      c.updateProjectionMatrix();
    };
    rs();
    addEventListener('resize', rs);

    let raf, mx = 0;
    const mm = e => (mx = e.clientX / innerWidth - 0.5);
    addEventListener('mousemove', mm);

    const loop = () => {
      g.rotation.y += 0.003;
      g.rotation.x = scrollY * 0.0008;
      p.rotation.y += 0.0007;
      c.position.x += (mx * 2 - c.position.x) * 0.05;
      c.lookAt(0, 0, 0);
      r.render(s, c);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', rs);
      removeEventListener('mousemove', mm);
      r.dispose();
    };
  }, []);

  return <canvas ref={ref} className="hero3d" aria-hidden="true" />;
}