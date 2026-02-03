import { test, expect } from "@playwright/test";

test("home has no console/page errors", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  expect(errors, errors.join("\n")).toEqual([]);
});
