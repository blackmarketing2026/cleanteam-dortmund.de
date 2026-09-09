# cleanteam-dortmund.de — Konzept

Statische Webseite für ein Reinigungsunternehmen aus Dortmund. Reines HTML/CSS/JavaScript, kein Build-Prozess, kein Framework — bewusst so einfach wie möglich gehalten, damit jede Datei direkt per Hosting/FTP ausgeliefert werden kann.

## Ziele der Seite

- Vertrauen schaffen: professioneller Auftritt für ein lokales Reinigungsunternehmen
- Leistungen klar darstellen (Büro-, Unterhalts-, Grund-, Fenster-, Bau-, Praxisreinigung …)
- Lokale Sichtbarkeit (SEO) für "Reinigung Dortmund" & verwandte Suchbegriffe
- Kontaktaufnahme so einfach wie möglich machen (Telefon, E-Mail, Kontaktformular)
- Blog für laufenden Content (SEO, Tipps, Aktuelles) — verbessert Auffindbarkeit über die Zeit

## Ordnerstruktur

```
cleanteam-dortmund.de/
├── index.html              Startseite
├── leistungen.html         Leistungsübersicht
├── ueber-uns.html          Über das Unternehmen
├── kontakt.html            Kontaktseite mit Formular
├── impressum.html          Impressum (Pflichtangaben, TMG §5) — PLATZHALTER, unbedingt befüllen
├── datenschutz.html        Datenschutzerklärung (DSGVO) — PLATZHALTER, unbedingt befüllen
├── blog/
│   ├── index.html          Blog-Übersicht
│   └── posts/
│       ├── buero-reinigung-tipps.html
│       ├── gruendliche-fruehjahrsreinigung.html
│       └── nachhaltige-reinigungsmittel.html
├── css/
│   └── style.css           Gemeinsames Stylesheet für alle Seiten
├── js/
│   └── main.js             Mobile Navigation, Formular-Feedback
├── images/                 Bildmaterial (aktuell leer, siehe .gitkeep)
├── sitemap.xml             XML-Sitemap für Suchmaschinen
├── robots.txt              Crawler-Steuerung, verweist auf sitemap.xml
└── README.md               diese Datei
```

## Konventionen

- Jede Seite bindet `css/style.css` und `js/main.js` ein und teilt sich Header/Footer/Navigation (manuell dupliziert, da kein Templating vorhanden ist).
- Neuer Blogbeitrag = neue HTML-Datei unter `blog/posts/`, verlinkt von `blog/index.html`, Eintrag in `sitemap.xml` ergänzen.
- Sprache: Deutsch, `lang="de"`.
- Alle Kontaktdaten, Adressen, Rechtsangaben (Impressum/Datenschutz) sind aktuell **Platzhalter** und müssen vor Live-Schaltung durch echte Unternehmensdaten ersetzt werden.

## Offene Punkte / nächste Schritte

- [ ] Echte Firmendaten einsetzen (Adresse, Telefon, E-Mail, Geschäftsführer, USt-ID, Handelsregister)
- [ ] Echtes Bildmaterial in `images/` einpflegen
- [ ] Kontaktformular an einen echten Versand-Endpoint anbinden (z. B. Formspree, eigenes Backend)
- [ ] Favicon & Social-Preview-Bild (Open Graph) ergänzen
- [ ] Hosting/Domain-Verbindung einrichten und `sitemap.xml` bei der Google Search Console einreichen
