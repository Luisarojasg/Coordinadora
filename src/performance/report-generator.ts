import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface PerformanceMetrics {
  totalRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
  responseTimes: number[];
  errors: any[];
}

export class PerformanceReportGenerator {
  private metrics: PerformanceMetrics;
  private outputDir: string;

  constructor(metrics: PerformanceMetrics, outputDir: string = 'performance-reports') {
    this.metrics = metrics;
    this.outputDir = outputDir;
  }

  private generateResponseTimeChart(): string {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Define time ranges
    const timeRanges = [
      { min: 0, max: 500, label: '0-500ms' },
      { min: 501, max: 1000, label: '501-1000ms' },
      { min: 1001, max: 1500, label: '1001-1500ms' },
      { min: 1501, max: 2000, label: '1501-2000ms' },
      { min: 2001, max: Infinity, label: '>2000ms' }
    ];

    // Calculate data
    const data = timeRanges.map(range => ({
      label: range.label,
      count: this.metrics.responseTimes.filter(time => 
        time >= range.min && time < range.max
      ).length
    }));

    // Find maximum count for scaling
    const maxCount = Math.max(...data.map(d => d.count));

    // Set up chart dimensions
    const padding = 50;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barWidth = chartWidth / data.length - 10;

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw bars
    data.forEach((item, index) => {
      const x = padding + (index * (chartWidth / data.length));
      const height = (item.count / maxCount) * chartHeight;
      const y = canvas.height - padding - height;

      // Draw bar
      ctx.fillStyle = 'rgba(54, 162, 235, 0.5)';
      ctx.fillRect(x, y, barWidth, height);

      // Draw label
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + (barWidth / 2), canvas.height - padding + 20);
      ctx.fillText(item.count.toString(), x + (barWidth / 2), y - 5);
    });

    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Response Time Distribution', canvas.width / 2, padding - 20);

    // Save chart to file
    const chartPath = join(this.outputDir, 'response-time-chart.png');
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(chartPath, buffer);

    return chartPath;
  }

  private generateErrorAnalysis(): string {
    const errorTypes = new Map<string, number>();
    this.metrics.errors.forEach(error => {
      const errorType = error.name || 'Unknown';
      errorTypes.set(errorType, (errorTypes.get(errorType) || 0) + 1);
    });

    return Array.from(errorTypes.entries())
      .map(([type, count]) => `${type}: ${count} occurrences`)
      .join('\n');
  }

  private generateOptimizationRecommendations(): string {
    const recommendations: string[] = [];

    // Response Time Analysis
    if (this.metrics.averageResponseTime > 1000) {
      recommendations.push(
        'Response Time Optimization:',
        '- Consider implementing caching for frequently accessed data',
        '- Review database query performance and add necessary indexes',
        '- Implement request batching for multiple related operations',
        '- Consider using a CDN for static content delivery'
      );
    }

    // Error Rate Analysis
    if (this.metrics.errorRate > 0.1) {
      recommendations.push(
        'Error Rate Reduction:',
        '- Implement circuit breakers for external service calls',
        '- Add retry mechanisms with exponential backoff',
        '- Improve error handling and logging',
        '- Consider implementing fallback mechanisms'
      );
    }

    // Throughput Analysis
    if (this.metrics.requestsPerSecond < 10) {
      recommendations.push(
        'Throughput Improvement:',
        '- Consider horizontal scaling of the application',
        '- Implement connection pooling',
        '- Review and optimize resource utilization',
        '- Consider implementing request queuing for peak loads'
      );
    }

    return recommendations.join('\n');
  }

  public generateReport(): void {
    const chartPath = this.generateResponseTimeChart();
    const report = `
# Performance Test Report

## Test Summary
- Total Requests: ${this.metrics.totalRequests}
- Average Response Time: ${this.metrics.averageResponseTime.toFixed(2)}ms
- 95th Percentile Response Time: ${this.metrics.p95ResponseTime}ms
- Error Rate: ${this.metrics.errorRate.toFixed(2)}%
- Requests Per Second: ${this.metrics.requestsPerSecond.toFixed(2)}

## Response Time Distribution
![Response Time Distribution](${chartPath})

## Error Analysis
${this.generateErrorAnalysis()}

## Optimization Recommendations
${this.generateOptimizationRecommendations()}

## Detailed Metrics
### Response Time Statistics
- Minimum: ${Math.min(...this.metrics.responseTimes)}ms
- Maximum: ${Math.max(...this.metrics.responseTimes)}ms
- Median: ${this.calculateMedian(this.metrics.responseTimes)}ms
- Standard Deviation: ${this.calculateStandardDeviation(this.metrics.responseTimes).toFixed(2)}ms

### Error Statistics
- Total Errors: ${this.metrics.errors.length}
- Error Types: ${this.getUniqueErrorTypes().length}
- Most Common Error: ${this.getMostCommonError()}

## Recommendations Summary
1. Performance Optimization
   - Focus on reducing average response time below 1 second
   - Implement caching strategies
   - Optimize database queries

2. Error Handling
   - Implement comprehensive error handling
   - Add retry mechanisms
   - Improve error logging and monitoring

3. Scalability
   - Consider horizontal scaling
   - Implement load balancing
   - Optimize resource utilization
`;

    writeFileSync(join(this.outputDir, 'performance-report.md'), report);
  }

  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  }

  private calculateStandardDeviation(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squareDiffs = numbers.map(value => {
      const diff = value - mean;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  private getUniqueErrorTypes(): string[] {
    return Array.from(new Set(this.metrics.errors.map(error => error.name || 'Unknown')));
  }

  private getMostCommonError(): string {
    const errorCounts = new Map<string, number>();
    this.metrics.errors.forEach(error => {
      const errorType = error.name || 'Unknown';
      errorCounts.set(errorType, (errorCounts.get(errorType) || 0) + 1);
    });
    return Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }
} 