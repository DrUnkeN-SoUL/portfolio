import { useEffect, useMemo, useRef, useState } from "react";
import { asciiPortraitDesktop as source } from "@/data/ascii-portrait";

const NOISE = "´°¬¤iósc/=+,.x";
const COLS = 96;
const ROWS = 62;

export function AsciiPortrait({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Every glyph gets a random arrival time, biased by its row so the portrait
  // resolves out of noise top-down.
  const thresholds = useMemo(() => {
    const rowCount = Math.max(source.split("\n").length, 1);
    const th = new Float32Array(source.length);
    let row = 0;
    for (let i = 0; i < source.length; i++) {
      if (source[i] === "\n") row++;
      th[i] = Math.min(0.999, (row / rowCount) * 0.45 + Math.random() * 0.7);
    }
    return th;
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const draw = (now: number, eased: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const style = getComputedStyle(canvas);
      ctx.font = `${style.fontSize} ${style.fontFamily}`;
      ctx.fillStyle = style.color;
      ctx.textBaseline = "middle";

      // The grid is fixed and the element is sized in CSS, so the layout holds
      // its space before the web font loads.
      const cellW = width / COLS;
      const cellH = height / ROWS;
      let row = 0;
      let col = 0;
      for (let i = 0; i < source.length; i++) {
        const c = source[i] ?? " ";
        if (c === "\n") {
          row++;
          col = 0;
          continue;
        }
        const th = thresholds[i] ?? 0;
        let glyph = "";
        if (c !== " ") {
          if (eased >= th) glyph = c;
          else if (eased > th - 0.18)
            glyph = NOISE[(i + Math.floor(now / 60)) % NOISE.length] ?? " ";
        }
        if (glyph) ctx.fillText(glyph, col * cellW, (row + 0.5) * cellH);
        col++;
      }
    };

    let frameId = 0;
    // The latest frame is kept so a resize or font swap can repeat it instead
    // of restarting the reveal.
    let last: [number, number] = [0, -1];

    const start = performance.now() - 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2600);
      const eased = t * t * (3 - 2 * t);
      last = [now, eased];
      draw(now, eased);
      if (t < 1) frameId = requestAnimationFrame(tick);
    };

    if (reduced) {
      last = [0, 1];
      draw(0, 1);
    } else if (active) {
      tick(performance.now());
    } else {
      draw(0, -1);
    }

    const observer = new ResizeObserver(() => draw(...last));
    observer.observe(canvas);

    let cancelled = false;
    // Text drawn before the web font arrives uses the fallback font's metrics.
    void document.fonts.ready.then(() => {
      if (!cancelled) draw(...last);
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      cancelled = true;
    };
  }, [thresholds, reduced, active]);

  return (
    <div className="ascii-portrait-box">
      <canvas
        ref={ref}
        role="img"
        aria-label="ASCII portrait of Mathews Shaji"
        className="ascii-portrait-art select-none font-mono text-foreground/70"
      />
    </div>
  );
}

export function RevealText({ children, active }: { children: string; active: boolean }) {
  return (
    <span className={`content-reveal${active ? " content-reveal--active" : ""}`}>{children}</span>
  );
}
