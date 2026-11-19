<?php
/**
 * api/contact.php — Contact Us form (ContactUs.jsx) on Hostinger.
 * The page POSTs JSON to /api/contact (the .htaccess maps it to this file).
 * Emails the enquiry to mail_to and sends an auto-reply to the visitor.
 */
require __DIR__ . '/_mailer.php';

$EMPLOYEE_LIMITS = ['1-10', '11-50', '51-200', '201+'];

$b = ngp_read_request();

if (ngp_too_fast($b)) {
    ngp_log('Contact: submitted too fast, ignored');
    ngp_json(200, ['ok' => true, 'message' => 'Thank you', 'ref' => ngp_ref('NGP-')]);
}

/* ---------- Read + validate (same rules as the React form) ---------- */
$firstName = ngp_line($b['firstName'] ?? '', 60);
$lastName  = ngp_line($b['lastName'] ?? '', 60);
$email     = ngp_line($b['email'] ?? '', 120);
$company   = ngp_line($b['company'] ?? '', 120);
$phone     = ngp_digits($b['phone'] ?? '');
$employees = ngp_line($b['employees'] ?? '', 10);
$consent   = ($b['consent'] ?? null) === true || ($b['consent'] ?? null) === 'yes';
$comments  = ngp_text($b['comments'] ?? '', 3000);

$errors = [];
if ($firstName === '') $errors['firstName'] = 'Please enter your first name';
if ($lastName === '') $errors['lastName'] = 'Please enter your last name';
if (!ngp_valid_email($email)) $errors['email'] = 'Please enter a valid email';
if ($company === '') $errors['company'] = 'Please enter your company name';
if (!preg_match('/^[6-9]\d{9}$/', $phone)) $errors['phone'] = 'Please enter a valid 10-digit mobile number';
if (!in_array($employees, $EMPLOYEE_LIMITS, true)) $errors['employees'] = 'Please select your employee count';
if ($errors) {
    ngp_json(422, ['ok' => false, 'message' => 'Please check the highlighted fields.', 'errors' => $errors]);
}

if (ngp_rate_limited()) {
    ngp_json(429, ['ok' => false, 'message' => 'Too many requests. Please try again in a few minutes.']);
}

$cfg = ngp_config();

/* ---------- Build the email ---------- */
$ref = ngp_ref('NGP-');
$fullName = "{$firstName} {$lastName}";
$rows = [
    ['Reference', $ref],
    ['Name', $fullName],
    ['Email', $email],
    ['Phone', '+91 ' . $phone],
    ['Company', $company],
    ['Employees', $employees],
    ['Email updates', $consent ? 'Yes, opted in' : 'No'],
    ['Submitted', ngp_when()],
];
$html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">'
    . '<h2 style="color:#1d6fd8;margin:0 0 12px">New enquiry from the website</h2>'
    . ngp_table($rows)
    . '<h3 style="margin:18px 0 6px">Comments</h3>'
    . '<div style="padding:12px;border:1px solid #e2e8f0;border-radius:6px">'
    . ($comments !== '' ? nl2br(ngp_esc($comments)) : '<em>No comments</em>') . '</div>'
    . '<p style="color:#64748b;font-size:12px;margin-top:16px">Reply to this email to answer ' . ngp_esc($fullName) . ' directly.</p>'
    . '</div>';
$text = "New enquiry from the website\n\n" . ngp_text_rows($rows, 15) . "\n\nComments:\n" . ($comments !== '' ? $comments : '-') . "\n";

$team = [
    'reply_to' => [$email, $fullName],
    'subject'  => "New enquiry: {$company} ({$employees} employees) · {$ref}",
    'html'     => $html,
    'text'     => $text,
];

$reply = [
    'to'        => [[$email, $fullName]],
    'from_name' => 'NGriffinPay',
    'reply_to'  => [$cfg['mail_to'][0], ''],
    'subject'   => "We've received your message · {$ref}",
    'html'      => '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">'
        . '<p>Hi ' . ngp_esc($firstName) . ',</p>'
        . '<p>Thank you for contacting NGriffinPay. Our team has received your enquiry and will get back to you shortly.</p>'
        . '<p>Your reference number is <b>' . ngp_esc($ref) . '</b>.</p>'
        . '<p>Regards,<br>Team NGriffinPay</p></div>',
    'text'      => "Hi {$firstName},\n\nThank you for contacting NGriffinPay. Our team has received your enquiry and will get back to you shortly.\n\nReference: {$ref}\n\nRegards,\nTeam NGriffinPay",
];

if (!ngp_send($cfg, $team, $reply, "Contact {$ref}")) {
    ngp_json(500, ['ok' => false, 'message' => 'We could not send your message right now.']);
}
ngp_json(200, ['ok' => true, 'message' => 'Message sent', 'ref' => $ref]);
