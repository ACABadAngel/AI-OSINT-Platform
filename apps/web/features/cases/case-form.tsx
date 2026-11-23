"use client";

import { useState, type FormEvent } from "react";
import { caseInput, type CaseInput, type DemoCase } from "@scope/contracts";
import { fixtureCases } from "@/lib/fixtures";
import { Button, Field, Input, Modal, Notice, Textarea } from "@/components/ui";

export function CaseForm({
  active,
  current,
  onClose,
  onSave,
}: {
  active: boolean;
  current?: DemoCase;
  onClose: () => void;
  onSave: (value: CaseInput) => void;
}) {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const result = caseInput.safeParse(fields);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    onSave(result.data);
  }
  return (
    <Modal
      open={active}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
      title={current ? "Edit case" : "New demo case"}
      description="Use a fictional organization or reserved .example domain."
    >
      <form className="stack" onSubmit={submit}>
        <Field label="Case title">
          <Input
            name="title"
            required
            minLength={3}
            maxLength={100}
            defaultValue={current?.title}
          />
        </Field>
        <Field label="Research objective">
          <Textarea
            name="purpose"
            required
            minLength={10}
            maxLength={600}
            defaultValue={current?.purpose}
          />
        </Field>
        <Field label="Fictional domain">
          <Input
            name="domain"
            readOnly={fixtureCases.some((item) => item.id === current?.id)}
            required
            placeholder="organization.example"
            defaultValue={current?.domain}
          />
        </Field>
        <Field label="Tags">
          <Input
            name="tags"
            maxLength={100}
            placeholder="Release, Documentation"
            defaultValue={current?.tags}
          />
        </Field>
        {error && <Notice error>{error}</Notice>}
        <div className="flexline">
          <Button variant="primary" type="submit">
            {current ? "Save changes" : "Create case"}
          </Button>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
