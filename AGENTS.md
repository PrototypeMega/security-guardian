# AI Dev Team in GitLab

## Project Purpose

This project demonstrates a multi-agent software delivery team on the GitLab Duo Agent Platform. We use AI agents to automate onboarding, feature planning, testing, and security workflows.

## Primary Agents

- **Onboarding Copilot**: Helps new contributors ramp up quickly with repo context, checklists, and starter tasks.
- **Feature Planner**: Converts feature requests into executable implementation plans.
- **Test Generator**: Identifies missing tests and recommends test strategies.
- **Security Patch Agent**: Reviews security findings and proposes low-risk fixes.

## Repository Conventions

- Keep changes small and reviewable
- Prefer practical hackathon scope over production complexity
- Follow existing folder and test patterns
- Explain uncertainty instead of inventing details

## Expected Workflow

1. New contributor receives onboarding guidance (Onboarding Copilot)
2. Feature issue is converted into an implementation plan (Feature Planner)
3. Merge request gets test and security review (Test Generator + Security Patch Agent)
4. Recommendations are posted directly in GitLab context

## Output Preferences

- Use bullets and short sections
- Be specific to this repository
- Prefer actionable next steps
- When uncertain, explain what's unknown and provide the safest next step
