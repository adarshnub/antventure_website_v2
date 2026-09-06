import { expect, test } from "@playwright/test";

test("product portfolio, details and enquiry context", async ({ page }, testInfo) => {
  await page.goto("/products");
  await expect(page.locator(".product-card")).toHaveCount(5);
  await expect(page.locator(".role-demo")).toContainText("ROLE:X / Flagship product");
  await expect(page.locator(".product-card-flagship")).toHaveCount(0);
  expect(await page.locator(".role-demo").evaluate((el) => Boolean(el.compareDocumentPosition(document.querySelector(".product-grid")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("products.jpg"), type: "jpeg", quality: 80, scale: "css" });
  await page.locator(".product-card").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("product-cards.jpg"), type: "jpeg", quality: 80, scale: "css" });
  for (const [slug, name] of [["role-x", "ROLE:X"], ["influence", "Influence"], ["interact", "Interact"], ["in-house", "In-House"], ["inspire", "Inspire"], ["organization-brain", "Organization AI Brain"]]) {
    await page.goto(`/products/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.locator(".product-visual")).toBeVisible();
    await expect(page.locator(".setup-flow li")).toHaveCount(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole("link", { name: "Request a Organization AI Brain demo" }).click();
  await expect(page.getByLabel("Reason for contact")).toHaveValue("Product demonstration");
  await expect(page.getByLabel("Tell us about the work")).toHaveValue(/Organization AI Brain/);
});

test("academy, other projects and legacy routes", async ({ page }) => {
  await page.goto("/academy");
  await expect(page.locator(".academy-modules article")).toHaveCount(6);
  await page.getByRole("link", { name: "Book a corporate session" }).click();
  await expect(page.getByLabel("Reason for contact")).toHaveValue("Ant AI Academy / corporate training");
  await page.goto("/work");
  await expect(page.locator(".project-directory article")).toHaveCount(6);
  for (const [old, slug] of [["influence", "influence"], ["interact", "interact"], ["inhouse", "in-house"], ["inspire", "inspire"], ["aibrain", "organization-brain"]]) {
    await page.goto(`/${old}`);
    await expect(page).toHaveURL(new RegExp(`/products/${slug}$`));
  }
});
