(() => {
  "use strict";

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* header state + scroll progress */
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });

  $$("#navLinks a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "打开菜单");
    });
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
      if (p < 1) requestAnimationFrame(tick);
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

  /* hero cursor glow */
  const hero = $(".hero");
  const heroGlow = $("#heroGlow");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && heroGlow && finePointer) {
    let raf = 0;
    hero.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        heroGlow.style.background = `radial-gradient(460px circle at ${x * 100}% ${y * 100}%, rgba(56,225,255,0.09), transparent 65%)`;
        raf = 0;
      });
    });
  }

  /* terminal tilt */
  const terminalWrap = $("#terminalWrap");
  if (terminalWrap && finePointer) {
    terminalWrap.addEventListener("mousemove", (e) => {
      const rect = terminalWrap.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      terminalWrap.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    terminalWrap.addEventListener("mouseleave", () => {
      terminalWrap.style.transform = "";
    });
  }

  /* footer year */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
