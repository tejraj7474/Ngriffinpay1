// api/demo.js — Vercel serverless function for the "Book a Demo" pop-up.
// Emails the demo request to the addresses in MAIL_TO.
//
// Put this file next to api/contact.js (PROJECT ROOT → api/demo.js).
// Uses the SAME Vercel environment variables as the contact form:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO,
//   MAIL_FROM_NAME (optional), SEND_AUTOREPLY (optional, "false" to switch off)

import nodemailer from "nodemailer";

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
const makeRef = () => "NGP-D" + Math.floor(100000 + Math.random() * 900000);

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

  // Honeypot: real visitors never fill the hidden "website" field
  if (b.website) {
    return res.status(200).json({ ok: true, message: "Thank you", ref: makeRef() });
  }

  /* ---------- Read + validate (same rules as the pop-up) ---------- */
  const name = line(b.name, 100);
  const phoneRaw = line(b.phone, 20);
  const phone = phoneRaw.replace(/\D/g, "").slice(-10);
  const company = line(b.company, 120);
  const email = line(b.email, 120);
  const consent = b.consent === true || b.consent === "yes";
  const page = line(b.page, 300);

  const errors = {};
  if (name.length < 2) errors.name = "Please enter your name";
  if (phoneRaw && !/^[6-9]\d{9}$/.test(phone))
    errors.phone = "Please enter a valid 10-digit mobile number"; // phone is optional
  if (!company) errors.company = "Please enter your company name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address";
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
    console.error("Demo form: SMTP_USER / SMTP_PASS / MAIL_TO env vars are missing");
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
    ["Name", name],
    ["Company", company],
    ["Business email", email],
    ["Phone", phone ? "+91 " + phone : "Not given"],
    ["Email updates", consent ? "Yes, opted in" : "No"],
    ["Booked from", page || "-"],
    ["Submitted", when + " IST"],
  ];
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;background:#f1f5fb;font-weight:600;width:140px">${esc(k)}</td><td style="padding:8px 12px">${esc(v)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">
  <h2 style="color:#1d6fd8;margin:0 0 12px">New demo request 📅</h2>
  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0">${table}</table>
  <p style="color:#64748b;font-size:12px;margin-top:16px">Reply to this email to reach ${esc(name)} directly${phone ? ", or call +91 " + esc(phone) : ""}.</p>
</div>`;
  const text =
    "New demo request\n\n" + rows.map(([k, v]) => `${(k + ":").padEnd(16)}${v}`).join("\n") + "\n";

  /* ---------- 1) Send to the team ---------- */
  try {
    await transporter.sendMail({
      from: { name: MAIL_FROM_NAME, address: SMTP_USER },
      to: recipients,
      replyTo: { name, address: email },
      subject: `Demo request: ${company} · ${name} · ${ref}`,
      html,
      text,
    });
  } catch (err) {
    console.error("Demo form mail failed:", err); // visible in Vercel → Logs
    return res
      .status(500)
      .json({ ok: false, message: "We could not send your request right now." });
  }

  /* ---------- 2) Auto-reply to the visitor (never blocks success) ---------- */
  if (SEND_AUTOREPLY !== "false") {
    const first = name.split(" ")[0];
    try {
      await transporter.sendMail({
        from: { name: "NGriffinPay", address: SMTP_USER },
        to: { name, address: email },
        replyTo: recipients[0],
        subject: `Your NGriffinPay demo request · ${ref}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">
<p>Hi ${esc(first)},</p>
<p>Thank you for booking a demo of NGriffinPay for <b>${esc(company)}</b>. Our team will get in touch shortly to pick a time that suits you.</p>
<p>Your reference number is <b>${esc(ref)}</b>.</p>
<p>Regards,<br>Team NGriffinPay</p></div>`,
        text: `Hi ${first},\n\nThank you for booking a demo of NGriffinPay for ${company}. Our team will get in touch shortly to pick a time that suits you.\n\nReference: ${ref}\n\nRegards,\nTeam NGriffinPay`,
      });
    } catch (err) {
      console.error("Demo auto-reply failed:", err);
    }
  }

  return res.status(200).json({ ok: true, message: "Demo request sent", ref });
}
