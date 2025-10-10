## PlatformNEX QA Automation

End-to-end UI test automation for PlatformNEX using Playwright and TypeScript. Generates rich HTML reports via Monocart Reporter.

### Tech Stack
- **Language**: TypeScript
- **Test Runner**: Playwright (`@playwright/test`)
- **Reporter**: Monocart Reporter (HTML under `reports/`)
- **Lint/Format**: ESLint, Prettier

### Repository Structure
- `src/pages/`: Page Object Model (POM) classes
- `src/tests/`: Test suites (Functional, Regression)
- `src/utils/`: Utilities (asserts, auth, YAML helpers, test data)
- `playwright.config.ts`: Playwright configuration (baseURL, reporter, timeouts)
- `reports/`: Generated HTML reports and artifacts
- `test-results/`: Per-run traces, videos, screenshots
- `dist/`: Transpiled JavaScript (from `npm run build`)

### Prerequisites
- Node.js 18+ and npm
- Browsers for Playwright (installed via command below)

### Setup
```bash
npm install
npm run playwright:install
```

### Configuration
- Base URL and defaults are in `playwright.config.ts`.
- Test data lives in `src/utils/testData.yaml`.
  - Do not commit secrets. Replace any placeholder credentials locally as needed.

### Common Scripts
```bash
# Type-check only (no emit)
npm run test:typecheck

# Build TypeScript to JavaScript (outputs to dist/)
npm run build

# Run all tests (headless per Playwright default unless overridden)
npm test

# Headed mode
npm run test:headed

# UI mode (explore, filter, re-run tests)
npm run test:ui

# Debug mode (opens inspector)
npm run test:debug

# Run a specific spec
npm run test:specific

# Open the last Playwright report
npm run playwright:report

# Lint and fix
npm run lint
npm run lint:fix

# Format with Prettier
npm run format
```

Notes:
- Monocart HTML report is generated at `reports/test-report.html` with artifacts under `reports/`.
- Playwright report viewer (`playwright show-report`) can also be used.

### Running Tests

#### Local Development
```bash
# All tests
npm test

# By project/file/pattern (examples)
npx playwright test src/tests/Functional/Login.spec.ts
npx playwright test -g "should login successfully"
```

#### Docker Container Testing
The project includes a Dockerfile for containerized testing, which is also used in Cloud Build.

**Build the Docker image:**
```bash
docker build -t platformnex-qa-tests:latest .
```

**Run tests in the container:**
```bash
# Basic test run with environment variables
docker run --rm \
  -e BASE_URL=https://your-app-url.com \
  -e LOGIN_EMAIL=your-email@domain.com \
  -e LOGIN_PASSWORD=your-password \
  -e CI=true \
  -e HEADLESS=true \
  platformnex-qa-tests:latest \
  npx playwright test --reporter=line --workers=4

# Run with specific test file
docker run --rm \
  -e BASE_URL=https://your-app-url.com \
  -e LOGIN_EMAIL=your-email@domain.com \
  -e LOGIN_PASSWORD=your-password \
  -e CI=true \
  -e HEADLESS=true \
  platformnex-qa-tests:latest \
  npx playwright test src/tests/Functional/Login.spec.ts

# Run in headed mode (for debugging)
docker run --rm \
  -e BASE_URL=https://your-app-url.com \
  -e LOGIN_EMAIL=your-email@domain.com \
  -e LOGIN_PASSWORD=your-password \
  -e CI=true \
  -e HEADLESS=false \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -e DISPLAY=$DISPLAY \
  platformnex-qa-tests:latest \
  npx playwright test --reporter=line --workers=1
```

**Environment Variables:**
- `BASE_URL`: The application URL to test against
- `LOGIN_EMAIL`: Email for authentication
- `LOGIN_PASSWORD`: Password for authentication
- `CI=true`: Enables CI mode (retries, stricter timeouts)
- `HEADLESS`: Set to `false` for headed mode (requires X11 forwarding)

Environment-specific overrides can be passed via Playwright CLI flags or environment variables. Consider parameterizing `baseURL` via env if you need multiple environments.

### Test Artifacts
- Traces: stored under `test-results/**/trace.zip` (enabled on first retry)
- Screenshots: `on` (saved on failure)
- Videos: `retain-on-failure`
- HTML Report: `reports/test-report.html`

### SonarQube
Project properties are defined in `sonar-project.properties`. Integrate with your CI as needed.

### Contributing
- Keep tests deterministic and independent.
- Prefer Page Objects under `src/pages/` and shared helpers under `src/utils/`.
- Ensure `npm run test:typecheck` and `npm run lint` pass before opening PRs.

### Troubleshooting
- If browsers are missing: run `npm run playwright:install`.
- If tests fail due to environment or data, verify credentials and records in `src/utils/testData.yaml` and the configured `baseURL`.
- To debug flakiness, re-run with `npm run test:debug` and inspect traces/videos under `test-results/`.

### License
ISC (see `package.json`).
