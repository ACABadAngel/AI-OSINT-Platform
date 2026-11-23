"use client";

import { Activity, FileCheck, FolderKanban, Network } from "lucide-react";
import { Shell } from "@/components/shell";
import {
  Card,
  CardTitle,
  DemoBadge,
  Empty,
  Metric,
  PageHeader,
} from "@/components/ui";

export default function Home() {
  return (
    <Shell>
      <PageHeader
        eyebrow={<DemoBadge />}
        title="Research workspace"
        description="Review evidence, map relationships and build source-cited findings."
      />
      <div className="metrics">
        <Metric icon={FolderKanban} label="Active cases" value={0} />
        <Metric icon={FileCheck} label="Reviewed evidence" value={0} />
        <Metric icon={Network} label="Pending links" value={0} />
        <Metric icon={Activity} label="Research jobs" value={0} />
      </div>
      <Card>
        <CardTitle icon={FolderKanban}>Recent cases</CardTitle>
        <Empty title="Your workspace is ready" />
      </Card>
    </Shell>
  );
}
