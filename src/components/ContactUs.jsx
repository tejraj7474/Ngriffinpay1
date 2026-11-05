// ContactUs.jsx
// NGriffinpay — Contact Us page (dark navy theme)
// Section 1: Hero — heading + 3 live contact cards (Email / Call / Visit) with copy & tap actions
// Section 2: Form + live email preview — the preview fills in as the visitor types,
//            then "sends" on submit with a delivery timeline (GSAP)
// Section 3: Office map (Google Maps embed) with address card + directions
// Header & Footer come from App.jsx (your existing site components).
//
// Install:  npm i gsap   (already installed — no extra packages needed)

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { I } from "../data";
import "./ContactUs.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const CONTACT = {
  email: "hr@ngriffin.in",
  phone: "+91 9901540666",
  phoneHref: "tel:+919901540666",
  address: "#4272, 1st Floor Saptagiri Building Near Sita Circle, BSK 3rd Stage, Girinagar, Bangalore-560085.",
  addressShort: ["#4272, 1st Floor, Saptagiri Building", "Near Sita Circle, BSK 3rd Stage", "Girinagar, Bangalore – 560085"],
  privacy: "https://ngriffinpay.in/privacy-policy.html",
};
const MAP_QUERY = encodeURIComponent("Saptagiri Building, Sita Circle, Girinagar, BSK 3rd Stage, Bangalore 560085");
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

const EMPLOYEE_LIMITS = ["1-10", "11-50", "51-200", "201+"];

// Hook this up to your backend (PHP mail / API). Leave empty to only show the success state.
const CONTACT_ENDPOINT = "";

