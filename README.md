# Greenplate — Nutrition & Smart Pantry

Greenplate is a responsive HTML/CSS/vanilla-JavaScript app with a local Express API and MongoDB persistence option. It still works as a browser-only prototype with `localStorage` when the backend is not running.

## Run the frontend-only version
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Complete the profile form, then try the dashboard, meal planner and pantry.

This mode saves data in the browser on that device only.

## Run with the backend + MongoDB
Requirements: Node.js 18+ and a running local MongoDB server, or a MongoDB Atlas database.

1. Open a terminal in the `backend` folder.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update `MONGODB_URI` only if your MongoDB connection is not the local default.
4. Make sure MongoDB is running.
5. Start Greenplate:
   ```bash
   npm start
   ```
6. Open **http://localhost:3000** (do not open `index.html` directly when testing the backend).
7. Check **http://localhost:3000/api/health**. It should report `"database":"connected"`.

The API saves the current app state in MongoDB database `greenplate`, collection `app_state`. The browser also keeps a local fallback, so it remains usable if the API is unavailable.

### MongoDB Atlas
Create a database/user in Atlas, allow your current IP, and put the Atlas connection URI in `backend/.env`. Keep `.env` private; never commit a real database password or connection URI to GitHub.

## Current features
- Three-step editable profile setup
- Calorie/macro estimates and hydration check-ins
- Meal cards with ingredients and mark-as-eaten tracking
- Pantry add/edit/delete, search, category filters and expiry reminders
- Pantry deductions when logging meals
- Case-insensitive ingredient matching, common plural aliases (for example `oat`, `Oats`, and `OATS`), and duplicate prevention for same-unit items
- Sidebar hover labels and visible calendar/date icon
- Local browser storage plus optional MongoDB persistence through Express API
- Responsive dark charcoal and soft sage/neon-green UI

## Important limitations
- This is a local development setup, not a deployed public production service. The current API stores one shared app state and does **not** include user accounts/authentication or per-user access control. Do not expose it to the public internet as-is.
- Meal suggestions and nutrition values are rule-based estimates; there is no live generative-AI service, verified nutrition database, Open Food Facts barcode lookup, or AI food-image recognition connected yet.
- For a public launch, add authentication, per-user MongoDB records, server-side validation/rate limits, secure deployment, backups, and any AI/nutrition API credentials on the server.
