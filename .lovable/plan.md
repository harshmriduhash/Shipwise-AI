# SHIPWISE.ai Live GitHub & Production Readiness Plan

## Goal
Replace demo repository and PR data with a secure, authenticated GitHub-to-analysis workflow, then establish honest, repeatable quality and release checks. Keep the existing React + Vite and Lovable Cloud foundation.

## Phases

1. **Readiness baseline and truthful documentation**
   - Record the current application behavior and existing verification gaps.
   - Remove unsupported readiness, compliance, savings, and production claims from the README; distinguish implemented, configurable, and unverified items.
   - Define checks that CI can actually enforce.

2. **Per-user GitHub connection and repository sync**
   - Use the GitHub App User Connector so each signed-in user grants access to their own GitHub account.
   - Store the provider connection handle encrypted on the server; never expose tokens to the browser.
   - Replace repository URL-only storage with verified GitHub repositories and live open pull requests.

3. **Verified webhook ingestion and real PR analysis**
   - Add signed, validated, idempotent GitHub webhook handling for PR open/update events.
   - Persist real PR metadata and analysis, fetch changed files/diffs server-side, and wire the dashboard and PR detail screen to those records.
   - Surface missing permissions, stale authorization, and provider failures without falling back to mock PRs.

4. **CI quality gates and staging/release workflow**
   - Replace the permissive CI workflow with required lint/type, focused tests, production build, browser-flow, accessibility, and Lighthouse gates.
   - Add a staging/release workflow that is safe by default and document the required repository/environment configuration; do not claim deployment until a target and credentials are available.
   - Add a bounded, manually triggered 100-user load-test workflow that requires an explicitly configured target.

5. **End-to-end verification and final README**
   - Run available tests, inspect CI and Lighthouse results, and exercise the authenticated GitHub-to-PR path wherever provider setup allows.
   - Fix failures that can be verified in this environment; report any external setup blockers explicitly.
   - Rewrite the README as an accurate operating guide with architecture, user journey, setup, CI/CD, security, known limits, and checklists.

## External setup and verification limits
- GitHub OAuth requires an available workspace GitHub App User Connector client and user consent; repository webhook permissions may also need to be granted.
- GitHub must be configured to deliver webhooks to the deployed function; the shared signing secret must be entered through the secure secret form after the endpoint exists.
- Staging deployment and production load testing require a real deployment target and repository secrets/variables. Without them, workflows can be prepared but those external outcomes cannot be reported as passed.
