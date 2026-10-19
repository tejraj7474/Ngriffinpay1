import { useEffect, useState } from 'react';
import { I } from '../data';

// first item = heading (class "h"), the rest = [label, link]
const COLS = [
  ['Product',
    ['Interactive Dashboard', '#product'],
    ['Seamless Employee Onboarding', '#product'],
    ['Employee Self-Service Portal with Mobile App', '#product'],
    ['Attendance & Leave Management', '#product'],
    ['Digital Employee Documentation', '#product'],
    ['Performance & Appraisal Management', '#product'],
  ],
  ['Legal',
    ['Terms & Conditions', '#terms'],
    ['Privacy Policy', '#privacy'],
  ],
  ['Partner',
    ['Partner with us', '#partner'],
  ],
  ['NGriffinpay Customers',
    ['NGriffinpay HR Help', '#help'],
    ['Request a Demo', '#demo'],
  ],
  ['Company',
    ['Home', '#home'],
    ['Product', '#product'],
    ['Pricing', '#pricing'],
    ['Partner', '#partner'],
    ['Blog', '#blog'],
    ['Contact us', '#contact'],
  ],
];

const SOCIALS = [
  { name: 'Facebook', bg: '#1877f2', href: '#',
    svg: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.4 1.5-1.4h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8v3h2.5V21h3z" /> },
  { name: 'Instagram', bg: 'linear-gradient(45deg,#f9a93b,#e1306c 55%,#833ab4)', href: '#',
    svg: (<>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="16.6" cy="7.4" r="1.1" />
    </>) },
  { name: 'YouTube', bg: '#ff0000', href: '#',
    svg: <path d="M10 8.3v7.4l6.2-3.7L10 8.3z" /> },
  { name: 'X', bg: '#000', href: '#',
    svg: <path d="M17.5 4h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8L6.3 20.5H3.5l6.5-7.5L3.1 4h5.7l4 5.3L17.5 4z" /> },
  { name: 'LinkedIn', bg: '#0a66c2', href: '#',
    svg: <path d="M6.9 9.5H4V20h2.9V9.5zM5.4 4.5a1.7 1.7 0 100 3.4 1.7 1.7 0 000-3.4zM20 14c0-3-1.6-4.7-4-4.7-1.3 0-2.200.7-2.600 1.300V9.500h-2.900V20h2.900v-5.800c0-1.400.7-2.300 1.800-2.300s1.700.9 1.700 2.300V20H20v-6z" /> },
];

export default function Footer({ footRef }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <footer ref={footRef} className="foot">
        <div className="cols">
          {COLS.map((c) => (
            <ul key={c[0]}>
              <li className="h">{c[0]}</li>
              {c.slice(1).map(([label, href]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}

              {/* app store badges go under the Customers column */}
              {c[0] === 'NGriffinpay Customers' && (
                <li className="ft-stores">
                  <a href="#playstore" aria-label="Get it on Google Play">
                    <img src={I('google-play.png')} alt="Get it on Google Play" />
                  </a>
                  <a href="#appstore" aria-label="Download on the App Store">
                    <img src={I('app-store.png')} alt="Download on the App Store" />
                  </a>
                </li>
              )}
            </ul>
          ))}
        </div>

        {/* logo + address + socials */}
        <div className="ft-mid">
          <img className="ft-logo" src={I('logo.png')} alt="NGriffinpay" />

          <div className="ft-contact">
            <p className="ft-addr">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M12 2C8.1 2 5 5 5 8.9c0 5.2 7 13.1 7 13.1s7-7.9 7-13.1C19 5 15.9 2 12 2z" />
              </svg>
              : #4272, 1st Floor Saptagiri Building Near Sita Circle, BSK 3rd Stage,
              Girinagar, Bangalore-560085.
            </p>

            <div className="ft-social">
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.href} aria-label={s.name} style={{ background: s.bg }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">{s.svg}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="ft-bottom">
          <p>© 2025 NGriffinpay. All Rights Reserved</p>
          <p>Design &amp; Developed By : DigitalNock India Pvt. Ltd.</p>
        </div>
      </footer>

      {/* floating buttons (outside <footer> so a transform on .foot can't break position: fixed) */}
      <a
        className="ft-wa"
        href="https://wa.me/+919901540666"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="32" height="32" fill="#fff" aria-hidden="true">
          <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.8 1.9 6.8L3 29l6.6-1.8c1.9 1 4 1.6 6.3 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.3c-2 0-3.9-.6-5.5-1.6l-.4-.2-3.9 1 1-3.8-.3-.4a10.3 10.3 0 01-1.6-5.5C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.3 16 26.3zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4z" />
        </svg>
      </a>

      <button
        className={`ft-top ${showTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}