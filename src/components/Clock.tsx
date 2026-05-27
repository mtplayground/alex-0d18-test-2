import { useEffect, useState } from 'react';

function padTimePart(value: number) {
  return value.toString().padStart(2, '0');
}

function formatClockTime(date: Date) {
  return [
    padTimePart(date.getHours()),
    padTimePart(date.getMinutes()),
    padTimePart(date.getSeconds()),
  ].join(':');
}

export function Clock() {
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
    <time
      className="block font-mono text-6xl font-semibold tabular-nums tracking-normal text-white sm:text-8xl"
      dateTime={now.toISOString()}
      aria-label={`Current time ${formatClockTime(now)}`}
    >
      {formatClockTime(now)}
    </time>
  );
}
