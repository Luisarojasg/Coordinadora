import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'https://apiv2-test.coordinadora.com/guias/cm-guias-ms/guia',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  reporter: 'html',
};

export default config; 