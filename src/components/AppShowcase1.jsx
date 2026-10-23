import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap';
import logo from '../assets/ngriffinpay-logo.png';
import './AppShowcase.css';

const ACTIONS = [
  ['Leave', '🌴', 'ngp-p', ''],
  ['Payslip', '💸', 'ngp-c', ''],
  ['Attendance', '🕘', 'ngp-b', 'ngp-a-att'],
  ['Claims', '🧾', 'ngp-g', ''],
];
const TEAM = [
  ['Aarav S.', 'Design', 'In office'],
  ['Meera K.', 'Finance', 'In office'],
  ['Rohan P.', 'Engineering', 'Remote'],
];
const DAYS = [['M', 70], ['T', 85], ['W', 60], ['T', 92], ['F', 78]];
const PAY_ROWS = [
  ['Basic', '49,000'], ['HRA', '24,500'], ['Special allowance', '24,500'],
  ['Provident fund', '-5,880'], ['Income tax', '-9,670'],
];
const CAL = [...Array(4).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)]; // Oct 2026 starts on Thursday
const HI = [20, 21, 22];
const TABS = ['🏠', '🕘', '💸', '🌴'];
const C = 339.3; // ring circumference (r = 54)

const Status = () => (
  <div className="ngp-sb"><span>10:28</span><span>●●● ▮</span></div>
);

