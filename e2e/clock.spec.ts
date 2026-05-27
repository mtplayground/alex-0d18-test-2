import { expect, test } from '@playwright/test';

const twentyFourHourPattern = /^\d{2}:\d{2}:\d{2}$/;
const twelveHourPattern = /^\d{2}:\d{2}:\d{2} (AM|PM)$/;

test('clock toggles between 24-hour and 12-hour formats and persists after reload', async ({
  page,
}) => {
  await page.goto('/');

  const clock = page.locator('time');
  await expect(clock).toHaveText(twentyFourHourPattern);

  await page.getByRole('button', { name: 'Switch to 12-hour time' }).click();
  await expect(clock).toHaveText(twelveHourPattern);

  await page.reload();
  await expect(clock).toHaveText(twelveHourPattern);

  await page.getByRole('button', { name: 'Switch to 24-hour time' }).click();
  await expect(clock).toHaveText(twentyFourHourPattern);
});
