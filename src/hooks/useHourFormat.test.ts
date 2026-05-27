// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HOUR_FORMAT_STORAGE_KEY, useHourFormat } from './useHourFormat';

function installMockLocalStorage(initialValues: Record<string, string> = {}) {
  const store = { ...initialValues };
  const storage = {
    get length() {
      return Object.keys(store).length;
    },
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }),
    getItem: vi.fn((key: string) => store[key] ?? null),
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
  };

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    get: () => storage,
  });

  return storage;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useHourFormat', () => {
  it('defaults to 24-hour mode when localStorage has no value', async () => {
    const storage = installMockLocalStorage();

    const { result } = renderHook(() => useHourFormat());

    expect(result.current[0]).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith(HOUR_FORMAT_STORAGE_KEY);
    await waitFor(() => {
      expect(storage.setItem).toHaveBeenLastCalledWith(HOUR_FORMAT_STORAGE_KEY, 'false');
    });
  });

  it('initializes from a stored 12-hour preference', () => {
    installMockLocalStorage({ [HOUR_FORMAT_STORAGE_KEY]: 'true' });

    const { result } = renderHook(() => useHourFormat());

    expect(result.current[0]).toBe(true);
  });

  it('writes changes back to localStorage', async () => {
    const storage = installMockLocalStorage();
    const { result } = renderHook(() => useHourFormat());

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    await waitFor(() => {
      expect(storage.setItem).toHaveBeenLastCalledWith(HOUR_FORMAT_STORAGE_KEY, 'true');
    });
  });

  it('supports toggling with a state updater', async () => {
    const storage = installMockLocalStorage({ [HOUR_FORMAT_STORAGE_KEY]: 'false' });
    const { result } = renderHook(() => useHourFormat());

    act(() => {
      result.current[1]((hour12) => !hour12);
    });

    expect(result.current[0]).toBe(true);
    await waitFor(() => {
      expect(storage.setItem).toHaveBeenLastCalledWith(HOUR_FORMAT_STORAGE_KEY, 'true');
    });

    act(() => {
      result.current[1]((hour12) => !hour12);
    });

    expect(result.current[0]).toBe(false);
    await waitFor(() => {
      expect(storage.setItem).toHaveBeenLastCalledWith(HOUR_FORMAT_STORAGE_KEY, 'false');
    });
  });
});
