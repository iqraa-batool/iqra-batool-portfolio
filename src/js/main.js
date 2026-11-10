/* Iqra Batool — site behaviour. Vanilla JS, no dependencies.
 * Every feature checks for its elements first, so this one file serves all pages.
 * Without JavaScript the site still works: content is server-rendered,
 * accordions are native <details>, and the form posts normally. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* Header: solid after scrolling, hides on scroll down, returns on scroll up */
  var header = $(".site-header");
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-solid", y > 24);
      var menuOpen = document.body.classList.contains("is-locked");
      var withinHeader = header.contains(document.activeElement);
      if (!menuOpen && !withinHeader && y > 320 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 320) header.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
    onScroll();
  }

  /* Mobile menu */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  if (toggle && nav) {
    var mq = window.matchMedia("(max-width: 960px)");
    var focusables = function () { return $$("a, button", nav).concat([toggle]); };
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
      if (open) { var first = $("a", nav); if (first) first.focus(); }
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (e.key === "Escape") { setOpen(false); toggle.focus(); }
      if (e.key === "Tab") {
        var items = focusables();
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    mq.addEventListener("change", function (e) { if (!e.matches) setOpen(false); });
  }

  /* Reveal on scroll (opt-in; content is visible without JS or with reduced motion) */
  var revealEls = $$(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Count-up statistics. The final value is already in the HTML. */
  var stats = $$("[data-count]");
  if (stats.length && "IntersectionObserver" in window && !reduceMotion.matches) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countIO.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var start = null, duration = 1400;
        var step = function (t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { countIO.observe(el); });
  }

  /* Hero answer card: cycles three questions and highlights the matching focus area.
   * Pauses on hover/focus and via the pause button (WCAG 2.2.2). Static under reduced motion. */
  var answer = $("[data-answer]");
  if (answer) {
    var textEl = $(".answer__text", answer);
    var pauseBtn = $(".answer__pause", answer);
    var chips = $$("[data-focus]", answer);
    var queries;
    try { queries = JSON.parse(answer.getAttribute("data-queries")); } catch (e) { queries = []; }
    var index = 0, paused = false, hovering = false, timer = null, typing = null;

    var highlight = function (key) {
      chips.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-focus") === key); });
    };
    var type = function (str, done) {
      var i = 0;
      clearInterval(typing);
      textEl.textContent = "";
      typing = setInterval(function () {
        i++;
        textEl.textContent = str.slice(0, i);
        if (i >= str.length) { clearInterval(typing); if (done) done(); }
      }, 34);
    };
    var show = function () {
      var q = queries[index];
      if (!q) return;
      highlight(q.focus);
      if (reduceMotion.matches) { textEl.textContent = q.text; return; }
      type(q.text);
    };
    var schedule = function () {
      clearTimeout(timer);
      if (paused || hovering || reduceMotion.matches || queries.length < 2) return;
      timer = setTimeout(function () {
        index = (index + 1) % queries.length;
        show();
        schedule();
      }, 5200);
    };
    if (queries.length) {
      highlight(queries[0].focus);
      if (!reduceMotion.matches && pauseBtn) {
        pauseBtn.hidden = false;
        pauseBtn.addEventListener("click", function () {
          paused = !paused;
          pauseBtn.setAttribute("aria-pressed", String(paused));
          pauseBtn.setAttribute("aria-label", paused ? "Play example questions" : "Pause example questions");
          pauseBtn.innerHTML = paused ? pauseBtn.getAttribute("data-play") : pauseBtn.getAttribute("data-pause");
          schedule();
        });
        answer.addEventListener("mouseenter", function () { hovering = true; clearTimeout(timer); });
        answer.addEventListener("mouseleave", function () { hovering = false; schedule(); });
        answer.addEventListener("focusin", function () { hovering = true; clearTimeout(timer); });
        answer.addEventListener("focusout", function () { hovering = false; schedule(); });
        schedule();
      }
    }
  }

  /* Filter helper used by projects and blog */
  var announce = function (el, count, noun) {
    if (!el) return;
    el.textContent = count === 1 ? "Showing 1 " + noun : "Showing " + count + " " + noun + "s";
  };

  /* Project filters */
  var projectFilters = $("[data-project-filters]");
  if (projectFilters) {
    var cards = $$("[data-project]");
    var pStatus = $("[data-project-status]");
    var pEmpty = $("[data-project-empty]");
    projectFilters.hidden = false;
    projectFilters.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      var value = btn.getAttribute("data-filter");
      $$("[data-filter]", projectFilters).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      var shown = 0;
      cards.forEach(function (card) {
        var cats = card.getAttribute("data-categories").split("|");
        var match = value === "all" || cats.indexOf(value) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      if (pEmpty) pEmpty.hidden = shown !== 0;
      announce(pStatus, shown, "project");
    });
  }

  /* Blog: category filter + search + load more */
  var blog = $("[data-blog]");
  if (blog) {
    var rows = $$("[data-post]", blog);
    var search = $("[data-blog-search]");
    var catBar = $("[data-blog-filters]");
    var more = $("[data-load-more]");
    var bStatus = $("[data-blog-status]");
    var bEmpty = $("[data-blog-empty]");
    var pageSize = parseInt(blog.getAttribute("data-page-size") || "6", 10);
    var limit = pageSize, activeCat = "all";

    var params = new URLSearchParams(window.location.search);
    if (params.get("category")) activeCat = params.get("category");

    var render = function () {
      var term = (search && search.value || "").trim().toLowerCase();
      var matches = rows.filter(function (row) {
        var catOk = activeCat === "all" || row.getAttribute("data-category") === activeCat;
        var textOk = !term || row.getAttribute("data-search").indexOf(term) !== -1;
        return catOk && textOk;
      });
      rows.forEach(function (row) { row.hidden = true; });
      matches.slice(0, limit).forEach(function (row) { row.hidden = false; });
      if (more) more.hidden = matches.length <= limit;
      if (bEmpty) bEmpty.hidden = matches.length !== 0;
      announce(bStatus, Math.min(matches.length, limit), "article");
    };
    if (catBar) {
      catBar.hidden = false;
      $$("[data-filter]", catBar).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === activeCat));
      });
      catBar.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        activeCat = btn.getAttribute("data-filter");
        $$("[data-filter]", catBar).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        limit = pageSize;
        render();
      });
    }
    if (search) {
      search.closest(".search").hidden = false;
      search.addEventListener("input", function () { limit = pageSize; render(); });
    }
    if (more) more.addEventListener("click", function () {
      var firstHidden = rows.filter(function (r) { return r.hidden; })[0];
      limit += pageSize;
      render();
      if (firstHidden && !firstHidden.hidden) { var link = $("a", firstHidden); if (link) link.focus(); }
    });
    render();
  }

  /* Article table of contents: highlight the current section */
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var tocIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("is-current"); });
          var link = map[entry.target.id];
          if (link) link.classList.add("is-current");
        }
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) tocIO.observe(h); });
  }

  /* Contact form */
  var form = $("[data-contact-form]");
  if (form) {
    var status = $("[data-form-status]");
    var submit = $("button[type=submit]", form);
    var endpoint = form.getAttribute("action") || "";
    var icons = { error: form.getAttribute("data-icon-error") || "", success: form.getAttribute("data-icon-success") || "" };
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your name."; },
      email: function (v) {
        if (!v.trim()) return "Please enter your email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com.";
      },
      service: function (v) { return v ? "" : "Please choose the service you're interested in."; },
      subject: function (v) { return v.trim().length >= 3 ? "" : "Please add a short subject."; },
      message: function (v) {
        var n = v.trim().length;
        if (!n) return "Please write a message.";
        return n >= 20 ? "" : "Please add a little more detail — at least 20 characters.";
      },
    };
    var setError = function (field, msg) {
      var el = form.elements[field];
      var err = document.getElementById(field + "-error");
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.innerHTML = msg ? icons.error + "<span>" + msg + "</span>" : "";
    };
    var validate = function (field) {
      var msg = rules[field](form.elements[field].value);
      setError(field, msg);
      return !msg;
    };
    Object.keys(rules).forEach(function (field) {
      var el = form.elements[field];
      el.addEventListener("blur", function () { if (el.value) validate(field); });
      el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") validate(field); });
    });
    var showStatus = function (type, title, text) {
      status.className = "form-status form-status--" + type + " is-visible";
      status.innerHTML = icons[type] + "<div><strong>" + title + "</strong><p>" + text + "</p></div>";
      status.focus();
    };
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (f) { if (!validate(f) && !firstBad) firstBad = f; });
      if (firstBad) {
        status.className = "form-status";
        form.elements[firstBad].focus();
        return;
      }
      if (form.elements._gotcha && form.elements._gotcha.value) return; // bot
      if (!endpoint) {
        var fallback = form.getAttribute("data-fallback-email");
        showStatus("error", "The form isn't connected yet.",
          fallback
            ? "Your message wasn't sent. Please email <a href=\"mailto:" + fallback + "\">" + fallback + "</a> instead."
            : "Your message wasn't sent because no form service has been configured for this site yet.");
        return;
      }
      submit.disabled = true;
      var label = submit.querySelector("span");
      var original = label.textContent;
      label.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          Object.keys(rules).forEach(function (f) { form.elements[f].removeAttribute("aria-invalid"); });
          showStatus("success", "Thank you — your message has been sent.", "I'll read it and reply to the email address you provided.");
        })
        .catch(function () {
          showStatus("error", "Something went wrong.", "Your message wasn't sent. Please check your connection and try again.");
        })
        .then(function () { submit.disabled = false; label.textContent = original; });
    });
  }

  /* Back to top */
  var toTop = $(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 1.5);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
      var skip = $("#main");
      if (skip) skip.focus({ preventScroll: true });
    });
  }

  /* Current year in footer */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
