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

  /* Hero: soft light follows the pointer on devices with a mouse */
  var hero = $(".hero");
  if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion.matches) {
    var raf = null;
    hero.addEventListener("pointermove", function (ev) {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", (ev.clientX - r.left) + "px");
        hero.style.setProperty("--my", (ev.clientY - r.top) + "px");
        hero.classList.add("is-lit");
        raf = null;
      });
    });
    hero.addEventListener("pointerleave", function () { hero.classList.remove("is-lit"); });
  }

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Scroll progress bar and hero parallax */
  if (!reduceMotion.matches) {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking2 = false;
    var onScroll2 = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.scrollY;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      if (hero && y < window.innerHeight * 1.2) hero.style.setProperty("--py", String(y));
      ticking2 = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking2) { window.requestAnimationFrame(onScroll2); ticking2 = true; }
    }, { passive: true });
    onScroll2();
  }

  /* Magnetic buttons: a gentle pull toward the pointer */
  if (finePointer && !reduceMotion.matches) {
    $$(".btn, .btn-talk").forEach(function (btn) {
      btn.addEventListener("pointermove", function (ev) {
        var r = btn.getBoundingClientRect();
        var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = "translate(" + (dx * 8).toFixed(1) + "px," + (dy * 6).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* Smooth scrolling for mouse wheels and trackpads (touch keeps native scrolling) */
  var gsapOn = !!(window.gsap && window.ScrollTrigger) && !reduceMotion.matches;
  var lenis = null;
  if (window.Lenis && !reduceMotion.matches) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, anchors: true });
    if (gsapOn) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var lenisRaf = function (time) { lenis.raf(time); window.requestAnimationFrame(lenisRaf); };
      window.requestAnimationFrame(lenisRaf);
    }
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
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
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
  /* Staggered lists: children rise in one after another */
  if (!reduceMotion.matches) {
    $$(".why__list, .process, .tools, .posts, .service-index, .stats, .skills, .svc-list, .work-list").forEach(function (list) {
      list.setAttribute("data-stagger", "");
      list.classList.add("reveal");
      Array.prototype.forEach.call(list.children, function (child, i) { child.style.setProperty("--i", String(Math.min(i, 8))); });
    });
  }
  var revealEls = $$(".reveal");
  if (gsapOn) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    runGsap();
  } else if (revealEls.length && "IntersectionObserver" in window && !reduceMotion.matches) {
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

  /* GSAP motion layer: hero intros, split-word headings, scroll reveals, parallax */
  function splitWords(el) {
    var out = [];
    if (!el || el.getAttribute("data-split")) return out;
    el.setAttribute("data-split", "1");
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "w";
            var wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w); out.push(wi);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") { walk(n); }
      });
    })(el);
    return out;
  }

  function runGsap() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    document.documentElement.classList.add("gsap");
    var ease = "power4.out";

    /* Header pill drops in on every page */
    gsap.from(".site-header .container", { y: -30, opacity: 0, duration: 1.1, ease: ease, delay: 0.05, clearProps: "transform,opacity" });

    /* Home hero: glow blooms, headline lines rise from their masks, then text and buttons */
    if (hero) {
      var lines = $$(".hero h1 .line > span");
      gsap.set(lines, { yPercent: 110, y: 0 });
      gsap.timeline({ defaults: { ease: ease } })
        .from(".hero .hero__glow", { opacity: 0, scale: 1.2, duration: 2.4, ease: "power2.out" }, 0)
        .to(lines, { yPercent: 0, duration: 1.4, stagger: 0.16 }, 0.2)
        .to(".hero .hero__fade", { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.8);
      var heroOut = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero__stack", { yPercent: -14, opacity: 0.2, ease: "none", scrollTrigger: heroOut });
      gsap.to(".hero .hero__glow", { yPercent: 22, ease: "none", scrollTrigger: heroOut });
    }

    /* Inner-page heroes: title words rise, the rest fades up, case-study image unmasks */
    $$(".page-hero").forEach(function (ph) {
      var h = $("h1", ph);
      var words = splitWords(h);
      var inner = $(".page-hero__inner, .case-hero, .article-hero", ph);
      var rest = inner ? Array.prototype.filter.call(inner.children, function (c) { return c !== h; }) : [];
      var tl = gsap.timeline({ defaults: { ease: ease }, delay: 0.1 });
      tl.from($(".hero__glow", ph), { opacity: 0, scale: 1.2, duration: 2.2, ease: "power2.out" }, 0);
      if (words.length) tl.from(words, { yPercent: 115, duration: 1.2, stagger: 0.045 }, 0.1);
      if (rest.length) tl.from(rest, { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.45);
      var fig = $(".case-figure", ph);
      if (fig) tl.fromTo(fig, { clipPath: "inset(10% 6% 10% 6% round 24px)", y: 50 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", y: 0, duration: 1.5, clearProps: "clipPath" }, 0.55);
      gsap.to($(".hero__glow", ph), { yPercent: 25, ease: "none", scrollTrigger: { trigger: ph, start: "top top", end: "bottom top", scrub: true } });
    });

    /* Section titles: words rise one after another as they scroll in */
    $$("main h2[id$='-title']").forEach(function (h2) {
      if (h2.closest(".page-hero")) return;
      var words = splitWords(h2);
      if (!words.length) return;
      gsap.from(words, { yPercent: 115, duration: 1.1, ease: ease, stagger: 0.05, scrollTrigger: { trigger: h2, start: "top 88%", once: true } });
      var head = h2.closest(".section-head, .cta__inner");
      if (head) {
        var others = $$(":scope > :not(h2)", head);
        if (head.classList.contains("cta__inner")) others = $$(".cta__side > *", head);
        if (others.length) gsap.from(others, { opacity: 0, y: 26, duration: 1, ease: ease, stagger: 0.1, delay: 0.25, scrollTrigger: { trigger: h2, start: "top 88%", once: true } });
      }
    });

    /* Lists: items rise in sequence */
    $$("[data-stagger]").forEach(function (list) {
      var items = Array.prototype.slice.call(list.children);
      if (!items.length) return;
      gsap.from(items, { opacity: 0, y: 50, duration: 1.1, ease: ease, stagger: 0.09, scrollTrigger: { trigger: list, start: "top 86%", once: true } });
    });

    /* Everything else marked .reveal fades up in batches */
    var plain = $$(".reveal").filter(function (el) {
      return !el.hasAttribute("data-stagger") && !el.classList.contains("section-head") && !el.classList.contains("cta__inner") &&
        !(el.parentElement && el.parentElement.hasAttribute("data-stagger"));
    });
    if (plain.length) {
      gsap.set(plain, { opacity: 0, y: 40 });
      ST.batch(plain, { start: "top 90%", once: true, onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: ease, stagger: 0.1, overwrite: true }); } });
    }

    /* Project images: unmask on entry, then drift gently inside their frame while scrolling */
    $$(".work__media").forEach(function (m) {
      var img = $("img", m);
      gsap.fromTo(m, { clipPath: "inset(14% 10% 14% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.5, ease: ease, clearProps: "clipPath", scrollTrigger: { trigger: m, start: "top 88%", once: true } });
      if (img) gsap.fromTo(img, { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
    });

    /* CTA band: a slow scale-in as it arrives */
    $$(".cta").forEach(function (c) {
      gsap.from(c, { scale: 0.96, borderRadius: 40, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 55%", scrub: true } });
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener("load", function () { ST.refresh(); });
  }
})();
