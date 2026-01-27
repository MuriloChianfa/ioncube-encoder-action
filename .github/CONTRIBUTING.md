# Contributing to IonCube Encoder Action

Thank you for your interest in contributing! We welcome contributions from the
community.

## Development Setup

### Prerequisites

- Node.js 20.8.0 or higher
- NPM 10.1.0 or higher

### Getting Started

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make your changes
4. Run the test suite:
   ```bash
   npm run all
   ```

This command will:

- Format code with Prettier
- Lint with ESLint
- Run tests with Jest
- Generate coverage report
- Bundle the action

## Code Style

- We use **ESLint** for linting
- We use **Prettier** for code formatting
- Run `npm run format:write` before committing
- Ensure `npm run lint` passes without warnings

## Testing

- Write tests for new features in the `__tests__/` directory
- Ensure all tests pass with `npm test`
- Maintain or improve code coverage

## Submitting Changes

1. Create a new branch for your changes
2. Make your changes with clear, descriptive commits
3. Push to your fork
4. Open a Pull Request using the appropriate template:
   - Bug fixes: Use the bug fix template
   - New features: Use the feature template
   - General changes: Use the default template

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] `npm run all` passes successfully
- [ ] No linter warnings
- [ ] Bundle updated (`npm run bundle`)

## Reporting Issues

Use the issue templates provided:

- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting new features

## Questions?

Feel free to open an issue for questions or reach out to
murilo.chianfa@outlook.com.
