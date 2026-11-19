<?php
/**
 * api/demo-popup.php — 20-second auto pop-up (DemoForm.jsx) on Hostinger.
 * Separate from api/demo.php (the "Book a Demo" button modal).
 * The page POSTs JSON to /api/demo-popup (the .htaccess maps it to this file).
 */
require __DIR__ . '/_mailer.php';

// must match EMPLOYEE_OPTIONS in DemoForm.jsx
$EMPLOYEE_OPTIONS = ['1 - 25', '26 - 50', '51 - 100', '101 - 250', '251 - 500', '500+'];

$b = ngp_read_request();

if (ngp_too_fast($b)) {
    ngp_log('Demo pop-up: submitted too fast, ignored');
    ngp_json(200, ['ok' => true, 'message' => 'Thank you', 'ref' => ngp_ref('NGP-P')]);
}

/* ---------- Read + validate (same rules as DemoForm.jsx) ---------- */
$name      = ngp_line($b['name'] ?? '', 100);
$email     = ngp_line($b['email'] ?? '', 120);
$phone     = ngp_digits($b['phone'] ?? '');
$company   = ngp_line($b['company'] ?? '', 120);
$employees = ngp_line($b['employees'] ?? '', 20);
$city      = ngp_line($b['city'] ?? '', 60);
$page      = ngp_line($b['page'] ?? '', 300);

$errors = [];
if ($name === '') $errors['name'] = 'Please enter your name';
if (!ngp_valid_email($email)) $errors['email'] = 'Enter a valid email';
if (!preg_match('/^[6-9]\d{9}$/', $phone)) $errors['phone'] = 'Enter a valid 10-digit mobile number';
if ($company === '') $errors['company'] = 'Please enter your company name';
if (!in_array($employees, $EMPLOYEE_OPTIONS, true)) $errors['employees'] = 'Select employee count';
if ($errors) {
    ngp_json(422, ['ok' => false, 'message' => 'Please check the highlighted fields.', 'errors' => $errors]);
}

if (ngp_rate_limited()) {
    ngp_json(429, ['ok' => false, 'message' => 'Too many requests. Please try again in a few minutes.']);
}

$cfg = ngp_config();

/* ---------- Build the email ---------- */
$ref = ngp_ref('NGP-P');
$rows = [
    ['Reference', $ref],
    ['Name', $name],
    ['Work email', $email],
    ['Mobile', '+91 ' . $phone],
    ['Company', $company],
    ['Employees', $employees],
    ['City', $city !== '' ? $city : 'Not given'],
    ['Page', $page !== '' ? $page : '-'],
    ['Submitted', ngp_when()],
];
$html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">'
    . '<h2 style="color:#d97706;margin:0 0 4px">⚡ 30-min demo request</h2>'
    . '<p style="color:#64748b;margin:0 0 12px">From the 20-second pop-up on the website · promised a call within 24 hours</p>'
    . ngp_table($rows, '#fff7e6')
    . '<p style="color:#64748b;font-size:12px;margin-top:16px">Call +91 ' . ngp_esc($phone) . ' or reply to this email to reach ' . ngp_esc($name) . ' directly.</p>'
    . '</div>';
$text = "30-min demo request (20-second pop-up)\n\n" . ngp_text_rows($rows, 12) . "\n";

$first = explode(' ', $name)[0];
$team = [
    'reply_to' => [$email, $name],
    'subject'  => "⚡ Pop-up demo request: {$company} ({$employees} employees) · {$name} · {$ref}",
    'html'     => $html,
    'text'     => $text,
];
$reply = [
    'to'        => [[$email, $name]],
    'from_name' => 'NGriffinPay',
    'reply_to'  => [$cfg['mail_to'][0], ''],
    'subject'   => "Your 30-minute NGriffinPay demo · {$ref}",
    'html'      => '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">'
        . '<p>Hi ' . ngp_esc($first) . ',</p>'
        . '<p>Thanks for booking a 30-minute demo of NGriffinPay for <b>' . ngp_esc($company) . '</b>. Our HRMS expert will call you on <b>+91 ' . ngp_esc($phone) . '</b> within 24 hours to schedule it.</p>'
        . '<p>Your reference number is <b>' . ngp_esc($ref) . '</b>.</p>'
        . '<p>Regards,<br>Team NGriffinPay</p></div>',
    'text'      => "Hi {$first},\n\nThanks for booking a 30-minute demo of NGriffinPay for {$company}. Our HRMS expert will call you on +91 {$phone} within 24 hours to schedule it.\n\nReference: {$ref}\n\nRegards,\nTeam NGriffinPay",
];

if (!ngp_send($cfg, $team, $reply, "Demo pop-up {$ref}")) {
    ngp_json(500, ['ok' => false, 'message' => 'We could not send your request right now.']);
}
ngp_json(200, ['ok' => true, 'message' => 'Demo request sent', 'ref' => $ref]);
