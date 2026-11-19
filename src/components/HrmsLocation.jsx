// HrmsLocation.jsx
// NGriffinPay — location landing page template: "Best HRMS & Payroll Software for <area> Businesses"
// One reusable component for every location page. Each area gets a tiny wrapper file
// that passes the area name and, optionally, its own FAQs, images and preview heading:
//
//   Wrapper file               Area               URL (route path in App.jsx)
//   HrmsBannerghattaRoad.jsx   Bannerghatta Road  /hr-payroll-software-bannerghatta-road-bangalore
//   HrmsJpNagar.jsx            JP Nagar           /hr-payroll-software-jp-nagar-bangalore
//   HrmsHsrLayout.jsx          HSR Layout         /hr-payroll-software-hsr-layout-bangalore
//   HrmsIndiranagar.jsx        Indiranagar        /hr-payroll-software-indranagar-bangalore
//   HrmsKiadb.jsx              KIADB              /hr-payroll-software-kiadb-bangalore
//   HrmsBasavanagudi.jsx       Basavanagudi       /hr-payroll-software-basavanagudi-bangalore
//   HrmsNelamangala.jsx        Nelamangala        /hr-payroll-software-nelamangala-bangalore
//   HrmsKoramangala.jsx        Koramangala        /hr-payroll-software-kormangala-bangalore
//   HrmsWhitefield.jsx         Whitefield         /hr-payroll-software-whitefield-bangalore
//   HrmsItpl.jsx               ITPL               /hr-payroll-software-itpl-bangalore
//   HrmsSarjapur.jsx           Sarjapur           /hr-payroll-software-sarjapur-bangalore
//   HrmsHarohalli.jsx          Harohalli          /hr-payroll-software-harohalli-bangalore
//   HrmsMagadiRoad.jsx         Magadi Road        /hr-payroll-software-magadi-road-bangalore
//   HrmsElectronicCity.jsx     Electronic City    /hr-payroll-software-electronic-city-bangalore
//
// To add a new location: copy HrmsIndiranagar.jsx, change area / faqs / images,
// then add a lazy import + <Route> in App.jsx. This file does not need to change.
// Optional: features / featuresTitle replace the default 6 feature cards.
// Optional: matrix (comparison table) and checklist (buyer checklist) sections.
// Optional extra sections (shown only when a location passes them):
//   selfService (phone mockup), sizes (growth-stage cards), industries (icon grid).
//
// Section 1: Hero — area pill, headline, CTA + hero image with live UI cards
// Section 2: Connected flow — Employee Data → Attendance → Leave → Payroll → Payslips → Reports
// Section 3: Features — 6 modules, each with a small realistic UI preview
// Section 4: Manual vs NGriffinPay — before/after + why businesses choose us
// Section 5: Workforce engine — 4 phases, 19 capabilities (auto-cycles)
// Section 6: Product preview image
// Section 7: FAQs (+ FAQPage schema) and final CTA
//
// Images (put them in public/images/):
//   Default (Bannerghatta Road):  the-best-hrms-payroll-software.png / the-best-hrms-payroll-software1.jpg
//   JP Nagar:                     hrms-payroll-software-jp-nagar.png / hrms-payroll-software-jp-nagar-1.jpg
//   HSR Layout:                   hrms-payroll-software-hsr-layout.png / hrms-payroll-software-hsr-layout-1.jpg
//   Indiranagar:                  hrms-payroll-software-indiranagar.png / hrms-payroll-software-indiranagar-1.jpg
//   Other locations follow the same pattern: hrms-payroll-software-<area>.png / -1.jpg
// If an image is missing, a built-in dashboard mockup is shown instead.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import { openDemo } from "./DemoModal";
import "./HrmsLocation.css";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const FLOW = [
  { k: "Employee Data", sub: "Profiles & records", icon: "users" },
  { k: "Attendance", sub: "Daily punches", icon: "clock" },
  { k: "Leave", sub: "Requests & balances", icon: "calendar" },
  { k: "Payroll", sub: "Monthly run", icon: "rupee" },
  { k: "Payslips", sub: "Shared with staff", icon: "file" },
  { k: "Reports", sub: "Ready to review", icon: "chart" },
];

const FEATURES = [
  {
    t: "Employee Management",
    d: "Every employee record in one organised place.",
    icon: "users",
    ui: "people",
  },
  {
    t: "Attendance Management",
    d: "Track attendance without manual registers.",
    icon: "clock",
    ui: "bars",
  },
  {
    t: "Leave Management",
    d: "A clear process for requests and balances.",
    icon: "calendar",
    ui: "leave",
  },
  {
    t: "Payroll Management",
    d: "Run recurring monthly payroll in one place.",
    icon: "rupee",
    ui: "payroll",
  },
  {
    t: "Payslip Management",
    d: "Payslips organised and easy to access.",
    icon: "file",
    ui: "payslip",
  },
  {
    t: "HR Reports",
    d: "Review employee and payroll data at a glance.",
    icon: "chart",
    ui: "spark",
  },
];

