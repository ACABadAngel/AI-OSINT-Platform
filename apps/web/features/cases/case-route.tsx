"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Badge,
  Button,
  DemoBadge,
  Empty,
  PageHeader,
  Tabs,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import { EvidenceInbox } from "@/features/evidence/inbox";
import { Graph } from "@/features/graph/graph";
import { Research } from "@/features/research/research";
import { Report } from "@/features/reports/report";
import { scopeCase } from "@/lib/demo-repository";
import { casePath, dateLabel } from "@/lib/fixtures";
import { CaseList } from "./case-list";
import { CaseOverview, CaseTimeline } from "./case-overview";
const sections = {
  "": "Overview",
  graph: "Graph",
  evidence: "Evidence",
  research: "Research",
  timeline: "Timeline",
  reports: "Reports",
};
export function CaseRoute() {
  const { store } = useDemo();
  const { segments = [] } = useParams<{ segments?: string[] }>();
  const [id, section = ""] = segments;
  if (!id) return <CaseList />;
  const project = scopeCase(store.cases, id);
  if (!project || segments.length > 2 || !Object.hasOwn(sections, section))
    return (
      <Empty
        title="Case page unavailable"
        action={
          <Button asChild>
            <Link href="/app/cases">Browse cases</Link>
          </Button>
        }
      >
        This case or section could not be found in the demo workspace.
      </Empty>
    );
  const base = casePath(id);
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link className="text-link" href="/app/cases">
              Cases
            </Link>
            <span>/</span>
            <DemoBadge />
          </>
        }
        title={project.title}
        description={
          project.domain + " · Updated " + dateLabel(project.updated)
        }
        action={<Badge tone="accent">Fictional scope</Badge>}
      />
      <Tabs
        label="Case sections"
        items={Object.entries(sections).map(([slug, text]) => ({
          href: slug ? base + "/" + slug : base,
          text,
          active: slug === section,
        }))}
      />
      {section === "" && <CaseOverview key={id} project={project} />}
      {section === "graph" && <Graph key={id} project={project} />}
      {section === "evidence" && <EvidenceInbox key={id} project={project} />}
      {section === "research" && <Research key={id} project={project} />}
      {section === "timeline" && <CaseTimeline key={id} project={project} />}
      {section === "reports" && <Report key={id} project={project} />}
    </>
  );
}
