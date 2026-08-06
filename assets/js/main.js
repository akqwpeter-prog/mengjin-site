(() => {
  "use strict";

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* nav: N10 floating morph + scroll progress (rAF throttle, boolean guard) */
  const nav = $("#siteNav");
  const progress = $(".scroll-progress");
  const THRESHOLD = 80;
  let floating = false;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const next = y > THRESHOLD;
    if (next !== floating) {
      floating = next;
      nav.classList.toggle("is-floating", floating);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();

  /* mobile menu overlay */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const closeMenu = () => {
    navMenu.classList.remove("open");
    navMenu.hidden = true;
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开菜单");
  };

  navToggle.addEventListener("click", () => {
    const open = navMenu.hidden;
    if (open) {
      navMenu.hidden = false;
      requestAnimationFrame(() => navMenu.classList.add("open"));
      navToggle.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "关闭菜单");
    } else {
      closeMenu();
    }
  });

  $$("#navMenu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !navMenu.hidden) closeMenu();
  });

  /* scroll reveal */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* number counters */
  const format = (n) => n.toLocaleString("en-US");

  const animateCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased)) + suffix;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add("is-done");
      }
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  $$(".stat-num").forEach((el) => countObserver.observe(el));

  /* scrollspy */
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        $$("#navLinks a").forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-38% 0px -55% 0px" }
  );
  ["about", "capabilities", "projects", "timeline", "contact"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) spyObserver.observe(section);
  });

  /* star-burst · character moment on primary CTAs */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const burst = (x, y) => {
    if (reducedMotion) return;
    const star = document.createElement("span");
    star.className = "star-burst";
    star.style.left = `${x - 12}px`;
    star.style.top = `${y - 12}px`;
    document.body.appendChild(star);
    star.addEventListener("animationend", () => star.remove(), { once: true });
  };

  $$(".btn--pear").forEach((btn) => {
    btn.addEventListener("click", (e) => burst(e.clientX, e.clientY));
  });

  /* footer year */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
