'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const { buildLeadEmailHtml, buildLeadEmailText } = require('./_lib/email-template');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function digitsOnly(value) {
  return String(value || '').replace(/[^\d+]/g, '');
}

function toWhatsappNumber(phone) {
  const digits = digitsOnly(phone);
  if (!digits) return '';
  if (digits.startsWith('+')) return digits.slice(1);
  if (digits.startsWith('0')) return '49' + digits.slice(1);
  return digits;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = await readJsonBody(req);

  const name = sanitize(body.name);
  const company = sanitize(body.company);
  const email = sanitize(body.email);
  const phone = sanitize(body.phone);
  const service = sanitize(body.service);
  const message = String(body.message || '').trim();
  const privacyAccepted = Boolean(body.privacy);
  const honeypot = sanitize(body.website); // verstecktes Feld, sollte fuer Menschen leer bleiben

  if (honeypot) {
    // Spam-Bot: Erfolg vortäuschen, aber nichts versenden.
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message || !privacyAccepted) {
    return res.status(400).json({ ok: false, error: 'Bitte füllen Sie Name, E-Mail, Nachricht aus und bestätigen Sie die Datenschutzhinweise.' });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ ok: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' });
  }

  const smtpUser = process.env.smtp_user;
  const smtpPassword = process.env.smtp_passwort;
  const smtpServer = process.env.smtp_server;
  const smtpRecipient = process.env.smtp_empaenger;

  if (!smtpUser || !smtpPassword || !smtpServer || !smtpRecipient) {
    console.error('SMTP-Umgebungsvariablen fehlen (smtp_user/smtp_passwort/smtp_server/smtp_empaenger).');
    return res.status(500).json({ ok: false, error: 'Server ist aktuell nicht korrekt konfiguriert. Bitte rufen Sie uns direkt an.' });
  }

  const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: 587,
    secure: false, // Port 587 -> STARTTLS
    requireTLS: true,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  const submittedAt = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const lead = {
    name,
    company,
    email,
    phone,
    service,
    message,
    submittedAt,
    whatsappNumber: toWhatsappNumber(phone),
  };

  try {
    await transporter.sendMail({
      from: `"CleanTeam Dortmund Website" <${smtpUser}>`,
      to: smtpRecipient,
      replyTo: `"${name.replace(/["\\]/g, '')}" <${email}>`,
      subject: `Neue Anfrage über die Website – ${name}${service ? ' · ' + service : ''}`,
      text: buildLeadEmailText(lead),
      html: buildLeadEmailHtml(lead),
      attachments: [
        {
          filename: 'cleanteam-logo.png',
          path: path.join(__dirname, '_lib', 'assets', 'logo-mark.png'),
          cid: 'cleanteamlogo',
        },
      ],
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mailversand fehlgeschlagen:', err);
    return res.status(502).json({ ok: false, error: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns an.' });
  }
};
