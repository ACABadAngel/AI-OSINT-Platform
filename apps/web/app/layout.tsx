import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SCOPE — Evidence Workspace",
  description: "Source-cited research and evidence review.",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable + " " + GeistMono.variable}>
      <body>{children}</body>
    </html>
  );
}
