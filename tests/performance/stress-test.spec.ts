import { test, expect } from '@playwright/test';
import { Actor } from '../../src/screenplay/actor';
import { ApiAbility } from '../../src/screenplay/abilities/api-ability';
import { ConsultarGuia, ApiResponse } from '../../src/screenplay/tasks/guia-tasks';
import { ApiRequest } from '../../src/screenplay/tasks/api-request';
import { PerformanceReportGenerator } from '../../src/performance/report-generator';
import { mkdirSync } from 'fs';
import { join } from 'path';

const API_URL = '/guias/cm-guias-consultas-ms/guia/99020012725';
const INITIAL_USERS = 100;
const USER_INCREMENT = 50;
const INCREMENT_INTERVAL = 15; // seconds
const TEST_DURATION = 60; // 1 minute in seconds
const MAX_EXPECTED_REQUESTS = 6000;

test.describe('Stress Test - Coordinadora API', () => {
  test.setTimeout(120000); // Set timeout to 2 minutes to accommodate the 1-minute test duration

  test('should identify system breaking point under increasing load', async ({ page }) => {
    const startTime = Date.now();
    const responseTimes: number[] = [];
    const errors: any[] = [];
    let totalRequests = 0;
    let currentUsers = INITIAL_USERS;
    let currentRPS = 10;
    const rpsIncrement = (100 - 10) / (TEST_DURATION / INCREMENT_INTERVAL);
    let allUsers: Actor[] = [];

    // Run test for specified duration
    while (Date.now() - startTime < TEST_DURATION * 1000) {
      // Create and initialize users for current iteration
      const newUsers = await Promise.all(
        Array.from({ length: currentUsers }, async (_, i) => {
          const apiAbility = new ApiAbility();
          await apiAbility.initialize();
          return new Actor(`User-${allUsers.length + i + 1}`).whoCan(apiAbility);
        })
      );
      allUsers = [...allUsers, ...newUsers];

      // Calculate requests for this interval
      const requestsThisInterval = Math.floor(currentRPS * INCREMENT_INTERVAL);
      const requestsPerUser = Math.ceil(requestsThisInterval / currentUsers);

      // Execute requests
      const promises = newUsers.map(async (user) => {
        for (let i = 0; i < requestsPerUser; i++) {
          try {
            const startRequest = Date.now();
            const response = await user.attemptsTo(
              ConsultarGuia.withGuiaId('99020012725')
            ) as ApiResponse;
            const endRequest = Date.now();
            const responseTime = endRequest - startRequest;
            
            responseTimes.push(responseTime);
            totalRequests++;

            // Check response status
            expect(response.success).toBe(true);
          } catch (error) {
            errors.push(error);
          }
        }
      });

      await Promise.all(promises);

      // Increment users and RPS
      currentUsers += USER_INCREMENT;
      currentRPS += rpsIncrement;

      // Log current state
      console.log(`Current Users: ${currentUsers}`);
      console.log(`Current RPS: ${currentRPS.toFixed(2)}`);
      console.log(`Total Requests: ${totalRequests}`);
      console.log(`Error Count: ${errors.length}`);

      // Check if we've hit the breaking point
      const errorRate = (errors.length / totalRequests) * 100;
      if (errorRate > 5) { // 5% error rate threshold
        console.log('Breaking point reached!');
        console.log(`Users at breaking point: ${currentUsers}`);
        console.log(`RPS at breaking point: ${currentRPS}`);
        break;
      }

      // Wait for next interval
      await new Promise(resolve => setTimeout(resolve, INCREMENT_INTERVAL * 1000));
    }

    // Calculate final metrics
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const p95ResponseTime = responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)];
    const errorRate = (errors.length / totalRequests) * 100;
    const rps = totalRequests / TEST_DURATION;

    // Log final results
    console.log('Stress Test Results:');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`95th Percentile Response Time: ${p95ResponseTime}ms`);
    console.log(`Error Rate: ${errorRate.toFixed(2)}%`);
    console.log(`Requests Per Second: ${rps.toFixed(2)}`);
    console.log(`Maximum Concurrent Users: ${currentUsers}`);

    // Assertions
    expect(totalRequests).toBeLessThanOrEqual(MAX_EXPECTED_REQUESTS);

    // Cleanup
    await Promise.all(allUsers.map(async (user) => {
      const apiAbility = user.getAbility<ApiAbility>('ApiAbility');
      await apiAbility.dispose();
    }));

    // Generate performance report
    const outputDir = join(process.cwd(), 'performance-reports');
    mkdirSync(outputDir, { recursive: true });
    
    // Use custom filenames for stress test
    const reportGenerator = new PerformanceReportGenerator({
      totalRequests,
      averageResponseTime: avgResponseTime,
      p95ResponseTime,
      errorRate,
      requestsPerSecond: rps,
      responseTimes,
      errors
    }, outputDir);

    // Patch the generator to use custom filenames
    (reportGenerator as any).generateResponseTimeChart = function() {
      const canvas = require('canvas').createCanvas(800, 400);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const timeRanges = [
        { min: 0, max: 500, label: '0-500ms' },
        { min: 501, max: 1000, label: '501-1000ms' },
        { min: 1001, max: 1500, label: '1001-1500ms' },
        { min: 1501, max: 2000, label: '1501-2000ms' },
        { min: 2001, max: Infinity, label: '>2000ms' }
      ];
      const data = timeRanges.map(range => ({
        label: range.label,
        count: this.metrics.responseTimes.filter(time => time >= range.min && time < range.max).length
      }));
      const maxCount = Math.max(...data.map(d => d.count));
      const padding = 50;
      const chartWidth = canvas.width - (padding * 2);
      const chartHeight = canvas.height - (padding * 2);
      const barWidth = chartWidth / data.length - 10;
      ctx.strokeStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.stroke();
      data.forEach((item, index) => {
        const x = padding + (index * (chartWidth / data.length));
        const height = (item.count / maxCount) * chartHeight;
        const y = canvas.height - padding - height;
        ctx.fillStyle = 'rgba(54, 162, 235, 0.5)';
        ctx.fillRect(x, y, barWidth, height);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + (barWidth / 2), canvas.height - padding + 20);
        ctx.fillText(item.count.toString(), x + (barWidth / 2), y - 5);
      });
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Response Time Distribution', canvas.width / 2, padding - 20);
      const chartPath = require('path').join(this.outputDir, 'response-time-chart-stress.png');
      const buffer = canvas.toBuffer('image/png');
      require('fs').writeFileSync(chartPath, buffer);
      return chartPath;
    };
    (reportGenerator as any).generateReport = function() {
      const chartPath = this.generateResponseTimeChart();
      const report = `\n# Performance Test Report (Stress Test)\n\n## Test Summary\n- Total Requests: ${this.metrics.totalRequests}\n- Average Response Time: ${this.metrics.averageResponseTime.toFixed(2)}ms\n- 95th Percentile Response Time: ${this.metrics.p95ResponseTime}ms\n- Error Rate: ${this.metrics.errorRate.toFixed(2)}%\n- Requests Per Second: ${this.metrics.requestsPerSecond.toFixed(2)}\n\n## Response Time Distribution\n![Response Time Distribution](${chartPath})\n\n## Error Analysis\n${this.generateErrorAnalysis()}\n\n## Optimization Recommendations\n${this.generateOptimizationRecommendations()}\n\n## Detailed Metrics\n### Response Time Statistics\n- Minimum: ${Math.min(...this.metrics.responseTimes)}ms\n- Maximum: ${Math.max(...this.metrics.responseTimes)}ms\n- Median: ${this.calculateMedian(this.metrics.responseTimes)}ms\n- Standard Deviation: ${this.calculateStandardDeviation(this.metrics.responseTimes).toFixed(2)}ms\n\n### Error Statistics\n- Total Errors: ${this.metrics.errors.length}\n- Error Types: ${this.getUniqueErrorTypes().length}\n- Most Common Error: ${this.getMostCommonError()}\n\n## Recommendations Summary\n1. Performance Optimization\n   - Focus on reducing average response time below 1 second\n   - Implement caching strategies\n   - Optimize database queries\n\n2. Error Handling\n   - Implement comprehensive error handling\n   - Add retry mechanisms\n   - Improve error logging and monitoring\n\n3. Scalability\n   - Consider horizontal scaling\n   - Implement load balancing\n   - Optimize resource utilization\n`;
      require('fs').writeFileSync(require('path').join(this.outputDir, 'performance-report-stress.md'), report);
    };
    reportGenerator.generateReport();
  });
}); 