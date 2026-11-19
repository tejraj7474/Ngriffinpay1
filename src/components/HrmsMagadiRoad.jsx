// HrmsMagadiRoad.jsx — location page for Magadi Road, West Bengaluru.
// URL: /hr-payroll-software-magadi-road-bangalore
// Uses the shared HrmsLocation template with Magadi Road's own text, FAQs and images.
// Images (public/images/): hrms-payroll-software-magadi-road.png, hrms-payroll-software-magadi-road-1.jpg
import HrmsLocation from "./HrmsLocation";

const MAGADI_ROAD_FAQS = [
  {
    q: "What is HRMS software and how can it help Magadi Road businesses?",
    a: "HRMS software helps businesses manage employee records, attendance, leave, payroll, payslips and HR reports from one centralised platform — reducing repetitive admin work.",
  },
  {
    q: "What HR and payroll features does NGriffinPay provide?",
    a: "Employee management, attendance management, leave management, payroll management, payslip management and HR reports — all together in one platform.",
  },
  {
    q: "Is NGriffinPay suitable for businesses in Magadi Road?",
    a: "Yes. NGriffinPay helps businesses in Magadi Road and across Bengaluru manage everyday HR and payroll operations from one centralised platform.",
  },
  {
    q: "Can Magadi Road businesses manage payroll with NGriffinPay?",
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
    q: "How can I get an HRMS software demo in Magadi Road?",
    a: "Experience NGriffinPay of NGriffinPay to see how the platform can simplify HR and payroll management for your business.",
  },
];

// Short, visual versions of the Magadi Road page content
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

// Business types along the Magadi Road corridor (West Bengaluru)
const INDUSTRIES = [
  [
    "Offices",
    "Employee records, attendance and payroll for office teams.",
    "id",
  ],
  [
    "Commercial Businesses",
    "Organised HR for growing commercial operations.",
    "cart",
  ],
  [
    "Industrial Units",
    "Machohalli, Kamath Industrial Layout and nearby estates.",
    "factory",
  ],
];

const WHY = [
  { t: "Simple to use", icon: "smile" },
  { t: "Centralised information", icon: "layers" },
  { t: "Reduced manual effort", icon: "zap" },
  { t: "Better visibility", icon: "eye" },
  { t: "Built for growing businesses", icon: "trend" },
  { t: "More efficient HR operations", icon: "check" },
];

export default function HrmsMagadiRoad() {
  return (
    <HrmsLocation
      area="Magadi Road"
      faqs={MAGADI_ROAD_FAQS}
      heroIntro="For offices, commercial businesses and industrial units across West Bengaluru — employee records, attendance, leave, payroll and HR reports in one platform."
      flowTitle={["A practical HRMS for", "businesses in Magadi Road"]}
      industries={INDUSTRIES}
      manual={MANUAL}
      withNgp={WITH_NGP}
      why={WHY}
      heroImage="hrms-payroll-software-magadi-road.png"
      heroAlt="The Best HRMS & Payroll Software for Magadi Road Businesses"
      previewImage="hrms-payroll-software-magadi-road-1.jpg"
      previewAlt="HRMS Software Designed for Businesses in Magadi Road"
      previewTitle={[
        "Simple for everyday HR operations.",
        "Structured for growing businesses.",
      ]}
      ctaText="A centralised way for businesses in Magadi Road to manage employees, attendance, leave, payroll, payslips and HR reports."
    />
  );
}
