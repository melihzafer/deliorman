const { test, expect } = require('@playwright/test');
const menuData = require('../../src/data/menu.json');
const {
  fillContactForm,
  moveReservationToReview,
  openGalleryLightbox,
} = require('./helpers');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test.describe('Critical customer journeys', () => {
  test('reservation flow submits a complete booking request', async ({ page }) => {
    let reservationRequestBody = '';

    await page.route('**/api/reservation', async (route) => {
      reservationRequestBody = route.request().postData() || '';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Заявката за резервация е изпратена. Очаквайте обаждане за потвърждение.',
          data: { phone: '+359888123456' },
        }),
      });
    });

    await page.goto('/reservation');
    await moveReservationToReview(page);

    await page.locator('input[name="privacy_consent"]').check();
    await page.getByRole('button', { name: /Изпрати резервация/ }).click();

    await expect(page.getByText('Заявката е изпратена!')).toBeVisible();
    await expect(page.getByRole('button', { name: /Добави в календар/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Нова резервация/ })).toBeVisible();

    expect(reservationRequestBody).toContain('name="first_name"');
    expect(reservationRequestBody).toContain('Иван');
    expect(reservationRequestBody).toContain('name="privacy_consent"');
    expect(reservationRequestBody).toContain('true');
  });

  test('contact form submits successfully after valid input', async ({ page }) => {
    let contactRequestBody = '';

    await page.route('**/api/contact', async (route) => {
      contactRequestBody = route.request().postData() || '';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Благодарим за вашето съобщение! Ще се свържем с вас скоро.',
        }),
      });
    });

    await page.goto('/contact');
    await fillContactForm(page);
    await page.locator('input[name="privacy_consent"]').check();
    await page.getByRole('button', { name: /Изпрати съобщение/ }).click();

    await expect(page.getByText('Благодарим за вашето съобщение! Ще се свържем с вас скоро.')).toBeVisible();
    expect(contactRequestBody).toContain('name="email"');
    expect(contactRequestBody).toContain('ivan@example.com');
  });

  test('menu ordering uses the floating summary and legacy order pages redirect with guidance', async ({ page }) => {
    const targetCategory = menuData.categories[1];
    const targetItem = targetCategory.items[0];

    await page.goto('/menu');
    const targetCategoryButton = page.getByRole('button', {
      name: new RegExp(targetCategory.name, 'i'),
    });
    await targetCategoryButton.click();

    await expect(targetCategoryButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('heading', { name: targetItem.title })).toBeVisible();

    const addToOrderButton = page.getByRole('button', {
      name: new RegExp(`Добави ${escapeRegex(targetItem.title)} към поръчката`, 'i'),
    });
    const orderSummaryBar = page.getByRole('button', { name: /Преглед на поръчката/i });

    await addToOrderButton.scrollIntoViewIfNeeded();
    await addToOrderButton.focus();
    await expect(addToOrderButton).toBeFocused();
    await addToOrderButton.evaluate((button) => button.click());
    await expect(orderSummaryBar).toBeVisible();
    await expect(page.locator('.tst-order-badge')).toHaveText('1');

    await orderSummaryBar.click();
    await expect(page.getByRole('heading', { name: /Вашата поръчка/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Поръчай по WhatsApp/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Обади се:/i })).toBeVisible();

    for (const legacyPath of ['/cart', '/checkout']) {
      await page.goto(legacyPath);
      await expect(page.getByRole('button', { name: /Преглед на поръчката/i })).toHaveCount(0);
      await expect(page.getByRole('link', { name: /Към менюто/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /WhatsApp/i })).toBeVisible();
      await expect(
        page.locator('.tst-icon-box p').filter({ hasText: /плаващата лента/i }).first()
      ).toBeVisible();
    }
  });

  test('gallery filters and lightbox interactions work', async ({ page }) => {
    await page.goto('/gallery');
    const { lightboxDialog, closeButton, counter } = await openGalleryLightbox(page);

    await expect(lightboxDialog).toBeVisible();
    await expect(counter).toHaveText(/1\s*\/\s*\d+/);

    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText(/2\s*\/\s*\d+/);

    await closeButton.click();
    await expect(lightboxDialog).toBeHidden();
  });

  test('language switching preserves the current route and updates locale state', async ({ page }) => {
    const headerSwitcher = page.locator('.tst-menu-right .tst-lang-switcher:visible').first();
    const activeLocaleButton = headerSwitcher.locator('.tst-lang-btn[aria-current="true"]').first();

    async function switchLocale(locale) {
      const localeButton = headerSwitcher
        .locator('.tst-lang-btn')
        .filter({ hasText: new RegExp(`\\b${locale.toUpperCase()}\\b`) })
        .first();

      await expect(localeButton).toBeVisible();
      await localeButton.evaluate((button) => button.click());

      await expect(page).toHaveURL(new RegExp(`/${locale}/menu(?:[?#].*)?$`));
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('navigation').first()).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(activeLocaleButton).toContainText(locale.toUpperCase());
    }

    await page.goto('/menu');
    await expect(headerSwitcher).toBeVisible();

    await switchLocale('en');
    await switchLocale('tr');
  });
});
