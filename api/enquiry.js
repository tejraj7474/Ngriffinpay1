// api/enquiry.js — Vercel serverless function for the Pricing page "Package Enquiry" modal (Pricing.jsx).
// Separate from contact.js, demo.js and demo-popup.js.
//
// Put this file in the PROJECT ROOT → api/enquiry.js
// Uses the SAME Vercel environment variables as the other forms:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO,
//   MAIL_FROM_NAME (optional), SEND_AUTOREPLY (optional, "false" to switch off)

import nodemailer from "nodemailer";

// must match PLANS in Pricing.jsx
const PACKAGES = {
  "Starter Plan": "₹2,999 / month + GST · Upto 50 Employees",
  "Professional Plan": "₹3,999 / month + GST · Upto 50 Employees",
  "Premium Plan": "₹6,999 / month + GST · Upto 50 Employees",
};

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const line = (v, max = 200) =>
  String(v ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);
const makeRef = () => "NGP-E" + Math.floor(100000 + Math.random() * 900000);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  let b = req.body || {};
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      b = {};
    }
  }

  // Spam check: the page sends how long the visitor spent on the form (t, in ms).
  const t = Number(b.t);
  if (b.t !== undefined && (!Number.isFinite(t) || t < 1000)) {
    console.warn("Package enquiry: submitted too fast (" + b.t + " ms), request ignored");
    return res.status(200).json({ ok: true, message: "Thank you", ref: makeRef() });
  }

  /* ---------- Read + validate (same rules as the Pricing modal) ---------- */
  const pkg = line(b.package, 60);
  const name = line(b.name, 100);
  const email = line(b.email, 120);
  const phone = String(b.phone ?? "").replace(/\D/g, "").slice(-10);
  const page = line(b.page, 300);

  const errors = {};
  if (!PACKAGES[pkg]) errors.package = "Please choose a package";
  if (name.length < 2) errors.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Please enter a valid 10-digit mobile number";
  if (Object.keys(errors).length) {
    return res
      .status(422)
      .json({ ok: false, message: "Please check the highlighted fields.", errors });
  }

  /* ---------- Settings from environment variables ---------- */
  const {
    SMTP_HOST = "smtp.gmail.com",
    SMTP_PORT = "587",
    SMTP_USER,
    SMTP_PASS,
    MAIL_TO = "",
    MAIL_FROM_NAME = "NGriffinPay Website",
    SEND_AUTOREPLY = "true",
  } = process.env;
  const recipients = MAIL_TO.split(",").map((s) => s.trim()).filter(Boolean);
  if (!SMTP_USER || !SMTP_PASS || !recipients.length) {
    console.error("Package enquiry: SMTP_USER / SMTP_PASS / MAIL_TO env vars are missing");
    return res
      .status(500)
      .json({ ok: false, message: "Mail is not configured on the server yet." });
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s+/g, "") },
  });

  /* ---------- Build the email ---------- */
  const ref = makeRef();
  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const rows = [
    ["Reference", ref],
    ["Package", pkg],
    ["Price", PACKAGES[pkg]],
    ["Name", name],
    ["Email", email],
    ["Mobile", "+91 " + phone],
    ["Page", page || "-"],
    ["Submitted", when + " IST"],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;background:#ecfdf5;font-weight:600;width:140px">${esc(k)}</td><td style="padding:8px 12px">${esc(v)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">
  <h2 style="color:#059669;margin:0 0 4px">💰 New package enquiry</h2>
  <p style="color:#64748b;margin:0 0 12px">From the Pricing page — the visitor clicked "Purchase" on <b>${esc(pkg)}</b></p>
  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0">${table}</table>
  <p style="color:#64748b;font-size:12px;margin-top:16px">Call +91 ${esc(phone)} or reply to this email to reach ${esc(name)} directly.</p>
</div>`;
  const text =
    "New package enquiry (Pricing page)\n\n" +
    rows.map(([k, v]) => `${(k + ":").padEnd(12)}${v}`).join("\n") +
    "\n";

  /* ---------- 1) Send to the team ---------- */
  try {
    await transporter.sendMail({
      from: { name: MAIL_FROM_NAME, address: SMTP_USER },
      to: recipients,
      replyTo: { name, address: email },
      subject: `💰 Package enquiry: ${pkg} · ${name} · ${ref}`,
      html,
      text,
    });
  } catch (err) {
    console.error("Package enquiry mail failed:", err); // visible in Vercel → Logs
    return res
      .status(500)
      .json({ ok: false, message: "We could not send your enquiry right now." });
  }

  /* ---------- 2) Auto-reply to the visitor (never blocks success) ---------- */
  if (SEND_AUTOREPLY !== "false") {
    const first = name.split(" ")[0];
    try {
      await transporter.sendMail({
        from: { name: "NGriffinPay", address: SMTP_USER },
        to: { name, address: email },
        replyTo: recipients[0],
        subject: `Your NGriffinPay ${pkg} enquiry · ${ref}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">
<p>Hi ${esc(first)},</p>
<p>Thank you for your interest in the NGriffinPay <b>${esc(pkg)}</b> (${esc(PACKAGES[pkg])}). Our team will call you shortly on <b>+91 ${esc(phone)}</b>.</p>
<p>Your reference number is <b>${esc(ref)}</b>.</p>
<p>Regards,<br>Team NGriffinPay</p></div>`,
        text: `Hi ${first},\n\nThank you for your interest in the NGriffinPay ${pkg} (${PACKAGES[pkg]}). Our team will call you shortly on +91 ${phone}.\n\nReference: ${ref}\n\nRegards,\nTeam NGriffinPay`,
      });
    } catch (err) {
      console.error("Package enquiry auto-reply failed:", err);
    }
  }

  return res.status(200).json({ ok: true, message: "Enquiry sent", ref });
}
