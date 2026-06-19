const { test, expect } = require('@playwright/test');
const { fillContactForm, moveReservationToReview, openGalleryLightbox } = require('./helpers');

test.describe('Accessibility and keyboard coverage', () => {
  test('skip link is keyboard reachable', async ({ page }) => {
    await page.goto('/menu');

    const skipLink = page.getByRole('link', { name: 'Прескочи към съдържанието' });

    for (let i = 0; i < 4; i += 1) {
      if (await skipLink.evaluate((element) => element === document.activeElement)) {
        break;
      }
      await page.keyboard.press('Tab');
    }

    await expect(skipLink).toBeFocused();
  });

  test('reservation terms dialog opens and closes with keyboard controls', async ({ page }) => {
    await page.goto('/reservation');
    await moveReservationToReview(page, { email: false });

    const summaryButton = page.getByRole('button', { name: /Прочети накратко/ });
    await summaryButton.focus();
    await page.keyboard.press('Enter');

    const termsDialog = page.getByRole('dialog', { name: /Правила и условия \/ Лични данни/ });
    await expect(termsDialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(termsDialog).toBeHidden();
  });

  test('contact form exposes alert and live status regions', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('#contact-first-name').fill('И');
    await page.locator('#contact-last-name').click();

    await expect(page.locator('#contactForm [role="alert"]').first()).toBeVisible();

    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Благодарим за вашето съобщение! Ще се свържем с вас скоро.',
        }),
      });
    });

    await fillContactForm(page, { email: 'accessibility@example.com' });
    const privacyConsent = page.locator('input[name="privacy_consent"]');
    await privacyConsent.focus();
    await expect(privacyConsent).toBeFocused();
    await page.keyboard.press('Space');
    await expect(privacyConsent).toBeChecked();
    await page.getByRole('button', { name: /Изпрати съобщение/ }).click();

    await expect(page.locator('#contactForm [role="status"]')).toContainText(
      'Благодарим за вашето съобщение! Ще се свържем с вас скоро.'
    );
  });

  test('gallery lightbox manages focus for keyboard users', async ({ page }) => {
    await page.goto('/gallery');
    const {
      lightboxDialog,
      closeButton,
      counter,
    } = await openGalleryLightbox(page);

    await expect(lightboxDialog).toBeVisible();
    await expect(closeButton).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText(/2\s*\/\s*\d+/);

    await page.keyboard.press('Escape');
    await expect(lightboxDialog).toBeHidden();
  });
});
