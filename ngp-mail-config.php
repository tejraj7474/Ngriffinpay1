<?php
/**
 * ngp-mail-config.php — mail settings for the NGriffinPay website forms.
 *
 * ⚠ Do NOT put this file in GitHub and do NOT put it inside public_html.
 *   Create it in hPanel → File Manager, ONE LEVEL ABOVE public_html:
 *
 *   /home/uXXXXXXX/domains/YOUR-DOMAIN/ngp-mail-config.php   <- here
 *   /home/uXXXXXXX/domains/YOUR-DOMAIN/public_html/          <- website
 *
 * Fill in ONE of the two options below and delete the other.
 */

return [

    /* ---------- OPTION A (recommended): a Hostinger email account ----------
       hPanel → Emails → create e.g. website@yourdomain.in, then use its password. */
    'smtp_host'   => 'smtp.hostinger.com',
    'smtp_port'   => 465,          // 465 = SSL. If it fails, try 587 with 'tls'
    'smtp_secure' => 'ssl',        // 'ssl' for 465, 'tls' for 587
    'smtp_user'   => 'website@YOUR-DOMAIN.in',
    'smtp_pass'   => 'PASSWORD-OF-THAT-MAILBOX',

    /* ---------- OPTION B: keep using Gmail ----------
    'smtp_host'   => 'smtp.gmail.com',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',
    'smtp_user'   => 'testmaildigitalnock@gmail.com',
    'smtp_pass'   => 'NEW 16-LETTER GOOGLE APP PASSWORD',
    */

    // Who receives the form submissions (comma-separated list is also fine)
    'mail_to' => ['sales@ngriffin.in', 'support@ngriffin.in'],

    'from_name'      => 'NGriffinPay Website',
    'send_autoreply' => true,      // false = don't email the visitor
];
