"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FolderKanban, Network } from "lucide-react";
import {
  Badge,
  Card,
  CardTitle,
  Empty,
  Field,
  Input,
  PageHeader,
  ReviewBadge,
  Row,
  Select,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import { reviewEvidence } from "@/lib/demo-repository";
import {
  casePath,
  dateLabel,
  evidencePath,
  fixtureGraph,
} from "@/lib/fixtures";

export function CaseList() {
  const { store } = useDemo();
  const view = useSearchParams().get("view");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("active");
  const contains = (text: string) =>
    text.toLowerCase().includes(query.trim().toLowerCase());
  const cases = store.cases.filter(
    (item) =>
      (status === "all" || item.archived === (status === "archived")) &&
      contains([item.title, item.domain, item.tags, item.purpose].join(" ")),
  );
  const sources = reviewEvidence(store.reviews).filter(
    (item) =>
      (view !== "reviewed" || item.status === "Approved") &&
      contains(item.title + " " + item.excerpt + " " + item.citation) &&
      store.cases.some(
        (project) => project.id === item.caseId && !project.archived,
      ),
  );
  const activeJobs = store.runs.filter(
    (run) => run.status === "running" && contains(run.question),
  );
  const heading =
    view === "jobs"
      ? "Active research jobs"
      : view === "reviewed"
        ? "Reviewed evidence"
        : view === "sources"
          ? "Workspace evidence"
          : view === "links"
            ? "Pending relationships"
            : "Cases";
  return (
    <>
      <PageHeader
        title={heading}
        description="Browse your fictional research workspace."
      />
      <Card>
        <CardTitle icon={FolderKanban}>Workspace records</CardTitle>
        <div className="card-body stack">
          <div className="filter-row">
            <Field label="Search records">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
              />
            </Field>
            {!view && (
              <Field label="Case status">
                <Select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="all">All cases</option>
                </Select>
              </Field>
            )}
          </div>
          <div>
            {view === "jobs"
              ? activeJobs.map((run) => (
                  <Row
                    key={run.id}
                    title={run.question}
                    detail="Running · local fixtures"
                    href={casePath(run.caseId) + "/research"}
                  />
                ))
              : view === "reviewed" || view === "sources"
                ? sources.map((item) => (
                    <Row
                      key={item.id}
                      title={item.title}
                      detail={item.citation + " · " + item.kind}
                      href={evidencePath(item)}
                      end={<ReviewBadge status={item.status} />}
                    />
                  ))
                : view === "links"
                  ? cases.map((item) => (
                      <Row
                        key={item.id}
                        title={item.title}
                        detail={
                          fixtureGraph(item).edges.filter(
                            (edge) => edge.status === "Proposed",
                          ).length +
                          store.suggestions.filter(
                            (edge) => edge.caseId === item.id,
                          ).length +
                          " proposed relationships"
                        }
                        icon={Network}
                        href={casePath(item.id) + "/graph?status=Proposed"}
                      />
                    ))
                  : cases.map((item) => (
                      <Row
                        key={item.id}
                        title={item.title}
                        detail={item.domain + " · " + dateLabel(item.updated)}
                        href={casePath(item.id)}
                        icon={FolderKanban}
                        end={
                          <Badge>{item.archived ? "Archived" : "Active"}</Badge>
                        }
                      />
                    ))}
          </div>
          {(view === "jobs"
            ? !activeJobs.length
            : view === "reviewed" || view === "sources"
              ? !sources.length
              : !cases.length) && (
            <Empty title="No matching records">
              Change your filters or clear your search.
            </Empty>
          )}
        </div>
      </Card>
    </>
  );
}
