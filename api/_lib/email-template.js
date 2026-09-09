'use strict';

// Farben passend zum aktuellen Website-Design (siehe css/landing.css :root)
const COLORS = {
  navy: '#112d62',
  ink: '#152b46',
  lime: '#a9df43',
  muted: '#526175',
  line: '#dce3ea',
  light: '#f3f6f9',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function button(label, href, background, color) {
  return (
    '<a href="' + href + '" ' +
    'style="display:inline-block;margin:0 8px 8px 0;padding:12px 22px;' +
    'background:' + background + ';color:' + color + ';text-decoration:none;' +
    'border-radius:999px;font:600 14px/1 Arial,Helvetica,sans-serif;">' +
    label +
    '</a>'
  );
}

function buildLeadEmailHtml(lead) {
  const { name, company, email, phone, service, message, submittedAt, whatsappNumber } = lead;

  const rows = [
    ['Name', name],
    ['Unternehmen', company || '–'],
    ['E-Mail', email],
    ['Telefon', phone || '–'],
    ['Gewünschte Leistung', service || 'Allgemeine Anfrage'],
  ]
    .map(function (pair) {
      const label = pair[0];
      const value = pair[1];
      return (
        '<tr>' +
        '<td style="padding:10px 16px;border-bottom:1px solid ' + COLORS.line + ';color:' + COLORS.muted + ';' +
        'font:700 13px/1.4 Arial,Helvetica,sans-serif;white-space:nowrap;vertical-align:top;">' + escapeHtml(label) + '</td>' +
        '<td style="padding:10px 16px;border-bottom:1px solid ' + COLORS.line + ';color:' + COLORS.ink + ';' +
        'font:400 14px/1.5 Arial,Helvetica,sans-serif;">' + escapeHtml(value) + '</td>' +
        '</tr>'
      );
    })
    .join('');

  const buttons = [button('✉️&nbsp;E-Mail', 'mailto:' + encodeURIComponent(email), COLORS.navy, '#ffffff')];
  if (phone) {
    buttons.push(button('📞&nbsp;Anrufen', 'tel:' + encodeURIComponent(phone), COLORS.navy, '#ffffff'));
  }
  if (whatsappNumber) {
    buttons.push(button('💬&nbsp;WhatsApp', 'https://wa.me/' + whatsappNumber, COLORS.lime, COLORS.ink));
  }

  return (
    '<!DOCTYPE html>' +
    '<html lang="de"><head><meta charset="UTF-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
    '<title>Neue Anfrage – CleanTeam Dortmund</title></head>' +
    '<body style="margin:0;padding:0;background:' + COLORS.light + ';font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + COLORS.light + ';padding:24px 0;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" ' +
    'style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ' + COLORS.line + ';">' +
    '<tr><td style="background:' + COLORS.navy + ';padding:24px 32px;">' +
    '<img src="cid:cleanteamlogo" alt="CleanTeam Dortmund" width="120" style="display:block;" />' +
    '</td></tr>' +
    '<tr><td style="padding:28px 32px 8px;">' +
    '<p style="margin:0 0 4px;color:' + COLORS.lime + ';font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;">Neue Website-Anfrage</p>' +
    '<h1 style="margin:0 0 4px;color:' + COLORS.ink + ';font:700 22px/1.3 Arial,Helvetica,sans-serif;">' + escapeHtml(name) + '</h1>' +
    '<p style="margin:0;color:' + COLORS.muted + ';font:400 13px/1.5 Arial,Helvetica,sans-serif;">Eingegangen am ' + escapeHtml(submittedAt) + ' Uhr über cleanteam-dortmund.de</p>' +
    '</td></tr>' +
    '<tr><td style="padding:12px 32px 4px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ' + COLORS.line + ';border-radius:8px;overflow:hidden;">' +
    rows +
    '</table>' +
    '</td></tr>' +
    '<tr><td style="padding:20px 32px 4px;">' +
    '<p style="margin:0 0 6px;color:' + COLORS.muted + ';font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.04em;text-transform:uppercase;">Nachricht</p>' +
    '<p style="margin:0;padding:14px 16px;background:' + COLORS.light + ';border-radius:8px;color:' + COLORS.ink + ';' +
    'font:400 14px/1.6 Arial,Helvetica,sans-serif;white-space:pre-wrap;">' + escapeHtml(message) + '</p>' +
    '</td></tr>' +
    '<tr><td style="padding:24px 32px 32px;">' +
    '<p style="margin:0 0 12px;color:' + COLORS.muted + ';font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.04em;text-transform:uppercase;">Schnellkontakt zum Interessenten</p>' +
    buttons.join('') +
    '</td></tr>' +
    '<tr><td style="padding:16px 32px;background:' + COLORS.light + ';border-top:1px solid ' + COLORS.line + ';">' +
    '<p style="margin:0;color:' + COLORS.muted + ';font:400 11px/1.5 Arial,Helvetica,sans-serif;">Diese Nachricht wurde automatisch vom Kontaktformular auf cleanteam-dortmund.de versendet. Antworten Sie direkt auf diese E-Mail, um den Interessenten zu erreichen.</p>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</body></html>'
  );
}

function buildLeadEmailText(lead) {
  const { name, company, email, phone, service, message, submittedAt } = lead;
  return [
    'Neue Anfrage über cleanteam-dortmund.de',
    'Eingegangen am ' + submittedAt + ' Uhr',
    '',
    'Name: ' + name,
    'Unternehmen: ' + (company || '–'),
    'E-Mail: ' + email,
    'Telefon: ' + (phone || '–'),
    'Leistung: ' + (service || 'Allgemeine Anfrage'),
    '',
    'Nachricht:',
    message,
  ].join('\n');
}

module.exports = { buildLeadEmailHtml, buildLeadEmailText };
