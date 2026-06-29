import { Scrambler } from './scrambler.js';
import { Terminal } from './terminal.js';
import { initParticles } from './particles.js';
import { initCursor } from './cursor.js';
import { initCracks } from './cracks.js';

document.addEventListener('DOMContentLoaded', () => {
  // Suppress smooth-scroll during initial load so the browser's
  // scroll-position restoration doesn't animate from the top.
  document.documentElement.classList.add('no-smooth-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-smooth-scroll');
  }));

  /* ── 1. TERMINAL ───────────────────────────────────────── */
  new Terminal();

  /* ── 2. TEXT SCRAMBLER ─────────────────────────────────── */
  const nameEl = document.getElementById('shuffle-name');
  if (nameEl) {
    const finalText = nameEl.innerText;
    // Freeze the h1 height before animation — grid uses align-items:center
    // so any height change in the left column shifts the terminal column.
    const h1 = nameEl.closest('h1');
    if (h1) {
      const h1Height = h1.getBoundingClientRect().height;
      h1.style.height = (h1Height + 16) + 'px';
      h1.style.overflow = 'hidden';
      setTimeout(() => {
        h1.style.overflow = 'visible';
        h1.style.height = 'auto';
      }, 1800);
    }
    const s = new Scrambler(nameEl);
    setTimeout(() => s.run(finalText), 300);
    nameEl.addEventListener('dblclick', () => s.run(finalText));
    nameEl.addEventListener('touchstart', () => s.run(finalText), { passive: true });
  }

  document.querySelectorAll('.metric-number').forEach((el, index) => {
    const orig = el.innerText;
    const s = new Scrambler(el);
    setTimeout(() => s.run(orig), 600 + index * 150);
  });

  const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouchDevice()) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const span = link.querySelector('span');
      if (!span) return;
      const orig = span.innerText;
      const s = new Scrambler(span);
      link.addEventListener('mouseenter', () => s.run(orig));
    });

    document.querySelectorAll('.project-card').forEach(card => {
      const title = card.querySelector('.project-title');
      if (!title) return;
      const orig = title.innerText;
      const s = new Scrambler(title);
      card.addEventListener('mouseenter', () => s.run(orig));
    });

    document.querySelectorAll('.metric-card').forEach(card => {
      const numEl = card.querySelector('.metric-number');
      const labelEl = card.querySelector('.metric-label');
      if (!numEl || !labelEl) return;
      const numOrig = numEl.innerText;
      const labelOrig = labelEl.innerText;
      const numScrambler = new Scrambler(numEl);
      const labelScrambler = new Scrambler(labelEl);
      card.addEventListener('mouseenter', () => {
        numScrambler.run(numOrig);
        labelScrambler.run(labelOrig);
      });
    });
  }

  /* ── 3. THEME ──────────────────────────────────────────── */
  const themeBtns = document.querySelectorAll('.theme-btn');
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    try { localStorage.setItem('ms-portfolio-theme', theme); } catch (_) { }
  };
  themeBtns.forEach(b => b.addEventListener('click', () => setTheme(b.dataset.theme)));
  try { setTheme(localStorage.getItem('ms-portfolio-theme') || 'mint'); }
  catch (_) { setTheme('mint'); }

  /* ── 4. PROJECT FILTER ─────────────────────────────────── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      let delay = 0;

      projectCards.forEach(card => {
        const cats = card.dataset.category.split(' ');
        const match = f === 'all' || cats.includes(f);

        if (match) {
          card.classList.remove('inactive');
          card.classList.add('active');
          card.style.transitionDelay = `${delay}ms`;
          delay += 35;
        } else {
          card.classList.remove('active');
          card.classList.add('inactive');
          card.style.transitionDelay = '0ms';
        }
      });
    });
  });

  /* ── 5. COPY BUTTONS ───────────────────────────────────── */
  const setupCopy = (id, text) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1600);
      }).catch(() => { });
    });
  };
  setupCopy('copy-email-btn', 'mathewshaji96@gmail.com');
  setupCopy('copy-loc-btn', 'Kochi, Kerala, India');

  /* ── 6. MOBILE MENU (bottom sheet) ─────────────────────── */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileSheet   = document.getElementById('mobile-sheet');
  const sheetBackdrop = document.getElementById('sheet-backdrop');

  const openSheet = () => {
    mobileSheet?.classList.add('open');
    sheetBackdrop?.classList.add('visible');
    mobileMenuBtn?.classList.add('active');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeSheet = () => {
    mobileSheet?.classList.remove('open');
    sheetBackdrop?.classList.remove('visible');
    mobileMenuBtn?.classList.remove('active');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileMenuBtn?.addEventListener('click', () => {
    mobileSheet?.classList.contains('open') ? closeSheet() : openSheet();
  });

  sheetBackdrop?.addEventListener('click', closeSheet);

  document.querySelectorAll('.sheet-link').forEach(link => {
    link.addEventListener('click', closeSheet);
  });

  // Close sheet on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  /* ── 7. SCROLL: NAVBAR + ACTIVE LINKS ─────────────────── */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav-link');
  const tabItems = document.querySelectorAll('.tab-item');
  const sheetLinks = document.querySelectorAll('.sheet-link');

  const updateNav = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);

    let current = sections[0]?.id || 'home';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    if (window.innerHeight + y >= document.body.offsetHeight - 60) {
      current = 'contact';
    }

    const href = `#${current}`;
    allLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === href));
    tabItems.forEach(tab => tab.classList.toggle('active', tab.getAttribute('href') === href));
    sheetLinks.forEach(sl => sl.classList.toggle('active', sl.getAttribute('href') === href));
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── 8. SCROLL REVEAL ──────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ── 9. PARTICLES ──────────────────────────────────────── */
  initParticles();

  /* ── 10. EXPERIENCE STICKY PANEL ──────────────────────── */
  const expDesktop = document.getElementById('exp-desktop');
  if (expDesktop) {
    const sidebarItems = expDesktop.querySelectorAll('.exp-sidebar-item');
    const details      = expDesktop.querySelectorAll('.exp-detail');
    const progressBar  = document.getElementById('exp-progress');

    let lastActiveKey = null;
    const showExp = (key) => {
      if (lastActiveKey === key) return;
      lastActiveKey = key;
      sidebarItems.forEach(i => i.classList.toggle('active', i.dataset.exp === key));
      details.forEach(d => {
        const isActive = d.id === `exp-${key}`;
        d.classList.toggle('active', isActive);
        if (isActive) d.scrollTop = 0;
      });
    };

    const keys = ['adfolks', 'exotic', 'cp', 'infra', 'xmig', 'intern'];

    sidebarItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const rect = expDesktop.getBoundingClientRect();
        const expTop = rect.top + window.scrollY;
        const total = expDesktop.offsetHeight - window.innerHeight;
        const targetPct = idx / (keys.length - 1);
        const targetScrollY = expTop + (targetPct * total);

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      });
    });
    const onScroll = () => {
      const rect   = expDesktop.getBoundingClientRect();
      const total  = expDesktop.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct    = Math.min(1, scrolled / total);

      if (progressBar) progressBar.style.width = (pct * 100) + '%';

      const idx = Math.min(keys.length - 1, Math.floor(pct * keys.length));
      showExp(keys[idx]);
    };

    expDesktop.style.height = '600vh';
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 11. CUSTOM CURSOR ─────────────────────────────────── */
  initCursor();

  /* ── 12. MOBILE ACCORDIONS ─────────────────────────────── */

  /**
   * Generic accordion helper.
   * @param {string} toggleSel   - CSS selector for the toggle <button>
   * @param {boolean} mobileOnly - if true, only activates below 768px
   */
  const initAccordion = (toggleSel, mobileOnly = false) => {
    const allBtns = Array.from(document.querySelectorAll(toggleSel));

    const closeBtn = (btn) => {
      const id   = btn.getAttribute('aria-controls');
      const body = id ? document.getElementById(id) : null;
      btn.setAttribute('aria-expanded', 'false');
      if (body) {
        body.style.maxHeight = body.scrollHeight + 'px';
        body.classList.remove('open');
        body.offsetHeight; // force reflow
        body.style.maxHeight = '0px';
      }
    };

    const openBtn = (btn, body) => {
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('open');
      body.offsetHeight; // force layout recalculation so padding height is factored in!
      body.style.maxHeight = body.scrollHeight + 'px';
      
      const onTransitionEnd = (e) => {
        if (e.propertyName === 'max-height') {
          if (btn.getAttribute('aria-expanded') === 'true') {
            body.style.maxHeight = 'none';
          }
          body.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      body.addEventListener('transitionend', onTransitionEnd);

      // Smooth scroll the header into view with a comfortable top offset
      setTimeout(() => {
        const rect = btn.getBoundingClientRect();
        const headerOffset = 100; // Offset for sticky navigation bar
        const elementPosition = rect.top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 350);
    };

    allBtns.forEach(btn => {
      const bodyId = btn.getAttribute('aria-controls');
      const body   = bodyId ? document.getElementById(bodyId) : null;
      if (!body) return;

      // Initialize closed heights
      if (!mobileOnly || window.innerWidth <= 768) {
        body.style.maxHeight = '0px';
      }

      btn.addEventListener('click', () => {
        if (mobileOnly && window.innerWidth > 768) return;

        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          closeBtn(btn);
        } else {
          // Collapse all siblings first
          allBtns.forEach(other => { if (other !== btn) closeBtn(other); });
          openBtn(btn, body);
        }
      });
    });

    // Handle screen resize to reset inline styles on desktop
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 768;
      
      allBtns.forEach(btn => {
        const id = btn.getAttribute('aria-controls');
        const body = id ? document.getElementById(id) : null;
        if (!body) return;

        if (mobileOnly && !isMobile) {
          body.style.maxHeight = '';
          body.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else if (!body.classList.contains('open')) {
          body.style.maxHeight = '0px';
        }
      });
    }, { passive: true });
  };

  // Experience mobile timeline cards
  initAccordion('.timeline-toggle', false);

  // Project cards
  initAccordion('.project-toggle', true);

  // Skills categories
  initAccordion('.skills-toggle', true);

  // Spark/crack effects on click
  initCracks();

  /* ── 13. EASTER EGGS ───────────────────────────────────── */
  
  // A. Console welcome message & theme unlock
  const initConsolePuzzle = () => {
    window.unlockSecret = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'hacker') {
        document.documentElement.setAttribute('data-theme', 'mint');
        try { localStorage.setItem('ms-portfolio-theme', 'mint'); } catch(_) {}
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === 'mint'));
        console.log("%cTheme restored to mint. Operational parameters nominal.", "color: #28c840; font-weight: bold;");
        return "Theme restored to mint.";
      } else {
        document.documentElement.setAttribute('data-theme', 'hacker');
        try { localStorage.setItem('ms-portfolio-theme', 'hacker'); } catch(_) {}
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === 'hacker'));
        console.log("%c[SUCCESS] Secret theme activated. Welcome to the Matrix, Operator.", "color: #00ff66; font-weight: bold; background: #000; padding: 4px;");
        return "Hacker theme activated!";
      }
    };
    
    console.log(
      "%c💻 MATHEWS SHAJI | FULL-STACK DEVELOPER", 
      "color: #00ff66; font-size: 18px; font-weight: bold; background: #030306; padding: 8px 12px; border-radius: 4px; border: 1px solid #00ff66; font-family: monospace;"
    );
    console.log(
      "%cInspect-savvy developers detected! Try running unlockSecret() in this console or typing 'hack' in the homepage interactive terminal.",
      "color: #7ba7c2; font-size: 12px;"
    );

    // Developer resume — visible in console for recruiters / curious devs
    const headerStyle = "color: #00ff66; font-weight: bold; font-size: 12px; font-family: monospace; padding-top: 12px; padding-bottom: 2px;";
    const titleStyle = "color: #ffffff; font-weight: bold; font-family: monospace; font-size: 11px;";
    const companyStyle = "color: #00d2ff; font-weight: bold; font-family: monospace; font-size: 11px;";
    const dateStyle = "color: #888888; font-style: italic; font-family: monospace; font-size: 11px;";
    const projectStyle = "color: #ffd700; font-weight: bold; font-family: monospace; font-size: 11px;";
    const descStyle = "color: #d1d1d6; font-family: monospace; font-size: 11px; line-height: 1.4;";
    const techLabelStyle = "color: #888888; font-weight: bold; font-family: monospace; font-size: 11px;";
    const techValueStyle = "color: #00ff66; font-family: monospace; font-size: 11px;";
    const contactStyle = "color: #7ba7c2; font-family: monospace; font-size: 11px;";

    console.log(
      `%c  📧 mathewshaji96@gmail.com    🐙 github.com/DrUnkeN-SoUL\n` +
      `  📍 Kochi, Kerala, India       🔗 linkedin.com/in/mathews-shaji\n`,
      contactStyle
    );

    console.log("%c── EXPERIENCE ──────────────────────────────────────────────", headerStyle);

    console.log(
      "%c  Full-Stack Developer %c@ %cThoughtroutes (Remote) %c| %cNov 2023 – Present",
      titleStyle, "color: #888;", companyStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c  ▸ %cCloudPositive — Multi-Cloud Cost Management Platform\n" +
      "%c    • Multi-tenant FastAPI backend, per-tenant MySQL schema isolation\n" +
      "    • 20+ SQS pipelines: AWS Cost Explorer, GCP BigQuery, Azure Cost Mgmt\n" +
      "    • Secretless onboarding: AWS IAM, GCP service accounts, Azure AD consent\n" +
      "    • Multi-cloud validation (AWS, GCP BigQuery, Azure RBAC) on Docker/Terraform\n" +
      "    • OpenSearch alerting, GCP pre-onboarding validator on K8s + Helm\n" +
      "    • AI cost estimation API: GPT-4o-mini, structured JSON, multi-step pipeline\n" +
      "    • Microservices on AWS ECS: RDS MySQL, SQS, OpenSearch; Ansible playbooks",
      "color: #00ff66; font-weight: bold;", projectStyle,
      descStyle
    );
    console.log(
      "%c    Stack: %cPython, FastAPI, SQLAlchemy, AWS, GCP, Azure, MySQL, Docker, Terraform, K8s, Helm, OpenAI\n",
      techLabelStyle, techValueStyle
    );

    console.log(
      "%c  Client Infrastructure Monitoring %c| %c2024 – Present",
      titleStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c    • Prometheus alerting, Grafana dashboards, Loki, Beyla eBPF auto-instrumentation\n" +
      "    • Nginx reverse proxy, SSL termination, Node Exporter host metrics",
      descStyle
    );
    console.log(
      "%c    Stack: %cPrometheus, Grafana, Loki, Beyla (eBPF), Nginx, Linux\n",
      techLabelStyle, techValueStyle
    );

    console.log(
      "%c  Full-Stack Developer %c@ %cThoughtroutes · CDA, Dubai Government (Remote) %c| %cDec 2025",
      titleStyle, "color: #888;", companyStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c    • Built dcsl.cda.gov.ae — Guinness World Record for highest online participation\n" +
      "    • Dockerised Next.js 15, i18n (EN/AR RTL), passwordless auth, PostgreSQL + audit",
      descStyle
    );
    console.log(
      "%c    Stack: %cNext.js 15, TypeScript, PostgreSQL, Docker, Azure, SendGrid, next-intl, reCAPTCHA\n",
      techLabelStyle, techValueStyle
    );

    console.log(
      "%c  Contract Full-Stack Developer %c@ %cExotic Green — Austria (Remote) %c| %c2024",
      titleStyle, "color: #888;", companyStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c    • Sole developer: full-stack warehouse management platform\n" +
      "    • FastAPI: inventory, batch/expiry tracking, APScheduler compliance cron\n" +
      "    • Next.js 14: webcam barcode (zxing), PDF reports, AWS Cognito auth\n" +
      "    • v2 in Next.js 16: Vitest, Playwright E2E, Web Vitals monitoring",
      descStyle
    );
    console.log(
      "%c    Stack: %cPython, FastAPI, Next.js 14/16, PostgreSQL, Redis, AWS Cognito, shadcn/ui, Docker\n",
      techLabelStyle, techValueStyle
    );

    console.log(
      "%c  Full-Stack Developer %c@ %cXmigrate (Remote) %c| %cJun 2023 – Nov 2023",
      titleStyle, "color: #888;", companyStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c    • FastAPI backend: org/project/blueprint mgmt, cloud config (AWS/Azure/GCP/OCI)\n" +
      "    • Keycloak SSO: OAuth2/OIDC, custom themes, token exchange on ECS Fargate\n" +
      "    • Next.js 14 dashboard: React Flow topology, ApexCharts, Radix UI, PDF invoicing",
      descStyle
    );
    console.log(
      "%c    Stack: %cPython, FastAPI, Next.js 14, Keycloak, PostgreSQL, AWS ECS Fargate, Cloudflare\n",
      techLabelStyle, techValueStyle
    );

    console.log(
      "%c  Web Developer Intern %c@ %cXmigrate (Remote) %c| %cMay 2023 – Jun 2023",
      titleStyle, "color: #888;", companyStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c    • FastAPI endpoints for cloud migration backend, API integration",
      descStyle
    );
    console.log("");

    console.log("%c── EDUCATION ───────────────────────────────────────────────", headerStyle);
    console.log(
      "%c  Bachelor of Computer Application (BCA) %c| %c2020 – 2023",
      titleStyle, "color: #555;", dateStyle
    );
    console.log(
      "%c  Mahatma Gandhi University · Ernakulam, Kerala, India\n",
      descStyle
    );

    console.log("%c── STACK ───────────────────────────────────────────────────", headerStyle);
    console.log(
      "%c  Backend:    %cPython / FastAPI / Flask · Go / Gin · Node.js · TypeScript\n" +
      "%c  Cloud:      %cAWS (ECS·EKS·RDS·Lambda·S3·Cognito·SQS·OpenSearch·Athena·Glue·ALB·VPC·IAM)\n" +
      "              GCP (BigQuery·IAM·GKE) · Azure (Cost Mgmt·ARM·Multi-tenant App Reg)\n" +
      "%c  IaC:        %cDocker · Terraform · Kubernetes · Helm · Ansible · GitHub Actions\n" +
      "%c  DB:         %cPostgreSQL · MySQL · SQLAlchemy · MongoDB · OpenSearch · Redis · DynamoDB\n" +
      "%c  Frontend:   %cNext.js 14/15/16 · React · Tailwind · shadcn/ui · Radix UI · MUI\n" +
      "%c  Auth:       %cOAuth2 · OIDC · JWT · AWS Cognito · Keycloak · Azure AD · RBAC\n" +
      "%c  AI/ML:      %cOpenAI (Structured JSON) · Amazon Bedrock · TensorFlow/Keras · OpenCV",
      techLabelStyle, descStyle,
      techLabelStyle, descStyle,
      techLabelStyle, descStyle,
      techLabelStyle, descStyle,
      techLabelStyle, descStyle,
      techLabelStyle, descStyle,
      techLabelStyle, descStyle
    );
  };

  // B. Konami Code (Matrix code rain)
  let matrixCanvas = null;
  let matrixAnimFrame = null;
  
  const triggerMatrixRain = () => {
    if (matrixCanvas) return;
    
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.position = 'fixed';
    matrixCanvas.style.inset = '0';
    matrixCanvas.style.zIndex = '9998';
    matrixCanvas.style.background = 'rgba(0, 0, 0, 0.92)';
    matrixCanvas.style.cursor = 'none';
    document.body.appendChild(matrixCanvas);
    
    const ctx = matrixCanvas.getContext('2d');
    
    const resizeCanvas = () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚ";
    const charArr = chars.split("");
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      
      ctx.fillStyle = "#00ff66";
      ctx.font = fontSize + "px monospace";
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(text, x, y);
        
        if (y > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      matrixAnimFrame = requestAnimationFrame(draw);
    };
    
    draw();
    
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    if (terminalBody && terminalInput) {
      const activeLine = terminalInput.closest('.terminal-line');
      const div = document.createElement('div');
      div.className = 'terminal-output-row';
      div.innerHTML = `<span class="term-green" style="font-weight:bold">MATRIX CODE RAIN ACTIVE. ESC or Click to exit.</span>`;
      terminalBody.insertBefore(div, activeLine);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    const exitMatrix = (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Escape')) {
        cancelAnimationFrame(matrixAnimFrame);
        window.removeEventListener('resize', resizeCanvas);
        matrixCanvas.remove();
        matrixCanvas = null;
        document.removeEventListener('keydown', exitMatrix);
        document.removeEventListener('click', exitMatrix);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('keydown', exitMatrix);
      document.addEventListener('click', exitMatrix);
    }, 100);
  };

  const initKonami = () => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 
      'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight', 
      'ArrowLeft', 'ArrowRight', 
      'b', 'a'
    ];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
      const key = e.key;
      const matchKey = (key.toLowerCase() === konamiCode[konamiIndex].toLowerCase());
      
      if (matchKey) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerMatrixRain();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  };

  // C. Caffeine Rush trigger
  const initCaffeine = () => {
    const coffeeBtn = document.getElementById('coffee-egg-btn');
    if (!coffeeBtn) return;
    
    let coffeeClicks = 0;
    let rushTimeout = null;
    
    coffeeBtn.addEventListener('click', () => {
      coffeeClicks++;
      coffeeBtn.style.transform = 'scale(1.35)';
      setTimeout(() => { coffeeBtn.style.transform = ''; }, 150);
      
      if (coffeeClicks === 5) {
        triggerCaffeineRush();
        coffeeClicks = 0;
      }
    });
    
    const triggerCaffeineRush = () => {
      document.documentElement.classList.add('caffeine-rush');
      
      // Speed scramble on elements
      document.querySelectorAll('#shuffle-name, .metric-number, .project-title, .nav-link span').forEach(el => {
        el.dispatchEvent(new Event('mouseenter'));
        el.dispatchEvent(new Event('dblclick'));
      });
      
      const terminalBody = document.getElementById('terminal-body');
      const terminalInput = document.getElementById('terminal-input');
      if (terminalBody && terminalInput) {
        const activeLine = terminalInput.closest('.terminal-line');
        const div = document.createElement('div');
        div.className = 'terminal-output-row';
        div.innerHTML = `<span class="term-red" style="font-weight:bold;animation:blink 0.5s infinite">⚠️ WARNING: SYSTEM DETECTED CAFFEINE OVERDOSAGE. INITIATING HIGH-FREQUENCY CPU CLOCK RUSH.</span>`;
        terminalBody.insertBefore(div, activeLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
      
      if (rushTimeout) clearTimeout(rushTimeout);
      
      rushTimeout = setTimeout(() => {
        document.documentElement.classList.remove('caffeine-rush');
        
        if (terminalBody && terminalInput) {
          const activeLine = terminalInput.closest('.terminal-line');
          const div = document.createElement('div');
          div.className = 'terminal-output-row';
          div.innerHTML = `<span class="term-gray">Caffeine rush fading. Operating rates normalized.</span>`;
          terminalBody.insertBefore(div, activeLine);
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }
      }, 15000);
    };
  };

  // D. Glitch Mode trigger
  const initGlitchMode = () => {
    let glitchInterval = null;
    let isGlitching = false;
    let glitchTimeout = null;

    const playGlitchSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const audioCtx = new AudioContext();
        
        // Play rapid warning sweeps
        for (let i = 0; i < 6; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(80 + i * 220, audioCtx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.02, audioCtx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.06 + 0.05);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + i * 0.06);
          osc.stop(audioCtx.currentTime + i * 0.06 + 0.05);
        }
      } catch (_) {}
    };

    const scrambleTextNodes = () => {
      const textNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, p, span, a, button, li'))
        .filter(n => n.children.length === 0 && n.textContent && n.textContent.trim() && !n.closest('#panic-overlay') && !n.closest('.terminal-body'));
      
      glitchInterval = setInterval(() => {
        if (textNodes.length === 0) return;
        
        // Scramble 4 random page elements at a time
        for (let i = 0; i < 4; i++) {
          const node = textNodes[Math.floor(Math.random() * textNodes.length)];
          const text = node.textContent;
          if (!text || text.length < 3) continue;

          if (!node.hasAttribute('data-orig-text')) {
            node.setAttribute('data-orig-text', text);
          }

          const chars = text.split('');
          const scrambleCount = Math.ceil(chars.length * 0.2);
          const hexChars = "0123456789ABCDEF$#@%&*[]{}";

          for (let k = 0; k < scrambleCount; k++) {
            const idx = Math.floor(Math.random() * chars.length);
            if (chars[idx] !== ' ' && chars[idx] !== '\n') {
              chars[idx] = hexChars[Math.floor(Math.random() * hexChars.length)];
            }
          }
          node.textContent = chars.join('');
        }
      }, 70);
    };

    const restoreTextNodes = () => {
      document.querySelectorAll('[data-orig-text]').forEach(el => {
        const orig = el.getAttribute('data-orig-text');
        if (orig) {
          el.textContent = orig;
          el.removeAttribute('data-orig-text');
        }
      });
    };

    window.triggerGlitchMode = () => {
      if (isGlitching) return;
      isGlitching = true;
      playGlitchSound();
      document.body.classList.add('glitch-active');
      scrambleTextNodes();

      if (glitchTimeout) clearTimeout(glitchTimeout);
      
      glitchTimeout = setTimeout(() => {
        document.body.classList.remove('glitch-active');
        clearInterval(glitchInterval);
        restoreTextNodes();
        isGlitching = false;
      }, 4000);
    };

    // Keyboard trigger (typing "glitch" anywhere)
    const targetWord = 'glitch';
    let typedBuffer = '';

    document.addEventListener('keydown', (e) => {
      // Ignore key events if the user is typing in inputs or textareas (like terminal input)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      // Add to buffer
      typedBuffer += e.key.toLowerCase();
      
      // Limit size of buffer to match target word length
      if (typedBuffer.length > targetWord.length) {
        typedBuffer = typedBuffer.substring(typedBuffer.length - targetWord.length);
      }

      if (typedBuffer === targetWord) {
        window.triggerGlitchMode();
        typedBuffer = '';
      }
    });
  };

  initConsolePuzzle();
  initKonami();
  initCaffeine();
  initGlitchMode();

});

