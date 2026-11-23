"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button, Notice, Skeleton } from "@/components/ui";
import {
  completeRuns,
  demoRepository,
  freshDemo,
  type DemoStore,
} from "@/lib/demo-repository";

type DemoContext = {
  store: DemoStore;
  update: (change: (store: DemoStore) => DemoStore) => boolean;
};
const Context = createContext<DemoContext | null>(null);
const key = ["demo-workspace"];
function DemoData({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const [error, setError] = useState("");
  const { data, isError, refetch } = useQuery({
    queryKey: key,
    queryFn: () => demoRepository.read(),
    staleTime: Infinity,
    retry: false,
  });
  const update = useCallback(
    (change: (store: DemoStore) => DemoStore) => {
      const current = client.getQueryData<DemoStore>(key);
      const next = change(current ?? freshDemo());
      if (next === current) return true;
      try {
        demoRepository.write(next);
        client.setQueryData(key, next);
        setError("");
        return true;
      } catch {
        setError(
          "Please check local browser storage and try the change again.",
        );
        return false;
      }
    },
    [client],
  );
  useEffect(() => {
    const due =
      data?.runs
        .filter((run) => run.status === "running")
        .map((run) => run.finishesAt) ?? [];
    if (!due.length) return;
    const timer = setTimeout(
      () => update((current) => completeRuns(current, Date.now())),
      Math.max(1, Math.min(...due) - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [data, update]);
  if (isError)
    return (
      <main className="main stack">
        <Notice error>The saved demo workspace could not be loaded.</Notice>
        <div className="flexline">
          <Button onClick={() => void refetch()}>Retry</Button>
          <Button onClick={() => update(freshDemo)}>
            Restore fictional fixtures
          </Button>
        </div>
        {error && <Notice error>{error}</Notice>}
      </main>
    );
  if (!data)
    return (
      <main className="main">
        <Skeleton label="Loading demo workspace…" />
      </main>
    );
  return (
    <Context.Provider value={{ store: data, update }}>
      {error && <Notice error>{error}</Notice>}
      {children}
    </Context.Provider>
  );
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <DemoData>{children}</DemoData>
    </QueryClientProvider>
  );
}
export function useDemo() {
  const data = useContext(Context);
  if (!data) throw new Error("DemoProvider required");
  return data;
}
