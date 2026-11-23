"use client";

import { useState } from "react";
import { ClipboardList, Database, LockKeyhole, Settings2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardTitle,
  Empty,
  Field,
  Input,
  Modal,
  Notice,
  PageHeader,
  Row,
} from "@/components/ui";
import { addActivity, freshDemo } from "@/lib/demo-repository";
import { timestamp } from "@/lib/fixtures";
import { useDemo } from "./demo-provider";

export function Sources() {
  const { store, update } = useDemo();
  const [tested, setTested] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Source catalog"
        description="Control which adapters the local demo uses."
      />
      <div className="case-grid">
        <Card>
          <CardTitle
            icon={Database}
            action={
              <Badge tone={store.connectors.fixtures ? "green" : "muted"}>
                {store.connectors.fixtures ? "Enabled" : "Disabled"}
              </Badge>
            }
          >
            Fictional evidence
          </CardTitle>
          <div className="card-body stack">
            <p>
              Bundled demonstration records for organizations, domains,
              documents, repositories and certificate metadata.
            </p>
            <dl className="metadata">
              <dt>Provider</dt>
              <dd>SCOPE fixtures</dd>
              <dt>Credentials</dt>
              <dd>None</dd>
              <dt>Terms</dt>
              <dd>Fictional demo content only</dd>
              <dt>Cost</dt>
              <dd>Local, no provider charge</dd>
            </dl>
            <div className="flexline">
              <Button
                onClick={() => {
                  update((data) =>
                    addActivity(
                      {
                        ...data,
                        connectors: {
                          ...data.connectors,
                          fixtures: !data.connectors.fixtures,
                        },
                      },
                      data.connectors.fixtures
                        ? "Demo connector disabled"
                        : "Demo connector enabled",
                      "Fictional evidence",
                    ),
                  );
                  setTested(false);
                }}
              >
                {store.connectors.fixtures ? "Disable" : "Enable"} fictional
                evidence
              </Button>
              <Button
                onClick={() => setTested(true)}
                disabled={!store.connectors.fixtures}
              >
                Test local sample
              </Button>
            </div>
            {tested && (
              <Notice>
                Fixture adapter ready · {freshDemo().cases.length} demo cases
                available.
              </Notice>
            )}
          </div>
        </Card>
        <Card>
          <CardTitle icon={LockKeyhole}>Collection boundaries</CardTitle>
          <div className="card-body stack">
            <p>
              This workspace has a zero-request budget. Research plans are
              limited to the selected case and the bundled fixtures.
            </p>
            <p>
              Source record previews use sanitized local text and keep fictional
              URLs visible as metadata.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

export function Settings() {
  const { store, update } = useDemo();
  const [reset, setReset] = useState(false);
  const [name, setName] = useState(store.workspace);
  return (
    <>
      <PageHeader
        title="Workspace settings"
        description="Manage your local demo preferences and review activity."
      />
      <div className="case-grid">
        <Card>
          <CardTitle icon={Settings2}>Workspace preferences</CardTitle>
          <div className="card-body stack">
            <form
              className="stack"
              onSubmit={(event) => {
                event.preventDefault();
                if (name.trim())
                  update((data) =>
                    addActivity(
                      { ...data, workspace: name.trim() },
                      "Workspace renamed",
                      name.trim(),
                    ),
                  );
              }}
            >
              <Field label="Workspace name">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={45}
                  required
                />
              </Field>
              <div className="flexline">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!name.trim() || name.trim() === store.workspace}
                >
                  Save workspace name
                </Button>
                <Button type="button" onClick={() => setReset(true)}>
                  Reset demo workspace
                </Button>
              </div>
            </form>
          </div>
        </Card>
        <Card>
          <CardTitle icon={LockKeyhole}>Access &amp; retention</CardTitle>
          <div className="card-body stack">
            <Row
              title="Demo analyst"
              detail="Local owner · single workspace"
              icon={LockKeyhole}
            />
            <p>
              Edits are saved in this browser until you reset the workspace or
              clear site data. The demo uses a local evidence matcher with no
              model provider or API keys.
            </p>
          </div>
        </Card>
        <Card>
          <CardTitle icon={ClipboardList}>Local activity log</CardTitle>
          <div className="card-body">
            {store.activity.length ? (
              store.activity.map((event, index) => (
                <Row
                  key={event.date + index}
                  title={event.action}
                  detail={event.text + " · " + timestamp(event.date)}
                />
              ))
            ) : (
              <Empty title="No changes recorded">
                Actions such as case edits and evidence reviews will appear
                here.
              </Empty>
            )}
          </div>
        </Card>
      </div>
      <Modal
        open={reset}
        onOpenChange={setReset}
        title="Reset demo workspace?"
        description="This clears your local demo edits, reviews, reports, and connector preferences."
      >
        <div className="flexline">
          <Button
            variant="primary"
            onClick={() => {
              if (update(freshDemo)) {
                setName("Demo Workspace");
                setReset(false);
              }
            }}
          >
            Restore original fixtures
          </Button>
          <Button onClick={() => setReset(false)}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
}
