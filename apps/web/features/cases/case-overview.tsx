"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  FileCheck,
  Globe,
  Network,
  Target,
} from "lucide-react";
import { useState } from "react";
import type { DemoCase } from "@scope/contracts";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Empty,
  EntityChip,
  ReviewBadge,
  Row,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import { addActivity, reviewEvidence } from "@/lib/demo-repository";
import {
  casePath,
  evidencePath,
  fixtureGraph,
  timestamp,
} from "@/lib/fixtures";
import { CaseForm } from "./case-form";

export function CaseOverview({ project }: { project: DemoCase }) {
  const { store, update } = useDemo();
  const [editing, setEditing] = useState(false);
  const evidence = reviewEvidence(store.reviews).filter(
    (item) => item.caseId === project.id,
  );
  const pending = evidence.filter((item) =>
    ["Proposed", "Disputed"].includes(item.status),
  );
  const entities = fixtureGraph(project).nodes.slice(0, 6);
  function toggleArchive() {
    update((data) =>
      addActivity(
        {
          ...data,
          cases: data.cases.map((item) =>
            item.id === project.id
              ? {
                  ...item,
                  archived: !item.archived,
                  updated: new Date().toISOString(),
                }
              : item,
          ),
        },
        project.archived ? "Case restored" : "Case archived",
        project.title,
      ),
    );
  }
  return (
    <div className="case-grid">
      <Card>
        <CardTitle icon={Target}>Research objective</CardTitle>
        <div className="card-body stack">
          <p>{project.purpose}</p>
          <div className="flexline">
            <Badge tone="accent">
              <Globe size={12} />
              {project.domain}
            </Badge>
            <Badge>{project.archived ? "Archived" : "Active"}</Badge>
            <Badge>Demo analyst · Owner</Badge>
          </div>
          <div className="flexline">
            {project.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag, index) => (
                <EntityChip key={index}>{tag}</EntityChip>
              ))}
          </div>
          <div className="flexline">
            <Button onClick={() => setEditing(true)}>Edit case</Button>
            <Button onClick={toggleArchive}>
              {project.archived ? "Restore case" : "Archive case"}
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <CardTitle
          icon={Network}
          action={
            <Link className="text-link" href={casePath(project.id) + "/graph"}>
              Graph <ArrowUpRight size={13} />
            </Link>
          }
        >
          Documented entities
        </CardTitle>
        <div className="card-body flexline">
          {entities.length ? (
            entities.map((entity) => (
              <Button key={entity.id} asChild>
                <Link
                  href={casePath(project.id) + "/graph?entity=" + entity.id}
                >
                  {entity.label}
                </Link>
              </Button>
            ))
          ) : (
            <Empty title="No documented entities" />
          )}
        </div>
      </Card>
      <Card>
        <CardTitle icon={FileCheck}>Recent findings</CardTitle>
        <div className="card-body">
          {evidence
            .filter((item) => item.status === "Approved")
            .map((item) => (
              <Row
                key={item.id}
                href={evidencePath(item)}
                title={item.title}
                detail={item.citation}
                end={<ReviewBadge status={item.status} />}
              />
            ))}
          {!evidence.some((item) => item.status === "Approved") && (
            <Empty title="No reviewed findings" />
          )}
        </div>
      </Card>
      <Card>
        <CardTitle icon={Activity}>Review and timeline</CardTitle>
        <div className="card-body stack">
          {pending.map((item) => (
            <Row
              key={item.id}
              href={evidencePath(item)}
              title={item.title}
              detail={item.citation + " · " + timestamp(item.retrieved)}
              end={<ReviewBadge status={item.status} />}
            />
          ))}
          {!pending.length && <Empty title="No pending reviews" />}
          <div className="flexline">
            <Button asChild>
              <Link href={casePath(project.id) + "/timeline"}>
                View timeline
              </Link>
            </Button>
            <Button asChild>
              <Link href={casePath(project.id) + "/research"}>
                Research runs
              </Link>
            </Button>
          </div>
        </div>
      </Card>
      {editing && (
        <CaseForm
          active
          current={project}
          onClose={() => setEditing(false)}
          onSave={(input) => {
            if (
              update((data) =>
                addActivity(
                  {
                    ...data,
                    cases: data.cases.map((item) =>
                      item.id === project.id
                        ? {
                            ...item,
                            ...input,
                            updated: new Date().toISOString(),
                          }
                        : item,
                    ),
                  },
                  "Case updated",
                  input.title,
                ),
              )
            )
              setEditing(false);
          }}
        />
      )}
    </div>
  );
}

export function CaseTimeline({ project }: { project: DemoCase }) {
  const { store } = useDemo();
  const [sort, setSort] = useState<"observed" | "retrieved">("observed");
  const records = reviewEvidence(store.reviews)
    .filter((item) => item.caseId === project.id)
    .sort((a, b) => b[sort].localeCompare(a[sort]));
  return (
    <Card>
      <CardTitle
        icon={Activity}
        action={
          <Button
            onClick={() =>
              setSort(sort === "observed" ? "retrieved" : "observed")
            }
          >
            Order by {sort === "observed" ? "retrieval" : "observation"}
          </Button>
        }
      >
        Case timeline
      </CardTitle>
      <div className="card-body">
        {records.length ? (
          records.map((item) => (
            <Row
              key={item.id}
              title={item.title}
              detail={
                "Observed " +
                timestamp(item.observed) +
                " · Retrieved " +
                timestamp(item.retrieved)
              }
              href={evidencePath(item)}
            />
          ))
        ) : (
          <Empty title="No timeline events" />
        )}
      </div>
    </Card>
  );
}
