import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap';
import logo from '../assets/ngriffinpay-logo.png';
import './AppShowcase.css';

/* ---------- screen data ---------- */
const PAY_ROWS = [
  ['Basic', '49,000'], ['HRA', '24,500'], ['Special allowance', '24,500'],
  ['Provident fund', '-5,880'], ['Income tax', '-9,670'],
];
const F24Q_CHECKS = [
  'Deductee details verified',
  'Challans mapped to TDS',
  'Salary TDS computed',
  'FVU file generated',
];
// [task, assignee, priority class, priority label, done at start]
const TASKS = [
  ['Update employee records', 'Priya · HR', 'ngp-pr-h', 'High', true],
  ['Monthly payroll report', 'Meera · Finance', 'ngp-pr-m', 'Medium', true],
  ['Policy document review', 'Rohan · Admin', 'ngp-pr-l', 'Low', false],
  ['Training module update', 'Aarav · L&D', 'ngp-pr-m', 'Medium', false],
  ['Verify new joiner docs', 'Sneha · HR', 'ngp-pr-h', 'High', false],
  ['Asset handover — laptop', 'Kiran · IT', 'ngp-pr-l', 'Low', false],
];
const PENDING = [
  ['R', 'Rohan P.', 'Leave · 27 – 28 Oct'],
  ['M', 'Meera K.', 'Expense claim · ₹2,350'],
  ['A', 'Aarav S.', 'Attendance regularisation'],
  ['S', 'Sneha R.', 'Salary advance · ₹15,000'],
];
// [name, casual, sick, earned]
const TEAM_LB = [
  ['Aarav S.', 8, 6, 14],
  ['Meera K.', 5, 4, 10],
  ['Rohan P.', 2, 6, 12],
  ['Sneha R.', 7, 3, 9],
];
const LB_MAX = 42; // 12 casual + 12 sick + 18 earned
const TABS = ['⏱', '💸', '📄', '✅', '🔔', '🌴'];
const DONE_AT_START = TASKS.filter(t => t[4]).length;

const Status = () => (
  <div className="ngp-sb"><span>10:28</span><span>●●● ▮</span></div>
);

