(() => {
  "use strict";

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* theme toggle · dark / light */
  const rootEl = document.documentElement;
  const themeToggle = $("#themeToggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (t) => {
    rootEl.dataset.theme = t;
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        t === "dark" ? "切换到浅色模式" : "切换到深色模式"
      );
    }
    if (metaTheme) {
      metaTheme.setAttribute("content", t === "dark" ? "#0b0f1a" : "#f4f6f9");
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = rootEl.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("mengjin-theme", next);
      } catch (e) {
        /* private mode: ignore */
      }
      applyTheme(next);
    });
  }
  applyTheme(rootEl.dataset.theme || "dark");

  /* nav: floating morph via sentinel observer (no scroll listener) */
  const nav = $("#siteNav");
  const sentinel = $(".nav-sentinel");
  if (nav && sentinel) {
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle("is-floating", !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    navObserver.observe(sentinel);
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* cinematic loader · cosmic counter */
  const loader = $("#siteLoader");
  const loaderWord = $("#loaderWord");
  const loaderCount = $("#loaderCount");
  const loaderBar = $("#loaderBar");
  const finishLoad = () => {
    document.documentElement.classList.remove("site-loading");
    if (loader) {
      loader.classList.add("done");
      setTimeout(() => {
        loader.hidden = true;
      }, 600);
    }
  };
  if (loader && !reducedMotion) {
    const words = ["洞察", "创造", "打磨", "增长"];
    let wi = 0;
    const wordTimer = setInterval(() => {
      wi = (wi + 1) % words.length;
      if (loaderWord) {
        loaderWord.textContent = words[wi];
        loaderWord.classList.remove("swap");
        void loaderWord.offsetWidth;
        loaderWord.classList.add("swap");
      }
    }, 340);
    const loaderDuration = 1150;
    const loaderStart = performance.now();
    const loaderTick = (now) => {
      const p = Math.min(1, (now - loaderStart) / loaderDuration);
      const eased = 1 - Math.pow(1 - p, 3);
      if (loaderCount) {
        loaderCount.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      }
      if (loaderBar) {
        loaderBar.style.transform = `scaleX(${eased.toFixed(3)})`;
      }
      if (p < 1) {
        requestAnimationFrame(loaderTick);
      } else {
        clearInterval(wordTimer);
        finishLoad();
      }
    };
    requestAnimationFrame(loaderTick);
  } else {
    finishLoad();
  }

  /* contact video · lazy mirrored loop (only when in view + dark theme) */
  const contactVideoWrap = $(".contact__video");
  const contactVideoEl = contactVideoWrap ? $(".contact__video-el", contactVideoWrap) : null;
  if (contactVideoEl && !reducedMotion) {
    let inView = false;
    const tryPlay = () => {
      if (rootEl.dataset.theme !== "light") {
        contactVideoEl.play().catch(() => {});
      }
    };
    const contactVObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          tryPlay();
        } else {
          contactVideoEl.pause();
        }
      },
      { threshold: 0.12 }
    );
    contactVObserver.observe(contactVideoWrap);
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        if (rootEl.dataset.theme === "light") {
          contactVideoEl.pause();
        } else if (inView) {
          tryPlay();
        }
      });
    }
  }

  /* hero title · character entrance */
  const heroName = $(".hero__name");
  if (heroName && !reducedMotion) {
    const text = heroName.textContent.trim();
    heroName.setAttribute("aria-label", text);
    heroName.textContent = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", i);
      span.textContent = ch === " " ? "\u00A0" : ch;
      heroName.appendChild(span);
    });
  }

  /* bento · cursor spotlight */
  if (finePointer && !reducedMotion) {
    $$(".cell").forEach((cell) => {
      let raf = null;
      cell.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = cell.getBoundingClientRect();
          cell.style.setProperty("--mx", `${e.clientX - r.left}px`);
          cell.style.setProperty("--my", `${e.clientY - r.top}px`);
          raf = null;
        });
      });
      cell.addEventListener("pointerleave", () => {
        cell.style.removeProperty("--mx");
        cell.style.removeProperty("--my");
      });
    });
  }

  /* primary CTAs · magnetic pull */
  if (finePointer && !reducedMotion) {
    $$(".btn--magnetic").forEach((btn) => {
      let raf = null;
      btn.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.16;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
          btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
          raf = null;
        });
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* mobile menu overlay */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const closeMenu = (returnFocus = false) => {
    navMenu.classList.remove("open");
    navMenu.hidden = true;
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开菜单");
    document.documentElement.classList.remove("menu-open");
    if (returnFocus) navToggle.focus({ preventScroll: true });
  };

  navToggle.addEventListener("click", () => {
    const open = navMenu.hidden;
    if (open) {
      navMenu.hidden = false;
      requestAnimationFrame(() => navMenu.classList.add("open"));
      navToggle.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "关闭菜单");
      document.documentElement.classList.add("menu-open");
      const firstLink = navMenu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else {
      closeMenu(true);
    }
  });

  $$("#navMenu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !navMenu.hidden) closeMenu(true);
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
          const match = a.getAttribute("href") === `#${id}`;
          a.classList.toggle("active", match);
          if (match) {
            a.setAttribute("aria-current", "true");
          } else {
            a.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-38% 0px -55% 0px" }
  );
  ["about", "capabilities", "projects", "timeline", "contact"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) spyObserver.observe(section);
  });

  /* click splash · feedback moment on primary CTAs */
  const burst = (x, y) => {
    if (reducedMotion) return;
    const splash = document.createElement("span");
    splash.className = "click-splash";
    splash.style.left = `${x - 13}px`;
    splash.style.top = `${y - 13}px`;
    document.body.appendChild(splash);
    splash.addEventListener("animationend", () => splash.remove(), { once: true });
  };

  $$(".btn--accent").forEach((btn) => {
    btn.addEventListener("click", (e) => burst(e.clientX, e.clientY));
  });

  /* hero rotor · motion-sites style keyword cycle */
  const rotor = $("#heroRotor");
  if (rotor && !reducedMotion) {
    const rotorWords = ["产品", "体验", "伙伴", "习惯"];
    let rotorIndex = 0;
    setInterval(() => {
      rotorIndex = (rotorIndex + 1) % rotorWords.length;
      rotor.classList.remove("rot");
      rotor.textContent = rotorWords[rotorIndex];
      void rotor.offsetWidth;
      rotor.classList.add("rot");
    }, 2600);
  }

  /* footer year */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
