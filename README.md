# Neotalent Frontend Assessment

![CI](https://github.com/AdrianaAC/frontend-assessment-neotalent/actions/workflows/ci.yml/badge.svg)

A polished **React + TypeScript + Vite** solution for the Neotalent Frontend Software Engineer Challenge.

This project implements a complete vehicle marketplace-style experience with:

- Vehicle results page
- Vehicle details page
- Filtering / sorting / pagination
- Favourite vehicles
- Shared state
- URL-persisted search state
- localStorage-persisted favourites
- Timezone-safe auction countdown logic
- Responsive UI
- Automated tests
- GitHub Actions CI
- Vercel deployment

---

## Live Demo

🔗 https://frontend-assessment-neotalent.vercel.app

---

## Preview

### Results Page

![Results Page](./images/results-page-placeholder.png)

### Vehicle Details Page

![Vehicle Details](./images/details-page-placeholder.png)

### Mobile View

![Mobile View](./images/mobile-placeholder.png)

### Demo GIF

![Demo GIF](./images/demo-placeholder.gif)

---

## Challenge Goal

Build a frontend application capable of displaying vehicle auction results from a JSON dataset, allowing users to browse, filter, sort, paginate, favourite vehicles, and inspect a detailed page for each vehicle.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- styled-components
- Vitest
- React Testing Library
- GitHub Actions
- Vercel

---

## Features

### Vehicle Results Page

- Friendly vehicle card layout
- Placeholder imagery
- Countdown until auction begins
- Favourite state indicator
- Responsive layout

### Filtering

- Make
- Model
- Minimum starting bid
- Maximum starting bid
- Favourites only

### Sorting

- Make
- Starting bid
- Mileage
- Auction date

### Pagination

- Page navigation
- Vehicles per page selector

### Vehicle Details Page

Displays:

- Summary data
- Specification
- Ownership
- Equipment

### Persistence

#### URL Query Params

Search state is preserved in the URL:

`?make=BMW&sort=startingBid&page=2`

This enables:

- refresh-safe state
- shareable filtered links
- browser navigation support

#### localStorage

Favourite vehicles are persisted locally and restored automatically.

---

## Architecture Overview

```txt
JSON Dataset
     ↓
VehicleContext (shared state)
     ↓
ResultsPage
 ├── FilterBar
 ├── SortControls
 ├── Pagination
 └── VehicleCard[]

VehicleDetailsPage
     ↓
Selected Vehicle by Stable Route ID
```

---

## Key Engineering Decisions

### Shared State via Context
Vehicle data and favourites are centralized in VehicleContext.

Why:

 - prevents duplicated page state
 - keeps results/details synchronized
 - scalable for future features

### URL-Persisted Results State
Filters, sorting, page and page size live in query params.

Why:

 - shareable searches
 - refresh-safe UX
 - native back/forward support

### Stable Vehicle Route IDs
Vehicle routes use deterministic IDs derived from stable fields.

Why:

 - safer than array index routes
 - more stable deep links

### Timezone-Safe Auctions
Auction timestamps are treated as Europe/London local auction times.

Why:

 - prevents browser locale drift
 - ensures consistent countdowns across regions

### Automated Quality Checks
GitHub Actions CI validates:

 - install
 - TypeScript
 - tests
 - production build

---

## Testing Strategy
Built with Vitest + React Testing Library

Current coverage includes:

 - filtering
 - sorting
 - favourites
 - pagination
 - vehicles per page
 - URL state hydration
 - details page rendering
 - shared state between routes
 - not-found route
 - countdown edge cases
 - timezone parsing
 - favourites persistence

---

## Accessibility Considerations

 - semantic page structure
 - button-based interactive controls
 - labelled form inputs
 - keyboard-friendly navigation
 - focus states
 - responsive layouts

---

## Performance Considerations

 - Derived state computed efficiently
 - Lightweight Vite production build
 - No unnecessary global libraries
 - Clean component boundaries

---

## Trade-Offs / Assumptions

### Deterministic IDs vs Backend IDs
Real systems should use backend IDs.
For this challenge, deterministic IDs were chosen due to static JSON data.

### localStorage Scope
Favourites are browser-local only.
A real production system would sync favourites to a user account.

### Static JSON Dataset
For the challenge brief, JSON import was used directly.
Real systems would likely fetch via API with loading/error states.

---

## If Given More Time

 - richer animations/micro-interactions
 - improved accessibility audit
 - end-to-end testing
 - compare vehicles feature
 - saved searches
 - real vehicle imagery
 - backend persistence
 - advanced search filters

 ---

## Running

### Run Locally
```txt
npm install
npm run dev
```

### Run Tests
```txt
npm run test
```

### Build Production Version
```txt
npm run build
```

 ---

## Repository Structure
```txt
src/
 ├── components/
 ├── context/
 ├── pages/
 ├── styles/
 ├── utils/
 ├── data/
 └── test/
```

 ---

## Author

Adriana Alves
GitHub: https://github.com/AdrianaAC