// HrmsItpl.jsx — location page for ITPL, Bangalore.
// URL: /hr-payroll-software-itpl-bangalore
// Uses the shared HrmsLocation template with ITPL's own text, FAQs and images.
// Images (public/images/): hrms-payroll-software-itpl.png, hrms-payroll-software-itpl-1.jpg
import HrmsLocation from "./HrmsLocation";

const ITPL_FAQS = [
  {
    q: "What is HRMS software and how can it help ITPL businesses?",
    a: "HRMS software helps businesses manage employee records, attendance, leave, payroll, payslips and HR reports from one centralised platform — reducing repetitive admin work.",
  },
  {
    q: "What HR and payroll features does NGriffinPay provide?",
    a: "Employee management, attendance management, leave management, payroll management, payslip management and HR reports — all together in one platform.",
  },
  {
    q: "Is NGriffinPay suitable for businesses in ITPL?",
    a: "Yes. NGriffinPay helps businesses in ITPL and across Bengaluru manage everyday HR and payroll operations from one centralised platform.",
  },
  {
    q: "Can ITPL businesses manage payroll with NGriffinPay?",
    a: "Yes. NGriffinPay helps you organise payroll information and manage recurring payroll activities through a structured workflow.",
  },
  {
    q: "Can NGriffinPay manage employee attendance and leave?",
    a: "Yes. Attendance and leave management help you maintain organised employee records and manage everyday HR processes systematically.",
  },
  {
    q: "Does NGriffinPay include payslip management?",
    a: "Yes. Payslip management keeps employee salary and payslip information organised within the platform.",
  },
  {
    q: "Is NGriffinPay suitable for growing businesses?",
    a: "Yes. NGriffinPay supports businesses as their workforce grows by bringing essential HR and payroll processes together in one platform.",
  },
  {
    q: "How can I get an HRMS software demo in ITPL?",
    a: "Experience NGriffinPay - Book a Demoof NGriffinPay to see how the platform can simplify HR and payroll management for your business.",
  },
];

// Short, visual versions of the ITPL page content
const MANUAL = [
  "Multiple spreadsheets to maintain",
  "Repeated data entry for routine tasks",
  "Records updated in different places",
  "Information coordinated across processes",
];

const WITH_NGP = [
  "One connected HR & payroll platform",
  "Less repetitive work",
  "Better organised records",
  "Easier access to information",
];

const WHY = [
  { t: "Simple to use", icon: "smile" },
  { t: "Centralised information", icon: "layers" },
  { t: "Reduced manual effort", icon: "zap" },
  { t: "Better visibility", icon: "eye" },
  { t: "Built for growing businesses", icon: "trend" },
  { t: "More efficient HR operations", icon: "check" },
];

export default function HrmsItpl() {
  return (
    <HrmsLocation
      area="ITPL"
      faqs={ITPL_FAQS}
      heroIntro="Employee records, attendance, leave, payroll, payslips and HR reports for fast-moving teams — together in one centralised platform."
      flowTitle={["A practical HRMS for", "businesses in ITPL"]}
      manual={MANUAL}
      withNgp={WITH_NGP}
      why={WHY}
      heroImage="hrms-payroll-software-itpl.png"
      heroAlt="The Best HRMS & Payroll Software for ITPL Businesses"
      previewImage="hrms-payroll-software-itpl-1.jpg"
      previewAlt="HRMS Software Designed for Businesses in ITPL"
      previewTitle={[
        "Simple for everyday HR operations.",
        "Structured for growing businesses.",
      ]}
      ctaText="A centralised way for businesses in ITPL and Whitefield to manage employees, attendance, leave, payroll, payslips and HR reports."
    />
  );
}
