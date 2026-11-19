// HrmsHarohalli.jsx — location page for Harohalli industrial area, Bangalore.
// URL: /hr-payroll-software-harohalli-bangalore
// Uses the shared HrmsLocation template with Harohalli's own text, FAQs and images.
// Images (public/images/): hrms-payroll-software-harohalli.png, hrms-payroll-software-harohalli-1.jpg
import HrmsLocation from "./HrmsLocation";

const HAROHALLI_FAQS = [
  {
    q: "What is HRMS software and how can it help Harohalli businesses?",
    a: "HRMS software helps businesses manage employee records, attendance, leave, payroll, payslips and HR reports from one centralised platform — reducing repetitive admin work.",
  },
  {
    q: "What HR and payroll features does NGriffinPay provide?",
    a: "Employee management, attendance management, leave management, payroll management, payslip management and HR reports — all together in one platform.",
  },
  {
    q: "Is NGriffinPay suitable for businesses in Harohalli?",
    a: "Yes. NGriffinPay helps businesses in Harohalli and surrounding industrial areas manage everyday HR and payroll operations from one centralised platform.",
  },
  {
    q: "Can Harohalli businesses manage payroll with NGriffinPay?",
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
    q: "Is NGriffinPay suitable for businesses with growing industrial workforces?",
    a: "Yes. NGriffinPay supports businesses as their workforce grows by bringing essential HR and payroll processes together in one platform.",
  },
  {
    q: "How can I get an HRMS software demo in Harohalli?",
    a: "Experience NGriffinPay of NGriffinPay to see how the platform can simplify HR and payroll management for your business.",
  },
];

// Short, visual versions of the Harohalli page content
const MANUAL = [
  "Multiple spreadsheets to maintain",
  "Attendance, leave and payroll handled separately",
  "Inconsistent employee records",
  "Information hard to find quickly",
];

const WITH_NGP = [
  "One connected HR & payroll platform",
  "Less repetitive work",
  "Consistent, organised records",
  "Easier access to information",
];

// Harohalli's industrial and manufacturing mix
const INDUSTRIES = [
  ["Engineering", "Shop-floor teams, attendance and payroll.", "cog"],
  ["Packaging", "Production staff, leave and monthly payroll.", "box"],
  ["Plastics", "Workforce records across departments.", "layers"],
  ["Electrical Equipment", "Attendance and payroll for growing teams.", "zap"],
  ["Food Processing", "Organised records for large workforces.", "leaf"],
  ["Other Manufacturing", "One HR platform across every phase.", "factory"],
];

const WHY = [
  { t: "Simple to use", icon: "smile" },
  { t: "Centralised information", icon: "layers" },
  { t: "Reduced manual effort", icon: "zap" },
  { t: "Better visibility", icon: "eye" },
  { t: "Built for growing businesses", icon: "trend" },
  { t: "More efficient HR operations", icon: "factory" },
];

export default function HrmsHarohalli() {
  return (
    <HrmsLocation
      area="Harohalli"
      faqs={HAROHALLI_FAQS}
      heroIntro="Employee records, attendance, leave, payroll, payslips and HR reports for industrial workforces — together in one centralised platform."
      flowTitle={["A practical HRMS for", "businesses in Harohalli"]}
      industries={INDUSTRIES}
      manual={MANUAL}
      withNgp={WITH_NGP}
      why={WHY}
      heroImage="hrms-payroll-software-harohalli.png"
      heroAlt="The Best HRMS & Payroll Software for Harohalli Businesses"
      previewImage="hrms-payroll-software-harohalli-1.jpg"
      previewAlt="HRMS Software Designed for Growing Businesses in Harohalli"
      previewTitle={[
        "Simple for everyday HR operations.",
        "Structured for growing businesses.",
      ]}
      ctaText="Managing HR for a growing industrial workforce doesn’t have to mean multiple spreadsheets and disconnected processes."
    />
  );
}
