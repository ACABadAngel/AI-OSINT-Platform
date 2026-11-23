"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import type { DemoCase } from "@scope/contracts";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Citation,
  DemoBadge,
  Empty,
  Field,
  Input,
  Modal,
  Notice,
  Textarea,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import {
  addActivity,
  reviewEvidence,
  type ReportDraft,
} from "@/lib/demo-repository";
import { evidencePath } from "@/lib/fixtures";
import { defaultReport, reportMarkdown, reportSnapshot } from "./report-data";

function download(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Report({ project }: { project: DemoCase }) {
  const { store, update } = useDemo();
  const draft = store.reports[project.id] ?? defaultReport(project);
  const [preview, setPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const allEvidence = reviewEvidence(store.reviews).filter(
    (item) => item.caseId === project.id,
  );
  const evidence = allEvidence.filter(
    (item) => !store.reviews[item.id]?.duplicate,
  );
  const available = evidence.filter((item) => item.status === "Approved");
  const snapshot = reportSnapshot(project, draft, evidence);
  function save(change: Partial<ReportDraft>) {
    update((data) => ({
      ...data,
      reports: { ...data.reports, [project.id]: { ...draft, ...change } },
    }));
  }
  function move(id: string, direction: number) {
    const ids = snapshot.sources.map((item) => item.id);
    const index = ids.indexOf(id);
    const alternate = index + direction;
    if (index < 0 || alternate < 0 || alternate >= ids.length) return;
    [ids[index], ids[alternate]] = [ids[alternate], ids[index]];
    save({ sources: ids });
  }
  function exportAs(format: "md" | "json") {
    const content =
      format === "md"
        ? reportMarkdown(snapshot)
        : JSON.stringify(snapshot, null, 2);
    download(
      project.domain + "-demo." + format,
      content,
      format === "md" ? "text/markdown" : "application/json",
    );
    update((data) => addActivity(data, "Report exported", draft.title));
    setExporting(false);
  }
  return (
    <div className="case-grid">
      <Card>
        <CardTitle icon={FileText}>Report studio</CardTitle>
        <div className="card-body stack">
          <Field label="Report title">
            <Input
              value={draft.title}
              maxLength={140}
              onChange={(event) => save({ title: event.target.value })}
            />
          </Field>
          <Field label="Abstract">
            <Textarea
              value={draft.abstract}
              maxLength={1000}
              onChange={(event) => save({ abstract: event.target.value })}
            />
          </Field>
          <Field label="Caveats">
            <Textarea
              value={draft.caveats}
              maxLength={1000}
              onChange={(event) => save({ caveats: event.target.value })}
            />
          </Field>
          <h3>Reviewed evidence</h3>
          {available.map((item) => (
            <label className="check-row" key={item.id}>
              <input
                type="checkbox"
                checked={draft.sources.includes(item.id)}
                onChange={(event) =>
                  save({
                    sources: event.target.checked
                      ? [...draft.sources, item.id]
                      : draft.sources.filter((id) => id !== item.id),
                  })
                }
              />
              {item.title}
              <Badge>{item.citation}</Badge>
            </label>
          ))}
          {!available.length && (
            <Empty title="No approved sources">
              Review evidence in the inbox to add findings.
            </Empty>
          )}
          {draft.sources.some(
            (id) => !available.some((item) => item.id === id),
          ) && (
            <Notice>
              Previously selected sources that no longer qualify are excluded
              from preview and exports.
            </Notice>
          )}
        </div>
      </Card>
      <Card>
        <CardTitle
          icon={FileText}
          action={<Badge>{snapshot.sources.length} citations</Badge>}
        >
          Report preview
        </CardTitle>
        <div className="card-body stack">
          <DemoBadge />
          <h2 className="detail-title">{draft.title || "Untitled report"}</h2>
          <p>{draft.abstract}</p>
          <h3>Findings</h3>
          {snapshot.findings.map((finding, index) => {
            const item = available.find(
              (record) => record.citation === finding.citation,
            );
            if (!item) return null;
            return (
              <div className="report-finding stack" key={finding.citation}>
                <p>{finding.text}</p>
                <div className="flexline">
                  <Citation
                    id={finding.citation}
                    title={item.title}
                    href={evidencePath(item)}
                  />
                  <Button
                    aria-label={"Move " + finding.citation + " up"}
                    disabled={index === 0}
                    onClick={() => move(item.id, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    aria-label={"Move " + finding.citation + " down"}
                    disabled={index === snapshot.findings.length - 1}
                    onClick={() => move(item.id, 1)}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            );
          })}
          {!snapshot.findings.length && (
            <p>Select an approved source to include a cited finding.</p>
          )}
          <h3>Caveats</h3>
          <p>{draft.caveats}</p>
          <div className="flexline">
            <Button onClick={() => setPreview(true)}>Preview Markdown</Button>
            <Button
              variant="primary"
              disabled={!snapshot.sources.length || !draft.title.trim()}
              onClick={() => setExporting(true)}
            >
              <Download size={16} /> Export report
            </Button>
          </div>
        </div>
      </Card>
      <Modal
        open={preview}
        onOpenChange={setPreview}
        title="Markdown preview"
        description="Source-cited draft from fictional evidence."
      >
        <pre className="markdown">{reportMarkdown(snapshot)}</pre>
      </Modal>
      <Modal
        open={exporting}
        onOpenChange={setExporting}
        title="Export fictional report"
        description="The export includes approved, non-duplicate sources only. The file records reviewer, timestamps, and source hashes."
      >
        <div className="flexline">
          <Button variant="primary" onClick={() => exportAs("md")}>
            Download Markdown
          </Button>
          <Button onClick={() => exportAs("json")}>Download JSON</Button>
        </div>
      </Modal>
    </div>
  );
}
