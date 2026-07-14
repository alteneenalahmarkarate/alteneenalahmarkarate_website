/* ═══════════════════════════════════════════════
   AL TENEEN AL AHMAR KARATE — site scripts
   ═══════════════════════════════════════════════ */

/* ✏️ ═══════════ EDIT YOUR DETAILS HERE ═══════════
   Put your WhatsApp number in international format,
   digits only — no "+", no spaces.
   Example: UAE mobile 050 123 4567  →  "971501234567"  */
const WHATSAPP_NUMBER = "971501643009"; // office number

const WHATSAPP_MESSAGE = {
  en: "Hello! I’d like to enquire about classes at AL TENEEN AL AHMAR KARATE CLUB.",
  ar: "مرحباً! أود الاستفسار عن الحصص في نادي التنين الأحمر للكاراتيه.",
};
/* ═══════════════ END OF EDIT SECTION ═══════════════ */

let currentLang = "en";

/* ── WhatsApp links ── */
function updateWhatsAppLinks() {
  const msg = encodeURIComponent(WHATSAPP_MESSAGE[currentLang]);
  document.querySelectorAll(".whatsapp-link").forEach((a) => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ── Language toggle (EN ⇄ AR) ── */
const langToggle = document.getElementById("langToggle");

function applyLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";
  langToggle.textContent = lang === "ar" ? "EN" : "عربي";

  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.dataset[lang];
    if (text) el.innerHTML = text;
  });

  updateWhatsAppLinks();
  try { localStorage.setItem("lang", lang); } catch (_) {}
}

langToggle.addEventListener("click", () => {
  applyLanguage(currentLang === "en" ? "ar" : "en");
});

/* restore saved language */
try {
  const saved = localStorage.getItem("lang");
  if (saved === "ar") applyLanguage("ar");
} catch (_) {}

updateWhatsAppLinks();

/* ── Navbar: solid on scroll ── */
const navbar = document.getElementById("navbar");
const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ── Mobile menu ── */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

/* ── Smooth eased scrolling between sections ── */
(function smoothAnchors() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      if (reduced) {
        target.scrollIntoView();
        history.pushState(null, "", id);
        return;
      }

      const navH = navbar.offsetHeight + 8;
      const startY = window.scrollY;
      const endY =
        id === "#hero"
          ? 0
          : target.getBoundingClientRect().top + startY - navH;
      const dist = endY - startY;
      // quick and snappy — starts fast, settles gently
      const duration = Math.min(700, Math.max(300, Math.abs(dist) * 0.18));
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

      (function step(now) {
        const p = Math.min((now - t0) / duration, 1);
        // behavior: "instant" so CSS scroll-behavior doesn't re-smooth every frame
        window.scrollTo({ top: startY + dist * ease(p), behavior: "instant" });
        if (p < 1) requestAnimationFrame(step);
        else history.pushState(null, "", id);
      })(t0);
    });
  });
})();

/* ── Scroll-reveal animations ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ── Gallery lightbox ── */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-item img").forEach((img) => {
  img.closest(".gallery-item").addEventListener("click", () => {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

/* ── Dragon-ember cursor ── */
(function emberCursor() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reducedMotion) return;

  document.body.classList.add("ember-cursor");

  const canvas = document.getElementById("emberCanvas");
  const ctx = canvas.getContext("2d");
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  let mouseX = -100, mouseY = -100;   // real pointer
  let ringX = -100, ringY = -100;     // ring lags behind
  let lastX = -100, lastY = -100;
  const particles = [];
  const COLORS = ["#e5383b", "#ff6b35", "#d4af37", "#ffd23f"];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // spawn embers proportional to pointer speed
    const speed = Math.hypot(mouseX - lastX, mouseY - lastY);
    const count = Math.min(Math.floor(speed / 8) + 1, 4);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 6,
        y: mouseY + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -Math.random() * 1.6 - 0.4,     // embers float upward
        size: Math.random() * 2.4 + 0.8,
        life: 1,
        decay: Math.random() * 0.025 + 0.015,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    lastX = mouseX;
    lastY = mouseY;

    // grow the ring over anything clickable
    const overInteractive = e.target.closest("a, button, .gallery-item, iframe");
    ring.classList.toggle("hovering", !!overInteractive);
  });

  window.addEventListener("mousedown", () => ring.classList.add("pressing"));
  window.addEventListener("mouseup", () => ring.classList.remove("pressing"));
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });

  (function loop() {
    // dot snaps to the pointer, ring eases after it
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.015;          // gentle lift, like rising sparks
      p.life -= p.decay;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    requestAnimationFrame(loop);
  })();
})();

/* ── Animated stat counters ── */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".stat-num").forEach((el) => statObserver.observe(el));
