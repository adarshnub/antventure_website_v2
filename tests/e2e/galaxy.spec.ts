import { expect, test } from "@playwright/test";

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
  await page.screenshot({ path: testInfo.outputPath("galaxy-hero.png") });
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(canvas).toHaveAttribute("data-motion", "running");
  await page.getByRole("button", { name: "Show What we engineer" }).click();
  await expect(page.getByRole("heading", { name: /AI that moves work/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("galaxy-exploded.png") });
  await page.locator(".system").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator(".system-node").first()).toHaveCSS("opacity", "1");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await page.screenshot({ path: testInfo.outputPath("galaxy-system.png") });
  await page.locator("#explore").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("galaxy-explorer.png") });
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
    await page.screenshot({ path: testInfo.outputPath(`${route.slice(1)}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("scroll disperses stars and reforms them into a ring", async ({ page }, testInfo) => {
  await page.goto("/");
  const canvas = page.locator(".galaxy-canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Show What we engineer" }).click();
  await expect.poll(async () => Number(await canvas.getAttribute("data-explosion"))).toBeGreaterThan(1);
  await page.getByRole("button", { name: "Show Flagship product / ROLE:X" }).click();
  await expect.poll(async () => Number(await canvas.getAttribute("data-shape"))).toBeGreaterThan(.8);
  await page.screenshot({ path: testInfo.outputPath("orbital-ring.png") });
  await page.getByRole("button", { name: "Pause motion" }).click();
  const before = await canvas.getAttribute("data-shape");
  await page.getByRole("button", { name: "Show Your first move" }).click();
  await expect(page.getByRole("heading", { name: /Bring us one/ }).first()).toBeVisible();
  await expect(canvas).toHaveAttribute("data-shape", before!);
});

test("reduced motion renders a still galaxy and usable chapters", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".galaxy-canvas")).toHaveAttribute("data-motion", "paused", { timeout: 20000 });
  await expect(page.getByRole("button", { name: "Resume motion" })).toBeVisible();
  await page.getByRole("button", { name: "Show Flagship product / ROLE:X" }).click();
  await expect(page.getByRole("heading", { name: /A silent AI inside/ })).toBeVisible();
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
  await page.getByRole("link", { name: "Talk to us" }).click();
  await expect(page).toHaveURL(/contact-sales/);
});
