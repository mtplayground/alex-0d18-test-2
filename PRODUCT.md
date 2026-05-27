# Product Contract

## Project

`alex-0d18-test-2` is a Vite + React + TypeScript clock app. It displays the user's local time on a dark full-screen interface and lets the user switch between 24-hour and 12-hour formats.

## Current Behavior

- Renders a centered live clock that updates once per second.
- Displays time as zero-padded `HH:MM:SS` in 24-hour mode.
- Displays time as zero-padded `HH:MM:SS AM|PM` in 12-hour mode.
- Provides an accessible Tailwind-styled `FormatToggle` button with `aria-pressed` and mode-specific labels.
- Persists the selected hour format in `localStorage` under the `hour12` key, defaulting to 24-hour mode when no value exists.

## Architecture

- `src/main.tsx` owns app composition: `useHourFormat`, `Clock`, and `FormatToggle`.
- `src/components/Clock.tsx` owns current `Date` state and interval cleanup.
- `src/components/FormatToggle.tsx` is a controlled UI component.
- `src/hooks/useHourFormat.ts` owns localStorage read/write behavior and guards against unavailable storage.
- `src/lib/formatTime.ts` is the pure time-formatting boundary shared by UI and tests.
- `src/lib/getHandAngles.ts` is a pure analog-clock helper returning hour, minute, and second hand rotation degrees from a `Date`.
- Tailwind is configured through `tailwind.config.js`, `postcss.config.js`, and `src/index.css`.
- `vite.config.ts` keeps dev and preview servers on `0.0.0.0:8080`; preview allows `.sprites.app` hosts for Sprite deployments.
- Playwright E2E configuration lives in `playwright.config.ts`, with specs under `e2e/`.

## Testing

- `npm run test` runs Vitest tests under `src`.
- `src/lib/formatTime.test.ts` covers formatting boundaries.
- `src/lib/getHandAngles.test.ts` covers midnight/noon, exact hand positions, smooth hour and minute movement, and late-night wrap boundaries.
- `src/hooks/useHourFormat.test.ts` covers default, read, write, and toggle persistence behavior with mocked localStorage.
- `npm run test:e2e` builds the production bundle, serves `dist/` with Vite preview, and runs the Playwright Chromium test for clock rendering, toggle switching, and reload persistence.

## Conventions

- `npm run dev` starts Vite on `0.0.0.0:8080`.
- `npm run build` removes any existing `dist/`, runs TypeScript build checks, and creates a fresh Vite production bundle.
- `npm run serve` serves the built `dist/` directory on `0.0.0.0:8080`.
- `npm run preview` is an alias for `npm run serve`.
- `.env.example` is intentionally empty; no environment variables are required right now.
- Generated and local-only files stay out of version control, including `node_modules/`, `dist/`, Playwright output, tokens, and local progress metadata.
