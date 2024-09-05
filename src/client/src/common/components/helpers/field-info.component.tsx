import { FieldApi } from "@tanstack/solid-form";
import { Accessor } from "solid-js";

export function FieldInfo({
  field,
}: {
  field: Accessor<FieldApi<any, any, any, any>>;
}) {
  return (
    <>
      {field().state.meta.touchedErrors ? (
        <em>{field().state.meta.touchedErrors}</em>
      ) : null}
      {field().state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
