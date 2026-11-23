import {
  caseInput,
  reviewStatuses,
  type DemoCase,
  type Evidence,
} from "@scope/contracts";
import { z } from "zod";
import { fixtureCases, fixtureEvidence } from "./fixtures";

const caseSchema = caseInput.extend({
  id: z.uuid(),
  updated: z.iso.datetime(),
  archived: z.boolean(),
  demo: z.literal(true),
});
const eventSchema = z.object({
  action: z.string(),
  text: z.string(),
  date: z.iso.datetime(),
});
const draftSchema = z.object({
  title: z.string(),
  abstract: z.string(),
  caveats: z.string(),
  sources: z.array(z.uuid()),
});
const evidenceEntry = z.object({
  status: z.enum(reviewStatuses).optional(),
  note: z.string().optional(),
  duplicate: z.boolean().optional(),
  history: z.array(eventSchema),
});
const runSchema = z.object({
  id: z.uuid(),
  caseId: z.uuid(),
  question: z.string(),
  scenario: z.enum(["success", "failure"]),
  status: z.enum(["running", "completed", "failed", "cancelled"]),
  finishesAt: z.number(),
});
export type DemoRun = z.infer<typeof runSchema>;
const storageSchema = z.object({
  runs: z.array(runSchema).default([]),
  suggestions: z
    .array(
      z.object({
        caseId: z.uuid(),
        id: z.uuid(),
        from: z.uuid(),
        to: z.uuid(),
        label: z.string().min(3).max(70),
        evidenceId: z.uuid(),
        status: z.literal("Proposed"),
        demo: z.literal(true),
      }),
    )
    .default([]),
  cases: z.array(caseSchema),
  reviews: z.record(z.uuid(), evidenceEntry),
  reports: z.record(z.uuid(), draftSchema),
  connectors: z.record(z.string(), z.boolean()),
  workspace: z.string(),
  activity: z.array(eventSchema),
});
export type DemoStore = z.infer<typeof storageSchema>;
export type ReportDraft = z.infer<typeof draftSchema>;
export interface DemoRepository {
  read(): DemoStore;
  write(value: DemoStore): void;
}
const key = "scope-demo-v1";

export function freshDemo(): DemoStore {
  return {
    cases: fixtureCases,
    runs: [],
    suggestions: [],
    reviews: {},
    reports: {},
    connectors: { fixtures: true },
    workspace: "Demo Workspace",
    activity: [],
  };
}
export const demoRepository: DemoRepository = {
  read() {
    const value = localStorage.getItem(key);
    if (!value) return freshDemo();
    const result = storageSchema.safeParse(JSON.parse(value));
    if (!result.success)
      throw new Error("The saved demo workspace could not be read.");
    return result.data;
  },
  write(value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
export function scopeCase(cases: DemoCase[], id: string) {
  return cases.find((item) => item.id === id);
}
export function reviewEvidence(reviews: DemoStore["reviews"]): Evidence[] {
  return fixtureEvidence.map((item) => ({
    ...item,
    status: reviews[item.id]?.status ?? item.status,
  }));
}
export function addActivity(
  store: DemoStore,
  action: string,
  text: string,
): DemoStore {
  return {
    ...store,
    activity: [
      { action, text, date: new Date().toISOString() },
      ...store.activity,
    ].slice(0, 50),
  };
}

export function completeRuns(store: DemoStore, now: number): DemoStore {
  const due = store.runs.filter(
    (run) => run.status === "running" && run.finishesAt <= now,
  );
  if (!due.length) return store;
  const runs = store.runs.map((run) =>
    due.includes(run)
      ? {
          ...run,
          status:
            run.scenario === "failure"
              ? ("failed" as const)
              : ("completed" as const),
        }
      : run,
  );
  return due.reduce(
    (data, run) =>
      addActivity(
        data,
        run.scenario === "failure"
          ? "Demo research failed"
          : "Demo research completed",
        store.cases.find((project) => project.id === run.caseId)?.title ??
          "Demo case",
      ),
    { ...store, runs },
  );
}
