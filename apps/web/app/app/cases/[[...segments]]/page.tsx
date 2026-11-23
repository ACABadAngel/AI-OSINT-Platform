import { Suspense } from "react";
import { Skeleton } from "@/components/ui";
import { CaseRoute } from "@/features/cases/case-route";
export default function Cases() {
  return (
    <Suspense fallback={<Skeleton label="Loading case…" />}>
      <CaseRoute />
    </Suspense>
  );
}
