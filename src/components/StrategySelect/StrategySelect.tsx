'use client';

import {
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@konopskidev/ui';
import { useId } from 'react';

interface StrategySelectProps {
  label: string;
  value: string;
  /** The strategy labels; each one doubles as the option value. */
  options: readonly string[];
  onChange: (value: string) => void;
}

export function StrategySelect({ label, value, options, onChange }: StrategySelectProps) {
  const controlId = useId();

  return (
    <Field>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={controlId} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
