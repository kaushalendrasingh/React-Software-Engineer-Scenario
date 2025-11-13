# React Software Engineer Scenario

Interactive book list experience built with Vite + React + TypeScript. The component showcases reusable patterns, accessibility-first UI, inline composition, live search, and automated tests.

## Prerequisites

- Node.js 18.0+ (or any active LTS release)
- npm 9+ (bundled with recent Node distributions)

Verify versions:

```bash
node --version
npm --version
```

## Getting Started

Install dependencies once:

```bash
npm install
```

### Develop

Start Vite in dev mode with HMR:

```bash
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`) to interact with the app. The main view lives in `src/App.tsx`, and the reusable component is under `src/components/BookList.tsx`.

### Test

Run Vitest + React Testing Library specs:

```bash
npm test
```

Add `--watch` for TDD workflows.

### Build

Create a production bundle:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## Project Structure

```
├─ src/
│  ├─ App.tsx              # Entry view wiring mock data → BookList
│  ├─ components/
│  │  ├─ BookList.tsx      # Reusable list + composer component
│  │  ├─ BookList.css      # Component-scoped styling
│  │  └─ BookList.test.tsx # RTL/Vitest coverage
│  ├─ main.tsx             # React root mounting
│  └─ setupTests.ts        # Jest-DOM setup for Vitest
├─ package.json
└─ vite.config.ts
```

## Notes

- Styling sticks to plain CSS for readability while remaining accessible (focus states, reduced-motion fallbacks).
- Mock data is in-memory; swap in a data source or API when needed.
