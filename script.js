/* ==========================================================================
   MajorKey — behaviour + motion
   On Webflow: GSAP core + ScrollTrigger + SplitText come from the built-in
   GSAP integration (the CDN tags in the HTML are for the local preview only).
   Swiper comes from the template's Swiper CSS / Swiper JS code components.
   JS toggles classes/attributes only; it never authors styles.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initTabs();
  initFramework();
  initSliders();
  initNewsletter();
  initScrollTop();
  initMarquee();
  initMotion();
});

/* ---------------------------------------------------------------- Nav */
function initNav() {
  document.querySelectorAll("[data-nav]").forEach(function (nav) {
    if (nav.dataset.scriptInitialized) return;
    nav.dataset.scriptInitialized = "true";

    var toggle = nav.querySelector("[data-nav-toggle]");
    var menu = nav.querySelector("[data-nav-menu]");

    function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.dataset.state = open ? "open" : "closed";
    }
    toggle.addEventListener("click", function () { setOpen(!menu.classList.contains("is-open")); });
    nav.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    window.matchMedia("(min-width: 992px)").addEventListener("change", function () { setOpen(false); });
  });
}

/* ---------------------------------------------------------------- Tabs (customer success) */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach(function (component) {
    if (component.dataset.scriptInitialized) return;
    component.dataset.scriptInitialized = "true";

    var tabs = Array.prototype.slice.call(component.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(component.querySelectorAll("[data-tab-panel]"));

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        panels[i].classList.toggle("is-active", on);
        panels[i].inert = !on;
        panels[i].setAttribute("aria-hidden", on ? "false" : "true");
      });
      if (focus) tabs[index].focus();
      if (window.gsap) {
        var panel = panels[index];
        gsap.fromTo(panel.querySelectorAll(".success_panel_title, .success_panel_text, .success_panel_content .button_main_wrap, .success_panel_meta"),
          { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" });
        gsap.fromTo(panel.querySelector(".success_panel_img"), { opacity: 0 }, { opacity: 0.32, duration: 0.8, ease: "power2.out" });
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
  });
}

/* ---------------------------------------------------------------- Framework tabs (one open at a time) */
function initFramework() {
  document.querySelectorAll("[data-fw]").forEach(function (list) {
    if (list.dataset.scriptInitialized) return;
    list.dataset.scriptInitialized = "true";
    var items = Array.prototype.slice.call(list.querySelectorAll("[data-fw-item]"));
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setItem(item, open) {
      var trigger = item.querySelector("[data-fw-trigger]");
      var panel = item.querySelector("[data-fw-panel]");
      if (item.classList.contains("is-open") === open) return;
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      item.dataset.state = open ? "open" : "closed";
      if (!window.gsap || reduce) { panel.hidden = !open; return; }
      gsap.killTweensOf(panel);
      if (open) {
        panel.hidden = false;
        gsap.fromTo(panel, { height: 0 }, { height: "auto", duration: 0.5, ease: "power3.inOut" });
        gsap.fromTo(panel.firstElementChild.children, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, delay: 0.12, ease: "power2.out" });
      } else {
        gsap.to(panel, { height: 0, duration: 0.4, ease: "power3.inOut", onComplete: function () { panel.hidden = true; gsap.set(panel, { clearProps: "height" }); } });
      }
    }

    /* Wheel mirrors the selected tab; clicking a segment selects its tab */
    var wheel = list.closest(".framework_body") && list.closest(".framework_body").querySelector("[data-fw-wheel]");
    var segments = wheel ? Array.prototype.slice.call(wheel.querySelectorAll("[data-fw-segment]")) : [];

    function select(index) {
      items.forEach(function (other, i) { setItem(other, i === index); });
      if (!wheel) return;
      wheel.classList.add("is-selecting");
      segments.forEach(function (seg) { seg.classList.toggle("is-active", Number(seg.dataset.fwSegment) === index + 1); });
    }

    items.forEach(function (item, i) {
      item.querySelector("[data-fw-trigger]").addEventListener("click", function () { select(i); });
    });
    segments.forEach(function (seg) {
      seg.addEventListener("click", function () { select(Number(seg.dataset.fwSegment) - 1); });
    });
    var initial = items.findIndex(function (item) { return item.classList.contains("is-open"); });
    select(initial < 0 ? 0 : initial);
  });
}

/* ---------------------------------------------------------------- Sliders (Swiper) */
function initSliders() {
  if (!window.Swiper) return;
  document.querySelectorAll(".resources_section").forEach(function (section) {
    if (section.dataset.scriptInitialized) return;
    section.dataset.scriptInitialized = "true";
    var el = section.querySelector("[data-swiper]");
    var pagination = section.querySelector("[data-swiper-pagination]");
    new Swiper(el, {
      slidesPerView: 1.15,
      spaceBetween: 16,
      breakpoints: { 480: { slidesPerView: 1.6 }, 768: { slidesPerView: 2.3 }, 992: { slidesPerView: 3 }, 1200: { slidesPerView: 4, spaceBetween: 18 } },
      speed: 700,
      grabCursor: true,
      a11y: { enabled: true },
      pagination: {
        el: pagination,
        clickable: true,
        bulletElement: "button",
        bulletClass: "resources_slider_dot",
        bulletActiveClass: "is-active",
        modifierClass: "resources_slider_nav-",
        horizontalClass: "is-horizontal",
        clickableClass: "is-clickable",
      },
    });
  });
}

