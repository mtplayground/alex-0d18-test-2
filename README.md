# alex-0d18-test-2

Vite + React + TypeScript app.

## Setup

```bash
npm install
```

No environment variables are required yet. `.env.example` is included as a placeholder for future configuration.

## Development

```bash
npm run dev
```

The dev server listens on `0.0.0.0:8080`.

## Build

```bash
npm run build
```

The build script removes any existing `dist/` directory, type-checks the app, and writes a fresh production bundle to `dist/`.

## Serve Production Build

```bash
npm run serve
```

This serves the built `dist/` directory with Vite preview on `0.0.0.0:8080`. Run `npm run build` first so the static files exist.

`npm run preview` is kept as an alias for the same production static server.
