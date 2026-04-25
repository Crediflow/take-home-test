# Invoice Inbox — Take-Home

A small full-stack feature on a multi-tenant Next.js + tRPC + Prisma stack. The scaffold is wired (auth simulation, multi-tenant context, tRPC bootstrap, seed data). The work is the feature itself **and** the decisions you make around it.

## Time budget

~4 hours, hard stop at 6. Don't gold-plate. Stop at the limit and write a `NOTES.md` for what you'd do with more.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev    # http://localhost:3000
```

Click a user on the home page to "log in". Two seeded orgs ("Acme Capital", "Beta Lending") with two users each.

## What we want

Users in an organization should be able to:

- Submit raw invoice content (text body) into their org's inbox.
- See a list of their org's invoices.
- Open a single invoice and see its extracted structured fields.

Submissions get extracted into structured fields (vendor, amount, date) by an external service. Extraction can fail. The user should always know the state of their submission.

A stub extractor is provided at [`src/server/services/extract.ts`](src/server/services/extract.ts) — read it before you start; its failure mode is intentional.

## What's pre-built

- Next.js 15 (App Router) + tRPC v11 + Prisma + SQLite + Tailwind + Vitest
- Multi-tenant data model: `User`, `Organization`, `Membership`
- Cookie-based simulated session, resolved to a user + active org in [`src/server/context.ts`](src/server/context.ts)
- `userProcedure` / `orgProcedure` middlewares in [`src/server/trpc.ts`](src/server/trpc.ts)
- Example router: [`src/server/routers/me.ts`](src/server/routers/me.ts)

The scaffold ships with no invoice code. The schema, routes, pages, tests, and where logic lives are yours to design.

## Constraints

- **Multi-tenancy is non-negotiable.** A user from Org A must never reach Org B's data through any code path you write.
- Don't replace the simulated auth — production auth is out of scope.
- Stay on SQLite. Don't introduce a queue, Inngest, or any infra beyond what's already here.
- LLM-assisted coding is fine. Be ready to defend every line in the walkthrough.

## What you'll be graded on

The engineering decisions you make, more than feature completeness. Be ready to defend every one in the walkthrough.

## Walkthrough

Plan for a 30–45 min screen-share after submission. We'll walk the code, ask why you made specific choices, and have you write a new test live.

## Submitting

Push to a private repo and add the reviewer, or zip the directory excluding `node_modules`, `.next`, `prisma/dev.db`, `.env`.

Include a `NOTES.md` covering:

- What you skipped and why.
- **Two ambiguities you hit in this brief and how you resolved them.**
