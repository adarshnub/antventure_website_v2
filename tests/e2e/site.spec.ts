import { expect, test } from "@playwright/test";

test("primary pages render and navigate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Collective Intelligence");
  await page.getByRole("link", { name: "How we work" }).first().click();
  await expect(page).toHaveURL(/how-we-work/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Structure before");
});

test("explorer creates a contact-ready workflow", async ({ page }) => {
  await page.goto("/#explore");
  await page.getByRole("button", { name: "Businesses" }).click();
  await page.getByRole("button", { name: "Finance" }).click();
  await page.getByRole("button", { name: "BOQ pricing" }).click();
  await expect(page.getByText("Your transformation map")).toBeVisible();
  await page.getByRole("link", { name: /Run this on a real workflow/ }).click();
  await expect(page).toHaveURL(/contact-sales\?reason=workflow/);
});

test("contact form exposes accessible labels", async ({ page }) => {
  await page.goto("/contact-sales");
  await expect(page.getByLabel("Work email")).toBeVisible();
  await page.getByRole("button", { name: /Contact sales/ }).click();
  await expect(page.getByText("Enter your first name")).toBeVisible();
});
