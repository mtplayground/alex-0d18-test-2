import { useEffect, useState } from 'react';
import { formatTime } from '../lib/formatTime';

type ClockProps = {
  hour12: boolean;
};

export function Clock({ hour12 }: ClockProps) {
  const [now, setNow] = useState(() => new Date());
  const displayTime = formatTime(now, hour12);

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
      className="block whitespace-nowrap font-mono text-4xl font-semibold tabular-nums tracking-normal text-white sm:text-6xl md:text-8xl"
      dateTime={now.toISOString()}
      aria-label={`Current time ${displayTime}`}
    >
      {displayTime}
    </time>
  );
}
