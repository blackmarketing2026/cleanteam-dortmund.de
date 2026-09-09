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
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    var payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      service: data.get("service"),
      message: data.get("message"),
      privacy: data.get("privacy") === "on",
      website: data.get("website"), // Honeypot, bleibt fuer Menschen leer
    };

    if (status) {
      status.textContent = "Ihre Anfrage wird gesendet …";
      status.className = "form-status";
    }
    if (submitBtn) submitBtn.disabled = true;

    try {
      var response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      var result = await response.json().catch(function () {
        return {};
      });

      if (response.ok && result.ok) {
        if (status) {
          status.textContent = "Danke für Ihre Nachricht! Wir melden uns schnellstmöglich bei Ihnen.";
          status.className = "form-status success";
        }
        form.reset();
      } else {
        if (status) {
          status.textContent = result.error || "Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie uns direkt per E-Mail.";
          status.className = "form-status error";
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = "Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie uns direkt per E-Mail.";
        status.className = "form-status error";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function initFooterYear() {
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
