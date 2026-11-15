(() => {
  'use strict';

  const STORAGE_KEY = 'cleanteam-cookie-consent-v1';
  const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && ['accepted', 'necessary'].includes(saved.choice) &&
          Number.isFinite(saved.savedAt) && Date.now() - saved.savedAt < MAX_AGE_MS) {
        return saved.choice;
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* Ohne Speicher wird erneut gefragt. */ }
    return null;
  }

  function storeChoice(choice) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, savedAt: Date.now() })); }
    catch { /* Die Auswahl gilt dann nur für diese Seite. */ }
  }

  let choice = readChoice();
  let dialog;

  function openDialog() {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.querySelector('h2').focus();
  }

  function decide(nextChoice) {
    choice = nextChoice;
    storeChoice(nextChoice);
    dialog.close();
  }

  window.CleanteamConsent = {
    allowsTracking: () => choice === 'accepted',
    openSettings: openDialog,
  };

  dialog = document.createElement('dialog');
  dialog.className = 'cookie-dialog';
  dialog.setAttribute('aria-labelledby', 'cookie-title');
  dialog.setAttribute('aria-describedby', 'cookie-description');
  dialog.innerHTML = `
    <div class="cookie-dialog-top"><span>IHRE PRIVATSPHÄRE</span><span aria-hidden="true">✳</span></div>
    <div class="cookie-dialog-body">
      <h2 id="cookie-title" tabindex="-1">Dürfen wir Cookies verwenden?</h2>
      <p id="cookie-description">Diese Website verwendet derzeit keine optionalen Analyse- oder Marketing-Cookies. Ihre Auswahl speichern wir für 180 Tage auf diesem Gerät. Sie können Ihre Entscheidung jederzeit ändern.</p>
      <p class="cookie-dialog-links"><a href="https://www.cleanteam-group.com/datenschutz/">Datenschutz</a><a href="https://www.cleanteam-group.com/impressum/">Impressum</a></p>
      <div class="cookie-dialog-actions">
        <button type="button" class="cookie-reject">Nur notwendige</button>
        <button type="button" class="cookie-accept">Alle akzeptieren</button>
      </div>
      <p class="cookie-dialog-note">Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ im Footer ändern.</p>
    </div>`;
  dialog.addEventListener('cancel', (event) => event.preventDefault());
  dialog.querySelector('.cookie-reject').addEventListener('click', () => decide('necessary'));
  dialog.querySelector('.cookie-accept').addEventListener('click', () => decide('accepted'));
  document.body.append(dialog);

  const legalNav = document.querySelector('.footer-bottom nav, .site-footer .footer-grid > div:last-child ul');
  if (legalNav) {
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'cookie-settings-link';
    settings.textContent = 'Cookie-Einstellungen';
    settings.addEventListener('click', openDialog);
    if (legalNav.tagName === 'UL') {
      const item = document.createElement('li');
      item.append(settings);
      legalNav.append(item);
    } else legalNav.append(settings);
  }

  // Die Datenschutzhinweise und das Impressum müssen ohne Entscheidung lesbar sein.
  const infoPage = /^\/(datenschutz|impressum)\/?$/.test(window.location.pathname);
  if (!choice && !infoPage) openDialog();
})();
