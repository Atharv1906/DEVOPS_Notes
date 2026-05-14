import { Track } from "./types";

export const devsecopsTrack: Track = {
  id: "devsecops",
  title: "DevSecOps",
  description:
    "Integrate security into every stage of the DevOps lifecycle. Covers secure coding, versioning strategies, secret management, SAST/DAST, container hardening, cloud security, and compliance automation.",
  icon: "ShieldCheck",
  color: "#dc2626",
  gradient: "track-devsecops-gradient",
  level: "intermediate",
  estimatedHours: 28,
  modules: [
    // ─────────────────────────────────────────
    // MODULE 1 — Foundations
    // ─────────────────────────────────────────
    {
      id: "devsecops-foundations",
      title: "DevSecOps Foundations",
      description: "Understand the philosophy, culture, and tooling that make security a first-class DevOps citizen.",
      level: "beginner",
      lessons: [
        {
          id: "what-is-devsecops",
          title: "What is DevSecOps?",
          description: "The shift-left movement, threat modelling basics, and the shared responsibility model.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Explain the shift-left security philosophy",
            "Distinguish DevSecOps from traditional security gate-keeping",
            "Describe the shared responsibility model in cloud environments",
            "Identify the OWASP Top 10 and how DevSecOps addresses them",
          ],
          content: `## What is DevSecOps?

DevSecOps extends DevOps by weaving security into *every* phase of the software delivery lifecycle — from the first commit to production monitoring — rather than bolting it on at the end.

> **"Shift left"** means catching vulnerabilities early (left on the timeline), when they cost 100× less to fix.

---

## The Cost of Late Security Fixes

| Phase discovered | Relative cost to fix |
|---|---|
| Design / code review | 1× |
| CI pipeline (SAST) | 5× |
| QA / staging | 10× |
| Production | 100× |
| Public breach | 1000× |

---

## DevOps vs DevSecOps

\`\`\`
DevOps:    Plan → Code → Build → Test → Release → Deploy → Monitor
DevSecOps: Plan → Code → Build → Test → Release → Deploy → Monitor
           ↑Threat ↑SAST  ↑SCA   ↑DAST  ↑Sign     ↑Harden  ↑SIEM
           model   secrets deps   fuzz   images    runtime  alerts
\`\`\`

---

## The Shared Responsibility Model

In cloud environments security is split between the provider and the customer:

| Provider owns | Customer owns |
|---|---|
| Physical hardware | IAM & access control |
| Hypervisor | OS patching (EC2) |
| Managed service infrastructure | Application code |
| Network backbone | Data encryption in transit/at rest |
| Compliance certifications | Compliance configuration |

---

## OWASP Top 10 (2021)

1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, NoSQL, LDAP, OS)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable & Outdated Components
7. Identification & Authentication Failures
8. Software & Data Integrity Failures (supply chain)
9. Security Logging & Monitoring Failures
10. Server-Side Request Forgery (SSRF)

DevSecOps tools address every one of these through automation.

---

## Key Cultural Shifts

- **Security champions** — embed one security-minded engineer per team
- **Blameless post-mortems** — treat vulnerabilities as system failures, not individual mistakes
- **Security as code** — policy and compliance rules live in version-controlled files
- **Automated gates** — pipelines fail on critical findings; humans review, not approve everything

---

## Quick Wins to Start

\`\`\`bash
# 1. Enable branch protection on main
# (GitHub UI: Settings → Branches → Add rule)

# 2. Require signed commits
git config --global commit.gpgSign true

# 3. Add a .gitignore for secrets
echo ".env*" >> .gitignore
echo "*.pem"  >> .gitignore
echo "*.key"  >> .gitignore
\`\`\`

> **Tip:** The single highest-leverage first step is preventing secrets from ever entering version control. Everything else builds on that foundation.`,
          interviewQuestions: [
            {
              question: "What is DevSecOps and how does it differ from 'security as a separate team' model?",
              difficulty: "junior" as const,
              answer: `**Traditional security model:** Security team reviews code and infrastructure at the END of the SDLC (shift-right). Developers throw code over the wall, security says "that's insecure, fix it," then back to the developer queue. Result: security is a bottleneck, findings are late and expensive to fix.

**DevSecOps:** Security is integrated throughout the SDLC — shift-left means finding vulnerabilities earlier (when they're cheaper to fix) and making security automated (not manual):

\`\`\`
DevSecOps Pipeline:
[Code Commit] → [SAST scan] → [SCA/dependency check] → [IaC scan] →
[Container scan] → [DAST] → [Runtime monitoring]
       ↑                                                       ↑
   seconds after commit                           continuous in production
\`\`\`

**Key principles:**
1. **Everything as code**: Security policies, compliance checks, vulnerability thresholds are code, version-controlled, and tested
2. **Automated gates**: Security checks run automatically in CI/CD — developers get fast feedback without waiting for a security review cycle
3. **Shared responsibility**: Developers own security in their domain, not a separate team
4. **Metrics and SLOs**: Track MTTR for vulnerabilities like any other incident

**Practical shift:** Instead of "security team reviews before release," the pipeline runs automatically: Semgrep/CodeQL for SAST, Trivy for containers, Checkov for IaC, and only pages the security team for high-confidence critical findings. 95% of findings are handled without human review.`,
            },
            {
              question: "A developer accidentally commits an AWS access key to a public GitHub repository. What's your incident response?",
              difficulty: "mid" as const,
              answer: `**Assume compromised immediately** — GitHub indexes public repos within minutes, and bots scan for credentials continuously.

**Step 1 — Revoke the credential (< 2 minutes):**
\`\`\`bash
# Identify the key:
git log --all -p | grep -E "AKIA[0-9A-Z]{16}"

# Revoke in AWS Console or CLI:
aws iam delete-access-key \\
  --access-key-id AKIAIOSFODNN7EXAMPLE \\
  --user-name <username>
# If you don't know which user: aws iam get-access-key-last-used --access-key-id AKIA...
\`\`\`

**Step 2 — Assess blast radius:**
\`\`\`bash
# What did this key have access to?
aws iam list-user-policies --user-name <user>
aws iam list-attached-user-policies --user-name <user>

# Was it used after the commit? Check CloudTrail:
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAIOSFODNN7EXAMPLE \\
  --start-time <commit-time>
\`\`\`

**Step 3 — Remove from git history:**
\`\`\`bash
# git filter-repo (preferred):
pip install git-filter-repo
git filter-repo --path-glob "*.env" --invert-paths

# After rewriting history, force push ALL branches:
git push origin --force --all
# Note: GitHub needs the branch to be unprotected
\`\`\`

**Step 4 — Notify and document:**
- Notify security team
- Create incident timeline
- If key had access to PII/sensitive data → assess breach notification requirements

**Prevention:**
\`\`\`bash
# Pre-commit hook using detect-secrets or gitleaks:
pip install detect-secrets
detect-secrets scan > .secrets.baseline  # committed to repo
# Add pre-commit hook to run detect-secrets scan on each commit

# GitHub secret scanning (enables automatic detection + revocation for some providers):
# Settings → Security → Code Security → Secret scanning
\`\`\``,
            },
          ],
        },
        {
          id: "threat-modeling",
          title: "Threat Modeling with STRIDE",
          description: "Systematically identify threats before writing a single line of code.",
          type: "lesson",
          duration: 12,
          objectives: [
            "Apply the STRIDE framework to a sample application",
            "Create a Data Flow Diagram (DFD)",
            "Prioritise threats with DREAD scoring",
            "Document mitigations in a threat register",
          ],
          content: `## Threat Modeling with STRIDE

Threat modeling is a structured process for identifying security weaknesses in a system's design — before code is written.

---

## STRIDE Categories

| Category | What an attacker can do | Example |
|---|---|---|
| **S**poofing | Pretend to be someone else | Stolen JWT token |
| **T**ampering | Modify data in transit/rest | Man-in-the-middle, SQL injection |
| **R**epudiation | Deny performing an action | No audit logs → can't prove who did what |
| **I**nformation Disclosure | Read data they shouldn't | Verbose error messages exposing stack traces |
| **D**enial of Service | Make a service unavailable | Rate-limit bypass, resource exhaustion |
| **E**levation of Privilege | Gain more access than granted | IDOR, privilege escalation via sudo misconfiguration |

---

## Data Flow Diagram (DFD)

Draw the system at Level 0 (context) then Level 1 (components):

\`\`\`
[User Browser] ──HTTPS──> [Load Balancer] ──HTTP──> [App Server]
                                                          │
                                               [DB (PostgreSQL)]
                                                          │
                                               [Object Store (S3)]
\`\`\`

For each arrow and component ask: *which STRIDE threats apply?*

---

## DREAD Risk Scoring

Score each threat 1–10 per dimension:

| Dimension | Question |
|---|---|
| **D**amage | How bad if exploited? |
| **R**eproducibility | How easily repeatable? |
| **E**xploitability | How much skill required? |
| **A**ffected users | How many impacted? |
| **D**iscoverability | How easy to find? |

\`\`\`
Risk Score = (D + R + E + A + D) / 5
High: 7-10 | Medium: 4-6 | Low: 1-3
\`\`\`

---

## Threat Register Template

\`\`\`markdown
| ID | Component | STRIDE | Description | DREAD | Mitigation | Owner | Status |
|----|-----------|--------|-------------|-------|------------|-------|--------|
| T1 | Auth API  | S      | JWT not validated on every request | 8 | Add middleware | @alice | Open |
| T2 | DB        | T      | No parameterised queries | 9 | Use ORM / prepared statements | @bob | Closed |
\`\`\`

---

## Integrating Threat Modeling into Agile

- **Sprint 0:** Threat model for the overall architecture
- **Story kick-off:** Ask "what can go wrong?" for each new feature
- **Definition of Done:** Include "no new HIGH threats unmitigated"
- **Quarterly review:** Update DFD as architecture evolves

> **Tip:** Use Microsoft Threat Modeling Tool (free) or OWASP Threat Dragon (open-source, web-based) to draw DFDs and auto-suggest STRIDE threats.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 2 — Version Control Security
    // ─────────────────────────────────────────
    {
      id: "version-control-security",
      title: "Secure Version Control & Branching",
      description: "Git security best practices, branching strategies, and preventing secrets in source code.",
      level: "beginner",
      lessons: [
        {
          id: "git-security-practices",
          title: "Git Security Best Practices",
          description: "Signed commits, branch protection, and auditing your repository history.",
          type: "lesson",
          duration: 15,
          objectives: [
            "Configure GPG commit signing",
            "Enforce branch protection rules",
            "Audit git history for accidentally committed secrets",
            "Use git hooks for pre-commit security checks",
          ],
          content: `## Git Security Best Practices

Git is the foundation of your supply chain. A misconfigured repository can expose secrets, allow unauthorized force-pushes, or permit unsigned code to reach production.

---

## Commit Signing with GPG

Signing proves a commit came from you, not an impersonator.

\`\`\`bash
# Generate a GPG key
gpg --full-generate-key
# Choose RSA 4096, no expiry (or 2y for better hygiene)

# List your keys
gpg --list-secret-keys --keyid-format=long

# Export public key → paste into GitHub Settings → GPG Keys
gpg --armor --export YOUR_KEY_ID

# Tell git to use your key
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgSign true

# Verify a signed commit
git log --show-signature -1
\`\`\`

---

## Branch Protection Rules (GitHub)

Navigate to **Settings → Branches → Add rule** and enable:

| Rule | Why |
|---|---|
| Require pull request reviews (≥1) | Peer review catches issues |
| Require status checks to pass | CI must be green |
| Require signed commits | Prevent spoofed authorship |
| Restrict force pushes | Protect history |
| Require linear history | Easier audit trail |
| Require conversation resolution | No dismissed review comments |

\`\`\`bash
# Equivalent via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field enforce_admins=true \
  --field required_status_checks='{"strict":true,"contexts":["ci/tests"]}'
\`\`\`

---

## Detecting Secrets in History

Even after deleting a file, secrets persist in git history.

\`\`\`bash
# Install git-secrets (AWS patterns)
brew install git-secrets
git secrets --install
git secrets --register-aws

# Or use truffleHog to scan full history
pip install trufflehog
trufflehog git file://. --since-commit HEAD~50

# Or use gitleaks (fast Go binary)
brew install gitleaks
gitleaks detect --source . -v
\`\`\`

If a secret is found in history, you must:
1. Revoke the secret immediately (rotate credentials)
2. Rewrite history with \`git filter-repo\` (not filter-branch)
3. Force-push (coordinate with team — everyone must re-clone)

\`\`\`bash
# Remove a file from all history (after installing git-filter-repo)
git filter-repo --path secrets.env --invert-paths
git push origin --force --all
\`\`\`

---

## Pre-commit Hooks

Hooks run locally before a commit is created.

\`\`\`bash
# Install pre-commit framework
pip install pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files  # prevents accidental binary commits
      - id: trailing-whitespace
\`\`\`

\`\`\`bash
pre-commit install     # installs hook into .git/hooks/pre-commit
pre-commit run --all-files  # run manually on existing code
\`\`\`

> **Tip:** Pre-commit hooks run client-side. They can be bypassed with \`git commit --no-verify\`. Always add server-side secret scanning (GitHub Advanced Security, GitLab Secret Detection) as the authoritative gate.`,
        },
        {
          id: "branching-strategies",
          title: "Branching Strategies for Security",
          description: "GitFlow, trunk-based development, release branching, and security patch workflows.",
          type: "lesson",
          duration: 13,
          objectives: [
            "Compare GitFlow vs trunk-based development from a security perspective",
            "Implement a hotfix/security patch workflow",
            "Use feature flags to decouple deployment from release",
            "Apply semantic versioning to security releases",
          ],
          content: `## Branching Strategies for Security

Your branching model determines how quickly you can ship a security patch. A model optimised for slow, scheduled releases is dangerous in an incident.

---

## GitFlow

\`\`\`
main ──────────────────────────────────────── (always shippable)
  \\
   develop ──────────────────────────────────
     \\            \\
      feature/x    feature/y
              \\
               release/1.2 ── hotfix/1.2.1
\`\`\`

**Security pros:** Dedicated release branch allows security hardening before shipping.
**Security cons:** Long-lived branches diverge heavily — merge conflicts can mask vulnerability fixes.

---

## Trunk-Based Development (TBD)

\`\`\`
main ──●──●──●──●──●──●──●──●──  (deployable at every commit)
        \\              \\
         short-lived    short-lived
         feature (<2d)  feature (<2d)
\`\`\`

**Security pros:** No long-lived branches → no drift → security patches reach prod in hours.
**Security cons:** Requires robust feature flags to hide incomplete features.

---

## Security Patch / Hotfix Workflow

\`\`\`bash
# 1. Branch from the production tag
git checkout -b hotfix/CVE-2024-1234 v2.3.1

# 2. Apply minimal fix (no unrelated changes)
# Fix the vulnerability...
git commit -S -m "fix: patch SSRF in webhook handler (CVE-2024-1234)"

# 3. Open PR → expedited review (2 approvers minimum)
gh pr create --title "Security: CVE-2024-1234" --label "security,hotfix"

# 4. After merge, tag immediately
git tag -s v2.3.2 -m "Security release: CVE-2024-1234"
git push origin v2.3.2

# 5. Also merge fix forward to main / develop
git checkout main && git cherry-pick <sha>
\`\`\`

---

## Semantic Versioning for Security

\`\`\`
MAJOR.MINOR.PATCH
  │      │     └─ Backwards-compatible bug/security fix → bump PATCH
  │      └─────── New feature, backwards-compatible → bump MINOR
  └────────────── Breaking change → bump MAJOR
\`\`\`

Security-only releases always bump PATCH (or MINOR if the fix requires an API change).

Use **CHANGELOG.md** to communicate CVE details:

\`\`\`markdown
## [2.3.2] - 2024-03-15
### Security
- Fix SSRF vulnerability in webhook handler (CVE-2024-1234, CVSS 8.1)
  Users on 2.x should upgrade immediately.
\`\`\`

---

## Feature Flags for Safe Deployments

Decouple *deployment* (code in prod) from *release* (users can use it):

\`\`\`typescript
// Simple environment-variable flag
const NEW_AUTH_FLOW = process.env.ENABLE_NEW_AUTH === "true";

if (NEW_AUTH_FLOW) {
  return newAuthHandler(req, res);
} else {
  return legacyAuthHandler(req, res);
}
\`\`\`

Benefits for security:
- Ship unfinished security-sensitive features to prod but disabled
- Enable only for internal users first (canary)
- Kill-switch: disable without a deploy if a vulnerability is found

> **Tip:** Use a dedicated feature flag service (LaunchDarkly, Unleash, Flagsmith) rather than env vars for production — they support per-user targeting and instant kill-switches.`,
        },
        {
          id: "secret-management",
          title: "Secret Management",
          description: "Vault, environment variables, CI secret stores, and rotation strategies.",
          type: "lesson",
          duration: 16,
          objectives: [
            "Explain why .env files should never be committed",
            "Configure GitHub Actions secrets and environment protection",
            "Use HashiCorp Vault for dynamic secret generation",
            "Implement automatic secret rotation",
          ],
          content: `## Secret Management

Secrets are credentials, API keys, TLS certificates, and database passwords. The #1 cause of cloud breaches is exposed secrets.

---

## The Secret Anti-patterns

\`\`\`bash
# ❌ Hardcoded in source
DB_PASSWORD = "hunter2"

# ❌ In .env committed to git
echo "DB_PASSWORD=hunter2" >> .env
git add .env && git commit -m "add config"

# ❌ Printed to logs
console.log("Connecting with password:", process.env.DB_PASSWORD)

# ❌ In Docker image
ENV DB_PASSWORD=hunter2
\`\`\`

---

## GitHub Actions Secrets

\`\`\`yaml
# Settings → Secrets and variables → Actions → New secret

jobs:
  deploy:
    environment: production          # environment-level protection
    steps:
      - name: Deploy
        env:
          DB_URL: \${{ secrets.DATABASE_URL }}
          AWS_KEY: \${{ secrets.AWS_ACCESS_KEY_ID }}
        run: ./deploy.sh
\`\`\`

**Environment protection rules:**
- Require reviewers before secrets are exposed
- Limit to specific branches (e.g., only \`main\`)
- Add deployment wait timer

\`\`\`bash
# Add a secret via CLI
gh secret set DATABASE_URL --body "postgres://..." --env production
\`\`\`

---

## HashiCorp Vault

Vault is the industry standard for secrets management at scale.

\`\`\`bash
# Start dev server (local testing only)
vault server -dev

export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='root'

# Write a secret
vault kv put secret/myapp/db \
  username="app_user" \
  password="s3cr3t"

# Read it back
vault kv get secret/myapp/db
vault kv get -field=password secret/myapp/db

# Dynamic database credentials (auto-expire after TTL)
vault secrets enable database
vault write database/config/mydb \
  plugin_name=postgresql-database-plugin \
  connection_url="postgresql://{{username}}:{{password}}@localhost/mydb" \
  allowed_roles="app-role" \
  username="vault_admin" \
  password="vault_admin_pass"

vault write database/roles/app-role \
  db_name=mydb \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';" \
  default_ttl="1h" \
  max_ttl="24h"

# App reads fresh credentials each time
vault read database/creds/app-role
\`\`\`

---

## Fetching Vault Secrets in CI

\`\`\`yaml
# GitHub Actions with Vault OIDC (no static token)
- name: Import Secrets
  uses: hashicorp/vault-action@v3
  with:
    url: https://vault.example.com
    method: jwt
    role: github-actions
    secrets: |
      secret/data/myapp/db password | DB_PASSWORD ;
      secret/data/myapp/db username | DB_USERNAME
\`\`\`

---

## Rotation Strategy

| Secret type | Rotation frequency | Method |
|---|---|---|
| Database passwords | Every 30 days | Vault dynamic creds |
| API keys | Every 90 days | Automated via script |
| TLS certificates | Before expiry (Let's Encrypt auto) | cert-manager |
| SSH keys | Every 180 days | Key rotation policy |
| Root/admin credentials | Every 365 days | Manual + MFA |

\`\`\`bash
# Detect expiring AWS keys (rotate before they expire)
aws iam list-access-keys --user-name deploy-bot \
  | jq '.AccessKeyMetadata[] | {KeyId, CreateDate, Status}'

# Rotate
aws iam create-access-key --user-name deploy-bot
aws iam delete-access-key --user-name deploy-bot --access-key-id OLD_KEY_ID
\`\`\`

> **Tip:** Prefer short-lived credentials (OIDC, instance roles, Vault dynamic) over long-lived static keys. A credential that lives 1 hour is 8760× less risky than one that lives a year.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 3 — CI/CD Security
    // ─────────────────────────────────────────
    {
      id: "cicd-security",
      title: "CI/CD Pipeline Security",
      description: "SAST, SCA, DAST, container scanning, and supply chain security in automated pipelines.",
      level: "intermediate",
      lessons: [
        {
          id: "sast-and-sca",
          title: "SAST & Dependency Scanning",
          description: "Static analysis and software composition analysis to catch vulnerabilities before runtime.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Integrate Semgrep SAST into a GitHub Actions pipeline",
            "Run OWASP Dependency-Check for SCA",
            "Triage false positives and suppress findings",
            "Enforce a quality gate that blocks deployments on critical findings",
          ],
          content: `## SAST & Dependency Scanning

**SAST** (Static Application Security Testing) analyses source code without executing it.
**SCA** (Software Composition Analysis) analyses third-party libraries for known CVEs.

---

## SAST with Semgrep

Semgrep uses pattern-matching rules to find security bugs fast.

\`\`\`bash
# Install
pip install semgrep

# Run with OWASP Top 10 rules
semgrep --config=p/owasp-top-ten .

# Run with security-audit ruleset
semgrep --config=p/security-audit .

# JSON output for CI
semgrep --config=p/owasp-top-ten --json > semgrep-results.json
\`\`\`

**GitHub Actions integration:**

\`\`\`yaml
name: SAST
on: [push, pull_request]

jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: semgrep/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/secrets
            p/nodejs
        env:
          SEMGREP_APP_TOKEN: \${{ secrets.SEMGREP_APP_TOKEN }}
\`\`\`

---

## Custom Semgrep Rules

\`\`\`yaml
# .semgrep/custom.yaml
rules:
  - id: no-eval
    patterns:
      - pattern: eval(...)
    message: "eval() is dangerous — use JSON.parse() or a safe alternative"
    severity: ERROR
    languages: [javascript, typescript]

  - id: no-md5-passwords
    patterns:
      - pattern: crypto.createHash("md5").update($PASSWORD).digest(...)
    message: "MD5 is broken for passwords — use bcrypt or argon2"
    severity: ERROR
    languages: [javascript, typescript]
\`\`\`

---

## SCA with npm audit & OWASP Dependency-Check

\`\`\`bash
# Built-in npm audit
npm audit
npm audit --audit-level=high   # exit code 1 if HIGH+ found
npm audit fix                   # auto-fix where possible

# OWASP Dependency-Check (multi-language)
docker run --rm \
  -v \$(pwd):/src \
  owasp/dependency-check \
  --project "myapp" \
  --scan /src \
  --format HTML \
  --out /src/reports
\`\`\`

\`\`\`yaml
# GitHub Actions — combined SAST + SCA
- name: Dependency Audit
  run: npm audit --audit-level=critical

- name: License Check
  run: npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause"
\`\`\`

---

## Managing False Positives

\`\`\`bash
# Suppress a specific Semgrep finding inline
result = eval(user_input)  # nosemgrep: no-eval (reason: sandboxed VM context)

# Suppress in config
rules:
  - id: no-eval
    ...
    paths:
      exclude:
        - tests/
        - "*.test.ts"
\`\`\`

\`\`\`bash
# npm — accept a known non-exploitable advisory
npm audit --audit-level=high  # review the advisory ID
npm audit fix --force         # only if you understand the change
\`\`\`

---

## Quality Gate Pattern

\`\`\`yaml
jobs:
  security-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: SAST
        run: semgrep --config=p/owasp-top-ten --error .
        # --error exits with code 1 on any finding

      - name: Dependency Audit
        run: npm audit --audit-level=high

      - name: Check Gate
        if: failure()
        run: |
          echo "Security gate FAILED. Review findings before merging."
          exit 1
\`\`\`

> **Tip:** Start with \`--audit-level=critical\` in CI (so only critical findings block) and progressively tighten to \`high\` as your backlog reduces. Never start at \`low\` — alert fatigue kills adoption.`,
          interviewQuestions: [
            {
              question: "Explain the difference between SAST, DAST, and SCA. When does each run in a CI/CD pipeline?",
              difficulty: "junior" as const,
              answer: `**SAST (Static Application Security Testing):**
- Analyzes source code without running it
- Finds: SQL injection patterns, XSS, hardcoded secrets, insecure crypto
- Runs at: PR time, pre-merge (fast, seconds to minutes)
- Tools: Semgrep, CodeQL, SonarQube, Checkmarx

**SCA (Software Composition Analysis):**
- Scans third-party dependencies/libraries for known CVEs
- Finds: vulnerable package versions (e.g., Log4j CVE-2021-44228)
- Runs at: PR time, daily scheduled scans (CVEs are discovered continuously)
- Tools: Dependabot, Snyk, npm audit, Trivy (for containers)

**DAST (Dynamic Application Security Testing):**
- Tests the running application by sending malicious inputs
- Finds: runtime vulnerabilities, auth bypasses, actual exploitable paths
- Runs at: staging environment, post-deploy (needs a running app)
- Tools: OWASP ZAP, Burp Suite, Nuclei

**Pipeline placement:**
\`\`\`
[Commit] → SAST + SCA ← (fast gates, block on critical)
[PR Merge] → Build image → Container scan (Trivy)
[Deploy to Staging] → DAST scan (ZAP)
[Production] → Runtime protection (WAF, RASP)
\`\`\`

**Why the order matters:** SAST at commit is cheapest (catches issues before the code even runs). DAST at staging is most accurate but slowest (requires a deployed environment). Running DAST against production is possible but risky — use a separate production-like environment.`,
            },
            {
              question: "You've integrated SAST into CI/CD and it reports 300 findings. How do you triage and prioritize without blocking all development?",
              difficulty: "mid" as const,
              answer: `**Immediate triage strategy:**

**1. Start permissive, tighten over time:**
\`\`\`yaml
# Week 1: Only block on CRITICAL, report others
- name: Semgrep
  run: semgrep --config auto --severity=ERROR --error
  # ERROR = CRITICAL findings → fail build
  # WARN/INFO → report but don't fail
\`\`\`

**2. Establish a baseline:**
\`\`\`bash
# Scan current codebase, mark ALL current findings as accepted (technical debt)
semgrep --config auto --json > baseline.json
# Commit baseline.json — only NEW findings since baseline fail the build
# This prevents existing tech debt from blocking new work
\`\`\`

**3. Triage the 300 findings:**
- **True positives critical**: Fix immediately, block
- **True positives non-critical**: Add to sprint backlog, track as tech debt
- **False positives**: Suppress with inline comments or rule exceptions:
\`\`\`python
# nosec: B105 — this is not a password, it's a config key name
CONFIG_KEY = "password_field"  # noqa: S105
\`\`\`

**4. Prioritize by:**
- Severity (CRITICAL > HIGH > MEDIUM > LOW)
- Reachability (is the vulnerable code actually called in a user-facing path?)
- CVSS score + exploitability (is there a working exploit in the wild?)

**5. Track metrics:**
- New vulnerabilities introduced per week (should trend toward 0)
- MTTR (mean time to remediate) by severity
- False positive rate (high FP rate = tune rules or switch tools)

**Anti-pattern:** Blocking ALL 300 on day 1 → developers disable the tool or bypass it.`,
            },
          ],
        },
        {
          id: "dast-and-container-scanning",
          title: "DAST & Container Image Scanning",
          description: "Dynamic analysis against running apps and scanning container images for CVEs.",
          type: "lesson",
          duration: 16,
          objectives: [
            "Run OWASP ZAP against a staging environment",
            "Scan Docker images with Trivy",
            "Implement a distroless base image strategy",
            "Sign container images with Cosign",
          ],
          content: `## DAST & Container Image Scanning

**DAST** (Dynamic Application Security Testing) attacks a running application the way a real attacker would.
Container scanning looks for OS-level and application CVEs inside Docker image layers.

---

## DAST with OWASP ZAP

\`\`\`bash
# Quick baseline scan (passive — no active attacks)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging.myapp.com \
  -r zap-report.html

# Full active scan (attacks the app — only against staging/test!)
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://staging.myapp.com \
  -r zap-full-report.html
\`\`\`

\`\`\`yaml
# GitHub Actions — DAST in CI
jobs:
  dast:
    runs-on: ubuntu-latest
    services:
      app:
        image: myapp:latest
        ports: ["3000:3000"]
    steps:
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.11.0
        with:
          target: "http://localhost:3000"
          fail_action: true
          allow_issue_writing: false
\`\`\`

---

## Container Scanning with Trivy

Trivy scans OS packages, language dependencies, and misconfigurations.

\`\`\`bash
# Install
brew install trivy

# Scan a local image
trivy image myapp:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL myapp:latest

# Exit code 1 on critical (for CI gate)
trivy image --exit-code 1 --severity CRITICAL myapp:latest

# Scan a Dockerfile for misconfigs
trivy config Dockerfile

# Scan filesystem (before building image)
trivy fs .
\`\`\`

\`\`\`yaml
# GitHub Actions
- name: Trivy Image Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:latest
    format: sarif
    output: trivy-results.sarif
    severity: CRITICAL,HIGH
    exit-code: "1"

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: trivy-results.sarif
\`\`\`

---

## Distroless Base Images

Distroless images contain only your app and its runtime — no shell, no package manager.

\`\`\`dockerfile
# Before: full Debian — 900MB, hundreds of packages
FROM node:20

# After: distroless — ~180MB, minimal attack surface
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/index.js"]
\`\`\`

---

## Image Signing with Cosign

Signing proves an image wasn't tampered with between build and deployment.

\`\`\`bash
# Install cosign
brew install cosign

# Generate a key pair (or use keyless with OIDC)
cosign generate-key-pair

# Sign after push
docker push myregistry/myapp:v1.0.0
cosign sign --key cosign.key myregistry/myapp:v1.0.0

# Verify before deployment
cosign verify --key cosign.pub myregistry/myapp:v1.0.0

# Keyless signing (no key management — uses OIDC identity)
cosign sign myregistry/myapp:v1.0.0
# Prompts for OIDC login; signature stored in Rekor transparency log
\`\`\`

> **Tip:** Pair Cosign with a Kubernetes admission controller (Kyverno or OPA/Gatekeeper) that rejects unsigned images. This prevents pulling an attacker-modified image even if they compromised your registry.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 4 — Cloud & IaC Security
    // ─────────────────────────────────────────
    {
      id: "cloud-iac-security",
      title: "Cloud & IaC Security",
      description: "Scanning Terraform/CloudFormation for misconfigs, IAM least privilege, and policy-as-code.",
      level: "intermediate",
      lessons: [
        {
          id: "iac-scanning",
          title: "IaC Security Scanning",
          description: "tfsec, Checkov, and OPA policies to catch cloud misconfigurations before apply.",
          type: "lesson",
          duration: 17,
          objectives: [
            "Run tfsec and Checkov on Terraform code",
            "Write a custom OPA policy for Terraform",
            "Scan CloudFormation templates with cfn-nag",
            "Integrate IaC scanning into GitHub Actions",
          ],
          content: `## IaC Security Scanning

Infrastructure-as-Code misconfigurations are the #1 source of cloud data breaches. Scan before \`terraform apply\`.

---

## tfsec

tfsec is a fast, purpose-built Terraform security scanner.

\`\`\`bash
brew install tfsec

# Scan current directory
tfsec .

# Soft fail (exit 0, show findings) — for initial adoption
tfsec . --soft-fail

# JSON output
tfsec . --format json > tfsec-results.json

# Ignore a specific rule inline
resource "aws_s3_bucket" "logs" {
  bucket = "my-logs"
  # tfsec:ignore:aws-s3-enable-bucket-logging
}
\`\`\`

**Common findings:**
- S3 bucket public access not blocked
- Security group allows 0.0.0.0/0 ingress on port 22
- RDS instance not encrypted
- CloudTrail logging disabled

---

## Checkov

Checkov covers Terraform, CloudFormation, Kubernetes, and Dockerfiles.

\`\`\`bash
pip install checkov

# Scan Terraform
checkov -d . --framework terraform

# Scan CloudFormation
checkov -f template.yaml --framework cloudformation

# Scan Dockerfile
checkov -f Dockerfile

# Scan with specific check IDs
checkov -d . --check CKV_AWS_18,CKV_AWS_21

# Skip a check globally
checkov -d . --skip-check CKV_AWS_144
\`\`\`

---

## Policy-as-Code with OPA / Conftest

OPA (Open Policy Agent) lets you write custom policies in Rego.

\`\`\`rego
# policies/s3.rego
package main

deny[msg] {
  resource := input.resource.aws_s3_bucket[_]
  not resource.config.server_side_encryption_configuration
  msg := sprintf("S3 bucket '%v' must have server-side encryption enabled", [resource.config.bucket])
}

deny[msg] {
  resource := input.resource.aws_s3_bucket[_]
  not resource.config.versioning[_].enabled
  msg := sprintf("S3 bucket '%v' must have versioning enabled", [resource.config.bucket])
}
\`\`\`

\`\`\`bash
# Install conftest
brew install conftest

# Test Terraform plan against policies
terraform plan -out=tfplan.binary
terraform show -json tfplan.binary > tfplan.json
conftest test tfplan.json --policy policies/
\`\`\`

---

## GitHub Actions Integration

\`\`\`yaml
name: IaC Security

on:
  pull_request:
    paths: ["infra/**", "terraform/**"]

jobs:
  iac-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: tfsec
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          working_directory: infra/

      - name: Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: infra/
          framework: terraform
          soft_fail: false
          output_format: sarif
          output_file_path: checkov-results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: checkov-results.sarif
\`\`\`

---

## IAM Least Privilege

\`\`\`hcl
# ❌ Too permissive
resource "aws_iam_role_policy" "bad" {
  policy = jsonencode({
    Statement = [{
      Effect   = "Allow"
      Action   = "*"
      Resource = "*"
    }]
  })
}

# ✅ Least privilege
resource "aws_iam_role_policy" "good" {
  policy = jsonencode({
    Statement = [{
      Effect   = "Allow"
      Action   = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ]
      Resource = "arn:aws:s3:::my-app-bucket/*"
    }]
  })
}
\`\`\`

\`\`\`bash
# Analyse existing IAM permissions with IAM Access Analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name my-analyzer \
  --type ACCOUNT

aws accessanalyzer list-findings --analyzer-name my-analyzer
\`\`\`

> **Tip:** Use \`IAM Access Advisor\` (AWS Console → IAM → User → Access Advisor) to see which services a role actually used in the last 90 days. Remove permissions for services never accessed.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 5 — Runtime Security & Monitoring
    // ─────────────────────────────────────────
    {
      id: "runtime-security",
      title: "Runtime Security & Monitoring",
      description: "Falco runtime threat detection, SIEM integration, and incident response playbooks.",
      level: "advanced",
      lessons: [
        {
          id: "runtime-threat-detection",
          title: "Runtime Threat Detection with Falco",
          description: "Detect container escapes, privilege escalation, and anomalous behaviour at runtime.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Install and configure Falco on a Kubernetes cluster",
            "Write custom Falco rules",
            "Forward Falco alerts to a SIEM",
            "Build an incident response playbook for common alerts",
          ],
          content: `## Runtime Threat Detection with Falco

SAST and image scanning catch vulnerabilities before deployment. Falco catches attacks *during* execution — detecting container escapes, privilege escalation, and data exfiltration in real time.

---

## How Falco Works

Falco uses Linux kernel syscall tracing (via eBPF or kernel module) to observe every process, file access, and network connection inside containers.

\`\`\`
Container process → syscall → Kernel (eBPF hook) → Falco engine → Rule match → Alert
\`\`\`

---

## Installing Falco on Kubernetes

\`\`\`bash
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm repo update

helm install falco falcosecurity/falco \
  --namespace falco \
  --create-namespace \
  --set driver.kind=ebpf \
  --set falcosidekick.enabled=true \
  --set falcosidekick.config.slack.webhookurl="https://hooks.slack.com/..."

# Verify
kubectl get pods -n falco
kubectl logs -n falco -l app.kubernetes.io/name=falco
\`\`\`

---

## Built-in Rules (Examples)

\`\`\`yaml
# Falco triggers on these by default:

# Shell spawned in a container
- rule: Terminal shell in container
  desc: A shell was used as the entrypoint or is spawned in a container
  condition: >
    spawned_process and container
    and shell_procs and proc.tty != 0
  output: >
    A shell was spawned in a container (user=%user.name container=%container.name
    image=%container.image.repository shell=%proc.name)
  priority: WARNING

# Sensitive file read
- rule: Read sensitive file trusted after startup
  condition: >
    open_read and sensitive_files
    and not proc.name in (trusted_file_readers)
    and not container.id = host
  output: Sensitive file opened for reading (file=%fd.name ...)
  priority: WARNING
\`\`\`

---

## Custom Falco Rules

\`\`\`yaml
# /etc/falco/rules.d/custom.yaml

# Alert when crypto-mining tools are run
- list: crypto_miners
  items: [xmrig, minergate, ccminer, ethminer]

- rule: Crypto Mining Detected
  desc: A known crypto miner was executed
  condition: spawned_process and proc.name in (crypto_miners)
  output: "Crypto miner detected (proc=%proc.name user=%user.name container=%container.name)"
  priority: CRITICAL
  tags: [malware, crypto]

# Alert on unexpected outbound connections
- rule: Unexpected Outbound Network Connection
  desc: Container made an outbound connection to an unexpected port
  condition: >
    outbound and container
    and not fd.sport in (80, 443, 5432, 6379, 27017)
    and not proc.name in (allowed_network_processes)
  output: "Unexpected outbound connection (dest=%fd.rip:%fd.rport proc=%proc.name container=%container.name)"
  priority: HIGH
\`\`\`

---

## SIEM Integration with Falcosidekick

\`\`\`yaml
# falcosidekick ConfigMap
config:
  elasticsearch:
    hostport: "https://elasticsearch:9200"
    index: "falco"
    username: "falco"
    password: "\${{ secrets.ELASTIC_PASSWORD }}"

  slack:
    webhookurl: "https://hooks.slack.com/..."
    minimumpriority: "warning"

  pagerduty:
    routingkey: "\${{ secrets.PD_ROUTING_KEY }}"
    minimumpriority: "critical"
\`\`\`

---

## Incident Response Playbook

When Falco fires **"Shell spawned in container"**:

\`\`\`bash
# 1. Identify the container
kubectl get pods -A | grep <container-name>

# 2. Capture forensic evidence BEFORE killing
kubectl exec -n <ns> <pod> -- ps aux > /tmp/forensics-ps.txt
kubectl exec -n <ns> <pod> -- netstat -tlnp > /tmp/forensics-net.txt
kubectl logs -n <ns> <pod> --since=1h > /tmp/forensics-logs.txt

# 3. Isolate the pod (network policy)
kubectl label pod <pod> -n <ns> security.kubernetes.io/quarantine=true

# 4. Apply deny-all network policy to quarantine label
# 5. Cordon the node if node compromise suspected
kubectl cordon <node-name>

# 6. Preserve the pod spec for investigation
kubectl get pod <pod> -n <ns> -o yaml > /tmp/forensics-podspec.yaml

# 7. Delete the compromised pod (replacement spawns from deployment)
kubectl delete pod <pod> -n <ns>
\`\`\`

> **Tip:** Use Falco's \`json_output: true\` and forward to your SIEM (Elastic, Splunk) for correlation. A single Falco alert rarely means compromise; patterns across multiple pods in minutes are high-confidence indicators.`,
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 6 — Compliance & Governance
    // ─────────────────────────────────────────
    {
      id: "compliance-governance",
      title: "Compliance & Governance Automation",
      description: "SOC 2, CIS benchmarks, audit trails, and policy-as-code enforcement at scale.",
      level: "advanced",
      lessons: [
        {
          id: "compliance-as-code",
          title: "Compliance as Code",
          description: "Automate SOC 2, CIS benchmark checks, and generate audit evidence programmatically.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Map CI/CD security controls to SOC 2 Trust Service Criteria",
            "Run CIS Benchmark checks with kube-bench",
            "Generate audit evidence automatically from pipeline runs",
            "Implement Open Policy Agent for Kubernetes admission control",
          ],
          content: `## Compliance as Code

Manual compliance audits are slow, error-prone, and expensive. Automating compliance checks turns them into continuous feedback rather than annual stress.

---

## SOC 2 + DevSecOps Mapping

| SOC 2 Criterion | DevSecOps Control |
|---|---|
| CC6.1 — Logical access | IAM least privilege, MFA enforcement |
| CC6.2 — Authentication | SSO + OIDC, branch protection, signed commits |
| CC6.6 — Vulnerability management | SAST, SCA, DAST in every PR |
| CC6.7 — Encryption | TLS everywhere, secrets in Vault, encrypted volumes |
| CC7.2 — System monitoring | Falco alerts, CloudWatch, SIEM |
| CC8.1 — Change management | Git history, PR approvals, signed commits as audit trail |

---

## CIS Kubernetes Benchmark with kube-bench

\`\`\`bash
# Run all CIS checks on a node
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

kubectl logs job.batch/kube-bench

# Or run directly on the node
docker run --pid=host --network=host --rm \
  -v /etc:/etc:ro \
  -v /var:/var:ro \
  aquasec/kube-bench:latest
\`\`\`

Sample output:
\`\`\`
[PASS] 1.1.1 Ensure that the API server pod specification file permissions are set to 644 or more restrictive
[FAIL] 1.1.12 Ensure that the etcd data directory ownership is set to etcd:etcd
[WARN] 1.2.20 Ensure that the --audit-log-path argument is set
\`\`\`

---

## OPA Admission Controller (Gatekeeper)

Gatekeeper enforces policies at Kubernetes admission time — pods violating policy are rejected before they start.

\`\`\`bash
# Install Gatekeeper
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.14/deploy/gatekeeper.yaml
\`\`\`

\`\`\`yaml
# Constraint Template: require security context
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: requiresecuritycontext
spec:
  crd:
    spec:
      names:
        kind: RequireSecurityContext
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package requiresecuritycontext
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.runAsNonRoot
          msg := sprintf("Container '%v' must run as non-root", [container.name])
        }
---
# Apply the constraint
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: RequireSecurityContext
metadata:
  name: must-run-as-nonroot
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
    namespaces: ["production"]
\`\`\`

---

## Generating Audit Evidence Automatically

\`\`\`yaml
# GitHub Actions — create audit artifact on every release
jobs:
  audit-evidence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Collect Evidence
        run: |
          echo "=== Git Log (signed commits) ===" > evidence.txt
          git log --show-signature --oneline -20 >> evidence.txt

          echo "=== PR Reviews ===" >> evidence.txt
          gh pr list --state merged --limit 20 \
            --json number,title,reviewDecision,mergedAt \
            >> evidence.txt

          echo "=== Dependency Audit ===" >> evidence.txt
          npm audit --json >> evidence.txt
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Upload Evidence
        uses: actions/upload-artifact@v4
        with:
          name: audit-evidence-\${{ github.run_id }}
          path: evidence.txt
          retention-days: 365
\`\`\`

---

## Security Scorecard

Use OpenSSF Scorecard to get an automated security score for your repo:

\`\`\`bash
docker run -e GITHUB_AUTH_TOKEN=\$GH_TOKEN \
  gcr.io/openssf/scorecard:stable \
  --repo=github.com/myorg/myapp \
  --format json \
  | jq '.checks[] | {name, score, reason}'
\`\`\`

Checks include: Branch-Protection, Code-Review, Signed-Releases, Vulnerabilities, Token-Permissions, Secret detection.

> **Tip:** Automate scorecard in CI and alert when the score drops below your threshold (e.g., 7/10). Publish the badge in README.md to signal security posture to external contributors and auditors.`,
          interviewQuestions: [
            {
              question: "How do you implement compliance as code, and why is it better than periodic manual audits?",
              difficulty: "mid" as const,
              answer: `**Compliance as code** treats compliance requirements (GDPR, SOC 2, PCI DSS, HIPAA) as automated checks that run continuously, rather than point-in-time manual audits.

**Why manual audits fail:**
- Audits happen quarterly/annually — months of non-compliance go undetected
- Auditors check a sample, not everything
- "Point-in-time" attestation: compliant at audit time, drifts immediately after
- Manual processes don't scale with cloud infrastructure (hundreds of resources)

**Implementation with AWS Config + OPA:**
\`\`\`bash
# AWS Config rule: all S3 buckets must be encrypted:
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "s3-bucket-server-side-encryption-enabled",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"
  }
}'

# AWS Config automatically evaluates all S3 buckets continuously
# Non-compliant resources trigger SNS → PagerDuty or auto-remediation Lambda
\`\`\`

**IaC policy with Checkov:**
\`\`\`bash
# Block deployment if Terraform code violates security policies:
checkov -d . --check CKV_AWS_21,CKV_AWS_18 --hard-fail-on HIGH
# CKV_AWS_21: S3 versioning enabled
# CKV_AWS_18: S3 access logging enabled
\`\`\`

**Continuous compliance dashboard:**
\`\`\`bash
# Security Hub aggregates findings from GuardDuty, Inspector, Config, Macie:
aws securityhub get-findings \\
  --filters '{"ComplianceStatus":[{"Value":"FAILED","Comparison":"EQUALS"}]}' \\
  --query 'Findings[].{Resource:Resources[0].Id,Control:Title,Severity:Severity.Label}'
\`\`\`

**Benefits of continuous compliance:**
- Real-time compliance posture (detect drift within minutes)
- Scales with infrastructure (10 resources or 10,000 resources, same effort)
- Audit evidence is automatically collected
- Compliance becomes a normal part of deployment, not a blocker`,
            },
            {
              question: "Walk me through how you would design the secret management strategy for a microservices application.",
              difficulty: "senior" as const,
              answer: `**The hierarchy of secret security (best to worst):**

1. **Dynamic, short-lived credentials** (best): App gets credentials from Vault/AWS Secrets Manager at runtime, credentials expire in minutes/hours. No stored secrets anywhere.
2. **Environment-injected at deploy time**: Kubernetes Secrets mounted as files, ECS task environment variables from Secrets Manager. Short-lived but not rotating.
3. **Long-lived env vars in container**: Never rotated, leaked in logs, visible in container inspect.
4. **Hardcoded in code** (worst): In version control forever.

**Production-grade architecture:**

**Option A — HashiCorp Vault with Kubernetes:**
\`\`\`yaml
# Vault Agent Injector annotates pods to automatically inject secrets:
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "payments-service"
  vault.hashicorp.com/agent-inject-secret-db-creds: "database/creds/payments-role"
# Vault auto-renews credentials before they expire
# App reads from /vault/secrets/db-creds (file, not env)
\`\`\`

**Option B — AWS Secrets Manager + IAM roles:**
\`\`\`python
# App fetches secrets at startup, caches with TTL:
import boto3
from functools import lru_cache

@lru_cache(maxsize=None)
def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    return client.get_secret_value(SecretId=secret_name)['SecretString']

# IAM task role grants: secretsmanager:GetSecretValue on specific ARN only
# No access key needed — uses instance/task metadata credentials
\`\`\`

**Rotation strategy:**
\`\`\`bash
# Enable automatic rotation in Secrets Manager:
aws secretsmanager rotate-secret \\
  --secret-id prod/myapp/db-password \\
  --rotation-lambda-arn arn:aws:lambda:...:function:SecretsManagerRotation \\
  --rotation-rules AutomaticallyAfterDays=30
\`\`\`

**Audit trail:**
Every secret access is logged in CloudTrail/Vault audit logs — who accessed what, when. Anomaly detection on unusual access patterns (e.g., Lambda function that usually accesses 10 secrets/day suddenly accessing 100 = potential data exfiltration).`,
            },
          ],
        },
      ],
    },
    {
      id: "cicd-pipelines",
      title: "CI/CD Pipelines",
      level: "intermediate",
      description: "Build production-grade CI/CD pipelines with pipeline rules, MR pipelines, and environment promotion.",
      lessons: [
        {
          id: "pipeline-fundamentals",
          title: "CI/CD Pipeline Fundamentals",
          duration: 22,
          type: "lesson",
          description: "Understand CI/CD concepts, pipeline stages, and how modern pipelines are structured.",
          objectives: [
            "Explain the difference between CI and CD",
            "Design a multi-stage pipeline with gates",
            "Understand pipeline triggers and conditions",
            "Implement fail-fast strategies and parallel jobs",
          ],
          content: `# CI/CD Pipeline Fundamentals

## What is CI/CD?

**Continuous Integration (CI)**: Automatically build, test, and validate every code change the moment it's pushed. Catch bugs in minutes, not days.

**Continuous Delivery (CD)**: Automatically deploy validated code to staging environments. Every merge to main is a deployable artifact.

**Continuous Deployment**: Every passing pipeline automatically deploys to production. No human gate. Used by Netflix, Amazon (deploys every 11.7 seconds), and Etsy.

\`\`\`
Developer pushes code
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   CI Pipeline                           │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Build   │→ │   Test   │→ │  Scan    │→ │Package │ │
│  │ compile  │  │unit/intg │  │SAST/SCA  │  │ image  │ │
│  │ lint     │  │coverage  │  │secrets   │  │ helm   │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
       │
       ▼ (on main branch only)
┌─────────────────────────────────────────────────────────┐
│                   CD Pipeline                           │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Deploy  │→ │  Deploy  │→ │  Deploy Production   │  │
│  │   Dev    │  │ Staging  │  │  (manual approval)   │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
\`\`\`

## GitLab CI/CD Pipeline Structure

GitLab CI is defined in \`.gitlab-ci.yml\` at the repo root.

\`\`\`yaml
# .gitlab-ci.yml — complete production pipeline example
image: node:20-alpine

stages:
  - build
  - test
  - scan
  - package
  - deploy-dev
  - deploy-staging
  - deploy-prod

variables:
  IMAGE_NAME: \${CI_REGISTRY_IMAGE}:\${CI_COMMIT_SHA}
  DOCKER_BUILDKIT: "1"

# ── Build ──────────────────────────────────────────────
build:
  stage: build
  script:
    - npm ci --cache .npm
    - npm run build
  cache:
    key: \${CI_COMMIT_REF_SLUG}
    paths:
      - .npm/
      - node_modules/
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# ── Test ───────────────────────────────────────────────
unit-tests:
  stage: test
  script:
    - npm run test:unit -- --coverage
  coverage: '/Lines\\s*:\\s*(\\d+\\.\\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
      junit: coverage/junit.xml

integration-tests:
  stage: test
  services:
    - postgres:15
    - redis:7
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: testuser
    POSTGRES_PASSWORD: testpass
  script:
    - npm run test:integration

# ── Scan ───────────────────────────────────────────────
sast:
  stage: scan
  include:
    - template: Security/SAST.gitlab-ci.yml

dependency-scan:
  stage: scan
  include:
    - template: Security/Dependency-Scanning.gitlab-ci.yml

secret-detection:
  stage: scan
  include:
    - template: Security/Secret-Detection.gitlab-ci.yml

# ── Package ────────────────────────────────────────────
build-image:
  stage: package
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - docker build --cache-from \$CI_REGISTRY_IMAGE:latest -t \$IMAGE_NAME .
    - docker push \$IMAGE_NAME
  only:
    - main
    - /^release\\/.*/

# ── Deploy Dev ─────────────────────────────────────────
deploy-dev:
  stage: deploy-dev
  environment:
    name: development
    url: https://dev.myapp.com
  script:
    - helm upgrade --install myapp ./helm/myapp
        --set image.tag=\${CI_COMMIT_SHA}
        --namespace dev
        --atomic --timeout 5m
  only:
    - main

# ── Deploy Staging ─────────────────────────────────────
deploy-staging:
  stage: deploy-staging
  environment:
    name: staging
    url: https://staging.myapp.com
  script:
    - helm upgrade --install myapp ./helm/myapp
        --set image.tag=\${CI_COMMIT_SHA}
        --namespace staging
        --atomic --timeout 5m
  only:
    - main
  needs:
    - deploy-dev

# ── Deploy Production ──────────────────────────────────
deploy-prod:
  stage: deploy-prod
  environment:
    name: production
    url: https://myapp.com
  script:
    - helm upgrade --install myapp ./helm/myapp
        --set image.tag=\${CI_COMMIT_SHA}
        --namespace production
        --atomic --timeout 10m
  when: manual
  only:
    - main
  needs:
    - deploy-staging
\`\`\`

## GitHub Actions Equivalent

\`\`\`yaml
# .github/workflows/pipeline.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test -- --coverage

  deploy-staging:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: echo "Deploy to staging"

  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: echo "Deploy to production"
\`\`\`

## Pipeline Best Practices

**Fail fast**: Run the quickest checks first (lint → unit tests → integration tests → slow scans).

**Parallel jobs**: Run independent stages simultaneously. Unit tests + lint + secret scanning can all run in parallel.

**Cache aggressively**: Cache \`node_modules\`, Maven \`.m2\`, pip packages. Build time drops from 8 minutes to 2.

**Immutable artifacts**: Build once, deploy the same artifact everywhere. Never rebuild for staging vs production.

**Pipeline as code**: The \`.gitlab-ci.yml\` / \`.github/workflows/\` file lives in the repo, version controlled, reviewed in PRs.
`,
          interviewQuestions: [
            {
              question: "What's the difference between Continuous Delivery and Continuous Deployment?",
              difficulty: "junior" as const,
              answer: `**Continuous Delivery**: Every code change that passes the pipeline is deployable to production. But the actual deployment requires a human to approve it. The pipeline validates it *can* be deployed — the human decides *when*.

**Continuous Deployment**: Every code change that passes the pipeline is automatically deployed to production. No human gate. Zero manual steps.

Most companies practice Continuous Delivery, not Continuous Deployment. Continuous Deployment requires very high test coverage (90%+), feature flags, robust monitoring and automated rollback.

Amazon deploys to production every 11.7 seconds — this is continuous deployment. Most enterprises use continuous delivery with a manual approval gate for production.`,
            },
            {
              question: "A pipeline takes 45 minutes to run. How do you speed it up?",
              difficulty: "mid" as const,
              answer: `**Step 1: Measure** where time is spent (GitLab pipeline view shows job durations).

**Step 2: Parallelize** independent jobs:
\`\`\`yaml
test:
  parallel:
    matrix:
      - SUITE: [unit, integration, e2e-chrome, e2e-firefox]
\`\`\`

**Step 3: Cache dependencies**:
\`\`\`yaml
cache:
  key: \${CI_COMMIT_REF_SLUG}-\${hashFiles('package-lock.json')}
  paths: [node_modules/, .npm/]
\`\`\`

**Step 4: Fail fast ordering** — run lint (30s) before integration tests (10m). Don't wait 20 minutes to find a syntax error.

**Step 5: Docker layer caching** — \`docker build --cache-from \$CI_REGISTRY_IMAGE:latest\`

**Step 6: Scope slow tests** — E2E tests only on main/release branches, not every PR.

Result: A 45-minute pipeline typically drops to 8-12 minutes with parallelization + caching.`,
            },
          ],
        },
        {
          id: "pipeline-rules-and-mr",
          title: "Pipeline Rules, MR Pipelines & Branch Protection",
          duration: 20,
          type: "lesson",
          description: "Control when pipelines run, protect branches, and enforce quality gates on merge requests.",
          objectives: [
            "Write pipeline rules to control job execution",
            "Configure MR pipelines that run against merged results",
            "Set up branch protection rules to enforce pipeline success",
            "Implement environment-specific deployment gates",
          ],
          content: `# Pipeline Rules, MR Pipelines & Branch Protection

## Pipeline Rules (GitLab)

\`rules:\` provides fine-grained control over when jobs run:

\`\`\`yaml
deploy-prod:
  stage: deploy-prod
  script:
    - ./deploy.sh production
  rules:
    - if: \$CI_COMMIT_BRANCH == "main"
      when: manual
    - if: \$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+\$/
      when: on_success
    - when: never

unit-tests:
  stage: test
  script:
    - npm test
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
    - if: \$CI_COMMIT_BRANCH == "main"
    - if: \$CI_PIPELINE_SOURCE == "schedule"
      when: never

# Only rebuild docs when doc files change
docs-build:
  stage: build
  script:
    - mkdocs build
  rules:
    - changes:
        - docs/**/*
        - mkdocs.yml
      when: on_success
    - when: never
\`\`\`

## MR Pipelines

MR pipelines run against the **merged result** of source + target branch — catching integration conflicts before they land in main.

\`\`\`yaml
validate-mr:
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"

test:
  script:
    - npm test
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
      variables:
        TEST_FLAGS: "--bail"
    - if: \$CI_COMMIT_BRANCH == "main"
      variables:
        TEST_FLAGS: "--coverage"
\`\`\`

Enable in **Settings → Merge Requests**:
- ✅ Pipelines must succeed before merging
- ✅ All threads must be resolved
- ✅ Require code owner approval

## Branch Protection Rules

### GitLab (Settings → Repository → Protected Branches)

\`\`\`
Branch: main
  Allowed to push:  No one (force push disabled)
  Allowed to merge: Maintainers only
  Require code owner approval: ✅
  Pipeline must succeed: ✅

Branch: release/*
  Allowed to push:  Developers (hotfixes)
  Allowed to merge: Maintainers
  Pipeline must succeed: ✅
\`\`\`

### GitHub Branch Protection as Terraform

\`\`\`hcl
resource "github_branch_protection" "main" {
  repository_id = github_repository.myapp.node_id
  pattern       = "main"

  required_status_checks {
    strict   = true
    contexts = ["build", "test", "sast", "dependency-scan"]
  }

  required_pull_request_reviews {
    required_approving_review_count = 2
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = true
  }

  enforce_admins      = true
  allows_force_pushes = false
  allows_deletions    = false
}
\`\`\`

## Environment Approvals

\`\`\`yaml
# GitLab: manual approval for production
deploy-prod:
  stage: deploy-prod
  environment:
    name: production
    deployment_tier: production
  script:
    - helm upgrade --install myapp ./helm/myapp --namespace production
  when: manual
  allow_failure: false
\`\`\`

In GitHub: set **required reviewers** on the \`production\` environment — any workflow deploying to it will pause for approval.
`,
          interviewQuestions: [
            {
              question: "Why use MR pipelines instead of just branch pipelines?",
              difficulty: "mid" as const,
              answer: `Branch pipelines run against your feature branch in isolation. MR pipelines run against the **simulated merged result** — as if you already merged.

This catches:

1. **Integration conflicts**: Your branch adds \`processPayment()\` to billing.js. Another branch merged yesterday adds a conflicting function. Branch pipelines: both green. MR pipeline: fails on the merged result.

2. **Integration test failures**: Your code works in isolation but breaks a test added to main after you branched.

3. **Earlier detection**: Catch conflicts before merge, when they're cheapest to fix — not after, when they become everyone's problem on main.

Setup in GitLab:
\`\`\`yaml
rules:
  - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
\`\`\`

With "pipelines must succeed" enabled, you can never merge broken code. At scale (20+ developers merging to main), this keeps main perpetually green.`,
            },
          ],
        },
      ],
    },
    {
      id: "artifact-management",
      title: "Artifacts, Versioning & Promotion",
      level: "intermediate",
      description: "Manage build artifacts, semantic versioning, git tags, and promote releases across environments.",
      lessons: [
        {
          id: "artifact-versioning",
          title: "Artifact Management & Versioning",
          duration: 20,
          type: "lesson",
          description: "Build immutable artifacts, version them semantically, and manage registries.",
          objectives: [
            "Implement semantic versioning for releases",
            "Create versioned Docker images and Helm charts",
            "Use GitLab/GitHub Package Registry for artifact storage",
            "Automate versioning with conventional commits",
          ],
          content: `# Artifact Management & Versioning

## What is an Artifact?

Anything produced by the build pipeline that gets deployed or used downstream:
- **Docker images** (container registry)
- **Helm charts** (OCI registry / chart museum)
- **npm/pip packages** (package registry)
- **JAR/WAR files** (Maven/Nexus)
- **Binary executables** (S3, GitLab packages)

**The golden rule**: Build once, deploy everywhere. Never rebuild for staging vs production. The exact artifact promoted through environments guarantees what you tested is what you deployed.

## Semantic Versioning

\`\`\`
Format: MAJOR.MINOR.PATCH[-prerelease][+build]

MAJOR: Breaking changes (API incompatible)
MINOR: New features (backwards compatible)
PATCH: Bug fixes (backwards compatible)

Examples:
  1.0.0       → first stable release
  1.1.0       → new feature added
  1.1.1       → bug fix
  2.0.0       → breaking API change
  1.2.0-rc.1  → release candidate
\`\`\`

## Git Tags for Release Versioning

\`\`\`bash
# Create annotated tag (preferred — includes tagger info and date)
git tag -a v1.2.3 -m "Release 1.2.3 — adds payment retry logic"
git push origin v1.2.3

# List tags (most recent first)
git tag -l --sort=-version:refname | head -10

# Tag a specific commit (e.g., for a hotfix)
git tag -a v1.2.2 abc1234 -m "Hotfix for payment timeout"

# Delete a tag (before it's released)
git tag -d v1.2.3
git push origin --delete v1.2.3
\`\`\`

## Automated Versioning with semantic-release

\`\`\`yaml
# .gitlab-ci.yml
semantic-release:
  stage: release
  image: node:20
  script:
    - npx semantic-release
  only:
    - main
# Reads conventional commits:
#   feat: add payment retry    → bumps MINOR (1.1.0 → 1.2.0)
#   fix: timeout on checkout   → bumps PATCH (1.1.0 → 1.1.1)
#   feat!: new auth API        → bumps MAJOR (1.1.0 → 2.0.0)
\`\`\`

\`\`\`bash
# Conventional commit format
git commit -m "feat: add SQS retry queue for failed payments"
git commit -m "fix: resolve race condition in order lock"
git commit -m "feat!: replace REST API with GraphQL"
\`\`\`

## Docker Image Versioning Strategy

\`\`\`yaml
build-and-tag:
  stage: package
  script:
    - |
      VERSION=$(cat VERSION)
      docker build \
        -t \$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA \
        -t \$CI_REGISTRY_IMAGE:\$VERSION \
        -t \$CI_REGISTRY_IMAGE:latest \
        .
      docker push \$CI_REGISTRY_IMAGE --all-tags

# Tag strategy:
#   myapp:abc1234   → exact commit SHA (immutable, for debugging)
#   myapp:v1.2.3    → semver release (immutable)
#   myapp:latest    → floating, most recent main build (mutable)
\`\`\`

## Artifact Retention Policies

\`\`\`yaml
# GitLab CI artifacts — set expiry
build:
  artifacts:
    paths: [dist/]
    expire_in: 1 week

test-reports:
  artifacts:
    reports:
      junit: junit.xml
    expire_in: 30 days

# Docker registry cleanup (GitLab):
# Settings → Packages & Registries → Cleanup policies
# Keep last N images per tag, remove older than N days
# Keep images matching regex: v\d+\.\d+\.\d+
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Why build once and promote the same artifact rather than rebuilding per environment?",
              difficulty: "mid" as const,
              answer: `Rebuilding per environment creates a critical gap: the binary tested in staging differs from the one in production, even if source code is identical. Environmental differences (compiler cache, dependency resolution, OS library versions on the runner) can produce different outputs.

**Problems with rebuild-per-environment:**
1. Non-deterministic: build 1 and build 2 of the same commit can differ
2. Dependency drift: a week later you might get a different patch version of a transitive dep
3. Trust gap: "we tested v1.1.0-build-1 in staging but deployed v1.1.0-build-2 to prod"

**Build once, promote everywhere:**
\`\`\`
CI: commit abc1234 → build → myapp:abc1234
    → test in dev with myapp:abc1234
    → promote to staging (same image, different config)
    → promote to prod (same image, different config)
\`\`\`

What changes between environments is **configuration** (env vars, secrets, replica counts) — not the artifact. Tag images with the git SHA (\`myapp:abc1234\`) — immutable, auditable, traceable back to the exact commit.`,
            },
          ],
        },
        {
          id: "artifact-promotion",
          title: "Artifact Promotion & Release Management",
          duration: 18,
          type: "lesson",
          description: "Promote artifacts across environments, manage release branches, and implement deployment strategies.",
          objectives: [
            "Implement promotion pipelines that deploy the same artifact across environments",
            "Manage release branches and hotfix workflows",
            "Use blue/green and canary deployment strategies",
            "Implement rollback procedures for production incidents",
          ],
          content: `# Artifact Promotion & Release Management

## The Promotion Model

\`\`\`
┌──────────────────────────────────────────────────────┐
│               Promotion Pipeline                     │
│                                                      │
│  Build → DEV ──(auto)──> STAGING ──(auto)──>         │
│  PROD (manual approval + change window)              │
│                                                      │
│  Image: myapp:v1.2.3 flows unchanged                 │
│  Config: values-dev.yaml / values-staging.yaml /    │
│          values-prod.yaml (different per env)        │
└──────────────────────────────────────────────────────┘
\`\`\`

## GitLab Promotion Pipeline

\`\`\`yaml
set-version:
  stage: .pre
  script:
    - echo "APP_VERSION=$(cat VERSION)" >> build.env
  artifacts:
    reports:
      dotenv: build.env  # shares APP_VERSION to downstream jobs

deploy-dev:
  stage: deploy-dev
  script:
    - helm upgrade --install myapp ./charts/myapp
        --set image.tag=\$APP_VERSION
        --namespace dev
        --values helm/values-dev.yaml
  environment:
    name: dev

deploy-staging:
  stage: deploy-staging
  needs:
    - job: deploy-dev
      artifacts: true
  script:
    - helm upgrade --install myapp ./charts/myapp
        --set image.tag=\$APP_VERSION   # SAME tag as dev
        --namespace staging
        --values helm/values-staging.yaml

deploy-prod:
  stage: deploy-prod
  needs:
    - job: deploy-staging
      artifacts: true
  script:
    - helm upgrade --install myapp ./charts/myapp
        --set image.tag=\$APP_VERSION   # SAME tag as staging
        --namespace production
        --values helm/values-prod.yaml
  when: manual
\`\`\`

## Release Branch Strategy

\`\`\`
main ──────────────────────────────── (always deployable)
        │              │
        │              └── release/1.3.0 ── hotfix/1.3.1
        └── feature/payment-retry
\`\`\`

\`\`\`bash
# Create release branch from main
git checkout -b release/1.3.0 main
git push origin release/1.3.0

# Only cherry-pick bug fixes into release branch
git cherry-pick abc1234  # specific fix from main

# Tag the release
git tag -a v1.3.0 -m "Release 1.3.0"
git push origin v1.3.0

# Merge release branch back to main
git checkout main && git merge release/1.3.0
\`\`\`

## Hotfix Workflow

\`\`\`bash
# Production is on v1.3.0, critical bug found
# Branch from the tag (NOT from main which has 20 unreleased commits)
git checkout -b hotfix/1.3.1 v1.3.0

git commit -m "fix: payment gateway timeout on retry"
git tag -a v1.3.1 -m "Hotfix: payment gateway timeout"
git push origin v1.3.1 --tags

# Cherry-pick fix back to main
git checkout main
git cherry-pick <hotfix-sha>
\`\`\`

## Deployment Strategies

### Blue/Green: Zero-Downtime Cutover

\`\`\`bash
# Blue is live. Deploy green (new version) in parallel.
kubectl apply -f k8s/deployment-green.yaml
kubectl rollout status deployment/myapp-green

# Smoke test green before switching
./smoke-tests.sh https://green.internal.myapp.com

# Switch service selector from blue to green (instant)
kubectl patch service myapp \
  --patch '{"spec":{"selector":{"slot":"green"}}}'

# Keep blue running 15 min for instant rollback if needed
\`\`\`

### Canary: Gradual Traffic Shift

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5      # 5% to canary, watch metrics 10m
      - pause: {duration: 10m}
      - setWeight: 20
      - pause: {duration: 10m}
      - setWeight: 50
      - pause: {}         # manual gate before 100%
      - setWeight: 100
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you manage a hotfix when main has moved ahead of production?",
              difficulty: "senior" as const,
              answer: `Production is on v1.3.0 but main has 20 commits not yet ready for production. You can't deploy from main.

**Hotfix workflow:**
\`\`\`bash
# 1. Branch from the production tag (not main)
git checkout -b hotfix/payment-timeout v1.3.0

# 2. Apply the fix
git commit -m "fix: increase payment gateway timeout to 30s"

# 3. Tag and push
git tag -a v1.3.1 -m "Hotfix 1.3.1"
git push origin v1.3.1

# 4. CI triggers on tag: runs tests, deploys to production

# 5. Cherry-pick back to main (don't merge — would bring v1.3.0 state)
git checkout main
git cherry-pick <hotfix-sha>
\`\`\`

**Why cherry-pick not merge**: Merging the hotfix branch back includes the entire v1.3.0 state, which could revert main's 20 new commits. Cherry-pick applies only the specific fix.

**Pipeline consideration**: Hotfix pipelines should skip full E2E suites (testing features not in the hotfix) but still run unit tests + smoke tests.`,
            },
          ],
        },
      ],
    },
    {
      id: "monitoring-observability",
      title: "Monitoring & Observability",
      level: "intermediate",
      description: "Build comprehensive observability with Prometheus, Grafana, and OpenSearch.",
      lessons: [
        {
          id: "prometheus-fundamentals",
          title: "Prometheus — Metrics & Alerting",
          duration: 25,
          type: "lesson",
          description: "Collect, store, and query metrics with Prometheus and AlertManager.",
          objectives: [
            "Understand Prometheus's pull-based architecture and metric types",
            "Write PromQL queries for application and infrastructure metrics",
            "Configure AlertManager for on-call routing",
            "Expose custom application metrics",
          ],
          content: `# Prometheus — Metrics & Alerting

## Why Prometheus?

Prometheus is the de facto standard for Kubernetes monitoring. Created at SoundCloud, now used by Uber, DigitalOcean, and thousands of companies.

**Key design:**
- **Pull model**: Prometheus scrapes \`/metrics\` endpoints on a schedule. No agents to install — targets just expose an HTTP endpoint.
- **Time series database**: Stores \`metric_name{labels} value timestamp\`
- **PromQL**: Powerful query language for rates, aggregations, and percentiles
- **AlertManager**: Handles alert routing, deduplication, and silencing

## Architecture

\`\`\`
Prometheus (scrapes every 15s)
    │
    ├── /metrics on app pods  (custom app metrics)
    ├── node-exporter          (CPU, memory, disk)
    ├── kube-state-metrics     (pod counts, deployment status)
    └── postgres-exporter      (DB metrics)
    │
    ├── TSDB (local storage, 30d retention)
    ├── Grafana (dashboards)
    └── AlertManager (PagerDuty, Slack)
\`\`\`

## Metric Types

\`\`\`
Counter:   only goes up (total requests, total errors)
           http_requests_total{method="GET",status="200"} 42398
           → use rate() to get per-second rate

Gauge:     goes up or down (memory, active connections, queue depth)
           node_memory_MemAvailable_bytes 4294967296
           → use directly

Histogram: samples latency distribution, enables percentile queries
           http_request_duration_seconds_bucket{le="0.1"} 240
           → use histogram_quantile()
\`\`\`

## Exposing Metrics in Your App

\`\`\`python
from prometheus_client import Counter, Histogram, generate_latest
import time

REQUEST_COUNT = Counter('http_requests_total', 'Total requests',
                        ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'Latency',
                            ['endpoint'])

@app.route('/api/payments', methods=['POST'])
def process_payment():
    start = time.time()
    try:
        result = payment_service.process(request.json)
        REQUEST_COUNT.labels('POST', '/api/payments', '200').inc()
        return jsonify(result)
    except Exception:
        REQUEST_COUNT.labels('POST', '/api/payments', '500').inc()
        raise
    finally:
        REQUEST_LATENCY.labels('/api/payments').observe(time.time() - start)

@app.route('/metrics')
def metrics():
    return generate_latest()
\`\`\`

\`\`\`yaml
# Tell Prometheus to scrape your pod
metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
\`\`\`

## Essential PromQL Queries

\`\`\`promql
# Error rate (errors per second)
rate(http_requests_total{status=~"5.."}[5m])

# Error ratio (% of requests failing)
sum(rate(http_requests_total{status=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m]))

# 95th percentile latency by endpoint
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint)
)

# CPU usage rate by pod
rate(container_cpu_usage_seconds_total{namespace="production"}[5m])

# Memory usage vs limit (saturation)
container_memory_working_set_bytes
/ container_spec_memory_limit_bytes

# Node disk > 85% full
(node_filesystem_size_bytes - node_filesystem_avail_bytes)
/ node_filesystem_size_bytes > 0.85

# Pods not running
kube_pod_status_phase{phase!="Running"} > 0
\`\`\`

## AlertManager Configuration

\`\`\`yaml
# prometheus/alerts.yml
groups:
- name: application
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m]))
      / sum(rate(http_requests_total[5m])) > 0.05
    for: 5m
    labels:
      severity: critical
      team: backend
    annotations:
      summary: "Error rate {{ \$value | humanizePercentage }}"
      runbook: "https://wiki.mycompany.com/runbooks/high-error-rate"

  - alert: HighLatency
    expr: |
      histogram_quantile(0.95,
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
      ) > 2
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "P95 latency {{ \$value }}s exceeds SLO"
\`\`\`

\`\`\`yaml
# alertmanager/config.yml
route:
  group_by: ['alertname', 'team']
  receiver: default
  routes:
  - match:
      severity: critical
      team: backend
    receiver: pagerduty-backend
  - match:
      severity: warning
    receiver: slack-warnings

receivers:
- name: pagerduty-backend
  pagerduty_configs:
  - routing_key: <KEY>
- name: slack-warnings
  slack_configs:
  - api_url: https://hooks.slack.com/services/...
    channel: '#alerts'
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Explain the four golden signals and how you'd alert on them.",
              difficulty: "mid" as const,
              answer: `From the Google SRE book — the four most critical metrics for any service:

**1. Latency** — How long does a request take?
\`\`\`promql
# P99 latency > 500ms for 5 minutes → alert
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
) > 0.5
\`\`\`

**2. Traffic** — How much demand hits the system?
\`\`\`promql
sum(rate(http_requests_total[5m])) by (service)
\`\`\`
Baseline matters: 100 RPS might be normal or a 10x spike.

**3. Errors** — What rate of requests fail?
\`\`\`promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m])) > 0.01
\`\`\`

**4. Saturation** — How full is the service?
\`\`\`promql
container_memory_working_set_bytes
/ container_spec_memory_limit_bytes > 0.85
\`\`\`

**Alert severity:**
- Error rate > 0.1% → warning (Slack)
- Error rate > 1% → critical (page on-call)
- P99 latency > 500ms → warning
- P99 latency > 2s → critical (SLO breach)`,
            },
            {
              question: "What's the difference between a counter and a gauge?",
              difficulty: "junior" as const,
              answer: `**Counter**: Only goes up (resets to 0 on restart). Use for things you count: total requests, total errors, total bytes sent.
\`\`\`promql
# Wrong — raw value is useless (just grows forever)
http_requests_total

# Right — rate() gives per-second rate over 5 minutes
rate(http_requests_total[5m])
\`\`\`

**Gauge**: Can go up or down. Use for current state: memory usage, active connections, queue depth, CPU temperature.
\`\`\`promql
# Gauge — use directly (no rate needed)
node_memory_MemAvailable_bytes
redis_connected_clients
\`\`\`

**Common mistake**: Using a gauge for request counts (resetting each interval). If a scrape is missed, data is lost. Counters are resilient — you calculate rate from the cumulative total.

**Histogram**: Tracks distribution of values (latencies). Required for percentile calculations. Always prefer histogram over average for latency — averages hide tail behavior.`,
            },
          ],
        },
        {
          id: "grafana-dashboards",
          title: "Grafana — Dashboards & Visualization",
          duration: 20,
          type: "lesson",
          description: "Build production dashboards, SLO tracking, and Grafana as code.",
          objectives: [
            "Connect Grafana to Prometheus and other data sources",
            "Build dashboards with panels, variables, and alerts",
            "Implement Grafana as code with provisioning",
            "Create SLO dashboards with error budget tracking",
          ],
          content: `# Grafana — Dashboards & Visualization

## What is Grafana?

Grafana is the visualization layer for your metrics. It connects to Prometheus, Loki, OpenSearch, CloudWatch, and 50+ other sources. Used by Bloomberg, PayPal, and thousands of engineering teams.

## Deploying the Full Stack

\`\`\`bash
# kube-prometheus-stack: Prometheus + Grafana + AlertManager + pre-built K8s dashboards
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f monitoring-values.yaml
\`\`\`

\`\`\`yaml
# monitoring-values.yaml
grafana:
  adminPassword: "\${GRAFANA_ADMIN_PASSWORD}"
  persistence:
    enabled: true
    size: 10Gi
  ingress:
    enabled: true
    hosts: [grafana.mycompany.com]
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
      - name: default
        type: file
        options:
          path: /var/lib/grafana/dashboards/default

prometheus:
  prometheusSpec:
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          resources:
            requests:
              storage: 100Gi
\`\`\`

## Grafana as Code

Never click to create dashboards — version control them as JSON.

\`\`\`bash
# Export an existing dashboard
curl -s http://admin:password@grafana:3000/api/dashboards/uid/my-dash \
  | jq '.dashboard' > dashboards/app-overview.json
\`\`\`

\`\`\`yaml
# Mount dashboards via ConfigMap (Grafana sidecar picks them up)
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  labels:
    grafana_dashboard: "1"
data:
  app-overview.json: |
    { "title": "Application Overview", "panels": [...] }
\`\`\`

## Key Dashboard Layout

\`\`\`
┌────────────────────────────────────────────────────┐
│           Application Overview                     │
├──────────┬──────────┬──────────┬───────────────────┤
│ RPS      │ P95 Lat  │ Error %  │ Availability      │
│ 1,234/s  │ 142ms    │ 0.02%    │ 99.98%            │
├──────────┴──────────┴──────────┴───────────────────┤
│ Request Rate (time series — last 24h)              │
├──────────────────────────┬─────────────────────────┤
│ Latency Heatmap          │ Error Breakdown by Code  │
│  (shows P50/P95/P99)     │  500: 12  502: 3  504: 1 │
└──────────────────────────┴─────────────────────────┘
\`\`\`

## SLO Dashboard with Error Budget

\`\`\`
SLO: 99.9% availability over 30 days
Error budget: 0.1% of requests allowed to fail
= ~43.8 minutes of downtime per month allowed
\`\`\`

\`\`\`promql
# Error budget remaining (as % of budget)
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    / sum(increase(http_requests_total[30d]))
  ) / 0.001   -- divide by 0.1% budget
) * 100

# Burn rate (how fast are we consuming the budget?)
# > 1.0 = consuming faster than 30-day budget allows
sum(rate(http_requests_total{status=~"5.."}[1h]))
/ sum(rate(http_requests_total[1h]))
/ (0.001 / (30 * 24))
\`\`\`

**Dashboard thresholds:**
- Budget > 50%: green (healthy)
- Budget 25-50%: yellow (caution — slow down feature work)
- Budget < 25%: red (freeze features, focus on reliability)

**Burn rate alerts (Google SRE Workbook):**
- Burn rate > 14.4x for 1h → page immediately (budget exhausted in 2 days)
- Burn rate > 6x for 6h → page soon (exhausted in 5 days)
- Burn rate > 3x for 3 days → ticket (trending bad, investigate)
`,
          interviewQuestions: [
            {
              question: "How do you implement an SLO and error budget in practice?",
              difficulty: "senior" as const,
              answer: `**Step 1: Define the SLO**
\`\`\`
SLO: 99.9% of HTTP requests return non-5xx status over a rolling 30-day window
Error budget: 0.1% = 43.8 minutes equivalent of 100% error rate
\`\`\`

**Step 2: Implement the measurement** (PromQL in Grafana)
\`\`\`promql
# Current availability
(
  sum(increase(http_requests_total{status!~"5.."}[30d]))
  / sum(increase(http_requests_total[30d]))
) * 100

# Budget remaining
( 1 - actual_error_rate / 0.001 ) * 100
\`\`\`

**Step 3: Alert on burn rate, not just threshold**
Alerting when budget drops below 50% is too late — you need to know burn rate:
\`\`\`promql
# 1-hour burn rate > 14.4 means budget exhausts in 2 days
sum(rate(http_requests_total{status=~"5.."}[1h]))
/ sum(rate(http_requests_total[1h]))
/ 0.001 > 14.4
\`\`\`

**Step 4: Use budget for decision making**
- Budget > 50%: proceed with feature releases
- Budget 25-50%: engineering manager aware, reduce release cadence
- Budget < 25%: freeze non-critical features, reliability work only
- Budget exhausted: all hands on reliability, no features until next month

**Step 5: Review in weekly reliability meeting**
Look at burn rate trend, planned releases, and adjust accordingly. This is how Google, Spotify, and most mature SRE teams operate.`,
            },
          ],
        },
        {
          id: "opensearch-logging",
          title: "OpenSearch & Centralized Logging",
          duration: 22,
          type: "lesson",
          description: "Aggregate, search, and analyze logs at scale with OpenSearch and Fluent Bit.",
          objectives: [
            "Understand the OpenSearch/ELK stack architecture",
            "Deploy Fluent Bit for Kubernetes log collection",
            "Write OpenSearch queries for log analysis",
            "Implement log-based alerting and index lifecycle management",
          ],
          content: `# OpenSearch & Centralized Logging

## Why Centralized Logging?

In a Kubernetes cluster with 100 pods across 10 nodes, logs are scattered everywhere. When a user reports a bug at 14:32:15, you need to correlate logs across frontend → API → database → queue processor in different pods that may have already restarted.

**Without centralized logging**: SSH to each node, grep through files, logs lost on pod restart.

**With OpenSearch**: All logs searchable from one UI, preserved after pod deletion, full-text search, log-based alerts, anomaly detection.

## Architecture: Fluent Bit → OpenSearch → Dashboards

\`\`\`
┌─────────────────────────────────────────────┐
│              Kubernetes Nodes               │
│                                             │
│  Containers → /var/log/containers/*.log     │
│                    ↓                        │
│  ┌─────────────────────────────────────┐    │
│  │  Fluent Bit (DaemonSet — one/node)  │    │
│  │  • parses container logs            │    │
│  │  • adds K8s metadata (pod/ns/label) │    │
│  │  • forwards to OpenSearch           │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────┐
│           OpenSearch Cluster                │
│  Data Nodes (storage) + Dashboards (UI)    │
└─────────────────────────────────────────────┘
\`\`\`

## Deploying Fluent Bit

\`\`\`bash
helm repo add fluent https://fluent.github.io/helm-charts
helm upgrade --install fluent-bit fluent/fluent-bit \
  --namespace logging \
  -f fluent-bit-values.yaml
\`\`\`

\`\`\`yaml
# fluent-bit-values.yaml
config:
  inputs: |
    [INPUT]
        Name              tail
        Path              /var/log/containers/*.log
        multiline.parser  docker, cri
        Tag               kube.*
        Mem_Buf_Limit     50MB

  filters: |
    [FILTER]
        Name                kubernetes
        Match               kube.*
        Merge_Log           On       # parse JSON logs into fields
        K8S-Logging.Parser  On
        Annotations         Off

  outputs: |
    [OUTPUT]
        Name            opensearch
        Match           kube.*
        Host            opensearch.logging.svc.cluster.local
        Port            9200
        Index           kubernetes-logs
        Logstash_Format On
        Logstash_Prefix kubernetes-logs
        Retry_Limit     5
\`\`\`

## Structured Logging Best Practice

\`\`\`python
# Bad: unstructured — only full-text searchable
print(f"Payment failed for user {user_id}")

# Good: structured JSON — every field is indexed and queryable
import structlog

log = structlog.get_logger()
log.error("payment_failed",
    user_id=user_id,
    amount=amount,
    currency="USD",
    error_code="GATEWAY_TIMEOUT",
    trace_id=request.headers.get("X-Trace-ID"),
    duration_ms=elapsed_ms,
)
# In OpenSearch: filter on error_code="GATEWAY_TIMEOUT" in < 1 second
# With unstructured logs: grep through gigabytes of text
\`\`\`

## OpenSearch Queries

\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "kubernetes.labels.app": "payments-api" }},
        { "term": { "error_code": "GATEWAY_TIMEOUT" }},
        { "range": { "@timestamp": { "gte": "now-1h" }}}
      ]
    }
  },
  "sort": [{ "@timestamp": "desc" }]
}
\`\`\`

\`\`\`json
{
  "aggs": {
    "errors_by_code": {
      "terms": { "field": "error_code.keyword", "size": 10 }
    },
    "errors_over_time": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "5m"
      }
    }
  }
}
\`\`\`

## Index Lifecycle Management

\`\`\`json
{
  "policy": {
    "states": [
      {
        "name": "hot",
        "actions": [{ "rollover": { "min_size": "10gb", "min_index_age": "1d" }}],
        "transitions": [{ "state_name": "warm", "conditions": { "min_index_age": "7d" }}]
      },
      {
        "name": "warm",
        "actions": [{ "force_merge": { "max_num_segments": 1 }}],
        "transitions": [{ "state_name": "delete", "conditions": { "min_index_age": "30d" }}]
      },
      {
        "name": "delete",
        "actions": [{ "delete": {} }]
      }
    ]
  }
}
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What's the difference between metrics and logs, and when do you use each?",
              difficulty: "junior" as const,
              answer: `**Metrics** (Prometheus/Grafana): Numeric measurements over time.
- Low storage cost (just numbers + timestamps)
- Great for: dashboards, alerting, SLOs, trends
- Bad for: understanding WHY something went wrong
- Examples: request count, P99 latency, CPU %, error rate

**Logs** (OpenSearch/Loki): Timestamped text/JSON records of events.
- Higher storage cost (full text)
- Great for: debugging specific incidents, audit trails, root cause analysis
- Bad for: aggregation and alerting at scale (expensive)
- Examples: "Payment failed for user 12345, error: gateway timeout, trace: abc123"

**Traces** (Jaeger/Tempo/X-Ray): Record of a request's journey through multiple services.
- Shows exactly where time was spent across service hops
- Great for: latency debugging in microservices
- Examples: request → API (5ms) → database (200ms ← bottleneck) → cache (1ms)

**The practical workflow**: Metrics alert fires (WHAT is wrong) → check logs for context (WHY it happened) → if latency issue, check traces (WHERE the bottleneck is). They complement each other — you need all three for full observability.`,
            },
            {
              question: "How would you debug a production incident using centralized logging?",
              difficulty: "mid" as const,
              answer: `**Scenario**: Payment service error rate spiked at 14:32, already resolved at 14:55.

**Step 1: Find the error window**
\`\`\`
OpenSearch → Discover
Index: kubernetes-logs-*
Time: 14:25 → 15:00
Filter: kubernetes.labels.app = payments-api
Filter: level = error
\`\`\`

**Step 2: Identify the pattern**
Sort by timestamp, look for the first error. Common patterns:
- All errors have same message → single root cause
- Errors distributed across different messages → multiple causes

**Step 3: Use aggregations**
\`\`\`json
{
  "aggs": {
    "by_error": {
      "terms": { "field": "error_message.keyword" }
    }
  }
}
\`\`\`
Result: 97% of errors are "connection refused: postgres:5432" → database issue.

**Step 4: Correlate with infrastructure metrics**
Switch to Grafana: check postgres metrics at 14:32.
Result: postgres CPU at 100%, connection pool exhausted.

**Step 5: Find the trigger**
Check deployment events in logs:
\`\`\`
Filter: event = deployment, time: 14:25-14:35
Result: v2.1.3 deployed at 14:32 (with 3 extra DB queries per request)
\`\`\`

**Outcome**: Trace from alert → logs → metrics → deployment event in under 10 minutes. Without centralized logging this would take hours of SSH + grep.`,
            },
          ],
        },
      ],
    },
    {
      id: "devops-release-engineering",
      title: "Release Engineering & Feature Flags",
      level: "advanced",
      description: "Implement advanced release patterns, feature flags, DORA metrics, and DevOps culture.",
      lessons: [
        {
          id: "feature-flags",
          title: "Feature Flags & Progressive Delivery",
          duration: 16,
          type: "lesson",
          description: "Decouple deployment from release using feature flags and progressive rollouts.",
          objectives: [
            "Understand the deployment vs release distinction",
            "Implement feature flags for progressive rollouts",
            "Use kill switches for instant rollback without redeployment",
            "Apply percentage-based canary releases via flags",
          ],
          content: `# Feature Flags & Progressive Delivery

## Deployment ≠ Release

**Deployment**: The code is running in production.
**Release**: The feature is visible to users.

Feature flags decouple these. You can deploy to production at any time but only release to specific users, groups, or percentages.

\`\`\`
Traditional:
  Code → CI → Production → Everyone sees it (risky, hard to roll back)

With feature flags:
  Code → CI → Production (dark launch, no users see it) →
  1% of users → 10% → 50% → 100% (gradual rollout with monitoring)
  OR: instant rollback by flipping the flag to 0%
\`\`\`

**Companies:** Facebook deploys to 2 billion users behind feature flags. GitHub deploys to 100% of employees first, then gradually to users. Netflix uses flags as kill switches for every major feature.

## Implementing Feature Flags

\`\`\`python
# Using OpenFeature (vendor-neutral SDK — works with LaunchDarkly, flagd, Unleash)
from openfeature import api
from openfeature.provider.flagd import FlagdProvider

api.set_provider(FlagdProvider(host="flagd", port=8013))
client = api.get_client()

@app.route('/api/checkout', methods=['POST'])
def checkout():
    use_new_flow = client.get_boolean_value(
        flag_key="new-checkout-flow",
        default_value=False,
        evaluation_context={"user_id": current_user.id}
    )
    if use_new_flow:
        return new_checkout_service.process(request.json)
    return legacy_checkout_service.process(request.json)
\`\`\`

\`\`\`yaml
# flagd flag definition — percentage rollout
flags:
  new-checkout-flow:
    state: ENABLED
    variants:
      "on": true
      "off": false
    defaultVariant: "off"
    targeting:
      if:
        - fractional:
            - "\$ud#user_id"    # stable: same user always gets same variant
            - ["on", 10]        # 10% of users
            - ["off", 90]       # 90% remain on old flow
\`\`\`

## Kill Switch Pattern

\`\`\`python
payment_v2_enabled = flags.get_boolean("payment-v2", default=False)

if payment_v2_enabled:
    result = payment_v2.process(order)
else:
    result = payment_v1.process(order)   # battle-tested fallback

# If payment_v2 starts failing in production:
# → Open flagd/LaunchDarkly → set payment-v2 = false
# → ALL traffic instantly returns to payment_v1
# → No deployment, no rollback pipeline, < 1 second
\`\`\`

**Compare to traditional rollback:**
- Feature flag rollback: < 1 second, anyone can do it, no pipeline risk
- Deployment rollback: 15-30 minutes, pipeline must succeed, risk of further issues

## Gradual Rollout with Monitoring

\`\`\`bash
# Week 1: 1% rollout
flagd: new-checkout-flow → ["on", 1]
# Monitor: error rate, conversion rate, latency

# Week 2: 10% (if metrics are healthy)
flagd: new-checkout-flow → ["on", 10]
# Monitor for 2 days

# Week 3: 50%
# Week 4: 100%
# Week 5: Remove the flag (cleanup!)
\`\`\`

Flag cleanup is important — too many flags make code unreadable. Schedule removal as part of the feature work (usually 2-4 weeks after 100% rollout).
`,
          interviewQuestions: [
            {
              question: "How do you roll back a feature at 100% without a code deployment?",
              difficulty: "mid" as const,
              answer: `With feature flags: instant rollback without redeployment.

**With feature flags:**
1. Open your flag management system (LaunchDarkly, flagd, Unleash)
2. Find the \`new-feature\` flag
3. Set percentage: 100% → 0%
4. Live within seconds (next flag evaluation in each SDK instance)
5. Zero deployment, zero downtime, zero pipeline risk

**Traditional rollback (without flags):**
1. Create revert commit
2. CI pipeline runs (5-15 minutes)
3. Deploy to production (rolling update, another 5-10 minutes)
4. Total: 15-30 minutes of continued customer impact

**Why flags win for rollback:**
- Instant (sub-second propagation to all instances)
- No pipeline that can fail
- Partial rollback possible (100% → 50% → 0%)
- Ops/support team can do it, not just engineers
- Can target specific users (roll back for affected customers only)

**Best practice**: Every major feature gets a flag at launch. The flag is removed (code cleaned up) 2-4 weeks after stable 100% rollout. Flag debt (too many old flags) makes code hard to reason about.`,
            },
          ],
        },
        {
          id: "dora-metrics",
          title: "DORA Metrics & DevOps Culture",
          duration: 15,
          type: "lesson",
          description: "Measure DevOps performance with DORA metrics and build high-performing team practices.",
          objectives: [
            "Understand and measure the four DORA metrics",
            "Identify elite vs low-performing DevOps teams",
            "Implement practices that improve deployment frequency and MTTR",
            "Build blameless postmortem culture",
          ],
          content: `# DORA Metrics & DevOps Culture

## The Four DORA Metrics

DORA (DevOps Research and Assessment) identified four metrics that predict software delivery performance across 33,000+ professionals.

\`\`\`
         SPEED                    STABILITY
┌────────────────────┐  ┌───────────────────────┐
│ Deployment         │  │ Change Failure Rate    │
│ Frequency          │  │ % of deploys causing   │
│ How often to prod? │  │ incidents              │
└────────────────────┘  └───────────────────────┘
┌────────────────────┐  ┌───────────────────────┐
│ Lead Time          │  │ MTTR                  │
│ Commit → Production│  │ Mean Time to Recovery  │
│ how long?          │  │ How fast you recover   │
└────────────────────┘  └───────────────────────┘
\`\`\`

## Performance Tiers

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deploy Frequency | Multiple/day | Daily-weekly | Weekly-monthly | Monthly+ |
| Lead Time | < 1 hour | 1 day - 1 week | 1-4 weeks | > 1 month |
| Change Failure Rate | 0-5% | 5-10% | 10-15% | > 15% |
| MTTR | < 1 hour | < 1 day | < 1 week | > 1 week |

**Elite performers** (Amazon, Netflix, Google) deploy multiple times per day with < 5% change failure rate and recover from incidents in under an hour. **Low performers** deploy monthly and take weeks to recover.

## Improving Each Metric

**Deployment Frequency:**
- Smaller PRs (< 200 lines → easier to review → faster to merge)
- Trunk-based development (no long-lived feature branches)
- Feature flags (deploy dark, release separately)
- Automate CI/CD (remove manual steps)

**Lead Time:**
- Faster CI pipelines (parallelize, cache)
- Reduce PR review time (pair programming, async review culture)
- Remove manual QA gates (replace with automated tests)

**Change Failure Rate:**
- Higher test coverage + integration tests
- Progressive delivery (canary → gradual rollout)
- Feature flags (instant rollback if failure rate spikes)
- SAST/SCA/container scanning in CI

**MTTR:**
- Alerting + monitoring (detect faster)
- Runbooks for every alert
- Feature flags (roll back in seconds)
- Chaos engineering (practice recovery before incidents)

## Blameless Postmortem Template

\`\`\`markdown
# Postmortem — 2024-01-15 Payment Outage (23 min, 12k users affected)

## Timeline
14:32 - v2.1.3 deployed to production
14:35 - AlertManager: error rate > 5%
14:36 - On-call paged via PagerDuty
14:42 - Root cause: DB connection pool exhausted
14:55 - Rolled back to v2.1.2, service restored

## Root Cause
New feature added 3 additional DB queries per request.
Connection pool size (50) was insufficient at peak traffic.
Load testing covered only 50% of peak traffic.

## Contributing Factors (5 Whys)
Why did the pool exhaust? → new queries per request
Why wasn't it caught? → load test was understaffed
Why was load test understaffed? → no requirement for 110% peak
Why no requirement? → no postmortem from previous similar incident

## Action Items
- [ ] Alert on pool utilization > 80% (team-infra, 2024-01-19)
- [ ] Require load tests at 110% peak in staging (team-platform, 2024-01-31)
- [ ] Runbook: DB connection exhaustion (team-backend, 2024-01-19)

## What Went Well
- Detection: 3 minutes after deploy
- Rollback: 13 minutes (under 15-min SLO)
- Communication: clear escalation path
\`\`\`

**Key principle**: The system failed, not the person. Ask "Why did the system allow this?" not "Who broke this?" Psychological safety enables honest postmortems which enable real improvement.
`,
          interviewQuestions: [
            {
              question: "Your team deploys once a month and takes 3 days to recover from incidents. How do you improve?",
              difficulty: "senior" as const,
              answer: `This is a "low performer" DORA profile. Practical improvement roadmap:

**Phase 1: Reduce fear of deploying (Month 1-2)**
Root cause of monthly deploys: usually manual QA gates, no automated tests, "big bang" releases.

- Break PRs smaller — one feature at a time, < 200 lines
- Build basic CI: lint + unit tests on every PR
- Deploy to staging automatically on every merge to main
- Target: staging deploys daily within 60 days

**Phase 2: Automate production deployment (Month 2-3)**
- Wrap manual deployment scripts in CI/CD
- Add smoke tests (3-5 critical flows) after every deploy
- Implement feature flags — deploy dark, no risk
- Target: weekly prod deploys, confidence increasing

**Phase 3: Reduce MTTR in parallel**
Current 3-day MTTR means: slow detection (no monitoring) + slow rollback + slow incident process.

- Add Prometheus + Grafana — detect via alert, not user complaints
- Write runbooks for top 5 alerts
- Practice rollback drill until it takes < 5 minutes
- Target: detect in < 5 min, recover in < 30 min

**Phase 4: Daily → multiple deploys**
- Canary deployments (automatic rollback on error spike)
- Remove remaining manual gates
- Make deployment boring — not a big event

**Measure and celebrate progress**: Publish DORA metrics on a team dashboard. Celebrate deployment frequency increasing. When deployment is safe and boring, you can deploy many times a day.`,
            },
          ],
        },
      ],
    },
  ],
};
