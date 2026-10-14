import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const url = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  ...(process.env.PORTFOLIO_BROWSER === "chromium"
    ? {}
    : { channel: "msedge" }),
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const errors = [];
const failures = [];
const results = [];
await fs.mkdir(".artifacts", { recursive: true });
async function check(name, fn) {
  try {
    await fn();
    results.push(name);
    console.log("PASS " + name);
  } catch (e) {
    failures.push(name + ": " + e.message);
    console.error("FAIL " + name + ": " + e.message);
  }
}
async function capture(page, path, fullPage) {
  await page.evaluate(() => document.fonts.ready);
  if (fullPage)
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((image) => image.decode());
    }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path, fullPage, animations: "disabled" });
}
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  // The CI preview process may still be starting. Retry only readiness, not failed checks.
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    if (attempt === 29) throw new Error("Preview not ready");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  await page.goto(url, { waitUntil: "networkidle" });
  await check("homepage and both new case-study links", async () => {
    await page
      .getByRole("heading", { name: "Small ideas. Real things." })
      .waitFor();
    assert.equal(
      await page
        .getByRole("link", { name: "Explore Cadence", exact: true })
        .count(),
      1,
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Explore PyrOS", exact: true })
        .count(),
      1,
    );
    assert.equal(await page.locator('a[href="/agent"]').count(), 0);
    assert.equal(await page.locator('a[href*="example.com"]').count(), 0);
  });
  await check(
    "interactive WebGL scene and explicit motion control",
    async () => {
      await page.locator('.sculpture[data-mode="webgl"]').waitFor();
      await page.getByRole("button", { name: "Pause motion" }).click();
      assert.equal(
        await page
          .getByRole("button", { name: "Play motion" })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page.locator(".sculpture").getAttribute("data-mode"),
        "webgl",
      );
      assert.equal(
        await page.locator(".sculpture").getAttribute("data-running"),
        "false",
      );
      await page.getByRole("button", { name: "Play motion" }).click();
    },
  );
  await check("light mode accessibility", async () => {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
  });
  await check("scene suspends when scrolled out of view", async () => {
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector(".sculpture")?.getAttribute("data-running") ===
        "false",
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(
      () =>
        document.querySelector(".sculpture")?.getAttribute("data-running") ===
        "true",
    );
  });
  await capture(page, ".artifacts/home-desktop.png", false);
  await capture(page, ".artifacts/home-light.png", true);
  await check("dark theme persists across reload", async () => {
    await page
      .getByRole("combobox", { name: "Color theme" })
      .selectOption("dark");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.equal(
      await page.getByRole("combobox", { name: "Color theme" }).inputValue(),
      "dark",
    );
  });
  await check("dark mode accessibility", async () => {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
  });
  await capture(page, ".artifacts/home-dark.png", true);
  await check("system theme responds to OS preference", async () => {
    await page
      .getByRole("combobox", { name: "Color theme" })
      .selectOption("system");
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "light",
    );
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark",
    );
  });
  await check(
    "direct navigation to all project and retained policy routes",
    async () => {
      for (const route of [
        "cadence-mobile",
        "local-brain",
        "Spike",
        "Pyreus",
        "Uncharted",
      ]) {
        await page.goto(url + "/project/" + route, {
          waitUntil: "networkidle",
        });
        assert.equal(await page.locator("main h1").count(), 1);
        for (const image of await page.locator("main img").all()) {
          await image.scrollIntoViewIfNeeded();
          await image.evaluate((image) => image.decode());
          assert.equal(
            await image.evaluate((image) => image.naturalWidth > 0),
            true,
          );
        }
        assert.equal(
          await page.locator('link[rel="canonical"]').getAttribute("href"),
          "https://portfolio.lidldev.com/project/" + route,
        );
        assert.equal(
          await page.getByRole("link", { name: "View repository" }).count(),
          ["cadence-mobile", "local-brain"].includes(route) ? 1 : 0,
        );
      }
      for (const route of [
        "spike/privacy-policy",
        "spike/terms-of-service",
        "support",
        "privacy",
        "terms",
      ]) {
        await page.goto(url + "/" + route, { waitUntil: "networkidle" });
        assert.equal(await page.locator("#main-content").count(), 1);
        assert.equal(await page.locator("h1").count(), 1);
        const scan = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        assert.deepEqual(
          scan.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
          route,
        );
      }
    },
  );
  await check("Agent retirement and unknown-route recovery", async () => {
    await page.goto(url + "/agent");
    await page.getByRole("heading", { name: "A simpler direction." }).waitFor();
    assert.equal(await page.locator("input[type=password]").count(), 0);
    await page.goto(url + "/project/missing");
    await page
      .getByRole("heading", { name: "Nothing here. Plenty to explore." })
      .waitFor();
  });
  await check(
    "legacy caches retire without deleting unrelated data",
    async () => {
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        await caches.open("lidldev-static-v2");
        await caches.open("other-project-cache");
      });
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForFunction(
        async () => !(await caches.keys()).includes("lidldev-static-v2"),
      );
      assert.equal(
        await page.evaluate(async () =>
          (await caches.keys()).includes("other-project-cache"),
        ),
        true,
      );
    },
  );
  await check("mobile navigation and responsive widths", async () => {
    for (const width of [320, 390, 700, 960, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url, { waitUntil: "networkidle" });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
        "Overflow at " + width,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    const button = page.getByRole("button", { name: "Open navigation" });
    await button.click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Work", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Open navigation" })
        .getAttribute("aria-expanded"),
      "false",
    );
    assert.equal(new URL(page.url()).hash, "#work");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await button.click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Work", exact: true })
      .click();
    await page.waitForFunction(() => {
      const top = document.getElementById("work").getBoundingClientRect().top;
      return top >= 60 && top <= 150;
    });
    await button.click();
    await page.keyboard.press("Escape");
    assert.equal(await button.getAttribute("aria-expanded"), "false");
    await capture(page, ".artifacts/home-mobile.png", true);
  });
  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const rp = await reduced.newPage();
  await check("reduced motion shows still with usable projects", async () => {
    await rp.goto(url, { waitUntil: "networkidle" });
    assert.equal(
      await rp.locator(".sculpture").getAttribute("data-mode"),
      "fallback",
    );
    assert.equal(await rp.locator(".sculpture canvas").count(), 0);
    await rp
      .getByRole("link", { name: "Explore Cadence", exact: true })
      .click();
    await rp.getByRole("heading", { name: "Cadence." }).waitFor();
  });
  const failure = await browser.newContext();
  const fp = await failure.newPage();
  await fp.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).includes("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
  await check("WebGL failure preserves fallback and navigation", async () => {
    await fp.goto(url, { waitUntil: "networkidle" });
    assert.equal(
      await fp.locator(".sculpture").getAttribute("data-mode"),
      "fallback",
    );
    await fp.getByRole("link", { name: "Explore PyrOS", exact: true }).click();
    await fp.getByRole("heading", { name: "PyrOS." }).waitFor();
  });
  await check("no application JavaScript errors", async () =>
    assert.deepEqual(errors, []),
  );
  await fs.writeFile(
    ".artifacts/browser-results.json",
    JSON.stringify({ results, failures, errors }, null, 2),
  );
  if (failures.length) throw new Error(failures.join("\n"));
  console.log("All " + results.length + " browser checks passed.");
} finally {
  await browser.close();
}
