export const getCommands = (terminal) => ({
  help: () => {
    const sep = terminal.divider('─', 2);
    return `
  <span class="term-indigo">ms-shell v2.0</span>  <span class="term-gray">·  Mathews Shaji — Interactive Terminal</span>
  <span class="term-gray">${sep}</span>

  <span class="term-indigo">about</span>         who I am &amp; what I do
  <span class="term-indigo">whoami</span>        bio + interactive ASCII portrait
  <span class="term-indigo">now</span>           current status &amp; focus
  <span class="term-indigo">uses</span>          daily dev environment &amp; tools
  <span class="term-indigo">fun</span>           something personal 🥚
  <span class="term-indigo">skills</span>        full tech stack breakdown
  <span class="term-indigo">projects</span>      selected production builds
  <span class="term-indigo">resume</span>        complete CV with experience
  <span class="term-indigo">contact</span>       email &amp; how to reach me
  <span class="term-indigo">availability</span>  open-to-work status &amp; timezone
  <span class="term-indigo">socials</span>       github &amp; linkedin
  <span class="term-indigo">theme</span> <span class="term-gray">[name]</span>  switch palette (mint·cyan·amber·mono)
  <span class="term-indigo">clear</span>         clear terminal
  <span class="term-indigo">help</span>          show this menu

  <span class="term-gray">Tab autocomplete · ↑↓ history · Ctrl+R search</span>`;
  },

  about: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Mathews Shaji</span>  <span class="term-gray">Backend-Leaning Full-Stack Developer</span>
<span class="term-gray">${sep}</span>
<span class="term-yellow">Role</span>    Backend-Leaning Full-Stack Developer
<span class="term-yellow">Based</span>   Kochi, Kerala, India  <span class="term-gray">[UTC +5:30]</span>
<span class="term-yellow">Open</span>    Remote contracts · Full-time roles globally

I build the plumbing no one sees but everyone depends on.
Multi-tenant FastAPI services, Go systems tooling, and data
pipelines that route cloud cost data across three providers
before breakfast.

Currently maintaining the entire backend of a pre-launch
multi-cloud cost governance SaaS while shipping contracts
for clients in Dubai and Austria on the side.

<span class="term-gray">3 yrs prod  ·  5 shipped systems  ·  3 cloud providers</span>
<span class="term-gray">${terminal.divider('─')}</span>
<span class="term-gray">Type </span><span class="term-yellow">now</span><span class="term-gray"> for current focus · </span><span class="term-yellow">resume</span><span class="term-gray"> for full history · </span><span class="term-yellow">contact</span><span class="term-gray"> to hire</span>`;
  },

  now: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Current Status</span>  <span class="term-green">● active</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">Day job</span>
  Full-Stack Developer @ Thoughtroutes  <span class="term-gray">(remote, full-time, Nov 2023–)</span>
  ▸ CloudPositive — Multi-cloud cost governance SaaS (AWS/GCP/Azure)
  ▸ 20+ ingestion pipelines, secretless onboarding, AI cost estimation
  ▸ Client infra observability — Prometheus, Grafana, Loki, Beyla eBPF

<span class="term-yellow">Recent</span>
  ▸ CDA Dubai — Built Guinness World Record sign language platform

<span class="term-yellow">Side work</span>
  Contract deliveries — Next.js · FastAPI · Go

<span class="term-yellow">Currently learning</span>
  ▸ eBPF internals &amp; kernel-space tooling in Go
  ▸ Distributed tracing with OpenTelemetry
  ▸ Rust — slowly, but surely

<span class="term-yellow">This portfolio</span>
  Built with Astro · Vanilla CSS · zero UI frameworks
  Custom terminal shell (you're in it) · particles · crack FX

<span class="term-gray">Timezone: IST (UTC+5:30) · overnight availability for EU/US</span>`;
  },

  uses: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Dev Setup &amp; Daily Tools</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">Editor</span>    VS Code + Vim keybindings
<span class="term-yellow">Terminal</span>  zsh + starship prompt  <span class="term-gray">(WSL2 on Windows)</span>
<span class="term-yellow">Theme</span>     Dark. Always dark.

<span class="term-yellow">Daily drivers</span>
  <span class="term-gray">Languages</span>   Python · Go · TypeScript
  <span class="term-gray">Backend</span>     FastAPI · Gin · SQLAlchemy · Alembic
  <span class="term-gray">Frontend</span>    Next.js · shadcn/ui · Tailwind
  <span class="term-gray">Cloud</span>       AWS (primary) · GCP · Azure
  <span class="term-gray">DB</span>          PostgreSQL · Redis · OpenSearch
  <span class="term-gray">Infra</span>       Docker · Terraform · K8s · Grafana

<span class="term-yellow">Favourites</span>
  <span class="term-indigo">FastAPI</span>    async-first, OpenAPI schema out of the box
  <span class="term-indigo">Go</span>         when Python is too slow or too fragile
  <span class="term-indigo">Neon DB</span>    serverless Postgres that just works
  <span class="term-indigo">shadcn/ui</span>  copy-paste components, you own the code

<span class="term-yellow">Browser</span>   Firefox <span class="term-gray">(privacy)</span> + Chrome <span class="term-gray">(DevTools)</span>
<span class="term-yellow">Music</span>     Lo-fi when focusing · metal when debugging`;
  },

  availability: () => {
    const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const h = ist.getHours();
    const online = h >= 9 && h < 23;
    const statusSpan = online
      ? '<span class="term-green">● online now</span>'
      : '<span class="term-gray">◌ offline — back at 09:00 IST</span>';
    const istStr = ist.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Availability</span>  ${statusSpan}
<span class="term-gray">${sep}</span>

<span class="term-yellow">Status</span>     Open to new opportunities
<span class="term-yellow">Type</span>       Remote contracts · Full-time globally
<span class="term-yellow">Notice</span>     Available immediately for contract work
<span class="term-yellow">Time</span>       IST (UTC+5:30) — it’s <span class="term-indigo">${istStr}</span> here right now

<span class="term-yellow">Ideal engagement</span>
  ▸ Backend-heavy systems &amp; API architecture
  ▸ Cloud infrastructure / DevOps overlaps
  ▸ Full-stack product engineering (Go or Python)
  ▸ Remote-first, async-friendly teams

<span class="term-yellow">Hours  </span>  <span class="term-gray">(IST)</span>  Weekdays 09:00–22:00 · Weekends flexible
<span class="term-gray">Overnight IST = EU mornings · Early IST = US evenings</span>
<span class="term-gray">${terminal.divider('─')}</span>
<span class="term-gray">Type </span><span class="term-yellow">contact</span><span class="term-gray"> to reach out directly</span>`;
  },

  fun: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  The Human Behind the Terminal</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">Name</span>        Mathews  <span class="term-gray">(friends call me Mat)</span>
<span class="term-yellow">Age</span>         Late 20s, Kerala-born, globally distributed
<span class="term-yellow">Superpower</span>  Reading stack traces at 2 AM without coffee

<span class="term-yellow">Off the clock</span>
  ▸ Mechanical keyboard rabbit hole  <span class="term-gray">(it never ends)</span>
  ▸ Breaking things to understand how they work
  ▸ Convincing myself Rust is the answer to everything
  ▸ Watching F1 reruns &amp; pretending I didn’t know the outcome

<span class="term-yellow">Opinions</span>
  <span class="term-indigo">Hot take</span>    Tabs &gt; spaces. There. I said it.
  <span class="term-indigo">Cold take</span>   TypeScript saved frontend development
  <span class="term-indigo">Spicy take</span>  Docker solves 90% of “works on my machine”

