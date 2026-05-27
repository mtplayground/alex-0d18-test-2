import type { WeatherData } from '../lib/weather';

type WeatherPanelProps = {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  className?: string;
};

function formatTemperature(value: number) {
  const rounded = Math.round(value * 10) / 10;

  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}°C`;
}

function formatDescription(description: string) {
  const trimmed = description.trim();

  if (!trimmed) {
    return 'Current conditions';
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function WeatherPanel({ data, loading, error, className = '' }: WeatherPanelProps) {
  return (
    <section
      aria-label="Current weather"
      className={[
        'w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900/80 px-5 py-4 text-left shadow-lg shadow-slate-950/30',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <div className="flex items-center gap-3 text-sm font-medium text-slate-300" role="status">
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-300"
          />
          <span>Loading weather</span>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="text-sm text-rose-200" role="alert">
          <p className="font-semibold text-rose-100">Weather unavailable</p>
          <p className="mt-1 leading-6">{error}</p>
        </div>
      ) : null}

      {!loading && !error && data ? (
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">Weather</p>
              <h2 className="mt-1 text-lg font-semibold leading-6 text-white">{data.city}</h2>
            </div>
            <p className="font-mono text-3xl font-semibold tabular-nums text-white">
              {formatTemperature(data.temperature)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
            <p>{formatDescription(data.description)}</p>
            <p>Feels like {formatTemperature(data.feelsLike)}</p>
          </div>
        </div>
      ) : null}

      {!loading && !error && !data ? (
        <p className="text-sm font-medium text-slate-300">Weather is not configured.</p>
      ) : null}
    </section>
  );
}
