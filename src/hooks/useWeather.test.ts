// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWeather, type WeatherData } from '../lib/weather';
import { DEFAULT_WEATHER_LOCATION, useWeather, WEATHER_REFRESH_MS } from './useWeather';

vi.mock('../lib/weather', () => ({
  fetchWeather: vi.fn(),
}));

const originalGeolocation = navigator.geolocation;
const fetchWeatherMock = vi.mocked(fetchWeather);

const weatherData: WeatherData = {
  city: 'Paris',
  description: 'clear sky',
  feelsLike: 18,
  temperature: 20,
};

function installGeolocationSuccess(lat: number, lon: number) {
  const geolocation = {
    getCurrentPosition: vi.fn((success: PositionCallback) => {
      success({
        coords: {
          accuracy: 1,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: lat,
          longitude: lon,
          speed: null,
          toJSON: () => ({}),
        },
        timestamp: Date.now(),
        toJSON: () => ({}),
      });
    }),
  };

  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: geolocation,
  });

  return geolocation;
}

function installGeolocationDenied() {
  const geolocation = {
    getCurrentPosition: vi.fn((_success: PositionCallback, error?: PositionErrorCallback) => {
      error?.({
        code: 1,
        message: 'User denied Geolocation',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    }),
  };

  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: geolocation,
  });

  return geolocation;
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.useRealTimers();
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: originalGeolocation,
  });
});

describe('useWeather', () => {
  it('requests geolocation and loads weather for the current coordinates', async () => {
    const geolocation = installGeolocationSuccess(48.8566, 2.3522);
    fetchWeatherMock.mockResolvedValue(weatherData);

    const { result } = renderHook(() => useWeather('test-api-key'));

    expect(result.current).toEqual({
      data: null,
      error: null,
      loading: true,
    });
    expect(geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.data).toEqual(weatherData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(fetchWeatherMock).toHaveBeenCalledWith(48.8566, 2.3522, 'test-api-key');
  });

  it('falls back to London when geolocation is denied', async () => {
    installGeolocationDenied();
    fetchWeatherMock.mockResolvedValue({
      ...weatherData,
      city: 'London',
    });

    const { result } = renderHook(() => useWeather('test-api-key'));

    await waitFor(() => {
      expect(result.current.data?.city).toBe('London');
    });

    expect(fetchWeatherMock).toHaveBeenCalledWith(
      DEFAULT_WEATHER_LOCATION.lat,
      DEFAULT_WEATHER_LOCATION.lon,
      'test-api-key',
    );
  });

  it('refreshes weather every 10 minutes', async () => {
    let intervalCallback: (() => void) | null = null;
    const setIntervalSpy = vi.spyOn(window, 'setInterval').mockImplementation((handler) => {
      if (typeof handler === 'function') {
        intervalCallback = () => {
          handler();
        };
      }

      return 1;
    });

    installGeolocationSuccess(48.8566, 2.3522);
    fetchWeatherMock
      .mockResolvedValueOnce(weatherData)
      .mockResolvedValueOnce({
        ...weatherData,
        temperature: 22,
      });

    const { result } = renderHook(() => useWeather('test-api-key'));

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.data?.temperature).toBe(20);
    expect(fetchWeatherMock).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), WEATHER_REFRESH_MS);

    await act(async () => {
      intervalCallback?.();
      await Promise.resolve();
    });

    expect(fetchWeatherMock).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(result.current.data?.temperature).toBe(22);
    });
  });

  it('exposes weather loading errors', async () => {
    installGeolocationSuccess(48.8566, 2.3522);
    fetchWeatherMock.mockRejectedValue(new Error('OpenWeatherMap rate limit exceeded.'));

    const { result } = renderHook(() => useWeather('test-api-key'));

    await waitFor(() => {
      expect(result.current.error).toBe('OpenWeatherMap rate limit exceeded.');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('does not request weather without an API key', () => {
    installGeolocationSuccess(48.8566, 2.3522);

    const { result } = renderHook(() => useWeather('   '));

    expect(result.current).toEqual({
      data: null,
      error: 'Weather API key is required.',
      loading: false,
    });
    expect(fetchWeatherMock).not.toHaveBeenCalled();
  });
});
