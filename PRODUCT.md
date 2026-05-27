# Product Contract

## Project

`alex-0d18-test-2` is a minimal Vite application scaffold using React and TypeScript. It currently provides the foundation for future frontend work rather than a domain-specific product experience.

## Current Behavior

- Serves a single React entry point from `src/main.tsx`.
- Renders a small landing view identifying the app and stack.
- Builds static production assets with Vite.

## Architecture

- Root-level Vite app with `index.html` as the browser entry.
- React is mounted with `createRoot` and wrapped in `StrictMode`.
- TypeScript is configured with project references:
  - `tsconfig.app.json` for browser source under `src/`.
  - `tsconfig.node.json` for Vite configuration.
- Global styles live in `src/index.css`.
- Vite is configured in `vite.config.ts`.

## Conventions

- Use npm scripts from `package.json`:
  - `npm run dev` starts Vite on `0.0.0.0:8080`.
  - `npm run build` runs TypeScript build checks and creates the Vite production bundle.
  - `npm run preview` serves the production build on `0.0.0.0:8080`.
- Keep generated and local-only files out of version control via `.gitignore`, including `node_modules/`, `dist/`, Vite cache files, tokens, and local progress metadata.
- Keep the skeleton minimal until future issues add product-specific features.
