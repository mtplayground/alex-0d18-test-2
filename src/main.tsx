import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-12 text-slate-50">
      <section className="w-full max-w-2xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-cyan-300">
          Vite + React + TypeScript
        </p>
        <h1 className="text-5xl font-bold leading-none text-white sm:text-7xl">alex-0d18-test-2</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
          A minimal application skeleton ready for the next feature.
        </p>
      </section>
    </main>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
