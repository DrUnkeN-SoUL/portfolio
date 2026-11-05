import { useEffect, useLayoutEffect, useRef } from "react";

const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
};

const NAME = "MATHEWS SHAJI";
const ROWS = 7;

// Timing orchestrator (in ms)
const BUILD_START = 300;
const BUILD_END = 2100;
const INVERT_START = 2250;
const INVERT_DURATION = 700; // Silky 700ms smooth gradient transition
const INVERT_END = INVERT_START + INVERT_DURATION; // 2950ms
const DOCK_START = 3100;
const DOCK_DURATION = 850;
const FINISH_AT = 4100;

// Smooth exit duration
const EXIT_DURATION = 600;

function buildColumns(text: string) {
  const columns: number[][] = [];
  for (const character of text) {
    if (character === " ") {
      for (let i = 0; i < 3; i++) columns.push(Array(ROWS).fill(0));
      continue;
    }
    const glyph = FONT[character];
    if (!glyph) continue;
    for (let column = 0; column < 5; column++) {
      columns.push(glyph.map((row) => (row[column] === "1" ? 1 : 0)));
    }
    columns.push(Array(ROWS).fill(0));
  }
  return columns;
}

const COLUMNS = buildColumns(NAME);
const DOCK_CELL = 1.7;

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInOutQuad(value: number): number {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

export function IntroName({
  onComplete,
  onTransitionStart,
}: {
  onComplete: () => void;
  onTransitionStart?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    if (!canvas || !overlay || !backdrop) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      completedRef.current = true;
      onComplete();
      return;
    }

    const context = canvas.getContext("2d");
    const mosaic = mosaicRef.current;
    const mosaicContext = mosaic?.getContext("2d");
    if (!context || !mosaic || !mosaicContext) {
      completedRef.current = true;
      onComplete();
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let exitTimer = 0;
    let start = 0;

    const startExit = (skip = false) => {
      if (leavingRef.current || completedRef.current) return;
      leavingRef.current = true;
      cancelAnimationFrame(frameId);
      if (skip) overlay.classList.add("intro-loader--skipping");
      overlay.classList.add("intro-loader--leaving");
      onTransitionStart?.();

      exitTimer = window.setTimeout(() => {
        completedRef.current = true;
        cancelAnimationFrame(frameId);
        onComplete();
      }, EXIT_DURATION);
    };

    const skipIntro = () => startExit(true);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      mosaic.width = canvas.width;
      mosaic.height = canvas.height;
      mosaic.style.width = `${width}px`;
      mosaic.style.height = `${height}px`;
      mosaicContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      // Reveal solid dark tiles only during the original colour-change interval.
      let invertProgress = 0;
      if (elapsed >= INVERT_END) {
        invertProgress = 1;
      } else if (elapsed > INVERT_START) {
        const rawProgress = (elapsed - INVERT_START) / INVERT_DURATION;
        invertProgress = easeInOutCubic(Math.max(0, Math.min(1, rawProgress)));
      }

      const paper = "rgb(248, 248, 248)";
      const ink = "rgb(15, 15, 15)";
      const background = invertProgress === 1 ? ink : paper;
      const foreground = invertProgress === 1 ? paper : ink;

      const dockRaw = Math.max(0, Math.min(1, (elapsed - DOCK_START) / DOCK_DURATION));
      const dockEase = easeInOutQuad(dockRaw);

      // Fade the backdrop separately at the end so the docked name stays solid.
      backdrop.style.backgroundColor = background;
      context.clearRect(0, 0, width, height);

      // Calculate dock targets
      const dock = document.querySelector<HTMLElement>("[data-name-dock]");
      const dockRect = dock?.getBoundingClientRect();
      const dockX = dockRect?.left ?? (width >= 768 ? 40 : 20);
      const dockY = dockRect?.top ?? 24;

      const largeCell = Math.max(4, Math.min(15, Math.floor((width * 0.88) / COLUMNS.length)));
      const smallCell = DOCK_CELL;
      const largeWidth = COLUMNS.length * largeCell;
      const startX = (width - largeWidth) / 2;
      const startY = (height - ROWS * largeCell) / 2;

      const cell = largeCell + (smallCell - largeCell) * dockEase;
      const x = startX + (dockX - startX) * dockEase;
      const y = startY + (dockY - startY) * dockEase;

      // Keep the published dissolve, using smaller square pixels.
      const tile = largeCell * 2;
      const originX = Math.floor(startX);
      const originY = Math.floor(startY);
      const isDark = (column: number, row: number) => {
        const seed = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
        return (
          invertProgress >= 1 || (invertProgress > 0 && invertProgress > seed - Math.floor(seed))
        );
      };
      mosaicContext.clearRect(0, 0, width, height);
      if (invertProgress > 0 && invertProgress < 1) {
        mosaicContext.fillStyle = ink;
        for (let row = Math.floor(-originY / tile); row * tile + originY < height; row++) {
          for (
            let column = Math.floor(-originX / tile);
            column * tile + originX < width;
            column++
          ) {
            if (isDark(column, row)) {
              const left = Math.round((originX + column * tile) * dpr) / dpr;
              const top = Math.round((originY + row * tile) * dpr) / dpr;
              const right = Math.round((originX + (column + 1) * tile) * dpr) / dpr;
              const bottom = Math.round((originY + (row + 1) * tile) * dpr) / dpr;
              mosaicContext.fillRect(left, top, right - left, bottom - top);
            }
          }
        }
      }

      // Draw the pixel letters
      context.fillStyle = foreground;
      for (let column = 0; column < COLUMNS.length; column++) {
        const settleAt =
          BUILD_START + (column / Math.max(COLUMNS.length - 1, 1)) * (BUILD_END - BUILD_START);
        const settled = elapsed >= settleAt;
        const columnData = COLUMNS[column] ?? [];

        if (settled) {
          for (let row = 0; row < ROWS; row++) {
            if (columnData[row]) {
              context.fillStyle = isDark(
                Math.floor((x + column * cell + cell / 2 - originX) / tile),
                Math.floor((y + row * cell + cell / 2 - originY) / tile),
              )
                ? paper
                : ink;
              context.fillRect(
                x + column * cell,
                y + row * cell,
                Math.max(1, cell - 1),
                Math.max(1, cell - 1),
              );
            }
          }
        } else if (elapsed > settleAt - 650) {
          const pulse = Math.abs(Math.sin(column * 12.9898 + Math.floor(elapsed / 55) * 0.73));
          const barHeight = 1 + Math.floor(pulse * ROWS);
          context.globalAlpha = 0.18 + pulse * 0.42;
          for (let row = ROWS - barHeight; row < ROWS; row++) {
            context.fillRect(
              x + column * cell,
              y + row * cell,
              Math.max(1, cell - 1),
              Math.max(1, cell - 1),
            );
          }
          context.globalAlpha = 1;
        }
      }

      // Subtle atmospheric ASCII dust, fading out smoothly during inversion
      if (!dockRaw && invertProgress < 1) {
        context.font = "10px 'JetBrains Mono', monospace";
        context.fillStyle = foreground;
        const dustCount = Math.min(120, Math.floor((width * height) / 9000));
        const fadeMultiplier = 1 - invertProgress;

        for (let i = 0; i < dustCount; i++) {
          const seed = Math.sin(i * 91.7 + Math.floor(elapsed / 90) * 0.08);
          const px = Math.abs(Math.sin(i * 47.3)) * width;
          const py = Math.abs(Math.cos(i * 31.1)) * height;
          context.globalAlpha = Math.abs(seed) * 0.12 * fadeMultiplier;
          context.fillText([".", ",", "+", "="][i % 4] ?? ".", px, py);
        }
        context.globalAlpha = 1;
      }

      // Automatically trigger smooth departure when sequence finishes
      if (elapsed >= FINISH_AT) {
        startExit();
        return;
      }

      if (!completedRef.current && !leavingRef.current) {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    overlay.addEventListener("click", skipIntro);
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(exitTimer);
      window.removeEventListener("resize", resize);
      overlay.removeEventListener("click", skipIntro);
    };
  }, [onComplete, onTransitionStart]);

  return (
    <div ref={overlayRef} className="intro-loader" aria-hidden="true">
      <div ref={backdropRef} className="intro-loader__backdrop">
        <canvas ref={mosaicRef} />
      </div>
      <canvas ref={canvasRef} />
      <span className="sr-only">Mathews Shaji</span>
    </div>
  );
}

export function PixelNameMark({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = COLUMNS.length * DOCK_CELL;
  const height = ROWS * DOCK_CELL;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgb(248, 248, 248)";

    for (let column = 0; column < COLUMNS.length; column++) {
      const columnData = COLUMNS[column] ?? [];
      for (let row = 0; row < ROWS; row++) {
        if (columnData[row]) {
          context.fillRect(
            column * DOCK_CELL,
            row * DOCK_CELL,
            Math.max(1, DOCK_CELL - 1),
            Math.max(1, DOCK_CELL - 1),
          );
        }
      }
    }
  }, [height, width]);

  return (
    <canvas
      ref={canvasRef}
      data-name-dock
      className={`block shrink-0 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ width, height }}
      aria-label="Mathews Shaji"
      role="img"
    />
  );
}
