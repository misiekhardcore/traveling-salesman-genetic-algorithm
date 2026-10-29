'use client';

import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Slider,
} from '@konopskidev/ui';
import { PauseIcon, PlayIcon, RotateCcwIcon, ShuffleIcon, SkipForwardIcon } from 'lucide-react';
import { useId } from 'react';

import {
  MAX_MUTATION_RATE,
  MAX_POINTS_COUNT,
  MAX_POPULATION_SIZE,
  MIN_MUTATION_RATE,
  MIN_POINTS_COUNT,
  MIN_POPULATION_SIZE,
  MUTATION_RATE_STEP,
} from '@/app/constants';
import {
  crossoverStrategyNames,
  fitnessStrategyNames,
  mutationStrategyNames,
} from '@/app/strategies';
import { NumberField } from '@/components/NumberField';
import { Section } from '@/components/Section';
import { StrategySelect } from '@/components/StrategySelect';

interface ControlsPanelProps {
  fitnessStrategy: string;
  crossoverStrategy: string;
  mutationStrategy: string;
  mutationRate: number;
  pointsCount: number;
  populationSize: number;
  isRunning: boolean;
  onFitnessStrategyChange: (label: string) => void;
  onCrossoverStrategyChange: (label: string) => void;
  onMutationStrategyChange: (label: string) => void;
  onMutationRateChange: (mutationRate: number) => void;
  onPointsCountChange: (pointsCount: number) => void;
  onPopulationSizeChange: (populationSize: number) => void;
  onToggleAuto: () => void;
  onEvolveOnce: () => void;
  onNewIndividuals: () => void;
  onReset: () => void;
}

export function ControlsPanel({
  fitnessStrategy,
  crossoverStrategy,
  mutationStrategy,
  mutationRate,
  pointsCount,
  populationSize,
  isRunning,
  onFitnessStrategyChange,
  onCrossoverStrategyChange,
  onMutationStrategyChange,
  onMutationRateChange,
  onPointsCountChange,
  onPopulationSizeChange,
  onToggleAuto,
  onEvolveOnce,
  onNewIndividuals,
  onReset,
}: ControlsPanelProps) {
  const mutationRateId = useId();

  return (
    <aside aria-label="Algorithm controls" className="stack">
      <Section title="Strategies" description="The operators each new generation is built with.">
        <FieldGroup>
          <StrategySelect
            label="Fitness"
            value={fitnessStrategy}
            options={fitnessStrategyNames}
            onChange={onFitnessStrategyChange}
          />
          <StrategySelect
            label="Crossover"
            value={crossoverStrategy}
            options={crossoverStrategyNames}
            onChange={onCrossoverStrategyChange}
          />
          <StrategySelect
            label="Mutation"
            value={mutationStrategy}
            options={mutationStrategyNames}
            onChange={onMutationStrategyChange}
          />
        </FieldGroup>
      </Section>

      <Section title="Parameters" description="How many routes evolve, and over how many points.">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={mutationRateId}>Mutation rate</FieldLabel>
            <Slider
              value={[mutationRate]}
              onValueChange={([rate]) => onMutationRateChange(rate)}
              min={MIN_MUTATION_RATE}
              max={MAX_MUTATION_RATE}
              step={MUTATION_RATE_STEP}
              thumbLabels={['Mutation rate']}
            />
            <Input
              id={mutationRateId}
              type="number"
              value={mutationRate}
              min={MIN_MUTATION_RATE}
              max={MAX_MUTATION_RATE}
              step={MUTATION_RATE_STEP}
              onChange={(event) => onMutationRateChange(Number(event.target.value))}
            />
            <FieldDescription>Chance per gene of a route being reshuffled.</FieldDescription>
          </Field>
          <NumberField
            label="Points count"
            value={pointsCount}
            min={MIN_POINTS_COUNT}
            max={MAX_POINTS_COUNT}
            onValueChange={onPointsCountChange}
          />
          <NumberField
            label="Population size"
            value={populationSize}
            min={MIN_POPULATION_SIZE}
            max={MAX_POPULATION_SIZE}
            onValueChange={onPopulationSizeChange}
          />
        </FieldGroup>
      </Section>

      <Section title="Run" description="Ten generations per second while running.">
        <div className="stack-tight">
          <Button onClick={onToggleAuto}>
            {isRunning ? <PauseIcon /> : <PlayIcon />}
            {isRunning ? 'Pause' : 'Run'}
          </Button>
          <Button variant="secondary" onClick={onEvolveOnce}>
            <SkipForwardIcon />
            Next generation
          </Button>
          <Button variant="outline" onClick={onNewIndividuals}>
            <ShuffleIcon />
            New individuals
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcwIcon />
            Reset
          </Button>
        </div>
      </Section>
    </aside>
  );
}
