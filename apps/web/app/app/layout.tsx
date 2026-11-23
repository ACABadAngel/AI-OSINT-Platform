import type { ReactNode } from "react";
import { DemoProvider } from "@/features/workspace/demo-provider";
import { WorkspaceShell } from "@/features/workspace/workspace-shell";
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </DemoProvider>
  );
}
