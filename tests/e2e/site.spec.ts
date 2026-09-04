import { expect, test } from "@playwright/test";

test("primary pages render and navigate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Collective Intelligence");
  await page.getByRole("link", { name: "How we work" }).first().click();
  await expect(page).toHaveURL(/how-we-work/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Structure before");
});

test("hero scroll reveals products, ROLE:X and contact actions", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator(".hero-scroll");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Collective Intelligence");
  await hero.evaluate((element) => {
    const section = element as HTMLElement;
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * .34);
  });
  await expect(page.getByRole("heading", { name: /AI that moves work/i })).toBeVisible();
  await hero.evaluate((element) => {
    const section = element as HTMLElement;
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * .62);
  });
  await expect(page.getByRole("heading", { name: /A silent AI inside/i })).toBeVisible();
  await hero.evaluate((element) => {
    const section = element as HTMLElement;
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * .88);
  });
  await expect(page.getByRole("link", { name: /Start the conversation/i })).toBeVisible();
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
