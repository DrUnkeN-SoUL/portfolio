export const bio = [
  "Full-stack & DevOps engineer",
  "based in Kochi, Kerala, India",
  "",
  "Python, Go and Rust",
  "systems over frameworks",
  "pipelines over dashboards",
  "",
  "Production deployments across",
  "AWS, GCP and Azure — multi-tenant",
  "APIs, data pipelines, observability",
  "and the infrastructure around them",
  "",
  "One shipped project holds a",
  "Guinness World Record",
];

export const metrics = [
  { value: "20+", label: "ingestion pipelines built" },
  { value: "3", label: "clouds in production" },
  { value: "27+", label: "fastapi modules shipped" },
  { value: "50+", label: "candidates mentored" },
  { value: "6", label: "projects in production" },
  { value: "1", label: "guinness world record" },
];

/**
 * Canonical skill list. Feeds the homepage `knowsAbout` structured data, so
 * only list things the rest of this file (or public/llm.txt) already backs up.
 */
export const skills = [
  "Python",
  "FastAPI",
  "Go",
  "Rust",
  "TypeScript",
  "React",
  "Next.js",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "SQLAlchemy",
  "AWS",
  "GCP",
  "Azure",
  "Terraform",
  "Ansible",
  "Docker",
  "Kubernetes",
  "Helm",
  "GitHub Actions",
  "Prometheus",
  "Grafana",
  "Loki",
  "eBPF",
  "OpenAI",
  "Amazon Bedrock",
  "Multi-tenant architecture",
  "Observability",
];

export type Role = {
  period: string;
  title: string;
  org: string;
  line: string;
};

export const roles: Role[] = [
  {
    period: "Dec 2025",
    title: "Full-Stack Developer (Contract)",
    org: "Thoughtroutes · CDA, Dubai Government",
    line: "Built and deployed the official CDA platform that earned a Guinness World Record for highest online member participation.",
  },
  {
    period: "2024 — Present",
    title: "Observability Engineer",
    org: "Thoughtroutes · Client Deployments",
    line: "End-to-end observability: Prometheus alerting, Grafana dashboards, Loki aggregation, Beyla eBPF auto-instrumentation.",
  },
  {
    period: "2024",
    title: "Contract Full-Stack Developer",
    org: "Exotic Green · Austria",
    line: "Sole developer of a warehouse management system, through a multi-phase migration and a full v2 rebuild.",
  },
  {
    period: "Nov 2023 — Present",
    title: "Full-Stack Developer",
    org: "Thoughtroutes · CloudPositive",
    line: "Owned the backend of a multi-cloud cost governance SaaS — 20+ ingestion pipelines and secretless onboarding across three clouds.",
  },
  {
    period: "Jun 2023 — Nov 2023",
    title: "Full-Stack Developer",
    org: "Xmigrate",
    line: "FastAPI backend across 27+ modules, Keycloak SSO, React Flow topology dashboards and a Go eBPF replication agent.",
  },
  {
    period: "May 2023 — Jun 2023",
    title: "Web Developer Intern",
    org: "Xmigrate",
    line: "First production code shipped — REST endpoints, relational data models, integration testing.",
  },
  {
    period: "2020 — 2023",
    title: "BCA, Computer Applications",
    org: "Mahatma Gandhi University",
    line: "Bachelor's degree alongside self-directed systems, cloud and open-source work.",
  },
];

export type Project = {
  name: string;
  year: string;
  client: string;
  info: string;
  tech: string;
  url?: string;
  urlLabel?: string;
};

