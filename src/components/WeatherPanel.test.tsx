// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeatherPanel } from './WeatherPanel';

const weather = {
  city: 'London',
  description: 'light rain',
  feelsLike: 18,
  temperature: 20.4,
};

describe('WeatherPanel', () => {
  it('renders weather details', () => {
    render(<WeatherPanel data={weather} loading={false} error={null} />);

    expect(screen.getByRole('region', { name: 'Current weather' })).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'London' })).not.toBeNull();
    expect(screen.getByText('20.4°C')).not.toBeNull();
    expect(screen.getByText('Light rain')).not.toBeNull();
    expect(screen.getByText('Feels like 18°C')).not.toBeNull();
  });

  it('renders a loading state', () => {
    render(<WeatherPanel data={null} loading={true} error={null} />);

    expect(screen.getByRole('status').textContent).toContain('Loading weather');
  });

  it('renders an error state', () => {
    render(<WeatherPanel data={null} loading={false} error="OpenWeatherMap rejected the API key." />);

    expect(screen.getByRole('alert').textContent).toContain('Weather unavailable');
    expect(screen.getByRole('alert').textContent).toContain('OpenWeatherMap rejected the API key.');
  });

  it('renders an unconfigured empty state', () => {
    render(<WeatherPanel data={null} loading={false} error={null} />);

    expect(screen.getByText('Weather is not configured.')).not.toBeNull();
  });
});
