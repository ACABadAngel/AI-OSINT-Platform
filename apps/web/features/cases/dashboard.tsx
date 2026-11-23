"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Database,
  FileCheck,
  Files,
  FolderKanban,
  Globe,
  LayoutGrid,
  Network,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Empty,
  Metric,
  PageHeader,
  ReviewBadge,
  Row,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import { reviewEvidence } from "@/lib/demo-repository";
import {
  casePath,
  dateLabel,
  evidencePath,
  fixtureGraph,
} from "@/lib/fixtures";

export function Dashboard() {
  const { store } = useDemo();
  const cases = store.cases.filter((item) => !item.archived);
  const evidence = reviewEvidence(store.reviews).filter((item) =>
    cases.some((project) => project.id === item.caseId),
  );
  const current = cases[0];
  const pending = evidence.filter(
    (item) => item.status === "Proposed" || item.status === "Disputed",
  );
  const links =
    cases
      .flatMap((item) => fixtureGraph(item).edges)
      .filter((edge) => edge.status === "Proposed").length +
    store.suggestions.filter((edge) =>
      cases.some((item) => item.id === edge.caseId),
    ).length;
  const currentPath = current ? casePath(current.id) : "/app/cases";
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <LayoutGrid size={14} /> Workspace overview
          </>
        }
        title="Research workspace"
        description="Review evidence, map relationships and build source-cited findings."
        action={
          <div className="flexline">
            <Button asChild>
              <Link href="/app/sources">
                <Database size={16} /> Sources
              </Link>
            </Button>
            <Button asChild className="icon-button">
              <Link href="/app/settings" aria-label="Workspace settings">
                <Settings2 size={18} />
              </Link>
            </Button>
          </div>
        }
      />
      <div className="metrics">
        <Metric
          icon={FolderKanban}
          label="Active cases"
          value={cases.length}
          href="/app/cases"
        />
        <Metric
          icon={FileCheck}
          label="Reviewed evidence"
          value={evidence.filter((item) => item.status === "Approved").length}
          href="/app/cases?view=reviewed"
        />
        <Metric
          icon={Network}
          label="Pending links"
          value={links}
          href="/app/cases?view=links"
        />
        <Metric
          icon={Files}
          label="Active research jobs"
          value={store.runs.filter((run) => run.status === "running").length}
          href="/app/cases?view=jobs"
        />
      </div>
      <div className="dashboard-grid">
        {current ? (
          <Card className="hero">
            <div className="hero-art" aria-hidden="true">
              <div className="hero-orbit orbit-outer" />
              <div className="hero-orbit orbit-inner" />
              <div className="hero-center">
                <Network size={30} />
              </div>
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="hero-content stack">
              <div className="eyebrow">
                <span className="status-dot" /> Continue investigation
              </div>
              <h2>{current.title}</h2>
              <div className="flexline">
                <Badge>
                  <Globe size={12} />
                  {current.domain}
                </Badge>
                <Badge tone="accent">Fixture scope</Badge>
              </div>
              <p>{current.purpose}</p>
              <div className="flexline">
                <Button variant="primary" asChild>
                  <Link href={currentPath}>
                    Open case <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={currentPath + "/graph"}>View graph</Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <Empty title="No active investigations">
              Create a demo case to start a local investigation.
            </Empty>
          </Card>
        )}
        <Card>
          <CardTitle
            icon={FolderKanban}
            action={
              <Link className="text-link" href="/app/cases">
                All cases <ArrowUpRight size={13} />
              </Link>
            }
          >
            Recent cases
          </CardTitle>
          <div className="card-body">
            {cases.length ? (
              cases
                .slice(0, 4)
                .map((item) => (
                  <Row
                    key={item.id}
                    title={item.title}
                    detail={item.domain + " · " + dateLabel(item.updated)}
                    href={casePath(item.id)}
                    icon={FolderKanban}
                  />
                ))
            ) : (
              <Empty title="No cases yet" />
            )}
          </div>
        </Card>
        <Card>
          <CardTitle icon={Files}>Recent evidence</CardTitle>
          <div className="card-body">
            {evidence
              .slice()
              .sort((a, b) => b.retrieved.localeCompare(a.retrieved))
              .slice(0, 4)
              .map((item) => (
                <Row
                  key={item.id}
                  title={item.title}
                  detail={item.citation + " · " + item.kind}
                  href={evidencePath(item)}
                  end={<ReviewBadge status={item.status} />}
                />
              ))}
            {evidence.length === 0 && <Empty title="No evidence records" />}
          </div>
        </Card>
        <Card>
          <CardTitle icon={FileCheck}>Needs review</CardTitle>
          <div className="card-body">
            {pending.slice(0, 4).map((item) => (
              <Row
                key={item.id}
                title={item.title}
                detail={item.citation + " · " + item.kind}
                href={evidencePath(item)}
                end={<ReviewBadge status={item.status} />}
              />
            ))}
            {pending.length === 0 && <Empty title="Review queue is clear" />}
          </div>
        </Card>
        <Card>
          <CardTitle icon={Activity}>Workspace activity</CardTitle>
          <div className="card-body">
            {store.activity.length ? (
              store.activity
                .slice(0, 2)
                .map((event, index) => (
                  <Row
                    key={event.date + index}
                    title={event.action}
                    detail={event.text}
                    icon={Activity}
                  />
                ))
            ) : (
              <p>
                Fictional sources were added to the workspace on 23 November
                2026.
              </p>
            )}
          </div>
        </Card>
        <Card>
          <CardTitle icon={Sparkles}>Research assistant</CardTitle>
          <div className="card-body stack">
            <p>
              Propose a bounded plan and review citations from the demo
              evidence.
            </p>
            {current && (
              <div>
                <Button asChild>
                  <Link href={currentPath + "/research"}>
                    Open research assistant <ArrowRight size={15} />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
