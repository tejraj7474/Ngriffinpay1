import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ScrollTrigger } from "./gsap";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Workflow from "./components/Workflow";
import AppShowcase from "./components/AppShowcase";
import HrOrbit from "./components/HrOrbit";
import PartnerBurst from "./components/PartnerBurst";
import HrmsBanner from "./components/HrmsBanner";
import InteractiveDashboard from "./components/InteractiveDashboard";

// Home page = your existing sections
function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Services />
      <PartnerBurst logo="/images/logo.png" headerOffset={0} />
      <div className="gpx-next">
        <Workflow />
      </div>
      <AppShowcase />
      <HrOrbit />
      <HrmsBanner image="/images/one-hrms.jpg" />
    </>
  );
}

export default function App() {
  const foot = useRef();
  const [fh, setFh] = useState(500);
  const { pathname } = useLocation();

  useEffect(() => {
    setFh(foot.current.offsetHeight);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  // On page change: go to top and recalculate GSAP scroll positions
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div>
      <Header />
      <main style={{ marginBottom: fh }} className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/interactive-dashboard"
            element={<InteractiveDashboard />}
          />
        </Routes>
      </main>
      <Footer footRef={foot} />
    </div>
  );
}
