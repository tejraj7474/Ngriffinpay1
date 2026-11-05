import { useEffect, useState } from "react";
import { I } from "../data";
import DemoModal from "./DemoModal";
import "./Header.css";

// Coloured logo used on the white mobile header (change the file name if yours differs)
const MOBILE_LOGO = "logo.png";

// Product menu items [label, link]
const PRODUCTS = [
  ["Core HR & Employee Records Management", "/core-hr"],
  ["Attendance, Location & Time Tracking", "/tracking"],
  ["People Engagement & Lifecycle Management", "/people"],
  ["Interactive Dashboard", "/interactive-dashboard"],
  ["Seamless Employee Onboarding", "/employee-onboarding"],
  ["Employee Self-Service Portal with Mobile App", "/employee-self-service"],
  ["Attendance & Leave Management", "/attendance-leave-management"],
  ["Digital Employee Documentation", "/digital-employee-documentation"],
  ["Performance & Appraisal Management", "/performance-appraisal-management"],
  ["Shift & Scheduling Management", "/shift-scheduling-management"],
  ["Automated Payroll Processing", "/automate-payroll-processing"],
  ["Income Tax Computation & Compliance", "/income-tax-computation-compliance"],
  ["Employee Exit Management", "/employee-exit-management"],
  ["Full & Final Settlement Processing", "/full-and-final-settlement"],
  ["Asset Allocation & Management", "/asset-allocation-management"],
  ["Recruitment Analytics", "/recruitment-analytics"],
];
const HALF = Math.ceil(PRODUCTS.length / 2); // left column gets the extra item

// Location menu is hidden for now — set this to true to show it again
const SHOW_LOCATION = false;

const LOCATIONS = [
  ["Bannerghatta Road", "#"],
  ["JP Nagar", "#"],
  ["HSR Layout", "#"],
  ["Indranagar", "#"],
  ["KIADB", "#"],
  ["Basavanagudi", "#"],
  ["Nelamangala", "#"],
  ["Kormangala", "#"],
  ["Whitefield", "#"],
  ["ITPL", "#"],
  ["Sarjapur", "#"],
  ["Harohalli", "#"],
  ["Magadi Road", "#"],
  ["Electronic City", "#"],
];

export default function Header() {
  const [open, setOpen] = useState(null); // which dropdown is open (click / touch)
  const [mob, setMob] = useState(false); // mobile menu
  const [demo, setDemo] = useState(false); // "Book a Demo" pop-up

  const toggle = (k) => (e) => {
    e.preventDefault();
    setOpen((o) => (o === k ? null : k));
  };
  const closeAll = () => {
    setOpen(null);
    setMob(false);
  };

  // lock page scroll while the mobile menu is open, close on Esc / resize
  useEffect(() => {
    document.body.style.overflow = mob ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && closeAll();
    const onResize = () => window.innerWidth > 992 && setMob(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [mob]);

  // open the "Book a Demo" pop-up
  const showDemo = (e) => {
    if (e) e.preventDefault();
    closeAll();
    setDemo(true);
  };

  // Any "Demo" button anywhere on the site opens the same pop-up
  // ("Request a Demo", "Book a Free Demo", "Book a Demo" …) — no need to edit each page.
  // You can also force it on any element with data-demo, href="#demo" or openDemo().
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const el = e.target.closest("a, button");
      if (!el || el.closest(".dmo")) return; // ignore clicks inside the pop-up itself
      if (el.type === "submit") return; // never hijack form submit buttons
      const forced = el.matches("[data-demo], a[href='#demo']");
      const isDemo = /\bdemo\b/i.test(el.textContent || "");
      if (forced || isDemo) showDemo(e);
    };
    const onOpen = () => showDemo();
    document.addEventListener("click", onClick);
    window.addEventListener("ngp:open-demo", onOpen);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("ngp:open-demo", onOpen);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const item = (k) => ({
    className: `nav-item has-dd ${open === k ? "open" : ""}`,
    onMouseLeave: () => setOpen(null),
  });

  return (
    <header className="hdr">
      <a className="logo" href="/" onClick={closeAll}>
        {/* desktop logo */}
        <img className="logo-d" src={I("logo.png")} alt="NGriffin Pay" />
        {/* mobile logo (coloured, shown on the white mobile header) */}
        <img className="logo-m" src={I(MOBILE_LOGO)} alt="NGriffin Pay" />
      </a>

      <button
        className="burger"
        aria-label="Toggle menu"
        aria-expanded={mob}
        onClick={() => setMob((m) => !m)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav aria-label="Main" className={mob ? "mob-open" : ""}>
        <div className="nav-item">
          <a href="/" onClick={closeAll}>
            Home
          </a>
        </div>

        {/* PRODUCT mega menu */}
        <div {...item("product")}>
          <a href="#" onClick={toggle("product")}>
            Product ▾
          </a>
          <div className="dd dd-mega">
            <ul>
              {PRODUCTS.slice(0, HALF).map(([t, h]) => (
                <li key={t}>
                  <a href={h} onClick={closeAll}>
                    <span>{t}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ul>
              {PRODUCTS.slice(HALF).map(([t, h]) => (
                <li key={t}>
                  <a href={h} onClick={closeAll}>
                    <span>{t}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="nav-item">
          <a href="/pricing" onClick={closeAll}>
            Pricing
          </a>
        </div>

        {/* PARTNER dropdown */}
        <div {...item("partner")}>
          <a href="#" onClick={toggle("partner")}>
            Partner ▾
          </a>
          <div className="dd dd-partner">
            <ul>
              <li>
                <a href="/partner-with-us" onClick={closeAll}>
                  <span>Partner with Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="nav-item">
          <a href="/blog" onClick={closeAll}>
            Blogs
          </a>
        </div>

        {/* LOCATION dropdown (hidden while SHOW_LOCATION is false) */}
        {SHOW_LOCATION && (
          <div {...item("location")}>
            <a href="#" onClick={toggle("location")}>
              Location ▾
            </a>
            <div className="dd dd-loc">
              <ul>
                {LOCATIONS.map(([t, h]) => (
                  <li key={t}>
                    <a href={h} onClick={closeAll}>
                      <span>{t}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="nav-item">
          <a href="/contact-us" onClick={closeAll}>
            Contact Us
          </a>
        </div>

        {/* mobile only: the demo button lives inside the opened menu */}
        <div className="nav-item nav-cta">
          <a href="#demo" className="btn p" onClick={showDemo}>
            Request a Demo
          </a>
        </div>
      </nav>

      {/* desktop only: hidden on mobile */}
      <div className="cta">
        <a href="#demo" className="btn p" onClick={showDemo}>
          Request a Demo
        </a>
      </div>

      {/* "Book a Demo" pop-up form */}
      <DemoModal open={demo} onClose={() => setDemo(false)} />
    </header>
  );
}
