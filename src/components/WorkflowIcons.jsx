const N = '#17496b';
const O = '#f5a623';

// order matches ITEMS in Workflow.jsx (clockwise)
export const WORKFLOW_ICONS = [
  // 0 attendance
  <svg key="a" viewBox="0 0 64 64">
    <rect x="5" y="10" width="54" height="50" rx="10" fill={N} />
    <rect x="17" y="3" width="7" height="16" rx="3.5" fill={N} stroke="#f4f7fb" strokeWidth="2" />
    <rect x="40" y="3" width="7" height="16" rx="3.5" fill={N} stroke="#f4f7fb" strokeWidth="2" />
    {[0, 1, 2].map(c => [0, 1].map(r => (
      <circle key={c + '-' + r} cx={20 + c * 12} cy={34 + r * 12} r="3.6" fill={O} />
    )))}
  </svg>,
  // 1 payroll
  <svg key="p" viewBox="0 0 64 64">
    <rect x="14" y="16" width="46" height="36" rx="10" fill={O} />
    <rect x="4" y="10" width="48" height="38" rx="10" fill={N} />
    <circle cx="28" cy="29" r="9" fill="#fff" />
    <circle cx="28" cy="29" r="4" fill={N} />
    <rect x="10" y="25" width="6" height="8" rx="3" fill="#fff" />
    <rect x="40" y="25" width="6" height="8" rx="3" fill="#fff" />
  </svg>,
  // 2 multiple locations
  <svg key="l" viewBox="0 0 64 64">
    <path d="M32 3C19.5 3 11 12.5 11 24c0 15.500 21 37 21 37s21-21.500 21-37C53 12.500 44.500 3 32 3z" fill={N} />
    <circle cx="32" cy="24" r="8.5" fill={O} />
  </svg>,
  // 3 employee self-service
  <svg key="s" viewBox="0 0 64 64">
    <circle cx="30" cy="34" r="27" fill={N} />
    <circle cx="30" cy="26" r="9" fill="#fff" />
    <path d="M13 52c2-10 9-15 17-15s15 5 17 15a27 27 0 0 1-34 0z" fill="#fff" />
    <circle cx="50" cy="13" r="11" fill={O} />
    <path d="M50 7v12M44 13h12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
  </svg>,
  // 4 access control by role
  <svg key="r" viewBox="0 0 64 64">
    <polygon points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5" fill={N} stroke={N} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="32" cy="26" r="8" fill={O} />
    <path d="M17 47c1.500-9 8-13 15-13s13.500 4 15 13z" fill={O} />
  </svg>,
  // 5 daily work logs
  <svg key="w" viewBox="0 0 64 64">
    <rect x="4" y="4" width="56" height="56" rx="12" fill={N} />
    <path d="M14 22l5 5 9-10M14 43l5 5 9-10" stroke={O} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="35" y="20" width="16" height="4.500" rx="2.250" fill="#fff" />
    <rect x="35" y="41" width="16" height="4.500" rx="2.250" fill={O} />
  </svg>,
];