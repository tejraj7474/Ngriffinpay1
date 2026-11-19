// HrmsKiadb.jsx — location page for KIADB industrial areas, Bangalore.
// URL: /hr-payroll-software-kiadb-bangalore
// Uses the shared HrmsLocation template with KIADB's own text, FAQs and images.
// Images (public/images/): hrms-payroll-software-kiadb.png, hrms-payroll-software-kiadb-1.jpg
import HrmsLocation from "./HrmsLocation";

const KIADB_FAQS = [
  {
    q: "What is HRMS software and how can it help KIADB businesses?",
    a: "HRMS software helps businesses manage employee records, attendance, leave, payroll, payslips and HR reports from one centralised platform — reducing repetitive admin work.",
  },
  {
    q: "What HR and payroll features does NGriffinPay provide?",
    a: "Employee management, attendance management, leave management, payroll management, payslip management and HR reports — all together in one platform.",
  },
  {
    q: "Is NGriffinPay suitable for businesses in KIADB?",
    a: "Yes. NGriffinPay helps businesses operating in KIADB industrial areas manage everyday HR and payroll operations from one centralised platform.",
  },
  {
    q: "Can KIADB businesses manage payroll with NGriffinPay?",
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
    q: "How can I get an HRMS software demo in KIADB?",
    a: "Experience NGriffinPay of NGriffinPay to see how the platform can simplify HR and payroll management for your business.",
  },
];

// Short, visual versions of the KIADB page content
const MANUAL = [
  "Separate records for each process",
  "Repeated data entry in spreadsheets",
  "Attendance and leave tracked apart",
  "Time-consuming payroll coordination",
];

const WITH_NGP = [
  "One connected HR & payroll platform",
  "Less repetitive work",
  "Attendance & leave linked to payroll",
  "Simplified, structured payroll",
];

const WHY = [
  { t: "Simple to use", icon: "smile" },
  { t: "Centralised information", icon: "layers" },
  { t: "Reduced manual effort", icon: "zap" },
  { t: "Better visibility", icon: "eye" },
  { t: "Built for growing businesses", icon: "trend" },
  { t: "More efficient HR operations", icon: "factory" },
];

export default function HrmsKiadb() {
  return (
    <HrmsLocation
      area="KIADB"
      faqs={KIADB_FAQS}
      heroIntro="Attendance, employee records, leave and payroll for industrial and business workforces — together in one centralised platform."
      flowTitle={["A practical HRMS for", "KIADB businesses"]}
      manual={MANUAL}
      withNgp={WITH_NGP}
      why={WHY}
      heroImage="hrms-payroll-software-kiadb.png"
      heroAlt="The Best HRMS & Payroll Software for KIADB Businesses"
      previewImage="hrms-payroll-software-kiadb-1.jpg"
      previewAlt="The Best HRMS & Payroll Software for KIADB Businesses"
      previewTitle={[
        "Simple for everyday HR operations.",
        "Structured for growing businesses.",
      ]}
      ctaText="A centralised way for KIADB businesses to manage employees, attendance, leave, payroll, payslips and HR reports."
    />
  );
}
