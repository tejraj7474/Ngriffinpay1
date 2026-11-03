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
import EmployeeOnboarding from "./components/EmployeeOnboarding";
import EmployeeSelfService from "./components/EmployeeSelfService";
import AttendanceLeave from "./components/AttendanceLeave";
import DigitalDocumentation from "./components/DigitalDocumentation";
import PerformanceAppraisal from "./components/PerformanceAppraisal";
import ShiftScheduling from "./components/ShiftScheduling";
import AutomatePayroll from "./components/AutomatePayroll";
import IncomeTax from "./components/IncomeTax";
import EmployeeExit from "./components/EmployeeExit";
import FullFinalSettlement from "./components/FullFinalSettlement";
import AssetManagement from "./components/AssetManagement";

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
          <Route path="/employee-onboarding" element={<EmployeeOnboarding />} />
          <Route
            path="/employee-self-service"
            element={<EmployeeSelfService />}
          />
          <Route
            path="/attendance-leave-management"
            element={<AttendanceLeave />}
          />
          <Route
            path="/digital-employee-documentation"
            element={<DigitalDocumentation />}
          />
          <Route
            path="/performance-appraisal-management"
            element={<PerformanceAppraisal />}
          />
          <Route
            path="/shift-scheduling-management"
            element={<ShiftScheduling />}
          />

          <Route
            path="/automate-payroll-processing"
            element={<AutomatePayroll />}
          />
          <Route
            path="/income-tax-computation-compliance"
            element={<IncomeTax />}
          />
          <Route path="/employee-exit-management" element={<EmployeeExit />} />
          <Route
            path="/full-and-final-settlement"
            element={<FullFinalSettlement />}
          />
          <Route
            path="/asset-allocation-management"
            element={<AssetManagement />}
          />
        </Routes>
      </main>
      <Footer footRef={foot} />
    </div>
  );
}