const EMPTY = { firstName: "", lastName: "", email: "", company: "", phone: "", employees: "", comments: "", consent: false };

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (name) {
    case "mail": return <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>;
    case "phone": return <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    case "pin": return <svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "copy": return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
    case "check": return <svg {...p} strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>;
    case "send": return <svg {...p}><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "nav": return <svg {...p}><path d="m3 11 19-9-9 19-2-8z" /></svg>;
    case "users": return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "building": return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>;
    case "inbox": return <svg {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>;
    case "paperclip": return <svg {...p}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero with contact cards                                 */
/* ------------------------------------------------------------------ */

function CopyBtn({ text, label }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  };
  return (
    <button type="button" className={`cnt-copy ${done ? "is-done" : ""}`} onClick={copy} aria-label={`Copy ${label}`}>
      <Icon name={done ? "check" : "copy"} size={13} /> {done ? "Copied" : "Copy"}
    </button>
  );
}

function ContactHero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".cnt-hero-head > *", { y: 28, opacity: 0, stagger: 0.09, duration: 0.65 })
        .from(".cnt-card", { y: 40, opacity: 0, stagger: 0.12, duration: 0.6 }, "-=0.3");
      // ambient: ringing phone, wobbling envelope, bouncing pin
      gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 1.6 })
        .to(".cnt-card.is-call .cnt-card-ic svg", { rotation: 14, duration: 0.08, repeat: 7, yoyo: true, ease: "none" })
        .set(".cnt-card.is-call .cnt-card-ic svg", { rotation: 0 });
      gsap.to(".cnt-ring", { scale: 1.9, opacity: 0, duration: 1.4, repeat: -1, ease: "power2.out", stagger: 0.45 });
      gsap.to(".cnt-card.is-visit .cnt-card-ic svg", { y: -4, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 1.2 })
        .fromTo(".cnt-badge", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(3)" })
        .to(".cnt-card.is-mail .cnt-card-ic svg", { y: -3, duration: 0.15, repeat: 3, yoyo: true }, "<")
        .to(".cnt-badge", { scale: 0, duration: 0.3, delay: 1.8 });
      gsap.to(".cnt-orb", { x: "random(-40, 40)", y: "random(-30, 30)", duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1.2 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cnt-hero" ref={rootRef}>
      <div className="cnt-hero-bg" aria-hidden>
        <span className="cnt-orb o1" /><span className="cnt-orb o2" /><span className="cnt-orb o3" />
        <span className="cnt-stars" />
      </div>

      <div className="cnt-container">
        <div className="cnt-hero-head">
          <span className="cnt-eyebrow"><span className="cnt-live" /> We're here to help</span>
          <h1>Contact <span>Us</span></h1>
          <p>Questions about payroll, HR or a demo for your team? Write to us, call us or drop by our Bangalore office — a real person from NGriffinpay will get back to you.</p>
        </div>

        <div className="cnt-cards">
          {/* Email */}
          <div className="cnt-card is-mail">
            <div className="cnt-card-top">
              <span className="cnt-card-ic">
                <Icon name="mail" size={22} />
                <span className="cnt-badge" aria-hidden>1</span>
              </span>
              <span className="cnt-card-tag">Email Us</span>
            </div>
            <a className="cnt-card-val" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <div className="cnt-card-actions">
              <a className="cnt-chip" href={`mailto:${CONTACT.email}`}><Icon name="send" size={13} /> Write a mail</a>
              <CopyBtn text={CONTACT.email} label="email" />
            </div>
          </div>

          {/* Call */}
          <div className="cnt-card is-call">
            <div className="cnt-card-top">
              <span className="cnt-card-ic">
                <span className="cnt-ring" /><span className="cnt-ring" />
                <Icon name="phone" size={22} />
              </span>
              <span className="cnt-card-tag">Call Us</span>
            </div>
            <a className="cnt-card-val" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <div className="cnt-card-actions">
              <a className="cnt-chip" href={CONTACT.phoneHref}><Icon name="phone" size={13} /> Tap to call</a>
              <CopyBtn text={CONTACT.phone} label="phone number" />
            </div>
          </div>

          {/* Visit */}
          <div className="cnt-card is-visit">
            <div className="cnt-card-top">
              <span className="cnt-card-ic"><Icon name="pin" size={22} /></span>
              <span className="cnt-card-tag">Visit Us</span>
            </div>
            <address className="cnt-card-addr">
              {CONTACT.addressShort.map((l) => <span key={l}>{l}</span>)}
            </address>
            <div className="cnt-card-actions">
              <a className="cnt-chip" href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer"><Icon name="nav" size={13} /> Get directions</a>
              <a className="cnt-chip ghost" href="#cnt-map">View map</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Form + live email preview                               */
/* ------------------------------------------------------------------ */

function validate(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = "Please enter your first name";
  if (!f.lastName.trim()) e.lastName = "Please enter your last name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Please enter a valid email";
  if (!f.company.trim()) e.company = "Please enter your company name";
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) e.phone = "Please enter a valid 10-digit mobile number";
  if (!f.employees) e.employees = "Please select your employee count";
  return e;
}

function Field({ label, name, value, onChange, error, type = "text", placeholder, autoComplete, required = true }) {
  return (
    <label className={`cnt-field ${error ? "has-err" : ""} ${value ? "has-val" : ""}`}>
      <span>{label}{required && <em>*</em>}</span>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={!!error} />
      {error && <small>{error}</small>}
    </label>
  );
}

function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | fail
  const [ticket, setTicket] = useState("");
  const rootRef = useRef(null);
  const mailRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".cnt-form-card", { x: -40, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: rootRef.current, start: "top 75%" } });
      gsap.from(".cnt-preview", { x: 40, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: rootRef.current, start: "top 75%" } });
      gsap.from(".cnt-sec-head > *", { y: 20, opacity: 0, stagger: 0.08, duration: 0.5, scrollTrigger: { trigger: rootRef.current, start: "top 80%" } });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const pickEmp = (v) => {
    setForm((f) => ({ ...f, employees: v }));
    if (errors.employees) setErrors((er) => ({ ...er, employees: undefined }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      if (!prefersReduced()) gsap.fromTo(".cnt-form-card", { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      return;
    }
    setState("sending");
    try {
      if (CONTACT_ENDPOINT) {
        const body = new FormData();
        Object.entries(form).forEach(([k, v]) => body.append(k, typeof v === "boolean" ? (v ? "yes" : "no") : v));
        const res = await fetch(CONTACT_ENDPOINT, { method: "POST", body });
        if (!res.ok) throw new Error("failed");
      }
      const ref = "NGP-" + Math.floor(100000 + Math.random() * 900000);
      setTicket(ref);
      // fly the email away, then show the sent state
      if (!prefersReduced() && mailRef.current) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000); // safety net in case the tween is interrupted
          gsap.timeline({ onComplete: resolve })
            .to(mailRef.current, { scale: 0.92, duration: 0.25, ease: "power2.out" })
            .to(mailRef.current, { x: 140, y: -120, rotation: 12, opacity: 0, duration: 0.55, ease: "power2.in" });
        });
      }
      setState("sent");
    } catch {
      setState("fail");
    }
  };

  // sent state animation
  useEffect(() => {
    if (state !== "sent" || prefersReduced() || !rootRef.current) return;
    const q = gsap.utils.selector(rootRef);
    gsap.fromTo(q(".cnt-sent"), { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" });
    gsap.fromTo(q(".cnt-step"), { x: -14, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.35, duration: 0.4, delay: 0.4 });
  }, [state]);

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setState("idle");
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const initials = (form.firstName[0] || "") + (form.lastName[0] || "");
  const filled = ["firstName", "lastName", "email", "company", "phone", "employees"].filter((k) => (k === "employees" ? form[k] : form[k].trim())).length;

  return (
    <section className="cnt-main" ref={rootRef}>
      <div className="cnt-container">
        <div className="cnt-sec-head">
          <span className="cnt-eyebrow"><Icon name="send" size={13} /> Send us a message</span>
          <h2>Tell us about your team</h2>
          <p>Fill in the form — you'll see your message take shape on the right, exactly as it reaches our inbox.</p>
        </div>

        <div className="cnt-main-grid">
          {/* ---------- Form ---------- */}
          <form className="cnt-form-card" onSubmit={submit} noValidate>
            <div className="cnt-form-progress" aria-hidden>
              <span>{filled}/6 required fields</span>
              <div><i style={{ width: `${(filled / 6) * 100}%` }} /></div>
            </div>

            <div className="cnt-row2">
              <Field label="First Name" name="firstName" value={form.firstName} onChange={set("firstName")} error={errors.firstName} placeholder="Priya" autoComplete="given-name" />
              <Field label="Last Name" name="lastName" value={form.lastName} onChange={set("lastName")} error={errors.lastName} placeholder="Sharma" autoComplete="family-name" />
            </div>
            <div className="cnt-row2">
              <Field label="Email" name="email" type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="priya@company.com" autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} placeholder="98765 43210" autoComplete="tel" />
            </div>
            <Field label="Company" name="company" value={form.company} onChange={set("company")} error={errors.company} placeholder="Your company name" autoComplete="organization" />

            <div className={`cnt-field cnt-emp ${errors.employees ? "has-err" : ""}`} role="radiogroup" aria-label="Employees">
              <span>Employees<em>*</em></span>
              <div className="cnt-emp-opts">
                {EMPLOYEE_LIMITS.map((v, i) => (
                  <button key={v} type="button" role="radio" aria-checked={form.employees === v} className={`cnt-emp-opt ${form.employees === v ? "is-on" : ""}`} onClick={() => pickEmp(v)}>
                    <span className="cnt-emp-people" aria-hidden>
                      {Array.from({ length: i + 1 }).map((_, k) => <Icon key={k} name="users" size={12} />)}
                    </span>
                    {v}
                  </button>
                ))}
              </div>
              {/* native select kept for forms/backends that read <select name="employees"> */}
              <select name="employees" value={form.employees} onChange={set("employees")} className="cnt-visually-hidden" tabIndex={-1} aria-hidden>
                <option value="">Select Limit</option>
                {EMPLOYEE_LIMITS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.employees && <small>{errors.employees}</small>}
            </div>

            <label className="cnt-field">
              <span>Additional Comments</span>
              <textarea name="comments" rows={4} value={form.comments} onChange={set("comments")} placeholder="Tell us what you're looking for — payroll, attendance, a demo…" />
            </label>

            <label className="cnt-consent">
              <input type="checkbox" name="consent" checked={form.consent} onChange={set("consent")} />
              <span className="cnt-check" aria-hidden><Icon name="check" size={11} /></span>
              <span>
                I agree to receive email updates, promotions, and personalized offers from NGriffinpay and its partners. I understand that I can unsubscribe or manage my preferences at any time through the link provided in any email.{" "}
                <a href={CONTACT.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </span>
            </label>

            {state === "fail" && <p className="cnt-form-err">Something went wrong. Please try again or email us at {CONTACT.email}.</p>}

            <button type="submit" className="cnt-submit" disabled={state === "sending" || state === "sent"}>
              {state === "sending" ? "Sending…" : state === "sent" ? "Sent" : "Submit"} <Icon name="send" size={16} />
            </button>
          </form>

          {/* ---------- Live preview ---------- */}
          <div className="cnt-preview" aria-live="polite">
            <div className="cnt-pv-chrome">
              <span className="cnt-pv-dots"><i /><i /><i /></span>
              <span className="cnt-pv-app"><Icon name="inbox" size={13} /> NGriffinpay · Inbox</span>
            </div>

            <div className="cnt-pv-body">
              {state !== "sent" ? (
                <div className="cnt-mail" ref={mailRef} key="mail">
                  <div className="cnt-mail-h">
                    <span className="cnt-mail-ava">{initials.toUpperCase() || <Icon name="users" size={16} />}</span>
                    <div className="cnt-mail-from">
                      <b className={fullName ? "" : "ph"}>{fullName || "Your name"}</b>
                      <span className={form.email ? "" : "ph"}>{form.email || "you@company.com"}</span>
                    </div>
                    <span className="cnt-mail-time">now</span>
                  </div>
                  <div className="cnt-mail-to">To: <b>{CONTACT.email}</b></div>
                  <div className="cnt-mail-subj">
                    New enquiry from <b className={form.company ? "" : "ph"}>{form.company || "your company"}</b>
                  </div>

                  <div className="cnt-mail-tags">
                    <span className={form.company ? "on" : ""}><Icon name="building" size={12} /> {form.company || "Company"}</span>
                    <span className={form.employees ? "on" : ""}><Icon name="users" size={12} /> {form.employees ? `${form.employees} employees` : "Team size"}</span>
                    <span className={form.phone ? "on" : ""}><Icon name="phone" size={12} /> {form.phone || "Phone"}</span>
                  </div>

                  <div className="cnt-mail-text">
                    <p>Hi NGriffinpay team,</p>
                    {form.comments
                      ? <p className="typed">{form.comments}<span className="cnt-caret" /></p>
                      : <p className="ph">Your message will appear here as you type…<span className="cnt-caret" /></p>}
                    <p>Regards,<br /><b className={fullName ? "" : "ph"}>{fullName || "Your name"}</b>{form.company && <><br /><span className="muted">{form.company}</span></>}</p>
                  </div>

                  <div className="cnt-mail-foot">
                    <span><Icon name="paperclip" size={12} /> {form.consent ? "Subscribed to updates" : "No marketing emails"}</span>
                    <span className="cnt-mail-ready">{filled === 6 ? "Ready to send" : `${6 - filled} field${6 - filled === 1 ? "" : "s"} left`}</span>
                  </div>
                </div>
              ) : (
                <div className="cnt-sent" key="sent">
                  <span className="cnt-sent-ic"><Icon name="check" size={30} /></span>
                  <h3>Thank you, {form.firstName}!</h3>
                  <p>Your message has reached our team. Reference <b>{ticket}</b></p>
                  <ol className="cnt-steps">
                    <li className="cnt-step done"><span><Icon name="check" size={11} /></span>Delivered to {CONTACT.email}</li>
                    <li className="cnt-step"><span><Icon name="users" size={11} /></span>Our team reviews your requirement</li>
                    <li className="cnt-step"><span><Icon name="phone" size={11} /></span>We call you on {form.phone}</li>
                  </ol>
                  <button type="button" className="cnt-chip" onClick={reset}>Send another message</button>
                </div>
              )}
            </div>

            <div className="cnt-pv-alt">
              Prefer to talk? <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Map                                                     */
/* ------------------------------------------------------------------ */

function OfficeMap() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".cnt-map-card", { y: 40, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: rootRef.current, start: "top 75%" } });
      gsap.to(".cnt-map-pulse", { scale: 2.4, opacity: 0, duration: 1.6, repeat: -1, ease: "power2.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="cnt-map" id="cnt-map" ref={rootRef}>
      <div className="cnt-map-frame">
        <iframe title="NGriffinpay office location" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
      <div className="cnt-container cnt-map-over">
        <div className="cnt-map-card">
          <div className="cnt-map-top">
            <span className="cnt-map-logo"><img src={I("ngriffinpay-mark.png")} alt="NGriffinpay" /></span>
            <div>
              <b>NGriffinpay Office</b>
              <span>Girinagar, Bangalore</span>
            </div>
            <span className="cnt-map-pin" aria-hidden><span className="cnt-map-pulse" /><Icon name="pin" size={16} /></span>
          </div>
          <address>{CONTACT.address}</address>
          <div className="cnt-map-actions">
            <a className="cnt-submit sm" href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer"><Icon name="nav" size={14} /> Get directions</a>
            <a className="cnt-chip" href={CONTACT.phoneHref}><Icon name="phone" size={13} /> Call before visiting</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ContactUs() {
  return (
    <main className="cnt-page">
      <ContactHero />
      <ContactForm />
      <OfficeMap />
    </main>
  );
}
