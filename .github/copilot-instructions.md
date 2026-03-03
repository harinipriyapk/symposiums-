# AI Coding Assistant Instructions for Symposium

This repository contains a React/Vite front‑end with a small Node/Express back‑end used for an event registration site.

## Big Picture

- **Front-end** lives in `src/` (also `symposium-frontend/` which is an earlier/duplicate copy). The working copy is the top-level `src` directory alongside `package.json`.
- **Back-end** is a lightweight Node server located at `src/services/server.js`. It accepts registration POSTs and sends confirmation emails using Gmail (Nodemailer). There is no database; all logic is in-memory and email‑centric. A stub `/api/users` call is referenced by the admin dashboard but not implemented.
- The two parts run separately:
  - Front‑end: Vite dev server at `http://localhost:5173`.
  - Back‑end: Node/Express on port `5000` (settable via `PORT`).
- Communication: the front‑end calls the back‑end with `fetch`/`axios` to `http://localhost:5000/api/*`. CORS is enabled for the Vite origin.

## Setup & Developer Workflow

1. **Environment variables** – create a `.env` in the project root with:
   ```env
   GMAIL_USER=you@gmail.com
   GMAIL_PASS=<app-password>
   ADMIN_EMAIL=admin@domain
   PORT=5000        # optional
   ```
   The back‑end uses these values for the mail transporter.

2. **Install dependencies**
   ```bash
   cd c:/Users/harin/OneDrive/Desktop/symposium
   npm install         # installs both front‑end deps (react, gsap, etc.)
   ```
   The `symposium-frontend/` subfolder is legacy; its dependencies are mostly the same and can be ignored unless you deliberately work on that copy.

3. **Run development servers**
   - Start backend: `node src/services/server.js` (or use `nodemon` if you like).
   - Start frontend: `npm run dev` which launches Vite.

4. **Production build**
   - `npm run build` generates `dist/` via Vite. The static output can be served by any static host; remember the API still needs the Node server.

> There are no automated tests in this repo; manual QA is expected.

## Architecture & Conventions

- **Routing** is handled by React Router v7 in `App.jsx`. Pages live under `src/pages` and each has a companion CSS file (e.g. `Register.css`). Components such as `Navbar` and `AdminDashboard` are in `src/components`.
- Styling is plain CSS, scoped by filenames; there is no CSS-in-JS or module system. Many components rely on CSS classes that are manipulated by GSAP animations.
- **Animations**: GSAP is heavily used. Look for `gsap` imports and `useRef` hooks controlling DOM elements. The code often wraps animations inside `useEffect` and uses `gsap.context` for cleanup.
- **Forms & validation**: The registration form (`pages/Register.jsx`) implements step‑wise validation in `validateStep`. Errors are stored in state as objects keyed by field name. Similar patterns appear in AdminLogin.
- **API calls**: use native `fetch` or `axios`. The only real endpoint implemented is `/api/register` in the back-end; it sends two emails and returns JSON success/failure. The front‑end shows a success screen after receiving confirmation.
- **State persistence**: Admin login stores `localStorage.setItem('admin','true')` and redirects to `/admin-dashboard`. There is no server‑side authentication.
- **Assets**: images live in `public/` or `src/assets`. The React build automatically copies `public/*`.

## Project-Specific Patterns

- **Duplicate front‑end copy**: `symposium-frontend/` is an older/backup version of the React app. Changes are usually made in the top‑level `src/` folder; the subfolder can be ignored unless you need to compare history or branch off.
- **Hardcoded admin**: the login page in `pages/AdminLogin.jsx` checks for a fixed email/password pair and then sets a `localStorage` key. The dashboard (`components/AdminDashboard.jsx`) hits a non‑existent `/api/users` endpoint – it's a placeholder and the back-end currently doesn't store registrations.
- **GSAP-centric class names**: many elements are wrapped in `<div className="...">` with no semantic meaning; the animations themselves rely on `ref`s rather than React state. When modifying UI, keep the existing CSS classes or update the animation code accordingly.
- **Validation helpers**: `validateStep` in `Register.jsx` is the canonical example of client‑side form validation. Errors are reported by returning an object with keys matching `form` fields.
- **Styling conventions**: each page/component has a corresponding CSS file with the same base name; selectors are global (no CSS modules). Use kebab‑case class names (e.g. `.field-wrap`, `.reg-success`).

## Integration & External Dependencies

- **Gmail via Nodemailer**: the back-end uses environment variables for the Gmail user and app password. The transporter is verified at startup; check console logs for errors.
- **CORS**: enabled explicitly in `server.js` for `http://localhost:5173`. If the front‑end is served elsewhere, update the origin or disable CORS for production builds.
- **Ports**: front-end defaults to 5173, back-end to 5000. These appear in fetch/axios calls; updating them requires changes across multiple files.

## Tips for AI Agents

1. **Start by reading** `src/App.jsx` and the CSS folder to get a sense of routing and layout. 
2. **Search for `gsap` imports** to locate animation-heavy code; these often intertwine with UI logic.
3. **Look at `src/services/server.js`** for API behavior – it's the single source of truth for back-end logic.
4. **Configuration**: the only config file besides `package.json` is `.env`, so mention environment variables when adding network or email features.
5. **Be aware of the duplicate front‑end subfolder**; propose edits only to the top‑level `src` unless explicitly told to touch the legacy copy.

> Feel free to ask follow‑up questions if any sections above are unclear or missing details – I can iterate on this document before proceeding with implementation tasks.