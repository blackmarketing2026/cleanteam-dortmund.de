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

    // Hinweis: Es ist noch kein Versand-Endpoint angebunden (siehe README.md).
    // Sobald ein Formular-Backend (z. B. Formspree) eingerichtet ist, hier
    // den fetch()-Aufruf an den entsprechenden Endpoint ergänzen.
    if (status) {
      status.textContent = "Danke für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen.";
      status.className = "form-status success";
    }
    form.reset();
  });
}

function initFooterYear() {
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
