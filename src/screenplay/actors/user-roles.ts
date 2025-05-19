import { Actor } from '../actor';
import { ApiAbility } from '../abilities/api-ability';

export class CoordinadoraUser extends Actor {
  constructor() {
    super('Coordinadora User');
  }

  static async create(): Promise<CoordinadoraUser> {
    const apiAbility = new ApiAbility();
    await apiAbility.initialize();
    
    return new CoordinadoraUser().whoCan(apiAbility) as CoordinadoraUser;
  }
}

export class AdminUser extends Actor {
  constructor() {
    super('Admin User');
  }

  static async create(): Promise<AdminUser> {
    const apiAbility = new ApiAbility();
    await apiAbility.initialize();
    
    return new AdminUser().whoCan(apiAbility) as AdminUser;
  }
} 