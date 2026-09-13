# KickStart Coach PWA

An installable, offline-friendly youth soccer coaching app for U9 teams. No build
step, no dependencies, no backend — plain HTML, CSS, and JavaScript.

## Features

- **Game log** — record results and a note on how the game went; notes are tagged
  automatically and drive the rest of the app
- Player roster and private coaching notes
- Practice-plan generator with a 33-drill U9 library
- Player evaluations and history
- Attendance check-in
- Game-day position planner
- JSON backup and restore
- PWA manifest and service worker for offline use

## How the game log works

After a game, log the result and say what happened in plain language:

> Lost 3-1. Defense got beat on the counter all game, and we kept giving the ball
> away on throw-ins.

That note is tagged **Defending** and **Passing**. The tagger reads each clause
separately, so praise does not become a practice focus — *"passing was great but
our finishing was terrible"* tags **Shooting** only. Every tag stays tappable if
the guess is wrong.

Those tags then feed:

| Tab | What it uses them for |
|-----|----------------------|
| Practice | A "From recent games" focus that rotates drills through your flagged areas, weighted by how often each came up, and avoids repeating last session's drills |
| Home | Season record, latest game, and current focus areas |
| Game Day | Scouting notes and in-game suggestions from recent form |
| Players | Names mentioned in notes link to a per-player game-note history |

Tags come from the last 5 log entries, so the focus follows current form.

## Run it locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy

Upload the repository root to any static host — Netlify, Cloudflare Pages, GitHub
Pages, or Vercel. HTTPS is required for installation and offline caching.

**When you deploy a change, bump `CACHE` in `sw.js`.** The service worker serves
cached files first, so installed apps keep running the old version until that
version string changes.

## Where your data lives

All data is stored in `localStorage` on the device, under a single key. Nothing is
sent anywhere, and there is no server or database.

That means storage is scoped to **device x browser x site address**. Each of these
is a separate, non-syncing copy:

- your phone vs. your laptop
- your phone vs. an assistant coach's phone
- Safari vs. Chrome on the same phone
- on iOS, the installed home-screen app vs. the same site in a browser tab

Another coach opening the site gets an empty app, not your roster. Use **Backup**
to export a JSON file and **Import backup** to move data between devices. Cloud
sync and shared team accounts are not included.

### Install the app to protect your data

iOS Safari clears `localStorage` for sites not visited in about 7 days. A team app
used once a week sits right at that limit. **Installing to the Home Screen exempts
it**, so install it before a season rather than after losing a roster. Export a
backup after any session you would not want to redo.

Renaming the site or moving to a custom domain changes the site address, and the
app will start empty. Export first if you do that.
