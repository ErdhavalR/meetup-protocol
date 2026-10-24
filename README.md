# 🦆 Unofficial Meetup Protocol — V4

A complete self-hostable invitation website with a mischievous duck mascot, continuously escaping No button, accessible decline action, sound toggle, a configurable invitation editor, shareable links, SQLite response capture, and Docker support.

## Quick start — Windows (PowerShell)

Requires Node.js 20+ and Python 3.10+.

```powershell
npm install
npm run build
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r server/requirements.txt
$env:MEETUP_ADMIN_TOKEN = "replace-with-a-long-random-secret"
python -m uvicorn server.app:app --host 0.0.0.0 --port 8080
```

Open `http://localhost:8080/admin` for the invitation editor, enter the *same* admin token in the password box, and click **Connect / Refresh**. Customize texts, animations, jokes, activities, and time options. Click **Save new invitation**, then share its `/i/<code>` link. The backend captures explicit proposed meetups or explicit declines. Visit `/admin` to view responses (refresh to update).

**Development:** run `npm run dev` for the UI. To use API-backed invitation links with Vite, start the backend on port 8080 and Vite on 5173; Vite proxies `/api` to 8080. For actual shareable links, use the backend on 8080 or the Docker deployment.

## Quick start — Docker Compose

```sh
cp .env.example .env
# Edit .env; supply a unique, long MEETUP_ADMIN_TOKEN

docker compose up -d --build
```

Open `http://localhost:8080/admin`. SQLite data persists in the Docker named volume `meetup_data`.

## Self-host on the public internet

Use a VPS with a domain. Put the service behind Caddy/Nginx with HTTPS and forward traffic to `127.0.0.1:8080`. Do **not** expose the admin token or commit `.env`. Configure firewall, backups, and rate limiting at the reverse proxy for a public deployment.

## Visitor journey

- Intro → continuously escaping No button (hover/proximity on desktop; tap on mobile) → date/time → activities → summary → **Submit meetup proposal**.
- The separate **Actually, I can’t meet** link is always functional. On a hosted invitation, the visitor can choose **Send decline to inviter**. Neither action is automatically submitted until explicit confirmation.
- Sound uses Web Audio and can be muted. Reduced-motion preferences are respected.
- A date/time is a *proposal*, never an automatically confirmed appointment.
- `/` also works as a standalone preview; since it has no invitation ID, it cannot submit to the backend.

## Files

- `src/config.ts` – baseline invitation config / step engine definitions.
- `src/main.tsx` – animated visitor experience.
- `src/Admin.tsx` – private invitation editor and response dashboard.
- `src/Duck.tsx` – CSS-based animated duck mascot.
- `server/app.py` – FastAPI and SQLite.
- `Dockerfile`, `docker-compose.yml` – production build and server.

## Security and limits

The admin panel requires a bearer token supplied through `MEETUP_ADMIN_TOKEN`; API endpoints also enforce that token. Responses are stored on your host only. There is no login/user account system and no email/WhatsApp notification. The public response API does not yet have CAPTCHA or application-level spam prevention; add reverse-proxy rate limiting before wide public distribution. Keep the domain HTTPS-only. Delete invitations using the editor to delete their associated responses.

## Validation

The FastAPI backend compiles and has been checked with local API requests. The frontend source is provided; network dependency installation could not be completed in the creation environment, so run `npm install && npm run build` locally to validate your environment.