const MANUAL = [
  "Spreadsheets for every process",
  "Same data typed again and again",
  "Files scattered across folders",
  "Hours of payroll preparation",
];
const WITH_NGP = [
  "One centralised platform",
  "Enter once, use everywhere",
  "Records always organised",
  "A structured monthly payroll",
];

const WHY = [
  { t: "Simple to use", icon: "smile" },
  { t: "Centralised information", icon: "layers" },
  { t: "Reduced manual effort", icon: "zap" },
  { t: "Better visibility", icon: "eye" },
  { t: "Built for growing businesses", icon: "trend" },
];

const PHASES = [
  {
    no: "01",
    t: "Onboarding",
    s: "Employee Data",
    icon: "userPlus",
    items: [
      ["Talent Sourcing", "Turn resumes into employee profiles.", "search"],
      ["Digital Onboarding", "Simple, paperless employee joining.", "userPlus"],
      ["Employee Profiles", "All employee data in one place.", "id"],
      ["Secure Document Vault", "Safely store employee documents.", "lock"],
    ],
  },
  {
    no: "02",
    t: "Attendance",
    s: "Workforce Management",
    icon: "clock",
    items: [
      ["GPS Attendance", "Track attendance with mobile GPS.", "pin"],
      ["Biometric Integration", "Connect with biometric devices.", "finger"],
      ["Shift Management", "Easily manage shifts and rosters.", "calendar"],
      ["Leave Management", "Automate leave tracking and approvals.", "check"],
    ],
  },
  {
    no: "03",
    t: "Payroll",
    s: "Compliance",
    icon: "rupee",
    items: [
      [
        "Automated Payroll",
        "Calculate payroll quickly and accurately.",
        "calc",
      ],
      [
        "Salary Management",
        "Manage CTC, allowances and variable pay.",
        "rupee",
      ],
      ["PF & ESI", "Generate PF and ESI files easily.", "file"],
      ["TDS Management", "Manage Old and New tax regimes.", "percent"],
      ["Compliance Updates", "Stay updated with labour rules.", "shield"],
    ],
  },
  {
    no: "04",
    t: "Performance",
    s: "Employee Exit",
    icon: "trend",
    items: [
      ["Performance Tracking", "Track goals and achievements.", "target"],
      [
        "Employee Self-Service",
        "Employees manage their own HR tasks.",
        "users",
      ],
      ["Full & Final Settlement", "Simplify exits and settlements.", "exit"],
      ["HR Dashboards", "View workforce costs and insights.", "grid"],
      ["Workforce Analytics", "Identify trends and patterns.", "chart"],
      ["Mobile Workforce", "Manage employees from anywhere.", "phone"],
    ],
  },
];

