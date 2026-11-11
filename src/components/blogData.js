// blogData.js — all NGriffinPay  blog posts live here.
// Used by Blogs.jsx (listing page) and BlogPost.jsx (single post page).
//
// To add a post: copy one object below, give it a unique `slug`, and fill in `content`.
// Content is a list of blocks:
//   { type: "p", text: "Paragraph. Use **double stars** for bold." }
//   { type: "h2", text: "Section heading" }          ← appears in the "On this page" contents
//   { type: "h3", text: "Sub heading" }
//   { type: "list", items: ["Point", "**Bold lead:** rest of the point"] }
//   { type: "steps", items: ["First", "Second"] }   ← numbered list
//   { type: "callout", title: "Tip", text: "Highlighted note" }
//   { type: "quote", text: "Pull quote" }
//   { type: "table", head: ["Col 1", "Col 2"], rows: [["a", "b"], ["c", "d"]] }
//   { type: "img", src: I("file.jpg"), alt: "Description", caption: "Optional caption" }
//
// Images use your existing helper: I("file-name.jpg") — put the image files where I() reads from.

import { I } from "../data";

export const BLOG_POSTS = [
  {
    slug: "how-to-choose-hr-software-for-a-small-business-a-practical-buyers-guide",
    title: "How to Choose HR Software for a Small Business: A Practical Buyer’s Guide",
    date: "2026-09-26",
    category: "Buyer's Guide",
    author: "NGriffinPay  Team",
    image: I("blog-hr-software-small-business.jpg"),
    excerpt: "Running a growing business is exciting, but employee administration scales non-linearly.",
    content: [
      { type: "p", text: "Running a growing business is exciting, but employee administration scales non-linearly. What starts as a simple spreadsheet for a handful of people soon has to deal with biometric attendance logs, reimbursement cycles, state-wise deductions and a calendar full of statutory filings." },
      { type: "p", text: "Choosing the right **HR software for a small business** is not about buying the platform with the longest feature list. It is about finding a system that removes manual work, keeps you compliant and grows with your team." },
      { type: "h2", text: "The Operational Cost of Manual HR and Spreadsheets" },
      { type: "p", text: "When headcount is small, founders and office managers often run HR on spreadsheets. It works — until it doesn't. These are the costs that quietly build up:" },
      {
        type: "list",
        items: [
          "**Calculation slippage:** manual formulas break when salaries, attendance or deductions change mid-month.",
          "**Statutory deadlines:** PF, ESI, PT and TDS due dates are easy to miss when they live in someone's memory.",
          "**Data fragmentation:** attendance, leave, salary and documents end up in different files and inboxes.",
          "**Administrative drag:** hours every month go into chasing approvals, fixing errors and answering the same employee questions.",
        ],
      },
      { type: "callout", title: "Quick check", text: "If payroll takes your team more than a day every month, or you have ever paid a late-filing penalty, it is time to move off spreadsheets." },
      { type: "h2", text: "8 Essential Factors to Evaluate in HR Software" },
      { type: "h3", text: "1. Automated statutory payroll & labour law compliance" },
      { type: "p", text: "Payroll software must handle Indian statutory rules out of the box, not as an add-on. Look for:" },
      {
        type: "list",
        items: [
          "**Employees' Provident Fund (EPF):** automatic employee and employer contributions with ECR-ready reports.",
          "**Employees' State Insurance (ESIC):** eligibility tracking and contribution calculation every month.",
          "**Professional Tax (PT) & Labour Welfare Fund (LWF):** state-wise slabs applied automatically for each employee.",
          "**Gratuity provisioning:** a running view of gratuity liability so there are no surprises at exit.",
        ],
      },
      { type: "h3", text: "2. Attendance that flows straight into payroll" },
      { type: "p", text: "Biometric, mobile and geo-fenced attendance should feed payroll directly — including overtime, late marks and loss of pay — so nobody re-types numbers." },
      { type: "h3", text: "3. Employee self-service" },
      { type: "p", text: "A mobile app where employees apply for leave, download payslips and submit reimbursements cuts HR queries dramatically." },
      { type: "h3", text: "4. Leave and approval workflows" },
      { type: "p", text: "Custom leave policies and multi-level approval matrices keep things fair and consistent as teams grow." },
      { type: "h3", text: "5. Data security and access control" },
      { type: "p", text: "Salary and personal data are sensitive. Check for role-based access, audit trails and secure document storage." },
      { type: "h3", text: "6. Reports you will actually use" },
      { type: "p", text: "Monthly statutory reports, salary registers and headcount trends should be one click away — and exportable." },
      { type: "h3", text: "7. Room to grow" },
      { type: "p", text: "Pick a platform where you can add modules — assets, expenses, shifts, exits — without migrating to a new system later." },
      { type: "h3", text: "8. Local support and onboarding" },
      { type: "p", text: "Fast, local support during setup and payroll runs matters more than any feature on the pricing page." },
      {
        type: "table",
        head: ["Area", "Spreadsheets", "HR software"],
        rows: [
          ["Payroll run", "1–3 days, manual", "Minutes, automated"],
          ["Statutory reports", "Built by hand", "Generated every month"],
          ["Employee queries", "Email & calls", "Self-service app"],
          ["Audit trail", "None", "Every change logged"],
        ],
      },
      { type: "h2", text: "Final Thoughts" },
      { type: "p", text: "The best HR software for a small business is the one your team will use every day. Shortlist two or three tools, ask for a demo with your own payroll data, and choose the one that makes compliance automatic." },
      { type: "quote", text: "Good HR software doesn't just save time — it gives founders the confidence that every rupee and every filing is right." },
    ],
  },
  {
    slug: "october-2026-hr-update-labour-codes-pf-ceiling-payroll-changes-for-employers",
    title: "October 2026 HR Update: Labour Codes, PF Ceiling & Payroll Changes for Employers",
    date: "2026-10-05",
    category: "Compliance",
    author: "NGriffinPay  Team",
    image: I("blog-october-2026-hr-update.jpg"),
    excerpt: "October 2026 is an important month for HR and payroll teams across India.",
    content: [
      { type: "p", text: "October 2026 is an important month for HR and payroll teams across India." },
      { type: "callout", title: "Content placeholder", text: "Paste the full article from the existing page here, split into p / h2 / list blocks (see the guide at the top of blogData.js)." },
      { type: "h2", text: "Labour Codes" },
      { type: "p", text: "Section content goes here." },
      { type: "h2", text: "PF Wage Ceiling" },
      { type: "p", text: "Section content goes here." },
      { type: "h2", text: "Payroll Changes for Employers" },
      { type: "p", text: "Section content goes here." },
    ],
  },
  {
    slug: "a-day-in-the-life-of-modern-hr-daily-weekly-monthly-activities",
    title: "A Day in the Life of Modern HR : The Daily, Weekly and Monthly Activities That Keep a Company Running",
    date: "2026-10-06",
    category: "HR Operations",
    author: "NGriffinPay  Team",
    image: I("blog-day-in-the-life-of-modern-hr.jpg"),
    excerpt: "HR is often associated with recruitment, payroll and employee engagement.",
    content: [
      { type: "p", text: "HR is often associated with recruitment, payroll and employee engagement. But behind the scenes, a modern HR team runs a steady rhythm of daily, weekly and monthly work that keeps the whole company moving." },
      { type: "h2", text: "Daily Activities" },
      { type: "list", items: ["Reviewing attendance and late marks", "Approving leave and regularisation requests", "Answering employee queries", "Onboarding new joiners"] },
      { type: "h2", text: "Weekly Activities" },
      { type: "list", items: ["Shift planning and roster changes", "Checking pending approvals and exits", "Team check-ins with managers", "Updating employee records and documents"] },
      { type: "h2", text: "Monthly Activities" },
      { type: "steps", items: ["Lock attendance for the month", "Run payroll and share payslips", "File PF, ESI, PT and TDS", "Review HR reports and headcount"] },
      { type: "callout", title: "Where software helps", text: "Most of these tasks are repeatable. An HRMS like NGriffinPay  automates the routine steps so HR can focus on people." },
    ],
  },
];

/* ---------- helpers ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-09-26" → "Sep 26, 2026"
export const formatDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

const blockWords = (b) => {
  const t = [b.text, b.title, ...(b.items || []), ...(b.head || []), ...((b.rows || []).flat())].filter(Boolean).join(" ");
  return t.split(/\s+/).filter(Boolean).length;
};
export const readTime = (post) => Math.max(1, Math.round(post.content.reduce((n, b) => n + blockWords(b), 0) / 200));

export const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// newest first
export const sortedPosts = () => [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug) => BLOG_POSTS.find((p) => p.slug === slug);
export const CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];
