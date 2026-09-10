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

    const bismillahEl = document.getElementById("heroBismillah");
    const bismillahEnEl = document.getElementById("heroBismillahEn");
    if (cfg.showBismillah) {
      bismillahEl.hidden = false;
      bismillahEnEl.hidden = false;
    } else {
      bismillahEl.hidden = true;
      bismillahEnEl.hidden = true;
    }
    document.getElementById("heroBlessing").textContent = cfg.invitationBlessing;
    document.getElementById("heroInviteLine").textContent = cfg.invitationInviteLine;

    // Derived from the single nikkahDateISO source of truth, so the
    // invitation-style date block (month / day-name / day-number / year)
    // always matches the countdown and everywhere else on the site.
    const nikkahDate = new Date(cfg.nikkahDateISO);
    document.getElementById("heroMonth").textContent =
      nikkahDate.toLocaleDateString("en-US", { month: "long" });
    document.getElementById("heroDay").textContent =
      nikkahDate.toLocaleDateString("en-US", { weekday: "long" });
    document.getElementById("heroDateNum").textContent = nikkahDate.getDate();
    document.getElementById("heroYear").textContent = nikkahDate.getFullYear();
    document.getElementById("heroTime").textContent = cfg.nikkahTimeDisplay;

    document.getElementById("heroVenue").textContent =
      `${cfg.venueName}, ${cfg.venueAddress}`;
    document.getElementById("navBrand").textContent =
      `${cfg.groom[0]} & ${cfg.bride[0]}`;
    document.title = `${cfg.groom} & ${cfg.bride} — Our Nikkah`;

    document.getElementById("detailDate").textContent = cfg.nikkahDateDisplay;
    document.getElementById("detailTime").textContent = cfg.nikkahTimeDisplay;
    document.getElementById("detailVenue").textContent =
      `${cfg.venueName}, ${cfg.venueAddress}`;
    document.getElementById("detailNote").textContent = cfg.venueNote;

    if (cfg.hasReception) {
      document.getElementById("receptionDate").textContent = cfg.receptionDateDisplay;
      document.getElementById("receptionTime").textContent = cfg.receptionTimeDisplay;
      document.getElementById("receptionVenue").textContent =
        `${cfg.receptionVenueName}, ${cfg.receptionVenueAddress}`;
      document.getElementById("receptionNote").textContent = "";
    }

    document.getElementById("locationText").textContent =
      `${cfg.venueName} · ${cfg.venueAddress}`;
    document.getElementById("mapEmbed").src =
      `https://maps.google.com/maps?q=${encodeURIComponent(cfg.mapQuery)}&output=embed`;

    document.getElementById("rsvpBy").textContent = cfg.rsvpByDisplay;
    document.getElementById("footerNames").textContent = `${cfg.groom} & ${cfg.bride}`;
  }

  /* ---------- Countdown ---------- */
  function startCountdown() {
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
      '.hero-nav a[data-section], .menu-list a[data-section]'
    );
    const sectionIds = ["top", "details", "location", "rsvp"];
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

    const unit =
      `${cfg.groom} &amp; ${cfg.bride}` +
      ` <span aria-hidden="true">&#9670;</span> ` +
      `${cfg.nikkahDateDisplay}` +
      ` <span aria-hidden="true">&#9670;</span> ` +
      `${cfg.venueName}` +
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
      data.coupleNames = `${cfg.groom} & ${cfg.bride}`;

      // Fold the dynamically-added guest-name fields (guestName2,
      // guestName3, ... or the "5+" guestNamesExtra textarea) into one
      // clean "guestNames" string, so the Sheet/emails get a single tidy
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
        // and the two emails still send, but the response body is opaque —
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
