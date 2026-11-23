import type {
  DemoCase,
  Entity,
  Evidence,
  Relationship,
  ReviewStatus,
} from "@scope/contracts";

export const casePath = (id: string) => "/app/cases/" + id;
export const evidencePath = (item: Evidence) =>
  casePath(item.caseId) + "/evidence?source=" + item.id;
export const demoId = (value: number) =>
  "00000000-0000-4000-8000-" + value.toString().padStart(12, "0");

const collections = [
  {
    title: "Aurora Systems",
    domain: "aurora.example",
    purpose:
      "Map Aurora's documented product infrastructure and verify which assets support the Polar Relay release.",
    tags: "Infrastructure, Product launch",
    records: [
      [
        "Polar Relay launch announcement",
        "Press release",
        "Aurora Systems announced Polar Relay and published its integration and service documentation on aurora.example.",
      ],
      [
        "Public infrastructure inventory",
        "Technical document",
        "Aurora Systems lists aurora.example as its official website and identifies the service hostnames and repositories in its public infrastructure inventory.",
      ],
      [
        "Aurora Labs repository release",
        "Repository release",
        "Aurora Labs published release 2.4 of the Polar Relay integration SDK with client libraries and migration notes.",
      ],
      [
        "Relay edge certificate record",
        "Certificate record",
        "The fictional certificate record lists relay.aurora.example as its subject and identifies the validity dates. It does not document organizational ownership.",
      ],
      [
        "Northstar partnership briefing",
        "News article",
        "The Northstar briefing names an integration partner, but the timing conflicts with the original announcement.",
      ],
    ],
  },
  {
    title: "Beacon Research",
    domain: "beacon.example",
    purpose:
      "Trace the source documentation for Beacon’s open instruments and reconcile conflicting archive dates.",
    tags: "Open research, Documentation",
    records: [
      [
        "Beacon Instruments release",
        "Press release",
        "Beacon Research released an open calibration toolkit for its fictional optical instruments.",
      ],
      [
        "Calibration handbook",
        "Technical document",
        "The handbook describes calibration for the Beacon spectrometer series.",
      ],
      [
        "Field toolkit release 1.8",
        "Repository release",
        "Release 1.8 updates the reference curves in the public toolkit.",
      ],
      [
        "Observatory domain bulletin",
        "Technical document",
        "Beacon identifies observatory.beacon.example as its official data mirror.",
      ],
      [
        "Archive availability notice",
        "News article",
        "An archive notice lists two dates for the same release, with no clear revision marker.",
      ],
    ],
  },
  {
    title: "Meridian Transit Lab",
    domain: "meridian.example",
    purpose:
      "Document publicly announced mobility datasets and the supporting reference repositories.",
    tags: "Mobility, Open data",
    records: [
      [
        "Route Atlas announcement",
        "Press release",
        "Meridian Transit Lab announced a fictional release of the Route Atlas timetable dataset.",
      ],
      [
        "Dataset schema reference",
        "Technical document",
        "The reference describes schedules, route IDs, and the published geospatial schema.",
      ],
      [
        "Route Atlas tools v3",
        "Repository release",
        "The tools release adds a read-only timetable converter and sample data.",
      ],
      [
        "Timetable exchange event",
        "News article",
        "The organizer scheduled a public session to document the timetable exchange format.",
      ],
      [
        "Archive endpoint notice",
        "Technical document",
        "The archive notice lists an alternate mirror whose relation to Meridian remains under review.",
      ],
    ],
  },
] as const;

export const fixtureCases: DemoCase[] = collections.map((group, index) => ({
  id: demoId(index + 1),
  title: group.title,
  domain: group.domain,
  purpose: group.purpose,
  tags: group.tags,
  updated: new Date(Date.UTC(2026, 10, 23 - index * 2, 13, 22)).toISOString(),
  archived: false,
  demo: true,
}));

export const recordTexts = collections.flatMap((group, index) =>
  group.records.map(([title, kind, excerpt], ordinal) => ({
    id: demoId(101 + index * 5 + ordinal),
    citation: "SRC-" + String(index * 5 + ordinal + 1).padStart(3, "0"),
    caseId: demoId(index + 1),
    title,
    kind,
    url: "https://" + group.domain + "/sources/" + (ordinal + 1),
    excerpt,
    observed: new Date(
      Date.UTC(2026, 10, 18 - index * 2 - ordinal, 9),
    ).toISOString(),
    retrieved: new Date(
      Date.UTC(2026, 10, 23 - index * 2, 13, 22 - ordinal),
    ).toISOString(),
    status: (
      ["Approved", "Approved", "Approved", "Proposed", "Disputed"] as const
    )[ordinal],
    demo: true as const,
  })),
);

