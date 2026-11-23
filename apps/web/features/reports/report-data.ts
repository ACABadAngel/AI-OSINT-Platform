import type { DemoCase, Evidence } from "@scope/contracts";
import type { ReportDraft } from "@/lib/demo-repository";

export function defaultReport(project: DemoCase): ReportDraft {
  return {
    title: project.title + " — Evidence brief",
    abstract: project.purpose,
    caveats:
      "Fictional demonstration sources. Independent corroboration is outside the scope of this report.",
    sources: [],
  };
}
export function reportSnapshot(
  project: DemoCase,
  draft: ReportDraft,
  evidence: Evidence[],
) {
  const sources = draft.sources.flatMap((id) => {
    const item = evidence.find(
      (record) =>
        record.id === id &&
        record.caseId === project.id &&
        record.status === "Approved",
    );
    return item ? [item] : [];
  });
  return {
    demo: true,
    generatedAt: new Date().toISOString(),
    caseId: project.id,
    scope: project.domain,
    title: draft.title,
    abstract: draft.abstract,
    caveats: draft.caveats,
    reviewer: "Demo analyst",
    findings: sources.map((item) => ({
      text: item.excerpt,
      citation: item.citation,
    })),
    sources: sources.map((item) => ({
      id: item.id,
      citation: item.citation,
      title: item.title,
      url: item.url,
      observed: item.observed,
      retrieved: item.retrieved,
      sha256: item.sha256,
    })),
  };
}
const markdownText = (value: string) =>
  value.replace(/[\\`*_{}\[\]<>()#+!|~-]/g, "\\$&");
export function reportMarkdown(data: ReturnType<typeof reportSnapshot>) {
  return [
    "# " + markdownText(data.title),
    "",
    "**DEMO · FICTIONAL EVIDENCE**",
    "",
    "Generated " + data.generatedAt,
    "Scope: " + data.scope,
    "Reviewer: " + data.reviewer,
    "",
    "## Abstract",
    "",
    markdownText(data.abstract),
    "",
    "## Findings",
    "",
    ...data.findings.map(
      (item) =>
        "- " +
        markdownText(item.text) +
        " [\`" +
        item.citation +
        "\`](#" +
        item.citation.toLowerCase() +
        ")",
    ),
    "",
    "## Caveats",
    "",
    markdownText(data.caveats),
    "",
    "## Source manifest",
    "",
    ...data.sources.flatMap((item) => [
      "",
      "### " + item.citation,
      markdownText(item.title) + " — " + item.url,
      "Observed " + item.observed + " · Retrieved " + item.retrieved,
      "SHA-256 " + item.sha256,
    ]),
  ].join("\n");
}
