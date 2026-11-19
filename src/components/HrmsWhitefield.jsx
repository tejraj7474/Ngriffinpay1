// HrmsWhitefield.jsx — location page for Whitefield, Bangalore (IT, tech & enterprise firms).
// URL: /hr-payroll-software-whitefield-bangalore
// Uses the shared HrmsLocation template with enterprise features, a legacy-vs-NGriffinPay table,
// industries and FAQs.
// Images (public/images/): hrms-payroll-software-whitefield.png, hrms-payroll-software-whitefield-1.jpg
import HrmsLocation from "./HrmsLocation";

// One centralised HRMS platform
const FLOW = [
  { k: "Employees", sub: "Permanent & contract", icon: "users" },
  { k: "Attendance", sub: "Biometric & geofencing", icon: "clock" },
  { k: "Leave", sub: "Requests & balances", icon: "calendar" },
  { k: "Payroll", sub: "Variable pay & bonus", icon: "rupee" },
  { k: "Payslips", sub: "Encrypted PDFs", icon: "file" },
  { k: "Reports", sub: "Multi-location view", icon: "chart" },
];

// Key reasons Whitefield enterprises choose NGriffinPay
const FEATURES = [
  {
    t: "Mixed-Workforce Management",
    d: "Permanent staff, IT contractors and vendors — without data crossover.",
    icon: "users",
    ui: "chips",
    chips: [["Permanent", "user"], ["Contractors", "id"], ["Vendors", "bank"]],
  },
  {
    t: "24/7 Shift Reconciliation",
    d: "Cross-day rotations and night allowances for global support desks.",
    icon: "clock",
    ui: "shift",
  },
  {
    t: "Variable Pay & Bonus Engine",
    d: "Quarterly tech bonuses, commissions and milestone payouts.",
    icon: "rupee",
    ui: "bar",
    bar: ["Q3 performance bonus", "Processed", 100],
  },
  {
    t: "Multi-Location Dashboard",
    d: "One view across Whitefield, Electronic City and global branches.",
    icon: "pin",
    ui: "chips",
    chips: [["Whitefield", "pin"], ["Electronic City", "pin"], ["Global", "pin"]],
  },
  {
    t: "Org-Chart Mapping",
    d: "Multi-tier reporting, client project branches and shift patterns.",
    icon: "org",
    ui: "status",
    status: ["Reporting tree synced", "6 tiers · 14 project branches", true],
  },
  {
    t: "Bank-Grade Security",
    d: "256-bit SSL encryption with Indian data sovereignty.",
    icon: "shield",
    ui: "chips",
    chips: [["256-bit SSL", "lock"], ["RBAC", "shield"], ["Hosted in India", "pin"]],
  },
];

// Legacy bottlenecks vs NGriffinPay — shown as a comparison table
const MATRIX = [
  ["Enterprise Scalability", "Systems freeze or lag during bulk processing for thousands of specialists.", "Cloud-native architecture processes multi-tier workforces in under 60 seconds.", "trend"],
  ["Contractor Management", "Consultant invoices mixed into permanent team records.", "Employee master database splits vendor billing from core payroll.", "users"],
  ["Attendance Verification", "Biometric data tracked manually across multiple buildings.", "Real-time sync with cloud biometric gates and GPS geofencing.", "finger"],
  ["Statutory Compliance", "Risk of delayed or incorrect PF, ESI, PT and TDS submissions.", "Auto-calculated, portal-ready ECR files — zero-penalty design.", "shield"],
  ["Employee Self-Service", "HR overwhelmed by tickets for leaves and payslips.", "Mobile app for investment declarations and encrypted payslips.", "phone"],
  ["Audit Readiness", "Excel grids open to untraceable overrides.", "Role-based access control with audit-ready logs.", "lock"],
  ["Full & Final Settlements", "Settlements take 15–30 days for departing engineers.", "FnF engine computes gratuity, notice pay and leave encashment instantly.", "exit"],
];

