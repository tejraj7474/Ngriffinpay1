import { useEffect, useState } from "react";
import { I } from "../data";
import "./Header.css";

// Coloured logo used on the white mobile header (change the file name if yours differs)
const MOBILE_LOGO = "logo.png";

// [label, link, icon file]
const PRODUCTS = [
  ["Interactive Dashboard", "/interactive-dashboard", "menu-icon-1.png"],
  ["Seamless Employee Onboarding", "/employee-onboarding", "menu-icon-2.png"],
  [
    "Employee Self-Service Portal with Mobile App",
    "/employee-self-service",
    "menu-icon-3.png",
  ],
  [
    "Attendance & Leave Management",
    "/attendance-leave-management",
    "menu-icon-4.png",
  ],
  [
    "Digital Employee Documentation",
    "/digital-employee-documentation",
    "menu-icon-5.png",
  ],
  [
    "Performance & Appraisal Management",
    "/performance-appraisal-management",
    "menu-icon-6.png",
  ],
  ["Shift & Scheduling Management", "#", "menu-icon-7.png"],
  ["Automated Payroll Processing", "#", "menu-icon-8.png"],
  ["Income Tax Computation & Compliance", "#", "menu-icon-9.png"],
  ["Employee Exit Management", "#", "menu-icon-10.png"],
  ["Full & Final Settlement Processing", "#", "menu-icon-11.png"],
  ["Asset Allocation & Management", "#", "menu-icon-12.png"],
];

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
              {PRODUCTS.slice(0, 6).map(([t, h]) => (
                <li key={t}>
                  <a href={h} onClick={closeAll}>
                    <span>{t}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ul>
              {PRODUCTS.slice(6).map(([t, h]) => (
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
          <a href="#" onClick={closeAll}>
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
                <a href="#" onClick={closeAll}>
                  <span>Partner with Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="nav-item">
          <a href="#" onClick={closeAll}>
            Blogs
          </a>
        </div>

        {/* LOCATION dropdown */}
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

        <div className="nav-item">
          <a href="#" onClick={closeAll}>
            Contact Us
          </a>
        </div>

        {/* mobile only: the demo button lives inside the opened menu */}
        <div className="nav-item nav-cta">
          <a href="#" className="btn p" onClick={closeAll}>
            Request a Demo
          </a>
        </div>
      </nav>

      {/* desktop only: hidden on mobile */}
      <div className="cta">
        <a href="#" className="btn p">
          Request a Demo
        </a>
      </div>
    </header>
  );
}
