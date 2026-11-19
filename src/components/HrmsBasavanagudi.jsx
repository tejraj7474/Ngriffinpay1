// HrmsBasavanagudi.jsx — location page for Basavanagudi, Bangalore.
// URL: /hr-payroll-software-basavanagudi-bangalore
// Uses the shared HrmsLocation template with Basavanagudi's own text, FAQs and images.
// Images (public/images/): hrms-payroll-software-basavanagudi.png, hrms-payroll-software-basavanagudi-1.jpg
import HrmsLocation from "./HrmsLocation";

const BASAVANAGUDI_FAQS = [
  {
    q: "What is HRMS software and how can it help Basavanagudi businesses?",
    a: "HRMS software helps businesses manage employee records, attendance, leave, payroll, payslips and HR reports from one centralised platform — reducing repetitive admin work.",
  },
  {
    q: "What HR and payroll features does NGriffinPay provide?",
    a: "Employee management, attendance management, leave management, payroll management, payslip management and HR reports — all together in one platform.",
  },
  {
    q: "Is NGriffinPay suitable for businesses in Basavanagudi?",
    a: "Yes. NGriffinPay helps businesses in Basavanagudi manage everyday HR and payroll operations from one centralised platform.",
  },
  {
    q: "Can Basavanagudi businesses manage payroll with NGriffinPay?",
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
    q: "How can I get an HRMS software demo in Basavanagudi?",
    a: "Experience NGriffinPay - Book a Demoof NGriffinPay to see how the platform can simplify HR and payroll management for your business.",
  },
];

// Short, visual versions of the Basavanagudi page content
const MANUAL = [
  "Multiple spreadsheets and documents",
  "Repeated data entry for routine tasks",
  "Employee data, attendance and payroll kept apart",
  "Information hard to find when needed",
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

export default function HrmsBasavanagudi() {
  return (
    <HrmsLocation
      area="Basavanagudi"
      faqs={BASAVANAGUDI_FAQS}
      heroIntro="Employee records, attendance, leave, payroll, payslips and HR reports — together in one centralised platform, without the spreadsheets."
      flowTitle={["A practical HRMS for", "businesses in Basavanagudi"]}
      manual={MANUAL}
      withNgp={WITH_NGP}
      why={WHY}
      heroImage="hrms-payroll-software-basavanagudi.png"
      heroAlt="The Best HRMS & Payroll Software for Basavanagudi Businesses"
      previewImage="hrms-payroll-software-basavanagudi-1.jpg"
      previewAlt="HRMS Software Designed for Businesses in Basavanagudi"
      previewTitle={[
        "Simple for everyday HR operations.",
        "Structured for growing businesses.",
      ]}
      ctaText="A centralised way for Basavanagudi businesses to manage employees, attendance, leave, payroll, payslips and HR reports."
    />
  );
}
