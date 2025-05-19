import { APIRequestContext } from '@playwright/test';

export class Actor {
  private abilities: Map<string, any> = new Map();

  constructor(private name: string) {}

  whoCan(ability: any): Actor {
    this.abilities.set(ability.constructor.name, ability);
    return this;
  }

  async attemptsTo<T>(task: any): Promise<T> {
    return await task.performAs(this);
  }

  async asks<T>(question: any): Promise<T> {
    return await question.answeredBy(this);
  }

  getAbility<T>(abilityType: string): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`Actor ${this.name} doesn't have the ability ${abilityType}`);
    }
    return ability as T;
  }
} 