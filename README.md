# S.E.D. · Smile Every Day ☀️

A private-first, warm-and-gentle emotional journal prototype built with **HTML, CSS and vanilla JavaScript**. Designed for **GitHub + Vercel**, with **optional Cloudflare Workers AI**. No database, no frontend framework, and no npm install needed.

## What works

- Morning and evening check-ins with five feelings **plus Not sure**, optional notes and optional activities. Old entries can be edited or deleted.
- IndexedDB storage **on this device**. No journal content is sent to any remote service during normal use.
- Searchable journal and day/week/month mood charts, with unknown moods and missing entries excluded from averages.
- Own-your-data versioned JSON **export** and **merge/replace import**. The app can run offline after its first successful load, via a service worker.
- Indoor/outdoor preference and curated, optional activity ideas, plus external wellbeing resource links.
- On-demand Workers AI with **editable JSON preview + explicit checkbox**, protected by a prototype access code. No journal database or persistent API storage.
- Copyable prompt for use with the user's own AI provider, with no server request from S.E.D.
- Custom evening reminder while the app is open; browser notifications require separate permission and are not guaranteed if the tab is suspended.

## Quick start

For the local-only frontend, serve the folder over HTTP, for example:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. `file://` won't reliably support IndexedDB/PWA features. The cloud AI endpoint (`/api/reflect`) runs **on Vercel**, not with Python's static server. Everything else works locally.

## Publish via GitHub → Vercel

1. Create a new **private or public** GitHub repository (for example `sed-smile-every-day`). Upload/push **all files in this folder to the repository root**. Do **not** upload `.env` with credentials or any exported personal journal JSON.
2. In Vercel, choose **Add New → Project → Import Git Repository** and select the repo. Select **Other** as the framework preset. Set Root Directory to `./` and leave the build command blank.
3. Deploy. The diary, search, charts, JSON import/export and prompt copying work immediately. No Cloudflare credentials are required for these features.
4. To enable Workers AI, obtain a Cloudflare **Account ID** and **Workers AI API token** from the Cloudflare dashboard. Add the following in **Vercel → Project → Settings → Environment Variables** (Production and Preview as desired):

   - `CF_ACCOUNT_ID` (Cloudflare Account ID)
   - `CF_API_TOKEN` (restricted Workers AI API token)
   - `SED_AI_ACCESS_CODE` (a strong code of your choosing, shared only with authorized prototype testers)

5. **Redeploy** after adding environment variables, then enter your S.E.D. access code in the app's Insights tab. Do not put tokens in GitHub or in frontend code. Workers AI usage can incur charges or usage limits.

Cloudflare REST API reference: https://developers.cloudflare.com/workers-ai/get-started/rest-api/

## Structure

```text
index.html              Main interface
src/css/styles.css      Warm-and-gentle responsive styles
src/js/app.js           UI, journal, chart, import/export, AI preview
src/js/storage.js       Browser IndexedDB storage
src/js/journal.js       Pure validation, date and statistics functions
api/reflect.js          Vercel Function → Cloudflare Workers AI REST API
manifest.webmanifest    Installable app metadata
sw.js                   Static offline cache; never caches AI requests
icons/icon.svg          App icon
vercel.json             Security headers
.env.example            Environment variable names (no secrets)
tests/                  Node.js tests (run with node --test)
```

## Data and privacy boundaries

- S.E.D. does **not** store journal content on any S.E.D. server or database. IndexedDB in the browser stores the entries. Export files are saved to wherever the user chooses.
- If the user chooses **Ask Workers AI**, only the **currently displayed editable JSON** is submitted to the Vercel Function, which forwards the selected entries to Cloudflare. No server-side journal persistence is implemented. Service providers may still process or retain request metadata/content under their own policies, so this is **not an end-to-end offline AI experience**.
- The Cloudflare token is server-only; the API route requires `SED_AI_ACCESS_CODE` to deter anonymous abuse. This code is a **prototype control, not a production-grade user authentication or rate-limiting system**. Before public release, add proper abuse/rate protection and privacy review.
- Browsers may delete IndexedDB when site data is cleared, in private browsing, or under storage pressure. **Export JSON backups regularly.** This version does not have automatic file sync, encrypted backups, push notifications while closed, or any account recovery.
- Never put real journal JSON exports in a source-code repo or issue tracker.

### JSON format (v1)

```json
{
  "app": "sed-journal",
  "version": 1,
  "exportedAt": "2026-11-19T12:00:00.000Z",
  "entries": [
    {"date": "2026-11-19", "morning": {"mood": "unsure", "note": "Nothing special", "activity": "", "updatedAt": "2026-11-19T12:00:00.000Z"}, "evening": null}
  ],
  "settings": {"lifestyle": "both", "reminderTime": "21:00", "reminderEnabled": false}
}
```

Valid moods are `rough`, `heavy`, `even`, `okay`, `bright`, `unsure`, or `null` for text-only entries. Neither `unsure` nor `null` is numeric. Imports only accept this explicit file format to avoid silently corrupting a personal journal.

## Testing

```bash
node --test tests/*.test.mjs
```

No install step needed, requires Node.js 18 or newer for tests and Vercel's Node runtime for the AI Function.

## Prototype limitations

S.E.D. is not therapy, diagnosis, or an emergency service. AI summaries may be inaccurate; they should point back to original dates. Reminders only function when the app is open and running. The browser does not silently access a user's downloaded JSON after export; importing it is an explicit action. No personal journal backup is automatically uploaded to the cloud.
