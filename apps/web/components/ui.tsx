"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  CircleHelp,
  FileText,
  FlaskConical,
  FolderOpen,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Dialog, Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  asChild,
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "default" | "ghost";
  asChild?: boolean;
}) {
  const Component = asChild ? Slot.Root : "button";
  return <Component className={cn("button", variant, className)} {...props} />;
}
export function IconButton({
  icon: Icon,
  label,
  ...props
}: ComponentProps<"button"> & { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="ghost"
      className="icon-button"
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={18} />
    </Button>
  );
}
export function Card({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("card", className)} {...props} />;
}
export function CardTitle({
  icon: Icon,
  children,
  action,
}: {
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card-heading">
      <h2>
        {Icon && <Icon size={18} />}
        {children}
      </h2>
      {action}
    </div>
  );
}
export function Badge({
  children,
  tone = "",
  title,
}: {
  children: ReactNode;
  tone?: string;
  title?: string;
}) {
  return (
    <span className={cn("badge", tone && "badge-" + tone)} title={title}>
      {children}
    </span>
  );
}
export function DemoBadge() {
  return (
    <Badge tone="accent">
      <FlaskConical size={12} /> DEMO
    </Badge>
  );
}
export function ReviewBadge({ status }: { status: string }) {
  const tone = {
    Approved: "green",
    Proposed: "amber",
    Disputed: "amber",
    Rejected: "red",
    Hypothesis: "muted",
  }[status];
  return <Badge tone={tone}>{status}</Badge>;
}
export function Citation({
  id,
  href,
  title,
}: {
  id: string;
  href: string;
  title?: string;
}) {
  return (
    <Link className="citation" href={href} title={title ?? id}>
      <FileText size={13} />
      {id}
    </Link>
  );
}
export function EntityChip({ children }: { children: ReactNode }) {
  return <Badge>{children}</Badge>;
}
export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cn("field", props.className)} />;
}
export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cn("field", props.className)} />;
}
export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cn("field", props.className)} />;
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field-label">
      {label}
      {children}
    </label>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <FolderOpen size={25} />
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
export function Notice({
  children,
  error,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={cn("notice", error && "notice-error")}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="modal">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <Dialog.Close className="modal-close" aria-label="Close">
            ×
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Row({
  title,
  detail,
  icon: Icon = FileText,
  href,
  end,
}: {
  title: string;
  detail?: string;
  icon?: LucideIcon;
  href?: string;
  end?: ReactNode;
}) {
  const content = (
    <>
      <span className="row-icon">
        <Icon size={17} />
      </span>
      <span className="row-label">
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
      {end ?? (href && <ArrowUpRight size={15} />)}
    </>
  );
  return href ? (
    <Link className="row" href={href}>
      {content}
    </Link>
  ) : (
    <div className="row">{content}</div>
  );
}
export function Metric({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <span>
        <Icon size={17} />
        {label}
      </span>
      <strong>{String(value).padStart(2, "0")}</strong>
      {href && <ArrowUpRight className="metric-arrow" size={15} />}
    </>
  );
  return href ? (
    <Link className="metric card" href={href}>
      {content}
    </Link>
  ) : (
    <div className="metric card">{content}</div>
  );
}
export function Tabs({
  label,
  items,
}: {
  label: string;
  items: { href: string; text: string; active: boolean }[];
}) {
  return (
    <nav aria-label={label} className="tabs">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
        >
          {item.text}
        </Link>
      ))}
    </nav>
  );
}
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="search-trigger"
      aria-label="Search workspace"
      onClick={onClick}
    >
      <Search size={16} />
      <span>Search workspace</span>
      <kbd>/</kbd>
    </Button>
  );
}
export function Help({ children }: { children: ReactNode }) {
  return (
    <div className="help">
      <CircleHelp size={17} />
      {children}
    </div>
  );
}
export function Skeleton({ label }: { label: string }) {
  return (
    <div className="skeleton" role="status">
      {label}
    </div>
  );
}
