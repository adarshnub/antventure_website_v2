import { expect, test } from "@playwright/test";

test("primary pages render and navigate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Collective Intelligence");
  await page.getByRole("link", { name: "How we work" }).first().click();
  await expect(page).toHaveURL(/how-we-work/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Structure before");
});

test("hero is a single opening section with direct actions", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator(".home-hero");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Collective Intelligence");
  await expect(page.locator(".hero-scroll, .hero-scene-index")).toHaveCount(0);
  expect(await hero.evaluate((element) => element.getBoundingClientRect().height / innerHeight)).toBeLessThan(1.4);
  await expect(hero.getByRole("link", { name: "Request a demo" })).toHaveAttribute("href", "/contact-sales");
  await hero.getByRole("link", { name: "Discover collective intelligence" }).click();
  await expect(page.getByRole("heading", { name: "AI transformation is a system." })).toBeInViewport();
  await expect(page.getByRole("heading", { level: 1 })).not.toBeInViewport();
  await page.goto("/");
  await hero.getByRole("link", { name: "Explore what we can automate" }).click();
  await expect(page).toHaveURL(/#explore$/);
  await expect(page.locator("#explore")).toBeInViewport();
});

test("ROLE:X demo gates its outputs and carries context into contact", async ({ page }, testInfo) => {
  await page.goto("/#explore");
  await expect(page.getByRole("heading", { name: "Plug-and-play." })).toBeVisible();
  await page.locator(".role-demo-map").screenshot({ path: testInfo.outputPath("role-demo.jpg"), type: "jpeg", quality: 85, scale: "css" });
  for (const input of ["Email", "WhatsApp", "ERP", "Forms"]) {
    await page.getByRole("button", { name: input, exact: true }).click();
    await expect(page.locator(".role-demo-map")).toHaveAttribute("data-approved", "false");
    await expect(page.getByRole("button", { name: input, exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Approve example" }).click();
    await expect(page.locator(".role-demo-map")).toHaveAttribute("data-approved", "true");
    await expect(page.getByRole("button", { name: "Demo approved" })).toBeDisabled();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Run this on your workflow" }).click();
  await expect(page).toHaveURL(/contact-sales\?reason=rolex/);
  expect(new URL(page.url()).searchParams.get("scenario")).toContain("Forms");
});

test("contact form exposes accessible labels", async ({ page }) => {
  await page.goto("/contact-sales");
  await expect(page.getByLabel("Work email")).toBeVisible();
  await page.getByRole("button", { name: /Contact sales/ }).click();
  await expect(page.getByText("Enter your first name")).toBeVisible();
});
