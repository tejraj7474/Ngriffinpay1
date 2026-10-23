import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from './gsap';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Services from './components/Services';
import Footer from './components/Footer';
import Workflow from './components/Workflow';
import AppShowcase from './components/AppShowcase';
import HrOrbit from './components/HrOrbit';



export default function App() {
  const foot = useRef();
  const [fh, setFh] = useState(500);

  useEffect(() => {
    // footer height drives the reveal-footer margin
    setFh(foot.current.offsetHeight);
    // images change section heights, so recalculate every pin/trigger once all are loaded
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div>
      <Header />
      <main style={{ marginBottom: fh }} className="main">
        <Hero />
        <Features />
        <Services />
        <Workflow /> 
        <AppShowcase />   
        <HrOrbit />  
       
       
      </main>
      <Footer footRef={foot} />
    </div>
  );
}