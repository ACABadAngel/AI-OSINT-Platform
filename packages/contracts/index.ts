import { z } from "zod";

export const caseInput = z.object({
  title: z.string().trim().min(3).max(100),
  purpose: z.string().trim().min(10).max(600),
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.example$/,
      "Enter a fictional .example domain.",
    ),
  tags: z.string().trim().max(100),
});
export type CaseInput = z.infer<typeof caseInput>;
export const reviewStatuses = [
  "Proposed",
  "Approved",
  "Disputed",
  "Rejected",
  "Hypothesis",
] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];
export type DemoCase = CaseInput & {
  id: string;
  updated: string;
  archived: boolean;
  demo: true;
};
export type Evidence = {
  id: string;
  citation: string;
  caseId: string;
  title: string;
  kind: string;
  url: string;
  excerpt: string;
  observed: string;
  retrieved: string;
  status: ReviewStatus;
  demo: true;
  sha256: string;
};
export type Entity = { id: string; label: string; type: string; demo: true };
export type Relationship = {
  id: string;
  from: string;
  to: string;
  label: string;
  evidenceId?: string;
  status: ReviewStatus;
  demo: true;
};
