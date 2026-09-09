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
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const payload = {
    name: data.get('name'),
    company: data.get('company'),
    email: data.get('email'),
    phone: data.get('phone'),
    service: data.get('service'),
    message: data.get('message'),
    privacy: data.get('privacy') === 'on',
    website: data.get('website'), // Honeypot, bleibt für Menschen leer
  };

  status.textContent = 'Ihre Anfrage wird gesendet …';
  if (submitBtn) submitBtn.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (response.ok && result.ok) {
      status.textContent = 'Vielen Dank! Ihre Anfrage ist bei uns eingegangen. Wir melden uns schnellstmöglich bei Ihnen.';
      form.reset();
    } else {
      status.textContent = result.error || 'Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns unter 0212 – 240 914 90 an oder schreiben Sie an info@cleanteam-group.com.';
    }
  } catch (err) {
    status.textContent = 'Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns unter 0212 – 240 914 90 an oder schreiben Sie an info@cleanteam-group.com.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});
