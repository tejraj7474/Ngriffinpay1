import React, { useState } from "react";
import "./DemoForm.css";

const EMPLOYEE_OPTIONS = ["1 - 25", "26 - 50", "51 - 100", "101 - 250", "251 - 500", "500+"];

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  company: "",
  employees: "",
  city: "",
};

/**
 * DemoForm – used inside the HrmsDemoCTA popup.
 *
 * Props:
 *  onSuccess  – passed in by HrmsDemoCTA; closes popup + stops auto-open
 *  endpoint   – optional URL to POST the form data to (your API / PHP / Google Script)
 */
const DemoForm = ({ onSuccess, endpoint = "" }) => {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Please enter your name";
    if (!v.email.trim()) e.email = "Please enter your work email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email";
    if (!v.phone.trim()) e.phone = "Please enter your mobile number";
    else if (!/^[6-9]\d{9}$/.test(v.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!v.company.trim()) e.company = "Please enter your company name";
    if (!v.employees) e.employees = "Select employee count";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setValues((p) => ({ ...p, [name]: val }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus("sending");
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, source: "20s-popup", page: window.location.href }),
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        // No endpoint yet – just log it so you can test
        console.log("Demo request:", values);
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("done");
      setValues(INITIAL);
      setTimeout(() => onSuccess && onSuccess(), 2500);
    } catch (err) {
      setStatus("error");
    }
  };

  /* ---------- Success screen ---------- */
  if (status === "done") {
    return (
      <div className="df-success">
        <div className="df-success__icon">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h4>Demo request received!</h4>
        <p>Our HRMS expert will call you within 24 hours to schedule your 10-minute demo.</p>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <form className="df" onSubmit={handleSubmit} noValidate>
      <div className="df__head">
        <h4 className="df__title">Book your free demo</h4>
        <p className="df__sub">Takes less than 30 seconds</p>
      </div>

      <div className="df__grid">
        <Field label="Full name" error={errors.name}>
          <input name="name" value={values.name} onChange={handleChange} placeholder="Rahul Sharma" autoComplete="name" />
        </Field>

        <Field label="Work email" error={errors.email}>
          <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="rahul@company.com" autoComplete="email" />
        </Field>

        <Field label="Mobile number" error={errors.phone}>
          <div className="df__phone">
            <span className="df__code">+91</span>
            <input type="tel" name="phone" value={values.phone} onChange={handleChange} placeholder="98765 43210" inputMode="numeric" autoComplete="tel-national" />
          </div>
        </Field>

        <Field label="Company name" error={errors.company}>
          <input name="company" value={values.company} onChange={handleChange} placeholder="Your company" autoComplete="organization" />
        </Field>

        <Field label="No. of employees" error={errors.employees}>
          <select name="employees" value={values.employees} onChange={handleChange}>
            <option value="">Select</option>
            {EMPLOYEE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label="City (optional)">
          <input name="city" value={values.city} onChange={handleChange} placeholder="Bengaluru" autoComplete="address-level2" />
        </Field>
      </div>

      {status === "error" && (
        <p className="df__alert">Something went wrong. Please try again or WhatsApp us.</p>
      )}

      <button type="submit" className="df__submit" disabled={status === "sending"}>
        {status === "sending" ? (
          <><span className="df__spinner" /> Sending…</>
        ) : (
          <>Book My 10-min Demo <span className="df__arrow">→</span></>
        )}
      </button>

      <p className="df__note">
        <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
        Your details are safe with us. No spam.
      </p>
    </form>
  );
};

const Field = ({ label, error, children }) => (
  <label className={`df__field ${error ? "df__field--error" : ""}`}>
    <span className="df__label">{label}</span>
    {children}
    {error && <span className="df__error">{error}</span>}
  </label>
);

export default DemoForm;
