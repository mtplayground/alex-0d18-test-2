function padTimePart(value: number) {
  return value.toString().padStart(2, '0');
}

export function formatTime(date: Date, hour12: boolean) {
  const hours = date.getHours();
  const minutes = padTimePart(date.getMinutes());
  const seconds = padTimePart(date.getSeconds());

  if (!hour12) {
    return `${padTimePart(hours)}:${minutes}:${seconds}`;
  }

  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${padTimePart(displayHours)}:${minutes}:${seconds} ${suffix}`;
}
