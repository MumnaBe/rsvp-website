# Israt & Samil — Nikkah Website

A single-page nikkah website in plain HTML/CSS/JavaScript (no build step, no framework).
Gold / cream / ink theme, countdown timer, RSVP form, FAQ, and a location map.

## Structure

```
index.html        page markup
css/style.css      all styling (colors, fonts, layout, animations)
js/config.js       ← edit THIS to change any text, dates, or the RSVP endpoint
js/main.js         page behaviour (countdown, nav, FAQ accordion, RSVP submit)
images/            put your own photos here
```

## Editing content

Everything text-based (names, date, venue, FAQ, RSVP deadline) lives in
**`js/config.js`**. You don't need to touch the HTML — just edit the values there
and reload the page.

## Making the RSVP form actually reach you (and confirm to your guests)

Right now, submitted RSVPs are saved in the guest's own browser (so nothing is lost)
but nothing is emailed yet. The backend is **Google Sheets + Google Apps Script**
— free, no signup beyond your existing Google account, and no monthly submission
cap (the only limit is Google's own sending quota of 100 emails/day on a free
Gmail account, which resets daily and is far more than any wedding needs).

Full commented source lives in **`google-apps-script/Code.gs`** — copy that
file's setup steps, but in short:

1. Create a new Google Sheet at https://sheets.google.com.
2. In it: **Extensions → Apps Script**, delete the placeholder code, and paste
   in the entire contents of `google-apps-script/Code.gs`.
   - If that menu item errors with a Google Drive "unable to open the file"
     page instead of opening the script editor: go to
     https://script.google.com/home directly, click **New project**, and
     paste the code there instead. Then set the `SHEET_ID` constant near the
     top of `Code.gs` to your spreadsheet's ID (the long string between `/d/`
     and `/edit` in its URL) — full notes on this are in the file itself.
3. Change the `OWNER_EMAIL` constant near the top if it isn't already the
   inbox you want RSVPs sent to.
4. **Deploy → New deployment → Web app** → Execute as **Me** → Who has access
   **Anyone** → Deploy. Approve the permission prompts (it needs to send email
   and edit the sheet — that "Google hasn't verified this app" warning is
   expected for a script you wrote yourself; click Advanced → Go to it).
5. Copy the Web app URL (ends in `/exec`).
6. Open `js/config.js` and set:
   ```js
   googleScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
7. Redeploy/refresh the site.

Once that's done, every submission:
- Is logged as a new row in your Google Sheet (name, email, attending, guest
  count, notes) — filter/export it however you like.
- Sends **you** a notification email at `OWNER_EMAIL`.
- Sends the **guest** a confirmation email of what they submitted.

The email wording for both is in `google-apps-script/Code.gs` (the
`notifyOwner_` and `confirmGuest_` functions) — edit and redeploy a new
version there if you want different wording.

If you ever edit `Code.gs`, you need to make a **new deployment version**
for the change to reach the live URL: **Deploy → Manage deployments** →
pencil icon → **New version** → Deploy.

## Location map

The map on the Location section is built automatically from `venueName` +
`venueAddress` in `js/config.js`. Once you have the full street address for
Uddin's Mishti, update `venueAddress` and the map will pin the exact spot.

## Reception / Walima

Currently marked "to be announced." Once details are confirmed, in `js/config.js` set:
```js
hasReception: true,
receptionDateDisplay: "...",
receptionTimeDisplay: "...",
receptionVenueName: "...",
receptionVenueAddress: "...",
```

## Running locally

Just open `index.html` in a browser — or, for the most accurate preview
(fonts, map embed), serve it locally:

```bash
cd rsvp-website
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

This is a static site — any static host works. Easiest free options:

- **GitHub Pages**: push this folder to a GitHub repo, enable Pages in repo settings.
- **Netlify**: drag-and-drop the folder at https://app.netlify.com/drop.
- **Vercel**: `vercel` CLI or drag-and-drop import.

No build step needed — deploy the folder as-is.