export default function AppShowcase() {
  const root = useRef();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const screens = q('.ngp-screen');
      const sc = screens.map(s => s.querySelector('.ngp-scroll'));
      const view = q('.ngp-viewport')[0];
      const splash = q('.ngp-splash')[0];
      const tap = q('.ngp-tap')[0];
      const tabs = q('.ngp-tabbar li');

      // 1 · punch in
      const pcard = q('.ngp-pcard')[0];
      const pbtn = q('.ngp-pbtn')[0];
      const pok = q('.ngp-pok')[0];
      const ptxt = q('.ngp-ptxt')[0];
      const ploc = q('.ngp-ploc')[0];
      // 2 · salary
      const notif = q('.ngp-notif')[0];
      const payNum = q('.ngp-paynum')[0];
      const segs = q('.ngp-seg');
      const rows = q('.ngp-prow');
      // 3 · form 24Q
      const fbar = q('.ngp-fprog i')[0];
      const fpct = q('.ngp-fpct')[0];
      const fst = q('.ngp-fst')[0];
      const checks = q('.ngp-chk li');
      const ready = q('.ngp-ready')[0];
      // 4 · tasks
      const tasks = q('.ngp-task');
      const tcount = q('.ngp-tcount')[0];
      const tbar = q('.ngp-tbar i')[0];
      const upd = q('.ngp-upd')[0];
      // 5 · pending actions
      const cards = q('.ngp-pa');
      const badge = q('.ngp-badge')[0];
      // 6 · team leave balance
      const members = q('.ngp-tm');
      const lbars = q('.ngp-tlb');

      const pay = { v: 0 }, pct = { v: 0 };
      const setTab = i => tabs.forEach((t, k) => t.classList.toggle('ngp-on', k === i));

      const reset = () => {
        gsap.set(screens.slice(1), { opacity: 0, xPercent: 0 });
        gsap.set(screens[0], { opacity: 1, xPercent: 0 });
        gsap.set(splash, { opacity: 1, scale: 1 });
        gsap.set(tap, { opacity: 0, scale: 0, xPercent: -50, yPercent: -50 });
        setTab(0);

        pcard.classList.remove('ngp-in');
        ptxt.textContent = 'Not punched in yet';
        gsap.set(pok, { scale: 0 });
        gsap.set(ploc, { opacity: 0, y: 6 });

        gsap.set(notif, { y: -90, opacity: 0 });
        payNum.textContent = '0'; pay.v = 0;
        gsap.set(segs, { scaleX: 0 });
        gsap.set(rows, { opacity: 0, y: 10 });

        gsap.set(fbar, { scaleX: 0 });
        fpct.textContent = '0%'; pct.v = 0;
        fst.textContent = 'Generating…';
        gsap.set(checks, { opacity: 0, x: -12 });
        gsap.set(ready, { opacity: 0, scale: 0.7 });

        tasks.forEach((t, i) => t.classList.toggle('ngp-ck', TASKS[i][4]));
        tcount.textContent = String(DONE_AT_START);
        gsap.set(tbar, { scaleX: DONE_AT_START / TASKS.length });
        gsap.set(upd, { opacity: 0, y: 6 });

        cards.forEach(c => c.classList.remove('ngp-ok'));
        gsap.set(cards, { clearProps: 'height,paddingTop,paddingBottom,marginBottom,opacity' });
        badge.textContent = String(PENDING.length);

        gsap.set(members, { opacity: 0, y: 12 });
        gsap.set(lbars, { clipPath: 'inset(0 100% 0 0)' });
      };
      reset();

      if (reduce) { gsap.set(splash, { opacity: 0 }); return; }

      // centre of an element relative to the phone screen (ignores the 3D tilt)
      const center = (el, box) => {
        let x = 0, y = 0, n = el;
        while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
        return [x + el.offsetWidth / 2, y + el.offsetHeight / 2];
      };

      const tl = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset });

      const press = (el, box, at) => {
        tl.call(() => {
          const [x, y] = center(el, box);
          gsap.set(tap, { x, y, scale: 0, opacity: 1 });
        }, null, at)
          .to(tap, { scale: 1, opacity: 0, duration: 0.55, ease: 'power2.out' }, at)
          .to(el, { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1 }, at);
      };

      const nav = (from, to, at) => {
        tl.to(from, { xPercent: -22, opacity: 0, duration: 0.45, ease: 'power2.in' }, at)
          .fromTo(to, { xPercent: 22, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, at + 0.25);
      };

      const go = (i, at) => { // tap tab i and slide to its screen
        press(tabs[i], view, at);
        tl.call(() => setTab(i), null, at);
        nav(screens[(i + screens.length - 1) % screens.length], screens[i], at + 0.3);
      };

      // splash with logo -> 1 · Punch IN Done
      tl.to(splash, { opacity: 0, scale: 1.12, duration: 0.6, ease: 'power2.inOut' }, 1);
      press(pbtn, sc[0], 2.1);
      tl.call(() => { pcard.classList.add('ngp-in'); ptxt.textContent = 'Punch IN Done · 09:02 AM'; }, null, 2.3)
        .fromTo(pok, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)', immediateRender: false }, 2.3)
        .to(ploc, { opacity: 1, y: 0, duration: 0.4 }, 2.6);

      // 2 · Salary Credited
      go(1, 4.6);
      tl.to(notif, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }, 5.4)
        .fromTo(pay, { v: 0 }, {
          v: 82450, duration: 1.4, ease: 'power2.out', immediateRender: false,
          onUpdate: () => { payNum.textContent = Math.round(pay.v).toLocaleString('en-IN'); },
        }, 5.6)
        .to(segs, { scaleX: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' }, 5.7)
        .to(rows, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 6.0)
        .to(notif, { y: -90, opacity: 0, duration: 0.4, ease: 'power2.in' }, 7.7);

      // 3 · Form 24Q Ready
      go(2, 8.4);
      tl.to(fbar, { scaleX: 1, duration: 1.8, ease: 'power1.inOut' }, 9.2)
        .fromTo(pct, { v: 0 }, {
          v: 100, duration: 1.8, ease: 'power1.inOut', immediateRender: false,
          onUpdate: () => { fpct.textContent = `${Math.round(pct.v)}%`; },
        }, 9.2)
        .to(checks, { opacity: 1, x: 0, duration: 0.35, stagger: 0.42 }, 9.3)
        .call(() => { fst.textContent = 'Validated ✓'; }, null, 11.0)
        .to(ready, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 11.1);

      // 4 · Tasks are Updated
      go(3, 12.8);
      TASKS.map((t, i) => i).filter(i => !TASKS[i][4]).slice(0, 3).forEach((i, k) => {
        const at = 13.8 + k * 0.7;
        press(tasks[i].querySelector('.ngp-box'), sc[3], at);
        tl.call(() => {
          tasks[i].classList.add('ngp-ck');
          tcount.textContent = String(DONE_AT_START + k + 1);
        }, null, at + 0.15)
          .to(tbar, { scaleX: (DONE_AT_START + k + 1) / TASKS.length, duration: 0.4, ease: 'power2.out' }, at + 0.15);
      });
      tl.to(upd, { opacity: 1, y: 0, duration: 0.4 }, 16.0);

      // 5 · Pending Actions
      go(4, 17.4);
      [0, 1].forEach((i, k) => {
        const at = 18.4 + k * 1.3;
        press(cards[i].querySelector('.ngp-pa-ok'), sc[4], at);
        tl.call(() => cards[i].classList.add('ngp-ok'), null, at + 0.2)
          .to(cards[i], {
            height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, opacity: 0,
            duration: 0.45, ease: 'power2.inOut',
          }, at + 0.75)
          .call(() => { badge.textContent = String(PENDING.length - k - 1); }, null, at + 0.75)
          .fromTo(badge, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, at + 0.75);
      });

      // 6 · Team Leave Balance
      go(5, 21.6);
      tl.to(members, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, 22.3)
        .to(lbars, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 22.5);

      // back to 1 · Punch In, then loop
      go(0, 25.2);
      tl.to({}, { duration: 1.2 }, 26.1); // hold the last frame before looping

      // only run while the section is on screen
      ScrollTrigger.create({
        trigger: root.current, start: 'top 85%', end: 'bottom 15%',
        onToggle: self => (self.isActive ? tl.play() : tl.pause()),
      });

      // entrance + idle motion
      gsap.from('.ngp-enter', {
        y: 90, scale: 0.85, opacity: 0, duration: 1.1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
      gsap.to('.ngp-bob', { y: -14, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ngp-showcase" ref={root}>
      <i className="ngp-blob ngp-b1" /><i className="ngp-blob ngp-b2" /><i className="ngp-blob ngp-b3" />

      <div className="ngp-sc-head">
        <small>NGRIFFINPAY HRMS</small>
        <h2>HR that fits in your pocket</h2>
      </div>

      <div className="ngp-stage">
        <div className="ngp-enter">
          <div className="ngp-bob">
            <div className="ngp-phone">
              <div className="ngp-viewport">

                {/* 1 · Punch IN Done */}
                <section className="ngp-screen ngp-s1">
                  <div className="ngp-scroll">
                    <Status />
                    <header className="ngp-hd">
                      <img src={logo} alt="NGriffinpay" className="ngp-hd-logo" />
                      <div className="ngp-av">P</div>
                    </header>
                    <p className="ngp-hello">Good morning, <b>Priya</b></p>
                    <div className="ngp-pcard">
                      <small>Thursday, 22 Oct</small>
                      <div className="ngp-pwrap">
                        <button type="button" className="ngp-pbtn">
                          <span className="ngp-pin">Punch In</span>
                          <span className="ngp-pok">✓</span>
                        </button>
                      </div>
                      <b className="ngp-ptxt">Not punched in yet</b>
                      <small className="ngp-ploc">📍 Bengaluru HQ · GPS verified</small>
                    </div>
                    <h4>Today's shift</h4>
                    <div className="ngp-trio">
                      <div><b>09:00</b><small>Start</small></div>
                      <div><b>45m</b><small>Break</small></div>
                      <div><b>18:00</b><small>End</small></div>
                    </div>
                  </div>
                </section>

                {/* 2 · Salary Credited */}
                <section className="ngp-screen ngp-s2">
                  <div className="ngp-notif">
                    <span className="ngp-ic ngp-g">🏦</span>
                    <div><b>Salary Credited</b><small>₹82,450 to A/c ••4521</small></div>
                  </div>
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Salary Credited</h3>
                    <p className="ngp-sub">September salary · Credited 30 Sep</p>
                    <div className="ngp-pay">
                      <small>Net pay</small>
                      <strong>₹<span className="ngp-paynum">0</span></strong>
                      <div className="ngp-stack"><span className="ngp-seg ngp-e" /><span className="ngp-seg ngp-d" /></div>
                      <div className="ngp-legend"><span className="ngp-le">Take-home</span><span className="ngp-ld">Deductions</span></div>
                    </div>
                    {PAY_ROWS.map(([k, v]) => (
                      <div className="ngp-prow" key={k}><span>{k}</span><b className={v.startsWith('-') ? 'ngp-neg' : ''}>₹{v}</b></div>
                    ))}
                    <button type="button" className="ngp-dl">Download payslip</button>
                  </div>
                </section>

                {/* 3 · Form 24Q Ready */}
                <section className="ngp-screen ngp-s3">
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Form 24Q</h3>
                    <p className="ngp-sub">TDS on salary · Q2 FY 2026-27</p>
                    <div className="ngp-fcard">
                      <div className="ngp-frow">
                        <span className="ngp-ic ngp-b">📄</span>
                        <div><b>Quarterly TDS return</b><small>Jul – Sep 2026 · 249 employees</small></div>
                      </div>
                      <div className="ngp-fprog"><i /></div>
                      <div className="ngp-fstat"><small className="ngp-fst">Generating…</small><small className="ngp-fpct">0%</small></div>
                    </div>
                    <ul className="ngp-chk">
                      {F24Q_CHECKS.map(c => <li key={c}><span>✓</span>{c}</li>)}
                    </ul>
                    <div className="ngp-ready">✅ Form 24Q Ready · Due 31 Oct</div>
                    <button type="button" className="ngp-dl">Download FVU file</button>
                  </div>
                </section>

                {/* 4 · Tasks are Updated */}
                <section className="ngp-screen ngp-s4">
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Tasks</h3>
                    <p className="ngp-sub"><span className="ngp-tcount">{DONE_AT_START}</span> of {TASKS.length} done today</p>
                    <div className="ngp-tbar"><i /></div>
                    {TASKS.map(([t, who, pc, pl]) => (
                      <div className="ngp-task" key={t}>
                        <span className="ngp-box">✓</span>
                        <div><b>{t}</b><small>{who}</small></div>
                        <span className={`ngp-pill ${pc}`}>{pl}</span>
                      </div>
                    ))}
                    <p className="ngp-upd">🔄 Tasks are updated · just now</p>
                  </div>
                </section>

                {/* 5 · Pending Actions */}
                <section className="ngp-screen ngp-s5">
                  <div className="ngp-scroll">
                    <Status />
                    <div className="ngp-pah">
                      <h3 className="ngp-ttl">Pending Actions</h3>
                      <span className="ngp-badge">{PENDING.length}</span>
                    </div>
                    <p className="ngp-sub">Waiting for your approval</p>
                    {PENDING.map(([a, n, d]) => (
                      <div className="ngp-pa" key={n}>
                        <span className="ngp-av ngp-sm">{a}</span>
                        <div className="ngp-pa-txt"><b>{n}</b><small>{d}</small></div>
                        <div className="ngp-pa-btn">
                          <button type="button" className="ngp-pa-no">✕</button>
                          <button type="button" className="ngp-pa-ok">✓</button>
                        </div>
                        <span className="ngp-pa-done">Approved ✓</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 6 · Team Leave Balance */}
                <section className="ngp-screen ngp-s6">
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Team Leave Balance</h3>
                    <p className="ngp-sub">Design team · FY 2026-27</p>
                    <div className="ngp-lb">
                      <div className="ngp-p"><b>2</b><small>On leave</small></div>
                      <div className="ngp-c"><b>3</b><small>Requests</small></div>
                      <div className="ngp-b"><b>86</b><small>Days left</small></div>
                    </div>
                    <h4>By member</h4>
                    {TEAM_LB.map(([n, c, s, e]) => (
                      <div className="ngp-tm" key={n}>
                        <div className="ngp-tmh">
                          <span className="ngp-av ngp-sm">{n[0]}</span>
                          <div><b>{n}</b></div>
                          <em>{c + s + e} days</em>
                        </div>
                        <div className="ngp-tlb">
                          <i className="ngp-cs" style={{ width: `${(c / LB_MAX) * 100}%` }} />
                          <i className="ngp-sk" style={{ width: `${(s / LB_MAX) * 100}%` }} />
                          <i className="ngp-er" style={{ width: `${(e / LB_MAX) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                    <div className="ngp-tleg">
                      <span className="ngp-cs">Casual</span><span className="ngp-sk">Sick</span><span className="ngp-er">Earned</span>
                    </div>
                  </div>
                </section>

                {/* bottom tab bar */}
                <ul className="ngp-tabbar">
                  {TABS.map((t, i) => <li key={i} className={i === 0 ? 'ngp-on' : ''}>{t}</li>)}
                </ul>

                <span className="ngp-tap" />

                {/* splash with logo */}
                <div className="ngp-splash"><img src={logo} alt="NGriffinpay" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
