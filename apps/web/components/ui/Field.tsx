import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string };

export function Field({ label, hint, error, id, ...props }: FieldProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replaceAll(" ", "-");
  return <div className="field">
    <label htmlFor={inputId}>{label}</label>
    <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={hint || error ? `${inputId}-hint` : undefined} {...props} />
    {(hint || error) && <p id={`${inputId}-hint`} className={error ? "field-message field-error" : "field-message"}>{error ?? hint}</p>}
  </div>;
}
