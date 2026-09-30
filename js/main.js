/* ============================================================
   ISRAT & SAMIL — Nikkah site behaviour
   ============================================================ */
(function () {
  "use strict";

  const cfg = SITE_CONFIG;

  /* ---------- Populate content from config ---------- */
  function populateContent() {
    document.getElementById("heroBride").textContent = cfg.bride;
    document.getElementById("heroGroom").textContent = cfg.groom;
    // Left empty in config, these stay blank and :empty hides the line.
    document.getElementById("heroGroomParents").textContent = cfg.groomParents || "";
    document.getElementById("heroBrideParents").textContent = cfg.brideParents || "";

    const bismillahEl = document.getElementById("heroBismillah");
    const bismillahEnEl = document.getElementById("heroBismillahEn");
    bismillahEl.hidden = !cfg.showBismillah;
    bismillahEnEl.hidden = !cfg.showBismillah;

    document.getElementById("heroBlessing").textContent = cfg.invitationBlessing;
    document.getElementById("heroInviteLine").textContent = cfg.invitationInviteLine;

    // Everything date-shaped is derived from the single nikkahDateISO
    // source of truth, so the invitation stamp, the details row and the
    // marquee can never drift apart.
    const nikkahDate = new Date(cfg.nikkahDateISO);
    const dd = String(nikkahDate.getDate()).padStart(2, "0");
    const mm = String(nikkahDate.getMonth() + 1).padStart(2, "0");
    const yyyy = nikkahDate.getFullYear();
    const dateStamp = `${dd} \u00b7 ${mm} \u00b7 ${yyyy}`;

    document.getElementById("heroDateStamp").textContent = dateStamp;
    document.getElementById("footerDateStamp").textContent = dateStamp;

    const monogram = `${cfg.groom[0]} & ${cfg.bride[0]}`;
    document.getElementById("navBrand").textContent = monogram;
    document.getElementById("footerMonogram").textContent = monogram;
    document.title = `${cfg.groom} & ${cfg.bride} — Our Nikkah`;

    // Du'a above the details
    document.getElementById("duaArabic").textContent = cfg.duaArabic || "";
    document.getElementById("duaTranslation").textContent = cfg.duaTranslation || "";
    document.getElementById("duaSource").textContent = cfg.duaSource || "";

    // Date heading above the schedule: "Saturday, October 17, 2026"
    document.getElementById("itinDate").textContent = nikkahDate.toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    );
  }

  /* ---------- Itinerary ---------- */
  // Line icons for the circles on the timeline, keyed by cfg.itinerary[].icon
  const ITINERARY_ICONS = {
    arrival: '<path d="M7 21V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V21M4 21h16M14 12.5h.01"/>',
    rings: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10.5 5.5 12 3.5l1.5 2"/>',
    speech: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4 4v-4h-.5A1.5 1.5 0 0 1 4 14.5z"/><path d="M8 9h8M8 12h5"/>',
    prayer: '<path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.5 7 7 0 0 1-5-13.5z"/>',
    dinner: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2-3 5v4h3v9"/>',
    cake: '<path d="M4 21h16M5 21v-7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7M5 17c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 5 0M12 13V9M12 6.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5z"/>',
  };

  // Built from cfg.itinerary so the order of the day lives in one place.
  // Each event is a card on a vertical line; the first card also carries
  // the venue and the Get Directions button.
  function renderItinerary() {
    const list = document.getElementById("itineraryList");
    if (!list || !Array.isArray(cfg.itinerary)) return;

    list.innerHTML = "";
    cfg.itinerary.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "timeline-item reveal";

      const icon = document.createElement("span");
      icon.className = "timeline-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML =
        `<svg viewBox="0 0 24 24">${ITINERARY_ICONS[item.icon] || '<circle cx="12" cy="12" r="3"/>'}</svg>`;

      const card = document.createElement("div");
      card.className = "timeline-card";

      const time = document.createElement("span");
      time.className = "timeline-time";
      time.textContent = item.time;

      const title = document.createElement("h3");
      title.className = "timeline-title";
      title.textContent = item.title;

      card.append(time, title);

      if (i === 0) {
        const place = document.createElement("p");
        place.className = "timeline-place";
        place.textContent = `${cfg.venueName} \u2014 ${cfg.venueAddress}`;

        // Opens the venue in Google Maps directions mode
        const btn = document.createElement("a");
        btn.className = "timeline-btn";
        btn.href =
          `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cfg.mapQuery)}`;
        btn.target = "_blank";
        btn.rel = "noopener";
        btn.innerHTML = 'Get Directions <span aria-hidden="true">&rsaquo;</span>';

        card.append(place, btn);
      }

      li.append(icon, card);
      list.appendChild(li);
    });
  }

  /* ---------- Countdown ---------- */
  function startCountdown() {
    const wrap = document.getElementById("countdown");
    if (!cfg.showCountdown) return; // stays [hidden] as authored in the markup
    wrap.hidden = false;

    const target = new Date(cfg.nikkahDateISO).getTime();
    const els = {
      days: document.getElementById("cdDays"),
      hours: document.getElementById("cdHours"),
      mins: document.getElementById("cdMins"),
      secs: document.getElementById("cdSecs"),
    };

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        els.days.textContent = "00";
        els.hours.textContent = "00";
        els.mins.textContent = "00";
        els.secs.textContent = "00";
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      els.days.textContent = String(days).padStart(2, "0");
      els.hours.textContent = String(hours).padStart(2, "0");
      els.mins.textContent = String(mins).padStart(2, "0");
      els.secs.textContent = String(secs).padStart(2, "0");
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------- Header scroll state ---------- */
  function initHeaderScroll() {
    const header = document.getElementById("siteHeader");
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Fullscreen menu (hamburger) ---------- */
  function initNavToggle() {
    const toggle = document.getElementById("navToggle");
    const overlay = document.getElementById("navLinks");

    function closeMenu() {
      overlay.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openMenu() {
      overlay.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", () => {
      const isOpen = overlay.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });
    overlay.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeMenu)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Active section tracking ---------- */
  function initActiveSection() {
    const navLinks = document.querySelectorAll(
      '.nav-inline a[data-section], .menu-list a[data-section]'
    );
    const sectionIds = ["top", "details", "rsvp"];
    const sections = sectionIds
      .map((id) => (id === "top" ? document.querySelector(".hero") : document.getElementById(id)))
      .filter(Boolean);

    function setActive(id) {
      navLinks.forEach((a) => {
        a.classList.toggle("is-active", a.dataset.section === id);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = sectionIds[sections.indexOf(entry.target)];
            setActive(id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Marquee ---------- */
  function initMarquee() {
    const tracks = document.querySelectorAll(".marquee-track");
    if (!tracks.length) return;

    const nikkahDate = new Date(cfg.nikkahDateISO);
    // Day-first, the way the printed invitation sets it: "17 OCTOBER 2026"
    const tickerDate =
      `${nikkahDate.getDate()} ` +
      `${nikkahDate.toLocaleDateString("en-US", { month: "long" })} ` +
      `${nikkahDate.getFullYear()}`;

    const unit =
      `${cfg.groom.split(" ")[0]} &amp; ${cfg.bride.split(" ")[0]}` +
      ` <span aria-hidden="true">&#9670;</span> ` +
      `${tickerDate}` +
      ` <span aria-hidden="true">&#9670;</span> ` +
      `Our Nikkah` +
      ` <span aria-hidden="true">&#9670;</span> `;
    // Repeat enough times to comfortably fill any screen width, then
    // duplicate the whole thing once more so the loop point is seamless.
    const half = unit.repeat(6);

    tracks.forEach((track) => {
      track.innerHTML = `<span class="marquee-half">${half}</span><span class="marquee-half">${half}</span>`;
    });
  }

  /* ---------- Extra guest name fields ---------- */
  // When "Number of Guests" is more than 1, ask for each additional guest's
  // name so the couple knows who's actually coming, not just a headcount.
  function initGuestNames() {
    const select = document.getElementById("guestCount");
    const container = document.getElementById("guestNamesContainer");
    if (!select || !container) return;

    function render() {
      const value = select.value;
      container.innerHTML = "";

      if (value === "5") {
        // "5+" is open-ended, so a free-text list is more practical than
        // guessing how many individual fields to render.
        container.innerHTML = `
          <div class="form-row">
            <label for="guestNamesExtra">Names of Additional Guests</label>
            <textarea id="guestNamesExtra" name="guestNamesExtra" rows="3" placeholder="One name per line"></textarea>
          </div>`;
        return;
      }

      const count = parseInt(value, 10);
      if (!count || count <= 1) return;

      let html = "";
      for (let i = 2; i <= count; i++) {
        html += `
          <div class="form-row">
            <label for="guestName${i}">Guest ${i} Full Name</label>
            <input type="text" id="guestName${i}" name="guestName${i}" />
          </div>`;
      }
      container.innerHTML = html;
    }

    select.addEventListener("change", render);
    render(); // in case the select isn't at its default value on load
  }

  /* ---------- Hide guest count when declining ---------- */
  // Doesn't make sense to ask "how many guests" if they're not coming at all.
  function initAttendingToggle() {
    const radios = document.querySelectorAll('input[name="attending"]');
    const guestRow = document.getElementById("guestCountRow");
    const guestNames = document.getElementById("guestNamesContainer");
    const guestCount = document.getElementById("guestCount");
    if (!radios.length || !guestRow || !guestNames || !guestCount) return;

    function render() {
      const checked = document.querySelector('input[name="attending"]:checked');
      const declining = !!checked && checked.value === "Regretfully Declines";
      guestRow.hidden = declining;
      guestNames.hidden = declining;
      if (declining) {
        guestCount.value = "1";
        guestNames.innerHTML = "";
      }
    }

    radios.forEach((r) => r.addEventListener("change", render));
    render(); // in case a radio is pre-checked on load
  }

  /* ---------- RSVP submit ---------- */
  function initRsvpForm() {
    const form = document.getElementById("rsvpForm");
    const status = document.getElementById("formStatus");
    const submitBtn = document.getElementById("rsvpSubmit");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      // Fold the dynamically-added guest-name fields (guestName2,
      // guestName3, ... or the "5+" guestNamesExtra textarea) into one
      // clean "guestNames" string, so the Sheet/email get a single tidy
      // field regardless of how many were rendered.
      const guestNameKeys = Object.keys(data).filter((k) => k.startsWith("guestName") && k !== "guestCount");
      if (guestNameKeys.length) {
        const names = guestNameKeys
          .map((k) => data[k])
          .join("\n")
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean)
          .join(", ");
        guestNameKeys.forEach((k) => delete data[k]);
        if (names) data.guestNames = names;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      status.textContent = "";
      status.className = "form-status";

      // Always keep a local copy so nothing is lost even before a backend is set up
      try {
        const saved = JSON.parse(localStorage.getItem("rsvps") || "[]");
        saved.push({ ...data, submittedAt: new Date().toISOString() });
        localStorage.setItem("rsvps", JSON.stringify(saved));
      } catch (_) {
        /* localStorage unavailable — ignore */
      }

      if (!cfg.googleScriptUrl) {
        // No backend configured yet — confirm receipt locally.
        status.textContent =
          "RSVP saved on this device. Add your Google Apps Script URL in js/config.js so responses reach you directly.";
        status.classList.add("success");
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
        form.reset();
        document.getElementById("guestNamesContainer").innerHTML = "";
        return;
      }

      try {
        // Apps Script web apps don't return CORS headers fetch() can read,
        // so this is sent "no-cors": the request still reaches the script
        // and the notification email still sends, but the response body is opaque —
        // there's no way to confirm success/failure from here. A network
        // failure (offline, blocked, etc.) is still caught below.
        await fetch(cfg.googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data),
        });

        status.textContent = "Thank you! Your RSVP has been received.";
        status.classList.add("success");
        form.reset();
        document.getElementById("guestNamesContainer").innerHTML = "";
      } catch (err) {
        status.textContent =
          "Something went wrong sending your RSVP. Please try again or contact us directly.";
        status.classList.add("error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    populateContent();
    renderItinerary();
    startCountdown();
    initHeaderScroll();
    initNavToggle();
    initMarquee();
    initReveal();
    initGuestNames();
    initAttendingToggle();
    initRsvpForm();
    initActiveSection();
  });
})();
