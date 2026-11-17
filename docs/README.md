# MusicFlow / MusicApp documentation

Detailed source-based documentation of the PlayerMussic workspace, reviewed on **2026-11-17**. This is a baseline for understanding and changing the existing application. Names are preserved exactly: `frontend_MussicApp` and `backend_MusicApp`.

The frontend was subsequently redesigned in this session. [Frontend redesign](14-frontend-redesign.md) documents the current visual system and playback contracts, superseding pre-redesign frontend behavior notes below. Backend and database descriptions remain applicable.

## Start here

| Document | What it answers |
| --- | --- |
| [Frontend redesign](14-frontend-redesign.md) | Current design system, player/queue changes, browser verification and previews |
| [Project overview](01-project-overview.md) | What exists, technology stack, workspace structure, and feature status |
| [Architecture and data flows](02-architecture.md) | How the browser, API, database, Redis, SMTP, and S3 interact |
| [Setup and configuration](03-setup-and-configuration.md) | How to run locally, environment variables, profiles, and ports |
| [Frontend guide](04-frontend.md) | Routes, component ownership, state, API utilities, styling, and UI limitations |
| [Backend guide](05-backend.md) | Packages, services, repositories, mapping, authorization, and errors |
| [Database reference](06-database.md) | All entities, relationships, constraints, query behavior, and schema changes |
| [API reference](07-api-reference.md) | Every controller endpoint, access rules, pagination, payloads, and response types |
| [Feature behavior](08-feature-behavior.md) | User workflows, business rules, side effects, and edge cases |
| [Security and known gaps](09-security-and-known-gaps.md) | Current implementation discrepancies and their change impact |
| [Deployment and operations](10-deployment-and-operations.md) | Docker, reverse proxies, CI/CD configuration, backups, and troubleshooting |
| [Testing and future changes](11-testing-and-change-guide.md) | Verification commands, regression checklist, and feature-to-file change map |
| [Source inventory](12-source-inventory.md) | Linked source files and their roles |
| [DTO field reference](13-dto-reference.md) | Request validation and response fields extracted from Java DTOs |

## Reading paths

- To change a feature: read feature behavior, the change map, its API contract, and known gaps; follow source links before editing.
- To run the application: read setup and configuration, then deployment troubleshooting.
- To change database fields: read database reference, DTO field reference, backend mapping, and affected frontend consumers.
- To review access control: read backend security, API access classifications, and security gaps together.

## Scope and evidence

These documents describe the working tree, including local modifications present during review. The frontend and backend each contain a separate `.git` directory; the workspace root has no `.git` directory. The original workspace docs were outside both repositories; this published copy now lives in the frontend repository. Backend source links are pinned to its companion commit.

The review inspected source, configuration, SQL structure, build definitions, routes, and controller mappings. It did not connect to production, inspect private `.env` values, execute database imports, send email, upload objects, or validate live deployment health. Runtime claims are marked as verification tasks when not established by source. Declared dependency versions come from the local manifests, not from an internet check.

Existing documents are background references rather than authoritative contracts: [USECASES.md](legacy-usecases.md), [frontend README](../README.md), [like notes](../LIKE_FEATURE.md), [history notes](../HISTORY_FEATURE.md), [UI components guide](../UI_COMPONENTS_GUIDE.md), and [backend Docker notes](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/DOCKER.md). Where those differ from executable code, these documents describe the executable code.

## Keeping documentation useful

Update the relevant feature, API, DTO, database, and known-gap sections in the same change as the implementation. Record whether a statement describes current behavior, a source-level concern, or a proposed improvement. Do not describe an unrouted page or an unused DTO as an available user feature. Keep credentials, real tokens, private email addresses, and database dump rows out of examples.
