"use client";

import { Activity, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import type { DemoCase } from "@scope/contracts";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Citation,
  Empty,
  Field,
  Modal,
  Notice,
  Row,
  Select,
  Textarea,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import {
  addActivity,
  reviewEvidence,
  type DemoRun,
} from "@/lib/demo-repository";
import { evidencePath } from "@/lib/fixtures";

type Plan = Pick<DemoRun, "question" | "scenario">;
const stopWords = new Set([
  "which",
  "about",
  "what",
  "where",
  "who",
  "when",
  "does",
  "show",
  "with",
  "could",
  "sources",
  "source",
  "case",
  "find",
  "have",
  "from",
  "that",
  "announced",
]);
export function Research({ project }: { project: DemoCase }) {
  const { store, update } = useDemo();
  const [question, setQuestion] = useState("");
  const [scenario, setScenario] = useState<Plan["scenario"]>("success");
  const [draft, setPlan] = useState<Plan | null>(null);
  const latest = store.runs.find((run) => run.caseId === project.id);
  const plan = draft ?? latest;
  const [modal, setModal] = useState(false);
  const status = draft ? "idle" : (latest?.status ?? "idle");
  const [error, setError] = useState("");
  const terms = (
    plan?.question.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []
  ).filter((term) => !stopWords.has(term));
  const claims = reviewEvidence(store.reviews)
    .filter(
      (item) =>
        item.caseId === project.id &&
        item.status === "Approved" &&
        !store.reviews[item.id]?.duplicate &&
        terms.some((term) =>
          (item.title + " " + item.excerpt).toLowerCase().includes(term),
        ),
    )
    .slice(0, 3);

  function propose() {
    if (question.trim().length < 8) {
      setError("Enter a research question of at least eight characters.");
      return;
    }
    if (!store.connectors.fixtures) {
      setError(
        "Enable Fictional evidence in the Source catalog to create a demo plan.",
      );
      return;
    }
    setError("");
    setPlan({ question: question.trim(), scenario });
    setModal(true);
  }
  function approve() {
    if (!store.connectors.fixtures || project.archived) {
      setModal(false);
      setError(
        "This case cannot execute a demo plan while archived or with fixtures disabled.",
      );
      return;
    }
    if (!plan || status === "running") return;
    const run: DemoRun = {
      question: plan.question,
      scenario: plan.scenario,
      id: crypto.randomUUID(),
      caseId: project.id,
      status: "running",
      finishesAt: Date.now() + 900,
    };
    if (
      update((data) =>
        addActivity(
          { ...data, runs: [run, ...data.runs].slice(0, 50) },
          "Demo research started",
          project.title,
        ),
      )
    ) {
      setModal(false);
      setPlan(null);
    }
  }
  return (
    <div className="case-grid">
      <Card>
        <CardTitle icon={Sparkles}>Research assistant</CardTitle>
        <div className="card-body stack">
          <p>
            Search approved fictional evidence inside this case. The demo
            matches words against source excerpts and requires approval before
            each run.
          </p>
          <Field label="Research question">
            <Textarea
              placeholder="What does the evidence say about Polar Relay?"
              value={question}
              maxLength={400}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </Field>
          <Field label="Demo scenario">
            <Select
              value={scenario}
              onChange={(event) =>
                setScenario(
                  event.target.value === "failure" ? "failure" : "success",
                )
              }
            >
              <option value="success">Local evidence</option>
              <option value="failure">Simulated connector failure</option>
            </Select>
          </Field>
          {error && <Notice error>{error}</Notice>}
          <div>
            <Button
              variant="primary"
              disabled={status === "running"}
              onClick={propose}
            >
              <Sparkles size={16} /> Draft research plan
            </Button>
          </div>
          {status === "completed" && (
            <div className="stack">
              <h3>Matching reviewed excerpts</h3>
              {claims.length ? (
                claims.map((item) => (
                  <div className="report-finding stack" key={item.id}>
                    <p>{item.excerpt}</p>
                    <Citation
                      id={item.citation}
                      href={evidencePath(item)}
                      title={item.title}
                    />
                  </div>
                ))
              ) : (
                <Notice>
                  The available reviewed records do not establish an answer to
                  this question.
                </Notice>
              )}
              <h3>Unknowns</h3>
              <p>The demo sources provide no independent corroboration.</p>
            </div>
          )}
        </div>
      </Card>
      <Card>
        <CardTitle icon={Activity}>Research plan &amp; runs</CardTitle>
        <div className="card-body stack">
          {plan ? (
            <>
              <p>{plan.question}</p>
              <div className="flexline">
                <Badge>{project.domain}</Badge>
                <Badge>0 external requests</Badge>
                <Badge>0 provider cost</Badge>
              </div>
              <Row
                title="Read approved case evidence"
                detail="Local fictional evidence adapter"
              />
              {status === "idle" && (
                <Button onClick={() => setModal(true)}>Review plan</Button>
              )}
              {status === "running" && (
                <>
                  <Notice>Running · Reading approved fixture excerpts</Notice>
                  <Button
                    onClick={() => {
                      update((data) =>
                        addActivity(
                          {
                            ...data,
                            runs: data.runs.map((run) =>
                              run.id === latest?.id && run.status === "running"
                                ? { ...run, status: "cancelled" }
                                : run,
                            ),
                          },
                          "Demo research cancelled",
                          project.title,
                        ),
                      );
                    }}
                  >
                    Cancel run
                  </Button>
                </>
              )}
              {status === "completed" && (
                <Notice>Complete · {claims.length} matching excerpts</Notice>
              )}
              {status === "failed" && (
                <>
                  <Notice error>
                    Simulated connector failure. Results were withheld.
                  </Notice>
                  <Button
                    onClick={() => {
                      setPlan({ ...plan, scenario: "success" });
                      setModal(true);
                    }}
                  >
                    Retry with local fixtures
                  </Button>
                </>
              )}
              {status === "cancelled" && (
                <>
                  <Notice>Cancelled by demo analyst.</Notice>
                  <Button
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    Review and restart
                  </Button>
                </>
              )}
            </>
          ) : (
            <Empty title="No research plan">
              Draft a plan to see its scope and evidence source.
            </Empty>
          )}
        </div>
      </Card>
      <Modal
        open={modal}
        onOpenChange={setModal}
        title="Approve research plan"
        description="One local evidence step. Zero external requests."
      >
        <p>{plan?.question}</p>
        <p>Authorized scope: {project.domain}</p>
        <div className="flexline">
          <Button variant="primary" onClick={approve}>
            <Play size={16} /> Approve plan
          </Button>
          <Button onClick={() => setModal(false)}>Back to draft</Button>
        </div>
      </Modal>
    </div>
  );
}
