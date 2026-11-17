// api/mail-test.js — TEMPORARY diagnostics for the contact form mail.
// Open:  https://ngriffinpay1-woad.vercel.app/api/mail-test?key=ngp-test
// Then:  https://ngriffinpay1-woad.vercel.app/api/mail-test?key=ngp-test&send=1  (sends a test mail)
// DELETE THIS FILE once mail is working.

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.query.key !== "ngp-test") {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }

  const { SMTP_HOST = "smtp.gmail.com", SMTP_PORT = "587", SMTP_USER, SMTP_PASS, MAIL_TO = "" } =
    process.env;
  const pass = (SMTP_PASS || "").replace(/\s+/g, "");
  const recipients = MAIL_TO.split(",").map((s) => s.trim()).filter(Boolean);

  const report = {
    "1_function_running": "yes — api/ folder is deployed",
    "2_env_vars": {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER: SMTP_USER || "MISSING",
      SMTP_PASS: pass ? `set (${pass.length} chars — should be 16)` : "MISSING",
      MAIL_TO: recipients.length ? recipients : "MISSING",
    },
  };

  if (!SMTP_USER || !pass || !recipients.length) {
    report.result =
      "FAIL — environment variables missing. Add them in Vercel → Settings → Environment Variables (tick Production), then REDEPLOY.";
    return res.status(200).json(report);
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass },
  });

  try {
    await transporter.verify();
    report["3_gmail_login"] = "OK";
  } catch (err) {
    report["3_gmail_login"] = "FAILED";
    report.error = `${err.code || ""} ${err.responseCode || ""} ${err.message}`.trim();
    report.result = /535|Username and Password|BadCredentials|EAUTH/i.test(report.error)
      ? "FAIL — Gmail rejected the login. Create a NEW App Password (2-Step Verification must be ON), paste it into SMTP_PASS, redeploy."
      : "FAIL — could not connect to the mail server. Check SMTP_HOST / SMTP_PORT.";
    return res.status(200).json(report);
  }

  if (req.query.send === "1") {
    try {
      const info = await transporter.sendMail({
        from: { name: "NGriffinPay Website", address: SMTP_USER },
        to: recipients,
        subject: "NGriffinPay website — test email",
        text: "If you can read this, the contact form mail setup works.",
      });
      report["4_test_mail"] = { accepted: info.accepted, rejected: info.rejected };
      report.result = "SENT — check inboxes (and Spam). Delete api/mail-test.js afterwards.";
    } catch (err) {
      report["4_test_mail"] = "FAILED";
      report.error = err.message;
      report.result = "FAIL — login worked but sending failed (see error).";
    }
  } else {
    report.result = "Login OK. Add &send=1 to the URL to send a test email.";
  }

  return res.status(200).json(report);
}
