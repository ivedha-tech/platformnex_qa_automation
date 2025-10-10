FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app

ENV PLAYWRIGHT_BROWSERS_PATH=0 \
    CI=true \
    HEADLESS=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Install browsers and their dependencies inside the image to avoid
# per-execution download overhead in Cloud Run Jobs.
RUN npx playwright install --with-deps

# Create reports directory
RUN mkdir -p reports test-results playwright-report

# Default command executes the Playwright test suite.
# Environment variables such as BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD should be provided at runtime.
CMD ["npx", "playwright", "test", "--reporter=html,json", "--workers=4"]
