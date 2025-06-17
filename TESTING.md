# 🧪 PharmaLink Testing Infrastructure

This document outlines the comprehensive testing strategy and infrastructure for the PharmaLink project.

## 📋 Testing Overview

Our testing strategy covers four main areas:
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing  
- **E2E Tests**: User journey testing
- **Performance Tests**: Load testing

## 🛠️ Testing Stack

### Frontend Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing
- **Cypress**: End-to-end testing
- **@testing-library/user-event**: User interaction simulation

### Backend Testing
- **Jest**: Node.js testing framework
- **Supertest**: HTTP assertion testing
- **Artillery**: Performance and load testing

## 🚀 Getting Started

### Installation
All testing dependencies are already installed. If you need to reinstall:

```bash
# Frontend dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event cypress @types/jest jest-environment-jsdom

# Backend dependencies (in gemini-proxy directory)
cd gemini-proxy
npm install --save-dev jest supertest artillery
```

### Running Tests

#### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Integration Tests
```bash
# Backend API tests
cd gemini-proxy
npm test

# Backend tests with coverage
cd gemini-proxy
npm run test:coverage
```

#### E2E Tests
```bash
# Run Cypress tests headlessly
npm run test:e2e

# Open Cypress test runner
npm run test:e2e:open

# Run all tests (unit + e2e)
npm run test:all
```

#### Performance Tests
```bash
# Install Artillery globally if not installed
npm install -g artillery

# Run load tests
artillery run performance/load-test.yml

# Run quick performance test
artillery quick --duration 60 --rate 10 http://localhost:3000
```

## 📁 Test Structure

```
├── src/
│   ├── components/
│   │   └── __tests__/           # Component unit tests
│   ├── utils/
│   │   └── __tests__/           # Utility function tests
│   └── utils/test-utils.tsx     # Testing utilities
├── __tests__/
│   └── api/                     # API integration tests
├── cypress/
│   ├── e2e/                     # End-to-end tests
│   ├── fixtures/                # Test data
│   └── support/                 # Cypress configuration
├── gemini-proxy/
│   └── __tests__/               # Backend unit tests
├── performance/
│   └── load-test.yml            # Performance test configuration
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup
└── cypress.config.js            # Cypress configuration
```

## 🧪 Writing Tests

### Unit Tests Example

```javascript
// src/utils/__tests__/currency.test.ts
import { formatCurrency } from '../currency'

describe('Currency Utils', () => {
  it('should format CFA currency correctly', () => {
    expect(formatCurrency(1000, 'CFA')).toBe('1,000 CFA')
  })
})
```

### Component Tests Example

```javascript
// src/components/__tests__/Navigation.test.tsx
import { render, screen } from '@/utils/test-utils'
import { Navigation } from '../Navigation'

describe('Navigation Component', () => {
  it('should render navigation links', () => {
    render(<Navigation />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
```

### API Tests Example

```javascript
// __tests__/api/pharmacies.test.js
const request = require('supertest')
const app = require('../../app')

describe('/api/pharmacies', () => {
  it('should return list of pharmacies', async () => {
    const response = await request(app)
      .get('/api/pharmacies')
      .expect(200)
    
    expect(response.body.success).toBe(true)
  })
})
```

### E2E Tests Example

```javascript
// cypress/e2e/user-journey.cy.js
describe('User Journey', () => {
  it('should complete medication purchase', () => {
    cy.visit('/')
    cy.searchMedication('paracetamol')
    cy.get('[data-testid="medication-card"]').first().click()
    cy.addToCart('1')
    cy.checkout()
    // ... rest of test
  })
})
```

## 🎯 Testing Best Practices

### General Guidelines
1. **Write descriptive test names** that explain what is being tested
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Test behavior, not implementation**
4. **Keep tests independent** and isolated
5. **Use data-testid attributes** for reliable element selection

### Unit Testing
- Test pure functions thoroughly
- Mock external dependencies
- Test edge cases and error conditions
- Aim for high code coverage (>80%)

### Integration Testing
- Test API endpoints with real database interactions
- Test authentication and authorization
- Test error handling and validation
- Use test database for isolation

### E2E Testing
- Test critical user journeys
- Test across different browsers and devices
- Use page object pattern for maintainability
- Keep tests stable and reliable

### Performance Testing
- Test under realistic load conditions
- Monitor response times and throughput
- Test scalability limits
- Identify performance bottlenecks

## 📊 Test Coverage

### Coverage Targets
- **Unit Tests**: >80% line coverage
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: All critical user flows covered
- **Performance Tests**: All major endpoints tested

### Viewing Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

## 🔧 Configuration

### Jest Configuration
- Located in `jest.config.js`
- Configured for Next.js with TypeScript
- Includes module path mapping
- Sets up test environment

### Cypress Configuration
- Located in `cypress.config.js`
- Configured for both E2E and component testing
- Includes custom commands and utilities
- Sets up test data and fixtures

## 🚨 Troubleshooting

### Common Issues

#### Tests failing due to async operations
```javascript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument()
})
```

#### Cypress tests timing out
```javascript
// Increase timeout for slow operations
cy.get('[data-testid="slow-element"]', { timeout: 10000 })
```

#### Mock not working
```javascript
// Ensure mocks are cleared between tests
beforeEach(() => {
  jest.clearAllMocks()
})
```

### Debug Mode
```bash
# Run Jest in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run Cypress in debug mode
npm run test:e2e:open
```

## 📈 Continuous Integration

### GitHub Actions
Tests are automatically run on:
- Pull requests
- Pushes to main branch
- Scheduled runs (daily)

### Test Reports
- Unit test results in JUnit format
- Coverage reports uploaded to Codecov
- E2E test videos and screenshots on failure
- Performance test results archived

## 🔄 Test Maintenance

### Regular Tasks
1. **Update test data** to match production data
2. **Review and update test coverage** targets
3. **Refactor tests** when code changes
4. **Update dependencies** regularly
5. **Monitor test performance** and optimize slow tests

### Test Data Management
- Use fixtures for consistent test data
- Create factories for generating test objects
- Keep test data minimal and focused
- Clean up test data after tests

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Artillery Documentation](https://artillery.io/docs/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