const fixedHashes: string[] = [
  "7cd825065843caa2720a48bd749062e7448778d9149f6a92784c5ab8f5104fa6",
  "021853287f9977d2063b43ec697e7ed9a8070258df69b55b66d61b207c1ed1fe",
  "478fa405895b14f0085b821e8e374c8831702d38bef4a68c3fd2ccf56bc5ebb8",
  "da23d31c48b41565554431af3b87ec0c0485a00683427ca11af0035959b1edd1",
  "e5d0a68d2f8996594d7e7b3e6a7b20a600b66407681824b6b6a7bad179c1d171",
  "42095568564e3d1a5d9f47306d82e05b651742512c2cd4adbb1d71707810e29e",
  "2a8532f0c6047f7307690e8793e1eb73e17768a59fe4fc34ea5ac96ea7ba58c3",
  "1b466e4ea92847b2e72b0456458130a971096041e207cf361cbd5ad34e77bd0f",
  "f16b7a450a9fda7b88b81979150c8a41d92fb37ff8b17e1a1c6921ac73ed3be7",
  "a82d2f7ca491847c4038fd50be5117f10111597576122a8e46c751d3747ebd1d",
  "98f3af7b10e83a98aeddf8becc5d4606a77231d8ada7c600443985a1cbf2a4ab",
  "e3cc49babdd4509e993a723b11c4a091f40e793b5a1d4d77fa9d2c372db332af",
  "ff684c70eb7c2f19bae3e7f0e41db7efc7cc080204f3b11951cc7f34b6204483",
  "8a91c347d402807ec81238c6277f7dd1abe631f93955720daa4f5bd02bc865c4",
  "b89b139364606923cff73af9c86a7705d9bf70ede019f7369b7c8725ccdcdb56",
];
export const fixtureEvidence: Evidence[] = recordTexts.map((record, index) => ({
  ...record,
  sha256: fixedHashes[index],
}));

const branches = [
  "relay",
  "docs",
  "status",
  "sdk",
  "updates",
  "registry",
  "archive",
  "events",
  "api",
  "integrations",
];
export function fixtureGraph(scope: DemoCase): {
  nodes: Entity[];
  edges: Relationship[];
} {
  const group = fixtureCases.findIndex((item) => item.id === scope.id);
  if (group < 0) return { nodes: [], edges: [] };
  const records = fixtureEvidence.filter((item) => item.caseId === scope.id);
  const count = group === 0 ? 10 : 2;
  const node = (offset: number, label: string, type: string): Entity => ({
    id: demoId(1000 + 100 * group + offset),
    label,
    type,
    demo: true,
  });
  const original = fixtureCases[group];
  const nodes = [
    node(0, original.title, "Organization"),
    node(1, original.domain, "Domain"),
  ];
  for (let index = 0; index < count; index++) {
    nodes.push(
      node(nodes.length, branches[index] + "." + original.domain, "Domain"),
    );
    nodes.push(node(nodes.length, branches[index] + " reference", "Document"));
    if (index < count - 2)
      nodes.push(
        node(nodes.length, branches[index] + " toolkit", "Repository"),
      );
  }
  const edges: Relationship[] = [];
  const add = (
    from: Entity,
    to: Entity,
    label: string,
    status: ReviewStatus,
    evidenceId?: string,
  ) => {
    edges.push({
      id: demoId(2000 + 100 * group + edges.length),
      from: from.id,
      to: to.id,
      label,
      status,
      evidenceId,
      demo: true,
    });
  };
  add(
    nodes[0],
    nodes[1],
    "Identifies official domain",
    "Approved",
    records[1].id,
  );
  for (const entity of nodes.slice(2)) {
    add(
      entity.type === "Domain" ? nodes[1] : nodes[0],
      entity,
      entity.type === "Domain" ? "Listed hostname" : "Catalogued artifact",
      "Proposed",
      records[1].id,
    );
  }
  const suggestions = group === 0 ? 6 : 2;
  for (let index = 0; index < suggestions; index++) {
    add(
      nodes[index + 1],
      nodes[index + 3],
      "Potential dependency",
      "Hypothesis",
    );
  }
  return { nodes, edges };
}

export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}
export function timestamp(value: string) {
  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(value)) + " UTC"
  );
}
