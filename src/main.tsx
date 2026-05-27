import { StrictMode } from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnalogClock } from './components/AnalogClock';
import { Clock } from './components/Clock';
import { FormatToggle } from './components/FormatToggle';
import { useHourFormat } from './hooks/useHourFormat';
import './index.css';

function App() {
  const [hour12, setHour12] = useHourFormat();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-12 text-slate-50">
      <section className="flex w-full max-w-3xl flex-col items-center text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-cyan-300">
          Local time
        </p>
        <AnalogClock date={now} className="mb-8 max-w-[18rem] sm:max-w-xs" />
        <Clock date={now} hour12={hour12} />
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">
          Updated every second.
        </p>
        <FormatToggle className="mt-8" hour12={hour12} onChange={setHour12} />
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
