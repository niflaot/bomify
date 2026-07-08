<p align="center">
  <img src="public/logo.svg" alt="Bomify" width="96" />
</p>

<h1 align="center">Bomify</h1>

<p align="center">
  BOM (Bill of Materials) builder for production workshops — patterns, materials, cut optimization, and costing, in one workspace.
</p>

<p align="center">
  <a href="https://github.com/niflaot/bomify/actions/workflows/checks.yml"><img src="https://github.com/niflaot/bomify/actions/workflows/checks.yml/badge.svg" alt="Checks"></a>
  <a href="https://github.com/niflaot/bomify/actions/workflows/ghcr.yml"><img src="https://github.com/niflaot/bomify/actions/workflows/ghcr.yml/badge.svg" alt="GHCR"></a>
  <a href="https://github.com/niflaot/bomify/tags"><img src="https://img.shields.io/github/v/tag/niflaot/bomify?label=release" alt="Release"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white" alt="Node >= 22"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js 16"></a>
  <a href="tsconfig.json"><img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript strict"></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma 7"></a>
  <a href="package.json"><img src="https://img.shields.io/badge/license-UNLICENSED-lightgrey" alt="License"></a>
</p>

---

Bomify centralizes the production workspace for a manufactured product: upload piece patterns (DXF), catalog reusable materials with pricing, define color/material combinations, and let the app compute optimized cutting layouts, material consumption, and real production cost/profit — then export it all as print-ready PDFs.

## Features

- **Products & pieces** — create products, upload DXF pattern pieces, and preview them directly in the browser.
- **Materials catalog** — a shared, reusable catalog of materials (name, color, roll width, price per linear meter) attachable to any product.
- **Combinations** — define named material/color combinations per product, assigning a material to each role a piece needs, plus a sale price used for profit calculations.
- **Additions** — track non-material costs (hardware, labor, miscellaneous), grouped by category, each with a quantity and unit price.
- **Production cut optimization** — automatic bin-packing of pieces onto material sheets, with efficiency, used area, and waste reporting per material.
- **Consumption** — see exact material length, sheets required, and cost for any number of production units.
- **PDF exports**:
  - **Materials list** — purchase-rounded material quantities and cost, plus additions grouped by category.
  - **Pieces list** — grouped by material or by piece, with optional rendered piece thumbnails.
  - **Printable labels** — one sticker per piece with an adjustable gap, ready to print and cut.
  - **Ficha técnica (technical sheet)** — exact (non-rounded) per-unit material cost, additions, sale price, and profit for the active combination.
- **Internationalization** — full English and Spanish UI via `next-intl`.
- **S3-compatible storage** — product photos and DXF files are stored in any S3-compatible bucket (AWS S3, MinIO, etc.).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, standalone output)
- [TypeScript](https://www.typescriptlang.org) in strict mode
- [Prisma 7](https://www.prisma.io) with the `pg` driver adapter (PostgreSQL)
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- [next-intl](https://next-intl.dev) for i18n (English/Spanish)
- [jsPDF](https://github.com/parallax/jsPDF) and [pdfjs-dist](https://mozilla.github.io/pdf.js/) for PDF generation and in-browser preview
- [@aws-sdk/client-s3](https://github.com/aws/aws-sdk-js-v3) for object storage
- [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com) for testing

## Getting started

### Prerequisites

- Node.js >= 22
- A PostgreSQL database
- An S3-compatible object store (e.g. [MinIO](https://min.io) for local development)

### Setup

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and S3_* values
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SHEET_MARGIN_MM` | Laser-cut safety margin (mm) added around each material sheet |
| `S3_ENDPOINT` | S3-compatible endpoint URL |
| `S3_REGION` | Bucket region |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Storage credentials |
| `S3_BUCKET` | Bucket name |
| `S3_PUBLIC_BASE_URL` | Public base URL used to build asset links |
| `S3_FORCE_PATH_STYLE` | Set to `true` for path-style access (required by most self-hosted S3 servers) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production (standalone output) |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |
| `npm run typecheck` | Run the TypeScript compiler in check-only mode |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Run Prisma migrations in development |

## Testing

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four are run in CI on every pull request (see [`.github/workflows/checks.yml`](.github/workflows/checks.yml)).

## Docker

A production image is published to GitHub Container Registry on every push to `main` and on every `v*` tag (see [`.github/workflows/ghcr.yml`](.github/workflows/ghcr.yml)):

```bash
docker pull ghcr.io/niflaot/bomify:latest
docker run -p 3000:3000 --env-file .env ghcr.io/niflaot/bomify:latest
```

On every container start, the entrypoint runs `prisma migrate deploy` before starting the server, so pending migrations are applied automatically — no manual step required after pulling a new image. `prisma migrate deploy` only applies pending migrations and is safe to run on every boot.

To build locally:

```bash
docker build -t bomify .
```

## Project structure

```
src/
  app/         # Next.js routes and server actions (kept thin)
  views/       # Page-level UI composition
  layout/      # Shared layout shells (header, sidebar, canvas)
  components/  # Reusable UI building blocks
  core/        # Domain services, types, and framework-agnostic utilities
prisma/        # Schema and migrations
messages/      # en/es translation files
```

## License

UNLICENSED — all rights reserved.
