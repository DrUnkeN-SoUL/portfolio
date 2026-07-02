import { getCommands, getSudoCommands, getEasterEggs } from './commands.js';

export class Terminal {
  constructor() {
    this.body = document.getElementById('terminal-body');
    this.input = document.getElementById('terminal-input');
    this.display = document.getElementById('terminal-input-display');
    if (!this.body || !this.input) return;

    this.prompt = `<span class="terminal-prompt"><span class="term-indigo">guest</span><span class="term-gray">@dev</span> <span class="term-gray">~</span> <span class="term-yellow">❯</span></span>`;
    this.commands = getCommands(this);
    this.sudoCommands = getSudoCommands(this);
    this.easterEggs = getEasterEggs(this);
    this.isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
    this.isMobile = () => window.innerWidth <= 900;
    this.isSmallScreen = () => window.innerWidth <= 480;

    // Measure terminal character width for dynamic layout
    this._charWidth = null;
    this._measureCharWidth();

    // Remeasure on window resize or when web fonts finish loading
    window.addEventListener('resize', () => {
      this._charWidth = null;
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this._charWidth = null;
      });
    }

    // Advanced shell state
    this.history = this.loadHistory();
    this.historyIndex = -1;
    this.tempInput = "";

    // Reverse search state
    this.reverseSearchMode = false;
    this.reverseSearchMatch = "";
    this.reverseSearchHistoryIndex = -1;

    // Interaction & autoplay state
    this.hasInteracted = false;
    this.autoPlayTimeout = null;
    this.idleTimeout = null;
    this.currentFlush = null;

    // Tmux-style status bar elements
    this.statusbarMode = document.getElementById('statusbar-mode');

