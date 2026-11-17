<?php
// mail-test.php — TEMPORARY. Shows the full SMTP conversation so you can see why mail fails.
// Open:  https://your-site/api/mail-test.php?key=ngp-test
// DELETE THIS FILE from the server once mail is working.
declare(strict_types=1);

if (($_GET['key'] ?? '') !== 'ngp-test') {
    http_response_code(403);
    exit('Forbidden');
}

header('Content-Type: text/plain; charset=utf-8');

echo "1) PHP version: " . PHP_VERSION . (version_compare(PHP_VERSION, '7.4', '>=') ? "  OK\n" : "  TOO OLD (need 7.4+)\n");
echo "2) OpenSSL loaded: " . (extension_loaded('openssl') ? "yes  OK\n" : "NO — ask hosting to enable openssl\n");

$files = ['mail-config.php', 'PHPMailer/src/PHPMailer.php', 'PHPMailer/src/SMTP.php', 'PHPMailer/src/Exception.php'];
foreach ($files as $f) {
    echo "3) " . str_pad($f, 32) . (is_file(__DIR__ . '/' . $f) ? "found  OK\n" : "MISSING — upload it\n");
}
foreach ($files as $f) {
    if (!is_file(__DIR__ . '/' . $f)) exit("\nFix the missing files first.\n");
}

require __DIR__ . '/mail-config.php';
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

echo "4) Using " . SMTP_HOST . ":" . SMTP_PORT . " (" . SMTP_SECURE . ") as " . SMTP_USER . "\n";
echo "5) Sending a test email to: " . implode(', ', MAIL_TO) . "\n\n--- SMTP log ---\n";

$m = new PHPMailer(true);
try {
    $m->SMTPDebug   = 2;               // print the conversation with the mail server
    $m->Debugoutput = 'echo';
    $m->isSMTP();
    $m->Host       = SMTP_HOST;
    $m->SMTPAuth   = true;
    $m->Username   = SMTP_USER;
    $m->Password   = SMTP_PASS;
    $m->SMTPSecure = SMTP_SECURE === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $m->Port       = SMTP_PORT;
    $m->CharSet    = 'UTF-8';
    $m->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    foreach (MAIL_TO as $to) $m->addAddress($to);
    $m->Subject = 'NGriffinPay website — test email';
    $m->Body    = 'If you can read this, the contact form mail setup works.';
    $m->send();
    echo "\n--- RESULT: SENT OK. Check the inboxes (and Spam). Now DELETE mail-test.php ---\n";
} catch (Exception $e) {
    echo "\n--- RESULT: FAILED ---\n" . $m->ErrorInfo . "\n";
}
