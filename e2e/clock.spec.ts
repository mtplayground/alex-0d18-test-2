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

test('analog clock face renders and the second hand rotates', async ({ page }) => {
  await page.goto('/');

  const analogClock = page.getByRole('img', { name: 'Analog clock' });
  await expect(analogClock).toBeVisible();
  await expect(analogClock.locator('circle')).toHaveCount(3);
  await expect(analogClock.locator('[data-clock-hand]')).toHaveCount(3);

  const numerals = await analogClock.locator('text').allTextContents();
  expect(numerals).toHaveLength(24);
  expect(numerals).toEqual(expect.arrayContaining(['I', 'XII', '1', '12']));

  const secondHand = analogClock.locator('[data-clock-hand="second"]');
  const initialTransform = await secondHand.evaluate((element) => {
    return window.getComputedStyle(element).transform;
  });

  await expect
    .poll(async () => {
      return secondHand.evaluate((element) => window.getComputedStyle(element).transform);
    })
    .not.toBe(initialTransform);
});
