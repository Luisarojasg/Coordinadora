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
├── tests/                # Test specifications
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

To run all tests:
```bash
npx playwright test
```

To run specific test file:
```bash
npx playwright test tests/guia.spec.ts
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