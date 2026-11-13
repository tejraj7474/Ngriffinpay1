import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ScrollTrigger } from "./gsap";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CoreHR from "./components/CoreHR";
import FeaturesMobile from "./components/FeaturesMobile";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Workflow from "./components/Workflow";
import AppShowcase from "./components/AppShowcase";
import HrOrbit from "./components/HrOrbit";
import PartnerBurst from "./components/PartnerBurst";
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
import Tracking from "./components/Tracking";
import People from "./components/People";
import Pricing from "./components/Pricing";
import ContactUs from "./components/ContactUs";
import PartnerWithUs from "./components/PartnerWithUs";
import Blogs from "./components/Blogs";
import BlogPost from "./components/BlogPost";
import TermsConditions from "./components/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import HRHelp from "./components/HRHelp";
import RecruitmentAnalytics from "./components/RecruitmentAnalytics";
import Preloader from "./components/Preloader";
import HrmsDemoCTA from "./components/HrmsDemoCTA";
import DemoForm from "./components/DemoForm";

// Home page = your existing sections
function Home() {
  return (
    <>
      <Hero />
      <FeaturesMobile />
      <Services />
      <PartnerBurst logo="/images/logo.png" headerOffset={0} />
      <div className="gpx-next">
        <Workflow />
      </div>
      <AppShowcase />
      <HrOrbit />
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
      <Preloader />
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
          <Route path="/core-hr" element={<CoreHR />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/people" element={<People />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/recruitment-analytics"
            element={<RecruitmentAnalytics />}
          />
          <Route path="/ngriffinpay-hr-help" element={<HRHelp />} />
        </Routes>
      </main>
      <Footer footRef={foot} />
      <HrmsDemoCTA>
        {(onSuccess) => <DemoForm onSuccess={onSuccess} endpoint="" />}
      </HrmsDemoCTA>
    </div>
  );
}
