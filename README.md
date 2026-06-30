# CAV Audio India — Website

A high-converting marketing website for CAV Audio India Pvt. Ltd. (Ramesh Nagar, New Delhi), built with **Vite + React** on the frontend and **Vercel serverless functions** on the backend.

## Features

- Distinctive dark/gold home-theater themed design (hero, services, why-us, brand marquee, reviews, contact)
- Lead capture form → stored via backend API (`/api/leads`)
- AI sales assistant chat widget, powered by Claude (Anthropic API) via a secure server-side proxy (`/api/chat`) — your API key is never exposed to the browser
- Admin dashboard (password-protected, default password `cavaudio2024`) to view captured enquiries — accessible via the "Admin Dashboard" link in the footer
- Fully responsive, mobile-first

## Project structure

```
cav-audio/
├── api/
│   ├── chat.js        # Serverless function: proxies chat to the Anthropic API
│   └── leads.js        # Serverless function: stores/retrieves/clears lead enquiries
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Base CSS reset
├── index.html
├── package.json
├── vite.config.js
├── vercel.json           # SPA routing rewrite rules
├── .env.example
└── .gitignore
```

## 1. Local development

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Note: the `/api/*` functions only run when deployed via Vercel (or with `vercel dev`, see below). Running plain `npm run dev` will serve the frontend, but the chat widget and lead form will fall back gracefully (chat shows a "please call us" message; the lead form falls back to browser localStorage) until you run via Vercel.

To test the backend functions locally with the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## 2. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects the Vite framework — no build settings need to change.
4. Before deploying, add environment variables under **Project → Settings → Environment Variables**:

   | Variable | Required | Purpose |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | Yes (for AI chat) | Powers the AI sales assistant. Get one at [console.anthropic.com](https://console.anthropic.com/settings/keys). |
   | `UPSTASH_REDIS_REST_URL` | Recommended | Durable lead storage (free tier at [console.upstash.com](https://console.upstash.com)). |
   | `UPSTASH_REDIS_REST_TOKEN` | Recommended | Paired with the URL above. |

5. Click **Deploy**.

Without the Upstash variables, leads are still captured but stored in server memory only — they may be lost on redeploys or cold starts. For a permanent record, connect Upstash Redis (free, ~2 minutes to set up — see comments in `api/leads.js`) or swap in any database of your choice.

## 3. Customizing

- **Business details / copy**: edit the constants at the top of `src/App.jsx` (`SERVICES`, `WHY`, `BRANDS`, `REVIEWS`) and the contact info block.
- **Colors / fonts**: edit the `C` (color tokens) object and the `@import` Google Fonts line near the top of `src/App.jsx`.
- **Admin password**: change `"cavaudio2024"` in `src/App.jsx` (search for it) — for production, consider moving this check server-side instead of in the client bundle.
- **AI assistant tone/knowledge**: edit `SYSTEM_PROMPT` in `api/chat.js`.

## Tech stack

- React 18 + Vite 5
- Vercel Serverless Functions (Node.js)
- Anthropic Claude API (`claude-sonnet-4-6`)
- Upstash Redis REST API (optional, for lead persistence)
