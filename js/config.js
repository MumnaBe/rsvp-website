/* ============================================================
   SITE CONFIG — edit everything here, no need to touch other files
   ============================================================ */
const SITE_CONFIG = {
  groom: "Samil Mehedi",
  bride: "Israt Humayra",

  // ISO date used by the countdown — keep the T15:00:00 (3pm) format
  nikkahDateISO: "2026-10-17T15:00:00",
  nikkahDateDisplay: "Saturday, October 17, 2026",
  nikkahTimeDisplay: "3:00 PM",

  venueName: "Uddin's Mishti",
  venueAddress: "72 Boulevard Saint Jean Baptiste Local 122, Châteauguay, Quebec J6K 4Y7",

  // Home page invitation card wording
  showBismillah: true, // the Arabic invocation + translation at the top
  invitationBlessing: "With the blessings of our families,",
  invitationInviteLine: "Joyfully invite you to celebrate their",

  // Google Maps embed search query — auto-builds from venue name + address above
  get mapQuery() {
    return `${this.venueName}, ${this.venueAddress}`;
  },

  // RSVP deadline shown on the form
  rsvpByDisplay: "September 24, 2026",

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
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbyhDWZ3cf8LP8pcknfsuZpRAu1WuVbFubVoN4QHIbFZo0IRTxOkXslW05jW92kj9SaN/exec"

};