export default function AppShowcase() {
  const root = useRef();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const [s1, s2, s3, s4] = q('.ngp-screen');
      const sc = [s1, s2, s3, s4].map(s => s.querySelector('.ngp-scroll'));
      const view = q('.ngp-viewport')[0];
      const splash = q('.ngp-splash')[0];
      const tap = q('.ngp-tap')[0];
      const ring = q('.ngp-ring')[0];
      const payNum = q('.ngp-paynum')[0];
      const approve = q('.ngp-approve')[0];
      const tabs = q('.ngp-tabbar li');
      const bars = q('.ngp-bars i');
      const segs = q('.ngp-seg');
      const hi = q('.ngp-cal .ngp-hi');
      const rows = q('.ngp-prow');
      const counter = { v: 0 };

      const setTab = i => tabs.forEach((t, k) => t.classList.toggle('ngp-on', k === i));

      const reset = () => {
        gsap.set([s2, s3, s4], { opacity: 0, xPercent: 0 });
        gsap.set(s1, { opacity: 1, xPercent: 0 });
        gsap.set(splash, { opacity: 1, scale: 1 });
        gsap.set(sc[0], { y: 0 });
        gsap.set(ring, { strokeDashoffset: C });
        gsap.set(bars, { scaleY: 0 });
        gsap.set(segs, { scaleX: 0 });
        gsap.set(hi, { scale: 0 });
        gsap.set(rows, { opacity: 0, y: 10 });
        gsap.set(tap, { opacity: 0, scale: 0, xPercent: -50, yPercent: -50 });
        approve.classList.remove('ngp-done');
        approve.textContent = 'Approve';
        payNum.textContent = '0';
        counter.v = 0;
        setTab(0);
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

      // 0s  splash with logo -> dashboard
      tl.to(splash, { opacity: 0, scale: 1.12, duration: 0.6, ease: 'power2.inOut' }, 1)
        // dashboard scrolls down, then back up
        .to(sc[0], { y: -250, duration: 1.7, ease: 'power2.inOut' }, 2)
        .to(sc[0], { y: 0, duration: 1.1, ease: 'power2.inOut' }, 4.4);

      // dashboard -> attendance
      press(q('.ngp-a-att')[0], sc[0], 5.8);
      tl.call(() => setTab(1), null, 5.8);
      nav(s1, s2, 6.1);
      tl.to(ring, { strokeDashoffset: C * (1 - 0.82), duration: 1.6, ease: 'power2.out' }, 6.7)
        .to(bars, { scaleY: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.6)' }, 6.9);

      // attendance -> payroll
      press(tabs[2], view, 9.8);
      tl.call(() => setTab(2), null, 9.8);
      nav(s2, s3, 10.1);
      tl.fromTo(counter, { v: 0 }, {
        v: 82450, duration: 1.4, ease: 'power2.out', immediateRender: false,
        onUpdate: () => { payNum.textContent = Math.round(counter.v).toLocaleString('en-IN'); },
      }, 10.7)
        .to(segs, { scaleX: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' }, 10.8)
        .to(rows, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, 11.2);

      // payroll -> leave
      press(tabs[3], view, 13.6);
      tl.call(() => setTab(3), null, 13.6);
      nav(s3, s4, 13.9);
      tl.to(hi, { scale: 1, duration: 0.45, stagger: 0.15, ease: 'back.out(2)' }, 14.6);
      press(approve, sc[3], 16.2);
      tl.call(() => { approve.classList.add('ngp-done'); approve.textContent = 'Approved ✓'; }, null, 16.4);

      // leave -> back to home
      press(tabs[0], view, 18.4);
      tl.call(() => setTab(0), null, 18.4);
      nav(s4, s1, 18.7);
      tl.to({}, { duration: 1.2 }, 19.6); // hold the last frame before looping

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
      gsap.utils.toArray('.ngp-fchip').forEach((c, i) => {
        gsap.from(c, {
          opacity: 0, x: i % 2 ? 40 : -40, duration: 0.8, delay: 0.4 + i * 0.25,
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        });
        gsap.to(c, { y: i % 2 ? 12 : -12, duration: 2.2 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
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
        <span className="ngp-fchip ngp-f1">✅ Leave approved</span>
        <span className="ngp-fchip ngp-f2">💸 Payslip ready</span>
        <span className="ngp-fchip ngp-f3">⏱ On time · 98%</span>

        <div className="ngp-enter">
          <div className="ngp-bob">
            <div className="ngp-phone">
              <div className="ngp-viewport">

                {/* 1 · Dashboard */}
                <section className="ngp-screen ngp-s1">
                  <div className="ngp-scroll">
                    <Status />
                    <header className="ngp-hd">
                      <img src={logo} alt="NGriffinpay" className="ngp-hd-logo" />
                      <div className="ngp-av">P</div>
                    </header>
                    <p className="ngp-hello">Good morning, <b>Priya</b></p>
                    <div className="ngp-punch">
                      <div><small>Checked in</small><strong>09:02 AM</strong><em>Bengaluru HQ</em></div>
                      <button type="button">Punch Out</button>
                    </div>
                    <h4>Quick actions</h4>
                    <div className="ngp-grid4">
                      {ACTIONS.map(([n, e, c, k]) => (
                        <div key={n} className={`ngp-act ${k}`}><span className={`ngp-ic ${c}`}>{e}</span><small>{n}</small></div>
                      ))}
                    </div>
                    <h4>Leave balance</h4>
                    <div className="ngp-lb">
                      <div className="ngp-p"><b>8</b><small>Casual</small></div>
                      <div className="ngp-c"><b>6</b><small>Sick</small></div>
                      <div className="ngp-b"><b>14</b><small>Earned</small></div>
                    </div>
                    <h4>Who's in today</h4>
                    {TEAM.map(([n, d, s]) => (
                      <div className="ngp-mem" key={n}>
                        <span className="ngp-av ngp-sm">{n[0]}</span>
                        <div><b>{n}</b><small>{d}</small></div>
                        <em>{s}</em>
                      </div>
                    ))}
                    <h4>Announcements</h4>
                    <div className="ngp-note"><b>Diwali holiday</b><small>Offices closed 20 – 22 Oct. Happy Diwali!</small></div>
                    <div className="ngp-pad" />
                  </div>
                </section>

                {/* 2 · Attendance */}
                <section className="ngp-screen ngp-s2">
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Attendance</h3>
                    <p className="ngp-sub">This month · 22 working days</p>
                    <div className="ngp-ringbox">
                      <svg viewBox="0 0 140 140">
                        <circle className="ngp-trk" cx="70" cy="70" r="54" />
                        <circle className="ngp-ring" cx="70" cy="70" r="54" transform="rotate(-90 70 70)" strokeDasharray={C} />
                      </svg>
                      <div className="ngp-ringtxt"><strong>7h 42m</strong><small>worked today</small></div>
                    </div>
                    <div className="ngp-trio">
                      <div><b>19</b><small>Present</small></div>
                      <div><b>2</b><small>Late</small></div>
                      <div><b>1</b><small>Absent</small></div>
                    </div>
                    <h4>This week</h4>
                    <div className="ngp-bars">
                      {DAYS.map(([d, h], i) => (
                        <div key={i}><i style={{ height: `${h}%` }} /><span>{d}</span></div>
                      ))}
                    </div>
                    <div className="ngp-duo">
                      <div className="ngp-pw">Shift<b>09:00 – 18:00</b></div>
                      <div className="ngp-pw ngp-coral">Overtime<b>1h 20m</b></div>
                    </div>
                  </div>
                </section>

                {/* 3 · Payroll */}
                <section className="ngp-screen ngp-s3">
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Payroll</h3>
                    <p className="ngp-sub">October payslip · Ready</p>
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

                {/* 4 · Leave */}
                <section className="ngp-screen ngp-s4">
                  <div className="ngp-scroll">
                    <Status />
                    <h3 className="ngp-ttl">Leave</h3>
                    <p className="ngp-sub">Calendar & approvals</p>
                    <div className="ngp-cal">
                      <div className="ngp-calh"><b>October 2026</b></div>
                      <div className="ngp-calg">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="ngp-dn">{d}</span>)}
                        {CAL.map((d, i) => (
                          <span key={i} className="ngp-d">
                            {d && <>{HI.includes(d) && <i className="ngp-hi" />}<em>{d}</em></>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ngp-req">
                      <span className="ngp-av ngp-sm">R</span>
                      <div><b>Rohan P.</b><small>Casual leave · 20 – 22 Oct</small></div>
                    </div>
                    <div className="ngp-reqbtn">
                      <button type="button" className="ngp-rej">Reject</button>
                      <button type="button" className="ngp-approve">Approve</button>
                    </div>
                  </div>
                </section>

                {/* bottom tab bar (static) */}
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
