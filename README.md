# Tax Calculator

A Canadian federal income tax calculator. Enter a salary and tax year to see a breakdown of tax owed per bracket and your effective tax rate.

## Prerequisites

- Node.js 20.19+
- Docker (for the tax brackets API)

## Setup

```bash
npm install
cp .env.example .env.local
```

## Running the App

Start both the API and the Next.js dev server:

```bash
npm run dev:full
```

Or start them separately:

```bash
npm run api   # Docker API on http://localhost:5001
npm run dev   # Next.js on http://localhost:3000
```

## Environment Variables

| Variable           | Default                 | Description                      |
| ------------------ | ----------------------- | -------------------------------- |
| `TAX_API_BASE_URL` | `http://localhost:5001` | Base URL of the tax brackets API |

## Testing

```bash
npm test           # run all tests
npm run test:watch # watch mode
```

32 tests across unit, hook, component, and API route levels.

## Storybook

```bash
npm run storybook
```

Opens at http://localhost:6006. Covers all UI components and feature components.

## Architecture

The Docker tax brackets API is proxied through a Next.js API route (`/api/tax-brackets/[year]`) rather than called directly from the browser. This avoids CORS issues, centralizes retry logic (exponential backoff, 3 attempts) for transient upstream errors, and keeps the client decoupled from the upstream URL. The proxy returns a consistent response shape regardless of what the upstream does.

Tax calculation runs client-side from the returned brackets. It's pure math with no secrets, so there's no reason for a server round trip after the brackets are fetched.

State is managed with a custom `useTaxCalculator` hook using a discriminated union (`idle | loading | success | error`) rather than separate boolean flags. This makes impossible states unrepresentable and keeps component rendering logic simple, each state maps to exactly one UI.

## Project Structure

```
app/
  api/tax-brackets/[year]/route.ts  # API proxy with retry logic
  page.tsx                          # Entry point
features/
  tax-calculator/
    TaxCalculator.tsx               # Orchestrator
    components/                     # Form, results table, error state
    hooks/useTaxCalculator.ts       # State + fetch logic
    lib/
      calculateTax.ts               # Pure calculation function
      types.ts                      # Types and Zod schemas
components/ui/                      # shadcn/ui component library
```
