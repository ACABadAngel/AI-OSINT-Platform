import { expect, test } from "@playwright/test";

test("create a scoped demo case, persist it, and search it", async ({
  page,
}) => {
  await page.goto("/app");
  await page.getByRole("button", { name: "New case" }).click();
  await page.getByLabel("Case title").fill("Stratos Workshop");
  await page
    .getByLabel("Research objective")
    .fill("Review fictional product documentation.");
  await page.getByLabel("Fictional domain").fill("stratos.org");
  await page.getByRole("button", { name: "Create case" }).click();
  await expect(page.getByRole("alert")).toContainText("fictional .example");
  await page.getByLabel("Fictional domain").fill("stratos.example");
  await page.getByRole("button", { name: "Create case" }).click();
  await expect(
    page.getByRole("heading", { name: "Stratos Workshop", level: 1 }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/app\/cases\/[0-9a-f-]+$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Stratos Workshop", level: 1 }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Evidence", exact: true }).click();
  await expect(page.getByText("No evidence in this case")).toBeVisible();
  await page.keyboard.press("/");
  await page
    .getByRole("textbox", { name: "Search cases and evidence" })
    .fill("polar relay");
  await page
    .getByRole("link", { name: /Polar Relay launch announcement/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Polar Relay launch announcement" }),
  ).toBeVisible();
});

test("trace graph relationship to evidence and export a cited report", async ({
  page,
}, info) => {
  await page.goto("/app");
  await page.getByRole("link", { name: "Open case" }).click();
  await page
    .getByRole("navigation", { name: "Case sections" })
    .getByRole("link", { name: "Graph" })
    .click();
  await expect(page.getByText("30 nodes · 35 edges")).toBeVisible();
  await page
    .getByRole("button", { name: "Identifies official domain Approved" })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Identifies official domain" }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("graph.png") });
  await page.getByRole("link", { name: "SRC-002", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Public infrastructure inventory" }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("evidence.png") });
  await page.getByRole("button", { name: "Open source record" }).click();
  await expect(
    page.getByRole("dialog", { name: "Source record" }),
  ).toContainText("aurora.example");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Add to report" }).click();
  await expect(
    page.getByRole("heading", { name: "Report preview" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "SRC-002", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("report.png") });
  await page.getByRole("button", { name: "Preview Markdown" }).click();
  await expect(page.getByRole("dialog")).toContainText("Source manifest");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Export report" }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("aurora.example-demo.json");
});

test("research needs approval and makes zero external requests", async ({
  page,
}, info) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:3100/"))
      external.push(request.url());
  });
  await page.goto("/app");
  await page.getByRole("link", { name: "Open research assistant" }).click();
  await page
    .getByLabel("Research question")
    .fill("What do the sources say about Polar Relay?");
  await page.getByLabel("Demo scenario").selectOption("failure");
  await page.getByRole("button", { name: "Draft research plan" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Zero external requests",
  );
  await page.screenshot({ path: info.outputPath("plan.png") });
  await page.getByRole("button", { name: "Approve plan" }).click();
  await expect(
    page.getByText("Running · Reading approved fixture excerpts"),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("running.png") });
  await expect(
    page.getByRole("alert").filter({ hasText: "Simulated connector failure" }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("failure.png") });
  await page.getByRole("button", { name: "Retry with local fixtures" }).click();
  await page.getByRole("button", { name: "Approve plan" }).click();
  await expect(
    page.getByText(/Complete · [1-3] matching excerpts/),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "SRC-001" })).toBeVisible();
  await page.getByRole("button", { name: "Jobs", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Research jobs" }),
  ).toContainText("completed");
  expect(external).toEqual([]);
});
