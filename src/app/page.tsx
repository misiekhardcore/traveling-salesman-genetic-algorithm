'use client';

import { AppHeader } from '@/components/AppHeader';
import { ControlsPanel } from '@/components/ControlsPanel';
import { VisualizationStage } from '@/components/VisualizationStage';
import { useGeneticAlgorithm } from '@/hooks';

export default function Home() {
  const {
    points,
    population,
    generation,
    isRunning,
    mutationRate,
    populationSize,
    fitnessStrategy,
    mutationStrategy,
    crossoverStrategy,
    actions,
  } = useGeneticAlgorithm();

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader pointsCount={points.length} />

      <main className="container-page flex-1 py-6">
        <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
          <ControlsPanel
            fitnessStrategy={fitnessStrategy.label}
            crossoverStrategy={crossoverStrategy.label}
            mutationStrategy={mutationStrategy.label}
            mutationRate={mutationRate}
            pointsCount={points.length}
            populationSize={populationSize}
            isRunning={isRunning}
            onFitnessStrategyChange={actions.changeFitnessStrategy}
            onCrossoverStrategyChange={actions.changeCrossoverStrategy}
            onMutationStrategyChange={actions.changeMutationStrategy}
            onMutationRateChange={actions.changeMutationRate}
            onPointsCountChange={actions.changePointsCount}
            onPopulationSizeChange={actions.changePopulationSize}
            onToggleAuto={actions.toggleAuto}
            onEvolveOnce={actions.evolveOnce}
            onNewIndividuals={actions.newIndividuals}
            onReset={actions.reset}
          />

          <VisualizationStage
            points={points}
            population={population}
            generation={generation}
            populationSize={populationSize}
          />
        </div>
      </main>
    </div>
  );
}
