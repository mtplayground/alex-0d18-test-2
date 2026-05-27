type FormatToggleProps = {
  hour12: boolean;
  onChange: (hour12: boolean) => void;
  className?: string;
};

export function FormatToggle({ hour12, onChange, className = '' }: FormatToggleProps) {
  const label = hour12 ? 'Switch to 24-hour time' : 'Switch to 12-hour time';

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={hour12}
      onClick={() => onChange(!hour12)}
      className={[
        'relative inline-grid h-11 w-36 grid-cols-2 items-center rounded-full border border-slate-700 bg-slate-900 p-1 text-sm font-semibold text-slate-300 shadow-lg shadow-slate-950/30 transition hover:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'absolute left-1 top-1 h-9 w-[4rem] rounded-full bg-cyan-300 transition-transform duration-200 ease-out',
          hour12 ? 'translate-x-[4rem]' : 'translate-x-0',
        ].join(' ')}
      />
      <span className={hour12 ? 'relative z-10 text-slate-300' : 'relative z-10 text-slate-950'}>
        24h
      </span>
      <span className={hour12 ? 'relative z-10 text-slate-950' : 'relative z-10 text-slate-300'}>
        12h
      </span>
    </button>
  );
}
