import { useEffect, useState } from 'react';
import { formatTime } from '../lib/formatTime';

export function Clock() {
  const [now, setNow] = useState(() => new Date());
  const displayTime = formatTime(now, false);

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
      aria-label={`Current time ${displayTime}`}
    >
      {displayTime}
    </time>
  );
}
