import { expect, test } from "@playwright/test";

test("single galaxy has no floating controls and follows real sections", async ({ page }, testInfo) => {
  if (testInfo.project.name === "chromium") await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => { if (e.type() === "error") errors.push(e.text()); });
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await expect(canvas).toHaveAttribute("data-draw-calls", "4");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Explore the galaxy|Pause motion|Resume motion/ })).toHaveCount(0);
  await expect(page.locator(".galaxy-observatory")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("single-hero.jpg"), type: "jpeg", quality: 80, scale: "css" });
  await page.locator("#explore").evaluate((section) => window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - innerHeight * .25, behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-explosion"))).toBeGreaterThan(1);
  await page.locator("#products").evaluate((section) => window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - innerHeight * .25, behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-shape"))).toBeGreaterThan(.8);
  await page.locator("#explore").scrollIntoViewIfNeeded();
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.locator(".role-core").evaluate((core) => core.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-orb-formation"))).toBeGreaterThan(.95);
  await page.locator("#products").evaluate((section) => section.scrollIntoView({ block: "start", behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-orb-formation"))).toBeLessThan(.05);
  await page.locator(".role-core").evaluate((core) => core.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-orb-formation"))).toBeGreaterThan(.95);
  await page.locator(".home-hero").evaluate((hero) => hero.scrollIntoView({ behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-orb-formation"))).toBeLessThan(.05);
  expect(errors).toEqual([]);
});

test("galaxy stays mounted across marketing and legal routes", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await canvas.evaluate((el) => el.setAttribute("data-persistent", "original"));
  for (const route of ["/products", "/academy", "/how-we-work", "/work", "/about", "/contact-sales", "/privacy", "/terms"]) {
    await page.locator('.site-footer a[href="' + route + '"]').first().click();
    await expect(page).toHaveURL(new RegExp(route + "$"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(canvas).toHaveAttribute("data-persistent", "original");
    await expect(page.locator("canvas")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("reduced motion remains automatic without visible controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-motion", "paused");
  await expect(canvas).toHaveAttribute("data-assembly", "1.00");
  const shape = await canvas.getAttribute("data-shape");
  await page.locator("#explore").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-shape", shape!);
  await expect(page.locator(".role-core-mesh")).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toHaveAttribute("data-motion", "running");
});

test("surface reflections respect the system motion preference", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Touch does not use hover effects.");
  await page.goto("/about");
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-ready", "true");
  const card = page.locator(".page-hero-intro");
  await expect(async () => {
    await page.mouse.move(0, 0);
    await card.hover({ position: { x: 30, y: 30 } });
    await expect(card).toHaveAttribute("data-surface-active", "true", { timeout: 500 });
  }).toPass();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).not.toHaveAttribute("data-surface-active", "true");
});

test("no WebGL retains the diagram and contact links", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).includes("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("/#explore");
  await expect(page.locator(".galaxy-fallback")).toBeVisible();
  await expect(page.locator(".hero-sculpture")).toBeVisible();
  await expect(page.getByRole("heading", { name: "ROLE:X", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "ERP", exact: true }).click();
  await page.getByRole("link", { name: "Run this on your workflow" }).click();
  await expect(page).toHaveURL(/reason=rolex/);
});
