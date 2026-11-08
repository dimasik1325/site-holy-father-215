/* ============================================================
   holy_father_215 — interactions
   Плеер и чат Twitch собираются с корректным parent-параметром,
   поэтому встраивание работает на любом домене (и на localhost).
   ============================================================ */
(function () {
  "use strict";

  var CHANNEL = "holy_father_215";

  /* ---------- Twitch parent ---------- */
  // Twitch требует, чтобы parent совпадал с доменом страницы.
  // Берём текущий hostname; для file:// и пустого значения — localhost.
  function getParent() {
    var host = (window.location.hostname || "").trim();
    if (!host) return "localhost";
    return host;
  }

  var PARENT = getParent();

  var playerSrc =
    "https://player.twitch.tv/?channel=" + CHANNEL +
    "&parent=" + encodeURIComponent(PARENT) +
    "&autoplay=false";

  var chatSrc =
    "https://www.twitch.tv/embed/" + CHANNEL + "/chat?parent=" +
    encodeURIComponent(PARENT) + "&darkpopout";

  var player = document.getElementById("twitchPlayer");
  var chat = document.getElementById("twitchChat");
  var playerSkeleton = document.getElementById("playerSkeleton");
  var chatSkeleton = document.getElementById("chatSkeleton");

  function hideSkeleton(el) {
    if (!el) return;
    el.style.transition = "opacity .35s ease";
    el.style.opacity = "0";
    window.setTimeout(function () { el.style.display = "none"; }, 400);
  }

  function mountEmbeds() {
    if (player && player.dataset.loaded !== "1") {
      player.addEventListener("load", function () { hideSkeleton(playerSkeleton); }, { once: true });
      player.src = playerSrc;
      player.dataset.loaded = "1";
      // страховка: если событие load не пришло (бывает в iframe-окружениях)
      window.setTimeout(function () { hideSkeleton(playerSkeleton); }, 6000);
    }

    if (chat && chat.dataset.loaded !== "1") {
      chat.addEventListener("load", function () { hideSkeleton(chatSkeleton); }, { once: true });
      chat.src = chatSrc;
      chat.dataset.loaded = "1";
      window.setTimeout(function () { hideSkeleton(chatSkeleton); }, 6000);
    }
  }

  // Немного откладываем, чтобы сначала отрисовалась страница
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(mountEmbeds, { timeout: 1200 });
  } else {
    window.setTimeout(mountEmbeds, 250);
  }

  /* ---------- reload player ---------- */
  var reloadBtn = document.getElementById("reloadPlayer");
  if (reloadBtn && player) {
    reloadBtn.addEventListener("click", function () {
      player.dataset.loaded = "";
      if (playerSkeleton) {
        playerSkeleton.style.display = "grid";
        playerSkeleton.style.opacity = "1";
      }
      player.src = playerSrc + "&reload=" + Date.now();
    });
  }

  /* ---------- live status (best effort) ---------- */
  // Публичный сервис decapi.me отдаёт статус канала без ключей и с CORS.
  // Если он недоступен — честно пишем «статус смотри в плеере», ничего не ломая.
  var statusBadge = document.getElementById("statusBadge");
  var statusText = document.getElementById("statusText");
  var livePill = document.getElementById("livePill");
  var livePillBar = document.getElementById("livePillBar");

  function setStatus(state, text) {
    if (statusBadge) statusBadge.dataset.state = state;
    if (statusText) statusText.textContent = text;
    var isLive = state === "live";
    if (livePill) livePill.hidden = !isLive;
    if (livePillBar) livePillBar.hidden = !isLive;
  }

  function loadLiveStatus() {
    if (!("fetch" in window)) {
      setStatus("idle", "Статус смотри в плеере");
      return;
    }

    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, 5000);

    fetch("https://decapi.me/twitch/uptime/" + CHANNEL, controller ? { signal: controller.signal } : undefined)
      .then(function (res) { return res.ok ? res.text() : Promise.reject(new Error("http " + res.status)); })
      .then(function (text) {
        window.clearTimeout(timer);
        var t = (text || "").trim();
        if (!t) throw new Error("empty");
        if (/offline|не в сети|не стримит/i.test(t)) {
          setStatus("offline", "Сейчас офлайн");
        } else {
          setStatus("live", "Сейчас в эфире");
        }
      })
      .catch(function () {
        window.clearTimeout(timer);
        setStatus("idle", "Статус смотри в плеере");
      });
  }

  loadLiveStatus();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    if (!burger || !mobileNav) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    mobileNav.hidden = true;
  }

  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Открыть меню" : "Закрыть меню");
      mobileNav.hidden = open;
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .player-card, .chat-card, .donate-grid, .week, .sunday-banner, .telegram-card, .hero-copy, .hero-art"
  );

  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
