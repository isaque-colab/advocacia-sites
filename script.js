/* =========================================================
   Almeida & Vasconcelos — interações
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Header ---------- */
  const header = $("#header");
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 24);
    if (toTop) toTop.hidden = y < 620;
    lastScroll = y;
  }

  /* ---------- Mobile navigation ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("no-scroll", open && window.innerWidth <= 960);
  }

  navToggle.addEventListener("click", () => {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });

  $$(".nav a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setNav(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setNav(false);
  });

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-link");
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");

  revealEls.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty("--d", delay);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Counters ---------- */
  const counters = $$(".counter");

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) {
      el.textContent = target.toLocaleString("pt-BR");
      return;
    }
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((c) => counterObserver.observe(c));
    }
  }

  /* ---------- Testimonials slider ---------- */
  const track = $("#sliderTrack");
  const slides = track ? $$(".slide", track) : [];
  const dotsWrap = $("#sliderDots");
  const prevBtn = $("#prevSlide");
  const nextBtn = $("#nextSlide");
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$("button", dotsWrap).forEach((dot, i) => {
      dot.setAttribute("aria-selected", String(i === current));
      dot.tabIndex = i === current ? 0 : -1;
    });
  }

  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 7000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Depoimento ${i + 1} de ${slides.length}`);
      dot.setAttribute("aria-selected", String(i === 0));
      dot.tabIndex = i === 0 ? 0 : -1;
      dot.addEventListener("click", () => {
        goTo(i);
        startAuto();
      });
      dotsWrap.appendChild(dot);
    });

    prevBtn.addEventListener("click", () => {
      goTo(current - 1);
      startAuto();
    });
    nextBtn.addEventListener("click", () => {
      goTo(current + 1);
      startAuto();
    });

    const slider = $(".slider");
    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", stopAuto);
    slider.addEventListener("focusout", startAuto);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    /* Swipe */
    let touchX = null;
    const viewport = $("#sliderViewport");
    viewport.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 45) goTo(current + (delta < 0 ? 1 : -1));
      touchX = null;
      startAuto();
    });

    goTo(0);
    startAuto();
  }

  /* ---------- FAQ accordion ---------- */
  const triggers = $$(".acc-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".acc-item");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach((other) => {
        if (other === trigger) return;
        other.setAttribute("aria-expanded", "false");
        other.closest(".acc-item").classList.remove("is-open");
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      item.classList.toggle("is-open", !isOpen);
    });
  });

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");

  if (form) {
    const success = $("#formSuccess");
    const phone = $("#telefone");

    const rules = {
      nome: (v) => v.trim().length >= 3 || "Informe seu nome completo.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Informe um e-mail válido.",
      telefone: (v) => v.replace(/\D/g, "").length >= 10 || "Informe um telefone com DDD.",
      area: (v) => v.trim() !== "" || "Selecione a área de interesse.",
      mensagem: (v) => v.trim().length >= 15 || "Descreva brevemente sua situação (mín. 15 caracteres).",
      lgpd: (_, checked) => checked || "É necessário autorizar o contato."
    };

    function fieldError(name, message) {
      const errorEl = $(`[data-error-for="${name}"]`);
      const field = form.querySelector(`[name="${name}"]`);
      const wrapper = field ? field.closest(".field") : null;

      if (errorEl) {
        errorEl.textContent = message || "";
        errorEl.classList.toggle("is-visible", Boolean(message));
      }
      if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
      if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateField(name) {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field || !rules[name]) return true;
      const value = field.type === "checkbox" ? "" : field.value;
      const result = rules[name](value, field.checked);
      const valid = result === true;
      fieldError(name, valid ? "" : result);
      return valid;
    }

    Object.keys(rules).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      const evt = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "blur";
      field.addEventListener(evt, () => validateField(name));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });
    });

    if (phone) {
      phone.addEventListener("input", () => {
        let digits = phone.value.replace(/\D/g, "").slice(0, 11);
        let out = digits;
        if (digits.length > 2) out = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length > 6) {
          const cut = digits.length > 10 ? 7 : 6;
          out = `(${digits.slice(0, 2)}) ${digits.slice(2, cut)}-${digits.slice(cut)}`;
        }
        phone.value = out;
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const names = Object.keys(rules);
      let firstInvalid = null;

      names.forEach((name) => {
        const ok = validateField(name);
        if (!ok && !firstInvalid) firstInvalid = form.querySelector(`[name="${name}"]`);
      });

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        firstInvalid.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      /* Simulação de envio — substitua por integração real (e-mail, CRM, API). */
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        form.reset();
        names.forEach((name) => fieldError(name, ""));
        success.hidden = false;
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        setTimeout(() => { success.hidden = true; }, 9000);
      }, 850);
    });
  }

  /* ---------- Privacy policy dialog ---------- */
  const privacyDialog = $("#privacyDialog");

  if (privacyDialog && typeof privacyDialog.showModal === "function") {
    const privacyClose = $("#privacyClose");

    $$("[data-privacy]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        privacyDialog.showModal();
        document.body.classList.add("no-scroll");
      });
    });

    if (privacyClose) {
      privacyClose.addEventListener("click", () => privacyDialog.close());
    }

    privacyDialog.addEventListener("click", (e) => {
      if (e.target === privacyDialog) privacyDialog.close();
    });

    privacyDialog.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
    });
  }

  /* ---------- Back to top ---------- */  const toTop = $("#toTop");

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Init ---------- */
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
