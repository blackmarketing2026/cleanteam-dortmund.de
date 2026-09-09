'use strict';
const toggle = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Menü öffnen'); }
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.querySelector('#service').value = link.dataset.service; }));
document.querySelector('[data-year]').textContent = new Date().getFullYear();
const form = document.querySelector('.contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = ['Guten Tag Clean Team,', '', 'ich interessiere mich für eine Reinigung in Dortmund und Umgebung.', '', 'Name: ' + data.get('name'), 'Unternehmen: ' + (data.get('company') || '–'), 'E-Mail: ' + data.get('email'), 'Telefon: ' + (data.get('phone') || '–'), 'Leistung: ' + (data.get('service') || 'Allgemeine Anfrage'), '', data.get('message')].join('\r\n');
  window.location.href = 'mailto:info@cleanteam-group.com?subject=' + encodeURIComponent('Reinigungsanfrage – Clean Team Dortmund') + '&body=' + encodeURIComponent(body);
  form.querySelector('.form-status').textContent = 'Ihre Anfrage ist vorbereitet. Bitte senden Sie sie in Ihrem E-Mail-Programm ab. Falls sich kein Programm öffnet, schreiben Sie an info@cleanteam-group.com oder rufen Sie 0212 – 240 914 90 an. Ihre Eingaben bleiben hier erhalten.';
});