<span class="term-yellow">Philosophy</span>
  “Ship something real. Then make it good. Then make it fast.”
  Code is a liability — delete more than you write.`;
  },

  skills: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Technical Stack</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">Backend</span>
  Python (FastAPI · Flask · Django)  <span class="term-gray">·</span>  Go (Gin · SQLX)
  Node.js  <span class="term-gray">·</span>  Frappe Framework  <span class="term-gray">·</span>  REST &amp; WebSocket APIs

<span class="term-yellow">Frontend</span>
  Next.js  <span class="term-gray">·</span>  React  <span class="term-gray">·</span>  Tailwind  <span class="term-gray">·</span>  shadcn/ui
  Framer Motion  <span class="term-gray">·</span>  Radix UI  <span class="term-gray">·</span>  TanStack  <span class="term-gray">·</span>  ZXing-JS

<span class="term-yellow">Cloud &amp; Infra</span>
  AWS  <span class="term-gray">ECS · SQS · Lambda · Cognito · S3 · Athena · OpenSearch</span>
  GCP  <span class="term-gray">BigQuery · GKE · IAM service accounts</span>
  Azure  <span class="term-gray">ARM templates · Entra ID · AD App Registration</span>
  Terraform · Terragrunt · Kubernetes · Helm · Ansible

<span class="term-yellow">Databases</span>
  PostgreSQL  <span class="term-gray">·</span>  Neon DB  <span class="term-gray">·</span>  MySQL  <span class="term-gray">·</span>  Redis
  OpenSearch  <span class="term-gray">·</span>  MongoDB  <span class="term-gray">·</span>  Multi-tenant Schema Isolation

<span class="term-yellow">Auth</span>
  OAuth2/OIDC  <span class="term-gray">·</span>  JWT  <span class="term-gray">·</span>  AWS Cognito  <span class="term-gray">·</span>  Keycloak
  Multi-tenant RBAC  <span class="term-gray">·</span>  Secretless onboarding

<span class="term-yellow">AI / ML</span>
  OpenAI SDK  <span class="term-gray">·</span>  Amazon Bedrock (Nova Lite)
  TensorFlow/Keras  <span class="term-gray">·</span>  OpenCV  <span class="term-gray">·</span>  LangChain
  Multimodal (text + image)  <span class="term-gray">·</span>  Structured JSON output

<span class="term-yellow">Observability</span>
  Grafana  <span class="term-gray">·</span>  Loki  <span class="term-gray">·</span>  Prometheus  <span class="term-gray">·</span>  GitHub Actions`;
  },

  projects: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Selected Builds</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">01  CloudPositive Cost Governance</span>  <span class="term-gray">multi-cloud SaaS</span>
    Multi-tenant cost monitoring across AWS, GCP &amp; Azure
    Event-driven SQS pipelines, Athena/Glue CUR analysis,
    secretless onboarding, LangChain AI cost predictions
    <span class="term-gray">FastAPI · React · Terraform · OpenSearch · OpenAI</span>

<span class="term-yellow">02  Xmigrate eBPF Replicator</span>  <span class="term-gray">systems / Go</span>
    Live VM disk replication via eBPF block-layer hooks
    Multi-channel WebSocket dispatcher, C-shared plugins
    Next.js topology dashboard with React Flow
    <span class="term-gray">Go · eBPF · Next.js · Keycloak · WebSocket</span>

<span class="term-yellow">03  WMS &amp; Auto-Compliance</span>  <span class="term-gray">full-stack · Austria</span>
    Full warehouse system, barcode scanner, batch tracking,
    timezone-aware compliance cron, multi-phase Frappe migration
    <span class="term-gray">FastAPI · Next.js · Frappe · Neon DB · Redis · ZXing</span>

<span class="term-yellow">04  Dubai CDA Sign Language Platform</span>  <span class="term-gray">govt. contract</span>
    Bilingual EN/AR RTL portal for Guinness World Record event
    reCAPTCHA flows, admin panel, headless Chrome PDF certs
    <span class="term-gray">Next.js · PostgreSQL · Headless Chrome · Azure · Docker</span>

<span class="term-yellow">05  AI Medicine Bot</span>  <span class="term-gray">serverless · Bedrock</span>
    Durable Lambda state machine + Bedrock Nova Lite
    Multimodal prescription parsing (text + photo)
    Zero external DB — free idempotency via state replay
    <span class="term-gray">Python · Lambda (Durable) · Bedrock · Telegram</span>`;
  },

  socials: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Connect</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">GitHub</span>    <a href="https://github.com/DrUnkeN-SoUL" target="_blank" rel="noopener noreferrer" style="color:var(--hi)">github.com/DrUnkeN-SoUL</a>
          Open-source projects · dotfiles · experiments

<span class="term-yellow">LinkedIn</span>  <a href="https://linkedin.com/in/mathews-shaji" target="_blank" rel="noopener noreferrer" style="color:var(--hi)">linkedin.com/in/mathews-shaji</a>
          Work history · recommendations · DMs open

<span class="term-gray">I respond within 24h · async-friendly</span>`;
  },

  contact: () => {
    const sep = terminal.divider('━');
    return `
<span class="term-indigo">◍  Get in Touch</span>
<span class="term-gray">${sep}</span>

<span class="term-yellow">Email</span>     <span class="term-indigo">mail@mathewsshaji.com</span>
<span class="term-yellow">LinkedIn</span>  <a href="https://linkedin.com/in/mathews-shaji" target="_blank" rel="noopener noreferrer" style="color:var(--hi)">linkedin.com/in/mathews-shaji</a>
<span class="term-yellow">GitHub</span>    <a href="https://github.com/DrUnkeN-SoUL" target="_blank" rel="noopener noreferrer" style="color:var(--hi)">github.com/DrUnkeN-SoUL</a>
<span class="term-yellow">Location</span>  Kochi, Kerala, India  <span class="term-gray">[UTC+5:30]</span>

<span class="term-gray">Response time: &lt; 24h · DMs open on LinkedIn</span>
<span class="term-gray">Open to remote contracts and full-time roles worldwide.</span>`;
  },

  email: () => terminal.commands.contact(),

  resume: () => {
    const sep = terminal.divider('━');
    const sepDash = terminal.divider('─');
    const cols = terminal.getTerminalCols();

    let headerBlock;
    if (cols < 50) {
      // Compact layout for narrow mobile screens — no box
      headerBlock = `
<span class="term-indigo">◍  Mathews Shaji — Full-Stack Developer</span>
<span class="term-gray">${sep}</span>
<span class="term-yellow">Email</span>   mail@mathewsshaji.com
<span class="term-yellow">GitHub</span>  github.com/DrUnkeN-SoUL
<span class="term-yellow">Based</span>   Kochi, Kerala, India
<span class="term-yellow">LinkedIn</span> linkedin.com/in/mathews-shaji`;
    } else {
      const line1 = ' mail@mathewsshaji.com      github.com/DrUnkeN-SoUL';
      const line2 = ' Kochi, Kerala, India         linkedin.com/in/mathews-shaji';
      const maxLineLen = Math.max(line1.length, line2.length);
      const minBoxW = maxLineLen + 2;
      const boxW = Math.min(Math.max(cols - 2, minBoxW), 78);
      const inner = boxW - 2;
      const pad1 = Math.max(inner - line1.length, 0);
      const pad2 = Math.max(inner - line2.length, 0);
      const top    = '┌' + '─'.repeat(inner) + '┐';
      const bot    = '└' + '─'.repeat(inner) + '┘';
      const r1     = '│' + line1 + ' '.repeat(pad1) + '│';
      const r2     = '│' + line2 + ' '.repeat(pad2) + '│';
      headerBlock = `
<span class="term-indigo">◍  Mathews Shaji — Full-Stack Developer</span>
<span class="term-gray">${top}</span>
<span class="term-gray">${r1}</span>
<span class="term-gray">${r2}</span>
<span class="term-gray">${bot}</span>`;
    }

    return `
${headerBlock}

<span class="term-yellow">── Experience ${terminal.divider('─', 14)}</span>

<span class="term-indigo">Full-Stack Developer</span>              <span class="term-gray">Nov 2023 – Present</span>
<span class="term-gray">Thoughtroutes (Remote)</span>

  <span class="term-yellow">CloudPositive — Multi-Cloud Cost Management Platform</span>
  <span class="term-gray">Nov 2023 – Present</span>
  ▸ Architected multi-tenant FastAPI backend with per-tenant MySQL schema isolation
  ▸ 20+ modular SQS pipelines: AWS Cost Explorer, GCP BigQuery, Azure Cost Mgmt
  ▸ Secretless onboarding: AWS IAM roles, GCP service accounts, Azure AD consent
  ▸ Multi-cloud validation service (AWS, GCP BigQuery, Azure RBAC) on Docker/Terraform
  ▸ Real-time alerting: OpenSearch monitors, thresholds, webhook channels
  ▸ GCP pre-onboarding validator on Kubernetes with Helm chart
  ▸ AI cost estimation API: OpenAI, structured JSON, multi-step pipeline
  ▸ Microservices on AWS ECS: RDS MySQL, SQS, OpenSearch; Ansible playbooks
  <span class="term-gray">Stack: Python, FastAPI, SQLAlchemy, AWS (ECS, RDS, Cognito, Lambda, SQS, Athena, OpenSearch),
  GCP (BigQuery, IAM, GKE), Azure (Cost Mgmt, ARM), MySQL, Docker, Terraform, K8s, Helm, OpenAI</span>

  <span class="term-yellow">Client Infrastructure Monitoring</span>  <span class="term-gray">2024 – Present</span>
  ▸ End-to-end observability: Prometheus alerting, Grafana, Loki, Beyla eBPF
  ▸ Nginx reverse proxy, SSL termination, load balancing, Node Exporter metrics
  <span class="term-gray">Stack: Prometheus, Grafana, Loki, Node Exporter, Beyla (eBPF), Nginx, Linux</span>

<span class="term-indigo">Full-Stack Developer</span>              <span class="term-gray">Dec 2025</span>
<span class="term-gray">Thoughtroutes · CDA, Dubai Government (Remote)</span>
  ▸ Built dcsl.cda.gov.ae — <span class="term-green">Guinness World Record</span> for highest online participation
  ▸ Dockerised Next.js with multi-stage Azure builds
  ▸ Full i18n (English/Arabic RTL), passwordless magic-link auth, PostgreSQL + audit logging
  <span class="term-gray">Stack: Next.js, TypeScript, PostgreSQL, Docker, Azure, SendGrid, next-intl, reCAPTCHA</span>

<span class="term-indigo">Contract Full-Stack Developer</span>    <span class="term-gray">2024</span>
<span class="term-gray">Exotic Green — Austria (Remote · Sole Developer)</span>
  ▸ Sole developer: full-stack warehouse management platform
  ▸ FastAPI backend: inventory, batch/expiry tracking, APScheduler compliance cron
  ▸ Next.js frontend: webcam barcode (zxing), PDF reports, AWS Cognito auth
  ▸ v2 rebuild: Vitest, Playwright E2E, Web Vitals monitoring
  ▸ Dockerised platform (FastAPI, Next.js, PostgreSQL, Redis) for dev &amp; production
  <span class="term-gray">Stack: Python, FastAPI, Next.js, TypeScript, PostgreSQL, Redis, AWS Cognito, shadcn/ui, Docker</span>

<span class="term-indigo">Full-Stack Developer</span>              <span class="term-gray">Jun 2023 – Nov 2023</span>
<span class="term-gray">Xmigrate (Remote)</span>
  ▸ FastAPI backend: org/project/blueprint mgmt, cloud config (AWS/Azure/GCP/OCI)
  ▸ Keycloak SSO: OAuth2/OIDC, custom themes, token exchange on ECS Fargate
  ▸ Next.js dashboard: React Flow topology, ApexCharts, Radix UI, PDF invoicing
  ▸ Validated live VM migration workflows across cloud environments
  <span class="term-gray">Stack: Python, FastAPI, Next.js, Keycloak, PostgreSQL, AWS ECS Fargate, Cloudflare</span>

<span class="term-indigo">Web Developer Intern</span>              <span class="term-gray">May 2023 – Jun 2023</span>
<span class="term-gray">Xmigrate (Remote)</span>
  ▸ FastAPI endpoints for cloud migration backend, API integration, data flow validation

<span class="term-yellow">── Education ${terminal.divider('─', 13)}</span>
<span class="term-indigo">Bachelor of Computer Application (BCA)</span>  <span class="term-gray">2020 – 2023</span>
<span class="term-gray">Mahatma Gandhi University · Ernakulam, Kerala, India</span>

<span class="term-yellow">── Stack ${terminal.divider('─', 9)}</span>
<span class="term-gray">Backend:</span>     Python / FastAPI / Flask · Go / Gin · Node.js · TypeScript
<span class="term-gray">Cloud:</span>       AWS (ECS·EKS·RDS·Lambda·S3·Cognito·SQS·OpenSearch·Athena·Glue·ALB·VPC·IAM·ECR·CodePipeline)
<span class="term-gray">             </span>GCP (BigQuery·IAM·GKE) · Azure (Cost Mgmt·ARM·Multi-tenant App Reg)
<span class="term-gray">IaC:</span>         Docker · Terraform · Kubernetes · Helm · Ansible · GitHub Actions
<span class="term-gray">DB:</span>          PostgreSQL · MySQL · SQLAlchemy · MongoDB · OpenSearch · Redis · DynamoDB
<span class="term-gray">Frontend:</span>    Next.js · React · Tailwind · shadcn/ui · Radix UI · MUI
<span class="term-gray">Auth:</span>        OAuth2 · OIDC · JWT · AWS Cognito · Keycloak · Azure AD · RBAC
<span class="term-gray">AI/ML:</span>       OpenAI (Structured JSON) · Amazon Bedrock · TensorFlow/Keras · OpenCV · LangChain

<span class="term-yellow">── Open Source ${terminal.divider('─', 14)}</span>
<span class="term-indigo">blitz</span>             HTTP &amp; WebSocket stress testing CLI (Rust · tokio · reqwest)
<span class="term-gray">                  Real-time dashboard, RPM config, latency p50/p95/p99, YAML pipelines, JSON reports. MIT.</span>
<span class="term-indigo">Xmigrate</span>          Open source cross-cloud VM migration platform
<span class="term-gray">                  FastAPI backend + Go eBPF block-level replication agent.</span>
<span class="term-indigo">SocialSim</span>         <span class="term-gray">(In dev)</span> Multi-agent social simulation, knowledge graph, CAMEL-AI OASIS

<span class="term-yellow">── Languages ${terminal.divider('─', 13)}</span>
<span class="term-gray">English (Fluent) · Malayalam (Native) · Hindi (Conversational)</span>

<span class="term-gray">${sepDash}</span>
<span class="term-gray">Type </span><span class="term-yellow">contact</span><span class="term-gray"> to reach out · </span><span class="term-yellow">about</span><span class="term-gray"> for summary</span>`;
  },

  whoami: () => terminal.renderAvatar(),
  avatar: () => terminal.renderAvatar(),
  clear: () => '__CLEAR__'
});

