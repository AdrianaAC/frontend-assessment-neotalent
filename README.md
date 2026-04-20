# Neotalent Frontend Assessment

A React + TypeScript + Vite solution for the Neotalent vehicle results challenge.

## Highlights

- Vehicle results page with filtering, sorting, favourites, pagination, and details routing
- Timezone-safe auction handling using a fixed auction timezone
- Stable route IDs derived from deterministic vehicle fields
- URL-persisted results state for shareable, refresh-safe search pages
- Favourite persistence in `localStorage`
- Polished responsive UI with `styled-components`
- React Testing Library + Vitest coverage for happy paths and edge cases

## Tech

- React 19
- TypeScript
- Vite
- React Router
- styled-components
- Vitest
- React Testing Library

## Scripts

```bash
npm run dev
npm run build
npm run test
```

## Notes

- Auction timestamps are interpreted as UK-local auction times and rendered consistently across timezones.
- Results UI state is encoded in the URL query string.
- Favourite selections are persisted locally in the browser.
