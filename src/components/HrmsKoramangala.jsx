// HrmsKoramangala.jsx — location page for Koramangala, Bangalore (startups, tech & growing businesses).
// URL: /hr-payroll-software-kormangala-bangalore
// Uses the shared HrmsLocation template with a full employee-lifecycle focus.
// Images (public/images/): hrms-payroll-software-koramangala.png, hrms-payroll-software-koramangala-1.jpg
import HrmsLocation from "./HrmsLocation";

// Complete employee lifecycle — hiring to exit
const FLOW = [
  { k: "Hiring", sub: "Talent sourcing", icon: "search" },
  { k: "Onboarding", sub: "Digital & paperless", icon: "userPlus" },
  { k: "Attendance", sub: "Shifts & leave", icon: "clock" },
  { k: "Payroll", sub: "PF · ESI · TDS", icon: "rupee" },
  { k: "Performance", sub: "Goals & reviews", icon: "target" },
  { k: "Exit", sub: "Full & final", icon: "exit" },
];

// What HR teams in fast-moving businesses manage — each with a small UI preview
const FEATURES = [
  {
    t: "Rapid Hiring & Onboarding",
    d: "Turn candidates into employees with paperless joining.",
    icon: "userPlus",
    ui: "onboard",
  },
  {
    t: "Employee Documentation",
    d: "Offer letters and documents in a secure vault.",
    icon: "lock",
    ui: "docs",
  },
  {
    t: "Attendance & Shifts",
    d: "Attendance and shift tracking for every team.",
    icon: "clock",
    ui: "shift",
  },
  {
    t: "Leave Approvals",
    d: "Requests and approvals without email threads.",
    icon: "calendar",
    ui: "leave",
  },
  {
    t: "Payroll & Compliance",
    d: "Salary, PF, ESI and TDS handled in one place.",
    icon: "rupee",
    ui: "tax",
  },
  {
    t: "Performance Management",
    d: "Track goals and achievements across teams.",
    icon: "target",
    ui: "perf",
  },
  {
    t: "Full & Final Settlement",
    d: "Structured employee exits and settlements.",
    icon: "exit",
    ui: "fnf",
  },
  {
    t: "Employee Self-Service",
    d: "Employees access HR services on their own.",
    icon: "phone",
    ui: "ess",
  },
  {
    t: "Workforce Analytics",
    d: "Dashboards for employee and payroll insights.",
    icon: "chart",
    ui: "spark",
  },
];

// Who can use it — Koramangala's startup & business mix
const INDUSTRIES = [
  ["Startups", "Structured HR from your very first hire.", "rocket"],
  [
    "IT & SaaS Companies",
    "Onboarding, attendance and payroll for tech teams.",
    "code",
  ],
  [
    "Product & Technology",
    "HR that keeps pace with fast-growing teams.",
    "layers",
  ],
  [
    "Consulting & Professional Services",
    "Organised employee and payroll workflows.",
    "bank",
  ],
  ["Agencies", "Attendance, leave and salary across teams.", "megaphone"],
  ["Manufacturing", "Shifts, attendance, records and payroll.", "factory"],
  ["Retail & E-commerce", "Workforce management as operations expand.", "cart"],
  ["SMEs & Multi-location", "One HR system for every team and branch.", "pin"],
];

const MANUAL = [
  "Spreadsheets and paper documents",
  "Manual attendance records",
  "Disconnected payroll systems",
  "Duplicate data entry across apps",
];

const WITH_NGP = [
  "One platform from hiring to exit",
  "Automated, repetitive HR work",
  "Payroll with PF, ESI & TDS",
  "Integrations with existing systems",
];

const WHY = [
  { t: "One platform for HR", icon: "grid" },
  { t: "Less manual HR work", icon: "zap" },
  { t: "Better employee experience", icon: "smile" },
  { t: "Workforce visibility", icon: "eye" },
  { t: "Supports growing businesses", icon: "trend" },
  { t: "Connects with your systems", icon: "code" },
];

const KORAMANGALA_FAQS = [
  {
    q: "Does NGriffinPay support GPS attendance?",
    a: "Yes. NGriffinPay GPS Attendance helps businesses manage mobile and location-based attendance for employees where the feature is configured and enabled.",
  },
  {
    q: "Does NGriffinPay support Full & Final Settlement?",
    a: "Yes. NGriffinPay includes Full & Final Settlement functionality to help HR teams manage employee exit and settlement workflows.",
  },
  {
    q: "Can NGriffinPay integrate with existing business systems?",
    a: "NGriffinPay can support integrations with compatible systems and APIs. Depending on the integration, businesses can connect relevant HR, attendance, payroll, accounting, recruitment and other applications.",
  },
  {
    q: "Is NGriffinPay suitable for startups in Koramangala?",
    a: "Yes. Whether you are a growing startup or an established company, NGriffinPay helps create structured HR processes from your first hire onwards.",
  },
  {
    q: "Does NGriffinPay handle PF, ESI and TDS?",
    a: "Yes. NGriffinPay brings payroll and compliance-related workflows such as PF, ESI and TDS together in one platform.",
  },
  {
    q: "Can we manage digital onboarding with NGriffinPay?",
    a: "Yes. From talent sourcing to digital onboarding and employee documentation, new joiners can be brought in without paperwork.",
  },
  {
    q: "Do employees get self-service access?",
    a: "Yes. Employee self-service gives employees easier access to their HR information and services without depending on HR for every request.",
  },
  {
    q: "How can I see NGriffinPay in action?",
    a: "Experience NGriffinPay - Book a Demoto see how NGriffinPay can fit your company's HR and payroll workflow.",
  },
];

export default function HrmsKoramangala() {
  return (
    <HrmsLocation
      area="Koramangala"
      heroTitle={["", "HR & Payroll Software", " in Koramangala, Bangalore"]}
      heroTagline="Manage the complete employee lifecycle from one platform."
      heroIntro="From talent sourcing and onboarding to attendance, payroll, PF, ESI, TDS, performance and exits — for startups and growing businesses."
      flowSteps={FLOW}
      flowTitle={["From hiring to exit —", "the complete employee lifecycle"]}
      features={FEATURES}
      featuresTitle={["Everything a fast-growing team", "needs from HR"]}
      industries={INDUSTRIES}
      compareTitle={["Less manual HR work.", "More workforce visibility."]}
      manual={MANUAL}
      withNgp={WITH_NGP}
      why={WHY}
      faqs={KORAMANGALA_FAQS}
      heroImage="hrms-payroll-software-koramangala.png"
      heroAlt="HR & Payroll Software in Koramangala, Bangalore"
      previewImage="hrms-payroll-software-koramangala-1.jpg"
      previewAlt="NGriffinPay HR & Payroll Software in Koramangala, Bangalore"
      previewTitle={["From your first hire", "to a growing workforce."]}
      ctaTitle="Growing your team? Let NGriffinPay handle the HR."
      ctaText="See how NGriffinPay can fit your company's HR and payroll workflow."
    />
  );
}
