# Product Contract

## Project

`alex-0d18-test-2` is a Vite + React + TypeScript clock app. It displays the user's local time with analog and digital clock faces on a dark full-screen interface, lets the user switch the digital time between 24-hour and 12-hour formats, and can show current weather when an OpenWeatherMap API key is configured.

## Current Behavior

- Renders a centered live clock that updates once per second.
- Shows an SVG analog clock face above the digital display, with Roman and Arabic numeral rings, minute tick marks, and rotating hour/minute/second hands.
- Displays time as zero-padded `HH:MM:SS` in 24-hour mode.
- Displays time as zero-padded `HH:MM:SS AM|PM` in 12-hour mode.
- Provides an accessible Tailwind-styled `FormatToggle` button with `aria-pressed` and mode-specific labels.
- Persists the selected hour format in `localStorage` under the `hour12` key, defaulting to 24-hour mode when no value exists.
- Conditionally renders a compact weather panel below the digital clock when `VITE_OPENWEATHERMAP_API_KEY` is set.
- Weather uses browser geolocation when available, falls back to London when denied or unavailable, refreshes every 10 minutes, and displays loading/error states plus city, temperature, description, and feels-like temperature.

## Architecture

- `src/main.tsx` owns app composition, the single per-second `Date` state, interval cleanup, `useHourFormat`, `useWeather`, and conditional weather panel rendering.
- `src/components/AnalogClock.tsx` is a presentational SVG component driven by a `date` prop and `getHandAngles`.
- `src/components/Clock.tsx` renders the digital time from the shared `date` prop.
- `src/components/FormatToggle.tsx` is a controlled UI component.
- `src/components/WeatherPanel.tsx` is a presentational weather component for loading, error, empty, and current-weather states.
- `src/hooks/useHourFormat.ts` owns localStorage read/write behavior and guards against unavailable storage.
- `src/hooks/useWeather.ts` owns geolocation, London fallback, OpenWeatherMap fetching, refresh cadence, and weather state.
- `src/lib/formatTime.ts` is the pure time-formatting boundary shared by UI and tests.
- `src/lib/getHandAngles.ts` is a pure analog-clock helper returning hour, minute, and second hand rotation degrees from a `Date`.
- `src/lib/weather.ts` contains a typed OpenWeatherMap Current Weather API client that normalizes city, temperature, description, and feels-like data and reports typed error cases.
- Tailwind is configured through `tailwind.config.js`, `postcss.config.js`, and `src/index.css`.
- `vite.config.ts` keeps dev and preview servers on `0.0.0.0:8080`; preview allows `.sprites.app` hosts for Sprite deployments.
- Playwright E2E configuration lives in `playwright.config.ts`, with specs under `e2e/`.

## Testing

- `npm run test` runs Vitest tests under `src`.
- `src/lib/formatTime.test.ts` covers formatting boundaries.
- `src/lib/getHandAngles.test.ts` covers midnight/noon, exact hand positions, smooth hour and minute movement, and late-night wrap boundaries.
- `src/lib/weather.test.ts` covers weather response normalization, URL construction, blank keys, network failures, invalid keys, rate limits, and malformed responses with mocked `fetch`.
- `src/hooks/useHourFormat.test.ts` covers default, read, write, and toggle persistence behavior with mocked localStorage.
- `src/hooks/useWeather.test.ts` covers geolocation success, denied-location fallback, 10-minute refreshes, weather errors, and missing API keys.
- `src/components/WeatherPanel.test.tsx` covers weather details, loading, error, and empty states.
- `npm run test:e2e` builds the production bundle with a test weather API key, serves `dist/` with Vite preview, and runs Playwright Chromium tests for digital clock toggling/persistence, analog SVG rendering and second-hand rotation, and weather panel rendering with mocked OpenWeatherMap data.

## Conventions

- `npm run dev` starts Vite on `0.0.0.0:8080`.
- `npm run build` removes any existing `dist/`, runs TypeScript build checks, and creates a fresh Vite production bundle.
- `npm run serve` serves the built `dist/` directory on `0.0.0.0:8080`.
- `npm run preview` is an alias for `npm run serve`.
- `.env.example` documents optional `VITE_OPENWEATHERMAP_API_KEY`; without it the weather panel is hidden.
- Weather API keys are not hardcoded; the app reads the Vite environment variable and lower-level weather helpers receive the key as an argument.
- Generated and local-only files stay out of version control, including `node_modules/`, `dist/`, Playwright output, tokens, and local progress metadata.
