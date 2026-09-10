/**
 * ============================================================
 * ISRAT & SAMIL — RSVP backend (Google Apps Script)
 * ============================================================
 * What this does:
 *   1. Receives each RSVP submission from the website.
 *   2. Logs it as a new row in this spreadsheet.
 *   3. Emails YOU a notification.
 *   4. Emails the GUEST a confirmation of what they submitted.
 *
 * No monthly submission cap — the only limit is Google's own daily
 * email-sending quota (100 recipients/day on a free @gmail.com account,
 * far more than any wedding needs, and it resets every 24 hours).
 *
 * ---- SETUP (one-time) — try Option A first ----
 *
 * Option A — bound to the Sheet (normal path):
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Name it whatever you like, e.g. "Israt & Samil RSVPs".
 * 2. In the menu: Extensions → Apps Script.
 * 3. Delete anything in the editor and paste this entire file in its place.
 * 4. Change OWNER_EMAIL below if it isn't already the address you want
 *    RSVPs sent to. Leave SHEET_ID as "" — not needed for this option.
 * 5. Skip to "Deploy" below.
 *
 * Option B — standalone script (use this if Extensions → Apps Script
 * won't open, e.g. it errors with a Google Drive "unable to open the
 * file" page):
 * 1. Still create the blank spreadsheet as in Option A step 1. Copy the
 *    long ID out of its URL — the part between /d/ and /edit, e.g. in
 *    https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOp/edit the ID
 *    is 1AbCdEfGhIjKlMnOp.
 * 2. Go to https://script.google.com/home directly, click "New project".
 * 3. Delete anything in the editor and paste this entire file in its place.
 * 4. Set SHEET_ID below to the ID you copied, and change OWNER_EMAIL if
 *    needed.
 *
 * ---- Deploy (same for both options) ----
 * 1. Click Deploy → New deployment.
 *    - Click the gear icon next to "Select type" → choose "Web app".
 *    - Description: anything (e.g. "RSVP endpoint").
 *    - Execute as: Me.
 *    - Who has access: Anyone.
 *    - Click Deploy.
 * 2. The first time, Google will ask you to authorize the script (it needs
 *    permission to send email and edit the spreadsheet). Click through the
 *    "Advanced" / "Go to (unsafe)" prompt — this is expected for scripts
 *    you write yourself, not a real security warning.
 * 3. Copy the "Web app" URL it gives you (ends in /exec).
 * 4. Paste that URL into `googleScriptUrl` in js/config.js on the website.
 *
 * If you ever change the code here, you must create a NEW deployment
 * (Deploy → Manage deployments → pencil icon → New version) for the
 * changes to take effect on the live URL.
 * ============================================================
 */

// ↓↓↓ Change this if RSVPs should go to a different inbox ↓↓↓
const OWNER_EMAIL = "mumnabegum@gmail.com";

// ↓↓↓ Only needed for Option B (standalone script) above — paste the
// spreadsheet ID between /d/ and /edit in its URL. Leave as "" for Option A.
const SHEET_ID = "";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    logToSheet_(data);
    notifyOwner_(data);
    confirmGuest_(data);

    return jsonResponse_({ result: "success" });
  } catch (err) {
    return jsonResponse_({ result: "error", message: String(err) });
  }
}

function getSheet_() {
  // Option A: bound script — getActiveSpreadsheet() works directly.
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active.getActiveSheet();

  // Option B: standalone script — open by the ID set above instead.
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  throw new Error(
    "No spreadsheet found. If this script isn't attached to a Sheet " +
      "(Option B in the setup notes), set SHEET_ID near the top of Code.gs."
  );
}

function logToSheet_(data) {
  const sheet = getSheet_();

  // Add a header row the first time the sheet is used.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Full Name",
      "Email",
      "Attending",
      "Guest Count",
      "Guest Names",
      "Notes",
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.fullName || "",
    data.email || "",
    data.attending || "",
    data.guestCount || "",
    data.guestNames || "",
    data.notes || "",
  ]);
}

function notifyOwner_(data) {
  const subject = `RSVP from ${data.fullName || "a guest"} — ${data.attending || ""}`;
  const body =
    `New RSVP received:\n\n` +
    `Name: ${data.fullName || "—"}\n` +
    `Email: ${data.email || "—"}\n` +
    `Attending: ${data.attending || "—"}\n` +
    `Guests: ${data.guestCount || "1"}\n` +
    (data.guestNames ? `Guest Names: ${data.guestNames}\n` : "") +
    `Notes: ${data.notes || "—"}\n`;

  MailApp.sendEmail({ to: OWNER_EMAIL, subject, body });
}

function confirmGuest_(data) {
  if (!data.email) return; // no address to confirm to

  const coupleNames = data.coupleNames || "the happy couple";
  const subject = `RSVP Confirmed — ${coupleNames}`;
  const body =
    `Hi ${data.fullName || "there"},\n\n` +
    `Thank you for your RSVP to ${coupleNames}'s nikkah!\n\n` +
    `Response: ${data.attending || "—"}\n` +
    `Guests: ${data.guestCount || "1"}\n` +
    (data.guestNames ? `Guest Names: ${data.guestNames}\n` : "") +
    (data.notes ? `Notes: ${data.notes}\n` : "") +
    `\nWe've got it — see you soon!\n${coupleNames}`;

  MailApp.sendEmail({ to: data.email, subject, body });
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
