import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export const HOUR_FORMAT_STORAGE_KEY = 'hour12';

function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStoredHourFormat() {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  try {
    return storage.getItem(HOUR_FORMAT_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeStoredHourFormat(hour12: boolean) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(HOUR_FORMAT_STORAGE_KEY, String(hour12));
  } catch {
    // Storage can be unavailable in private browsing or restricted embeds.
  }
}

export function useHourFormat(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [hour12, setHour12] = useState(readStoredHourFormat);

  useEffect(() => {
    writeStoredHourFormat(hour12);
  }, [hour12]);

  return [hour12, setHour12];
}
