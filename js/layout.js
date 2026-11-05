/* Builds the parts that are the same on every page (progress bar, header,
   full-screen menu and footer) from the settings in site-config.js. */

(function () {
  var site = window.SITE;
  var currentId = document.querySelector("main").dataset.page;

  function menuLabel(page) {
    return page.menuLabel || page.label;
  }

  // ---- Header + menu ----
  var headerLinks = site.pages
    .filter(function (p) { return p.inHeader; })
    .map(function (p) {
      var current = p.id === currentId ? ' class="is-current"' : "";
      return '<a href="' + p.file + '"' + current + ">" + p.label + "</a>";
    })
    .join("");

  var menuItems = site.pages
    .map(function (p, i) {
      var current = p.id === currentId ? ' aria-current="page"' : "";
      // Pages with `sections` show an expandable item inside the full-screen menu.
      if (p.sections && p.sections.length) {
        var subs = p.sections.map(function (s) {
          var scurrent = (p.id === currentId && location.hash === "#" + s.id) ? ' aria-current="page"' : "";
          return '<a href="' + p.file + "#" + s.id + '"' + scurrent + ">" + s.label + "</a>";
        }).join("");
        return '<li style="--i:' + i + '" class="menu-section">' +
          '<a href="' + p.file + '" class="menu-section-link" aria-expanded="false"><b>' + menuLabel(p) + "</b><small>" + p.blurb + "</small></a>" +
          '<button class="menu-section-toggle" aria-expanded="false"><span class="menu-arrow"></span></button>' +
          '<div class="menu-section-list">' + subs + "</div>" +
        "</li>";
      }
      return '<li style="--i:' + i + '"><a href="' + p.file + '"' + current + "><b>" + menuLabel(p) + "</b><small>" + p.blurb + "</small></a></li>";
    })
    .join("");

  document.getElementById("site-header").innerHTML =
    '<div class="progress" id="progress"></div>' +
    '<header class="site-header" id="header">' +
      '<div class="wrap">' +
        '<a class="logo" href="" aria-label="' + site.name + ' home">' +
          '<img src="images/logo/Logo.webp" alt="' + site.name + ' Logo" class="header-logo">' +
        "</a>" +
        '<nav class="main-nav" aria-label="Main">' + headerLinks + "</nav>" +
        '<button class="menu-button" id="menu-open" aria-expanded="false" aria-controls="menu"><span class="menu-icon"></span>Menu</button>' +
      "</div>" +
    "</header>" +
    '<div class="menu-overlay" id="menu" role="dialog" aria-label="All sections" aria-modal="true">' +
      '<div class="wrap">' +
        '<div class="menu-top"><a class="logo" href="">' + 
        '<img src="images/logo/Logo.webp" alt="' + site.name + ' Logo" class="header-logo">'  + "</a>" +
        '<button class="menu-button" id="menu-close">Close &#10005;</button></div>' +
        '<ul class="menu-list">' + menuItems + "</ul>" +
      "</div>" +
    "</div>";

  // ---- Footer ----
  // Pages marked inFooter, followed by the policy links.
  var footerPageLinks = site.pages
    .filter(function (p) { return p.inFooter; })
    .map(function (p) { return '<li><a href="' + p.file + '">' + menuLabel(p) + "</a></li>"; })
    .join("");

  var footerPolicyLinks = (site.footerLinks || [])
    .map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; })
    .join("");

  var disclaimer = site.footerDisclaimer
    ? '<p class="footer-note" style="margin-top:44px;font-size:11px">' + site.footerDisclaimer + "</p>"
    : "";

  var noteText = site.footerNote
    ? site.footerNote.replace("Ascending Software", '<a href="https://ascendingsoftware.com/" target="_blank" rel="noopener noreferrer">Ascending Software</a>')
    : "";
  var note = site.footerNote
    ? '<small class="footer-note"' + (disclaimer ? ' style="margin-top:0;;text-align:center";border-top:0;padding-top:6px";' : "") + '">' + noteText + "</small>"
    : "";

  document.getElementById("site-footer").innerHTML =
    '<footer class="site-footer">' +
      '<div class="wrap">' +
        '<div class="footer-columns">' +
          '<div><a class="logo" href="">' + 
          '<img src="images/logo/Logo.webp" alt="' + site.name + ' Logo" class="header-logo">' 
           + "</a>" +
          '<p class="muted" style="margin-top:18px;max-width:36ch;font-size:15px">' + site.tagline + ". </p></div>" +
          '<ul class="footer-links">' + footerPageLinks + footerPolicyLinks + "</ul>" +
        "</div>" +
        disclaimer +
        note +
      "</div>" +
    "</footer>";

  // ---- Open and close the menu ----
  var menu = document.getElementById("menu");
  var openButton = document.getElementById("menu-open");

  function openMenu() {
    menu.classList.add("is-open");
    openButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu.classList.remove("is-open");
    openButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    // Collapse any expanded page sections (e.g. Space Medicine) when the menu closes.
    document.querySelectorAll(".menu-section-toggle").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      var list = btn.parentElement.querySelector(".menu-section-list");
      if (list) list.style.display = "none";
    });
  }

  openButton.addEventListener("click", openMenu);
  document.getElementById("menu-close").addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // ---- Expandable page sections inside the full-screen menu (e.g. Space Medicine) ----
  document.querySelectorAll(".menu-section-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !expanded);
      var list = btn.parentElement.querySelector(".menu-section-list");
      if (list) list.style.display = expanded ? "none" : "block";
    });
  });

  // Fill in contact details wherever data-config="email" (etc.) is used
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var value = site.contact[el.dataset.config];
    if (value) el.textContent = value;
  });
})();