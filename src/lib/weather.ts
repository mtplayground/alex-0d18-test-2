const OPEN_WEATHER_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather';

export type WeatherData = {
  city: string;
  temperature: number;
  description: string;
  feelsLike: number;
};

export type WeatherErrorCode =
  | 'http_error'
  | 'invalid_api_key'
  | 'invalid_response'
  | 'network_error'
  | 'rate_limited';

export class WeatherApiError extends Error {
  readonly code: WeatherErrorCode;
  readonly status?: number;

  constructor(message: string, code: WeatherErrorCode, status?: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readWeatherData(payload: unknown): WeatherData {
  if (!isRecord(payload)) {
    throw new WeatherApiError('Weather response was not an object.', 'invalid_response');
  }

  const main = payload.main;
  const weather = payload.weather;

  if (!isRecord(main) || !Array.isArray(weather) || !isRecord(weather[0])) {
    throw new WeatherApiError('Weather response was missing expected data.', 'invalid_response');
  }

  const city = payload.name;
  const temperature = main.temp;
  const feelsLike = main.feels_like;
  const description = weather[0].description;

  if (
    typeof city !== 'string' ||
    typeof temperature !== 'number' ||
    typeof feelsLike !== 'number' ||
    typeof description !== 'string'
  ) {
    throw new WeatherApiError('Weather response had invalid field types.', 'invalid_response');
  }

  return {
    city,
    description,
    feelsLike,
    temperature,
  };
}

function errorForStatus(status: number): WeatherApiError {
  if (status === 401 || status === 403) {
    return new WeatherApiError('OpenWeatherMap rejected the API key.', 'invalid_api_key', status);
  }

  if (status === 429) {
    return new WeatherApiError('OpenWeatherMap rate limit exceeded.', 'rate_limited', status);
  }

  return new WeatherApiError(`OpenWeatherMap request failed with status ${status}.`, 'http_error', status);
}

export async function fetchWeather(lat: number, lon: number, apiKey: string): Promise<WeatherData> {
  if (!apiKey.trim()) {
    throw new WeatherApiError('OpenWeatherMap API key is required.', 'invalid_api_key');
  }

  const url = new URL(OPEN_WEATHER_CURRENT_URL);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('appid', apiKey);
  url.searchParams.set('units', 'metric');

  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch {
    throw new WeatherApiError('Unable to reach OpenWeatherMap.', 'network_error');
  }

  if (!response.ok) {
    throw errorForStatus(response.status);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new WeatherApiError('Weather response was not valid JSON.', 'invalid_response');
  }

  return readWeatherData(payload);
}
