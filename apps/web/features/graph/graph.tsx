"use client";

import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type ReactFlowInstance,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/style.css";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FileText, Focus, Network, Undo2 } from "lucide-react";
import type {
  DemoCase,
  Entity,
  Evidence,
  Relationship,
} from "@scope/contracts";
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
  ReviewBadge,
  Select,
} from "@/components/ui";
import { useDemo } from "@/features/workspace/demo-provider";
import { addActivity, reviewEvidence } from "@/lib/demo-repository";
import { evidencePath, fixtureGraph, timestamp } from "@/lib/fixtures";

export function Graph({ project }: { project: DemoCase }) {
  const { store, update } = useDemo();
  const params = useSearchParams();
  const evidence = reviewEvidence(store.reviews).filter(
    (item) => item.caseId === project.id,
  );
  const base = fixtureGraph(project);
  const suggestions = store.suggestions.filter(
    (edge) => edge.caseId === project.id,
  );
  const data = {
    nodes: base.nodes,
    edges: [...base.edges, ...suggestions].map((edge): Relationship => {
      const cited = evidence.find((item) => item.id === edge.evidenceId);
      return edge.status === "Approved" &&
        (cited?.status !== "Approved" || store.reviews[cited.id]?.duplicate)
        ? { ...edge, status: "Disputed" }
        : edge;
    }),
  };
  const [selected, setSelected] = useState<string | null>(params.get("entity"));
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [layout, setLayout] = useState("Hierarchy");
  const [view, setView] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
      ? "list"
      : "graph",
  );
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);
  const [history, setHistory] = useState<Viewport[]>([]);
  const [start, setStart] = useState<Viewport | null>(null);
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState("");
  const ids = new Set(
    data.edges
      .filter((edge) => edge.status === status)
      .flatMap((edge) => [edge.from, edge.to]),
  );
  const list = data.nodes.filter(
    (item) =>
      (!kind || item.type === kind) &&
      (!status || ids.has(item.id)) &&
      item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const edges = data.edges.filter(
    (edge) =>
      (!status || status === edge.status) &&
      list.some((item) => item.id === edge.from) &&
      list.some((item) => item.id === edge.to),
  );
  const entity = list.find((item) => item.id === selected);
  const relation = edges.find((item) => item.id === selected);

  const nodes: Node[] = list.map((item, index) => {
    const angle = ((index - 1) * Math.PI * 2) / Math.max(1, list.length - 1);
    const radius = index < 8 ? 315 : 660;
    const position =
      layout === "Hierarchy"
        ? { x: (index % 6) * 208, y: Math.floor(index / 6) * 93 }
        : index === 0
          ? { x: 0, y: 0 }
          : {
              x: Math.round(radius * Math.cos(angle)),
              y: Math.round(radius * Math.sin(angle)),
            };
    return {
      id: item.id,
      data: {
        label: (
          <>
            <small>{item.type}</small>
            <strong>{item.label}</strong>
          </>
        ),
      },
      position: positions[item.id] ?? position,
      ariaLabel: item.type + " " + item.label,
      className:
        "scope-flow-node" + (selected === item.id ? " flow-highlight" : ""),
      connectable: false,
      deletable: false,
    };
  });
  const flowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    label: edge.status === "Approved" ? edge.label : undefined,
    ariaLabel: edge.label + " · " + edge.status,
    className: selected === edge.id ? "flow-edge-highlight" : undefined,
    style: {
      stroke:
        edge.status === "Approved"
          ? "#75d9ce"
          : edge.status === "Proposed"
            ? "#a4b4bb"
            : "#e2bf7a",
      strokeWidth: 2,
      strokeDasharray:
        edge.status === "Hypothesis"
          ? "2 5"
          : edge.status === "Proposed"
            ? "7 5"
            : undefined,
    },
    deletable: false,
  }));
  const graphKey = JSON.stringify([
    layout,
    list.map((item) => item.id),
    status,
  ]);
  const showInspector = Boolean(entity || relation);
  function undo() {
    const previous = history.at(-1);
    if (!previous || !flow) return;
    void flow.setViewport(previous);
    setHistory(history.slice(0, -1));
  }
  function propose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const from = String(values.get("from")),
      to = String(values.get("to"));
    const evidenceId = String(values.get("source"));
    const label = String(values.get("label")).trim();
    if (
      from === to ||
      !data.nodes.some((item) => item.id === from) ||
      !data.nodes.some((item) => item.id === to) ||
      !evidence.some((item) => item.id === evidenceId) ||
      label.length < 3
    ) {
      setError(
        "Select two different entities, a case source, and a relationship label.",
      );
      return;
    }
    const edge = {
      id: crypto.randomUUID(),
      caseId: project.id,
      from,
      to,
      label,
      evidenceId,
      status: "Proposed" as const,
      demo: true as const,
    };
    if (
      update((current) =>
        addActivity(
          { ...current, suggestions: [...current.suggestions, edge] },
          "Graph relationship proposed",
          label,
        ),
      )
    ) {
      setStatus("");
      setKind("");
      setQuery("");
      setSelected(edge.id);
      setSuggesting(false);
    }
  }
  return (
    <div className="stack graph-view">
      <Card>
        <div className="graph-toolbar filter-row">
          <Field label="Find entity">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
          <Field label="Entity type">
            <Select
              value={kind}
              onChange={(event) => setKind(event.target.value)}
            >
              <option value="">All types</option>
              {[...new Set(data.nodes.map((item) => item.type))].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </Select>
          </Field>
          <Field label="Relationship status">
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              <option>Approved</option>
              <option>Proposed</option>
              <option>Hypothesis</option>
            </Select>
          </Field>
          <Field label="Layout">
            <Select
              value={layout}
              onChange={(event) => {
                setHistory([]);
                setLayout(event.target.value);
              }}
            >
              <option>Radial</option>
              <option>Hierarchy</option>
            </Select>
          </Field>
          <Button onClick={() => setView(view === "graph" ? "list" : "graph")}>
            {view === "graph" ? "List view" : "Canvas view"}
          </Button>
        </div>
      </Card>
      <div className="graph-grid">
        <Card>
          <CardTitle
            icon={Network}
            action={
              <Badge>
                {list.length} nodes · {edges.length} edges
              </Badge>
            }
          >
            Relationship graph
          </CardTitle>
          {!list.length ? (
            <Empty title="No matching graph entities">
              Clear the filters or explore a seeded demo case.
            </Empty>
          ) : (
            <>
              <div
                className={
                  "flow-area " + (view === "list" ? "flow-hidden" : "")
                }
              >
                <ReactFlow
                  key={graphKey}
                  nodes={nodes}
                  edges={flowEdges}
                  forceColorMode="dark"
                  minZoom={0.12}
                  fitView
                  fitViewOptions={{ padding: "12%" }}
                  onInit={setFlow}
                  onNodeClick={(_, node) => setSelected(node.id)}
                  onNodeDragStop={(_, node) =>
                    setPositions((previous) => ({
                      ...previous,
                      [node.id]: node.position,
                    }))
                  }
                  onEdgeClick={(_, edge) => setSelected(edge.id)}
                  onMoveStart={(event, viewport) => {
                    if (event) setStart(viewport);
                  }}
                  onMoveEnd={(event) => {
                    if (event && start) {
                      setHistory((previous) => [...previous.slice(-9), start]);
                      setStart(null);
                    }
                  }}
                  nodesConnectable={false}
                  onlyRenderVisibleElements
                  proOptions={{ hideAttribution: true }}
                >
                  <Background gap={19} size={1} />
                  <Controls showInteractive={false} />
                </ReactFlow>
              </div>
              <div className="graph-controls flexline">
                <Button
                  onClick={() => void flow?.fitView({ padding: "12%" })}
                  disabled={!flow || view === "list"}
                >
                  <Focus size={16} /> Fit graph
                </Button>
                {data.nodes.length > 1 &&
                  evidence.length > 0 &&
                  !project.archived && (
                    <Button
                      onClick={() => {
                        setError("");
                        setSuggesting(true);
                      }}
                    >
                      Suggest relationship
                    </Button>
                  )}
                <Button
                  onClick={undo}
                  disabled={!history.length || view === "list"}
                >
                  <Undo2 size={16} /> Undo viewport
                </Button>
              </div>
              <div
                className={
                  "graph-choices " + (view === "list" ? "choices-full" : "")
                }
              >
                <div className="flexline">
                  <span className="mini-label">Select relationship</span>
                  {edges.length ? (
                    edges.map((edge) => (
                      <Button
                        key={edge.id}
                        aria-pressed={edge.id === selected}
                        onClick={() => setSelected(edge.id)}
                      >
                        {edge.label}
                        <Badge>{edge.status}</Badge>
                      </Button>
                    ))
                  ) : (
                    <p>No matching relationships.</p>
                  )}
                </div>
                {(view === "list" || query) && (
                  <div className="flexline">
                    <span className="mini-label">Select entity</span>
                    {list.map((item) => (
                      <Button
                        key={item.id}
                        aria-pressed={item.id === selected}
                        onClick={() => setSelected(item.id)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </Card>
        <Card
          className={
            showInspector ? "graph-inspector inspector-open" : "graph-inspector"
          }
        >
          <CardTitle
            icon={FileText}
            action={
              showInspector && (
                <Button onClick={() => setSelected(null)}>Close</Button>
              )
            }
          >
            Inspector
          </CardTitle>
          <div className="card-body stack">
            {entity || relation ? (
              <Inspector
                entity={entity}
                edge={relation}
                data={data}
                evidence={evidence}
              />
            ) : (
              <Empty title="Select a node or relationship">
                View citations and review status for the selection.
              </Empty>
            )}
          </div>
        </Card>
      </div>
      <Modal
        title="Suggest a relationship"
        description="Proposals stay under review and link to evidence in this fictional case."
        open={suggesting}
        onOpenChange={setSuggesting}
      >
        <form className="stack" onSubmit={propose}>
          <Field label="Relationship label">
            <Input name="label" required minLength={3} maxLength={70} />
          </Field>
          <Field label="From entity">
            <Select name="from" defaultValue={entity?.id ?? data.nodes[0]?.id}>
              {data.nodes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="To entity">
            <Select name="to" defaultValue={data.nodes[1]?.id}>
              {data.nodes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Supporting evidence">
            <Select name="source">
              {evidence.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.citation} · {item.title}
                </option>
              ))}
            </Select>
          </Field>
          {error && <Notice error>{error}</Notice>}
          <div>
            <Button variant="primary" type="submit">
              Save proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Inspector({
  entity,
  edge,
  data,
  evidence,
}: {
  entity?: Entity;
  edge?: Relationship;
  data: ReturnType<typeof fixtureGraph>;
  evidence: Evidence[];
}) {
  const related = edge
    ? [edge]
    : data.edges.filter(
        (item) => item.from === entity?.id || item.to === entity?.id,
      );
  const sources = evidence.filter((source) =>
    related.some((item) => item.evidenceId === source.id),
  );
  return (
    <>
      <DemoBadge />
      <h2 className="detail-title">{edge?.label ?? entity?.label}</h2>
      {edge && (
        <>
          <ReviewBadge status={edge.status} />
          <p>
            {data.nodes.find((node) => node.id === edge.from)?.label} →{" "}
            {data.nodes.find((node) => node.id === edge.to)?.label}
          </p>
        </>
      )}
      {entity && <Badge>{entity.type}</Badge>}
      <h3>Cited evidence</h3>
      {sources.length ? (
        sources.map((item) => (
          <div key={item.id} className="stack">
            <Citation
              id={item.citation}
              href={evidencePath(item)}
              title={
                item.title +
                " · " +
                timestamp(item.retrieved) +
                " · " +
                item.excerpt
              }
            />
            <p>{item.title}</p>
            <dl className="metadata">
              <dt>Retrieved</dt>
              <dd>{timestamp(item.retrieved)}</dd>
              <dt>Method</dt>
              <dd>Local fixture</dd>
            </dl>
          </div>
        ))
      ) : (
        <p>No source record is attached to this selection.</p>
      )}
    </>
  );
}
