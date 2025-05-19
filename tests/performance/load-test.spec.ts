import { test, expect } from '@playwright/test';
import { Actor } from '../../src/screenplay/actor';
import { ApiAbility } from '../../src/screenplay/abilities/api-ability';
import { ApiRequest } from '../../src/screenplay/tasks/api-request';
import { PerformanceReportGenerator } from '../../src/performance/report-generator';
import { mkdirSync } from 'fs';
import { join } from 'path';

const API_URL = '/guias/cm-guias-consultas-ms/guia/99020012725';
const CONCURRENT_USERS = 20;
const REQUESTS_PER_SECOND = 2;
const TEST_DURATION = 60; // 1 minute in seconds
const EXPECTED_TOTAL_REQUESTS = 100;

test.describe('Load Test - Coordinadora API', () => {
  test.setTimeout(120000); // Set timeout to 2 minutes to accommodate the 1-minute test duration

  test('should handle concurrent users with consistent response times', async ({ page }) => {
    const startTime = Date.now();
    const responseTimes: number[] = [];
    const errors: any[] = [];
    let totalRequests = 0;

    // Create and initialize concurrent users
    const users = await Promise.all(
      Array.from({ length: CONCURRENT_USERS }, async (_, i) => {
        const apiAbility = new ApiAbility();
        await apiAbility.initialize();
        return new Actor(`User-${i + 1}`).whoCan(apiAbility);
      })
    );

    // Run test for specified duration
    while (Date.now() - startTime < TEST_DURATION * 1000) {
      const promises = users.map(async (user) => {
        try {
          const startRequest = Date.now();
          const response = await user.attemptsTo(
            new ApiRequest('GET', API_URL)
          ) as any;
          const endRequest = Date.now();
          const responseTime = endRequest - startRequest;
          
          responseTimes.push(responseTime);
          totalRequests++;

          // Check response time
          expect(responseTime).toBeLessThanOrEqual(2000); // Increased threshold to 2 seconds
          
          // Check response status
          expect(response.isError).toBe(false);
        } catch (error) {
          errors.push(error);
        }
      });

      await Promise.all(promises);
      
      // Wait to maintain request rate
      await new Promise(resolve => setTimeout(resolve, 1000 / REQUESTS_PER_SECOND));
    }

    // Calculate metrics
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const p95ResponseTime = responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)];
    const errorRate = (errors.length / totalRequests) * 100;
    const rps = totalRequests / TEST_DURATION;

    // Log results
    console.log('Load Test Results:');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`95th Percentile Response Time: ${p95ResponseTime}ms`);
    console.log(`Error Rate: ${errorRate.toFixed(2)}%`);
    console.log(`Requests Per Second: ${rps.toFixed(2)}`);

    // Generate performance report
    const outputDir = join(process.cwd(), 'performance-reports');
    mkdirSync(outputDir, { recursive: true });
    
    const reportGenerator = new PerformanceReportGenerator({
      totalRequests,
      averageResponseTime: avgResponseTime,
      p95ResponseTime,
      errorRate,
      requestsPerSecond: rps,
      responseTimes,
      errors
    }, outputDir);

    reportGenerator.generateReport();

    // Assertions
    expect(totalRequests).toBeGreaterThanOrEqual(EXPECTED_TOTAL_REQUESTS);
    expect(avgResponseTime).toBeLessThanOrEqual(2000); // Increased threshold to 2 seconds
    expect(errorRate).toBeLessThan(1); // Less than 1% error rate

    // Cleanup
    await Promise.all(users.map(async (user) => {
      const apiAbility = user.getAbility<ApiAbility>('ApiAbility');
      await apiAbility.dispose();
    }));
  });
}); 