/* ---------------------------------------------------------------- Newsletter (no submission wired) */
function initNewsletter() {
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    if (form.dataset.scriptInitialized) return;
    form.dataset.scriptInitialized = "true";
    var input = form.querySelector("input[type=email]");
    var error = form.querySelector("[data-form-error]");
    var success = form.querySelector("[data-form-success]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      input.classList.toggle("is-error", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      error.hidden = ok;
      success.hidden = !ok;
      if (ok) form.reset();
    });
  });
}

/* ---------------------------------------------------------------- Back to top */
function initScrollTop() {
  document.querySelectorAll("[data-scroll-top]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  });
}

/* ---------------------------------------------------------------- Logo marquee
   Clones the real logo items once (aria-hidden) so the list stays a single
   editable source, then loops with GSAP. */
function initMarquee() {
  document.querySelectorAll("[data-marquee]").forEach(function (marquee) {
    if (marquee.dataset.scriptInitialized) return;
    marquee.dataset.scriptInitialized = "true";
    var list = marquee.querySelector("[data-marquee-list]");
    Array.prototype.slice.call(list.children).forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach(function (img) { img.alt = ""; });
      list.appendChild(clone);
    });
    if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var tween = gsap.to(list, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    marquee.addEventListener("mouseenter", function () { gsap.to(tween, { timeScale: 0.15, duration: 0.6 }); });
    marquee.addEventListener("mouseleave", function () { gsap.to(tween, { timeScale: 1, duration: 0.6 }); });
  });
}

/* ==========================================================================
   MOTION — block 1: simple tweens & timelines (convertible to Webflow IX3)
   ========================================================================== */
function initMotion() {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    /* Hero entrance */
    var hero = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
    hero.from(".nav_component", { y: -24, opacity: 0, duration: 0.8 }, 0);
    hero.from(".home_hero_section [data-reveal], .page_hero_section [data-reveal]", { y: 32, opacity: 0, duration: 1, stagger: 0.1 }, 0.45);
    hero.from(".home_hero_stat", { y: 32, opacity: 0, duration: 1, stagger: 0.1 }, 0.75);

    /* Hero media: scroll parallax */
    gsap.to("[data-hero-media]", {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".home_hero_section, .page_hero_section", start: "top top", end: "bottom top", scrub: true },
    });

    /* Single reveals (outside hero) */
    gsap.utils.toArray("main [data-reveal], .cta_section [data-reveal]").forEach(function (el) {
      if (el.closest(".home_hero_section, .page_hero_section")) return;
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    /* Group reveals: children stagger */
    gsap.utils.toArray("[data-reveal-group]").forEach(function (group) {
      gsap.from(group.children, { y: 48, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: group, start: "top 85%" } });
    });

    /* Section surfaces lift in */
    gsap.utils.toArray(".framework_section, .industries_section, .success_section, .cta_section, .testimonial_section, .logos_section").forEach(function (el) {
      gsap.from(el, { y: 60, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 95%" } });
    });

  });

  /* Reduced motion: no scroll or entrance motion — content is simply present. */

  initMotionAdvanced(mm);
}

/* ==========================================================================
   MOTION — block 2: SplitText, counters, stacking cards (custom code)
   ========================================================================== */
function initMotionAdvanced(mm) {
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    /* Hero headline — line mask reveal */
    document.fonts.ready.then(function () {
      document.querySelectorAll("[data-split]").forEach(function (el) {
        SplitText.create(el, {
          type: "lines", mask: "lines", autoSplit: true,
          onSplit: function (self) {
            return gsap.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out", delay: 0.2 });
          },
        });
      });

    });

    /* Counters */
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.countSuffix || "";
      var state = { v: 0 };
      gsap.to(state, {
        v: target, duration: 1.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate: function () { el.textContent = Math.round(state.v).toLocaleString("en-US") + suffix; },
      });
    });

    /* Stacking cards — the covered card's body fades as the next one arrives */
    var cards = gsap.utils.toArray("[data-stack-card]");
    cards.forEach(function (card, i) {
      var next = cards[i + 1];
      if (!next) return;
      gsap.to(card.querySelector("[data-stack-body]"), {
        opacity: 0, y: -24, ease: "none",
        scrollTrigger: { trigger: next, start: "top 70%", end: "top 35%", scrub: true },
      });
    });
  });
}
