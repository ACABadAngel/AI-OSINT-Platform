"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronDown,
  CircleDot,
  Database,
  FolderKanban,
  House,
  Network,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  Button,
  DemoBadge,
  Empty,
  Input,
  Modal,
  Row,
  SearchTrigger,
} from "./ui";

export type SearchItem = {
  title: string;
  detail: string;
  href: string;
  terms?: string;
};
type ShellProps = {
  children: ReactNode;
  items?: SearchItem[];
  cases?: SearchItem[];
  caseHref?: string;
  jobs?: SearchItem[];
  onNew?: () => void;
};

export function Shell({
  children,
  items = [],
  cases = [],
  caseHref,
  jobs = [],
  onNew,
}: ShellProps) {
  const path = usePathname();
  const [dialog, setDialog] = useState<
    "search" | "jobs" | "profile" | "cases" | null
  >(null);
  const [query, setQuery] = useState("");
  const matching = items.filter((item) =>
    [item.title, item.detail, item.terms]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const dock = caseHref
    ? ([
        ["Home", House, "/app"],
        ["Cases", FolderKanban, "/app/cases"],
        ["Search", Search, ""],
        ["Graph", Network, caseHref + "/graph"],
        ["Research", Sparkles, caseHref + "/research"],
      ] as const)
    : ([
        ["Home", House, "/app"],
        ["Search", Search, ""],
      ] as const);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.target instanceof HTMLElement &&
          (event.target.matches("input, textarea, select") ||
            event.target.isContentEditable))
      )
        return;
      if (event.key === "/") {
        event.preventDefault();
        setDialog("search");
      }
      if (event.key === "g" && caseHref && !dialog) {
        window.location.assign(caseHref + "/graph");
      }
    }
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [caseHref, dialog]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="topbar">
        <div className="topbar-inner">
          <Link className="wordmark" href="/app">
            <span className="mark">
              <CircleDot size={20} />
            </span>
            SCOPE<span className="wordmark-point">.</span>
          </Link>
          <span className="top-divider" />
          {cases.length > 0 ? (
            <Button
              variant="ghost"
              className="workspace-button"
              onClick={() => setDialog("cases")}
            >
              Demo Workspace <ChevronDown size={14} />
            </Button>
          ) : (
            <span className="workspace-label">Demo Workspace</span>
          )}
          <DemoBadge />
          <div className="top-spacer" />
          <SearchTrigger onClick={() => setDialog("search")} />
          {onNew && (
            <Button
              variant="primary"
              className="top-new"
              aria-label="New case"
              onClick={onNew}
            >
              <Plus size={17} /> <span>New case</span>
            </Button>
          )}
          <Button
            variant="ghost"
            aria-label="Jobs"
            className="icon-button"
            onClick={() => setDialog("jobs")}
          >
            <Activity size={19} />
          </Button>
          <button
            className="avatar"
            aria-label="Profile and shortcuts"
            onClick={() => setDialog("profile")}
          >
            DA
          </button>
        </div>
      </div>
      <main id="main" className="main" tabIndex={-1}>
        {children}
      </main>
      <nav aria-label="Quick navigation" className="dock">
        {dock.map(([label, Icon, href]) =>
          href ? (
            <Link
              key={label}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ) : (
            <button key={label} onClick={() => setDialog("search")}>
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ),
        )}
      </nav>
      <Modal
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
        title={
          dialog === "search"
            ? "Search workspace"
            : dialog === "jobs"
              ? "Research jobs"
              : dialog === "cases"
                ? "Switch case"
                : "Demo analyst"
        }
        description="Local fictional workspace"
      >
        {dialog === "search" && (
          <>
            <Input
              aria-label="Search cases and evidence"
              placeholder="Search cases, sources or entities…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="dialog-list">
              {matching.length ? (
                matching.map((item) => (
                  <div key={item.href} onClick={() => setDialog(null)}>
                    <Row
                      title={item.title}
                      detail={item.detail}
                      href={item.href}
                    />
                  </div>
                ))
              ) : (
                <Empty title="No matching results">
                  Try a different name or source.
                </Empty>
              )}
            </div>
          </>
        )}
        {dialog === "jobs" &&
          (jobs.length ? (
            <div className="dialog-list">
              {jobs.map((item) => (
                <div key={item.href} onClick={() => setDialog(null)}>
                  <Row
                    title={item.title}
                    detail={item.detail}
                    href={item.href}
                    icon={Activity}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Empty title="No active jobs">
              Approved demo research runs will appear here.
            </Empty>
          ))}
        {dialog === "cases" && (
          <div className="dialog-list">
            {cases.map((item) => (
              <div key={item.href} onClick={() => setDialog(null)}>
                <Row
                  title={item.title}
                  detail={item.detail}
                  href={item.href}
                  icon={FolderKanban}
                />
              </div>
            ))}
          </div>
        )}
        {dialog === "profile" && (
          <div className="stack">
            <p>
              <kbd>/</kbd> Search{" "}
              {caseHref && (
                <>
                  {" "}
                  · <kbd>g</kbd> Graph
                </>
              )}{" "}
              · <kbd>Esc</kbd> Close dialog
            </p>
            {caseHref && (
              <>
                <div onClick={() => setDialog(null)}>
                  <Row
                    title="Source catalog"
                    href="/app/sources"
                    icon={Database}
                  />
                </div>
                <div onClick={() => setDialog(null)}>
                  <Row
                    title="Workspace settings"
                    href="/app/settings"
                    icon={Settings}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