    this.bindEvents();
    this.autoRunHelp();
  }

  loadHistory() {
    try {
      return JSON.parse(localStorage.getItem('ms-terminal-history') || '["help", "about", "skills", "whoami"]');
    } catch (_) {
      return ["help", "about", "skills", "whoami"];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('ms-terminal-history', JSON.stringify(this.history));
    } catch (_) {}
  }

  // Returns estimated number of monospace columns available in the terminal body
  getTerminalCols() {
    if (!this.body) return 80;
    if (this._charWidth === null) {
      this._measureCharWidth();
    }
    // Get actual horizontal padding dynamically
    const style = window.getComputedStyle(this.body);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const padding = paddingLeft + paddingRight;

    const bodyWidth = this.body.clientWidth;
    const usable = Math.max(bodyWidth - padding, 200);
    const charW = this._charWidth || 8.4; // fallback for JetBrains Mono 13px
    // Subtract 2 characters safety margin to prevent layout/overflow wrapping
    return Math.max(Math.floor(usable / charW) - 2, 20);
  }

  _measureCharWidth() {
    if (!this.body) return;
    // Create a temporary off-screen span to measure characters with the exact styling of terminal body
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-family:inherit;font-size:inherit;line-height:inherit;';
    span.textContent = 'M'.repeat(20);
    this.body.appendChild(span);
    const w = span.getBoundingClientRect().width;
    this.body.removeChild(span);
    if (w > 0) this._charWidth = w / 20;
  }

  // Returns a divider string of '─' or '━' repeated to fit the terminal width
  divider(char = '─', reserve = 0) {
    const cols = this.getTerminalCols();
    const len = Math.max(cols - reserve, 20);
    return char.repeat(len);
  }

  bindEvents() {
    const markInteracted = () => {
      this.hasInteracted = true;
      if (this.currentFlush) {
        this.currentFlush();
      }
      if (this.autoPlayTimeout) {
        clearTimeout(this.autoPlayTimeout);
        this.autoPlayTimeout = null;
      }
      if (this.statusbarMode) {
        this.statusbarMode.classList.add('interactive');
        this.statusbarMode.innerText = '❐ INTERACTIVE';
      }
      this.resetIdleTimer();
    };

    this.input.addEventListener('input', () => {
      markInteracted();
      this.syncDisplay();
    });

    // Click fires on every tap on mobile too (after touchend).
    // Using it for focus is the most reliable cross-browser way to open the soft keyboard.
    this.body.addEventListener('click', (e) => {
      markInteracted();
      if (!e.target.closest('a')) this.input.focus();
    });

    if (this.isTouchDevice()) {
      // touchstart: instantly stop the auto-demo so the UI feels responsive
      this.body.addEventListener('touchstart', () => {
        markInteracted();
      }, { passive: true });

      // touchend: focus + scroll so the keyboard doesn't cover the input.
      // The small timeout lets the browser finish processing the gesture first.
      this.body.addEventListener('touchend', (e) => {
        if (!e.target.closest('a') && e.target !== this.input) {
          setTimeout(() => {
            this.input.focus();
            this.input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }, 60);
        }
      }, { passive: true });

      // Show / hide the tap hint
      const tapHint = document.getElementById('terminal-tap-hint');
      if (tapHint) {
        this.input.addEventListener('focus', () => tapHint.classList.add('hidden'));
        this.input.addEventListener('blur',  () => tapHint.classList.remove('hidden'));
      }
    }

    this.input.addEventListener('keydown', (e) => {
      markInteracted();
      // 1. Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleCommand();
        return;
      }

      // 2. Escape key
      if (e.key === 'Escape') {
        if (this.reverseSearchMode) {
          this.exitReverseSearch(false);
          e.preventDefault();
        }
        return;
      }

      // 3. Ctrl+R: Reverse search
      if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        e.preventDefault();
        this.triggerReverseSearch();
        return;
      }

      // 4. Tab key: Autocomplete
      if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabCompletion();
        return;
      }

      // 5. Arrow Right / End: Accept suggestion
      if (e.key === 'ArrowRight' || e.key === 'End') {
        const suggestion = this.getGhostSuggestion();
        if (suggestion && this.input.selectionStart === this.input.value.length) {
          e.preventDefault();
          this.input.value += suggestion;
          this.syncDisplay();
        }
        return;
      }

      // 6. Arrow Up / Down: History traversal
      if (e.key === 'ArrowUp') {
        if (!this.reverseSearchMode) {
          e.preventDefault();
          this.traverseHistory(1);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        if (!this.reverseSearchMode) {
          e.preventDefault();
          this.traverseHistory(-1);
        }
        return;
      }
    });
  }

  syncDisplay() {
    if (!this.display || !this.input) return;

    if (this.reverseSearchMode) {
      this.performReverseSearch(false);

      const activeLine = this.input.closest('.terminal-line');
      if (activeLine) {
        const promptEl = activeLine.querySelector('.terminal-prompt');
        if (promptEl) {
          const query = this.input.value;
          promptEl.innerHTML = `<span class="term-red" style="font-weight:bold">(reverse-i-search)</span>\`<span class="term-yellow">${query}</span>': `;
        }
      }

      if (this.reverseSearchMatch) {
        const match = this.reverseSearchMatch;
        const escapedQuery = this.input.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let highlighted = match;
        if (escapedQuery) {
          const regex = new RegExp(`(${escapedQuery})`, 'gi');
          highlighted = match.replace(regex, `<span class="term-yellow" style="text-decoration:underline">$1</span>`);
        }
        this.display.innerHTML = highlighted;
      } else {
        this.display.innerHTML = `<span class="term-gray">[no match]</span>`;
      }
    } else {
      const typed = this.input.value;
      const escaped = typed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const suggestion = this.getGhostSuggestion();
      this.display.innerHTML = suggestion
        ? `${escaped}<span class="terminal-ghost-text">${suggestion}</span>`
        : escaped;
    }
  }

  handleCommand() {
    let raw = this.input.value;

    if (this.reverseSearchMode) {
      if (this.reverseSearchMatch) {
        raw = this.reverseSearchMatch;
      }
      this.exitReverseSearch(true);
    }

    // Support arguments: 'theme cyan' → cmd='theme', args=['cyan']
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    this.echoCommand(raw);

    if (cmd) {
      // Add to history list
      if (this.history[this.history.length - 1] !== raw) {
        this.history.push(raw);
        if (this.history.length > 50) this.history.shift();
        this.saveHistory();
      }
      this.historyIndex = -1;

      if (cmd === 'clear') {
        const active = this.input.closest('.terminal-line');
        Array.from(this.body.children).forEach(el => {
          if (el !== active) el.remove();
        });

      } else if (cmd === 'sudo') {
        // sudo <sudoCmd> [args...]
        const sudoKey = args[0]?.toLowerCase();
        if (!sudoKey) {
          this.renderOutput(`<span class="term-gray">Usage: </span><span class="term-yellow">sudo</span><span class="term-gray"> &lt;command&gt; [args]</span>`);
        } else if (this.sudoCommands[sudoKey]) {
          try {
            const result = this.sudoCommands[sudoKey](...args.slice(1));
            this.renderOutput(result);
          } catch(e) {
            this.renderOutput(`<span class="term-red">sudo: ${e.message}</span>`);
          }
        } else {
          this.renderOutput(`<span class="term-red">sudo: </span><span class="term-yellow">${sudoKey}</span><span class="term-gray">: command not found or not privileged</span>`);
        }

      } else if (this.sudoCommands[cmd]) {
        // Attempted to run a sudo-only command without sudo
        this.renderOutput(
          `<span class="term-red">Permission denied.</span> <span class="term-gray">This command requires elevated privileges.</span>\n` +
          `<span class="term-gray">Try: </span><span class="term-yellow">sudo ${cmd}</span>`
        );

      } else if (this.commands[cmd]) {
        const result = this.commands[cmd](...args);
        if (result !== '__CLEAR__') this.renderOutput(result);
      } else if (this.easterEggs[cmd]) {
        // Easter eggs can be strings or functions
        const egg = this.easterEggs[cmd];
        const result = typeof egg === 'function' ? egg(...args) : egg;
        this.renderOutput(result);
      } else {
        const resolvedCmd = this.resolveSmartCommand(cmd);
        if (resolvedCmd) {
          this.renderOutput(`<span class="term-cyan">ℹ Command not found. Automagic resolved to: </span><span class="term-yellow">"${resolvedCmd}"</span>`);
          setTimeout(() => {
            const result = this.commands[resolvedCmd] ? this.commands[resolvedCmd]() : this.easterEggs[resolvedCmd];
            if (result && result !== '__CLEAR__') {
              this.renderOutput(result);
            } else if (result === '__CLEAR__') {
              const active = this.input.closest('.terminal-line');
              Array.from(this.body.children).forEach(el => {
                if (el !== active) el.remove();
              });
            }
          }, 600);
        } else {
          this.renderOutput(`<span class="term-gray">Command not found: </span><span style="color:var(--hi)">"${cmd}"</span><span class="term-gray"> — type </span><span class="term-yellow">help</span><span class="term-gray"> for a list.</span>`);
        }
      }
    }

    this.input.value = '';
    this.syncDisplay();
    this.body.scrollTop = this.body.scrollHeight;
  }

  echoCommand(text) {
    const activeLine = this.input.closest('.terminal-line');
    const div = document.createElement('div');
    div.className = 'terminal-line';
    const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    div.innerHTML = `${this.prompt} <span class="term-indigo">${safe}</span>`;
    this.body.insertBefore(div, activeLine);
  }

  traverseHistory(dir) {
    if (this.history.length === 0) return;

    if (this.historyIndex === -1) {
      this.tempInput = this.input.value;
    }

    this.historyIndex += dir;

    if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length - 1;
    }

    if (this.historyIndex < -1) {
      this.historyIndex = -1;
    }

    if (this.historyIndex === -1) {
      this.input.value = this.tempInput;
    } else {
      this.input.value = this.history[this.history.length - 1 - this.historyIndex];
    }

    this.syncDisplay();
  }

  getGhostSuggestion() {
    if (this.reverseSearchMode) return "";
    const val = this.input.value;
    if (!val) return "";

    // Only suggest real commands — never easter eggs
    const cmds = Object.keys(this.commands);
    const match = cmds.find(c => c.startsWith(val.toLowerCase()) && c !== val.toLowerCase());
    if (match) {
      return match.substring(val.length);
    }
    return "";
  }

  handleTabCompletion() {
    if (this.reverseSearchMode) return;
    const typed = this.input.value.trim().toLowerCase();
    if (!typed) return;

    // Only tab-complete real commands — never easter eggs
    const cmds = Object.keys(this.commands);
    const matches = cmds.filter(c => c.startsWith(typed));

    if (matches.length === 1) {
      this.input.value = matches[0];
      this.syncDisplay();
    } else if (matches.length > 1) {
      this.echoCommand(this.input.value);
      // Layout matches into columns that fit the terminal width
      const cols = this.getTerminalCols();
      const colW = Math.max(...matches.map(m => m.length)) + 4;
      const perRow = Math.max(1, Math.floor(cols / colW));
      const rows = [];
      for (let i = 0; i < matches.length; i += perRow) {
        const row = matches.slice(i, i + perRow).map(m => m.padEnd(colW)).join('');
        rows.push(row.trimEnd());
      }
      const listHtml = `<span class="term-cyan">${rows.join('\n')}</span>`;
      this.renderOutput(listHtml);
      setTimeout(() => {
        this.body.scrollTop = this.body.scrollHeight;
      }, 50);
    }
  }

  triggerReverseSearch() {
    if (!this.reverseSearchMode) {
      this.reverseSearchMode = true;
      this.reverseSearchHistoryIndex = -1;
      this.reverseSearchMatch = "";
      this.input.value = "";
    } else {
      this.performReverseSearch(true);
    }
    this.syncDisplay();
  }

  performReverseSearch(next = false) {
    const query = this.input.value.trim().toLowerCase();
    if (!query) {
      this.reverseSearchMatch = "";
      this.reverseSearchHistoryIndex = -1;
      return;
    }

    let startIndex = this.reverseSearchHistoryIndex;
    if (next) {
      startIndex++;
    } else {
      startIndex = 0;
    }

    let match = "";
    let foundIndex = -1;

    for (let i = startIndex; i < this.history.length; i++) {
      const item = this.history[this.history.length - 1 - i];
      if (item.toLowerCase().includes(query)) {
        match = item;
        foundIndex = i;
        break;
      }
    }

    if (match) {
      this.reverseSearchMatch = match;
      this.reverseSearchHistoryIndex = foundIndex;
    } else if (next) {
      this.reverseSearchHistoryIndex = -1;
      this.performReverseSearch(false);
    } else {
      this.reverseSearchMatch = "";
      this.reverseSearchHistoryIndex = -1;
    }
  }

  exitReverseSearch(accept = true) {
    this.reverseSearchMode = false;
    const activeLine = this.input.closest('.terminal-line');
    if (activeLine) {
      const promptEl = activeLine.querySelector('.terminal-prompt');
      if (promptEl) {
        promptEl.innerHTML = `<span class="term-indigo">guest</span><span class="term-gray">@dev</span> <span class="term-gray">~</span> <span class="term-yellow">❯</span>`;
      }
    }
    if (accept && this.reverseSearchMatch) {
      this.input.value = this.reverseSearchMatch;
    } else if (!accept) {
      this.input.value = "";
    }
    this.reverseSearchMatch = "";
    this.reverseSearchHistoryIndex = -1;
    this.syncDisplay();
  }

  renderOutput(html) {
    const activeLine = this.input.closest('.terminal-line');
    const container = document.createElement('div');
    container.className = 'terminal-output';
    this.body.insertBefore(container, activeLine);

    const rawLines = html.split('\n');
    if (rawLines.length > 0 && rawLines[0].trim() === '') rawLines.shift();
    if (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === '') rawLines.pop();

    const lineElements = [];
    rawLines.forEach(lineText => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'terminal-output-row';
      lineDiv.style.display = 'none';
      lineDiv.innerHTML = lineText;
      container.appendChild(lineDiv);
      lineElements.push(lineDiv);
    });

    const delay = this.isMobile() ? 20 : 32;
    let index = 0;
    let timeoutId = null;

    const flush = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lineElements.slice(index).forEach(el => el.style.display = 'block');
      this.body.scrollTop = this.body.scrollHeight;
      this.currentFlush = null;
    };

    this.currentFlush = flush;

    const revealNext = () => {
      if (index < lineElements.length) {
        lineElements[index].style.display = 'block';
        index++;
        this.body.scrollTop = this.body.scrollHeight;
        timeoutId = setTimeout(revealNext, delay);
      } else {
        this.currentFlush = null;
      }
    };
    revealNext();
  }

  renderAvatar() {
    const id = 'av-' + Date.now();
    // Adaptive font-size: smaller on phones so the portrait fits without
    // horizontal scrolling; still visible at 4 px on narrow screens.
    const fs = this.isSmallScreen() ? '3.8px' : '5.1px';
    const lh = this.isSmallScreen() ? '4.2px' : '5.6px';

    setTimeout(() => {
      const pre = document.getElementById(id + '-pre');
      const statusMiddle = document.querySelector('.statusbar-middle');
      if (!pre) return;

      if (statusMiddle) {
        statusMiddle.textContent = 'PORTRAIT: CONNECTING...';
        statusMiddle.style.color = 'var(--term-yellow)';
      }

      fetch('/ascii-portrait.txt')
        .then(r => r.text())
        .then(text => {
          if (statusMiddle) {
            statusMiddle.textContent = 'PORTRAIT: RENDERING...';
          }
          const lines = text.split('\n');
          pre.textContent = '';
          pre.style.color = 'var(--ac)';

          let line = 0;
          const tick = () => {
            if (line < lines.length) {
              pre.textContent += lines[line++] + '\n';
              // If the user has interacted, scroll to the bottom so they see the drawing.
              // If in autoplay, do not scroll so we keep the header perfectly locked in view.
              if (this.hasInteracted) {
                this.body.scrollTop = this.body.scrollHeight;
              }
              setTimeout(tick, this.isSmallScreen() ? 10 : 18);
            } else {
              if (statusMiddle) {
                statusMiddle.textContent = 'PORTRAIT: RENDERED';
                statusMiddle.style.color = 'var(--term-green)';
                setTimeout(() => {
                  statusMiddle.textContent = 'ms-shell 2.0';
                  statusMiddle.style.color = '';
                }, 3000);
              }
            }
          };
          setTimeout(tick, 80);
        })
        .catch(() => {
          if (statusMiddle) {
            statusMiddle.textContent = 'PORTRAIT: FAILED';
            statusMiddle.style.color = 'var(--term-red)';
            setTimeout(() => {
              statusMiddle.textContent = 'ms-shell 2.0';
              statusMiddle.style.color = '';
            }, 3000);
          }
          const fallback = [
            "              ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠       ",
            "          ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠   ",
            "        ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠  ",
            "       ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠ ",
            "       ⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡",
            "      ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠",
            "      ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠",
            "       ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠",
            "         ⨀⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎡⎠  "
          ];
          const flines = fallback.join('\n').split('\n');
          pre.textContent = ''; pre.style.color = 'var(--ac-dim)';
          let fl = 0;
          const tick = () => {
            if (fl < flines.length) {
              pre.textContent += flines[fl++] + '\n';
              if (this.hasInteracted) {
                this.body.scrollTop = this.body.scrollHeight;
              }
              setTimeout(tick, 30);
            }
          };
          setTimeout(tick, 80);
        });
    }, 60);

    return `<span class="term-indigo">Mathews Shaji — Backend-Leaning Full-Stack Engineer</span>
<span class="term-gray">──────────────────────────────────────────────────</span>
<span class="term-gray">Role:    </span>Backend-Leaning Full-Stack Developer
<span class="term-gray">Stack:   </span>Python · Go · TypeScript · AWS · GCP · Azure
<span class="term-gray">Bio:     </span>Building high-performance distributed systems.
<span class="term-gray">──────────────────────────────────────────────────</span>
<div id="${id}"><pre id="${id}-pre" style="font-family:'JetBrains Mono','DejaVu Sans Mono','Liberation Mono','Courier New',monospace;font-size:${fs};line-height:${lh};white-space:pre;overflow:hidden;margin:0;padding:0;border:none;outline:none;margin-top:.4rem;"></pre></div>`;
  }

  autoRunHelp() {
    const delay = this.isTouchDevice() ? 800 : 1500;
    setTimeout(() => {
      if (this.hasInteracted) return;

      // Clear terminal prior to running initial command
      const active = this.input.closest('.terminal-line');
      Array.from(this.body.children).forEach(el => {
        if (el !== active) el.remove();
      });

      // On small screens start with 'help' (faster); on larger screens
      // run 'whoami' which fetches and renders the ASCII portrait.
      const initCmd = this.isSmallScreen() ? 'help' : 'whoami';
      this.echoCommand(initCmd);
      const result = this.commands[initCmd]();
      this.renderOutput(result);
      this.body.scrollTop = this.body.scrollHeight;

      this.startAutomatedDemo(initCmd);
    }, delay);
  }

  resetIdleTimer() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    this.idleTimeout = setTimeout(() => {
      this.hasInteracted = false;

      if (this.statusbarMode) {
        this.statusbarMode.classList.remove('interactive');
        this.statusbarMode.innerText = '❐ AUTO DEMO';
      }

      // Clear terminal prior to resuming auto mode
      const active = this.input.closest('.terminal-line');
      Array.from(this.body.children).forEach(el => {
        if (el !== active) el.remove();
      });

      this.startAutomatedDemo();
    }, 60000); // 60 seconds of inactivity
  }

  startAutomatedDemo(initCmd) {
    if (this.hasInteracted) return;

    // Per-command delay (ms the screen stays before clearing for next cmd)
    const sequence = [
      { cmd: 'help',     wait: 8000 },
      { cmd: 'now',      wait: 14000 },
      { cmd: 'about',    wait: 16000 },
      { cmd: 'skills',   wait: 16000 },
      { cmd: 'projects', wait: 22000 },
      { cmd: 'contact',  wait: 10000 },
      { cmd: 'whoami',   wait: 38000 }, // portrait needs time to load + be seen
    ];

    let step = 0;
    let initialWait = 8000;

    if (initCmd) {
      const idx = sequence.findIndex(item => item.cmd === initCmd);
      if (idx !== -1) {
        initialWait = sequence[idx].wait;
        step = (idx + 1) % sequence.length;
      }
    }

    const nextStep = (currentWait) => {
      if (this.hasInteracted) return;

      const waitTime = currentWait !== undefined ? currentWait : sequence[(step - 1 + sequence.length) % sequence.length].wait;

      this.autoPlayTimeout = setTimeout(() => {
        if (this.hasInteracted) return;

        const active = this.input.closest('.terminal-line');
        Array.from(this.body.children).forEach(el => {
          if (el !== active) el.remove();
        });

        if (step >= sequence.length) step = 0;
        const { cmd } = sequence[step];
        step++;

        this.simulateTyping(cmd, () => {
          nextStep();
        });
      }, waitTime);
    };

    nextStep(initialWait);
  }

  simulateTyping(text, callback) {
    if (this.hasInteracted) return;
    let index = 0;
    this.input.value = '';
    this.syncDisplay();

    const typeChar = () => {
      if (this.hasInteracted) return;
      if (index < text.length) {
        this.input.value += text[index];
        this.syncDisplay();
        index++;
        setTimeout(typeChar, Math.random() * 50 + 50);
      } else {
        setTimeout(() => {
          if (this.hasInteracted) return;
          this.handleCommand();
          if (callback) callback();
        }, 700);
      }
    };

    typeChar();
  }

  resolveSmartCommand(input) {
    const clean = input.trim().toLowerCase();
    if (!clean) return null;

    // Direct mappings
    const mappings = {
      'help': 'help', 'commands': 'help', 'menu': 'help', 'info': 'help', 'list': 'help', 'options': 'help',
      'about': 'about', 'bio': 'about', 'who': 'about', 'me': 'about', 'mathews': 'about', 'shaji': 'about', 'myself': 'about', 'summary': 'about', 'profile': 'about',
      'skills': 'skills', 'tech': 'skills', 'stack': 'skills', 'languages': 'skills', 'frameworks': 'skills', 'technologies': 'skills', 'backend': 'skills', 'frontend': 'skills', 'cloud': 'skills', 'database': 'skills',
      'projects': 'projects', 'builds': 'projects', 'work': 'projects', 'portfolio': 'projects', 'apps': 'projects', 'websites': 'projects',
      'whoami': 'whoami', 'avatar': 'whoami', 'portrait': 'whoami', 'ascii': 'whoami', 'image': 'whoami', 'face': 'whoami',
      'socials': 'socials', 'social': 'socials', 'github': 'socials', 'linkedin': 'socials', 'git': 'socials', 'connect': 'socials',
      'contact': 'contact', 'email': 'contact', 'reach': 'contact', 'message': 'contact', 'hire': 'contact', 'job': 'contact', 'locate': 'contact', 'location': 'contact', 'phone': 'contact',
      'resume': 'resume', 'cv': 'resume', 'experience': 'resume', 'education': 'resume', 'career': 'resume', 'history': 'resume',
      'now': 'now', 'status': 'now', 'current': 'now', 'today': 'now', 'doing': 'now', 'building': 'now',
      'uses': 'uses', 'setup': 'uses', 'tools': 'uses', 'env': 'uses', 'environment': 'uses', 'editor': 'uses',
      'availability': 'availability', 'available': 'availability', 'open': 'availability', 'hiring': 'availability', 'timezone': 'availability',
      'fun': 'fun', 'personal': 'fun', 'hobbies': 'fun', 'human': 'fun', 'mat': 'fun',
      'theme': 'theme', 'color': 'theme', 'colour': 'theme', 'palette': 'theme',
      'cloudpositive': 'cloudpositive', 'cp': 'cloudpositive',
      'xmigrate': 'xmigrate',
      'wms': 'wms', 'exoticgreen': 'wms', 'warehouse': 'wms',
      'cda': 'cda', 'dcsl': 'cda', 'dubai': 'cda', 'sign': 'cda',
      'medicine': 'medicine', 'bot': 'medicine', 'medbot': 'medicine',
      'matrix': 'matrix', 'neo': 'matrix', 'rabbit': 'matrix',
      'sudo': 'sudo', 'vim': 'vim', 'ls': 'ls', 'pwd': 'pwd', 'date': 'date',
      'hello': 'hello', 'hi': 'hi', 'hey': 'hey'
    };

    if (mappings[clean]) {
      return mappings[clean];
    }

    // Substring match
    for (const key in mappings) {
      if (key.length > 2 && (clean.includes(key) || key.includes(clean))) {
        return mappings[key];
      }
    }

    // Levenshtein fuzzy match
    const allTargets = Object.keys(this.commands).concat(Object.keys(this.easterEggs));
    let bestMatch = null;
    let minDistance = 3; // Max edits allowed

    allTargets.forEach(target => {
      const dist = this.levenshtein(clean, target);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = target;
      }
    });

    return bestMatch;
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            )
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
