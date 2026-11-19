<?php
/**
 * api/enquiry.php — Pricing page "Package Enquiry" modal (Pricing.jsx) on Hostinger.
 * The page POSTs JSON to /api/enquiry (the .htaccess maps it to this file).
 */
require __DIR__ . '/_mailer.php';

// must match PLANS in Pricing.jsx
$PACKAGES = [
    'Starter Plan'      => '₹2,999 / month + GST · Upto 50 Employees',
    'Professional Plan' => '₹3,999 / month + GST · Upto 50 Employees',
    'Premium Plan'      => '₹6,999 / month + GST · Upto 50 Employees',
];

$b = ngp_read_request();

if (ngp_too_fast($b)) {
    ngp_log('Package enquiry: submitted too fast, ignored');
    ngp_json(200, ['ok' => true, 'message' => 'Thank you', 'ref' => ngp_ref('NGP-E')]);
}

/* ---------- Read + validate (same rules as the Pricing modal) ---------- */
$pkg   = ngp_line($b['package'] ?? '', 60);
$name  = ngp_line($b['name'] ?? '', 100);
$email = ngp_line($b['email'] ?? '', 120);
$phone = ngp_digits($b['phone'] ?? '');
$page  = ngp_line($b['page'] ?? '', 300);

$errors = [];
if (!isset($PACKAGES[$pkg])) $errors['package'] = 'Please choose a package';
if (mb_strlen($name) < 2) $errors['name'] = 'Please enter your name';
if (!ngp_valid_email($email)) $errors['email'] = 'Please enter a valid email';
if (!preg_match('/^[6-9]\d{9}$/', $phone)) $errors['phone'] = 'Please enter a valid 10-digit mobile number';
if ($errors) {
    ngp_json(422, ['ok' => false, 'message' => 'Please check the highlighted fields.', 'errors' => $errors]);
}

if (ngp_rate_limited()) {
    ngp_json(429, ['ok' => false, 'message' => 'Too many requests. Please try again in a few minutes.']);
}

$cfg = ngp_config();

/* ---------- Build the email ---------- */
$ref = ngp_ref('NGP-E');
$price = $PACKAGES[$pkg];
$rows = [
    ['Reference', $ref],
    ['Package', $pkg],
    ['Price', $price],
    ['Name', $name],
    ['Email', $email],
    ['Mobile', '+91 ' . $phone],
    ['Page', $page !== '' ? $page : '-'],
    ['Submitted', ngp_when()],
];
$html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">'
    . '<h2 style="color:#059669;margin:0 0 4px">💰 New package enquiry</h2>'
    . '<p style="color:#64748b;margin:0 0 12px">From the Pricing page — the visitor clicked "Purchase" on <b>' . ngp_esc($pkg) . '</b></p>'
    . ngp_table($rows, '#ecfdf5')
    . '<p style="color:#64748b;font-size:12px;margin-top:16px">Call +91 ' . ngp_esc($phone) . ' or reply to this email to reach ' . ngp_esc($name) . ' directly.</p>'
    . '</div>';
$text = "New package enquiry (Pricing page)\n\n" . ngp_text_rows($rows, 12) . "\n";

$first = explode(' ', $name)[0];
$team = [
    'reply_to' => [$email, $name],
    'subject'  => "💰 Package enquiry: {$pkg} · {$name} · {$ref}",
    'html'     => $html,
    'text'     => $text,
];
$reply = [
    'to'        => [[$email, $name]],
    'from_name' => 'NGriffinPay',
    'reply_to'  => [$cfg['mail_to'][0], ''],
    'subject'   => "Your NGriffinPay {$pkg} enquiry · {$ref}",
    'html'      => '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">'
        . '<p>Hi ' . ngp_esc($first) . ',</p>'
        . '<p>Thank you for your interest in the NGriffinPay <b>' . ngp_esc($pkg) . '</b> (' . ngp_esc($price) . '). Our team will call you shortly on <b>+91 ' . ngp_esc($phone) . '</b>.</p>'
        . '<p>Your reference number is <b>' . ngp_esc($ref) . '</b>.</p>'
        . '<p>Regards,<br>Team NGriffinPay</p></div>',
    'text'      => "Hi {$first},\n\nThank you for your interest in the NGriffinPay {$pkg} ({$price}). Our team will call you shortly on +91 {$phone}.\n\nReference: {$ref}\n\nRegards,\nTeam NGriffinPay",
];

if (!ngp_send($cfg, $team, $reply, "Package enquiry {$ref}")) {
    ngp_json(500, ['ok' => false, 'message' => 'We could not send your enquiry right now.']);
}
ngp_json(200, ['ok' => true, 'message' => 'Enquiry sent', 'ref' => $ref]);
