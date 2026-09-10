# Israt & Samil — Nikkah Website

A single-page nikkah website in plain HTML/CSS/JavaScript 

## Structure

```
index.html        page markup
css/style.css      all styling (colors, fonts, layout, animations)
js/config.js       
js/main.js         page behaviour 
images/            
```

## Editing content

Everything text-based (names, date, RSVP deadline) lives in
**`js/config.js`**. 

The backend is **Google Sheets + Google Apps Script**

1. Create a new Google Sheet at https://sheets.google.com.
2. In it: **Extensions → Apps Script**, delete the placeholder code, and paste
   in the entire contents of `google-apps-script/Code.gs`.
3. **Deploy → New deployment → Web app** → Execute as **Me** → Who has access
   **Anyone** → Deploy. Approve the permission prompts (it needs to send email
   and edit the sheet — that "Google hasn't verified this app" warning is
   expected for a script you wrote yourself; click Advanced → Go to it).
4. Copy the Web app URL (ends in `/exec`).
5. Open `js/config.js` and set:
   ```js
   googleScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
6. Redeploy/refresh the site.

Once that's done, every submission:
- Is logged as a new row in your Google Sheet 
- Sends **you** a notification email at `OWNER_EMAIL`.
- Sends the **guest** a confirmation email of what they submitted.

The email wording for both is in `google-apps-script/Code.gs` (the
`notifyOwner_` and `confirmGuest_` functions) — edit and redeploy a new
version there if you want different wording.


## Running locally

Just open `index.html` in a browser:

```bash
cd rsvp-website
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying
No build step needed — deploy the folder as is.
