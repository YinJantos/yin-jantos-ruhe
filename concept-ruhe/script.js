const BASE = "/concept-ruhe";

const courseItems = `
  <a class="menu-overview-link" href="${BASE}/kurse/">Alle Kurse im Überblick</a>
  <div class="menu-group">
    <span class="menu-group-label">ZenFokus</span>
    <a href="${BASE}/kurse/zenfokus/pmr-starterkurs/">PMR-Starterkurs <small>ZPP-zertifiziert</small></a>
    <a href="${BASE}/kurse/zenfokus/entspannungsworkshop/">Regeneration kompakt <small>Selbstzahler</small></a>
  </div>
  <span class="menu-disabled">ZenPuls <small>In Vorbereitung</small></span>
  <span class="menu-disabled">ZenVital <small>In Vorbereitung</small></span>
`;

const locationItems = `
  <a href="${BASE}/standorte/reharmonie/">ReHarmonie <small>Braunschweig Ost</small></a>
  <a href="${BASE}/standorte/praxis-schmid/">Praxis Schmid, Schneider &amp; Bethke <small>Braunschweig West</small></a>
  <a href="${BASE}/standorte/kneipp-verein/">Kneipp-Verein <small>Wolfenbüttel</small></a>
`;

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header" id="site-header">
        <a class="brand" href="${BASE}/" aria-label="Yin und Jantos Startseite">
          <img src="${BASE}/assets/logo.png" alt="Yin und Jantos, Bewegung und Entspannung" width="830" height="210">
        </a>
        <nav class="desktop-nav" aria-label="Hauptnavigation">
          <a href="${BASE}/">Home</a>
          <div class="nav-dropdown">
            <button type="button" aria-expanded="false">Kurse</button>
            <div class="dropdown-panel">${courseItems}</div>
          </div>
          <div class="nav-dropdown">
            <button type="button" aria-expanded="false">Standorte</button>
            <div class="dropdown-panel dropdown-locations">${locationItems}</div>
          </div>
          <a href="${BASE}/ueber-mich/">Über mich</a>
          <a href="${BASE}/krankenkassen/">Krankenkassen</a>
        </nav>
        <a class="header-cta" href="${BASE}/kontakt/">Kontakt <span aria-hidden="true">↗</span></a>
        <button class="menu-button" type="button" aria-label="Menü öffnen" aria-expanded="false">
          <span></span><span></span>
        </button>
      </header>
      <div class="mobile-menu" aria-hidden="true">
        <nav aria-label="Mobile Navigation">
          <a href="${BASE}/">Home</a>
          <details>
            <summary>Kurse <span aria-hidden="true">+</span></summary>
            <div class="mobile-subnav">${courseItems}</div>
          </details>
          <details>
            <summary>Standorte <span aria-hidden="true">+</span></summary>
            <div class="mobile-subnav">${locationItems}</div>
          </details>
          <a href="${BASE}/ueber-mich/">Über mich</a>
          <a href="${BASE}/krankenkassen/">Krankenkassen</a>
          <a href="${BASE}/kontakt/">Kontakt</a>
        </nav>
      </div>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <a class="footer-brand" href="${BASE}/">
          <img src="${BASE}/assets/logo.png" alt="Yin und Jantos" width="830" height="210">
        </a>
        <div class="footer-contact">
          <span>Fragen oder Kursanfrage</span>
          <a href="mailto:mail@yinjantos.de">mail@yinjantos.de</a>
        </div>
        <nav class="footer-links" aria-label="Fußnavigation">
          <a href="${BASE}/kurse/">Kurse</a>
          <a href="${BASE}/standorte/reharmonie/">Standorte</a>
          <a href="${BASE}/kontakt/">Kontakt</a>
          <a href="${BASE}/impressum.html">Impressum</a>
          <a href="${BASE}/datenschutz.html">Datenschutz</a>
          <button class="privacy-settings-trigger" type="button">Cookie-Hinweis</button>
        </nav>
        <div class="footer-meta">
          <small>© 2026 Yin &amp; Jantos. Alle Rechte vorbehalten.</small>
          <small>Termine, Preise und Verfügbarkeiten können sich ändern. Verbindlich ist die persönliche Buchungsbestätigung.</small>
          <small>Design &amp; Entwicklung: <a href="https://forma-studio-gamma.vercel.app/" target="_blank" rel="noopener noreferrer">NJUME Studio</a></small>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

const PRIVACY_NOTICE_KEY = "yin-jantos-privacy-notice";
const PRIVACY_NOTICE_LIFETIME = 180 * 24 * 60 * 60 * 1000;

function hasCurrentPrivacyNotice() {
  try {
    const stored = JSON.parse(localStorage.getItem(PRIVACY_NOTICE_KEY));
    return stored?.version === 1 && Number(stored.expiresAt) > Date.now();
  } catch {
    localStorage.removeItem(PRIVACY_NOTICE_KEY);
    return false;
  }
}

function rememberPrivacyNotice() {
  const acceptedAt = Date.now();
  localStorage.setItem(PRIVACY_NOTICE_KEY, JSON.stringify({
    version: 1,
    acceptedAt,
    expiresAt: acceptedAt + PRIVACY_NOTICE_LIFETIME,
  }));
}

