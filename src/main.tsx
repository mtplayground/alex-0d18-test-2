import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Vite + React + TypeScript</p>
        <h1>alex-0d18-test-2</h1>
        <p className="summary">A minimal application skeleton ready for the next feature.</p>
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
