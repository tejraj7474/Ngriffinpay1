import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ScrollTrigger } from "./gsap";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturesMobile from "./components/FeaturesMobile";
import Services from "./components/Services";
import Footer from "./components/Footer";
import Workflow from "./components/Workflow";
import AppShowcase from "./components/AppShowcase";
import HrOrbit from "./components/HrOrbit";
import PartnerBurst from "./components/PartnerBurst";
import Preloader from "./components/Preloader";
import DemoForm from "./components/DemoForm";
const HrmsBannerghattaRoad = lazy(
  () => import("./components/HrmsBannerghattaRoad"),
);
const HrmsJpNagar = lazy(() => import("./components/HrmsJpNagar"));
const HrmsHsrLayout = lazy(() => import("./components/HrmsHsrLayout"));
const HrmsIndiranagar = lazy(() => import("./components/HrmsIndiranagar"));
const HrmsKiadb = lazy(() => import("./components/HrmsKiadb"));
const HrmsBasavanagudi = lazy(() => import("./components/HrmsBasavanagudi"));
const HrmsNelamangala = lazy(() => import("./components/HrmsNelamangala"));
const HrmsKoramangala = lazy(() => import("./components/HrmsKoramangala"));
const HrmsWhitefield = lazy(() => import("./components/HrmsWhitefield"));
const HrmsItpl = lazy(() => import("./components/HrmsItpl"));
const HrmsSarjapur = lazy(() => import("./components/HrmsSarjapur"));
const HrmsHarohalli = lazy(() => import("./components/HrmsHarohalli"));
const HrmsMagadiRoad = lazy(() => import("./components/HrmsMagadiRoad"));
const HrmsElectronicCity = lazy(
  () => import("./components/HrmsElectronicCity"),
);

