/* ============================================================
   SITE CONFIG — edit everything here, no need to touch other files
   ============================================================ */
const SITE_CONFIG = {
  groom: "Samil Mehedi",
  bride: "Israt Humayra",

  // Shown in small caps under each name on the invitation.
  // Set either to "" to hide that line.
  groomParents: "Son of Solaiman Mehedi and Fatema Begum",
  brideParents: "Daughter of Humayun Kabir and Sultana Parvin",

  // ISO date used by the countdown — keep the T15:00:00 (3pm) format
  nikkahDateISO: "2026-10-17T15:00:00",
  nikkahDateDisplay: "Saturday, October 17, 2026",

  // The live countdown clock. Off by default — the invitation reads more
  // like a printed card without it. Flip to true to bring it back.
  showCountdown: false,

  // Order of the day, shown in the Nikkah Itinerary section. Add/remove/reorder
  // freely — the section renders straight from this list. `icon` picks the
  // circle icon: arrival, rings, speech, prayer, dinner or cake. The first
  // item also shows the venue and the Get Directions button.
  itinerary: [
    { time: "3:00 PM", title: "Guest Arrivals & Appetizers", icon: "arrival" },
    { time: "4:00 PM", title: "Nikkah", icon: "rings" },
    { time: "5:00 PM", title: "Speeches", icon: "speech" },
    { time: "6:00 PM", title: "Prayers", icon: "prayer" },
    { time: "7:00 PM", title: "Dinner", icon: "dinner" },
    { time: "8:00 PM", title: "Cake Cutting", icon: "cake" },
  ],

  venueName: "Uddin's Misti",
  venueAddress: "72 Boulevard Saint Jean Baptiste Local 122, Châteauguay, Quebec J6K 4Y7",

  // Home page invitation card wording
  showBismillah: true, // the Arabic invocation + translation at the top
  invitationBlessing: "With the blessings of our families,",
  invitationInviteLine: "Joyfully invite you to celebrate their",

  // ---- Du'a above the details section ----
  duaArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
  duaTranslation: "\u201cAnd We created you in pairs.\u201d",
  duaSource: "Qur'an 78:8",

  // Google Maps embed search query — auto-builds from venue name + address above
  get mapQuery() {
    return `${this.venueName}, ${this.venueAddress}`;
  },

  // ---- RSVP form submission (Google Sheets + Apps Script) ----
  // No signup, no monthly submission cap, and it's free.
  // Full setup steps are in google-apps-script/Code.gs — short version:
  //   1. Create a Google Sheet.
  //   2. Extensions → Apps Script → paste in google-apps-script/Code.gs.
  //   3. Deploy → New deployment → Web app → Execute as Me → Anyone can access.
  //   4. Paste the resulting URL (ends in /exec) below.
  // Until this is set, submissions are only saved locally in the guest's
  // browser and shown as a confirmation — nothing is emailed to anyone yet.
  //
  // Once set up, every RSVP sends TWO emails automatically (see Code.gs):
  //   - to you: a notification, at the OWNER_EMAIL set in Code.gs
  //   - to the guest: a confirmation of what they submitted
  // ...and every RSVP is also logged as a row in that Google Sheet.
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbwnXSgwzXSppOu2vGHEuB_MgeATGicrWaZhDKugF_xYxoUPi3Qg16s5u2y1lXQYwFuY/exec"

};
