<?php
/**
 * api/demo.php — "Book a Demo" button modal (DemoModal.jsx) on Hostinger.
 * The 20-second auto pop-up (DemoForm.jsx) has its own file: api/demo-popup.php
 * The page POSTs JSON to /api/demo (the .htaccess maps it to this file).
 */
require __DIR__ . '/_mailer.php';

$b = ngp_read_request();

if (ngp_too_fast($b)) {
    ngp_log('Demo: submitted too fast, ignored');
    ngp_json(200, ['ok' => true, 'message' => 'Thank you', 'ref' => ngp_ref('NGP-D')]);
}

/* ---------- Read + validate (same rules as the modal) ---------- */
$name     = ngp_line($b['name'] ?? '', 100);
$phoneRaw = ngp_line($b['phone'] ?? '', 20);
$phone    = ngp_digits($phoneRaw);
$company  = ngp_line($b['company'] ?? '', 120);
$email    = ngp_line($b['email'] ?? '', 120);
$consent  = ($b['consent'] ?? null) === true || ($b['consent'] ?? null) === 'yes';
$page     = ngp_line($b['page'] ?? '', 300);

$errors = [];
if (mb_strlen($name) < 2) $errors['name'] = 'Please enter your name';
if ($phoneRaw !== '' && !preg_match('/^[6-9]\d{9}$/', $phone)) {
    $errors['phone'] = 'Please enter a valid 10-digit mobile number'; // phone is optional
}
if ($company === '') $errors['company'] = 'Please enter your company name';
if (!ngp_valid_email($email)) $errors['email'] = 'Please enter a valid email address';
if ($errors) {
    ngp_json(422, ['ok' => false, 'message' => 'Please check the highlighted fields.', 'errors' => $errors]);
}

if (ngp_rate_limited()) {
    ngp_json(429, ['ok' => false, 'message' => 'Too many requests. Please try again in a few minutes.']);
}

$cfg = ngp_config();

/* ---------- Build the email ---------- */
$ref = ngp_ref('NGP-D');
$rows = [
    ['Reference', $ref],
    ['Name', $name],
    ['Company', $company],
    ['Business email', $email],
    ['Phone', $phone !== '' ? '+91 ' . $phone : 'Not given'],
    ['Email updates', $consent ? 'Yes, opted in' : 'No'],
    ['Booked from', $page !== '' ? $page : '-'],
    ['Submitted', ngp_when()],
];
$html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">'
    . '<h2 style="color:#1d6fd8;margin:0 0 12px">New demo request 📅</h2>'
    . ngp_table($rows)
    . '<p style="color:#64748b;font-size:12px;margin-top:16px">Reply to this email to reach ' . ngp_esc($name) . ' directly'
    . ($phone !== '' ? ', or call +91 ' . ngp_esc($phone) : '') . '.</p></div>';
$text = "New demo request\n\n" . ngp_text_rows($rows, 16) . "\n";

$first = explode(' ', $name)[0];
$team = [
    'reply_to' => [$email, $name],
    'subject'  => "Demo request: {$company} · {$name} · {$ref}",
    'html'     => $html,
    'text'     => $text,
];
$reply = [
    'to'        => [[$email, $name]],
    'from_name' => 'NGriffinPay',
    'reply_to'  => [$cfg['mail_to'][0], ''],
    'subject'   => "Your NGriffinPay demo request · {$ref}",
    'html'      => '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">'
        . '<p>Hi ' . ngp_esc($first) . ',</p>'
        . '<p>Thank you for booking a demo of NGriffinPay for <b>' . ngp_esc($company) . '</b>. Our team will get in touch shortly to pick a time that suits you.</p>'
        . '<p>Your reference number is <b>' . ngp_esc($ref) . '</b>.</p>'
        . '<p>Regards,<br>Team NGriffinPay</p></div>',
    'text'      => "Hi {$first},\n\nThank you for booking a demo of NGriffinPay for {$company}. Our team will get in touch shortly to pick a time that suits you.\n\nReference: {$ref}\n\nRegards,\nTeam NGriffinPay",
];

if (!ngp_send($cfg, $team, $reply, "Demo {$ref}")) {
    ngp_json(500, ['ok' => false, 'message' => 'We could not send your request right now.']);
}
ngp_json(200, ['ok' => true, 'message' => 'Demo request sent', 'ref' => $ref]);
