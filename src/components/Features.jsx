import { Fragment, useEffect, useRef, useState } from 'react';
import { gsap } from '../gsap';
import { I, FEATURES } from '../data';
import './FeaturesMobile.css';

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */
function useCount(to, ms = 2000, delay = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    let t0;
    const start = setTimeout(() => {
      const tick = (t) => {
        t0 = t0 ?? t;
        const p = Math.min((t - t0) / ms, 1);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
    };
  }, [to, ms, delay]);
  return n;
}

const Tick = ({ className = '', style }) => (
  <svg className={className} style={style} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

// phone status bar (time, signal, battery)
const Status = ({ light, at }) => (
  <div
    className={`fm-status ${light ? 'fm-light' : ''} ${at !== undefined ? 'fm-in' : ''}`}
    style={at !== undefined ? { '--d': `${at}s` } : undefined}
  >
    <span>9:41</span>
    <span className="fm-sig"><i /><i /><i /><span className="fm-bat" /></span>
  </div>
);

// NGriffinpay app header
const AppHead = ({ at }) => (
  <>
    <Status at={at} />
    <div
      className={`fm-ah ${at !== undefined ? 'fm-in' : ''}`}
      style={at !== undefined ? { '--d': `${at}s` } : undefined}
    >
      <img className="fm-logo" src={I('ngriffinpay-mark.png')} alt="NGriffinpay" />
      <b>NGriffinpay</b>
      <em>Oct 2026</em>
    </div>
  </>
);

/* ------------------------------------------------------------------
   Pop-up cards that appear left / right of the phone, one after another
   s = side (l | r), y = top position in %, c = colour, at = delay (s)
------------------------------------------------------------------ */
const POPS = [
  // 0 - spreadsheets
  [
    { s: 'l', y: 34, c: 'red',   ic: '!', t: 'Typo in Leave column', d: '“five” instead of 5', at: 1.0 },
    { s: 'r', y: 50, c: 'amber', ic: '!', t: 'Department missing',   d: 'Row 3 says N/A',      at: 1.8 },
    { s: 'l', y: 66, c: 'amber', ic: '!', t: 'Which file is latest?', d: 'employees_final_v3', at: 2.6 },
    { s: 'r', y: 40, c: 'green', ic: '✓', t: 'Now in one platform',  d: 'Payroll, leave and HR tasks', at: 4.3 },
  ],
  // 1 - payroll
  [
    { s: 'r', y: 34, c: 'green',  ic: '✓', t: 'Salaries calculated', d: '48 employees, 0 errors', at: 1.0 },
    { s: 'l', y: 50, c: 'violet', ic: '₹', t: 'PF, ESI and TDS applied', d: 'Filled in by rules', at: 2.0 },
    { s: 'r', y: 66, c: 'blue',   ic: '✓', t: 'Payslips emailed',     d: 'Everyone got theirs', at: 3.2 },
  ],
  // 2 - repetitive tasks
  [
    { s: 'l', y: 34, c: 'violet', ic: '✓', t: 'Offer letters sent',  d: 'To 3 candidates', at: 1.2 },
    { s: 'r', y: 50, c: 'blue',   ic: '✓', t: 'Attendance synced',   d: 'From the biometric device', at: 2.4 },
    { s: 'l', y: 66, c: 'green',  ic: '✓', t: '0 clicks needed',     d: 'Runs every month', at: 3.6 },
  ],
  // 3 - leave
  [
    { s: 'r', y: 34, c: 'amber', ic: '!', t: 'New leave request',  d: 'Meera, 3 days', at: 0.8 },
    { s: 'l', y: 50, c: 'green', ic: '✓', t: 'Manager approved',   d: 'In one tap', at: 2.2 },
    { s: 'r', y: 66, c: 'blue',  ic: '✓', t: 'Calendar updated',   d: 'Payroll adjusts itself', at: 3.0 },
  ],
  // 4 - insights
  [
    { s: 'l', y: 34, c: 'violet', ic: '↑', t: 'Headcount 248',       d: 'Up 6 this quarter', at: 1.0 },
    { s: 'r', y: 50, c: 'green',  ic: '↓', t: 'Attrition down 12%',  d: 'Compared to last year', at: 2.0 },
    { s: 'l', y: 66, c: 'blue',   ic: '✓', t: 'Report scheduled',    d: 'Mailed every Monday', at: 3.0 },
  ],
  // 5 - employee app
  [
    { s: 'r', y: 34, c: 'green',  ic: '✓', t: 'Checked in 9:02',  d: 'From Anita’s phone', at: 2.2 },
    { s: 'l', y: 50, c: 'violet', ic: '₹', t: 'Payslip ready',    d: 'October 2026', at: 3.0 },
    { s: 'r', y: 66, c: 'blue',   ic: '✓', t: 'Leave approved',   d: '12 days left', at: 3.8 },
  ],
];

/* ------------------------------------------------------------------
   6 realistic phone screens (remounted with key={active})
------------------------------------------------------------------ */

// 0 - Still using spreadsheets?  Excel-style sheet -> one platform
const XL_HEAD = ['Emp ID', 'Full Name', 'Department', 'Leave'];
const XL_ROWS = [
  ['1', 'Sunil Verma', 'Sales', '4'],
  ['2', 'Barkha Rao', 'Finance', '5'],
  ['3', 'Jayendra Nair', 'N/A', '7'],
  ['4', 'Leon Fernandes', 'HR', ''],
  ['5', 'Chidi Okafor', 'Sales', 'five'],
  ['6', 'Priya Menon', 'Ops', '6'],
  ['7', 'Riya Shah', 'Finance', '4'],
  ['8', 'Arjun Das', 'Sales', '3'],
  ['9', 'Neha Iyer', 'HR', '8'],
  ['10', 'Kabir Singh', 'Ops', '2'],
  ['11', 'Isha Patel', 'Finance', '5'],
  ['12', 'Dev Mehta', 'Sales', '6'],
];
// "row-col": delay (seconds) when the cell turns red
const XL_ERR = { '4-3': 1.0, '2-2': 1.8, '3-3': 1.8 };

const SceneSheet = () => (
  <div className="fm-sc fm-flush">
    <div className="fm-xl">
      <div className="fm-xl-bar">
        <Status light />
        <span className="fm-xl-logo">X</span>
        <b>employees_final_v3.xlsx</b>
      </div>
      <div className="fm-xl-fx">
        <span>A1</span>
        <i>fx</i>
        <em>Emp ID</em>
      </div>

      <div className="fm-xg">
        <u />
        {['A', 'B', 'C', 'D'].map((l) => <u key={l}>{l}</u>)}
        <u>1</u>
        {XL_HEAD.map((h, c) => (
          <span key={h} className={`fm-xhd ${c === 0 ? 'fm-xsel fm-num' : ''}`}>{h}</span>
        ))}
        {XL_ROWS.map((row, r) => (
          <Fragment key={r}>
            <u>{r + 2}</u>
            {row.map((v, c) => {
              const dly = XL_ERR[`${r}-${c}`];
              const num = c === 0 || /^\d+$/.test(v);
              return (
                <span
                  key={c}
                  className={`${num ? 'fm-num' : ''} ${dly !== undefined ? 'fm-xerr' : ''}`}
                  style={dly !== undefined ? { '--d': `${dly}s` } : undefined}
                >
                  {v}
                </span>
              );
            })}
          </Fragment>
        ))}
      </div>

      <div className="fm-xl-tabs">
        <span className="on">Sheet1</span>
        <span>Sheet1 (copy)</span>
        <span>Old data</span>
      </div>
    </div>

    <div className="fm-unified">
      <AppHead at={3.7} />
      <div className="fm-u-head fm-in" style={{ '--d': '3.9s' }}>One platform</div>
      {[
        ['Payroll', '₹48.2L paid', 'p'],
        ['Leave', '12 approved', 'o'],
        ['HR tasks', '8 done', 'g'],
      ].map(([t, v, c], k) => (
        <div key={t} className={`fm-card fm-c-${c} fm-in`} style={{ '--d': `${4.1 + k * 0.25}s` }}>
          <span>{t}</span>
          <strong>{v}</strong>
        </div>
      ))}
      <p className="fm-note fm-in" style={{ '--d': '5s' }}>No more spreadsheets</p>
    </div>
  </div>
);

// 1 - Manual payroll is draining?
const ScenePayroll = () => {
  const n = useCount(100, 2400, 300);
  const rows = [
    ['AN', 'Anita', '52,400', '#7c4dff'],
    ['RV', 'Ravi', '47,800', '#ff7a45'],
    ['ME', 'Meera', '61,250', '#2f8cff'],
    ['JO', 'John', '39,900', '#22b573'],
  ];
  return (
    <div className="fm-sc">
      <AppHead />
      <div className="fm-ring fm-in">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" className="fm-ring-bg" />
          <circle cx="50" cy="50" r="42" className="fm-ring-fg" />
        </svg>
        <div>
          <strong>{n}%</strong>
          <small>Payroll processed</small>
        </div>
      </div>

      <ul className="fm-rows">
        {rows.map(([ini, name, amt, col], k) => (
          <li key={name} className="fm-row fm-in" style={{ '--d': `${0.5 + k * 0.55}s` }}>
            <i style={{ background: col }}>{ini}</i>
            <span>{name}</span>
            <b>₹{amt}</b>
            <Tick className="fm-ok" style={{ '--d': `${1.0 + k * 0.55}s` }} />
          </li>
        ))}
      </ul>

      <div className="fm-toast fm-in" style={{ '--d': '3.1s' }}>Payslips sent to everyone</div>
    </div>
  );
};

// 2 - Too many repetitive tasks?
const SceneTasks = () => {
  const tasks = ['Send offer letters', 'Sync attendance', 'Run payroll', 'Share payslips', 'Update records'];
  return (
    <div className="fm-sc">
      <AppHead />
      <div className="fm-bar-h fm-in">
        <span>HR tasks</span>
        <em>Running</em>
      </div>

      <ul className="fm-tasks">
        {tasks.map((t, k) => (
          <li
            key={t}
            className="fm-task fm-in"
            style={{ '--d': `${0.2 + k * 0.12}s`, '--t': `${0.9 + k * 0.6}s` }}
          >
            <span className="fm-box"><Tick /></span>
            <span className="fm-t-name">{t}</span>
            <span className="fm-t-auto">Auto</span>
          </li>
        ))}
      </ul>

      <div className="fm-prog"><i /></div>
      <p className="fm-note fm-in" style={{ '--d': '3.9s' }}>5 tasks done, 0 clicks</p>
    </div>
  );
};

// 3 - Old leave tracking methods?
const SceneLeave = () => {
  const hit = { 14: 0, 15: 1, 16: 2 };
  return (
    <div className="fm-sc">
      <AppHead />
      <div className="fm-cal-h fm-in">
        <span>October</span>
        <em>2026</em>
      </div>

      <div className="fm-cal">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, k) => <u key={k}>{d}</u>)}
        {[0, 1, 2].map((k) => <i key={`e${k}`} />)}
        {Array.from({ length: 31 }, (_, k) => k + 1).map((d) => (
          <b
            key={d}
            className={d in hit ? 'fm-hit' : ''}
            style={d in hit ? { '--d': `${2.2 + hit[d] * 0.25}s` } : undefined}
          >
            {d}
          </b>
        ))}
      </div>

      <div className="fm-req fm-in" style={{ '--d': '0.6s' }}>
        <i>ME</i>
        <div>
          <strong>Meera</strong>
          <small>Casual leave, 3 days</small>
        </div>
        <span className="fm-pend">Pending</span>
        <span className="fm-appr">Approved</span>
      </div>

      <div className="fm-btnrow fm-in" style={{ '--d': '1s' }}>
        <span className="fm-no">Decline</span>
        <span className="fm-yes">Approve</span>
      </div>

      <p className="fm-note fm-in" style={{ '--d': '3.1s' }}>Approved in one tap</p>
    </div>
  );
};

