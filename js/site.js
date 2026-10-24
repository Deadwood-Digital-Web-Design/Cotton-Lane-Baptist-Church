/* Cotton Lane Baptist — site behaviour (vanilla JS, no dependencies) */
(function () {
  var C = window.CLB || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ----- Icons (injected into [data-icon]) ----- */
  var ICONS = {
    calendar: '<path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
    mail: '<path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 7l9 6.5L21 7"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    book: '<path d="M4 5.5C6.500 4.500 9.500 4.500 12 6c2.500-1.500 5.500-1.500 8-.5V19c-2.500-1-5.500-1-8 .5-2.500-1.500-5.500-1.500-8-.5z M12 6v13.500"/>',
    users: '<circle cx="9" cy="8.500" r="3.500"/><path d="M2.500 20a6.500 6.500 0 0 1 13 0M16 5.300a3.500 3.500 0 0 1 0 6.400M18 14.500a6.500 6.500 0 0 1 3.500 5.500"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.500v2.500M12 19v2.500M2.500 12H5M19 12h2.500M5.300 5.300l1.800 1.800M16.900 16.900l1.800 1.800M5.300 18.700l1.800-1.800M16.900 7.100l1.800-1.800"/>',
    cross: '<path d="M12 3v18M6 9h12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    fb: '<path d="M14 8.500h2.500V5H14a3.500 3.500 0 0 0-3.500 3.500V11H8v3.500h2.500V21H14v-6.500h2.500L17 11h-3V8.500z"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="4.500"/><circle cx="12" cy="12" r="3.600"/><circle cx="16.900" cy="7.100" r=".6" fill="currentColor"/>'
  };
  $$("[data-icon]").forEach(function (el) {
    var p = ICONS[el.getAttribute("data-icon")];
    if (!p) return;
    el.insertAdjacentHTML("afterbegin",
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>");
  });

  /* ----- Fill details from config.js ----- */
  // data-text="key"        -> text content
  // data-href="tel:{key}"  -> href template
  // data-if="key"          -> hide element when that setting is empty
  $$("[data-text]").forEach(function (el) {
    var v = C[el.getAttribute("data-text")];
    if (v) el.textContent = v;
  });
  $$("[data-href]").forEach(function (el) {
    var tpl = el.getAttribute("data-href");
    var key = (tpl.match(/\{(\w+)\}/) || [])[1];
    var v = C[key];
    if (v) el.setAttribute("href", tpl.replace("{" + key + "}", /^tel:/.test(tpl) ? String(v).replace(/[^\d+]/g, "") : v));
  });
  $$("[data-if]").forEach(function (el) {
    var keys = el.getAttribute("data-if").split(",");
    var any = keys.some(function (k) { return !!C[k.trim()]; });
    if (!any) el.hidden = true;
  });

  /* ----- Mobile nav ----- */
  var toggle = $(".nav-toggle"), nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { toggle.click(); toggle.focus(); }
    });
  }

  /* ----- Footer year ----- */
  $$(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ----- Scroll reveal ----- */
  var items = $$(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

})();
