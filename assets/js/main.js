/* Liso Francés — interactions: mobile nav, before/after sliders,
   scroll reveals, FAQ accordion. No external requests. */
(function () {
  "use strict";

  /* --- Swappable constants (assets/js/config.js) --- */
  if (typeof SITE !== "undefined") {
    document.querySelectorAll("[data-site='name']").forEach(function (el) { el.textContent = SITE.name; });
    document.querySelectorAll("[data-site='short']").forEach(function (el) { el.textContent = SITE.shortName; });
    document.querySelectorAll("[data-site='city']").forEach(function (el) { el.textContent = SITE.city + ", " + SITE.country; });
    document.querySelectorAll("[data-site='hours']").forEach(function (el) { el.textContent = SITE.hoursWeek + " • " + SITE.hoursSun; });
    document.querySelectorAll("[data-site='year']").forEach(function (el) { el.textContent = SITE.year; });
    document.querySelectorAll("[data-site='messenger']").forEach(function (el) { el.href = SITE.messenger; });
    document.querySelectorAll("[data-site='facebook']").forEach(function (el) { el.href = SITE.facebookPage; });
  }

  /* --- Mobile nav --- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Before / after sliders ---
     Each .ba holds TWO full-frame layers of the same before/after
     composite (muestra-03): base = BEFORE half, clipped top layer =
     AFTER half. Dragging moves the clip boundary. */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var after = ba.querySelector(".ba-after");
    var range = ba.querySelector(".ba-range");
    var handle = ba.querySelector(".ba-handle");
    if (!after || !range) return;
    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      if (handle) handle.style.left = pct + "%";
      range.value = Math.round(pct);
      range.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
    function fromEvent(e) {
      var r = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      setPos((x / r.width) * 100);
    }
    range.addEventListener("input", function () { setPos(parseFloat(range.value)); });
    ba.addEventListener("pointerdown", function (e) { fromEvent(e); ba.setPointerCapture(e.pointerId); });
    ba.addEventListener("pointermove", function (e) { if (e.buttons) fromEvent(e); });
    setPos(50);
  });

  /* --- Scroll reveals (rest state is visible if JS fails: .reveal
       only hides when JS runs, via the .js class on <html>) --- */
  document.documentElement.classList.add("js");
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* --- FAQ accordion --- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });
})();
