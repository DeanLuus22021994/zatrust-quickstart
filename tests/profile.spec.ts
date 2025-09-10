import { test, expect } from "@playwright/test";

test("unauthenticated user visiting /profile is redirected to login", async ({
  page,
}) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login\?from=%2Fprofile/);
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("authenticated user can view profile page", async ({ page }) => {
  // Login
  await page.goto("/login?from=/profile");
  await page.getByLabel("Username").fill("profUser");
  await page.getByRole("button", { name: "Login" }).click();

  // Redirect back
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
  await expect(page.getByText("User: profUser")).toBeVisible();
});