export const getSudoCommands = (terminal) => ({
  'rm': () => {
    // Collect layout elements to destroy (excluding the terminal container initially)
    const elements = [];
    document.querySelectorAll('section').forEach(sec => {
      if (sec.classList.contains('hero')) {
        const textCol = sec.querySelector('.hero-text-col');
        if (textCol) elements.push(textCol);
      } else {
        elements.push(sec);
      }
    });
    document.querySelectorAll('footer, .navbar').forEach(el => elements.push(el));
    
    const termContainer = document.querySelector('.terminal-container');
    if (termContainer) {
      elements.push(termContainer);
    }

    if (elements.length === 0) return `<span class="term-red">No target structures found.</span>`;

    // Lock body scrolling to lock in-place view
    document.body.style.overflow = 'hidden';
    if (termContainer) {
      termContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Web Audio Synthesizer for retro PC speaker BIOS warnings and clicks
    let audioCtx = null;
    const initAudio = () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
    };

    const playBeep = (freq, duration, type = 'square', gainVal = 0.05) => {
      try {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration - 0.005);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (_) {}
    };

    const playBIOSBeeps = () => {
      try {
        // Motherboard RAM/Video Fault POST Code: 1 Long beep + 3 Short click beeps
        playBeep(880, 0.5, 'square', 0.04);
        setTimeout(() => playBeep(880, 0.12, 'square', 0.04), 650);
        setTimeout(() => playBeep(880, 0.12, 'square', 0.04), 850);
        setTimeout(() => playBeep(880, 0.12, 'square', 0.04), 1050);
      } catch (_) {}
    };

    // Scramble text nodes inside an element to hex memory dump values (looks like V8 memory corruption)
    const scrambleElementText = (el) => {
      el.querySelectorAll('h1, h2, h3, h4, h5, p, span, a, button, li').forEach(node => {
        if (node.children.length > 0) return;
        const text = node.textContent;
        if (!text || !text.trim()) return;
        node.setAttribute('data-orig-text', text);
        
        let scrambled = "";
        const hexChars = "0123456789ABCDEF";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " " || text[i] === "\n") {
            scrambled += text[i];
          } else if (i % 4 === 0) {
            scrambled += " 0x" + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + " ";
          } else {
            scrambled += hexChars[Math.floor(Math.random() * 16)];
          }
        }
        node.textContent = scrambled.substring(0, text.length * 1.3);
      });
    };

    // GPU screen tearing slices overlay
    let glitchOverlayInterval = null;
    let glitchOverlay = null;

    const startHardwareGlitch = () => {
      glitchOverlay = document.createElement('div');
      glitchOverlay.id = 'hardware-glitch-overlay';
      glitchOverlay.style.position = 'fixed';
      glitchOverlay.style.inset = '0';
      glitchOverlay.style.pointerEvents = 'none';
      glitchOverlay.style.zIndex = '999998';
      document.body.appendChild(glitchOverlay);

      // Create 10 horizontal scan slices that tear elements
      for (let i = 0; i < 10; i++) {
        const slice = document.createElement('div');
        slice.className = 'glitch-tear-slice';
        slice.style.top = `${Math.random() * 100}%`;
        slice.style.height = `${Math.random() * 20 + 2}px`;
        glitchOverlay.appendChild(slice);
      }

      glitchOverlayInterval = setInterval(() => {
        glitchOverlay.querySelectorAll('.glitch-tear-slice').forEach(slice => {
          slice.style.top = `${Math.random() * 100}%`;
          slice.style.height = `${Math.random() * 25 + 4}px`;
          slice.style.transform = `translateX(${(Math.random() - 0.5) * 50}px)`;
          slice.style.background = Math.random() > 0.6
            ? `rgba(${Math.random() > 0.5 ? '255, 0, 85' : '0, 255, 204'}, 0.25)`
            : 'rgba(255, 255, 255, 0.1)';
        });

        // Gentle physical camera shake / horizontal frame drift
        document.body.style.transform = Math.random() > 0.3
          ? `translate(${(Math.random() - 0.5) * 12}px, ${(Math.random() - 0.5) * 6}px) skewX(${(Math.random() - 0.5) * 3}deg)`
          : '';
      }, 60);
    };

    const stopHardwareGlitch = () => {
      if (glitchOverlayInterval) clearInterval(glitchOverlayInterval);
      if (glitchOverlay) glitchOverlay.remove();
      document.body.style.transform = '';
    };

    // --- Progressive Multi-Phase Crash Sequences ---

    // PHASE 1: Silent Memory Decay (first 3 seconds)
    // Scrambles letters on the page in-place, simulating a slowly propagating memory leak.
    const textNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, p, span, a, button, li'))
      .filter(n => n.children.length === 0 && n.textContent && n.textContent.trim() && !n.closest('.terminal-container'));

    const decayIntervalId = setInterval(() => {
      if (textNodes.length === 0) return;
      // Scramble random page elements
      const node = textNodes[Math.floor(Math.random() * textNodes.length)];
      const text = node.textContent;
      if (!text || text.length < 3) return;

      if (!node.hasAttribute('data-orig-text')) {
        node.setAttribute('data-orig-text', text);
      }

      const chars = text.split('');
      const scrambleCount = Math.ceil(chars.length * 0.15);
      const hexChars = "0123456789ABCDEF";

      for (let k = 0; k < scrambleCount; k++) {
        const idx = Math.floor(Math.random() * chars.length);
        if (chars[idx] !== ' ' && chars[idx] !== '\n') {
          chars[idx] = hexChars[Math.floor(Math.random() * 16)];
          if (Math.random() > 0.8) {
            chars[idx] = '0x' + hexChars[Math.floor(Math.random() * 16)];
          }
        }
      }

      node.textContent = chars.join('');
      // Quiet electronic click click click diagnostic buzzer clicks
      playBeep(2200, 0.004, 'sine', 0.015);
    }, 120);

    // Print progress indicators to terminal container during memory decay
    let decayPhase = 0;
    const printTerminalDecayProgress = () => {
      const bodyEl = document.getElementById('terminal-body');
      const inputEl = document.getElementById('terminal-input');
      if (!bodyEl || !inputEl) return;

      const logRow = document.createElement('div');
      logRow.className = 'terminal-output-row';
      
      if (decayPhase === 0) {
        logRow.innerHTML = `<span class="term-yellow">[BIOS] verifying L1/L2 cache blocks... ok</span>`;
        decayPhase++;
        setTimeout(printTerminalDecayProgress, 1000);
      } else if (decayPhase === 1) {
        logRow.innerHTML = `<span class="term-red">[WARN] memory leak detected in heap allocation table. parity unchecked.</span>`;
        decayPhase++;
        setTimeout(printTerminalDecayProgress, 1000);
      } else if (decayPhase === 2) {
        logRow.innerHTML = `<span class="term-red" style="font-weight:bold;">[CRITICAL] cascade failure in RAM modules. sector integrity compromised!</span>`;
      }
      
      const activeLine = inputEl.closest('.terminal-line');
      bodyEl.insertBefore(logRow, activeLine);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    };

    printTerminalDecayProgress();

    // PHASE 2: Motherboard buzzer alarm beep & In-place Element dissolution (starts after 3 seconds)
    let destructionTimeout = setTimeout(() => {
      clearInterval(decayIntervalId);
      playBIOSBeeps();
      startHardwareGlitch();

      let count = 0;
      const runDestruction = () => {
        if (count < elements.length) {
          const el = elements[count];
          
          el.classList.add('destruction-shake');
          scrambleElementText(el);

          if (el === termContainer) {
            el.classList.add('terminal-intense-glitch');
          }

          setTimeout(() => {
            el.classList.remove('destruction-shake');
            el.classList.add('system-destroyed');
            
            setTimeout(() => {
              el.style.display = 'none';
            }, 450);
          }, 600);

          count++;
          // Gradual collapse rate (800ms)
          setTimeout(runDestruction, 800);
        } else {
          // Elements collapsed. Stop glitch overlays and go to BIOS panic screen
          stopHardwareGlitch();
          window.scrollTo(0, 0);
          showPanicOverlay();
        }
      };

      runDestruction();
    }, 3000);

    // PHASE 3: BIOS Sector Scanner & Triggered Software Kernel Panic Dump
    const runRAMScan = (onCellScan, onComplete, onCorruptFound) => {
      const gridEl = document.getElementById('ram-scan-grid');
      const statusEl = document.getElementById('ram-status');
      if (!gridEl) return;

      const totalRows = 8;
      const cols = 12;
      const blocks = [];

      for (let r = 0; r < totalRows; r++) {
        blocks.push(new Array(cols).fill('.'));
      }

      const renderGrid = () => {
        let html = '';
        for (let r = 0; r < totalRows; r++) {
          const addr = (0x001000 + r * 16).toString(16).toUpperCase().padStart(6, '0');
          let row = `<span style="color:rgba(0, 255, 102, 0.3);">[0x${addr}]</span> `;
          for (let c = 0; c < cols; c++) {
            const char = blocks[r][c];
            if (char === '■') {
              row += `<span style="color:#00ff66;">■</span> `;
            } else if (char === '☒') {
              row += `<span style="color:#ff3333;font-weight:bold;">☒</span> `;
            } else {
              row += `<span style="color:#223322;">.</span> `;
            }
          }
          html += row + '\n';
        }
        gridEl.innerHTML = html;
      };

      renderGrid();

      let currentRow = 0;
      let currentCol = 0;
      let corruptFoundTriggered = false;

      const scanNext = () => {
        if (currentRow < totalRows) {
          const isCorrupt = (currentRow === 3 && currentCol >= 4 && currentCol <= 6) ||
                            (currentRow === 5 && currentCol >= 2 && currentCol <= 4) ||
                            (currentRow === 7 && currentCol === 10);

          if (isCorrupt) {
            blocks[currentRow][currentCol] = '☒';
            statusEl.style.color = '#ff3333';
            statusEl.innerText = `[WARN] Memory parity failure at 0x${(0x001000 + currentRow * 16 + currentCol).toString(16).toUpperCase()}! Sector unreadable.`;
            onCellScan(false);
            if (!corruptFoundTriggered) {
              corruptFoundTriggered = true;
              onCorruptFound(); // Triggers stack trace dump!
            }
          } else {
            blocks[currentRow][currentCol] = '■';
            statusEl.style.color = '#00ff66';
            statusEl.innerText = `Testing RAM block ${currentRow * cols + currentCol + 1}/${totalRows * cols}...`;
            onCellScan(true);
          }

          renderGrid();
          currentCol++;
          if (currentCol >= cols) {
            currentCol = 0;
            currentRow++;
          }

          setTimeout(scanNext, isCorrupt ? 220 : 60);
        } else {
          statusEl.style.color = '#ff3333';
          statusEl.innerText = `[HALT] Scan complete. 7 unrecoverable sectors. Memory parity failure.`;
          if (onComplete) onComplete();
        }
      };

      setTimeout(scanNext, 400);
    };

    const showPanicOverlay = () => {
      let overlay = document.getElementById('panic-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'panic-overlay';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.zIndex = '1000000';
        overlay.style.background = '#000000';
        overlay.style.padding = '1.5rem';
        overlay.style.overflow = 'hidden';
        overlay.style.boxShadow = 'inset 0 0 120px rgba(0, 0, 0, 1)';
        overlay.style.backgroundImage = 'radial-gradient(circle, rgba(10, 14, 10, 0.45) 0%, rgba(0, 0, 0, 1) 100%)';
        overlay.style.display = 'block';
        document.body.appendChild(overlay);
      }
      overlay.innerHTML = `
        <div class="panic-container">
          <div class="panic-header">
            <pre style="margin: 0; line-height: 1.1; color:#00ff66; font-size: clamp(8px, 1vw, 13px);">
██████╗ ██╗ ██████╗ ███████╗    ██████╗  █████╗ ███╗   ██╗██╗ ██████╗ 
██╔══██╗██║██╔═══██╗██╔════╝    ██╔══██╗██╔══██╗████╗  ██║██║██╔════╝ 
██████╔╝██║██║   ██║███████╗    ██████╔╝███████║██╔██╗ ██║██║██║      
██╔══██╗██║██║   ██║╚════██║    ██╔═══╝ ██╔══██║██║╚██╗██║██║██║      
██████╔╝██║╚██████╔╝███████║    ██║     ██║  ██║██║ ╚████║██║╚██████╗ 
╚══════╝ ╚═╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝ ╚══════╝
            </pre>
            <div style="font-weight: bold; margin-top: 4px; font-size: clamp(14px, 1.2vw, 18px); letter-spacing: 1px;">SYSTEM HARDWARE DIAGNOSTICS & CORE KERNEL PANIC DUMP</div>
            <div style="border-bottom: 1px dashed rgba(0, 255, 102, 0.25); margin: 6px 0;"></div>
          </div>
          <div class="panic-grid">
            <div class="panic-left-col">
              <pre id="panic-console" style="margin: 0; padding: 0; white-space: pre-wrap; word-break: break-all; line-height: 1.35;"></pre>
            </div>
            <div class="panic-right-col">
              <div class="bios-title">AMIBIOS (C) 2026 MATHEWS SHAJI INC.</div>
              <div class="bios-info">
                CPU  : AMD Ryzen Threadripper PRO 3995WX @ 3.50GHz<br/>
                MEM  : 32768 MB DDR4 ECC Registered<br/>
                HOST : PORTFOLIO-SERVER-NODE-1<br/>
                OS   : Linux kernel-v6.8.0-31-generic (x86_64)
              </div>
              <div style="margin-top: 15px; font-weight: bold; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; border-bottom: 1px dashed rgba(255, 255, 255, 0.1); padding-bottom: 3px; font-size: 15px;">Core Memory Block Scan:</div>
              <pre id="ram-scan-grid" style="margin: 8px 0;"></pre>
              <div id="ram-status" style="font-weight: bold; margin-top: 2px;">Initializing hardware tests...</div>
            </div>
          </div>
          <div id="panic-countdown" style="margin-top: 1rem; text-align: center; font-family: 'VT323', monospace; font-size: clamp(18px, 1.5vw, 24px); color: #00ff66; font-weight: bold;"></div>
        </div>
      `;

      const consolePre = document.getElementById('panic-console');
      const countdownDiv = document.getElementById('panic-countdown');

      const panicLogs = [
        "  [ 0.000000] INITIALIZING SYSTEM PANIC COREDUMP -- VER v3.0.0",
        "  [ 0.000005] CPU: 4 Core Threadripper / Port 4321 / Live Node",
        "  [ 0.021082] EXT4-fs (sda2): mounting secure portfolio system files...",
        "  [ 0.091384] systemd[1]: loading cloudpositive_cur.go cost ingest module...",
        "  [ 0.124930] systemd[1]: initializing ebpf_replicator_block.c dispatcher...",
        "  [ 0.231908] systemd[1]: starting wms_auto_compliance.py scheduler...",
        "  [ 0.342918] systemd[1]: checking fastapi_engine.py endpoint status... [OK]",
        "  [ 0.490102] systemd[1]: loading local astro_hydrate_islands client...",
        "  [ 0.681903] sys_call_trace: hook attached to system disk read/write layer",
        "  [ 0.812938] ttyS0 at I/O 0x3f8 (irq = 4, base_baud = 115200) active as Console",
        "  [ 1.092830] [CRITICAL] Core memory parity failure at offset 0xDEADBEEF!",
        "  [ 1.092832] BUG: unable to handle kernel page allocation request in memory",
        "  [ 1.092834] #PF: supervisor write access in kernel mode (error code 0x0002)",
        "  [ 1.092836] PGD 0 P4D 0 -> segmentation fault in astro_islands.js",
        "  [ 1.092838] Oops: 0002 [#1] PREEMPT SMP",
        "  [ 1.092840] CPU: 2 Comm: astro-hydrate Not tainted 6.8.0-31-generic",
        "  [ 1.092842] RIP: 0010:astro_hydrate_islands+0x4c/0x90 [astro_engine]",
        "  [ 1.092844] Call Trace:",
        "  [ 1.092846]   <TASK>",
        "  [ 1.092848]   ? page_fault_oops+0x13c/0x2c0",
        "  [ 1.092850]   ? exc_page_fault+0x6c/0x150",
        "  [ 1.092852]   ? asm_exc_page_fault+0x26/0x30",
        "  [ 1.092862]   ? render_projects_ascii+0x45/0x90 [projects.astro]",
        "  [ 1.092864]   ? syscall_exit_to_user_mode+0x72/0x120",
        "  [ 1.092866]   ? entry_SYSCALL_64_after_hwframe+0x76/0x7e",
        "  [ 1.092868]   </TASK>",
        "  [ 1.092870] ---[ end trace 0000000000000000 ]---",
        "  [ 1.092872] KERNEL PANIC - not syncing: Fatal Exception: Attempted to kill init! exitcode=0x00000007",
        "  [ 1.092874] System halted. Resetting host..."
      ];

      let logIndex = 0;
      let logsStarted = false;

      const printNextLog = () => {
        if (logIndex < panicLogs.length) {
          let lineText = panicLogs[logIndex];
          if (lineText.includes("KERNEL PANIC") || lineText.includes("BUG:") || lineText.includes("Oops:") || lineText.includes("[CRITICAL]")) {
            lineText = '<span style="color:#ff3333;font-weight:bold;">' + lineText + '</span>';
          } else if (lineText.includes("Call Trace:") || lineText.includes("<TASK>") || lineText.includes("</TASK>")) {
            lineText = '<span style="color:#ffe66d;">' + lineText + '</span>';
          } else if (lineText.includes("cloudpositive") || lineText.includes("ebpf") || lineText.includes("wms") || lineText.includes("fastapi")) {
            lineText = '<span style="color:#00ffff;">' + lineText + '</span>';
          }
          consolePre.innerHTML += lineText + '\n';
          const leftCol = consolePre.closest('.panic-left-col');
          if (leftCol) leftCol.scrollTop = leftCol.scrollHeight;
          logIndex++;
          setTimeout(printNextLog, 40);
        }
      };

      const triggerLogs = () => {
        if (!logsStarted) {
          logsStarted = true;
          printNextLog();
        }
      };

      runRAMScan(
        (isHealthy) => {
          if (isHealthy) {
            playBeep(1400, 0.015, 'sine', 0.015);
          } else {
            playBeep(180, 0.12, 'sawtooth', 0.06);
          }
        },
        () => {
          let secondsLeft = 6;
          const updateCountdown = () => {
            if (secondsLeft > 0) {
              const stamp = (1.5 + (6 - secondsLeft) * 0.25).toFixed(6);
              countdownDiv.innerHTML = `[    ${stamp}] CRITICAL: REBOOTING SYSTEM IN ${secondsLeft} SECONDS...<span class="panic-cursor"></span>`;
              
              // Diagnostic beep warning for final seconds
              if (secondsLeft <= 3) {
                playBeep(880, 0.1, 'square', 0.03);
              }

              secondsLeft--;
              setTimeout(updateCountdown, 1000);
            } else {
              countdownDiv.innerHTML = `[    3.000000] RESETTING HOST DEVICE...`;
              overlay.classList.add('crt-powering-off');
              setTimeout(() => {
                window.location.reload();
              }, 800);
            }
          };
          updateCountdown();
        },
        () => {
          triggerLogs();
        }
      );
    };

    showPanicOverlay();

    // Brief screen glitch effect on terminal body
    const term = document.getElementById('terminal-body');
    if (term) {
      term.style.animation = 'caffeine-shake 0.1s infinite';
      setTimeout(() => {
        term.style.animation = '';
      }, 600);
    }

    return `<span class="term-red">CRITICAL WARNING: System destruction initiated. System panic incoming...</span>`;
  }
});

