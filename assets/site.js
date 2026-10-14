(function () {
  var KEY = "kt-lang";
  var root = document.documentElement;

  function readSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setLang(lang) {
    root.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.setLang === lang));
    });
    var title = document.querySelector("meta[name='title-" + lang + "']");
    if (title) document.title = title.content;
  }

  var initial = readSaved() || ((navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en");
  setLang(initial);

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-set-lang]");
    if (b) setLang(b.dataset.setLang);
  });

  var bar = document.querySelector(".topbar");
  if (bar) {
    var onScroll = function () { bar.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var snackbar = document.querySelector(".snackbar");
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var done = function () {
        if (!snackbar) return;
        snackbar.classList.add("show");
        clearTimeout(snackbar._t);
        snackbar._t = setTimeout(function () { snackbar.classList.remove("show"); }, 2200);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy).then(done, function () {});
    });
  });

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
