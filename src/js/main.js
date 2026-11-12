/* Iqra Batool — site behaviour. Vanilla JS plus GSAP, ScrollTrigger and Lenis
 * when they load. Every feature checks for its elements first, so this one
 * file serves the landing page, the case studies and the 404 page.
 * Without JavaScript the site still works: all content is in the HTML,
 * accordion panels stay open and nothing is hidden waiting for an animation. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var gsapOn = !!(window.gsap && window.ScrollTrigger) && !reduceMotion.matches;
  var refresh = function () { if (gsapOn) window.ScrollTrigger.refresh(); };

  /* Header: hides on scroll down, returns on scroll up */
  var header = $(".site-header");
  var nav = $("#site-nav");
  if (header) {
    var lastY = window.scrollY, ticking = false;
    var onScroll = function () {
      var y = window.scrollY;
      var menuOpen = nav && nav.classList.contains("is-open");
      var within = header.contains(document.activeElement);
      if (!menuOpen && !within && y > 320 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 320) header.classList.remove("is-hidden");
      lastY = y; ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  }

  /* Scroll progress bar */
  if (!reduceMotion.matches) {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var barTick = false;
    var setBar = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      barTick = false;
    };
    window.addEventListener("scroll", function () {
      if (!barTick) { window.requestAnimationFrame(setBar); barTick = true; }
    }, { passive: true });
    setBar();
  }

  /* Hero glow drifts toward the pointer */
  var glowHost = $(".hero, .case-top, .nf");
  var glow = glowHost && $(".hero__glow", glowHost);
  if (glow && finePointer && !reduceMotion.matches) {
    var gx = 22, gy = 38, tx = 22, ty = 38, glowRaf = 0;
    var stepGlow = function () {
      gx += (tx - gx) * 0.06; gy += (ty - gy) * 0.06;
      glow.style.setProperty("--mx", gx.toFixed(2) + "%");
      glow.style.setProperty("--my", gy.toFixed(2) + "%");
      glowRaf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.05 ? window.requestAnimationFrame(stepGlow) : 0;
    };
    glowHost.addEventListener("pointermove", function (ev) {
      var r = glowHost.getBoundingClientRect();
      tx = ((ev.clientX - r.left) / r.width) * 100;
      ty = ((ev.clientY - r.top) / r.height) * 100;
      if (!glowRaf) glowRaf = window.requestAnimationFrame(stepGlow);
    });
  }

  /* Magnetic buttons: a gentle pull toward the pointer */
  if (finePointer && !reduceMotion.matches) {
    $$(".btn, .btn-talk, .btn-cta").forEach(function (btn) {
      btn.addEventListener("pointermove", function (ev) {
        var r = btn.getBoundingClientRect();
        var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.translate = (dx * 8).toFixed(1) + "px " + (dy * 6).toFixed(1) + "px";
      });
      btn.addEventListener("pointerleave", function () { btn.style.translate = ""; });
    });
  }

  /* Smooth scrolling for mouse wheels and trackpads (touch keeps native scrolling) */
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
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
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
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { if (nav.classList.contains("is-open")) setOpen(false); }); });
    mq.addEventListener("change", function (e) { if (!e.matches) setOpen(false); });
  }

  /* Menu highlights the section being read */
  var spyLinks = $$("[data-spy]");
  if (spyLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-spy") === en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spyLinks.forEach(function (a) { var s = document.getElementById(a.getAttribute("data-spy")); if (s) spy.observe(s); });
    var heroEl = $(".hero");
    if (heroEl) new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && window.scrollY < window.innerHeight * 0.4) spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
    }, { threshold: 0.6 }).observe(heroEl);
  }

  /* Accordions (services and FAQ): one panel open at a time */
  $$("[data-acc]").forEach(function (acc) {
    var items = $$(".acc__item", acc);
    var setItem = function (item, open) {
      var head = $(".acc__head", item), panel = $(".acc__panel", item);
      item.classList.toggle("is-open", open);
      head.setAttribute("aria-expanded", String(open));
      if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
    };
    var openIndex = acc.hasAttribute("data-acc-open") ? parseInt(acc.getAttribute("data-acc-open"), 10) : -1;
    items.forEach(function (item, i) {
      setItem(item, i === openIndex);
      $(".acc__head", item).addEventListener("click", function () {
        var willOpen = !item.classList.contains("is-open");
        items.forEach(function (other) { setItem(other, other === item && willOpen); });
        window.setTimeout(refresh, 750);
      });
    });
  });

  /* Back to top */
  var toTop = $(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
      var main = $("#main");
      if (main) main.focus({ preventScroll: true });
    });
  }

  /* Current year in footer */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------------------------ GSAP motion */
  if (!gsapOn) return;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  document.documentElement.classList.add("gsap");
  var ease = "expo.out";

  /* Split a heading into masked words. An <em> slab moves as one piece. */
  function splitWords(el) {
    var out = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var mask = document.createElement("span"); mask.className = "wd";
          var inner = document.createElement("span"); inner.textContent = part;
          mask.appendChild(inner); frag.appendChild(mask); out.push(inner);
        });
        el.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== "BR") {
        var m = document.createElement("span"); m.className = "wd";
        el.replaceChild(m, n); m.appendChild(n); out.push(n);
      }
    });
    return out;
  }

  /* Header pill drops in */
  gsap.from(".site-header .container", { y: -40, opacity: 0, duration: 1.2, ease: ease, delay: 0.1, clearProps: "transform,opacity" });

  /* Hero: the three tiles land first, then the headline rises out of its masks */
  var hero = $(".hero");
  if (hero) {
    var words = $$(".hero__title .w > span", hero);
    var tiles = $$(".hero__title .tile", hero);
    gsap.timeline({ defaults: { ease: ease } })
      .from($(".hero__glow", hero), { opacity: 0, duration: 2.2, ease: "power2.out" }, 0)
      .from(tiles, { scale: 0, rotation: -120, duration: 1.1, stagger: 0.12, ease: "back.out(1.6)" }, 0.15)
      .from(words, { yPercent: 115, duration: 1.3, stagger: 0.07 }, 0.55)
      .from($$(".hero__notes li", hero), { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 1.2)
      .from($$(".hero__foot > *", hero), { opacity: 0, y: 28, duration: 1.1, stagger: 0.1 }, 1.25);

    /* The tiles keep turning slowly with the scroll */
    tiles.forEach(function (t, i) {
      gsap.to($("svg", t), { rotation: i % 2 ? -180 : 180, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "+=" + window.innerHeight, scrub: 0.6 } });
    });

    /* As the first sheet slides over, the pinned hero sinks back */
    var stack = $(".stack");
    ST.matchMedia({
      "(min-width: 900px) and (min-height: 600px)": function () {
        gsap.to($(".hero__inner", hero), {
          scale: 0.9, opacity: 0.25, yPercent: -5, ease: "none", transformOrigin: "50% 40%",
          scrollTrigger: { trigger: stack, start: "top bottom", end: "top top", scrub: true },
        });
        ST.create({ trigger: stack, start: "top top", onEnter: function () { hero.classList.add("is-covered"); }, onLeaveBack: function () { hero.classList.remove("is-covered"); } });
      },
    });
  }

  /* Headings: words rise one after another */
  $$("[data-split]").forEach(function (h) {
    var parts = splitWords(h);
    if (!parts.length) return;
    gsap.from(parts, { yPercent: 115, duration: 1.2, ease: ease, stagger: 0.06, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });

  /* Single blocks and groups fade up */
  $$("[data-rise]").forEach(function (el) {
    gsap.from(el, { y: 36, opacity: 0, duration: 1.1, ease: ease, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$("[data-rise-group]").forEach(function (group) {
    gsap.from(group.children, { y: 44, opacity: 0, duration: 1.1, ease: ease, stagger: 0.1, scrollTrigger: { trigger: group, start: "top 86%", once: true } });
  });

  /* Count-up facts */
  $$("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count")), dec = parseInt(el.getAttribute("data-decimals"), 10) || 0, suffix = el.getAttribute("data-suffix") || "";
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate: function () { el.textContent = o.v.toFixed(dec) + suffix; } });
  });

  /* Process: the line draws itself and each step lands as the line reaches it */
  var flow = $(".flow");
  if (flow) {
    var steps = $$(".flow__step", flow);
    ST.matchMedia({
      "(min-width: 1101px)": function () {
        var tl = gsap.timeline({ scrollTrigger: { trigger: flow, start: "top 78%", end: "bottom 62%", scrub: 0.8 } });
        tl.fromTo($(".flow__wave", flow), { clipPath: "inset(-20% 100% -20% -2%)" }, { clipPath: "inset(-20% -2% -20% -2%)", ease: "none", duration: steps.length }, 0);
        steps.forEach(function (s, i) {
          tl.from($(".flow__dot", s), { scale: 0, duration: 0.5, ease: "back.out(2.5)" }, i + 0.02)
            .from($$(".flow__num, h3, p", s), { opacity: 0, y: 24, duration: 0.7, stagger: 0.08, ease: "power3.out" }, i + 0.1);
        });
      },
      "(max-width: 1100px)": function () {
        gsap.from(steps, { y: 36, opacity: 0, duration: 1, ease: ease, stagger: 0.08, scrollTrigger: { trigger: flow, start: "top 85%", once: true } });
      },
    });
  }

  /* Work: each plate unmasks, and its picture drifts inside the frame */
  $$(".plate").forEach(function (plate) {
    var media = $(".plate__media", plate), img = $("img", plate);
    gsap.fromTo(media, { clipPath: "inset(100% 0% 0% 0% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.5, ease: ease, clearProps: "clipPath", scrollTrigger: { trigger: plate, start: "top 86%", once: true } });
    gsap.fromTo(img, { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from($(".plate__body", plate).children, { y: 30, opacity: 0, duration: 1, ease: ease, stagger: 0.07, scrollTrigger: { trigger: plate, start: "top 70%", once: true } });
  });

  /* Case study: the figure unmasks on load */
  var fig = $(".case-figure");
  if (fig) gsap.fromTo(fig, { clipPath: "inset(12% 6% 12% 6% round 14px)", y: 50, opacity: 0 }, { clipPath: "inset(0% 0% 0% 0% round 14px)", y: 0, opacity: 1, duration: 1.6, ease: ease, delay: 0.5, clearProps: "clipPath" });
  $$(".case-body > section, .case-meta > div").forEach(function (el) {
    gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: ease, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  /* Footer: the wordmark rises into place as the page ends */
  var mark = $(".footer__mark");
  if (mark) gsap.from(mark, { yPercent: 55, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".site-footer", start: "top 95%", end: "bottom bottom", scrub: 0.6 } });

  window.addEventListener("load", refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();
