import { shuffleArray } from '@/utils';

type Gene = number;

export class Individual {
  constructor(public genes: Gene[] = []) {}

  mutate(mutationRate: number): this {
    if (Math.random() < mutationRate) {
      this.genes = shuffleArray(this.genes);
    }
    return this;
  }

  crossover(partner: Individual): [Individual, Individual] {
    const sectionPoint = Math.floor(this.genes.length * 0.75);

    const newGenes1 = this.combineGenes(this.genes, partner.genes, sectionPoint);
    const newGenes2 = this.combineGenes(partner.genes, this.genes, sectionPoint);

    return [new Individual(newGenes1), new Individual(newGenes2)];
  }

  private combineGenes(genes1: Gene[], genes2: Gene[], sectionPoint: number): Gene[] {
    const firstSection = genes1.slice(0, sectionPoint);

    return firstSection.concat(
      genes2.reduce<Gene[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !firstSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
    );
  }
}
