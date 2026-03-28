const { expect } = require('@playwright/test');

async function selectFutureReservationSlot(page) {
  const dateButtons = page.locator('.rsv-cal-day:not(.rsv-cal-disabled)');
  const dateButtonCount = await dateButtons.count();

  for (let i = 0; i < dateButtonCount; i += 1) {
    const dateButton = dateButtons.nth(i);
    await expect(dateButton).toBeVisible();
    await dateButton.click();

    const timeSlots = page.locator('.rsv-time-slot');
    const noSlotsMessage = page.locator('.rsv-no-slots');

    await page.waitForTimeout(100);

    if (await timeSlots.count()) {
      const timeSlot = timeSlots.first();
      await expect(timeSlot).toBeVisible();
      await timeSlot.click();
      return;
    }

    if (await noSlotsMessage.isVisible().catch(() => false)) {
      continue;
    }
  }

  throw new Error('No reservation time slots were available in the visible calendar.');
}

async function moveReservationToReview(page, overrides = {}) {
  await selectFutureReservationSlot(page);
  await page.getByRole('button', { name: /Напред/ }).click();

  await page.locator('#reservation-first-name').fill(overrides.firstName || 'Иван');
  await page.locator('#reservation-last-name').fill(overrides.lastName || 'Петров');
  await page.locator('#reservation-phone').fill(overrides.phone || '0888123456');

  if (overrides.email !== false) {
    await page.locator('#reservation-email').fill(overrides.email || 'ivan@example.com');
  }

  await page.getByRole('button', { name: /Напред/ }).click();
}

async function fillContactForm(page, overrides = {}) {
  await page.locator('#contact-first-name').fill(overrides.firstName || 'Иван');
  await page.locator('#contact-last-name').fill(overrides.lastName || 'Петров');
  await page.locator('#contact-phone').fill(overrides.phone || '0888123456');
  await page.locator('#contact-email').fill(overrides.email || 'ivan@example.com');
  await page.locator('#contact-message').fill(
    overrides.message || 'Това е тестово съобщение за контактната форма.'
  );
}

async function openGalleryLightbox(page, filterIndex = 3) {
  const filterButtons = page.locator('.gallery-filter-btn');
  const filterCount = await filterButtons.count();

  if (filterCount > 0) {
    const targetFilter = filterButtons.nth(Math.min(filterIndex, filterCount - 1));
    await expect(targetFilter).toBeVisible();
    await targetFilter.click();
  }

  const loadingStatus = page.getByRole('status').filter({ hasText: /Loading|Зареждане/i }).first();
  await loadingStatus.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

  const imageButtons = page.locator('.gallery-trigger');
  const imageCount = await imageButtons.count();

  expect(imageCount).toBeGreaterThan(0);

  let firstImageButton = null;

  for (let i = 0; i < imageCount; i += 1) {
    const candidate = imageButtons.nth(i);

    if (await candidate.isVisible()) {
      firstImageButton = candidate;
      break;
    }
  }

  if (!firstImageButton) {
    throw new Error('No visible gallery image button was found.');
  }

  await expect(firstImageButton).toBeVisible();
  await firstImageButton.click();

  const lightboxDialog = page
    .locator('[role="dialog"]')
    .filter({ has: page.getByRole('button', { name: /Затвори изображението/i }) })
    .first();
  await expect(lightboxDialog).toBeVisible();

  return {
    firstImageButton,
    lightboxDialog,
    closeButton: lightboxDialog.getByRole('button', { name: /Затвори изображението/i }),
    counter: lightboxDialog.locator('[aria-live="polite"]'),
  };
}

module.exports = {
  fillContactForm,
  moveReservationToReview,
  openGalleryLightbox,
  selectFutureReservationSlot,
};
