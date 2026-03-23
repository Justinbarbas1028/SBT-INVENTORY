# SBT Inventory

SBT Inventory is a React + TypeScript inventory management app built with Vite and Tailwind CSS. It provides a single-screen dashboard for stock tracking, QR-based item workflows, logistics requests, transaction history, and basic role/account management.

## Features

- Dashboard with stock totals, checked-out counts, and recent transaction activity
- Inventory table with search, category filtering, sorting, selection, bulk updates, delete, and CSV export
- Check-in and check-out flows with optional QR code scanning
- Item registration with auto-generated inventory IDs and QR code values
- Borrow/item request form with multi-line item selection
- Logistics workflow for request creation, status progression, and cancellation
- Transaction history with filtering and CSV export
- Role-based navigation for `Super Admin`, `Admin`, and `Employee`
- Light and dark theme toggle with preference saved in the browser
- Responsive layout with mobile sidebar and quick actions

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- lucide-react icons
- html5-qrcode for QR scanning

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Optional: duplicate `.env.example` to `.env` if you plan to use AI Studio or other env-driven features later. The current app works without extra environment variables:

```bash
copy .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the app at `http://localhost:3000`

## Available Scripts

```bash
npm run dev      # Start the Vite dev server on port 3000
npm run build    # Build the app for production
npm run preview  # Preview the production build
npm run lint     # TypeScript type check
npm run clean    # Remove the dist folder (requires an rm-compatible shell)
```

## How It Works

- The app currently uses in-memory state seeded from `src/store.ts`.
- Refreshing the page resets inventory, users, transactions, logistics requests, and borrow requests.
- Theme preference persists in `localStorage`.
- The top bar includes a role selector so you can preview the app as different user types.
- User switching is local-only and does not connect to an authentication backend.
- QR scanning is handled in-browser through the camera when supported by the device and browser.

## Project Structure

```text
src/
  components/   Shared UI pieces like the sidebar, topbar, FAB, and QR modal
  views/        Feature pages for dashboard, inventory, check-in/out, logistics, and more
  store.ts      Seed data used to initialize the app
  types.ts      Shared TypeScript types
  theme.ts      Theme persistence and application helpers
  App.tsx       App shell and navigation state
  main.tsx      React entry point
```

## Notes

- There is no backend or database layer in the current implementation.
- The app is best treated as a functional front-end demo or prototype unless you add persistence and authentication.
- The `README.md` is a good place to document any future API, database, or deployment steps if those are added later.
