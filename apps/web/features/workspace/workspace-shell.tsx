"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Shell } from "@/components/shell";
import { CaseForm } from "@/features/cases/case-form";
import { useDemo } from "./demo-provider";
import { addActivity, reviewEvidence } from "@/lib/demo-repository";
import { casePath, evidencePath, fixtureGraph } from "@/lib/fixtures";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { store, update } = useDemo();
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const current = store.cases.find(
    (item) =>
      path === casePath(item.id) || path.startsWith(casePath(item.id) + "/"),
  );
  const active = store.cases.filter((item) => !item.archived);
  const caseItems = active.map((item) => ({
    title: item.title,
    detail: item.domain,
    terms: item.purpose + " " + item.tags,
    href: casePath(item.id),
  }));
  const sources = reviewEvidence(store.reviews).map((item) => ({
    title: item.title,
    detail: item.citation + " · " + item.kind,
    terms: item.excerpt,
    href: evidencePath(item),
  }));
  const entities = active.flatMap((item) =>
    fixtureGraph(item).nodes.map((entity) => ({
      title: entity.label,
      detail: entity.type + " · " + item.title,
      href: casePath(item.id) + "/graph?entity=" + entity.id,
    })),
  );
  return (
    <Shell
      workspaceName={store.workspace}
      jobs={store.runs
        .filter(
          (run, index, runs) =>
            runs.findIndex((item) => item.caseId === run.caseId) === index,
        )
        .map((run) => ({
          title:
            store.cases.find((item) => item.id === run.caseId)?.title ??
            "Demo case",
          detail: run.status + " · " + run.question,
          href: casePath(run.caseId) + "/research",
        }))}
      items={[...caseItems, ...sources, ...entities]}
      cases={caseItems}
      caseHref={
        current ? casePath(current.id) : active[0] && casePath(active[0].id)
      }
      onNew={() => setCreating(true)}
    >
      {children}
      {creating && (
        <CaseForm
          active
          onClose={() => setCreating(false)}
          onSave={(value) => {
            const record = {
              ...value,
              id: crypto.randomUUID(),
              updated: new Date().toISOString(),
              archived: false,
              demo: true as const,
            };
            if (
              update((data) =>
                addActivity(
                  { ...data, cases: [record, ...data.cases] },
                  "Case created",
                  record.title,
                ),
              )
            ) {
              setCreating(false);
              router.push(casePath(record.id));
            }
          }}
        />
      )}
    </Shell>
  );
}
