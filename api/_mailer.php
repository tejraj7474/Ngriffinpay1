<?php
/**
 * api/_mailer.php — shared helpers for the NGriffinPay website forms on Hostinger.
 *
 * Used by: api/contact.php, api/demo.php, api/demo-popup.php, api/enquiry.php
 * This file contains NO passwords. The SMTP settings are read from
 * ngp-mail-config.php, which you create OUTSIDE public_html (see the guide):
 *
 *   /home/uXXXXXXX/domains/your-domain/ngp-mail-config.php   <- settings + password
 *   /home/uXXXXXXX/domains/your-domain/public_html/          <- website (this folder)
 *
 * Has its own small SMTP client (SSL on 465 or STARTTLS on 587), so nothing
 * needs to be installed on the server — no Composer, no PHPMailer.
 */

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function ngp_json(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** escape for HTML email */
function ngp_esc($s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** single-line text field: strip tags + line breaks, trim, limit length */
function ngp_line($v, int $max = 200): string
{
    $s = is_scalar($v) ? (string) $v : '';
    $s = strip_tags($s);
    $s = preg_replace('/[\r\n]+/', ' ', $s);
    return mb_substr(trim($s), 0, $max, 'UTF-8');
}

/** multi-line text (comments) */
function ngp_text($v, int $max = 3000): string
{
    $s = is_scalar($v) ? (string) $v : '';
    return mb_substr(trim(strip_tags($s)), 0, $max, 'UTF-8');
}

function ngp_digits($v): string
{
    $d = preg_replace('/\D/', '', is_scalar($v) ? (string) $v : '');
    return substr($d, -10);
}

function ngp_valid_email(string $e): bool
{
    return (bool) preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $e) && filter_var($e, FILTER_VALIDATE_EMAIL) !== false;
}

function ngp_when(): string
{
    $d = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
    return $d->format('j M Y, g:i A') . ' IST';
}

function ngp_ref(string $prefix): string
{
    return $prefix . random_int(100000, 999999);
}

/** HTML table rows for the team email */
function ngp_table(array $rows, string $labelBg = '#f1f5fb'): string
{
    $out = '';
    foreach ($rows as [$k, $v]) {
        $out .= '<tr><td style="padding:8px 12px;background:' . $labelBg . ';font-weight:600;width:140px">'
            . ngp_esc($k) . '</td><td style="padding:8px 12px">' . ngp_esc($v) . '</td></tr>';
    }
    return '<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0">'
        . $out . '</table>';
}

function ngp_text_rows(array $rows, int $pad = 16): string
{
    $out = [];
    foreach ($rows as [$k, $v]) {
        $out[] = str_pad($k . ':', $pad) . $v;
    }
    return implode("\n", $out);
}

/** Write a line to ngp-mail.log (next to ngp-mail-config.php, outside public_html) */
function ngp_log(string $msg): void
{
    $line = '[' . ngp_when() . '] ' . $msg;
    error_log($line);
    if (!empty($GLOBALS['NGP_LOG_FILE'])) {
        @file_put_contents($GLOBALS['NGP_LOG_FILE'], $line . "\n", FILE_APPEND | LOCK_EX);
    }
}

/* ------------------------------------------------------------------ */
/* Request handling                                                    */
/* ------------------------------------------------------------------ */

/** Allow POST only and return the JSON body as an array */
function ngp_read_request(): array
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($method !== 'POST') {
        ngp_json(405, ['ok' => false, 'message' => 'Method not allowed']);
    }
    $raw = file_get_contents('php://input');
    if (strlen((string) $raw) > 20000) {
        ngp_json(413, ['ok' => false, 'message' => 'Request too large']);
    }
    $b = json_decode((string) $raw, true);
    if (!is_array($b)) {
        $b = $_POST ?: [];
    }
    return $b;
}

/**
 * Spam check: the page sends how long the visitor spent on the form (t, in ms).
 * Bots submit instantly; no human fills the form in under 1 second.
 * Returns true when the request should be silently ignored.
 */
function ngp_too_fast(array $b): bool
{
    if (!array_key_exists('t', $b)) return false;
    $t = $b['t'];
    return !is_numeric($t) || (float) $t < 1000;
}

