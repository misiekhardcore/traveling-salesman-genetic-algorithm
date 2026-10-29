'use client';

import { Field, FieldDescription, FieldLabel, Input } from '@konopskidev/ui';
import { useId } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  description?: string;
  onValueChange: (value: number) => void;
}

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  description,
  onValueChange,
}: NumberFieldProps) {
  const controlId = useId();
  const descriptionId = `${controlId}-description`;

  return (
    <Field>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      <Input
        id={controlId}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onValueChange(Number(event.target.value))}
      />
      {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
    </Field>
  );
}
