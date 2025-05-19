# Coordinadora API Tests

This project contains automated tests for the Coordinadora API using Playwright and TypeScript. The tests are written following the Screenplay Pattern for better maintainability and readability.

## Project Structure

```
├── src/
│   └── screenplay/
│       ├── abilities/     # Actor abilities (e.g., API ability)
│       ├── actors/        # Actor definitions and roles
│       ├── constants/     # Constants used across tests
│       ├── data/         # Test data
│       ├── interfaces/   # TypeScript interfaces
│       └── tasks/        # API tasks and requests
├── tests/
│   ├── performance/     # Load and stress tests
│   └── guia.spec.ts     # Functional tests
└── playwright.config.ts  # Playwright configuration
```

## Features

- Automated API testing for Coordinadora services
- Screenplay Pattern implementation
- TypeScript for type safety
- Playwright for API testing
- Comprehensive test coverage for:
  - Guía creation
  - Reference validation
  - Value collection validation
  - Error handling
- Performance testing:
  - Load testing (20 concurrent users)
  - Stress testing (up to 6000 requests)

## Performance Testing

### Load Test
- Concurrent Users: 20
- Request Rate: 2 requests/second
- Duration: 1 minute
- Expected Total Requests: 100
- Success Criteria:
  - Average Response Time ≤ 500ms
  - Error Rate < 1%

### Stress Test
- Initial Users: 100
- User Increment: +50 every 15 seconds
- Request Rate: Gradual increase from 10 to 100 RPS
- Duration: 1 minute
- Maximum Expected Requests: 6,000
- Success Criteria:
  - Progressive performance degradation
  - Identification of system breaking point

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Luisarojasg/Coordinadora.git
cd Coordinadora
```

2. Install dependencies:
```bash
npm install
```

## Running Tests

### Functional Tests
To run all functional tests:
```bash
npx playwright test
```

To run specific test file:
```bash
npx playwright test tests/guia.spec.ts
```

### Performance Tests
To run load test:
```bash
npx playwright test tests/performance/load-test.spec.ts
```

To run stress test:
```bash
npx playwright test tests/performance/stress-test.spec.ts
```

## Test Reports

After running tests, you can view the HTML report:
```bash
npx playwright show-report
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 