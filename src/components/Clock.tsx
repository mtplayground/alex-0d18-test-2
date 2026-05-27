import { formatTime } from '../lib/formatTime';

type ClockProps = {
  date: Date;
  hour12: boolean;
};

export function Clock({ date, hour12 }: ClockProps) {
  const displayTime = formatTime(date, hour12);

  return (
    <time
      className="block whitespace-nowrap font-mono text-4xl font-semibold tabular-nums tracking-normal text-white sm:text-6xl md:text-8xl"
      dateTime={date.toISOString()}
      aria-label={`Current time ${displayTime}`}
    >
      {displayTime}
    </time>
  );
}
