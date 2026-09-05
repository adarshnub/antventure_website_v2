import { expect, test } from "@playwright/test";

test("observatory reshapes the shared scene and returns focus to the website", async ({ page }, testInfo) => {
  await page.goto("/about");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  const launcher = page.getByRole("button", { name: "Explore the galaxy" });
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: /One universe/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Back to website" })).toBeFocused();
  await expect.poll(async () => Number(await canvas.getAttribute("data-focus"))).toBeGreaterThan(.98);
  await dialog.getByRole("button", { name: "Helix", exact: false }).click();
  await expect.poll(async () => Number(await canvas.getAttribute("data-shape"))).toBeGreaterThan(1.95);
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(canvas).toHaveAttribute("data-draw-calls", "3");
  await page.screenshot({ path: testInfo.outputPath("observatory-helix.jpg"), type: "jpeg", quality: 80, scale: "css" });
  await dialog.getByRole("button", { name: "Pause motion" }).click();
  await expect(canvas).toHaveAttribute("data-motion", "paused");
  await dialog.getByRole("button", { name: "Collective", exact: false }).click();
  await expect(canvas).toHaveAttribute("data-shape", "3.00");
  const dispersion = dialog.getByRole("slider", { name: "Disperse the stars" });
  await dispersion.focus();
  await page.keyboard.press("End");
  await expect(canvas).toHaveAttribute("data-explosion", "1.50");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(launcher).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("observatory works with reduced motion and restores the page scroll position", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-motion", "paused");
  await page.locator(".case-study").first().scrollIntoViewIfNeeded();
  const position = await page.evaluate(() => scrollY);
  await page.getByRole("button", { name: "Explore the galaxy" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Orbit", exact: false }).click();
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-shape", "1.00");
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-motion", "paused");
  await dialog.getByRole("button", { name: "Back to website" }).click();
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(position, 0);
});

test("surface reflections follow the cursor and respect the motion switch", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Hover enhancement is intentionally disabled for touch.");
  await page.goto("/about");
  const card = page.locator(".page-hero-intro");
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-ready", "true");
  await expect(async () => {
    await page.mouse.move(0, 0);
    await card.hover({ position: { x: 30, y: 30 } });
    await expect(card).toHaveAttribute("data-surface-active", "true", { timeout: 500 });
  }).toPass();
  await page.getByRole("button", { name: "Pause motion" }).click();
  await card.hover();
  await expect(card).not.toHaveAttribute("data-surface-active", "true");
});

test("one galaxy persists across sections, pauses and leaves navigation usable", async ({ page }, testInfo) => {
  if (testInfo.project.name === "chromium") await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  await expect(canvas).toHaveAttribute("data-draw-calls", "3");
  await expect(canvas).toHaveCSS("opacity", "1");
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.mouse.move(1000, 390);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(canvas).toHaveAttribute("data-motion", "paused");
  await page.screenshot({ path: testInfo.outputPath("galaxy-hero.jpg"), type: "jpeg", quality: 80, scale: "css" });
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(canvas).toHaveAttribute("data-motion", "running");
  await page.locator(".system").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator(".system-node").first()).toHaveCSS("opacity", "1");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await page.screenshot({ path: testInfo.outputPath("galaxy-system.jpg"), type: "jpeg", quality: 80, scale: "css" });
  await page.locator("#explore").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("galaxy-explorer.jpg"), type: "jpeg", quality: 80, scale: "css" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("galaxy stays mounted across every marketing and legal route", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await canvas.evaluate((element) => { element.setAttribute("data-test-persistent", "original"); });
  for (const route of ["/how-we-work", "/work", "/about", "/contact-sales", "/privacy", "/terms"]) {
    await page.locator(`.site-footer a[href="${route}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(canvas).toHaveAttribute("data-test-persistent", "original");
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect(canvas).toHaveAttribute("data-ready", "true");
    await page.screenshot({ path: testInfo.outputPath(`${route.slice(1)}.jpg`), type: "jpeg", quality: 80, scale: "css" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("scroll disperses stars and reforms them into a ring", async ({ page }, testInfo) => {
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await page.locator(".system").evaluate((section) => window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - innerHeight * .25, behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-explosion"))).toBeGreaterThan(1);
  await page.locator(".galaxy-passage").evaluate((section) => window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - innerHeight * .25, behavior: "instant" }));
  await expect.poll(async () => Number(await canvas.getAttribute("data-shape"))).toBeGreaterThan(.8);
  await page.screenshot({ path: testInfo.outputPath("orbital-ring.jpg"), type: "jpeg", quality: 80, scale: "css" });
  await page.getByRole("button", { name: "Pause motion" }).click();
  const before = await canvas.getAttribute("data-shape");
  await page.locator(".cta-band").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: /Bring us one/ }).first()).toBeVisible();
  await expect(canvas).toHaveAttribute("data-shape", before!);
});

test("reduced motion renders a still galaxy and usable page sections", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-motion", "paused", { timeout: 20000 });
  await expect(page.getByRole("button", { name: "Resume motion" })).toBeVisible();
  await page.locator(".rolex-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".rolex-section h2")).toBeVisible();
});

test("without WebGL the static galaxy and contact links remain available", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).includes("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("/");
  await expect(page.locator(".galaxy-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Collective Intelligence");
  await page.locator(".home-hero").getByRole("link", { name: "Request a demo" }).click();
  await expect(page).toHaveURL(/contact-sales/);
});
