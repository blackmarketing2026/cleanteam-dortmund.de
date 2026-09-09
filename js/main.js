// CleanTeam Dortmund — gemeinsames JavaScript für alle Seiten

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initContactForm();
  initFooterYear();
});

function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function initContactForm() {
  var form = document.querySelector(".contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    var body = ['Name: ' + data.get('name'), 'E-Mail: ' + data.get('email'),
      'Telefon: ' + (data.get('phone') || '–'), 'Leistung: ' + (data.get('service') || 'Allgemeine Anfrage'),
      '', data.get('message')].join('\r\n');
    window.location.href = 'mailto:info@cleanteam-group.com?subject=' + encodeURIComponent('Reinigungsanfrage – Clean Team Dortmund') + '&body=' + encodeURIComponent(body);
    if (status) {
      status.textContent = "Ihre Anfrage ist vorbereitet. Bitte senden Sie die E-Mail in Ihrem E-Mail-Programm selbst ab. Falls sich kein Programm öffnet, schreiben Sie an info@cleanteam-group.com. Ihre Eingaben bleiben erhalten.";
      status.className = "form-status success";
    }
  });
}

function initFooterYear() {
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
