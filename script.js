(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";

  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, window.SplitText);
  }

  /* ---------------------------------------------------------------------
     Header: solid background after scrolling past the hero
  --------------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  function updateHeaderState() {
    if (window.scrollY > 60) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.querySelectorAll("[data-nav-link]");
  navToggle.addEventListener("click", function () {
    var isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------------------
     Reveal-on-scroll for generic .reveal elements
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !hasGsap) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    revealEls.forEach(function (el) {
      // Hero elements get their own entrance timeline below.
      if (el.closest(".hero")) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: function () {
          el.classList.add("is-visible");
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        },
      });
    });

    // Stagger items inside grouped lists a little for a more orchestrated feel.
    document.querySelectorAll(".reveal-group").forEach(function (group) {
      var items = group.querySelectorAll(".reveal");
      items.forEach(function (item, i) {
        item.style.transitionDelay = "";
        ScrollTrigger.create({
          trigger: group,
          start: "top 85%",
          once: true,
          onEnter: function () {
            gsap.fromTo(
              item,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: "power2.out" }
            );
          },
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero entrance: signature moment (SplitText headline + staggered reveal)
  --------------------------------------------------------------------- */
  var heroEls = {
    eyebrow: document.querySelector(".hero .eyebrow"),
    sub: document.querySelector(".hero-sub"),
    actions: document.querySelector(".hero-actions"),
    portrait: document.querySelector(".hero-portrait"),
  };

  if (prefersReducedMotion || !hasGsap) {
    document.querySelectorAll(".hero .reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var tl = gsap.timeline({ delay: 0.2 });
    var titleEl = document.getElementById("hero-title");

    if (window.SplitText && titleEl) {
      var split = new SplitText(titleEl, { type: "words" });
      gsap.set(titleEl, { opacity: 1 });
      tl.from(split.words, {
        opacity: 0,
        y: 40,
        rotateX: -40,
        duration: 0.9,
        stagger: 0.04,
        ease: "power3.out",
      });
    } else if (titleEl) {
      tl.from(titleEl, { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
    }

    [heroEls.eyebrow, heroEls.sub, heroEls.actions].forEach(function (el) {
      if (!el) return;
      el.classList.add("is-visible");
      tl.from(el, { opacity: 0, y: 24, duration: 0.7, ease: "power2.out" }, "-=0.55");
    });

    if (heroEls.portrait) {
      heroEls.portrait.classList.add("is-visible");
      tl.from(heroEls.portrait, { opacity: 0, scale: 0.92, duration: 0.9, ease: "power2.out" }, "-=0.7");
    }
  }

  /* ---------------------------------------------------------------------
     Count-up numbers in the stats band
  --------------------------------------------------------------------- */
  var counters = document.querySelectorAll("[data-count-to]");
  counters.forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";

    function render(value) {
      el.textContent = prefix + Math.round(value) + suffix;
    }

    if (prefersReducedMotion || !hasGsap) {
      render(target);
      return;
    }

    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power1.out",
          onUpdate: function () { render(obj.val); },
        });
      },
    });
  });

  /* ---------------------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");

    question.addEventListener("click", function () {
      var isOpen = question.getAttribute("aria-expanded") === "true";

      faqItems.forEach(function (other) {
        if (other === item) return;
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        var otherAnswer = other.querySelector(".faq-answer");
        if (hasGsap && !prefersReducedMotion) {
          gsap.to(otherAnswer, { height: 0, duration: 0.35, ease: "power1.inOut" });
        } else {
          otherAnswer.style.height = "0px";
        }
      });

      question.setAttribute("aria-expanded", isOpen ? "false" : "true");

      if (isOpen) {
        if (hasGsap && !prefersReducedMotion) {
          gsap.to(answer, { height: 0, duration: 0.35, ease: "power1.inOut" });
        } else {
          answer.style.height = "0px";
        }
      } else {
        if (hasGsap && !prefersReducedMotion) {
          gsap.to(answer, { height: "auto", duration: 0.4, ease: "power1.inOut" });
        } else {
          answer.style.height = "auto";
        }
      }
    });
  });

  /* ---------------------------------------------------------------------
     Institutional video: lazy-load once the section nears the viewport
  --------------------------------------------------------------------- */
  var video = document.getElementById("institutional-video");
  if (video) {
    var saveData = navigator.connection && navigator.connection.saveData;

    if (saveData) {
      // Respect data-saver mode: keep only the poster image, never fetch the video.
    } else if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var src = video.getAttribute("data-src");
              if (src) {
                video.src = src;
                video.removeAttribute("data-src");
                video.load();
                video.play().catch(function () {});
              }
              observer.unobserve(video);
            }
          });
        },
        { rootMargin: "200px" }
      );
      observer.observe(video);
    } else {
      video.src = video.getAttribute("data-src");
    }
  }
})();
