export type HandAngles = {
  hour: number;
  minute: number;
  second: number;
};

export function getHandAngles(date: Date): HandAngles {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    hour: (hours + minutes / 60) * 30,
    minute: (minutes + seconds / 60) * 6,
    second: seconds * 6,
  };
}
