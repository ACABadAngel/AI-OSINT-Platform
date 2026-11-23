import { createHash } from "node:crypto";
import { expect, test } from "vitest";
import { fixtureCases, fixtureEvidence, fixtureGraph } from "./fixtures";
import { defaultReport, reportSnapshot } from "../features/reports/report-data";

test("fixtures preserve citation scope, URLs and excerpt hashes", () => {
  expect(fixtureCases).toHaveLength(3);
  expect(fixtureEvidence).toHaveLength(15);
  expect(new Set(fixtureEvidence.map((item) => item.citation)).size).toBe(15);
  const { nodes, edges } = fixtureGraph(fixtureCases[0]);
  expect(nodes).toHaveLength(30);
  expect(edges).toHaveLength(35);
  for (const record of fixtureEvidence) {
    expect(record.demo).toBe(true);
    expect(new URL(record.url).hostname.endsWith(".example")).toBe(true);
    expect(record.sha256).toBe(
      createHash("sha256").update(record.excerpt).digest("hex"),
    );
  }
  for (const edge of edges) {
    expect(nodes.some((node) => node.id === edge.from)).toBe(true);
    expect(nodes.some((node) => node.id === edge.to)).toBe(true);
    if (edge.status === "Approved")
      expect(
        fixtureEvidence.some(
          (item) =>
            item.caseId === fixtureCases[0].id &&
            item.id === edge.evidenceId &&
            item.status === "Approved",
        ),
      ).toBe(true);
  }
});

test("reports exclude foreign, disputed and missing citations", () => {
  const project = fixtureCases[0];
  const draft = {
    ...defaultReport(project),
    sources: [
      fixtureEvidence[0].id,
      fixtureEvidence[4].id,
      fixtureEvidence[5].id,
      "missing",
    ],
  };
  const report = reportSnapshot(project, draft, fixtureEvidence);
  expect(report.findings).toHaveLength(1);
  expect(report.sources.map((item) => item.id)).toEqual([
    fixtureEvidence[0].id,
  ]);
});
