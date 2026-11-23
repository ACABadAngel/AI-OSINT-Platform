"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardCheck, FileText, Fingerprint, Plus } from "lucide-react";
import { useState } from "react";
import {
  reviewStatuses,
  type DemoCase,
  type Evidence,
  type ReviewStatus,
} from "@scope/contracts";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  DemoBadge,
  Empty,
  Field,
  Input,
  Modal,
  Notice,
  ReviewBadge,
  Row,
  Select,
  Textarea,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import { defaultReport } from "@/features/reports/report-data";
import {
  addActivity,
  reviewEvidence,
  type DemoStore,
} from "@/lib/demo-repository";
import { casePath, evidencePath, timestamp } from "@/lib/fixtures";

export function EvidenceInbox({ project }: { project: DemoCase }) {
  const { store } = useDemo();
  const selected = useSearchParams().get("source");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [kind, setKind] = useState("");
  const [after, setAfter] = useState("");
  const records = reviewEvidence(store.reviews).filter(
    (item) => item.caseId === project.id,
  );
  const matches = records.filter(
    (item) =>
      (!status || item.status === status) &&
      (!kind || item.kind === kind) &&
      (!after || item.observed.slice(0, 10) >= after) &&
      [item.title, item.excerpt, item.citation]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const item = selected
    ? (matches.find((item) => item.id === selected) ?? matches[0])
    : matches[0];
  return (
    <div className="evidence-grid">
      <Card>
        <CardTitle icon={FileText}>
          Evidence inbox <Badge>{matches.length} records</Badge>
        </CardTitle>
        <div className="card-body stack">
          <Field label="Search evidence">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
          <div className="filter-row">
            <Field label="Review status">
              <Select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">All statuses</option>
                {reviewStatuses.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </Field>
            <Field label="Source type">
              <Select
                value={kind}
                onChange={(event) => setKind(event.target.value)}
              >
                <option value="">All sources</option>
                {[...new Set(records.map((record) => record.kind))].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </Select>
            </Field>
          </div>
          <Field label="Observed on or after">
            <Input
              type="date"
              value={after}
              onChange={(event) => setAfter(event.target.value)}
            />
          </Field>
          <div className="source-list">
            {matches.map((record) => (
              <div
                key={record.id}
                className={record.id === item?.id ? "selected-row" : undefined}
              >
                <Row
                  title={record.title}
                  detail={record.citation + " · " + record.kind}
                  href={evidencePath(record)}
                  end={<ReviewBadge status={record.status} />}
                />
              </div>
            ))}
          </div>
          {!matches.length && (
            <Empty
              title={
                records.length
                  ? "No matching evidence"
                  : "No evidence in this case"
              }
            >
              {records.length
                ? "Clear filters to see the case sources."
                : "The seeded cases contain fictional examples."}
              {records.length > 0 && (
                <div>
                  <Button
                    onClick={() => {
                      setQuery("");
                      setStatus("");
                      setKind("");
                      setAfter("");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </Empty>
          )}
        </div>
      </Card>
      {item && <EvidenceDetail key={item.id} item={item} project={project} />}
    </div>
  );
}

function EvidenceDetail({
  item,
  project,
}: {
  item: Evidence;
  project: DemoCase;
}) {
  const { store, update } = useDemo();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const saved = store.reviews[item.id];
  function record(
    action: string,
    text: string,
    changes: Partial<DemoStore["reviews"][string]> = {},
  ) {
    if (
      update((data) => {
        const previous = data.reviews[item.id];
        return addActivity(
          {
            ...data,
            reviews: {
              ...data.reviews,
              [item.id]: {
                ...previous,
                ...changes,
                history: [
                  { action, text, date: new Date().toISOString() },
                  ...(previous?.history ?? []),
                ],
              },
            },
          },
          action,
          item.citation,
        );
      })
    )
      setMessage(action);
  }
  function decision(status: ReviewStatus) {
    if (!note.trim()) {
      setMessage("Enter a review rationale first.");
      return;
    }
    record("Review: " + status, note.trim(), { status });
    setNote("");
  }
  function addToReport() {
    if (
      update((data) => {
        const draft = data.reports[project.id] ?? defaultReport(project);
        return {
          ...data,
          reports: {
            ...data.reports,
            [project.id]: {
              ...draft,
              sources: [...new Set([...draft.sources, item.id])],
            },
          },
        };
      })
    )
      router.push(casePath(project.id) + "/reports");
  }
  return (
    <>
      <Card>
        <CardTitle icon={FileText}>Evidence preview</CardTitle>
        <div className="card-body stack">
          <div className="flexline">
            <DemoBadge />
            <Badge>{item.citation}</Badge>
            <Badge>{item.kind}</Badge>
          </div>
          <h2 className="detail-title">{item.title}</h2>
          <blockquote className="excerpt">{item.excerpt}</blockquote>
          <dl className="metadata">
            <dt>Observed</dt>
            <dd>{timestamp(item.observed)}</dd>
            <dt>Retrieved</dt>
            <dd>{timestamp(item.retrieved)}</dd>
            <dt>Cited observations</dt>
            <dd>1 fixture observation</dd>
          </dl>
          <div className="flexline">
            <Button onClick={() => setSnapshot(true)}>
              Open source record
            </Button>
            {item.status === "Approved" && !saved?.duplicate && (
              <Button variant="primary" onClick={addToReport}>
                <Plus size={16} /> Add to report
              </Button>
            )}
          </div>
          {item.status !== "Approved" && (
            <p>Source must be approved before it can enter a report.</p>
          )}
        </div>
      </Card>
      <Card>
        <CardTitle icon={Fingerprint}>Provenance &amp; review</CardTitle>
        <div className="card-body stack">
          <div className="flexline">
            <ReviewBadge status={item.status} />
            {saved?.duplicate && <Badge tone="amber">Duplicate</Badge>}
          </div>
          <dl className="metadata">
            <dt>Original URL (fictional)</dt>
            <dd className="mono-wrap">{item.url}</dd>
            <dt>Retrieval method</dt>
            <dd>Local fixture</dd>
            <dt>Retention</dt>
            <dd>Fixture only</dd>
            <dt>SHA-256 of excerpt</dt>
            <dd className="mono-wrap">{item.sha256}</dd>
          </dl>
          <Field label="Note or review rationale">
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
            />
          </Field>
          <div className="flexline">
            <Button
              onClick={() => {
                if (!note.trim()) {
                  setMessage("Enter a note first.");
                  return;
                }
                record("Note added", note.trim(), { note: note.trim() });
                setNote("");
              }}
            >
              Save note
            </Button>
            <Button
              onClick={() =>
                record(
                  saved?.duplicate
                    ? "Duplicate flag removed"
                    : "Marked duplicate",
                  saved?.duplicate
                    ? "Flag cleared by demo analyst"
                    : "Flagged by demo analyst",
                  { duplicate: !saved?.duplicate },
                )
              }
            >
              {saved?.duplicate ? "Clear duplicate" : "Mark duplicate"}
            </Button>
            {item.status !== "Proposed" && (
              <Button onClick={() => decision("Proposed")}>
                Request review
              </Button>
            )}
          </div>
          <div className="flexline">
            {(["Approved", "Disputed", "Rejected"] as const)
              .filter((value) => value !== item.status)
              .map((value) => (
                <Button key={value} onClick={() => decision(value)}>
                  {value === "Approved"
                    ? "Approve"
                    : value === "Disputed"
                      ? "Dispute"
                      : "Reject"}
                </Button>
              ))}
          </div>
          {message && (
            <Notice error={message.startsWith("Enter")}>{message}</Notice>
          )}
          {saved?.history.length > 0 && (
            <div className="stack">
              <h3>Review history</h3>
              {saved.history.map((event, index) => (
                <Row
                  key={event.date + index}
                  title={event.action}
                  detail={event.text + " · " + timestamp(event.date)}
                  icon={ClipboardCheck}
                />
              ))}
            </div>
          )}
          <Link className="text-link" href={casePath(project.id) + "/graph"}>
            Inspect case graph
          </Link>
        </div>
      </Card>
      <Modal
        open={snapshot}
        onOpenChange={setSnapshot}
        title="Source record"
        description={item.citation + " · Fictional snapshot"}
      >
        <h3>{item.title}</h3>
        <blockquote className="excerpt">{item.excerpt}</blockquote>
        <p className="mono-wrap">{item.url}</p>
      </Modal>
    </>
  );
}
