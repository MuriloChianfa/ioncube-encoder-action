# Test Suite

Comprehensive tests for the IonCube Encoder GitHub Action.

## Test Files

- **`helpers.js`** - Shared test utilities and mock helpers
- **`index.test.js`** - Basic entrypoint tests
- **`main.test.js`** - Main action execution tests (22 tests)
- **`inputs.test.js`** - Input validation tests (55+ tests)
- **`scenarios.test.js`** - Real-world integration scenarios (36 tests)
- **`errors.test.js`** - Error handling and edge cases (42 tests)
- **`command.test.js`** - Command generation tests (35 tests)

## Running Tests

### Local (with Node.js installed)

```bash
# Run all tests
npm test

# Run specific test file
npx jest __tests__/inputs.test.js

# Run with coverage
npm run coverage

# Watch mode
npx jest --watch
```

### Docker

```bash
# Run all tests in Docker
docker compose up test

# Run specific test file
docker compose run --rm test npx jest __tests__/inputs.test.js

# Run with coverage
docker compose run --rm test-coverage

# Interactive shell for debugging
docker compose run --rm test-interactive
```

## Test Coverage

Tests cover:

- All 30+ input parameters
- Template configurations (PHP, Laravel)
- Production and development scenarios
- Error handling and edge cases
- Command string construction
- Special characters and escaping

## Adding Tests

1. Use helper functions from `helpers.js`
2. Follow existing test structure
3. Mock all external dependencies
4. Add descriptive test names
5. Run `npm test` to verify
