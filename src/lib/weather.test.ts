import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWeather, WeatherApiError } from './weather';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls OpenWeatherMap and returns normalized weather data', async () => {
    const fetchMock = mockFetch(
      jsonResponse({
        main: {
          feels_like: 18.6,
          temp: 20.4,
        },
        name: 'London',
        weather: [{ description: 'light rain' }],
      }),
    );

    await expect(fetchWeather(51.5072, -0.1276, 'test-api-key')).resolves.toEqual({
      city: 'London',
      description: 'light rain',
      feelsLike: 18.6,
      temperature: 20.4,
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string];
    const url = new URL(requestUrl);

    expect(url.origin + url.pathname).toBe('https://api.openweathermap.org/data/2.5/weather');
    expect(url.searchParams.get('lat')).toBe('51.5072');
    expect(url.searchParams.get('lon')).toBe('-0.1276');
    expect(url.searchParams.get('appid')).toBe('test-api-key');
    expect(url.searchParams.get('units')).toBe('metric');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects blank API keys before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchWeather(10, 20, '   ')).rejects.toMatchObject({
      code: 'invalid_api_key',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('wraps network failures in a weather API error', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);
    const request = fetchWeather(10, 20, 'test-api-key');

    await expect(request).rejects.toBeInstanceOf(WeatherApiError);
    await expect(request).rejects.toMatchObject({
      code: 'network_error',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports invalid API keys', async () => {
    const fetchMock = mockFetch(new Response('Unauthorized', { status: 401 }));
    const request = fetchWeather(10, 20, 'bad-api-key');

    await expect(request).rejects.toBeInstanceOf(WeatherApiError);
    await expect(request).rejects.toMatchObject({
      code: 'invalid_api_key',
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports rate limits', async () => {
    const fetchMock = mockFetch(new Response('Too Many Requests', { status: 429 }));
    const request = fetchWeather(10, 20, 'test-api-key');

    await expect(request).rejects.toBeInstanceOf(WeatherApiError);
    await expect(request).rejects.toMatchObject({
      code: 'rate_limited',
      status: 429,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports malformed successful responses', async () => {
    mockFetch(
      jsonResponse({
        main: { temp: 20.4 },
        name: 'London',
        weather: [],
      }),
    );

    await expect(fetchWeather(10, 20, 'test-api-key')).rejects.toMatchObject({
      code: 'invalid_response',
    });
  });
});
