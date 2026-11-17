<?php
// mail-config.php — the ONLY file you need to edit.
// Fill in the real mailbox password, then upload. Never commit the password to Git.

// ---- SMTP login (the mailbox the website sends FROM) -------------------
// Gmail account   : smtp.gmail.com     · 587 · tls  (needs a Google App Password)
// Hostinger email : smtp.hostinger.com · 465 · ssl
// Zoho Mail       : smtp.zoho.in       · 465 · ssl
// The host MUST belong to the same provider as SMTP_USER.
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const SMTP_SECURE = 'tls';                              // 'tls' for 587, 'ssl' for 465
const SMTP_USER = 'testmaildigitalnock@gmail.com';    // full Gmail address
const SMTP_PASS = 'syly vwnv smlx wqnq'; // no spaces, e.g. abcdefghijklmnop

// ---- Who sends / who receives -------------------------------------------
const MAIL_FROM = 'testmaildigitalnock@gmail.com'; // must be the same as SMTP_USER for Gmail
const MAIL_FROM_NAME = 'NGriffinPay Website';
const MAIL_TO = ['testmaildigitalnock@gmail.com', 'sales@ngriffin.in', 'support@ngriffin.in'];

// Send a short "we got your message" email back to the visitor
const SEND_AUTOREPLY = true;

// Seconds a visitor must wait between two submissions (basic spam protection)
const RATE_LIMIT_SECONDS = 30;

// Only needed if the React site and this PHP run on different domains/ports
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://ngriffin.in',
    'https://www.ngriffin.in',
];