import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
test("responsive demo shell and keyboard search", async ({ page }, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Research workspace" }),
  ).toBeVisible();
  await expect(page.getByText("DEMO", { exact: true }).first()).toBeVisible();
  await page.screenshot({ path: info.outputPath("dashboard.png") });
  await page.keyboard.press("/");
  await expect(
    page.getByRole("dialog", { name: "Search workspace" }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("search-focus.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
