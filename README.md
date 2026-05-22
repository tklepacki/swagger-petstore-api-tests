# Petstore API Tests

Automated API test suite for the [Petstore](https://petstore.swagger.io/) `/pet` resource, built with [Playwright](https://playwright.dev/) and TypeScript.

## Stack

- **Playwright** — API test runner
- **TypeScript** — type safety across all test code
- **Zod** — runtime response schema validation

## Project structure

```
tests/
├── api/pet/
│   ├── create-pet.spec.ts       # POST /pet
│   ├── get-pet.spec.ts          # GET /pet/{id}
│   ├── update-pet.spec.ts       # PUT /pet, POST /pet/{id}
│   ├── delete-pet.spec.ts       # DELETE /pet/{id}
│   ├── find-by-status.spec.ts   # GET /pet/findByStatus
│   └── upload-image.spec.ts     # POST /pet/{id}/uploadImage
├── fixtures/
│   └── api.fixture.ts           # withPet fixture with auto-cleanup
├── factories/
│   └── pet.factory.ts           # test data factory
├── helpers/
│   └── pet-client.ts            # typed HTTP client
└── schemas/
    └── pet.schema.ts            # Zod schemas
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Running tests

```bash
# All tests
npm test

# Smoke tests only
npm run test:smoke

# Regression tests only
npm run test:regression

# Open HTML report
npm run report
```

## Configuration

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

| Variable  | Default                               | Description          |
|-----------|---------------------------------------|----------------------|
| `BASE_URL` | `https://petstore.swagger.io/v2/`   | API base URL         |
| `API_KEY`  | `special-key`                        | API key for DELETE   |

## CI/CD

GitHub Actions workflow at `.github/workflows/api-tests.yml`:

- Runs on push/PR to `main`, `master`, `develop`
- Scheduled daily at 06:00 UTC
- Manual trigger via `workflow_dispatch` with `test_scope` (all / smoke / regression) and `workers` inputs
- Test results published via `dorny/test-reporter` as a GitHub Check Run
- HTML report uploaded as an artifact (14-day retention)
- Traces and screenshots uploaded on failure (7-day retention)

### Repository secrets / variables

| Name       | Where         | Description               |
|------------|---------------|---------------------------|
| `API_KEY`  | Secret        | API key for DELETE requests |
| `BASE_URL` | Variable      | Override the target API URL |
