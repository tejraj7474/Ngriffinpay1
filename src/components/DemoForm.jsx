import React, { useRef, useState } from "react";
import "./DemoForm.css";

const EMPLOYEE_OPTIONS = [
  "1 - 25",
  "26 - 50",
  "51 - 100",
  "101 - 250",
  "251 - 500",
  "500+",
];

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
 *  endpoint   – URL that emails the request. Defaults to its own Vercel function
 *               api/demo-popup.js (separate from the "Book a Demo" modal's api/demo.js).
 */
const DemoForm = ({ onSuccess, endpoint = "/api/demo-popup" }) => {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [failMsg, setFailMsg] = useState("");
  const openedAt = useRef(Date.now()); // spam check: time the form appeared

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Please enter your name";
    if (!v.email.trim()) e.email = "Please enter your work email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
      e.email = "Enter a valid email";
    if (!v.phone.trim()) e.phone = "Please enter your mobile number";
    else if (!/^[6-9]\d{9}$/.test(v.phone))
      e.phone = "Enter a valid 10-digit mobile number";
    if (!v.company.trim()) e.company = "Please enter your company name";
    if (!v.employees) e.employees = "Select employee count";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setValues((p) => ({ ...p, [name]: val }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus("sending");
    setFailMsg("");
    try {
      const url = endpoint || "/api/demo-popup";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source: "20s-popup",
          page: window.location.href,
          t: Date.now() - openedAt.current, // ms spent on the form
        }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        /* not JSON — e.g. the function isn't deployed */
      }
      if (!res.ok || !data?.ok) {
        if (data?.errors) setErrors(data.errors); // server-side validation
        const err = new Error(data?.message || "Request failed");
        err.userMessage = data?.message;
        throw err;
      }
      setStatus("done");
      setValues(INITIAL);
      setTimeout(() => onSuccess && onSuccess(), 2500);
    } catch (err) {
      setFailMsg(err?.userMessage || "");
      setStatus("error");
    }
  };

  /* ---------- Success screen ---------- */
  if (status === "done") {
    return (
      <div className="df-success">
        <div className="df-success__icon">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h4>Demo request received!</h4>
        <p>
          Our HRMS expert will call you within 24 hours to schedule your
          30-minute demo.
        </p>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <form className="df" onSubmit={handleSubmit} noValidate>
      <div className="df__head">
        <h4 className="df__title">Experience NGriffinPay</h4>
        <p className="df__sub">Takes less than 30 seconds</p>
      </div>

      <div className="df__grid">
        <Field label="Full name" error={errors.name}>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Rahul Sharma"
            autoComplete="name"
          />
        </Field>

        <Field label="Work email" error={errors.email}>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="rahul@company.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Mobile number" error={errors.phone}>
          <div className="df__phone">
            <span className="df__code">+91</span>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="98765 43210"
              inputMode="numeric"
              autoComplete="tel-national"
            />
          </div>
        </Field>

        <Field label="Company name" error={errors.company}>
          <input
            name="company"
            value={values.company}
            onChange={handleChange}
            placeholder="Your company"
            autoComplete="organization"
          />
        </Field>

        <Field label="No. of employees" error={errors.employees}>
          <select
            name="employees"
            value={values.employees}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {EMPLOYEE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="City (optional)">
          <input
            name="city"
            value={values.city}
            onChange={handleChange}
            placeholder="Bengaluru"
            autoComplete="address-level2"
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="df__alert">
          {failMsg || "Something went wrong."} Please try again or WhatsApp us.
        </p>
      )}

      <button
        type="submit"
        className="df__submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <span className="df__spinner" /> Sending…
          </>
        ) : (
          <>
            Experience NGriffinPay <span className="df__arrow">→</span>
          </>
        )}
      </button>

      <p className="df__note">
        <svg viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
        </svg>
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
