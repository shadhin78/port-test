import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", title: /Ratul Islam Shadhin/ },
  { path: "/about", title: /^About \| Ratul Islam Shadhin$/ },
  { path: "/projects", title: /^Projects \| Ratul Islam Shadhin$/ },
  { path: "/blog", title: /^Blog \| Ratul Islam Shadhin$/ },
  { path: "/contact", title: /^Contact \| Ratul Islam Shadhin$/ },
];

for (const route of routes) {
  test(`${route.path} renders with one h1, a title and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test(`${route.path} has no horizontal overflow`, async ({ page }) => {
    await page.goto(route.path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("unknown routes return a real 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("robots.txt and sitemap.xml are served and consistent", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).not.toMatch(/Disallow:\s*\/\s*$/m);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const path of ["/", "/about", "/projects", "/contact"]) {
    expect(xml).toMatch(new RegExp(`<loc>[^<]*${path === "/" ? "/" : path}</loc>`));
  }
});

test("every page exposes a canonical URL and valid JSON-LD", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBe(1);
    expect(() => JSON.parse(blocks[0])).not.toThrow();
  }
});

test("skip link is the first focusable element and targets main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("theme toggle switches and persists the theme", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test.describe("desktop navigation", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop layout only");
  });

  test("primary links navigate and mark the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  });
});

test.describe("mobile navigation", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile layout only");
  });

  test("menu opens, is keyboard operable, closes on Escape and on navigation", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();

    await toggle.click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("touch targets in the header are at least 44px", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Open menu", /Switch to/]) {
      const box = await page.getByRole("button", { name }).boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});
