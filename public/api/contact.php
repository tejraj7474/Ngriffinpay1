<?php
// contact.php — receives the Contact Us form and emails it to sales@ & support@
// Needs: PHP 7.4+ and PHPMailer in ./PHPMailer/src (see the setup steps).
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/mail-config.php';
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

function respond(int $code, bool $ok, string $message, array $extra = []): void
{
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message] + $extra);
    exit;
}

/* ---------- CORS (only used when site and API are on different origins) ---------- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false, 'Method not allowed');
}

/* ---------- Spam protection ---------- */
// 1) Honeypot: real visitors never see/fill the "website" field
if (!empty($_POST['website'])) {
    respond(200, true, 'Thank you', ['ref' => 'NGP-' . random_int(100000, 999999)]);
}
// 2) One submission per IP every RATE_LIMIT_SECONDS
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile  = sys_get_temp_dir() . '/ngp_contact_' . md5($ip);
$last    = is_file($rlFile) ? (int) file_get_contents($rlFile) : 0;
if (time() - $last < RATE_LIMIT_SECONDS) {
    respond(429, false, 'Please wait a few seconds before sending again.');
}

/* ---------- Read + clean the fields ---------- */
function field(string $key, int $max = 200): string
{
    $v = trim((string) ($_POST[$key] ?? ''));
    $v = strip_tags($v);
    $v = preg_replace('/[\r\n]+/', ' ', $v) ?? '';   // single-line fields only
    return mb_substr($v, 0, $max);
}

$firstName = field('firstName', 60);
$lastName  = field('lastName', 60);
$email     = field('email', 120);
$company   = field('company', 120);
$phoneRaw  = field('phone', 20);
$employees = field('employees', 10);
$consent   = ($_POST['consent'] ?? '') === 'yes';
$comments  = mb_substr(trim(strip_tags((string) ($_POST['comments'] ?? ''))), 0, 3000);

$phone = substr(preg_replace('/\D/', '', $phoneRaw) ?? '', -10);
$allowedEmployees = ['1-10', '11-50', '51-200', '201+'];

/* ---------- Validate (same rules as the React form) ---------- */
$errors = [];
if ($firstName === '')                                   $errors['firstName'] = 'Please enter your first name';
if ($lastName === '')                                    $errors['lastName']  = 'Please enter your last name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          $errors['email']     = 'Please enter a valid email';
if ($company === '')                                     $errors['company']   = 'Please enter your company name';
if (!preg_match('/^[6-9]\d{9}$/', $phone))               $errors['phone']     = 'Please enter a valid 10-digit mobile number';
if (!in_array($employees, $allowedEmployees, true))      $errors['employees'] = 'Please select your employee count';

if ($errors) {
    respond(422, false, 'Please check the highlighted fields.', ['errors' => $errors]);
}

/* ---------- Build the email ---------- */
$ref      = 'NGP-' . random_int(100000, 999999);
$fullName = $firstName . ' ' . $lastName;
$h        = fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$when     = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('d M Y, h:i A');

$rows = [
    'Reference'     => $ref,
    'Name'          => $fullName,
    'Email'         => $email,
    'Phone'         => '+91 ' . $phone,
    'Company'       => $company,
    'Employees'     => $employees,
    'Email updates' => $consent ? 'Yes, opted in' : 'No',
    'Submitted'     => $when . ' IST',
];

$tableHtml = '';
foreach ($rows as $k => $v) {
    $tableHtml .= '<tr><td style="padding:8px 12px;background:#f1f5fb;font-weight:600;width:140px">'
        . $h($k) . '</td><td style="padding:8px 12px">' . $h($v) . '</td></tr>';
}
$commentsHtml = $comments !== '' ? nl2br($h($comments)) : '<em>No comments</em>';

$bodyHtml = <<<HTML
<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:620px">
  <h2 style="color:#1d6fd8;margin:0 0 12px">New enquiry from the website</h2>
  <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0">
    {$tableHtml}
  </table>
  <h3 style="margin:18px 0 6px">Comments</h3>
  <div style="padding:12px;border:1px solid #e2e8f0;border-radius:6px">{$commentsHtml}</div>
  <p style="color:#64748b;font-size:12px;margin-top:16px">Reply to this email to answer {$h($fullName)} directly.</p>
</div>
HTML;

$bodyText = "New enquiry from the website\n\n";
foreach ($rows as $k => $v) {
    $bodyText .= str_pad($k . ':', 15) . $v . "\n";
}
$bodyText .= "\nComments:\n" . ($comments !== '' ? $comments : '-') . "\n";

/* ---------- Helper: a configured PHPMailer ---------- */
function makeMailer(): PHPMailer
{
    $m = new PHPMailer(true);
    $m->isSMTP();
    $m->Host       = SMTP_HOST;
    $m->SMTPAuth   = true;
    $m->Username   = SMTP_USER;
    $m->Password   = SMTP_PASS;
    $m->SMTPSecure = SMTP_SECURE === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $m->Port       = SMTP_PORT;
    $m->CharSet    = 'UTF-8';
    $m->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    return $m;
}

/* ---------- 1) Send to sales@ + support@ ---------- */
try {
    $mail = makeMailer();
    foreach (MAIL_TO as $to) {
        $mail->addAddress($to);
    }
    $mail->addReplyTo($email, $fullName);   // "Reply" goes straight to the visitor
    $mail->isHTML(true);
    $mail->Subject = "New enquiry: {$company} ({$employees} employees) · {$ref}";
    $mail->Body    = $bodyHtml;
    $mail->AltBody = $bodyText;
    $mail->send();
} catch (Exception $e) {
    error_log('Contact form mail failed: ' . ($mail->ErrorInfo ?? $e->getMessage()));
    respond(500, false, 'We could not send your message right now. Please try again.');
}

file_put_contents($rlFile, (string) time());

/* ---------- 2) Optional auto-reply to the visitor (never blocks success) ---------- */
if (SEND_AUTOREPLY) {
    try {
        $reply = makeMailer();
        $reply->addAddress($email, $fullName);
        $reply->addReplyTo(MAIL_TO[0], 'NGriffinPay Sales');
        $reply->isHTML(true);
        $reply->Subject = "We've received your message · {$ref}";
        $reply->Body = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">'
            . '<p>Hi ' . $h($firstName) . ',</p>'
            . '<p>Thank you for contacting NGriffinPay. Our team has received your enquiry and will get back to you shortly.</p>'
            . '<p>Your reference number is <b>' . $h($ref) . '</b>.</p>'
            . '<p>Regards,<br>Team NGriffinPay</p></div>';
        $reply->AltBody = "Hi {$firstName},\n\nThank you for contacting NGriffinPay. Our team has received your enquiry and will get back to you shortly.\n\nReference: {$ref}\n\nRegards,\nTeam NGriffinPay";
        $reply->send();
    } catch (Exception $e) {
        error_log('Contact auto-reply failed: ' . $e->getMessage());
    }
}

respond(200, true, 'Message sent', ['ref' => $ref]);