const faqsFor = (area) => [
  {
    q: "What is HRMS software?",
    a: "HRMS software helps businesses manage everyday HR activities such as employee records, attendance, leave, payroll and HR reporting from one centralised system.",
  },
  {
    q: "Does NGriffinPay provide payroll management?",
    a: "Yes. NGriffinPay includes payroll management to help businesses organise and run their monthly payroll more efficiently.",
  },
  {
    q: "Can NGriffinPay manage employee attendance?",
    a: "Yes. Attendance management helps you maintain and manage employee attendance information without manual registers.",
  },
  {
    q: "Does the platform include leave management?",
    a: "Yes. NGriffinPay provides leave management to organise employee leave requests, balances and records.",
  },
  {
    q: "Can employees access their payslips?",
    a: "NGriffinPay includes payslip management, keeping employee payslip information organised within the platform.",
  },
  {
    q: `Is NGriffinPay suitable for growing businesses in ${area}?`,
    a: `Yes. NGriffinPay is designed for businesses in ${area} that want to simplify and centralise their HR and payroll operations as their workforce grows.`,
  },
];

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 18 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "users":
      return (
        <svg {...p}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "userPlus":
      return (
        <svg {...p}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 8v6M22 11h-6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "rupee":
      return (
        <svg {...p}>
          <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "x":
      return (
        <svg {...p} strokeWidth={3}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      );
    case "smile":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
      );
    case "layers":
      return (
        <svg {...p}>
          <path d="m12 2 10 5-10 5L2 7z" />
          <path d="m2 12 10 5 10-5M2 17l10 5 10-5" />
        </svg>
      );
    case "zap":
      return (
        <svg {...p}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
        </svg>
      );
    case "eye":
      return (
        <svg {...p}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "trend":
      return (
        <svg {...p}>
          <path d="m22 7-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "id":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="11" r="2.5" />
          <path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9h3M15 13h3" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "finger":
      return (
        <svg {...p}>
          <path d="M12 11v4M8.5 7.5A5 5 0 0 1 17 11v2M7 12a5 5 0 0 1 .4-2M7 16c.6 2 1.6 3.6 3 5M12 19c1-1.4 1.6-3 2-5M17 16.5c-.2 1.3-.6 2.6-1.2 3.7" />
          <path d="M4.3 9A8 8 0 0 1 19.6 8.5" />
        </svg>
      );
    case "calc":
      return (
        <svg {...p}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
        </svg>
      );
    case "percent":
      return (
        <svg {...p}>
          <path d="M19 5 5 19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "target":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "exit":
      return (
        <svg {...p}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "code":
      return (
        <svg {...p}>
          <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...p}>
          <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
          <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...p}>
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    case "bank":
      return (
        <svg {...p}>
          <path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-7 10 7z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...p}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
          <path d="M3.5 12h4l2-3 3 6 2-3h6" />
        </svg>
      );
    case "factory":
      return (
        <svg {...p}>
          <path d="M2 20V9l6 4V9l6 4V4h4l2 16z" />
          <path d="M2 20h20" />
        </svg>
      );
    case "cart":
      return (
        <svg {...p}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
        </svg>
      );
    case "sheet":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      );
    case "truck":
      return (
        <svg {...p}>
          <path d="M1 4h14v12H1zM15 9h4l4 4v3h-8z" />
          <circle cx="6" cy="18.5" r="2" />
          <circle cx="18" cy="18.5" r="2" />
        </svg>
      );
    case "box":
      return (
        <svg {...p}>
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </svg>
      );
    case "cog":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...p}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
          <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
        </svg>
      );
    case "headset":
      return (
        <svg {...p}>
          <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
          <path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z" />
          <path d="M18 17v1a3 3 0 0 1-3 3h-3" />
        </svg>
      );
    case "org":
      return (
        <svg {...p}>
          <rect x="9" y="2" width="6" height="5" rx="1" />
          <rect x="2" y="17" width="6" height="5" rx="1" />
          <rect x="16" y="17" width="6" height="5" rx="1" />
          <path d="M12 7v5M5 17v-5h14v5" />
        </svg>
      );
    case "warehouse":
      return (
        <svg {...p}>
          <path d="M22 8.4V21H2V8.4L12 3z" />
          <path d="M6 21v-9h12v9M6 15h12M6 18h12" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Built-in dashboard mockup (also the fallback if an image is missing) */
/* ------------------------------------------------------------------ */

function DashboardMock({ area }) {
  return (
    <div className="loc-dash" aria-hidden="true">
      <div className="loc-dash-chrome">
        <i />
        <i />
        <i />
        <span>app.ngriffinpay.in/dashboard</span>
      </div>
      <div className="loc-dash-body">
        <aside className="loc-dash-side">
          {["grid", "users", "clock", "calendar", "rupee", "chart"].map(
            (n, i) => (
              <span key={n} className={i === 0 ? "is-on" : ""}>
                <Icon name={n} size={14} />
              </span>
            ),
          )}
        </aside>
        <div className="loc-dash-main">
          <div className="loc-dash-head">
            <b>Good morning, HR team</b>
            <small>
              <Icon name="pin" size={11} /> {area} office
            </small>
          </div>
          <div className="loc-kpis">
            <div>
              <small>Employees</small>
              <b>248</b>
            </div>
            <div>
              <small>Present today</small>
              <b>231</b>
            </div>
            <div>
              <small>On leave</small>
              <b>9</b>
            </div>
          </div>
          <div className="loc-dash-row">
            <div className="loc-dash-card">
              <small>Attendance · this week</small>
              <div className="loc-mini-bars">
                {[72, 88, 94, 81, 96, 60].map((h, i) => (
                  <i key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="loc-dash-card">
              <small>November payroll</small>
              <div className="loc-ring">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" className="bg" />
                  <circle cx="18" cy="18" r="15" className="fg" />
                </svg>
                <b>100%</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Image with automatic fallback to the mockup */
// eager = above the fold (hero): load immediately with high priority for a faster first paint
function SmartImage({ src, alt, area, className, eager = false }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <DashboardMock area={area} />;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchpriority={eager ? "high" : "auto"}
      decoding="async"
      onError={() => setOk(false)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero                                                    */
/* ------------------------------------------------------------------ */

function Hero({ area, heroImage, heroAlt, heroTitle, heroTagline, heroIntro }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".loc-hero-copy > *", {
        y: 26,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
      })
        .from(
          ".loc-hero-visual",
          { y: 40, opacity: 0, scale: 0.96, duration: 0.8 },
          "-=0.45",
        )
        .from(
          ".loc-float",
          {
            y: 20,
            opacity: 0,
            scale: 0.85,
            stagger: 0.15,
            duration: 0.5,
            ease: "back.out(1.8)",
          },
          "-=0.3",
        );
      gsap.utils
        .toArray(".loc-float")
        .forEach((el, i) =>
          gsap.to(el, {
            y: i % 2 ? 8 : -8,
            duration: 2.4 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.5,
          }),
        );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-hero" ref={ref} aria-labelledby="loc-title">
      <div className="loc-hero-bg" aria-hidden="true">
        <span className="b1" />
        <span className="b2" />
      </div>
      <div className="loc-container loc-hero-grid">
        <div className="loc-hero-copy">
          <span className="loc-pill">
            <Icon name="pin" size={13} /> {area}, Bengaluru
          </span>
          <h1 id="loc-title">
            {heroTitle ? (
              <>
                {heroTitle[0]}
                <span>{heroTitle[1]}</span>
                {heroTitle[2]}
              </>
            ) : (
              <>
                The Best <span>HRMS &amp; Payroll Software</span> for {area}{" "}
                Businesses
              </>
            )}
          </h1>
          <h2>
            {heroTagline ||
              "Simplify HR. Automate Payroll. Stay focused on your people."}
          </h2>
          <p>
            {heroIntro ||
              "Employee records, attendance, leave, payroll, payslips and HR reports — together in one centralised platform."}
          </p>
          <div className="loc-ctas">
            <a
              href="/contact-us"
              className="loc-btn primary"
              onClick={openDemo}
            >
              Experience NGriffinPay <Icon name="arrow" size={16} />
            </a>
            <a href="#loc-flow" className="loc-btn ghost">
              <span className="loc-play">
                <Icon name="play" size={10} />
              </span>{" "}
              See how it works
            </a>
          </div>
          <ul className="loc-hero-ticks">
            {["Attendance", "Leave", "Payroll", "Payslips"].map((t) => (
              <li key={t}>
                <Icon name="check" size={11} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="loc-hero-visual">
          <SmartImage
            className="loc-hero-img"
            eager
            src={I(heroImage)}
            alt={heroAlt || `HRMS software in Bangalore, ${area}`}
            area={area}
          />
          <div className="loc-float f1">
            <span className="ic ok">
              <Icon name="check" size={14} />
            </span>
            <div>
              <b>231 / 248 present</b>
              <small>Attendance synced</small>
            </div>
          </div>
          <div className="loc-float f2">
            <span className="ic pr">
              <Icon name="rupee" size={14} />
            </span>
            <div>
              <b>Payroll processed</b>
              <small>November · 248 payslips</small>
            </div>
          </div>
          <div className="loc-float f3">
            <span className="ic lv">
              <Icon name="calendar" size={14} />
            </span>
            <div>
              <b>Leave approved</b>
              <small>Priya S. · 2 days</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Connected flow                                          */
/* ------------------------------------------------------------------ */

function Flow({ steps = FLOW, title }) {
  const FLOW_STEPS = steps;
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setRun(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run || prefersReduced()) {
      if (prefersReduced()) setStep(FLOW_STEPS.length - 1);
      return undefined;
    }
    const t = setInterval(
      () => setStep((s) => (s + 1) % (FLOW_STEPS.length + 1)),
      1100,
    );
    return () => clearInterval(t);
  }, [run]);

  const lit = Math.min(step, FLOW_STEPS.length - 1);
  const pct =
    (Math.min(step, FLOW_STEPS.length - 1) / (FLOW_STEPS.length - 1)) * 100;

  return (
    <section className="loc-sec loc-flow" id="loc-flow" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">One connected workflow</span>
          <h2>
            {
              (title || [
                "From employee data to reports —",
                "without switching systems",
              ])[0]
            }{" "}
            <span>{(title || ["", "without switching systems"])[1]}</span>
          </h2>
        </div>
        <div className="loc-flow-track" style={{ "--n": FLOW_STEPS.length }}>
          <div className="loc-flow-line">
            <i style={{ width: `${pct}%` }} />
          </div>
          {FLOW_STEPS.map((f, i) => (
            <div
              key={f.k}
              className={`loc-node ${i <= lit && step < FLOW_STEPS.length ? "is-lit" : ""} ${i === lit && step < FLOW_STEPS.length ? "is-now" : ""}`}
            >
              <span className="loc-node-ic">
                <Icon name={f.icon} size={20} />
              </span>
              <b>{f.k}</b>
              <small>{f.sub}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Features with mini UI previews                          */
/* ------------------------------------------------------------------ */

function MiniUI({ type, data = {} }) {
  switch (type) {
    case "people":
      return (
        <div className="loc-ui people">
          {["PS", "KV", "AR", "RM"].map((a, i) => (
            <span key={a} className={`av t${i}`}>
              {a}
            </span>
          ))}
          <em>+244</em>
        </div>
      );
    case "bars":
      return (
        <div className="loc-ui bars">
          {[70, 92, 85, 96, 78].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      );
    case "leave":
      return (
        <div className="loc-ui leave">
          <span>Casual leave · 2 days</span>
          <em>
            <Icon name="check" size={10} /> Approved
          </em>
        </div>
      );
    case "payroll":
      return (
        <div className="loc-ui payroll">
          <span>
            Nov payroll <b>100%</b>
          </span>
          <div>
            <i />
          </div>
        </div>
      );
    case "payslip":
      return (
        <div className="loc-ui payslip">
          <Icon name="file" size={16} />
          <span>
            <b>Payslip_Nov.pdf</b>
            <small>Ready to download</small>
          </span>
        </div>
      );
    case "gps":
      return (
        <div className="loc-ui gps">
          <span className="ic">
            <Icon name="pin" size={14} />
          </span>
          <span>
            <b>Warehouse 2 · inside zone</b>
            <small>Punched in 08:58 AM</small>
          </span>
        </div>
      );
    case "bio":
      return (
        <div className="loc-ui gps">
          <span className="ic">
            <Icon name="finger" size={14} />
          </span>
          <span>
            <b>Biometric device synced</b>
            <small>412 punches imported</small>
          </span>
          <em>
            <Icon name="check" size={10} />
          </em>
        </div>
      );
    case "shift":
      return (
        <div className="loc-ui shift">
          {[
            ["Morning", "6–2"],
            ["Evening", "2–10"],
            ["Night", "10–6"],
          ].map(([n, t], i) => (
            <span key={n} className={`s${i}`}>
              <b>{n}</b>
              <small>{t}</small>
            </span>
          ))}
        </div>
      );
    case "ot":
      return (
        <div className="loc-ui payroll">
          <span>
            Overtime this month <b>36 hrs</b>
          </span>
          <div>
            <i style={{ width: "62%" }} />
          </div>
        </div>
      );
    case "ess":
      return (
        <div className="loc-ui ess">
          {[
            ["clock", "Attendance"],
            ["calendar", "Leave"],
            ["file", "Payslip"],
          ].map(([ic, t]) => (
            <span key={t}>
              <Icon name={ic} size={14} />
              {t}
            </span>
          ))}
        </div>
      );
    case "docs":
      return (
        <div className="loc-ui payslip">
          <Icon name="file" size={16} />
          <span>
            <b>Offer_Letter.pdf</b>
            <small>e-signed · stored in vault</small>
          </span>
        </div>
      );
    case "onboard":
      return (
        <div className="loc-ui payroll">
          <span>
            Onboarding · 4 of 5 steps <b>80%</b>
          </span>
          <div>
            <i style={{ width: "80%" }} />
          </div>
        </div>
      );
    case "tax":
      return (
        <div className="loc-ui ess">
          {["PF", "ESI", "TDS", "PT"].map((t) => (
            <span key={t}>
              <Icon name="check" size={12} />
              {t}
            </span>
          ))}
        </div>
      );
    case "perf":
      return (
        <div className="loc-ui payroll">
          <span>
            Q3 goals achieved <b>8 / 10</b>
          </span>
          <div>
            <i style={{ width: "80%" }} />
          </div>
        </div>
      );
    case "fnf":
      return (
        <div className="loc-ui leave">
          <span>F&amp;F · Rahul K.</span>
          <em>
            <Icon name="check" size={10} /> Settled
          </em>
        </div>
      );
    // generic previews driven by the feature's own data
    case "chips": // f.chips = [[label, icon], ...]
      return (
        <div className="loc-ui ess">
          {(data.chips || []).map(([t, ic]) => (
            <span key={t}>
              <Icon name={ic || "check"} size={12} />
              {t}
            </span>
          ))}
        </div>
      );
    case "bar": // f.bar = [label, value, percent]
      return (
        <div className="loc-ui payroll">
          <span>
            {data.bar[0]} <b>{data.bar[1]}</b>
          </span>
          <div>
            <i style={{ width: `${data.bar[2]}%` }} />
          </div>
        </div>
      );
    case "status": // f.status = [title, sub, badge]
      return (
        <div className="loc-ui gps">
          <span className="ic">
            <Icon name={data.icon} size={14} />
          </span>
          <span>
            <b>{data.status[0]}</b>
            <small>{data.status[1]}</small>
          </span>
          {data.status[2] && (
            <em>
              <Icon name="check" size={10} />
            </em>
          )}
        </div>
      );
    default:
      return (
        <div className="loc-ui spark">
          <svg viewBox="0 0 120 36" preserveAspectRatio="none">
            <path d="M0 30 L20 24 L40 27 L60 15 L80 18 L100 8 L120 10" />
          </svg>
        </div>
      );
  }
}

function Features({ items = FEATURES, title }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".loc-feat", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-sec" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">Everything in one place</span>
          <h2>
            {
              (title || [
                "Everything your HR team needs,",
                "in one platform",
              ])[0]
            }{" "}
            <span>{(title || ["", "in one platform"])[1]}</span>
          </h2>
        </div>
        <div className="loc-feat-grid">
          {items.map((f) => (
            <article key={f.t} className="loc-feat">
              <span className="loc-feat-ic">
                <Icon name={f.icon} size={20} />
              </span>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
              <MiniUI type={f.ui} data={f} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Manual vs NGriffinPay + why choose                      */
/* ------------------------------------------------------------------ */

function Compare({
  title,
  manual = MANUAL,
  withNgp = WITH_NGP,
  why = WHY,
  matrix,
}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const st = { trigger: ref.current, start: "top 70%" };
      gsap.from(".loc-cmp-card.bad", {
        x: -40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: st,
      });
      gsap.from(".loc-cmp-card.good", {
        x: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: st,
      });
      gsap.from(".loc-mx-row", {
        y: 16,
        opacity: 0,
        stagger: 0.07,
        duration: 0.45,
        ease: "power3.out",
        scrollTrigger: st,
      });
      gsap.from(".loc-cmp-card li", {
        y: 10,
        opacity: 0,
        stagger: 0.06,
        duration: 0.35,
        delay: 0.3,
        scrollTrigger: st,
      });
      gsap.from(".loc-why span", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.07,
        duration: 0.4,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".loc-why", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-sec loc-cmp" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">
            {matrix ? "Legacy vs NGriffinPay" : "Less manual work"}
          </span>
          <h2>
            {
              (title || [
                "Reduce manual HR work.",
                "Improve everyday operations.",
              ])[0]
            }{" "}
            <span>{(title || ["", "Improve everyday operations."])[1]}</span>
          </h2>
        </div>
        {matrix ? (
          <div
            className="loc-mx"
            role="table"
            aria-label="Legacy systems vs NGriffinPay"
          >
            <div className="loc-mx-row head" role="row">
              <span role="columnheader">Requirement</span>
              <span role="columnheader">
                <i className="bad">
                  <Icon name="x" size={10} />
                </i>{" "}
                Legacy bottleneck
              </span>
              <span role="columnheader">
                <img src={I("ngriffinpay-mark.png")} alt="" /> NGriffinPay
              </span>
            </div>
            {matrix.map(([req, bad, good, ic]) => (
              <div key={req} className="loc-mx-row" role="row">
                <b role="cell">
                  <span className="ic">
                    <Icon name={ic} size={16} />
                  </span>
                  {req}
                </b>
                <span role="cell" className="bad">
                  <i>
                    <Icon name="x" size={10} />
                  </i>
                  {bad}
                </span>
                <span role="cell" className="good">
                  <i>
                    <Icon name="check" size={10} />
                  </i>
                  {good}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="loc-cmp-grid">
            <div className="loc-cmp-card bad">
              <div className="loc-cmp-top">
                <span className="ic">
                  <Icon name="sheet" size={18} />
                </span>
                <b>Managing HR manually</b>
              </div>
              <ul>
                {manual.map((m) => (
                  <li key={m}>
                    <i>
                      <Icon name="x" size={10} />
                    </i>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="loc-cmp-vs" aria-hidden="true">
              VS
            </div>
            <div className="loc-cmp-card good">
              <div className="loc-cmp-top">
                <span className="ic">
                  <img src={I("ngriffinpay-mark.png")} alt="" />
                </span>
                <b>With NGriffinPay</b>
              </div>
              <ul>
                {withNgp.map((m) => (
                  <li key={m}>
                    <i>
                      <Icon name="check" size={10} />
                    </i>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="loc-why" aria-label="Why businesses choose NGriffinPay">
          {why.map((w) => (
            <span key={w.t}>
              <Icon name={w.icon} size={16} /> {w.t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Optional — Buyer checklist (ticks itself when scrolled into view)   */
/* ------------------------------------------------------------------ */

function Checklist({ data }) {
  const ref = useRef(null);
  const [ticked, setTicked] = useState(
    prefersReduced() ? data.items.length : 0,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return undefined;
    let t;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let n = 0;
        t = setInterval(() => {
          n += 1;
          setTicked(n);
          if (n >= data.items.length) clearInterval(t);
        }, 90);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(t);
    };
  }, [data.items.length]);

  const half = Math.ceil(data.items.length / 2);
  const done = ticked >= data.items.length;

  return (
    <section className="loc-sec loc-chk" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">Buyer checklist</span>
          <h2>
            {data.title[0]} <span>{data.title[1]}</span>
          </h2>
        </div>
        <div className="loc-chk-card">
          <div className="loc-chk-top">
            <b>
              {Math.min(ticked, data.items.length)} / {data.items.length}
            </b>
            <span>requirements covered by NGriffinPay</span>
            <div className="loc-chk-bar">
              <i
                style={{
                  width: `${(Math.min(ticked, data.items.length) / data.items.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="loc-chk-cols">
            {[data.items.slice(0, half), data.items.slice(half)].map(
              (col, c) => (
                <ul key={c}>
                  {col.map((t, j) => {
                    const i = c * half + j;
                    return (
                      <li key={t} className={i < ticked ? "is-on" : ""}>
                        <i>
                          <Icon name="check" size={11} />
                        </i>
                        {t}
                      </li>
                    );
                  })}
                </ul>
              ),
            )}
          </div>
          {data.note && (
            <p className={`loc-chk-note ${done ? "is-on" : ""}`}>
              <Icon name="shield" size={16} /> {data.note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — Workforce engine (4 phases)                             */
/* ------------------------------------------------------------------ */

const PHASE_TIME = 6000;

function Engine() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || prefersReduced()) return undefined;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % PHASES.length),
      PHASE_TIME,
    );
    return () => clearTimeout(t);
  }, [active, inView, paused]);

  useLayoutEffect(() => {
    if (prefersReduced() || !gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power3.out" },
    );
  }, [active]);

  const ph = PHASES[active];
  const start = PHASES.slice(0, active).reduce((s, p) => s + p.items.length, 0);

  return (
    <section
      className="loc-sec loc-engine"
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="loc-container">
        <div className="loc-head light">
          <span className="loc-eyebrow">NGriffinPay HRMS</span>
          <h2>
            The end-to-end <span>workforce engine</span>
          </h2>
          <p>
            From hiring to exit — the complete employee lifecycle in one
            platform.
          </p>
        </div>

        <div
          className="loc-phases"
          role="tablist"
          aria-label="Employee lifecycle phases"
        >
          {PHASES.map((p, i) => (
            <button
              key={p.no}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`loc-phase ${active === i ? "is-on" : ""} ${i < active ? "is-done" : ""}`}
              onClick={() => setActive(i)}
            >
              <em>{p.no}</em>
              <span>
                <b>{p.t} &amp;</b>
                <small>{p.s}</small>
              </span>
              {active === i && !paused && inView && (
                <i
                  className="loc-phase-bar"
                  key={active}
                  style={{ animationDuration: `${PHASE_TIME}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="loc-phase-panel" role="tabpanel">
          <div className="loc-phase-title">
            <span className="ic">
              <Icon name={ph.icon} size={20} />
            </span>
            <h3>
              {ph.t} &amp; {ph.s}
            </h3>
            <em>{ph.items.length} capabilities</em>
          </div>
          <div className="loc-cap-grid" ref={gridRef}>
            {ph.items.map(([t, d, ic], i) => (
              <div key={t} className="loc-cap">
                <span className="no">
                  {String(start + i + 1).padStart(2, "0")}
                </span>
                <span className="ic">
                  <Icon name={ic} size={18} />
                </span>
                <b>{t}</b>
                <small>{d}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 6 — Product preview                                         */
/* ------------------------------------------------------------------ */

function Preview({ area, previewImage, previewAlt, previewTitle }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".loc-prev-frame", {
        y: 60,
        rotationX: 10,
        opacity: 0,
        transformPerspective: 1200,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-sec loc-prev" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">Designed for growing businesses</span>
          <h2>
            {previewTitle[0]} <span>{previewTitle[1]}</span>
          </h2>
        </div>
        <div className="loc-prev-frame">
          <div className="loc-prev-chrome">
            <i />
            <i />
            <i />
            <span>NGriffinPay HRMS</span>
          </div>
          <SmartImage
            className="loc-prev-img"
            src={I(previewImage)}
            alt={previewAlt || `HRMS software in Bangalore, ${area}`}
            area={area}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Optional — Employee self-service (phone mockup)                     */
/* ------------------------------------------------------------------ */

function SelfService({ data }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const st = { trigger: ref.current, start: "top 70%" };
      gsap.from(".loc-phone", {
        y: 60,
        rotation: -4,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: st,
      });
      gsap.from(".loc-phone-row", {
        x: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.3,
        scrollTrigger: st,
      });
      gsap.from(".loc-ss-copy > *", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        scrollTrigger: st,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-sec loc-ss" ref={ref}>
      <div className="loc-container loc-ss-grid">
        <div className="loc-ss-copy">
          <span className="loc-eyebrow">Employee self-service</span>
          <h2>
            {data.title[0]} <span>{data.title[1]}</span>
          </h2>
          <p>{data.text}</p>
          <ul className="loc-ss-points">
            {data.points.map((t) => (
              <li key={t}>
                <Icon name="check" size={11} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="loc-phone-wrap" aria-hidden="true">
          <div className="loc-phone">
            <div className="loc-phone-notch" />
            <div className="loc-phone-head">
              <span className="av">PS</span>
              <div>
                <b>Hi, Priya</b>
                <small>Thursday, 19 Nov</small>
              </div>
              <Icon name="bell" size={16} />
            </div>
            <div className="loc-phone-punch">
              <small>Punched in · 09:32 AM</small>
              <b>7:45 hrs</b>
            </div>
            {data.items.map(([label, icon, meta]) => (
              <div key={label} className="loc-phone-row">
                <span className="ic">
                  <Icon name={icon} size={16} />
                </span>
                <span className="t">{label}</span>
                <em>{meta}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Optional — Growth stages (company size cards)                       */
/* ------------------------------------------------------------------ */

function Sizes({ data }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".loc-size", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".loc-size-bar i", {
        scaleX: 0,
        transformOrigin: "left",
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-sec loc-sizes" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">For every stage of growth</span>
          <h2>
            {data.title[0]} <span>{data.title[1]}</span>
          </h2>
          {data.text && <p>{data.text}</p>}
        </div>
        <div className="loc-size-grid">
          {data.cards.map((c, i) => (
            <article key={c.range} className={`loc-size s${i}`}>
              <div className="loc-size-top">
                <span className="loc-size-people">
                  {Array.from({ length: i + 2 }, (_, k) => (
                    <Icon key={k} name="users" size={14} />
                  ))}
                </span>
                <em>{c.label}</em>
              </div>
              <b>{c.range}</b>
              <small>employees</small>
              <div className="loc-size-bar">
                <i style={{ width: `${34 + i * 33}%` }} />
              </div>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
        {data.note && <p className="loc-size-note">{data.note}</p>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Optional — Industries (icon grid)                                   */
/* ------------------------------------------------------------------ */

function Industries({ data, area }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".loc-ind", {
        y: 30,
        scale: 0.95,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="loc-sec loc-inds" ref={ref}>
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">Industries</span>
          <h2>
            Who can use NGriffinPay <span>in {area}?</span>
          </h2>
        </div>
        <div
          className={`loc-ind-grid ${data.length % 3 === 0 && data.length % 4 !== 0 ? "c3" : ""}`}
        >
          {data.map(([t, d, icon]) => (
            <article key={t} className="loc-ind">
              <span className="ic">
                <Icon name={icon} size={22} />
              </span>
              <b>{t}</b>
              <small>{d}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 7 — FAQs + CTA                                              */
/* ------------------------------------------------------------------ */

function Faqs({ area, faqs: custom }) {
  const [open, setOpen] = useState(0);
  const faqs = custom && custom.length ? custom : faqsFor(area);
  const half = Math.ceil(faqs.length / 2);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="loc-sec loc-faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="loc-container">
        <div className="loc-head">
          <span className="loc-eyebrow">FAQs</span>
          <h2>
            Frequently asked <span>questions</span>
          </h2>
          <p>
            Everything businesses in {area} usually ask before switching to
            NGriffinPay.
          </p>
        </div>
        {/* two equal columns: first half on the left, second half on the right */}
        <div className="loc-faq-cols">
          {[faqs.slice(0, half), faqs.slice(half)].map((col, c) => (
            <div key={c} className="loc-faq-list">
              {col.map((f, j) => {
                const i = c * half + j;
                return (
                  <div
                    key={f.q}
                    className={`loc-faq-item ${open === i ? "is-open" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(open === i ? -1 : i)}
                      aria-expanded={open === i}
                    >
                      <em>{String(i + 1).padStart(2, "0")}</em>
                      <span>{f.q}</span>
                      <i>
                        <Icon name="chev" size={16} />
                      </i>
                    </button>
                    <div className="loc-faq-a">
                      <div>
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ area, title, text }) {
  return (
    <section className="loc-cta">
      <div className="loc-container loc-cta-in">
        <div>
          <h2>{title || "Make HR simpler. Make payroll more efficient."}</h2>
          <p>
            {text ||
              `Ready to simplify HR and payroll for your business in ${area}?`}
          </p>
        </div>
        <a href="/contact-us" className="loc-btn light" onClick={openDemo}>
          Experience NGriffinPay <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HrmsLocation({
  area = "Bannerghatta Road",
  faqs, // optional: [{ q, a }, ...] — uses the default FAQs when not given
  heroImage = "the-best-hrms-payroll-software.png",
  heroAlt,
  previewImage = "the-best-hrms-payroll-software1.jpg",
  previewAlt,
  previewTitle = [
    "Simple enough for everyday use.",
    "Powerful enough to grow with you.",
  ],
  // optional overrides (defaults keep the original page)
  heroTitle, // [before, highlighted, after]
  heroTagline,
  heroIntro,
  flowSteps,
  flowTitle, // [plain, highlighted]
  features, // [{ t, d, icon, ui }] — ui: people | bars | leave | payroll | payslip | gps | bio | shift | ot | ess | docs | onboard | tax | perf | fnf | spark
  //   generic: chips (f.chips) | bar (f.bar) | status (f.status)
  featuresTitle, // [plain, highlighted]
  compareTitle,
  matrix, // optional: [[requirement, legacy, ngriffinpay, icon], ...] — shows a comparison table instead of the two cards
  manual,
  withNgp,
  why,
  ctaTitle,
  ctaText,
  // optional extra sections
  selfService,
  sizes,
  industries,
  checklist, // optional: { title: [plain, highlighted], items: [...], note }
}) {
  useEffect(() => {
    document.title = `Best HRMS & Payroll Software in ${area}, Bengaluru | NGriffinPay`;
  }, [area]);

  return (
    <main className="loc-page">
      <Hero
        area={area}
        heroImage={heroImage}
        heroAlt={heroAlt}
        heroTitle={heroTitle}
        heroTagline={heroTagline}
        heroIntro={heroIntro}
      />
      <Flow steps={flowSteps} title={flowTitle} />
      <Features items={features} title={featuresTitle} />
      {selfService && <SelfService data={selfService} />}
      {sizes && <Sizes data={sizes} />}
      {industries && <Industries data={industries} area={area} />}
      <Compare
        title={compareTitle}
        manual={manual}
        withNgp={withNgp}
        why={why}
        matrix={matrix}
      />
      {checklist && <Checklist data={checklist} />}
      <Engine />
      <Preview
        area={area}
        previewImage={previewImage}
        previewAlt={previewAlt}
        previewTitle={previewTitle}
      />
      <Faqs area={area} faqs={faqs} />
      <FinalCta area={area} title={ctaTitle} text={ctaText} />
    </main>
  );
}
