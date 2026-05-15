import { Track } from "./types";

export const awsTrack: Track = {
  id: "aws",
  title: "AWS for DevOps",
  description:
    "Master Amazon Web Services from CLI basics to production-grade architectures. Covers IAM, EC2, S3, VPC, RDS, Lambda, ECS/EKS, CloudFormation, CodePipeline, and security/cost management — with CLI commands throughout.",
  icon: "Cloud",
  color: "#f59e0b",
  gradient: "track-aws-gradient",
  level: "intermediate",
  estimatedHours: 36,
  modules: [
    // ─────────────────────────────────────────
    // MODULE 1 — Foundations & IAM
    // ─────────────────────────────────────────
    {
      id: "aws-foundations",
      title: "AWS Foundations & IAM",
      description: "Core AWS concepts, the CLI, and Identity & Access Management.",
      level: "beginner",
      lessons: [
        {
          id: "aws-global-infrastructure",
          title: "AWS Global Infrastructure",
          description: "Regions, Availability Zones, Edge Locations, and the shared responsibility model.",
          type: "lesson",
          duration: 12,
          objectives: [
            "Explain the difference between Regions and Availability Zones",
            "Choose the right region for a workload",
            "Describe the AWS shared responsibility model",
            "Navigate the AWS Management Console",
          ],
          content: `## AWS Global Infrastructure

AWS operates a global network of data centres grouped into **Regions** and **Availability Zones**.

---

## Regions

A **Region** is a geographic area containing multiple data centres. Each region is completely independent — data does not replicate between regions unless you explicitly configure it.

| Region | Code | Notes |
|---|---|---|
| US East (N. Virginia) | us-east-1 | Most services launch here first |
| US West (Oregon) | us-west-2 | Common DR pair for us-east-1 |
| EU (Ireland) | eu-west-1 | Most popular EU region |
| Asia Pacific (Singapore) | ap-southeast-1 | SEA hub |
| Asia Pacific (Mumbai) | ap-south-1 | India |

**How to choose a region:**
1. **Data residency** — legal requirements (GDPR → EU)
2. **Latency** — closest to your users
3. **Service availability** — new services launch in us-east-1 first
4. **Cost** — prices vary 10–30% between regions

---

## Availability Zones (AZs)

Each region has 2–6 **Availability Zones** — physically separate data centres within 60 miles of each other, connected by low-latency private fibre.

\`\`\`
us-east-1
├── us-east-1a  (data centre campus A)
├── us-east-1b  (data centre campus B)
├── us-east-1c  (data centre campus C)
└── us-east-1d  (data centre campus D)
\`\`\`

**Design for AZ failure:** Spread instances across ≥2 AZs. AWS SLA for multi-AZ deployments is 99.99%.

---

## Edge Locations & CloudFront

AWS has 400+ **edge locations** worldwide — Points of Presence (PoPs) used by:
- **CloudFront** (CDN) — cache content close to users
- **Route 53** (DNS) — answer DNS queries with low latency
- **AWS Shield** — absorb DDoS traffic

---

## Shared Responsibility Model

\`\`\`
AWS is responsible FOR the cloud:
├── Physical security of data centres
├── Network infrastructure
├── Hypervisor & hardware
└── Managed service software (RDS engine, Lambda runtime)

You are responsible IN the cloud:
├── Your data (encryption, backups)
├── OS patching (EC2 instances)
├── IAM users and permissions
├── Application code
├── Security group configuration
└── Network ACLs
\`\`\`

> **Tip:** A misconfigured S3 bucket is your responsibility, not AWS's. The majority of cloud breaches are customer-side misconfigurations, not AWS infrastructure failures.`,
          interviewQuestions: [
            {
              question: "What is the AWS shared responsibility model? Give examples of what AWS vs. the customer is responsible for.",
              difficulty: "junior" as const,
              answer: `AWS is responsible for "security OF the cloud" — the physical hardware, hypervisor, global network backbone, and managed service infrastructure. Customers are responsible for "security IN the cloud" — IAM policies, security group rules, OS patching on EC2, application code, data encryption, and S3 bucket policies.

The responsibility line moves based on service type:
- **EC2 (IaaS)**: You patch the OS, configure firewalls, manage the app
- **RDS (PaaS)**: AWS patches the database engine; you manage access, backups strategy, and parameter groups
- **Lambda (FaaS)**: AWS manages the runtime; you own the code and IAM execution role

**Classic customer mistakes** (not AWS's fault):
- Public S3 buckets with sensitive data
- Overly permissive IAM policies (AdministratorAccess for everything)
- Unpatched EC2 instances (AWS doesn't patch your guest OS)
- No encryption enabled on EBS volumes or RDS
- Secrets stored in EC2 user data or environment variables in plain text

The key insight: moving to cloud doesn't eliminate your security responsibilities — it shifts which layer you're responsible for.`,
            },
            {
              question: "Explain the difference between Regions, Availability Zones, and Edge Locations. How do you design for high availability?",
              difficulty: "junior" as const,
              answer: `**Region**: Geographic area with multiple data centers (e.g., us-east-1 in N. Virginia, eu-west-1 in Ireland). Each region is completely independent — no automatic failover between regions.

**Availability Zone (AZ)**: One or more data centers within a region with independent power, cooling, and networking. Physically separated but connected with low-latency links. Typical region has 3 AZs.

**Edge Location**: CloudFront CDN points of presence. 400+ globally. Cache content close to users. Not where you run compute.

**High availability design:**
\`\`\`
Single AZ: 1 failure point → total outage
Multi-AZ:  Lose 1 of 3 AZs → 67% capacity, no outage
Multi-Region: Lose entire region → failover to DR region (complex)
\`\`\`

**Practical HA patterns:**
- EC2: spread across 3 AZs using Auto Scaling Groups
- RDS: Multi-AZ deployment (synchronous standby, ~60s failover)
- ALB: automatically spans multiple AZs
- S3: automatically stores across 3+ AZs (no config needed)
- DynamoDB: Global Tables for multi-region active-active

**Design target:** Treat AZ failure as routine (it happens). Design for multi-AZ as baseline. Multi-region only when required by compliance (data sovereignty) or RTO/RPO requirements < 1 hour.`,
            },
          ],
        },
        {
          id: "aws-cli-setup",
          title: "AWS CLI Setup & Configuration",
          description: "Install, authenticate, and configure multiple AWS CLI profiles.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Install and configure the AWS CLI v2",
            "Configure named profiles for multiple accounts",
            "Use environment variables for CI authentication",
            "Query AWS resources with JMESPath and jq",
          ],
          content: `## AWS CLI Setup & Configuration

The AWS CLI is the most powerful tool for interacting with AWS — faster than the console and scriptable.

---

## Installation

\`\`\`bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip
sudo ./aws/install

# Verify
aws --version
# aws-cli/2.x.x Python/3.x.x ...
\`\`\`

---

## Initial Configuration

\`\`\`bash
aws configure
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: us-east-1
# Default output format [None]: json

# This creates:
# ~/.aws/credentials  (keys)
# ~/.aws/config       (region + output format)
\`\`\`

---

## Named Profiles (Multiple Accounts)

\`\`\`bash
# Configure a named profile
aws configure --profile production
aws configure --profile staging

# ~/.aws/credentials
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[production]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[staging]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

# Use a profile
aws s3 ls --profile production
export AWS_PROFILE=production  # set for the session
\`\`\`

---

## SSO Login (Recommended for Teams)

\`\`\`bash
# ~/.aws/config
[profile dev-account]
sso_start_url = https://myorg.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = us-east-1

# Login
aws sso login --profile dev-account
aws s3 ls --profile dev-account
\`\`\`

---

## Environment Variables (for CI)

\`\`\`bash
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"

# These override ~/.aws/credentials
aws sts get-caller-identity  # verify who you are
\`\`\`

---

## Querying with JMESPath & jq

\`\`\`bash
# List all EC2 instances with Name tag and state
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].{
    Name: Tags[?Key==\`Name\`]|[0].Value,
    ID: InstanceId,
    State: State.Name,
    Type: InstanceType,
    IP: PublicIpAddress
  }' \
  --output table

# Get just running instance IDs
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].InstanceId' \
  --output text

# List S3 buckets sorted by creation date (jq)
aws s3api list-buckets \
  | jq '.Buckets | sort_by(.CreationDate) | .[] | .Name'

# Check costs for last 7 days
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-08 \
  --granularity DAILY \
  --metrics BlendedCost \
  --query 'ResultsByTime[*].{Date:TimePeriod.Start,Cost:Total.BlendedCost.Amount}' \
  --output table
\`\`\`

---

## Useful CLI Tricks

\`\`\`bash
# Auto-complete
aws s3 <TAB><TAB>

# Paginate (auto-handles next tokens)
aws ec2 describe-instances --no-paginate  # dump all pages

# Dry run (check permissions without action)
aws ec2 run-instances --dry-run ...

# Wait for an operation to complete
aws ec2 wait instance-running --instance-ids i-1234567890abcdef0

# Get help for any command
aws s3 cp help
aws ec2 describe-instances help
\`\`\``,
        },
        {
          id: "iam-deep-dive",
          title: "IAM Deep Dive",
          description: "Users, groups, roles, policies, and least-privilege patterns.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create IAM users, groups, and roles via CLI",
            "Write custom IAM policies in JSON",
            "Assume IAM roles with STS",
            "Enforce MFA with IAM condition keys",
            "Use IAM Access Analyzer to find overly permissive policies",
          ],
          content: `## IAM Deep Dive

IAM (Identity and Access Management) controls *who* can do *what* to *which* AWS resources.

---

## Core Concepts

\`\`\`
Users    → individual people or service accounts (long-term credentials)
Groups   → collections of users sharing the same permissions
Roles    → assumed identities (EC2, Lambda, CI, cross-account)
Policies → JSON documents defining Allow/Deny rules
\`\`\`

**Always prefer Roles over Users for:**
- EC2 instances (instance profiles)
- Lambda functions
- GitHub Actions (OIDC)
- Cross-account access

---

## Creating IAM Resources via CLI

\`\`\`bash
# Create a user
aws iam create-user --user-name alice

# Create a group and add the user
aws iam create-group --group-name developers
aws iam add-user-to-group --user-name alice --group-name developers

# Create an access key for the user
aws iam create-access-key --user-name alice

# Enable console access (with password)
aws iam create-login-profile --user-name alice \
  --password "TempPass123!" \
  --password-reset-required

# List all users
aws iam list-users --query 'Users[*].{Name:UserName,Created:CreateDate}' --output table
\`\`\`

---

## Writing IAM Policies

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3AppBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::myapp-prod-data",
        "arn:aws:s3:::myapp-prod-data/*"
      ]
    },
    {
      "Sid": "DenyDeleteBucket",
      "Effect": "Deny",
      "Action": "s3:DeleteBucket",
      "Resource": "*"
    }
  ]
}
\`\`\`

\`\`\`bash
# Create and attach a policy
aws iam create-policy \
  --policy-name S3AppBucketAccess \
  --policy-document file://s3-policy.json

aws iam attach-group-policy \
  --group-name developers \
  --policy-arn arn:aws:iam::123456789012:policy/S3AppBucketAccess
\`\`\`

---

## IAM Roles

\`\`\`bash
# Create a role for EC2 instances
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
  --role-name EC2AppRole \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \
  --role-name EC2AppRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Create instance profile and associate
aws iam create-instance-profile --instance-profile-name EC2AppProfile
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2AppProfile \
  --role-name EC2AppRole
\`\`\`

---

## Assuming Roles with STS

\`\`\`bash
# Assume a role (cross-account or elevated)
aws sts assume-role \
  --role-arn "arn:aws:iam::999999999999:role/ProductionDeploy" \
  --role-session-name "deploy-session-$(date +%s)"

# Use the returned credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# Or configure in profile
aws configure --profile prod-deploy set role_arn arn:aws:iam::999999999999:role/ProductionDeploy
aws configure --profile prod-deploy set source_profile default
aws s3 ls --profile prod-deploy
\`\`\`

---

## Enforcing MFA

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "BoolIfExists": {
        "aws:MultiFactorAuthPresent": "false"
      }
    }
  }]
}
\`\`\`

---

## IAM Access Analyzer

\`\`\`bash
# Create an analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name account-analyzer \
  --type ACCOUNT

# List findings (publicly accessible resources)
aws accessanalyzer list-findings \
  --analyzer-arn arn:aws:access-analyzer:us-east-1:123456789012:analyzer/account-analyzer \
  --query 'findings[*].{Resource:resource,Type:resourceType,Status:status}' \
  --output table

# Generate least-privilege policy from CloudTrail events
aws accessanalyzer generate-policy \
  --trail-arn arn:aws:cloudtrail:us-east-1:123456789012:trail/my-trail
\`\`\`

> **Tip:** The AWS Security Reference Architecture (SRA) recommends a dedicated **security tooling account** with cross-account read access. Never run security tooling in the same account as production workloads.`,
          interviewQuestions: [
            {
              question: "What is the difference between an IAM role and an IAM user? When should you use each?",
              difficulty: "junior" as const,
              answer: `**IAM User**: A permanent identity with static credentials (access key ID + secret). Represents a person or a specific service that doesn't support role-based auth.

**IAM Role**: A temporary identity that's assumed by AWS services, users, or external identities. Issues short-lived STS tokens (15 minutes to 12 hours). No stored credentials.

**When to use roles (almost always):**
- EC2 instances needing to access S3/DynamoDB → attach an instance profile (role)
- Lambda functions → execution role
- ECS tasks → task role
- GitHub Actions → OIDC federation (no stored credentials at all)
- Cross-account access

**When IAM users are acceptable:**
- Human users (but prefer AWS SSO/IAM Identity Center)
- Legacy CI/CD systems that don't support OIDC

**Why roles are better:**
\`\`\`bash
# IAM User credentials: static, must be manually rotated, can be leaked in code
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # never expires unless you delete it

# Role credentials: temporary, auto-rotating
aws_session_token=IQoJ...  # expires in 1-12 hours
\`\`\`

**Best practice:** Zero long-lived access keys. Use IAM Identity Center for humans (SSO), OIDC for CI/CD (GitHub Actions, GitLab), and instance profiles/task roles for compute.`,
            },
            {
              question: "Explain IAM policy evaluation logic. How does AWS determine if a request is allowed or denied?",
              difficulty: "senior" as const,
              answer: `AWS policy evaluation is **deny by default** — a request must have explicit Allow and no explicit Deny to succeed.

**Evaluation order (all must pass):**
1. **SCP (Service Control Policy)** — Organizations guardrail, must allow the action
2. **Resource-based policy** — For same-account access, an explicit Allow here can be sufficient
3. **Identity-based policy** — Must Allow the action
4. **Permissions boundary** — Caps what identity-based policies can grant (intersection)
5. **Session policy** — Further restricts assumed-role sessions
6. **Explicit Deny** — Any explicit Deny anywhere = DENY (cannot be overridden)

**Key insight — explicit Deny is absolute:**
\`\`\`json
// SCP denies s3:DeleteObject organization-wide
// Even if an IAM admin policy allows s3:*, they cannot delete objects
// The SCP Deny wins
\`\`\`

**Cross-account access requires trust on BOTH sides:**
\`\`\`
Account A has IAM user → needs sts:AssumeRole permission in Account A
Account B has the role → trust policy must allow Account A to assume it
\`\`\`

**Permissions boundaries (for delegation):**
\`\`\`
Boundary allows: EC2, S3
IAM policy allows: EC2, S3, IAM
Effective permissions: EC2, S3 (intersection)
\`\`\`
Use case: Allow developers to create IAM roles for their services without them being able to grant themselves arbitrary permissions.

**Practical debugging:**
\`\`\`bash
# Use IAM Policy Simulator:
aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789:role/my-role \\
  --action-names s3:GetObject \\
  --resource-arns arn:aws:s3:::my-bucket/*
\`\`\``,
            },
          ],
        },
      ],
      exam: [
        { question: "A new developer on your team needs read-only access to S3 and EC2. What is the most secure IAM approach?", answer: "Create an IAM group with read-only managed policies for S3 and EC2 (AmazonS3ReadOnlyAccess, AmazonEC2ReadOnlyAccess), then add the user to that group. Never share root account credentials or attach policies directly to users — groups make permission management scalable.", difficulty: "junior" as const },
        { question: "An IAM user has an S3 full-access policy attached but still gets AccessDenied on a specific bucket. What are the likely causes?", answer: "1) A bucket policy on that S3 bucket explicitly denies the user or their account. 2) An SCP (Service Control Policy) at the organization level is blocking S3 access. 3) The bucket uses a resource-based policy that only allows specific principals. 4) The object is in a different account and the cross-account trust is misconfigured. Explicit Deny in any policy always wins.", difficulty: "mid" as const },
        { question: "You need to give an EC2 instance permission to write to an S3 bucket. How do you do this securely?", answer: "Create an IAM role with an S3 write policy, attach the role to the EC2 instance as an instance profile. The AWS SDK on the instance automatically retrieves temporary credentials from the instance metadata service (IMDS). Never hardcode access keys on EC2 instances — keys can be leaked via the filesystem or code repository.", difficulty: "junior" as const },
        { question: "Your company requires all AWS CLI operations to use MFA. How do you enforce this and how do developers get temporary credentials?", answer: "Add a Condition to IAM policies requiring aws:MultiFactorAuthPresent: true. Developers use 'aws sts get-session-token --serial-number arn:aws:iam::ACCOUNT:mfa/USERNAME --token-code 123456' to get temporary credentials (Access Key ID, Secret Key, Session Token) valid for up to 12 hours, then export them as environment variables or use aws configure with a named profile.", difficulty: "mid" as const },
        { question: "What is the AWS shared responsibility model and how does it affect EC2 vs RDS security?", answer: "AWS secures the infrastructure (hardware, network, hypervisor, physical facilities). For EC2 (IaaS), you own OS patching, application security, security group rules, and data encryption. For RDS (managed service), AWS patches the database engine and OS — you own network controls, IAM access, and encrypting data at rest/in transit. The higher the abstraction level, the less you manage.", difficulty: "junior" as const },
        { question: "A junior engineer accidentally deleted the wrong CloudFormation stack, removing production resources. What controls should have been in place?", answer: "1) Enable CloudFormation termination protection on production stacks. 2) Use IAM policies with Deny on cloudformation:DeleteStack for non-admin roles. 3) Add SCPs to prevent deletions in production accounts. 4) Separate production into its own AWS account (multi-account strategy). 5) Enable AWS Config to record all configuration changes and set up alerts for resource deletions.", difficulty: "senior" as const },
        { question: "How do you configure the AWS CLI to use different credentials for different projects?", answer: "Use named profiles in ~/.aws/credentials and ~/.aws/config. Run 'aws configure --profile myproject' to set up a profile, then use 'aws s3 ls --profile myproject' or set 'export AWS_PROFILE=myproject'. For cross-account access, create a profile with role_arn and source_profile so the CLI automatically assumes the role using STS.", difficulty: "junior" as const },
        { question: "An attacker gained access to an IAM access key. What immediate steps do you take?", answer: "1) Immediately deactivate the compromised key via IAM console or 'aws iam update-access-key --status Inactive'. 2) Check CloudTrail logs to identify all API calls made with that key. 3) Revoke any resources created by the attacker. 4) Check for unauthorized IAM users, roles, or policies created. 5) Delete the compromised key and create a new one. 6) Review and revoke any active sessions via sts:invalidate. 7) Rotate all other credentials as precaution.", difficulty: "senior" as const },
        { question: "What is the difference between an IAM role's trust policy and its permissions policy?", answer: "The trust policy (resource-based policy on the role) defines WHO can assume the role — it specifies trusted principals like EC2 service, another AWS account, or an OIDC provider. The permissions policy defines WHAT the role can do once assumed — which AWS actions and resources are allowed. Both must be configured correctly for cross-account or service access to work.", difficulty: "mid" as const },
        { question: "Your organization is expanding to three new AWS regions. How do you decide which region to use for each workload?", answer: "Evaluate: 1) Data residency — GDPR requires EU regions for EU personal data, HIPAA may require specific regions. 2) Latency — use latency-based routing tests or CloudPing to measure RTT to your users. 3) Service availability — check the AWS regional services list; newer services launch in us-east-1 first. 4) Cost — prices vary 10-30% between regions; use the AWS Pricing Calculator. 5) Disaster recovery — pair regions geographically (e.g., us-east-1 + us-west-2).", difficulty: "mid" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 2 — Compute
    // ─────────────────────────────────────────
    {
      id: "aws-compute",
      title: "Compute: EC2 & Lambda",
      description: "Virtual machines, auto scaling, and serverless functions.",
      level: "beginner",
      lessons: [
        {
          id: "ec2-fundamentals",
          title: "EC2 Fundamentals",
          description: "Launch, configure, and connect to EC2 instances. AMIs, key pairs, and user data.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Launch an EC2 instance via CLI with all required parameters",
            "Connect via SSH and Session Manager",
            "Create and use custom AMIs",
            "Configure Auto Scaling Groups with Launch Templates",
          ],
          content: `## EC2 Fundamentals

EC2 (Elastic Compute Cloud) provides resizable virtual machines in the cloud.

---

## Launching an Instance via CLI

\`\`\`bash
# Get the latest Amazon Linux 2023 AMI ID
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-*-x86_64" \
            "Name=state,Values=available" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' \
  --output text)

echo "Using AMI: \$AMI_ID"

# Create a key pair
aws ec2 create-key-pair \
  --key-name my-key \
  --query 'KeyMaterial' \
  --output text > my-key.pem
chmod 400 my-key.pem

# Launch an instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id \$AMI_ID \
  --instance-type t3.micro \
  --key-name my-key \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --iam-instance-profile Name=EC2AppProfile \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server},{Key=Env,Value=dev}]' \
  --user-data file://init.sh \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "Launched: \$INSTANCE_ID"

# Wait until running
aws ec2 wait instance-running --instance-ids \$INSTANCE_ID

# Get public IP
aws ec2 describe-instances \
  --instance-ids \$INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
\`\`\`

---

## User Data Script (Bootstrap)

\`\`\`bash
# init.sh — runs as root on first boot
#!/bin/bash
yum update -y
yum install -y nginx git

systemctl enable nginx
systemctl start nginx

# Install CloudWatch agent
yum install -y amazon-cloudwatch-agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -c ssm:/cloudwatch-config -s
\`\`\`

---

## Connecting to Instances

\`\`\`bash
# SSH (requires public IP + open port 22)
ssh -i my-key.pem ec2-user@<public-ip>

# Session Manager (no SSH, no open ports needed — preferred)
aws ssm start-session --target \$INSTANCE_ID

# Port forwarding via SSM (no bastion needed)
aws ssm start-session \
  --target \$INSTANCE_ID \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["5432"],"localPortNumber":["15432"]}'
# Now connect to localhost:15432 → forwards to RDS on port 5432
\`\`\`

---

## Creating a Custom AMI

\`\`\`bash
# Snapshot a running instance
AMI_ID=$(aws ec2 create-image \
  --instance-id \$INSTANCE_ID \
  --name "myapp-base-$(date +%Y%m%d)" \
  --description "Pre-configured app server" \
  --no-reboot \
  --query 'ImageId' \
  --output text)

aws ec2 wait image-available --image-ids \$AMI_ID
echo "AMI ready: \$AMI_ID"
\`\`\`

---

## Auto Scaling Groups

\`\`\`bash
# Create a Launch Template
aws ec2 create-launch-template \
  --launch-template-name my-app-lt \
  --version-description "v1" \
  --launch-template-data '{
    "ImageId": "ami-0123456789abcdef0",
    "InstanceType": "t3.small",
    "IamInstanceProfile": {"Name": "EC2AppProfile"},
    "SecurityGroupIds": ["sg-0123456789abcdef0"],
    "UserData": "'$(base64 -w0 init.sh)'"
  }'

# Create the Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-app-asg \
  --launch-template "LaunchTemplateName=my-app-lt,Version=\$Latest" \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-aaa,subnet-bbb" \
  --target-group-arns arn:aws:elasticloadbalancing:...

# Scale manually
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name my-app-asg \
  --desired-capacity 4
\`\`\`

---

## Common CLI Operations

\`\`\`bash
# Stop / start / terminate
aws ec2 stop-instances --instance-ids \$INSTANCE_ID
aws ec2 start-instances --instance-ids \$INSTANCE_ID
aws ec2 terminate-instances --instance-ids \$INSTANCE_ID

# List all instances in a table
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].{
    Name:Tags[?Key==\`Name\`]|[0].Value,
    ID:InstanceId,State:State.Name,Type:InstanceType,AZ:Placement.AvailabilityZone
  }' --output table

# Get instance type pricing
aws ec2 describe-spot-price-history \
  --instance-types t3.micro t3.small \
  --product-descriptions "Linux/UNIX" \
  --start-time $(date -u +"%Y-%m-%dT%H:%M:%S") \
  --query 'SpotPriceHistory[*].{Type:InstanceType,Price:SpotPrice,AZ:AvailabilityZone}' \
  --output table
\`\`\``,
        },
        {
          id: "lambda-serverless",
          title: "Lambda & Serverless",
          description: "Functions, triggers, layers, concurrency, and deploying with SAM.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Deploy a Lambda function via CLI",
            "Configure triggers (API Gateway, S3, SQS, EventBridge)",
            "Use Lambda Layers for shared dependencies",
            "Monitor Lambda with CloudWatch Logs and X-Ray",
          ],
          content: `## Lambda & Serverless

Lambda runs your code in response to events without provisioning servers. You pay per invocation and duration (rounded to 1ms).

---

## Deploying a Function via CLI

\`\`\`bash
# Create the function code
cat > index.mjs << 'EOF'
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };
};
EOF

# Package it
zip function.zip index.mjs

# Create the function
aws lambda create-function \
  --function-name my-api-handler \
  --runtime nodejs20.x \
  --role arn:aws:iam::123456789012:role/LambdaExecutionRole \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables='{DB_HOST=mydb.cluster.amazonaws.com,LOG_LEVEL=info}'

# Test invoke
aws lambda invoke \
  --function-name my-api-handler \
  --payload '{"key": "value"}' \
  --cli-binary-format raw-in-base64-out \
  response.json
cat response.json

# Update function code
zip function.zip index.mjs
aws lambda update-function-code \
  --function-name my-api-handler \
  --zip-file fileb://function.zip

# Publish a version
aws lambda publish-version --function-name my-api-handler

# Create an alias (for blue/green deployments)
aws lambda create-alias \
  --function-name my-api-handler \
  --name production \
  --function-version 5 \
  --routing-config AdditionalVersionWeights={"4"=0.1}  # 10% to v4, 90% to v5
\`\`\`

---

## Common Triggers

\`\`\`bash
# API Gateway trigger (HTTP endpoint)
aws apigatewayv2 create-api \
  --name my-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:123456789012:function:my-api-handler

# S3 trigger (process uploads)
aws s3api put-bucket-notification-configuration \
  --bucket my-uploads-bucket \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [{
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:process-upload",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {"Key": {"FilterRules": [{"Name": "suffix","Value": ".jpg"}]}}
    }]
  }'

# SQS trigger (message queue processing)
aws lambda create-event-source-mapping \
  --function-name process-orders \
  --event-source-arn arn:aws:sqs:us-east-1:123456789012:orders-queue \
  --batch-size 10 \
  --bisect-batch-on-function-error

# EventBridge rule (cron schedule)
aws events put-rule \
  --name daily-cleanup \
  --schedule-expression "cron(0 2 * * ? *)"  # 2 AM UTC daily

aws events put-targets \
  --rule daily-cleanup \
  --targets 'Id=cleanup-fn,Arn=arn:aws:lambda:us-east-1:123456789012:function:daily-cleanup'
\`\`\`

---

## Lambda Layers

Layers share code (libraries, runtimes, data) across functions.

\`\`\`bash
# Create a layer with node_modules
mkdir -p nodejs
npm install --prefix nodejs aws-sdk lodash
zip -r layer.zip nodejs/

aws lambda publish-layer-version \
  --layer-name shared-deps \
  --compatible-runtimes nodejs20.x \
  --zip-file fileb://layer.zip

# Attach the layer to a function
aws lambda update-function-configuration \
  --function-name my-api-handler \
  --layers arn:aws:lambda:us-east-1:123456789012:layer:shared-deps:1
\`\`\`

---

## Monitoring & Debugging

\`\`\`bash
# Tail live logs
aws logs tail /aws/lambda/my-api-handler --follow

# Get last 5 minutes of logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-api-handler \
  --start-time $(date -d '5 minutes ago' +%s)000 \
  --filter-pattern "ERROR"

# View concurrency metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name ConcurrentExecutions \
  --dimensions Name=FunctionName,Value=my-api-handler \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Maximum
\`\`\`

> **Tip:** Use **Provisioned Concurrency** for latency-sensitive APIs — it pre-warms Lambda instances and eliminates cold starts. Enable it for your \`production\` alias, not the function itself, so it doesn't slow deployments.`,
          interviewQuestions: [
            {
              question: "Explain Lambda cold starts — when do they happen and how do you minimize them?",
              difficulty: "mid" as const,
              answer: `A cold start happens when Lambda must initialize a new execution environment: first invocation after idle, concurrent requests beyond warm environments, or after deployment.

**Cold start anatomy:**
\`\`\`
Total = [Download code] + [Init runtime] + [Run init code] + [Handle request]
           ~50-200ms         ~100-500ms       Your code          ~1ms
\`\`\`

**Runtime comparison:** Python/Node.js: 100–300ms total. Java (JVM): 1–5 seconds. Go: 50–100ms.

**Mitigation strategies:**

1. **Provisioned Concurrency** — pre-warms N environments:
\`\`\`bash
aws lambda put-provisioned-concurrency-config \\
  --function-name my-api --qualifier prod \\
  --provisioned-concurrent-executions 10
# 10 always-warm environments. Cost: charged even when idle.
\`\`\`

2. **Lambda SnapStart (Java)** — snapshot of initialized JVM:
\`\`\`bash
aws lambda update-function-configuration \\
  --function-name my-java-fn \\
  --snap-start ApplyOn=PublishedVersions
# Reduces Java cold starts: 5s → ~200ms
\`\`\`

3. **Keep init code outside handler** — runs once per cold start:
\`\`\`python
import boto3
# This runs ONCE and is reused across warm invocations:
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('my-table')

def handler(event, context):
    return table.get_item(Key={'id': event['id']})
\`\`\`

4. **Small packages** — less code to download and parse
5. **Choose fast runtimes** — Python/Node.js/Go over Java for latency-sensitive

**Rule of thumb:** For synchronous APIs (ALB/API Gateway), cold starts matter. For async processing (SQS, S3 events), a 1s cold start is irrelevant.`,
            },
            {
              question: "When would you use Lambda vs. EC2 vs. ECS/Fargate for running application logic?",
              difficulty: "mid" as const,
              answer: `**Lambda:**
✅ Event-driven, sporadic traffic
✅ Short-duration tasks (< 15 min)
✅ Auto-scale to zero (no traffic = no cost)
✅ No server management
❌ Cold starts for latency-sensitive APIs
❌ 15-minute max execution time
❌ Limited to 10GB memory, 6 vCPUs

Use for: API handlers, file processing triggers, scheduled jobs, event fanout

**ECS/Fargate:**
✅ Consistent traffic patterns
✅ Long-running tasks
✅ Container workloads, predictable scaling
✅ No EC2 management (Fargate)
❌ Minimum billing unit is per-second (no scale-to-zero by default)

Use for: Microservices, web APIs with consistent load, batch jobs > 15 min, ML inference

**EC2:**
✅ Maximum control (GPU, specific instance types, bare metal)
✅ Lowest cost at scale (spot instances, reserved)
✅ Stateful workloads (databases, caches)
❌ You manage OS, patching, AMIs
❌ Manual scaling (with ASG but more complex)

Use for: Databases, high-compute ML training, workloads needing specific hardware, cost-optimized at scale

**Decision tree:**
- Sporadic/event-driven + < 15 min → Lambda
- Containers + consistent load → Fargate
- Need GPU/specific hardware or maximum cost efficiency → EC2`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your EC2 instance in a private subnet cannot reach the internet to download yum updates. What is likely wrong and how do you fix it?", answer: "The private subnet's route table is missing a route to a NAT Gateway (or NAT instance). Fix: 1) Ensure a NAT Gateway exists in a public subnet with an Elastic IP. 2) Add a route in the private subnet's route table: destination 0.0.0.0/0 → target nat-gw-id. 3) Verify the NAT Gateway's security group/NACL allows outbound traffic. Also check that the security group on the EC2 instance allows outbound HTTPS (port 443).", difficulty: "junior" as const },
        { question: "A production EC2 instance is showing 100% CPU for the last 30 minutes. Walk through your response.", answer: "1) Check CloudWatch metrics to confirm and see if it's a spike or sustained. 2) SSH in and run 'top' or 'htop' to identify the offending process. 3) Check application logs for errors or runaway loops. 4) If it's a web server, check connections: 'netstat -an | grep ESTABLISHED | wc -l'. 5) Consider horizontal scaling — add instances to the ASG manually or trigger a scale-out policy. 6) If needed, take a snapshot and terminate the instance after replacing it. 7) Post-incident: set CloudWatch alarm on CPU > 80% for 5 minutes to alert early next time.", difficulty: "mid" as const },
        { question: "Your Lambda function times out after 3 seconds on every invocation. What do you investigate first?", answer: "1) Check if the Lambda is making external HTTP/database calls — network latency is the most common cause. 2) Verify the function is not inside a VPC without a NAT Gateway — Lambda in a VPC needs NAT to reach the internet or VPC endpoints for AWS services. 3) Review the timeout setting — default is 3 seconds, max is 15 minutes; increase if the operation genuinely needs more time. 4) Add structured logging with timing around each operation to identify the slow section. 5) Check if connections are being reused (put DB connections outside the handler for reuse across invocations).", difficulty: "mid" as const },
        { question: "You need to run a long-running batch job that takes 2 hours. Should you use Lambda or EC2, and why?", answer: "EC2 (or AWS Batch/Fargate). Lambda has a hard limit of 15 minutes per invocation. For 2-hour jobs: use EC2 Spot Instances for cost efficiency (up to 90% cheaper than On-Demand), or AWS Batch which manages the EC2 fleet automatically. If the job can be broken into chunks under 15 minutes each, Lambda with SQS can work, but that requires redesigning the workflow. For simplicity, EC2 with a startup script or AWS Batch is the right choice.", difficulty: "junior" as const },
        { question: "An Auto Scaling Group is not launching new instances despite high CPU load. What are the possible causes?", answer: "1) Max capacity reached — ASG cannot exceed its maximum instance count. 2) EC2 service limit (vCPU quota) reached — request a limit increase in Service Quotas. 3) The Launch Template references an AMI that no longer exists or is in a different region. 4) The target subnet is out of IP addresses (check subnet available IP count). 5) The scaling policy cooldown period hasn't elapsed. 6) IAM role for the ASG doesn't have permissions to launch instances. 7) Spot interruptions — if using Spot, no capacity may be available in that AZ.", difficulty: "mid" as const },
        { question: "How do you deploy a new version of your application to EC2 with zero downtime?", answer: "Use a rolling deployment via an Application Load Balancer + Auto Scaling Group: 1) Create a new Launch Template version with the new AMI. 2) Update the ASG to use the new launch template. 3) Use 'aws autoscaling start-instance-refresh' with MinHealthyPercentage=100 to replace instances gradually. 4) The ASG launches new instances with the new version, waits for them to pass health checks, then terminates old ones. 5) Alternatively, use CodeDeploy with an In-Place or Blue/Green deployment strategy on EC2.", difficulty: "mid" as const },
        { question: "What EC2 purchasing options would you use for: a critical production API with steady traffic, a nightly batch job, and a 3-day load test?", answer: "Critical production API (steady traffic): Reserved Instances (1-year, all-upfront) — up to 40% savings vs On-Demand. Predictable baseline workload justifies commitment. Nightly batch job: Spot Instances — can handle interruptions since the job runs nightly and can restart; up to 90% savings. 3-day load test: On-Demand — no commitment needed, pay for exactly what you use, no risk of spot interruption during critical test window.", difficulty: "mid" as const },
        { question: "A Lambda function is working correctly in dev but failing with a permissions error in production. What do you check?", answer: "1) Compare the IAM execution roles between dev and prod Lambda functions — they are likely different. 2) Check if the resource (S3 bucket, DynamoDB table, SQS queue) in prod has a resource-based policy that restricts access. 3) Verify environment variables point to the correct prod resources. 4) Check if VPC configuration differs — prod Lambda may be in a VPC without access to the target service. 5) Review CloudWatch Logs for the exact error message (UnauthorizedAccess, AccessDenied) to identify which specific action is denied.", difficulty: "mid" as const },
        { question: "How do Lambda cold starts affect your application and what techniques reduce them?", answer: "Cold starts occur when Lambda initializes a new execution environment (download code, start runtime, run init code) — this adds 100ms–2s+ latency. Reduction strategies: 1) Provisioned Concurrency — pre-warms a set number of environments; eliminates cold starts for that concurrency level. 2) Keep functions warm with scheduled EventBridge pings (less reliable). 3) Reduce deployment package size — smaller zips initialize faster; use Lambda layers for dependencies. 4) Use languages with fast cold starts: Node.js and Python are faster than Java. 5) Move heavy initialization (DB connections, config loading) outside the handler so it's reused across invocations.", difficulty: "senior" as const },
        { question: "You need EC2 instances to automatically recover if the underlying host fails. How do you configure this?", answer: "Two approaches: 1) EC2 Auto Recovery — enable the 'Recover' CloudWatch alarm: create an alarm on StatusCheckFailed_System metric with action 'recover'. AWS migrates the instance to a healthy host preserving the instance ID, private IP, and EBS volumes. 2) Auto Scaling Group with min/desired capacity of 1 — if an instance becomes unhealthy, ASG terminates and replaces it. ASG is more resilient but creates a new instance (new instance ID). Use Auto Recovery for stateful single instances, ASG for stateless workloads.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 3 — Storage & Databases
    // ─────────────────────────────────────────
    {
      id: "aws-storage",
      title: "Storage & Databases",
      description: "S3, EBS, EFS, RDS, DynamoDB — the full AWS data tier.",
      level: "intermediate",
      lessons: [
        {
          id: "s3-deep-dive",
          title: "S3 Deep Dive",
          description: "Buckets, lifecycle policies, versioning, replication, presigned URLs, and cost optimisation.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Create and configure S3 buckets with security best practices",
            "Implement lifecycle policies and intelligent tiering",
            "Generate presigned URLs for temporary object access",
            "Configure cross-region replication",
            "Analyse S3 costs with Storage Lens",
          ],
          content: `## S3 Deep Dive

S3 (Simple Storage Service) provides object storage with 11 nines (99.999999999%) of durability.

---

## Creating a Secure Bucket

\`\`\`bash
# Create bucket
aws s3api create-bucket \
  --bucket my-app-data-$(aws sts get-caller-identity --query Account --output text) \
  --region us-east-1

# Block ALL public access (security baseline)
aws s3api put-public-access-block \
  --bucket my-app-data-123456789012 \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-app-data-123456789012 \
  --versioning-configuration Status=Enabled

# Enable default encryption (SSE-S3)
aws s3api put-bucket-encryption \
  --bucket my-app-data-123456789012 \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
      "BucketKeyEnabled": true
    }]
  }'

# Enable access logging
aws s3api put-bucket-logging \
  --bucket my-app-data-123456789012 \
  --bucket-logging-status '{
    "LoggingEnabled": {
      "TargetBucket": "my-access-logs",
      "TargetPrefix": "s3/my-app-data/"
    }
  }'
\`\`\`

---

## Common S3 Operations

\`\`\`bash
# Upload a file
aws s3 cp myfile.txt s3://my-bucket/path/myfile.txt

# Upload with storage class
aws s3 cp large-archive.zip s3://my-bucket/ \
  --storage-class INTELLIGENT_TIERING

# Sync a directory
aws s3 sync ./dist s3://my-bucket/app/ --delete

# Download
aws s3 cp s3://my-bucket/path/myfile.txt ./local/

# List objects with sizes
aws s3 ls s3://my-bucket/ --recursive --human-readable --summarize

# Copy between buckets
aws s3 cp s3://source-bucket/key s3://dest-bucket/key --source-region us-west-2

# Delete an object
aws s3 rm s3://my-bucket/path/old-file.txt

# Empty a bucket (required before deletion)
aws s3 rm s3://my-bucket/ --recursive
aws s3 rb s3://my-bucket
\`\`\`

---

## Lifecycle Policies

\`\`\`bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-app-data-123456789012 \
  --lifecycle-configuration '{
    "Rules": [
      {
        "ID": "transition-and-expire",
        "Status": "Enabled",
        "Filter": {"Prefix": "logs/"},
        "Transitions": [
          {"Days": 30, "StorageClass": "STANDARD_IA"},
          {"Days": 90, "StorageClass": "GLACIER_IR"},
          {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
        ],
        "Expiration": {"Days": 2555}
      },
      {
        "ID": "cleanup-old-versions",
        "Status": "Enabled",
        "Filter": {},
        "NoncurrentVersionExpiration": {"NoncurrentDays": 30}
      }
    ]
  }'
\`\`\`

---

## Presigned URLs

\`\`\`bash
# Generate a presigned URL (expires in 1 hour)
aws s3 presign s3://my-bucket/report.pdf --expires-in 3600

# Presigned POST URL for browser uploads (up to 5GB)
aws s3 presign s3://my-bucket/uploads/myfile.csv \
  --expires-in 900 \
  --method PUT

# With Python SDK (for custom conditions)
# aws s3api generate-presigned-post is better for browser uploads
\`\`\`

---

## Cross-Region Replication

\`\`\`bash
# Enable replication (both buckets must have versioning enabled)
aws s3api put-bucket-replication \
  --bucket source-bucket \
  --replication-configuration '{
    "Role": "arn:aws:iam::123456789012:role/S3ReplicationRole",
    "Rules": [{
      "Status": "Enabled",
      "Filter": {},
      "Destination": {
        "Bucket": "arn:aws:s3:::dest-bucket-us-west-2",
        "StorageClass": "STANDARD_IA"
      },
      "DeleteMarkerReplication": {"Status": "Enabled"}
    }]
  }'
\`\`\`

> **Tip:** Use **S3 Intelligent-Tiering** for data with unpredictable access patterns. It automatically moves objects between frequent and infrequent access tiers with no retrieval fees. For >90 days of storage, it almost always saves money over STANDARD.`,
          interviewQuestions: [
            {
              question: "An S3 bucket was accidentally made public. Walk me through your incident response.",
              difficulty: "mid" as const,
              answer: `**Immediate containment (first 2 minutes):**
\`\`\`bash
# Block all public access immediately:
aws s3api put-public-access-block \\
  --bucket exposed-bucket \\
  --public-access-block-configuration \\
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
\`\`\`

**Assessment — what was exposed?**
\`\`\`bash
# Check object ACLs and bucket policy:
aws s3api get-bucket-acl --bucket exposed-bucket
aws s3api get-bucket-policy --bucket exposed-bucket

# Audit what was accessed (requires logging to be enabled):
aws s3api get-bucket-logging --bucket exposed-bucket

# Check CloudTrail for GetObject events in the exposure window:
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=ResourceType,AttributeValue=AWS::S3::Object \\
  --start-time <exposure_start> --end-time <now> | \\
  jq '.Events[] | select(.EventName=="GetObject") | {user:.Username, object:.Resources[0].ResourceName}'
\`\`\`

**Remediation:**
1. Fix bucket policy — restrict to specific IAM roles only
2. Enable S3 server access logging (to detect future incidents)
3. Enable CloudTrail data events for S3 (GetObject, PutObject)
4. Enable AWS Config rule: s3-bucket-public-read-prohibited

**Organizational fix:**
\`\`\`bash
# Apply SCP to deny s3:PutBucketAcl with public-read:
# This prevents anyone in the org from making buckets public
aws organizations create-policy \\
  --type SERVICE_CONTROL_POLICY \\
  --name "DenyPublicS3" \\
  --content file://deny-public-s3.json
\`\`\`

**Notification:** If the bucket contained PII or sensitive data, assess GDPR/CCPA breach notification requirements.`,
            },
            {
              question: "Explain S3 storage classes and how to design a cost-effective lifecycle policy.",
              difficulty: "mid" as const,
              answer: `**S3 Storage Classes by use case:**

| Class | Retrieval | Min Duration | Price (GB/month) | Best For |
|-------|-----------|-------------|-----------------|----------|
| Standard | Instant | None | $0.023 | Frequently accessed |
| Intelligent-Tiering | Instant | None | $0.023 + monitoring | Unknown patterns |
| Standard-IA | Instant | 30 days | $0.0125 | Monthly access |
| Glacier Instant | Instant | 90 days | $0.004 | Quarterly access |
| Glacier Flexible | 3-5h | 90 days | $0.0036 | Yearly archive |
| Deep Archive | 12h | 180 days | $0.00099 | 7-year retention |

**Cost-effective lifecycle policy for application logs:**
\`\`\`json
{
  "Rules": [{
    "Status": "Enabled",
    "Filter": {"Prefix": "logs/"},
    "Transitions": [
      {"Days": 30, "StorageClass": "STANDARD_IA"},
      {"Days": 90, "StorageClass": "GLACIER_IR"},
      {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
    ],
    "Expiration": {"Days": 2555}
  }]
}
\`\`\`

**Savings example for 1TB of logs:**
- Without lifecycle: $23/month = $276/year
- With lifecycle: $23 for month 1, $12.50 months 2-3, $4 months 3-12, $1/year after that
- **Annual savings: ~70% after first year**

**Intelligent-Tiering tip:** Use for objects > 128KB that are accessed unpredictably. It automatically moves to cheaper tiers with no retrieval fees. Small per-object monitoring charge ($0.00025/1000 objects) makes it uneconomical for many small objects.`,
            },
          ],
        },
        {
          id: "rds-and-dynamodb",
          title: "RDS & DynamoDB",
          description: "Managed relational and NoSQL databases — provisioning, backups, and access patterns.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create an RDS Aurora cluster via CLI",
            "Configure Multi-AZ and read replicas",
            "Design a DynamoDB table with partition and sort keys",
            "Use DynamoDB Streams and GSIs",
          ],
          content: `## RDS & DynamoDB

AWS offers both managed relational (RDS/Aurora) and managed NoSQL (DynamoDB) databases.

---

## RDS Aurora Cluster

\`\`\`bash
# Create a subnet group (required for RDS)
aws rds create-db-subnet-group \
  --db-subnet-group-name my-db-subnets \
  --db-subnet-group-description "Private subnets for RDS" \
  --subnet-ids subnet-aaa subnet-bbb

# Create Aurora PostgreSQL cluster
aws rds create-db-cluster \
  --db-cluster-identifier my-aurora-cluster \
  --engine aurora-postgresql \
  --engine-version 15.4 \
  --master-username dbadmin \
  --master-user-password "$(openssl rand -base64 24)" \
  --db-subnet-group-name my-db-subnets \
  --vpc-security-group-ids sg-0123456789abcdef0 \
  --storage-encrypted \
  --backup-retention-period 7 \
  --deletion-protection \
  --enable-cloudwatch-logs-exports '["postgresql"]'

# Add a writer instance
aws rds create-db-instance \
  --db-instance-identifier my-aurora-writer \
  --db-cluster-identifier my-aurora-cluster \
  --db-instance-class db.r7g.large \
  --engine aurora-postgresql

# Add a read replica
aws rds create-db-instance \
  --db-instance-identifier my-aurora-reader \
  --db-cluster-identifier my-aurora-cluster \
  --db-instance-class db.r7g.large \
  --engine aurora-postgresql

# Wait for available
aws rds wait db-instance-available --db-instance-identifier my-aurora-writer

# Get connection endpoint
aws rds describe-db-clusters \
  --db-cluster-identifier my-aurora-cluster \
  --query 'DBClusters[0].{Writer:Endpoint,Reader:ReaderEndpoint,Port:Port}'
\`\`\`

---

## RDS Snapshots & Restore

\`\`\`bash
# Manual snapshot
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier my-aurora-cluster \
  --db-cluster-snapshot-identifier my-snapshot-$(date +%Y%m%d)

# Restore to a new cluster
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier my-restored-cluster \
  --snapshot-identifier my-snapshot-20240115 \
  --engine aurora-postgresql

# Point-in-time restore (to any second within backup window)
aws rds restore-db-cluster-to-point-in-time \
  --db-cluster-identifier my-pitr-cluster \
  --source-db-cluster-identifier my-aurora-cluster \
  --restore-to-time 2024-01-15T14:30:00Z
\`\`\`

---

## DynamoDB

DynamoDB is a fully managed key-value and document database with single-digit millisecond latency.

\`\`\`bash
# Create a table
aws dynamodb create-table \
  --table-name orders \
  --attribute-definitions \
    AttributeName=customerId,AttributeType=S \
    AttributeName=orderId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=customerId,KeyType=HASH \
    AttributeName=orderId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes '[{
    "IndexName": "CreatedAtIndex",
    "KeySchema": [
      {"AttributeName":"customerId","KeyType":"HASH"},
      {"AttributeName":"createdAt","KeyType":"RANGE"}
    ],
    "Projection": {"ProjectionType":"ALL"}
  }]' \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

# Put an item
aws dynamodb put-item \
  --table-name orders \
  --item '{
    "customerId": {"S": "cust-123"},
    "orderId": {"S": "ord-456"},
    "createdAt": {"S": "2024-01-15T10:00:00Z"},
    "total": {"N": "99.99"},
    "status": {"S": "pending"}
  }'

# Query by partition key
aws dynamodb query \
  --table-name orders \
  --key-condition-expression "customerId = :cid" \
  --expression-attribute-values '{":cid": {"S": "cust-123"}}' \
  --query 'Items[*].{OrderId:orderId.S,Status:status.S,Total:total.N}' \
  --output table

# Query with sort key range
aws dynamodb query \
  --table-name orders \
  --index-name CreatedAtIndex \
  --key-condition-expression "customerId = :cid AND createdAt BETWEEN :start AND :end" \
  --expression-attribute-values '{
    ":cid": {"S": "cust-123"},
    ":start": {"S": "2024-01-01"},
    ":end": {"S": "2024-01-31"}
  }'

# Update an item
aws dynamodb update-item \
  --table-name orders \
  --key '{"customerId": {"S": "cust-123"}, "orderId": {"S": "ord-456"}}' \
  --update-expression "SET #s = :newStatus" \
  --expression-attribute-names '{"#s": "status"}' \
  --expression-attribute-values '{":newStatus": {"S": "shipped"}}'
\`\`\`

> **Tip:** The most important DynamoDB design decision is choosing the right partition key. A poor partition key (like a date or boolean) creates "hot partitions" that throttle. Use high-cardinality keys (user ID, order ID) and add a random suffix if you need to spread writes across items with the same key.`,
          interviewQuestions: [
            {
              question: "When would you choose DynamoDB over RDS, and what are the access pattern implications?",
              difficulty: "mid" as const,
              answer: `**Choose DynamoDB when:**
- Scale > 10 million items or > 10,000 requests/second
- Data access patterns are known and consistent (key-value or simple queries)
- Auto-scaling to zero or infinite required
- Fully managed, no connection management needed
- Multi-region replication required (Global Tables)
- You can model your data around the access patterns

**Choose RDS when:**
- Complex queries with JOINs, aggregations, window functions
- ACID transactions across multiple tables/rows are critical
- Schema flexibility needed (ALTER TABLE is acceptable)
- Team is familiar with SQL
- Data model isn't fully known upfront

**The DynamoDB trap:**
DynamoDB is excellent but requires designing your data model around access patterns FIRST — opposite of relational design. If you try to query DynamoDB like a relational DB, you'll pay for full table scans or struggle with filter expressions.

\`\`\`
Relational: Design normalized schema, write queries as needed
DynamoDB: Know your queries, design the table to serve them efficiently
\`\`\`

**DynamoDB table design example:**
\`\`\`
Access patterns: Get order by orderId, Get all orders by userId
Single-table design:
PK=USER#userId, SK=ORDER#orderId → GetItem (single order)
Query PK=USER#userId → all orders for user
\`\`\`

**Anti-patterns:**
- Using DynamoDB like a relational DB (filter by non-key attributes)
- Using status as partition key (hot partition: all "pending" orders → same partition)
- Scan operations in production (full table scan = expensive)`,
            },
          ],
        },
      ],
      exam: [
        { question: "An S3 bucket was accidentally made public. What immediate steps do you take, and how do you prevent it in future?", answer: "Immediate: 1) Enable S3 Block Public Access at the account level — this overrides all bucket and object ACLs. 2) Remove any bucket policy statements with Principal: '*'. 3) Check CloudTrail to identify what data was accessed. 4) Check if any object-level ACLs grant public access. Prevention: Enable 'S3 Account-Level Block Public Access' via AWS Organizations SCP, use AWS Config rule 's3-bucket-public-read-prohibited' to alert on violations, and enable S3 Access Analyzer.", difficulty: "mid" as const },
        { question: "How do you prevent data exposure when sharing an S3 bucket URL temporarily with an external partner?", answer: "Use presigned URLs: 'aws s3 presign s3://my-bucket/file.pdf --expires-in 3600'. The URL is time-limited (max 7 days for IAM user credentials, or longer with assumed role). The bucket itself stays private — no public policy needed. For large file sets, use presigned POST for uploads. For ongoing access, create a dedicated IAM user with scoped permissions or use S3 Access Points to isolate access per consumer.", difficulty: "junior" as const },
        { question: "Your application reads from an RDS MySQL database but response times are slow during peak hours. What do you investigate and fix?", answer: "1) Check RDS Performance Insights — identify long-running queries and wait events. 2) Look for missing indexes: run EXPLAIN on slow queries. 3) Check CPU, memory, and IOPS in CloudWatch — you may be hitting instance limits. 4) Add a Read Replica and route read traffic there (separate read from write endpoints in your application). 5) Implement connection pooling with RDS Proxy to reduce connection overhead (Lambda especially exhausts connections). 6) Consider caching layer: ElastiCache Redis for frequently-read, rarely-changing data.", difficulty: "mid" as const },
        { question: "You need to migrate a 5TB MySQL database to RDS with minimal downtime. What strategy do you use?", answer: "Use AWS Database Migration Service (DMS): 1) Create RDS target instance. 2) Run a full load to copy existing data. 3) Enable CDC (Change Data Capture) to replicate ongoing changes while full load runs. 4) Monitor replication lag — wait until it's near zero. 5) During a brief maintenance window, stop writes to source, let CDC catch up, then cut over by updating application connection strings. 6) Keep source running for 24-48 hours as rollback option. DMS handles schema conversion for heterogeneous migrations (e.g., Oracle → PostgreSQL) via SCT (Schema Conversion Tool).", difficulty: "senior" as const },
        { question: "A DynamoDB table's read costs are unexpectedly high. You suspect inefficient queries. How do you identify and fix them?", answer: "1) Enable DynamoDB Contributor Insights to identify the most-accessed and throttled keys. 2) Check for Scan operations — a full table scan reads every item and is very expensive; replace with Query using partition key or add GSIs for your access patterns. 3) Check ConsumedReadCapacityUnits in CloudWatch — high values indicate large reads. 4) Use ProjectionExpression to return only needed attributes. 5) Add a GSI for non-primary-key query patterns instead of filtering. 6) Enable DAX (DynamoDB Accelerator) for read-heavy workloads to cache results.", difficulty: "mid" as const },
        { question: "What is the difference between S3 Standard, Standard-IA, and Glacier, and how do you choose the right tier?", answer: "S3 Standard: Frequent access (multiple times/month), highest cost per GB, lowest retrieval cost. Good for active data. Standard-IA (Infrequent Access): Accessed less than once/month. ~40% cheaper storage but charges per GB retrieved. Good for backups and disaster recovery data accessed occasionally. Glacier Instant Retrieval: Archival data accessed once a quarter, millisecond retrieval. Glacier Deep Archive: Long-term compliance data accessed once/year or less, retrieval in 12 hours. Use S3 Lifecycle policies to automatically transition objects as they age (e.g., move to IA after 30 days, Glacier after 90 days).", difficulty: "junior" as const },
        { question: "How do you ensure an RDS instance is highly available and recovers automatically from an AZ failure?", answer: "Enable Multi-AZ deployment when creating or modifying the RDS instance. AWS maintains a synchronous standby replica in a different AZ. On primary failure, RDS automatically promotes the standby (60-120 seconds typically) and updates the DNS endpoint. Your application connection string stays the same — it points to the endpoint, not a specific IP. For read scaling, additionally create Read Replicas (these are async and don't provide automatic failover). Always set the connection string to use the RDS endpoint, not the IP address.", difficulty: "mid" as const },
        { question: "Your S3 lifecycle policy isn't transitioning objects to Glacier as expected. What do you check?", answer: "1) Objects must be at least 128KB for Standard-IA transitions (smaller objects cost more in IA than Standard). 2) Check the filter in the lifecycle rule — it may only apply to a specific prefix or tag, not all objects. 3) The transition may be pending — AWS processes lifecycle rules once daily and with a 24-hour delay. 4) Versioned objects: lifecycle rules for versioned buckets require separate rules for current vs noncurrent versions. 5) Objects uploaded by multipart upload that weren't completed may not transition. 6) Verify the rule is 'Enabled', not 'Disabled'.", difficulty: "mid" as const },
        { question: "A Lambda function needs to query DynamoDB. What is the most efficient connection pattern?", answer: "Initialize the DynamoDB client outside the Lambda handler function (in the global scope). On warm invocations, Lambda reuses the same execution environment, so the client is already initialized and connections are reused. Inside the handler, only perform the actual query. For very high-throughput Lambdas hitting DynamoDB, enable DAX with a cluster endpoint and use the DAX client — DAX caches reads and dramatically reduces DynamoDB read costs and latency for repeated queries.", difficulty: "mid" as const },
        { question: "How do you implement disaster recovery for an RDS database with an RPO of 1 hour and RTO of 4 hours?", answer: "RPO 1 hour: Enable automated backups with 1-hour backup window, or enable continuous backups with Point-In-Time Recovery (PITR) which captures changes every 5 minutes — actually gives you ~5 minute RPO. RTO 4 hours: Keep a Read Replica in a secondary region (cross-region replica). In a disaster, manually promote the replica to a primary (takes minutes) and update application configs. Multi-AZ alone doesn't meet cross-region DR. For faster RTO, use RDS Global Database which reduces promotion to under 1 minute. Test DR procedures quarterly — document and automate the runbook.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 4 — Networking
    // ─────────────────────────────────────────
    {
      id: "aws-networking",
      title: "VPC & Networking",
      description: "VPCs, subnets, security groups, NAT gateways, VPC peering, and Route 53.",
      level: "intermediate",
      lessons: [
        {
          id: "vpc-fundamentals",
          title: "VPC Design & Security Groups",
          description: "Build a production-grade VPC with public/private subnets, NAT, and security group rules.",
          type: "lesson",
          duration: 24,
          objectives: [
            "Create a VPC with public and private subnets across two AZs",
            "Configure Internet Gateway, NAT Gateway, and route tables",
            "Write precise security group rules",
            "Implement VPC Flow Logs for network visibility",
          ],
          content: `## VPC Design & Security Groups

A VPC (Virtual Private Cloud) is your private network in AWS. Good VPC design is the foundation of cloud security.

---

## Standard 3-Tier VPC Architecture

\`\`\`
Internet
    │
 [IGW]
    │
 Public Subnets (10.0.0.0/24, 10.0.1.0/24)
    │  Load Balancers, NAT Gateways, Bastion (or none)
    │
[NAT GW]
    │
 Private App Subnets (10.0.10.0/24, 10.0.11.0/24)
    │  EC2, ECS tasks, Lambda (in VPC)
    │
 Private DB Subnets (10.0.20.0/24, 10.0.21.0/24)
       RDS, ElastiCache, DynamoDB endpoints
\`\`\`

---

## Creating the VPC via CLI

\`\`\`bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-prod-vpc}]' \
  --query 'Vpc.VpcId' --output text)

# Enable DNS hostnames
aws ec2 modify-vpc-attribute --vpc-id \$VPC_ID --enable-dns-hostnames

# Create public subnets (2 AZs)
PUB_SN_1=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.0.0/24 --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
PUB_SN_2=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.1.0/24 --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)

# Create private subnets
PRI_SN_1=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.10.0/24 --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' --output text)
PRI_SN_2=$(aws ec2 create-subnet --vpc-id \$VPC_ID \
  --cidr-block 10.0.11.0/24 --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' --output text)

# Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id \$IGW_ID --vpc-id \$VPC_ID

# Public route table
PUB_RT=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id \$IGW_ID
aws ec2 associate-route-table --route-table-id \$PUB_RT --subnet-id \$PUB_SN_1
aws ec2 associate-route-table --route-table-id \$PUB_RT --subnet-id \$PUB_SN_2

# NAT Gateway (one per AZ for HA, one for cost savings)
EIP=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_ID=$(aws ec2 create-nat-gateway \
  --subnet-id \$PUB_SN_1 \
  --allocation-id \$EIP \
  --query 'NatGateway.NatGatewayId' --output text)
aws ec2 wait nat-gateway-available --nat-gateway-ids \$NAT_ID

# Private route table → NAT
PRI_RT=$(aws ec2 create-route-table --vpc-id \$VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id \$PRI_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id \$NAT_ID
aws ec2 associate-route-table --route-table-id \$PRI_RT --subnet-id \$PRI_SN_1
aws ec2 associate-route-table --route-table-id \$PRI_RT --subnet-id \$PRI_SN_2
\`\`\`

---

## Security Groups

\`\`\`bash
# ALB security group — public internet
ALB_SG=$(aws ec2 create-security-group \
  --group-name alb-sg --description "ALB inbound" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$ALB_SG \
  --ip-permissions \
    'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]' \
    'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]'

# App security group — only from ALB
APP_SG=$(aws ec2 create-security-group \
  --group-name app-sg --description "App instances" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$APP_SG \
  --protocol tcp --port 3000 --source-group \$ALB_SG

# DB security group — only from app tier
DB_SG=$(aws ec2 create-security-group \
  --group-name db-sg --description "RDS instances" \
  --vpc-id \$VPC_ID --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id \$DB_SG \
  --protocol tcp --port 5432 --source-group \$APP_SG
\`\`\`

---

## VPC Flow Logs

\`\`\`bash
# Create CloudWatch Log Group
aws logs create-log-group --log-group-name /aws/vpc/flowlogs

# Enable flow logs
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids \$VPC_ID \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs \
  --deliver-logs-permission-arn arn:aws:iam::123456789012:role/VPCFlowLogsRole

# Query rejected traffic (Insights)
aws logs start-query \
  --log-group-name /aws/vpc/flowlogs \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, srcAddr, dstAddr, dstPort, action | filter action = "REJECT" | sort @timestamp desc | limit 20'
\`\`\`

> **Tip:** Enable **VPC Endpoints** for services like S3 and DynamoDB. Traffic uses the AWS private network instead of going through the NAT Gateway, which saves both cost and latency. A single S3 VPC endpoint can eliminate thousands of dollars in NAT Gateway data processing charges per month.`,
          interviewQuestions: [
            {
              question: "Design a VPC for a 3-tier web application deployed across 3 Availability Zones.",
              difficulty: "senior" as const,
              answer: `**VPC CIDR:** 10.0.0.0/16 (65,536 IPs — plenty of room to grow)

**Subnet design (3 tiers × 3 AZs = 9 subnets):**
\`\`\`
               AZ-1a            AZ-1b            AZ-1c
Public:    10.0.1.0/24     10.0.2.0/24     10.0.3.0/24   (ALB, NAT GW)
App:       10.0.11.0/24    10.0.12.0/24    10.0.13.0/24  (EC2/ECS)
Database:  10.0.21.0/24    10.0.22.0/24    10.0.23.0/24  (RDS, ElastiCache)
\`\`\`

**Routing:**
- Public subnets → Internet Gateway (IGW)
- App subnets → NAT Gateway per AZ (for outbound internet, resilient to AZ failure)
- DB subnets → No internet route (isolated)

**Security Groups (stateful, preferred control):**
\`\`\`
ALB-SG:  inbound 80/443 from 0.0.0.0/0
App-SG:  inbound 8080 from ALB-SG only
DB-SG:   inbound 5432 from App-SG only
\`\`\`

**NACLs:** Subnet-level backstop. Use to block known bad CIDRs or add compliance layer. Stateless — must allow both inbound and outbound (including ephemeral ports 1024-65535 for return traffic).

**Cost considerations:**
- NAT Gateway: $0.045/hr + $0.045/GB data — expensive at scale
- VPC Endpoints for S3/DynamoDB eliminate NAT Gateway charges for those services
- Private subnet → public S3 → NAT = expensive; VPC Endpoint = free

**Terraform module:** Use terraform-aws-modules/vpc/aws — well-tested, handles all the routing/subnet complexity.`,
            },
            {
              question: "What is the difference between a Security Group and a Network ACL? When does each apply?",
              difficulty: "mid" as const,
              answer: `**Security Groups:**
- **Stateful** — return traffic automatically allowed
- Attached to **ENIs** (EC2, RDS, Lambda in VPC, etc.)
- Only **Allow** rules (no explicit deny)
- Default: deny all inbound, allow all outbound
- Evaluated at the resource level

**Network ACLs:**
- **Stateless** — must explicitly allow both inbound AND outbound (including return traffic on ephemeral ports 1024-65535)
- Attached to **subnets** — affects all resources in the subnet
- Both **Allow and Deny** rules
- Rules evaluated in number order (lowest first, first match wins)
- Default VPC NACL: allow all

**Evaluation order:**
Traffic hits NACL first (subnet boundary), then Security Group (resource boundary).

**When to use which:**
- **Security Groups** = primary security control (always)
- **NACLs** = supplement for subnet-level blocking:
  - Block a known malicious IP attacking your entire subnet
  - Compliance requirement for network-level isolation
  - Defense in depth (extra layer if SG misconfigured)

**The stateless NACL gotcha:**
\`\`\`
# NACL rule allows inbound HTTP (port 80):
ALLOW TCP 0.0.0.0/0 80 INBOUND ✓

# But response traffic uses ephemeral ports (1024-65535):
# If you don't have this outbound rule, responses are blocked!
ALLOW TCP 0.0.0.0/0 1024-65535 OUTBOUND ✓
\`\`\`
Security groups handle this automatically — with NACLs, you must do it manually.`,
            },
          ],
        },
      ],
      exam: [
        { question: "You launch an EC2 instance in a public subnet but cannot SSH into it. What do you check?", answer: "1) Security group inbound rules — must allow TCP port 22 from your IP (or 0.0.0.0/0 for open access). 2) The subnet must have 'auto-assign public IP' enabled, or the instance needs an Elastic IP. 3) The route table for the subnet must have a route 0.0.0.0/0 → Internet Gateway. 4) The Internet Gateway must be attached to the VPC. 5) The key pair used to launch must match the .pem file you're using. 6) Network ACLs — check they allow inbound port 22 AND outbound ephemeral ports (1024-65535).", difficulty: "junior" as const },
        { question: "Two microservices in different VPCs need to communicate privately without traversing the internet. What are your options?", answer: "1) VPC Peering — direct private connectivity between two VPCs (same or different accounts/regions). Non-transitive: A-B and B-C doesn't let A reach C. 2) AWS Transit Gateway — hub-and-spoke model connecting many VPCs through a central gateway; supports transitive routing. 3) AWS PrivateLink — expose a service via a VPC endpoint; only the service is accessible, not the entire VPC. Best for: VPC Peering for simple 2-VPC cases, Transit Gateway for 3+ VPCs, PrivateLink for SaaS-style service exposure.", difficulty: "mid" as const },
        { question: "Your application in a private subnet is making API calls to S3 and the NAT Gateway costs are very high. How do you reduce them?", answer: "Create an S3 VPC Gateway Endpoint: 'aws ec2 create-vpc-endpoint --vpc-id vpc-xxx --service-name com.amazonaws.us-east-1.s3 --type Gateway --route-table-ids rtb-yyy'. Traffic to S3 routes through the endpoint instead of the NAT Gateway — no data transfer charges. Gateway endpoints are free. Similarly, create DynamoDB Gateway Endpoints for DynamoDB traffic. For other AWS services (SSM, ECR, Secrets Manager), use Interface Endpoints (PrivateLink) — these have an hourly cost but eliminate NAT data charges for high-volume traffic.", difficulty: "mid" as const },
        { question: "Explain the difference between a Security Group and a Network ACL, and when you would use each.", answer: "Security Groups: Stateful (return traffic is automatically allowed), operate at the instance/ENI level, support allow rules only, evaluate all rules together. NACLs: Stateless (must explicitly allow return traffic including ephemeral ports), operate at the subnet level, support both allow and deny rules, process rules in numeric order (lowest first). Use Security Groups as your primary defense for controlling instance-level access. Use NACLs for: blocking a specific IP or CIDR across the whole subnet, compliance requirements for network-level controls, or as a defense-in-depth layer if security groups are misconfigured.", difficulty: "mid" as const },
        { question: "A Route 53 health check is failing and traffic is not routing to your backup region. What do you investigate?", answer: "1) Verify the health check endpoint is accessible from Route 53 health checkers' IP ranges (they are well-known; add them to security groups). 2) Check if the health check is HTTP vs HTTPS — a mismatch causes failures. 3) Verify the expected response string matches what the endpoint returns. 4) Check if the primary record in Route 53 has a health check associated — only records with health checks can fail over. 5) Confirm the failover policy is set correctly: primary record with health check, secondary record as failover. 6) Check the backup region's resources are healthy and the DNS record points to the correct endpoint.", difficulty: "senior" as const },
        { question: "How would you design a VPC for a multi-tier application with web, app, and database layers?", answer: "Three-tier VPC across 2+ AZs: Public subnets (10.0.0.0/24, 10.0.1.0/24) — contain ALB and NAT Gateways only. Private app subnets (10.0.2.0/24, 10.0.3.0/24) — EC2/ECS containers, route to NAT Gateway for outbound internet. Private database subnets (10.0.4.0/24, 10.0.5.0/24) — RDS, ElastiCache, no internet access. Security groups: ALB allows 80/443 from internet. App servers allow only from ALB SG. Database allows only from App SG on the DB port. This prevents database exposure even if the app layer is compromised.", difficulty: "mid" as const },
        { question: "What is CIDR and how do you plan IP address space for a growing AWS environment?", answer: "CIDR (Classless Inter-Domain Routing) defines IP ranges: /16 = 65,536 IPs, /24 = 256 IPs, /28 = 16 IPs (minimum for AWS subnets — AWS reserves 5 per subnet). Planning: Use a /16 per VPC (e.g., 10.0.0.0/16) to allow many subnets. Reserve non-overlapping ranges per environment: prod 10.0.0.0/16, staging 10.1.0.0/16, dev 10.2.0.0/16. Non-overlapping ranges are critical for VPC peering and Transit Gateway (overlapping CIDRs cannot be peered). Use /24 subnets per AZ per tier — they're easy to reason about (251 usable IPs) and you can split later.", difficulty: "mid" as const },
        { question: "An EC2 instance in a private subnet needs to make outbound HTTPS calls but you don't have a NAT Gateway. What are the alternatives?", answer: "1) NAT Gateway — the standard solution; deploy one in each public subnet per AZ for HA. 2) NAT Instance — an EC2 instance configured as a NAT; cheaper but you manage it; single point of failure unless you configure failover. 3) VPC Endpoints (Interface or Gateway) — for AWS services (S3, DynamoDB, SSM, ECR, etc.) use endpoints to avoid needing NAT entirely. 4) IPv6 with Egress-Only Internet Gateway — provides outbound-only internet access for IPv6 addresses, no inbound allowed. For most cases: deploy NAT Gateway in prod, use VPC endpoints for AWS services to minimize NAT traffic.", difficulty: "mid" as const },
        { question: "How does Route 53 latency-based routing work, and how is it different from geolocation routing?", answer: "Latency-based routing: Route 53 measures actual latency from the user's DNS resolver to each AWS region endpoint. Requests are routed to the region with the lowest measured latency. This is dynamic and considers real network conditions, not just geography. Geolocation routing: Routes based on the geographic location of the DNS query source (by continent, country, or US state). Used for content localization, regulatory compliance, or language-specific content. A user in Germany is routed to eu-west-1 regardless of latency. Key difference: latency-based optimizes for performance, geolocation controls WHERE requests go. You can combine both using traffic policies.", difficulty: "senior" as const },
        { question: "You need to allow an EC2 instance to access the AWS Systems Manager (SSM) API without opening port 22. How do you configure this?", answer: "1) Attach an IAM role to the EC2 instance with the AmazonSSMManagedInstanceCore policy. 2) For instances in private subnets without internet access, create VPC Interface Endpoints for: com.amazonaws.region.ssm, com.amazonaws.region.ssmmessages, com.amazonaws.region.ec2messages. 3) Enable DNS resolution for the VPC endpoints. Now 'aws ssm start-session --target i-xxxxx' connects via SSM Session Manager — no bastion host, no port 22, all traffic stays within AWS network. Audit all sessions via CloudTrail.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 5 — Containers
    // ─────────────────────────────────────────
    {
      id: "aws-containers",
      title: "Containers: ECR, ECS & EKS",
      description: "Container registry, managed container orchestration, and Kubernetes on AWS.",
      level: "intermediate",
      lessons: [
        {
          id: "ecr-and-ecs",
          title: "ECR & ECS Fargate",
          description: "Push images to ECR and deploy containerised workloads with ECS Fargate.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Create an ECR repository and push a Docker image",
            "Define ECS task definitions and services",
            "Deploy to ECS Fargate with an ALB",
            "Configure ECS service auto scaling",
          ],
          content: `## ECR & ECS Fargate

ECR (Elastic Container Registry) stores Docker images. ECS (Elastic Container Service) runs them without managing servers when using the Fargate launch type.

---

## ECR — Push an Image

\`\`\`bash
# Create repository
aws ecr create-repository \
  --repository-name myapp \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Get the registry URI
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
REGISTRY=\$ACCOUNT.dkr.ecr.\$REGION.amazonaws.com

# Login
aws ecr get-login-password --region \$REGION \
  | docker login --username AWS --password-stdin \$REGISTRY

# Build, tag, push
docker build -t myapp:v1.0.0 .
docker tag myapp:v1.0.0 \$REGISTRY/myapp:v1.0.0
docker push \$REGISTRY/myapp:v1.0.0

# List images
aws ecr describe-images \
  --repository-name myapp \
  --query 'imageDetails[*].{Tag:imageTags[0],Pushed:imagePushedAt,Size:imageSizeInBytes}' \
  --output table

# ECR lifecycle policy (keep last 10 tagged images)
aws ecr put-lifecycle-policy \
  --repository-name myapp \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 production images",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["v"],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {"type": "expire"}
    }]
  }'
\`\`\`

---

## ECS Task Definition

\`\`\`bash
aws ecs register-task-definition --cli-input-json '{
  "family": "myapp",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/myapp-task-role",
  "containerDefinitions": [{
    "name": "myapp",
    "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0",
    "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
    "environment": [
      {"name": "NODE_ENV", "value": "production"}
    ],
    "secrets": [
      {"name": "DB_PASSWORD", "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/myapp/db_password"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/myapp",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    }
  }]
}'
\`\`\`

---

## ECS Service + ALB

\`\`\`bash
# Create ECS cluster
aws ecs create-cluster --cluster-name production

# Create service
aws ecs create-service \
  --cluster production \
  --service-name myapp \
  --task-definition myapp:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration '{
    "awsvpcConfiguration": {
      "subnets": ["subnet-aaa","subnet-bbb"],
      "securityGroups": ["sg-app"],
      "assignPublicIp": "DISABLED"
    }
  }' \
  --load-balancers '[{
    "targetGroupArn": "arn:aws:elasticloadbalancing:...",
    "containerName": "myapp",
    "containerPort": 3000
  }]' \
  --deployment-configuration '{
    "minimumHealthyPercent": 50,
    "maximumPercent": 200,
    "deploymentCircuitBreaker": {"enable": true, "rollback": true}
  }'

# Update the service (rolling deploy)
aws ecs update-service \
  --cluster production \
  --service myapp \
  --task-definition myapp:2  # new version
\`\`\`

---

## ECS Auto Scaling

\`\`\`bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/production/myapp \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 20

# Scale on CPU utilisation
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/production/myapp \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 60.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleInCooldown": 300,
    "ScaleOutCooldown": 60
  }'
\`\`\`

> **Tip:** Enable ECS **deployment circuit breaker** (shown above). It automatically rolls back a bad deployment if tasks fail to reach RUNNING state, saving you from manually rolling back at 3 AM.`,
          interviewQuestions: [
            {
              question: "ECS Fargate vs. ECS on EC2 — when do you choose each?",
              difficulty: "mid" as const,
              answer: `**ECS on Fargate (serverless compute):**
- AWS manages the EC2 instances; you define CPU/memory per task
- Pay per task-second (no idle EC2 cost if all tasks stop)
- No AMI management, no node capacity planning
- Works well for: variable workloads, microservices, teams without deep EC2 expertise

\`\`\`bash
aws ecs run-task \\
  --launch-type FARGATE \\
  --task-definition myapp \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc],securityGroups=[sg-xyz]}"
# AWS provisions compute, starts task, tears it down when done
\`\`\`

**ECS on EC2:**
- You manage the EC2 instances (AMIs, capacity, patching) in the ECS cluster
- Can use Spot Instances (60-90% savings for batch/fault-tolerant workloads)
- Required for GPU workloads (Fargate doesn't support GPU)
- Better cost efficiency at scale with reserved instances
- More control over instance type, networking, storage

**Decision framework:**
| Criteria | Fargate | EC2 |
|----------|---------|-----|
| Team size | Small | Large (can manage infra) |
| Cost at scale | Higher | Lower (reserved/spot) |
| GPU workloads | No | Yes |
| Spot discounts | Yes (Fargate Spot) | Yes (EC2 Spot, more options) |
| Cold starts | ~10-30s | Faster (warm instances) |

**Fargate Spot** (recommended): Use Fargate Spot for batch processing and fault-tolerant workloads — 70% cheaper than regular Fargate, with the caveat that tasks can be interrupted.`,
            },
            {
              question: "How does ECS service discovery work, and how do microservices communicate in ECS?",
              difficulty: "mid" as const,
              answer: `**Three patterns for ECS service-to-service communication:**

**1. ALB (Application Load Balancer) — most common for HTTP:**
\`\`\`
Service A → ALB DNS (my-service.internal) → Target Group → Service B tasks
\`\`\`
- Each service gets an ALB or a target group on a shared ALB
- Services call each other by ALB DNS name
- ALB handles health checks and load balancing across tasks

**2. AWS Cloud Map (Service Discovery):**
\`\`\`bash
# Register service:
aws servicediscovery create-service \\
  --name api --dns-config "NamespaceId=ns-abc,RoutingPolicy=MULTIVALUE" \\
  --health-check-custom-config FailureThreshold=1

# ECS registers each task as a DNS record automatically:
# api.internal → [172.17.0.10, 172.17.0.11, ...] (task IPs)
\`\`\`
- Direct DNS-based discovery, no ALB needed
- Good for service mesh patterns, internal-only services
- Round-robin DNS across healthy task IPs

**3. AWS App Mesh (service mesh):**
- Envoy sidecar proxy injected into each task
- Centralized traffic control: retries, circuit breaking, mTLS
- Good for: complex microservice topologies, advanced observability

**Best practice for most teams:**
- External-facing services: ALB (handles TLS termination, WAF, access logs)
- Internal service-to-service: Cloud Map DNS or shared internal ALB
- App Mesh: only if you need advanced traffic management

**ECS with VPC networking:** Each task in Fargate/awsvpc mode gets its own ENI and private IP — security groups apply at the task level, not the host level.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your Docker image is 2GB and ECS Fargate deployments are taking 10+ minutes. How do you speed this up?", answer: "1) Use multi-stage Docker builds — compile in a full SDK image, copy only the final binary/artifacts to a minimal base image (e.g., alpine or distroless). Can reduce from 2GB to under 100MB. 2) Order Dockerfile layers with least-frequently-changed layers first (e.g., install dependencies before copying app code) to maximize Docker layer caching. 3) Push to ECR in the same region as your ECS cluster to avoid inter-region transfer time. 4) Enable ECR pull-through cache or use a VPC endpoint for ECR to avoid public internet pulls. 5) Consider using a smaller base image — 'node:18-alpine' vs 'node:18'.", difficulty: "mid" as const },
        { question: "An ECS Fargate task keeps failing with 'CannotPullContainerError'. What are the causes?", answer: "1) No network access to ECR — Fargate tasks need either a NAT Gateway (for private subnets) or VPC Interface Endpoints for ECR (com.amazonaws.region.ecr.api and com.amazonaws.region.ecr.dkr) plus an S3 Gateway Endpoint for pulling image layers. 2) Task execution role missing the ecr:GetAuthorizationToken and ecr:BatchGetImage permissions. 3) Image tag doesn't exist in ECR — verify the tag pushed matches the task definition. 4) ECR repository is in a different account and the cross-account policy is not configured. 5) Task is in a public subnet but 'assignPublicIP' is set to DISABLED.", difficulty: "mid" as const },
        { question: "How do you pass secrets (database passwords, API keys) to an ECS container securely?", answer: "Use AWS Secrets Manager or Parameter Store (SSM) with ECS secrets injection: In the container definition, use the 'secrets' field with the ARN of the secret. ECS fetches the secret at task startup and injects it as an environment variable. The task execution role must have permissions to access the secret. Never pass secrets as plain environment variables or bake them into Docker images. For rotation: Secrets Manager can auto-rotate RDS credentials; tasks pick up the new value on the next deployment or restart.", difficulty: "mid" as const },
        { question: "When would you choose ECS EC2 launch type over Fargate, and vice versa?", answer: "Choose Fargate when: You want serverless containers (no EC2 management), workloads have variable traffic patterns, you want per-task security isolation, or you're getting started. Choose EC2 launch type when: Tasks need GPU instances, you need Windows containers on specific OS versions, you require very high network throughput or specific networking configurations, you want to pack many containers per host for cost efficiency at scale (EC2 can be 30-50% cheaper than Fargate at sustained load), or you need to use capacity reservations or Spot instances on specific instance types.", difficulty: "mid" as const },
        { question: "Your ECS service has 10 tasks running but users are reporting some requests are slow. How do you investigate?", answer: "1) Check ECS service events in the console — look for task health check failures or placement failures. 2) Check CloudWatch Container Insights (if enabled) for per-task CPU and memory metrics. 3) Look at ALB target group metrics — check the percentage of healthy targets and per-target response times. 4) Examine ECS task logs via CloudWatch Logs (/ecs/service-name). 5) Check if any tasks are repeatedly stopping/restarting (this creates unhealthy targets). 6) Review ALB access logs for 5XX errors and slow response codes. 7) If memory is high, increase task memory or investigate memory leaks.", difficulty: "mid" as const },
        { question: "How do you implement blue/green deployments for an ECS service?", answer: "Use AWS CodeDeploy with ECS blue/green deployment: 1) Configure the ECS service to use CodeDeploy as the deployment controller. 2) CodeDeploy creates a new task set (green) with the new container image alongside the existing one (blue). 3) Traffic shifts from ALB production listener to green using a weighted canary or linear strategy (e.g., 10% every 5 minutes). 4) If alarms trigger during rollout, CodeDeploy automatically rolls back to blue. 5) After the bake time (configurable), the blue task set is deleted. This gives zero-downtime deployments with automatic rollback.", difficulty: "senior" as const },
        { question: "An ECS task needs to write to an S3 bucket. How do you grant it the necessary permissions?", answer: "Create an IAM role with the required S3 policy and specify it as the task role (not the execution role) in the task definition. The task role grants permissions for the application code running in the container. The execution role is different — it's used by the ECS agent for pulling images from ECR and writing logs to CloudWatch. In the task definition: 'taskRoleArn' = your application's permissions, 'executionRoleArn' = ECS infrastructure permissions. Never hardcode AWS credentials in container images or environment variables.", difficulty: "junior" as const },
        { question: "How does ECR image scanning work and how do you enforce no high-severity vulnerabilities in production?", answer: "ECR offers two scanning modes: Basic scanning (powered by Clair) runs on push or manually. Enhanced scanning (powered by Amazon Inspector) provides continuous scanning, detecting new CVEs even for images already in ECR. To enforce in CI/CD: After pushing to ECR, run 'aws ecr describe-image-scan-findings --repository-name myapp --image-id imageTag=v1.2.3' and fail the pipeline if CRITICAL or HIGH findings exist. Use an ECR lifecycle policy to keep only scanned images. For compliance, enable enhanced scanning at the organization level via AWS Organizations.", difficulty: "senior" as const },
        { question: "Your ECS Fargate tasks are running out of memory and being killed (OOMKilled). What do you do?", answer: "1) Increase the task memory in the task definition and redeploy. 2) Enable CloudWatch Container Insights to get per-task memory metrics over time — set an alarm before hitting the limit. 3) Check if the application has a memory leak — use application profiling (e.g., Node.js --inspect, JVM heap dumps). 4) Use a memory limit on the container (not just task) to catch leaks early. 5) Review the application code — uncontrolled caches, event listeners not cleaned up, or circular references in JavaScript are common causes. 6) Set memory reservation separately from memory limit — reservation for scheduling, limit for OOM kill threshold.", difficulty: "mid" as const },
        { question: "How do you implement auto-scaling for an ECS Fargate service based on custom application metrics?", answer: "1) Publish a custom CloudWatch metric from the application (e.g., queue depth, requests per task). 2) Create an Application Auto Scaling target for the ECS service: 'aws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/cluster/service --scalable-dimension ecs:service:DesiredCount'. 3) Create a scaling policy using the custom metric: TargetTrackingScaling targets a specific metric value, StepScaling fires at specific thresholds. 4) Set scale-out cooldown (e.g., 60s) and scale-in cooldown (e.g., 300s) to prevent flapping. 5) Also configure CPU and memory-based scaling as baseline policies.", difficulty: "senior" as const },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 6 — DevOps Services
    // ─────────────────────────────────────────
    {
      id: "aws-devops-services",
      title: "AWS DevOps Services",
      description: "CloudFormation, CodePipeline, CodeBuild, CodeDeploy, and Systems Manager.",
      level: "intermediate",
      lessons: [
        {
          id: "cloudformation",
          title: "CloudFormation Infrastructure as Code",
          description: "Stacks, templates, change sets, nested stacks, and drift detection.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Write a CloudFormation template for a web application",
            "Use change sets to preview infrastructure changes",
            "Detect and remediate stack drift",
            "Organise stacks with nested stacks and StackSets",
          ],
          content: `## CloudFormation Infrastructure as Code

CloudFormation provisions and manages AWS resources through declarative JSON/YAML templates.

---

## Template Structure

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Web application stack

Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, production]
    Default: dev
  InstanceType:
    Type: String
    Default: t3.small

Mappings:
  EnvConfig:
    dev:
      MinSize: 1
      MaxSize: 2
    production:
      MinSize: 2
      MaxSize: 10

Conditions:
  IsProduction: !Equals [!Ref Environment, production]

Resources:
  AppSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: App server SG
      VpcId: !ImportValue SharedVPC-VPCID
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          SourceSecurityGroupId: !ImportValue SharedVPC-ALBSGID

  AppASG:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: !FindInMap [EnvConfig, !Ref Environment, MinSize]
      MaxSize: !FindInMap [EnvConfig, !Ref Environment, MaxSize]
      DesiredCapacity: !FindInMap [EnvConfig, !Ref Environment, MinSize]
      LaunchTemplate:
        LaunchTemplateId: !Ref AppLaunchTemplate
        Version: !GetAtt AppLaunchTemplate.LatestVersionNumber
      VPCZoneIdentifier:
        - !ImportValue SharedVPC-PrivateSubnet1
        - !ImportValue SharedVPC-PrivateSubnet2
      TargetGroupARNs:
        - !Ref AppTargetGroup
    UpdatePolicy:
      AutoScalingRollingUpdate:
        MinInstancesInService: 1
        MaxBatchSize: 1

  # Only create alarm in production
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Condition: IsProduction
    Properties:
      AlarmName: !Sub "\${AWS::StackName}-high-cpu"
      MetricName: CPUUtilization
      Namespace: AWS/EC2
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold

Outputs:
  AppURL:
    Value: !Sub "https://\${AppALB.DNSName}"
    Export:
      Name: !Sub "\${AWS::StackName}-AppURL"
\`\`\`

---

## CLI Operations

\`\`\`bash
# Validate template
aws cloudformation validate-template --template-body file://template.yaml

# Create stack
aws cloudformation create-stack \
  --stack-name myapp-production \
  --template-body file://template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=InstanceType,ParameterValue=t3.small \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --on-failure DO_NOTHING  # ROLLBACK | DELETE | DO_NOTHING

aws cloudformation wait stack-create-complete --stack-name myapp-production

# Create a Change Set (preview changes before applying)
aws cloudformation create-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type \
  --template-body file://template-v2.yaml \
  --parameters ParameterKey=Environment,ParameterValue=production

# Review the change set
aws cloudformation describe-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type \
  --query 'Changes[*].ResourceChange.{Action:Action,Resource:LogicalResourceId,Type:ResourceType}'

# Execute (or delete to cancel)
aws cloudformation execute-change-set \
  --stack-name myapp-production \
  --change-set-name update-instance-type

# Detect drift
aws cloudformation detect-stack-drift --stack-name myapp-production
aws cloudformation describe-stack-drift-detection-status \
  --stack-drift-detection-id <id>
aws cloudformation describe-stack-resource-drifts \
  --stack-name myapp-production \
  --stack-resource-drift-status MODIFIED

# Delete stack
aws cloudformation delete-stack --stack-name myapp-production
aws cloudformation wait stack-delete-complete --stack-name myapp-production
\`\`\`

---

## Useful CloudFormation Patterns

\`\`\`bash
# Export stack outputs for cross-stack references
# In stack A:
Outputs:
  VPCID:
    Value: !Ref VPC
    Export:
      Name: MyVPC-VPCID

# In stack B:
Resources:
  Subnet:
    Properties:
      VpcId: !ImportValue MyVPC-VPCID

# List all exports
aws cloudformation list-exports \
  --query 'Exports[*].{Name:Name,Value:Value}' --output table

# List all stack resources
aws cloudformation list-stack-resources \
  --stack-name myapp-production \
  --query 'StackResourceSummaries[*].{Logical:LogicalResourceId,Physical:PhysicalResourceId,Status:ResourceStatus}' \
  --output table
\`\`\`

> **Tip:** Always use **change sets** in production — never \`update-stack\` directly. A change set is like \`terraform plan\`: review exactly what will be created, modified, or deleted before committing. The few seconds it takes saves hours of incident response.`,
          interviewQuestions: [
            {
              question: "What is AWS CloudFormation drift detection and when should you use it?",
              difficulty: "mid" as const,
              answer: `**Drift** occurs when someone manually changes a CloudFormation-managed resource (via console, CLI, SDK) without updating the CloudFormation template.

**When to detect:**
\`\`\`bash
# Detect drift on a stack:
aws cloudformation detect-stack-drift --stack-name prod-stack

# Get drift status (takes a minute):
aws cloudformation describe-stack-drift-detection-status \\
  --stack-drift-detection-id <id>

# See what drifted:
aws cloudformation describe-stack-resource-drifts \\
  --stack-name prod-stack \\
  --stack-resource-drift-status-filters MODIFIED DELETED
\`\`\`

**What it tells you:**
- Which resources differ from the template
- What properties changed (e.g., security group rule added manually)
- Whether resources were deleted outside CloudFormation

**Common scenarios where drift happens:**
- Ops team adds a security group rule during an incident (quick fix, forgot to update template)
- Developer changes instance type in console to debug a performance issue
- IAM policies modified manually to grant temporary access

**Remediation options:**
1. **Update template to match reality** — if the manual change was intentional
2. **Run stack update** — to revert drift back to template definition
3. **Prevent drift** — CloudFormation Stack Policies to prevent direct resource modifications

**Automated drift detection in CI:**
\`\`\`bash
# Weekly drift check in CloudWatch Events → Lambda → SNS alert
# If drift found, create PagerDuty incident or GitHub issue
\`\`\`

**Terraform equivalent:** \`terraform plan\` always shows drift — it's built in to the workflow.`,
            },
          ],
        },
        {
          id: "codepipeline",
          title: "CodePipeline & CodeBuild",
          description: "Build a CI/CD pipeline with CodePipeline, CodeBuild, and automated deployments.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Create a CodeBuild project to build and test code",
            "Wire CodePipeline with GitHub, CodeBuild, and ECS deployment",
            "Add manual approval gates for production deployments",
            "Monitor pipeline executions via CLI",
          ],
          content: `## CodePipeline & CodeBuild

AWS CodePipeline orchestrates CI/CD workflows. CodeBuild provides managed build environments.

---

## CodeBuild Project

\`\`\`bash
# buildspec.yml — lives in your repository root
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci

  pre_build:
    commands:
      - echo Logging in to ECR...
      - aws ecr get-login-password --region \$AWS_DEFAULT_REGION
          | docker login --username AWS --password-stdin \$ECR_REGISTRY
      - npm run lint
      - npm test

  build:
    commands:
      - docker build -t \$IMAGE_REPO_NAME:\$IMAGE_TAG .
      - docker tag \$IMAGE_REPO_NAME:\$IMAGE_TAG \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG

  post_build:
    commands:
      - docker push \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG
      - printf '[{"name":"myapp","imageUri":"%s"}]' \$ECR_REGISTRY/\$IMAGE_REPO_NAME:\$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
\`\`\`

\`\`\`bash
# Create CodeBuild project
aws codebuild create-project \
  --name myapp-build \
  --source '{
    "type": "GITHUB",
    "location": "https://github.com/myorg/myapp",
    "buildspec": "buildspec.yml"
  }' \
  --environment '{
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/standard:7.0",
    "computeType": "BUILD_GENERAL1_SMALL",
    "privilegedMode": true,
    "environmentVariables": [
      {"name":"ECR_REGISTRY","value":"123456789012.dkr.ecr.us-east-1.amazonaws.com","type":"PLAINTEXT"},
      {"name":"IMAGE_REPO_NAME","value":"myapp","type":"PLAINTEXT"},
      {"name":"IMAGE_TAG","value":"latest","type":"PLAINTEXT"},
      {"name":"DB_PASSWORD","value":"/myapp/db_password","type":"PARAMETER_STORE"}
    ]
  }' \
  --service-role arn:aws:iam::123456789012:role/CodeBuildServiceRole \
  --artifacts '{"type":"NO_ARTIFACTS"}'
\`\`\`

---

## CodePipeline

\`\`\`bash
# pipeline.json
{
  "pipeline": {
    "name": "myapp-pipeline",
    "roleArn": "arn:aws:iam::123456789012:role/CodePipelineRole",
    "artifactStore": {
      "type": "S3",
      "location": "my-pipeline-artifacts-123456789012"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [{
          "name": "GitHub",
          "actionTypeId": {
            "category": "Source",
            "owner": "ThirdParty",
            "provider": "GitHub",
            "version": "1"
          },
          "configuration": {
            "Owner": "myorg",
            "Repo": "myapp",
            "Branch": "main",
            "OAuthToken": "{{resolve:secretsmanager:github-token}}"
          },
          "outputArtifacts": [{"name": "SourceOutput"}]
        }]
      },
      {
        "name": "Build",
        "actions": [{
          "name": "CodeBuild",
          "actionTypeId": {
            "category": "Build",
            "owner": "AWS",
            "provider": "CodeBuild",
            "version": "1"
          },
          "inputArtifacts": [{"name": "SourceOutput"}],
          "outputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {"ProjectName": "myapp-build"}
        }]
      },
      {
        "name": "Approval",
        "actions": [{
          "name": "ProductionApproval",
          "actionTypeId": {
            "category": "Approval",
            "owner": "AWS",
            "provider": "Manual",
            "version": "1"
          },
          "configuration": {
            "NotificationArn": "arn:aws:sns:us-east-1:123456789012:deployments",
            "CustomData": "Please review the staging environment before approving."
          }
        }]
      },
      {
        "name": "Deploy",
        "actions": [{
          "name": "ECS",
          "actionTypeId": {
            "category": "Deploy",
            "owner": "AWS",
            "provider": "ECS",
            "version": "1"
          },
          "inputArtifacts": [{"name": "BuildOutput"}],
          "configuration": {
            "ClusterName": "production",
            "ServiceName": "myapp",
            "FileName": "imagedefinitions.json"
          }
        }]
      }
    ]
  }
}

# Create the pipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
\`\`\`

---

## Pipeline CLI Operations

\`\`\`bash
# Trigger a pipeline manually
aws codepipeline start-pipeline-execution --name myapp-pipeline

# Get pipeline state
aws codepipeline get-pipeline-state --name myapp-pipeline \
  --query 'stageStates[*].{Stage:stageName,Status:latestExecution.status}'

# List recent executions
aws codepipeline list-pipeline-executions --pipeline-name myapp-pipeline \
  --query 'pipelineExecutionSummaries[0:5].{ID:pipelineExecutionId,Status:status,Started:startTime}'

# Approve a manual gate
APPROVAL=$(aws codepipeline get-pipeline-state --name myapp-pipeline \
  --query 'stageStates[?stageName==\`Approval\`].actionStates[0].latestExecution.token' \
  --output text)

aws codepipeline put-approval-result \
  --pipeline-name myapp-pipeline \
  --stage-name Approval \
  --action-name ProductionApproval \
  --result '{"summary":"LGTM — staging verified","status":"Approved"}' \
  --token \$APPROVAL
\`\`\``,
        },
      ],
      exam: [
        { question: "A CloudFormation stack update fails halfway through, leaving some resources updated and others not. What happens and how do you recover?", answer: "CloudFormation automatically rolls back the stack to the last known good state when an update fails. Resources that were updated get reverted, and CloudFormation reports the stack status as UPDATE_ROLLBACK_COMPLETE. To investigate: check the 'Events' tab in the CloudFormation console for the specific resource and error that triggered the rollback. To fix: resolve the issue in the template (e.g., fix an invalid parameter, correct IAM permissions, fix a resource configuration), then run the update again. If rollback itself fails (UPDATE_ROLLBACK_FAILED), you must manually fix the out-of-band resource and then signal CloudFormation to continue the rollback.", difficulty: "mid" as const },
        { question: "How do you safely update a CloudFormation stack that changes a database's deletion policy?", answer: "1) Use a Change Set first — create it with 'aws cloudformation create-change-set' and review 'Changes' to see what will be modified, replaced, or deleted. 2) Ensure DeletionPolicy: Retain or Snapshot is set on the RDS resource before making any changes that could trigger replacement. 3) Never change properties that force replacement (like RDS engine, subnet group) without a planned migration. 4) Enable termination protection on the stack itself. 5) Test changes in a non-production stack first with identical parameters. The Change Set preview shows 'Replacement: True' for resources that will be deleted and recreated.", difficulty: "mid" as const },
        { question: "Your CodePipeline fails at the CodeBuild stage with 'BUILD_GENERAL1_SMALL exceeded memory'. What do you do?", answer: "Increase the CodeBuild compute type: change from BUILD_GENERAL1_SMALL (3GB RAM) to BUILD_GENERAL1_MEDIUM (7GB) or BUILD_GENERAL1_LARGE (15GB). In the buildspec.yml or CodeBuild project, update the computeType under environment. Also check: 1) Are Docker layer caches being used? Enable 'cache' in the buildspec or use an S3 bucket for build cache to speed up builds and reduce memory pressure from re-downloading dependencies. 2) Are you building multiple services in parallel in the same build? Split into separate CodeBuild projects.", difficulty: "junior" as const },
        { question: "How do you implement a multi-stage deployment pipeline with automatic rollback if error rate exceeds 5%?", answer: "Use CodePipeline with CodeDeploy: 1) Pipeline stages: Source (CodeCommit/GitHub) → Build (CodeBuild) → Deploy-Staging (CodeDeploy) → Manual-Approval → Deploy-Production (CodeDeploy). 2) For production CodeDeploy, use a Blue/Green or Canary deployment configuration (e.g., 10% for 5 minutes, then 100%). 3) Configure a CloudWatch alarm on the ALB's HTTPCode_Target_5XX_Count > threshold. 4) Link the alarm to the CodeDeploy deployment group — CodeDeploy monitors alarms and automatically initiates a rollback if the alarm fires during the bake period. 5) The rollback shifts traffic back to the original (blue) deployment.", difficulty: "senior" as const },
        { question: "A CloudFormation stack shows 'DRIFT_DETECTED'. What does this mean and how do you remediate it?", answer: "Drift means resources have been modified outside CloudFormation (e.g., someone changed a security group rule via CLI or Console). Run 'aws cloudformation detect-stack-drift' and then 'describe-stack-resource-drifts' to see the specific differences. Remediation options: 1) Re-run the CloudFormation update to overwrite the manual change back to the desired state. 2) If the manual change was intentional, update the template to match and do a stack update. 3) If critical, use AWS Config or CloudTrail to identify who made the change. Prevention: Restrict IAM permissions so only CloudFormation can modify production resources, enforce with an SCP.", difficulty: "mid" as const },
        { question: "How do you securely inject secrets (database passwords) into a CodeBuild build without exposing them in logs?", answer: "Use AWS Secrets Manager or Parameter Store with CodeBuild: In the CodeBuild project environment, add an environment variable of type SECRETS_MANAGER or PARAMETER_STORE (not PLAINTEXT) referencing the secret ARN/path. CodeBuild fetches and injects the value at runtime — it's masked in CloudWatch Logs (shown as '****'). The CodeBuild service role needs secretsmanager:GetSecretValue or ssm:GetParameter permissions. Never put secrets in buildspec.yml or source code. Also useful: CodeBuild can access Secrets Manager secrets referenced in buildspec under 'env.secrets-manager'.", difficulty: "mid" as const },
        { question: "Your team wants to use Infrastructure as Code but the existing production infrastructure was built manually. How do you approach this migration?", answer: "Strategy: Import existing resources into CloudFormation rather than recreating them (which would cause downtime). 1) Use 'aws cloudformation import' with a resource import change set to bring existing resources under stack management. 2) Write the template to match the existing resource's exact configuration. 3) Create a change set of type IMPORT and verify it shows zero changes — if it would modify the resource, the import will fail. 4) After import, future changes go through CloudFormation. Alternative: Use former2 or other tools to auto-generate CloudFormation templates from existing AWS resources. Terraform has a similar 'terraform import' command.", difficulty: "senior" as const },
        { question: "What is the difference between CodeDeploy's In-Place and Blue/Green deployment strategies?", answer: "In-Place: CodeDeploy stops the application on existing EC2 instances, deploys the new version, and restarts. Faster (no new instances) but has downtime risk and rollback means re-deploying the old version. Good for: non-critical environments, apps where brief downtime is acceptable. Blue/Green: Provisions a new set of instances (green) with the new version, shifts traffic via the load balancer from blue to green, then terminates the blue fleet after the bake time. Zero downtime, instant rollback by shifting traffic back to blue. Higher cost (dual fleet during transition) but production standard. For ECS, blue/green uses new task sets rather than new EC2 instances.", difficulty: "mid" as const },
        { question: "How do you use CloudFormation StackSets to enforce a security baseline across all AWS accounts in your organization?", answer: "StackSets allow you to deploy the same CloudFormation template to multiple accounts and regions from a single management account. 1) Enable trusted access between AWS Organizations and CloudFormation. 2) Create a StackSet in the management account with your security baseline template (e.g., CloudTrail, Config, GuardDuty, default VPC deletion, IAM password policy). 3) Deploy to the organization's root OU or specific OUs — StackSets handles deployment across all member accounts. 4) Enable 'Automatic deployment' so new accounts joining the organization automatically get the baseline. 5) Use SELF_MANAGED or SERVICE_MANAGED permission model depending on your organization structure.", difficulty: "senior" as const },
        { question: "A CodePipeline pipeline is stuck in 'InProgress' at a CodeDeploy stage for 30 minutes. How do you debug?", answer: "1) Check CodeDeploy deployment details — go to CodeDeploy console, find the deployment, and check the lifecycle event logs. Common culprits: ApplicationStop script hanging, BeforeInstall failing, or the deployment agent not running. 2) SSH into target EC2 instances and check the CodeDeploy agent logs: /var/log/aws/codedeploy-agent/codedeploy-agent.log. 3) Check appspec.yml hooks — a script that doesn't exit with code 0, or hangs (missing timeout), blocks the deployment. 4) Verify the CodeDeploy agent is running: 'systemctl status codedeploy-agent'. 5) Check if the EC2 instance can reach the CodeDeploy service endpoint (needs internet access or VPC endpoint).", difficulty: "mid" as const },
      ],
    },

    // ─────────────────────────────────────────
    // ─────────────────────────────────────────
    // MODULE 7 — EKS (Elastic Kubernetes Service)
    // ─────────────────────────────────────────
    {
      id: "eks-kubernetes",
      title: "EKS — Elastic Kubernetes Service",
      level: "advanced",
      description: "Run production Kubernetes on AWS with EKS — the managed control plane used by Airbnb, Lyft, and thousands of enterprises.",
      lessons: [
        {
          id: "eks-fundamentals",
          title: "EKS Architecture & Setup",
          duration: 25,
          type: "lesson",
          description: "Understand EKS architecture, managed node groups, Fargate, and cluster setup.",
          objectives: [
            "Understand EKS control plane vs. worker nodes and what AWS manages",
            "Create an EKS cluster using eksctl and Terraform",
            "Configure managed node groups and Fargate profiles",
            "Connect kubectl to an EKS cluster with proper IAM authentication",
          ],
          content: `# EKS — Elastic Kubernetes Service

## Why EKS? The Real-World Context

Running Kubernetes yourself (kubeadm, kops) means managing etcd backups, control plane upgrades, API server HA, and certificates. **EKS eliminates this** by managing the control plane entirely.

**Who uses EKS in production:**
- **Airbnb**: Migrated from a custom infrastructure to EKS, running 1,000+ microservices
- **Lyft**: Uses EKS for their entire backend, handling millions of ride requests
- **Samsung**: Runs global IoT platform on EKS across multiple regions
- **Robinhood**: Financial trading platform on EKS with strict latency requirements

## EKS Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     AWS Managed Control Plane                     │
│  ┌──────────────┐  ┌──────────┐  ┌────────────────────────────┐ │
│  │ kube-apiserver│  │  etcd    │  │ kube-controller-manager    │ │
│  │ (HA, 3 AZs)  │  │ (managed)│  │ kube-scheduler             │ │
│  └──────────────┘  └──────────┘  └────────────────────────────┘ │
│              AWS handles: upgrades, backups, HA                   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ AWS VPC
┌─────────────────────────────────▼───────────────────────────────┐
│                        Your Worker Nodes                          │
│  ┌─────────────────────┐    ┌────────────────────────────────┐  │
│  │ Managed Node Group  │    │    Fargate Profile              │  │
│  │ EC2 (you choose     │    │    (serverless pods, no nodes  │  │
│  │  type, ASG managed  │    │     to manage)                 │  │
│  │  by EKS)            │    └────────────────────────────────┘  │
│  └─────────────────────┘                                         │
│  Each node runs: kubelet, kube-proxy, containerd                  │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**What AWS manages (you don't touch):**
- Control plane EC2 instances
- etcd cluster with automated backups
- API server TLS certificates
- Control plane scaling and HA across 3 AZs
- Kubernetes version upgrades (you initiate, AWS executes)

**What you manage:**
- Worker nodes (EC2 type, count, AMI)
- Node group upgrades (managed, but you trigger)
- Add-ons (CoreDNS, kube-proxy, VPC CNI, EBS CSI driver)
- Networking (VPC, subnets, security groups)
- IAM roles for nodes and pods (IRSA)

## Creating an EKS Cluster

### Using eksctl (fastest for getting started)

\`\`\`bash
# Install eksctl:
curl --silent --location "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_\$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster with managed node group:
eksctl create cluster \\
  --name prod-cluster \\
  --version 1.29 \\
  --region us-east-1 \\
  --nodegroup-name general \\
  --node-type m5.xlarge \\
  --nodes 3 \\
  --nodes-min 2 \\
  --nodes-max 10 \\
  --managed \\
  --asg-access \\
  --external-dns-access \\
  --full-ecr-access \\
  --with-oidc        # enables IRSA (IAM Roles for Service Accounts)

# Takes 15-20 minutes. Creates:
# - VPC with public/private subnets across 3 AZs
# - EKS control plane
# - Managed node group
# - Updates ~/.kube/config automatically
\`\`\`

### Using eksctl with a config file (production approach)

\`\`\`yaml
# cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: prod-cluster
  region: us-east-1
  version: "1.29"

iam:
  withOIDC: true  # required for IRSA

vpc:
  id: vpc-0a1b2c3d  # use existing VPC
  subnets:
    private:
      us-east-1a: {id: subnet-aaa}
      us-east-1b: {id: subnet-bbb}
      us-east-1c: {id: subnet-ccc}

managedNodeGroups:
  - name: general
    instanceType: m5.xlarge
    minSize: 3
    maxSize: 15
    desiredCapacity: 3
    volumeSize: 100
    volumeType: gp3
    privateNetworking: true   # nodes in private subnets
    labels:
      role: general
    tags:
      Environment: production
    iam:
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
        - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy

  - name: gpu-nodes
    instanceType: g4dn.xlarge
    minSize: 0
    maxSize: 5
    labels:
      role: gpu
      nvidia.com/gpu: "true"
\`\`\`

\`\`\`bash
eksctl create cluster -f cluster.yaml
\`\`\`

### Using Terraform (IaC approach — production standard)

\`\`\`hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "prod-cluster"
  cluster_version = "1.29"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  # Add-ons managed by EKS:
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Enable IRSA:
  enable_irsa = true

  eks_managed_node_groups = {
    general = {
      instance_types = ["m5.xlarge"]
      min_size       = 3
      max_size       = 15
      desired_size   = 3

      block_device_mappings = {
        xvda = {
          device_name = "/dev/xvda"
          ebs = {
            volume_size           = 100
            volume_type           = "gp3"
            encrypted             = true
            delete_on_termination = true
          }
        }
      }
    }
  }
}
\`\`\`

## Connecting kubectl to EKS

\`\`\`bash
# Update kubeconfig:
aws eks update-kubeconfig \\
  --region us-east-1 \\
  --name prod-cluster

# Verify:
kubectl get nodes
# NAME                          STATUS   ROLES    AGE   VERSION
# ip-10-0-1-123.ec2.internal   Ready    <none>   5m    v1.29.0-eks-abc123

# Check cluster info:
kubectl cluster-info
kubectl version --short
\`\`\`

## IAM Roles for Service Accounts (IRSA)

**The problem:** A pod needs to write to S3. Old approach: put AWS credentials in a Secret (insecure). **IRSA solution:** Link a Kubernetes ServiceAccount to an IAM role — the pod gets temporary credentials automatically via metadata service.

\`\`\`bash
# 1. Create IAM policy:
aws iam create-policy \\
  --policy-name s3-write-policy \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }]
  }'

# 2. Create IAM role + ServiceAccount with eksctl:
eksctl create iamserviceaccount \\
  --name s3-writer \\
  --namespace production \\
  --cluster prod-cluster \\
  --attach-policy-arn arn:aws:iam::123456789:policy/s3-write-policy \\
  --approve \\
  --region us-east-1

# 3. Use the ServiceAccount in your pod:
\`\`\`

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: production
spec:
  template:
    spec:
      serviceAccountName: s3-writer  # binds to the IAM role
      containers:
        - name: app
          image: my-app:latest
          # No AWS credentials needed — SDK auto-discovers via IRSA
\`\`\`

## EKS Fargate — Serverless Kubernetes

\`\`\`yaml
# Fargate profile: pods matching these selectors run on Fargate
# (AWS manages the underlying EC2 — you never see the nodes)
\`\`\`

\`\`\`bash
eksctl create fargateprofile \\
  --cluster prod-cluster \\
  --name batch-jobs \\
  --namespace batch \\
  --labels type=batch
\`\`\`

**When to use Fargate:**
- Batch jobs with variable resource needs (scale to zero when no jobs)
- Isolating untrusted workloads (each pod gets its own microVM)
- Compliance requirements (no shared nodes between tenants)
- **Cost:** More expensive per-CPU than EC2, but no idle node cost

## EKS Node Group Upgrades

\`\`\`bash
# Check available K8s versions:
aws eks describe-addon-versions --query 'addons[0].addonVersions[].compatibilities[].clusterVersion' --output table

# Upgrade control plane first:
aws eks update-cluster-version \\
  --name prod-cluster \\
  --kubernetes-version 1.30

# Wait for upgrade to complete:
aws eks wait cluster-active --name prod-cluster

# Upgrade managed node group:
aws eks update-nodegroup-version \\
  --cluster-name prod-cluster \\
  --nodegroup-name general \\
  --kubernetes-version 1.30

# The node group upgrade process:
# 1. Launches new nodes with new version
# 2. Cordons and drains old nodes (respects PodDisruptionBudgets)
# 3. Terminates old nodes
# Zero-downtime when PDBs and rolling update strategy are configured
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What is the difference between EKS managed node groups and self-managed nodes? When do you use Fargate?",
              difficulty: "mid" as const,
              answer: `**Self-managed nodes:** You create EC2 instances manually, join them to the cluster with bootstrap scripts. You manage: AMI updates, security patches, scaling. Full control, full responsibility.

**Managed node groups:** AWS creates and manages the EC2 instances. You define the configuration (instance type, size, min/max). AWS handles: node provisioning, automatic node repair, version upgrades (rolling). You still choose the instance type and manage IAM permissions.

**Benefits of managed node groups:**
- Nodes are automatically drained before termination (respects PodDisruptionBudgets)
- Launch templates for customization
- Automatic version upgrade with zero-downtime rolling
- AWS-optimized AMI with containerd + kubelet preconfigured

**Fargate:** Serverless — no nodes at all. Each pod runs in its own isolated microVM. AWS manages all infrastructure.

**Decision matrix:**
| | Self-managed | Managed Node Group | Fargate |
|--|--|--|--|
| Control | Full | High | None |
| Ops burden | High | Medium | None |
| GPU support | Yes | Yes | No |
| Cost | Lowest | Low | Higher |
| Use case | Custom AMIs, GPU | Standard workloads | Batch, isolation |

**When Fargate makes sense:**
- Batch jobs that run occasionally (pay only when running)
- Strict multi-tenancy (no shared hosts)
- Small teams that don't want node management
- When workloads are variable and you need scale-to-zero

**When to stick with EC2 (managed or self):**
- GPU workloads (ML training, inference)
- Spot instance strategies for 60-90% cost savings
- Workloads needing specific instance types (compute-optimized, memory-optimized)
- Stateful apps needing local NVMe storage`,
            },
            {
              question: "How does IRSA (IAM Roles for Service Accounts) work? Why is it better than storing AWS credentials as Kubernetes Secrets?",
              difficulty: "senior" as const,
              answer: `**The old way (credentials as Secrets):**
\`\`\`yaml
# Dangerous — long-lived credentials stored in etcd
apiVersion: v1
kind: Secret
data:
  AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE  # base64 encoded
  AWS_SECRET_ACCESS_KEY: abc123...
\`\`\`
Problems: Long-lived, must be rotated manually, can be leaked via logs/env inspection, all pods on the node share the instance profile.

**IRSA — how it works:**
1. **OIDC Provider**: EKS creates an OIDC identity provider. Each cluster has a unique OIDC URL.
2. **Token projection**: Kubernetes projects a signed JWT into the pod as a file (\`/var/run/secrets/eks.amazonaws.com/serviceaccount/token\`)
3. **AWS STS**: The AWS SDK calls \`sts:AssumeRoleWithWebIdentity\` using this JWT
4. **Verification**: STS verifies the JWT with the cluster's OIDC provider
5. **Short-lived creds**: STS returns temporary credentials (1 hour)
6. **Auto-renewal**: AWS SDK automatically refreshes before expiry

\`\`\`bash
# The trust policy on the IAM role:
{
  "Effect": "Allow",
  "Principal": {"Federated": "arn:aws:iam::123456789:oidc-provider/..."},
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "oidc.eks.us-east-1.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE:sub":
        "system:serviceaccount:production:s3-writer"
    }
  }
}
\`\`\`

**Why IRSA is better:**
- Credentials expire in 1 hour (automatic)
- Per-pod granularity (pod A gets S3 access, pod B gets DynamoDB)
- No secrets in etcd, no secrets in environment variables
- Auditable: CloudTrail shows exactly which pod assumed which role
- No rotation burden — fully automated

**Pro tip:** Combine with \`eks.amazonaws.com/role-arn\` annotation on the ServiceAccount, and the IRSA token is projected automatically — no code changes needed, just IAM and K8s configuration.`,
            },
            {
              question: "Your EKS cluster nodes are NotReady. How do you diagnose and fix this?",
              difficulty: "senior" as const,
              answer: `**Step 1 — Check node status:**
\`\`\`bash
kubectl get nodes
# NAME           STATUS     ROLES    AGE   VERSION
# ip-10-0-1-1    NotReady   <none>   5m    v1.29.0

kubectl describe node ip-10-0-1-1
# Look for: Conditions section, Events at the bottom
# Key fields: MemoryPressure, DiskPressure, PIDPressure, NetworkUnavailable
\`\`\`

**Step 2 — Check node conditions:**
\`\`\`bash
kubectl get node ip-10-0-1-1 -o jsonpath='{.status.conditions[*]}' | jq .
# Common conditions:
# NetworkUnavailable: True → VPC CNI issue
# MemoryPressure: True → OOM, pods being evicted
# DiskPressure: True → disk full, clean up images/logs
# KubeletReady: Unknown → kubelet stopped reporting
\`\`\`

**Step 3 — SSH to the node and check kubelet:**
\`\`\`bash
# Get instance ID from node name:
aws ec2 describe-instances \\
  --filters "Name=private-dns-name,Values=ip-10-0-1-1.ec2.internal" \\
  --query 'Reservations[0].Instances[0].InstanceId'

# Connect via SSM (no SSH key needed on EKS nodes):
aws ssm start-session --target i-xxx

# On the node:
systemctl status kubelet        # is kubelet running?
journalctl -u kubelet -n 50     # kubelet logs

# Check for CNI issues:
ls /etc/cni/net.d/              # CNI config files exist?
ls /opt/cni/bin/aws-cni         # VPC CNI binary installed?
cat /var/log/aws-routed-eni/ipamd.log  # VPC CNI logs
\`\`\`

**Step 4 — Common root causes:**

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| NetworkUnavailable | VPC CNI crashed/misconfigured | Restart aws-node daemonset |
| kubelet not running | Ran out of disk (logs/images) | Clean up: docker/crictl prune |
| MemoryPressure | Too many pods, OOMed | Scale out node group |
| Node unreachable | Security group blocking 10250 | Add SG rule |
| Certificate expired | Time drift | Sync NTP, rotate bootstrap token |

\`\`\`bash
# Restart VPC CNI:
kubectl rollout restart daemonset aws-node -n kube-system

# Force drain and terminate the bad node (ASG replaces it):
kubectl drain ip-10-0-1-1 --ignore-daemonsets --delete-emptydir-data
aws ec2 terminate-instances --instance-ids i-xxx
# Cluster Autoscaler or ASG will provision a healthy replacement
\`\`\``,
            },
          ],
        },
        {
          id: "eks-networking-storage",
          title: "EKS Networking, Load Balancing & Storage",
          duration: 22,
          type: "lesson",
          description: "Master AWS Load Balancer Controller, EBS/EFS CSI drivers, and VPC networking in EKS.",
          objectives: [
            "Configure AWS Load Balancer Controller for ALB and NLB integration",
            "Use EBS CSI driver for persistent storage in EKS",
            "Implement EFS for shared ReadWriteMany storage",
            "Understand VPC CNI and IP address management",
          ],
          content: `# EKS Networking, Load Balancing & Storage

## AWS Load Balancer Controller

The **AWS Load Balancer Controller** (formerly ALB Ingress Controller) provisions AWS ALBs and NLBs from Kubernetes Ingress and Service resources.

**Why it matters:** Native Kubernetes LoadBalancer services provision a Classic Load Balancer per service (expensive, no URL routing). The AWS Load Balancer Controller provisions one ALB for all your Ingress rules — massive cost savings.

\`\`\`bash
# Install via Helm:
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \\
  -n kube-system \\
  --set clusterName=prod-cluster \\
  --set serviceAccount.create=false \\
  --set serviceAccount.name=aws-load-balancer-controller
  # (serviceAccount pre-created with IRSA role)
\`\`\`

### ALB Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip   # route to pod IPs directly
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:...  # HTTPS
    alb.ingress.kubernetes.io/ssl-redirect: "443"
    alb.ingress.kubernetes.io/healthcheck-path: /health
    alb.ingress.kubernetes.io/group.name: shared-alb  # SHARE one ALB across multiple Ingresses
spec:
  rules:
    - host: api.myapp.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 3000
    - host: admin.myapp.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-service
                port:
                  number: 8080
\`\`\`

### NLB for Non-HTTP Traffic

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: game-server
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: game-server
  ports:
    - port: 7777
      protocol: UDP
\`\`\`

## VPC CNI and IP Address Planning

EKS uses the **VPC CNI plugin** — each pod gets a real VPC IP address (not an overlay network). This is unique to AWS and has important implications:

\`\`\`
AWS VPC: 10.0.0.0/16

Pod IPs come directly from your VPC subnets:
Pod 1: 10.0.1.54    ← real VPC IP (no NAT)
Pod 2: 10.0.2.183   ← real VPC IP
Pod 3: 10.0.1.92    ← real VPC IP

This means:
✅ Pods accessible from anywhere in the VPC without special routing
✅ Security groups apply directly to pods (pod-level SGs)
❌ You need enough IP space — a /24 subnet only has 254 IPs
\`\`\`

**IP exhaustion problem and solutions:**

\`\`\`bash
# Check available IPs per subnet:
aws ec2 describe-subnets \\
  --subnet-ids subnet-xxx \\
  --query 'Subnets[0].AvailableIpAddressCount'

# Solution 1: Custom CIDR blocks for pods (prefix delegation)
kubectl set env daemonset aws-node -n kube-system \\
  ENABLE_PREFIX_DELEGATION=true \\
  WARM_PREFIX_TARGET=1
# Each node gets a /28 prefix (16 IPs) from the subnet, not individual IPs
# Dramatically increases pod density per node

# Solution 2: Secondary CIDR block (add 100.64.0.0/16 to VPC)
aws ec2 associate-vpc-cidr-block \\
  --vpc-id vpc-xxx \\
  --cidr-block 100.64.0.0/16
# Create subnets in this CIDR for pods only
\`\`\`

## EBS CSI Driver — Persistent Storage

\`\`\`yaml
# StorageClass for gp3 SSD (default after EBS CSI driver install)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer  # provision in same AZ as pod
reclaimPolicy: Retain   # don't delete EBS volume when PVC deleted
parameters:
  type: gp3
  encrypted: "true"
  kmsKeyId: arn:aws:kms:...  # encrypt with your KMS key
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes: [ReadWriteOnce]   # EBS can only attach to ONE node
  storageClassName: gp3
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: gp3
        resources:
          requests:
            storage: 100Gi
\`\`\`

## EFS CSI Driver — Shared Storage

EFS provides **ReadWriteMany** — multiple pods across multiple nodes can mount the same filesystem simultaneously. EBS cannot do this.

\`\`\`bash
# Create EFS filesystem:
EFS_ID=$(aws efs create-file-system \\
  --performance-mode generalPurpose \\
  --throughput-mode elastic \\
  --encrypted \\
  --query 'FileSystemId' --output text)

# Create mount targets in each AZ:
for SUBNET in subnet-aaa subnet-bbb subnet-ccc; do
  aws efs create-mount-target \\
    --file-system-id \$EFS_ID \\
    --subnet-id \$SUBNET \\
    --security-groups sg-xxx
done
\`\`\`

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: efs-sc
provisioner: efs.csi.aws.com
parameters:
  provisioningMode: efs-ap
  fileSystemId: fs-xxxxx
  directoryPerms: "700"
---
# Use case: shared ML training data mounted by multiple GPU pods
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: training-data
spec:
  accessModes: [ReadWriteMany]   # multiple pods across nodes
  storageClassName: efs-sc
  resources:
    requests:
      storage: 1Ti
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Your EKS pods are running out of IP addresses. How do you diagnose and fix it?",
              difficulty: "senior" as const,
              answer: `**Diagnosis:**
\`\`\`bash
# Symptom: pods stuck in Pending, event says:
# "0/3 nodes are available: 3 Insufficient pods"
# OR
# CNI error: "failed to assign an IP address to container"

# Check node IP capacity:
kubectl describe node ip-10-0-1-1 | grep -A5 "Allocatable"
# pods: 110  ← default max pods per node
# This is limited by ENIs and IPs per ENI

# Check per-node pod count:
kubectl get pods --all-namespaces -o wide | awk '{print \$8}' | sort | uniq -c | sort -rn
# Node with 110/110 pods → IP exhaustion on that node

# Check subnet available IPs:
aws ec2 describe-subnets --subnet-ids subnet-xxx \\
  --query 'Subnets[0].AvailableIpAddressCount'
\`\`\`

**Understanding the limit:** Each EC2 instance type has a max number of ENIs and IPs per ENI. E.g., m5.xlarge has 4 ENIs × 15 IPs = 60 IPs → max ~58 pods (2 reserved for node).

**Solutions:**

**Option 1 — Scale out node group (short-term):**
\`\`\`bash
aws eks update-nodegroup-config \\
  --cluster-name prod-cluster \\
  --nodegroup-name general \\
  --scaling-config desiredSize=10,minSize=5,maxSize=20
\`\`\`

**Option 2 — Enable prefix delegation (best long-term):**
\`\`\`bash
# Each node gets a /28 block (16 IPs) instead of individual IPs
# m5.xlarge: 4 ENIs × 15 prefixes × 16 IPs = 960 possible pod IPs!
kubectl set env daemonset aws-node -n kube-system \\
  ENABLE_PREFIX_DELEGATION=true \\
  WARM_PREFIX_TARGET=1
kubectl rollout restart daemonset aws-node -n kube-system
\`\`\`

**Option 3 — Larger subnets (infrastructure change):**
\`\`\`bash
# /24 subnet = 254 IPs. For 100 pods with buffer, need /22 or larger
# Add secondary CIDR: 100.64.0.0/16 to VPC (100K+ IPs)
# Create new subnets in secondary CIDR for pods
\`\`\`

**Option 4 — Use Fargate for suitable workloads:**
Fargate pods don't consume node IP capacity.`,
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────
    // MODULE 8 — Monitoring, Security & Cost
    // ─────────────────────────────────────────
    {
      id: "aws-monitoring-security",
      title: "Monitoring, Security & Cost",
      description: "CloudWatch, CloudTrail, GuardDuty, Config, Cost Explorer, and Budgets.",
      level: "intermediate",
      lessons: [
        {
          id: "cloudwatch",
          title: "CloudWatch Monitoring",
          description: "Metrics, alarms, dashboards, log insights, and composite alarms.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Create CloudWatch alarms for EC2, RDS, and Lambda",
            "Query logs with CloudWatch Logs Insights",
            "Build a CloudWatch dashboard via CLI",
            "Set up anomaly detection alarms",
          ],
          content: `## CloudWatch Monitoring

CloudWatch is the native AWS observability service — metrics, logs, alarms, and dashboards.

---

## Creating Alarms

\`\`\`bash
# EC2 CPU alarm → SNS notification
aws cloudwatch put-metric-alarm \
  --alarm-name "ec2-high-cpu" \
  --alarm-description "EC2 CPU > 80% for 5 minutes" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistic Average \
  --period 60 \
  --evaluation-periods 5 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --ok-actions arn:aws:sns:us-east-1:123456789012:ops-alerts \
  --treat-missing-data notBreaching

# Lambda error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "lambda-error-rate" \
  --metrics '[
    {"Id":"errors","MetricStat":{"Metric":{"Namespace":"AWS/Lambda","MetricName":"Errors","Dimensions":[{"Name":"FunctionName","Value":"my-function"}]},"Period":60,"Stat":"Sum"}},
    {"Id":"invocations","MetricStat":{"Metric":{"Namespace":"AWS/Lambda","MetricName":"Invocations","Dimensions":[{"Name":"FunctionName","Value":"my-function"}]},"Period":60,"Stat":"Sum"}},
    {"Id":"errorRate","Expression":"errors/invocations*100","Label":"Error Rate %"}
  ]' \
  --comparison-operator GreaterThanThreshold \
  --threshold 5 \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts

# RDS freeable memory alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "rds-low-memory" \
  --metric-name FreeableMemory \
  --namespace AWS/RDS \
  --dimensions Name=DBInstanceIdentifier,Value=my-aurora-writer \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 256000000 \
  --comparison-operator LessThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:ops-alerts
\`\`\`

---

## CloudWatch Logs Insights

\`\`\`bash
# Query Lambda errors
aws logs start-query \
  --log-group-name /aws/lambda/my-function \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string '
    fields @timestamp, @message
    | filter @message like /ERROR/
    | sort @timestamp desc
    | limit 50
  '

# Get the query results
aws logs get-query-results --query-id <query-id>

# P99 latency for API Gateway
aws logs start-query \
  --log-group-name /aws/apigateway/my-api \
  --start-time $(date -d '24 hours ago' +%s) \
  --end-time $(date +%s) \
  --query-string '
    fields @timestamp, responseLatency
    | stats
      count(*) as requests,
      avg(responseLatency) as p50,
      percentile(responseLatency, 95) as p95,
      percentile(responseLatency, 99) as p99
      by bin(5m)
  '
\`\`\`

---

## Custom Metrics

\`\`\`bash
# Push a custom metric from application code
aws cloudwatch put-metric-data \
  --namespace "MyApp/Orders" \
  --metric-name OrdersProcessed \
  --value 42 \
  --unit Count \
  --dimensions Environment=production,Region=us-east-1

# From a script
for i in {1..5}; do
  aws cloudwatch put-metric-data \
    --namespace "MyApp/Queue" \
    --metric-name QueueDepth \
    --value $(redis-cli llen orders_queue) \
    --unit Count
  sleep 60
done
\`\`\`

---

## CloudWatch Dashboard

\`\`\`bash
aws cloudwatch put-dashboard \
  --dashboard-name "Production-Overview" \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "x": 0, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "EC2 CPU Utilization",
          "metrics": [["AWS/EC2","CPUUtilization","AutoScalingGroupName","my-app-asg"]],
          "period": 60,
          "stat": "Average",
          "view": "timeSeries"
        }
      },
      {
        "type": "alarm",
        "x": 12, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "Active Alarms",
          "alarms": [
            "arn:aws:cloudwatch:us-east-1:123456789012:alarm:ec2-high-cpu",
            "arn:aws:cloudwatch:us-east-1:123456789012:alarm:rds-low-memory"
          ]
        }
      }
    ]
  }'
\`\`\``,
        },
        {
          id: "security-and-cost",
          title: "Security Services & Cost Management",
          description: "GuardDuty, Security Hub, Config, Cost Explorer, and Budgets.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Enable GuardDuty and investigate findings",
            "Set up AWS Config rules for compliance checking",
            "Analyse costs with Cost Explorer CLI",
            "Create Budget alerts to prevent cost overruns",
          ],
          content: `## Security Services & Cost Management

AWS provides native security services and cost management tools that integrate with your DevOps workflows.

---

## GuardDuty — Threat Detection

GuardDuty analyses CloudTrail, VPC Flow Logs, and DNS logs with ML to detect threats.

\`\`\`bash
# Enable GuardDuty
DETECTOR_ID=$(aws guardduty create-detector \
  --enable \
  --finding-publishing-frequency FIFTEEN_MINUTES \
  --query 'DetectorId' --output text)

echo "Detector ID: \$DETECTOR_ID"

# List findings (filter to HIGH)
aws guardduty list-findings \
  --detector-id \$DETECTOR_ID \
  --finding-criteria '{
    "Criterion": {
      "severity": {"Gte": 7}
    }
  }'

# Get finding details
aws guardduty get-findings \
  --detector-id \$DETECTOR_ID \
  --finding-ids <finding-id> \
  --query 'Findings[0].{Title:Title,Severity:Severity,Type:Type,Description:Description}'

# Archive a finding (after investigation)
aws guardduty archive-findings \
  --detector-id \$DETECTOR_ID \
  --finding-ids <finding-id>

# Sample common finding types:
# UnauthorizedAccess:EC2/SSHBruteForce
# Recon:EC2/PortProbeUnprotectedPort
# CryptoCurrency:EC2/BitcoinTool.B!DNS
# PrivilegeEscalation:IAMUser/AnomalousBehavior
\`\`\`

---

## AWS Config — Compliance Rules

Config continuously records AWS resource configurations and evaluates them against rules.

\`\`\`bash
# Enable Config recorder
aws configservice put-configuration-recorder \
  --configuration-recorder '{
    "name": "default",
    "roleARN": "arn:aws:iam::123456789012:role/ConfigRole",
    "recordingGroup": {
      "allSupported": true,
      "includeGlobalResourceTypes": true
    }
  }'

aws configservice put-delivery-channel \
  --delivery-channel '{
    "name": "default",
    "s3BucketName": "my-config-bucket",
    "configSnapshotDeliveryProperties": {"deliveryFrequency": "TwentyFour_Hours"}
  }'

aws configservice start-configuration-recorder --configuration-recorder-name default

# Add managed rules
aws configservice put-config-rule \
  --config-rule '{
    "ConfigRuleName": "s3-bucket-public-read-prohibited",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"
    }
  }'

aws configservice put-config-rule \
  --config-rule '{
    "ConfigRuleName": "encrypted-volumes",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "ENCRYPTED_VOLUMES"
    }
  }'

# Check compliance
aws configservice describe-compliance-by-config-rule \
  --query 'ComplianceByConfigRules[*].{Rule:ConfigRuleName,Compliance:Compliance.ComplianceType}' \
  --output table

# Get non-compliant resources
aws configservice get-compliance-details-by-config-rule \
  --config-rule-name s3-bucket-public-read-prohibited \
  --compliance-types NON_COMPLIANT
\`\`\`

---

## Cost Explorer & Budgets

\`\`\`bash
# Get cost breakdown by service for last month
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[*].{Service:Keys[0],Cost:Metrics.UnblendedCost.Amount}' \
  --output table | sort -k2 -rn

# Get cost by tag (requires cost allocation tags enabled)
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-02-01 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=TAG,Key=Environment \
  --query 'ResultsByTime[0].Groups[*].{Env:Keys[0],Cost:Metrics.UnblendedCost.Amount}'

# Get rightsizing recommendations
aws ce get-rightsizing-recommendation \
  --service EC2 \
  --configuration '{"RecommendationTarget":"SAME_INSTANCE_FAMILY","BenefitsConsidered":true}' \
  --query 'RightsizingRecommendations[0:5].{
    Instance:CurrentInstance.ResourceId,
    Savings:RightsizingType,
    Estimated:EstimatedMonthlySavings
  }'

# Create a budget with alert
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "monthly-spending",
    "BudgetLimit": {"Amount": "1000", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "devops@mycompany.com"
    }]
  }]'

# Spot savings analysis
aws ce get-savings-plans-purchase-recommendation \
  --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR \
  --payment-option NO_UPFRONT \
  --lookback-period-in-days THIRTY_DAYS \
  --query 'SavingsPlansPurchaseRecommendation.SavingsPlansRecommendationDetails[0:3].{
    EstimatedROI:EstimatedROI,
    EstimatedSavings:EstimatedSavingsAmount,
    Commitment:HourlyCommitmentToPurchase
  }'
\`\`\`

> **Tip:** Enable **AWS Compute Optimizer** — it analyses EC2, ECS, Lambda, and EBS usage and recommends right-sized replacements. Typical savings are 20–40% for workloads that were initially over-provisioned. It's free to enable and recommendations are updated weekly.`,
          interviewQuestions: [
            {
              question: "Your AWS bill increased by 40% last month. Walk me through how you investigate and reduce it.",
              difficulty: "mid" as const,
              answer: `**Step 1 — Identify the source:**
\`\`\`bash
# Cost Explorer — top services by cost:
aws ce get-cost-and-usage \\
  --time-period Start=2024-01-01,End=2024-01-31 \\
  --granularity MONTHLY \\
  --metrics BlendedCost \\
  --group-by Type=DIMENSION,Key=SERVICE \\
  --query 'ResultsByTime[0].Groups | sort_by(@, &Metrics.BlendedCost.Amount) | reverse(@)[:10]'

# Identify the spike date:
aws ce get-cost-and-usage \\
  --time-period Start=2024-01-01,End=2024-01-31 \\
  --granularity DAILY \\
  --metrics BlendedCost
\`\`\`

**Step 2 — Common culprits and fixes:**

**NAT Gateway data transfer:**
\`\`\`bash
# Often the biggest surprise. Fix: VPC Endpoints for S3/DynamoDB
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-xxx --service-name com.amazonaws.us-east-1.s3 \\
  --type Gateway --route-table-ids rtb-yyy
# Eliminates NAT Gateway charges for S3 traffic
\`\`\`

**EC2 — right-sizing with Compute Optimizer:**
\`\`\`bash
aws compute-optimizer get-ec2-instance-recommendations \\
  --query 'instanceRecommendations[?finding==\`OVER_PROVISIONED\`].{
    Instance:instanceArn,
    Current:currentInstanceType,
    Recommended:recommendationOptions[0].instanceType,
    Savings:recommendationOptions[0].estimatedMonthlySavings.value
  }'
\`\`\`

**Unattached EBS volumes:**
\`\`\`bash
aws ec2 describe-volumes \\
  --filters Name=status,Values=available \\
  --query 'Volumes[].{ID:VolumeId,Size:Size,Type:VolumeType}'
# $0.08-0.12/GB/month for sitting unused
\`\`\`

**Unattached Elastic IPs:**
\`\`\`bash
aws ec2 describe-addresses \\
  --query 'Addresses[?InstanceId==null].PublicIp'
# $0.005/hr each when unattached
\`\`\`

**Step 3 — Reserved Instances / Savings Plans:**
For stable workloads, commit to 1 or 3 years: 30–65% savings vs On-Demand.
\`\`\`bash
# Get Savings Plans recommendation:
aws ce get-savings-plans-purchase-recommendation \\
  --savings-plans-type COMPUTE_SP \\
  --term-in-years ONE_YEAR --payment-option NO_UPFRONT \\
  --lookback-period-in-days THIRTY_DAYS
\`\`\`

**Step 4 — Set up budget alerts (prevent future surprises):**
\`\`\`bash
aws budgets create-budget \\
  --account-id 123456789 \\
  --budget file://budget.json  # alert at 80% of monthly budget
\`\`\``,
            },
            {
              question: "How do you monitor application health in AWS using CloudWatch? What metrics and alarms would you set for a production API?",
              difficulty: "mid" as const,
              answer: `**Key metrics for a production API:**

**ALB metrics:**
\`\`\`bash
# Alarm: p99 latency > 1 second for 3 consecutive minutes:
aws cloudwatch put-metric-alarm \\
  --alarm-name "api-high-latency" \\
  --namespace AWS/ApplicationELB \\
  --metric-name TargetResponseTime \\
  --extended-statistic p99 \\
  --threshold 1.0 --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 3 --period 60 \\
  --alarm-actions arn:aws:sns:...:oncall

# 5XX error rate > 1%:
aws cloudwatch put-metric-alarm \\
  --alarm-name "api-high-5xx" \\
  --namespace AWS/ApplicationELB \\
  --metric-name HTTPCode_Target_5XX_Count \\
  --threshold 10 --evaluation-periods 2 --period 60 \\
  --alarm-actions arn:aws:sns:...:oncall
\`\`\`

**EC2/Container metrics:**
- CPUUtilization > 80% for 5 min → scale out trigger
- MemoryUtilization > 85% → potential OOM incoming
- Disk usage > 80% → app may fail to write

**Custom application metrics:**
\`\`\`python
# Send custom metrics from your app:
cloudwatch.put_metric_data(
    Namespace='MyApp/API',
    MetricData=[{
        'MetricName': 'OrdersProcessed',
        'Value': order_count,
        'Unit': 'Count'
    }, {
        'MetricName': 'PaymentErrors',
        'Value': error_count,
        'Unit': 'Count'
    }]
)
\`\`\`

**Dashboard:**
\`\`\`bash
# Create a dashboard with key widgets:
aws cloudwatch put-dashboard --dashboard-name "API-Production" \\
  --dashboard-body file://dashboard.json
# Include: request count, p50/p95/p99 latency, error rates, EC2 CPU/memory, RDS connections
\`\`\`

**Alarm best practices:**
- Use ALARM state to page oncall, OK state to auto-resolve
- Set evaluation periods to 2-3 to avoid false positives from transient spikes
- Composite alarms to reduce noise (only alert if both error rate AND latency are high)`,
            },
          ],
        },
      ],
      exam: [
        { question: "You created an EKS cluster but kubectl can't connect to the API server. What do you check?", answer: "1) Run 'aws eks update-kubeconfig --name cluster-name --region us-east-1' to generate/update the kubeconfig. 2) Verify the IAM user/role running kubectl has an entry in the EKS aws-auth ConfigMap — only the creator has access by default. 3) Check cluster endpoint access: if 'Private' only, kubectl must run from within the VPC or a connected network. If 'Public', verify the public endpoint is not restricted to specific CIDRs that exclude your IP. 4) Confirm the IAM entity has eks:DescribeCluster permission. 5) Check that your AWS credentials are set correctly (AWS_PROFILE or AWS_ACCESS_KEY_ID).", difficulty: "mid" as const },
        { question: "A Pod in EKS cannot access an S3 bucket despite the node's IAM role having S3 permissions. What is the recommended fix?", answer: "Use IRSA (IAM Roles for Service Accounts) instead of relying on node-level IAM roles. Node-level roles grant permissions to ALL pods on that node — a security anti-pattern. IRSA: 1) Enable the OIDC provider for the cluster. 2) Create an IAM role with a trust policy allowing the cluster's OIDC provider and the specific ServiceAccount. 3) Annotate the Kubernetes ServiceAccount: 'eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/my-pod-role'. 4) The pod's containers get temporary credentials scoped to that role via projected token. This provides per-pod, least-privilege IAM access.", difficulty: "senior" as const },
        { question: "EKS nodes are running but pods are stuck in Pending state. What are the possible causes?", answer: "1) Insufficient resources — nodes don't have enough CPU/memory for the pod's requests. Run 'kubectl describe pod' to see the 'Insufficient cpu/memory' event. 2) Taints without matching tolerations — nodes have taints that the pod doesn't tolerate. 3) Node selector or affinity rules don't match any node labels. 4) PersistentVolumeClaim not bound — if the pod requires a PVC, it won't schedule until the PVC is bound to a PV. 5) Node group hasn't scaled up yet — if using Cluster Autoscaler, wait for it to provision new nodes. 6) Pod quota exceeded in the namespace. Run 'kubectl describe pod <name>' — the Events section shows the exact scheduling failure reason.", difficulty: "mid" as const },
        { question: "How do you upgrade an EKS cluster from version 1.28 to 1.29 with minimal disruption?", answer: "1) Check release notes for 1.29 breaking changes and deprecated APIs. 2) Update control plane first: 'aws eks update-cluster-version --name prod-cluster --kubernetes-version 1.29'. Wait for the control plane upgrade to complete (~15 minutes). 3) Update cluster add-ons (CoreDNS, kube-proxy, VPC CNI) to versions compatible with 1.29. 4) Update managed node groups one at a time: 'aws eks update-nodegroup-version --cluster-name prod-cluster --nodegroup-name general'. This cordons and drains nodes, then replaces with new AMIs. 5) Test workloads after each step. You can only upgrade one minor version at a time (1.28→1.29, not 1.27→1.29).", difficulty: "senior" as const },
        { question: "What is the EKS VPC CNI plugin and what problem does it solve?", answer: "The Amazon VPC CNI (Container Network Interface) plugin gives each Kubernetes Pod a real VPC IP address from the node's subnet. Without it, pods would use an overlay network (like Flannel) with a different IP space that doesn't integrate with VPC routing. With VPC CNI: each pod gets a private IP from the subnet, security groups and NACLs can reference pod IPs directly, and pods can communicate with other VPC resources using native VPC routing. Limitation: each EC2 instance has a maximum number of network interfaces and IPs per interface (instance-dependent), which limits how many pods can run per node. Use 'kubectl describe node' to see allocatable pod count.", difficulty: "senior" as const },
        { question: "You need to run a batch job on EKS that requires 8 GPU cores, but no GPU nodes are currently running. How do you handle this?", answer: "1) Create a separate managed node group with GPU instance types (e.g., p3.8xlarge or p4d.24xlarge) with an initial count of 0. 2) Install the NVIDIA device plugin as a DaemonSet so Kubernetes can schedule pods with 'nvidia.com/gpu: 8' resource requests. 3) Add a taint to GPU nodes (e.g., 'nvidia.com/gpu=true:NoSchedule') so only GPU-requesting pods land there. 4) Configure Cluster Autoscaler to scale this node group when GPU pods are pending. 5) When the batch job pod is submitted, Cluster Autoscaler sees it's pending due to insufficient GPU nodes and provisions the GPU instance. After the job completes, scale-in removes the expensive node.", difficulty: "senior" as const },
        { question: "How do managed node groups differ from self-managed node groups in EKS?", answer: "Managed Node Groups: AWS provisions and manages the underlying EC2 instances using an EKS-optimized AMI. AWS handles node upgrades (cordon, drain, replace) via 'aws eks update-nodegroup-version'. Automatic EC2 instance repair — unhealthy nodes are replaced. Limited to a subset of instance types. Self-managed Node Groups: You control the EC2 instances via a Launch Template and Auto Scaling Group. You're responsible for AMI updates, draining, and replacement. More flexible — supports any instance type, custom AMIs, Windows nodes, custom user data. Use managed node groups unless you have specific requirements (custom AMI, Windows, specific instance configs) that they don't support.", difficulty: "mid" as const },
        { question: "A developer accidentally deleted the aws-auth ConfigMap on EKS. How do you recover access?", answer: "The aws-auth ConfigMap controls who can authenticate to the cluster via IAM. If deleted, only the IAM identity that created the cluster retains access. Recovery: 1) Use the cluster creator's IAM credentials to run kubectl. 2) Recreate the aws-auth ConfigMap with the correct IAM user/role mappings. Format: mapRoles for IAM roles (recommended), mapUsers for specific IAM users. 3) Add back all admin roles and the node group instance role (required for nodes to join the cluster). Prevention: Use GitOps (Flux or ArgoCD) to manage the aws-auth ConfigMap so it's always in source control and auto-reconciled.", difficulty: "senior" as const },
        { question: "How does Fargate work with EKS, and when would you choose it over managed node groups?", answer: "EKS Fargate runs each pod on its own dedicated compute without you managing EC2 nodes. You create Fargate profiles that match pods by namespace and labels. When a matching pod is scheduled, EKS provisions Fargate compute (billed per pod per second). Choose Fargate when: You want no node management overhead, you need strong workload isolation (each pod on its own microVM), or for batch/short-lived workloads. Choose managed node groups when: You need DaemonSets (Fargate doesn't support them), you need specific instance types or GPUs, you have long-running services where EC2 pricing is cheaper, or you need to mount node-local storage.", difficulty: "mid" as const },
        { question: "How do you implement cluster-level autoscaling in EKS when pods can't be scheduled due to insufficient node capacity?", answer: "Install Cluster Autoscaler (CA): 1) Create an IAM role with IRSA for the CA pod with permissions to modify Auto Scaling Groups. 2) Deploy CA with the annotation specifying the cluster name. 3) Tag your node group ASG with 'k8s.io/cluster-autoscaler/enabled: true' and 'k8s.io/cluster-autoscaler/cluster-name: my-cluster'. 4) CA watches for pending pods and scales up the matching node group's ASG, then scales down when nodes are underutilized for 10+ minutes. Alternative: Karpenter (AWS's newer autoscaler) is more flexible — it directly provisions EC2 instances without needing predefined node groups and can pick the most cost-efficient available instance type.", difficulty: "senior" as const },
      ],
    },
  ],
};
