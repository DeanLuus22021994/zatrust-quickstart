import { expect, test } from '@playwright/test';

// Basic E2E flow covering landing, auth, and dashboard

test('landing page shows CTA to login', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to Zatrust' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to Login' })).toBeVisible();
});

test('unauthenticated user is redirected from /dashboard to /login', async ({ page }) => {
  const resp = await page.goto('/dashboard');
  // Next.js middleware redirects to /login
  expect(resp?.status()).toBeLessThan(400);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('user can login and see dashboard, then logout', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('demo');
  await page.getByRole('button', { name: 'Login' }).click();

  // redirected to /dashboard
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Welcome, demo')).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/$/);
});
