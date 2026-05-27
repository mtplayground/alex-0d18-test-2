import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherData } from '../lib/weather';

type WeatherState = {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export const WEATHER_REFRESH_MS = 10 * 60 * 1000;
export const DEFAULT_WEATHER_LOCATION: Coordinates = {
  lat: 51.5072,
  lon: -0.1276,
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load weather.';
}

export function useWeather(apiKey: string): WeatherState {
  const [state, setState] = useState<WeatherState>(() => ({
    data: null,
    error: apiKey.trim() ? null : 'Weather API key is required.',
    loading: Boolean(apiKey.trim()),
  }));

  useEffect(() => {
    const trimmedApiKey = apiKey.trim();
    let cancelled = false;
    let intervalId: number | undefined;

    if (!trimmedApiKey) {
      setState({
        data: null,
        error: 'Weather API key is required.',
        loading: false,
      });
      return undefined;
    }

    async function loadWeather(location: Coordinates, showLoading: boolean) {
      if (showLoading) {
        setState((current) => ({
          ...current,
          error: null,
          loading: true,
        }));
      }

      try {
        const data = await fetchWeather(location.lat, location.lon, trimmedApiKey);

        if (!cancelled) {
          setState({
            data,
            error: null,
            loading: false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            data: current.data,
            error: getErrorMessage(error),
            loading: false,
          }));
        }
      }
    }

    function startWeatherUpdates(location: Coordinates) {
      void loadWeather(location, true);
      intervalId = window.setInterval(() => {
        void loadWeather(location, false);
      }, WEATHER_REFRESH_MS);
    }

    if (!navigator.geolocation) {
      startWeatherUpdates(DEFAULT_WEATHER_LOCATION);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          startWeatherUpdates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          startWeatherUpdates(DEFAULT_WEATHER_LOCATION);
        },
      );
    }

    return () => {
      cancelled = true;

      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [apiKey]);

  return state;
}
