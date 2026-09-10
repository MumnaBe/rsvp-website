/**
 * ============================================================
 * RSVP backend (Google Apps Script)
 * ============================================================
 */

const OWNER_EMAIL = "mumnabegum@gmail.com";

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
  const location = data.venueName
    ? `${data.venueName}${data.venueAddress ? ", " + data.venueAddress : ""}`
    : "";
  const body =
    `Hi ${data.fullName || "there"},\n\n` +
    `Thank you for your RSVP to ${coupleNames}'s nikkah!\n\n` +
    `Response: ${data.attending || "—"}\n` +
    `Guests: ${data.guestCount || "1"}\n` +
    (data.guestNames ? `Guest Names: ${data.guestNames}\n` : "") +
    (location ? `Location: ${location}\n` : "") +
    (data.notes ? `Notes: ${data.notes}\n` : "") +
    `\nWe look forward to celebrating with you! See you soon!\n\n${coupleNames}`;

  MailApp.sendEmail({ to: data.email, subject, body });
}


function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