// 4 - No insights from data?
const SceneInsights = () => {
  const n = useCount(150, 2000, 200);
  const bars = [40, 62, 48, 78, 66, 92];
  return (
    <div className="fm-sc">
      <AppHead />
      <div className="fm-big fm-in">
        <strong>{n}+</strong>
        <small>ready-to-use reports</small>
      </div>

      <div className="fm-chart">
        {bars.map((h, k) => (
          <i key={k} style={{ '--h': `${h}%`, '--d': `${0.4 + k * 0.15}s` }} />
        ))}
      </div>

      <div className="fm-chips">
        {['Attendance', 'Payroll register', 'Headcount', 'Attrition'].map((t, k) => (
          <span key={t} className="fm-in" style={{ '--d': `${1.6 + k * 0.25}s` }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

// 5 - Employees need flexibility?
const SceneEss = () => (
  <div className="fm-sc">
    <AppHead />
    <div className="fm-hi fm-in">
      <small>Good morning</small>
      <strong>Anita</strong>
    </div>

    <div className="fm-punch">
      <span className="fm-p1">Check in</span>
      <span className="fm-p2">
        Checked in
        <small>9:02 AM</small>
      </span>
    </div>

    <div className="fm-two">
      <div className="fm-mini fm-in" style={{ '--d': '1.2s' }}>
        <small>Leave balance</small>
        <strong>12 days</strong>
      </div>
      <div className="fm-mini fm-in" style={{ '--d': '1.45s' }}>
        <small>Latest payslip</small>
        <strong>Oct 2026</strong>
      </div>
    </div>

    <div className="fm-tabbar fm-in" style={{ '--d': '1.7s' }}>
      <i /><i /><i /><i />
    </div>
  </div>
);

const SCENES = [SceneSheet, ScenePayroll, SceneTasks, SceneLeave, SceneInsights, SceneEss];

/* ==================================================================
   DESKTOP: browser window with the NGriffinpay web app
================================================================== */
const NAV = ['Dashboard', 'Payroll', 'Automations', 'Leave', 'Reports', 'Employees'];
const URLS = ['dashboard', 'payroll', 'automations', 'leave', 'reports', 'employees'];

const DeskShell = ({ active, overlay, children }) => (
  <div className="fd-win">
    <div className="fd-bar">
      <span className="fd-dots"><i /><i /><i /></span>
      <span className="fd-url">
        {active === 0 ? (
          <>
            <em className="fd-url-a">file:///HR/employees_final_v3.xlsx</em>
            <em className="fd-url-b">app.ngriffinpay.com/dashboard</em>
          </>
        ) : (
          <em>app.ngriffinpay.com/{URLS[active]}</em>
        )}
      </span>
    </div>

    <div className="fd-body">
      <aside className="fd-side">
        <div className="fd-brand">
          <img src={I('ngriffinpay-mark.png')} alt="NGriffinpay" />
          <b>NGriffinpay</b>
        </div>
        <ul>
          {NAV.map((n, k) => (
            <li key={n} className={k === active ? 'on' : ''}><i />{n}</li>
          ))}
        </ul>
      </aside>

      <div className="fd-main">
        <div className="fd-top">
          <div>
            <h3>{NAV[active]}</h3>
            <small>October 2026</small>
          </div>
          <div className="fd-top-r">
            <span className="fd-search">Search…</span>
            <span className="fd-av">AN</span>
          </div>
        </div>
        <div className="fd-sc">{children}</div>
      </div>

      {overlay}
    </div>
  </div>
);

/* ---------- 0: Excel on a PC -> NGriffinpay dashboard ---------- */
const XD_HEAD = ['Emp ID', 'Full Name', 'Department', 'Salary', 'Leave', 'Joined'];
const XD_ROWS = [
  ['1', 'Sunil Verma', 'Sales', '42,000', '4', '12-Mar-21'],
  ['2', 'Barkha Rao', 'Finance', '51,500', '5', '03-Jun-20'],
  ['3', 'Jayendra Nair', 'N/A', '38,000', '7', '21-Jan-22'],
  ['4', 'Leon Fernandes', 'HR', '47,200', '', '15-Sep-19'],
  ['5', 'Chidi Okafor', 'Sales', '44,800', 'five', '08-Nov-21'],
  ['6', 'Priya Menon', 'Ops', '45k', '6', '30-Apr-22'],
  ['7', 'Riya Shah', 'Finance', '52,300', '4', '31/02/22'],
  ['8', 'Arjun Das', 'Sales', '39,500', '3', '17-Aug-20'],
  ['9', 'Neha Iyer', 'HR', '49,900', '8', '25-Feb-23'],
  ['10', 'Kabir Singh', 'Ops', '36,700', '2', '09-Oct-21'],
  ['11', 'Isha Patel', 'Finance', '58,100', '5', '14-Jul-19'],
  ['12', 'Dev Mehta', 'Sales', '41,600', '6', '02-Dec-22'],
];
// "row-col": delay (s) when the cell turns red
const XD_ERR = { '4-4': 1.0, '2-2': 1.8, '3-4': 1.8, '5-3': 2.6, '6-5': 2.6 };

const XlDesk = () => (
  <div className="fd-xl">
    <div className="fd-xl-bar">
      <span className="fd-xl-logo">X</span>
      <b>employees_final_v3.xlsx</b>
      <em>Saved to this PC</em>
      <span className="fd-xl-tabs">
        {['Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'].map((t, k) => (
          <u key={t} className={k === 0 ? 'on' : ''}>{t}</u>
        ))}
      </span>
    </div>
    <div className="fd-xl-rib">
      <span>Paste</span><span>Calibri</span><span>11</span>
      <span><b>B</b></span><span><i>I</i></span><span>General</span>
      <span>Conditional Formatting</span><span>Format as Table</span><span>Sort &amp; Filter</span>
    </div>
    <div className="fd-xl-fx">
      <span>A1</span><i>fx</i><em>Emp ID</em>
    </div>

    <div className="fd-xg">
      <u />
      {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => <u key={l}>{l}</u>)}
      <u>1</u>
      {XD_HEAD.map((h, c) => (
        <span key={h} className={`fd-xhd ${c === 0 ? 'fd-xsel fd-num' : ''}`}>{h}</span>
      ))}
      {XD_ROWS.map((row, r) => (
        <Fragment key={r}>
          <u>{r + 2}</u>
          {row.map((v, c) => {
            const dly = XD_ERR[`${r}-${c}`];
            const num = c === 0 || (c === 3 && /^[\d,]+$/.test(v)) || (c === 4 && /^\d+$/.test(v));
            return (
              <span
                key={c}
                className={`${num ? 'fd-num' : ''} ${dly !== undefined ? 'fd-xerr' : ''}`}
                style={dly !== undefined ? { '--d': `${dly}s` } : undefined}
              >
                {v}
              </span>
            );
          })}
        </Fragment>
      ))}
    </div>

    <div className="fd-xl-foot">
      <span className="on">Sheet1</span>
      <span>Sheet1 (copy)</span>
      <span>Old data</span>
      <em>Ready</em>
    </div>
  </div>
);

const DDash = () => {
  const bars = [46, 58, 52, 70, 64, 82, 76];
  return (
    <>
      <div className="fd-stats">
        {[
          ['Employees', '248', '+6 this quarter'],
          ['Payroll', '₹48.2L', 'Paid on time'],
          ['On leave today', '12', 'All approved'],
          ['Open tasks', '8', 'All automated'],
        ].map(([t, v, s], k) => (
          <div key={t} className="fd-stat fm-in" style={{ '--d': `${3.8 + k * 0.2}s` }}>
            <small>{t}</small>
            <strong>{v}</strong>
            <em>{s}</em>
          </div>
        ))}
      </div>

      <div className="fd-cols">
        <div className="fd-panel fm-in" style={{ '--d': '4.7s' }}>
          <h4>Payroll cost, last 7 months</h4>
          <div className="fd-chart">
            {bars.map((h, k) => <i key={k} style={{ '--h': `${h}%`, '--d': `${4.9 + k * 0.1}s` }} />)}
          </div>
        </div>
        <div className="fd-panel fd-today fm-in" style={{ '--d': '4.9s' }}>
          <h4>Today</h4>
          <ul>
            <li><i className="g" />Meera’s leave approved</li>
            <li><i className="v" />Payslips sent to 248 employees</li>
            <li><i className="b" />Attendance synced</li>
            <li><i className="o" />3 offer letters sent</li>
          </ul>
        </div>
      </div>
    </>
  );
};

/* ---------- 1: payroll ---------- */
const DPayroll = () => {
  const n = useCount(100, 2600, 300);
  const rows = [
    ['AR', 'Anita Rao', 'Finance', '52,400', '6,288', '46,112', '#7c4dff'],
    ['RK', 'Ravi Kumar', 'Sales', '47,800', '5,736', '42,064', '#ff7a45'],
    ['MN', 'Meera Nair', 'HR', '61,250', '7,350', '53,900', '#2f8cff'],
    ['JD', 'John Dsouza', 'Ops', '39,900', '4,788', '35,112', '#22b573'],
    ['PM', 'Priya Menon', 'Sales', '44,500', '5,340', '39,160', '#7c4dff'],
    ['AD', 'Arjun Das', 'Ops', '36,200', '4,344', '31,856', '#ff7a45'],
  ];
  return (
    <>
      <div className="fd-head fm-in">
        <div>
          <h4>Run payroll, October 2026</h4>
          <small>248 employees, processed automatically</small>
        </div>
        <span className="fd-btn">Send payslips</span>
      </div>

      <div className="fd-progwrap fm-in" style={{ '--d': '0.2s' }}>
        <div className="fd-pbar"><i /></div>
        <b>{n}%</b>
      </div>

      <div className="fd-cols">
        <div className="fd-table">
          <div className="fd-tr fd-th">
            <span>Employee</span><span>Department</span><span>Gross</span>
            <span>Deductions</span><span>Net pay</span><span>Status</span>
          </div>
          {rows.map(([ini, name, dept, gross, ded, net, col], k) => (
            <div key={name} className="fd-tr fm-in" style={{ '--d': `${0.5 + k * 0.5}s` }}>
              <span className="fd-who"><i style={{ background: col }}>{ini}</i>{name}</span>
              <span>{dept}</span>
              <span>₹{gross}</span>
              <span>₹{ded}</span>
              <span><b>₹{net}</b></span>
              <span><span className="fd-pill" style={{ '--d': `${1.0 + k * 0.5}s` }}>Processed</span></span>
            </div>
          ))}
        </div>

        <aside className="fd-sum fm-in" style={{ '--d': '0.6s' }}>
          <small>Total payout</small>
          <strong>₹48.2L</strong>
          <ul>
            <li><span>PF</span><b>₹5.8L</b></li>
            <li><span>ESI</span><b>₹0.7L</b></li>
            <li><span>TDS</span><b>₹3.1L</b></li>
          </ul>
        </aside>
      </div>

      <div className="fd-toast fm-in" style={{ '--d': '4s' }}>✓ Payslips sent to 248 employees</div>
    </>
  );
};

/* ---------- 2: automations ---------- */
const DTasks = () => {
  const flows = [
    ['Send offer letters', 'On approval'],
    ['Sync attendance', 'Every night'],
    ['Run payroll', '1st of month'],
    ['Share payslips', 'After payroll'],
    ['Update records', 'On change'],
  ];
  const log = [
    ['09:00', 'Offer letters sent to 3 candidates'],
    ['09:01', 'Attendance synced from the biometric device'],
    ['09:02', 'Payroll run for 248 employees'],
    ['09:03', 'Payslips emailed to everyone'],
    ['09:04', 'Employee records updated'],
  ];
  return (
    <div className="fd-cols">
      <div className="fd-panel fd-flow">
        <h4>Workflows</h4>
        {flows.map(([nm, tr], k) => (
          <div
            key={nm}
            className="fd-flowrow fm-in"
            style={{ '--d': `${0.2 + k * 0.12}s`, '--t': `${0.9 + k * 0.6}s` }}
          >
            <span className="fd-tog"><i /></span>
            <b>{nm}</b>
            <em>{tr}</em>
            <span className="fd-done"><Tick /></span>
          </div>
        ))}
        <div className="fd-prog"><i /></div>
      </div>

      <div className="fd-panel fd-log">
        <h4>Activity</h4>
        {log.map(([tm, tx], k) => (
          <div key={tm} className="fd-logrow fm-in" style={{ '--d': `${1.1 + k * 0.6}s` }}>
            <time>{tm}</time>
            <span>{tx}</span>
          </div>
        ))}
        <p className="fd-note fm-in" style={{ '--d': '4.2s' }}>5 tasks done, 0 clicks</p>
      </div>
    </div>
  );
};

/* ---------- 3: leave ---------- */
const DLeave = () => {
  const hit = { 14: 0, 15: 1, 16: 2 };
  return (
    <div className="fd-cols">
      <div className="fd-panel fd-calp fm-in">
        <h4>October 2026</h4>
        <div className="fd-cal">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <u key={d}>{d}</u>)}
          {[0, 1, 2].map((k) => <i key={`e${k}`} />)}
          {Array.from({ length: 31 }, (_, k) => k + 1).map((d) => (
            <b
              key={d}
              className={d in hit ? 'fm-hit' : ''}
              style={d in hit ? { '--d': `${2.2 + hit[d] * 0.25}s` } : undefined}
            >
              {d}
            </b>
          ))}
        </div>
      </div>

      <div className="fd-right">
        <div className="fd-panel fd-reqp fm-in" style={{ '--d': '0.6s' }}>
          <div className="fd-reqrow">
            <i>MN</i>
            <div>
              <strong>Meera Nair</strong>
              <small>Casual leave, 14 to 16 Oct (3 days)</small>
            </div>
          </div>
          <span className="fd-pend">Pending</span>
          <span className="fd-appr">Approved</span>
          <div className="fd-btns">
            <span className="fd-no">Decline</span>
            <span className="fd-yes">Approve</span>
          </div>
        </div>

        <div className="fd-panel fm-in" style={{ '--d': '1.2s' }}>
          <h4>Leave balance</h4>
          {[['Casual', 12, 15], ['Sick', 8, 10], ['Earned', 15, 18]].map(([t, a, b], k) => (
            <div key={t} className="fd-bal">
              <span>{t}</span>
              <span className="fd-track"><i style={{ '--w': `${(a / b) * 100}%`, '--d': `${1.4 + k * 0.2}s` }} /></span>
              <b>{a}/{b}</b>
            </div>
          ))}
        </div>

        <div className="fd-panel fm-in" style={{ '--d': '1.6s' }}>
          <h4>Other requests</h4>
          <div className="fd-other"><span>Ravi Kumar, Sick leave</span><em className="p">Pending</em></div>
          <div className="fd-other"><span>John Dsouza, Earned leave</span><em className="a">Approved</em></div>
        </div>
      </div>
    </div>
  );
};

/* ---------- 4: reports ---------- */
const DReports = () => {
  const hc = useCount(248, 1800, 200);
  const rp = useCount(150, 2000, 200);
  const bars = [40, 52, 46, 64, 58, 72, 66, 80, 74, 88, 82, 95];
  return (
    <>
      <div className="fd-stats">
        <div className="fd-stat fm-in"><small>Headcount</small><strong>{hc}</strong><em>+6 this quarter</em></div>
        <div className="fd-stat fm-in" style={{ '--d': '0.15s' }}><small>Attrition</small><strong>8.4%</strong><em>Down 12% vs last year</em></div>
        <div className="fd-stat fm-in" style={{ '--d': '0.3s' }}><small>Average tenure</small><strong>3.2 yrs</strong><em>Across all teams</em></div>
        <div className="fd-stat fm-in" style={{ '--d': '0.45s' }}><small>Ready reports</small><strong>{rp}+</strong><em>HR and payroll</em></div>
      </div>

      <div className="fd-cols">
        <div className="fd-panel fm-in" style={{ '--d': '0.6s' }}>
          <h4>Headcount trend</h4>
          <div className="fd-chart">
            {bars.map((h, k) => <i key={k} style={{ '--h': `${h}%`, '--d': `${0.8 + k * 0.1}s` }} />)}
          </div>
        </div>
        <div className="fd-panel fd-donutp fm-in" style={{ '--d': '0.9s' }}>
          <h4>By department</h4>
          <div className="fd-donut" />
          <ul>
            <li><i style={{ background: '#7c4dff' }} />Sales</li>
            <li><i style={{ background: '#ff7a45' }} />Finance</li>
            <li><i style={{ background: '#2f8cff' }} />Ops</li>
            <li><i style={{ background: '#22b573' }} />HR</li>
          </ul>
        </div>
      </div>

      <div className="fd-chips">
        {['Attendance', 'Payroll register', 'Headcount', 'Attrition', 'Leave summary'].map((t, k) => (
          <span key={t} className="fm-in" style={{ '--d': `${1.8 + k * 0.25}s` }}>{t}</span>
        ))}
      </div>
    </>
  );
};

/* ---------- 5: employee self service + mobile app ---------- */
const DEss = () => (
  <div className="fd-cols">
    <div className="fd-ess">
      <div className="fd-hi fm-in">
        <small>Employee self service</small>
        <strong>Good morning, Anita</strong>
      </div>

      <div className="fd-stats fd-stats3">
        {[
          ['Leave balance', '12 days', 'Casual and sick'],
          ['Latest payslip', '₹46,112', 'October 2026'],
          ['Attendance', '22 / 23', 'Days this month'],
        ].map(([t, v, s], k) => (
          <div key={t} className="fd-stat fm-in" style={{ '--d': `${0.4 + k * 0.2}s` }}>
            <small>{t}</small>
            <strong>{v}</strong>
            <em>{s}</em>
          </div>
        ))}
      </div>

      <div className="fd-panel fm-in" style={{ '--d': '1.1s' }}>
        <h4>Do it from your phone</h4>
        {['Apply for leave', 'Download payslip', 'Check in and out'].map((t) => (
          <div key={t} className="fd-act"><span>{t}</span><b>›</b></div>
        ))}
      </div>
    </div>

    <div className="fd-mphone fm-in" style={{ '--d': '0.3s' }}>
      <div className="fd-mp-notch" />
      <div className="fd-mp-screen">
        <small>Good morning</small>
        <b>Anita</b>
        <div className="fd-punch">
          <span className="fd-p1">Check in</span>
          <span className="fd-p2">Checked in<small>9:02 AM</small></span>
        </div>
        <i /><i />
      </div>
    </div>
  </div>
);

const DSCENES = [DDash, DPayroll, DTasks, DLeave, DReports, DEss];

/* ------------------------------------------------------------------
   Section
------------------------------------------------------------------ */
function useMedia(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    mq.addEventListener('change', f);
    f();
    return () => mq.removeEventListener('change', f);
  }, [q]);
  return m;
}

const PopLayer = ({ active, total, desk }) => {
  const mainSide = active % 2 === 0 ? 'l' : 'r';
  return (
    <div className="fm-pops" key={active}>
      <div className={`fm-pop fm-main fm-${mainSide}`} style={{ top: desk ? '14%' : '3%', '--d': '0.15s' }}>
        <div>
          <span>{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <strong>{FEATURES[active][0]}</strong>
          <small>{FEATURES[active][1]}</small>
        </div>
      </div>

      {POPS[active].map((p, k) => (
        <div key={k} className={`fm-pop fm-${p.s} fm-${p.c}`} style={{ top: `${desk ? 12 + p.y * 0.85 : p.y}%`, '--d': `${p.at}s` }}>
          <i className="fm-pop-ic">{p.ic}</i>
          <div>
            <strong>{p.t}</strong>
            <small>{p.d}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Features() {
  const root = useRef();
  const [active, setActive] = useState(0);
  const total = FEATURES.length;
  const isDesk = useMedia('(min-width: 769px)');
  const Scene = SCENES[active];
  const DScene = DSCENES[active];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // pinned stage, one point per scroll - desktop and mobile
      gsap.to('.fm-dots', {
        x: 0, ease: 'none',
        scrollTrigger: {
          trigger: '.fm-pin',
          start: 'top top',
          end: `+=${total * 80}%`,          // scroll distance per step
          pin: true,
          scrub: 0.6,
          snap: {
            snapTo: 1 / (total - 1),         // lock onto each of the 6 steps
            duration: { min: 0.2, max: 0.5 },
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (total - 1));
            setActive((prev) => (prev === idx ? prev : idx));
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, [total]);

  return (
    <section className="pad feat-sec" id="products" ref={root}>
      <div className="fm-pin fm-stage">
        <h2 className="fm-title">New-age HR software, built the way HR actually works</h2>

        {/* text above the phone - mobile only */}
        <div className="fm-text">
          {FEATURES.map(([title, desc], i) => (
            <div key={i} className={`fm-step ${i === active ? 'on' : ''} ${i < active ? 'past' : ''}`}>
              <span className="fm-count">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        {isDesk ? (
          /* ===== DESKTOP: browser window ===== */
          <div className="fm-desk">
            {/* the app runs inside the transparent screen of the iMac frame */}
            <div className="fm-dscreen">
              <DeskShell active={active} overlay={active === 0 ? <XlDesk key="xl" /> : null}>
                <DScene key={active} />
              </DeskShell>
            </div>
           
            <PopLayer active={active} total={total} desk />
          </div>
        ) : (
          /* ===== MOBILE: phone ===== */
          <div className="fm-device">
            <div className="fm-phone">
              <div className="fm-notch" />
              <div className="fm-screen">
                <Scene key={active} />
              </div>
            </div>
            <PopLayer active={active} total={total} />
          </div>
        )}

        <div className="fm-dots">
          {FEATURES.map((_, i) => <i key={i} className={i === active ? 'on' : ''} />)}
        </div>
      </div>
    </section>
  );
}