// Industries we serve
const INDUSTRIES = [
  ["IT & SaaS", "Developers, remote contractors and consultants — with an Old vs New regime tax planner.", "code"],
  ["24/7 BPO & Support", "Multi-shift rosters with exact night-shift premiums and overtime.", "headset"],
  ["Tech & Electronics Manufacturing", "Daily wage tracking and pre-formatted PF & ESI ECR files.", "factory"],
  ["Logistics & E-commerce Hubs", "Field and warehouse teams via GPS geofencing and face recognition.", "truck"],
];

const WHY = [
  { t: "Calculation accuracy", icon: "calc" },
  { t: "Bank-grade security", icon: "lock" },
  { t: "Statutory compliance", icon: "shield" },
  { t: "Enterprise scale", icon: "trend" },
  { t: "Talent retention focus", icon: "smile" },
];

const WHITEFIELD_FAQS = [
  {
    q: "Can NGriffinPay transition thousands of employees from our legacy ERP?",
    a: "Yes. The architecture is built to support large enterprise data migrations without disrupting active operations.",
  },
  {
    q: "Is the software updated for the latest Karnataka Professional Tax rules?",
    a: "Yes. The system automatically maps calculations to Karnataka's professional tax and labour requirements and keeps them updated.",
  },
  {
    q: "Will the platform slow down if thousands of employees check in at once?",
    a: "No. NGriffinPay runs on a horizontally scaling cloud architecture that adds resources during shift changes to process large volumes of face recognition scans and biometric logs without lag.",
  },
  {
    q: "Can we manage permanent employees and IT contractors together?",
    a: "Yes. Permanent payroll staff, independent contractors and third-party vendors are managed in one platform, with vendor billing kept separate from core payroll.",
  },
  {
    q: "How are night shifts and allowances handled?",
    a: "The system maps late-night shifts and cross-day rotations, and tracks overtime and night allowances from cloud check-ins and mobile geofencing.",
  },
  {
    q: "Where is our employee data stored?",
    a: "Data is protected with 256-bit SSL encryption in transit and at rest, strict role-based access control, and hosting on secure cloud infrastructure inside India.",
  },
  {
    q: "Does NGriffinPay generate PF and ESI ECR files?",
    a: "Yes. PF, ESI, PT and TDS are auto-calculated, and ECR files are generated in the format required by government portals.",
  },
  {
    q: "How fast are full & final settlements?",
    a: "The FnF engine computes gratuity, notice pay and leave encashment automatically, so settlements no longer take weeks.",
  },
];

export default function HrmsWhitefield() {
  return (
    <HrmsLocation
      area="Whitefield"
      heroTitle={["Best ", "HR & Payroll Software", " in Whitefield for IT & Tech Firms"]}
      heroTagline="Enterprise-grade, cloud-native HR & payroll for ITPL, EPIP Zone and beyond."
      heroIntro="Core HR and payroll in a single source of truth — built for accuracy, security and compliance at enterprise scale."
      flowSteps={FLOW}
      flowTitle={["One centralised HRMS platform —", "every activity connected"]}
      features={FEATURES}
      featuresTitle={["Why Whitefield enterprises", "choose NGriffinPay"]}
      industries={INDUSTRIES}
      compareTitle={["Legacy bottlenecks vs", "NGriffinPay infrastructure"]}
      matrix={MATRIX}
      why={WHY}
      faqs={WHITEFIELD_FAQS}
      heroImage="hrms-payroll-software-whitefield.png"
      heroAlt="Payroll and Attendance Management in Whitefield"
      previewImage="hrms-payroll-software-whitefield-1.jpg"
      previewAlt="Payroll and Attendance Management in Whitefield"
      previewTitle={["Less time on calculations.", "More on scale, strategy and talent."]}
      ctaTitle="Run HR and payroll at enterprise speed."
      ctaText="Secure, cloud-native HR and payroll for IT and tech firms in Whitefield."
    />
  );
}