/** Simple per-IP limit: max $max submissions per $window seconds (all forms together) */
function ngp_rate_limited(int $max = 6, int $window = 600): bool
{
    // behind Hostinger's CDN / a proxy the visitor's IP is in a forwarded header
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0])
        ?: ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $file = rtrim(sys_get_temp_dir(), '/\\') . '/ngp_rl_' . md5($ip);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = array_filter(
            array_map('intval', explode(',', (string) @file_get_contents($file))),
            fn ($ts) => $ts > $now - $window
        );
    }
    if (count($hits) >= $max) return true;
    $hits[] = $now;
    @file_put_contents($file, implode(',', $hits), LOCK_EX);
    return false;
}

/* ------------------------------------------------------------------ */
/* Settings (from ngp-mail-config.php, outside public_html)            */
/* ------------------------------------------------------------------ */

function ngp_config(): array
{
    $candidates = array_filter([
        getenv('NGP_MAIL_CONFIG') ?: null,
        // /home/uXXX/domains/your-domain/ngp-mail-config.php  (one level above public_html)
        isset($_SERVER['DOCUMENT_ROOT']) ? dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/')) . '/ngp-mail-config.php' : null,
        dirname(__DIR__, 2) . '/ngp-mail-config.php',
    ]);

    $cfg = null;
    foreach ($candidates as $path) {
        if (is_file($path)) {
            $cfg = require $path;
            $GLOBALS['NGP_LOG_FILE'] = dirname($path) . '/ngp-mail.log';
            break;
        }
    }
    if (!is_array($cfg)) {
        error_log('NGP mail: ngp-mail-config.php not found (looked in: ' . implode(', ', $candidates) . ')');
        ngp_json(500, ['ok' => false, 'message' => 'Mail is not configured on the server yet.']);
    }

    $to = $cfg['mail_to'] ?? [];
    if (is_string($to)) $to = explode(',', $to);
    $to = array_values(array_filter(array_map('trim', $to)));

    $cfg = [
        'smtp_host'      => $cfg['smtp_host'] ?? 'smtp.hostinger.com',
        'smtp_port'      => (int) ($cfg['smtp_port'] ?? 465),
        'smtp_secure'    => strtolower($cfg['smtp_secure'] ?? ''),
        'smtp_user'      => (string) ($cfg['smtp_user'] ?? ''),
        'smtp_pass'      => preg_replace('/\s+/', '', (string) ($cfg['smtp_pass'] ?? '')),
        'mail_to'        => $to,
        'from_name'      => (string) ($cfg['from_name'] ?? 'NGriffinPay Website'),
        'send_autoreply' => ($cfg['send_autoreply'] ?? true) !== false,
    ];
    if ($cfg['smtp_secure'] === '') {
        $cfg['smtp_secure'] = $cfg['smtp_port'] === 465 ? 'ssl' : 'tls';
    }
    if ($cfg['smtp_user'] === '' || $cfg['smtp_pass'] === '' || !$cfg['mail_to']) {
        error_log('NGP mail: smtp_user / smtp_pass / mail_to missing in ngp-mail-config.php');
        ngp_json(500, ['ok' => false, 'message' => 'Mail is not configured on the server yet.']);
    }
    return $cfg;
}

/* ------------------------------------------------------------------ */
/* Minimal SMTP client                                                 */
/* ------------------------------------------------------------------ */

final class NgpSmtp
{
    private $sock;
    private array $cfg;

    public function __construct(array $cfg)
    {
        $this->cfg = $cfg;
    }

    private function fail(string $msg): void
    {
        throw new RuntimeException($msg);
    }

    private function read(): array
    {
        $data = '';
        while (($line = fgets($this->sock, 1024)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break; // last line of a reply
        }
        if ($data === '') $this->fail('SMTP: no response from server');
        return [(int) substr($data, 0, 3), trim($data)];
    }

    private function cmd(string $line, array $ok, bool $secret = false): string
    {
        fwrite($this->sock, $line . "\r\n");
        [$code, $text] = $this->read();
        if (!in_array($code, $ok, true)) {
            $shown = $secret ? '[hidden]' : $line;
            $this->fail("SMTP: '{$shown}' failed → {$text}");
        }
        return $text;
    }

    public function connect(): void
    {
        $host = $this->cfg['smtp_host'];
        $port = $this->cfg['smtp_port'];
        $ssl = $this->cfg['smtp_secure'] === 'ssl';
        $ctx = stream_context_create(['ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'peer_name' => $host,
        ]]);
        $this->sock = @stream_socket_client(
            ($ssl ? 'ssl://' : 'tcp://') . $host . ':' . $port,
            $errno,
            $errstr,
            20,
            STREAM_CLIENT_CONNECT,
            $ctx
        );
        if (!$this->sock) $this->fail("SMTP: cannot connect to {$host}:{$port} ({$errstr})");
        stream_set_timeout($this->sock, 20);

        [$code, $text] = $this->read();
        if ($code !== 220) $this->fail('SMTP: bad greeting → ' . $text);

        $me = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['SERVER_NAME'] ?? 'localhost') ?: 'localhost';
        $this->cmd('EHLO ' . $me, [250]);

