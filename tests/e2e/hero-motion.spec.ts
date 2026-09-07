import { expect, test } from "@playwright/test";

test("hero sculpture replaces the galaxy and transitions into the product scene", async ({ page }, testInfo) => {
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await expect(canvas).toHaveAttribute("data-hero-blend", "1.00");
  await expect(canvas).toHaveAttribute("data-assembly", "1.00", { timeout: 12000 });
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".hero-collective")).toHaveCount(0);
  await expect(page.locator(".hero-weave-fallback")).toHaveCSS("opacity", "0");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("hero-sculpture.jpg"), type: "jpeg", quality: 85, scale: "css" });
  await page.locator(".role-core").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-hero-blend"))).toBeLessThan(.05);
  await expect.poll(async () => Number(await canvas.getAttribute("data-orb-formation"))).toBeGreaterThan(.95);
});

test("hero sculpture has a static accessible fallback", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.getByRole("img", { name: /Three independent streams/ })).toBeVisible();
  await expect(page.locator(".hero-weave-fallback")).toHaveCSS("opacity", "0.9");
  await expect(page.locator(".hero-weave-fallback path")).toHaveCount(8);
  await context.close();
});