// Inner pages are code-split: each page's JS + CSS downloads only when it is visited,
// so the homepage no longer ships the code for all 27 pages up front.
const CoreHR = lazy(() => import("./components/CoreHR"));
const InteractiveDashboard = lazy(
  () => import("./components/InteractiveDashboard"),
);
const EmployeeOnboarding = lazy(
  () => import("./components/EmployeeOnboarding"),
);
const EmployeeSelfService = lazy(
  () => import("./components/EmployeeSelfService"),
);
const AttendanceLeave = lazy(() => import("./components/AttendanceLeave"));
const DigitalDocumentation = lazy(
  () => import("./components/DigitalDocumentation"),
);
const PerformanceAppraisal = lazy(
  () => import("./components/PerformanceAppraisal"),
);
const ShiftScheduling = lazy(() => import("./components/ShiftScheduling"));
const AutomatePayroll = lazy(() => import("./components/AutomatePayroll"));
const IncomeTax = lazy(() => import("./components/IncomeTax"));
const EmployeeExit = lazy(() => import("./components/EmployeeExit"));
const FullFinalSettlement = lazy(
  () => import("./components/FullFinalSettlement"),
);
const AssetManagement = lazy(() => import("./components/AssetManagement"));
const Tracking = lazy(() => import("./components/Tracking"));
const People = lazy(() => import("./components/People"));
const Pricing = lazy(() => import("./components/Pricing"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const PartnerWithUs = lazy(() => import("./components/PartnerWithUs"));
const Blogs = lazy(() => import("./components/Blogs"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const TermsConditions = lazy(() => import("./components/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const HRHelp = lazy(() => import("./components/HRHelp"));
const RecruitmentAnalytics = lazy(
  () => import("./components/RecruitmentAnalytics"),
);

// Recalculates GSAP scroll positions once a lazy page has actually rendered
function Page({ C }) {
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => clearTimeout(t);
  }, []);
  return <C />;
}

// Shown for a split second while a page's code downloads (keeps the footer from jumping up)
const PageFallback = () => (
  <div style={{ minHeight: "100vh" }} aria-busy="true" />
);

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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/interactive-dashboard"
              element={<Page C={InteractiveDashboard} />}
            />
            <Route
              path="/employee-onboarding"
              element={<Page C={EmployeeOnboarding} />}
            />
            <Route
              path="/employee-self-service"
              element={<Page C={EmployeeSelfService} />}
            />
            <Route
              path="/attendance-leave-management"
              element={<Page C={AttendanceLeave} />}
            />
            <Route
              path="/digital-employee-documentation"
              element={<Page C={DigitalDocumentation} />}
            />
            <Route
              path="/performance-appraisal-management"
              element={<Page C={PerformanceAppraisal} />}
            />
            <Route
              path="/shift-scheduling-management"
              element={<Page C={ShiftScheduling} />}
            />

            <Route
              path="/automate-payroll-processing"
              element={<Page C={AutomatePayroll} />}
            />
            <Route
              path="/income-tax-computation-compliance"
              element={<Page C={IncomeTax} />}
            />
            <Route
              path="/employee-exit-management"
              element={<Page C={EmployeeExit} />}
            />
            <Route
              path="/full-and-final-settlement"
              element={<Page C={FullFinalSettlement} />}
            />
            <Route
              path="/asset-allocation-management"
              element={<Page C={AssetManagement} />}
            />
            <Route path="/core-hr" element={<Page C={CoreHR} />} />
            <Route path="/tracking" element={<Page C={Tracking} />} />
            <Route path="/people" element={<Page C={People} />} />
            <Route path="/pricing" element={<Page C={Pricing} />} />
            <Route
              path="/partner-with-us"
              element={<Page C={PartnerWithUs} />}
            />
            <Route path="/contact-us" element={<Page C={ContactUs} />} />
            <Route path="/blog" element={<Page C={Blogs} />} />
            <Route path="/blog/:slug" element={<Page C={BlogPost} />} />
            <Route
              path="/terms-and-conditions"
              element={<Page C={TermsConditions} />}
            />
            <Route
              path="/privacy-policy"
              element={<Page C={PrivacyPolicy} />}
            />
            <Route
              path="/recruitment-analytics"
              element={<Page C={RecruitmentAnalytics} />}
            />
            <Route path="/ngriffinpay-hr-help" element={<Page C={HRHelp} />} />
            <Route
              path="/hr-payroll-software-bannerghatta-road-bangalore"
              element={<Page C={HrmsBannerghattaRoad} />}
            />
            <Route
              path="/hr-payroll-software-jp-nagar-bangalore"
              element={<Page C={HrmsJpNagar} />}
            />
            <Route
              path="/hr-payroll-software-hsr-layout-bangalore"
              element={<Page C={HrmsHsrLayout} />}
            />
            <Route
              path="/hr-payroll-software-indranagar-bangalore"
              element={<Page C={HrmsIndiranagar} />}
            />
            <Route
              path="/hr-payroll-software-kiadb-bangalore"
              element={<Page C={HrmsKiadb} />}
            />
            <Route
              path="/hr-payroll-software-basavanagudi-bangalore"
              element={<Page C={HrmsBasavanagudi} />}
            />
            <Route
              path="/hr-payroll-software-nelamangala-bangalore"
              element={<Page C={HrmsNelamangala} />}
            />
            <Route
              path="/hr-payroll-software-kormangala-bangalore"
              element={<Page C={HrmsKoramangala} />}
            />
            <Route
              path="/hr-payroll-software-whitefield-bangalore"
              element={<Page C={HrmsWhitefield} />}
            />
            <Route
              path="/hr-payroll-software-itpl-bangalore"
              element={<Page C={HrmsItpl} />}
            />
            <Route
              path="/hr-payroll-software-sarjapur-bangalore"
              element={<Page C={HrmsSarjapur} />}
            />
            <Route
              path="/hr-payroll-software-harohalli-bangalore"
              element={<Page C={HrmsHarohalli} />}
            />
            <Route
              path="/hr-payroll-software-magadi-road-bangalore"
              element={<Page C={HrmsMagadiRoad} />}
            />
            <Route
              path="/hr-payroll-software-electronic-city-bangalore"
              element={<Page C={HrmsElectronicCity} />}
            />
          </Routes>
        </Suspense>
      </main>
      <Footer footRef={foot} />
    </div>
  );
}