        if (!$ssl) {
            $this->cmd('STARTTLS', [220]);
            $method = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) $method |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) $method |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            if (!@stream_socket_enable_crypto($this->sock, true, $method)) $this->fail('SMTP: STARTTLS failed');
            $this->cmd('EHLO ' . $me, [250]);
        }

        $this->cmd('AUTH LOGIN', [334]);
        $this->cmd(base64_encode($this->cfg['smtp_user']), [334], true);
        $this->cmd(base64_encode($this->cfg['smtp_pass']), [235], true);
    }

    private static function header(string $s): string
    {
        // encode non-ASCII (e.g. ⚡ 💰 ·) so subjects/names arrive correctly
        $s = str_replace(["\r", "\n"], ' ', $s);
        return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
    }

    private static function addr(string $email, string $name = ''): string
    {
        $email = str_replace(["\r", "\n", '<', '>'], '', $email);
        if ($name === '') return '<' . $email . '>';
        $name = self::header($name);
        if (strpos($name, '=?') !== 0) $name = '"' . addcslashes($name, '"\\') . '"';
        return $name . ' <' . $email . '>';
    }

    /**
     * $m = [to => [[email, name], ...], subject, html, text, reply_to => [email, name], from_name]
     */
    public function send(array $m): void
    {
        $from = $this->cfg['smtp_user'];
        $this->cmd('MAIL FROM:<' . $from . '>', [250]);
        foreach ($m['to'] as [$email]) {
            $this->cmd('RCPT TO:<' . $email . '>', [250, 251]);
        }
        $this->cmd('DATA', [354]);

        $domain = substr(strrchr($from, '@') ?: '@localhost', 1);
        $boundary = 'ngp_' . bin2hex(random_bytes(12));
        $toList = implode(', ', array_map(fn ($r) => self::addr($r[0], $r[1] ?? ''), $m['to']));

        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: ' . self::addr($from, $m['from_name'] ?? $this->cfg['from_name']),
            'To: ' . $toList,
            'Subject: ' . self::header($m['subject']),
            'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $domain . '>',
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        ];
        if (!empty($m['reply_to'])) {
            $headers[] = 'Reply-To: ' . self::addr($m['reply_to'][0], $m['reply_to'][1] ?? '');
        }

        $body = "--{$boundary}\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
            . chunk_split(base64_encode($m['text']))
            . "--{$boundary}\r\n"
            . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
            . chunk_split(base64_encode($m['html']))
            . "--{$boundary}--\r\n";

        $data = implode("\r\n", $headers) . "\r\n\r\n" . $body;
        $data = preg_replace('/^\./m', '..', $data); // dot-stuffing
        fwrite($this->sock, $data . "\r\n.\r\n");
        [$code, $text] = $this->read();
        if ($code !== 250) $this->fail('SMTP: message rejected → ' . $text);
        $this->cmd('RSET', [250]);
    }

    public function close(): void
    {
        if ($this->sock) {
            @fwrite($this->sock, "QUIT\r\n");
            @fclose($this->sock);
            $this->sock = null;
        }
    }
}

/**
 * Send the team email (must succeed) and the auto-reply (never blocks success).
 * $team / $reply use the NgpSmtp::send() format; to is added automatically for $team.
 * Returns true when the team email was sent.
 */
function ngp_send(array $cfg, array $team, ?array $reply, string $label): bool
{
    $smtp = new NgpSmtp($cfg);
    try {
        $smtp->connect();
        $team['to'] = array_map(fn ($e) => [$e, ''], $cfg['mail_to']);
        $smtp->send($team);
    } catch (Throwable $e) {
        ngp_log("{$label} mail FAILED: " . $e->getMessage());
        $smtp->close();
        return false;
    }

    if ($reply && $cfg['send_autoreply']) {
        try {
            $smtp->send($reply);
        } catch (Throwable $e) {
            ngp_log("{$label} auto-reply failed: " . $e->getMessage());
        }
    }
    $smtp->close();
    ngp_log("{$label} mail sent");
    return true;
}