export const getEasterEggs = (terminal) => ({
  cloudpositive: `<span class="term-indigo">CloudPositive</span>  <span class="term-gray">// Thoughtroutes · access granted</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
Multi-tenant cost governance SaaS — production.
Dynamic schema isolation: <span class="term-green">✓</span>  20+ SQS pipelines: <span class="term-green">✓</span>
Secretless onboarding: AWS/GCP/Azure  AI cost estimation: <span class="term-green">✓</span>
<span class="term-gray">Grafana/Loki: </span><span class="term-green">● healthy</span>  <span class="term-gray">ECS autoscaling: </span><span class="term-green">● nominal</span>`,

  xmigrate: `<span class="term-indigo">Xmigrate</span>  <span class="term-gray">// eBPF hook verified</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
Block-layer dispatcher: <span class="term-green">● running</span>  WS channels: open
Migration agent: registered  Keycloak SSO: <span class="term-green">✓</span>
<span class="term-gray">React Flow topology: rendered  PDF invoicing: ready</span>`,

  wms: `<span class="term-indigo">WMS</span>  <span class="term-gray">// Exotic Green · Austria</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
Frappe instance: <span class="term-green">● online</span>  Neon DB connection: pooled
Auto-compliance cron: <span class="term-green">● running</span>  <span class="term-gray">[AT timezone]</span>
ZXing barcode scanner: ready  Redis cache: warm`,

  exoticgreen: `<span class="term-indigo">WMS</span>  <span class="term-gray">// Exotic Green · Austria</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
Frappe instance: <span class="term-green">● online</span>  Neon DB connection: pooled
Auto-compliance cron: <span class="term-green">● running</span>  <span class="term-gray">[AT timezone]</span>
ZXing barcode scanner: ready  Redis cache: warm`,

  cda: `<span class="term-indigo">CDA Platform</span>  <span class="term-gray">// Thoughtroutes · Dubai Govt</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
EN/AR RTL: <span class="term-green">✓</span>  Passwordless auth: <span class="term-green">✓</span>  reCAPTCHA: <span class="term-green">✓</span>
Dockerised on Azure: <span class="term-green">✓</span>  Guinness World Record: <span class="term-green">✓</span>
<span class="term-gray">Live: </span><span class="term-cyan">dcsl.cda.gov.ae</span>`,

  dcsl: `<span class="term-indigo">CDA Platform</span>  <span class="term-gray">// Thoughtroutes · Dubai Govt</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
EN/AR RTL: <span class="term-green">✓</span>  Passwordless auth: <span class="term-green">✓</span>  reCAPTCHA: <span class="term-green">✓</span>
Dockerised on Azure: <span class="term-green">✓</span>  Guinness World Record: <span class="term-green">✓</span>
<span class="term-gray">Live: </span><span class="term-cyan">dcsl.cda.gov.ae</span>`,

  medicine: `<span class="term-indigo">Medicine Bot</span>  <span class="term-gray">// Durable Lambda + Bedrock</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
Durable state machine: replay-ready  No external DB
Bedrock Nova Lite multimodal parser: <span class="term-green">● active</span>
<span class="term-gray">Prescription photo → structured JSON: </span><span class="term-green">✓</span>`,

  matrix: `<span class="term-indigo">Wake up, Neo…</span>
<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
The Matrix has you.

<span class="term-yellow">Follow the white rabbit. 🐇</span>

<span class="term-gray">You took the red pill — now you see how deep it goes.</span>
<span class="term-gray">Spoiler: it ends in a FastAPI endpoint on AWS Lambda.</span>`,

  vim: () => {
    const uid = Date.now();
    const runVimSequence = () => {
      const loader = document.getElementById(`vim-loader-${uid}`);
      const bodyEl = document.getElementById('terminal-body');
      const inputEl = document.getElementById('terminal-input');
      if (!bodyEl || !inputEl || !loader) return;

      const activeLine = inputEl.closest('.terminal-line');
      let step = 0;
      const nextStep = () => {
        if (step === 0 || step === 1) {
          loader.innerHTML += '.';
          step++;
          setTimeout(nextStep, 600);
        } else if (step === 2) {
          loader.innerHTML += '. just kidding.';
          step++;
          setTimeout(nextStep, 500);
        } else if (step === 3) {
          const banner = document.createElement('div');
          banner.className = 'terminal-output-row';
          banner.innerHTML = `<span class="term-gray">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>\nHere’s how to escape if you ever get trapped:\n  <span class="term-yellow">:wq</span>   write and quit\n  <span class="term-yellow">:q!</span>   quit without saving  <span class="term-gray">(panic mode)</span>\n  <span class="term-yellow">:qa!</span>  quit all buffers\n<span class="term-gray">You’re welcome. 😊</span>`;
          bodyEl.insertBefore(banner, activeLine);
          bodyEl.scrollTop = bodyEl.scrollHeight;
        }
      };
      setTimeout(nextStep, 600);
    };
    setTimeout(runVimSequence, 10);
    return `<span class="term-indigo">vim</span>  <span class="term-gray" id="vim-loader-${uid}">// opening editor</span>`;
  },

  ls: `<span class="term-indigo">drwxr-xr-x</span>  <span class="term-yellow">about/</span>          <span class="term-gray">who I am</span>
<span class="term-indigo">drwxr-xr-x</span>  <span class="term-yellow">projects/</span>       <span class="term-gray">things I built</span>
<span class="term-indigo">drwxr-xr-x</span>  <span class="term-yellow">skills/</span>         <span class="term-gray">what I know</span>
<span class="term-indigo">drwxr-xr-x</span>  <span class="term-yellow">now/</span>            <span class="term-gray">what I’m doing</span>
<span class="term-indigo">drwxr-xr-x</span>  <span class="term-yellow">contact/</span>        <span class="term-gray">how to reach me</span>
<span class="term-indigo">-rw-r--r--</span>  resume.pdf
<span class="term-gray">Type any name above to explore it</span>`,

  pwd: `/home/guest/portfolio/mathews-shaji`,

  date: () => {
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return `<span class="term-gray">UTC: </span>${now.toUTCString()}
<span class="term-gray">IST: </span>${ist.toLocaleString('en-US', { weekday:'short', year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true })}`;
  },

  hello: `<span class="term-indigo">Hello!</span>  <span class="term-gray">Welcome to the shell. Type </span><span class="term-yellow">help</span><span class="term-gray"> to get started.</span>`,
  hi: `<span class="term-indigo">Hey there!</span>  <span class="term-gray">Good to see you. Type </span><span class="term-yellow">about</span><span class="term-gray"> to learn more.</span>`,
  hey: `<span class="term-indigo">Hey!</span>  <span class="term-gray">Type </span><span class="term-yellow">help</span><span class="term-gray"> for available commands.</span>`,
  
  glitch: () => {
    if (window.triggerGlitchMode) {
      window.triggerGlitchMode();
      return `<span class="term-red" style="font-weight:bold;animation:blink 0.5s infinite">⚠️ WARNING: DIGITAL GLITCH DETECTED. TEMPORARY DEGRADATION SIGNAL ACTIVE.</span>`;
    }
    return `<span class="term-red">Glitch mode failed to initialize.</span>`;
  },

  theme: (name) => {
    const validThemes = ['mint', 'cyan', 'amber', 'mono', 'hacker'];
    if (!name) {
      return `<span class="term-cyan">Usage: theme [mint|cyan|amber|mono|hacker]</span>\n<span class="term-gray">Current theme: ${document.documentElement.getAttribute('data-theme') || 'mint'}</span>`;
    }
    const cleanName = name.toLowerCase().trim();
    if (validThemes.includes(cleanName)) {
      document.documentElement.setAttribute('data-theme', cleanName);
      try { localStorage.setItem('ms-portfolio-theme', cleanName); } catch(_) {}
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === cleanName));
      return `<span class="term-green">Theme shifted to: "${cleanName}"</span>`;
    }
    return `<span class="term-red">Invalid theme "${name}". Choose from: mint, cyan, amber, mono, hacker</span>`;
  },

  sl: () => {
    // Create full page train overlay
    const overlay = document.createElement('div');
    overlay.id = 'full-page-train-overlay';
    
    // Add skip hint text
    const skipHint = document.createElement('div');
    skipHint.style.position = 'absolute';
    skipHint.style.top = '24px';
    skipHint.style.color = 'rgba(255, 255, 255, 0.35)';
    skipHint.style.fontFamily = "'JetBrains Mono', monospace";
    skipHint.style.fontSize = '12px';
    skipHint.style.pointerEvents = 'none';
    skipHint.innerText = 'Press ESC or Click to dismiss';
    overlay.appendChild(skipHint);

    const lane = document.createElement('div');
    lane.id = 'full-page-train-lane';
    overlay.appendChild(lane);

    // Build the track
    const track = document.createElement('pre');
    track.id = 'full-page-train-track';
    const colsNeeded = Math.ceil(window.innerWidth / 12) + 20;
    const line1 = '='.repeat(colsNeeded * 4);
    let line2 = '';
    for (let i = 0; i < colsNeeded; i++) {
      line2 += '  || ';
    }
    const line3 = '='.repeat(colsNeeded * 4);
    track.innerHTML = `${line1}\n${line2}\n${line3}`;
    lane.appendChild(track);

    // Build the locomotive
    const locomotive = document.createElement('pre');
    locomotive.id = 'full-page-train-locomotive';
    lane.appendChild(locomotive);

    // Lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.body.appendChild(overlay);

    // Define frames of the train
    const trainFrames = [
      // Frame 1
      `                                     <span class="term-gray">(@@)     (@@@@@@@)        (@@@@@@@)</span>
                           (@@@@@@@)   (@@@@@)       (@@@@@@@@@@@)
                     (@@@)     (@@@@@@@)   (@@@@@@)             (@@@)
                (@@@@@@)    (@@@@@@)                (@)
           (@@@)  (@@@@)           (@@)
        (@@)              (@@@)
       <span class="term-cyan">.-.</span><span id="smokestack-anchor"></span>               
       <span class="term-cyan">] [    .-.      _    .-----.</span>
     <span class="term-cyan">."   """"   """""" """"| .--\`</span>
    <span class="term-cyan">(:--:--:--:--:--:--:--:-| [___</span>    <span class="term-indigo">.------------------------.</span>
     <span class="term-cyan">|</span><span class="term-yellow">C&O</span>  <span class="term-cyan">:  :  :  :  :  : [_9_] |</span><span class="term-orange">'='</span><span class="term-cyan">|</span><span class="term-indigo">.----------------------.|</span>
    <span class="term-cyan">/|.___________________________|___|</span><span class="term-indigo">'--.___.--.___.--.___.-'|</span> 
   <span class="term-cyan">/ ||_.--.______.--.______.--._ |---\\\\</span><span class="term-indigo">'--\\\\-.-/==\\\\-.-/==\\\\-.-/-'/--</span>
  <span class="term-cyan">/__;^=</span><span class="term-yellow">(==)======(==)======(==)</span><span class="term-cyan">=^~^^^</span> <span class="term-yellow">^^^(-)^^^^(-)^^^^(-)^^^</span> <span class="term-gray">jgs</span>
<span class="term-orange">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>`,

      // Frame 2
      `                                     <span class="term-gray">(@@)     (@@@@@@@)        (@@@@@@@)</span>
                           (@@@@@@@)   (@@@@@)       (@@@@@@@@@@@)
                     (@@@)     (@@@@@@@)   (@@@@@@)             (@@@)
                (@@@@@@)    (@@@@@@)                (@)
           (@@@)  (@@@@)           (@@)
        (@@)              (@@@)
       <span class="term-cyan">.-.</span><span id="smokestack-anchor"></span>               
       <span class="term-cyan">] [    .-.      _    .-----.</span>
     <span class="term-cyan">."   """"   """""" """"| .--\`</span>
    <span class="term-cyan">(:--:--:--:--:--:--:--:-| [___</span>    <span class="term-indigo">.------------------------.</span>
     <span class="term-cyan">|</span><span class="term-yellow">C&O</span>  <span class="term-cyan">:  :  :  :  :  : [_9_] |</span><span class="term-orange">'='</span><span class="term-cyan">|</span><span class="term-indigo">.----------------------.|</span>
    <span class="term-cyan">/|.___________________________|___|</span><span class="term-indigo">'--.___.--.___.--.___.-'|</span> 
   <span class="term-cyan">/ ||_.--.______.--.______.--._ |---\\\\</span><span class="term-indigo">'--\\\\-/==\\\\-/-/==\\\\-/-/\\\\-'/--</span>
  <span class="term-cyan">/__;^=</span><span class="term-yellow">(//)======(//)======(//)</span><span class="term-cyan">=^~^^^</span> <span class="term-yellow">^^^(\\\\)^^^(\\\\)^^^(\\\\)^^^</span> <span class="term-gray">jgs</span>
<span class="term-orange">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>`,

      // Frame 3
      `                                     <span class="term-gray">(@@)     (@@@@@@@)        (@@@@@@@)</span>
                           (@@@@@@@)   (@@@@@)       (@@@@@@@@@@@)
                     (@@@)     (@@@@@@@)   (@@@@@)             (@@@)
                (@@@@@@)    (@@@@@@)                (@)
           (@@@)  (@@@@)           (@@)
        (@@)              (@@@)
       <span class="term-cyan">.-.</span><span id="smokestack-anchor"></span>               
       <span class="term-cyan">] [    .-.      _    .-----.</span>
     <span class="term-cyan">."   """"   """""" """"| .--\`</span>
    <span class="term-cyan">(:--:--:--:--:--:--:--:-| [___</span>    <span class="term-indigo">.------------------------.</span>
     <span class="term-cyan">|</span><span class="term-yellow">C&O</span>  <span class="term-cyan">:  :  :  :  :  : [_9_] |</span><span class="term-orange">'='</span><span class="term-cyan">|</span><span class="term-indigo">.----------------------.|</span>
    <span class="term-cyan">/|.___________________________|___|</span><span class="term-indigo">'--.___.--.___.--.___.-'|</span> 
   <span class="term-cyan">/ ||_.--.______.--.______.--._ |---\\\\</span><span class="term-indigo">'--\\\\-|-\\\\/|-|-\\\\/|-|-\\\\/-'/--</span>
  <span class="term-cyan">/__;^=</span><span class="term-yellow">(||)======(||)======(||)</span><span class="term-cyan">=^~^^^</span> <span class="term-yellow">^^^(|)^^^(|)^^^(|)^^^</span> <span class="term-gray">jgs</span>
<span class="term-orange">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>`,

      // Frame 4
      `                                     <span class="term-gray">(@@)     (@@@@@@@)        (@@@@@@@)</span>
                           (@@@@@@@)   (@@@@@)       (@@@@@@@@@@@)
                     (@@@)     (@@@@@@@)   (@@@@@@)             (@@@)
                (@@@@@@)    (@@@@@@)                (@)
           (@@@)  (@@@@)           (@@)
        (@@)              (@@@)
       <span class="term-cyan">.-.</span><span id="smokestack-anchor"></span>               
       <span class="term-cyan">] [    .-.      _    .-----.</span>
     <span class="term-cyan">."   """"   """""" """"| .--\`</span>
    <span class="term-cyan">(:--:--:--:--:--:--:--:-| [___</span>    <span class="term-indigo">.------------------------.</span>
     <span class="term-cyan">|</span><span class="term-yellow">C&O</span>  <span class="term-cyan">:  :  :  :  :  : [_9_] |</span><span class="term-orange">'='</span><span class="term-cyan">|</span><span class="term-indigo">.----------------------.|</span>
    <span class="term-cyan">/|.___________________________|___|</span><span class="term-indigo">'--.___.--.___.--.___.-'|</span> 
   <span class="term-cyan">/ ||_.--.______.--.______.--._ |---\\\\</span><span class="term-indigo">'--\\\\-)-==-\\\\)-==-\\\\)-\\\\-'/--</span>
  <span class="term-cyan">/__;^=</span><span class="term-yellow">(\\\\)======(\\\\)======(\\\\)</span><span class="term-cyan">=^~^^^</span> <span class="term-yellow">^^^(/)^^^(/)^^^(/)^^^</span> <span class="term-gray">jgs</span>
<span class="term-orange">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>`
    ];

    // Animate wheels
    let currentFrame = 0;
    locomotive.innerHTML = trainFrames[currentFrame];
    const frameInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % trainFrames.length;
      locomotive.innerHTML = trainFrames[currentFrame];
    }, 110);

    // Spawn puffing smoke particles
    const smokeInterval = setInterval(() => {
      const anchor = locomotive.querySelector('#smokestack-anchor');
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      const x = anchorRect.left - overlayRect.left;
      const y = anchorRect.top - overlayRect.top;

      const puff = document.createElement('span');
      puff.className = 'full-page-train-smoke';
      const smokeChars = ['o', 'O', '0', '@', '*'];
      puff.innerText = smokeChars[Math.floor(Math.random() * smokeChars.length)];
      puff.style.left = `${x}px`;
      puff.style.top = `${y}px`;
      overlay.appendChild(puff);

      setTimeout(() => { puff.remove(); }, 1500);
    }, 130);

    // Cleanup function
    let isCleaned = false;
    const cleanUp = () => {
      if (isCleaned) return;
      isCleaned = true;
      clearInterval(frameInterval);
      clearInterval(smokeInterval);
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = originalOverflow;
      }, 500);
      document.removeEventListener('keydown', escListener);
    };

    const autoCleanupTimeout = setTimeout(cleanUp, 7000);

    const escListener = (e) => {
      if (e.key === 'Escape') {
        clearTimeout(autoCleanupTimeout);
        cleanUp();
      }
    };
    document.addEventListener('keydown', escListener);

    overlay.addEventListener('click', () => {
      clearTimeout(autoCleanupTimeout);
      cleanUp();
    });

    return `<span class="term-indigo">Chugga chugga choo choo! 🚂 Rails verified.</span>`;
  },

  train: () => terminal.commands.sl(),

  hack: () => {
    const logs = [
      "Connecting to secure node: 127.0.0.1...",
      "Bypassing AWS Cognito user pool isolation...",
      "Verifying AssumeRole trust chains on tenant master...",
      "eBPF hook detected at disk read/write layer...",
      "Tracing sys_enter_write connections...",
      "Injecting payload into block dispatcher...",
      "Attaching to CloudPositive cost analysis ledger...",
      "Parsing encrypted JWT signatures...",
      "Decrypting tenant isolation layer...",
      "Accessing multi-cloud cost endpoints...",
      "Syncing replica catalog schemas...",
      "Dumping data schemas...",
      "Success. Accessing system kernel..."
    ];
    
    let index = 0;
    const runHackSequence = () => {
      const bodyEl = document.getElementById('terminal-body');
      const inputEl = document.getElementById('terminal-input');
      if (!bodyEl || !inputEl) return;

      if (index < logs.length) {
        const line = document.createElement('div');
        line.className = 'terminal-output-row';
        line.innerHTML = `<span class="term-gray">[LOG] </span><span class="term-cyan">${logs[index]}</span>`;
        const activeLine = inputEl.closest('.terminal-line');
        bodyEl.insertBefore(line, activeLine);
        bodyEl.scrollTop = bodyEl.scrollHeight;
        index++;
        setTimeout(runHackSequence, 120);
      } else {
        const banner = document.createElement('div');
        banner.className = 'terminal-output-row';
        banner.innerHTML = `
<span class="term-green" style="font-weight:bold;white-space:pre;">
+========================================+
|           ACCESS GRANTED               |
+========================================+
</span>`;
        const activeLine = inputEl.closest('.terminal-line');
        bodyEl.insertBefore(banner, activeLine);
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
    };
    
    setTimeout(runHackSequence, 100);
    return `<span class="term-yellow">Initializing secure bypass routine...</span>`;
  },

  geek: () => terminal.commands.hack(),

  gravity: () => {
    if (window.zeroG && window.zeroG.active) {
      window.zeroG.cleanup();
      return `<span class="term-green">Gravity enabled.</span>`;
    }

    window.zeroG = { active: true, items: [], animationId: null, cleanup: null };

    // Hero stays visible — only non-hero elements float
    const floatSelectors = 'footer, .navbar, .mobile-topbar, .mobile-tabbar, .terminal-container, .glass-card, .project-card, .metric-card, .exp-sidebar-item, .exp-detail, .skills-toggle, .skills-category, .skills-grid, .contact-grid';
    const targets = Array.from(new Set(document.querySelectorAll(floatSelectors)));
    document.body.style.overflow = 'hidden';

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Target DVD speed once on-screen: ~0.6 px/frame = calm and visible
    const BASE_SPEED = 0.7;

    const items = targets.map((el) => {
      // Capture natural position BEFORE going fixed
      const rect = el.getBoundingClientRect();
      el.classList.add('gravity-affected');
      // Pin element to its original viewport position
      el.style.left   = rect.left + 'px';
      el.style.top    = rect.top  + 'px';
      el.style.width  = rect.width  + 'px';
      el.style.height = rect.height + 'px';

      // Launch from a random off-screen edge, velocity pointing inward
      const edge = Math.floor(Math.random() * 4);
      let ivx, ivy;
      const spd = BASE_SPEED * 1.5;
      const ang = (Math.random() * 0.5 + 0.25) * Math.PI;
      if (edge === 0) {        ivx = (Math.random()-0.5)*spd; ivy =  Math.abs(Math.sin(ang))*spd; }
      else if (edge === 1) {   ivx = -Math.abs(Math.cos(ang))*spd; ivy = (Math.random()-0.5)*spd; }
      else if (edge === 2) {   ivx = (Math.random()-0.5)*spd; ivy = -Math.abs(Math.sin(ang))*spd; }
      else {                   ivx =  Math.abs(Math.cos(ang))*spd; ivy = (Math.random()-0.5)*spd; }

      // Starting transform offset — elements begin at their natural spot (x=0,y=0 = no offset)
      const item = {
        el,
        x: 0, y: 0,         // transform offset from pinned left/top
        vx: ivx, vy: ivy,
        angle: 0, va: 0,
        // Natural anchored rect (fixed coords)
        pinLeft: rect.left,
        pinTop:  rect.top,
        elW: rect.width,
        elH: rect.height,
        isDragging: false,
        onScreen: true,      // starts on-screen (at natural position)
        _cleanupListeners: null,
      };

      el.style.transform = 'translate3d(0,0,0) rotate(0deg)';

      // --- Drag support ---
      let prevX = 0, prevY = 0, prevT = 0;

      const onStart = (cx, cy) => {
        item.isDragging = true;
        item.vx = 0; item.vy = 0;
        el.classList.add('dragging');
        prevX = cx; prevY = cy; prevT = performance.now();
      };

      const onMove = (cx, cy) => {
        if (!item.isDragging) return;
        const now = performance.now();
        const dt = Math.max(now - prevT, 1);
        const dx = cx - prevX;
        const dy = cy - prevY;
        item.vx = (dx / dt) * 16;
        item.vy = (dy / dt) * 16;
        item.x += dx; item.y += dy;
        prevX = cx; prevY = cy; prevT = now;
        el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.angle}deg)`;
      };

      const onEnd = () => {
        if (!item.isDragging) return;
        item.isDragging = false;
        el.classList.remove('dragging');
        // Scale velocity to ~DVD speed so it resumes bouncing at the same pace
        const spd = Math.sqrt(item.vx * item.vx + item.vy * item.vy) || BASE_SPEED;
        item.vx = (item.vx / spd) * BASE_SPEED;
        item.vy = (item.vy / spd) * BASE_SPEED;
      };

      const mdown = (e) => {
        if (['INPUT','TEXTAREA','A','BUTTON'].includes(e.target.tagName)) return;
        e.preventDefault();
        onStart(e.clientX, e.clientY);
        const mm = ev => onMove(ev.clientX, ev.clientY);
        const mu = () => { onEnd(); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); };
        document.addEventListener('mousemove', mm);
        document.addEventListener('mouseup', mu);
      };

      const tstart = (e) => {
        if (['INPUT','TEXTAREA','A','BUTTON'].includes(e.target.tagName)) return;
        const t = e.touches[0];
        onStart(t.clientX, t.clientY);
        const tm = ev => { const tt = ev.touches[0]; onMove(tt.clientX, tt.clientY); };
        const te = () => { onEnd(); document.removeEventListener('touchmove', tm); document.removeEventListener('touchend', te); };
        document.addEventListener('touchmove', tm);
        document.addEventListener('touchend', te);
      };

      el.addEventListener('mousedown', mdown);
      el.addEventListener('touchstart', tstart, { passive: true });
      item._cleanupListeners = () => {
        el.removeEventListener('mousedown', mdown);
        el.removeEventListener('touchstart', tstart);
      };

      return item;
    });

    window.zeroG.items = items;

    const update = () => {
      const dragging = items.find(i => i.isDragging) || null;

      items.forEach(item => {
        if (item.isDragging) return;

        // Move
        item.x += item.vx;
        item.y += item.vy;
        item.angle += item.va;

        // Actual screen position = pinned coords + transform offset
        const screenLeft   = item.pinLeft + item.x;
        const screenTop    = item.pinTop  + item.y;
        const screenRight  = screenLeft + item.elW;
        const screenBottom = screenTop  + item.elH;

        item.onScreen = screenRight > 0 && screenLeft < W && screenBottom > 0 && screenTop < H;

        if (item.onScreen) {
          // ── DVD edge bounce ──
          if (screenLeft < 0) {
            item.x += -screenLeft + 1;
            item.vx = Math.abs(item.vx);
            item.va = (Math.random() - 0.5) * 0.06;
          } else if (screenRight > W) {
            item.x -= (screenRight - W) + 1;
            item.vx = -Math.abs(item.vx);
            item.va = (Math.random() - 0.5) * 0.06;
          }
          if (screenTop < 0) {
            item.y += -screenTop + 1;
            item.vy = Math.abs(item.vy);
            item.va = (Math.random() - 0.5) * 0.06;
          } else if (screenBottom > H) {
            item.y -= (screenBottom - H) + 1;
            item.vy = -Math.abs(item.vy);
            item.va = (Math.random() - 0.5) * 0.06;
          }

          item.angle = Math.max(-5, Math.min(5, item.angle));
          item.va *= 0.88;
        }

        // Drag cohesion
        if (dragging && item.onScreen) {
          const dxD   = dragging.x - item.x;
          const dyD   = dragging.y - item.y;
          const dDist = Math.sqrt(dxD*dxD + dyD*dyD) + 1;
          if (dDist < 400) {
            const influence = (1 - dDist/400) * 0.005;
            item.vx += dragging.vx * influence;
            item.vy += dragging.vy * influence;
            const spd = Math.sqrt(item.vx*item.vx + item.vy*item.vy) || BASE_SPEED;
            if (spd > BASE_SPEED * 2) {
              item.vx = (item.vx/spd) * BASE_SPEED;
              item.vy = (item.vy/spd) * BASE_SPEED;
            }
          }
        }

        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.angle}deg)`;
      });

      window.zeroG.animationId = requestAnimationFrame(update);
    };

    window.zeroG.cleanup = () => {
      cancelAnimationFrame(window.zeroG.animationId);
      document.body.style.overflow = '';
      items.forEach(item => {
        item._cleanupListeners();
        item.el.classList.remove('gravity-affected', 'dragging');
        item.el.style.transform = '';
        item.el.style.left   = '';
        item.el.style.top    = '';
        item.el.style.width  = '';
        item.el.style.height = '';
      });
      window.zeroG.active = false;
      window.zeroG.items = [];
    };

    requestAnimationFrame(update);
    return `<span class="term-red">[WARNING] Gravity disabled.</span>`;
  },

  restore: () => {
    document.body.style.overflow = '';
    document.body.classList.remove('terminal-panicked');
    
    document.querySelectorAll('.system-destroyed, .destruction-shake').forEach(el => {
      el.classList.remove('system-destroyed');
      el.classList.remove('destruction-shake');
      el.style.display = '';
    });
    
    if (window.zeroG && window.zeroG.active) {
      window.zeroG.cleanup();
    }
    
    // Hide panic overlay
    const overlay = document.getElementById('panic-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.remove(); }, 800);
    }

    // Restore terminal glitching classes
    const termContainer = document.querySelector('.terminal-container');
    if (termContainer) {
      termContainer.classList.remove('terminal-intense-glitch');
      termContainer.classList.remove('terminal-glitch-active');
    }

    // Restore status bar
    const statusMode = document.getElementById('statusbar-mode');
    if (statusMode) {
      statusMode.style.background = '';
      statusMode.style.color = '';
      statusMode.style.borderColor = '';
      statusMode.innerText = '❐ INTERACTIVE';
    }

    // Restore scrambled texts
    document.querySelectorAll('[data-orig-text]').forEach(el => {
      const orig = el.getAttribute('data-orig-text');
      if (orig) {
        el.textContent = orig;
        el.removeAttribute('data-orig-text');
      }
    });
    
    return `<span class="term-green">System restoration complete. All layouts operational.</span>`;
  },

  rebuild: () => terminal.easterEggs.restore()
});
