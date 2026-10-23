// Content for the Services section, rebuilt from brochure pages 5–11.
// Photos live in the same images folder used by I(): svc-photo-1.png … svc-photo-6.png
// (page 5 "HR / Admin Benefits" has no photo).

export const SERVICES = [
  {
    tab: 'HR / Admin Benefits',
    title: ['HR / Admin', 'Benefits'],
    sub: 'Smarter HR Operations for Modern Workplaces',
    layout: 'cards',
    items: [
      { i: 'calendar', t: 'Controlled Leave Flow', d: 'Multi-level approvals with full visibility.' },
      { i: 'rupee', t: 'One-Click Payroll', d: 'Automated compliance (PF, ESI, PT, TDS, IT).' },
      { i: 'shieldDoc', t: 'Audit Ready', d: 'Just one click for 50+ reports.' },
      { i: 'fingerprint', t: 'Smart Attendance', d: 'GPS, Biometrics & Facial recognition tracking.' },
      { i: 'trend', t: 'Strategic HR Shift', d: 'From manual reporting to leadership impact.' },
      { i: 'wallet', t: 'Seamless Tracking', d: 'Assets, Advance & Expenses in one system.' },
    ],
  },
  {
    tab: 'Employee Benefits',
    title: ['Employee', 'Benefits'],
    sub: 'Transparency, Speed & Independence for Employees',
    layout: 'phone',
    photo: 'svc-photo-1.png',
    items: [
      { i: 'mail', t: 'Instant Salary Slips', d: 'Anytime access, no HR chase' },
      { i: 'pointer', t: 'One-Click Requests', d: 'Leave or advance in seconds' },
      { i: 'bars', t: 'Transparent Growth', d: 'Appraisals, KPIs, & perks tracked clearly' },
      { i: 'globe', t: 'Connected Workplace', d: 'Easy link with manager & colleagues' },
      { i: 'cloud', t: 'Self-Service Freedom', d: 'Employees handle daily tasks independently, boosting satisfaction' },
    ],
  },
  {
    tab: 'Core HR & Onboarding',
    title: ['Core HR &', 'Onboarding'],
    layout: 'wheel',
    photo: 'svc-photo-2.png',
    banner: 'Streamline onboarding. Ensure accuracy. Drive productivity from day one.',
    items: [
      { i: 'file', t: 'Document collection, bank details, payment modes.' },
      { i: 'user', t: 'One-click employee addition.' },
      { i: 'building', t: 'Department, designation, grade, employee-type categorisation.' },
      { i: 'upload', t: 'Bulk upload (500+ employees).' },
    ],
  },
  {
    tab: 'Attendance & Leave',
    title: ['Attendance &', 'Leave'],
    layout: 'steps',
    photo: 'svc-photo-3.png',
    checkin: { label: 'Check-in', time: '9:30 AM', place: 'Bangalore Office' },
    items: [
      'GPS, biometric, facial login.',
      'Approval matrix with late buffers.',
      'Location-based tracking employee wise.',
      'Real-time logs & 30+ reports.',
      'Multi-level leave workflows & instant reports.',
    ],
  },
  {
    tab: 'Payroll & Finance',
    title: ['Payroll &', 'Finance'],
    layout: 'twocol',
    photo: 'svc-photo-4.png',
    banner: 'Accurate. Compliant. On Time. Every Time.',
    items: [
      'Instant payslips & 15+ payroll reports.',
      'Income tax declarations deductions reports.',
      'Automated PF, ESI, PT, TDS deductions.',
      'Advance management with EMI structures.',
      'Expense claims & approvals.',
      'Real-time batch calculations.',
      'One-click payroll processing.',
    ],
  },
  {
    tab: 'Performance & Engagement',
    title: ['Performance &', 'Engagement'],
    layout: 'timeline',
    photo: 'svc-photo-5.png',
    banner: 'Empower People. Drive Performance. Build Culture.',
    items: [
      'Appraisals with KRAs, KPIs, skill-based metrics.',
      'Team leader dashboards.',
      'Continuous feedback tracking.',
    ],
  },
  {
    tab: 'Task Management',
    title: ['Task Management', '(HRMS)'],
    layout: 'quad',
    photo: 'svc-photo-6.png',
    items: [
      { i: 'checklist', t: 'Task Assignment & Tracking', d: 'Simplify task execution with a centralized platform for assigning and managing work.' },
      { i: 'bell', t: 'Automated Notifications', d: 'Send reminders and alerts for pending tasks.' },
      { i: 'calClock', t: 'Priority & Deadline Management', d: 'Track progress, monitor priorities, and ensure every task is completed on time.' },
      { i: 'chart', t: 'Task History & Reporting', d: 'Maintain records of completed tasks for performance evaluation and reporting.' },
    ],
  },
];