function createPrivacyNotice() {
  const notice = document.createElement("section");
  notice.className = "privacy-notice";
  notice.setAttribute("role", "dialog");
  notice.setAttribute("aria-labelledby", "privacy-notice-title");
  notice.setAttribute("aria-describedby", "privacy-notice-description");
  notice.setAttribute("aria-hidden", "true");
  notice.innerHTML = `
    <div class="privacy-notice-copy">
      <p class="privacy-kicker">Datenschutz &amp; Cookies</p>
      <h2 id="privacy-notice-title">Nur technisch Notwendiges.</h2>
      <p id="privacy-notice-description">Diese Website verwendet aktuell keine Analyse-, Marketing- oder Tracking-Cookies. Lokal gespeichert wird nur, dass du diesen Hinweis bestätigt hast.</p>
      <details>
        <summary>Speicherung im Detail</summary>
        <dl>
          <div><dt>Notwendig</dt><dd>Bestätigung dieses Hinweises · 180 Tage</dd></div>
          <div><dt>Statistik</dt><dd>Nicht eingesetzt</dd></div>
          <div><dt>Marketing</dt><dd>Nicht eingesetzt</dd></div>
        </dl>
      </details>
      <p class="privacy-links"><a href="${BASE}/datenschutz.html">Datenschutz</a><a href="${BASE}/impressum.html">Impressum</a></p>
    </div>
    <button class="button button-dark privacy-confirm" type="button">Verstanden</button>
  `;
  document.body.appendChild(notice);

  const confirmButton = notice.querySelector(".privacy-confirm");
  confirmButton.addEventListener("click", () => {
    rememberPrivacyNotice();
    notice.classList.remove("visible");
    notice.setAttribute("aria-hidden", "true");
  });

  document.querySelectorAll(".privacy-settings-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      notice.classList.add("visible");
      notice.setAttribute("aria-hidden", "false");
      confirmButton.focus();
    });
  });

  if (!hasCurrentPrivacyNotice()) {
    requestAnimationFrame(() => {
      notice.classList.add("visible");
      notice.setAttribute("aria-hidden", "false");
    });
  }
}

createPrivacyNotice();

const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24 || !document.body.classList.contains("home"));
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  mobileMenu?.classList.remove("open");
  mobileMenu?.setAttribute("aria-hidden", "true");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const opening = !mobileMenu.classList.contains("open");
  mobileMenu.classList.toggle("open", opening);
  document.body.classList.toggle("menu-open", opening);
  mobileMenu.setAttribute("aria-hidden", String(!opening));
  menuButton.setAttribute("aria-expanded", String(opening));
});

mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const button = dropdown.querySelector("button");
  button.addEventListener("click", () => {
    const opening = !dropdown.classList.contains("open");
    document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector("button").setAttribute("aria-expanded", "false");
    });
    dropdown.classList.toggle("open", opening);
    button.setAttribute("aria-expanded", String(opening));
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    document.querySelectorAll(".nav-dropdown.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector("button").setAttribute("aria-expanded", "false");
    });
  }
});

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    const indicator = detail.querySelector("summary [aria-hidden='true']");
    if (indicator) indicator.textContent = detail.open ? "−" : "+";
  });
});

document.querySelectorAll(".category-details").forEach((card) => {
  const toggle = card.querySelector(".category-summary");
  const indicator = card.querySelector(".category-toggle");
  toggle?.addEventListener("click", () => {
    const opening = !card.classList.contains("open");
    card.classList.toggle("open", opening);
    toggle.setAttribute("aria-expanded", String(opening));
    if (indicator) indicator.textContent = opening ? "−" : "+";
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const notice = document.querySelector("#form-notice");
  const submit = contactForm.querySelector('button[type="submit"]');

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (notice) {
      notice.className = "form-note error";
      notice.textContent = "Bitte prüfe die Pflichtfelder und die Datenschutzbestätigung.";
    }
    return;
  }

  submit.disabled = true;
  submit.textContent = "Wird gesendet …";
  if (notice) {
    notice.className = "form-note";
    notice.textContent = "Deine Anfrage wird sicher übermittelt.";
  }

  const payload = Object.fromEntries(new FormData(contactForm).entries());
  fetch(contactForm.action, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Die Anfrage konnte nicht gesendet werden.");
      contactForm.reset();
      if (notice) {
        notice.className = "form-note success";
        notice.textContent = "Danke. Deine Anfrage ist angekommen. Ich melde mich persönlich bei dir.";
      }
      submit.textContent = "Anfrage gesendet";
    })
    .catch((error) => {
      if (notice) {
        notice.className = "form-note error";
        notice.textContent = `${error.message} Bitte versuche es später erneut.`;
      }
      submit.disabled = false;
      submit.textContent = "Erneut senden";
    });
});

if (contactForm) {
  const requestedCourse = new URLSearchParams(window.location.search).get("kurs");
  const courseSelect = contactForm.elements.course;
  if (requestedCourse === "workshop") courseSelect.value = "Regeneration kompakt";
  if (requestedCourse === "pmr") courseSelect.value = "PMR-Starterkurs";
}
