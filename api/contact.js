// api/contact.js — Vercel serverless function (Node.js)
// Receives the Contact Us form and emails it to the addresses in MAIL_TO.
//
// Put this file in the PROJECT ROOT:  your-project/api/contact.js
// (NOT inside src/ and NOT inside public/)
//
// Needs:  npm i nodemailer
// Settings come from Vercel → Project → Settings → Environment Variables:
//   SMTP_HOST       smtp.gmail.com
//   SMTP_PORT       587
//   SMTP_USER       testmaildigitalnock@gmail.com
//   SMTP_PASS       16-letter Google App Password (no spaces)
//   MAIL_TO         testmaildigitalnock@gmail.com,sales@ngriffin.in,support@ngriffin.in
//   MAIL_FROM_NAME  NGriffinPay Website          (optional)
//   SEND_AUTOREPLY  true                         (optional, "false" to switch off)

import nodemailer from "nodemailer";

const EMPLOYEE_LIMITS = ["1-10", "11-50", "51-200", "201+"];

// escape for HTML email
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
// single-line text field: strip tags + line breaks, trim, limit length
const line = (v, max = 200) =>
  String(v ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);

const makeRef = () => "NGP-" + Math.floor(100000 + Math.random() * 900000);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  // Vercel parses JSON bodies automatically; this also handles a raw string
  let b = req.body || {};
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      b = {};
    }
  }

  // Honeypot: real visitors never fill the hidden "hp_check" field
  // (named so browser autofill never recognises it)
  if (b.hp_check) {
    console.warn("Contact form: honeypot triggered, request ignored");
    return res.status(200).json({ ok: true, message: "Thank you", ref: makeRef() });
  }

  /* ---------- Read + validate (same rules as the React form) ---------- */
  const firstName = line(b.firstName, 60);
  const lastName = line(b.lastName, 60);
  const email = line(b.email, 120);
  const company = line(b.company, 120);
  const phone = String(b.phone ?? "").replace(/\D/g, "").slice(-10);
  const employees = line(b.employees, 10);
  const consent = b.consent === true || b.consent === "yes";
  const comments = String(b.comments ?? "").replace(/<[^>]*>/g, "").trim().slice(0, 3000);

  const errors = {};
  if (!firstName) errors.firstName = "Please enter your first name";
  if (!lastName) errors.lastName = "Please enter your last name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
  if (!company) errors.company = "Please enter your company name";
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = "Please enter a valid 10-digit mobile number";
  if (!EMPLOYEE_LIMITS.includes(employees)) errors.employees = "Please select your employee count";
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
    console.error("Contact form: SMTP_USER / SMTP_PASS / MAIL_TO env vars are missing");
    return res
      .status(500)
      .json({ ok: false, message: "Mail is not configured on the server yet." });
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s+/g, "") },
  });

  /* ---------- Build the email ---------- */
  const ref = makeRef();
  const fullName = `${firstName} ${lastName}`;
  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const rows = [
    ["Reference", ref],
    ["Name", fullName],
    ["Email", email],
    ["Phone", "+91 " + phone],
    ["Company", company],
    ["Employees", employees],
    ["Email updates", consent ? "Yes, opted in" : "No"],
    ["Submitted", when + " IST"],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;background:#f1f5fb;font-weight:600;width:140px">${esc(k)}</td><td style="padding:8px 12px">${esc(v)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">
  <h2 style="color:#1d6fd8;margin:0 0 12px">New enquiry from the website</h2>
  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0">${table}</table>
  <h3 style="margin:18px 0 6px">Comments</h3>
  <div style="padding:12px;border:1px solid #e2e8f0;border-radius:6px">${comments ? esc(comments).replace(/\n/g, "<br>") : "<em>No comments</em>"}</div>
  <p style="color:#64748b;font-size:12px;margin-top:16px">Reply to this email to answer ${esc(fullName)} directly.</p>
</div>`;
  const text =
    "New enquiry from the website\n\n" +
    rows.map(([k, v]) => `${(k + ":").padEnd(15)}${v}`).join("\n") +
    `\n\nComments:\n${comments || "-"}\n`;

  /* ---------- 1) Send to the team ---------- */
  try {
    await transporter.sendMail({
      from: { name: MAIL_FROM_NAME, address: SMTP_USER },
      to: recipients,
      replyTo: { name: fullName, address: email }, // "Reply" goes to the visitor
      subject: `New enquiry: ${company} (${employees} employees) · ${ref}`,
      html,
      text,
    });
  } catch (err) {
    console.error("Contact form mail failed:", err); // visible in Vercel → Logs
    return res
      .status(500)
      .json({ ok: false, message: "We could not send your message right now." });
  }

  /* ---------- 2) Auto-reply to the visitor (never blocks success) ---------- */
  if (SEND_AUTOREPLY !== "false") {
    try {
      await transporter.sendMail({
        from: { name: "NGriffinPay", address: SMTP_USER },
        to: { name: fullName, address: email },
        replyTo: recipients[0],
        subject: `We've received your message · ${ref}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">
<p>Hi ${esc(firstName)},</p>
<p>Thank you for contacting NGriffinPay. Our team has received your enquiry and will get back to you shortly.</p>
<p>Your reference number is <b>${esc(ref)}</b>.</p>
<p>Regards,<br>Team NGriffinPay</p></div>`,
        text: `Hi ${firstName},\n\nThank you for contacting NGriffinPay. Our team has received your enquiry and will get back to you shortly.\n\nReference: ${ref}\n\nRegards,\nTeam NGriffinPay`,
      });
    } catch (err) {
      console.error("Contact auto-reply failed:", err);
    }
  }

  return res.status(200).json({ ok: true, message: "Message sent", ref });
}
