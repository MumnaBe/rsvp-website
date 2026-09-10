/* ============================================================
   SITE CONFIG 
   ============================================================ */
const SITE_CONFIG = {
  groom: "Samil Mehedi",
  bride: "Israt Humayra",

  // ISO date used by the countdown 
  nikkahDateISO: "2026-10-17T15:00:00",
  nikkahDateDisplay: "Saturday, October 17, 2026",
  nikkahTimeDisplay: "3:00 PM",

  venueName: "Uddin's Mishti",
  venueAddress: "72 Boulevard Saint Jean Baptiste Local 122, Châteauguay, Quebec J6K 4Y7",

  showBismillah: true, 
  invitationBlessing: "With the blessings of our families,",
  invitationInviteLine: "Joyfully invite you to celebrate their",

  // Google Maps embed search query
  get mapQuery() {
    return `${this.venueName}, ${this.venueAddress}`;
  },

  // RSVP deadline 
  rsvpByDisplay: "September 24, 2026",

  googleScriptUrl: "https://script.google.com/macros/s/AKfycbxsnqdr-zVAV4te0JFMtTMNSyeCLquZSBDm3UXHv3kf1lPF44Gqjk7ooJCXjnkDLvtm/exec"
};
