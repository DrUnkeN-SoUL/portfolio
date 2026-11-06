import { useEffect, useMemo, useRef, useState } from "react";
import { asciiPortraitDesktop } from "@/data/ascii-portrait";

const NOISE = "´°¬¤iósc/=+,.x";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Progressive per-character reveal: every glyph gets a random "arrival time",
 * biased slightly by its row so the portrait resolves out of noise top-down.
 */
function useAsciiReveal(source: string, active: boolean, duration = 2600) {
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = useState(source);
  const rafRef = useRef<number | null>(null);

  const { chars, thresholds, rows } = useMemo(() => {
    const lines = source.split("\n");
    const rowCount = Math.max(lines.length, 1);
    const flat = source.split("");
    const th = new Float32Array(flat.length);
    let row = 0;
    for (let i = 0; i < flat.length; i++) {
      if (flat[i] === "\n") row++;
      const rowBias = (row / rowCount) * 0.45;
      th[i] = Math.min(0.999, rowBias + Math.random() * 0.7);
    }
    return { chars: flat, thresholds: th, rows: rowCount };
  }, [source]);

  useEffect(() => {
    if (reduced) {
      setFrame(source);
      return;
    }
    if (!active) {
      setFrame(source.replace(/[^\n ]/g, " "));
      return;
    }
    const start = performance.now() - 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * t * (3 - 2 * t);
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i] ?? " ";
        const th = thresholds[i] ?? 0;
        if (c === "\n" || c === " ") {
          out += c;
        } else if (eased >= th) {
          out += c;
        } else if (eased > th - 0.18) {
          out += NOISE[(i + Math.floor(now / 60)) % NOISE.length] ?? " ";
        } else {
          out += " ";
        }
      }
      setFrame(out);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    tick(performance.now());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [chars, thresholds, rows, source, duration, reduced, active]);

  return !active && !reduced ? source.replace(/[^\n ]/g, " ") : frame;
}

function Frame({
  source,
  className,
  active,
}: {
  source: string;
  className: string;
  active: boolean;
}) {
  const text = useAsciiReveal(source, active);
  return (
    <pre
      aria-hidden="true"
      className={`ascii-frame select-none whitespace-pre font-mono text-foreground/70 ${className}`}
    >
      {text}
    </pre>
  );
}

export function AsciiPortrait({ active = true }: { active?: boolean }) {
  return (
    <div className="ascii-portrait-box">
      <Frame source={asciiPortraitDesktop} className="ascii-portrait-art" active={active} />
      <span className="sr-only">ASCII portrait of Mathews Shaji</span>
    </div>
  );
}

export function RevealText({ children, active }: { children: string; active: boolean }) {
  return (
    <span className={`content-reveal${active ? " content-reveal--active" : ""}`}>{children}</span>
  );
}