export const projects: Project[] = [
  {
    name: "CloudPositive Cost Governance",
    year: "2023—",
    client: "Thoughtroutes · Enterprise Cost SaaS",
    info: "Multi-tenant SaaS for cost monitoring across AWS, GCP and Azure. Per-tenant schema isolation, 20+ modular ingestion pipelines orchestrated via SQS, secretless onboarding (IAM roles, GCP service accounts, Azure AD admin consent + ARM provisioning), and an OpenAI cost-estimation engine with a 5-stage MCP pipeline and per-tenant cost attribution. Provisioned end to end with Terraform and Ansible on ECS Fargate and GKE.",
    tech: "python, fastapi, sqlalchemy, ecs, sqs, athena, glue, opensearch, bigquery, terraform, helm, openai",
  },
  {
    name: "Xmigrate eBPF Replicator",
    year: "2023",
    client: "Open Source · Cross-Cloud VM Migration",
    info: "Live block-level VM disk replication using eBPF to detect source changes. 27+ FastAPI backend modules, Keycloak SSO, a multi-channel WebSocket dispatcher in Go, C-shared migration plugins for AWS, Azure, GCP and OCI, plus a Next.js React Flow topology dashboard.",
    tech: "go, ebpf, python, fastapi, nextjs, keycloak, postgresql, ecs fargate",
  },
  {
    name: "WMS & Auto-Compliance",
    year: "2024",
    client: "Exotic Green, Austria · Sole developer",
    info: "Full warehouse inventory tracker for an Austrian supermarket chain. FastAPI backend with batch tracking, PDF compliance reports, an APScheduler cron with exponential backoff and a ZXing webcam barcode scanner. Containerised with Docker Compose and rebuilt in v2 with Vitest, Playwright and Web Vitals monitoring.",
    tech: "fastapi, nextjs, postgresql, redis, cognito, docker, zxing, vitest, playwright",
  },
  {
    name: "Sign Language Platform",
    year: "2025",
    client: "Thoughtroutes · Dubai Govt. CDA",
    info: "Official government platform that earned a Guinness World Record for highest online member participation. Bilingual English/Arabic RTL portal with passwordless magic-link auth, event and quiz management, PostgreSQL audit logging and multi-stage Docker builds deployed on Azure.",
    tech: "nextjs, typescript, postgresql, docker, azure, sendgrid, next-intl",
    url: "https://dcsl.cda.gov.ae/en",
    urlLabel: "dcsl.cda.gov.ae",
  },
  {
    name: "AI Medicine Reminder Bot",
    year: "2025",
    client: "Personal Project · Serverless",
    info: "Two-Lambda stateless/stateful architecture with checkpoint and replay for execution-state recovery, tracking medicine lifecycles with no external database and zero idle cost. Amazon Bedrock parses physical prescriptions through multimodal text and image input.",
    tech: "python, durable functions, bedrock, lambda, telegram bot api",
  },
  {
    name: "blitz",
    year: "2025",
    client: "Open Source · MIT Licensed",
    info: "HTTP and WebSocket stress testing CLI in Rust: real-time terminal dashboard, configurable RPM, p50/p95/p99 latency percentiles, multi-URL YAML pipelines and JSON reports. In progress — per-worker proxy rotation and Tor routing.",
    tech: "rust, tokio, reqwest, tokio-tungstenite, cli",
    url: "https://github.com/DrUnkeN-SoUL/blitz",
    urlLabel: "github.com/DrUnkeN-SoUL/blitz",
  },
];

export const community = [
  "CCL — mentored 50+ candidates across networking, Python and cloud",
  "Trained engineering interns at Thoughtroutes",
  "AWS Community Group Kochi — volunteered at AWS Community Day 2025",
  "CNCF Kochi — volunteered at Kubernetes Community Day 2026",
];

export type ProfileLink = {
  label: string;
  href: string;
  /** `me` marks identity links (GitHub, LinkedIn) for verification. */
  rel?: "me";
};

export const links: ProfileLink[] = [
  { label: "Email", href: "mailto:mail@mathewsshaji.com" },
  { label: "GitHub", href: "https://github.com/DrUnkeN-SoUL", rel: "me" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mathews-shaji", rel: "me" },
  { label: "Writing", href: "https://blog.mathewsshaji.com" },
  { label: "Résumé", href: "https://mathewsshaji.com/Mathews_Shaji_Resume.pdf" },
];
