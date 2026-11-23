import { caseInput } from "@scope/contracts";
import { expect, test } from "vitest";

test("case input accepts a normalized fictional domain only", () => {
  const input = {
    title: "Aurora Systems",
    purpose: "Review fictional release notes.",
    domain: "Aurora.EXAMPLE",
    tags: "release",
  };
  expect(caseInput.parse(input).domain).toBe("aurora.example");
  expect(caseInput.safeParse({ ...input, domain: "example.org" }).success).toBe(
    false,
  );
});
