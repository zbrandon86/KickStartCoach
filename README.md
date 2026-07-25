# KickStart Coach PWA

An installable, offline-friendly youth soccer coaching app.

## Included
- Player roster and private notes
- U9 practice-plan generator and drill library
- Player evaluations and history
- Attendance check-in
- Game-day position planner
- JSON backup and restore
- PWA manifest and service worker for offline use

## Test on Linux
```bash
cd soccer-coach-app
python3 -m http.server 8080
```
Open `http://localhost:8080`.

## Put it on your phone from anywhere
The app needs to be deployed over HTTPS for installation and offline caching. Upload this folder to any static host, such as GitHub Pages, Cloudflare Pages, Netlify, or Vercel. Then open the HTTPS address on your phone and use **Add to Home Screen** / **Install app**.

## Important data note
This build stores data on each device. Use **Backup** to export a JSON file and **Import backup** to move the roster and records to another device. Cloud account sync is not included yet.
