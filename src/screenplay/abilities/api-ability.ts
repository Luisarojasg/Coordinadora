import { APIRequestContext, request } from '@playwright/test';

export class ApiAbility {
  private context: APIRequestContext | null;

  constructor() {
    this.context = null;
  }

  async initialize(): Promise<void> {
    this.context = await request.newContext({
      baseURL: 'https://apiv2-test.coordinadora.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
    }
  }

  getContext(): APIRequestContext {
    if (!this.context) {
      throw new Error('API context not initialized');
    }
    return this.context;
  }
} 